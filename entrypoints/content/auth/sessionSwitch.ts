import { resetGuideState } from "../guide";
import { sendInitSessionTopics } from "../messaging";
import { handleBackendError } from "../net/errors";
import { scheduleSessionPersist } from "../session/storage";
import { state, type TutorSession } from "../state";
import { buildFreshSession } from "../session/lifecycle";

export async function initSessionTopicsIfNeeded(session: TutorSession) {
  if (session.sessionTopicsInitialized) return;
  let retried = false;
  while (true) {
    const resp = await sendInitSessionTopics({
      sessionId: session.sessionId,
      topics: session.topics,
    });
    if (
      resp &&
      (resp as { unauthorized?: boolean; status?: number })?.unauthorized
    ) {
      handleBackendError(session.element ?? null, resp);
      return;
    }
    if (!(resp as { success?: boolean })?.success) {
      const errorText = (resp as { error?: string })?.error?.toLowerCase() ?? "";
      const shouldRetry =
        (resp as { timeout?: boolean })?.timeout ||
        errorText.includes("network");
      if (shouldRetry && !retried) {
        retried = true;
        continue;
      }
      console.debug("Init session topics failed", resp);
      return;
    }
    session.sessionTopicsInitialized = true;
    scheduleSessionPersist(session.element ?? null);
    return;
  }
}

export function resetPanelForUser(
  panel: HTMLElement,
  userId: string,
  problemName: string,
) {
  resetGuideState();
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (contentArea) {
    contentArea.innerHTML = "";
  }
  const prompt = panel.querySelector<HTMLTextAreaElement>(
    ".tutor-panel-prompt",
  );
  if (prompt) {
    prompt.value = "";
  }
  state.currentTutorSession = buildFreshSession(panel, userId, problemName);
  if (state.currentTutorSession) {
    void initSessionTopicsIfNeeded(state.currentTutorSession);
  }
}
