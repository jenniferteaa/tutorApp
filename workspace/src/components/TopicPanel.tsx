import { formatDateLabel, summaryToBullets } from "@/lib/text";
import { TopicDetails } from "@/lib/types";
import Link from "next/link";

function SummarySection({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <section className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      {items.length ? (
        <ul className="mt-3 ml-5 list-disc text-base text-black/80">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-black/50">{emptyText}</p>
      )}
    </section>
  );
}

function ProblemList({ problems }: { problems: TopicDetails["problems"] }) {
  return (
    <section className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Problems</h3>
      {problems.length ? (
        <div className="mt-4 space-y-3">
          {problems.map((problem) => (
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
        <p className="mt-3 text-sm text-black/50">No problems yet.</p>
      )}
    </section>
  );
}

export default function TopicPanel({ data }: { data: TopicDetails }) {
  const notesSummary = summaryToBullets(data.notesSummary);
  const pitfallsSummary = summaryToBullets(data.pitfallsSummary);

  return (
    <main className="min-h-screen bg-[#7f8582] p-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-black/10 p-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-2xl border border-black/20 bg-white px-6 py-3 shadow-sm">
            <h1 className="text-xl">{data.topic.label}</h1>
          </div>

          <Link href="/workspace" className="text-black underline">
            Back
          </Link>
        </div>

        <div className="space-y-6">
          <SummarySection
            title="Key Learnings"
            items={notesSummary}
            emptyText="No summary yet."
          />
          <SummarySection
            title="Mistakes to Avoid"
            items={pitfallsSummary}
            emptyText="No pitfalls captured yet."
          />
          <ProblemList problems={data.problems} />
        </div>
      </div>
    </main>
  );
}
