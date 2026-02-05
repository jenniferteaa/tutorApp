type VibeTutorMessage = {
  action: string;
  payload: {
    query?: string;
    code?: string;
    action: string;
  };
};

type MessageSender = {
  tab?: {
    id?: number;
    url?: string;
    title?: string;
  };
};

export default defineBackground(() => {
  console.log("VibeTutor: background script loaded");

  browser.runtime.onInstalled.addListener(async (details: any) => {
    if (details.reason !== "install") {
      return;
    }

    console.log("VibeTutor: extension installed");
    await seedDefaultSettings();

    try {
      await browser.tabs.create({ url: "https://example.com/welcome" });
    } catch (error) {
      console.warn("VibeTutor: unable to open welcome tab", error);
    }
  });

  browser.runtime.onMessage.addListener(
    (message: VibeTutorMessage, sender: MessageSender, sendResponse: any) => {
      if ((message as { type?: string })?.type === "GET_MONACO_CODE") {
        return;
      }
      handleMessage(message)
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: String(error) }),
        );
      return true;
    },
  );

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== "GET_MONACO_CODE") return;
    if (!sender.tab?.id) {
      sendResponse({ ok: false, error: "missing tab id" });
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        world: "MAIN",
        func: () => {
          const monaco = (window as any).monaco; // added type casting
          if (!monaco?.editor) return { ok: false, error: "monaco not found" };

          const editors = monaco.editor.getEditors?.() || [];
          const editor = editors[0];
          if (editor?.getValue) {
            return { ok: true, code: editor.getValue() };
          }

          const models = monaco.editor.getModels?.() || [];
          if (models.length) {
            return { ok: true, code: models[0].getValue() };
          }

          return { ok: false, error: "no editor/model found" };
        },
      },
      (results) => {
        sendResponse(results?.[0]?.result ?? { ok: false, error: "no result" });
      },
    );

    return true;
  });

  browser.tabs.onUpdated.addListener(
    (_tabId: any, changeInfo: any, tab: any) => {
      if (changeInfo.status !== "complete" || !tab.url) {
        return;
      }

      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://")
      ) {
        return;
      }

      console.debug("VibeTutor: tab updated", tab.url);
    },
  );
});

async function seedDefaultSettings() {
  try {
    await browser.storage.local.set({
      "vibetutor-settings": {
        stealthMode: false,
        autoHide: false,
        opacity: 0.95,
        widgetPosition: { x: 20, y: 20 },
      },
      "vibetutor-notes": [],
    });
  } catch (error) {
    console.error("VibeTutor: failed to seed default settings", error);
  }
}

// async function handleMessage(message: VibeTutorMessage, sender: MessageSender) {
async function handleMessage(message: VibeTutorMessage) {
  switch (message.action) {
    case "save-notes": {
      if (!isSaveNotesPayload(message.payload)) {
        return { success: false, error: "Invalid notes payload" };
      }
      return handleSaveNotes(message.payload);
    }
    case "guide-mode": {
      if (!isGuideModePayload(message.payload)) {
        return { success: false, error: "Invalid guide mode payload" };
      }
      return handleGuideMode(message.payload);
    }
    case "guide-mode-status": {
      if (!isGuideModeStatusPayload(message.payload)) {
        return { success: false, error: "Invalid guide status payload" };
      }
      return handleGuideModeStatus(message.payload);
    }
    case "init-session-topics": {
      if (!isSessionInitPayload(message.payload)) {
        return { success: false, error: "Invalid session init payload" };
      }
      return handleSessionInit(message.payload);
    }
    case "check-code": {
      if (!isCheckCodePayload(message.payload)) {
        return { success: false, error: "Invalid check code payload" };
      }
      console.log("sending to handleCheckCode");
      const data = await handleCheckCode(message.payload);
      //console.log("this is the data: ", data);
      if (!data) return "failure failure";
      return data;
    }
    case "solution": {
      if (!isSolutionPayload(message.payload)) {
        return { success: false, error: "Invalid solution payload" };
      }
      return handleSolution(message.payload);
    }
    case "go-to-workspace":
      return handleGoToWorkspace(message.payload as { url?: string });

    case "ask-anything": {
      if (!isChatPayload(message.payload)) {
        return { success: false, error: "Invalid chat payload" };
      }
      const data = await handleAskAway({
        sessionId: message.payload.sessionId,
        action: message.payload.action,
        rollingHistory: message.payload.rollingHistory,
        summary: message.payload.summary,
        query: message.payload.query,
        language: message.payload.language,
      });
      if (!data) return "Failure";
      return data;
    }
    case "summarize-history": {
      if (!isSummarizePayload(message.payload)) {
        return { success: false, error: "Invalid summarize payload" };
      }
      const data = await handleSummarize({
        sessionID: message.payload.sessionId,
        summarize: message.payload.summarize,
        summary: message.payload.summary,
      });
      if (!data) return "Failure";
      return data;
    }
    case "supabase-login": {
      //
      if (!isSupabaseLoginPayload(message.payload)) {
        return { success: false, error: "Invalid login payload" };
      }
      const auth = await supabaseLogin(message.payload);
      return auth ?? { success: false, error: "Login failed" };
    }
    case "supabase-signup": {
      if (!isSupabaseSignupPayload(message.payload)) {
        return { success: false, error: "Invalid signup payload" };
      }
      const auth = await supabaseSignup(message.payload);
      return auth ?? { success: false, error: "Signup failed" };
    }
    case "clear-auth": {
      await clearAuthState();
      return { success: true };
    }
    case "panel-opened":
    case "panel-closed":
      console.debug(`VibeTutor: ${message.action}`, message.payload);
      return { success: true };
    default:
      console.warn("VibeTutor: unknown action", message);
      return { success: false, error: "Unknown action" };
  }
}

async function handleSaveNotes(payload: { notes: unknown[] }) {
  try {
    await browser.storage.local.set({ "vibetutor-notes": payload.notes });
    return { success: true };
  } catch (error) {
    console.error("VibeTutor: failed to save notes", error);
    return { success: false, error: "Storage error" };
  }
}

type RollingStateGuideMode = {
  problem: string;
  nudges: string[]; // keep last N
  lastEdit: string;
};

async function handleGuideMode(payload: {
  sessionId: string;
  action: string;
  problem: string;
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >;
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

async function handleGuideModeStatus(payload: {
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

async function handleSessionInit(payload: {
  sessionId: string;
  topics: Record<string, { thoughts_to_remember: string[]; pitfalls: string[] }>;
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
    topics: Record<string, { thoughts_to_remember: string[]; pitfalls: string[] }>;
  },
  token: string,
) {
  const result = await fetchJsonWithTimeout<{ success?: boolean; error?: string }>(
    `${BACKEND_BASE_URL}/api/session/init`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );
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
  const result = await fetchJsonWithTimeout<{ success?: boolean; error?: string }>(
    `${BACKEND_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );
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
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >,
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

async function handleCheckCode(payload: {
  sessionId: string;
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >;
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

async function handleAskAway(payload: {
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

async function handleSummarize(payload: {
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

type AuthState = {
  userId: string;
  jwt: string;
  accessToken?: string;
  refreshToken?: string;
  issuedAt?: number;
  expiresAt?: number;
};
const AUTH_STORAGE_KEY = "vibetutor-auth";
const BACKEND_BASE_URL = "http://127.0.0.1:8000";
const WORKSPACE_STATE_KEY = "vibetutor-workspace-state";
const AUTH_TOKEN_TTL_MS = 16 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15_000;

type BackendFetchSuccess<T> = {
  success: true;
  data: T;
  status: number;
};

type BackendFetchError = {
  success: false;
  error: string;
  status?: number;
  timeout?: boolean;
  unauthorized?: boolean;
};

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { error?: unknown; detail?: unknown; message?: unknown };
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
  if (typeof data.message === "string" && data.message.trim())
    return data.message;
  return fallback;
}

async function fetchJsonWithTimeout<T>(
  url: string,
  options: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<BackendFetchSuccess<T> | BackendFetchError> {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data: T | null = null;
    try {
      data = text ? (JSON.parse(text) as T) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        unauthorized: response.status === 401 || response.status === 403,
        error: extractErrorMessage(data ?? text, "Request failed"),
      };
    }

    return { success: true, data: (data ?? ({} as T)), status: response.status };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "Request timed out", timeout: true };
    }
    return { success: false, error: "Network request failed" };
  } finally {
    clearTimeout(timerId);
  }
}

let authCache: AuthState | null = null;

function isAuthExpired(auth: AuthState | null) {
  if (!auth?.expiresAt) return false;
  return Date.now() > auth.expiresAt;
}

async function setAuthState(payload: AuthState) {
  authCache = payload;
  await browser.storage.local.set({ [AUTH_STORAGE_KEY]: payload });
}

async function clearAuthState() {
  authCache = null;
  await browser.storage.local.remove(AUTH_STORAGE_KEY);
}

async function getAuthState() {
  if (authCache) {
    if (isAuthExpired(authCache)) {
      await clearAuthState();
      return null;
    }
    return authCache;
  }
  const stored = await browser.storage.local.get(AUTH_STORAGE_KEY);
  authCache = (stored[AUTH_STORAGE_KEY] as AuthState | undefined) ?? null;
  if (isAuthExpired(authCache)) {
    await clearAuthState();
    return null;
  }
  return authCache;
}

async function handleSolution(payload: { sessionId: string }) {
  console.debug("VibeTutor: solution requested", payload.sessionId);
  return {
    success: true,
    solution: null,
    message: "Solution endpoint not wired yet.",
  };
}

async function handleGoToWorkspace(payload?: { url?: string }) {
  try {
    const url = payload?.url?.trim();
    if (!url) {
      return { success: false, error: "Workspace URL missing" };
    }
    const auth = await getAuthState();
    if (!auth?.accessToken) {
      return { success: false, error: "Not authenticated" };
    }
    const state = crypto.randomUUID();
    await browser.storage.local.set({
      [WORKSPACE_STATE_KEY]: { value: state, createdAt: Date.now() },
    });
    // Here, the backend uvicorn right, if you run locally, copy that url, and put it as value for BACKEND_BASE_URL
    const result = await fetchJsonWithTimeout<{
      success?: boolean;
      code?: string;
      access_token?: string;
      refresh_token?: string;
      error?: string;
    }>(`${BACKEND_BASE_URL}/api/auth/bridge/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: auth.accessToken,
        refresh_token: auth.refreshToken,
        state,
      }),
    });
    if (!result.success) return result;
    if (result.data?.success === false || !result.data?.code) {
      return {
        success: false,
        status: result.status,
        error: extractErrorMessage(result.data, "Workspace auth bridge failed"),
      };
    }
    if (result.data?.access_token) {
      await setAuthState({
        ...auth,
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token ?? auth.refreshToken,
      });
    }
    const separator = url.includes("?") ? "&" : "?";
    const target = `${url}${separator}code=${encodeURIComponent(
      result.data.code,
    )}&state=${encodeURIComponent(state)}`;
    await browser.tabs.create({ url: target });
    return { success: true };
  } catch (error) {
    console.error("VibeTutor: failed to open workspace", error);
    return { success: false, error: "Unable to open workspace tab" };
  }
}

async function forwardCodeForCheckMode(
  sessionId: string,
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >,
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

function handleGetTabInfo(sender: MessageSender) {
  if (!sender.tab) {
    return { success: false, error: "No tab context" };
  }

  const { id, url, title } = sender.tab;
  return {
    success: true,
    tab: { id, url, title },
  };
}

function isSaveNotesPayload(payload: unknown): payload is { notes: unknown[] } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    Array.isArray((payload as { notes?: unknown[] }).notes)
  );
}

function isTopicBucket(value: unknown): value is {
  thoughts_to_remember: string[];
  pitfalls: string[];
} {
  if (typeof value !== "object" || value === null) return false;

  const v = value as Record<string, unknown>; // tofix-> instead of unknown here, try to define some structure

  return (
    Array.isArray(v.thoughts_to_remember) &&
    v.thoughts_to_remember.every((x) => typeof x === "string") &&
    Array.isArray(v.pitfalls) &&
    v.pitfalls.every((x) => typeof x === "string")
  );
}

function isGuideModePayload(payload: unknown): payload is {
  sessionId: string;
  action: string;
  problem: string;
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >;
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

function isCheckCodePayload(payload: unknown): payload is {
  sessionId: string;
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >;
  code: string;
  action?: string;
  language: string;
  problem_no: number | null;
  problem_name: string;
  problem_url: string;
} {
  if (typeof payload != "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;

  if (typeof p.sessionId !== "string") return false;
  if (typeof p.topics !== "object" || p.topics === null) return false;
  if (typeof p.code !== "string") return false;
  if (typeof p.action !== "string") return false;
  if (typeof p.language !== "string") return false;
  if (
    !("problem_no" in p) ||
    (p.problem_no !== null && typeof p.problem_no !== "number")
  )
    return false;
  if (typeof p.problem_name !== "string") return false;
  if (typeof p.problem_url !== "string") return false;
  return Object.values(p.topics as Record<string, unknown>).every(
    isTopicBucket,
  );
}

function isGuideModeStatusPayload(payload: unknown): payload is {
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

function isSessionInitPayload(payload: unknown): payload is {
  sessionId: string;
  topics: Record<string, { thoughts_to_remember: string[]; pitfalls: string[] }>;
} {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  if (typeof p.sessionId !== "string") return false;
  if (typeof p.topics !== "object" || p.topics === null) return false;
  return Object.values(p.topics as Record<string, unknown>).every(
    isTopicBucket,
  );
}

function isSolutionPayload(payload: unknown): payload is { sessionId: string } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { sessionId?: unknown }).sessionId === "string"
  );
}

function isChatPayload(payload: unknown): payload is {
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

function isSummarizePayload(payload: unknown): payload is {
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

function isSupabaseLoginPayload(payload: unknown): payload is {
  email: string;
  password: string;
} {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const maybe = payload as {
    email?: unknown;
    password?: unknown;
  };
  return typeof maybe.email === "string" && typeof maybe.password === "string";
}

function isSupabaseSignupPayload(payload: unknown): payload is {
  fname: string;
  lname: string;
  email: string;
  password: string;
} {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const maybe = payload as {
    fname?: unknown;
    lname?: unknown;
    email?: unknown;
    password?: unknown;
  };
  return (
    typeof maybe.fname === "string" &&
    typeof maybe.lname === "string" &&
    typeof maybe.email === "string" &&
    typeof maybe.password === "string"
  );
}

async function supabaseLogin(payload: { email: string; password: string }) {
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    token?: string;
    userId?: string;
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    refresh_token?: string;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });
  if (!result.success) return result;
  if (result.data?.success === false || !result.data?.token || !result.data?.userId) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Invalid creds"),
    };
  }
  const now = Date.now();
  const auth = {
    userId: result.data.userId as string,
    jwt: result.data.token as string,
    accessToken:
      (result.data.accessToken as string | undefined) ??
      (result.data.access_token as string | undefined),
    refreshToken:
      (result.data.refreshToken as string | undefined) ??
      (result.data.refresh_token as string | undefined),
    issuedAt: now,
    expiresAt: now + AUTH_TOKEN_TTL_MS,
  };
  await setAuthState(auth);
  return { success: true, ...auth };
}

async function supabaseSignup(payload: {
  fname: string;
  lname: string;
  email: string;
  password: string;
}) {
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    token?: string;
    userId?: string;
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    refresh_token?: string;
    requiresVerification?: boolean;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fname: payload.fname,
      lname: payload.lname,
      email: payload.email,
      password: payload.password,
    }),
  });
  if (!result.success) return result;
  if (result.data?.success === false) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Signup failed"),
    };
  }
  if (result.data?.requiresVerification) {
    return { success: true, requiresVerification: true };
  }
  if (!result.data?.token || !result.data?.userId) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Signup failed"),
    };
  }
  const now = Date.now();
  const auth = {
    userId: result.data.userId as string,
    jwt: result.data.token as string,
    accessToken:
      (result.data.accessToken as string | undefined) ??
      (result.data.access_token as string | undefined),
    refreshToken:
      (result.data.refreshToken as string | undefined) ??
      (result.data.refresh_token as string | undefined),
    issuedAt: now,
    expiresAt: now + AUTH_TOKEN_TTL_MS,
  };
  await setAuthState(auth);
  return { success: true, ...auth };
}

// Handle tab updates to reinject content script if needed
browser.tabs.onUpdated.addListener((tabId: any, changeInfo: any, tab: any) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Skip chrome:// and extension pages
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      return;
    }

    console.log("Tab updated:", tab.url);
  }
});
