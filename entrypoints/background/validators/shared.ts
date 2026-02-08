import type { TopicBucket } from "../core/types";

export function isSaveNotesPayload(
  payload: unknown,
): payload is { notes: unknown[] } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    Array.isArray((payload as { notes?: unknown[] }).notes)
  );
}

export function isTopicBucket(value: unknown): value is TopicBucket {
  if (typeof value !== "object" || value === null) return false;

  const v = value as Record<string, unknown>; // tofix-> instead of unknown here, try to define some structure

  return (
    Array.isArray(v.thoughts_to_remember) &&
    v.thoughts_to_remember.every((x) => typeof x === "string") &&
    Array.isArray(v.pitfalls) &&
    v.pitfalls.every((x) => typeof x === "string")
  );
}
