import { configureAuthOverlay, ensureAuthPrompt } from "./auth/overlay";
import { initSessionTopicsIfNeeded } from "./auth/sessionSwitch";
import { configureCheck } from "./check";
import { askAnything } from "./core/query";
import { maybeQueueSummary } from "./core/summaries";
import { configureGuide } from "./guide";
import {
  ensureLanguageObserver as ensureLanguageObserverBase,
  getCanonicalProblemUrl,
  syncSessionLanguageFromPage as syncSessionLanguageFromPageBase,
} from "./leetcode";
import {
  configureErrors,
  handleBackendError,
  hidePanelLoading,
  lockPanel,
  showPanelLoading,
  unlockPanel,
} from "./net/errors";
import {
  configureActivity,
  markUserActivity,
  setupActivityTracking,
  stopPanelOperations,
} from "./session/activity";
import {
  closeTutorPanel,
  configureLifecycle,
  openTutorPanel,
  startProblemUrlWatcher,
} from "./session/lifecycle";
import {
  hydrateStoredSessionCache,
  saveSessionState,
  scheduleSessionPersist,
  startSessionCleanupSweep,
  watchAuthStorageCleared,
} from "./session/storage";
import { state } from "./state";
import { appendPanelMessage } from "./ui/messages";
import {
  appendToContentPanel,
  configurePanel,
  setPanelControlsDisabled,
  showTutorPanel,
} from "./ui/panel";
import {
  configureWidget,
  createFloatingWidget,
  hideWidget,
  loadWidgetPosition,
  showWidget,
} from "./ui/widget";

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
  configurePanel({
    maybeQueueSummary,
    scheduleSessionPersist,
  });
  configureAuthOverlay({
    stopPanelOperations,
    unlockPanel,
  });
  watchAuthStorageCleared(() => {
    const panel = state.currentTutorSession?.element;
    if (!panel) return;
    lockPanel(panel);
    ensureAuthPrompt(panel);
    if (!state.isWindowOpen) {
      showTutorPanel(panel);
      hideWidget();
      state.isWindowOpen = true;
      markUserActivity();
      scheduleSessionPersist(panel);
    }
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

const WORKSPACE_URL = "http://localhost:3000/auth/bridge";

// const WORKSPACE_URL = ""; // TODO: paste workspace auth-bridge URL here
function highlightExistingPanel(session: HTMLElement) {
  // cant highlight it cos the widget is anyway hidden when the panel is opened so.
}

function setupMessageListener() {
  browser.runtime.onMessage.addListener((message) => {
    if (!message || typeof message !== "object") return;
    if ("action" in message && message.action === "show-widget") {
      showWidget();
      return Promise.resolve({ success: true });
    }
    return undefined;
  });
}

function highlightAskArea() {
  // need to fill out this function
}
