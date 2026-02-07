import { detachGuideListeners, resetGuideState } from "../guide";
import {
  clearAuthFromStorage,
  loadAuthFromStorage,
  saveSessionState,
  scheduleSessionPersist,
} from "./storage";
import { ensureAuthPrompt } from "../auth/overlay";
import { state } from "../state";

type ActivityDeps = {
  lockPanel: (panel: HTMLElement) => void;
};

let activityDeps: ActivityDeps | null = null;

export function configureActivity(next: ActivityDeps) {
  activityDeps = next;
}

function getActivityDeps(): ActivityDeps {
  if (!activityDeps) {
    throw new Error("Activity dependencies not configured");
  }
  return activityDeps;
}

//const INACTIVITY_MS = 1 * 60 * 1000; // 57,600,000
const INACTIVITY_MS = 16 * 60 * 60 * 1000; // 57,600,000
const ACTIVITY_PERSIST_INTERVAL_MS = 15000;

export function markUserActivity() {
  state.lastActivityAt = Date.now();
  if (Date.now() - state.lastActivityStoredAt > ACTIVITY_PERSIST_INTERVAL_MS) {
    state.lastActivityStoredAt = Date.now();
    scheduleSessionPersist();
  }
}

async function logoutForInactivity() {
  const { lockPanel } = getActivityDeps();

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

export function setupActivityTracking() {
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

export function stopPanelOperations(panel: HTMLElement) {
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
