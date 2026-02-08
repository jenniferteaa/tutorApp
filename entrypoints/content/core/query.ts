import { getEditorLanguageFromPage } from "../leetcode";
import { sendAskAnything } from "../messaging";
import { handleBackendError } from "../net/errors";
import { state } from "../state";
import { showAssistantLoading } from "../ui/messages";
import { appendToContentPanel } from "../ui/panel";

export async function askAnything(
  panel: HTMLElement,
  query: string,
): Promise<string> {
  //console.log("this is the query asked: ", query);
  const loadingEl = showAssistantLoading(panel);
  const language =
    state.currentTutorSession?.language || getEditorLanguageFromPage();
  const response = await sendAskAnything({
    sessionId: state.currentTutorSession?.sessionId ?? "",
    action: "ask-anything",
    rollingHistory: state.currentTutorSession?.sessionRollingHistory.qaHistory,
    summary: state.currentTutorSession?.sessionRollingHistory.summary ?? "",
    query: query,
    language,
  });
  if (
    handleBackendError(panel, response, {
      timeoutMessage:
        "The model is taking longer than usual. Please try again.",
    })
  ) {
    loadingEl?.remove();
    return "Failure";
  }
  const reply =
    typeof response === "string"
      ? response
      : (response as { data?: { reply?: string } })?.data?.reply ?? "";
  if (reply.trim()) {
    loadingEl?.remove();
    appendToContentPanel(panel, "", "assistant", reply);
  }
  loadingEl?.remove();
  if (!reply) return "Failure";
  return reply;
}
