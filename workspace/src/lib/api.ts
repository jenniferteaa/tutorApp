import "server-only";

import type { AuthSession } from "./auth";
import { Topic, TopicDetails, TopicProblem, UserSummary } from "./types";

type ActivityRow = {
  id: number;
  date_touched?: string | null;
  created_at?: string | null;
  problems?: {
    problem_no: number;
    problem_name: string;
    problem_link?: string | null;
  } | null;
  notes?: NoteRow[];
};

type NoteRow = {
  id: number;
  created_at?: string | null;
  topic_notes?: ActivityTopicNoteRow[];
};

type ActivityTopicNoteRow = {
  note_made?: string[] | null;
  pitfalls?: string[] | null;
  topics?: { topic_name: string } | null;
};

type TopicRow = { id: number; topic_name?: string | null };

type SummaryRow = {
  notes_summary?: string | null;
  pitfalls_summary?: string | null;
  updated_at?: string | null;
  last_touched_entry_id?: number | null;
};

type SummaryTopicNoteRow = {
  note_id?: number | null;
  note_made?: string[] | null;
  pitfalls?: string[] | null;
  created_at?: string | null;
};

type UserDetailsRow = {
  uname?: string | null;
  user_id?: string | null;
  email?: string | null;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const DAY_MS = 24 * 60 * 60 * 1000;

function buildSupabaseUrl(path: string, params: Record<string, string>) {
  const base = SUPABASE_URL?.replace(/\/$/, "");
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
  const url = buildSupabaseUrl(path, params);
  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Supabase request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

async function supabaseUpsert(
  path: string,
  row: Record<string, unknown>,
  onConflict: string,
  token: string,
) {
  const url = buildSupabaseUrl(path, { on_conflict: onConflict });
  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
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
  return (await res.json()) as unknown;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTopicSlug(value: string) {
  return decodeURIComponent(value)
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function requireSession(session?: AuthSession | null) {
  if (!session?.token || !session.userId) return null;
  //console.log("this is the session: ", session);
  return session;
}

export async function getUserSummary(
  session?: AuthSession | null,
): Promise<UserSummary> {
  if (!session) {
    console.log("there was no session!");
    return { username: "there", user_id: "null" };
  }
  const rows = await supabaseFetch<UserDetailsRow[]>(
    "user_details",
    {
      select: "uname,email",
      user_id: `eq.${session.userId}`,
      limit: "1",
    },
    session.token,
  );
  const record = rows[0];
  const name = record?.uname?.trim();
  const email = record?.email?.trim() || session.email?.trim();
  return { username: name || email || "there", user_id: session.userId };
}

export async function getUserTopics(
  session?: AuthSession | null,
): Promise<Topic[]> {
  const resolved = requireSession(session);
  if (!resolved) return [];
  //console.log("this is the userid: ", user_id);
  const rows = await supabaseFetch<ActivityRow[]>(
    "activity",
    {
      select:
        "id,problems(problem_no,problem_name,problem_link),notes(topic_notes(note_made,pitfalls,topics(topic_name)))",
      user_id: `eq.${resolved.userId}`,
    },
    resolved.token,
  );
  //console.log("This is the row: ", rows);
  //console.log(JSON.stringify(rows?.[0], null, 2));

  const seen = new Map<string, Topic>();
  const previewState = new Map<
    string,
    {
      notes: string[];
    }
  >();

  for (const activity of rows ?? []) {
    for (const note of activity.notes ?? []) {
      for (const topicNote of note.topic_notes ?? []) {
        const name = topicNote.topics?.topic_name?.trim();
        if (!name) continue;
        const slug = toSlug(name);
        if (!seen.has(slug)) {
          seen.set(slug, { slug, label: name });
          previewState.set(slug, {
            notes: [],
          });
        }
        const state = previewState.get(slug);
        if (state) {
          if (
            Array.isArray(topicNote.note_made) &&
            topicNote.note_made.some((n) => typeof n === "string" && n.trim())
          ) {
            for (const noteText of topicNote.note_made) {
              if (typeof noteText !== "string") continue;
              const trimmed = noteText.trim();
              if (!trimmed) continue;
              if (!state.notes.includes(trimmed) && state.notes.length < 4) {
                state.notes.push(trimmed);
              }
            }
          }
        }
      }
    }
  }

  const topics = Array.from(seen.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  for (const topic of topics) {
    const state = previewState.get(topic.slug);
    if (!state) continue;
    topic.preview = state.notes.slice(0, 4);
  }

  return topics;
}

export async function getTopicDetails(
  topicSlug: string,
  session?: AuthSession | null,
): Promise<TopicDetails> {
  const resolved = requireSession(session);
  const fallbackTopic = { slug: topicSlug, label: topicSlug };
  if (!resolved) {
    return {
      topic: fallbackTopic,
      notesSummary: "",
      pitfallsSummary: "",
      problems: [],
    };
  }

  const normalizedSlug = normalizeTopicSlug(topicSlug);
  const topics = await supabaseFetch<TopicRow[]>(
    "topics",
    { select: "id,topic_name" },
    resolved.token,
  );
  const matched = topics.find(
    (row) => normalizeTopicSlug(row.topic_name || "") === normalizedSlug,
  );
  const topicId = matched?.id;
  let resolvedLabel = matched?.topic_name?.trim() || topicSlug;

  let notesSummary = "";
  let pitfallsSummary = "";

  if (topicId) {
    const summaryRows = await supabaseFetch<SummaryRow[]>(
      "summarization_table",
      {
        select: "notes_summary,pitfalls_summary,updated_at,last_touched_entry_id",
        user_id: `eq.${resolved.userId}`,
        topic_id: `eq.${topicId}`,
        limit: "1",
      },
      resolved.token,
    );
    const existing = summaryRows[0];
    notesSummary = String(existing?.notes_summary ?? "").trim();
    pitfallsSummary = String(existing?.pitfalls_summary ?? "").trim();

    const updatedAt = existing?.updated_at
      ? Date.parse(existing.updated_at)
      : null;
    const hasSummary = Boolean(notesSummary || pitfallsSummary);
    const isStale = updatedAt ? Date.now() - updatedAt >= DAY_MS : true;
    const needsSummary = !existing || !hasSummary || isStale;

    if (needsSummary) {
      const lastTouched = existing?.last_touched_entry_id ?? 0;
      const noteParams: Record<string, string> = {
        select: "note_id,note_made,pitfalls,created_at",
        topic_id: `eq.${topicId}`,
        order: "note_id.asc",
      };
      if (lastTouched > 0) {
        noteParams.note_id = `gt.${lastTouched}`;
      }
      if (existing?.updated_at) {
        noteParams.created_at = `gte.${existing.updated_at}`;
      }

      const topicNotes = await supabaseFetch<SummaryTopicNoteRow[]>(
        "topic_notes",
        noteParams,
        resolved.token,
      );

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
        ...(notesSummary ? [notesSummary] : []),
        ...noteItems,
      ];
      const pitfallsList = [
        ...(pitfallsSummary ? [pitfallsSummary] : []),
        ...pitfallItems,
      ];

      if (notesList.length > 0 || pitfallsList.length > 0) {
        const backendBase =
          process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000";
        const llmResponse = await fetch(
          `${backendBase}/api/llm/topic-summary`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes: notesList, pitfalls: pitfallsList }),
            cache: "no-store",
          },
        );
        const llmText = await llmResponse.text();
        const llmData = llmText ? JSON.parse(llmText) : null;
        if (llmResponse.ok && llmData?.success) {
          notesSummary = String(llmData.notes_summary || "").trim();
          pitfallsSummary = String(llmData.pitfalls_summary || "").trim();
          const nowIso = new Date().toISOString();
          await supabaseUpsert(
            "summarization_table",
            {
              user_id: resolved.userId,
              topic_id: topicId,
              notes_summary: notesSummary,
              pitfalls_summary: pitfallsSummary,
              last_touched_entry_id: maxNoteId,
              updated_at: nowIso,
            },
            "user_id,topic_id",
            resolved.token,
          );
        }
      }
    }
  }

  const rows = await supabaseFetch<ActivityRow[]>(
    "activity",
    {
      select:
        "id,date_touched,created_at,problems(problem_no,problem_name,problem_link),notes(id,created_at,topic_notes(note_made,pitfalls,topics(topic_name)))",
      user_id: `eq.${resolved.userId}`,
    },
    resolved.token,
  );

  const rowSortTs = (r: {
    dateTouched?: string;
    activityCreatedAt?: string;
    noteCreatedAt?: string;
  }) => {
    if (r.dateTouched) return Date.parse(`${r.dateTouched}T23:59:59.999Z`);
    if (r.activityCreatedAt) return Date.parse(r.activityCreatedAt);
    if (r.noteCreatedAt) return Date.parse(r.noteCreatedAt);
    return 0;
  };

  const rowDateLabel = (r: {
    dateTouched?: string | null;
    activityCreatedAt?: string | null;
    noteCreatedAt?: string | null;
  }) => r.dateTouched || r.activityCreatedAt || r.noteCreatedAt || undefined;

  const problemMap = new Map<
    number,
    {
      problemNo: number;
      problemName: string;
      problemLink?: string;
      latestDate?: string;
      latestTs: number;
    }
  >();

  for (const activity of rows ?? []) {
    const problemNo = activity.problems?.problem_no ?? 0;
    const problemName = activity.problems?.problem_name ?? "Unknown Problem";
    const problemLink = activity.problems?.problem_link ?? undefined;

    for (const note of activity.notes ?? []) {
      for (const topicNote of note.topic_notes ?? []) {
        const topicName = topicNote.topics?.topic_name?.trim();
        if (!topicName) continue;
        if (normalizeTopicSlug(topicName) !== normalizedSlug) continue;

        resolvedLabel = topicName;

        const ts = rowSortTs({
          dateTouched: activity.date_touched ?? undefined,
          activityCreatedAt: activity.created_at ?? undefined,
          noteCreatedAt: note.created_at ?? undefined,
        });
        const dateLabel = rowDateLabel({
          dateTouched: activity.date_touched ?? undefined,
          activityCreatedAt: activity.created_at ?? undefined,
          noteCreatedAt: note.created_at ?? undefined,
        });

        const existing = problemMap.get(problemNo);
        if (!existing) {
          problemMap.set(problemNo, {
            problemNo,
            problemName,
            problemLink,
            latestDate: dateLabel,
            latestTs: ts,
          });
        } else {
          if (!existing.problemLink && problemLink) {
            existing.problemLink = problemLink;
          }
          if (ts > existing.latestTs) {
            existing.latestTs = ts;
            existing.latestDate = dateLabel;
          }
        }
      }
    }
  }

  const problems: TopicProblem[] = Array.from(problemMap.values())
    .sort((a, b) => {
      if (a.latestTs !== b.latestTs) return b.latestTs - a.latestTs;
      return a.problemNo - b.problemNo;
    })
    .map(({ latestTs, ...rest }) => rest);

  return {
    topic: { slug: topicSlug, label: resolvedLabel },
    notesSummary,
    pitfallsSummary,
    problems,
  };
}

// export async function getTopicDetails(
//   topicSlug: string,
//   session?: AuthSession | null,
// ): Promise<TopicDetails> {
//   const resolved = requireSession(session);
//   const fallbackTopic = { slug: topicSlug, label: topicSlug };
//   if (!resolved) {
//     return { topic: fallbackTopic, pitfalls: [], toRemember: [], rows: [] };
//   }

//   const rows = await supabaseFetch<ActivityRow[]>(
//     "activity",
//     {
//       select:
//         "id,date_touched,created_at,problems(problem_no,problem_name),notes(id,created_at,topic_notes(note_made,pitfalls,topics(topic_name)))",
//       user_id: `eq.${resolved.userId}`,
//     },
//     resolved.token,
//   );
//   console.log("this is the log: ", rows);
//   const pitfalls: Entry[] = [];
//   const toRemember: Entry[] = [];
//   const queryRows: TopicQueryRow[] = [];
//   let resolvedLabel = topicSlug;
//   const normalizedSlug = normalizeTopicSlug(topicSlug);

//   for (const activity of rows ?? []) {
//     const problemNo = activity.problems?.problem_no ?? 0;
//     const problemName = activity.problems?.problem_name ?? "Unknown Problem";

//     for (const note of activity.notes ?? []) {
//       for (const topicNote of note.topic_notes ?? []) {
//         const topicName = topicNote.topics?.topic_name?.trim();
//         if (!topicName) continue;
//         if (normalizeTopicSlug(topicName) !== normalizedSlug) continue;
//         resolvedLabel = topicName;

//         const thoughtItems = Array.isArray(topicNote.note_made)
//           ? topicNote.note_made
//           : [];
//         const pitfallItems = Array.isArray(topicNote.pitfalls)
//           ? topicNote.pitfalls
//           : [];

//         queryRows.push({
//           problemNo,
//           problemName,
//           dateTouched: activity.date_touched ?? undefined,
//           activityCreatedAt: activity.created_at ?? undefined,
//           noteId: note.id,
//           noteCreatedAt: note.created_at ?? undefined,
//           noteMade: thoughtItems.filter(Boolean),
//           pitfalls: pitfallItems.filter(Boolean),
//         });

//         for (const [index, text] of thoughtItems.entries()) {
//           if (!text) continue;
//           toRemember.push({
//             id: `${note.id}-t-${index}`,
//             problemId: problemNo,
//             title: problemName,
//             text,
//           });
//         }

//         for (const [index, text] of pitfallItems.entries()) {
//           if (!text) continue;
//           pitfalls.push({
//             id: `${note.id}-p-${index}`,
//             problemId: problemNo,
//             title: problemName,
//             text,
//           });
//         }
//       }
//     }
//   }

//   console.log(
//     "[workspace] topic query rows",
//     JSON.stringify(queryRows, null, 2),
//   );

//   return {
//     topic: { slug: topicSlug, label: resolvedLabel },
//     pitfalls,
//     toRemember,
//     rows: queryRows,
//   };
// }
