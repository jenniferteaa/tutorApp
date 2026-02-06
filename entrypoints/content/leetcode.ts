export type TopicBucket = {
  thoughts_to_remember: string[];
  pitfalls: string[];
};

const CANONICAL_TOPICS = [
  "Array",
  "String",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Matrix",
  "Bit Manipulation",
  "Tree",
  "Breadth-First Search",
  "Two Pointers",
  "Prefix Sum",
  "Heap (Priority Queue)",
  "Simulation",
  "Counting",
  "Graph Theory",
  "Binary Tree",
  "Stack",
  "Sliding Window",
  "Enumeration",
  "Design",
  "Backtracking",
  "Union-Find",
  "Number Theory",
  "Linked List",
  "Ordered Set",
  "Segment Tree",
  "Monotonic Stack",
  "Trie",
  "Divide and Conquer",
  "Combinatorics",
  "Bitmask",
  "Recursion",
  "Queue",
  "Geometry",
  "Binary Indexed Tree",
  "Memoization",
  "Hash Function",
  "Binary Search Tree",
  "Shortest Path",
  "String Matching",
  "Topological Sort",
  "Rolling Hash",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Doubly-Linked List",
  "Merge Sort",
  "Randomized",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Quickselect",
  "Suffix Array",
  "Sweep Line",
  "Minimum Spanning Tree",
  "Bucket Sort",
  "Shell",
  "Reservoir Sampling",
  "Radix Sort",
  "Rejection Sampling",
];

const TOPIC_REPLACEMENTS: Record<string, string> = {
  "Dynamic Programming": "DP",
  "Depth-First Search": "DFS",
  "Breadth-First Search": "BFS",
  "Heap (Priority Queue)": "Heaps (PQ)",
  "Binary Indexed Tree": "Binary Trees",
  "Binary Search Tree": "BST",
  "Doubly-Linked List": "DLL",
  "Minimum Spanning Tree": "MST",
};

function normalizeTopicKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_/]+/g, " ")
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CANONICAL_TOPIC_MAP = new Map(
  CANONICAL_TOPICS.map((topic) => [
    normalizeTopicKey(topic),
    TOPIC_REPLACEMENTS[topic] ?? topic,
  ]),
);
Object.values(TOPIC_REPLACEMENTS).forEach((replacement) => {
  CANONICAL_TOPIC_MAP.set(normalizeTopicKey(replacement), replacement);
});

function titleCaseTopic(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveTopicLabel(raw: string): string {
  const key = normalizeTopicKey(raw);
  if (!key) return raw.trim();
  const direct = CANONICAL_TOPIC_MAP.get(key);
  if (direct) return direct;

  const parts = key.split(" ");
  if (parts.length > 0) {
    const last = parts[parts.length - 1];
    if (last.endsWith("s")) {
      parts[parts.length - 1] = last.slice(0, -1);
      const singularKey = parts.join(" ");
      const match = CANONICAL_TOPIC_MAP.get(singularKey);
      if (match) return match;
    } else {
      parts[parts.length - 1] = `${last}s`;
      const pluralKey = parts.join(" ");
      const match = CANONICAL_TOPIC_MAP.get(pluralKey);
      if (match) return match;
    }
  }

  return titleCaseTopic(key);
}

export function ensureTopicBucket(
  topics: Record<string, TopicBucket>,
  topic: string,
): string {
  const normalized = resolveTopicLabel(topic);
  const existingKey = Object.keys(topics).find(
    (key) => resolveTopicLabel(key) === normalized,
  );
  if (existingKey && existingKey !== normalized) {
    topics[normalized] = topics[existingKey];
    delete topics[existingKey];
  }
  topics[normalized] ??= {
    thoughts_to_remember: [],
    pitfalls: [],
  };
  return normalized;
}

export function getCanonicalProblemUrl(href: string): string {
  try {
    const { origin, pathname } = new URL(href);
    const match = pathname.match(/^\/problems\/[^/]+/);
    if (match) return `${origin}${match[0]}`;
    return `${origin}${pathname}`;
  } catch {
    return href;
  }
}

export function getProblemTitleFromPage(): string {
  return (
    document.querySelector("div.text-title-large a")?.textContent?.trim() ?? ""
  );
}

export function getProblemNumberFromTitle(title: string): number | null {
  const match = title.match(/^\s*(\d+)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

export function getRollingTopicsFromPage(): Record<string, TopicBucket> {
  const topicElements = document.querySelectorAll('a[href^="/tag/"]');
  const topicsList = Array.from(topicElements)
    .map((el) => el.getAttribute("href"))
    .filter((href): href is string => !!href)
    .map((href) => href.replace("/tag/", "").replace("/", ""))
    .map((slug) => resolveTopicLabel(slug));

  return Object.fromEntries(
    Array.from(new Set(topicsList)).map((t) => [
      t,
      { thoughts_to_remember: [], pitfalls: [] },
    ]),
  );
}

export function getEditorLanguageFromPage(): string {
  const editor = document.querySelector("#editor");
  if (!editor) return "";

  const button = editor.querySelector('button[aria-haspopup="dialog"]');
  if (!button) return "";

  const textNode = Array.from(button.childNodes).find(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
  );
  return textNode?.textContent?.trim() ?? button.textContent?.trim() ?? "";
}
