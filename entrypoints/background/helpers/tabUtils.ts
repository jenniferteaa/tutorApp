import type { MessageSender } from "../core/types";

export function handleGetTabInfo(sender: MessageSender) {
  if (!sender.tab) {
    return { success: false, error: "No tab context" };
  }

  const { id, url, title } = sender.tab;
  return {
    success: true,
    tab: { id, url, title },
  };
}
