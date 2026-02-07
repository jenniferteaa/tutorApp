import { BACKEND_BASE_URL } from "../constants";
import type { RollingStateGuideMode, TopicsMap } from "../types";
import { getAuthState } from "../../helpers/authStore";
import { extractErrorMessage, fetchJsonWithTimeout } from "../../helpers/httpClient";

export async function handleGuideMode(payload: {
  sessionId: string;
  action: string;
  problem: string;
  topics: TopicsMap;
  code: string;
  focusLine: string;
  language: string;
  rollingStateGuideMode: RollingStateGuideMode;
}) {
  console.debug(
    "VibeTutor: guide-mode payload received with action: ",
    payload.action,
  );
  console.log("this is the payload at background.ts payload: ", payload);
  return forwardCodeToBackendGuideMode(
    payload.sessionId,
    payload.action,
    payload.problem,
    payload.topics,
    payload.code,
    payload.focusLine,
    payload.language,
    payload.rollingStateGuideMode,
  );
}

export async function handleGuideModeStatus(payload: {
  enabled: boolean;
  sessionId: string;
  problem_no: number | null;
  problem_name: string;
  problem_url: string;
}) {
  const auth = await getAuthState();
  if (!auth?.jwt) {
    return { success: false, error: "Unauthorized" };
  }
  return forwardGuideModeStatus(payload, auth.jwt);
}

async function forwardGuideModeStatus(
  payload: {
    enabled: boolean;
    sessionId: string;
    problem_no: number | null;
    problem_name: string;
    problem_url: string;
  },
  token: string,
) {
  const endpoint = payload.enabled ? "/api/guide/enable" : "/api/guide/disable";
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    error?: string;
  }>(`${BACKEND_BASE_URL}${endpoint}`, {
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
      error: extractErrorMessage(result.data, "Guide mode status failed"),
    };
  }
  return { success: true };
}

async function forwardCodeToBackendGuideMode(
  sessionId: string,
  action: string,
  problem: string,
  topics: TopicsMap,
  code: string,
  focusLine: string,
  language: string,
  rollingStateGuideMode: RollingStateGuideMode,
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
  }>(`${BACKEND_BASE_URL}/api/llm/guide`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      sessionId,
      action,
      problem,
      topics,
      code,
      focusLine,
      language,
      rollingStateGuideMode,
    }),
  });
  if (!result.success) return result;
  if (result.data?.success === false) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Guide mode failed"),
    };
  }
  return { success: true, ...result.data };
}
