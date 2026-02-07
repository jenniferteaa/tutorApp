import { REQUEST_TIMEOUT_MS } from "../core/constants";
import type { BackendFetchError, BackendFetchSuccess } from "../core/types";

export function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as {
    error?: unknown;
    detail?: unknown;
    message?: unknown;
  };
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
  if (typeof data.message === "string" && data.message.trim())
    return data.message;
  return fallback;
}

export async function fetchJsonWithTimeout<T>(
  url: string,
  options: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<BackendFetchSuccess<T> | BackendFetchError> {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const text = await response.text();
    let data: T | null = null;
    try {
      data = text ? (JSON.parse(text) as T) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        unauthorized: response.status === 401 || response.status === 403,
        error: extractErrorMessage(data ?? text, "Request failed"),
      };
    }

    return { success: true, data: data ?? ({} as T), status: response.status };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "Request timed out", timeout: true };
    }
    return { success: false, error: "Network request failed" };
  } finally {
    clearTimeout(timerId);
  }
}
