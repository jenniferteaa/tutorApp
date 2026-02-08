import type { RollingStateGuideMode, TopicsMap } from "../core/types";
import { isTopicBucket } from "./shared";

export function isGuideModePayload(payload: unknown): payload is {
  sessionId: string;
  action: string;
  problem: string;
  topics: TopicsMap;
  code: string;
  focusLine: string;
  language: string;
  rollingStateGuideMode: RollingStateGuideMode;
} {
  if (typeof payload !== "object" || payload === null) return false;

  const p = payload as Record<string, unknown>;

  if (typeof p.sessionId !== "string") return false;
  if (typeof p.action !== "string") return false;
  if (typeof p.problem !== "string") return false;
  if (typeof p.code !== "string") return false;
  if (typeof p.focusLine !== "string") return false;
  if (typeof p.language !== "string") return false;

  if (typeof p.topics !== "object" || p.topics === null) return false;

  return Object.values(p.topics as Record<string, unknown>).every(
    isTopicBucket,
  );
}

export function isGuideModeStatusPayload(payload: unknown): payload is {
  enabled: boolean;
  sessionId: string;
  problem_no: number | null;
  problem_name: string;
  problem_url: string;
} {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  if (typeof p.enabled !== "boolean") return false;
  if (typeof p.sessionId !== "string") return false;
  if (
    !("problem_no" in p) ||
    (p.problem_no !== null && typeof p.problem_no !== "number")
  )
    return false;
  if (typeof p.problem_name !== "string") return false;
  if (typeof p.problem_url !== "string") return false;
  return true;
}
