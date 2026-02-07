import type { TopicsMap } from "../core/types";
import { isTopicBucket } from "./shared";

export function isSessionInitPayload(payload: unknown): payload is {
  sessionId: string;
  topics: TopicsMap;
} {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  if (typeof p.sessionId !== "string") return false;
  if (typeof p.topics !== "object" || p.topics === null) return false;
  return Object.values(p.topics as Record<string, unknown>).every(
    isTopicBucket,
  );
}
