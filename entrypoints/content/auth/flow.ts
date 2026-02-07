import { getCanonicalProblemUrl, getProblemTitleFromPage } from "../leetcode";
import { sendSupabaseLogin, sendSupabaseSignup } from "../messaging";
import {
  applyStoredSessionToPanel,
  clearSessionState,
  isStoredSessionForUser,
  loadSessionState,
  saveSessionState,
  scheduleSessionPersist,
} from "../session/storage";
import { state, type TutorSession } from "../state";
import {
  initSessionTopicsIfNeeded,
  resetPanelForUser,
} from "./sessionSwitch";

export type AuthSuccessDeps = {
  unlockPanel: (panel: HTMLElement) => void;
};

export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (/\s/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

export async function loginWithCredentials(email: string, password: string) {
  return sendSupabaseLogin({ email, password });
}

export async function signupWithCredentials(payload: {
  fname: string;
  lname: string;
  email: string;
  password: string;
}) {
  return sendSupabaseSignup(payload);
}

export async function applyAuthSuccess(
  panel: HTMLElement,
  authBox: HTMLElement,
  userId: string,
  deps: AuthSuccessDeps,
) {
  const currentUserId = state.currentTutorSession?.userId ?? "";
  const problemName =
    state.currentTutorSession?.problem ?? getProblemTitleFromPage();
  state.suspendPanelOps = false;

  if (currentUserId && currentUserId === userId) {
    state.sessionRestorePending = false;
    deps.unlockPanel(panel);
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
    void initSessionTopicsIfNeeded(state.currentTutorSession as TutorSession);
  }
  state.sessionRestorePending = false;
  deps.unlockPanel(panel);
  authBox.remove();
  scheduleSessionPersist(panel);
}
