import { AUTH_STORAGE_KEY } from "../core/constants";
import type { AuthState } from "../core/types";

let authCache: AuthState | null = null;

export function isAuthExpired(auth: AuthState | null) {
  if (!auth?.expiresAt) return false;
  return Date.now() > auth.expiresAt;
}

export async function setAuthState(payload: AuthState) {
  authCache = payload;
  await browser.storage.local.set({ [AUTH_STORAGE_KEY]: payload });
}

export async function clearAuthState() {
  authCache = null;
  await browser.storage.local.remove(AUTH_STORAGE_KEY);
}

export async function getAuthState() {
  if (authCache) {
    if (isAuthExpired(authCache)) {
      await clearAuthState();
      return null;
    }
    return authCache;
  }
  const stored = await browser.storage.local.get(AUTH_STORAGE_KEY);
  authCache = (stored[AUTH_STORAGE_KEY] as AuthState | undefined) ?? null;
  if (isAuthExpired(authCache)) {
    await clearAuthState();
    return null;
  }
  return authCache;
}
