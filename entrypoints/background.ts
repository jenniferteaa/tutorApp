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
    case "set-timer": {
      if (!isTimerPayload(message.payload)) {
        return { success: false, error: "Invalid timer payload" };
      }
      return handleSetTimer(message.payload);
    }
    case "go-to-workspace":
      return handleGoToWorkspace();

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
    payload.rollingStateGuideMode,
  );
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
  rollingStateGuideMode: RollingStateGuideMode,
) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/llm/guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        action,
        problem,
        topics,
        code,
        focusLine,
        rollingStateGuideMode,
      }),
    });

    const text = await response.text(); // read once

    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
      //console.log("This is the data received: ", data);
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Backend error (${response.status}): ${
          data?.detail ? JSON.stringify(data.detail) : text
        }`,
      };
    }

    return data ?? { success: true };
  } catch (error) {
    console.error("VibeTutor: backend request failed", error);
    return { success: false, error: "Backend request failed" };
  }
}

async function handleCheckCode(payload: {
  sessionId: string;
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >;
  code: string;
  action: string;
}) {
  console.debug("VibeTutor: check-code payload received");
  const data = await forwardCodeForCheckMode(
    payload.sessionId,
    payload.topics,
    payload.code,
    payload.action ?? "check-code",
  );
  //console.log("this is the data received: ", data.reply);
  return data.reply;
}

async function handleAskAway(payload: {
  sessionId: string;
  action: string;
  rollingHistory: string[];
  summary: string;
  query: string;
}) {
  console.debug("VibeTutor: ask-anything payload received");
  const data = await forwardCodeToBackend(
    payload.sessionId,
    payload.action ?? "ask-anything",
    payload.rollingHistory,
    payload.summary,
    payload.query,
  );
  console.log("this is the data received: ", data.reply);
  return data.reply;
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
  //console.log("this is the summary received: ", data.reply);
  return data.reply;
}

type AuthState = { userId: string; jwt: string };
const AUTH_STORAGE_KEY = "vibetutor-auth";
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

let authCache: AuthState | null = null;

async function setAuthState(payload: AuthState) {
  authCache = payload;
  await browser.storage.local.set({ [AUTH_STORAGE_KEY]: payload });
}

async function clearAuthState() {
  authCache = null;
  await browser.storage.local.remove(AUTH_STORAGE_KEY);
}

async function getAuthState() {
  if (authCache) return authCache;
  const stored = await browser.storage.local.get(AUTH_STORAGE_KEY);
  authCache = (stored[AUTH_STORAGE_KEY] as AuthState | undefined) ?? null;
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

async function handleSetTimer(payload: { sessionId: string; timer: unknown }) {
  console.debug("VibeTutor: timer payload received", payload);
  // TODO: persist timer state to storage / backend
  return { success: true };
}

async function handleGoToWorkspace() {
  try {
    await browser.tabs.create({ url: "https://example.com/workspace" });
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
) {
  try {
    const auth = await getAuthState();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (auth?.jwt) {
      headers.Authorization = `Bearer ${auth.jwt}`;
    }
    const response = await fetch("http://127.0.0.1:8000/api/llm", {
      method: "POST",
      headers,
      body: JSON.stringify({ sessionId, topics, code, action }),
    });
    const text = await response.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
      //console.log("This is the data received: ", data);
    } catch {
      data = null;
    }
    if (!response.ok) {
      return {
        success: false,
        error: `Backend error (${response.status}): ${
          data?.detail ? JSON.stringify(data.detail) : text
        }`,
      };
    }
    return data ?? { success: true };
  } catch (error) {
    console.error("Code check failed", error);
    return { success: false, error: "Backend code check request failed" };
  }
}

async function forwardCodeToBackend(
  sessionId: string,
  action: string,
  rollingHistory: string[],
  summary: string,
  query: string,
) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/llm/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        action,
        rollingHistory,
        summary,
        query,
      }),
    });

    const text = await response.text(); // read once

    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
      //console.log("This is the data received: ", data);
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Backend error (${response.status}): ${
          data?.detail ? JSON.stringify(data.detail) : text
        }`,
      };
    }

    return data ?? { success: true };
  } catch (error) {
    console.error("VibeTutor: backend request failed", error);
    return { success: false, error: "Backend request failed" };
  }
}

async function forwardSummaryToBackend(
  sessionID: string,
  summarize: string[],
  summary: string,
) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/llm/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionID, summarize, summary }),
    });
    const text = await response.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!response.ok) {
      return {
        success: false,
        error: `Backend error (${response.status}): ${
          data?.detail ? JSON.stringify(data.detail) : text
        }`,
      };
    }
    return data ?? { success: true };
  } catch (error) {
    console.error("VibeTutor: summary request failed", error);
    return { success: false, error: "Summary request failed" };
  }
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
  rollingStateGuideMode: RollingStateGuideMode;
} {
  if (typeof payload !== "object" || payload === null) return false;

  const p = payload as Record<string, unknown>;

  if (typeof p.sessionId !== "string") return false;
  if (typeof p.action !== "string") return false;
  if (typeof p.problem !== "string") return false;
  if (typeof p.code !== "string") return false;
  if (typeof p.focusLine !== "string") return false;

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
} {
  if (typeof payload != "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;

  if (typeof p.sessionId !== "string") return false;
  if (typeof p.topics !== "object" || p.topics === null) return false;
  if (typeof p.code !== "string") return false;
  if (typeof p.action !== "string") return false;
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

function isTimerPayload(
  payload: unknown,
): payload is { sessionId: string; timer: unknown } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { sessionId?: unknown }).sessionId === "string" &&
    "timer" in (payload as object)
  );
}

function isChatPayload(payload: unknown): payload is {
  sessionId: string;
  action: string;
  rollingHistory: string[];
  summary: string;
  query: string;
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
  };
  if (typeof maybe.sessionId !== "string") return false;
  if (typeof maybe.query !== "string") return false;
  if (typeof maybe.action !== "string") return false;
  if (!Array.isArray(maybe.rollingHistory)) return false;
  if (!maybe.rollingHistory.every((entry) => typeof entry === "string")) {
    return false;
  }
  return typeof maybe.summary === "string";
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

async function supabaseLogin(payload: { email: string; password: string }) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok || !data?.token || !data?.userId) {
      return null;
    }
    const auth = { userId: data.userId as string, jwt: data.token as string };
    await setAuthState(auth);
    return auth;
  } catch (error) {
    console.error("VibeTutor: supabase login failed", error);
    return null;
  }
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
