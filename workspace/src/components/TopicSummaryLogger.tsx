"use client";

import { useEffect } from "react";

export default function TopicSummaryLogger({ topic }: { topic: string }) {
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(
          `/api/topics/${encodeURIComponent(topic)}/summary`,
          { method: "POST" },
        );
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        console.log("topic summary response:", data);
      } catch (error) {
        console.error("topic summary fetch failed", error);
      }
    };
    void run();
  }, [topic]);

  return null;
}
