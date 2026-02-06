var content=(function(){"use strict";function Et(t){return t}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,Re=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],fe={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function V(t){return t.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const z=new Map(Re.map(t=>[V(t),fe[t]??t]));Object.values(fe).forEach(t=>{z.set(V(t),t)});function $e(t){return t.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function K(t){const n=V(t);if(!n)return t.trim();const r=z.get(n);if(r)return r;const o=n.split(" ");if(o.length>0){const i=o[o.length-1];if(i.endsWith("s")){o[o.length-1]=i.slice(0,-1);const s=o.join(" "),a=z.get(s);if(a)return a}else{o[o.length-1]=`${i}s`;const s=o.join(" "),a=z.get(s);if(a)return a}}return $e(n)}function he(t,n){const r=K(n),o=Object.keys(t).find(i=>K(i)===r);return o&&o!==r&&(t[r]=t[o],delete t[o]),t[r]??={thoughts_to_remember:[],pitfalls:[]},r}function M(t){try{const{origin:n,pathname:r}=new URL(t),o=r.match(/^\/problems\/[^/]+/);return o?`${n}${o[0]}`:`${n}${r}`}catch{return t}}function H(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function be(t){const n=t.match(/^\s*(\d+)/);if(!n)return null;const r=Number(n[1]);return Number.isFinite(r)?r:null}function We(){const t=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(t).map(r=>r.getAttribute("href")).filter(r=>!!r).map(r=>r.replace("/tag/","").replace("/","")).map(r=>K(r));return Object.fromEntries(Array.from(new Set(n)).map(r=>[r,{thoughts_to_remember:[],pitfalls:[]}]))}function C(){const t=document.querySelector("#editor");if(!t)return"";const n=t.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(o=>o.nodeType===Node.TEXT_NODE&&o.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}function A(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(t){const n=t.split("`"),r=o=>{const i=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,c;for(;(c=i.exec(o))!==null;){s+=A(o.slice(a,c.index));const l=c[1];l.startsWith("**")?s+=`<strong>${A(l.slice(2,-2))}</strong>`:s+=`<code>${A(l.slice(1,-1))}</code>`,a=i.lastIndex}return s+=A(o.slice(a)),s};return n.map((o,i)=>i%2===1?`<code>${A(o)}</code>`:r(o)).join("")}function _e(t){const n=t.replace(/\r\n/g,`
`).split(`
`);let r="",o=[],i=null;const s=()=>{o.length!==0&&(r+=`<p>${R(o.join(" "))}</p>`,o=[])},a=()=>{i&&(r+=`</${i}>`,i=null)};for(const c of n){const l=c.trim();if(!l){s(),a();continue}const u=l.match(/^(#{1,3})\s+(.*)$/);if(u){s(),a();const f=u[1].length;r+=`<h${f}>${R(u[2])}</h${f}>`;continue}const p=l.match(/^(\d+)[.)]\s+(.*)$/);if(p){s(),i&&i!=="ol"&&a(),i||(i="ol",r+="<ol>"),r+=`<li>${R(p[2])}</li>`;continue}const d=l.match(/^[-*]\s+(.*)$/);if(d){s(),i&&i!=="ul"&&a(),i||(i="ul",r+="<ul>"),r+=`<li>${R(d[1])}</li>`;continue}o.push(l)}return s(),a(),r}function Se(t){const n=t.split(`
`),r=c=>/^\s*\|?[-:\s|]+\|?\s*$/.test(c),o=c=>(c.match(/\|/g)?.length??0)>=2;let i=!1;const s=[];let a=0;for(;a<n.length;){const c=n[a];if(c.trim().startsWith("```")){i=!i,s.push(c),a+=1;continue}if(i){s.push(c),a+=1;continue}if(o(c)||r(c)){const l=[];for(;a<n.length;){const u=n[a];if(u.trim().startsWith("```")||!(o(u)||r(u)))break;l.push(u),a+=1}l.length>0&&(s.push("```table"),s.push(...l),s.push("```"));continue}s.push(c),a+=1}return s.join(`
`)}function Ge(t){const n=t.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return Se(t);const r=n[1].trim(),i=n[2].trim().split(";").map(c=>c.trim()).filter(Boolean);if(i.length===0)return t;const s=i.map(c=>`- ${c.replace(/\.$/,"")}`).join(`
`),a=`${r}

**To fix**
${s}`;return Se(a)}function I(t){const n=t.replace(/\r\n/g,`
`),o=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,c;for(;(c=s.exec(o))!==null;)c.index>a&&i.push({type:"text",content:o.slice(a,c.index)}),i.push({type:"code",content:c[2]??"",lang:c[1]??""}),a=s.lastIndex;return a<o.length&&i.push({type:"text",content:o.slice(a)}),i.map(l=>{if(l.type==="code"){const u=l.lang?` data-lang="${A(l.lang)}"`:"";return`<pre${l.lang==="table"?' class="table-block"':""}><code${u}>${A(l.content.trimEnd())}</code></pre>`}return _e(l.content)}).join("")}const Q="vibetutor-auth",we="vibetutor-session",ye=1440*60*1e3,Ue=1800*1e3,Ye=`${we}:`;let Z=null;function J(t,n){return`${we}:${encodeURIComponent(t)}:${encodeURIComponent(n)}`}async function ee(){return(await b.storage.local.get(Q))[Q]??null}function je(t){return t?.expiresAt?Date.now()>t.expiresAt:!1}async function xe(){await b.storage.local.remove(Q),await b.runtime.sendMessage({action:"clear-auth"})}async function te(t,n){const r=J(t,n),i=(await b.storage.local.get(r))[r]??null;return i?Date.now()-(i.lastActivityAt??0)>ye?(await b.storage.local.remove(r),null):i:null}async function ne(t,n){const r=J(t,n);await b.storage.local.remove(r)}async function Te(){const t=await b.storage.local.get(null),n=Date.now(),r=[];for(const[o,i]of Object.entries(t)){if(!o.startsWith(Ye))continue;const a=i?.lastActivityAt??0;n-a>ye&&r.push(o)}r.length>0&&await b.storage.local.remove(r)}function Xe(){Te(),Z&&window.clearInterval(Z),Z=window.setInterval(()=>{Te()},Ue)}function oe(t,n,r){return t.state.userId?t.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):t.state.problemUrl===r:(console.log("There was no stored user in the browser."),!1)}const e={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null},Ve={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{ve()}):ve()}};function ve(){console.log("The widget is being loaded to the page"),e.lastCanonicalProblemUrl=M(window.location.href),Ke(),gt(),it(),pt(),Xe(),Ee().then(()=>{e.pendingStoredSession?.panelOpen&&se()}),window.addEventListener("beforeunload",()=>{P(e.currentTutorSession?.element??null)})}function Ke(){const t=document.getElementById("tutor-widget");t&&t.remove(),e.widget=document.createElement("div"),e.widget.id="tutor-widget",e.widget.innerHTML=`
  <div class="widget-main-button" id="main-button">
  </div>
  `;const n=document.createElement("style");n.textContent=`
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

`,document.head.appendChild(n),document.body.appendChild(e.widget),Qe()}function Qe(){const t=document.getElementById("main-button");if(!t)return;let n=0,r={x:0,y:0},o=!1,i=!1;function s(u,p){if(!e.widget)return{x:u,y:p};const d={width:50,height:50},f=window.innerWidth,T=window.innerHeight,m=10;let S=Math.max(m,u);S=Math.min(f-d.width-m,S);let y=Math.max(m,p);return y=Math.min(T-d.height-m,y),{x:S,y}}function a(u,p){if(!e.widget)return{x:u,y:p};const d={width:50,height:50},f=window.innerWidth,T=window.innerHeight,m=20,S=u,y=f-(u+d.width),E=p,g=T-(p+d.height),w=Math.min(S,y,E,g);let x=u,v=p;return(u<0||u+d.width>f||p<0||p+d.height>T)&&(w===S?x=m:w===y?x=f-d.width-m:w===E?v=m:w===g&&(v=T-d.height-m)),{x,y:v}}t.addEventListener("mousedown",u=>{u.preventDefault(),n=Date.now(),r={x:u.clientX,y:u.clientY},o=!1;const p=e.widget.getBoundingClientRect();e.dragOffset.x=u.clientX-p.left,e.dragOffset.y=u.clientY-p.top,t.classList.add("dragging"),document.addEventListener("mousemove",c),document.addEventListener("mouseup",l)}),t.addEventListener("click",u=>{if(i){i=!1;return}!e.isDragging&&!o&&(u.preventDefault(),u.stopPropagation(),e.isWindowOpen?Pe():se())});function c(u){const p=Date.now()-n,d=Math.sqrt(Math.pow(u.clientX-r.x,2)+Math.pow(u.clientY-r.y,2));if(!e.isDragging&&(d>3||p>100)&&(e.isDragging=!0,o=!0,document.body.style.cursor="grabbing"),e.isDragging){const f=u.clientX-e.dragOffset.x,T=u.clientY-e.dragOffset.y,m=s(f,T);e.widget.style.transform=`translate(${m.x}px, ${m.y}px)`,e.widget.style.left="0",e.widget.style.top="0",e.lastPosition={x:m.x,y:m.y}}}function l(){if(document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",l),t&&t.classList.remove("dragging"),document.body.style.cursor="",e.isDragging){i=!0;const u=a(e.lastPosition.x,e.lastPosition.y);u.x!==e.lastPosition.x||u.y!==e.lastPosition.y?(e.widget.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",e.widget.style.left=u.x+"px",e.widget.style.top=u.y+"px",e.widget.style.transform="",setTimeout(()=>{e.widget&&(e.widget.style.transition="")},15e3),e.lastPosition=u):(e.widget.style.left=e.lastPosition.x+"px",e.widget.style.top=e.lastPosition.y+"px",e.widget.style.transform=""),De()}e.isDragging=!1,o=!1}}function re(t){return!(t.length<8||/\s/.test(t)||!/[A-Z]/.test(t)||!/[a-z]/.test(t)||!/[0-9]/.test(t)||!/[^A-Za-z0-9]/.test(t))}const Ze='#editor button[aria-haspopup="dialog"]';function k(){if(!e.currentTutorSession)return;const t=C();t&&e.currentTutorSession.language!==t&&(e.currentTutorSession.language=t,h(e.currentTutorSession.element??null))}function ie(){const t=document.querySelector(Ze);if(t){if(t.dataset.tutorLangListener||(t.dataset.tutorLangListener="true",t.addEventListener("click",()=>{window.setTimeout(k,50)},{passive:!0})),e.languageObserverTarget===t&&e.languageObserver){k();return}e.languageObserver?.disconnect(),e.languageObserverTarget=t,e.languageObserver=new MutationObserver(()=>{k()}),e.languageObserver.observe(t,{childList:!0,characterData:!0,subtree:!0}),k()}}function ke(t,n,r){const o=r??H(),i=crypto.randomUUID();return{element:t,sessionId:i,userId:n,problem:o,problemUrl:M(window.location.href),language:C(),topics:We(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function se(){const t=await ee(),n=je(t),r=t?.userId??"";if(n&&await xe(),e.currentTutorSession&&e.currentTutorSession.element&&document.body.contains(e.currentTutorSession.element)){ie(),k(),_(e.currentTutorSession.element),$(),e.isWindowOpen=!0,e.currentTutorSession.element;const i=e.currentTutorSession.element.querySelector(".tutor-panel-content");i&&requestAnimationFrame(()=>{i.scrollTop=i.scrollHeight}),!r||n?(F(e.currentTutorSession.element),N(e.currentTutorSession.element,n?"session expired, please log back in":void 0)):D(e.currentTutorSession),B(),h(e.currentTutorSession.element);return}if(e.currentTutorSession?.userId){ut();try{await P(e.currentTutorSession.element??null,{force:!0})}finally{ct()}}if(!e.pendingStoredSession&&r){const i=await te(r,H());i&&oe(i,r,M(window.location.href))&&(e.pendingStoredSession=i)}if(e.pendingStoredSession){const i=Ce();Ie(i,e.pendingStoredSession),e.pendingStoredSession=null,ie(),k(),_(i),$(),e.isWindowOpen=!0,B(),!r||n?(F(i),N(i,n?"session expired, please log back in":void 0)):e.currentTutorSession&&D(e.currentTutorSession),h(i);return}const o=Ce();if(!o){console.log("There was an error creating a panel");return}e.currentTutorSession=ke(o,r),ie(),k(),_(o),$(),e.isWindowOpen=!0,B(),h(o),e.currentTutorSession&&(!r||n?(F(o),N(o,n?"session expired, please log back in":void 0)):(e.currentTutorSession.userId=r,D(e.currentTutorSession)),setTimeout(()=>{const i=o.querySelector(".tutor-panel-prompt");i&&(i.focus(),i.setSelectionRange(i.value.length,i.value.length))},100))}async function Je(t){if(e.summarizeInFlight||t.toSummarize.length===0)return;const n=t.toSummarize.splice(0);e.summarizeInFlight=!0;try{const r=await b.runtime.sendMessage({action:"summarize-history",payload:{sessionId:e.currentTutorSession?.sessionId??"",summarize:n,summary:t.summary}});if(q(e.currentTutorSession?.element??null,r,{silent:!0}))return;const o=typeof r=="string"?r:r?.reply;typeof o=="string"&&(t.summary=o)}finally{e.summarizeInFlight=!1}}function ae(t){if(t.qaHistory.length<=40)return;const n=t.qaHistory.splice(0,20);t.toSummarize.push(...n),Je(t)}async function D(t){if(t.sessionTopicsInitialized||!t.userId)return;(await b.runtime.sendMessage({action:"init-session-topics",payload:{sessionId:t.sessionId,topics:t.topics}}))?.success&&(t.sessionTopicsInitialized=!0,h(t.element??null))}const et="http://localhost:3000/auth/bridge",tt=960*60*1e3,nt=15e3;async function P(t,n){if(!e.currentTutorSession||!e.currentTutorSession.userId||e.sessionRestorePending&&!n?.force)return;const r=t?.querySelector(".tutor-panel-content")??e.currentTutorSession.element?.querySelector(".tutor-panel-content"),o=J(e.currentTutorSession.userId,e.currentTutorSession.problem),i={state:{sessionId:e.currentTutorSession.sessionId,userId:e.currentTutorSession.userId,content:e.currentTutorSession.content,sessionTopicsInitialized:e.currentTutorSession.sessionTopicsInitialized,language:e.currentTutorSession.language,problem:e.currentTutorSession.problem,problemUrl:e.currentTutorSession.problemUrl,topics:e.currentTutorSession.topics,prompt:e.currentTutorSession.prompt,position:e.currentTutorSession.position,size:e.currentTutorSession.size,guideModeEnabled:e.currentTutorSession.guideModeEnabled,checkModeEnabled:e.currentTutorSession.checkModeEnabled,rollingStateGuideMode:e.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:e.currentTutorSession.sessionRollingHistory},panelOpen:e.isWindowOpen,contentHtml:r?.innerHTML??"",contentScrollTop:r?.scrollTop??0,lastActivityAt:e.lastActivityAt};await b.storage.local.set({[o]:i})}function h(t){e.sessionRestorePending||e.persistTimerId||(e.persistTimerId=window.setTimeout(()=>{e.persistTimerId=null,P(t)},500))}function Ie(t,n){e.currentTutorSession={...n.state,element:t},e.currentTutorSession&&!e.currentTutorSession.language&&(e.currentTutorSession.language=C()),e.currentTutorSession&&e.currentTutorSession.sessionTopicsInitialized==null&&(e.currentTutorSession.sessionTopicsInitialized=!1);const r=t.querySelector(".tutor-panel-content");r&&(r.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{r.scrollTop=r.scrollHeight}));const o=t.querySelector(".tutor-panel-prompt");o&&(o.value=e.currentTutorSession.prompt??""),e.currentTutorSession.position&&(t.style.left=`${e.currentTutorSession.position.x}px`,t.style.top=`${e.currentTutorSession.position.y}px`),e.currentTutorSession.size&&(t.style.width=`${e.currentTutorSession.size.width}px`,t.style.height=`${e.currentTutorSession.size.height}px`);const i=t.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const s=i[i.length-1],a=s.querySelectorAll(".guide-item");e.guideMessageCount=a.length,e.lastGuideMessageEl=s,e.guideActiveSlab=e.currentTutorSession?.guideModeEnabled?s:null}else{const s=t.querySelectorAll(".guide-wrapper");e.guideMessageCount=s.length,e.lastGuideMessageEl=s.length>0?s[s.length-1]:null,e.guideActiveSlab=null}}function ot(t,n,r){le();const o=t.querySelector(".tutor-panel-content");o&&(o.innerHTML="");const i=t.querySelector(".tutor-panel-prompt");i&&(i.value=""),e.currentTutorSession=ke(t,n,r),e.currentTutorSession&&D(e.currentTutorSession)}async function Ee(){const t=await ee();if(!t?.userId){e.pendingStoredSession=null;return}const n=await te(t.userId,H());if(!n){e.pendingStoredSession=null;return}if(!oe(n,t.userId,M(window.location.href))){await ne(t.userId,n.state.problem),e.pendingStoredSession=null;return}e.pendingStoredSession=n,e.lastActivityAt=n.lastActivityAt??Date.now()}function B(){e.lastActivityAt=Date.now(),Date.now()-e.lastActivityStoredAt>nt&&(e.lastActivityStoredAt=Date.now(),h())}async function rt(){if(e.currentTutorSession?.element&&(await P(e.currentTutorSession.element,{force:!0}),e.sessionRestorePending=!0),await xe(),e.currentTutorSession&&(e.currentTutorSession.guideModeEnabled=!1,e.currentTutorSession.checkModeEnabled=!1),e.currentTutorSession?.element){const t=e.currentTutorSession.element;ce(),t.classList.remove("guidemode-active","checkmode-active"),F(t),N(t,"session expired, please log back in")}}function it(){const t=()=>B(),n=["mousemove","keydown","click","scroll","input"];for(const r of n)document.addEventListener(r,t,{passive:!0});e.inactivityTimerId&&window.clearInterval(e.inactivityTimerId),e.inactivityTimerId=window.setInterval(async()=>{Date.now()-e.lastActivityAt<tt||!(await ee())?.userId||await rt()},6e4)}function le(){e.guideMinIdx=Number.POSITIVE_INFINITY,e.guideMaxIdx=-1,e.guideBatchTimerId=null,e.guideBatchStarted=!1,e.guideTouchedLines=new Set,e.maxLines=0,e.guideAttachAttempts=0,e.guideDrainInFlight=!1,e.lastGuideSelectionLine=null,e.lastGuideFlushLine=null,e.lastGuideFlushAt=0,e.guideMessageCount=0,e.lastGuideMessageEl=null,e.guideActiveSlab=null}function st(t){e.queue=[],e.flushInFlight=!1,le(),ce(),t.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),e.currentTutorSession&&(e.currentTutorSession.guideModeEnabled=!1,e.currentTutorSession.checkModeEnabled=!1),t.classList.remove("guidemode-active","checkmode-active"),t.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),t.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function F(t){t.classList.add("tutor-panel-locked"),U(t,!0)}function Le(t){t.classList.remove("tutor-panel-locked"),U(t,!1)}const Ae="session expired, please log back in";function at(t){return typeof t=="object"&&t!==null&&t.success===!1}function lt(t){const n=t.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(o=>{o.textContent?.trim()===Ae&&o.remove()})}function Me(t,n){const r=t.querySelector(".tutor-panel-content");if(!r)return;const o=G(t,n,"assistant");o&&(r.scrollTop=o.offsetTop,h(t))}function q(t,n,r){if(!at(n))return!1;if(r?.silent)return!0;const o=t??e.currentTutorSession?.element??null;if(!o)return!0;if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return F(o),N(o,Ae),e.isWindowOpen||(_(o),$(),e.isWindowOpen=!0,B(),h(o)),lt(o),!0;if(n.timeout)return Me(o,r?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const i=r?.serverMessage??"Internal server error. Please try again in a moment.";return r?.lockOnServerError===!0&&F(o),Me(o,i),!0}function ut(){if(document.getElementById("tutor-panel-loading"))return;const t=document.createElement("div");t.id="tutor-panel-loading",t.className="tutor-panel-loading",t.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(t)}function ct(){document.getElementById("tutor-panel-loading")?.remove()}async function dt(t){e.currentTutorSession?.userId&&e.currentTutorSession.element&&await P(e.currentTutorSession.element,{force:!0}),e.pendingStoredSession=null,le();const n=e.isWindowOpen;e.currentTutorSession?.element&&e.currentTutorSession.element.remove(),e.currentTutorSession=null,e.isWindowOpen=!1,Fe(),await Ee(),n&&se()}function pt(){e.problemUrlWatcherId&&window.clearInterval(e.problemUrlWatcherId),e.problemUrlWatcherId=window.setInterval(()=>{const t=M(window.location.href);t!==e.lastCanonicalProblemUrl&&(e.lastCanonicalProblemUrl=t,dt())},1e3)}function N(t,n){const r=t.querySelector(".tutor-panel-auth");if(r){if(n){const l=r.querySelector(".auth-error");l&&(l.textContent=n,l.style.display="block")}return}e.suspendPanelOps=!0,st(t);const o=document.createElement("div");o.className="tutor-panel-auth",t.appendChild(o);const i=(l,u)=>{if(!l||!u)return;const p=()=>{const d=l.type==="password";u.setAttribute("aria-label",d?"Show password":"Hide password")};u.addEventListener("click",()=>{l.type=l.type==="password"?"text":"password",p(),l.focus(),l.setSelectionRange(l.value.length,l.value.length)}),p()},s=async l=>{const u=e.currentTutorSession?.userId??"",p=e.currentTutorSession?.problem??H();if(e.suspendPanelOps=!1,u&&u===l){e.sessionRestorePending=!1,Le(t),o.remove(),h(t);return}u&&u!==l&&(await P(t,{force:!0}),ot(t,l,p));const d=await te(l,p);d&&oe(d,l,M(window.location.href))?(Ie(t,d),await ne(l,d.state.problem),e.pendingStoredSession=null):d&&await ne(l,d.state.problem),e.currentTutorSession&&(e.currentTutorSession.userId=l,D(e.currentTutorSession)),e.sessionRestorePending=!1,Le(t),o.remove(),h(t)},a=l=>{o.innerHTML=`
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
    `;const u=o.querySelector(".auth-email"),p=o.querySelector(".auth-password"),d=o.querySelector(".auth-login"),f=o.querySelector(".auth-signup"),T=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error");l&&m&&(m.textContent=l,m.style.display="block");const S=()=>{m&&(m.style.display="none")};u?.addEventListener("input",S),p?.addEventListener("input",S),i(p,T),d?.addEventListener("click",async()=>{const y=u?.value.trim()??"",E=p?.value.trim()??"";if(!y||!E)return;const g=await b.runtime.sendMessage({action:"supabase-login",payload:{email:y,password:E}});if(g?.success===!1){m&&(m.textContent=g.error||"Internal server error",m.style.display="block");return}g?.userId&&g?.jwt?await s(g.userId):m&&(m.textContent="Invalid creds",m.style.display="block")}),f?.addEventListener("click",()=>{c()})},c=()=>{o.innerHTML=`
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
    `;const l=o.querySelector(".auth-first-name"),u=o.querySelector(".auth-last-name"),p=o.querySelector(".auth-email"),d=o.querySelector(".auth-password"),f=o.querySelector(".auth-signup-submit"),T=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error"),S=o.querySelector(".auth-password-hint"),y=()=>{m&&(m.style.display="none")};l?.addEventListener("input",y),u?.addEventListener("input",y),p?.addEventListener("input",y),d?.addEventListener("input",y),i(d,T),d?.addEventListener("blur",()=>{if(!S||!d)return;const g=d.value.trim();g&&!re(g)?(S.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",S.style.display="block"):S.style.display="none"}),d?.addEventListener("input",()=>{if(!S||!d)return;const g=d.value.trim();g&&re(g)&&(S.style.display="none")}),f?.addEventListener("click",async()=>{const g=l?.value.trim()??"",w=u?.value.trim()??"",x=p?.value.trim()??"",v=d?.value.trim()??"";if(!g||!w||!x||!v)return;if(!re(v)){S&&(S.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",S.style.display="block");return}const L=await b.runtime.sendMessage({action:"supabase-signup",payload:{fname:g,lname:w,email:x,password:v}});if(L?.success===!1){m&&(m.textContent=L.error||"Internal server error",m.style.display="block");return}L?.requiresVerification?a("Waiting for verification, check email"):L?.userId&&L?.jwt?await s(L.userId):m&&(m.style.display="block")}),o.querySelector(".auth-back")?.addEventListener("click",()=>{a()})};a(n)}function Ce(){document.getElementById("tutor-panel")?.remove();const t=document.createElement("div");t.id="tutor-panel",t.classList.add("tutor-panel"),t.innerHTML=`
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
  `,t.style.position="fixed",t.style.zIndex="1000000",t.style.left="50%",t.style.top="50%",t.style.right="50%",t.style.bottom="50%",document.body.appendChild(t);const n=40,r=Math.round(window.innerHeight*.38),o=window.innerWidth-t.offsetWidth-20,i=window.innerHeight-t.offsetHeight-20;return t.style.left=`${Math.max(20,Math.min(n,o))}px`,t.style.top=`${Math.max(20,Math.min(r,i))}px`,setTimeout(()=>t.classList.add("open"),10),Tt(t),t}function Pe(){e.currentTutorSession?.element&&(St(e.currentTutorSession.element),wt(e.currentTutorSession.element),Fe(),e.isWindowOpen=!1,h(e.currentTutorSession.element))}function At(t){}function $(){e.widget&&(e.widget.style.display="none")}function Fe(){e.widget&&(e.widget.style.display="block")}async function De(){}async function gt(){}function O(){return document.querySelector(".monaco-editor textarea.inputarea")}function Be(t,n){return t.slice(0,Math.max(0,n)).split(`
`).length}function W(){e.guideTouchedLines.clear(),e.guideMinIdx=Number.POSITIVE_INFINITY,e.guideMaxIdx=-1,e.guideBatchStarted=!1,e.guideBatchTimerId!==null&&(window.clearTimeout(e.guideBatchTimerId),e.guideBatchTimerId=null)}async function ue(t){const n=yt(),o=O()?.value??"",i=Array.from(e.guideTouchedLines)[0]??1;if(!i){W();return}const s=Date.now();if(e.lastGuideFlushLine===i&&s-e.lastGuideFlushAt<250)return;if(e.lastGuideFlushLine=i,e.lastGuideFlushAt=s,!n){W();return}let a="";if(o&&(a=qe(o,i)),!a.trim()&&i>1&&o){const l=qe(o,i-1);l.trim()&&(a=l)}let c=n;try{const l=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});l?.ok&&typeof l.code=="string"&&(c=l.code)}catch{}mt(a)&&(e.queue.push([c,a]),ft()),W()}function mt(t){const n=t.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function qe(t,n){return t.split(`
`)[n-1]??""}async function ft(){if(!e.guideDrainInFlight){if(e.suspendPanelOps){e.queue=[];return}e.guideDrainInFlight=!0;try{for(;e.queue.length>0;){if(e.suspendPanelOps){e.queue=[];break}const[t,n]=e.queue.shift();console.log("This is the focus line: ",n),console.log("the code so far: ",t),k(),e.flushInFlight=!0;const r=await b.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:e.currentTutorSession?.sessionId??"",problem:e.currentTutorSession?.problem??"",topics:e.currentTutorSession?.topics,code:t,focusLine:n,language:e.currentTutorSession?.language??C(),rollingStateGuideMode:e.currentTutorSession?.rollingStateGuideMode}});if(q(e.currentTutorSession?.element??null,r,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){e.flushInFlight=!1;continue}if(!r)console.log("failure for guide mode");else{const o=r.success?r.reply:null;o?.state_update?.lastEdit?.trim()&&e.currentTutorSession&&(e.currentTutorSession.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const i=o?.nudge;if(e.currentTutorSession&&typeof i=="string"){const a=i.trim();a&&(e.currentTutorSession.rollingStateGuideMode.nudges.push(a),e.currentTutorSession.content.push(`${a}
`),e.currentTutorSession.element!=null&&await pe(e.currentTutorSession.element,"","guideAssistant",a),h(e.currentTutorSession.element??null))}const s=o?.topics;if(s&&typeof s=="object"&&e.currentTutorSession)for(const[a,c]of Object.entries(s)){if(!c||typeof c!="object")continue;const l=he(e.currentTutorSession.topics,a),u=c.thoughts_to_remember,p=c.pitfalls,d=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[],f=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[];e.currentTutorSession&&(d.length>0&&e.currentTutorSession.topics[l].thoughts_to_remember.push(...d),f.length>0&&e.currentTutorSession.topics[l].pitfalls.push(...f))}e.currentTutorSession?.element&&h(e.currentTutorSession.element),e.flushInFlight=!1}}}finally{e.guideDrainInFlight=!1}}}function Ne(){if(!e.currentTutorSession?.guideModeEnabled)return;const t=O();if(!t)return;const n=t.value??"",r=t.selectionStart??0,o=Be(n,r);!e.guideTouchedLines.has(o)&&e.guideTouchedLines.size==0&&e.guideTouchedLines.add(o),e.guideBatchStarted||(e.guideBatchStarted=!0),e.guideBatchTimerId!==null&&window.clearTimeout(e.guideBatchTimerId),e.guideBatchTimerId=window.setTimeout(()=>{ue()},1e4),!e.guideTouchedLines.has(o)&&e.guideTouchedLines.size==1&&ue()}function Oe(){if(!e.currentTutorSession?.guideModeEnabled||!e.guideBatchStarted)return;const t=O();if(!t)return;const n=t.value??"",r=t.selectionStart??0,o=Be(n,r);if(e.lastGuideSelectionLine===null){e.lastGuideSelectionLine=o;return}o!==e.lastGuideSelectionLine&&(e.lastGuideSelectionLine=o,!e.guideTouchedLines.has(o)&&e.guideTouchedLines.size==1&&ue())}function ze(){const t=O();if(!t){e.guideAttachAttempts<5&&(e.guideAttachAttempts+=1,window.setTimeout(ze,500));return}t.addEventListener("input",Ne),document.addEventListener("selectionchange",Oe)}function ce(){const t=O();t&&(t.removeEventListener("input",Ne),document.removeEventListener("selectionchange",Oe))}function Mt(){}function ht(t){const n=t.querySelector(".tutor-panel-content");if(!n)return null;const r=document.createElement("div");r.className="tutor-panel-assistant-loading";const o=document.createElement("div");return o.className="tutor-panel-assistant-loading-dot",r.appendChild(o),n.appendChild(r),n.scrollTop=r.offsetTop,r}async function bt(t,n){const r=ht(t),o=e.currentTutorSession?.language||C(),i=await b.runtime.sendMessage({action:"ask-anything",payload:{sessionId:e.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:e.currentTutorSession?.sessionRollingHistory.qaHistory,summary:e.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:o}});if(q(t,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return r?.remove(),"Failure";const s=typeof i=="string"?i:i?.reply;return typeof s=="string"&&s.trim()&&(r?.remove(),pe(t,"","assistant",s)),r?.remove(),s||"Failure"}function _(t){e.panelHideTimerId!==null&&(window.clearTimeout(e.panelHideTimerId),e.panelHideTimerId=null),t.classList.remove("closing"),t.style.display="flex",t.classList.add("open")}function St(t){t.classList.remove("open"),t.classList.add("closing"),e.panelHideTimerId!==null&&window.clearTimeout(e.panelHideTimerId),e.panelHideTimerId=window.setTimeout(()=>{t.style.display="none",t.classList.remove("closing"),e.panelHideTimerId=null},180)}function wt(t){if(!e.widget)return;const n=t.getBoundingClientRect(),r=e.widget.getBoundingClientRect(),o=r.width||50,i=r.height||50,c=n.left+n.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,l=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));e.widget.style.left=`${c}px`,e.widget.style.top=`${l}px`,e.widget.style.right="auto",e.widget.style.bottom="auto",e.widget.style.transform="",e.lastPosition={x:c,y:l},De()}function yt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function G(t,n,r){const o=t.querySelector(".tutor-panel-content");if(!o)return null;const i=document.createElement("div");if(r==="assistant")i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n);else if(r==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(r==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n),s.appendChild(i),o.appendChild(s),s}else if(r==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n),s.appendChild(i),o.appendChild(s),s}else i.textContent=n;return o.append(i),o.scrollTop=i.offsetTop,i}function He(t,n){const r=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=t.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function U(t,n){const r=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=t.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function de(t,n,r,o){return new Promise(i=>{let s=0;const a=2,c=t.offsetTop;n.scrollTop=c;let l=!0;const u=()=>{Math.abs(n.scrollTop-c)>8&&(l=!1)};n.addEventListener("scroll",u,{passive:!0});const p=()=>{s=Math.min(r.length,s+a);const d=r.slice(0,s);o?.render?t.innerHTML=o.render(d):t.textContent=d,l&&(n.scrollTop=c),s<r.length?window.setTimeout(p,12):(n.removeEventListener("scroll",u),i())};p()})}async function pe(t,n,r,o){const i=Ge(o),s=t.querySelector(".tutor-panel-content");if(s&&typeof o=="string"){if(r==="assistant"){const a=G(t,"","assistant");if(!a)return;await de(a,s,i,{render:I}),a.innerHTML=I(i),e.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${o}`),e.currentTutorSession&&ae(e.currentTutorSession.sessionRollingHistory),s.scrollTop=a.offsetTop,h(t)}else if(r==="guideAssistant"){let a=e.guideActiveSlab&&s.contains(e.guideActiveSlab)?e.guideActiveSlab:null;if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const u=document.createElement("ul");u.className="guide-list",a.appendChild(u),s.appendChild(a),e.guideActiveSlab=a}const c=a.querySelector(".guide-list")??document.createElement("ul");c.classList.contains("guide-list")||(c.className="guide-list",a.appendChild(c));const l=document.createElement("li");l.className="guide-item",c.appendChild(l),e.guideMessageCount===0&&a.classList.add("guide-start"),e.guideMessageCount+=1,e.lastGuideMessageEl=a,await de(l,s,i,{render:I}),l.innerHTML=I(i),s.scrollTop=a.offsetTop,h(t)}else if(r==="checkAssistant"){const a=G(t,"","checkAssistant");if(!a)return;const c=a.querySelector(".tutor-panel-message--checkAssistant");if(!c)return;a.classList.add("check-start"),await de(c,s,i,{render:I}),c.innerHTML=I(i),a.classList.add("check-end"),s.scrollTop=a.offsetTop,e.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${o}`),e.currentTutorSession&&ae(e.currentTutorSession.sessionRollingHistory),h(t)}}}async function xt(t,n){try{k();const r=await b.runtime.sendMessage({action:"check-code",payload:{sessionId:e.currentTutorSession?.sessionId??"",topics:e.currentTutorSession?.topics,code:n,action:"check-code",language:e.currentTutorSession?.language??C(),problem_no:be(e.currentTutorSession?.problem??""),problem_name:e.currentTutorSession?.problem??"",problem_url:e.currentTutorSession?.problemUrl??""}});if(q(t,r,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const o=r?.resp;e.currentTutorSession&&typeof o=="string"&&e.currentTutorSession.content.push(`${o}
`),typeof o=="string"&&o.trim()&&await pe(t,"","checkAssistant",o);const i=r?.topics;if(i&&typeof i=="object"&&e.currentTutorSession)for(const[s,a]of Object.entries(i)){if(!a||typeof a!="object")continue;const c=he(e.currentTutorSession.topics,s),l=a.thoughts_to_remember,u=a.pitfalls,p=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[],d=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[];e.currentTutorSession&&(p.length>0&&e.currentTutorSession.topics[c].thoughts_to_remember.push(...p),d.length>0&&e.currentTutorSession.topics[c].pitfalls.push(...d))}return console.log("this is the object now: ",e.currentTutorSession?.topics),h(t),r?.resp}catch(r){return console.error("checkMode failed",r),"Failure"}}function Tt(t){const n=t.querySelector(".tutor-panel-close"),r=t.querySelector(".btn-help-mode"),o=t.querySelector(".btn-guide-mode"),i=t.querySelector(".btn-gotToWorkspace");o?.addEventListener("click",()=>{if(!e.currentTutorSession)return;e.currentTutorSession.guideModeEnabled=!e.currentTutorSession.guideModeEnabled;const g=t.querySelector(".btn-guide-mode");if(e.currentTutorSession.userId){const w=e.currentTutorSession.problem,x=be(w);b.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:e.currentTutorSession.guideModeEnabled,sessionId:e.currentTutorSession.sessionId,problem_no:x,problem_name:w,problem_url:e.currentTutorSession.problemUrl}})}He(t,!0),t.classList.add("guidemode-active"),e.currentTutorSession.guideModeEnabled?(g?.classList.add("is-loading"),e.guideMessageCount=0,e.lastGuideMessageEl=null,e.guideActiveSlab=null,ze()):(ce(),e.lastGuideMessageEl&&e.lastGuideMessageEl.classList.add("guide-end"),He(t,!1),t.classList.remove("guidemode-active"),g?.classList.remove("is-loading")),h(t)}),i?.addEventListener("click",async()=>{const g=await b.runtime.sendMessage({action:"go-to-workspace",payload:{url:et}});q(t,g,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const s=t.querySelector(".tutor-panel-prompt"),a=t.querySelector(".tutor-panel-send");s?.addEventListener("keydown",async g=>{g.key!=="Enter"||g.shiftKey||(g.preventDefault(),a?.click())}),a?.addEventListener("click",async()=>{if(k(),e.currentTutorSession?.prompt){const g=e.currentTutorSession.prompt;s&&(s.value=""),e.currentTutorSession&&(e.currentTutorSession.prompt=""),G(t,g,"user"),e.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${g}`),ae(e.currentTutorSession.sessionRollingHistory),h(t),await bt(t,g),e.currentTutorSession.prompt="",h(t)}else return void 0}),n?.addEventListener("mousedown",g=>{g.stopPropagation()}),n?.addEventListener("click",async()=>Pe()),r?.addEventListener("click",async()=>{const g=t.querySelector(".btn-help-mode");let w="";e.currentTutorSession&&(e.currentTutorSession.checkModeEnabled=!0,g?.classList.add("is-loading")),U(t,!0),t.classList.add("checkmode-active");try{const x=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});x?.ok&&typeof x.code=="string"&&e.currentTutorSession&&(w=x.code);const v=await xt(t,w);console.log("this is the response: ",v)}catch{}finally{e.currentTutorSession&&(e.currentTutorSession.checkModeEnabled=!1,g?.classList.remove("is-loading")),U(t,!1),t.classList.remove("checkmode-active"),h(t)}}),s?.addEventListener("input",()=>{e.currentTutorSession&&(e.currentTutorSession.prompt=s.value),h(t)});let c=!1,l=0,u=0,p=0,d=0,f=null;const T=.6,m=t.querySelector(".tutor-panel-shellbar"),S=()=>{if(!c){f=null;return}const g=t.offsetLeft,w=t.offsetTop,x=g+(p-g)*T,v=w+(d-w)*T;t.style.left=`${x}px`,t.style.top=`${v}px`,f=requestAnimationFrame(S)},y=g=>{if(!c)return;const w=g.clientX-l,x=g.clientY-u,v=window.innerWidth-t.offsetWidth,L=window.innerHeight-t.offsetHeight;p=Math.max(10,Math.min(w,v)),d=Math.max(10,Math.min(x,L)),f===null&&(f=requestAnimationFrame(S))},E=()=>{c&&(c=!1,document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",E),f!==null&&(cancelAnimationFrame(f),f=null),t.style.left=`${p}px`,t.style.top=`${d}px`,e.currentTutorSession&&(e.currentTutorSession.position={x:t.offsetLeft,y:t.offsetTop}),h(t))};m?.addEventListener("mousedown",g=>{g.preventDefault(),c=!0,l=g.clientX-t.getBoundingClientRect().left,u=g.clientY-t.getBoundingClientRect().top,p=t.offsetLeft,d=t.offsetTop,document.addEventListener("mousemove",y),document.addEventListener("mouseup",E)})}function Y(t,...n){}const vt={debug:(...t)=>Y(console.debug,...t),log:(...t)=>Y(console.log,...t),warn:(...t)=>Y(console.warn,...t),error:(...t)=>Y(console.error,...t)};class ge extends Event{constructor(n,r){super(ge.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=r}static EVENT_NAME=me("wxt:locationchange")}function me(t){return`${b?.runtime?.id}:content:${t}`}function kt(t){let n,r;return{run(){n==null&&(r=new URL(location.href),n=t.setInterval(()=>{let o=new URL(location.href);o.href!==r.href&&(window.dispatchEvent(new ge(o,r)),r=o)},1e3))}}}class j{constructor(n,r){this.contentScriptName=n,this.options=r,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=me("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=kt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,r){const o=setInterval(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(n,r){const o=setTimeout(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(n){const r=requestAnimationFrame((...o)=>{this.isValid&&n(...o)});return this.onInvalidated(()=>cancelAnimationFrame(r)),r}requestIdleCallback(n,r){const o=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},r);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(n,r,o,i){r==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(r.startsWith("wxt:")?me(r):r,o,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),vt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:j.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const r=n.data?.type===j.SCRIPT_STARTED_MESSAGE_TYPE,o=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return r&&o&&i}listenForNewerScripts(n){let r=!0;const o=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=r;if(r=!1,s&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function Ct(){}function X(t,...n){}const It={debug:(...t)=>X(console.debug,...t),log:(...t)=>X(console.log,...t),warn:(...t)=>X(console.warn,...t),error:(...t)=>X(console.error,...t)};return(async()=>{try{const{main:t,...n}=Ve,r=new j("content",n);return await t(r)}catch(t){throw It.error('The content script "content" crashed on startup!',t),t}})()})();
content;