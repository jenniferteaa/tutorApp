import { configureCheck } from "./check";
import { configureGuide, detachGuideListeners, resetGuideState } from "./guide";
import {
  getCanonicalProblemUrl,
  getEditorLanguageFromPage,
  getProblemTitleFromPage,
  getRollingTopicsFromPage,
} from "./leetcode";
import {
  sendAskAnything,
  sendInitSessionTopics,
  sendSummarizeHistory,
  sendSupabaseLogin,
  sendSupabaseSignup,
} from "./messaging";
import {
  applyStoredSessionToPanel,
  clearAuthFromStorage,
  clearSessionState,
  hydrateStoredSessionCache,
  isAuthExpired,
  isStoredSessionForUser,
  loadAuthFromStorage,
  loadSessionState,
  saveSessionState,
  scheduleSessionPersist,
  startSessionCleanupSweep,
} from "./session/storage";
import {
  state,
  type SessionRollingHistoryLLM,
  type TutorSession,
} from "./state";
import { prettifyLlMResponse, renderMarkdown } from "./ui/render";
import {
  createTutorPanel,
  hideTutorPanel,
  setPanelControlsDisabled,
  showTutorPanel,
} from "./ui/panel";
import {
  configureWidget,
  createFloatingWidget,
  hideWidget,
  loadWidgetPosition,
  positionWidgetFromPanel,
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

function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (/\s/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

const LANGUAGE_BUTTON_SELECTOR = '#editor button[aria-haspopup="dialog"]';

function syncSessionLanguageFromPage() {
  if (!state.currentTutorSession) return;
  const language = getEditorLanguageFromPage();
  if (!language) return;
  if (state.currentTutorSession.language === language) return;
  state.currentTutorSession.language = language;
  scheduleSessionPersist(state.currentTutorSession.element ?? null);
}

function ensureLanguageObserver() {
  const button = document.querySelector<HTMLElement>(LANGUAGE_BUTTON_SELECTOR);
  if (!button) return;

  if (!button.dataset.tutorLangListener) {
    button.dataset.tutorLangListener = "true";
    button.addEventListener(
      "click",
      () => {
        window.setTimeout(syncSessionLanguageFromPage, 50);
      },
      { passive: true },
    );
  }

  if (state.languageObserverTarget === button && state.languageObserver) {
    syncSessionLanguageFromPage();
    return;
  }

  state.languageObserver?.disconnect();
  state.languageObserverTarget = button;
  state.languageObserver = new MutationObserver(() => {
    syncSessionLanguageFromPage();
  });
  state.languageObserver.observe(button, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  syncSessionLanguageFromPage();
}

function buildFreshSession(
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

async function openTutorPanel() {
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
    ensureLanguageObserver();
    syncSessionLanguageFromPage();
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
    ensureLanguageObserver();
    syncSessionLanguageFromPage();
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
  ensureLanguageObserver();
  syncSessionLanguageFromPage();
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

async function initSessionTopicsIfNeeded(session: TutorSession) {
  if (session.sessionTopicsInitialized) return;
  if (!session.userId) return;
  const resp = await sendInitSessionTopics({
    sessionId: session.sessionId,
    topics: session.topics,
  });
  if (resp?.success) {
    session.sessionTopicsInitialized = true;
    scheduleSessionPersist(session.element ?? null);
  }
}

const WORKSPACE_URL = "http://localhost:3000/auth/bridge";

// const WORKSPACE_URL = ""; // TODO: paste workspace auth-bridge URL here
//const INACTIVITY_MS = 1 * 60 * 1000; // 57,600,000
const INACTIVITY_MS = 16 * 60 * 60 * 1000; // 57,600,000
const ACTIVITY_PERSIST_INTERVAL_MS = 15000;

function resetPanelForUser(
  panel: HTMLElement,
  userId: string,
  problemName: string,
) {
  resetGuideState();
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (contentArea) {
    contentArea.innerHTML = "";
  }
  const prompt = panel.querySelector<HTMLTextAreaElement>(
    ".tutor-panel-prompt",
  );
  if (prompt) {
    prompt.value = "";
  }
  state.currentTutorSession = buildFreshSession(panel, userId, problemName);
  if (state.currentTutorSession) {
    void initSessionTopicsIfNeeded(state.currentTutorSession);
  }
}

function markUserActivity() {
  state.lastActivityAt = Date.now();
  if (Date.now() - state.lastActivityStoredAt > ACTIVITY_PERSIST_INTERVAL_MS) {
    state.lastActivityStoredAt = Date.now();
    scheduleSessionPersist();
  }
}

async function logoutForInactivity() {
  if (state.currentTutorSession?.element) {
    await saveSessionState(state.currentTutorSession.element, { force: true });
    state.sessionRestorePending = true;
  }
  await clearAuthFromStorage();
  if (state.currentTutorSession) {
    state.currentTutorSession.guideModeEnabled = false;
    state.currentTutorSession.checkModeEnabled = false;
  }
  if (state.currentTutorSession?.element) {
    const panel = state.currentTutorSession.element;
    detachGuideListeners();
    panel.classList.remove("guidemode-active", "checkmode-active");
    lockPanel(panel);
    ensureAuthPrompt(panel, "session expired, please log back in");
  }
}

function setupActivityTracking() {
  const handler = () => markUserActivity();
  const events = ["mousemove", "keydown", "click", "scroll", "input"];
  for (const event of events) {
    document.addEventListener(event, handler, { passive: true });
  }
  if (state.inactivityTimerId) {
    window.clearInterval(state.inactivityTimerId);
  }
  state.inactivityTimerId = window.setInterval(async () => {
    if (Date.now() - state.lastActivityAt < INACTIVITY_MS) return;
    const auth = await loadAuthFromStorage();
    if (!auth?.userId) return;
    await logoutForInactivity();
  }, 60_000);
}

function stopPanelOperations(panel: HTMLElement) {
  state.queue = [];
  state.flushInFlight = false;
  resetGuideState();
  detachGuideListeners();
  panel.querySelectorAll(".tutor-panel-assistant-loading").forEach((el) => {
    el.remove();
  });
  if (state.currentTutorSession) {
    state.currentTutorSession.guideModeEnabled = false;
    state.currentTutorSession.checkModeEnabled = false;
  }
  panel.classList.remove("guidemode-active", "checkmode-active");
  panel.querySelector(".btn-guide-mode")?.classList.remove("is-loading");
  panel.querySelector(".btn-help-mode")?.classList.remove("is-loading");
}

function lockPanel(panel: HTMLElement) {
  panel.classList.add("tutor-panel-locked");
  setPanelControlsDisabled(panel, true);
}

function unlockPanel(panel: HTMLElement) {
  panel.classList.remove("tutor-panel-locked");
  setPanelControlsDisabled(panel, false);
}

type BackendErrorResponse = {
  success: false;
  error?: string;
  status?: number;
  timeout?: boolean;
  unauthorized?: boolean;
};

const SESSION_EXPIRED_MESSAGE = "session expired, please log back in";

function isBackendErrorResponse(value: unknown): value is BackendErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { success?: unknown }).success === false
  );
}

function removeSessionExpiredMessage(panel: HTMLElement) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return;
  const messages = contentArea.querySelectorAll<HTMLElement>(
    ".tutor-panel-message--assistant",
  );
  messages.forEach((message) => {
    if (message.textContent?.trim() === SESSION_EXPIRED_MESSAGE) {
      message.remove();
    }
  });
}

function appendSystemMessage(panel: HTMLElement, message: string) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return;
  const messageEl = appendPanelMessage(panel, message, "assistant");
  if (!messageEl) return;
  contentArea.scrollTop = messageEl.offsetTop;
  scheduleSessionPersist(panel);
}

function handleBackendError(
  panel: HTMLElement | null,
  response: unknown,
  options?: {
    timeoutMessage?: string;
    serverMessage?: string;
    lockOnServerError?: boolean;
    silent?: boolean;
  },
) {
  if (!isBackendErrorResponse(response)) return false;
  if (options?.silent) return true;
  const target = panel ?? state.currentTutorSession?.element ?? null;
  if (!target) return true;

  if (
    response.unauthorized ||
    response.status === 401 ||
    response.status === 403 ||
    (response.error && /unauthorized/i.test(response.error))
  ) {
    lockPanel(target);
    ensureAuthPrompt(target, SESSION_EXPIRED_MESSAGE);
    if (!state.isWindowOpen) {
      showTutorPanel(target);
      hideWidget();
      state.isWindowOpen = true;
      markUserActivity();
      scheduleSessionPersist(target);
    }
    removeSessionExpiredMessage(target);
    return true;
  }

  if (response.timeout) {
    appendSystemMessage(
      target,
      options?.timeoutMessage ??
        "The model is taking longer than usual. Please try again.",
    );
    return true;
  }

  const serverMessage =
    options?.serverMessage ??
    "Internal server error. Please try again in a moment.";
  if (options?.lockOnServerError === true) {
    lockPanel(target);
  }
  appendSystemMessage(target, serverMessage);
  return true;
}

function showPanelLoading() {
  if (document.getElementById("tutor-panel-loading")) return;
  const loading = document.createElement("div");
  loading.id = "tutor-panel-loading";
  loading.className = "tutor-panel-loading";
  loading.innerHTML = `<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>`;
  document.body.appendChild(loading);
}

function hidePanelLoading() {
  document.getElementById("tutor-panel-loading")?.remove();
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

function startProblemUrlWatcher() {
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

function ensureAuthPrompt(panel: HTMLElement, message?: string) {
  const existing = panel.querySelector<HTMLElement>(".tutor-panel-auth");
  if (existing) {
    if (message) {
      const errorBox = existing.querySelector<HTMLElement>(".auth-error");
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = "block";
      }
    }
    return;
  }
  state.suspendPanelOps = true;
  stopPanelOperations(panel);

  const authBox = document.createElement("div");
  authBox.className = "tutor-panel-auth";
  panel.appendChild(authBox);

  const setupPasswordToggle = (
    input: HTMLInputElement | null,
    toggle: HTMLButtonElement | null,
  ) => {
    if (!input || !toggle) return;
    const update = () => {
      const hidden = input.type === "password";
      toggle.setAttribute(
        "aria-label",
        hidden ? "Show password" : "Hide password",
      );
    };
    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      update();
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    update();
  };

  const applyAuthSuccess = async (userId: string) => {
    const currentUserId = state.currentTutorSession?.userId ?? "";
    const problemName =
      state.currentTutorSession?.problem ?? getProblemTitleFromPage();
    state.suspendPanelOps = false;

    if (currentUserId && currentUserId === userId) {
      state.sessionRestorePending = false;
      unlockPanel(panel);
      authBox.remove();
      scheduleSessionPersist(panel);
      return;
    }

    if (currentUserId && currentUserId !== userId) {
      await saveSessionState(panel, { force: true });
      resetPanelForUser(panel, userId, problemName);
    }

    const stored = await loadSessionState(userId, problemName);
    if (
      stored &&
      isStoredSessionForUser(
        stored,
        userId,
        getCanonicalProblemUrl(window.location.href),
      )
    ) {
      applyStoredSessionToPanel(panel, stored);
      await clearSessionState(userId, stored.state.problem);
      state.pendingStoredSession = null;
    } else if (stored) {
      await clearSessionState(userId, stored.state.problem);
    }

    if (state.currentTutorSession) {
      state.currentTutorSession.userId = userId;
      void initSessionTopicsIfNeeded(state.currentTutorSession);
    }
    state.sessionRestorePending = false;
    unlockPanel(panel);
    authBox.remove();
    scheduleSessionPersist(panel);
  };

  const renderLoginBox = (message?: string) => {
    authBox.innerHTML = `
      <div class="auth-error"></div>
      <h4>Login Required</h4>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <div class="auth-password-wrap">
        <input type="password" class="auth-password" placeholder="password" />
        <button type="button" class="auth-password-toggle" aria-label="Show password">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
            <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z"></path>
            <circle cx="12" cy="12" r="3.5"></circle>
          </svg>
        </button>
      </div>
      <div class="auth-actions">
        <button type="button" class="auth-login">Login</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-signup">Sign up</button>
      </div>
    `;

    const emailInput = authBox.querySelector<HTMLInputElement>(".auth-email");
    const passwordInput =
      authBox.querySelector<HTMLInputElement>(".auth-password");
    const login = authBox.querySelector<HTMLButtonElement>(".auth-login");
    const signup = authBox.querySelector<HTMLButtonElement>(".auth-signup");
    const toggle = authBox.querySelector<HTMLButtonElement>(
      ".auth-password-toggle",
    );
    const errorBox = authBox.querySelector<HTMLElement>(".auth-error");
    if (message && errorBox) {
      errorBox.textContent = message;
      errorBox.style.display = "block";
    }
    const clearError = () => {
      if (!errorBox) return;
      errorBox.style.display = "none";
    };
    emailInput?.addEventListener("input", clearError);
    passwordInput?.addEventListener("input", clearError);
    setupPasswordToggle(passwordInput, toggle);
    login?.addEventListener("click", async () => {
      const email = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value.trim() ?? "";
      if (!email || !password) return;
      const resp = await sendSupabaseLogin({ email, password });
      if (resp?.success === false) {
        if (errorBox) {
          errorBox.textContent = resp.error || "Internal server error";
          errorBox.style.display = "block";
        }
        return;
      }
      if (resp?.userId && resp?.jwt) {
        await applyAuthSuccess(resp.userId);
      } else if (errorBox) {
        errorBox.textContent = "Invalid creds";
        errorBox.style.display = "block";
      }
    });
    signup?.addEventListener("click", () => {
      renderSignupBox();
    });
  };

  const renderSignupBox = () => {
    authBox.innerHTML = `
      <div class="auth-error">Signup failed</div>
      <h4>Create account</h4>
      <div class="auth-name-row">
        <input type="text" class="auth-first-name" placeholder="First name" />
        <input type="text" class="auth-last-name" placeholder="Last name" />
      </div>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <div class="auth-password-wrap">
        <input type="password" class="auth-password" placeholder="password" />
        <button type="button" class="auth-password-toggle" aria-label="Show password">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
            <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z"></path>
            <circle cx="12" cy="12" r="3.5"></circle>
          </svg>
        </button>
      </div>
      <div class="auth-password-hint"></div>
      <div class="auth-actions">
        <button type="button" class="auth-signup-submit">Sign up</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-back">Back to login</button>
      </div>
    `;
    const firstNameInput =
      authBox.querySelector<HTMLInputElement>(".auth-first-name");
    const lastNameInput =
      authBox.querySelector<HTMLInputElement>(".auth-last-name");
    const emailInput = authBox.querySelector<HTMLInputElement>(".auth-email");
    const passwordInput =
      authBox.querySelector<HTMLInputElement>(".auth-password");
    const signupSubmit = authBox.querySelector<HTMLButtonElement>(
      ".auth-signup-submit",
    );
    const toggle = authBox.querySelector<HTMLButtonElement>(
      ".auth-password-toggle",
    );
    const errorBox = authBox.querySelector<HTMLElement>(".auth-error");
    const passwordHint = authBox.querySelector<HTMLElement>(
      ".auth-password-hint",
    );
    const clearError = () => {
      if (!errorBox) return;
      errorBox.style.display = "none";
    };
    firstNameInput?.addEventListener("input", clearError);
    lastNameInput?.addEventListener("input", clearError);
    emailInput?.addEventListener("input", clearError);
    passwordInput?.addEventListener("input", clearError);
    setupPasswordToggle(passwordInput, toggle);
    passwordInput?.addEventListener("blur", () => {
      if (!passwordHint || !passwordInput) return;
      const value = passwordInput.value.trim();
      if (value && !isStrongPassword(value)) {
        passwordHint.textContent =
          "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";
        passwordHint.style.display = "block";
      } else {
        passwordHint.style.display = "none";
      }
    });
    passwordInput?.addEventListener("input", () => {
      if (!passwordHint || !passwordInput) return;
      const value = passwordInput.value.trim();
      if (value && isStrongPassword(value)) {
        passwordHint.style.display = "none";
      }
    });

    signupSubmit?.addEventListener("click", async () => {
      const fname = firstNameInput?.value.trim() ?? "";
      const lname = lastNameInput?.value.trim() ?? "";
      const email = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value.trim() ?? "";
      if (!fname || !lname || !email || !password) return;
      if (!isStrongPassword(password)) {
        if (passwordHint) {
          passwordHint.textContent =
            "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";
          passwordHint.style.display = "block";
        }
        return;
      }
      const resp = await sendSupabaseSignup({ fname, lname, email, password });
      if (resp?.success === false) {
        if (errorBox) {
          errorBox.textContent = resp.error || "Internal server error";
          errorBox.style.display = "block";
        }
        return;
      }
      if (resp?.requiresVerification) {
        renderLoginBox("Waiting for verification, check email");
      } else if (resp?.userId && resp?.jwt) {
        await applyAuthSuccess(resp.userId);
      } else if (errorBox) {
        errorBox.style.display = "block";
      }
    });

    const back = authBox.querySelector<HTMLButtonElement>(".auth-back");
    back?.addEventListener("click", () => {
      renderLoginBox();
    });
  };

  renderLoginBox(message);
}

function closeTutorPanel() {
  if (!state.currentTutorSession?.element) {
    return;
  }
  hideTutorPanel(state.currentTutorSession.element);
  positionWidgetFromPanel(state.currentTutorSession.element);
  showWidget();
  state.isWindowOpen = false;
  scheduleSessionPersist(state.currentTutorSession.element);
}
function highlightExistingPanel(session: HTMLElement) {}

function setupMessageListener() {}

function handleTutorPanelActions() {}

function highlightAskArea() {}

function showAssistantLoading(panel: HTMLElement) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return null;
  const wrapper = document.createElement("div");
  wrapper.className = "tutor-panel-assistant-loading";
  const dot = document.createElement("div");
  dot.className = "tutor-panel-assistant-loading-dot";
  wrapper.appendChild(dot);
  contentArea.appendChild(wrapper);
  contentArea.scrollTop = wrapper.offsetTop;
  return wrapper;
}

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

function appendPanelMessage(
  panel: HTMLElement,
  messageText: string,
  role: "assistant" | "user" | "guideAssistant" | "checkAssistant",
) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return null;
  const message = document.createElement("div");

  if (role === "assistant") {
    message.className = `tutor-panel-message tutor-panel-message--${role}`;
    message.innerHTML = renderMarkdown(messageText);
  } else if (role === "user") {
    message.className = "tutor-panel-message tutor-panel-message--user";
    message.textContent = messageText;
  } else if (role === "guideAssistant") {
    // 1) wrapper: owns borders + spacing
    const wrapper = document.createElement("div");
    wrapper.className = "guide-wrapper";

    // 2) bubble: owns background + padding
    message.className = `tutor-panel-message tutor-panel-message--${role}`;
    message.innerHTML = renderMarkdown(messageText);

    wrapper.appendChild(message);
    contentArea.appendChild(wrapper);

    return wrapper;
  } else if (role === "checkAssistant") {
    const wrapper = document.createElement("div");
    wrapper.className = "check-wrapper";

    message.className = `tutor-panel-message tutor-panel-message--${role}`;
    message.innerHTML = renderMarkdown(messageText);

    wrapper.appendChild(message);
    contentArea.appendChild(wrapper);

    return wrapper; // wrapper gets start/end
  } else {
    message.textContent = messageText;
  }
  contentArea.append(message);
  contentArea.scrollTop = message.offsetTop; // come back to this
  return message;
}

function typeMessage(
  message: HTMLElement,
  contentArea: HTMLElement,
  text: string,
  options?: { render?: (value: string) => string },
) {
  return new Promise<void>((resolve) => {
    let index = 0;
    const step = 2;
    const targetTop = message.offsetTop;
    contentArea.scrollTop = targetTop;
    let allowAutoScroll = true;
    const onScroll = () => {
      if (Math.abs(contentArea.scrollTop - targetTop) > 8) {
        allowAutoScroll = false;
      }
    };
    contentArea.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => {
      index = Math.min(text.length, index + step);
      const slice = text.slice(0, index);
      if (options?.render) {
        message.innerHTML = options.render(slice);
      } else {
        message.textContent = slice;
      }
      if (allowAutoScroll) {
        contentArea.scrollTop = targetTop;
      }
      if (index < text.length) {
        window.setTimeout(tick, 12);
      } else {
        contentArea.removeEventListener("scroll", onScroll);
        resolve();
      }
    };
    tick();
  });
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
