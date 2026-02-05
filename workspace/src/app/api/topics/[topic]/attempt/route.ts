import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";

type NoteRow = {
  id?: number | null;
  activity?: { user_id?: string | null } | null;
};

function supabaseUrl(path: string, params: Record<string, string>) {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  const url = new URL(`${base}/rest/v1/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

async function supabaseFetch<T>(
  path: string,
  params: Record<string, string>,
  token: string,
) {
  const url = supabaseUrl(path, params);
  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }
  const res = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Supabase request failed: ${res.status}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

async function supabaseDelete(
  path: string,
  params: Record<string, string>,
  token: string,
) {
  const url = supabaseUrl(path, params);
  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Supabase delete failed: ${res.status}`);
  }
  return res.json();
}

function buildInFilter(ids: number[]) {
  return `in.(${ids.join(",")})`;
}

export async function DELETE(req: Request) {
  const session = await getAuthSession();
  if (!session?.token || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { noteIds?: number[] } | null = null;
  try {
    payload = (await req.json()) as { noteIds?: number[] };
  } catch {
    payload = null;
  }

  const noteIds =
    payload?.noteIds?.filter((id) => Number.isFinite(id)) ?? [];
  if (noteIds.length === 0) {
    return NextResponse.json(
      { error: "Missing noteIds" },
      { status: 400 },
    );
  }

  const noteRows = await supabaseFetch<NoteRow[]>(
    "notes",
    {
      select: "id,activity(user_id)",
      id: buildInFilter(noteIds),
    },
    session.token,
  );

  const allowedNoteIds = noteRows
    .filter((row) => row.activity?.user_id === session.userId)
    .map((row) => row.id)
    .filter((id): id is number => typeof id === "number");

  if (allowedNoteIds.length === 0) {
    return NextResponse.json(
      { error: "No matching notes" },
      { status: 404 },
    );
  }

  const filter = buildInFilter(allowedNoteIds);
  await supabaseDelete(
    "topic_notes",
    { note_id: filter },
    session.token,
  );
  await supabaseDelete("notes", { id: filter }, session.token);

  return NextResponse.json({ success: true, noteIds: allowedNoteIds });
}
