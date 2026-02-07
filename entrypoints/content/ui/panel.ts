import { runCheckMode } from "../check";
import { attachGuideListeners, detachGuideListeners } from "../guide";
import { getProblemNumberFromTitle } from "../leetcode";
import {
  sendGetMonacoCode,
  sendGoToWorkspace,
  sendGuideModeStatus,
} from "../messaging";
import { state } from "../state";
import { getWidgetDeps } from "./widget";

export function createTutorPanel() {
  // Optional safety: prevent duplicates
  document.getElementById("tutor-panel")?.remove();

  // const panel = document.createElement("div");
  // panel.id = "tutor-panel";

  const panel = document.createElement("div");
  panel.id = "tutor-panel";
  panel.classList.add("tutor-panel");

  panel.innerHTML = `
    <div class="tutor-panel-shellbar">
      <button class="tutor-panel-close">×</button>
    </div>

    <div class="tutor-panel-inner">
      <div class="tutor-panel-topbar">
        <div class="tutor-panel-actions">
          <button class="btn-guide-mode">Guide me</button>
          <button class="btn-help-mode">Check mode</button>
          <button class="btn-gotToWorkspace">Notes made</button>
        </div>
      </div>

      <div class="tutor-panel-content"></div>

      <div class="tutor-panel-inputbar">
        <textarea class="tutor-panel-prompt" placeholder="Ask anything..."></textarea>
        <button class="tutor-panel-send">Send</button>
      </div>
    </div>
  `;

  panel.style.position = "fixed";
  panel.style.zIndex = "1000000";
  panel.style.left = "50%";
  panel.style.top = "50%";
  panel.style.right = "50%";
  panel.style.bottom = "50%";
  // panel.style.transform = "translate(-50%, -50%)";

  document.body.appendChild(panel);

  // Default first-time position (bottom-left-ish), clamped to viewport
  const defaultLeft = 40;
  const defaultTop = Math.round(window.innerHeight * 0.38);
  const maxLeft = window.innerWidth - panel.offsetWidth - 20;
  const maxTop = window.innerHeight - panel.offsetHeight - 20;
  panel.style.left = `${Math.max(20, Math.min(defaultLeft, maxLeft))}px`;
  panel.style.top = `${Math.max(20, Math.min(defaultTop, maxTop))}px`;

  setTimeout(() => panel.classList.add("open"), 10);

  setupTutorPanelEvents(panel);
  return panel;
}

export function showTutorPanel(panel: HTMLElement) {
  if (state.panelHideTimerId !== null) {
    window.clearTimeout(state.panelHideTimerId);
    state.panelHideTimerId = null;
  }
  panel.classList.remove("closing");
  panel.style.display = "flex";
  panel.classList.add("open");
}

export function hideTutorPanel(panel: HTMLElement) {
  panel.classList.remove("open");
  panel.classList.add("closing");
  if (state.panelHideTimerId !== null) {
    window.clearTimeout(state.panelHideTimerId);
  }
  state.panelHideTimerId = window.setTimeout(() => {
    panel.style.display = "none";
    panel.classList.remove("closing");
    state.panelHideTimerId = null;
  }, 180);
}

export function setPanelControlsDisabledGuide(
  panel: HTMLElement,
  disabled: boolean,
) {
  const selectors = [
    ".btn-help-mode",
    ".tutor-panel-send",
    ".tutor-panel-prompt",
    ".btn-gotToWorkspace",
  ];
  for (const selector of selectors) {
    const element = panel.querySelector<HTMLElement>(selector);
    if (!element) continue;
    if (element instanceof HTMLButtonElement) {
      element.disabled = disabled;
      continue;
    }
    if (element instanceof HTMLTextAreaElement) {
      element.disabled = disabled;
      continue;
    }
    element.setAttribute("aria-disabled", disabled ? "true" : "false");
  }
}

export function setPanelControlsDisabled(panel: HTMLElement, disabled: boolean) {
  const selectors = [
    ".btn-guide-mode",
    ".btn-help-mode",
    ".tutor-panel-send",
    ".tutor-panel-prompt",
    ".btn-gotToWorkspace",
  ];
  for (const selector of selectors) {
    const element = panel.querySelector<HTMLElement>(selector);
    if (!element) continue;
    if (element instanceof HTMLButtonElement) {
      element.disabled = disabled;
      continue;
    }
    if (element instanceof HTMLTextAreaElement) {
      element.disabled = disabled;
      continue;
    }
    element.setAttribute("aria-disabled", disabled ? "true" : "false");
  }
}

function setupTutorPanelEvents(panel: HTMLElement) {
  const {
    askAnything,
    appendPanelMessage,
    closeTutorPanel,
    handleBackendError,
    highlightAskArea,
    maybeQueueSummary,
    scheduleSessionPersist,
    syncSessionLanguageFromPage,
    workspaceUrl,
  } = getWidgetDeps();

  const closeButton =
    panel.querySelector<HTMLButtonElement>(".tutor-panel-close");
  const checkModeClicked =
    panel.querySelector<HTMLButtonElement>(".btn-help-mode");
  const guideMode = panel.querySelector<HTMLButtonElement>(".btn-guide-mode");
  const goToWorkspace = panel.querySelector<HTMLButtonElement>(
    ".btn-gotToWorkspace",
  );

  guideMode?.addEventListener("click", () => {
    if (!state.currentTutorSession) return;

    state.currentTutorSession.guideModeEnabled =
      !state.currentTutorSession.guideModeEnabled;

    const guideModeButton = panel.querySelector<HTMLElement>(".btn-guide-mode");
    if (state.currentTutorSession.userId) {
      const problemName = state.currentTutorSession.problem;
      const problemNo = getProblemNumberFromTitle(problemName);
      void sendGuideModeStatus({
        enabled: state.currentTutorSession.guideModeEnabled,
        sessionId: state.currentTutorSession.sessionId,
        problem_no: problemNo,
        problem_name: problemName,
        problem_url: state.currentTutorSession.problemUrl,
      });
    }
    setPanelControlsDisabledGuide(panel, true);
    panel.classList.add("guidemode-active");

    if (state.currentTutorSession.guideModeEnabled) {
      //content_area?.classList.add("guide_start");
      guideModeButton?.classList.add("is-loading"); // #change this to is-active
      state.guideMessageCount = 0;
      state.lastGuideMessageEl = null;
      state.guideActiveSlab = null;
      attachGuideListeners();
    } else {
      detachGuideListeners();
      if (state.lastGuideMessageEl) {
        state.lastGuideMessageEl.classList.add("guide-end");
      }
      setPanelControlsDisabledGuide(panel, false);
      panel.classList.remove("guidemode-active");
      guideModeButton?.classList.remove("is-loading");
    }
    scheduleSessionPersist(panel);
  });

  goToWorkspace?.addEventListener("click", async () => {
    if (!workspaceUrl) {
      console.warn("Workspace URL is not set.");
      return;
    }
    const resp = await sendGoToWorkspace({ url: workspaceUrl });
    handleBackendError(panel, resp, {
      serverMessage: "Unable to open workspace right now.",
      lockOnServerError: false,
    });
  });

  const prompt = panel.querySelector<HTMLTextAreaElement>(
    ".tutor-panel-prompt",
  );
  const sendQuestion =
    panel.querySelector<HTMLButtonElement>(".tutor-panel-send");

  prompt?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    sendQuestion?.click();
  });

  sendQuestion?.addEventListener("click", async () => {
    syncSessionLanguageFromPage();
    if (!state.currentTutorSession?.prompt) return highlightAskArea();
    else {
      const toAsk = state.currentTutorSession.prompt;
      if (prompt) {
        prompt.value = "";
      }
      if (state.currentTutorSession) {
        state.currentTutorSession.prompt = "";
      }
      appendPanelMessage(panel, toAsk, "user");
      state.currentTutorSession.sessionRollingHistory.qaHistory.push(
        `user: ${toAsk}`,
      );
      maybeQueueSummary(state.currentTutorSession.sessionRollingHistory);
      scheduleSessionPersist(panel);
      const resp = await askAnything(panel, toAsk);
      state.currentTutorSession.prompt = "";
      scheduleSessionPersist(panel);
    }
  });

  // const content_area = panel.querySelector<HTMLElement>(".tutor-panel-content");

  closeButton?.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });
  closeButton?.addEventListener("click", async () => closeTutorPanel());
  // i am taking the repsonse from checkMode function and awaiting it here. Lets see if this works
  checkModeClicked?.addEventListener("click", async () => {
    const checkModeButton = panel.querySelector<HTMLElement>(".btn-help-mode");
    let codeSoFar = "";
    if (state.currentTutorSession) {
      state.currentTutorSession.checkModeEnabled = true;
      checkModeButton?.classList.add("is-loading");
    }
    setPanelControlsDisabled(panel, true);
    panel.classList.add("checkmode-active");

    try {
      const res = await sendGetMonacoCode(); // check this later
      if (
        res?.ok &&
        typeof res.code === "string" &&
        state.currentTutorSession
      ) {
        codeSoFar = res.code;
      }
      const resp = await runCheckMode(panel, codeSoFar);
      console.log("this is the response: ", resp);
    } catch {
      // Fallback to DOM-extracted code when background messaging fails.
    } finally {
      if (state.currentTutorSession) {
        state.currentTutorSession.checkModeEnabled = false;
        checkModeButton?.classList.remove("is-loading");
      }
      setPanelControlsDisabled(panel, false);
      panel.classList.remove("checkmode-active");
      scheduleSessionPersist(panel);
    }
  });

  prompt?.addEventListener("input", () => {
    if (state.currentTutorSession) {
      state.currentTutorSession.prompt = prompt.value;
    }
    scheduleSessionPersist(panel);
  });

  let isPanelDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragTargetX = 0;
  let dragTargetY = 0;
  let dragRafId: number | null = null;
  const dragEase = 0.6;

  const header = panel.querySelector<HTMLElement>(".tutor-panel-shellbar");
  const tickDrag = () => {
    if (!isPanelDragging) {
      dragRafId = null;
      return;
    }
    const currentX = panel.offsetLeft;
    const currentY = panel.offsetTop;
    const easedX = currentX + (dragTargetX - currentX) * dragEase;
    const easedY = currentY + (dragTargetY - currentY) * dragEase;
    panel.style.left = `${easedX}px`;
    panel.style.top = `${easedY}px`;
    dragRafId = requestAnimationFrame(tickDrag);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isPanelDragging) return;
    const nextX = event.clientX - dragOffsetX;
    const nextY = event.clientY - dragOffsetY;
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;

    dragTargetX = Math.max(10, Math.min(nextX, maxX));
    dragTargetY = Math.max(10, Math.min(nextY, maxY));

    if (dragRafId === null) {
      dragRafId = requestAnimationFrame(tickDrag);
    }
  };

  const stopDragging = () => {
    if (!isPanelDragging) return;
    isPanelDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDragging);
    if (dragRafId !== null) {
      cancelAnimationFrame(dragRafId);
      dragRafId = null;
    }
    panel.style.left = `${dragTargetX}px`;
    panel.style.top = `${dragTargetY}px`;
    if (state.currentTutorSession) {
      state.currentTutorSession.position = {
        x: panel.offsetLeft,
        y: panel.offsetTop,
      };
    }
    scheduleSessionPersist(panel);
  };

  header?.addEventListener("mousedown", (event) => {
    event.preventDefault();
    isPanelDragging = true;
    dragOffsetX = event.clientX - panel.getBoundingClientRect().left;
    dragOffsetY = event.clientY - panel.getBoundingClientRect().top;
    dragTargetX = panel.offsetLeft;
    dragTargetY = panel.offsetTop;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDragging);
  });
}
