export function isChatPayload(payload: unknown): payload is {
  sessionId: string;
  action: string;
  rollingHistory: string[];
  summary: string;
  query: string;
  language: string;
} {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const maybe = payload as {
    sessionId: string;
    action: string;
    rollingHistory: string[];
    summary?: unknown;
    query: string;
    language?: unknown;
  };
  if (typeof maybe.sessionId !== "string") return false;
  if (typeof maybe.query !== "string") return false;
  if (typeof maybe.action !== "string") return false;
  if (!Array.isArray(maybe.rollingHistory)) return false;
  if (!maybe.rollingHistory.every((entry) => typeof entry === "string")) {
    return false;
  }
  if (typeof maybe.summary !== "string") return false;
  return typeof maybe.language === "string";
}
