export function isMarkdownHeavy(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed.includes("```")) return true;
  if (/^\s*[-*+]\s+/.test(trimmed)) return true;
  if (/^\s*\d+\.\s+/.test(trimmed)) return true;
  if (/^\s*>/.test(trimmed)) return true;
  if (/\*\*|__|~~/.test(trimmed)) return true;
  if (/\[.+\]\(.+\)/.test(trimmed)) return true;
  if (/^\s{4,}\S/.test(text)) return true;
  if (text.includes("\n")) return true;
  return false;
}
