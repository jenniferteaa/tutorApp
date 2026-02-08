function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInlineMarkdown(text: string) {
  const parts = text.split("`");
  const renderInlineMarkup = (value: string) => {
    const regex = /(\*\*[^*\n]+\*\*|'[^'\n]+')/g;
    let result = "";
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(value)) !== null) {
      result += escapeHtml(value.slice(lastIndex, match.index));
      const token = match[1];
      if (token.startsWith("**")) {
        result += `<strong>${escapeHtml(token.slice(2, -2))}</strong>`;
      } else {
        result += `<code>${escapeHtml(token.slice(1, -1))}</code>`;
      }
      lastIndex = regex.lastIndex;
    }
    result += escapeHtml(value.slice(lastIndex));
    return result;
  };
  return parts
    .map((part, index) =>
      index % 2 === 1
        ? `<code>${escapeHtml(part)}</code>`
        : renderInlineMarkup(part),
    )
    .join("");
}

function renderTextMarkdown(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html += `<p>${formatInlineMarkdown(paragraph.join(" "))}</p>`;
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html += `</${listType}>`;
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html += `<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`;
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== "ol") {
        closeList();
      }
      if (!listType) {
        listType = "ol";
        html += "<ol>";
      }
      html += `<li>${formatInlineMarkdown(orderedMatch[2])}</li>`;
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== "ul") {
        closeList();
      }
      if (!listType) {
        listType = "ul";
        html += "<ul>";
      }
      html += `<li>${formatInlineMarkdown(unorderedMatch[1])}</li>`;
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  return html;
}

function wrapTableLikeBlocks(text: string) {
  const lines = text.split("\n");
  const isSeparator = (line: string) =>
    /^\s*\|?[-:\s|]+\|?\s*$/.test(line);
  const isTableLine = (line: string) =>
    (line.match(/\|/g)?.length ?? 0) >= 2;

  let inCodeFence = false;
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      out.push(line);
      i += 1;
      continue;
    }
    if (inCodeFence) {
      out.push(line);
      i += 1;
      continue;
    }

    if (isTableLine(line) || isSeparator(line)) {
      const block: string[] = [];
      while (i < lines.length) {
        const candidate = lines[i];
        if (candidate.trim().startsWith("```")) break;
        if (!(isTableLine(candidate) || isSeparator(candidate))) break;
        block.push(candidate);
        i += 1;
      }
      if (block.length > 0) {
        out.push("```table");
        out.push(...block);
        out.push("```");
      }
      continue;
    }

    out.push(line);
    i += 1;
  }

  return out.join("\n");
}

export function prettifyLlMResponse(text: string) {
  // Convert "To fix: a; b; c." into bullets
  const m = text.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);
  if (!m) return wrapTableLikeBlocks(text);

  const before = m[1].trim();
  const fixesRaw = m[2].trim();

  // split on semicolons
  const fixes = fixesRaw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  if (fixes.length === 0) return text;

  const bulletBlock = fixes.map((f) => `- ${f.replace(/\.$/, "")}`).join("\n");

  const combined = `${before}\n\n**To fix**\n${bulletBlock}`;
  return wrapTableLikeBlocks(combined);
}

export function renderMarkdown(message: string) {
  const normalized = message.replace(/\r\n/g, "\n");
  const fenceCount = (normalized.match(/```/g) || []).length;
  const guarded = fenceCount % 2 === 1 ? `${normalized}\n\`\`\`` : normalized;
  const parts: { type: "text" | "code"; content: string; lang?: string }[] = [];
  const fence = /```(\w+)?\r?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(guarded)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: guarded.slice(lastIndex, match.index),
      });
    }
    parts.push({
      type: "code",
      content: match[2] ?? "",
      lang: match[1] ?? "",
    });
    lastIndex = fence.lastIndex;
  }
  if (lastIndex < guarded.length) {
    parts.push({ type: "text", content: guarded.slice(lastIndex) });
  }

  return parts
    .map((part) => {
      if (part.type === "code") {
        const langAttr = part.lang
          ? ` data-lang="${escapeHtml(part.lang)}"`
          : "";
        const preClass =
          part.lang === "table" ? ` class="table-block"` : "";
        return `<pre${preClass}><code${langAttr}>${escapeHtml(
          part.content.trimEnd(),
        )}</code></pre>`;
      }
      return renderTextMarkdown(part.content);
    })
    .join("");
}
