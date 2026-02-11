import type { MessageSender, VibeTutorMessage } from "./types";
import { handleAskAway } from "./actions/askAction";
import { handleCheckCode } from "./actions/checkAction";
import { handleClearAuth, supabaseLogin, supabaseSignup } from "./actions/authAction";
import { handleGuideMode, handleGuideModeStatus } from "./actions/guideAction";
import { handleSaveNotes } from "./actions/notesAction";
import { handleSessionInit } from "./actions/sessionAction";
import { handleSummarize } from "./actions/summarizeAction";
import { handleGoToWorkspace } from "./actions/workspaceAction";
import { checkBackendHealth } from "./actions/healthAction";
import { isSaveNotesPayload } from "../validators/shared";
import { isGuideModePayload, isGuideModeStatusPayload } from "../validators/validateGuide";
import { isCheckCodePayload } from "../validators/validateCheck";
import { isSessionInitPayload } from "../validators/validateSession";
import { isChatPayload } from "../validators/validateAsk";
import { isSummarizePayload } from "../validators/validateSummarize";
import { isSupabaseLoginPayload, isSupabaseSignupPayload } from "../validators/validateAuth";

// async function handleMessage(message: VibeTutorMessage, sender: MessageSender) {
export async function handleMessage(
  message: VibeTutorMessage,
  _sender?: MessageSender,
) {
  switch (message.action) {
    case "save-notes": {
      if (!isSaveNotesPayload(message.payload)) {
        return { success: false, error: "Invalid notes payload" };
      }
      return handleSaveNotes(message.payload);
    }
    case "guide-mode": {
      if (!isGuideModePayload(message.payload)) {
        return { success: false, error: "Invalid guide mode payload" };
      }
      return handleGuideMode(message.payload);
    }
    case "guide-mode-status": {
      if (!isGuideModeStatusPayload(message.payload)) {
        return { success: false, error: "Invalid guide status payload" };
      }
      return handleGuideModeStatus(message.payload);
    }
    case "init-session-topics": {
      if (!isSessionInitPayload(message.payload)) {
        return { success: false, error: "Invalid session init payload" };
      }
      return handleSessionInit(message.payload);
    }
    case "check-code": {
      if (!isCheckCodePayload(message.payload)) {
        return { success: false, error: "Invalid check code payload" };
      }
      console.log("sending to handleCheckCode");
      const data = await handleCheckCode(message.payload);
      //console.log("this is the data: ", data);
      return data ?? { success: false, error: "Check failed" };
    }
    // case "solution": {
    //   if (!isSolutionPayload(message.payload)) {
    //     return { success: false, error: "Invalid solution payload" };
    //   }
    //   return handleSolution(message.payload);
    // }
    case "go-to-workspace":
      return handleGoToWorkspace(message.payload as { url?: string });

    case "ask-anything": {
      if (!isChatPayload(message.payload)) {
        return { success: false, error: "Invalid chat payload" };
      }
      const data = await handleAskAway({
        sessionId: message.payload.sessionId,
        action: message.payload.action,
        rollingHistory: message.payload.rollingHistory,
        summary: message.payload.summary,
        query: message.payload.query,
        language: message.payload.language,
      });
      return data ?? { success: false, error: "Ask failed" };
    }
    case "summarize-history": {
      if (!isSummarizePayload(message.payload)) {
        return { success: false, error: "Invalid summarize payload" };
      }
      const data = await handleSummarize({
        sessionID: message.payload.sessionId,
        summarize: message.payload.summarize,
        summary: message.payload.summary,
      });
      return data ?? { success: false, error: "Summarize failed" };
    }
    case "supabase-login": {
      //
      if (!isSupabaseLoginPayload(message.payload)) {
        return { success: false, error: "Invalid login payload" };
      }
      const auth = await supabaseLogin(message.payload);
      return auth ?? { success: false, error: "Login failed" };
    }
    case "supabase-signup": {
      if (!isSupabaseSignupPayload(message.payload)) {
        return { success: false, error: "Invalid signup payload" };
      }
      const auth = await supabaseSignup(message.payload);
      return auth ?? { success: false, error: "Signup failed" };
    }
    case "clear-auth":
      return handleClearAuth();
    case "backend-health":
      return checkBackendHealth();
    case "panel-opened":
    case "panel-closed":
      console.debug(`VibeTutor: ${message.action}`, message.payload);
      return { success: true };
    default:
      console.warn("VibeTutor: unknown action", message);
      return { success: false, error: "Unknown action" };
  }
}
