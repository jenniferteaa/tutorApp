import { parseInlineMarkdown } from "@/lib/text";

export default function InlineMarkdown({ text }: { text: string }) {
  const tokens = parseInlineMarkdown(text);
  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === "code") {
          return (
            <code
              key={index}
              className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.95em]"
            >
              {token.value}
            </code>
          );
        }
        if (token.type === "strong") {
          return (
            <strong key={index} className="font-semibold text-black">
              {token.value}
            </strong>
          );
        }
        return <span key={index}>{token.value}</span>;
      })}
    </>
  );
}
