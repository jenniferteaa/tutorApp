"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type AuthState = { error?: string; message?: string };

type LoginFormProps = {
  loginAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>;
  registerAction: (
    prevState: AuthState,
    formData: FormData,
  ) => Promise<AuthState>;
  backendBase: string;
};

const emptyState: AuthState = {};
const passwordHintText =
  "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";

function isStrongPassword(password: string) {
  if (password.length < 8) return false;
  if (/\s/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

export default function LoginForm({
  loginAction,
  registerAction,
  backendBase,
}: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, submitLogin] = useActionState(loginAction, emptyState);
  const [registerState, submitRegister] = useActionState(
    registerAction,
    emptyState,
  );
  const [registerPasswordError, setRegisterPasswordError] = useState<
    string | null
  >(null);
  const [isStartingServer, setIsStartingServer] = useState(false);
  const [serverStartError, setServerStartError] = useState<string | null>(null);
  const allowSubmitRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeState = mode === "login" ? loginState : registerState;
  const normalizedBackendBase = backendBase.replace(/\/$/, "");
  const HEALTH_POLL_INTERVAL_MS = 5000;
  const HEALTH_POLL_MAX_ATTEMPTS = 24;

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  const checkBackendHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${normalizedBackendBase}/health`, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  };

  const waitForBackendAndSubmit = async (form: HTMLFormElement) => {
    if (isStartingServer) return;
    setServerStartError(null);
    setIsStartingServer(true);
    let attempts = 0;

    const isHealthy = await checkBackendHealth();
    if (isHealthy) {
      setIsStartingServer(false);
      allowSubmitRef.current = true;
      form.requestSubmit();
      return;
    }

    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }

    pollTimerRef.current = setInterval(async () => {
      const healthy = await checkBackendHealth();
      if (healthy) {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        setIsStartingServer(false);
        setServerStartError(null);
        allowSubmitRef.current = true;
        form.requestSubmit();
        return;
      }
      attempts += 1;
      if (attempts >= HEALTH_POLL_MAX_ATTEMPTS) {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        setIsStartingServer(false);
        setServerStartError(
          "Server is taking longer than usual. Please try again.",
        );
      }
    }, HEALTH_POLL_INTERVAL_MS);
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (allowSubmitRef.current) {
      allowSubmitRef.current = false;
      return;
    }
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.querySelector<HTMLInputElement>('input[name="email"]')
      ?.value.trim();
    const password = form.querySelector<HTMLInputElement>(
      'input[name="password"]',
    )?.value.trim();
    if (!email || !password) {
      allowSubmitRef.current = true;
      form.requestSubmit();
      return;
    }
    await waitForBackendAndSubmit(form);
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (allowSubmitRef.current) {
      allowSubmitRef.current = false;
      return;
    }
    const form = event.currentTarget;
    const fname = form.querySelector<HTMLInputElement>('input[name="fname"]')
      ?.value.trim();
    const lname = form.querySelector<HTMLInputElement>('input[name="lname"]')
      ?.value.trim();
    const email = form.querySelector<HTMLInputElement>('input[name="email"]')
      ?.value.trim();
    const passwordInput = form.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );
    const value = passwordInput?.value.trim() ?? "";
    if (!fname || !lname || !email || !value) {
      allowSubmitRef.current = true;
      form.requestSubmit();
      return;
    }
    if (value && !isStrongPassword(value)) {
      event.preventDefault();
      setRegisterPasswordError(passwordHintText);
      return;
    }

    event.preventDefault();
    await waitForBackendAndSubmit(form);
  };

  return (
    <div className="w-full rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
            VibeTutor Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-2 text-base text-slate-600">
            {mode === "login"
              ? "Enter your email and password to access your workspace."
              : "Fill in your details to create a workspace account."}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-3 py-1 transition ${
              mode === "login"
                ? "bg-black/10 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-3 py-1 transition ${
              mode === "register"
                ? "bg-black/10 text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {isStartingServer ? (
        <div className="mb-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
          Starting up the server...
        </div>
      ) : null}

      {serverStartError ? (
        <div className="mb-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {serverStartError}
        </div>
      ) : null}
      {activeState?.error ? (
        <div className="mb-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {activeState.error}
        </div>
      ) : null}
      {activeState?.message ? (
        <div className="mb-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-700">
          {activeState.message}
        </div>
      ) : null}

      {mode === "login" ? (
        <form
          action={submitLogin}
          className="space-y-4"
          onSubmit={handleLoginSubmit}
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400"
            />
          </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-4 py-3 text-base font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isStartingServer}
            >
              Continue
            </button>
        </form>
      ) : (
        <form
          action={submitRegister}
          className="space-y-4"
          onSubmit={handleRegisterSubmit}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                First name
              </label>
              <input
                name="fname"
                type="text"
                placeholder="Jane"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Last name
              </label>
              <input
                name="lname"
                type="text"
                placeholder="Doe"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-slate-400"
              onBlur={(event) => {
                const value = event.currentTarget.value.trim();
                if (value && !isStrongPassword(value)) {
                  setRegisterPasswordError(passwordHintText);
                } else {
                  setRegisterPasswordError(null);
                }
              }}
              onChange={(event) => {
                const value = event.currentTarget.value.trim();
                if (registerPasswordError && isStrongPassword(value)) {
                  setRegisterPasswordError(null);
                }
              }}
            />
            {registerPasswordError ? (
              <p className="mt-2 text-sm text-rose-600">
                {registerPasswordError}
              </p>
            ) : null}
          </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-4 py-3 text-base font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isStartingServer}
            >
              Sign up
            </button>
        </form>
      )}
    </div>
  );
}
