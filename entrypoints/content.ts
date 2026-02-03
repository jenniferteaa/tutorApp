export default defineContentScript({
  matches: ["https://leetcode.com/problems/*"],
  main() {
    console.log(
      "🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading...",
    );

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        initializeWidget();
      });
    } else {
      initializeWidget();
    }
  },
});
// <all_urls>
let widget: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let isDragging = false;
let isWindowOpen = false;
let dragOffset = { x: 0, y: 0 };
let lastPosition = { x: 0, y: 0 };
let menuCloseTimeout: number | null = null;
let globalMouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let flushInFlight: boolean;
let panelHideTimerId: number | null = null;
let suspendPanelOps = false;
type Pair = [string, string];
let queue: Pair[] = [];
let currentBatch: Pair;
let editedLineQueue: string[] = [];
let lastGuideCursorLine: number | null = null;

function initializeWidget() {
  console.log("The widget is being loaded to the page");
  createFloatingWidget();
  loadWidgetPosition();
  setupMessageListener();
  setupActivityTracking();
  startProblemUrlWatcher();
  startSessionCleanupSweep();
  void hydrateStoredSessionCache().then(() => {
    if (pendingStoredSession?.panelOpen) {
      void openTutorPanel();
    }
  });
  window.addEventListener("beforeunload", () => {
    void saveSessionState(currentTutorSession?.element ?? null);
  });
}

function createFloatingWidget() {
  // remove existing widget
  const existingWidget = document.getElementById("tutor-widget");
  if (existingWidget) {
    existingWidget.remove();
  }

  // create main widget container
  widget = document.createElement("div");
  widget.id = "tutor-widget";

  widget.innerHTML = `
  <div class="widget-main-button" id="main-button">
  </div>
  `;

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
  #tutor-widget{
  position: fixed;
  bottom: 50vh;
  right: 50px;
  z-index: 999999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  user-select: none;
  pointer-events: auto;
  }
  
  .widget-main-button {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgb(200, 208, 204);
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
        0 8px 30px rgb(120, 126, 123),
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

  background: #F9FAFB;
  border-radius: 7px;
  border: none;
  box-shadow:
    0 14px 30px rgba(0,0,0,0.18),
    0 2px 6px rgba(0,0,0,0.10);

  z-index: 999997;
  font-family: Calibri, sans-serif;
  font-size: 13px;

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
  background: rgba(0,0,0,0.1);
  border-bottom: 1px solid rgba(0,0,0,0.1);
  transition: background-color 160ms ease, box-shadow 160ms ease;
  cursor: grab;
  justify-content: flex-end;
}
.tutor-panel-shellbar:hover{
  background: rgba(0, 0, 0, 0.15);
}

.tutor-panel-shellbar:active{
  background: rgba(0, 0, 0, 0.15);
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
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(0,0,0,0.75);
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}

.tutor-panel-loading-spinner{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: rgba(0,0,0,0.6);
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
  background: rgba(0,0,0,0.45);
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
    0 18px 50px rgba(0,0,0,0.25),
    0 2px 10px rgba(0,0,0,0.12);
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
  color: rgba(0,0,0,0.65);
  font-size: 13px;
  line-height: 1;

  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 120ms ease, background 120ms ease;
}
.tutor-panel-close:hover{
  transform: scale(1.06);
  background: rgba(205, 201, 203, 0.3);
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
.btn-timer,
.btn-gotToWorkspace{
  border: none;
  background: rgba(0,0,0,0.1);
  color: rgba(0,0,0,0.9);

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
.btn-timer:not(:disabled):hover,
.btn-gotToWorkspace:not(:disabled):hover{
  background: rgba(0, 0, 0, 0.15);
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-timer:active,
.btn-gotToWorkspace:active{
  background: rgba(0,0,0,0.15);
}


@keyframes hoverPulse {
  0%   { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
  50%  { transform: translateY(-2px); filter: brightness(1.02) saturate(1.15); }
  100% { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
}

.btn-guide-mode.is-loading{
  background: rgba(0,0,0,0.15);
  animation: hoverPulse 1.2s ease-in-out infinite;
}


.btn-help-mode.is-loading{
  background: rgba(0,0,0,0.15);
  animation: hoverPulse 1.2s ease-in-out infinite;
  }

.tutor-panel.checkmode-active .btn-guide-mode,
.tutor-panel.checkmode-active .btn-timer,
.tutor-panel.checkmode-active .tutor-panel-send,
.tutor-panel.checkmode-active .btn-gotToWorkspace{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.checkmode-active .btn-guide-mode::after,
.tutor-panel.checkmode-active .btn-timer::after,
.tutor-panel.checkmode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(0,0,0,0.7);
}

.tutor-panel.guidemode-active .btn-help-mode,
.tutor-panel.guidemode-active .btn-timer,
.tutor-panel.guidemode-active .tutor-panel-send,
.tutor-panel.guidemode-active .btn-gotToWorkspace{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.guidemode-active .btn-help-mode::after,
.tutor-panel.guidemode-active .btn-timer::after,
.tutor-panel.guidemode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(0,0,0,0.7);
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
  background: rgba(255, 255, 255, 0.5);
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
  color: rgba(0,0,0,0.55);
  cursor: pointer;
}
.tutor-panel-auth .auth-password-toggle:hover{
  color: rgba(0,0,0,0.85);
}
.tutor-panel-auth .auth-password-toggle svg{
  width: 18px;
  height: 18px;
  stroke: currentColor;
}
.tutor-panel-auth .auth-sep{
  font-weight: 700;
  color: rgba(0,0,0,0.45);
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
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 6px;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.9);
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
  border-color: rgba(0,0,0,0.5); /* keep same border */
}


.tutor-panel-auth .auth-back{
  margin-top: -6px; /* or 2px */
}

.tutor-panel-auth button{
  color: rgba(0,0,0,0.5)
}

.tutor-panel-auth button:hover {
  color: #000000; /* pick the text color you want on hover */
}

.tutor-panel-auth .auth-supabase{
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.tutor-panel-message{
  margin: 0;
  padding: 10px 20px 10px 10px;
  /* background: rgba(255, 255, 255, 0.75); */
 /* border: 1px solid rgba(0,0,0,0.08); */
  border-radius: 4px;
  color: rgba(0,0,0,0.86);
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
  background: rgba(0,0,0,0.03); /* or transparent if you want none */
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
  background: rgba(15, 23, 42, 0.06);
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

.guide-item::before{
  content: "–";
  font-size: 11px;
  position: absolute;
  left: 0;
  top: 0;
  color: rgba(0,0,0,0.6);
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
  border-top: 1px solid rgba(0,0,0,0.08);
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
  border-top: 1px solid rgba(0,0,0,0.08);
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
  color: rgba(0,0,0,0.6);
  padding: 6px 12px;
  align-self: flex-start;
}


.tutor-panel-message--user{
  align-self: flex-end;
  padding: 10px 10px;
  max-width: 75%;
  border-radius: 9px;
  background: rgba(0,0,0,0.1);
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
  background: rgba(0,0,0,0.06);
  padding: 1px 4px;
  font-size: 12px;
  border-radius: 4px;
}
.tutor-panel-message strong{
  font-weight: 800;
}
.tutor-panel-message pre{
  background: rgba(15, 23, 42, 0.06);
  padding: 10px 12px;
  border-radius: 8px;
  overflow: auto;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.45;
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

  background: rgba(0, 0, 0, 0.04);
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
  document.body.appendChild(widget);

  setupWidgetEvents();
}

function prettifyLlMResponse(text: string) {
  // Convert "To fix: a; b; c." into bullets
  const m = text.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);
  if (!m) return text;

  const before = m[1].trim();
  const fixesRaw = m[2].trim();

  // split on semicolons
  const fixes = fixesRaw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  if (fixes.length === 0) return text;

  const bulletBlock = fixes.map((f) => `- ${f.replace(/\.$/, "")}`).join("\n");

  return `${before}\n\n**To fix**\n${bulletBlock}`;
}

function setupWidgetEvents() {
  const mainButton = document.getElementById("main-button");
  //const menu = document.getElementById("widget-menu");

  if (!mainButton) return;

  let dragStartTime = 0;
  let startPosition = { x: 0, y: 0 };
  let hasMovedWhileDragging = false;
  let suppressClick = false;

  // Boundary constraint function
  function constrainToBounds(x: number, y: number): { x: number; y: number } {
    if (!widget) return { x, y };

    const widgetRect = { width: 50, height: 50 }; // Widget dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 10; // Minimum margin from edges

    // Constrain horizontal position
    let constrainedX = Math.max(margin, x);
    constrainedX = Math.min(
      windowWidth - widgetRect.width - margin,
      constrainedX,
    );

    // Constrain vertical position
    let constrainedY = Math.max(margin, y);
    constrainedY = Math.min(
      windowHeight - widgetRect.height - margin,
      constrainedY,
    );

    return { x: constrainedX, y: constrainedY };
  }

  // Snap to nearest edge function
  function snapToNearestEdge(x: number, y: number): { x: number; y: number } {
    if (!widget) return { x, y };

    const widgetRect = { width: 50, height: 50 };
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const snapMargin = 20; // Distance from edge to snap to

    // Calculate distances to each edge
    const distanceToLeft = x;
    const distanceToRight = windowWidth - (x + widgetRect.width);
    const distanceToTop = y;
    const distanceToBottom = windowHeight - (y + widgetRect.height);

    // Find the nearest edge
    const minDistance = Math.min(
      distanceToLeft,
      distanceToRight,
      distanceToTop,
      distanceToBottom,
    );

    let snappedX = x;
    let snappedY = y;

    // Snap to the nearest edge if widget is partially hidden
    if (
      x < 0 ||
      x + widgetRect.width > windowWidth ||
      y < 0 ||
      y + widgetRect.height > windowHeight
    ) {
      if (minDistance === distanceToLeft) {
        snappedX = snapMargin;
      } else if (minDistance === distanceToRight) {
        snappedX = windowWidth - widgetRect.width - snapMargin;
      } else if (minDistance === distanceToTop) {
        snappedY = snapMargin;
      } else if (minDistance === distanceToBottom) {
        snappedY = windowHeight - widgetRect.height - snapMargin;
      }
    }

    return { x: snappedX, y: snappedY };
  }

  // Mouse events for main button
  mainButton.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragStartTime = Date.now();
    startPosition = { x: e.clientX, y: e.clientY };
    hasMovedWhileDragging = false;

    const rect = widget!.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    mainButton.classList.add("dragging");

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  // Click to open menu (primary interaction)
  mainButton.addEventListener("click", (e) => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (!isDragging && !hasMovedWhileDragging) {
      e.preventDefault();
      e.stopPropagation();
      if (isWindowOpen) {
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
    if (!isDragging && (distance > 3 || timeDiff > 100)) {
      isDragging = true;
      hasMovedWhileDragging = true;
      //closeMenu();
      document.body.style.cursor = "grabbing";
    }

    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Apply boundary constraints
      const constrainedPosition = constrainToBounds(newX, newY);

      // Use transform for smoother movement
      widget!.style.transform = `translate(${constrainedPosition.x}px, ${constrainedPosition.y}px)`;
      widget!.style.left = "0";
      widget!.style.top = "0";

      lastPosition = { x: constrainedPosition.x, y: constrainedPosition.y };
    }
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (mainButton) {
      mainButton.classList.remove("dragging");
    }
    document.body.style.cursor = "";

    if (isDragging) {
      suppressClick = true;
      // Apply edge snapping if widget is partially outside bounds
      const snappedPosition = snapToNearestEdge(lastPosition.x, lastPosition.y);

      // Animate to snapped position if different from current position
      if (
        snappedPosition.x !== lastPosition.x ||
        snappedPosition.y !== lastPosition.y
      ) {
        widget!.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        widget!.style.left = snappedPosition.x + "px";
        widget!.style.top = snappedPosition.y + "px";
        widget!.style.transform = "";

        // Remove transition after animation
        setTimeout(() => {
          if (widget) {
            widget.style.transition = "";
          }
        }, 15000);

        lastPosition = snappedPosition;
      } else {
        // Apply final position normally
        widget!.style.left = lastPosition.x + "px";
        widget!.style.top = lastPosition.y + "px";
        widget!.style.transform = "";
      }

      saveWidgetPosition();
    }

    isDragging = false;

    // Reset drag tracking
    hasMovedWhileDragging = false;
  }
}

function getCanonicalProblemUrl(href: string): string {
  try {
    const { origin, pathname } = new URL(href);
    const match = pathname.match(/^\/problems\/[^/]+/);
    if (match) return `${origin}${match[0]}`;
    return `${origin}${pathname}`;
  } catch {
    return href;
  }
}

function getProblemTitleFromPage(): string {
  return (
    document.querySelector("div.text-title-large a")?.textContent?.trim() ?? ""
  );
}

function getProblemNumberFromTitle(title: string): number | null {
  const match = title.match(/^\s*(\d+)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (/\s/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

const CANONICAL_TOPICS = [
  "Array",
  "String",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Matrix",
  "Bit Manipulation",
  "Tree",
  "Breadth-First Search",
  "Two Pointers",
  "Prefix Sum",
  "Heap (Priority Queue)",
  "Simulation",
  "Counting",
  "Graph Theory",
  "Binary Tree",
  "Stack",
  "Sliding Window",
  "Enumeration",
  "Design",
  "Backtracking",
  "Union-Find",
  "Number Theory",
  "Linked List",
  "Ordered Set",
  "Segment Tree",
  "Monotonic Stack",
  "Trie",
  "Divide and Conquer",
  "Combinatorics",
  "Bitmask",
  "Recursion",
  "Queue",
  "Geometry",
  "Binary Indexed Tree",
  "Memoization",
  "Hash Function",
  "Binary Search Tree",
  "Shortest Path",
  "String Matching",
  "Topological Sort",
  "Rolling Hash",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Doubly-Linked List",
  "Merge Sort",
  "Randomized",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Quickselect",
  "Suffix Array",
  "Sweep Line",
  "Probability and Statistics",
  "Minimum Spanning Tree",
  "Bucket Sort",
  "Shell",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component",
];

function normalizeTopicKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_/]+/g, " ")
    .replace(/-/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CANONICAL_TOPIC_MAP = new Map(
  CANONICAL_TOPICS.map((topic) => [normalizeTopicKey(topic), topic]),
);

function titleCaseTopic(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveTopicLabel(raw: string): string {
  const key = normalizeTopicKey(raw);
  if (!key) return raw.trim();
  const direct = CANONICAL_TOPIC_MAP.get(key);
  if (direct) return direct;

  const parts = key.split(" ");
  if (parts.length > 0) {
    const last = parts[parts.length - 1];
    if (last.endsWith("s")) {
      parts[parts.length - 1] = last.slice(0, -1);
      const singularKey = parts.join(" ");
      const match = CANONICAL_TOPIC_MAP.get(singularKey);
      if (match) return match;
    } else {
      parts[parts.length - 1] = `${last}s`;
      const pluralKey = parts.join(" ");
      const match = CANONICAL_TOPIC_MAP.get(pluralKey);
      if (match) return match;
    }
  }

  return titleCaseTopic(key);
}

function ensureTopicBucket(session: TutorSession, topic: string): string {
  const normalized = resolveTopicLabel(topic);
  const existingKey = Object.keys(session.topics).find(
    (key) => resolveTopicLabel(key) === normalized,
  );
  if (existingKey && existingKey !== normalized) {
    session.topics[normalized] = session.topics[existingKey];
    delete session.topics[existingKey];
  }
  session.topics[normalized] ??= {
    thoughts_to_remember: [],
    pitfalls: [],
  };
  return normalized;
}

function getSessionStorageKey(userId: string, problemName: string): string {
  return `${SESSION_STORAGE_KEY}:${encodeURIComponent(
    userId,
  )}:${encodeURIComponent(problemName)}`;
}

function getRollingTopicsFromPage(): Record<
  string,
  { thoughts_to_remember: string[]; pitfalls: string[] }
> {
  const topicElements = document.querySelectorAll('a[href^="/tag/"]');
  const topicsList = Array.from(topicElements)
    .map((el) => el.getAttribute("href"))
    .filter((href): href is string => !!href)
    .map((href) => href.replace("/tag/", "").replace("/", ""))
    .map((slug) => resolveTopicLabel(slug));

  return Object.fromEntries(
    Array.from(new Set(topicsList)).map((t) => [
      t,
      { thoughts_to_remember: [], pitfalls: [] },
    ]),
  );
}

function getEditorLanguageFromPage(): string {
  const editor = document.querySelector("#editor");
  if (!editor) return "";

  const button = editor.querySelector('button[aria-haspopup="dialog"]');
  if (!button) return "";

  const textNode = Array.from(button.childNodes).find(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
  );
  return textNode?.textContent?.trim() ?? button.textContent?.trim() ?? "";
}

const LANGUAGE_BUTTON_SELECTOR = '#editor button[aria-haspopup="dialog"]';
let languageObserver: MutationObserver | null = null;
let languageObserverTarget: HTMLElement | null = null;

function syncSessionLanguageFromPage() {
  if (!currentTutorSession) return;
  const language = getEditorLanguageFromPage();
  if (!language) return;
  if (currentTutorSession.language === language) return;
  currentTutorSession.language = language;
  scheduleSessionPersist(currentTutorSession.element ?? null);
}

function ensureLanguageObserver() {
  const button = document.querySelector<HTMLElement>(LANGUAGE_BUTTON_SELECTOR);
  if (!button) return;

  if (!button.dataset.tutorLangListener) {
    button.dataset.tutorLangListener = "true";
    button.addEventListener(
      "click",
      () => {
        window.setTimeout(syncSessionLanguageFromPage, 50);
      },
      { passive: true },
    );
  }

  if (languageObserverTarget === button && languageObserver) {
    syncSessionLanguageFromPage();
    return;
  }

  languageObserver?.disconnect();
  languageObserverTarget = button;
  languageObserver = new MutationObserver(() => {
    syncSessionLanguageFromPage();
  });
  languageObserver.observe(button, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  syncSessionLanguageFromPage();
}

function buildFreshSession(
  panel: HTMLElement,
  userId: string,
  problemName?: string,
): TutorSession {
  const title = problemName ?? getProblemTitleFromPage();
  const sessionId = crypto.randomUUID();
  return {
    element: panel,
    sessionId,
    userId,
    problem: title,
    problemUrl: getCanonicalProblemUrl(window.location.href),
    language: getEditorLanguageFromPage(),
    topics: getRollingTopicsFromPage(),
    content: [],
    prompt: "",
    position: null,
    size: null,
    guideModeEnabled: false,
    checkModeEnabled: false,
    timerEnabled: false,
    rollingStateGuideMode: {
      problem: title,
      nudges: [],
      lastEdit: "",
    },
    sessionRollingHistory: {
      qaHistory: [],
      summary: "",
      toSummarize: [],
    },
  };
}

async function openTutorPanel() {
  const auth = await loadAuthFromStorage();
  const authExpired = isAuthExpired(auth);
  const authUserId = auth?.userId ?? "";
  if (authExpired) {
    await clearAuthFromStorage();
  }

  if (
    currentTutorSession &&
    currentTutorSession.element &&
    document.body.contains(currentTutorSession.element)
  ) {
    ensureLanguageObserver();
    syncSessionLanguageFromPage();
    showTutorPanel(currentTutorSession.element);
    hideWidget();
    isWindowOpen = true;
    highlightExistingPanel(currentTutorSession.element);
    if (!authUserId || authExpired) {
      lockPanel(currentTutorSession.element);
      ensureAuthPrompt(
        currentTutorSession.element,
        authExpired ? "session expired, please log back in" : undefined,
      );
    }
    markUserActivity();
    scheduleSessionPersist(currentTutorSession.element);
    return;
  }

  if (currentTutorSession?.userId) {
    showPanelLoading();
    try {
      await saveSessionState(currentTutorSession.element ?? null, {
        force: true,
      });
    } finally {
      hidePanelLoading();
    }
  }

  if (!pendingStoredSession) {
    if (authUserId) {
      const stored = await loadSessionState(
        authUserId,
        getProblemTitleFromPage(),
      );
      if (stored && isStoredSessionForUser(stored, authUserId)) {
        pendingStoredSession = stored;
      }
    }
  }

  if (pendingStoredSession) {
    const tutorPanel = createTutorPanel();
    applyStoredSessionToPanel(tutorPanel, pendingStoredSession);
    pendingStoredSession = null;
    ensureLanguageObserver();
    syncSessionLanguageFromPage();
    showTutorPanel(tutorPanel);
    hideWidget();
    isWindowOpen = true;
    markUserActivity();
    if (!authUserId || authExpired) {
      lockPanel(tutorPanel); // #lockpanel
      ensureAuthPrompt(
        tutorPanel,
        authExpired ? "session expired, please log back in" : undefined,
      );
    }
    scheduleSessionPersist(tutorPanel);
    return;
  }

  const tutorPanel = createTutorPanel();
  if (!tutorPanel) {
    console.log("There was an error creating a panel");
    return;
  }
  currentTutorSession = buildFreshSession(tutorPanel, authUserId);
  ensureLanguageObserver();
  showTutorPanel(tutorPanel);
  hideWidget();
  isWindowOpen = true;
  markUserActivity();
  scheduleSessionPersist(tutorPanel);
  if (!currentTutorSession) return;
  if (!authUserId || authExpired) {
    lockPanel(tutorPanel);
    ensureAuthPrompt(
      tutorPanel,
      authExpired ? "session expired, please log back in" : undefined,
    );
  } else {
    currentTutorSession.userId = authUserId;
  }
  // lockPanel
  // Auto-focus the textarea when created via shortcut
  setTimeout(() => {
    const textarea = tutorPanel.querySelector(
      ".tutor-panel-prompt",
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length); // Place cursor at end
    }
  }, 100);
}

type SessionRollingHistoryLLM = {
  qaHistory: string[];
  summary: string;
  toSummarize: string[];
};

let summarizeInFlight = false;

async function requestHistorySummary(history: SessionRollingHistoryLLM) {
  if (summarizeInFlight || history.toSummarize.length === 0) return;
  //console.log("This is the toSummarize before clearing: ", history.toSummarize);
  const summarizeBatch = history.toSummarize.splice(0);
  summarizeInFlight = true;
  try {
    const response = await browser.runtime.sendMessage({
      action: "summarize-history",
      payload: {
        sessionId: currentTutorSession?.sessionId ?? "",
        summarize: summarizeBatch,
        summary: history.summary,
      },
    });
    if (
      handleBackendError(currentTutorSession?.element ?? null, response, {
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
    summarizeInFlight = false;
  }
}

function maybeQueueSummary(history: SessionRollingHistoryLLM) {
  if (history.qaHistory.length <= 40) return;
  const moved = history.qaHistory.splice(0, 20);
  history.toSummarize.push(...moved);
  void requestHistorySummary(history);
}

type RollingStateGuideMode = {
  problem: string;
  nudges: string[];
  lastEdit: string;
};

type TutorSession = {
  element: HTMLElement;
  sessionId: string;
  userId: string;
  content: string[];
  problem: string;
  problemUrl: string;
  language: string;
  topics: Record<
    string,
    { thoughts_to_remember: string[]; pitfalls: string[] }
  >;
  prompt: string;
  position: PanelPosition | null;
  size: PanelSize | null;
  guideModeEnabled: boolean;
  checkModeEnabled: boolean;
  timerEnabled: boolean;
  rollingStateGuideMode: RollingStateGuideMode;
  sessionRollingHistory: SessionRollingHistoryLLM;
};

let currentTutorSession: TutorSession | null = null;

type StoredAuth = {
  userId: string;
  jwt: string;
  accessToken?: string;
  issuedAt?: number;
  expiresAt?: number;
};
const AUTH_STORAGE_KEY = "vibetutor-auth";
const SESSION_STORAGE_KEY = "vibetutor-session";
const WORKSPACE_URL = "http://localhost:3000/auth/bridge";

// const WORKSPACE_URL = ""; // TODO: paste workspace auth-bridge URL here
//const INACTIVITY_MS = 1 * 60 * 1000; // 57,600,000
const INACTIVITY_MS = 16 * 60 * 60 * 1000; // 57,600,000
const ACTIVITY_PERSIST_INTERVAL_MS = 15000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_CLEANUP_INTERVAL_MS = 30 * 60 * 1000;
const SESSION_KEY_PREFIX = `${SESSION_STORAGE_KEY}:`;

type StoredTutorSession = {
  state: Omit<TutorSession, "element">;
  panelOpen: boolean;
  contentHtml: string;
  lastActivityAt: number;
};

let pendingStoredSession: StoredTutorSession | null = null;
let lastActivityAt = Date.now();
let lastActivityStoredAt = 0;
let sessionRestorePending = false;
let persistTimerId: number | null = null;
let inactivityTimerId: number | null = null;
let problemUrlWatcherId: number | null = null;
let lastCanonicalProblemUrl = getCanonicalProblemUrl(window.location.href);
let cleanupTimerId: number | null = null;

async function loadAuthFromStorage() {
  const stored = await browser.storage.local.get(AUTH_STORAGE_KEY);
  return (stored[AUTH_STORAGE_KEY] as StoredAuth | undefined) ?? null;
}

function isAuthExpired(auth: StoredAuth | null) {
  if (!auth?.expiresAt) return false;
  return Date.now() > auth.expiresAt;
}

async function clearAuthFromStorage() {
  await browser.storage.local.remove(AUTH_STORAGE_KEY);
  await browser.runtime.sendMessage({ action: "clear-auth" });
}

async function saveSessionState(
  panel?: HTMLElement | null,
  options?: { force?: boolean },
) {
  if (!currentTutorSession) return;
  if (!currentTutorSession.userId) return;
  if (sessionRestorePending && !options?.force) return;
  const contentArea =
    panel?.querySelector<HTMLElement>(".tutor-panel-content") ??
    currentTutorSession.element?.querySelector<HTMLElement>(
      ".tutor-panel-content",
    );
  const storageKey = getSessionStorageKey(
    currentTutorSession.userId,
    currentTutorSession.problem,
  );
  const stored: StoredTutorSession = {
    state: {
      sessionId: currentTutorSession.sessionId,
      userId: currentTutorSession.userId,
      content: currentTutorSession.content,
      language: currentTutorSession.language,
      problem: currentTutorSession.problem,
      problemUrl: currentTutorSession.problemUrl,
      topics: currentTutorSession.topics,
      prompt: currentTutorSession.prompt,
      position: currentTutorSession.position,
      size: currentTutorSession.size,
      guideModeEnabled: currentTutorSession.guideModeEnabled,
      checkModeEnabled: currentTutorSession.checkModeEnabled,
      timerEnabled: currentTutorSession.timerEnabled,
      rollingStateGuideMode: currentTutorSession.rollingStateGuideMode,
      sessionRollingHistory: currentTutorSession.sessionRollingHistory,
    },
    panelOpen: isWindowOpen,
    contentHtml: contentArea?.innerHTML ?? "",
    lastActivityAt,
  };
  await browser.storage.local.set({ [storageKey]: stored });
}

function scheduleSessionPersist(panel?: HTMLElement | null) {
  if (sessionRestorePending) return;
  if (persistTimerId) return;
  persistTimerId = window.setTimeout(() => {
    persistTimerId = null;
    void saveSessionState(panel);
  }, 500);
}

async function loadSessionState(userId: string, problemName: string) {
  const storageKey = getSessionStorageKey(userId, problemName);
  const stored = await browser.storage.local.get(storageKey);
  const session =
    (stored[storageKey] as StoredTutorSession | undefined) ?? null;
  if (!session) return null;
  const ageMs = Date.now() - (session.lastActivityAt ?? 0);
  if (ageMs > SESSION_TTL_MS) {
    await browser.storage.local.remove(storageKey);
    return null;
  }
  return session;
}

async function clearSessionState(userId: string, problemName: string) {
  const storageKey = getSessionStorageKey(userId, problemName);
  await browser.storage.local.remove(storageKey);
}

async function cleanupExpiredSessions() {
  const stored = await browser.storage.local.get(null);
  const now = Date.now();
  const toRemove: string[] = [];
  for (const [key, value] of Object.entries(stored)) {
    if (!key.startsWith(SESSION_KEY_PREFIX)) continue;
    const session = value as StoredTutorSession | undefined;
    const lastActivity = session?.lastActivityAt ?? 0;
    if (now - lastActivity > SESSION_TTL_MS) {
      toRemove.push(key);
    }
  }
  if (toRemove.length > 0) {
    await browser.storage.local.remove(toRemove);
  }
}

function startSessionCleanupSweep() {
  void cleanupExpiredSessions();
  if (cleanupTimerId) {
    window.clearInterval(cleanupTimerId);
  }
  cleanupTimerId = window.setInterval(() => {
    void cleanupExpiredSessions();
  }, SESSION_CLEANUP_INTERVAL_MS);
}

function isStoredSessionForUser(
  stored: StoredTutorSession,
  userId: string,
): boolean {
  if (!stored.state.userId) {
    console.log("There was no stored user in the browser.");
    return false;
  }
  if (stored.state.userId !== userId) {
    console.log(
      "The stored user earlier is different from the one logging in now.",
    );
    return false;
  }
  const canonicalUrl = getCanonicalProblemUrl(window.location.href); // this is not needed.
  return stored.state.problemUrl === canonicalUrl;
}

function applyStoredSessionToPanel(
  panel: HTMLElement,
  stored: StoredTutorSession,
) {
  currentTutorSession = { ...stored.state, element: panel };
  if (currentTutorSession && !currentTutorSession.language) {
    currentTutorSession.language = getEditorLanguageFromPage();
  }
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (contentArea) {
    contentArea.innerHTML = stored.contentHtml || "";
  }
  const prompt = panel.querySelector<HTMLTextAreaElement>(
    ".tutor-panel-prompt",
  );
  if (prompt) {
    prompt.value = currentTutorSession.prompt ?? "";
  }
  if (currentTutorSession.position) {
    panel.style.left = `${currentTutorSession.position.x}px`;
    panel.style.top = `${currentTutorSession.position.y}px`;
  }
  if (currentTutorSession.size) {
    panel.style.width = `${currentTutorSession.size.width}px`;
    panel.style.height = `${currentTutorSession.size.height}px`;
  }
  const guideSlab = panel.querySelector<HTMLElement>(
    ".guide-wrapper.guide-slab",
  );
  if (guideSlab) {
    const items = guideSlab.querySelectorAll(".guide-item");
    guideMessageCount = items.length;
    lastGuideMessageEl = guideSlab;
  } else {
    const guideWrappers = panel.querySelectorAll(".guide-wrapper");
    guideMessageCount = guideWrappers.length;
    lastGuideMessageEl =
      guideWrappers.length > 0
        ? (guideWrappers[guideWrappers.length - 1] as HTMLElement)
        : null;
  }
}

function resetPanelForUser(
  panel: HTMLElement,
  userId: string,
  problemName: string,
) {
  resetGuideState();
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (contentArea) {
    contentArea.innerHTML = "";
  }
  const prompt = panel.querySelector<HTMLTextAreaElement>(
    ".tutor-panel-prompt",
  );
  if (prompt) {
    prompt.value = "";
  }
  currentTutorSession = buildFreshSession(panel, userId, problemName);
}

async function hydrateStoredSessionCache() {
  const auth = await loadAuthFromStorage();
  if (!auth?.userId) {
    pendingStoredSession = null;
    return;
  }
  const stored = await loadSessionState(auth.userId, getProblemTitleFromPage());
  if (!stored) {
    pendingStoredSession = null;
    return;
  }
  if (!isStoredSessionForUser(stored, auth.userId)) {
    await clearSessionState(auth.userId, stored.state.problem);
    pendingStoredSession = null;
    return;
  }
  pendingStoredSession = stored;
  lastActivityAt = stored.lastActivityAt ?? Date.now();
}

function markUserActivity() {
  lastActivityAt = Date.now();
  if (Date.now() - lastActivityStoredAt > ACTIVITY_PERSIST_INTERVAL_MS) {
    lastActivityStoredAt = Date.now();
    scheduleSessionPersist();
  }
}

async function logoutForInactivity() {
  if (currentTutorSession?.element) {
    await saveSessionState(currentTutorSession.element, { force: true });
    sessionRestorePending = true;
  }
  await clearAuthFromStorage();
  if (currentTutorSession) {
    currentTutorSession.guideModeEnabled = false;
    currentTutorSession.checkModeEnabled = false;
  }
  if (currentTutorSession?.element) {
    const panel = currentTutorSession.element;
    detachGuideListeners();
    panel.classList.remove("guidemode-active", "checkmode-active");
    lockPanel(panel);
    ensureAuthPrompt(panel, "session expired, please log back in");
  }
}

function setupActivityTracking() {
  const handler = () => markUserActivity();
  const events = ["mousemove", "keydown", "click", "scroll", "input"];
  for (const event of events) {
    document.addEventListener(event, handler, { passive: true });
  }
  if (inactivityTimerId) {
    window.clearInterval(inactivityTimerId);
  }
  inactivityTimerId = window.setInterval(async () => {
    if (Date.now() - lastActivityAt < INACTIVITY_MS) return;
    const auth = await loadAuthFromStorage();
    if (!auth?.userId) return;
    await logoutForInactivity();
  }, 60_000);
}

function resetGuideState() {
  // maybe we dont need to reset
  guideMinIdx = Number.POSITIVE_INFINITY;
  guideMaxIdx = -1;
  guideBatchTimerId = null;
  guideBatchStarted = false;
  guideTouchedLines = new Set<number>();
  maxLines = 0;
  guideAttachAttempts = 0;
  guideDrainInFlight = false;
  lastGuideSelectionLine = null;
  lastGuideFlushLine = null;
  lastGuideFlushAt = 0;
  guideMessageCount = 0;
  lastGuideMessageEl = null;
}

function stopPanelOperations(panel: HTMLElement) {
  queue = [];
  flushInFlight = false;
  resetGuideState();
  detachGuideListeners();
  panel.querySelectorAll(".tutor-panel-assistant-loading").forEach((el) => {
    el.remove();
  });
  if (currentTutorSession) {
    currentTutorSession.guideModeEnabled = false;
    currentTutorSession.checkModeEnabled = false;
    currentTutorSession.timerEnabled = false;
  }
  panel.classList.remove("guidemode-active", "checkmode-active");
  panel.querySelector(".btn-guide-mode")?.classList.remove("is-loading");
  panel.querySelector(".btn-help-mode")?.classList.remove("is-loading");
}

function lockPanel(panel: HTMLElement) {
  panel.classList.add("tutor-panel-locked");
  setPanelControlsDisabled(panel, true);
}

function unlockPanel(panel: HTMLElement) {
  panel.classList.remove("tutor-panel-locked");
  setPanelControlsDisabled(panel, false);
}

type BackendErrorResponse = {
  success: false;
  error?: string;
  status?: number;
  timeout?: boolean;
  unauthorized?: boolean;
};

const SESSION_EXPIRED_MESSAGE = "session expired, please log back in";

function isBackendErrorResponse(value: unknown): value is BackendErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { success?: unknown }).success === false
  );
}

function removeSessionExpiredMessage(panel: HTMLElement) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return;
  const messages = contentArea.querySelectorAll<HTMLElement>(
    ".tutor-panel-message--assistant",
  );
  messages.forEach((message) => {
    if (message.textContent?.trim() === SESSION_EXPIRED_MESSAGE) {
      message.remove();
    }
  });
}

function appendSystemMessage(panel: HTMLElement, message: string) {
  const contentArea = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (!contentArea) return;
  const messageEl = appendPanelMessage(panel, message, "assistant");
  if (!messageEl) return;
  contentArea.scrollTop = messageEl.offsetTop;
  scheduleSessionPersist(panel);
}

function handleBackendError(
  panel: HTMLElement | null,
  response: unknown,
  options?: {
    timeoutMessage?: string;
    serverMessage?: string;
    lockOnServerError?: boolean;
    silent?: boolean;
  },
) {
  if (!isBackendErrorResponse(response)) return false;
  if (options?.silent) return true;
  const target = panel ?? currentTutorSession?.element ?? null;
  if (!target) return true;

  if (
    response.unauthorized ||
    response.status === 401 ||
    response.status === 403 ||
    (response.error && /unauthorized/i.test(response.error))
  ) {
    lockPanel(target);
    ensureAuthPrompt(target, SESSION_EXPIRED_MESSAGE);
    if (!isWindowOpen) {
      showTutorPanel(target);
      hideWidget();
      isWindowOpen = true;
      markUserActivity();
      scheduleSessionPersist(target);
    }
    removeSessionExpiredMessage(target);
    return true;
  }

  if (response.timeout) {
    appendSystemMessage(
      target,
      options?.timeoutMessage ??
        "The model is taking longer than usual. Please try again.",
    );
    return true;
  }

  const serverMessage =
    options?.serverMessage ??
    "Internal server error. Please try again in a moment.";
  if (options?.lockOnServerError === true) {
    lockPanel(target);
  }
  appendSystemMessage(target, serverMessage);
  return true;
}

function showPanelLoading() {
  if (document.getElementById("tutor-panel-loading")) return;
  const loading = document.createElement("div");
  loading.id = "tutor-panel-loading";
  loading.className = "tutor-panel-loading";
  loading.innerHTML = `<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>`;
  document.body.appendChild(loading);
}

function hidePanelLoading() {
  document.getElementById("tutor-panel-loading")?.remove();
}

async function handleProblemUrlChange(nextUrl: string) {
  if (currentTutorSession?.userId && currentTutorSession.element) {
    await saveSessionState(currentTutorSession.element, { force: true });
  }
  pendingStoredSession = null;
  resetGuideState();
  const wasOpen = isWindowOpen;
  if (currentTutorSession?.element) {
    currentTutorSession.element.remove();
  }
  currentTutorSession = null;
  isWindowOpen = false;
  showWidget();
  await hydrateStoredSessionCache();
  if (wasOpen) {
    void openTutorPanel();
  }
}

function startProblemUrlWatcher() {
  if (problemUrlWatcherId) {
    window.clearInterval(problemUrlWatcherId);
  }
  problemUrlWatcherId = window.setInterval(() => {
    const current = getCanonicalProblemUrl(window.location.href);
    if (current !== lastCanonicalProblemUrl) {
      lastCanonicalProblemUrl = current;
      void handleProblemUrlChange(current);
    }
  }, 1000);
}

function ensureAuthPrompt(panel: HTMLElement, message?: string) {
  const existing = panel.querySelector<HTMLElement>(".tutor-panel-auth");
  if (existing) {
    if (message) {
      const errorBox = existing.querySelector<HTMLElement>(".auth-error");
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = "block";
      }
    }
    return;
  }
  suspendPanelOps = true;
  stopPanelOperations(panel);

  const authBox = document.createElement("div");
  authBox.className = "tutor-panel-auth";
  panel.appendChild(authBox);

  const setupPasswordToggle = (
    input: HTMLInputElement | null,
    toggle: HTMLButtonElement | null,
  ) => {
    if (!input || !toggle) return;
    const update = () => {
      const hidden = input.type === "password";
      toggle.setAttribute(
        "aria-label",
        hidden ? "Show password" : "Hide password",
      );
    };
    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      update();
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    update();
  };

  const applyAuthSuccess = async (userId: string) => {
    const currentUserId = currentTutorSession?.userId ?? "";
    const problemName =
      currentTutorSession?.problem ?? getProblemTitleFromPage();
    suspendPanelOps = false;

    if (currentUserId && currentUserId === userId) {
      sessionRestorePending = false;
      unlockPanel(panel);
      authBox.remove();
      scheduleSessionPersist(panel);
      return;
    }

    if (currentUserId && currentUserId !== userId) {
      await saveSessionState(panel, { force: true });
      resetPanelForUser(panel, userId, problemName);
    }

    const stored = await loadSessionState(userId, problemName);
    if (stored && isStoredSessionForUser(stored, userId)) {
      applyStoredSessionToPanel(panel, stored);
      await clearSessionState(userId, stored.state.problem);
      pendingStoredSession = null;
    } else if (stored) {
      await clearSessionState(userId, stored.state.problem);
    }

    if (currentTutorSession) {
      currentTutorSession.userId = userId;
    }
    sessionRestorePending = false;
    unlockPanel(panel);
    authBox.remove();
    scheduleSessionPersist(panel);
  };

  const renderLoginBox = (message?: string) => {
    authBox.innerHTML = `
      <div class="auth-error"></div>
      <h4>Login Required</h4>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <div class="auth-password-wrap">
        <input type="password" class="auth-password" placeholder="password" />
        <button type="button" class="auth-password-toggle" aria-label="Show password">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
            <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z"></path>
            <circle cx="12" cy="12" r="3.5"></circle>
          </svg>
        </button>
      </div>
      <div class="auth-actions">
        <button type="button" class="auth-login">Login</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-signup">Sign up</button>
      </div>
    `;

    const emailInput = authBox.querySelector<HTMLInputElement>(".auth-email");
    const passwordInput =
      authBox.querySelector<HTMLInputElement>(".auth-password");
    const login = authBox.querySelector<HTMLButtonElement>(".auth-login");
    const signup = authBox.querySelector<HTMLButtonElement>(".auth-signup");
    const toggle = authBox.querySelector<HTMLButtonElement>(
      ".auth-password-toggle",
    );
    const errorBox = authBox.querySelector<HTMLElement>(".auth-error");
    if (message && errorBox) {
      errorBox.textContent = message;
      errorBox.style.display = "block";
    }
    const clearError = () => {
      if (!errorBox) return;
      errorBox.style.display = "none";
    };
    emailInput?.addEventListener("input", clearError);
    passwordInput?.addEventListener("input", clearError);
    setupPasswordToggle(passwordInput, toggle);
    login?.addEventListener("click", async () => {
      const email = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value.trim() ?? "";
      if (!email || !password) return;
      const resp = await browser.runtime.sendMessage({
        action: "supabase-login",
        payload: { email, password },
      });
      if (resp?.success === false) {
        if (errorBox) {
          errorBox.textContent = resp.error || "Internal server error";
          errorBox.style.display = "block";
        }
        return;
      }
      if (resp?.userId && resp?.jwt) {
        await applyAuthSuccess(resp.userId);
      } else if (errorBox) {
        errorBox.textContent = "Invalid creds";
        errorBox.style.display = "block";
      }
    });
    signup?.addEventListener("click", () => {
      renderSignupBox();
    });
  };

  const renderSignupBox = () => {
    authBox.innerHTML = `
      <div class="auth-error">Signup failed</div>
      <h4>Create account</h4>
      <div class="auth-name-row">
        <input type="text" class="auth-first-name" placeholder="First name" />
        <input type="text" class="auth-last-name" placeholder="Last name" />
      </div>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <div class="auth-password-wrap">
        <input type="password" class="auth-password" placeholder="password" />
        <button type="button" class="auth-password-toggle" aria-label="Show password">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
            <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z"></path>
            <circle cx="12" cy="12" r="3.5"></circle>
          </svg>
        </button>
      </div>
      <div class="auth-password-hint"></div>
      <div class="auth-actions">
        <button type="button" class="auth-signup-submit">Sign up</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-back">Back to login</button>
      </div>
    `;
    const firstNameInput =
      authBox.querySelector<HTMLInputElement>(".auth-first-name");
    const lastNameInput =
      authBox.querySelector<HTMLInputElement>(".auth-last-name");
    const emailInput = authBox.querySelector<HTMLInputElement>(".auth-email");
    const passwordInput =
      authBox.querySelector<HTMLInputElement>(".auth-password");
    const signupSubmit = authBox.querySelector<HTMLButtonElement>(
      ".auth-signup-submit",
    );
    const toggle = authBox.querySelector<HTMLButtonElement>(
      ".auth-password-toggle",
    );
    const errorBox = authBox.querySelector<HTMLElement>(".auth-error");
    const passwordHint = authBox.querySelector<HTMLElement>(
      ".auth-password-hint",
    );
    const clearError = () => {
      if (!errorBox) return;
      errorBox.style.display = "none";
    };
    firstNameInput?.addEventListener("input", clearError);
    lastNameInput?.addEventListener("input", clearError);
    emailInput?.addEventListener("input", clearError);
    passwordInput?.addEventListener("input", clearError);
    setupPasswordToggle(passwordInput, toggle);
    passwordInput?.addEventListener("blur", () => {
      if (!passwordHint || !passwordInput) return;
      const value = passwordInput.value.trim();
      if (value && !isStrongPassword(value)) {
        passwordHint.textContent =
          "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";
        passwordHint.style.display = "block";
      } else {
        passwordHint.style.display = "none";
      }
    });
    passwordInput?.addEventListener("input", () => {
      if (!passwordHint || !passwordInput) return;
      const value = passwordInput.value.trim();
      if (value && isStrongPassword(value)) {
        passwordHint.style.display = "none";
      }
    });

    signupSubmit?.addEventListener("click", async () => {
      const fname = firstNameInput?.value.trim() ?? "";
      const lname = lastNameInput?.value.trim() ?? "";
      const email = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value.trim() ?? "";
      if (!fname || !lname || !email || !password) return;
      if (!isStrongPassword(password)) {
        if (passwordHint) {
          passwordHint.textContent =
            "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";
          passwordHint.style.display = "block";
        }
        return;
      }
      const resp = await browser.runtime.sendMessage({
        action: "supabase-signup",
        payload: { fname, lname, email, password },
      });
      if (resp?.success === false) {
        if (errorBox) {
          errorBox.textContent = resp.error || "Internal server error";
          errorBox.style.display = "block";
        }
        return;
      }
      if (resp?.requiresVerification) {
        renderLoginBox("Waiting for verification, check email");
      } else if (resp?.userId && resp?.jwt) {
        await applyAuthSuccess(resp.userId);
      } else if (errorBox) {
        errorBox.style.display = "block";
      }
    });

    const back = authBox.querySelector<HTMLButtonElement>(".auth-back");
    back?.addEventListener("click", () => {
      renderLoginBox();
    });
  };

  renderLoginBox(message);
}

type PanelPosition = { x: number; y: number };
type PanelSize = { width: number; height: number };

function createTutorPanel() {
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
          <button class="btn-timer">Timer</button>
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

function setupGloableMouseTracking() {}
function closeTutorPanel() {
  if (!currentTutorSession?.element) {
    return;
  }
  hideTutorPanel(currentTutorSession.element);
  positionWidgetFromPanel(currentTutorSession.element);
  showWidget();
  isWindowOpen = false;
  scheduleSessionPersist(currentTutorSession.element);
}
//function createTutorPanel() {}
function highlightExistingPanel(session: HTMLElement) {}
function hideWidget() {
  if (widget) {
    widget.style.display = "none";
  }
}
function showWidget() {
  if (widget) {
    widget.style.display = "block";
  }
}
function isWidgetVisible() {}
function setupMessageListener() {}
async function saveWidgetPosition() {}
async function loadWidgetPosition() {}

function handleTutorPanelActions() {}
let guideMinIdx = Number.POSITIVE_INFINITY;
let guideMaxIdx = -1;
let guideBatchTimerId: number | null = null;
let guideBatchStarted = false;
let guideTouchedLines = new Set<number>();
let maxLines = 0;
let guideAttachAttempts = 0;
let guideDrainInFlight = false;
let lastGuideSelectionLine: number | null = null;
let lastGuideFlushLine: number | null = null;
let lastGuideFlushAt = 0;
let guideMessageCount = 0;
let lastGuideMessageEl: HTMLElement | null = null;

function guideMode() {}

function getEditorInputArea(): HTMLTextAreaElement | null {
  return document.querySelector(
    ".monaco-editor textarea.inputarea",
  ) as HTMLTextAreaElement | null;
}

function getLineNumberFromIndex(code: string, idx: number) {
  return code.slice(0, Math.max(0, idx)).split("\n").length;
}

function getFocusBlock(
  code: string,
  minIdx: number,
  maxIdx: number,
  extraLines = 1,
) {
  console.log("this is hte minIdx for the focus block: ");
  const safeMin = Math.max(0, Math.min(minIdx, code.length));
  const safeMax = Math.max(0, Math.min(maxIdx, code.length));
  let start = code.lastIndexOf("\n", safeMin - 1);
  start = start === -1 ? 0 : start + 1;
  let end = code.indexOf("\n", safeMax);
  end = end === -1 ? code.length : end;
  console.log("this is the start for the focus block: ", start);

  // if (extraLines > 0) {
  //   for (let i = 0; i < extraLines; i += 1) {
  //     const prev = code.lastIndexOf("\n", start - 2);
  //     start = prev === -1 ? 0 : prev + 1;
  //     const next = code.indexOf("\n", end + 1);
  //     end = next === -1 ? code.length : next;
  //   }
  // }

  return {
    focusBlock: code.slice(start, end),
    focusStartIdx: start,
    focusEndIdx: end,
  };
}

function resetGuideBatch() {
  guideTouchedLines.clear();
  guideMinIdx = Number.POSITIVE_INFINITY;
  guideMaxIdx = -1;
  guideBatchStarted = false;
  if (guideBatchTimerId !== null) {
    window.clearTimeout(guideBatchTimerId);
    guideBatchTimerId = null;
  }
}

async function flushGuideBatch(
  trigger: "timer" | "threshold" | "cursor-change",
) {
  // faulty
  const fullCode = getCodeFromEditor(); // redundant
  const inputArea = getEditorInputArea();
  const inputAreaCode = inputArea?.value ?? "";
  const lineNumber = Array.from(guideTouchedLines)[0] ?? 1;
  if (!lineNumber) {
    resetGuideBatch();
    return;
  }
  const now = Date.now();
  if (lastGuideFlushLine === lineNumber && now - lastGuideFlushAt < 250) {
    return;
  }
  lastGuideFlushLine = lineNumber;
  lastGuideFlushAt = now;
  //const focusBlock = inputArea.value ?? "";
  if (!fullCode) {
    // redundant
    resetGuideBatch();
    return;
  }
  let focusLine = "";
  if (inputAreaCode) {
    focusLine = getLineByNumber(inputAreaCode, lineNumber);
  }

  if (!focusLine.trim() && lineNumber > 1 && inputAreaCode) {
    const previousLine = getLineByNumber(inputAreaCode, lineNumber - 1);
    if (previousLine.trim()) {
      focusLine = previousLine;
    }
  }

  let codeSoFar = fullCode;
  try {
    const res = await browser.runtime.sendMessage({ type: "GET_MONACO_CODE" });
    if (res?.ok && typeof res.code === "string") {
      codeSoFar = res.code;
    }
  } catch {
    // Fallback to DOM-extracted code when background messaging fails.
  }
  if (!isValidFocusLine(focusLine)) {
    resetGuideBatch();
  } else {
    queue.push([codeSoFar, focusLine]);
    void drainGuideQueue();

    resetGuideBatch();
  }
}

function isValidFocusLine(focusLine: string): boolean {
  // this is only for Java, for now. Have to implement for python, c, c#, c++, js and all
  const trimmed = focusLine.trim();
  if (!trimmed) return false;
  if (/[;}]\s*$/.test(trimmed)) return true;
  if (trimmed === "else" || trimmed === "if" || trimmed === "while") {
    return false;
  }
  if (/^else\b/.test(trimmed) && /\{\s*$/.test(trimmed)) {
    return false;
  }
  const wordCount = trimmed
    .replace(/[{}();]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return wordCount > 1;
}

function getLineByNumber(code: string, lineNumber: number) {
  const lines = code.split("\n");
  return lines[lineNumber - 1] ?? "";
}

async function drainGuideQueue() {
  if (guideDrainInFlight) return;
  if (suspendPanelOps) {
    queue = [];
    return;
  }
  guideDrainInFlight = true;
  try {
    while (queue.length > 0) {
      if (suspendPanelOps) {
        queue = [];
        break;
      }
      const [code, focusLine] = queue.shift()!;
      console.log("This is the focus line: ", focusLine); // this is not the one, get the correct focus line
      console.log("the code so far: ", code);
      flushInFlight = true;
      const resp = await browser.runtime.sendMessage({
        action: "guide-mode",
        payload: {
          action: "guide-mode",
          sessionId: currentTutorSession?.sessionId ?? "",
          problem: currentTutorSession?.problem ?? "",
          topics: currentTutorSession?.topics,
          code,
          focusLine,
          rollingStateGuideMode: currentTutorSession?.rollingStateGuideMode,
        },
      });
      if (
        handleBackendError(currentTutorSession?.element ?? null, resp, {
          timeoutMessage:
            "Guide mode is taking longer than usual. Please try again.",
        })
      ) {
        flushInFlight = false;
        continue;
      }
      if (!resp) {
        console.log("failure for guide mode");
      } else {
        // Put this into a separate function
        const reply = resp.success ? resp.reply : null;
        if (reply?.state_update?.lastEdit?.trim() && currentTutorSession) {
          currentTutorSession.rollingStateGuideMode.lastEdit =
            reply.state_update.lastEdit;
        }
        const nudge = reply?.nudge;

        if (currentTutorSession && typeof nudge === "string") {
          currentTutorSession.content.push(`${nudge}\n`);
          if (currentTutorSession.element != null) {
            //const pretty = prettifyLlMResponse(nudge);

            await appendToContentPanel(
              //but is it good to call a await inside of an already async function?
              currentTutorSession.element,
              "",
              "guideAssistant",
              nudge,
            );
          }
          //await appendToContentPanel(panel, "", "assistant", nudge);
          scheduleSessionPersist(currentTutorSession.element ?? null);
        }

        const topics = reply?.topics;
        if (topics && typeof topics === "object" && currentTutorSession) {
          for (const [topic, raw] of Object.entries(
            topics as Record<string, unknown>,
          )) {
            if (!raw || typeof raw !== "object") continue;
            const normalizedTopic = ensureTopicBucket(
              currentTutorSession,
              topic,
            );

            const thoughts = (raw as { thoughts_to_remember?: unknown })
              .thoughts_to_remember;
            const pitfalls = (raw as { pitfalls?: unknown }).pitfalls;

            const thoughtValues = Array.isArray(thoughts)
              ? thoughts
              : typeof thoughts === "string" && thoughts.trim()
                ? [thoughts.trim()]
                : [];

            const pitfallValues = Array.isArray(pitfalls)
              ? pitfalls
              : typeof pitfalls === "string" && pitfalls.trim()
                ? [pitfalls.trim()]
                : [];

            if (!currentTutorSession) continue;
            if (thoughtValues.length > 0) {
              currentTutorSession.topics[
                normalizedTopic
              ].thoughts_to_remember.push(...thoughtValues);
            }
            if (pitfallValues.length > 0) {
              currentTutorSession.topics[normalizedTopic].pitfalls.push(
                ...pitfallValues,
              );
            }
          }
        }
        if (currentTutorSession?.element) {
          scheduleSessionPersist(currentTutorSession.element);
        }
        flushInFlight = false;
      }
    }
  } finally {
    guideDrainInFlight = false;
  }
}

// this function does not give any code
function getCodeElementFullCode(): HTMLTextAreaElement | null {
  return document.querySelector(
    ".view-lines.monaco-mouse-cursor-text",
    // ".monaco-scrollable-element.editor-scrollable.vs.mac",
  ) as HTMLTextAreaElement | null;
  //.lines-content.monaco-editor-background
}

function onGuideInput() {
  // remove the event from here
  if (!currentTutorSession?.guideModeEnabled) return;
  const inputArea = getEditorInputArea();
  // here, fetch the line number from the inputarea, write a separate function from getEditorInputArea
  if (!inputArea) return;

  const fullCode = inputArea.value ?? ""; // to be checked if it get the whole code or not
  const cursorIdx = inputArea.selectionStart ?? 0;

  const lineNumber = getLineNumberFromIndex(fullCode, cursorIdx);
  //maybeEnqueueEditedLine(event, lineNumber);
  if (!guideTouchedLines.has(lineNumber) && guideTouchedLines.size == 0) {
    guideTouchedLines.add(lineNumber);
  }

  if (!guideBatchStarted) {
    guideBatchStarted = true;
  }
  if (guideBatchTimerId !== null) {
    window.clearTimeout(guideBatchTimerId);
  }
  guideBatchTimerId = window.setTimeout(() => {
    flushGuideBatch("timer");
  }, 10000);

  if (!guideTouchedLines.has(lineNumber) && guideTouchedLines.size == 1) {
    flushGuideBatch("threshold");
  }
}

function onGuideSelectionChange() {
  if (!currentTutorSession?.guideModeEnabled) return;
  if (!guideBatchStarted) return;
  const inputArea = getEditorInputArea();
  if (!inputArea) return;
  const fullCode = inputArea.value ?? "";
  const cursorIdx = inputArea.selectionStart ?? 0;
  const lineNumber = getLineNumberFromIndex(fullCode, cursorIdx);
  if (lastGuideSelectionLine === null) {
    lastGuideSelectionLine = lineNumber;
    return;
  }
  if (lineNumber === lastGuideSelectionLine) return;
  lastGuideSelectionLine = lineNumber;
  if (!guideTouchedLines.has(lineNumber) && guideTouchedLines.size == 1) {
    flushGuideBatch("cursor-change");
  }
}

function attachGuideListeners() {
  const inputArea = getEditorInputArea();
  //console.log("this is the input line: ", inputArea);

  if (!inputArea) {
    if (guideAttachAttempts < 5) {
      guideAttachAttempts += 1;
      window.setTimeout(attachGuideListeners, 500);
    }
    return;
  }
  inputArea.addEventListener("input", onGuideInput); // every time the user inputs characters, the onGuideInput function is called
  document.addEventListener("selectionchange", onGuideSelectionChange);
}

function detachGuideListeners() {
  const inputArea = getEditorInputArea();
  if (!inputArea) return;
  inputArea.removeEventListener("input", onGuideInput);
  document.removeEventListener("selectionchange", onGuideSelectionChange);
}

function highlightAskArea() {}

function showAssistantLoading(panel: HTMLElement) {
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

async function askAnything(panel: HTMLElement, query: string) {
  //console.log("this is the query asked: ", query);
  const loadingEl = showAssistantLoading(panel);
  const language = currentTutorSession?.language || getEditorLanguageFromPage();
  const response = await browser.runtime.sendMessage({
    action: "ask-anything",
    payload: {
      sessionId: currentTutorSession?.sessionId ?? "",
      action: "ask-anything",
      rollingHistory: currentTutorSession?.sessionRollingHistory.qaHistory,
      summary: currentTutorSession?.sessionRollingHistory.summary ?? "",
      query: query,
      language,
    },
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
    typeof response === "string" ? response : (response as any)?.reply;
  if (typeof reply === "string" && reply.trim()) {
    loadingEl?.remove();
    appendToContentPanel(panel, "", "assistant", reply);
  }
  loadingEl?.remove();
  if (!reply) return "Failure";
  return reply;
}

function createTimer() {}
function sendChat() {}
function minimizeWindow() {}

function showTutorPanel(panel: HTMLElement) {
  if (panelHideTimerId !== null) {
    window.clearTimeout(panelHideTimerId);
    panelHideTimerId = null;
  }
  panel.classList.remove("closing");
  panel.style.display = "flex";
  panel.classList.add("open");
}

function hideTutorPanel(panel: HTMLElement) {
  panel.classList.remove("open");
  panel.classList.add("closing");
  if (panelHideTimerId !== null) {
    window.clearTimeout(panelHideTimerId);
  }
  panelHideTimerId = window.setTimeout(() => {
    panel.style.display = "none";
    panel.classList.remove("closing");
    panelHideTimerId = null;
  }, 180);
}

function positionWidgetFromPanel(panel: HTMLElement) {
  if (!widget) {
    return;
  }
  const panelRect = panel.getBoundingClientRect();
  const widgetRect = widget.getBoundingClientRect();
  const widgetWidth = widgetRect.width || 50;
  const widgetHeight = widgetRect.height || 50;

  const panelCenterX = panelRect.left + panelRect.width / 2;
  const isLeftAnchor = panelCenterX <= window.innerWidth / 2;
  const isRightAnchor = panelCenterX >= window.innerWidth / 2;
  const x = isLeftAnchor ? 10 : window.innerWidth - widgetWidth - 10;
  const y = Math.max(
    10,
    Math.min(
      window.innerHeight / 2 - widgetHeight / 2,
      window.innerHeight - widgetHeight - 10,
    ),
  );

  widget.style.left = `${x}px`;
  widget.style.top = `${y}px`;
  widget.style.right = "auto";
  widget.style.bottom = "auto";
  widget.style.transform = "";
  lastPosition = { x, y };
  saveWidgetPosition();
}

function getCodeFromEditor() {
  const codeText = (
    document.querySelector(
      ".monaco-scrollable-element.editor-scrollable.vs.mac",
    ) as HTMLElement | null
  )?.innerText;
  //.lines-content.monaco-editor-background
  return codeText ?? "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInlineMarkdown(text: string) {
  const parts = text.split("`");
  const renderInlineMarkup = (value: string) => {
    const regex = /(\*\*[^*\n]+\*\*|'[^'\n]+')/g;
    let result = "";
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(value)) !== null) {
      result += escapeHtml(value.slice(lastIndex, match.index));
      const token = match[1];
      if (token.startsWith("**")) {
        result += `<strong>${escapeHtml(token.slice(2, -2))}</strong>`;
      } else {
        result += `<code>${escapeHtml(token.slice(1, -1))}</code>`;
      }
      lastIndex = regex.lastIndex;
    }
    result += escapeHtml(value.slice(lastIndex));
    return result;
  };
  return parts
    .map((part, index) =>
      index % 2 === 1
        ? `<code>${escapeHtml(part)}</code>`
        : renderInlineMarkup(part),
    )
    .join("");
}

function renderTextMarkdown(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html += `<p>${formatInlineMarkdown(paragraph.join(" "))}</p>`;
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html += `</${listType}>`;
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html += `<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`;
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== "ol") {
        closeList();
      }
      if (!listType) {
        listType = "ol";
        html += "<ol>";
      }
      html += `<li>${formatInlineMarkdown(orderedMatch[2])}</li>`;
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== "ul") {
        closeList();
      }
      if (!listType) {
        listType = "ul";
        html += "<ul>";
      }
      html += `<li>${formatInlineMarkdown(unorderedMatch[1])}</li>`;
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  return html;
}

function renderMarkdown(message: string) {
  const normalized = message.replace(/\r\n/g, "\n");
  const parts: { type: "text" | "code"; content: string; lang?: string }[] = [];
  const fence = /```(\w+)?\r?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: normalized.slice(lastIndex, match.index),
      });
    }
    parts.push({
      type: "code",
      content: match[2] ?? "",
      lang: match[1] ?? "",
    });
    lastIndex = fence.lastIndex;
  }
  if (lastIndex < normalized.length) {
    parts.push({ type: "text", content: normalized.slice(lastIndex) });
  }

  return parts
    .map((part) => {
      if (part.type === "code") {
        const lang = part.lang ? ` data-lang="${escapeHtml(part.lang)}"` : "";
        return `<pre><code${lang}>${escapeHtml(
          part.content.trimEnd(),
        )}</code></pre>`;
      }
      return renderTextMarkdown(part.content);
    })
    .join("");
}

function appendPanelMessage(
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

function setPanelControlsDisabledGuide(panel: HTMLElement, disabled: boolean) {
  const selectors = [
    ".btn-help-mode",
    ".btn-timer",
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

function setPanelControlsDisabled(panel: HTMLElement, disabled: boolean) {
  const selectors = [
    ".btn-guide-mode",
    ".btn-help-mode",
    ".btn-timer",
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

function typeMessage(
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

async function appendToContentPanel(
  panel: HTMLElement,
  some: string,
  role: string,
  llm_response: string,
) {
  const pretty = prettifyLlMResponse(llm_response);
  const content_area = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (content_area && typeof llm_response === "string") {
    if (role === "assistant") {
      const message = appendPanelMessage(panel, "", "assistant");
      if (!message) return;
      await typeMessage(message, content_area, pretty, {
        render: renderMarkdown,
      });
      message.innerHTML = renderMarkdown(pretty);
      currentTutorSession?.sessionRollingHistory.qaHistory.push(
        `Assitant: ${llm_response}`,
      );
      if (currentTutorSession) {
        maybeQueueSummary(currentTutorSession.sessionRollingHistory);
      }
      content_area.scrollTop = message.offsetTop;
      scheduleSessionPersist(panel);
    } else if (role === "guideAssistant") {
      let wrapper = content_area.querySelector<HTMLElement>(
        ".guide-wrapper.guide-slab",
      );
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = "guide-wrapper guide-slab";
        const list = document.createElement("ul");
        list.className = "guide-list";
        wrapper.appendChild(list);
        content_area.appendChild(wrapper);
      }

      const list =
        wrapper.querySelector<HTMLUListElement>(".guide-list") ??
        document.createElement("ul");
      if (!list.classList.contains("guide-list")) {
        list.className = "guide-list";
        wrapper.appendChild(list);
      }

      const item = document.createElement("li");
      item.className = "guide-item";
      list.appendChild(item);

      if (guideMessageCount === 0) {
        wrapper.classList.add("guide-start");
      }
      guideMessageCount += 1;
      lastGuideMessageEl = wrapper;

      await typeMessage(item, content_area, pretty, {
        render: renderMarkdown,
      });
      item.innerHTML = renderMarkdown(pretty);
      content_area.scrollTop = wrapper.offsetTop;
      scheduleSessionPersist(panel);
    } else if (role === "checkAssistant") {
      const wrapper = appendPanelMessage(panel, "", "checkAssistant");
      if (!wrapper) return;

      const bubble = wrapper.querySelector<HTMLElement>(
        ".tutor-panel-message--checkAssistant",
      );
      if (!bubble) return;

      // checkmode is one chunk → start + end immediately
      wrapper.classList.add("check-start");

      await typeMessage(bubble, content_area, pretty, {
        render: renderMarkdown,
      });
      bubble.innerHTML = renderMarkdown(pretty);

      wrapper.classList.add("check-end");
      content_area.scrollTop = wrapper.offsetTop;
      scheduleSessionPersist(panel);
    }
  }
}

async function checkMode(panel: HTMLElement, writtenCode: string | unknown) {
  //console.log("this is the code written so far: ", writtenCode);
  try {
    const response = await browser.runtime.sendMessage({
      action: "check-code",
      payload: {
        sessionId: currentTutorSession?.sessionId ?? "",
        topics: currentTutorSession?.topics,
        code: writtenCode, // <-- raw string
        action: "check-code",
        problem_no: getProblemNumberFromTitle(
          currentTutorSession?.problem ?? "",
        ),
        problem_name: currentTutorSession?.problem ?? "",
        problem_url: currentTutorSession?.problemUrl ?? "",
      },
    });
    if (
      handleBackendError(panel, response, {
        timeoutMessage:
          "The model is taking longer than usual. Please try again.",
      })
    ) {
      return "Failure";
    }
    const response_llm = response?.resp;
    //const pretty = prettifyLlMResponse(response_llm);
    if (currentTutorSession && typeof response_llm === "string") {
      currentTutorSession.content.push(`${response_llm}\n`);
    }
    if (typeof response_llm === "string" && response_llm.trim()) {
      await appendToContentPanel(panel, "", "checkAssistant", response_llm);
    }

    const topics = response?.topics;
    if (topics && typeof topics === "object" && currentTutorSession) {
      for (const [topic, raw] of Object.entries(
        topics as Record<string, unknown>,
      )) {
        if (!raw || typeof raw !== "object") continue;
        const normalizedTopic = ensureTopicBucket(currentTutorSession, topic);

        const thoughts = (raw as { thoughts_to_remember?: unknown })
          .thoughts_to_remember;
        const pitfalls = (raw as { pitfalls?: unknown }).pitfalls;

        const thoughtValues = Array.isArray(thoughts)
          ? thoughts
          : typeof thoughts === "string" && thoughts.trim()
            ? [thoughts.trim()]
            : [];

        const pitfallValues = Array.isArray(pitfalls)
          ? pitfalls
          : typeof pitfalls === "string" && pitfalls.trim()
            ? [pitfalls.trim()]
            : [];

        if (!currentTutorSession) continue;
        if (thoughtValues.length > 0) {
          currentTutorSession.topics[normalizedTopic].thoughts_to_remember.push(
            ...thoughtValues,
          );
        }
        if (pitfallValues.length > 0) {
          currentTutorSession.topics[normalizedTopic].pitfalls.push(
            ...pitfallValues,
          );
        }
      }
    }
    console.log("this is the object now: ", currentTutorSession?.topics);
    scheduleSessionPersist(panel);
    return response?.resp;
  } catch (error) {
    console.error("checkMode failed", error);
    return "Failure";
  }
  //console.log("this is the respnse: ", response);
}

function setupTutorPanelEvents(panel: HTMLElement) {
  const closeButton =
    panel.querySelector<HTMLButtonElement>(".tutor-panel-close");
  const checkModeClicked =
    panel.querySelector<HTMLButtonElement>(".btn-help-mode");
  const guideMode = panel.querySelector<HTMLButtonElement>(".btn-guide-mode");
  const goToWorkspace = panel.querySelector<HTMLButtonElement>(
    ".btn-gotToWorkspace",
  );

  guideMode?.addEventListener("click", () => {
    if (!currentTutorSession) return;

    currentTutorSession.guideModeEnabled =
      !currentTutorSession.guideModeEnabled;

    const guideModeButton = panel.querySelector<HTMLElement>(".btn-guide-mode");
    if (currentTutorSession.userId) {
      const problemName = currentTutorSession.problem;
      const problemNo = getProblemNumberFromTitle(problemName);
      void browser.runtime.sendMessage({
        action: "guide-mode-status",
        payload: {
          enabled: currentTutorSession.guideModeEnabled,
          sessionId: currentTutorSession.sessionId,
          problem_no: problemNo,
          problem_name: problemName,
          problem_url: currentTutorSession.problemUrl,
        },
      });
    }
    setPanelControlsDisabledGuide(panel, true);
    panel.classList.add("guidemode-active");

    if (currentTutorSession.guideModeEnabled) {
      //content_area?.classList.add("guide_start");
      guideModeButton?.classList.add("is-loading"); // #change this to is-active
      guideMessageCount = 0;
      lastGuideMessageEl = null;
      attachGuideListeners();
    } else {
      detachGuideListeners();
      if (lastGuideMessageEl) {
        lastGuideMessageEl.classList.add("guide-end");
      }
      setPanelControlsDisabledGuide(panel, false);
      panel.classList.remove("guidemode-active");
      guideModeButton?.classList.remove("is-loading");
    }
    scheduleSessionPersist(panel);
  });

  goToWorkspace?.addEventListener("click", async () => {
    if (!WORKSPACE_URL) {
      console.warn("Workspace URL is not set.");
      return;
    }
    const resp = await browser.runtime.sendMessage({
      action: "go-to-workspace",
      payload: { url: WORKSPACE_URL },
    });
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

  sendQuestion?.addEventListener("click", async () => {
    if (!currentTutorSession?.prompt) return highlightAskArea();
    else {
      const toAsk = currentTutorSession.prompt;
      if (prompt) {
        prompt.value = "";
      }
      if (currentTutorSession) {
        currentTutorSession.prompt = "";
      }
      appendPanelMessage(panel, toAsk, "user");
      currentTutorSession.sessionRollingHistory.qaHistory.push(
        `user: ${toAsk}`,
      );
      maybeQueueSummary(currentTutorSession.sessionRollingHistory);
      scheduleSessionPersist(panel);
      const resp = await askAnything(panel, toAsk);
      currentTutorSession.prompt = "";
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
    if (currentTutorSession) {
      currentTutorSession.checkModeEnabled = true;
      checkModeButton?.classList.add("is-loading");
    }
    setPanelControlsDisabled(panel, true);
    panel.classList.add("checkmode-active");

    try {
      const res = await browser.runtime.sendMessage({
        type: "GET_MONACO_CODE",
      }); // check this later
      if (res?.ok && typeof res.code === "string" && currentTutorSession) {
        codeSoFar = res.code;
      }
      const resp = await checkMode(panel, codeSoFar);
      console.log("this is the response: ", resp);
    } catch {
      // Fallback to DOM-extracted code when background messaging fails.
    } finally {
      if (currentTutorSession) {
        currentTutorSession.checkModeEnabled = false;
        checkModeButton?.classList.remove("is-loading");
      }
      setPanelControlsDisabled(panel, false);
      panel.classList.remove("checkmode-active");
      scheduleSessionPersist(panel);
    }
  });

  prompt?.addEventListener("input", () => {
    if (currentTutorSession) {
      currentTutorSession.prompt = prompt.value;
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
    if (currentTutorSession) {
      currentTutorSession.position = {
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
