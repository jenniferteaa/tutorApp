function normalizeBullet(text: string) {
  return text.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim();
}

function parseSummaryArray(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => normalizeBullet(String(item)))
        .filter(Boolean);
    }
  } catch {
    // fall through
  }

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  const parts = inner.split(/"\s*,\s*"|'\s*,\s*'|",\s*'|',\s*"/);
  return parts
    .map((part) => part.replace(/^['"]|['"]$/g, "").trim())
    .map(normalizeBullet)
    .filter(Boolean);
}

function splitIntoSentences(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    const segments = Array.from(segmenter.segment(cleaned), (s) =>
      s.segment.trim(),
    );
    return segments.filter(Boolean);
  }

  return cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/g)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function summaryToBullets(summary: string) {
  const trimmed = summary.trim();
  if (!trimmed) return [];

  const parsed = parseSummaryArray(trimmed);
  if (parsed) return parsed;

  const lines = trimmed.split(/\r?\n+/);
  const bullets: string[] = [];
  for (const line of lines) {
    const cleaned = normalizeBullet(line);
    if (!cleaned) continue;
    const sentences = splitIntoSentences(cleaned);
    if (sentences.length === 0) continue;
    for (const sentence of sentences) {
      const normalized = normalizeBullet(sentence);
      if (normalized) bullets.push(normalized);
    }
  }

  return bullets;
}

export function formatDateLabel(value?: string) {
  if (!value || value === "Unknown date") return "Unknown date";
  const normalized = value.includes("T") ? value : `${value}T00:00:00Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
