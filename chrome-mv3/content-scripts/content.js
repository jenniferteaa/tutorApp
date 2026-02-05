var content=(function(){"use strict";function nn(e){return e}const y=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,ht={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{We()}):We()}};let f=null,F=!1,L=!1,Z={x:0,y:0},I={x:0,y:0},J,q=null,ee=!1,H=[];function We(){console.log("The widget is being loaded to the page"),bt(),Ot(),Nt(),_t(),Pt(),nt().then(()=>{E?.panelOpen&&ve()}),window.addEventListener("beforeunload",()=>{_(i?.element??null)})}function bt(){const e=document.getElementById("tutor-widget");e&&e.remove(),f=document.createElement("div"),f.id="tutor-widget",f.innerHTML=`
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
  background: rgba(93,106,102,0.6);
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

`,document.head.appendChild(t),document.body.appendChild(f),xt()}function yt(e){const t=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!t)return e;const n=t[1].trim(),r=t[2].trim().split(";").map(a=>a.trim()).filter(Boolean);if(r.length===0)return e;const s=r.map(a=>`- ${a.replace(/\.$/,"")}`).join(`
`);return`${n}

**To fix**
${s}`}function xt(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},o=!1,r=!1;function s(c,d){if(!f)return{x:c,y:d};const u={width:50,height:50},h=window.innerWidth,k=window.innerHeight,m=10;let x=Math.max(m,c);x=Math.min(h-u.width-m,x);let v=Math.max(m,d);return v=Math.min(k-u.height-m,v),{x,y:v}}function a(c,d){if(!f)return{x:c,y:d};const u={width:50,height:50},h=window.innerWidth,k=window.innerHeight,m=20,x=c,v=h-(c+u.width),C=d,g=k-(d+u.height),w=Math.min(x,v,C,g);let S=c,T=d;return(c<0||c+u.width>h||d<0||d+u.height>k)&&(w===x?S=m:w===v?S=h-u.width-m:w===C?T=m:w===g&&(T=k-u.height-m)),{x:S,y:T}}e.addEventListener("mousedown",c=>{c.preventDefault(),t=Date.now(),n={x:c.clientX,y:c.clientY},o=!1;const d=f.getBoundingClientRect();Z.x=c.clientX-d.left,Z.y=c.clientY-d.top,e.classList.add("dragging"),document.addEventListener("mousemove",p),document.addEventListener("mouseup",l)}),e.addEventListener("click",c=>{if(r){r=!1;return}!F&&!o&&(c.preventDefault(),c.stopPropagation(),L?at():ve())});function p(c){const d=Date.now()-t,u=Math.sqrt(Math.pow(c.clientX-n.x,2)+Math.pow(c.clientY-n.y,2));if(!F&&(u>3||d>100)&&(F=!0,o=!0,document.body.style.cursor="grabbing"),F){const h=c.clientX-Z.x,k=c.clientY-Z.y,m=s(h,k);f.style.transform=`translate(${m.x}px, ${m.y}px)`,f.style.left="0",f.style.top="0",I={x:m.x,y:m.y}}}function l(){if(document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",l),e&&e.classList.remove("dragging"),document.body.style.cursor="",F){r=!0;const c=a(I.x,I.y);c.x!==I.x||c.y!==I.y?(f.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",f.style.left=c.x+"px",f.style.top=c.y+"px",f.style.transform="",setTimeout(()=>{f&&(f.style.transition="")},15e3),I=c):(f.style.left=I.x+"px",f.style.top=I.y+"px",f.style.transform=""),ct()}F=!1,o=!1}}function te(e){try{const{origin:t,pathname:n}=new URL(e),o=n.match(/^\/problems\/[^/]+/);return o?`${t}${o[0]}`:`${t}${n}`}catch{return e}}function ne(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Ue(e){const t=e.match(/^\s*(\d+)/);if(!t)return null;const n=Number(t[1]);return Number.isFinite(n)?n:null}function he(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}const wt=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],Ge={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function be(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const oe=new Map(wt.map(e=>[be(e),Ge[e]??e]));Object.values(Ge).forEach(e=>{oe.set(be(e),e)});function vt(e){return e.split(" ").filter(Boolean).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function ye(e){const t=be(e);if(!t)return e.trim();const n=oe.get(t);if(n)return n;const o=t.split(" ");if(o.length>0){const r=o[o.length-1];if(r.endsWith("s")){o[o.length-1]=r.slice(0,-1);const s=o.join(" "),a=oe.get(s);if(a)return a}else{o[o.length-1]=`${r}s`;const s=o.join(" "),a=oe.get(s);if(a)return a}}return vt(t)}function je(e,t){const n=ye(t),o=Object.keys(e.topics).find(r=>ye(r)===n);return o&&o!==n&&(e.topics[n]=e.topics[o],delete e.topics[o]),e.topics[n]??={thoughts_to_remember:[],pitfalls:[]},n}function xe(e,t){return`${Ve}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function St(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(n=>n.getAttribute("href")).filter(n=>!!n).map(n=>n.replace("/tag/","").replace("/","")).map(n=>ye(n));return Object.fromEntries(Array.from(new Set(t)).map(n=>[n,{thoughts_to_remember:[],pitfalls:[]}]))}function R(){const e=document.querySelector("#editor");if(!e)return"";const t=e.querySelector('button[aria-haspopup="dialog"]');return t?Array.from(t.childNodes).find(o=>o.nodeType===Node.TEXT_NODE&&o.textContent?.trim())?.textContent?.trim()??t.textContent?.trim()??"":""}const kt='#editor button[aria-haspopup="dialog"]';let ie=null,Ye=null;function $(){if(!i)return;const e=R();e&&i.language!==e&&(i.language=e,b(i.element??null))}function we(){const e=document.querySelector(kt);if(e){if(e.dataset.tutorLangListener||(e.dataset.tutorLangListener="true",e.addEventListener("click",()=>{window.setTimeout($,50)},{passive:!0})),Ye===e&&ie){$();return}ie?.disconnect(),Ye=e,ie=new MutationObserver(()=>{$()}),ie.observe(e,{childList:!0,characterData:!0,subtree:!0}),$()}}function Xe(e,t,n){const o=n??ne(),r=crypto.randomUUID();return{element:e,sessionId:r,userId:t,problem:o,problemUrl:te(window.location.href),language:R(),topics:St(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function ve(){const e=await Ae(),t=Ct(e),n=e?.userId??"";if(t&&await Je(),i&&i.element&&document.body.contains(i.element)){we(),$(),ce(i.element),se(),L=!0,i.element,!n||t?(O(i.element),X(i.element,t?"session expired, please log back in":void 0)):U(i),j(),b(i.element);return}if(i?.userId){Ht();try{await _(i.element??null,{force:!0})}finally{Rt()}}if(!E&&n){const r=await Ce(n,ne());r&&De(r,n)&&(E=r)}if(E){const r=st();tt(r,E),E=null,we(),$(),ce(r),se(),L=!0,j(),!n||t?(O(r),X(r,t?"session expired, please log back in":void 0)):i&&U(i),b(r);return}const o=st();if(!o){console.log("There was an error creating a panel");return}i=Xe(o,n),we(),ce(o),se(),L=!0,j(),b(o),i&&(!n||t?(O(o),X(o,t?"session expired, please log back in":void 0)):(i.userId=n,U(i)),setTimeout(()=>{const r=o.querySelector(".tutor-panel-prompt");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},100))}let Se=!1;async function Tt(e){if(Se||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);Se=!0;try{const n=await y.runtime.sendMessage({action:"summarize-history",payload:{sessionId:i?.sessionId??"",summarize:t,summary:e.summary}});if(Y(i?.element??null,n,{silent:!0}))return;const o=typeof n=="string"?n:n?.reply;typeof o=="string"&&(e.summary=o)}finally{Se=!1}}function ke(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),Tt(e)}let i=null;async function U(e){if(e.sessionTopicsInitialized||!e.userId)return;(await y.runtime.sendMessage({action:"init-session-topics",payload:{sessionId:e.sessionId,topics:e.topics}}))?.success&&(e.sessionTopicsInitialized=!0,b(e.element??null))}const Te="vibetutor-auth",Ve="vibetutor-session",Et="http://localhost:3000/auth/bridge",Lt=960*60*1e3,Mt=15e3,Ke=1440*60*1e3,It=1800*1e3,At=`${Ve}:`;let E=null,re=Date.now(),Qe=0,G=!1,Ee=null,Le=null,Me=null,Ze=te(window.location.href),Ie=null;async function Ae(){return(await y.storage.local.get(Te))[Te]??null}function Ct(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Je(){await y.storage.local.remove(Te),await y.runtime.sendMessage({action:"clear-auth"})}async function _(e,t){if(!i||!i.userId||G&&!t?.force)return;const n=e?.querySelector(".tutor-panel-content")??i.element?.querySelector(".tutor-panel-content"),o=xe(i.userId,i.problem),r={state:{sessionId:i.sessionId,userId:i.userId,content:i.content,sessionTopicsInitialized:i.sessionTopicsInitialized,language:i.language,problem:i.problem,problemUrl:i.problemUrl,topics:i.topics,prompt:i.prompt,position:i.position,size:i.size,guideModeEnabled:i.guideModeEnabled,checkModeEnabled:i.checkModeEnabled,rollingStateGuideMode:i.rollingStateGuideMode,sessionRollingHistory:i.sessionRollingHistory},panelOpen:L,contentHtml:n?.innerHTML??"",lastActivityAt:re};await y.storage.local.set({[o]:r})}function b(e){G||Ee||(Ee=window.setTimeout(()=>{Ee=null,_(e)},500))}async function Ce(e,t){const n=xe(e,t),r=(await y.storage.local.get(n))[n]??null;return r?Date.now()-(r.lastActivityAt??0)>Ke?(await y.storage.local.remove(n),null):r:null}async function Pe(e,t){const n=xe(e,t);await y.storage.local.remove(n)}async function et(){const e=await y.storage.local.get(null),t=Date.now(),n=[];for(const[o,r]of Object.entries(e)){if(!o.startsWith(At))continue;const a=r?.lastActivityAt??0;t-a>Ke&&n.push(o)}n.length>0&&await y.storage.local.remove(n)}function Pt(){et(),Ie&&window.clearInterval(Ie),Ie=window.setInterval(()=>{et()},It)}function De(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const n=te(window.location.href);return e.state.problemUrl===n}function tt(e,t){i={...t.state,element:e},i&&!i.language&&(i.language=R()),i&&i.sessionTopicsInitialized==null&&(i.sessionTopicsInitialized=!1);const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML=t.contentHtml||"");const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=i.prompt??""),i.position&&(e.style.left=`${i.position.x}px`,e.style.top=`${i.position.y}px`),i.size&&(e.style.width=`${i.size.width}px`,e.style.height=`${i.size.height}px`);const r=e.querySelectorAll(".guide-wrapper.guide-slab");if(r.length>0){const s=r[r.length-1];W=s.querySelectorAll(".guide-item").length,z=s,P=i?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");W=s.length,z=s.length>0?s[s.length-1]:null,P=null}}function Dt(e,t,n){qe();const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML="");const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=""),i=Xe(e,t,n),i&&U(i)}async function nt(){const e=await Ae();if(!e?.userId){E=null;return}const t=await Ce(e.userId,ne());if(!t){E=null;return}if(!De(t,e.userId)){await Pe(e.userId,t.state.problem),E=null;return}E=t,re=t.lastActivityAt??Date.now()}function j(){re=Date.now(),Date.now()-Qe>Mt&&(Qe=Date.now(),b())}async function qt(){if(i?.element&&(await _(i.element,{force:!0}),G=!0),await Je(),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),i?.element){const e=i.element;He(),e.classList.remove("guidemode-active","checkmode-active"),O(e),X(e,"session expired, please log back in")}}function Nt(){const e=()=>j(),t=["mousemove","keydown","click","scroll","input"];for(const n of t)document.addEventListener(n,e,{passive:!0});Le&&window.clearInterval(Le),Le=window.setInterval(async()=>{Date.now()-re<Lt||!(await Ae())?.userId||await qt()},6e4)}function qe(){N=null,V=!1,M=new Set,Ne=0,ae=!1,K=null,ze=null,Be=0,W=0,z=null,P=null}function zt(e){H=[],J=!1,qe(),He(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(t=>{t.remove()}),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function O(e){e.classList.add("tutor-panel-locked"),pe(e,!0)}function ot(e){e.classList.remove("tutor-panel-locked"),pe(e,!1)}const it="session expired, please log back in";function Bt(e){return typeof e=="object"&&e!==null&&e.success===!1}function Ft(e){const t=e.querySelector(".tutor-panel-content");if(!t)return;t.querySelectorAll(".tutor-panel-message--assistant").forEach(o=>{o.textContent?.trim()===it&&o.remove()})}function rt(e,t){const n=e.querySelector(".tutor-panel-content");if(!n)return;const o=de(e,t,"assistant");o&&(n.scrollTop=o.offsetTop,b(e))}function Y(e,t,n){if(!Bt(t))return!1;if(n?.silent)return!0;const o=e??i?.element??null;if(!o)return!0;if(t.unauthorized||t.status===401||t.status===403||t.error&&/unauthorized/i.test(t.error))return O(o),X(o,it),L||(ce(o),se(),L=!0,j(),b(o)),Ft(o),!0;if(t.timeout)return rt(o,n?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const r=n?.serverMessage??"Internal server error. Please try again in a moment.";return n?.lockOnServerError===!0&&O(o),rt(o,r),!0}function Ht(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function Rt(){document.getElementById("tutor-panel-loading")?.remove()}async function $t(e){i?.userId&&i.element&&await _(i.element,{force:!0}),E=null,qe();const t=L;i?.element&&i.element.remove(),i=null,L=!1,lt(),await nt(),t&&ve()}function _t(){Me&&window.clearInterval(Me),Me=window.setInterval(()=>{const e=te(window.location.href);e!==Ze&&(Ze=e,$t())},1e3)}function X(e,t){const n=e.querySelector(".tutor-panel-auth");if(n){if(t){const l=n.querySelector(".auth-error");l&&(l.textContent=t,l.style.display="block")}return}ee=!0,zt(e);const o=document.createElement("div");o.className="tutor-panel-auth",e.appendChild(o);const r=(l,c)=>{if(!l||!c)return;const d=()=>{const u=l.type==="password";c.setAttribute("aria-label",u?"Show password":"Hide password")};c.addEventListener("click",()=>{l.type=l.type==="password"?"text":"password",d(),l.focus(),l.setSelectionRange(l.value.length,l.value.length)}),d()},s=async l=>{const c=i?.userId??"",d=i?.problem??ne();if(ee=!1,c&&c===l){G=!1,ot(e),o.remove(),b(e);return}c&&c!==l&&(await _(e,{force:!0}),Dt(e,l,d));const u=await Ce(l,d);u&&De(u,l)?(tt(e,u),await Pe(l,u.state.problem),E=null):u&&await Pe(l,u.state.problem),i&&(i.userId=l,U(i)),G=!1,ot(e),o.remove(),b(e)},a=l=>{o.innerHTML=`
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
    `;const c=o.querySelector(".auth-email"),d=o.querySelector(".auth-password"),u=o.querySelector(".auth-login"),h=o.querySelector(".auth-signup"),k=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error");l&&m&&(m.textContent=l,m.style.display="block");const x=()=>{m&&(m.style.display="none")};c?.addEventListener("input",x),d?.addEventListener("input",x),r(d,k),u?.addEventListener("click",async()=>{const v=c?.value.trim()??"",C=d?.value.trim()??"";if(!v||!C)return;const g=await y.runtime.sendMessage({action:"supabase-login",payload:{email:v,password:C}});if(g?.success===!1){m&&(m.textContent=g.error||"Internal server error",m.style.display="block");return}g?.userId&&g?.jwt?await s(g.userId):m&&(m.textContent="Invalid creds",m.style.display="block")}),h?.addEventListener("click",()=>{p()})},p=()=>{o.innerHTML=`
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
    `;const l=o.querySelector(".auth-first-name"),c=o.querySelector(".auth-last-name"),d=o.querySelector(".auth-email"),u=o.querySelector(".auth-password"),h=o.querySelector(".auth-signup-submit"),k=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error"),x=o.querySelector(".auth-password-hint"),v=()=>{m&&(m.style.display="none")};l?.addEventListener("input",v),c?.addEventListener("input",v),d?.addEventListener("input",v),u?.addEventListener("input",v),r(u,k),u?.addEventListener("blur",()=>{if(!x||!u)return;const g=u.value.trim();g&&!he(g)?(x.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",x.style.display="block"):x.style.display="none"}),u?.addEventListener("input",()=>{if(!x||!u)return;const g=u.value.trim();g&&he(g)&&(x.style.display="none")}),h?.addEventListener("click",async()=>{const g=l?.value.trim()??"",w=c?.value.trim()??"",S=d?.value.trim()??"",T=u?.value.trim()??"";if(!g||!w||!S||!T)return;if(!he(T)){x&&(x.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",x.style.display="block");return}const D=await y.runtime.sendMessage({action:"supabase-signup",payload:{fname:g,lname:w,email:S,password:T}});if(D?.success===!1){m&&(m.textContent=D.error||"Internal server error",m.style.display="block");return}D?.requiresVerification?a("Waiting for verification, check email"):D?.userId&&D?.jwt?await s(D.userId):m&&(m.style.display="block")}),o.querySelector(".auth-back")?.addEventListener("click",()=>{a()})};a(t)}function st(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const t=40,n=Math.round(window.innerHeight*.38),o=window.innerWidth-e.offsetWidth-20,r=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(t,o))}px`,e.style.top=`${Math.max(20,Math.min(n,r))}px`,setTimeout(()=>e.classList.add("open"),10),Zt(e),e}function at(){i?.element&&(Yt(i.element),Xt(i.element),lt(),L=!1,b(i.element))}function rn(e){}function se(){f&&(f.style.display="none")}function lt(){f&&(f.style.display="block")}async function ct(){}async function Ot(){}let N=null,V=!1,M=new Set,Ne=0,ae=!1,K=null,ze=null,Be=0,W=0,z=null,P=null;function Q(){return document.querySelector(".monaco-editor textarea.inputarea")}function ut(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function le(){M.clear(),V=!1,N!==null&&(window.clearTimeout(N),N=null)}async function Fe(e){const t=Vt(),o=Q()?.value??"",r=Array.from(M)[0]??1;if(!r){le();return}const s=Date.now();if(ze===r&&s-Be<250)return;if(ze=r,Be=s,!t){le();return}let a="";if(o&&(a=dt(o,r)),!a.trim()&&r>1&&o){const l=dt(o,r-1);l.trim()&&(a=l)}let p=t;try{const l=await y.runtime.sendMessage({type:"GET_MONACO_CODE"});l?.ok&&typeof l.code=="string"&&(p=l.code)}catch{}Wt(a)&&(H.push([p,a]),Ut()),le()}function Wt(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function dt(e,t){return e.split(`
`)[t-1]??""}async function Ut(){if(!ae){if(ee){H=[];return}ae=!0;try{for(;H.length>0;){if(ee){H=[];break}const[e,t]=H.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),J=!0;const n=await y.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:e,focusLine:t,language:i?.language??R(),rollingStateGuideMode:i?.rollingStateGuideMode}});if(Y(i?.element??null,n,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){J=!1;continue}if(!n)console.log("failure for guide mode");else{const o=n.success?n.reply:null;o?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const r=o?.nudge;if(i&&typeof r=="string"){const a=r.trim();a&&i.rollingStateGuideMode.nudges.push(a),i.content.push(`${r}
`),i.element!=null&&await $e(i.element,"","guideAssistant",r),b(i.element??null)}const s=o?.topics;if(s&&typeof s=="object"&&i)for(const[a,p]of Object.entries(s)){if(!p||typeof p!="object")continue;const l=je(i,a),c=p.thoughts_to_remember,d=p.pitfalls,u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],h=Array.isArray(d)?d:typeof d=="string"&&d.trim()?[d.trim()]:[];i&&(u.length>0&&i.topics[l].thoughts_to_remember.push(...u),h.length>0&&i.topics[l].pitfalls.push(...h))}i?.element&&b(i.element),J=!1}}}finally{ae=!1}}}function pt(){if(!i?.guideModeEnabled)return;const e=Q();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=ut(t,n);!M.has(o)&&M.size==0&&M.add(o),V||(V=!0),N!==null&&window.clearTimeout(N),N=window.setTimeout(()=>{Fe()},1e4),!M.has(o)&&M.size==1&&Fe()}function gt(){if(!i?.guideModeEnabled||!V)return;const e=Q();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=ut(t,n);if(K===null){K=o;return}o!==K&&(K=o,!M.has(o)&&M.size==1&&Fe())}function mt(){const e=Q();if(!e){Ne<5&&(Ne+=1,window.setTimeout(mt,500));return}e.addEventListener("input",pt),document.addEventListener("selectionchange",gt)}function He(){const e=Q();e&&(e.removeEventListener("input",pt),document.removeEventListener("selectionchange",gt))}function sn(){}function Gt(e){const t=e.querySelector(".tutor-panel-content");if(!t)return null;const n=document.createElement("div");n.className="tutor-panel-assistant-loading";const o=document.createElement("div");return o.className="tutor-panel-assistant-loading-dot",n.appendChild(o),t.appendChild(n),t.scrollTop=n.offsetTop,n}async function jt(e,t){const n=Gt(e),o=i?.language||R(),r=await y.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",action:"ask-anything",rollingHistory:i?.sessionRollingHistory.qaHistory,summary:i?.sessionRollingHistory.summary??"",query:t,language:o}});if(Y(e,r,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return n?.remove(),"Failure";const s=typeof r=="string"?r:r?.reply;return typeof s=="string"&&s.trim()&&(n?.remove(),$e(e,"","assistant",s)),n?.remove(),s||"Failure"}function ce(e){q!==null&&(window.clearTimeout(q),q=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Yt(e){e.classList.remove("open"),e.classList.add("closing"),q!==null&&window.clearTimeout(q),q=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),q=null},180)}function Xt(e){if(!f)return;const t=e.getBoundingClientRect(),n=f.getBoundingClientRect(),o=n.width||50,r=n.height||50,p=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,l=Math.max(10,Math.min(window.innerHeight/2-r/2,window.innerHeight-r-10));f.style.left=`${p}px`,f.style.top=`${l}px`,f.style.right="auto",f.style.bottom="auto",f.style.transform="",I={x:p,y:l},ct()}function Vt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function B(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ue(e){const t=e.split("`"),n=o=>{const r=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,p;for(;(p=r.exec(o))!==null;){s+=B(o.slice(a,p.index));const l=p[1];l.startsWith("**")?s+=`<strong>${B(l.slice(2,-2))}</strong>`:s+=`<code>${B(l.slice(1,-1))}</code>`,a=r.lastIndex}return s+=B(o.slice(a)),s};return t.map((o,r)=>r%2===1?`<code>${B(o)}</code>`:n(o)).join("")}function Kt(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",o=[],r=null;const s=()=>{o.length!==0&&(n+=`<p>${ue(o.join(" "))}</p>`,o=[])},a=()=>{r&&(n+=`</${r}>`,r=null)};for(const p of t){const l=p.trim();if(!l){s(),a();continue}const c=l.match(/^(#{1,3})\s+(.*)$/);if(c){s(),a();const h=c[1].length;n+=`<h${h}>${ue(c[2])}</h${h}>`;continue}const d=l.match(/^(\d+)[.)]\s+(.*)$/);if(d){s(),r&&r!=="ol"&&a(),r||(r="ol",n+="<ol>"),n+=`<li>${ue(d[2])}</li>`;continue}const u=l.match(/^[-*]\s+(.*)$/);if(u){s(),r&&r!=="ul"&&a(),r||(r="ul",n+="<ul>"),n+=`<li>${ue(u[1])}</li>`;continue}o.push(l)}return s(),a(),n}function A(e){const t=e.replace(/\r\n/g,`
`),n=[],o=/```(\w+)?\r?\n([\s\S]*?)```/g;let r=0,s;for(;(s=o.exec(t))!==null;)s.index>r&&n.push({type:"text",content:t.slice(r,s.index)}),n.push({type:"code",content:s[2]??"",lang:s[1]??""}),r=o.lastIndex;return r<t.length&&n.push({type:"text",content:t.slice(r)}),n.map(a=>a.type==="code"?`<pre><code${a.lang?` data-lang="${B(a.lang)}"`:""}>${B(a.content.trimEnd())}</code></pre>`:Kt(a.content)).join("")}function de(e,t,n){const o=e.querySelector(".tutor-panel-content");if(!o)return null;const r=document.createElement("div");if(n==="assistant")r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=A(t);else if(n==="user")r.className="tutor-panel-message tutor-panel-message--user",r.textContent=t;else if(n==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=A(t),s.appendChild(r),o.appendChild(s),s}else if(n==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=A(t),s.appendChild(r),o.appendChild(s),s}else r.textContent=t;return o.append(r),o.scrollTop=r.offsetTop,r}function ft(e,t){const n=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of n){const r=e.querySelector(o);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function pe(e,t){const n=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of n){const r=e.querySelector(o);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function Re(e,t,n,o){return new Promise(r=>{let s=0;const a=2,p=e.offsetTop;t.scrollTop=p;let l=!0;const c=()=>{Math.abs(t.scrollTop-p)>8&&(l=!1)};t.addEventListener("scroll",c,{passive:!0});const d=()=>{s=Math.min(n.length,s+a);const u=n.slice(0,s);o?.render?e.innerHTML=o.render(u):e.textContent=u,l&&(t.scrollTop=p),s<n.length?window.setTimeout(d,12):(t.removeEventListener("scroll",c),r())};d()})}async function $e(e,t,n,o){const r=yt(o),s=e.querySelector(".tutor-panel-content");if(s&&typeof o=="string"){if(n==="assistant"){const a=de(e,"","assistant");if(!a)return;await Re(a,s,r,{render:A}),a.innerHTML=A(r),i?.sessionRollingHistory.qaHistory.push(`Assitant: ${o}`),i&&ke(i.sessionRollingHistory),s.scrollTop=a.offsetTop,b(e)}else if(n==="guideAssistant"){let a=P&&s.contains(P)?P:null;if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const c=document.createElement("ul");c.className="guide-list",a.appendChild(c),s.appendChild(a),P=a}const p=a.querySelector(".guide-list")??document.createElement("ul");p.classList.contains("guide-list")||(p.className="guide-list",a.appendChild(p));const l=document.createElement("li");l.className="guide-item",p.appendChild(l),W===0&&a.classList.add("guide-start"),W+=1,z=a,await Re(l,s,r,{render:A}),l.innerHTML=A(r),s.scrollTop=a.offsetTop,b(e)}else if(n==="checkAssistant"){const a=de(e,"","checkAssistant");if(!a)return;const p=a.querySelector(".tutor-panel-message--checkAssistant");if(!p)return;a.classList.add("check-start"),await Re(p,s,r,{render:A}),p.innerHTML=A(r),a.classList.add("check-end"),s.scrollTop=a.offsetTop,i?.sessionRollingHistory.qaHistory.push(`Check: ${o}`),i&&ke(i.sessionRollingHistory),b(e)}}}async function Qt(e,t){try{const n=await y.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:t,action:"check-code",language:i?.language??R(),problem_no:Ue(i?.problem??""),problem_name:i?.problem??"",problem_url:i?.problemUrl??""}});if(Y(e,n,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const o=n?.resp;i&&typeof o=="string"&&i.content.push(`${o}
`),typeof o=="string"&&o.trim()&&await $e(e,"","checkAssistant",o);const r=n?.topics;if(r&&typeof r=="object"&&i)for(const[s,a]of Object.entries(r)){if(!a||typeof a!="object")continue;const p=je(i,s),l=a.thoughts_to_remember,c=a.pitfalls,d=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[],u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];i&&(d.length>0&&i.topics[p].thoughts_to_remember.push(...d),u.length>0&&i.topics[p].pitfalls.push(...u))}return console.log("this is the object now: ",i?.topics),b(e),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Zt(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode"),o=e.querySelector(".btn-guide-mode"),r=e.querySelector(".btn-gotToWorkspace");o?.addEventListener("click",()=>{if(!i)return;i.guideModeEnabled=!i.guideModeEnabled;const g=e.querySelector(".btn-guide-mode");if(i.userId){const w=i.problem,S=Ue(w);y.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:i.guideModeEnabled,sessionId:i.sessionId,problem_no:S,problem_name:w,problem_url:i.problemUrl}})}ft(e,!0),e.classList.add("guidemode-active"),i.guideModeEnabled?(g?.classList.add("is-loading"),W=0,z=null,P=null,mt()):(He(),z&&z.classList.add("guide-end"),ft(e,!1),e.classList.remove("guidemode-active"),g?.classList.remove("is-loading")),b(e)}),r?.addEventListener("click",async()=>{const g=await y.runtime.sendMessage({action:"go-to-workspace",payload:{url:Et}});Y(e,g,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const s=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const g=i.prompt;s&&(s.value=""),i&&(i.prompt=""),de(e,g,"user"),i.sessionRollingHistory.qaHistory.push(`user: ${g}`),ke(i.sessionRollingHistory),b(e),await jt(e,g),i.prompt="",b(e)}else return void 0}),t?.addEventListener("mousedown",g=>{g.stopPropagation()}),t?.addEventListener("click",async()=>at()),n?.addEventListener("click",async()=>{const g=e.querySelector(".btn-help-mode");let w="";i&&(i.checkModeEnabled=!0,g?.classList.add("is-loading")),pe(e,!0),e.classList.add("checkmode-active");try{const S=await y.runtime.sendMessage({type:"GET_MONACO_CODE"});S?.ok&&typeof S.code=="string"&&i&&(w=S.code);const T=await Qt(e,w);console.log("this is the response: ",T)}catch{}finally{i&&(i.checkModeEnabled=!1,g?.classList.remove("is-loading")),pe(e,!1),e.classList.remove("checkmode-active"),b(e)}}),s?.addEventListener("input",()=>{i&&(i.prompt=s.value),b(e)});let p=!1,l=0,c=0,d=0,u=0,h=null;const k=.6,m=e.querySelector(".tutor-panel-shellbar"),x=()=>{if(!p){h=null;return}const g=e.offsetLeft,w=e.offsetTop,S=g+(d-g)*k,T=w+(u-w)*k;e.style.left=`${S}px`,e.style.top=`${T}px`,h=requestAnimationFrame(x)},v=g=>{if(!p)return;const w=g.clientX-l,S=g.clientY-c,T=window.innerWidth-e.offsetWidth,D=window.innerHeight-e.offsetHeight;d=Math.max(10,Math.min(w,T)),u=Math.max(10,Math.min(S,D)),h===null&&(h=requestAnimationFrame(x))},C=()=>{p&&(p=!1,document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",C),h!==null&&(cancelAnimationFrame(h),h=null),e.style.left=`${d}px`,e.style.top=`${u}px`,i&&(i.position={x:e.offsetLeft,y:e.offsetTop}),b(e))};m?.addEventListener("mousedown",g=>{g.preventDefault(),p=!0,l=g.clientX-e.getBoundingClientRect().left,c=g.clientY-e.getBoundingClientRect().top,d=e.offsetLeft,u=e.offsetTop,document.addEventListener("mousemove",v),document.addEventListener("mouseup",C)})}function ge(e,...t){}const Jt={debug:(...e)=>ge(console.debug,...e),log:(...e)=>ge(console.log,...e),warn:(...e)=>ge(console.warn,...e),error:(...e)=>ge(console.error,...e)};class _e extends Event{constructor(t,n){super(_e.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=Oe("wxt:locationchange")}function Oe(e){return`${y?.runtime?.id}:content:${e}`}function en(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new _e(o,n)),n=o)},1e3))}}}class me{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Oe("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=en(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return y.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const o=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(t,n){const o=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(t){const n=requestAnimationFrame((...o)=>{this.isValid&&t(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const o=requestIdleCallback((...r)=>{this.signal.aborted||t(...r)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(t,n,o,r){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?Oe(n):n,o,{...r,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Jt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:me.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===me.SCRIPT_STARTED_MESSAGE_TYPE,o=t.data?.contentScriptName===this.contentScriptName,r=!this.receivedMessageIds.has(t.data?.messageId);return n&&o&&r}listenForNewerScripts(t){let n=!0;const o=r=>{if(this.verifyScriptStartedEvent(r)){this.receivedMessageIds.add(r.data.messageId);const s=n;if(n=!1,s&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function an(){}function fe(e,...t){}const tn={debug:(...e)=>fe(console.debug,...e),log:(...e)=>fe(console.log,...e),warn:(...e)=>fe(console.warn,...e),error:(...e)=>fe(console.error,...e)};return(async()=>{try{const{main:e,...t}=ht,n=new me("content",t);return await e(n)}catch(e){throw tn.error('The content script "content" crashed on startup!',e),e}})()})();
content;