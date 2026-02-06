import { runCheckMode } from "../check";
import { attachGuideListeners, detachGuideListeners } from "../guide";
import { getProblemNumberFromTitle } from "../leetcode";
import {
  sendGetMonacoCode,
  sendGoToWorkspace,
  sendGuideModeStatus,
} from "../messaging";
import { state, type SessionRollingHistoryLLM } from "../state";

type WidgetDeps = {
  openTutorPanel: () => Promise<void> | void;
  closeTutorPanel: () => void;
  askAnything: (panel: HTMLElement, query: string) => Promise<string>;
  highlightAskArea: () => void;
  appendPanelMessage: (
    panel: HTMLElement,
    messageText: string,
    role: "assistant" | "user" | "guideAssistant" | "checkAssistant",
  ) => HTMLElement | null;
  maybeQueueSummary: (history: SessionRollingHistoryLLM) => void;
  scheduleSessionPersist: (panel?: HTMLElement | null) => void;
  syncSessionLanguageFromPage: () => void;
  handleBackendError: (
    panel: HTMLElement | null,
    response: unknown,
    options?: {
      timeoutMessage?: string;
      serverMessage?: string;
      silent?: boolean;
      lockOnServerError?: boolean;
    },
  ) => boolean;
  workspaceUrl: string;
};

let widgetDeps: WidgetDeps | null = null;

export function configureWidget(next: WidgetDeps) {
  widgetDeps = next;
}

function getWidgetDeps(): WidgetDeps {
  if (!widgetDeps) {
    throw new Error("Widget dependencies not configured");
  }
  return widgetDeps;
}

export function createFloatingWidget() {
  const { closeTutorPanel, openTutorPanel } = getWidgetDeps();

  // remove existing widget
  const existingWidget = document.getElementById("tutor-widget");
  if (existingWidget) {
    existingWidget.remove();
  }

  // create main widget container
  state.widget = document.createElement("div");
  state.widget.id = "tutor-widget";

  state.widget.innerHTML = `
  <div class="widget-main-button" id="main-button">
  </div>
  `;

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
  #tutor-widget{
  position: fixed;
  left: 0;
  top: 0;
  transform: translate(0px, 0px);
  z-index: 999999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  user-select: none;
  pointer-events: auto;
  }
  
.widget-main-button {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #C8D0CC 0%, #A7B2AD 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(47,59,56,0.18);
      transition: all 0.3s ease;
      /*border: 2px solid rgba(255, 255, 255, 0.3); */
      backdrop-filter: blur(2px);
      position: relative;
      color: #ffffff;
    }
.widget-main-button.dragging {
      cursor: grabbing !important;
      transform: scale(0.95);
      box-shadow: 
        0 8px 30px rgba(47,59,56,0.35),
    /*     0 0 25px rgb(120, 126, 123), */
    /*    0 0 50px rgba(204, 102, 218, 0.7), */
    /*    0 0 80px rgba(204, 102, 218, 0.5); */
      animation: none;
    }
      
    /* =========================
   PANEL - Better Layout
   ========================= */

.tutor-panel{
  position: fixed;
  width: 430px;
  height: 280px;

  background: #EEF1F0;
  border-radius: 7px;
  border: none;
  box-shadow:
    0 14px 30px rgba(47,59,56,0.18),
    0 2px 6px rgba(47,59,56,0.10);

  z-index: 999997;
  font-family: Calibri, sans-serif;
  font-size: 13px;
  color: #2F3B38;
  font-weight: 500;

  transform: none;
  opacity: 0;

  transition:
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 180ms ease-out,
    box-shadow 200ms ease-out;

  display: flex;
  flex-direction: column;

  overflow: hidden;
  resize: both;

  min-width: 300px;
  min-height: 250px;
  max-width: 650px;
  max-height: 520px;
}

.tutor-panel-shellbar{
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 12px;
  background: #D6DDD9;
  border-bottom: 1px solid #C1C9C5;
  transition: background-color 160ms ease, box-shadow 160ms ease;
  cursor: grab;
  justify-content: flex-end;
}
.tutor-panel-shellbar:hover{
  background: #C8D0CC;
}

.tutor-panel-shellbar:active{
  background: #C8D0CC;
  cursor: grabbing;
}

.tutor-panel-inner{
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.tutor-panel.tutor-panel-locked .tutor-panel-inner .tutor-panel-topbar,
.tutor-panel.tutor-panel-locked .tutor-panel-inner .tutor-panel-content,
.tutor-panel.tutor-panel-locked .tutor-panel-inner .tutor-panel-inputbar{
  filter: blur(5px);
  pointer-events: none;
}

.tutor-panel.open {
  opacity: 1;
  transform: none;
}

.tutor-panel.closing{
  pointer-events: none;
}

.tutor-panel-loading{
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000001;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F7F9F8;
  border: 1px solid #C1C9C5;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #2F3B38;
  box-shadow: 0 6px 14px rgba(47,59,56,0.12);
}

.tutor-panel-loading-spinner{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(93,106,102,0.35);
  border-top-color: rgba(93,106,102,0.9);
  animation: tutorPanelSpin 0.8s linear infinite;
}

@keyframes tutorPanelSpin{
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tutor-panel-assistant-loading{
  display: flex;
  align-items: center;
  padding: 8px 12px;
}

.tutor-panel-assistant-loading-dot{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(82, 99, 94, 0.9);
  animation: tutorPanelBlink 0.9s ease-in-out infinite;
}

@keyframes tutorPanelBlink{
  0%, 100% { opacity: 0.25; transform: scale(0.9); }
  50% { opacity: 0.9; transform: scale(1); }
}

.tutor-panel.dragging{
  cursor: grabbing !important;
  transform: scale(0.98) rotate(-0.4deg);
  box-shadow:
    0 18px 50px rgba(47,59,56,0.25),
    0 2px 10px rgba(47,59,56,0.12);
}

/* Top bar */
.tutor-panel-topbar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 10px;
  background: transparent;
  border-bottom: none;
}

/* Close button */
.tutor-panel-close{
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;

  /* background: rgba(231, 218, 225, 0.45); */
  color: #5D6A66;
  font-size: 13px;
  line-height: 1;

  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 120ms ease, background 120ms ease;
}
.tutor-panel-close:hover{
  transform: scale(1.06);
  background: rgba(200,208,204,0.6);
}

/* Actions row */
.tutor-panel-actions{
  display: flex;
  align-items: center;
  gap: 12px;

  /* IMPORTANT: don’t let this become a giant green slab */
  background: transparent;
  padding: 0;
  margin: 0;
}

/* Buttons */
.btn-guide-mode,
.btn-help-mode,
.btn-gotToWorkspace{
  border: none;
  background: #D6DDD9;
  color: #2F3B38;

  padding: 6px 10px;
  border-radius: 8px;

  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.01em;

  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.btn-guide-mode:not(:disabled):hover,
.btn-help-mode:not(:disabled):hover,
.btn-gotToWorkspace:not(:disabled):hover{
  background: #C8D0CC;
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-gotToWorkspace:active{
  background: #C8D0CC;
}


@keyframes hoverPulse {
  0%   { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
  50%  { transform: translateY(-2px); filter: brightness(1.02) saturate(1.15); }
  100% { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
}

.btn-guide-mode.is-loading{
  background: #A7B2AD;
  animation: hoverPulse 1.2s ease-in-out infinite;
}


.btn-help-mode.is-loading{
  background: #A7B2AD;
  animation: hoverPulse 1.2s ease-in-out infinite;
  }

.tutor-panel.checkmode-active .btn-guide-mode,
.tutor-panel.checkmode-active .tutor-panel-send,
.tutor-panel.checkmode-active .btn-gotToWorkspace{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.checkmode-active .btn-guide-mode::after,
.tutor-panel.checkmode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #5D6A66;
}

.tutor-panel.guidemode-active .btn-help-mode,
.tutor-panel.guidemode-active .tutor-panel-send,
.tutor-panel.guidemode-active .btn-gotToWorkspace{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.guidemode-active .btn-help-mode::after,
.tutor-panel.guidemode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #5D6A66;
}


/* Content area */
.tutor-panel-content{
  flex: 1;                 /* takes remaining space */
  padding: 12px;
  overflow-x: hidden;

  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
}

.tutor-panel-auth{
  position: absolute;
  inset: 0;
  transform: none;
  width: auto;
  padding: 60px 16px 16px;
  z-index: 2;
  border-radius: 7px;
  background: rgba(238, 241, 240, 0.85);
  backdrop-filter: blur(50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
}
.tutor-panel-auth .auth-error{
  display: none;
  width: 100%;
  margin: 0 0 8px 0;
  padding: 6px 8px;
  border-radius: 6px;
 /* background: rgba(244, 67, 54, 0.12); */
  color: rgba(195, 49, 38, 0.95);
  font-weight: 700;
  font-size: 13px;
}
.tutor-panel-auth .auth-password-hint{
  display: none;
  width: 100%;
  margin: 6px 0 0 0;
  color: rgba(195, 49, 38, 0.95);
  /* font-weight: 100; */
  font-size: 13px;
}
.tutor-panel-auth .auth-actions{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: nowrap;
  white-space: nowrap;
  margin-top: 6px;
  width: 100%;
  max-width: 320px;
}
.tutor-panel-auth .auth-name-row{
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 320px;
}
.tutor-panel-auth .auth-name-row input{
  flex: 1;
  min-width: 0;
}
.tutor-panel-auth .auth-password-wrap{
  position: relative;
  width: 100%;
  max-width: 320px;
}
.tutor-panel-auth .auth-password-wrap .auth-password{
  width: 100%;
  padding-right: 34px;
}
.tutor-panel-auth .auth-password-toggle{
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-40%);
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  color: #5D6A66;
  cursor: pointer;
}
.tutor-panel-auth .auth-password-toggle:hover{
  color: #2F3B38;
}
.tutor-panel-auth .auth-password-toggle svg{
  width: 18px;
  height: 18px;
  stroke: currentColor;
}
.tutor-panel-auth .auth-sep{
  font-weight: 700;
  color: #7C8A85;
  user-select: none;
}
.tutor-panel-auth h4{
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 700;
}
.tutor-panel-auth label{
  display: block;
  font-size: 13px;
  margin: 6px 0 2px;
}
.tutor-panel-auth input{
  width: 100%;
  max-width: 320px;
  padding: 6px 8px;
  border: 1px solid #A7B2AD;
  border-radius: 6px;
  margin-top: 6px;
  background: #F7F9F8;
}
.tutor-panel-auth button{
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.tutor-panel-auth .auth-actions button{
  margin-top: 0;
}

.tutor-panel-auth input:focus{
  outline: none;
  box-shadow: none;
  border-color: #7C8A85; /* keep same border */
}


.tutor-panel-auth .auth-back{
  margin-top: -6px; /* or 2px */
}

.tutor-panel-auth button{
  color: #5D6A66;
}

.tutor-panel-auth button:hover {
  color: #2F3B38; /* pick the text color you want on hover */
}

.tutor-panel-auth .auth-supabase{
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #C1C9C5;
}

.tutor-panel-message{
  margin: 0;
  padding: 10px 20px 10px 10px;
  /* background: rgba(255, 255, 255, 0.75); */
 /* border: 1px solid rgba(0,0,0,0.08); */
  border-radius: 4px;
  color: #2F3B38;
  font-size: 13px;
  line-height: 1.6;
}

.tutor-panel-message--assistant{
  background: transparent;
  border-radius: 7px;
  border: none;
  align-self: flex-start;
  margin-top: 14px;
}

.tutor-panel-message--guideAssistant{
  border: none;
  background: rgba(200,208,204,0.35); /* or transparent if you want none */
  border-radius: 3px;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  display: block;
}


/*
.tutor-panel-message--guideAssistant{
  border: none;
  background: rgba(15, 23, 42, 0.06);
  border-radius: 7px;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
} */

.guide-wrapper{
  align-self: stretch;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.guide-wrapper.guide-slab{
  background: #E3E9E6;
  border-radius: 7px;
  padding: 10px 12px;
  box-sizing: border-box;
}

.guide-list{
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.guide-item{
  margin: 0 0 8px 0;
  padding-left: 18px;
  position: relative;
}

.guide-wrapper.guide-slab .guide-item::before{
  content: "–";
  font-size: 11px;
  position: absolute;
  left: 0;
  top: 0;
  color: #5D6A66;
}

.guide-item:last-child{
  margin-bottom: 0;
}

.guide-wrapper.guide-slab .guide-item p{
  margin: 0 0 8px 0;
}

.guide-wrapper.guide-slab .guide-item:last-child p:last-child{
  margin-bottom: 10px;
}


/*
.guide-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
} */

/* Border + GAP live here */
.guide-wrapper.guide-start{
  border-top: 1px solid #C1C9C5;
  margin-top: 14px;
  padding-top: 14px;
}

/*
.guide-wrapper.guide-end{
  /* border-bottom: 1px solid rgba(0,0,0,0.08); */
  margin-bottom: 14px;
  padding-bottom: 14px;
} */

.tutor-panel-message--checkAssistant{
  border: none;
  /* background: rgba(15, 23, 42, 0.06); */
  /* background: rgba(0, 0, 0, 0.04); */
  background: transparent;
  border-radius: 7px;
  align-self: flex-start;
}

.check-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

.check-wrapper.check-start{
  border-top: 1px solid #C1C9C5;
  margin-top: 14px;
  padding-top: 14px;
}

/*
.check-wrapper.check-end{
  /* border-bottom: 1px solid rgba(0,0,0,0.08); */
  margin-bottom: 14px;
  padding-bottom: 14px;
} */

/* START separators */
.guide-wrapper.guide-start,
.check-wrapper.check-start{
  margin-top: 12px;
  padding-top: 12px;
}

/* END separators — tighter */
.guide-wrapper.guide-end,
.check-wrapper.check-end{
  margin-bottom: 6px;
  padding-bottom: 4px;
}


.tutor-panel-message--checkAssistant{
  /* background: rgba(0, 0, 0, 0.06); */ /* a bit warmer/neutral */
 /* background: rgba(0, 0, 0, 0.04); */
}


.tutor-panel-loading{
  font-size: 13px;
  color: #5D6A66;
  padding: 6px 12px;
  align-self: flex-start;
}


.tutor-panel-message--user{
  align-self: flex-end;
  padding: 10px 10px;
  max-width: 75%;
  border-radius: 9px;
  background: #D6DDD9;
}

.tutor-panel-message p{
  margin: 0 0 10px 0;
}
.tutor-panel-message h1,
.tutor-panel-message h2,
.tutor-panel-message h3{
  font-size: 1em;
  margin: 0 0 10px 0;
}
.tutor-panel-message p:last-child{
  margin-bottom: 0;
}
.tutor-panel-message ul,
.tutor-panel-message ol{
  margin: 0 0 8px 18px;
  padding: 0;
}
.tutor-panel-message li{
  margin: 2px 0;
}
.tutor-panel-message code{
  font-family: "SFMono-Regular", ui-monospace, "Cascadia Mono", "Menlo", monospace;
  background: rgba(200,208,204,0.5);
  padding: 1px 4px;
  font-size: 12px;
  border-radius: 4px;
}
.tutor-panel-message strong{
  font-weight: 800;
}
.tutor-panel-message pre{
  background: rgba(200,208,204,0.5);
  padding: 10px 12px;
  border-radius: 8px;
  overflow: auto;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.45;
}
.tutor-panel-message pre.table-block{
  white-space: pre;
}
.tutor-panel-message pre code{
  background: transparent;
  padding: 0;
}



/* Input bar pinned at bottom */
.tutor-panel-inputbar{
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 6px 18px;

  background: transparent;
  border-top: none;
}

/* Textarea */
.tutor-panel-prompt{
  flex: 1;
  min-height: 32px;
  height: 32px;
  max-height: 90px;
  resize: none;
  padding-top: 9px;
  padding-right: 10px;
  padding-bottom: 4px;
  padding-left: 10px;
  box-sizing: border-box;

  border-radius: 4px;
  outline: none;

  background: rgba(200,208,204,0.35);
  font-size: 13px;
  line-height: 1.2;
}

/* Send */
.tutor-panel-send{
  border: none;
  background: #000000;
  /* background: rgba(37, 35, 35, 0.9); */
  color: rgba(255, 255, 255, 0.95);

  border-radius: 4px;
  height: 32px;
  padding: 0 14px;

  font-weight: 800;
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease, background 120ms ease;
  white-space: nowrap;
}


/* Align all text sizes to Enter button */
.tutor-panel *{
  font-size: inherit;
}

`;

  document.head.appendChild(style);
  document.body.appendChild(state.widget);

  const mainButton = document.getElementById("main-button");
  if (!mainButton || !state.widget) return;

  // Click & drag logic
  let dragStartTime = 0;
  let startPosition = { x: 0, y: 0 };
  let hasMovedWhileDragging = false;
  let suppressClick = false;

  function constrainToBounds(x: number, y: number): { x: number; y: number } {
    const widgetWidth = state.widget!.offsetWidth;
    const widgetHeight = state.widget!.offsetHeight;

    return {
      x: Math.max(0, Math.min(x, window.innerWidth - widgetWidth)),
      y: Math.max(0, Math.min(y, window.innerHeight - widgetHeight)),
    };
  }

  function snapToNearestEdge(x: number, y: number): { x: number; y: number } {
    const widgetWidth = state.widget!.offsetWidth;
    const widgetHeight = state.widget!.offsetHeight;

    return {
      x: x < window.innerWidth / 2 ? 0 : window.innerWidth - widgetWidth,
      y: Math.max(0, Math.min(y, window.innerHeight - widgetHeight)),
    };
  }

  mainButton.addEventListener("mousedown", (e) => {
    dragStartTime = Date.now();
    startPosition = { x: e.clientX, y: e.clientY };
    hasMovedWhileDragging = false;
    suppressClick = false;

    const rect = state.widget!.getBoundingClientRect();
    state.dragOffset.x = e.clientX - rect.left;
    state.dragOffset.y = e.clientY - rect.top;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    if (mainButton) {
      mainButton.classList.add("dragging");
    }
  });

  // Click to open menu (primary interaction)
  mainButton.addEventListener("click", (e) => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (!state.isDragging && !hasMovedWhileDragging) {
      e.preventDefault();
      e.stopPropagation();
      if (state.isWindowOpen) {
        closeTutorPanel(); // highlight it instead; highlightTutorPanel
      } else {
        void openTutorPanel(); //
      }
    }
  });

  function handleMouseMove(e: MouseEvent) {
    const timeDiff = Date.now() - dragStartTime;
    const distance = Math.sqrt(
      Math.pow(e.clientX - startPosition.x, 2) +
        Math.pow(e.clientY - startPosition.y, 2),
    );

    // Start dragging if moved > 3px or held for > 100ms
    if (!state.isDragging && (distance > 3 || timeDiff > 100)) {
      state.isDragging = true;
      hasMovedWhileDragging = true;
      //closeMenu();
      document.body.style.cursor = "grabbing";
    }

    if (state.isDragging) {
      const newX = e.clientX - state.dragOffset.x;
      const newY = e.clientY - state.dragOffset.y;

      // Apply boundary constraints
      const constrainedPosition = constrainToBounds(newX, newY);

      // Use transform for smoother movement
      setWidgetXY(constrainedPosition.x, constrainedPosition.y);

      state.lastPosition = {
        x: constrainedPosition.x,
        y: constrainedPosition.y,
      };
    }
  }
  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    mainButton?.classList.remove("dragging");
    document.body.style.cursor = "";

    if (state.isDragging && state.widget) {
      suppressClick = true;

      const snapped = snapToNearestEdge(
        state.lastPosition.x,
        state.lastPosition.y,
      );

      // animate LEFT/TOP only
      state.widget.style.transition =
        "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      setWidgetXY(snapped.x, snapped.y);

      window.setTimeout(() => {
        if (state.widget) state.widget.style.transition = "";
      }, 300);

      saveWidgetPosition();
    }

    state.isDragging = false;
    hasMovedWhileDragging = false;
  }
}

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

function setWidgetXY(x: number, y: number) {
  if (!state.widget) return;

  // clamp
  const w = state.widget.offsetWidth || 50;
  const h = state.widget.offsetHeight || 50;
  const cx = Math.max(0, Math.min(x, window.innerWidth - w));
  const cy = Math.max(0, Math.min(y, window.innerHeight - h));

  // always use left/top
  state.widget.style.left = `${cx}px`;
  state.widget.style.top = `${cy}px`;

  // clear competing systems
  state.widget.style.right = "auto";
  state.widget.style.bottom = "auto";
  state.widget.style.transform = "";

  state.lastPosition = { x: cx, y: cy };
}

export function hideWidget() {
  if (state.widget) {
    state.widget.style.display = "none";
  }
}

export function showWidget() {
  if (state.widget) {
    state.widget.style.display = "block";
  }
}

export async function saveWidgetPosition() {}

export async function loadWidgetPosition() {}

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

export function positionWidgetFromPanel(panel: HTMLElement) {
  if (!state.widget) return;

  const panelRect = panel.getBoundingClientRect();
  const widgetRect = state.widget.getBoundingClientRect();
  const widgetWidth = widgetRect.width || 50;
  const widgetHeight = widgetRect.height || 50;

  const panelCenterX = panelRect.left + panelRect.width / 2;
  const anchorLeft = panelCenterX <= window.innerWidth / 2;

  const x = anchorLeft ? 10 : window.innerWidth - widgetWidth - 10;
  const y = Math.max(
    10,
    Math.min(
      window.innerHeight / 2 - widgetHeight / 2,
      window.innerHeight - widgetHeight - 10,
    ),
  );

  setWidgetXY(x, y);
  saveWidgetPosition();
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

export function setPanelControlsDisabled(
  panel: HTMLElement,
  disabled: boolean,
) {
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
