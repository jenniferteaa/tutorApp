import { BACKEND_BASE_URL } from "../constants";
import { extractErrorMessage, fetchJsonWithTimeout } from "../../helpers/httpClient";

export async function handleAskAway(payload: {
  sessionId: string;
  action: string;
  rollingHistory: string[];
  summary: string;
  query: string;
  language: string;
}) {
  console.debug("VibeTutor: ask-anything payload received");
  const data = await forwardCodeToBackend(
    payload.sessionId,
    payload.action ?? "ask-anything",
    payload.rollingHistory,
    payload.summary,
    payload.query,
    payload.language,
  );
  return data;
}

async function forwardCodeToBackend(
  sessionId: string,
  action: string,
  rollingHistory: string[],
  summary: string,
  query: string,
  language: string,
) {
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    reply?: unknown;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/llm/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      action,
      rollingHistory,
      summary,
      query,
      language,
    }),
  });

  if (!result.success) return result;
  if (result.data?.success === false) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Ask failed"),
    };
  }
  return {
    success: true,
    reply: typeof result.data?.reply === "string" ? result.data.reply : "",
  };
}
