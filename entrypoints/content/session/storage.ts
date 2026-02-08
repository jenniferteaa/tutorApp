import {
  getCanonicalProblemUrl,
  getEditorLanguageFromPage,
  getProblemTitleFromPage,
} from "../leetcode";
import { state, type TutorSession } from "../state";

export type StoredAuth = {
  userId: string;
  jwt: string;
  accessToken?: string;
  issuedAt?: number;
  expiresAt?: number;
};

export type StoredTutorState = {
  userId: string;
  problem: string;
  problemUrl?: string;
  [key: string]: unknown;
};

export type StoredTutorSession = {
  state: StoredTutorState;
  panelOpen: boolean;
  contentHtml: string;
  contentScrollTop?: number;
  lastActivityAt: number;
};

export const AUTH_STORAGE_KEY = "vibetutor-auth";
export const SESSION_STORAGE_KEY = "vibetutor-session";
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const SESSION_CLEANUP_INTERVAL_MS = 30 * 60 * 1000;
export const SESSION_KEY_PREFIX = `${SESSION_STORAGE_KEY}:`;

let cleanupTimerId: number | null = null;
let authStorageListenerAttached = false;

export function getSessionStorageKey(
  userId: string,
  problemName: string,
): string {
  return `${SESSION_STORAGE_KEY}:${encodeURIComponent(
    userId,
  )}:${encodeURIComponent(problemName)}`;
}

export async function loadAuthFromStorage() {
  const stored = await browser.storage.local.get(AUTH_STORAGE_KEY);
  return (stored[AUTH_STORAGE_KEY] as StoredAuth | undefined) ?? null;
}

export function isAuthExpired(auth: StoredAuth | null) {
  //if (!auth) return false;
  if (!auth?.expiresAt) return false;
  return Date.now() > auth.expiresAt;
}

export async function clearAuthFromStorage() {
  await browser.storage.local.remove(AUTH_STORAGE_KEY);
  await browser.runtime.sendMessage({ action: "clear-auth" });
}

export async function loadSessionState(userId: string, problemName: string) {
  const storageKey = getSessionStorageKey(userId, problemName);
  const stored = await browser.storage.local.get(storageKey);
  const session =
    (stored[storageKey] as StoredTutorSession | undefined) ?? null;
  if (!session) return null;
  const ageMs = Date.now() - (session.lastActivityAt ?? 0);
  if (ageMs > SESSION_TTL_MS) {
    await browser.storage.local.remove(storageKey);
    return null;
  }
  return session;
}

export async function clearSessionState(userId: string, problemName: string) {
  const storageKey = getSessionStorageKey(userId, problemName);
  await browser.storage.local.remove(storageKey);
}

export async function cleanupExpiredSessions() {
  const stored = await browser.storage.local.get(null);
  const now = Date.now();
  const toRemove: string[] = [];
  for (const [key, value] of Object.entries(stored)) {
    if (!key.startsWith(SESSION_KEY_PREFIX)) continue;
    const session = value as StoredTutorSession | undefined;
    const lastActivity = session?.lastActivityAt ?? 0;
    if (now - lastActivity > SESSION_TTL_MS) {
      toRemove.push(key);
    }
  }
  if (toRemove.length > 0) {
    await browser.storage.local.remove(toRemove);
  }
}

export function startSessionCleanupSweep() {
  void cleanupExpiredSessions();
  if (cleanupTimerId) {
    window.clearInterval(cleanupTimerId);
  }
  cleanupTimerId = window.setInterval(() => {
    void cleanupExpiredSessions();
  }, SESSION_CLEANUP_INTERVAL_MS);
}

export function watchAuthStorageCleared(onCleared: () => void) {
  if (authStorageListenerAttached) return;
  authStorageListenerAttached = true;
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    const authChange = changes[AUTH_STORAGE_KEY];
    if (authChange && authChange.newValue == null) {
      onCleared();
    }
  });
}

export function isStoredSessionForUser(
  stored: StoredTutorSession,
  userId: string,
  canonicalUrl: string,
): boolean {
  if (!stored.state.userId) {
    console.log("There was no stored user in the browser.");
    return false;
  }
  if (stored.state.userId !== userId) {
    console.log(
      "The stored user earlier is different from the one logging in now.",
    );
    return false;
  }
  return stored.state.problemUrl === canonicalUrl;
}

export async function saveSessionState(
  panel?: HTMLElement | null,
  options?: { force?: boolean },
) {
  if (!state.currentTutorSession) return;
  if (!state.currentTutorSession.userId) return;
  if (state.sessionRestorePending && !options?.force) return;
  const contentArea =
    panel?.querySelector<HTMLElement>(".tutor-panel-content") ??
    state.currentTutorSession.element?.querySelector<HTMLElement>(
      ".tutor-panel-content",
    );
  const storageKey = getSessionStorageKey(
    state.currentTutorSession.userId,
    state.currentTutorSession.problem,
  );
  const stored: StoredTutorSession = {
    state: {
      sessionId: state.currentTutorSession.sessionId,
      userId: state.currentTutorSession.userId,
      content: state.currentTutorSession.content,
      sessionTopicsInitialized:
        state.currentTutorSession.sessionTopicsInitialized,
      language: state.currentTutorSession.language,
      problem: state.currentTutorSession.problem,
      problemUrl: state.currentTutorSession.problemUrl,
      topics: state.currentTutorSession.topics,
      prompt: state.currentTutorSession.prompt,
      position: state.currentTutorSession.position,
      size: state.currentTutorSession.size,
      guideModeEnabled: state.currentTutorSession.guideModeEnabled,
      checkModeEnabled: state.currentTutorSession.checkModeEnabled,
      rollingStateGuideMode: state.currentTutorSession.rollingStateGuideMode,
      sessionRollingHistory: state.currentTutorSession.sessionRollingHistory,
    },
    panelOpen: state.isWindowOpen,
    contentHtml: contentArea?.innerHTML ?? "",
    contentScrollTop: contentArea?.scrollTop ?? 0,
    lastActivityAt: state.lastActivityAt,
  };
  await browser.storage.local.set({ [storageKey]: stored });
}

export function scheduleSessionPersist(panel?: HTMLElement | null) {
  if (state.sessionRestorePending) return;
  if (state.persistTimerId) return;
  state.persistTimerId = window.setTimeout(() => {
    state.persistTimerId = null;
    void saveSessionState(panel);
  }, 500);
}

export function applyStoredSessionToPanel(
  panel: HTMLElement,
  stored: StoredTutorSession,
) {
  state.currentTutorSession = {
    ...(stored.state as Omit<TutorSession, "element">),
    element: panel,
  };
  if (state.currentTutorSession && !state.currentTutorSession.language) {
    state.currentTutorSession.language = getEditorLanguageFromPage();
  }
  if (
    state.currentTutorSession &&
    state.currentTutorSession.sessionTopicsInitialized == null
  ) {
    state.currentTutorSession.sessionTopicsInitialized = false;
  }
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (contentArea) {
    contentArea.innerHTML = stored.contentHtml || "";
    requestAnimationFrame(() => {
      contentArea.scrollTop = contentArea.scrollHeight;
    });
  }
  const prompt = panel.querySelector<HTMLTextAreaElement>(
    ".tutor-panel-prompt",
  );
  if (prompt) {
    prompt.value = state.currentTutorSession.prompt ?? "";
  }
  if (state.currentTutorSession.position) {
    panel.style.left = `${state.currentTutorSession.position.x}px`;
    panel.style.top = `${state.currentTutorSession.position.y}px`;
  }
  if (state.currentTutorSession.size) {
    panel.style.width = `${state.currentTutorSession.size.width}px`;
    panel.style.height = `${state.currentTutorSession.size.height}px`;
  }
  const guideSlabs = panel.querySelectorAll<HTMLElement>(
    ".guide-wrapper.guide-slab",
  );
  if (guideSlabs.length > 0) {
    const guideSlab = guideSlabs[guideSlabs.length - 1];
    const items = guideSlab.querySelectorAll(".guide-item");
    state.guideMessageCount = items.length;
    state.lastGuideMessageEl = guideSlab;
    state.guideActiveSlab = state.currentTutorSession?.guideModeEnabled
      ? guideSlab
      : null;
  } else {
    const guideWrappers = panel.querySelectorAll(".guide-wrapper");
    state.guideMessageCount = guideWrappers.length;
    state.lastGuideMessageEl =
      guideWrappers.length > 0
        ? (guideWrappers[guideWrappers.length - 1] as HTMLElement)
        : null;
    state.guideActiveSlab = null;
  }
}

export async function hydrateStoredSessionCache() {
  const auth = await loadAuthFromStorage();
  if (!auth?.userId) {
    state.pendingStoredSession = null;
    return;
  }
  const stored = await loadSessionState(auth.userId, getProblemTitleFromPage());
  if (!stored) {
    state.pendingStoredSession = null;
    return;
  }
  if (
    !isStoredSessionForUser(
      stored,
      auth.userId,
      getCanonicalProblemUrl(window.location.href),
    )
  ) {
    await clearSessionState(auth.userId, stored.state.problem);
    state.pendingStoredSession = null;
    return;
  }
  state.pendingStoredSession = stored;
  state.lastActivityAt = stored.lastActivityAt ?? Date.now();
}
