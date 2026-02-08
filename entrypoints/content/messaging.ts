export function sendSummarizeHistory(payload: {
  sessionId: string;
  summarize: string[];
  summary: string;
}) {
  return browser.runtime.sendMessage({
    action: "summarize-history",
    payload,
  });
}

export function sendInitSessionTopics(payload: {
  sessionId: string;
  topics: Record<string, unknown>;
}) {
  return browser.runtime.sendMessage({
    action: "init-session-topics",
    payload,
  });
}

export function sendGuideMode(payload: Record<string, unknown>) {
  return browser.runtime.sendMessage({
    action: "guide-mode",
    payload,
  });
}

export function sendGuideModeStatus(payload: {
  enabled: boolean;
  sessionId: string;
  problem_no?: number | null;
  problem_name?: string;
  problem_url?: string;
}) {
  return browser.runtime.sendMessage({
    action: "guide-mode-status",
    payload,
  });
}

export function sendCheckCode(payload: Record<string, unknown>) {
  return browser.runtime.sendMessage({
    action: "check-code",
    payload,
  });
}

export function sendAskAnything(payload: Record<string, unknown>) {
  return browser.runtime.sendMessage({
    action: "ask-anything",
    payload,
  });
}

export function sendGoToWorkspace(payload: { url: string }) {
  return browser.runtime.sendMessage({
    action: "go-to-workspace",
    payload,
  });
}

export function sendSupabaseLogin(payload: { email: string; password: string }) {
  return browser.runtime.sendMessage({
    action: "supabase-login",
    payload,
  });
}

export function sendSupabaseSignup(payload: {
  fname: string;
  lname: string;
  email: string;
  password: string;
}) {
  return browser.runtime.sendMessage({
    action: "supabase-signup",
    payload,
  });
}

export function sendGetMonacoCode() {
  return browser.runtime.sendMessage({ type: "GET_MONACO_CODE" });
}
