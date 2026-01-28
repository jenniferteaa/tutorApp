from __future__ import annotations
import os
from dataclasses import dataclass
from datetime import datetime, timezone, date
from typing import Any
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL","")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY","")

_GUIDE_BUFFER: list[dict[str, Any]] = []
_DB_WRITE_IN_FLIGHT = False
_RETRY_SCHEDULED = False


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
    if not user_id or not response_text:
        return
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
