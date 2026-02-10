"use client";

import { useEffect, useMemo, useState } from "react";

type BackendStatus = "idle" | "starting" | "ready";

type BackendStatusBannerProps = {
  backendBase: string;
};

const HEALTH_POLL_INTERVAL_MS = 3000;
const HEALTH_POLL_TIMEOUT_MS = 3000;
const HEALTH_POLL_MAX_ATTEMPTS = 20;

export default function BackendStatusBanner({
  backendBase,
}: BackendStatusBannerProps) {
  const base = useMemo(
    () => backendBase.replace(/\/$/, ""),
    [backendBase],
  );
  const [status, setStatus] = useState<BackendStatus>("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!base) return;
    let cancelled = false;
    let attempts = 0;
    let hadFailure = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          HEALTH_POLL_TIMEOUT_MS,
        );
        const res = await fetch(`${base}/health`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (cancelled) return;
        if (res.ok) {
          if (hadFailure) {
            setStatus("ready");
            setVisible(true);
            timer = setTimeout(() => {
              if (!cancelled) setVisible(false);
            }, 4000);
          }
          return;
        }
      } catch {
        // swallow, we'll mark as starting below
      }

      if (cancelled) return;
      hadFailure = true;
      setStatus("starting");
      setVisible(true);
      attempts += 1;
      if (attempts < HEALTH_POLL_MAX_ATTEMPTS) {
        timer = setTimeout(checkHealth, HEALTH_POLL_INTERVAL_MS);
      }
    };

    void checkHealth();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [base]);

  if (!visible) return null;

  const message =
    status === "starting"
      ? "Starting up the server..."
      : "Server is back. You can continue.";

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2">
      <div className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg">
        {message}
      </div>
    </div>
  );
}
