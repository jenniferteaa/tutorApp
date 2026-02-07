import { renderMarkdown } from "./render";

export function showAssistantLoading(panel: HTMLElement) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return null;
  const wrapper = document.createElement("div");
  wrapper.className = "tutor-panel-assistant-loading";
  const dot = document.createElement("div");
  dot.className = "tutor-panel-assistant-loading-dot";
  wrapper.appendChild(dot);
  contentArea.appendChild(wrapper);
  contentArea.scrollTop = wrapper.offsetTop;
  return wrapper;
}

export function appendPanelMessage(
  panel: HTMLElement,
  messageText: string,
  role: "assistant" | "user" | "guideAssistant" | "checkAssistant",
) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return null;
  const message = document.createElement("div");

  if (role === "assistant") {
    message.className = `tutor-panel-message tutor-panel-message--${role}`;
    message.innerHTML = renderMarkdown(messageText);
  } else if (role === "user") {
    message.className = "tutor-panel-message tutor-panel-message--user";
    message.textContent = messageText;
  } else if (role === "guideAssistant") {
    // 1) wrapper: owns borders + spacing
    const wrapper = document.createElement("div");
    wrapper.className = "guide-wrapper";

    // 2) bubble: owns background + padding
    message.className = `tutor-panel-message tutor-panel-message--${role}`;
    message.innerHTML = renderMarkdown(messageText);

    wrapper.appendChild(message);
    contentArea.appendChild(wrapper);

    return wrapper;
  } else if (role === "checkAssistant") {
    const wrapper = document.createElement("div");
    wrapper.className = "check-wrapper";

    message.className = `tutor-panel-message tutor-panel-message--${role}`;
    message.innerHTML = renderMarkdown(messageText);

    wrapper.appendChild(message);
    contentArea.appendChild(wrapper);

    return wrapper; // wrapper gets start/end
  } else {
    message.textContent = messageText;
  }
  contentArea.append(message);
  contentArea.scrollTop = message.offsetTop; // come back to this
  return message;
}

export function typeMessage(
  message: HTMLElement,
  contentArea: HTMLElement,
  text: string,
  options?: { render?: (value: string) => string },
) {
  return new Promise<void>((resolve) => {
    let index = 0;
    const step = 2;
    const targetTop = message.offsetTop;
    contentArea.scrollTop = targetTop;
    let allowAutoScroll = true;
    const onScroll = () => {
      if (Math.abs(contentArea.scrollTop - targetTop) > 8) {
        allowAutoScroll = false;
      }
    };
    contentArea.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => {
      index = Math.min(text.length, index + step);
      const slice = text.slice(0, index);
      if (options?.render) {
        message.innerHTML = options.render(slice);
      } else {
        message.textContent = slice;
      }
      if (allowAutoScroll) {
        contentArea.scrollTop = targetTop;
      }
      if (index < text.length) {
        window.setTimeout(tick, 12);
      } else {
        contentArea.removeEventListener("scroll", onScroll);
        resolve();
      }
    };
    tick();
  });
}
