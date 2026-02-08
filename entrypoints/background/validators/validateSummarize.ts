export function isSummarizePayload(payload: unknown): payload is {
  sessionId: string;
  summarize: string[];
  summary: string;
} {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const maybe = payload as {
    sessionId?: unknown;
    summarize?: unknown;
    summary?: unknown;
  };
  if (typeof maybe.sessionId !== "string") return false;
  if (!Array.isArray(maybe.summarize)) return false;
  if (!maybe.summarize.every((entry) => typeof entry === "string")) {
    return false;
  }
  return typeof maybe.summary === "string";
}
