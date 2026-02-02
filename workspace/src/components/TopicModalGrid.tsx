"use client";

import TopicTile from "@/components/TopicTile";
import { useToast } from "@/components/ToastProvider";
import { formatDateLabel, summaryToBullets } from "@/lib/text";
import type { Topic, TopicDetails } from "@/lib/types";
import { useState } from "react";

export default function TopicModalGrid({ topics }: { topics: Topic[] }) {
  const [active, setActive] = useState<TopicDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pushToast } = useToast();

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
      const message =
        err instanceof Error ? err.message : "Failed to load topic";
      setError(message);
      pushToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  const notesSummary = active ? summaryToBullets(active.notesSummary) : [];
  const pitfallsSummary = active ? summaryToBullets(active.pitfallsSummary) : [];

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
                <section className="space-y-2">
                  <h3 className="text-lg font-semibold">Key Learnings</h3>
                  {notesSummary.length ? (
                    <ul className="ml-5 list-disc text-base text-black/80">
                      {notesSummary.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-black/50">
                      No summary yet.
                    </p>
                  )}
                </section>

                <section className="space-y-2">
                  <h3 className="text-lg font-semibold">Mistakes to Avoid</h3>
                  {pitfallsSummary.length ? (
                    <ul className="ml-5 list-disc text-base text-black/80">
                      {pitfallsSummary.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-black/50">
                      No pitfalls captured yet.
                    </p>
                  )}
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">Problems</h3>
                  {active.problems.length ? (
                    <div className="space-y-3">
                      {active.problems.map((problem) => (
                        <div
                          key={`${problem.problemNo}-${problem.problemName}`}
                          className="rounded-xl bg-black/5 p-4"
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
                              — {formatDateLabel(problem.latestDate)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-black/50">
                      No problems yet.
                    </p>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
