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
  try {
    const response = await sendSummarizeHistory({
      sessionId: state.currentTutorSession?.sessionId ?? "",
      summarize: summarizeBatch,
      summary: history.summary,
    });
    if (
      handleBackendError(state.currentTutorSession?.element ?? null, response, {
        silent: true,
      })
    ) {
      return;
    }
    const reply =
      typeof response === "string" ? response : (response as any)?.reply;
    if (typeof reply === "string") {
      history.summary = reply;
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
