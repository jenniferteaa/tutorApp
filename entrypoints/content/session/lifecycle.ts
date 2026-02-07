import {
  getCanonicalProblemUrl,
  getEditorLanguageFromPage,
  getProblemTitleFromPage,
  getRollingTopicsFromPage,
  ensureLanguageObserver,
  syncSessionLanguageFromPage,
} from "../leetcode";
import {
  applyStoredSessionToPanel,
  clearAuthFromStorage,
  hydrateStoredSessionCache,
  isAuthExpired,
  isStoredSessionForUser,
  loadAuthFromStorage,
  loadSessionState,
  saveSessionState,
  scheduleSessionPersist,
} from "./storage";
import { state, type TutorSession } from "../state";
import { createTutorPanel, hideTutorPanel, showTutorPanel } from "../ui/panel";
import {
  hideWidget,
  positionWidgetFromPanel,
  showWidget,
} from "../ui/widget";
import { ensureAuthPrompt } from "../auth/overlay";
import { resetGuideState } from "../guide";

type LifecycleDeps = {
  highlightExistingPanel: (panel: HTMLElement) => void;
  lockPanel: (panel: HTMLElement) => void;
  markUserActivity: () => void;
  showPanelLoading: () => void;
  hidePanelLoading: () => void;
  initSessionTopicsIfNeeded: (session: TutorSession) => Promise<void>;
};

let lifecycleDeps: LifecycleDeps | null = null;

export function configureLifecycle(next: LifecycleDeps) {
  lifecycleDeps = next;
}

function getLifecycleDeps(): LifecycleDeps {
  if (!lifecycleDeps) {
    throw new Error("Lifecycle dependencies not configured");
  }
  return lifecycleDeps;
}

export function buildFreshSession(
  panel: HTMLElement,
  userId: string,
  problemName?: string,
): TutorSession {
  const title = problemName ?? getProblemTitleFromPage();
  const sessionId = crypto.randomUUID();
  return {
    element: panel,
    sessionId,
    userId,
    problem: title,
    problemUrl: getCanonicalProblemUrl(window.location.href),
    language: getEditorLanguageFromPage(),
    topics: getRollingTopicsFromPage(),
    sessionTopicsInitialized: false,
    content: [],
    prompt: "",
    position: null,
    size: null,
    guideModeEnabled: false,
    checkModeEnabled: false,
    rollingStateGuideMode: {
      problem: title,
      nudges: [],
      lastEdit: "",
    },
    sessionRollingHistory: {
      qaHistory: [],
      summary: "",
      toSummarize: [],
    },
  };
}

export async function openTutorPanel() {
  const {
    highlightExistingPanel,
    lockPanel,
    markUserActivity,
    showPanelLoading,
    hidePanelLoading,
    initSessionTopicsIfNeeded,
  } = getLifecycleDeps();

  const auth = await loadAuthFromStorage();
  const authExpired = isAuthExpired(auth);
  const authUserId = auth?.userId ?? "";
  if (authExpired) {
    await clearAuthFromStorage();
  }

  if (
    state.currentTutorSession &&
    state.currentTutorSession.element &&
    document.body.contains(state.currentTutorSession.element)
  ) {
    ensureLanguageObserver(scheduleSessionPersist);
    syncSessionLanguageFromPage(scheduleSessionPersist);
    showTutorPanel(state.currentTutorSession.element);
    hideWidget();
    state.isWindowOpen = true;
    highlightExistingPanel(state.currentTutorSession.element);
    const contentArea =
      state.currentTutorSession.element.querySelector<HTMLElement>(
        ".tutor-panel-content",
      );
    if (contentArea) {
      requestAnimationFrame(() => {
        contentArea.scrollTop = contentArea.scrollHeight;
      });
    }
    if (!authUserId || authExpired) {
      lockPanel(state.currentTutorSession.element);
      ensureAuthPrompt(
        state.currentTutorSession.element,
        authExpired ? "session expired, please log back in" : undefined,
      );
    } else {
      void initSessionTopicsIfNeeded(state.currentTutorSession);
    }
    markUserActivity();
    scheduleSessionPersist(state.currentTutorSession.element);
    return;
  }

  if (state.currentTutorSession?.userId) {
    showPanelLoading();
    try {
      await saveSessionState(state.currentTutorSession.element ?? null, {
        force: true,
      });
    } finally {
      hidePanelLoading();
    }
  }

  if (!state.pendingStoredSession) {
    if (authUserId) {
      const stored = await loadSessionState(
        authUserId,
        getProblemTitleFromPage(),
      );
      if (
        stored &&
        isStoredSessionForUser(
          stored,
          authUserId,
          getCanonicalProblemUrl(window.location.href),
        )
      ) {
        state.pendingStoredSession = stored;
      }
    }
  }

  if (state.pendingStoredSession) {
    const tutorPanel = createTutorPanel();
    applyStoredSessionToPanel(tutorPanel, state.pendingStoredSession);
    state.pendingStoredSession = null;
    ensureLanguageObserver(scheduleSessionPersist);
    syncSessionLanguageFromPage(scheduleSessionPersist);
    showTutorPanel(tutorPanel);
    hideWidget();
    state.isWindowOpen = true;
    markUserActivity();
    if (!authUserId || authExpired) {
      lockPanel(tutorPanel); // #lockpanel
      ensureAuthPrompt(
        tutorPanel,
        authExpired ? "session expired, please log back in" : undefined,
      );
    } else if (state.currentTutorSession) {
      void initSessionTopicsIfNeeded(state.currentTutorSession);
    }
    scheduleSessionPersist(tutorPanel);
    return;
  }

  const tutorPanel = createTutorPanel();
  if (!tutorPanel) {
    console.log("There was an error creating a panel");
    return;
  }
  state.currentTutorSession = buildFreshSession(tutorPanel, authUserId);
  ensureLanguageObserver(scheduleSessionPersist);
  syncSessionLanguageFromPage(scheduleSessionPersist);
  showTutorPanel(tutorPanel);
  hideWidget();
  state.isWindowOpen = true;
  markUserActivity();
  scheduleSessionPersist(tutorPanel);
  if (!state.currentTutorSession) return;
  if (!authUserId || authExpired) {
    lockPanel(tutorPanel);
    ensureAuthPrompt(
      tutorPanel,
      authExpired ? "session expired, please log back in" : undefined,
    );
  } else {
    state.currentTutorSession.userId = authUserId;
    void initSessionTopicsIfNeeded(state.currentTutorSession);
  }
  // lockPanel
  // Auto-focus the textarea when created via shortcut
  setTimeout(() => {
    const textarea = tutorPanel.querySelector(
      ".tutor-panel-prompt",
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length); // Place cursor at end
    }
  }, 100);
}

export function closeTutorPanel() {
  if (!state.currentTutorSession?.element) {
    return;
  }
  hideTutorPanel(state.currentTutorSession.element);
  positionWidgetFromPanel(state.currentTutorSession.element);
  showWidget();
  state.isWindowOpen = false;
  scheduleSessionPersist(state.currentTutorSession.element);
}

async function handleProblemUrlChange(nextUrl: string) {
  if (state.currentTutorSession?.userId && state.currentTutorSession.element) {
    await saveSessionState(state.currentTutorSession.element, { force: true });
  }
  state.pendingStoredSession = null;
  resetGuideState();
  const wasOpen = state.isWindowOpen;
  if (state.currentTutorSession?.element) {
    state.currentTutorSession.element.remove();
  }
  state.currentTutorSession = null;
  state.isWindowOpen = false;
  showWidget();
  await hydrateStoredSessionCache();
  if (wasOpen) {
    void openTutorPanel();
  }
}

export function startProblemUrlWatcher() {
  if (state.problemUrlWatcherId) {
    window.clearInterval(state.problemUrlWatcherId);
  }
  state.problemUrlWatcherId = window.setInterval(() => {
    const current = getCanonicalProblemUrl(window.location.href);
    if (current !== state.lastCanonicalProblemUrl) {
      state.lastCanonicalProblemUrl = current;
      void handleProblemUrlChange(current);
    }
  }, 1000);
}
