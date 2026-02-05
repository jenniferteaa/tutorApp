import { NextRequest, NextResponse } from "next/server";

import { setAuthToken, setRefreshToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!state) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const backendBase =
    process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${backendBase}/api/auth/bridge/consume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, state }),
    cache: "no-store",
  });
  if (!response.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const data = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
  };
  if (!data.access_token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  await setAuthToken(data.access_token);
  if (data.refresh_token) {
    await setRefreshToken(data.refresh_token);
  }
  const redirectTo =
    request.nextUrl.searchParams.get("redirect") || "/workspace";
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
