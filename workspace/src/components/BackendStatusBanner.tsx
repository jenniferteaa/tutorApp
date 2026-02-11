"use client";

import { useEffect, useState } from "react";
import {
  getBackendWarmupState,
  subscribeBackendWarmup,
} from "@/lib/backendWarmup";

export default function BackendStatusBanner() {
  const [state, setState] = useState(getBackendWarmupState());

  useEffect(() => {
    return subscribeBackendWarmup(setState);
  }, []);

  if (state.status === "idle") return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2">
      <div className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg">
        {state.message || "Starting up the server..."}
      </div>
    </div>
  );
}
