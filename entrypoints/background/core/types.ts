export type VibeTutorMessage = {
  action: string;
  payload: {
    query?: string;
    code?: string;
    action: string;
  };
};

export type MessageSender = {
  tab?: {
    id?: number;
    url?: string;
    title?: string;
  };
};

export type RollingStateGuideMode = {
  problem: string;
  nudges: string[]; // keep last N
  lastEdit: string;
};

export type AuthState = {
  userId: string;
  jwt: string;
  accessToken?: string;
  refreshToken?: string;
  issuedAt?: number;
  expiresAt?: number;
};

export type BackendFetchSuccess<T> = {
  success: true;
  data: T;
  status: number;
};

export type BackendFetchError = {
  success: false;
  error: string;
  status?: number;
  timeout?: boolean;
  unauthorized?: boolean;
};

export type TopicBucket = {
  thoughts_to_remember: string[];
  pitfalls: string[];
};

export type TopicsMap = Record<string, TopicBucket>;
