import { clearAuthState, setAuthState } from "../../helpers/authStore";
import {
  extractErrorMessage,
  fetchJsonWithTimeout,
} from "../../helpers/httpClient";
import { AUTH_TOKEN_TTL_MS, BACKEND_BASE_URL } from "../constants";

export async function handleClearAuth() {
  await clearAuthState();
  return { success: true };
}

export async function supabaseLogin(payload: {
  email: string;
  password: string;
}) {
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    token?: string;
    userId?: string;
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    refresh_token?: string;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });
  if (!result.success) return result;
  if (result.success) {
    console.log("this is the response for login: ", result);
  }
  if (
    result.data?.success === false ||
    !result.data?.token ||
    !result.data?.userId
  ) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Invaliddd creds"),
    };
  }
  const now = Date.now();
  const auth = {
    userId: result.data.userId as string,
    jwt: result.data.token as string,
    accessToken:
      (result.data.accessToken as string | undefined) ??
      (result.data.access_token as string | undefined),
    refreshToken:
      (result.data.refreshToken as string | undefined) ??
      (result.data.refresh_token as string | undefined),
    issuedAt: now,
    expiresAt: now + AUTH_TOKEN_TTL_MS,
  };
  await setAuthState(auth);
  return {
    success: true,
    ...auth,
  };
}

export async function supabaseSignup(payload: {
  fname: string;
  lname: string;
  email: string;
  password: string;
}) {
  const result = await fetchJsonWithTimeout<{
    success?: boolean;
    token?: string;
    userId?: string;
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    refresh_token?: string;
    error?: string;
  }>(`${BACKEND_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fname: payload.fname,
      lname: payload.lname,
      email: payload.email,
      password: payload.password,
    }),
  });
  if (!result.success) return result;
  if (
    result.data?.success === false ||
    !result.data?.token ||
    !result.data?.userId
  ) {
    return {
      success: false,
      status: result.status,
      error: extractErrorMessage(result.data, "Signup failed"),
    };
  }
  const now = Date.now();
  const auth = {
    userId: result.data.userId as string,
    jwt: result.data.token as string,
    accessToken:
      (result.data.accessToken as string | undefined) ??
      (result.data.access_token as string | undefined),
    refreshToken:
      (result.data.refreshToken as string | undefined) ??
      (result.data.refresh_token as string | undefined),
    issuedAt: now,
    expiresAt: now + AUTH_TOKEN_TTL_MS,
  };
  await setAuthState(auth);
  return {
    success: true,
    token: auth.jwt,
    userId: auth.userId,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  };
}
