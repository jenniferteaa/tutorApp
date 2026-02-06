import type { StoredTutorSession } from "./session/storage";

export type Pair = [string, string];

export type PanelPosition = { x: number; y: number };
export type PanelSize = { width: number; height: number };

export type SessionRollingHistoryLLM = {
  qaHistory: string[];
  summary: string;
  toSummarize: string[];
};

export type RollingStateGuideMode = {
  problem: string;
  nudges: string[];
  lastEdit: string;
};

export type TutorSession = {
  element: HTMLElement;
  sessionId: string;
  userId: string;
  content: string[];
  problem: string;
  problemUrl: string;
  language: string;
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >;
  sessionTopicsInitialized: boolean;
  prompt: string;
  position: PanelPosition | null;
  size: PanelSize | null;
  guideModeEnabled: boolean;
  checkModeEnabled: boolean;
  rollingStateGuideMode: RollingStateGuideMode;
  sessionRollingHistory: SessionRollingHistoryLLM;
};

export const state = {
  widget: null as HTMLElement | null,
  panel: null as HTMLElement | null,
  isDragging: false,
  isWindowOpen: false,
  dragOffset: { x: 0, y: 0 },
  lastPosition: { x: 0, y: 0 },
  menuCloseTimeout: null as number | null,
  globalMouseMoveHandler: null as ((e: MouseEvent) => void) | null,
  flushInFlight: false,
  panelHideTimerId: null as number | null,
  suspendPanelOps: false,
  queue: [] as Pair[],
  currentBatch: null as Pair | null,
  editedLineQueue: [] as string[],
  lastGuideCursorLine: null as number | null,
  languageObserver: null as MutationObserver | null,
  languageObserverTarget: null as HTMLElement | null,
  summarizeInFlight: false,
  currentTutorSession: null as TutorSession | null,
  pendingStoredSession: null as StoredTutorSession | null,
  lastActivityAt: Date.now(),
  lastActivityStoredAt: 0,
  sessionRestorePending: false,
  persistTimerId: null as number | null,
  inactivityTimerId: null as number | null,
  problemUrlWatcherId: null as number | null,
  lastCanonicalProblemUrl: "",
  guideMinIdx: Number.POSITIVE_INFINITY,
  guideMaxIdx: -1,
  guideBatchTimerId: null as number | null,
  guideBatchStarted: false,
  guideTouchedLines: new Set<number>(),
  maxLines: 0,
  guideAttachAttempts: 0,
  guideDrainInFlight: false,
  lastGuideSelectionLine: null as number | null,
  lastGuideFlushLine: null as number | null,
  lastGuideFlushAt: 0,
  guideMessageCount: 0,
  lastGuideMessageEl: null as HTMLElement | null,
  guideActiveSlab: null as HTMLElement | null,
};
