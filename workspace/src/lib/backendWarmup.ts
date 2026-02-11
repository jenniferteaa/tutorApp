type BackendWarmupStatus = "idle" | "starting" | "ready" | "error";

type BackendWarmupState = {
  status: BackendWarmupStatus;
  message?: string;
};

type BackendWarmupOptions = {
  intervalMs?: number;
  timeoutMs?: number;
  maxAttempts?: number;
};

const listeners = new Set<(state: BackendWarmupState) => void>();
let state: BackendWarmupState = { status: "idle" };
let warmupPromise: Promise<boolean> | null = null;
let readyTimer: ReturnType<typeof setTimeout> | null = null;

function setState(next: BackendWarmupState) {
  state = next;
  for (const listener of listeners) {
    listener(state);
  }
}

export function getBackendWarmupState() {
  return state;
}

export function subscribeBackendWarmup(
  listener: (state: BackendWarmupState) => void,
) {
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
  };
}

async function pingBackend(base: string, timeoutMs: number) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${base}/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

function showReadyMessage() {
  if (readyTimer) clearTimeout(readyTimer);
  setState({
    status: "ready",
    message: "Server is back. You can continue.",
  });
  readyTimer = setTimeout(() => {
    setState({ status: "idle" });
  }, 4000);
}

export async function ensureBackendReady(
  backendBase: string,
  options: BackendWarmupOptions = {},
) {
  const base = backendBase.replace(/\/$/, "");
  if (!base) return true;

  if (warmupPromise) return warmupPromise;

  const intervalMs = options.intervalMs ?? 5000;
  const timeoutMs = options.timeoutMs ?? 3000;
  const maxAttempts = options.maxAttempts ?? 24;

  warmupPromise = (async () => {
    const healthy = await pingBackend(base, timeoutMs);
    if (healthy) return true;

    setState({
      status: "starting",
      message: "Starting up the server...",
    });

    let attempts = 0;
    return await new Promise<boolean>((resolve) => {
      const timer = setInterval(async () => {
        const ok = await pingBackend(base, timeoutMs);
        if (ok) {
          clearInterval(timer);
          showReadyMessage();
          resolve(true);
          return;
        }
        attempts += 1;
        if (attempts >= maxAttempts) {
          clearInterval(timer);
          setState({
            status: "error",
            message: "Server is taking longer than usual. Please try again.",
          });
          resolve(false);
        }
      }, intervalMs);
    });
  })();

  const result = await warmupPromise;
  warmupPromise = null;
  return result;
}
