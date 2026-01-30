import { Topic } from "@/lib/types";
type Props = {
  topic: Topic;
  onClick?: (topic: Topic) => void;
};

export default function TopicTile({ topic, onClick }: Props) {
  const previewItems = topic.preview ?? [];
  const content = (
    <>
      <div className="h-8 text-2xl font-semibold first-letter:uppercase">
        {topic.label}
      </div>
      <div className="mt-3 h-px w-3/4 bg-black/50" />
      <div className="mt-4 h-24 overflow-hidden text-base leading-7 text-black/80">
        {previewItems.length ? (
          <ul className="list-none list-inside pl-0">
            {previewItems.map((item, index) => (
              <li key={`${item}-${index}`} className="truncate text-sm">
                - {item}
                {/* <div className="mt-2 h-px w-3/4 bg-black/10" /> */}
              </li>
            ))}
          </ul>
        ) : (
          "No notes yet."
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(topic)}
        className="block w-full rounded-3xl border border-black/20 bg-white/90 px-8 py-8 text-left shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="list-disc block rounded-3xl border border-black/20 bg-white/90 px-8 py-8 text-left shadow-lg">
      {content}
    </div>
  );
}
