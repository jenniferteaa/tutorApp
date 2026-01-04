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
      handleMessage(message)
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: String(error) })
        );
      return true;
    }
  );

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
    }
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
      console.log("this is the data: ", data);
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
        query: message.payload.query,
        action: message.payload.action,
      });
      if (!data) return "Failure";
      return data;
    }
    // case "get-tab-info":
    //   return handleGetTabInfo(sender);
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

async function handleGuideMode(payload: {
  action: string;
  code: string;
  focusLine: string;
}) {
  console.debug(
    "VibeTutor: guide-mode payload received with action: ",
    payload.action
  );
  console.log("this is the payload at background.ts payload: ", payload);
  return forwardCodeToBackendGuideMode(
    payload.action,
    payload.code,
    payload.focusLine
  );
}

async function forwardCodeToBackendGuideMode(
  action: string,
  code: string,
  focusLine: string
) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/llm/guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, code, focusLine }),
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

async function handleCheckCode(payload: { code: string; action: string }) {
  console.debug("VibeTutor: check-code payload received");
  const data = await forwardCodeToBackend(
    payload.code,
    payload.action ?? "code-check"
  );
  //console.log("this is the data received: ", data.reply);
  return data.reply;
}

async function handleAskAway(payload: { query: string; action: string }) {
  console.debug("VibeTutor: ask-anything payload received");
  const data = await forwardCodeToBackend(
    payload.query,
    payload.action ?? "ask-anything"
  );
  console.log("this is the data received: ", data.reply);
  return data.reply;
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

// async function handleAskAway(payload: { sessionId: string; text: string }) {
//   console.debug("VibeTutor: ask-away prompt received", payload.sessionId);
//   // TODO: call chat helper / LLM
//   return {
//     success: true,
//     reply: "Chat endpoint not wired yet.",
//   };
// }

async function forwardCodeToBackend(
  code: string,
  action: string,
  extra?: Record<string, unknown>
  //extra?: Record<string, unknown> | string
) {
  //console.log("sending code to backend:", { action });
  //console.log("this is the code: ", code);
  //console.log("this is the extra: ", extra);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, action, ...extra }),
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

function isGuideModePayload(
  payload: unknown
): payload is { action: string; code: string; focusLine: string } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { action?: unknown }).action === "string" &&
    typeof (payload as { code?: unknown }).code === "string" &&
    typeof (payload as { focusLine?: unknown }).focusLine === "string"
  );
}

function isCheckCodePayload(
  payload: unknown
): payload is { code: string; requestType?: string } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { code?: unknown }).code === "string"
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
  payload: unknown
): payload is { sessionId: string; timer: unknown } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { sessionId?: unknown }).sessionId === "string" &&
    "timer" in (payload as object)
  );
}

function isChatPayload(
  payload: unknown
): payload is { query: string; action: string } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { query?: unknown }).query === "string" &&
    typeof (payload as { action?: unknown }).action === "string"
  );
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
