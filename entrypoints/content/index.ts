import { configureAuthOverlay, ensureAuthPrompt } from "./auth/overlay";
import { initSessionTopicsIfNeeded } from "./auth/sessionSwitch";
import { configureCheck } from "./check";
import { configureGuide } from "./guide";
import {
  ensureLanguageObserver as ensureLanguageObserverBase,
  getCanonicalProblemUrl,
  getEditorLanguageFromPage,
  syncSessionLanguageFromPage as syncSessionLanguageFromPageBase,
} from "./leetcode";
import { sendAskAnything, sendSummarizeHistory } from "./messaging";
import {
  closeTutorPanel,
  configureLifecycle,
  openTutorPanel,
  startProblemUrlWatcher,
} from "./session/lifecycle";
import {
  configureActivity,
  markUserActivity,
  setupActivityTracking,
  stopPanelOperations,
} from "./session/activity";
import {
  hydrateStoredSessionCache,
  saveSessionState,
  scheduleSessionPersist,
  startSessionCleanupSweep,
} from "./session/storage";
import { state, type SessionRollingHistoryLLM } from "./state";
import {
  appendPanelMessage,
  showAssistantLoading,
  typeMessage,
} from "./ui/messages";
import { setPanelControlsDisabled, showTutorPanel } from "./ui/panel";
import { prettifyLlMResponse, renderMarkdown } from "./ui/render";
import {
  configureWidget,
  createFloatingWidget,
  hideWidget,
  loadWidgetPosition,
} from "./ui/widget";
import {
  configureErrors,
  handleBackendError,
  hidePanelLoading,
  lockPanel,
  showPanelLoading,
  unlockPanel,
} from "./net/errors";

export default defineContentScript({
  matches: ["https://leetcode.com/problems/*"],
  main() {
    console.log(
      "🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading...",
    );

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        initializeWidget();
      });
    } else {
      initializeWidget();
    }
  },
});
// <all_urls>

function initializeWidget() {
  console.log("The widget is being loaded to the page");
  state.lastCanonicalProblemUrl = getCanonicalProblemUrl(window.location.href);
  configureGuide({
    appendToContentPanel,
    scheduleSessionPersist,
    syncSessionLanguageFromPage,
    handleBackendError,
  });
  configureCheck({
    appendToContentPanel,
    scheduleSessionPersist,
    syncSessionLanguageFromPage,
    handleBackendError,
  });
  configureErrors({
    ensureAuthPrompt,
    showTutorPanel,
    hideWidget,
    markUserActivity,
    scheduleSessionPersist,
    appendPanelMessage,
    setPanelControlsDisabled,
  });
  configureActivity({
    lockPanel,
  });
  configureLifecycle({
    highlightExistingPanel,
    lockPanel,
    markUserActivity,
    showPanelLoading,
    hidePanelLoading,
    initSessionTopicsIfNeeded,
  });
  configureAuthOverlay({
    stopPanelOperations,
    unlockPanel,
  });
  configureWidget({
    openTutorPanel,
    closeTutorPanel,
    askAnything,
    highlightAskArea,
    appendPanelMessage,
    maybeQueueSummary,
    scheduleSessionPersist,
    syncSessionLanguageFromPage,
    handleBackendError,
    workspaceUrl: WORKSPACE_URL,
  });
  createFloatingWidget();
  loadWidgetPosition();
  setupMessageListener();
  setupActivityTracking();
  startProblemUrlWatcher();
  startSessionCleanupSweep();
  void hydrateStoredSessionCache().then(() => {
    if (state.pendingStoredSession?.panelOpen) {
      void openTutorPanel();
    }
  });
  window.addEventListener("beforeunload", () => {
    void saveSessionState(state.currentTutorSession?.element ?? null);
  });
}

function syncSessionLanguageFromPage() {
  syncSessionLanguageFromPageBase(scheduleSessionPersist);
}

function ensureLanguageObserver() {
  ensureLanguageObserverBase(scheduleSessionPersist);
}

async function requestHistorySummary(history: SessionRollingHistoryLLM) {
  if (state.summarizeInFlight || history.toSummarize.length === 0) return;
  //console.log("This is the toSummarize before clearing: ", history.toSummarize);
  const summarizeBatch = history.toSummarize.splice(0);
  state.summarizeInFlight = true;
  try {
    const response = await sendSummarizeHistory({
      sessionId: state.currentTutorSession?.sessionId ?? "",
      summarize: summarizeBatch,
      summary: history.summary,
    });
    if (
      handleBackendError(state.currentTutorSession?.element ?? null, response, {
        silent: true,
      })
    ) {
      return;
    }
    const reply =
      typeof response === "string" ? response : (response as any)?.reply;
    if (typeof reply === "string") {
      history.summary = reply;
    }
  } finally {
    state.summarizeInFlight = false;
  }
}

function maybeQueueSummary(history: SessionRollingHistoryLLM) {
  if (history.qaHistory.length <= 40) return;
  const moved = history.qaHistory.splice(0, 20);
  history.toSummarize.push(...moved);
  void requestHistorySummary(history);
}

const WORKSPACE_URL = "http://localhost:3000/auth/bridge";

// const WORKSPACE_URL = ""; // TODO: paste workspace auth-bridge URL here
function highlightExistingPanel(session: HTMLElement) {}

function setupMessageListener() {}

function handleTutorPanelActions() {}

function highlightAskArea() {}

async function askAnything(panel: HTMLElement, query: string) {
  //console.log("this is the query asked: ", query);
  const loadingEl = showAssistantLoading(panel);
  const language =
    state.currentTutorSession?.language || getEditorLanguageFromPage();
  const response = await sendAskAnything({
    sessionId: state.currentTutorSession?.sessionId ?? "",
    action: "ask-anything",
    rollingHistory: state.currentTutorSession?.sessionRollingHistory.qaHistory,
    summary: state.currentTutorSession?.sessionRollingHistory.summary ?? "",
    query: query,
    language,
  });
  if (
    handleBackendError(panel, response, {
      timeoutMessage:
        "The model is taking longer than usual. Please try again.",
    })
  ) {
    loadingEl?.remove();
    return "Failure";
  }
  const reply =
    typeof response === "string" ? response : (response as any)?.reply;
  if (typeof reply === "string" && reply.trim()) {
    loadingEl?.remove();
    appendToContentPanel(panel, "", "assistant", reply);
  }
  loadingEl?.remove();
  if (!reply) return "Failure";
  return reply;
}

async function appendToContentPanel(
  panel: HTMLElement,
  some: string,
  role: string,
  llm_response: string,
) {
  const pretty = prettifyLlMResponse(llm_response);
  const content_area = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (content_area && typeof llm_response === "string") {
    if (role === "assistant") {
      const message = appendPanelMessage(panel, "", "assistant");
      if (!message) return;
      await typeMessage(message, content_area, pretty, {
        render: renderMarkdown,
      });
      message.innerHTML = renderMarkdown(pretty);
      state.currentTutorSession?.sessionRollingHistory.qaHistory.push(
        `Assitant: ${llm_response}`,
      );
      if (state.currentTutorSession) {
        maybeQueueSummary(state.currentTutorSession.sessionRollingHistory);
      }
      content_area.scrollTop = message.offsetTop;
      scheduleSessionPersist(panel);
    } else if (role === "guideAssistant") {
      let wrapper =
        state.guideActiveSlab && content_area.contains(state.guideActiveSlab)
          ? state.guideActiveSlab
          : null;
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = "guide-wrapper guide-slab";
        const list = document.createElement("ul");
        list.className = "guide-list";
        wrapper.appendChild(list);
        content_area.appendChild(wrapper);
        state.guideActiveSlab = wrapper;
      }

      const list =
        wrapper.querySelector<HTMLUListElement>(".guide-list") ??
        document.createElement("ul");
      if (!list.classList.contains("guide-list")) {
        list.className = "guide-list";
        wrapper.appendChild(list);
      }

      const item = document.createElement("li");
      item.className = "guide-item";
      list.appendChild(item);

      if (state.guideMessageCount === 0) {
        wrapper.classList.add("guide-start");
      }
      state.guideMessageCount += 1;
      state.lastGuideMessageEl = wrapper;

      await typeMessage(item, content_area, pretty, {
        render: renderMarkdown,
      });
      item.innerHTML = renderMarkdown(pretty);
      content_area.scrollTop = wrapper.offsetTop;
      // state.currentTutorSession?.sessionRollingHistory.qaHistory.push(
      //   `Guide: ${llm_response}`,
      // );
      // if (state.currentTutorSession) {
      //   maybeQueueSummary(state.currentTutorSession.sessionRollingHistory);
      // }
      scheduleSessionPersist(panel);
    } else if (role === "checkAssistant") {
      const wrapper = appendPanelMessage(panel, "", "checkAssistant");
      if (!wrapper) return;

      const bubble = wrapper.querySelector<HTMLElement>(
        ".tutor-panel-message--checkAssistant",
      );
      if (!bubble) return;

      // checkmode is one chunk → start + end immediately
      wrapper.classList.add("check-start");

      await typeMessage(bubble, content_area, pretty, {
        render: renderMarkdown,
      });
      bubble.innerHTML = renderMarkdown(pretty);

      wrapper.classList.add("check-end");
      content_area.scrollTop = wrapper.offsetTop;
      state.currentTutorSession?.sessionRollingHistory.qaHistory.push(
        `Check: ${llm_response}`,
      );
      if (state.currentTutorSession) {
        maybeQueueSummary(state.currentTutorSession.sessionRollingHistory);
      }
      scheduleSessionPersist(panel);
    }
  }
}
