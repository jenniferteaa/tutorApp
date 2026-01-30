"use client";

import TopicTile from "@/components/TopicTile";
import type { Topic, TopicDetails } from "@/lib/types";
import { useState } from "react";

export default function TopicModalGrid({ topics }: { topics: Topic[] }) {
  const [active, setActive] = useState<TopicDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openTopic(topic: Topic) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/topics/${encodeURIComponent(topic.slug)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load topic");
      }
      const data = (await res.json()) as TopicDetails;
      setActive(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load topic");
    } finally {
      setLoading(false);
    }
  }

  const grouped = active ? groupRowsByProblem(active.rows) : [];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {topics.map((topic) => (
          <TopicTile key={topic.slug} topic={topic} onClick={openTopic} />
        ))}
      </div>

      {loading ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/30">
          <div className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold">
            Loading topic…
          </div>
        </div>
      ) : null}

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-4">
              <div className="text-2xl font-semibold">{active.topic.label}</div>
              <button
                className="rounded-full border border-black/30 px-3 py-1 text-sm hover:bg-black/5"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-6">
                {grouped.map((problem, index) => {
                  const [latest, ...older] = problem.attempts;
                  if (!latest) return null;
                  return (
                    <div
                      key={`${problem.problemNo}-${problem.problemName}`}
                      className="pb-6"
                    >
                      <div className="text-base font-bold text-lg">
                        <span>{problem.problemName}</span>
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
                              latest.noteMade.map((n, i) => (
                                <li key={i}>{n}</li>
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
                              latest.pitfalls.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))
                            ) : (
                              <li className="text-black/50">None</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {older.length ? (
                        <div className="mt-6 space-y-4 pt-4">
                          {older.map((attempt) => (
                            <details
                              key={attempt.date}
                              className="rounded-xl p-4"
                            >
                              <summary className="cursor-pointer text-lg font-bold text-black/50">
                                <span>Attempt</span>{" "}
                                <span className="text-sm font-semibold text-black/60">
                                  — {formatDate(attempt.date)}
                                </span>
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
                                      attempt.noteMade.map((n, i) => (
                                        <li key={i}>{n}</li>
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
                                      {attempt.pitfalls.length}
                                    </span>
                                  </div>
                                  <ul className="ml-5 list-disc text-black/100 text-base">
                                    {attempt.pitfalls.length ? (
                                      attempt.pitfalls.map((p, i) => (
                                        <li key={i}>{p}</li>
                                      ))
                                    ) : (
                                      <li className="text-black/50">None</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </details>
                          ))}
                        </div>
                      ) : null}

                      {index < grouped.length - 1 ? (
                        <div className="mt-6 border-t border-black/10" />
                      ) : null}
                    </div>
                  );
                })}
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
