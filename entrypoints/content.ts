export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log(
      "🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."
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

let widget: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let isDragging = false;
let isWindowOpen = false;
let dragOffset = { x: 0, y: 0 };
let lastPosition = { x: 0, y: 0 };
let menuCloseTimeout: number | null = null;
let globalLogo: string; // Global variable for smiley face URL
let globalMouseMoveHandler: ((e: MouseEvent) => void) | null = null;

function initializeWidget() {
  console.log("The widget is being loaded to the page");
  createFloatingWidget();
  loadWidgetPosition();
  setupMessageListener();
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
      backdrop-filter: blur(10px);
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
  width: 320px;
  height: 260px;

  /* Sticky note look */
  background: rgba(255, 251, 147, 0.98);
  border-radius: 14px;
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

.tutor-panel.open {
  opacity: 1;
  transform: scale(0.9) rotate(0deg);
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
  border-radius: 6px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
}
.btn-guide-mode:hover,
.btn-help-mode:hover,
.btn-timer:hover{
  transform: translateY(-1px);
  filter: brightness(0.98);
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-timer:active{
  transform: translateY(0px);
}

/* Content area */
.tutor-panel-content{
  flex: 1;                 /* takes remaining space */
  padding: 12px;
  overflow: auto;

  background: rgba(255, 255, 255, 0.35);
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

  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.14);
  outline: none;

  background: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  line-height: 1.35;
}
.tutor-panel-prompt:focus{
  border-color: rgba(0,0,0,0.22);
  box-shadow: 0 0 0 3px rgba(146, 229, 83, 0.25);
}

/* Send */
.tutor-panel-send{
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(4, 5, 4, 0.92);
  color: rgba(0,0,0,0.85);

  border-radius: 6px;
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
      constrainedX
    );

    // Constrain vertical position
    let constrainedY = Math.max(margin, y);
    constrainedY = Math.min(
      windowHeight - widgetRect.height - margin,
      constrainedY
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
      distanceToBottom
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
        openTutorPanel(); //
      }
    }
  });

  // Close menu when leaving main button area (but not if going to menu)
  // mainButton.addEventListener("mouseleave", (e) => {
  //   if (!isDragging) {
  //     // Check if mouse is moving towards the menu with 50% larger tolerance area
  //     const rect = menu.getBoundingClientRect();
  //     const mouseX = e.clientX;
  //     const mouseY = e.clientY;

  //     // Calculate smaller tolerance area (reduced by 60%)
  //     const tolerance = 24;

  //     // If mouse is within menu bounds or tolerance area, don't close
  //     const isNearMenu =
  //       mouseX >= rect.left - tolerance &&
  //       mouseX <= rect.right + tolerance &&
  //       mouseY >= rect.top - tolerance &&
  //       mouseY <= rect.bottom + tolerance;

  //     if (!isNearMenu) {
  //       menuCloseTimeout = setTimeout(() => {
  //         //closeMenu();
  //         menuCloseTimeout = null;
  //       }, 200); // Increased delay for better UX
  //     }
  //   }
  // });

  function handleMouseMove(e: MouseEvent) {
    const timeDiff = Date.now() - dragStartTime;
    const distance = Math.sqrt(
      Math.pow(e.clientX - startPosition.x, 2) +
        Math.pow(e.clientY - startPosition.y, 2)
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

  // Menu button clicks with debounce
  // let lastClickTime = 0;
  // menu?.addEventListener("click", (e) => {
  //   const target = e.target as HTMLElement;
  //   const action = target.dataset.action;
  //   const now = Date.now();

  //   // Debounce clicks - prevent multiple clicks within 500ms
  //   if (now - lastClickTime < 500) {
  //     return;
  //   }
  //   lastClickTime = now;

  //   if (action) {
  //     console.log("Menu button clicked:", action);
  //     handleMenuAction(action);
  //   }
  // });
}

function openTutorPanel() {
  if (
    currentTutorSession &&
    currentTutorSession.element &&
    document.body.contains(currentTutorSession.element)
  ) {
    showTutorPanel(currentTutorSession.element);
    hideWidget();
    isWindowOpen = true;
    highlightExistingPanel(currentTutorSession.element);
    return;
  }

  const tutorPanel = createTutorPanel();
  if (!tutorPanel) {
    console.log("There was an error creating a panel");
    return;
  }
  currentTutorSession = {
    element: tutorPanel,
    content: "",
    prompt: "",
    position: null,
    size: null,
  };
  showTutorPanel(tutorPanel);
  hideWidget();
  isWindowOpen = true;

  // Auto-focus the textarea when created via shortcut
  setTimeout(() => {
    const textarea = tutorPanel.querySelector(
      ".tutor-panel-prompt"
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length); // Place cursor at end
    }
  }, 100);
}

type TutorSession = {
  element: HTMLElement;
  content: string;
  prompt: string;
  position: PanelPosition | null;
  size: PanelSize | null;
};

let currentTutorSession: TutorSession | null = null;

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
    <div class="tutor-panel-topbar">
      <button class="tutor-panel-close">×</button>
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
  `;

  panel.style.position = "fixed";
  panel.style.zIndex = "1000000";

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
function guideMode() {}
function checkMode() {}
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
      window.innerHeight - widgetHeight - 10
    )
  );

  widget.style.left = `${x}px`;
  widget.style.top = `${y}px`;
  widget.style.right = "auto";
  widget.style.bottom = "auto";
  widget.style.transform = "";
  lastPosition = { x, y };
  saveWidgetPosition();
}

function setupTutorPanelEvents(panel: HTMLElement) {
  const closeButton =
    panel.querySelector<HTMLButtonElement>(".tutor-panel-close");
  closeButton?.addEventListener("click", () => closeTutorPanel());

  const prompt = panel.querySelector<HTMLTextAreaElement>(
    ".tutor-panel-prompt"
  );
  const content = panel.querySelector<HTMLElement>(".tutor-panel-content");

  prompt?.addEventListener("input", () => {
    if (currentTutorSession) {
      currentTutorSession.prompt = prompt.value;
    }
  });

  if (content && currentTutorSession?.content) {
    content.innerHTML = currentTutorSession.content;
  }

  let isPanelDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const header = panel.querySelector<HTMLElement>(".tutor-panel-topbar");
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

// function setupTutorPanelEvents(note: HTMLElement, noteId: string) {
//   const header = note.querySelector(".sticky-note-header") as HTMLElement;
//   const textarea = note.querySelector(
//     ".sticky-note-textarea"
//   ) as HTMLTextAreaElement;
//   const noteTitle = note.querySelector(".note-title") as HTMLElement;
//   const closeBtn = note.querySelector(".close-btn");
//   const minimizeBtn = note.querySelector(".minimize-btn");
//   const pinBtn = note.querySelector(".pin-btn");
//   const resizeHandle = note.querySelector(".note-resize-handle") as HTMLElement;
//   const transparencySlider = note.querySelector(
//     ".transparency-slider"
//   ) as HTMLInputElement;
//   const deleteBtn = note.querySelector(".delete-btn");
//   const fontSizeToggle = note.querySelector(".font-size-toggle") as HTMLElement;
//   const fontSizePopup = note.querySelector(".font-size-popup") as HTMLElement;
//   const increaseFontBtn = note.querySelector(".increase-font") as HTMLElement;
//   const decreaseFontBtn = note.querySelector(".decrease-font") as HTMLElement;
//   const fontSizeInput = note.querySelector(
//     ".font-size-input"
//   ) as HTMLInputElement;
//   const toolbarToggleBtn = note.querySelector(
//     ".toolbar-toggle-btn"
//   ) as HTMLElement;
//   const controlsBottom = note.querySelector(
//     ".note-controls-bottom"
//   ) as HTMLElement;

//   let isDragging = false;
//   let isResizing = false;
//   let dragOffset = { x: 0, y: 0 };
//   let isPinned = false;
//   let isMinimized = false;
//   let currentTransparency = parseFloat(transparencySlider.value);
//   let currentFontSize = parseInt(fontSizeInput.value);
//   let isReadOnly = false;
//   let isNewNote = !note.dataset.noteId;
//   let currentTitle = noteTitle.textContent || "New Note";
//   let noteData = {
//     id: noteId,
//     title: currentTitle,
//     content: textarea.value,
//     fontSize: currentFontSize,
//     transparency: currentTransparency,
//     color: note.style.background,
//     position: { x: 0, y: 0 },
//     size: { width: 280, height: 180 },
//   };

//   // Editable title functionality
//   let isEditingTitle = false;

//   noteTitle.addEventListener("click", () => {
//     if (isEditingTitle) return;

//     isEditingTitle = true;
//     const input = document.createElement("input");
//     input.className = "note-title-input";
//     input.value = noteTitle.textContent || "";
//     input.maxLength = 20;

//     noteTitle.replaceWith(input);
//     input.focus();
//     input.select();

//     function finishEditing() {
//       const newTitle = input.value.trim() || "New Note";
//       currentTitle = newTitle;
//       noteData.title = newTitle;

//       const newSpan = document.createElement("span");
//       newSpan.className = "note-title";
//       newSpan.title = "Click to edit title";
//       newSpan.textContent = newTitle;

//       input.replaceWith(newSpan);
//       isEditingTitle = false;

//       // Re-attach click listener
//       newSpan.addEventListener("click", () =>
//         setupStickyNoteEvents(note, noteId)
//       );
//     }

//     input.addEventListener("blur", finishEditing);
//     input.addEventListener("keydown", (e) => {
//       if (e.key === "Enter") {
//         finishEditing();
//       } else if (e.key === "Escape") {
//         input.value = currentTitle;
//         finishEditing();
//       }
//     });
//   });

//   // Set up initial color scheme based on note background with proper transparency
//   const baseNoteColor = note.style.background || "rgba(255, 251, 147, 0.95)";
//   // Extract RGB values and apply current transparency
//   const rgbMatch = baseNoteColor.match(/rgba?\(([^)]+)\)/);
//   const rgbValues = rgbMatch
//     ? rgbMatch[1].split(",").slice(0, 3).join(",")
//     : "255, 251, 147";

//   const noteColor = `rgba(${rgbValues}, ${currentTransparency})`;
//   const baseColor = `rgba(${rgbValues}, ${currentTransparency * 0.8})`;
//   const lighterColor = `rgba(${rgbValues}, ${currentTransparency * 0.6})`;

//   note.style.background = noteColor;
//   noteData.color = noteColor;
//   note.style.setProperty("--note-bg-80", baseColor);
//   note.style.setProperty("--note-bg-60", lighterColor);
//   note.style.setProperty("--note-opacity", currentTransparency.toString());

//   // Transparency slider functionality
//   transparencySlider.addEventListener("input", () => {
//     currentTransparency = parseFloat(transparencySlider.value);
//     note.style.setProperty("--note-opacity", currentTransparency.toString());

//     // Update background colors to match transparency using RGB values
//     const newBg = `rgba(${rgbValues}, ${currentTransparency})`;
//     const new80Bg = `rgba(${rgbValues}, ${currentTransparency * 0.8})`;
//     const new60Bg = `rgba(${rgbValues}, ${currentTransparency * 0.6})`;

//     note.style.background = newBg;
//     note.style.setProperty("--note-bg-80", new80Bg);
//     note.style.setProperty("--note-bg-60", new60Bg);

//     noteData.transparency = currentTransparency;
//     noteData.color = newBg;
//   });

//   // Dragging functionality
//   header.addEventListener("mousedown", (e) => {
//     if ((e.target as HTMLElement).classList.contains("note-control-btn"))
//       return;

//     isDragging = true;
//     const rect = note.getBoundingClientRect();
//     dragOffset.x = e.clientX - rect.left;
//     dragOffset.y = e.clientY - rect.top;

//     // Add smooth cursor and disable transitions during drag
//     document.body.style.cursor = "grabbing";
//     note.style.transition = "none";
//     note.style.userSelect = "none";

//     document.addEventListener("mousemove", handleDrag);
//     document.addEventListener("mouseup", stopDrag);
//     e.preventDefault();
//   });

//   function handleDrag(e: MouseEvent) {
//     if (!isDragging) return;

//     const newX = e.clientX - dragOffset.x;
//     const newY = e.clientY - dragOffset.y;

//     // Constrain to viewport with padding
//     const padding = 10;
//     const maxX = window.innerWidth - note.offsetWidth - padding;
//     const maxY = window.innerHeight - note.offsetHeight - padding;

//     // Use transform for smoother performance
//     const constrainedX = Math.max(padding, Math.min(maxX, newX));
//     const constrainedY = Math.max(padding, Math.min(maxY, newY));

//     note.style.left = constrainedX + "px";
//     note.style.top = constrainedY + "px";
//   }

//   function stopDrag() {
//     isDragging = false;
//     document.body.style.cursor = "";
//     note.style.transition = "all 0.3s ease";
//     note.style.userSelect = "";

//     document.removeEventListener("mousemove", handleDrag);
//     document.removeEventListener("mouseup", stopDrag);
//   }

//   // Resizing functionality with smooth performance
//   resizeHandle.addEventListener("mousedown", (e) => {
//     isResizing = true;
//     note.style.transition = "none"; // Disable transitions during resize
//     document.body.style.cursor = "nw-resize";
//     document.addEventListener("mousemove", handleResize);
//     document.addEventListener("mouseup", stopResize);
//     e.preventDefault();
//     e.stopPropagation();
//   });

//   function handleResize(e: MouseEvent) {
//     if (!isResizing) return;

//     const rect = note.getBoundingClientRect();
//     const newWidth = Math.max(250, Math.min(600, e.clientX - rect.left));
//     const newHeight = Math.max(180, Math.min(500, e.clientY - rect.top));

//     // Use requestAnimationFrame for smoother resizing
//     requestAnimationFrame(() => {
//       note.style.width = newWidth + "px";
//       note.style.height = newHeight + "px";
//     });
//   }

//   function stopResize() {
//     isResizing = false;
//     document.body.style.cursor = "";
//     note.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"; // Re-enable transitions
//     document.removeEventListener("mousemove", handleResize);
//     document.removeEventListener("mouseup", stopResize);
//   }

//   // Control buttons
//   closeBtn?.addEventListener("click", () => {
//     // Remove from tracking
//     openNotesList.delete(noteId);

//     // Save before closing if there's content and it's a new note
//     if (textarea.value.trim() && !isReadOnly && isNewNote) {
//       saveNoteData();
//     }

//     // Decrement counter for new notes
//     if (isNewNote) {
//       activeNewNotesCount = Math.max(0, activeNewNotesCount - 1);
//     }

//     // Clear session if this is the current note
//     if (currentNoteSession && currentNoteSession.id === noteId) {
//       currentNoteSession = null;
//     }

//     note.classList.remove("open");
//     setTimeout(() => note.remove(), 300);
//   });

//   minimizeBtn?.addEventListener("click", () => {
//     isMinimized = !isMinimized;
//     if (isMinimized) {
//       // Store current size before minimizing
//       noteData.size.width = note.offsetWidth;
//       noteData.size.height = note.offsetHeight;

//       note.classList.add("minimized");
//       note.style.height = "36px"; // Just header height
//       note.style.minHeight = "36px";
//       (minimizeBtn as HTMLElement).textContent = "+";
//       (minimizeBtn as HTMLElement).title = "Restore";
//     } else {
//       note.classList.remove("minimized");
//       // Restore previous size
//       note.style.height = noteData.size.height + "px";
//       note.style.minHeight = "180px";
//       (minimizeBtn as HTMLElement).textContent = "−";
//       (minimizeBtn as HTMLElement).title = "Minimize";
//     }
//   });

//   pinBtn?.addEventListener("click", () => {
//     isPinned = !isPinned;
//     if (isPinned) {
//       note.classList.add("pinned");
//       note.style.zIndex = "999999"; // Higher z-index for pinned notes
//       (pinBtn as HTMLElement).classList.add("pinned");
//       (pinBtn as HTMLElement).title = "Unpin note";
//     } else {
//       note.classList.remove("pinned");
//       note.style.zIndex = "999997"; // Normal z-index
//       (pinBtn as HTMLElement).classList.remove("pinned");
//       (pinBtn as HTMLElement).title = "Pin note (always on top)";
//     }
//   });

//   // Font size controls
//   fontSizeToggle?.addEventListener("click", (e) => {
//     e.stopPropagation();
//     fontSizePopup.classList.toggle("active");
//   });

//   // Close font popup when clicking outside
//   document.addEventListener("click", (e) => {
//     if (
//       !fontSizePopup.contains(e.target as Node) &&
//       !fontSizeToggle.contains(e.target as Node)
//     ) {
//       fontSizePopup.classList.remove("active");
//     }
//   });

//   function updateFontSize(newSize: number) {
//     if (newSize >= 8 && newSize <= 24) {
//       currentFontSize = newSize;
//       textarea.style.fontSize = currentFontSize + "px";
//       fontSizeInput.value = currentFontSize.toString();
//       noteData.fontSize = currentFontSize;
//     }
//   }

//   increaseFontBtn?.addEventListener("click", () => {
//     updateFontSize(currentFontSize + 1);
//   });

//   decreaseFontBtn?.addEventListener("click", () => {
//     updateFontSize(currentFontSize - 1);
//   });

//   // Direct font size input
//   fontSizeInput?.addEventListener("input", () => {
//     const newSize = parseInt(fontSizeInput.value);
//     if (!isNaN(newSize)) {
//       updateFontSize(newSize);
//     }
//   });

//   fontSizeInput?.addEventListener("blur", () => {
//     // Ensure valid range on blur
//     const currentVal = parseInt(fontSizeInput.value);
//     if (isNaN(currentVal) || currentVal < 8) {
//       updateFontSize(8);
//     } else if (currentVal > 24) {
//       updateFontSize(24);
//     }
//   });

//   // Toolbar toggle functionality
//   let isToolbarHidden = false;
//   toolbarToggleBtn?.addEventListener("click", (e) => {
//     e.stopPropagation();
//     isToolbarHidden = !isToolbarHidden;
//     if (isToolbarHidden) {
//       controlsBottom.classList.add("collapsed");
//       toolbarToggleBtn.innerHTML = "&gt;";
//       toolbarToggleBtn.title = "Show toolbar";
//     } else {
//       controlsBottom.classList.remove("collapsed");
//       toolbarToggleBtn.innerHTML = "&lt;";
//       toolbarToggleBtn.title = "Hide toolbar";
//     }
//   });

//   // Delete button
//   deleteBtn?.addEventListener("click", async () => {
//     if (confirm("Delete this note?")) {
//       // Remove from tracking
//       openNotesList.delete(noteId);

//       // Decrement counter for new notes
//       if (isNewNote) {
//         activeNewNotesCount = Math.max(0, activeNewNotesCount - 1);
//       }

//       // Clear session if this is the current note
//       if (currentNoteSession && currentNoteSession.id === noteId) {
//         currentNoteSession = null;
//       }

//       // Delete from storage if it's a saved note
//       if (!isNewNote) {
//         await deleteNote(noteId);
//       }

//       note.classList.remove("open");
//       setTimeout(() => note.remove(), 200);
//     }
//   });

//   // Toolbar toggle functionality
//   toolbarToggleBtn?.addEventListener("click", () => {
//     const toolbar = note.querySelector(".note-toolbar") as HTMLElement;
//     const isCollapsed = toolbar.classList.contains("collapsed");

//     if (isCollapsed) {
//       toolbar.classList.remove("collapsed");
//       toolbarToggleBtn.textContent = "‹";
//       toolbarToggleBtn.title = "Hide toolbar";
//     } else {
//       toolbar.classList.add("collapsed");
//       toolbarToggleBtn.textContent = "›";
//       toolbarToggleBtn.title = "Show toolbar";
//     }
//   });

//   // Minimize functionality - fold into header
//   minimizeBtn?.addEventListener("click", () => {
//     const minBtn = minimizeBtn as HTMLButtonElement;
//     if (isMinimized) {
//       // Restore
//       note.style.height = noteData.size.height + "px";
//       textarea.style.display = "block";
//       controlsBottom.style.display = "block";
//       resizeHandle.style.display = "block";
//       minBtn.textContent = "−";
//       minBtn.title = "Minimize";
//       isMinimized = false;
//     } else {
//       // Minimize to header only
//       noteData.size = { width: note.offsetWidth, height: note.offsetHeight };
//       note.style.height = "36px";
//       textarea.style.display = "none";
//       controlsBottom.style.display = "none";
//       resizeHandle.style.display = "none";
//       minBtn.textContent = "+";
//       minBtn.title = "Restore";
//       isMinimized = true;
//     }
//   });

//   // Lock button for existing notes
//   const lockBtn = note.querySelector(".lock-btn") as HTMLButtonElement;
//   if (lockBtn) {
//     lockBtn.addEventListener("click", () => {
//       if (isReadOnly) {
//         textarea.readOnly = false;
//         textarea.style.cursor = "text";
//         lockBtn.textContent = "⚪";
//         lockBtn.title = "Lock Note";
//         isReadOnly = false;
//       } else {
//         textarea.readOnly = true;
//         textarea.style.cursor = "default";
//         lockBtn.textContent = "⚫";
//         lockBtn.title = "Unlock Note";
//         isReadOnly = true;
//       }
//     });
//   }

//   // Highlight effect when opening existing note
//   if (!isNewNote) {
//     note.style.border = "3px solid rgba(255, 255, 255, 0.8)";
//     note.style.transform = "scale(1.05)";
//     setTimeout(() => {
//       note.style.border = "";
//       note.style.transform = "";
//     }, 800);
//   }

//   // Improved auto-save functionality to prevent duplicate notes
//   let saveTimeout: NodeJS.Timeout;
//   let lastSavedContent = textarea.value;

//   function saveNoteData() {
//     const currentContent = textarea.value.trim();
//     noteData.content = currentContent;

//     // Update position and size
//     const rect = note.getBoundingClientRect();
//     noteData.position = { x: rect.left, y: rect.top };
//     noteData.size = { width: note.offsetWidth, height: note.offsetHeight };

//     if (isNewNote && currentContent) {
//       // For new notes, save for the first time
//       saveCompleteNote(noteData);
//       isNewNote = false;
//       note.dataset.noteId = noteData.id;
//     } else if (!isNewNote && currentContent !== lastSavedContent) {
//       // For existing notes, update only if content changed
//       updateCompleteNote(noteData);
//     }

//     lastSavedContent = currentContent;
//   }

//   textarea.addEventListener("input", () => {
//     if (!isReadOnly) {
//       clearTimeout(saveTimeout);
//       saveTimeout = setTimeout(saveNoteData, 2000); // Increased timeout to reduce saves
//     }
//   });

//   // Save when note is closed or minimized
//   const saveOnClose = () => {
//     if (textarea.value.trim() && !isReadOnly) {
//       saveNoteData();
//     }
//   };

//   // Save when closing or losing focus
//   note.addEventListener("blur", saveOnClose);
//   window.addEventListener("beforeunload", saveOnClose);
// }
