"use client";

import { useActionState, useState } from "react";

type AuthState = { error?: string; message?: string };

type LoginFormProps = {
  loginAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>;
  registerAction: (
    prevState: AuthState,
    formData: FormData,
  ) => Promise<AuthState>;
};

const emptyState: AuthState = {};

export default function LoginForm({
  loginAction,
  registerAction,
}: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, submitLogin] = useActionState(loginAction, emptyState);
  const [registerState, submitRegister] = useActionState(
    registerAction,
    emptyState,
  );

  const activeState = mode === "login" ? loginState : registerState;

  return (
    <div className="w-full max-w-md rounded-3xl border border-black/20 bg-white/85 p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600">
            VibeTutor Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {mode === "login"
              ? "Enter your email and password to access your workspace."
              : "Fill in your details to create a workspace account."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-black/15 bg-white/70 p-1 text-xs">
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

      {activeState?.error ? (
        <div className="mb-1 text-center px-4 py-3 text-sm text-rose-700">
          {activeState.error}
        </div>
      ) : null}
      {activeState?.message ? (
        <div className="mb-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-700">
          {activeState.message}
        </div>
      ) : null}

      {mode === "login" ? (
        <form action={submitLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black/40"
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
              className="mt-2 w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black/40"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
          >
            Continue
          </button>
        </form>
      ) : (
        <form action={submitRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                First name
              </label>
              <input
                name="fname"
                type="text"
                placeholder="Jane"
                className="mt-2 w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black/40"
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
                className="mt-2 w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black/40"
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
              className="mt-2 w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black/40"
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
              className="mt-2 w-full rounded-2xl border border-black/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-black/40"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
          >
            Sign up
          </button>
        </form>
      )}
    </div>
  );
}
