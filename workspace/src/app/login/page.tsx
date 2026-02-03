import { redirect } from "next/navigation";

import { setAuthToken } from "@/lib/auth";

import LoginForm from "@/app/login/ui/LoginForm";

type AuthState = { error?: string; message?: string };

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

async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  if (!email || !password) {
    return { error: "Invalid creds" };
  }
  const backendBase = process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${backendBase}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!response.ok) {
    return { error: "Invalid creds" };
  }
  const data = (await response.json()) as {
    success?: boolean;
    accessToken?: string;
    access_token?: string;
  };
  const token = data.accessToken || data.access_token;
  if (!data?.success || !token) {
    return { error: "Invalid creds" };
  }
  await setAuthToken(token);
  redirect("/workspace");
}

async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  "use server";
  const fname = String(formData.get("fname") || "").trim();
  const lname = String(formData.get("lname") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  if (!fname || !lname || !email || !password) {
    return { error: "Signup failed" };
  }
  if (!isStrongPassword(password)) {
    return { error: passwordHintText };
  }
  const backendBase = process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${backendBase}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fname, lname, email, password }),
    cache: "no-store",
  });
  if (!response.ok) {
    return { error: "Signup failed" };
  }
  const data = (await response.json()) as {
    success?: boolean;
    requiresVerification?: boolean;
    accessToken?: string;
    access_token?: string;
  };
  if (data?.requiresVerification) {
    return { message: "Waiting for verification, check email" };
  }
  const token = data.accessToken || data.access_token;
  if (!data?.success || !token) {
    return { error: "Signup failed" };
  }
  await setAuthToken(token);
  redirect("/workspace");
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(200,208,204)] px-6 text-slate-900">
      <LoginForm loginAction={loginAction} registerAction={registerAction} />
    </div>
  );
}
