import "server-only";

import { cookies } from "next/headers";

const AUTH_COOKIE = "workspace_access_token";

export type AuthSession = {
  token: string;
  userId: string;
  email?: string | null;
  exp?: number | null;
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = Buffer.from(parts[1], "base64").toString("utf8");
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value ?? null;
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const userId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!userId) return null;
  const email = typeof payload?.email === "string" ? payload.email : null;
  const exp = typeof payload?.exp === "number" ? payload.exp : null;
  return { token, userId, email, exp };
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  const payload = decodeJwtPayload(token);
  const exp = typeof payload?.exp === "number" ? payload.exp : null;
  const now = Math.floor(Date.now() / 1000);
  const maxAge = exp && exp > now ? exp - now : undefined;
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  });
}

export async function clearAuthUser() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
