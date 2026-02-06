import InlineMarkdown from "@/components/InlineMarkdown";
import { isMarkdownHeavy } from "@/lib/notesFormat";
import { summaryToBullets } from "@/lib/text";
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
            <li key={index}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-black/50">{emptyText}</p>
      )}
    </section>
  );
}

function groupRowsByDate(
  rows: {
    problemNo: number;
    problemName: string;
    dateTouched?: string;
    noteMade: string[];
    pitfalls: string[];
  }[],
) {
  const dateMap = new Map<
    string,
    Map<
      string,
      {
        problemNo: number;
        problemName: string;
        noteMade: string[];
        pitfalls: string[];
      }
    >
  >();

  for (const row of rows) {
    const dateKey = row.dateTouched ?? "Unknown date";
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, new Map());
    }
    const problemMap = dateMap.get(dateKey)!;
    const problemKey = `${row.problemNo}:${row.problemName}`;
    if (!problemMap.has(problemKey)) {
      problemMap.set(problemKey, {
        problemNo: row.problemNo,
        problemName: row.problemName,
        noteMade: [],
        pitfalls: [],
      });
    }
    const bucket = problemMap.get(problemKey)!;
    for (const note of row.noteMade) {
      if (note && !bucket.noteMade.includes(note)) {
        bucket.noteMade.push(note);
      }
    }
    for (const pitfall of row.pitfalls) {
      if (pitfall && !bucket.pitfalls.includes(pitfall)) {
        bucket.pitfalls.push(pitfall);
      }
    }
  }

  return Array.from(dateMap.entries()).map(([date, problems]) => ({
    date,
    problems: Array.from(problems.values()).sort(
      (a, b) => a.problemNo - b.problemNo,
    ),
  }));
}

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

function ProblemTimeline({
  rows,
}: {
  rows: {
    problemNo: number;
    problemName: string;
    dateTouched?: string;
    noteMade: string[];
    pitfalls: string[];
  }[];
}) {
  const grouped = groupRowsByDate(rows);

  if (!grouped.length) {
    return (
      <section className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm">
        <p className="text-black/60">No attempts yet.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map((day) => (
        <div
          key={day.date}
          className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm"
        >
          {day.problems.map((problem) => (
            <div
              key={`${day.date}-${problem.problemNo}`}
              className="mb-6 rounded-xl bg-black/5 p-4 last:mb-0"
            >
              <div className="mb-2 flex items-baseline gap-2 text-lg font-semibold">
                <span>{problem.problemName}</span>
                <span className="text-sm font-semibold text-black/70">
                  — {day.date}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="font-semibold">To Remember</div>
                  <ul className="ml-5 list-disc text-black/70">
                    {problem.noteMade.length ? (
                      problem.noteMade.map((note, index) => (
                        <li key={index}>{renderNoteContent(note)}</li>
                      ))
                    ) : (
                      <li className="text-black/50">None</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold">Pitfalls</div>
                  <ul className="ml-5 list-disc text-black/70">
                    {problem.pitfalls.length ? (
                      problem.pitfalls.map((pitfall, index) => (
                        <li key={index}>{renderNoteContent(pitfall)}</li>
                      ))
                    ) : (
                      <li className="text-black/50">None</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
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
          <ProblemTimeline rows={data.rows} />
        </div>
      </div>
    </main>
  );
}
