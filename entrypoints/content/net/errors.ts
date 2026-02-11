import { state } from "../state";
import { sendBackendHealthCheck } from "../messaging";

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

const SESSION_EXPIRED_MESSAGE = "Session expired, please log back in";
const SERVER_STARTING_MESSAGE = "Starting up the server...";
const SERVER_READY_MESSAGE = "Server is back. You can continue.";
const HEALTH_POLL_INTERVAL_MS = 3000;
const HEALTH_POLL_MAX_ATTEMPTS = 20;

let healthCheckInFlight = false;

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

function isNetworkFailure(response: BackendErrorResponse) {
  return Boolean(response.error && /network/i.test(response.error));
}

async function handleBackendTimeout(panel: HTMLElement, timeoutMessage?: string) {
  if (healthCheckInFlight) return;
  healthCheckInFlight = true;
  try {
    const initialHealth = await sendBackendHealthCheck();
    if (initialHealth?.success) {
      appendSystemMessage(
        panel,
        timeoutMessage ??
          "The model is taking longer than usual. Please try again.",
      );
      return;
    }

    appendSystemMessage(panel, SERVER_STARTING_MESSAGE);

    for (let attempt = 0; attempt < HEALTH_POLL_MAX_ATTEMPTS; attempt += 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, HEALTH_POLL_INTERVAL_MS),
      );
      const health = await sendBackendHealthCheck();
      if (health?.success) {
        appendSystemMessage(panel, SERVER_READY_MESSAGE);
        return;
      }
    }
  } finally {
    healthCheckInFlight = false;
  }
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

  if (options?.silent) {
    console.debug("Silent backend error", response);
    return true;
  }

  if (response.timeout || isNetworkFailure(response)) {
    void handleBackendTimeout(target, options?.timeoutMessage);
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
