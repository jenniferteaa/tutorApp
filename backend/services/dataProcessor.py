from __future__ import annotations

from typing import Iterable

import Levenshtein

from models import RollingStateGuideMode


def _normalize_topic_note(note: str) -> str:
    return " ".join(note.lower().split())


def _iter_topic_notes(
    rolling_state: RollingStateGuideMode, topic: str
) -> Iterable[str]:
    notes = rolling_state.topics.get(topic)
    if not notes:
        return []
    return notes


def is_similar_topic_note(
    rolling_state: RollingStateGuideMode,
    topic: str,
    note: str,
    *,
    threshold: float = 0.85,
) -> bool:
    """
    Return True if `note` is similar to any existing note in the given topic.
    Uses Levenshtein ratio for fuzzy matching.
    """
    candidate = _normalize_topic_note(note)
    if not candidate:
        return False

    for existing in _iter_topic_notes(rolling_state, topic):
        existing_norm = _normalize_topic_note(existing)
        if not existing_norm:
            continue
        if Levenshtein.ratio(candidate, existing_norm) >= threshold:
            return True
    return False

def processingSimilarInputTopic(
    rolling_state: RollingStateGuideMode,
    topicNotes: dict[str, list[str]] | dict[str, str],
    *,
    threshold: float = 0.85,
):
    """
    Return True if any incoming topic note is similar to an existing note
    under the same topic in rolling_state.
    """
    if not topicNotes:
        return False

    for topic, raw_notes in topicNotes.items():
        notes: list[str]
        if isinstance(raw_notes, list):
            notes = [note for note in raw_notes if isinstance(note, str)]
        elif isinstance(raw_notes, str):
            notes = [raw_notes]
        else:
            continue

        for note in notes:
            if is_similar_topic_note(
                rolling_state,
                topic,
                note,
                threshold=threshold,
            ):
                return True

    return False
    

def processingSimilarInputNudges(
    rolling_state: RollingStateGuideMode,
    nudges: dict[str, str] | list[str] | str,
    *,
    threshold: float = 0.85,
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
