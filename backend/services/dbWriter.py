from __future__ import annotations
import os
from dataclasses import dataclass
from datetime import datetime, timezone, date
from typing import Any
import requests
from dotenv import load_dotenv

from services.sessionState import dedupe_and_update_session_state

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL","")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY","")

_GUIDE_BUFFER: list[dict[str, Any]] = []
_DB_WRITE_IN_FLIGHT = False
_RETRY_SCHEDULED = False


def _topic_counts(topics: Any) -> tuple[int, int, int]:
    total_topics = len(topics) if isinstance(topics, dict) else 0
    total_thoughts = 0
    total_pitfalls = 0
    if not isinstance(topics, dict):
        return total_topics, total_thoughts, total_pitfalls
    for payload in topics.values():
        if not isinstance(payload, dict):
            continue
        thoughts = payload.get("thoughts_to_remember")
        pitfalls = payload.get("pitfalls")
        if isinstance(thoughts, list):
            total_thoughts += len([t for t in thoughts if isinstance(t, str) and t.strip()])
        elif isinstance(thoughts, str) and thoughts.strip():
            total_thoughts += 1
        if isinstance(pitfalls, list):
            total_pitfalls += len([p for p in pitfalls if isinstance(p, str) and p.strip()])
        elif isinstance(pitfalls, str) and pitfalls.strip():
            total_pitfalls += 1
    return total_topics, total_thoughts, total_pitfalls


def _normalize_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]
    if isinstance(value, str):
        cleaned = value.strip()
        return [cleaned] if cleaned else []
    return []


def _discarded_items(incoming: list[str], kept: list[str]) -> list[str]:
    kept_counts: dict[str, int] = {}
    for item in kept:
        key = item.strip()
        if not key:
            continue
        kept_counts[key] = kept_counts.get(key, 0) + 1

    discarded: list[str] = []
    for item in incoming:
        key = item.strip()
        if not key:
            continue
        if kept_counts.get(key, 0) > 0:
            kept_counts[key] -= 1
        else:
            discarded.append(key)
    return discarded


def _log_discarded(incoming_topics: Any, kept_topics: Any) -> None:
    if not isinstance(incoming_topics, dict):
        return
    max_items = 6
    for topic, payload in incoming_topics.items():
        if not isinstance(payload, dict):
            continue
        kept_payload = (
            kept_topics.get(topic) if isinstance(kept_topics, dict) else None
        )
        kept_payload = kept_payload if isinstance(kept_payload, dict) else {}

        incoming_thoughts = _normalize_list(payload.get("thoughts_to_remember"))
        incoming_pitfalls = _normalize_list(payload.get("pitfalls"))
        kept_thoughts = _normalize_list(kept_payload.get("thoughts_to_remember"))
        kept_pitfalls = _normalize_list(kept_payload.get("pitfalls"))

        discarded_thoughts = _discarded_items(incoming_thoughts, kept_thoughts)
        discarded_pitfalls = _discarded_items(incoming_pitfalls, kept_pitfalls)

        if not discarded_thoughts and not discarded_pitfalls:
            continue

        parts: list[str] = []
        if discarded_thoughts:
            # print("55555757%%%%%%%%%%%%gkhl%%%%%%%%%%%%%%%%%%%%%%%%%%%68768979")
            shown = discarded_thoughts[:max_items]
            suffix = (
                f" (+{len(discarded_thoughts) - max_items} more)"
                if len(discarded_thoughts) > max_items
                else ""
            )
            parts.append(f"thoughts_discarded={shown}{suffix}")
        if discarded_pitfalls:
            # print("55555757%%%%%%%%%%%%gkhl%%%%%%%%%%%%%%%%%%%%%%%%%%%68768979")
            shown = discarded_pitfalls[:max_items]
            suffix = (
                f" (+{len(discarded_pitfalls) - max_items} more)"
                if len(discarded_pitfalls) > max_items
                else ""
            )
            parts.append(f"pitfalls_discarded={shown}{suffix}")
        print(f"dbWriter: dedupe discarded topic='{topic}' " + " ".join(parts))


@dataclass(frozen=True)
class SupabaseCfg:
    url: str
    service_role_key: str


def _sb_headers(cfg: SupabaseCfg) -> dict[str, str]:
    return {
        "Content-Type": "application/json",
        "apikey": cfg.service_role_key,
        "Authorization": f"Bearer {cfg.service_role_key}",
    }


def _upsert_one(cfg: SupabaseCfg, table: str, row: dict[str, Any], on_conflict: str) -> dict[str, Any]:
    r = requests.post(
        f"{cfg.url}/rest/v1/{table}",
        params={"on_conflict": on_conflict},
        headers={**_sb_headers(cfg), "Prefer": "resolution=merge-duplicates,return=representation"},
        json=row,
        timeout=10,
    )
    r.raise_for_status()
    data = r.json()
    if not data or not isinstance(data, list):
        raise RuntimeError(f"Upsert {table} returned no row: {data}")
    return data[0]


def _insert_one(cfg: SupabaseCfg, table: str, row: dict[str, Any]) -> dict[str, Any]:
    r = requests.post(
        f"{cfg.url}/rest/v1/{table}",
        headers={**_sb_headers(cfg), "Prefer": "return=representation"},
        json=row,
        timeout=10,
    )
    r.raise_for_status()
    data = r.json()
    if not data or not isinstance(data, list):
        raise RuntimeError(f"Insert {table} returned no row: {data}")
    return data[0]


def write_checkmode_result_v2(
    user_id: str | None,
    session_id: str,
    problem_no: int,
    problem_name: str,
    problem_url: str,
    topics: dict[str, dict[str, list[str]]],  # LLM "topics" section
    response_text: str,
    date_touched: date | None = None,
    origin: str | None = None,
) -> None:
    """
    Schema assumptions (column names can be adjusted):
      - problems:  id, problem_no UNIQUE, problem_name, problem_link
      - topics:    id, topic_name UNIQUE
      - activity:  id, user_id, problem_id, date_touched,
                  UNIQUE(user_id, problem_id, date_touched)
      - notes:     id, activity_id, note, created_at
      - note_topics: note_id, topic_id, UNIQUE(note_id, topic_id)
      - topic_notes: note_id, topic_id, note_made, pitfalls, UNIQUE(note_id, topic_id)
    """
    print("entering to write to the db :\n")
    if not user_id or not response_text:
        return
    incoming_topics = topics
    print("This is the incoming topics: \n", incoming_topics)
    print()
    # if topics and origin == "checkmode":
    #     print("this is the topics: ",topics)
    #     in_topics, in_thoughts, in_pitfalls = _topic_counts(topics) #getting the count of total topics, total thoughts and total pitfalls
    #     print(
    #         "dbWriter: incoming topics="
    #         f"{in_topics} thoughts={in_thoughts} pitfalls={in_pitfalls} "
    #         f"user={user_id} session={session_id}"
    #     )
    if topics:
        print("Topics received")
        print()
        deduped_topics = dedupe_and_update_session_state(
            user_id,
            session_id,
            topics,
        )
        if not deduped_topics:
            _log_discarded(incoming_topics, {})
            print(
                "dbWriter: dedupe removed all topics, skipping write "
                f"user={user_id} session={session_id}"
            )
            return
        topics = deduped_topics
        print("these are the deduped topics: ", deduped_topics)
        print()
        _log_discarded(incoming_topics, topics)
        out_topics, out_thoughts, out_pitfalls = _topic_counts(topics)
        print(
            "dbWriter: dedupe kept topics="
            f"{out_topics} thoughts={out_thoughts} pitfalls={out_pitfalls} "
            f"user={user_id} session={session_id}"
        )
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        return

    cfg = SupabaseCfg(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    touched = (date_touched or datetime.now(timezone.utc).date()).isoformat()

    # 1) problem upsert
    problem = _upsert_one(
        cfg,
        table="problems",
        row={"problem_no": problem_no, "problem_name": problem_name, "problem_link": problem_url},
        on_conflict="problem_no",
    )
    problem_id = problem["id"]

    # 2) activity upsert
    activity = _upsert_one(
        cfg,
        table="activity",
        row={"user_id": user_id, "problem_id": problem_id, "date_touched": touched},
        on_conflict="user_id,problem_id,date_touched",
    )
    activity_id = activity["id"]

    # 3) insert ONE notes row for this check-mode run
    note = _insert_one(
        cfg,
        table="notes",
        row={
            "activity_id": activity_id,
            "note": response_text,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    )
    note_id = note["id"]

    # 4) upsert topics + link + upsert topic_notes
    for topic_name, payload in (topics or {}).items():
        if not isinstance(topic_name, str) or not topic_name.strip():
            continue

        topic = _upsert_one(
            cfg,
            table="topics",
            row={"topic_name": topic_name},
            on_conflict="topic_name",
        )
        topic_id = topic["id"]

        thoughts = payload.get("thoughts_to_remember") or []
        pitfalls = payload.get("pitfalls") or []

        # link note -> topic
        _upsert_one(
            cfg,
            table="note_topics",
            row={"note_id": note_id, "topic_id": topic_id},
            on_conflict="note_id,topic_id",
        )

        # store per-topic content for querying
        _upsert_one(
            cfg,
            table="topic_notes",
            row={
                "note_id": note_id,
                "topic_id": topic_id,
                "note_made": thoughts,
                "pitfalls": pitfalls,
            },
            on_conflict="note_id,topic_id",
        )

def is_db_write_in_flight() -> bool:
    return _DB_WRITE_IN_FLIGHT

def buffer_guide_write(payload: dict[str, Any]) -> None:
    _GUIDE_BUFFER.append(payload)
    flush_guide_buffer()

def flush_guide_buffer() -> None:
    global _DB_WRITE_IN_FLIGHT, _RETRY_SCHEDULED
    if _DB_WRITE_IN_FLIGHT:
        if not _RETRY_SCHEDULED:
            _RETRY_SCHEDULED = True
            import threading
            threading.Timer(0.5, _retry_flush).start()
        return
    while _GUIDE_BUFFER:
        payload = _GUIDE_BUFFER.pop(0)
        _DB_WRITE_IN_FLIGHT = True
        try:
            write_checkmode_result_v2(**payload)
        finally:
            _DB_WRITE_IN_FLIGHT = False

def _retry_flush() -> None:
    global _RETRY_SCHEDULED
    _RETRY_SCHEDULED = False
    flush_guide_buffer()
