import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";

type TopicRow = { id: number; topic_name?: string | null };
type SummaryRow = {
  notes_summary?: string | null;
  pitfalls_summary?: string | null;
  updated_at?: string | null;
  last_touched_entry_id?: number | null;
};
type TopicNoteRow = {
  note_id?: number | null;
  note_made?: string[] | null;
  pitfalls?: string[] | null;
  created_at?: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeTopicSlug(value: string) {
  return decodeURIComponent(value)
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
    //console.log("failed to hit supabase... ");
    const text = await res.text();
    throw new Error(text || `Supabase request failed: ${res.status}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

async function supabaseUpsert(
  path: string,
  row: Record<string, unknown>,
  onConflict: string,
  token: string,
) {
  const url = supabaseUrl(path, { on_conflict: onConflict });
  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Supabase upsert failed: ${res.status}`);
  }
  return res.json();
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ topic: string }> },
) {
  const session = await getAuthSession();
  if (!session?.token || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { topic } = await params;
  const normalizedSlug = normalizeTopicSlug(topic);

  const topics = await supabaseFetch<TopicRow[]>(
    "topics",
    { select: "id,topic_name" },
    session.token,
  );
  const matched = topics.find(
    (row) => normalizeTopicSlug(row.topic_name || "") === normalizedSlug,
  );
  if (!matched?.id) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const summaryRows = await supabaseFetch<SummaryRow[]>(
    "summarization_table",
    {
      select: "notes_summary,pitfalls_summary,updated_at,last_touched_entry_id",
      user_id: `eq.${session.userId}`,
      topic_id: `eq.${matched.id}`,
      limit: "1",
    },
    session.token,
  );
  //console.log("this is the summary_rows: ", summaryRows);
  const existing = summaryRows[0];
  const updatedAt = existing?.updated_at
    ? Date.parse(existing.updated_at)
    : null;
  const hasSummary = Boolean(
    (existing?.notes_summary && existing.notes_summary.trim()) ||
    (existing?.pitfalls_summary && existing.pitfalls_summary.trim()),
  );
  const isStale = updatedAt ? Date.now() - updatedAt >= DAY_MS : true;

  const needsSummary = !existing || !hasSummary || isStale;
  console.log("needs summary?: ", needsSummary);

  if (!needsSummary) {
    return NextResponse.json({ success: true, skipped: true });
  }

  const lastTouched = existing?.last_touched_entry_id ?? 0;
  const noteParams: Record<string, string> = {
    select: "note_id,note_made,pitfalls,created_at",
    topic_id: `eq.${matched.id}`,
    order: "note_id.asc",
  };
  if (lastTouched > 0) {
    noteParams.note_id = `gt.${lastTouched}`;
  }
  if (existing?.updated_at) {
    noteParams.created_at = `gte.${existing.updated_at}`;
  }

  const topicNotes = await supabaseFetch<TopicNoteRow[]>(
    "topic_notes",
    noteParams,
    session.token,
  );
  //console.log("this is the TopicNotes collected: ", topicNotes);
  const noteItems: string[] = [];
  const pitfallItems: string[] = [];
  let maxNoteId = lastTouched;
  for (const row of topicNotes) {
    if (typeof row.note_id === "number") {
      maxNoteId = Math.max(maxNoteId, row.note_id);
    }
    if (Array.isArray(row.note_made)) {
      for (const item of row.note_made) {
        if (item && typeof item === "string") noteItems.push(item);
      }
    }
    if (Array.isArray(row.pitfalls)) {
      for (const item of row.pitfalls) {
        if (item && typeof item === "string") pitfallItems.push(item);
      }
    }
  }

  const notesList = [
    ...(existing?.notes_summary ? [existing.notes_summary] : []),
    ...noteItems,
  ];
  const pitfallsList = [
    ...(existing?.pitfalls_summary ? [existing.pitfalls_summary] : []),
    ...pitfallItems,
  ];

  if (notesList.length === 0 && pitfallsList.length === 0) {
    return NextResponse.json({ success: true, skipped: true, reason: "empty" });
  }

  const backendBase = process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000";
  //console.log("this is the pitfalls list: ", pitfallsList);
  const llmResponse = await fetch(`${backendBase}/api/llm/topic-summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: notesList, pitfalls: pitfallsList }),
    cache: "no-store",
  });
  const llmText = await llmResponse.text();
  const llmData = llmText ? JSON.parse(llmText) : null;
  if (!llmResponse.ok || !llmData?.success) {
    return NextResponse.json({ error: "Summary failed" }, { status: 500 });
  }

  const notesSummary = String(llmData.notes_summary || "").trim();
  const pitfallsSummary = String(llmData.pitfalls_summary || "").trim();
  const nowIso = new Date().toISOString();

  await supabaseUpsert(
    "summarization_table",
    {
      user_id: session.userId,
      topic_id: matched.id,
      notes_summary: notesSummary,
      pitfalls_summary: pitfallsSummary,
      last_touched_entry_id: maxNoteId,
      updated_at: nowIso,
    },
    "user_id,topic_id",
    session.token,
  );

  return NextResponse.json({
    success: true,
    notes_summary: notesSummary,
    pitfalls_summary: pitfallsSummary,
  });
}
