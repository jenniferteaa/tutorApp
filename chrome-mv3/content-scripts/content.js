var content=(function(){"use strict";function Jt(e){return e}const x=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,gt={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{_e()}):_e()}};let f=null,$=!1,L=!1,V={x:0,y:0},I={x:0,y:0},K,q=null,Q=!1,B=[];function _e(){console.log("The widget is being loaded to the page"),mt(),_t(),Pt(),Ht(),It(),Je().then(()=>{T?.panelOpen&&ye()}),window.addEventListener("beforeunload",()=>{_(i?.element??null)})}function mt(){const e=document.getElementById("tutor-widget");e&&e.remove(),f=document.createElement("div"),f.id="tutor-widget",f.innerHTML=`
  <div class="widget-main-button" id="main-button">
  </div>
  `;const t=document.createElement("style");t.textContent=`
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

`,document.head.appendChild(t),document.body.appendChild(f),ht()}function ft(e){const t=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!t)return e;const n=t[1].trim(),r=t[2].trim().split(";").map(a=>a.trim()).filter(Boolean);if(r.length===0)return e;const s=r.map(a=>`- ${a.replace(/\.$/,"")}`).join(`
`);return`${n}

**To fix**
${s}`}function ht(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},o=!1,r=!1;function s(c,d){if(!f)return{x:c,y:d};const u={width:50,height:50},h=window.innerWidth,k=window.innerHeight,m=10;let y=Math.max(m,c);y=Math.min(h-u.width-m,y);let v=Math.max(m,d);return v=Math.min(k-u.height-m,v),{x:y,y:v}}function a(c,d){if(!f)return{x:c,y:d};const u={width:50,height:50},h=window.innerWidth,k=window.innerHeight,m=20,y=c,v=h-(c+u.width),C=d,g=k-(d+u.height),w=Math.min(y,v,C,g);let S=c,E=d;return(c<0||c+u.width>h||d<0||d+u.height>k)&&(w===y?S=m:w===v?S=h-u.width-m:w===C?E=m:w===g&&(E=k-u.height-m)),{x:S,y:E}}e.addEventListener("mousedown",c=>{c.preventDefault(),t=Date.now(),n={x:c.clientX,y:c.clientY},o=!1;const d=f.getBoundingClientRect();V.x=c.clientX-d.left,V.y=c.clientY-d.top,e.classList.add("dragging"),document.addEventListener("mousemove",p),document.addEventListener("mouseup",l)}),e.addEventListener("click",c=>{if(r){r=!1;return}!$&&!o&&(c.preventDefault(),c.stopPropagation(),L?rt():ye())});function p(c){const d=Date.now()-t,u=Math.sqrt(Math.pow(c.clientX-n.x,2)+Math.pow(c.clientY-n.y,2));if(!$&&(u>3||d>100)&&($=!0,o=!0,document.body.style.cursor="grabbing"),$){const h=c.clientX-V.x,k=c.clientY-V.y,m=s(h,k);f.style.transform=`translate(${m.x}px, ${m.y}px)`,f.style.left="0",f.style.top="0",I={x:m.x,y:m.y}}}function l(){if(document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",l),e&&e.classList.remove("dragging"),document.body.style.cursor="",$){r=!0;const c=a(I.x,I.y);c.x!==I.x||c.y!==I.y?(f.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",f.style.left=c.x+"px",f.style.top=c.y+"px",f.style.transform="",setTimeout(()=>{f&&(f.style.transition="")},15e3),I=c):(f.style.left=I.x+"px",f.style.top=I.y+"px",f.style.transform=""),st()}$=!1,o=!1}}function Z(e){try{const{origin:t,pathname:n}=new URL(e),o=n.match(/^\/problems\/[^/]+/);return o?`${t}${o[0]}`:`${t}${n}`}catch{return e}}function J(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Fe(e){const t=e.match(/^\s*(\d+)/);if(!t)return null;const n=Number(t[1]);return Number.isFinite(n)?n:null}function ge(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}const bt=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Probability and Statistics","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Strongly Connected Component","Eulerian Circuit","Radix Sort","Rejection Sampling","Biconnected Component"];function Oe(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const me=new Map(bt.map(e=>[Oe(e),e]));function yt(e){return e.split(" ").filter(Boolean).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function fe(e){const t=Oe(e);if(!t)return e.trim();const n=me.get(t);if(n)return n;const o=t.split(" ");if(o.length>0){const r=o[o.length-1];if(r.endsWith("s")){o[o.length-1]=r.slice(0,-1);const s=o.join(" "),a=me.get(s);if(a)return a}else{o[o.length-1]=`${r}s`;const s=o.join(" "),a=me.get(s);if(a)return a}}return yt(t)}function De(e,t){const n=fe(t),o=Object.keys(e.topics).find(r=>fe(r)===n);return o&&o!==n&&(e.topics[n]=e.topics[o],delete e.topics[o]),e.topics[n]??={thoughts_to_remember:[],pitfalls:[]},n}function he(e,t){return`${Ye}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function xt(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(n=>n.getAttribute("href")).filter(n=>!!n).map(n=>n.replace("/tag/","").replace("/","")).map(n=>fe(n));return Object.fromEntries(Array.from(new Set(t)).map(n=>[n,{thoughts_to_remember:[],pitfalls:[]}]))}function ee(){const e=document.querySelector("#editor");if(!e)return"";const t=e.querySelector('button[aria-haspopup="dialog"]');return t?Array.from(t.childNodes).find(o=>o.nodeType===Node.TEXT_NODE&&o.textContent?.trim())?.textContent?.trim()??t.textContent?.trim()??"":""}const wt='#editor button[aria-haspopup="dialog"]';let te=null,We=null;function H(){if(!i)return;const e=ee();e&&i.language!==e&&(i.language=e,b(i.element??null))}function be(){const e=document.querySelector(wt);if(e){if(e.dataset.tutorLangListener||(e.dataset.tutorLangListener="true",e.addEventListener("click",()=>{window.setTimeout(H,50)},{passive:!0})),We===e&&te){H();return}te?.disconnect(),We=e,te=new MutationObserver(()=>{H()}),te.observe(e,{childList:!0,characterData:!0,subtree:!0}),H()}}function Ue(e,t,n){const o=n??J(),r=crypto.randomUUID();return{element:e,sessionId:r,userId:t,problem:o,problemUrl:Z(window.location.href),language:ee(),topics:xt(),content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function ye(){const e=await Te(),t=Mt(e),n=e?.userId??"";if(t&&await Ke(),i&&i.element&&document.body.contains(i.element)){be(),H(),se(i.element),oe(),L=!0,i.element,(!n||t)&&(F(i.element),G(i.element,t?"session expired, please log back in":void 0)),W(),b(i.element);return}if(i?.userId){Rt();try{await _(i.element??null,{force:!0})}finally{$t()}}if(!T&&n){const r=await Le(n,J());r&&Ie(r,n)&&(T=r)}if(T){const r=ot();Ze(r,T),T=null,be(),H(),se(r),oe(),L=!0,W(),(!n||t)&&(F(r),G(r,t?"session expired, please log back in":void 0)),b(r);return}const o=ot();if(!o){console.log("There was an error creating a panel");return}i=Ue(o,n),be(),se(o),oe(),L=!0,W(),b(o),i&&(!n||t?(F(o),G(o,t?"session expired, please log back in":void 0)):i.userId=n,setTimeout(()=>{const r=o.querySelector(".tutor-panel-prompt");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},100))}let xe=!1;async function vt(e){if(xe||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);xe=!0;try{const n=await x.runtime.sendMessage({action:"summarize-history",payload:{sessionId:i?.sessionId??"",summarize:t,summary:e.summary}});if(U(i?.element??null,n,{silent:!0}))return;const o=typeof n=="string"?n:n?.reply;typeof o=="string"&&(e.summary=o)}finally{xe=!1}}function Ge(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),vt(e)}let i=null;const we="vibetutor-auth",Ye="vibetutor-session",St="http://localhost:3000/auth/bridge",kt=960*60*1e3,Et=15e3,je=1440*60*1e3,Tt=1800*1e3,Lt=`${Ye}:`;let T=null,ne=Date.now(),Xe=0,D=!1,ve=null,Se=null,ke=null,Ve=Z(window.location.href),Ee=null;async function Te(){return(await x.storage.local.get(we))[we]??null}function Mt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Ke(){await x.storage.local.remove(we),await x.runtime.sendMessage({action:"clear-auth"})}async function _(e,t){if(!i||!i.userId||D&&!t?.force)return;const n=e?.querySelector(".tutor-panel-content")??i.element?.querySelector(".tutor-panel-content"),o=he(i.userId,i.problem),r={state:{sessionId:i.sessionId,userId:i.userId,content:i.content,language:i.language,problem:i.problem,problemUrl:i.problemUrl,topics:i.topics,prompt:i.prompt,position:i.position,size:i.size,guideModeEnabled:i.guideModeEnabled,checkModeEnabled:i.checkModeEnabled,timerEnabled:i.timerEnabled,rollingStateGuideMode:i.rollingStateGuideMode,sessionRollingHistory:i.sessionRollingHistory},panelOpen:L,contentHtml:n?.innerHTML??"",lastActivityAt:ne};await x.storage.local.set({[o]:r})}function b(e){D||ve||(ve=window.setTimeout(()=>{ve=null,_(e)},500))}async function Le(e,t){const n=he(e,t),r=(await x.storage.local.get(n))[n]??null;return r?Date.now()-(r.lastActivityAt??0)>je?(await x.storage.local.remove(n),null):r:null}async function Me(e,t){const n=he(e,t);await x.storage.local.remove(n)}async function Qe(){const e=await x.storage.local.get(null),t=Date.now(),n=[];for(const[o,r]of Object.entries(e)){if(!o.startsWith(Lt))continue;const a=r?.lastActivityAt??0;t-a>je&&n.push(o)}n.length>0&&await x.storage.local.remove(n)}function It(){Qe(),Ee&&window.clearInterval(Ee),Ee=window.setInterval(()=>{Qe()},Tt)}function Ie(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const n=Z(window.location.href);return e.state.problemUrl===n}function Ze(e,t){i={...t.state,element:e},i&&!i.language&&(i.language=ee());const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML=t.contentHtml||"");const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=i.prompt??""),i.position&&(e.style.left=`${i.position.x}px`,e.style.top=`${i.position.y}px`),i.size&&(e.style.width=`${i.size.width}px`,e.style.height=`${i.size.height}px`);const r=e.querySelector(".guide-wrapper.guide-slab");if(r)O=r.querySelectorAll(".guide-item").length,z=r;else{const s=e.querySelectorAll(".guide-wrapper");O=s.length,z=s.length>0?s[s.length-1]:null}}function At(e,t,n){Ae();const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML="");const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=""),i=Ue(e,t,n)}async function Je(){const e=await Te();if(!e?.userId){T=null;return}const t=await Le(e.userId,J());if(!t){T=null;return}if(!Ie(t,e.userId)){await Me(e.userId,t.state.problem),T=null;return}T=t,ne=t.lastActivityAt??Date.now()}function W(){ne=Date.now(),Date.now()-Xe>Et&&(Xe=Date.now(),b())}async function Ct(){if(i?.element&&(await _(i.element,{force:!0}),D=!0),await Ke(),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),i?.element){const e=i.element;ze(),e.classList.remove("guidemode-active","checkmode-active"),F(e),G(e,"session expired, please log back in")}}function Pt(){const e=()=>W(),t=["mousemove","keydown","click","scroll","input"];for(const n of t)document.addEventListener(n,e,{passive:!0});Se&&window.clearInterval(Se),Se=window.setInterval(async()=>{Date.now()-ne<kt||!(await Te())?.userId||await Ct()},6e4)}function Ae(){N=null,Y=!1,M=new Set,Ce=0,re=!1,j=null,Pe=null,qe=0,O=0,z=null}function qt(e){B=[],K=!1,Ae(),ze(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(t=>{t.remove()}),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1,i.timerEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function F(e){e.classList.add("tutor-panel-locked"),ce(e,!0)}function et(e){e.classList.remove("tutor-panel-locked"),ce(e,!1)}const tt="session expired, please log back in";function Nt(e){return typeof e=="object"&&e!==null&&e.success===!1}function zt(e){const t=e.querySelector(".tutor-panel-content");if(!t)return;t.querySelectorAll(".tutor-panel-message--assistant").forEach(o=>{o.textContent?.trim()===tt&&o.remove()})}function nt(e,t){const n=e.querySelector(".tutor-panel-content");if(!n)return;const o=le(e,t,"assistant");o&&(n.scrollTop=o.offsetTop,b(e))}function U(e,t,n){if(!Nt(t))return!1;if(n?.silent)return!0;const o=e??i?.element??null;if(!o)return!0;if(t.unauthorized||t.status===401||t.status===403||t.error&&/unauthorized/i.test(t.error))return F(o),G(o,tt),L||(se(o),oe(),L=!0,W(),b(o)),zt(o),!0;if(t.timeout)return nt(o,n?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const r=n?.serverMessage??"Internal server error. Please try again in a moment.";return n?.lockOnServerError===!0&&F(o),nt(o,r),!0}function Rt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function $t(){document.getElementById("tutor-panel-loading")?.remove()}async function Bt(e){i?.userId&&i.element&&await _(i.element,{force:!0}),T=null,Ae();const t=L;i?.element&&i.element.remove(),i=null,L=!1,it(),await Je(),t&&ye()}function Ht(){ke&&window.clearInterval(ke),ke=window.setInterval(()=>{const e=Z(window.location.href);e!==Ve&&(Ve=e,Bt())},1e3)}function G(e,t){const n=e.querySelector(".tutor-panel-auth");if(n){if(t){const l=n.querySelector(".auth-error");l&&(l.textContent=t,l.style.display="block")}return}Q=!0,qt(e);const o=document.createElement("div");o.className="tutor-panel-auth",e.appendChild(o);const r=(l,c)=>{if(!l||!c)return;const d=()=>{const u=l.type==="password";c.setAttribute("aria-label",u?"Show password":"Hide password")};c.addEventListener("click",()=>{l.type=l.type==="password"?"text":"password",d(),l.focus(),l.setSelectionRange(l.value.length,l.value.length)}),d()},s=async l=>{const c=i?.userId??"",d=i?.problem??J();if(Q=!1,c&&c===l){D=!1,et(e),o.remove(),b(e);return}c&&c!==l&&(await _(e,{force:!0}),At(e,l,d));const u=await Le(l,d);u&&Ie(u,l)?(Ze(e,u),await Me(l,u.state.problem),T=null):u&&await Me(l,u.state.problem),i&&(i.userId=l),D=!1,et(e),o.remove(),b(e)},a=l=>{o.innerHTML=`
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
    `;const c=o.querySelector(".auth-email"),d=o.querySelector(".auth-password"),u=o.querySelector(".auth-login"),h=o.querySelector(".auth-signup"),k=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error");l&&m&&(m.textContent=l,m.style.display="block");const y=()=>{m&&(m.style.display="none")};c?.addEventListener("input",y),d?.addEventListener("input",y),r(d,k),u?.addEventListener("click",async()=>{const v=c?.value.trim()??"",C=d?.value.trim()??"";if(!v||!C)return;const g=await x.runtime.sendMessage({action:"supabase-login",payload:{email:v,password:C}});if(g?.success===!1){m&&(m.textContent=g.error||"Internal server error",m.style.display="block");return}g?.userId&&g?.jwt?await s(g.userId):m&&(m.textContent="Invalid creds",m.style.display="block")}),h?.addEventListener("click",()=>{p()})},p=()=>{o.innerHTML=`
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
    `;const l=o.querySelector(".auth-first-name"),c=o.querySelector(".auth-last-name"),d=o.querySelector(".auth-email"),u=o.querySelector(".auth-password"),h=o.querySelector(".auth-signup-submit"),k=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error"),y=o.querySelector(".auth-password-hint"),v=()=>{m&&(m.style.display="none")};l?.addEventListener("input",v),c?.addEventListener("input",v),d?.addEventListener("input",v),u?.addEventListener("input",v),r(u,k),u?.addEventListener("blur",()=>{if(!y||!u)return;const g=u.value.trim();g&&!ge(g)?(y.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",y.style.display="block"):y.style.display="none"}),u?.addEventListener("input",()=>{if(!y||!u)return;const g=u.value.trim();g&&ge(g)&&(y.style.display="none")}),h?.addEventListener("click",async()=>{const g=l?.value.trim()??"",w=c?.value.trim()??"",S=d?.value.trim()??"",E=u?.value.trim()??"";if(!g||!w||!S||!E)return;if(!ge(E)){y&&(y.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",y.style.display="block");return}const P=await x.runtime.sendMessage({action:"supabase-signup",payload:{fname:g,lname:w,email:S,password:E}});if(P?.success===!1){m&&(m.textContent=P.error||"Internal server error",m.style.display="block");return}P?.requiresVerification?a("Waiting for verification, check email"):P?.userId&&P?.jwt?await s(P.userId):m&&(m.style.display="block")}),o.querySelector(".auth-back")?.addEventListener("click",()=>{a()})};a(t)}function ot(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const t=40,n=Math.round(window.innerHeight*.38),o=window.innerWidth-e.offsetWidth-20,r=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(t,o))}px`,e.style.top=`${Math.max(20,Math.min(n,r))}px`,setTimeout(()=>e.classList.add("open"),10),Vt(e),e}function rt(){i?.element&&(Ut(i.element),Gt(i.element),it(),L=!1,b(i.element))}function tn(e){}function oe(){f&&(f.style.display="none")}function it(){f&&(f.style.display="block")}async function st(){}async function _t(){}let N=null,Y=!1,M=new Set,Ce=0,re=!1,j=null,Pe=null,qe=0,O=0,z=null;function X(){return document.querySelector(".monaco-editor textarea.inputarea")}function at(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function ie(){M.clear(),Y=!1,N!==null&&(window.clearTimeout(N),N=null)}async function Ne(e){const t=Yt(),o=X()?.value??"",r=Array.from(M)[0]??1;if(!r){ie();return}const s=Date.now();if(Pe===r&&s-qe<250)return;if(Pe=r,qe=s,!t){ie();return}let a="";if(o&&(a=lt(o,r)),!a.trim()&&r>1&&o){const l=lt(o,r-1);l.trim()&&(a=l)}let p=t;try{const l=await x.runtime.sendMessage({type:"GET_MONACO_CODE"});l?.ok&&typeof l.code=="string"&&(p=l.code)}catch{}Ft(a)&&(B.push([p,a]),Ot()),ie()}function Ft(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function lt(e,t){return e.split(`
`)[t-1]??""}async function Ot(){if(!re){if(Q){B=[];return}re=!0;try{for(;B.length>0;){if(Q){B=[];break}const[e,t]=B.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),K=!0;const n=await x.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:e,focusLine:t,rollingStateGuideMode:i?.rollingStateGuideMode}});if(U(i?.element??null,n,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){K=!1;continue}if(!n)console.log("failure for guide mode");else{const o=n.success?n.reply:null;o?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const r=o?.nudge;i&&typeof r=="string"&&(i.content.push(`${r}
`),i.element!=null&&await $e(i.element,"","guideAssistant",r),b(i.element??null));const s=o?.topics;if(s&&typeof s=="object"&&i)for(const[a,p]of Object.entries(s)){if(!p||typeof p!="object")continue;const l=De(i,a),c=p.thoughts_to_remember,d=p.pitfalls,u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],h=Array.isArray(d)?d:typeof d=="string"&&d.trim()?[d.trim()]:[];i&&(u.length>0&&i.topics[l].thoughts_to_remember.push(...u),h.length>0&&i.topics[l].pitfalls.push(...h))}i?.element&&b(i.element),K=!1}}}finally{re=!1}}}function ct(){if(!i?.guideModeEnabled)return;const e=X();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=at(t,n);!M.has(o)&&M.size==0&&M.add(o),Y||(Y=!0),N!==null&&window.clearTimeout(N),N=window.setTimeout(()=>{Ne()},1e4),!M.has(o)&&M.size==1&&Ne()}function ut(){if(!i?.guideModeEnabled||!Y)return;const e=X();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=at(t,n);if(j===null){j=o;return}o!==j&&(j=o,!M.has(o)&&M.size==1&&Ne())}function dt(){const e=X();if(!e){Ce<5&&(Ce+=1,window.setTimeout(dt,500));return}e.addEventListener("input",ct),document.addEventListener("selectionchange",ut)}function ze(){const e=X();e&&(e.removeEventListener("input",ct),document.removeEventListener("selectionchange",ut))}function nn(){}function Dt(e){const t=e.querySelector(".tutor-panel-content");if(!t)return null;const n=document.createElement("div");n.className="tutor-panel-assistant-loading";const o=document.createElement("div");return o.className="tutor-panel-assistant-loading-dot",n.appendChild(o),t.appendChild(n),t.scrollTop=n.offsetTop,n}async function Wt(e,t){const n=Dt(e),o=i?.language||ee(),r=await x.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",action:"ask-anything",rollingHistory:i?.sessionRollingHistory.qaHistory,summary:i?.sessionRollingHistory.summary??"",query:t,language:o}});if(U(e,r,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return n?.remove(),"Failure";const s=typeof r=="string"?r:r?.reply;return typeof s=="string"&&s.trim()&&(n?.remove(),$e(e,"","assistant",s)),n?.remove(),s||"Failure"}function se(e){q!==null&&(window.clearTimeout(q),q=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Ut(e){e.classList.remove("open"),e.classList.add("closing"),q!==null&&window.clearTimeout(q),q=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),q=null},180)}function Gt(e){if(!f)return;const t=e.getBoundingClientRect(),n=f.getBoundingClientRect(),o=n.width||50,r=n.height||50,p=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,l=Math.max(10,Math.min(window.innerHeight/2-r/2,window.innerHeight-r-10));f.style.left=`${p}px`,f.style.top=`${l}px`,f.style.right="auto",f.style.bottom="auto",f.style.transform="",I={x:p,y:l},st()}function Yt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function R(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ae(e){const t=e.split("`"),n=o=>{const r=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,p;for(;(p=r.exec(o))!==null;){s+=R(o.slice(a,p.index));const l=p[1];l.startsWith("**")?s+=`<strong>${R(l.slice(2,-2))}</strong>`:s+=`<code>${R(l.slice(1,-1))}</code>`,a=r.lastIndex}return s+=R(o.slice(a)),s};return t.map((o,r)=>r%2===1?`<code>${R(o)}</code>`:n(o)).join("")}function jt(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",o=[],r=null;const s=()=>{o.length!==0&&(n+=`<p>${ae(o.join(" "))}</p>`,o=[])},a=()=>{r&&(n+=`</${r}>`,r=null)};for(const p of t){const l=p.trim();if(!l){s(),a();continue}const c=l.match(/^(#{1,3})\s+(.*)$/);if(c){s(),a();const h=c[1].length;n+=`<h${h}>${ae(c[2])}</h${h}>`;continue}const d=l.match(/^(\d+)[.)]\s+(.*)$/);if(d){s(),r&&r!=="ol"&&a(),r||(r="ol",n+="<ol>"),n+=`<li>${ae(d[2])}</li>`;continue}const u=l.match(/^[-*]\s+(.*)$/);if(u){s(),r&&r!=="ul"&&a(),r||(r="ul",n+="<ul>"),n+=`<li>${ae(u[1])}</li>`;continue}o.push(l)}return s(),a(),n}function A(e){const t=e.replace(/\r\n/g,`
`),n=[],o=/```(\w+)?\r?\n([\s\S]*?)```/g;let r=0,s;for(;(s=o.exec(t))!==null;)s.index>r&&n.push({type:"text",content:t.slice(r,s.index)}),n.push({type:"code",content:s[2]??"",lang:s[1]??""}),r=o.lastIndex;return r<t.length&&n.push({type:"text",content:t.slice(r)}),n.map(a=>a.type==="code"?`<pre><code${a.lang?` data-lang="${R(a.lang)}"`:""}>${R(a.content.trimEnd())}</code></pre>`:jt(a.content)).join("")}function le(e,t,n){const o=e.querySelector(".tutor-panel-content");if(!o)return null;const r=document.createElement("div");if(n==="assistant")r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=A(t);else if(n==="user")r.className="tutor-panel-message tutor-panel-message--user",r.textContent=t;else if(n==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=A(t),s.appendChild(r),o.appendChild(s),s}else if(n==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=A(t),s.appendChild(r),o.appendChild(s),s}else r.textContent=t;return o.append(r),o.scrollTop=r.offsetTop,r}function pt(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of n){const r=e.querySelector(o);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function ce(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of n){const r=e.querySelector(o);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function Re(e,t,n,o){return new Promise(r=>{let s=0;const a=2,p=e.offsetTop;t.scrollTop=p;let l=!0;const c=()=>{Math.abs(t.scrollTop-p)>8&&(l=!1)};t.addEventListener("scroll",c,{passive:!0});const d=()=>{s=Math.min(n.length,s+a);const u=n.slice(0,s);o?.render?e.innerHTML=o.render(u):e.textContent=u,l&&(t.scrollTop=p),s<n.length?window.setTimeout(d,12):(t.removeEventListener("scroll",c),r())};d()})}async function $e(e,t,n,o){const r=ft(o),s=e.querySelector(".tutor-panel-content");if(s&&typeof o=="string"){if(n==="assistant"){const a=le(e,"","assistant");if(!a)return;await Re(a,s,r,{render:A}),a.innerHTML=A(r),i?.sessionRollingHistory.qaHistory.push(`Assitant: ${o}`),i&&Ge(i.sessionRollingHistory),s.scrollTop=a.offsetTop,b(e)}else if(n==="guideAssistant"){let a=s.querySelector(".guide-wrapper.guide-slab");if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const c=document.createElement("ul");c.className="guide-list",a.appendChild(c),s.appendChild(a)}const p=a.querySelector(".guide-list")??document.createElement("ul");p.classList.contains("guide-list")||(p.className="guide-list",a.appendChild(p));const l=document.createElement("li");l.className="guide-item",p.appendChild(l),O===0&&a.classList.add("guide-start"),O+=1,z=a,await Re(l,s,r,{render:A}),l.innerHTML=A(r),s.scrollTop=a.offsetTop,b(e)}else if(n==="checkAssistant"){const a=le(e,"","checkAssistant");if(!a)return;const p=a.querySelector(".tutor-panel-message--checkAssistant");if(!p)return;a.classList.add("check-start"),await Re(p,s,r,{render:A}),p.innerHTML=A(r),a.classList.add("check-end"),s.scrollTop=a.offsetTop,b(e)}}}async function Xt(e,t){try{const n=await x.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:t,action:"check-code",problem_no:Fe(i?.problem??""),problem_name:i?.problem??"",problem_url:i?.problemUrl??""}});if(U(e,n,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const o=n?.resp;i&&typeof o=="string"&&i.content.push(`${o}
`),typeof o=="string"&&o.trim()&&await $e(e,"","checkAssistant",o);const r=n?.topics;if(r&&typeof r=="object"&&i)for(const[s,a]of Object.entries(r)){if(!a||typeof a!="object")continue;const p=De(i,s),l=a.thoughts_to_remember,c=a.pitfalls,d=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[],u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];i&&(d.length>0&&i.topics[p].thoughts_to_remember.push(...d),u.length>0&&i.topics[p].pitfalls.push(...u))}return console.log("this is the object now: ",i?.topics),b(e),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Vt(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode"),o=e.querySelector(".btn-guide-mode"),r=e.querySelector(".btn-gotToWorkspace");o?.addEventListener("click",()=>{if(!i)return;i.guideModeEnabled=!i.guideModeEnabled;const g=e.querySelector(".btn-guide-mode");if(i.userId){const w=i.problem,S=Fe(w);x.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:i.guideModeEnabled,sessionId:i.sessionId,problem_no:S,problem_name:w,problem_url:i.problemUrl}})}pt(e,!0),e.classList.add("guidemode-active"),i.guideModeEnabled?(g?.classList.add("is-loading"),O=0,z=null,dt()):(ze(),z&&z.classList.add("guide-end"),pt(e,!1),e.classList.remove("guidemode-active"),g?.classList.remove("is-loading")),b(e)}),r?.addEventListener("click",async()=>{const g=await x.runtime.sendMessage({action:"go-to-workspace",payload:{url:St}});U(e,g,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const s=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const g=i.prompt;s&&(s.value=""),i&&(i.prompt=""),le(e,g,"user"),i.sessionRollingHistory.qaHistory.push(`user: ${g}`),Ge(i.sessionRollingHistory),b(e),await Wt(e,g),i.prompt="",b(e)}else return void 0}),t?.addEventListener("mousedown",g=>{g.stopPropagation()}),t?.addEventListener("click",async()=>rt()),n?.addEventListener("click",async()=>{const g=e.querySelector(".btn-help-mode");let w="";i&&(i.checkModeEnabled=!0,g?.classList.add("is-loading")),ce(e,!0),e.classList.add("checkmode-active");try{const S=await x.runtime.sendMessage({type:"GET_MONACO_CODE"});S?.ok&&typeof S.code=="string"&&i&&(w=S.code);const E=await Xt(e,w);console.log("this is the response: ",E)}catch{}finally{i&&(i.checkModeEnabled=!1,g?.classList.remove("is-loading")),ce(e,!1),e.classList.remove("checkmode-active"),b(e)}}),s?.addEventListener("input",()=>{i&&(i.prompt=s.value),b(e)});let p=!1,l=0,c=0,d=0,u=0,h=null;const k=.6,m=e.querySelector(".tutor-panel-shellbar"),y=()=>{if(!p){h=null;return}const g=e.offsetLeft,w=e.offsetTop,S=g+(d-g)*k,E=w+(u-w)*k;e.style.left=`${S}px`,e.style.top=`${E}px`,h=requestAnimationFrame(y)},v=g=>{if(!p)return;const w=g.clientX-l,S=g.clientY-c,E=window.innerWidth-e.offsetWidth,P=window.innerHeight-e.offsetHeight;d=Math.max(10,Math.min(w,E)),u=Math.max(10,Math.min(S,P)),h===null&&(h=requestAnimationFrame(y))},C=()=>{p&&(p=!1,document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",C),h!==null&&(cancelAnimationFrame(h),h=null),e.style.left=`${d}px`,e.style.top=`${u}px`,i&&(i.position={x:e.offsetLeft,y:e.offsetTop}),b(e))};m?.addEventListener("mousedown",g=>{g.preventDefault(),p=!0,l=g.clientX-e.getBoundingClientRect().left,c=g.clientY-e.getBoundingClientRect().top,d=e.offsetLeft,u=e.offsetTop,document.addEventListener("mousemove",v),document.addEventListener("mouseup",C)})}function ue(e,...t){}const Kt={debug:(...e)=>ue(console.debug,...e),log:(...e)=>ue(console.log,...e),warn:(...e)=>ue(console.warn,...e),error:(...e)=>ue(console.error,...e)};class Be extends Event{constructor(t,n){super(Be.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=He("wxt:locationchange")}function He(e){return`${x?.runtime?.id}:content:${e}`}function Qt(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new Be(o,n)),n=o)},1e3))}}}class de{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=He("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Qt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return x.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const o=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(t,n){const o=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(t){const n=requestAnimationFrame((...o)=>{this.isValid&&t(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const o=requestIdleCallback((...r)=>{this.signal.aborted||t(...r)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(t,n,o,r){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?He(n):n,o,{...r,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Kt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:de.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===de.SCRIPT_STARTED_MESSAGE_TYPE,o=t.data?.contentScriptName===this.contentScriptName,r=!this.receivedMessageIds.has(t.data?.messageId);return n&&o&&r}listenForNewerScripts(t){let n=!0;const o=r=>{if(this.verifyScriptStartedEvent(r)){this.receivedMessageIds.add(r.data.messageId);const s=n;if(n=!1,s&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function on(){}function pe(e,...t){}const Zt={debug:(...e)=>pe(console.debug,...e),log:(...e)=>pe(console.log,...e),warn:(...e)=>pe(console.warn,...e),error:(...e)=>pe(console.error,...e)};return(async()=>{try{const{main:e,...t}=gt,n=new de("content",t);return await e(n)}catch(e){throw Zt.error('The content script "content" crashed on startup!',e),e}})()})();
content;