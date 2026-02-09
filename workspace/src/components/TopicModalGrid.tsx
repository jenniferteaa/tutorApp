"use client";

import InlineMarkdown from "@/components/InlineMarkdown";
import { useToast } from "@/components/ToastProvider";
import TopicTile from "@/components/TopicTile";
import { isMarkdownHeavy } from "@/lib/notesFormat";
import { summaryToBullets } from "@/lib/text";
import type { Topic, TopicDetails } from "@/lib/types";
import { useState } from "react";

function renderNoteContent(text: string) {
  if (isMarkdownHeavy(text)) {
    return (
      <pre className="rounded-lg bg-black/5 px-3 py-2 text-sm font-mono whitespace-pre-wrap">
        <code>{text}</code>
      </pre>
    );
  }
  return <InlineMarkdown text={text} />;
}

export default function TopicModalGrid({ topics }: { topics: Topic[] }) {
  const [active, setActive] = useState<TopicDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [searchProblem, setSearchProblem] = useState("");
  const [deletingAttempt, setDeletingAttempt] = useState<string | null>(null);
  const { pushToast } = useToast();

  async function openTopic(topic: Topic) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/topics/${encodeURIComponent(topic.label)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load topic");
      }
      const data = (await res.json()) as TopicDetails;
      setActive(data);
      setShowSummary(false);
      setSearchProblem("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load topic";
      setError(message);
      pushToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function reloadActive(topicSlug: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/topics/${encodeURIComponent(topicSlug)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load topic");
      }
      const data = (await res.json()) as TopicDetails;
      setActive(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load topic";
      setError(message);
      pushToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleSummary() {
    if (!active) return;
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (summarizing) return;
    setSummarizing(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/topics/${encodeURIComponent(active.topic.label)}/summary`,
        { method: "POST" },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to summarize");
      }
      const data = await res.json();
      if (data?.notes_summary || data?.pitfalls_summary) {
        setActive((prev) =>
          prev
            ? {
                ...prev,
                notesSummary: data.notes_summary ?? prev.notesSummary,
                pitfallsSummary: data.pitfalls_summary ?? prev.pitfallsSummary,
              }
            : prev,
        );
      }
      setShowSummary(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to summarize";
      setError(message);
      pushToast(message, "error");
    } finally {
      setSummarizing(false);
    }
  }

  async function handleDeleteAttempt(problemNo: number, date: string) {
    if (!active) return;
    const dateKey = date || "Unknown date";
    const noteIds = active.rows
      .filter(
        (row) =>
          row.problemNo === problemNo &&
          (row.dateTouched ?? "Unknown date") === dateKey,
      )
      .map((row) => row.noteId);
    if (noteIds.length === 0) {
      pushToast("No notes found for that attempt.", "error");
      return;
    }

    const deleteKey = `${problemNo}-${dateKey}`;
    setDeletingAttempt(deleteKey);
    try {
      const res = await fetch(
        `/api/topics/${encodeURIComponent(active.topic.label)}/attempt`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteIds, problemNo, dateTouched: dateKey }),
        },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete attempt");
      }
      await reloadActive(active.topic.label);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete attempt";
      pushToast(message, "error");
    } finally {
      setDeletingAttempt(null);
    }
  }

  const notesSummary = active ? summaryToBullets(active.notesSummary) : [];
  const grouped = active ? groupRowsByProblem(active.rows) : [];
  const searchDigits = searchProblem.trim().replace(/[^\d]/g, "");
  const filteredGrouped =
    searchDigits.length > 0
      ? grouped.filter((problem) => String(problem.problemNo) === searchDigits)
      : grouped;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {topics.map((topic) => (
          <TopicTile key={topic.label} topic={topic} onClick={openTopic} />
        ))}
      </div>

      {loading || summarizing ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/30">
          <div className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold">
            {loading ? "Loading topic…" : "Summarizing…"}
          </div>
        </div>
      ) : null}

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-4">
              <div className="text-2xl font-semibold">{active.topic.label}</div>
              <div className="flex items-center gap-3">
                <button
                  className={`rounded-full border border-black/30 px-3 py-1 text-sm ${
                    showSummary || summarizing
                      ? "bg-black text-white"
                      : "hover:bg-black/5"
                  }`}
                  onClick={handleToggleSummary}
                  disabled={summarizing}
                >
                  {summarizing ? "Summarizing…" : "Summarize"}
                </button>
                <input
                  className="w-44 rounded-full border border-black/20 px-3 py-1 text-sm outline-none focus:border-black/40"
                  placeholder="Search problemno"
                  aria-label="Search problem number"
                  value={searchProblem}
                  onChange={(event) => setSearchProblem(event.target.value)}
                />
                <button
                  className="rounded-full border border-black/30 px-3 py-1 text-sm hover:bg-black/5"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-8">
                {showSummary ? (
                  <section className="rounded-2xl border border-black/10 bg-black/5 p-5">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Key Learnings</h3>
                        {notesSummary.length ? (
                          <ul className="ml-5 list-disc text-base text-black/80">
                            {notesSummary.map((note, index) => (
                              <li key={index}>
                                <InlineMarkdown text={note} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-black/50">
                            No summary yet.
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">
                          Problems Solved
                        </h3>
                        {active.problems.length ? (
                          <ul className="ml-0.5 text-base text-black/80">
                            {active.problems.map((problem) => (
                              <li
                                key={`${problem.problemNo}-${problem.problemName}`}
                              >
                                <span className="font-semibold text-black/90">
                                  {problem.problemName}
                                </span>
                                {problem.problemLink ? (
                                  <a
                                    className="ml-1 inline-flex -translate-y-0.5 items-center rounded-md px-1 py-0.5 text-base text-black/70 hover:bg-black/5"
                                    href={problem.problemLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Open problem"
                                    aria-label="Open problem"
                                  >
                                    ↗
                                  </a>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-black/50">
                            No problems yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                ) : null}

                {!showSummary ? (
                  <section className="space-y-4">
                    <h3 className="text-xl font-bold">Practice history</h3>
                    {filteredGrouped.length ? (
                      <div className="space-y-6">
                        {filteredGrouped.map((problem, index) => {
                          const [latest, ...older] = problem.attempts;
                          if (!latest) return null;
                          return (
                            <div
                              key={`${problem.problemNo}-${problem.problemName}`}
                              className="pb-6"
                            >
                              <div className="flex flex-wrap items-center gap-3 text-base font-bold text-lg">
                                {problem.problemLink ? (
                                  <a
                                    className="hover:underline"
                                    href={problem.problemLink}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {problem.problemName}
                                  </a>
                                ) : (
                                  <span>{problem.problemName}</span>
                                )}
                                {problem.problemLink ? (
                                  <a
                                    className="ml-1 inline-flex -translate-y-0.5 items-center rounded-md px-1 py-0.5 text-base text-black/70 hover:bg-black/5"
                                    href={problem.problemLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Open problem"
                                    aria-label="Open problem"
                                  >
                                    ↗
                                  </a>
                                ) : null}{" "}
                                <span className="text-sm font-semibold text-black/60">
                                  — {formatDate(latest.date)}
                                </span>
                                <button
                                  className="inline-flex items-center text-black/40 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                  onClick={() =>
                                    handleDeleteAttempt(
                                      problem.problemNo,
                                      latest.date,
                                    )
                                  }
                                  disabled={
                                    deletingAttempt ===
                                    `${problem.problemNo}-${latest.date}`
                                  }
                                  title="Delete"
                                  aria-label="Delete attempt"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                  </svg>
                                </button>
                              </div>

                              <div className="mt-3 grid gap-6 md:grid-cols-2">
                                <div>
                                  <div className="flex items-center gap-2 font-semibold">
                                    To Remember
                                    <span className="rounded-sm bg-black/10 px-2 py-0.5 text-xs">
                                      {latest.noteMade.length}
                                    </span>
                                  </div>
                                  <ul className="ml-5 list-disc text-black/100 text-base">
                                    {latest.noteMade.length ? (
                                      latest.noteMade.map((note, noteIndex) => (
                                        <li key={noteIndex}>
                                          {renderNoteContent(note)}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="text-black/50">None</li>
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 font-semibold">
                                    Pitfalls
                                    <span className="rounded-sm bg-black/10 px-2 py-0.5 text-xs">
                                      {latest.pitfalls.length}
                                    </span>
                                  </div>
                                  <ul className="ml-5 list-disc text-black/100 text-base">
                                    {latest.pitfalls.length ? (
                                      latest.pitfalls.map(
                                        (pitfall, pitIndex) => (
                                          <li key={pitIndex}>
                                            {renderNoteContent(pitfall)}
                                          </li>
                                        ),
                                      )
                                    ) : (
                                      <li className="text-black/50">None</li>
                                    )}
                                  </ul>
                                </div>
                              </div>

                              {older.length ? (
                                <div className="mt-4 space-y-2 pt-2">
                                  {older.map((attempt) => (
                                    <details
                                      key={attempt.date}
                                      className="group rounded-xl px-3 py-2"
                                    >
                                      <summary className="flex flex-wrap items-center gap-2 cursor-pointer text-lg font-bold text-black/50 group-open:text-black group-hover:text-black">
                                        <span className="inline-block text-black/40 transition-transform group-open:rotate-90 group-hover:text-black">
                                          ›
                                        </span>
                                        <span>Attempt</span>{" "}
                                        <span className="text-sm font-semibold text-black/60 group-hover:text-black">
                                          — {formatDate(attempt.date)}
                                        </span>
                                        <button
                                          className="inline-flex items-center text-black/40 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            void handleDeleteAttempt(
                                              problem.problemNo,
                                              attempt.date,
                                            );
                                          }}
                                          disabled={
                                            deletingAttempt ===
                                            `${problem.problemNo}-${attempt.date}`
                                          }
                                          title="Delete"
                                          aria-label="Delete attempt"
                                        >
                                          <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4h8v2" />
                                            <path d="M19 6l-1 14H6L5 6" />
                                            <path d="M10 11v6" />
                                            <path d="M14 11v6" />
                                          </svg>
                                        </button>
                                      </summary>
                                      <div className="mt-4 grid gap-6 md:grid-cols-2">
                                        <div>
                                          <div className="flex items-center gap-2 font-semibold">
                                            To Remember
                                            <span className="rounded-sm bg-black/10 px-2 py-0.5 text-xs">
                                              {attempt.noteMade.length}
                                            </span>
                                          </div>
                                          <ul className="ml-5 list-disc text-black/100 text-base">
                                            {attempt.noteMade.length ? (
                                              attempt.noteMade.map(
                                                (note, noteIndex) => (
                                                  <li key={noteIndex}>
                                                    {renderNoteContent(note)}
                                                  </li>
                                                ),
                                              )
                                            ) : (
                                              <li className="text-black/50">
                                                None
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 font-semibold">
                                            Pitfalls
                                            <span className="rounded-sm bg-black/10 px-2 py-0.5 text-xs">
                                              {attempt.pitfalls.length}
                                            </span>
                                          </div>
                                          <ul className="ml-5 list-disc text-black/100 text-base">
                                            {attempt.pitfalls.length ? (
                                              attempt.pitfalls.map(
                                                (pitfall, pitIndex) => (
                                                  <li key={pitIndex}>
                                                    {renderNoteContent(pitfall)}
                                                  </li>
                                                ),
                                              )
                                            ) : (
                                              <li className="text-black/50">
                                                None
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </details>
                                  ))}
                                </div>
                              ) : null}

                              {index < filteredGrouped.length - 1 ? (
                                <div className="mt-6 border-t border-black/10" />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-black/50">
                        {searchDigits.length
                          ? "No matching problem."
                          : "No attempts yet."}
                      </p>
                    )}
                  </section>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type Attempt = {
  date: string;
  noteMade: string[];
  pitfalls: string[];
};

function formatDate(value?: string) {
  if (!value || value === "Unknown date") return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dateSortKey(value?: string) {
  if (!value || value === "Unknown date") return 0;
  const ts = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(ts) ? 0 : ts;
}

function groupRowsByProblem(rows: TopicDetails["rows"]) {
  const problemMap = new Map<
    string,
    {
      problemNo: number;
      problemName: string;
      problemLink?: string;
      attempts: Map<string, Attempt>;
    }
  >();

  for (const row of rows) {
    const problemKey = `${row.problemNo}:${row.problemName}`;
    if (!problemMap.has(problemKey)) {
      problemMap.set(problemKey, {
        problemNo: row.problemNo,
        problemName: row.problemName,
        problemLink: row.problemLink,
        attempts: new Map(),
      });
    }
    const entry = problemMap.get(problemKey)!;
    if (!entry.problemLink && row.problemLink) {
      entry.problemLink = row.problemLink;
    }
    const dateKey = row.dateTouched ?? "Unknown date";
    if (!entry.attempts.has(dateKey)) {
      entry.attempts.set(dateKey, {
        date: dateKey,
        noteMade: [],
        pitfalls: [],
      });
    }
    const attempt = entry.attempts.get(dateKey)!;
    for (const note of row.noteMade) {
      if (note && !attempt.noteMade.includes(note)) {
        attempt.noteMade.push(note);
      }
    }
    for (const pitfall of row.pitfalls) {
      if (pitfall && !attempt.pitfalls.includes(pitfall)) {
        attempt.pitfalls.push(pitfall);
      }
    }
  }

  const problems = Array.from(problemMap.values()).map((entry) => {
    const attempts = Array.from(entry.attempts.values()).sort(
      (a, b) => dateSortKey(b.date) - dateSortKey(a.date),
    );
    return { ...entry, attempts };
  });

  return problems.sort((a, b) => {
    const aLatest = dateSortKey(a.attempts[0]?.date);
    const bLatest = dateSortKey(b.attempts[0]?.date);
    if (aLatest !== bLatest) return bLatest - aLatest;
    return a.problemNo - b.problemNo;
  });
}
