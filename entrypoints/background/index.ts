import { getMonacoCodeFromTab } from "./core/actions/monacoAction";
import { handleMessage } from "./core/router";
import type { MessageSender, VibeTutorMessage } from "./core/types";
import { seedDefaultSettings } from "./helpers/settingsStore";

export default defineBackground(() => {
  console.log("VibeTutor: background script loaded");

  browser.runtime.onInstalled.addListener(async (details: any) => {
    if (details.reason !== "install") {
      return;
    }

    console.log("VibeTutor: extension installed");
    await seedDefaultSettings();

    try {
      await browser.tabs.create({ url: "https://example.com/welcome" });
    } catch (error) {
      console.warn("VibeTutor: unable to open welcome tab", error);
    }
  });

  browser.runtime.onMessage.addListener(
    (message: VibeTutorMessage, sender: MessageSender, sendResponse: any) => {
      if ((message as { type?: string })?.type === "GET_MONACO_CODE") {
        return;
      }
      handleMessage(message, sender)
        .then(sendResponse)
        .catch((error) =>
          sendResponse({ success: false, error: String(error) }),
        );
      return true;
    },
  );

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== "GET_MONACO_CODE") return;
    if (!sender.tab?.id) {
      sendResponse({ ok: false, error: "missing tab id" });
      return;
    }

    getMonacoCodeFromTab(sender.tab.id).then(sendResponse);
    return true;
  });

  browser.tabs.onUpdated.addListener(
    (_tabId: any, changeInfo: any, tab: any) => {
      if (changeInfo.status !== "complete" || !tab.url) {
        return;
      }

      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://")
      ) {
        return;
      }

      console.debug("VibeTutor: tab updated", tab.url);
    },
  );
});
