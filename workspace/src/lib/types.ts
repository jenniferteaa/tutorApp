export type Topic = {
  slug: string; // "arrays"
  label: string; // "Arrays"
  preview?: string[];
};

export type TopicProblem = {
  problemNo: number;
  problemName: string;
  problemLink?: string;
  latestDate?: string;
};

export type TopicDetails = {
  topic: Topic;
  notesSummary: string;
  pitfallsSummary: string;
  problems: TopicProblem[];
};

export type UserSummary = {
  username: string;
  user_id: string;
};
