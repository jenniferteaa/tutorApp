import {
  ensureTopicBucket,
  getEditorLanguageFromPage,
  getProblemNumberFromTitle,
} from "../leetcode";
import { sendCheckCode } from "../messaging";
import { state } from "../state";

type CheckDeps = {
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

let checkDeps: CheckDeps | null = null;

export function configureCheck(next: CheckDeps) {
  checkDeps = next;
}

function getCheckDeps(): CheckDeps {
  if (!checkDeps) {
    throw new Error("Check dependencies not configured");
  }
  return checkDeps;
}

export async function runCheckMode(
  panel: HTMLElement,
  writtenCode: string | unknown,
) {
  const { appendToContentPanel, handleBackendError, scheduleSessionPersist, syncSessionLanguageFromPage } =
    getCheckDeps();

  //console.log("this is the code written so far: ", writtenCode);
  try {
    syncSessionLanguageFromPage();
    const response = await sendCheckCode({
      sessionId: state.currentTutorSession?.sessionId ?? "",
      topics: state.currentTutorSession?.topics,
      code: writtenCode, // <-- raw string
      action: "check-code",
      language: state.currentTutorSession?.language ?? getEditorLanguageFromPage(),
      problem_no: getProblemNumberFromTitle(
        state.currentTutorSession?.problem ?? "",
      ),
      problem_name: state.currentTutorSession?.problem ?? "",
      problem_url: state.currentTutorSession?.problemUrl ?? "",
    });
    if (
      handleBackendError(panel, response, {
        timeoutMessage:
          "The model is taking longer than usual. Please try again.",
      })
    ) {
      return "Failure";
    }
    const response_llm = (response as { data?: { resp?: unknown } })?.data
      ?.resp;
    //const pretty = prettifyLlMResponse(response_llm);
    if (state.currentTutorSession && typeof response_llm === "string") {
      state.currentTutorSession.content.push(`${response_llm}\n`);
    }
    if (typeof response_llm === "string" && response_llm.trim()) {
      await appendToContentPanel(panel, "", "checkAssistant", response_llm);
    }

    const topics = (response as { data?: { topics?: unknown } })?.data?.topics;
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
    console.log("this is the object now: ", state.currentTutorSession?.topics);
    scheduleSessionPersist(panel);
    return (response as { data?: { resp?: unknown } })?.data?.resp;
  } catch (error) {
    console.error("checkMode failed", error);
    return "Failure";
  }
  //console.log("this is the respnse: ", response);
}
