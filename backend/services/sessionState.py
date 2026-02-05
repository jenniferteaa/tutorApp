import os
from typing import Any, cast

from models import TopicNotes
from services.dataProcessor import processingSimilarInputTopic
from services.redisClient import get_json, rkey, set_json


SESSION_STATE_TTL_SECONDS = int(os.getenv("SESSION_STATE_TTL_SECONDS", "57600"))
SESSION_STATE_PREFIX = "session:topics"
DEFAULT_SIMILARITY_THRESHOLD = 0.70


def _normalize_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]
    if isinstance(value, str):
        cleaned = value.strip()
        return [cleaned] if cleaned else []
    return []


def _normalize_topics(
    topics: dict[str, Any] | None,
) -> dict[str, dict[str, list[str]]]:
    normalized: dict[str, dict[str, list[str]]] = {}
    if not topics:
        return normalized
    for topic, raw in topics.items():
        if not isinstance(topic, str) or not topic.strip():
            continue
        if isinstance(raw, TopicNotes):
            raw = raw.dict()
        elif hasattr(raw, "dict") and callable(getattr(raw, "dict")):
            raw = raw.dict()
        if not isinstance(raw, dict):
            continue
        thoughts = _normalize_list(raw.get("thoughts_to_remember"))
        pitfalls = _normalize_list(raw.get("pitfalls"))
        if thoughts or pitfalls:
            normalized[topic] = {
                "thoughts_to_remember": thoughts,
                "pitfalls": pitfalls,
            }
    return normalized


def _merge_state(
    state: dict[str, Any],
    incoming: dict[str, dict[str, list[str]]],
) -> dict[str, Any]:
    for topic, payload in incoming.items():
        if not isinstance(payload, dict):
            continue
        existing = state.get(topic)
        if not isinstance(existing, dict):
            existing = {"thoughts_to_remember": [], "pitfalls": []}
        for key in ("thoughts_to_remember", "pitfalls"):
            existing_list = (
                existing.get(key) if isinstance(existing.get(key), list) else []
            )
            if not isinstance(existing_list, list):
                existing_list = []
            items = payload.get(key)
            if not isinstance(items, list):
                items = []
            for item in items:
                if isinstance(item, str) and item and item not in existing_list:
                    existing_list.append(item)
            existing[key] = existing_list
        state[topic] = existing
    return state


def init_session_state(
    user_id: str,
    session_id: str,
    topics: dict[str, Any] | None,
    *,
    threshold: float = DEFAULT_SIMILARITY_THRESHOLD,
) -> None:
    if not user_id or not session_id:
        return
    incoming = _normalize_topics(topics)
    if not incoming:
        return
    key = rkey(SESSION_STATE_PREFIX, user_id, session_id)
    state = get_json(key) or {}
    deduped = processingSimilarInputTopic(
        cast(dict[str, dict[str, list[str] | str]], incoming),
        state,
        threshold=threshold,
    )
    if deduped is True or not deduped:
        if state:
            set_json(key, state, ex=SESSION_STATE_TTL_SECONDS)
        return
    _merge_state(state, deduped)
    set_json(key, state, ex=SESSION_STATE_TTL_SECONDS)


def dedupe_and_update_session_state(
    user_id: str,
    session_id: str,
    topics: dict[str, Any] | None,
    *,
    threshold: float = DEFAULT_SIMILARITY_THRESHOLD,
) -> dict[str, dict[str, list[str]]]:
    if not user_id or not session_id:
        return {}
    incoming = _normalize_topics(topics)
    if not incoming:
        return {}
    key = rkey(SESSION_STATE_PREFIX, user_id, session_id)
    state = get_json(key) or {}
    deduped = processingSimilarInputTopic(
        cast(dict[str, dict[str, list[str] | str]], incoming),
        state,
        threshold=threshold,
    )
    if deduped is True or not deduped:
        if state:
            set_json(key, state, ex=SESSION_STATE_TTL_SECONDS)
        return {}
    _merge_state(state, deduped)
    set_json(key, state, ex=SESSION_STATE_TTL_SECONDS)
    return deduped
