import { TopicDetails } from "@/lib/types";
import Link from "next/link";

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

function Section({
  title,
  items,
}: {
  title: string;
  items: { id: string; problemId: number; title: string; text?: string }[];
}) {
  return (
    <div className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>

      {items.length === 0 ? (
        <p className="text-black/60">Nothing yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((x) => (
            <li key={x.id} className="rounded-xl border border-black/10 p-4">
              <div className="font-medium">
                {x.problemId}. {x.title}
              </div>
              {x.text ? (
                <div className="mt-2 text-black/70">{x.text}</div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
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

  return (
    <div className="space-y-6">
      {grouped.map((day) => (
        <div
          key={day.date}
          className="rounded-2xl border border-black/20 bg-white p-6 shadow-sm"
        >
          {/* <div className="mb-4 text-sm font-semibold text-black/70">
            Date: {day.date}
          </div> */}

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
                      problem.noteMade.map((n, i) => <li key={i}>{n}</li>)
                    ) : (
                      <li className="text-black/50">None</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold">Pitfalls</div>
                  <ul className="ml-5 list-disc text-black/70">
                    {problem.pitfalls.length ? (
                      problem.pitfalls.map((p, i) => <li key={i}>{p}</li>)
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
  return (
    <main className="min-h-screen bg-[#7f8582] p-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-black/10 p-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-2xl border border-black/20 bg-white px-6 py-3 shadow-sm">
            <span className="text-xl">{data.topic.label}</span>
          </div>

          <Link href="/workspace" className="text-black underline">
            Back
          </Link>
        </div>

        <div className="space-y-6">
          <ProblemTimeline rows={data.rows} />
        </div>
      </div>
    </main>
  );
}
