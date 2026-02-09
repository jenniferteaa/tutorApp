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

  const isAllowedUrl = (url?: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" &&
        parsed.hostname === "leetcode.com" &&
        parsed.pathname.startsWith("/problems/")
      );
    } catch {
      return false;
    }
  };

  const updateActionForTab = async (tabId: number, url?: string) => {
    try {
      if (isAllowedUrl(url)) {
        await browser.action.enable(tabId);
      } else {
        await browser.action.disable(tabId);
      }
    } catch (error) {
      console.debug("VibeTutor: failed to update action state", error);
    }
  };

  browser.tabs.onUpdated.addListener(
    (tabId: any, changeInfo: any, tab: any) => {
      if (!tab.url) return;

      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://")
      ) {
        return;
      }

      if (changeInfo.status === "complete" || changeInfo.url) {
        void updateActionForTab(tabId, tab.url);
      }

      console.debug("VibeTutor: tab updated", tab.url);
    },
  );

  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    try {
      const tab = await browser.tabs.get(tabId);
      await updateActionForTab(tabId, tab.url);
    } catch (error) {
      console.debug("VibeTutor: failed to update action on activate", error);
    }
  });

  void browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      const tab = tabs[0];
      if (tab?.id) {
        return updateActionForTab(tab.id, tab.url);
      }
      return undefined;
    });
});
