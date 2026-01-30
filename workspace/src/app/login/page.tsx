import { redirect } from "next/navigation";

import { setAuthToken } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  if (!email || !password) {
    return;
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return;
  }
  const baseUrl = supabaseUrl.endsWith("/")
    ? supabaseUrl.slice(0, -1)
    : supabaseUrl;
  const response = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!response.ok) {
    return;
  }
  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    return;
  }
  if (data)
    //console.log("This is the data receieved from supabase: ", data); // from this we get the user details, like the uuid, JWT and authenticated status
    await setAuthToken(data.access_token);
  redirect("/workspace");
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <form
        action={loginAction}
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl"
      >
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            VibeTutor Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and password to access your workspace.
          </p>
        </div>

        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-amber-400"
        />

        <label className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-amber-400"
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
