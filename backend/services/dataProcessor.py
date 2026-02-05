from __future__ import annotations

from typing import Iterable

import Levenshtein
from models import RollingStateGuideMode, TopicNotes


def _normalize_topic_note(note: str) -> str:
    return " ".join(note.lower().split())


def _iter_topic_notes(topic: str, topics: dict[str, TopicNotes]
) -> Iterable[str]:
    notes = topics.get(topic)
    if not notes:
        return []
    if isinstance(notes, dict):
        thoughts = notes.get("thoughts_to_remember") or []
        pitfalls = notes.get("pitfalls") or []
    else:
        thoughts = notes.thoughts_to_remember
        pitfalls = notes.pitfalls
    return [
        note
        for note in [*thoughts, *pitfalls]
        if isinstance(note, str) and note
    ]

# if is_similar_topic_note(
#                 rolling_state,
#                 topic,
#                 topics,
#                 note,
#                 threshold=threshold,
#             ):


def is_similar_topic_note(
    topic: str,
    topics: dict[str, TopicNotes],
    note: str,
    *,
    threshold: float = 0.60,
) -> bool:
    """
    Return True if `note` is similar to any existing note in the given topic.
    Uses Levenshtein ratio for fuzzy matching.
    """
    candidate = _normalize_topic_note(note)
    if not candidate:
        return False

    for existing in _iter_topic_notes(topic, topics):
        existing_norm = _normalize_topic_note(existing)
        if not existing_norm:
            continue
        if Levenshtein.ratio(candidate, existing_norm) >= threshold:
            return True
    return False

def processingSimilarInputTopic(
    topicNotes: dict[str, dict[str, list[str] | str]] | dict[str, str],
    topics: dict[str, TopicNotes],
    *,
    threshold: float = 0.60,
):
    """
    Return True if all incoming topic notes are duplicates.
    Otherwise return a deduped topics object with only new notes.
    """
    if not topicNotes:
        return True

    deduped: dict[str, dict[str, list[str]]] = {}

    for topic, raw_notes in topicNotes.items():
        notes: dict[str, list[str]] = {
            "thoughts_to_remember": [],
            "pitfalls": [],
        }

        if not isinstance(raw_notes, dict):
            continue

        thoughts = raw_notes.get("thoughts_to_remember")
        pitfalls = raw_notes.get("pitfalls")

        if isinstance(thoughts, list):
            notes["thoughts_to_remember"].extend(
                note for note in thoughts if isinstance(note, str)
            )
        elif isinstance(thoughts, str):
            notes["thoughts_to_remember"].append(thoughts)

        if isinstance(pitfalls, list):
            notes["pitfalls"].extend(
                note for note in pitfalls if isinstance(note, str)
            )
        elif isinstance(pitfalls, str):
            notes["pitfalls"].append(pitfalls)

        remaining: dict[str, list[str]] = {
            "thoughts_to_remember": [],
            "pitfalls": [],
        }
        for key in ("thoughts_to_remember", "pitfalls"):
            for note in notes[key]:
                if not is_similar_topic_note(
                    topic,
                    topics,
                    note,
                    threshold=threshold,
                ):
                    remaining[key].append(note)

        if remaining["thoughts_to_remember"] or remaining["pitfalls"]:
            deduped[topic] = remaining

    return True if not deduped else deduped
    

def processingSimilarInputNudges(
    rolling_state: RollingStateGuideMode,
    nudges: dict[str, str] | list[str] | str,
    *,
    threshold: float = 0.70,
) -> bool:
    """
    Return True if any incoming nudge is similar to an existing nudge
    in rolling_state.nudges.
    """
    if not nudges:
        return False

    candidates: list[str] = []
    if isinstance(nudges, dict):
        for value in nudges.values():
            if isinstance(value, list):
                candidates.extend([item for item in value if isinstance(item, str)])
            elif isinstance(value, str):
                candidates.append(value)
    elif isinstance(nudges, list):
        candidates.extend([item for item in nudges if isinstance(item, str)])
    elif isinstance(nudges, str):
        candidates.append(nudges)

    for candidate in candidates:
        candidate_norm = _normalize_topic_note(candidate)
        if not candidate_norm:
            continue
        for existing in rolling_state.nudges:
            existing_norm = _normalize_topic_note(existing)
            if not existing_norm:
                continue
            if Levenshtein.ratio(candidate_norm, existing_norm) >= threshold:
                return True

    return False
