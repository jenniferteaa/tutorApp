import { ensureTopicBucket, getEditorLanguageFromPage } from "../leetcode";
import { sendGetMonacoCode, sendGuideMode } from "../messaging";
import { state } from "../state";

type GuideDeps = {
  appendToContentPanel: (
    panel: HTMLElement,
    some: string,
    role: "assistant" | "user" | "guideAssistant" | "checkAssistant",
    llmResponse: string,
  ) => Promise<void> | void;
  scheduleSessionPersist: (panel?: HTMLElement | null) => void;
  syncSessionLanguageFromPage: () => void;
  handleBackendError: (
    panel: HTMLElement | null,
    response: unknown,
    options?: {
      timeoutMessage?: string;
      serverMessage?: string;
      silent?: boolean;
      lockOnServerError?: boolean;
    },
  ) => boolean;
};

let guideDeps: GuideDeps | null = null;

export function configureGuide(next: GuideDeps) {
  guideDeps = next;
}

function getGuideDeps(): GuideDeps {
  if (!guideDeps) {
    throw new Error("Guide dependencies not configured");
  }
  return guideDeps;
}

export function resetGuideState() {
  // maybe we dont need to reset
  state.guideMinIdx = Number.POSITIVE_INFINITY;
  state.guideMaxIdx = -1;
  state.guideBatchTimerId = null;
  state.guideBatchStarted = false;
  state.guideTouchedLines = new Set<number>();
  state.maxLines = 0;
  state.guideAttachAttempts = 0;
  state.guideDrainInFlight = false;
  state.lastGuideSelectionLine = null;
  state.lastGuideFlushLine = null;
  state.lastGuideFlushAt = 0;
  state.guideMessageCount = 0;
  state.lastGuideMessageEl = null;
  state.guideActiveSlab = null;
}

function getEditorInputArea(): HTMLTextAreaElement | null {
  return document.querySelector(
    ".monaco-editor textarea.inputarea",
  ) as HTMLTextAreaElement | null;
}

function getLineNumberFromIndex(code: string, idx: number) {
  return code.slice(0, Math.max(0, idx)).split("\n").length;
}

function getFocusBlock(
  code: string,
  minIdx: number,
  maxIdx: number,
  extraLines = 1,
) {
  console.log("this is hte minIdx for the focus block: ");
  const safeMin = Math.max(0, Math.min(minIdx, code.length));
  const safeMax = Math.max(0, Math.min(maxIdx, code.length));
  let start = code.lastIndexOf("\n", safeMin - 1);
  start = start === -1 ? 0 : start + 1;
  let end = code.indexOf("\n", safeMax);
  end = end === -1 ? code.length : end;
  console.log("this is the start for the focus block: ", start);

  // if (extraLines > 0) {
  //   for (let i = 0; i < extraLines; i += 1) {
  //     const prev = code.lastIndexOf("\n", start - 2);
  //     start = prev === -1 ? 0 : prev + 1;
  //     const next = code.indexOf("\n", end + 1);
  //     end = next === -1 ? code.length : next;
  //   }
  // }

  return {
    focusBlock: code.slice(start, end),
    focusStartIdx: start,
    focusEndIdx: end,
  };
}

function getLineByNumber(code: string, lineNumber: number) {
  const lines = code.split("\n");
  return lines[lineNumber - 1] ?? "";
}

function isValidFocusLine(focusLine: string): boolean {
  // this is only for Java, for now. Have to implement for python, c, c#, c++, js and all
  const trimmed = focusLine.trim();
  if (!trimmed) return false;
  if (/[;}]\s*$/.test(trimmed)) return true;
  if (trimmed === "else" || trimmed === "if" || trimmed === "while") {
    return false;
  }
  if (/^else\b/.test(trimmed) && /\{\s*$/.test(trimmed)) {
    return false;
  }
  const wordCount = trimmed
    .replace(/[{}();]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return wordCount > 1;
}

function getCodeFromEditor() {
  const codeText = (
    document.querySelector(
      ".monaco-scrollable-element.editor-scrollable.vs.mac",
    ) as HTMLElement | null
  )?.innerText;
  //.lines-content.monaco-editor-background
  return codeText ?? "";
}

// this function does not give any code
function getCodeElementFullCode(): HTMLTextAreaElement | null {
  return document.querySelector(
    ".view-lines.monaco-mouse-cursor-text",
    // ".monaco-scrollable-element.editor-scrollable.vs.mac",
  ) as HTMLTextAreaElement | null;
  //.lines-content.monaco-editor-background
}

function resetGuideBatch() {
  state.guideTouchedLines.clear();
  state.guideMinIdx = Number.POSITIVE_INFINITY;
  state.guideMaxIdx = -1;
  state.guideBatchStarted = false;
  if (state.guideBatchTimerId !== null) {
    window.clearTimeout(state.guideBatchTimerId);
    state.guideBatchTimerId = null;
  }
}

async function flushGuideBatch(
  trigger: "timer" | "threshold" | "cursor-change",
) {
  // faulty
  const fullCode = getCodeFromEditor(); // redundant
  const inputArea = getEditorInputArea();
  const inputAreaCode = inputArea?.value ?? "";
  const lineNumber = Array.from(state.guideTouchedLines)[0] ?? 1;
  if (!lineNumber) {
    resetGuideBatch();
    return;
  }
  const now = Date.now();
  if (
    state.lastGuideFlushLine === lineNumber &&
    now - state.lastGuideFlushAt < 250
  ) {
    return;
  }
  state.lastGuideFlushLine = lineNumber;
  state.lastGuideFlushAt = now;
  //const focusBlock = inputArea.value ?? "";
  if (!fullCode) {
    // redundant
    resetGuideBatch();
    return;
  }
  let focusLine = "";
  if (inputAreaCode) {
    focusLine = getLineByNumber(inputAreaCode, lineNumber);
  }

  if (!focusLine.trim() && lineNumber > 1 && inputAreaCode) {
    const previousLine = getLineByNumber(inputAreaCode, lineNumber - 1);
    if (previousLine.trim()) {
      focusLine = previousLine;
    }
  }

  let codeSoFar = fullCode;
  try {
    const res = await sendGetMonacoCode();
    if (res?.ok && typeof res.code === "string") {
      codeSoFar = res.code;
    }
  } catch {
    // Fallback to DOM-extracted code when background messaging fails.
  }
  if (!isValidFocusLine(focusLine)) {
    resetGuideBatch();
  } else {
    state.queue.push([codeSoFar, focusLine]);
    void drainGuideQueue();

    resetGuideBatch();
  }
}

async function drainGuideQueue() {
  const {
    appendToContentPanel,
    handleBackendError,
    scheduleSessionPersist,
    syncSessionLanguageFromPage,
  } = getGuideDeps();

  if (state.guideDrainInFlight) return;
  if (state.suspendPanelOps) {
    state.queue = [];
    return;
  }
  state.guideDrainInFlight = true;
  try {
    while (state.queue.length > 0) {
      if (state.suspendPanelOps) {
        state.queue = [];
        break;
      }
      const [code, focusLine] = state.queue.shift()!;
      if (!code || !code.trim()) {
        if (state.currentTutorSession?.element) {
          await appendToContentPanel(
            state.currentTutorSession.element,
            "",
            "assistant",
            "Couldn't read editor code. Try clicking inside the editor or reload the page.",
          );
        }
        continue;
      }
      console.log("This is the focus line: ", focusLine); // this is not the one, get the correct focus line
      console.log("the code so far: ", code);
      syncSessionLanguageFromPage();
      state.flushInFlight = true;
      const resp = await sendGuideMode({
        action: "guide-mode",
        sessionId: state.currentTutorSession?.sessionId ?? "",
        problem: state.currentTutorSession?.problem ?? "",
        topics: state.currentTutorSession?.topics,
        code,
        focusLine,
        language:
          state.currentTutorSession?.language ?? getEditorLanguageFromPage(),
        rollingStateGuideMode: state.currentTutorSession?.rollingStateGuideMode,
      });
      if (
        handleBackendError(state.currentTutorSession?.element ?? null, resp, {
          timeoutMessage:
            "Guide mode is taking longer than usual. Please try again.",
        })
      ) {
        state.flushInFlight = false;
        continue;
      }
      if (!resp) {
        console.log("failure for guide mode");
      } else {
        // Put this into a separate function
        type GuideReply = {
          state_update?: { lastEdit?: string };
          nudge?: string;
          topics?: Record<
            string,
            {
              thoughts_to_remember?: string[] | string;
              pitfalls?: string[] | string;
            }
          >;
        };
        const reply = (resp as { data?: { reply?: GuideReply } })?.data?.reply;
        if (
          reply?.state_update?.lastEdit?.trim() &&
          state.currentTutorSession
        ) {
          state.currentTutorSession.rollingStateGuideMode.lastEdit =
            reply.state_update.lastEdit;
        }
        const nudge = reply?.nudge;

        if (state.currentTutorSession && typeof nudge === "string") {
          const trimmedNudge = nudge.trim();
          if (trimmedNudge) {
            state.currentTutorSession.rollingStateGuideMode.nudges.push(
              trimmedNudge,
            );
            state.currentTutorSession.content.push(`${trimmedNudge}\n`);
            if (state.currentTutorSession.element != null) {
              await appendToContentPanel(
                state.currentTutorSession.element,
                "",
                "guideAssistant",
                trimmedNudge,
              );
            }
            scheduleSessionPersist(state.currentTutorSession.element ?? null);
          }
        }

        const topics = reply?.topics;
        if (topics && typeof topics === "object" && state.currentTutorSession) {
          for (const [topic, raw] of Object.entries(
            topics as Record<string, unknown>,
          )) {
            if (!raw || typeof raw !== "object") continue;
            const normalizedTopic = ensureTopicBucket(
              state.currentTutorSession.topics,
              topic,
            );

            const thoughts = (raw as { thoughts_to_remember?: unknown })
              .thoughts_to_remember;
            const pitfalls = (raw as { pitfalls?: unknown }).pitfalls;

            const thoughtValues = Array.isArray(thoughts)
              ? thoughts
              : typeof thoughts === "string" && thoughts.trim()
                ? [thoughts.trim()]
                : [];

            const pitfallValues = Array.isArray(pitfalls)
              ? pitfalls
              : typeof pitfalls === "string" && pitfalls.trim()
                ? [pitfalls.trim()]
                : [];

            if (!state.currentTutorSession) continue;
            if (thoughtValues.length > 0) {
              state.currentTutorSession.topics[
                normalizedTopic
              ].thoughts_to_remember.push(...thoughtValues);
            }
            if (pitfallValues.length > 0) {
              state.currentTutorSession.topics[normalizedTopic].pitfalls.push(
                ...pitfallValues,
              );
            }
          }
        }
        if (state.currentTutorSession?.element) {
          scheduleSessionPersist(state.currentTutorSession.element);
        }
        state.flushInFlight = false;
      }
    }
  } finally {
    state.guideDrainInFlight = false;
  }
}

function onGuideInput() {
  // remove the event from here
  if (!state.currentTutorSession?.guideModeEnabled) return;
  const inputArea = getEditorInputArea();
  // here, fetch the line number from the inputarea, write a separate function from getEditorInputArea
  if (!inputArea) return;

  const fullCode = inputArea.value ?? ""; // to be checked if it get the whole code or not
  const cursorIdx = inputArea.selectionStart ?? 0;

  const lineNumber = getLineNumberFromIndex(fullCode, cursorIdx);
  //maybeEnqueueEditedLine(event, lineNumber);
  if (
    !state.guideTouchedLines.has(lineNumber) &&
    state.guideTouchedLines.size == 0
  ) {
    state.guideTouchedLines.add(lineNumber);
  }

  if (!state.guideBatchStarted) {
    state.guideBatchStarted = true;
  }
  if (state.guideBatchTimerId !== null) {
    window.clearTimeout(state.guideBatchTimerId);
  }
  state.guideBatchTimerId = window.setTimeout(() => {
    flushGuideBatch("timer");
  }, 10000);

  if (
    !state.guideTouchedLines.has(lineNumber) &&
    state.guideTouchedLines.size == 1
  ) {
    flushGuideBatch("threshold");
  }
}

function onGuideSelectionChange() {
  if (!state.currentTutorSession?.guideModeEnabled) return;
  if (!state.guideBatchStarted) return;
  const inputArea = getEditorInputArea();
  if (!inputArea) return;
  const fullCode = inputArea.value ?? "";
  const cursorIdx = inputArea.selectionStart ?? 0;
  const lineNumber = getLineNumberFromIndex(fullCode, cursorIdx);
  if (state.lastGuideSelectionLine === null) {
    state.lastGuideSelectionLine = lineNumber;
    return;
  }
  if (lineNumber === state.lastGuideSelectionLine) return;
  state.lastGuideSelectionLine = lineNumber;
  if (
    !state.guideTouchedLines.has(lineNumber) &&
    state.guideTouchedLines.size == 1
  ) {
    flushGuideBatch("cursor-change");
  }
}

export function attachGuideListeners() {
  const inputArea = getEditorInputArea();
  //console.log("this is the input line: ", inputArea);

  if (!inputArea) {
    if (state.guideAttachAttempts < 5) {
      state.guideAttachAttempts += 1;
      window.setTimeout(attachGuideListeners, 500);
    }
    return;
  }
  inputArea.addEventListener("input", onGuideInput); // every time the user inputs characters, the onGuideInput function is called
  document.addEventListener("selectionchange", onGuideSelectionChange);
}

export function detachGuideListeners() {
  const inputArea = getEditorInputArea();
  if (!inputArea) return;
  inputArea.removeEventListener("input", onGuideInput);
  document.removeEventListener("selectionchange", onGuideSelectionChange);
}
