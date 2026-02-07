import { state } from "../state";

export type BackendErrorResponse = {
  success: false;
  error?: string;
  status?: number;
  timeout?: boolean;
  unauthorized?: boolean;
};

type ErrorDeps = {
  ensureAuthPrompt: (panel: HTMLElement, message?: string) => void;
  showTutorPanel: (panel: HTMLElement) => void;
  hideWidget: () => void;
  markUserActivity: () => void;
  scheduleSessionPersist: (panel?: HTMLElement | null) => void;
  appendPanelMessage: (
    panel: HTMLElement,
    messageText: string,
    role: "assistant" | "user" | "guideAssistant" | "checkAssistant",
  ) => HTMLElement | null;
  setPanelControlsDisabled: (panel: HTMLElement, disabled: boolean) => void;
};

let errorDeps: ErrorDeps | null = null;

export function configureErrors(next: ErrorDeps) {
  errorDeps = next;
}

function getErrorDeps(): ErrorDeps {
  if (!errorDeps) {
    throw new Error("Error handling dependencies not configured");
  }
  return errorDeps;
}

const SESSION_EXPIRED_MESSAGE = "session expired, please log back in";

export function lockPanel(panel: HTMLElement) {
  const { setPanelControlsDisabled } = getErrorDeps();
  panel.classList.add("tutor-panel-locked");
  setPanelControlsDisabled(panel, true);
}

export function unlockPanel(panel: HTMLElement) {
  const { setPanelControlsDisabled } = getErrorDeps();
  panel.classList.remove("tutor-panel-locked");
  setPanelControlsDisabled(panel, false);
}

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
  const { appendPanelMessage, scheduleSessionPersist } = getErrorDeps();
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return;
  const messageEl = appendPanelMessage(panel, message, "assistant");
  if (!messageEl) return;
  contentArea.scrollTop = messageEl.offsetTop;
  scheduleSessionPersist(panel);
}

export function handleBackendError(
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

  const {
    ensureAuthPrompt,
    hideWidget,
    markUserActivity,
    scheduleSessionPersist,
    showTutorPanel,
  } = getErrorDeps();

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

export function showPanelLoading() {
  if (document.getElementById("tutor-panel-loading")) return;
  const loading = document.createElement("div");
  loading.id = "tutor-panel-loading";
  loading.className = "tutor-panel-loading";
  loading.innerHTML = `<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>`;
  document.body.appendChild(loading);
}

export function hidePanelLoading() {
  document.getElementById("tutor-panel-loading")?.remove();
}
