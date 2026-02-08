import { sendSummarizeHistory } from "../messaging";
import { handleBackendError } from "../net/errors";
import { state, type SessionRollingHistoryLLM } from "../state";

export async function requestHistorySummary(
  history: SessionRollingHistoryLLM,
) {
  if (state.summarizeInFlight || history.toSummarize.length === 0) return;
  //console.log("This is the toSummarize before clearing: ", history.toSummarize);
  const summarizeBatch = history.toSummarize.splice(0);
  state.summarizeInFlight = true;
  let retried = false;
  try {
    while (true) {
      const response = await sendSummarizeHistory({
        sessionId: state.currentTutorSession?.sessionId ?? "",
        summarize: summarizeBatch,
        summary: history.summary,
      });

      if (
        response &&
        (response as { unauthorized?: boolean; status?: number })?.unauthorized
      ) {
        handleBackendError(state.currentTutorSession?.element ?? null, response);
        return;
      }

      if (!(response as { success?: boolean })?.success) {
        const errorText =
          (response as { error?: string })?.error?.toLowerCase() ?? "";
        const shouldRetry =
          (response as { timeout?: boolean })?.timeout ||
          errorText.includes("network");
        if (shouldRetry && !retried) {
          retried = true;
          continue;
        }
        console.debug("Summarize history failed", response);
        return;
      }

      const reply = (response as { data?: { reply?: unknown } })?.data?.reply;
      if (typeof reply === "string") {
        history.summary = reply;
      }
      return;
    }
  } finally {
    state.summarizeInFlight = false;
  }
}

export function maybeQueueSummary(history: SessionRollingHistoryLLM) {
  if (history.qaHistory.length <= 40) return;
  const moved = history.qaHistory.splice(0, 20);
  history.toSummarize.push(...moved);
  void requestHistorySummary(history);
}
