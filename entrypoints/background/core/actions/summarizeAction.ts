import { BACKEND_BASE_URL } from "../constants";
import { getAuthState } from "../../helpers/authStore";
import { extractErrorMessage, fetchJsonWithTimeout } from "../../helpers/httpClient";

export async function handleSummarize(payload: {
  sessionID: string;
  summarize: string[];
  summary: string;
}) {
  //console.debug("VibeTutor: summarize payload received");
  const auth = await getAuthState();
  if (!auth?.jwt) {
    return { success: false, unauthorized: true };
  }
  const data = await forwardSummaryToBackend(
    auth.jwt,
    payload.sessionID,
    payload.summarize,
    payload.summary,
  );
  return data;
}

async function forwardSummaryToBackend(
  token: string,
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
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionID, summarize, summary }),
  });
  if (!result.success) return result;
  if (result.data?.success === false) {
    const errorMessage = extractErrorMessage(result.data, "Summarize failed");
    return {
      success: false,
      status: result.status,
      error: errorMessage,
      unauthorized: /unauthorized/i.test(errorMessage),
    };
  }
  return {
    success: true,
    data: {
      reply: typeof result.data?.reply === "string" ? result.data.reply : "",
    },
  };
}
