import { BACKEND_BASE_URL } from "../constants";
import { extractErrorMessage, fetchJsonWithTimeout } from "../../helpers/httpClient";

export async function handleSummarize(payload: {
  sessionID: string;
  summarize: string[];
  summary: string;
}) {
  //console.debug("VibeTutor: summarize payload received");
  const data = await forwardSummaryToBackend(
    payload.sessionID,
    payload.summarize,
    payload.summary,
  );
  return data;
}

async function forwardSummaryToBackend(
  sessionID: string,
  summarize: string[],
  summary: string,
) {
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    reply?: unknown;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/llm/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionID, summarize, summary }),
  });
  if (!result.success) return result;
  if (result.data?.success === false) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Summarize failed"),
    };
  }
  return {
    success: true,
    reply: typeof result.data?.reply === "string" ? result.data.reply : "",
  };
}
