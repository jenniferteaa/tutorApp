import { resetGuideState } from "../guide";
import { sendInitSessionTopics } from "../messaging";
import { scheduleSessionPersist } from "../session/storage";
import { state, type TutorSession } from "../state";
import { buildFreshSession } from "../session/lifecycle";

export async function initSessionTopicsIfNeeded(session: TutorSession) {
  if (session.sessionTopicsInitialized) return;
  if (!session.userId) return;
  const resp = await sendInitSessionTopics({
    sessionId: session.sessionId,
    topics: session.topics,
  });
  if (resp?.success) {
    session.sessionTopicsInitialized = true;
    scheduleSessionPersist(session.element ?? null);
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
