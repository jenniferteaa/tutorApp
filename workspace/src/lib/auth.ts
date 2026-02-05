import "server-only";

import { cookies } from "next/headers";

const AUTH_COOKIE = "workspace_access_token";
const REFRESH_COOKIE = "workspace_refresh_token";

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
  if (!userId) {
    cookieStore.delete(AUTH_COOKIE);
    return null;
  }
  const email = typeof payload?.email === "string" ? payload.email : null;
  const exp = typeof payload?.exp === "number" ? payload.exp : null;
  const now = Math.floor(Date.now() / 1000);
  if (exp && exp <= now) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      cookieStore.delete(AUTH_COOKIE);
      cookieStore.delete(REFRESH_COOKIE);
      return null;
    }
    return refreshed;
  }
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

export async function setRefreshToken(token: string | null) {
  const cookieStore = await cookies();
  if (!token) {
    cookieStore.delete(REFRESH_COOKIE);
    return;
  }
  cookieStore.set(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAuthUser() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

async function refreshAccessToken(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value ?? null;
  if (!refreshToken) return null;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnon = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) return null;

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnon,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    cookieStore.delete(REFRESH_COOKIE);
    return null;
  }
  const data = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
  };
  if (!data.access_token) {
    cookieStore.delete(REFRESH_COOKIE);
    return null;
  }
  await setAuthToken(data.access_token);
  if (data.refresh_token) {
    await setRefreshToken(data.refresh_token);
  }
  const payload = decodeJwtPayload(data.access_token);
  const userId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!userId) return null;
  const email = typeof payload?.email === "string" ? payload.email : null;
  const exp = typeof payload?.exp === "number" ? payload.exp : null;
  return { token: data.access_token, userId, email, exp };
}
