import { BACKEND_BASE_URL } from "../constants";
import type { TopicsMap } from "../types";
import { getAuthState } from "../../helpers/authStore";
import { extractErrorMessage, fetchJsonWithTimeout } from "../../helpers/httpClient";

export async function handleCheckCode(payload: {
  sessionId: string;
  topics: TopicsMap;
  code: string;
  action: string;
  language: string;
  problem_no: number | null;
  problem_name: string;
  problem_url: string;
}) {
  console.debug("VibeTutor: check-code payload received");
  const data = await forwardCodeForCheckMode(
    payload.sessionId,
    payload.topics,
    payload.code,
    payload.action ?? "check-code",
    payload.language,
    payload.problem_no,
    payload.problem_name,
    payload.problem_url,
  );
  return data;
}

async function forwardCodeForCheckMode(
  sessionId: string,
  topics: TopicsMap,
  code: string,
  action: string,
  language: string,
  problem_no: number | null,
  problem_name: string,
  problem_url: string,
) {
  const auth = await getAuthState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (auth?.jwt) {
    headers.Authorization = `Bearer ${auth.jwt}`;
  }
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    reply?: unknown;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/llm`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      sessionId,
      topics,
      code,
      action,
      language,
      problem_no,
      problem_name,
      problem_url,
    }),
  });
  if (!result.success) return result;
  if (result.data?.success === false) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Check mode failed"),
    };
  }
  const reply = result.data?.reply;
  if (reply && typeof reply === "object") {
    return { success: true, ...(reply as Record<string, unknown>) };
  }
  return { success: true, resp: typeof reply === "string" ? reply : "" };
}
