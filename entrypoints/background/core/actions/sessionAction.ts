import { BACKEND_BASE_URL } from "../constants";
import type { TopicsMap } from "../types";
import { getAuthState } from "../../helpers/authStore";
import { extractErrorMessage, fetchJsonWithTimeout } from "../../helpers/httpClient";

export async function handleSessionInit(payload: {
  sessionId: string;
  topics: TopicsMap;
}) {
  const auth = await getAuthState();
  if (!auth?.jwt) {
    return { success: false, error: "Unauthorized" };
  }
  return forwardSessionInit(payload, auth.jwt);
}

async function forwardSessionInit(
  payload: {
    sessionId: string;
    topics: TopicsMap;
  },
  token: string,
) {
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/session/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!result.success) return result;
  if (result.data?.success === false) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Session init failed"),
    };
  }
  return { success: true };
}
