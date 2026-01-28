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
let globalLogo: string; // Global variable for smiley face URL
let globalMouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let flushInFlight: boolean;
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

  let logo: string;
  try {
    logo = browser.runtime.getURL("logo.png" as any);
    globalLogo = logo;
  } catch (error) {
    console.warn("There is an error loading the logo: ", error);
    const extensionId = browser.runtime.id || chrome.runtime.id;
    logo = `chrome-extension://${extensionId}/logo.png`;
    globalLogo = logo; // Store globally
  }

  console.log("StickyNoteAI: Image URLs:", { logo });
  console.log("StickyNoteAI: Extension ID:", browser.runtime.id);
  console.log("StickyNoteAI: Chrome runtime ID:", chrome.runtime.id);

  widget.innerHTML = `
  <div class="widget-main-button" id="main-button">
  <img src="${logo}" alt="Widget" style="width: 24px; height: 24px;" id="logo-image">
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
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(2px);
      position: relative;
    }
      .widget-main-button.dragging {
      cursor: grabbing !important;
      transform: scale(0.95);
      box-shadow: 
        0 8px 30px rgba(153, 41, 234, 0.7),
        0 0 25px rgba(153, 41, 234, 0.9),
        0 0 50px rgba(204, 102, 218, 0.7),
        0 0 80px rgba(204, 102, 218, 0.5);
      animation: none;
    }
      
    /* =========================
   PANEL - Better Layout
   ========================= */

.tutor-panel{
  position: fixed;
  width: 450px;
  height: 400px;

  /* Sticky note look */
  background: rgba(255, 251, 147, 0.98);
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.10);

/*  box-shadow:
    0 14px 30px rgba(0,0,0,0.18),
    0 2px 6px rgba(0,0,0,0.10); */

  z-index: 999997;
  font-family: 'Segoe UI', system-ui, sans-serif;

  transform: scale(0.9) rotate(0deg);
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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(239, 230, 188, 0.65);
  border-bottom: 1px solid rgba(0,0,0,0.08);
  cursor: grab;
}

.tutor-panel-shellbar:active{
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
  transform: scale(0.9) rotate(0deg);
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
  font-size: 12px;
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

  background: rgba(239, 230, 188, 0.75);
  border-bottom: 1px solid rgba(0,0,0,0.10);
}

/* Close button */
.tutor-panel-close{
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;

  background: rgba(231, 218, 225, 0.45);
  color: rgba(0,0,0,0.85);
  font-size: 18px;
  line-height: 1;

  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 120ms ease, background 120ms ease;
}
.tutor-panel-close:hover{
  transform: scale(1.06);
  background: rgba(237, 107, 172, 0.55);
}

/* Actions row */
.tutor-panel-actions{
  display: flex;
  align-items: center;
  gap: 8px;

  /* IMPORTANT: don’t let this become a giant green slab */
  background: transparent;
  padding: 0;
  margin: 0;
}

/* Buttons */
.btn-guide-mode,
.btn-help-mode,
.btn-timer{
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(229, 233, 226, 0.92);
  color: rgba(0,0,0,0.85);

  padding: 6px 10px;
  border-radius: 4px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
}
.btn-guide-mode:not(:disabled):hover,
.btn-timer:not(:disabled):hover{
  transform: translateY(-1px);
  filter: brightness(0.98);
  
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-timer:active{
  transform: translateY(0px);
}

.btn-help-mode:not(:disabled):hover
{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
}

.btn-guide-mode:not(:disabled):hover
{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
}


@keyframes hoverPulse {
  0%   { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
  50%  { transform: translateY(-2px); filter: brightness(1.02) saturate(1.15); }
  100% { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
}

.btn-guide-mode.is-loading{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
  animation: hoverPulse 1.2s ease-in-out infinite;
}


.btn-help-mode.is-loading{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
  animation: hoverPulse 1.2s ease-in-out infinite;
  }

.tutor-panel.checkmode-active .btn-guide-mode,
.tutor-panel.checkmode-active .btn-timer,
.tutor-panel.checkmode-active .tutor-panel-send{
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
  font-size: 16px;
  font-weight: 700;
  color: rgba(0,0,0,0.7);
}

.tutor-panel.guidemode-active .btn-help-mode,
.tutor-panel.guidemode-active .btn-timer,
.tutor-panel.guidemode-active .tutor-panel-send{
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
  font-size: 16px;
  font-weight: 700;
  color: rgba(0,0,0,0.7);
}


/* Content area */
.tutor-panel-content{
  flex: 1;                 /* takes remaining space */
  padding: 12px;
  overflow-x: hidden;

  background: rgba(255, 255, 255, 0.35);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tutor-panel-auth{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 280px;      /* smaller box */
  padding: 12px;
 /* inset: 16px; */
  z-index: 2;
  padding: 12px;
 /* border: 1px dashed rgba(0,0,0,0.2); */
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.tutor-panel-auth h4{
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 700;
}
.tutor-panel-auth label{
  display: block;
  font-size: 12px;
  margin: 6px 0 2px;
}
.tutor-panel-auth input{
  width: 100%;
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
  border: 1px solid rgba(0,0,0,0.2);
  background: rgba(229, 233, 226, 0.92);
  font-weight: 600;
  cursor: pointer;
}

.tutor-panel-auth .auth-supabase{
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.tutor-panel-message{
  margin: 0;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 8px;
  color: rgba(0,0,0,0.86);
  font-size: 14px;
  line-height: 1.7;
}

.tutor-panel-message--assistant{
  background: transparent;
  border-radius: 7px;
  border: none;
  padding: 10px 8px;
  align-self: flex-start;
  margin-top: 14px;
  padding-top: 18px 20px;

}

.tutor-panel-message--guideAssistant{
  border: none;
  background: rgba(15, 23, 42, 0.06);
  border-radius: 7px;
  padding: 10px 20px;
  align-self: flex-start;
}

.guide-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

/* Border + GAP live here */
.guide-wrapper.guide-start{
  border-top: 2px solid rgba(0,0,0,0.45);
  margin-top: 14px;
  padding-top: 14px;
}

.guide-wrapper.guide-end{
  border-bottom: 2px solid rgba(0,0,0,0.45);
  margin-bottom: 14px;
  padding-bottom: 14px;
}

.tutor-panel-message--checkAssistant{
  border: none;
  background: rgba(15, 23, 42, 0.06);
  border-radius: 7px;
  padding: 10px 20px;
  align-self: flex-start;
}
.check-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

.check-wrapper.check-start{
  border-top: 2px solid rgba(0,0,0,0.45);
  margin-top: 14px;
  padding-top: 14px;
}

.check-wrapper.check-end{
  border-bottom: 2px solid rgba(0,0,0,0.45);
  margin-bottom: 14px;
  padding-bottom: 14px;
}
.tutor-panel-message--checkAssistant{
  background: rgba(0, 0, 0, 0.06); /* a bit warmer/neutral */
}


.tutor-panel-loading{
  font-size: 13px;
  color: rgba(0,0,0,0.6);
  padding: 6px 12px;
  align-self: flex-start;
}


.tutor-panel-message--user{
  align-self: flex-end;
  max-width: 75%;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.85);
}

.tutor-panel-message p{
  margin: 0 0 8px 0;
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
  border-radius: 4px;
}
.tutor-panel-message pre{
  background: rgba(15, 23, 42, 0.06);
  padding: 10px 12px;
  border-radius: 8px;
  overflow: auto;
  white-space: pre-wrap;
}
.tutor-panel-message pre code{
  background: transparent;
  padding: 0;
}



/* Input bar pinned at bottom */
.tutor-panel-inputbar{
  display: flex;
  align-items: flex-end;
  gap: 10px;

  padding: 10px;

  background: rgba(228, 235, 192, 0.92);
  border-top: 1px solid rgba(0,0,0,0.10);
}

/* Textarea */
.tutor-panel-prompt{
  flex: 1;
  min-height: 44px;
  max-height: 110px;
  resize: none;

  padding: 10px 12px;

  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.14);
  outline: none;

  background: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  line-height: 1;
}
.tutor-panel-prompt:focus{
  border-color: rgba(0,0,0,0.22);
  box-shadow: 0 0 0 3px rgba(146, 229, 83, 0.25);
}

/* Send */
.tutor-panel-send{
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(4, 5, 4, 0.92);
  color: rgba(255, 255, 255, 0.85);

  border-radius: 4px;
  padding: 10px 14px;

  font-weight: 800;
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease;
  white-space: nowrap;
}
.tutor-panel-send:hover{
  transform: translateY(-1px);
  filter: brightness(0.98);
}
.tutor-panel-send:active{
  transform: translateY(0px);
}`;
  document.head.appendChild(style);
  document.body.appendChild(widget);

  // Setup image loading event listeners
  const logoImage = document.getElementById("logo-image") as HTMLImageElement;
  //const addImage = document.getElementById("add-image") as HTMLImageElement;

  if (logoImage) {
    logoImage.addEventListener("load", () => {
      console.log("✅ image loaded successfully");
    });
    logoImage.addEventListener("error", () => {
      console.error("❌ Failed to load logo image:", logo);
      logoImage.style.display = "none";
    });
  }
  setupWidgetEvents();
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
    .map((href) =>
      href.replace("/tag/", "").replace("/", "").replace("-", "_"),
    );

  return Object.fromEntries(
    Array.from(new Set(topicsList)).map((t) => [
      t,
      { thoughts_to_remember: [], pitfalls: [] },
    ]),
  );
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
  if (
    currentTutorSession &&
    currentTutorSession.element &&
    document.body.contains(currentTutorSession.element)
  ) {
    showTutorPanel(currentTutorSession.element);
    hideWidget();
    isWindowOpen = true;
    highlightExistingPanel(currentTutorSession.element);
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
    const auth = await loadAuthFromStorage();
    if (auth?.userId) {
      const stored = await loadSessionState(
        auth.userId,
        getProblemTitleFromPage(),
      );
      if (stored && isStoredSessionForUser(stored, auth.userId)) {
        pendingStoredSession = stored;
      }
    }
  }

  if (pendingStoredSession) {
    const tutorPanel = createTutorPanel();
    applyStoredSessionToPanel(tutorPanel, pendingStoredSession);
    pendingStoredSession = null;
    showTutorPanel(tutorPanel);
    hideWidget();
    isWindowOpen = true;
    markUserActivity();
    if (!currentTutorSession?.userId) {
      lockPanel(tutorPanel); // #lockpanel
      ensureAuthPrompt(tutorPanel);
    }
    scheduleSessionPersist(tutorPanel);
    return;
  }

  const tutorPanel = createTutorPanel();
  if (!tutorPanel) {
    console.log("There was an error creating a panel");
    return;
  }
  currentTutorSession = buildFreshSession(tutorPanel, "");
  showTutorPanel(tutorPanel);
  hideWidget();
  isWindowOpen = true;
  markUserActivity();
  scheduleSessionPersist(tutorPanel);
  void loadAuthFromStorage().then((auth) => {
    if (!currentTutorSession) return;
    if (auth?.userId) {
      currentTutorSession.userId = auth.userId;
      return;
    }
    lockPanel(tutorPanel);
    ensureAuthPrompt(tutorPanel);
  });
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
    if (typeof response === "string") {
      history.summary = response;
      //console.log("This is the summary: ", history.summary);
      //console.log("This is the toSummarize: ", history.toSummarize);
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

type StoredAuth = { userId: string; jwt: string };
const AUTH_STORAGE_KEY = "vibetutor-auth";
const SESSION_STORAGE_KEY = "vibetutor-session";
const INACTIVITY_MS = 1 * 60 * 1000; // 57,600,000
// const INACTIVITY_MS = 16 * 60 * 60 * 1000; // 57,600,000
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
  const guideWrappers = panel.querySelectorAll(".guide-wrapper");
  guideMessageCount = guideWrappers.length;
  lastGuideMessageEl =
    guideWrappers.length > 0
      ? (guideWrappers[guideWrappers.length - 1] as HTMLElement)
      : null;
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
    ensureAuthPrompt(panel);
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

function lockPanel(panel: HTMLElement) {
  panel.classList.add("tutor-panel-locked");
  setPanelControlsDisabled(panel, true);
}

function unlockPanel(panel: HTMLElement) {
  panel.classList.remove("tutor-panel-locked");
  setPanelControlsDisabled(panel, false);
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

function ensureAuthPrompt(panel: HTMLElement) {
  if (panel.querySelector(".tutor-panel-auth")) return;

  const authBox = document.createElement("div");
  authBox.className = "tutor-panel-auth";
  authBox.innerHTML = `
    <h4>Login Required</h4>
    <input type="email" class="auth-email" placeholder="you@example.com" />
    <input type="password" class="auth-password" placeholder="password" />
    <button type="button" class="auth-login">Login</button>
  `;
  panel.appendChild(authBox);

  const emailInput = authBox.querySelector<HTMLInputElement>(".auth-email");
  const passwordInput =
    authBox.querySelector<HTMLInputElement>(".auth-password");
  const login = authBox.querySelector<HTMLButtonElement>(".auth-login");
  login?.addEventListener("click", async () => {
    const email = emailInput?.value.trim() ?? "";
    const password = passwordInput?.value.trim() ?? "";
    if (!email || !password) return;
    const resp = await browser.runtime.sendMessage({
      action: "supabase-login",
      payload: { email, password },
    });
    if (resp?.userId && resp?.jwt) {
      const currentUserId = currentTutorSession?.userId ?? "";
      const problemName =
        currentTutorSession?.problem ?? getProblemTitleFromPage();

      if (currentUserId && currentUserId === resp.userId) {
        sessionRestorePending = false;
        unlockPanel(panel);
        authBox.remove();
        scheduleSessionPersist(panel);
        return;
      }

      if (currentUserId && currentUserId !== resp.userId) {
        await saveSessionState(panel, { force: true });
        resetPanelForUser(panel, resp.userId, problemName);
      }

      const stored = await loadSessionState(resp.userId, problemName);
      if (stored && isStoredSessionForUser(stored, resp.userId)) {
        applyStoredSessionToPanel(panel, stored);
        await clearSessionState(resp.userId, stored.state.problem);
        pendingStoredSession = null;
      } else if (stored) {
        await clearSessionState(resp.userId, stored.state.problem);
      }

      if (currentTutorSession) {
        currentTutorSession.userId = resp.userId;
      }
      sessionRestorePending = false;
      unlockPanel(panel);
      authBox.remove();
      scheduleSessionPersist(panel);
    }
  });
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
        </div>
      </div>

      <div class="tutor-panel-content"></div>

      <div class="tutor-panel-inputbar">
        <textarea class="tutor-panel-prompt" placeholder="Ask anything"></textarea>
        <button class="tutor-panel-send">Enter</button>
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

  // For now: position relative to widget (until you load saved position)
  const widget = document.getElementById("tutor-widget");
  if (widget) {
    const rect = widget.getBoundingClientRect();
    panel.style.left =
      Math.max(20, Math.min(rect.left - 320, window.innerWidth - 340)) + "px";
    panel.style.top =
      Math.max(20, Math.min(rect.top, window.innerHeight - 220)) + "px";
  } else {
    panel.style.left = Math.max(20, (window.innerWidth - 300) / 2) + "px";
    panel.style.top = Math.max(20, (window.innerHeight - 200) / 2) + "px";
  }

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
  guideDrainInFlight = true;
  try {
    while (queue.length > 0) {
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
        if (topics && typeof topics === "object") {
          for (const [topic, raw] of Object.entries(
            topics as Record<string, unknown>,
          )) {
            if (!raw || typeof raw !== "object") continue;

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
            currentTutorSession.topics[topic] ??= {
              thoughts_to_remember: [],
              pitfalls: [],
            };

            if (thoughtValues.length > 0) {
              currentTutorSession.topics[topic].thoughts_to_remember.push(
                ...thoughtValues,
              );
            }
            if (pitfallValues.length > 0) {
              currentTutorSession.topics[topic].pitfalls.push(...pitfallValues);
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

async function askAnything(panel: HTMLElement, query: string) {
  //console.log("this is the query asked: ", query);
  const response = await browser.runtime.sendMessage({
    action: "ask-anything",
    payload: {
      sessionId: currentTutorSession?.sessionId ?? "",
      action: "ask-anything",
      rollingHistory: currentTutorSession?.sessionRollingHistory.qaHistory,
      summary: currentTutorSession?.sessionRollingHistory.summary ?? "",
      query: query,
    },
  });
  if (response) {
    appendToContentPanel(panel, "", "assistant", response);
  }
  //console.log("this is the response: ", response);
  if (!response) return "Failure";
  return response;
}

function createTimer() {}
function sendChat() {}
function minimizeWindow() {}

function showTutorPanel(panel: HTMLElement) {
  panel.style.display = "flex";
  panel.classList.add("open");
}

function hideTutorPanel(panel: HTMLElement) {
  panel.classList.remove("open");
  panel.style.display = "none";
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
  return parts
    .map((part, index) =>
      index % 2 === 1 ? `<code>${escapeHtml(part)}</code>` : escapeHtml(part),
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

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
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
  const parts: { type: "text" | "code"; content: string; lang?: string }[] = [];
  const fence = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: message.slice(lastIndex, match.index),
      });
    }
    parts.push({
      type: "code",
      content: match[2] ?? "",
      lang: match[1] ?? "",
    });
    lastIndex = fence.lastIndex;
  }
  if (lastIndex < message.length) {
    parts.push({ type: "text", content: message.slice(lastIndex) });
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
      message.textContent = text.slice(0, index);
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
  const content_area = panel.querySelector<HTMLElement>(".tutor-panel-content");
  if (content_area && typeof llm_response === "string") {
    if (role === "assistant") {
      const message = appendPanelMessage(panel, "", "assistant");
      if (!message) return;
      await typeMessage(message, content_area, llm_response);
      message.innerHTML = renderMarkdown(llm_response);
      currentTutorSession?.sessionRollingHistory.qaHistory.push(
        `Assitant: ${llm_response}`,
      );
      if (currentTutorSession) {
        maybeQueueSummary(currentTutorSession.sessionRollingHistory);
      }
      content_area.scrollTop = message.offsetTop;
      scheduleSessionPersist(panel);
    } else if (role === "guideAssistant") {
      const wrapper = appendPanelMessage(panel, "", "guideAssistant");
      if (!wrapper) return;

      // the bubble is the wrapper's first child
      const bubble = wrapper.querySelector<HTMLElement>(
        ".tutor-panel-message--guideAssistant",
      );
      if (!bubble) return;

      if (guideMessageCount === 0) {
        wrapper.classList.add("guide-start");
      }
      guideMessageCount += 1;
      lastGuideMessageEl = wrapper;

      await typeMessage(bubble, content_area, llm_response);
      bubble.innerHTML = renderMarkdown(llm_response);
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

      await typeMessage(bubble, content_area, llm_response);
      bubble.innerHTML = renderMarkdown(llm_response);

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
    const response_llm = response?.resp;
    if (currentTutorSession && typeof response_llm === "string") {
      currentTutorSession.content.push(`${response_llm}\n`);
    }
    await appendToContentPanel(panel, "", "checkAssistant", response_llm);

    const topics = response?.topics;
    if (topics && typeof topics === "object") {
      for (const [topic, raw] of Object.entries(
        topics as Record<string, unknown>,
      )) {
        if (!raw || typeof raw !== "object") continue;

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
        currentTutorSession.topics[topic] ??= {
          thoughts_to_remember: [],
          pitfalls: [],
        };

        if (thoughtValues.length > 0) {
          currentTutorSession.topics[topic].thoughts_to_remember.push(
            ...thoughtValues,
          );
        }
        if (pitfallValues.length > 0) {
          currentTutorSession.topics[topic].pitfalls.push(...pitfallValues);
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

  const header = panel.querySelector<HTMLElement>(".tutor-panel-shellbar");
  const onMouseMove = (event: MouseEvent) => {
    if (!isPanelDragging) return;
    const nextX = event.clientX - dragOffsetX;
    const nextY = event.clientY - dragOffsetY;
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;

    const clampedX = Math.max(10, Math.min(nextX, maxX));
    const clampedY = Math.max(10, Math.min(nextY, maxY));

    panel.style.left = `${clampedX}px`;
    panel.style.top = `${clampedY}px`;
  };

  const stopDragging = () => {
    if (!isPanelDragging) return;
    isPanelDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDragging);
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
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDragging);
  });
}
