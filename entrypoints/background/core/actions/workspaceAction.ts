import { BACKEND_BASE_URL } from "../constants";
import { getAuthState, setAuthState } from "../../helpers/authStore";
import { extractErrorMessage, fetchJsonWithTimeout } from "../../helpers/httpClient";
import { setWorkspaceState } from "../../helpers/workspaceState";

export async function handleGoToWorkspace(payload?: { url?: string }) {
  try {
    const url = payload?.url?.trim();
    if (!url) {
      return { success: false, error: "Workspace URL missing" };
    }
    const auth = await getAuthState();
    if (!auth?.accessToken) {
      return { success: false, unauthorized: true };
    }
    const state = crypto.randomUUID();
    await setWorkspaceState(state);
    // Here, the backend uvicorn right, if you run locally, copy that url, and put it as value for BACKEND_BASE_URL
    const result = await fetchJsonWithTimeout<{
      success?: boolean;
      code?: string;
      access_token?: string;
      refresh_token?: string;
      error?: string;
    }>(`${BACKEND_BASE_URL}/api/auth/bridge/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: auth.accessToken,
        refresh_token: auth.refreshToken,
        state,
      }),
    });
    if (!result.success) return result;
    if (result.data?.success === false || !result.data?.code) {
      return {
        success: false,
        status: result.status,
        error: extractErrorMessage(result.data, "Workspace auth bridge failed"),
      };
    }
    if (result.data?.access_token) {
      await setAuthState({
        ...auth,
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token ?? auth.refreshToken,
      });
    }
    const separator = url.includes("?") ? "&" : "?";
    const target = `${url}${separator}code=${encodeURIComponent(
      result.data.code,
    )}&state=${encodeURIComponent(state)}`;
    await browser.tabs.create({ url: target });
    return { success: true };
  } catch (error) {
    console.error("VibeTutor: failed to open workspace", error);
    return { success: false, error: "Unable to open workspace tab" };
  }
}
