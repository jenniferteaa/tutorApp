export type Topic = {
  slug: string; // "arrays"
  label: string; // "Arrays"
  preview?: string[];
};

export type Entry = {
  id: string;
  problemId: number;
  title: string;
  text?: string;
};

export type TopicQueryRow = {
  problemNo: number;
  problemName: string;
  problemLink?: string;
  dateTouched?: string;
  activityCreatedAt?: string;
  noteId: number;
  noteCreatedAt?: string;
  noteMade: string[];
  pitfalls: string[];
};

export type TopicDetails = {
  topic: Topic;
  pitfalls: Entry[];
  toRemember: Entry[];
  rows: TopicQueryRow[];
};

export type UserSummary = {
  username: string;
  user_id: string;
};
