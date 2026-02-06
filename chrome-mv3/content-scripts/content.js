var content=(function(){"use strict";function Nt(e){return e}const $e=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],fe={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function V(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const H=new Map($e.map(e=>[V(e),fe[e]??e]));Object.values(fe).forEach(e=>{H.set(V(e),e)});function We(e){return e.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function K(e){const n=V(e);if(!n)return e.trim();const r=H.get(n);if(r)return r;const o=n.split(" ");if(o.length>0){const i=o[o.length-1];if(i.endsWith("s")){o[o.length-1]=i.slice(0,-1);const s=o.join(" "),a=H.get(s);if(a)return a}else{o[o.length-1]=`${i}s`;const s=o.join(" "),a=H.get(s);if(a)return a}}return We(n)}function he(e,n){const r=K(n),o=Object.keys(e).find(i=>K(i)===r);return o&&o!==r&&(e[r]=e[o],delete e[o]),e[r]??={thoughts_to_remember:[],pitfalls:[]},r}function M(e){try{const{origin:n,pathname:r}=new URL(e),o=r.match(/^\/problems\/[^/]+/);return o?`${n}${o[0]}`:`${n}${r}`}catch{return e}}function O(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function be(e){const n=e.match(/^\s*(\d+)/);if(!n)return null;const r=Number(n[1]);return Number.isFinite(r)?r:null}function Ge(){const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(r=>r.getAttribute("href")).filter(r=>!!r).map(r=>r.replace("/tag/","").replace("/","")).map(r=>K(r));return Object.fromEntries(Array.from(new Set(n)).map(r=>[r,{thoughts_to_remember:[],pitfalls:[]}]))}function C(){const e=document.querySelector("#editor");if(!e)return"";const n=e.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(o=>o.nodeType===Node.TEXT_NODE&&o.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}const S=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function _e(e){return S.runtime.sendMessage({action:"summarize-history",payload:e})}function Ue(e){return S.runtime.sendMessage({action:"init-session-topics",payload:e})}function Ye(e){return S.runtime.sendMessage({action:"guide-mode",payload:e})}function je(e){return S.runtime.sendMessage({action:"guide-mode-status",payload:e})}function Xe(e){return S.runtime.sendMessage({action:"check-code",payload:e})}function Ve(e){return S.runtime.sendMessage({action:"ask-anything",payload:e})}function Ke(e){return S.runtime.sendMessage({action:"go-to-workspace",payload:e})}function Qe(e){return S.runtime.sendMessage({action:"supabase-login",payload:e})}function Ze(e){return S.runtime.sendMessage({action:"supabase-signup",payload:e})}function Se(){return S.runtime.sendMessage({type:"GET_MONACO_CODE"})}const t={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null},Q="vibetutor-auth",we="vibetutor-session",ye=1440*60*1e3,Je=1800*1e3,et=`${we}:`;let Z=null;function J(e,n){return`${we}:${encodeURIComponent(e)}:${encodeURIComponent(n)}`}async function ee(){return(await S.storage.local.get(Q))[Q]??null}function tt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function xe(){await S.storage.local.remove(Q),await S.runtime.sendMessage({action:"clear-auth"})}async function te(e,n){const r=J(e,n),i=(await S.storage.local.get(r))[r]??null;return i?Date.now()-(i.lastActivityAt??0)>ye?(await S.storage.local.remove(r),null):i:null}async function ne(e,n){const r=J(e,n);await S.storage.local.remove(r)}async function Te(){const e=await S.storage.local.get(null),n=Date.now(),r=[];for(const[o,i]of Object.entries(e)){if(!o.startsWith(et))continue;const a=i?.lastActivityAt??0;n-a>ye&&r.push(o)}r.length>0&&await S.storage.local.remove(r)}function nt(){Te(),Z&&window.clearInterval(Z),Z=window.setInterval(()=>{Te()},Je)}function oe(e,n,r){return e.state.userId?e.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):e.state.problemUrl===r:(console.log("There was no stored user in the browser."),!1)}async function P(e,n){if(!t.currentTutorSession||!t.currentTutorSession.userId||t.sessionRestorePending&&!n?.force)return;const r=e?.querySelector(".tutor-panel-content")??t.currentTutorSession.element?.querySelector(".tutor-panel-content"),o=J(t.currentTutorSession.userId,t.currentTutorSession.problem),i={state:{sessionId:t.currentTutorSession.sessionId,userId:t.currentTutorSession.userId,content:t.currentTutorSession.content,sessionTopicsInitialized:t.currentTutorSession.sessionTopicsInitialized,language:t.currentTutorSession.language,problem:t.currentTutorSession.problem,problemUrl:t.currentTutorSession.problemUrl,topics:t.currentTutorSession.topics,prompt:t.currentTutorSession.prompt,position:t.currentTutorSession.position,size:t.currentTutorSession.size,guideModeEnabled:t.currentTutorSession.guideModeEnabled,checkModeEnabled:t.currentTutorSession.checkModeEnabled,rollingStateGuideMode:t.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:t.currentTutorSession.sessionRollingHistory},panelOpen:t.isWindowOpen,contentHtml:r?.innerHTML??"",contentScrollTop:r?.scrollTop??0,lastActivityAt:t.lastActivityAt};await S.storage.local.set({[o]:i})}function h(e){t.sessionRestorePending||t.persistTimerId||(t.persistTimerId=window.setTimeout(()=>{t.persistTimerId=null,P(e)},500))}function ve(e,n){t.currentTutorSession={...n.state,element:e},t.currentTutorSession&&!t.currentTutorSession.language&&(t.currentTutorSession.language=C()),t.currentTutorSession&&t.currentTutorSession.sessionTopicsInitialized==null&&(t.currentTutorSession.sessionTopicsInitialized=!1);const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{r.scrollTop=r.scrollHeight}));const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=t.currentTutorSession.prompt??""),t.currentTutorSession.position&&(e.style.left=`${t.currentTutorSession.position.x}px`,e.style.top=`${t.currentTutorSession.position.y}px`),t.currentTutorSession.size&&(e.style.width=`${t.currentTutorSession.size.width}px`,e.style.height=`${t.currentTutorSession.size.height}px`);const i=e.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const s=i[i.length-1],a=s.querySelectorAll(".guide-item");t.guideMessageCount=a.length,t.lastGuideMessageEl=s,t.guideActiveSlab=t.currentTutorSession?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");t.guideMessageCount=s.length,t.lastGuideMessageEl=s.length>0?s[s.length-1]:null,t.guideActiveSlab=null}}async function ke(){const e=await ee();if(!e?.userId){t.pendingStoredSession=null;return}const n=await te(e.userId,O());if(!n){t.pendingStoredSession=null;return}if(!oe(n,e.userId,M(window.location.href))){await ne(e.userId,n.state.problem),t.pendingStoredSession=null;return}t.pendingStoredSession=n,t.lastActivityAt=n.lastActivityAt??Date.now()}function A(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e){const n=e.split("`"),r=o=>{const i=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,c;for(;(c=i.exec(o))!==null;){s+=A(o.slice(a,c.index));const u=c[1];u.startsWith("**")?s+=`<strong>${A(u.slice(2,-2))}</strong>`:s+=`<code>${A(u.slice(1,-1))}</code>`,a=i.lastIndex}return s+=A(o.slice(a)),s};return n.map((o,i)=>i%2===1?`<code>${A(o)}</code>`:r(o)).join("")}function ot(e){const n=e.replace(/\r\n/g,`
`).split(`
`);let r="",o=[],i=null;const s=()=>{o.length!==0&&(r+=`<p>${R(o.join(" "))}</p>`,o=[])},a=()=>{i&&(r+=`</${i}>`,i=null)};for(const c of n){const u=c.trim();if(!u){s(),a();continue}const l=u.match(/^(#{1,3})\s+(.*)$/);if(l){s(),a();const f=l[1].length;r+=`<h${f}>${R(l[2])}</h${f}>`;continue}const p=u.match(/^(\d+)[.)]\s+(.*)$/);if(p){s(),i&&i!=="ol"&&a(),i||(i="ol",r+="<ol>"),r+=`<li>${R(p[2])}</li>`;continue}const d=u.match(/^[-*]\s+(.*)$/);if(d){s(),i&&i!=="ul"&&a(),i||(i="ul",r+="<ul>"),r+=`<li>${R(d[1])}</li>`;continue}o.push(u)}return s(),a(),r}function Ie(e){const n=e.split(`
`),r=c=>/^\s*\|?[-:\s|]+\|?\s*$/.test(c),o=c=>(c.match(/\|/g)?.length??0)>=2;let i=!1;const s=[];let a=0;for(;a<n.length;){const c=n[a];if(c.trim().startsWith("```")){i=!i,s.push(c),a+=1;continue}if(i){s.push(c),a+=1;continue}if(o(c)||r(c)){const u=[];for(;a<n.length;){const l=n[a];if(l.trim().startsWith("```")||!(o(l)||r(l)))break;u.push(l),a+=1}u.length>0&&(s.push("```table"),s.push(...u),s.push("```"));continue}s.push(c),a+=1}return s.join(`
`)}function rt(e){const n=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return Ie(e);const r=n[1].trim(),i=n[2].trim().split(";").map(c=>c.trim()).filter(Boolean);if(i.length===0)return e;const s=i.map(c=>`- ${c.replace(/\.$/,"")}`).join(`
`),a=`${r}

**To fix**
${s}`;return Ie(a)}function I(e){const n=e.replace(/\r\n/g,`
`),o=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,c;for(;(c=s.exec(o))!==null;)c.index>a&&i.push({type:"text",content:o.slice(a,c.index)}),i.push({type:"code",content:c[2]??"",lang:c[1]??""}),a=s.lastIndex;return a<o.length&&i.push({type:"text",content:o.slice(a)}),i.map(u=>{if(u.type==="code"){const l=u.lang?` data-lang="${A(u.lang)}"`:"";return`<pre${u.lang==="table"?' class="table-block"':""}><code${l}>${A(u.content.trimEnd())}</code></pre>`}return ot(u.content)}).join("")}const it={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Ee()}):Ee()}};function Ee(){console.log("The widget is being loaded to the page"),t.lastCanonicalProblemUrl=M(window.location.href),st(),vt(),ft(),Tt(),nt(),ke().then(()=>{t.pendingStoredSession?.panelOpen&&se()}),window.addEventListener("beforeunload",()=>{P(t.currentTutorSession?.element??null)})}function st(){const e=document.getElementById("tutor-widget");e&&e.remove(),t.widget=document.createElement("div"),t.widget.id="tutor-widget",t.widget.innerHTML=`
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

`,document.head.appendChild(n),document.body.appendChild(t.widget),at()}function at(){const e=document.getElementById("main-button");if(!e)return;let n=0,r={x:0,y:0},o=!1,i=!1;function s(l,p){if(!t.widget)return{x:l,y:p};const d={width:50,height:50},f=window.innerWidth,T=window.innerHeight,m=10;let b=Math.max(m,l);b=Math.min(f-d.width-m,b);let y=Math.max(m,p);return y=Math.min(T-d.height-m,y),{x:b,y}}function a(l,p){if(!t.widget)return{x:l,y:p};const d={width:50,height:50},f=window.innerWidth,T=window.innerHeight,m=20,b=l,y=f-(l+d.width),E=p,g=T-(p+d.height),w=Math.min(b,y,E,g);let x=l,v=p;return(l<0||l+d.width>f||p<0||p+d.height>T)&&(w===b?x=m:w===y?x=f-d.width-m:w===E?v=m:w===g&&(v=T-d.height-m)),{x,y:v}}e.addEventListener("mousedown",l=>{l.preventDefault(),n=Date.now(),r={x:l.clientX,y:l.clientY},o=!1;const p=t.widget.getBoundingClientRect();t.dragOffset.x=l.clientX-p.left,t.dragOffset.y=l.clientY-p.top,e.classList.add("dragging"),document.addEventListener("mousemove",c),document.addEventListener("mouseup",u)}),e.addEventListener("click",l=>{if(i){i=!1;return}!t.isDragging&&!o&&(l.preventDefault(),l.stopPropagation(),t.isWindowOpen?Fe():se())});function c(l){const p=Date.now()-n,d=Math.sqrt(Math.pow(l.clientX-r.x,2)+Math.pow(l.clientY-r.y,2));if(!t.isDragging&&(d>3||p>100)&&(t.isDragging=!0,o=!0,document.body.style.cursor="grabbing"),t.isDragging){const f=l.clientX-t.dragOffset.x,T=l.clientY-t.dragOffset.y,m=s(f,T);t.widget.style.transform=`translate(${m.x}px, ${m.y}px)`,t.widget.style.left="0",t.widget.style.top="0",t.lastPosition={x:m.x,y:m.y}}}function u(){if(document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",u),e&&e.classList.remove("dragging"),document.body.style.cursor="",t.isDragging){i=!0;const l=a(t.lastPosition.x,t.lastPosition.y);l.x!==t.lastPosition.x||l.y!==t.lastPosition.y?(t.widget.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",t.widget.style.left=l.x+"px",t.widget.style.top=l.y+"px",t.widget.style.transform="",setTimeout(()=>{t.widget&&(t.widget.style.transition="")},15e3),t.lastPosition=l):(t.widget.style.left=t.lastPosition.x+"px",t.widget.style.top=t.lastPosition.y+"px",t.widget.style.transform=""),Be()}t.isDragging=!1,o=!1}}function re(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}const ut='#editor button[aria-haspopup="dialog"]';function k(){if(!t.currentTutorSession)return;const e=C();e&&t.currentTutorSession.language!==e&&(t.currentTutorSession.language=e,h(t.currentTutorSession.element??null))}function ie(){const e=document.querySelector(ut);if(e){if(e.dataset.tutorLangListener||(e.dataset.tutorLangListener="true",e.addEventListener("click",()=>{window.setTimeout(k,50)},{passive:!0})),t.languageObserverTarget===e&&t.languageObserver){k();return}t.languageObserver?.disconnect(),t.languageObserverTarget=e,t.languageObserver=new MutationObserver(()=>{k()}),t.languageObserver.observe(e,{childList:!0,characterData:!0,subtree:!0}),k()}}function Le(e,n,r){const o=r??O(),i=crypto.randomUUID();return{element:e,sessionId:i,userId:n,problem:o,problemUrl:M(window.location.href),language:C(),topics:Ge(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function se(){const e=await ee(),n=tt(e),r=e?.userId??"";if(n&&await xe(),t.currentTutorSession&&t.currentTutorSession.element&&document.body.contains(t.currentTutorSession.element)){ie(),k(),G(t.currentTutorSession.element),$(),t.isWindowOpen=!0,t.currentTutorSession.element;const i=t.currentTutorSession.element.querySelector(".tutor-panel-content");i&&requestAnimationFrame(()=>{i.scrollTop=i.scrollHeight}),!r||n?(F(t.currentTutorSession.element),N(t.currentTutorSession.element,n?"session expired, please log back in":void 0)):D(t.currentTutorSession),B(),h(t.currentTutorSession.element);return}if(t.currentTutorSession?.userId){wt();try{await P(t.currentTutorSession.element??null,{force:!0})}finally{yt()}}if(!t.pendingStoredSession&&r){const i=await te(r,O());i&&oe(i,r,M(window.location.href))&&(t.pendingStoredSession=i)}if(t.pendingStoredSession){const i=Pe();ve(i,t.pendingStoredSession),t.pendingStoredSession=null,ie(),k(),G(i),$(),t.isWindowOpen=!0,B(),!r||n?(F(i),N(i,n?"session expired, please log back in":void 0)):t.currentTutorSession&&D(t.currentTutorSession),h(i);return}const o=Pe();if(!o){console.log("There was an error creating a panel");return}t.currentTutorSession=Le(o,r),ie(),k(),G(o),$(),t.isWindowOpen=!0,B(),h(o),t.currentTutorSession&&(!r||n?(F(o),N(o,n?"session expired, please log back in":void 0)):(t.currentTutorSession.userId=r,D(t.currentTutorSession)),setTimeout(()=>{const i=o.querySelector(".tutor-panel-prompt");i&&(i.focus(),i.setSelectionRange(i.value.length,i.value.length))},100))}async function lt(e){if(t.summarizeInFlight||e.toSummarize.length===0)return;const n=e.toSummarize.splice(0);t.summarizeInFlight=!0;try{const r=await _e({sessionId:t.currentTutorSession?.sessionId??"",summarize:n,summary:e.summary});if(q(t.currentTutorSession?.element??null,r,{silent:!0}))return;const o=typeof r=="string"?r:r?.reply;typeof o=="string"&&(e.summary=o)}finally{t.summarizeInFlight=!1}}function ae(e){if(e.qaHistory.length<=40)return;const n=e.qaHistory.splice(0,20);e.toSummarize.push(...n),lt(e)}async function D(e){if(e.sessionTopicsInitialized||!e.userId)return;(await Ue({sessionId:e.sessionId,topics:e.topics}))?.success&&(e.sessionTopicsInitialized=!0,h(e.element??null))}const ct="http://localhost:3000/auth/bridge",dt=960*60*1e3,pt=15e3;function gt(e,n,r){ue();const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML="");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=""),t.currentTutorSession=Le(e,n,r),t.currentTutorSession&&D(t.currentTutorSession)}function B(){t.lastActivityAt=Date.now(),Date.now()-t.lastActivityStoredAt>pt&&(t.lastActivityStoredAt=Date.now(),h())}async function mt(){if(t.currentTutorSession?.element&&(await P(t.currentTutorSession.element,{force:!0}),t.sessionRestorePending=!0),await xe(),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),t.currentTutorSession?.element){const e=t.currentTutorSession.element;ce(),e.classList.remove("guidemode-active","checkmode-active"),F(e),N(e,"session expired, please log back in")}}function ft(){const e=()=>B(),n=["mousemove","keydown","click","scroll","input"];for(const r of n)document.addEventListener(r,e,{passive:!0});t.inactivityTimerId&&window.clearInterval(t.inactivityTimerId),t.inactivityTimerId=window.setInterval(async()=>{Date.now()-t.lastActivityAt<dt||!(await ee())?.userId||await mt()},6e4)}function ue(){t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchTimerId=null,t.guideBatchStarted=!1,t.guideTouchedLines=new Set,t.maxLines=0,t.guideAttachAttempts=0,t.guideDrainInFlight=!1,t.lastGuideSelectionLine=null,t.lastGuideFlushLine=null,t.lastGuideFlushAt=0,t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null}function ht(e){t.queue=[],t.flushInFlight=!1,ue(),ce(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function F(e){e.classList.add("tutor-panel-locked"),U(e,!0)}function Ae(e){e.classList.remove("tutor-panel-locked"),U(e,!1)}const Me="session expired, please log back in";function bt(e){return typeof e=="object"&&e!==null&&e.success===!1}function St(e){const n=e.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(o=>{o.textContent?.trim()===Me&&o.remove()})}function Ce(e,n){const r=e.querySelector(".tutor-panel-content");if(!r)return;const o=_(e,n,"assistant");o&&(r.scrollTop=o.offsetTop,h(e))}function q(e,n,r){if(!bt(n))return!1;if(r?.silent)return!0;const o=e??t.currentTutorSession?.element??null;if(!o)return!0;if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return F(o),N(o,Me),t.isWindowOpen||(G(o),$(),t.isWindowOpen=!0,B(),h(o)),St(o),!0;if(n.timeout)return Ce(o,r?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const i=r?.serverMessage??"Internal server error. Please try again in a moment.";return r?.lockOnServerError===!0&&F(o),Ce(o,i),!0}function wt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function yt(){document.getElementById("tutor-panel-loading")?.remove()}async function xt(e){t.currentTutorSession?.userId&&t.currentTutorSession.element&&await P(t.currentTutorSession.element,{force:!0}),t.pendingStoredSession=null,ue();const n=t.isWindowOpen;t.currentTutorSession?.element&&t.currentTutorSession.element.remove(),t.currentTutorSession=null,t.isWindowOpen=!1,De(),await ke(),n&&se()}function Tt(){t.problemUrlWatcherId&&window.clearInterval(t.problemUrlWatcherId),t.problemUrlWatcherId=window.setInterval(()=>{const e=M(window.location.href);e!==t.lastCanonicalProblemUrl&&(t.lastCanonicalProblemUrl=e,xt())},1e3)}function N(e,n){const r=e.querySelector(".tutor-panel-auth");if(r){if(n){const u=r.querySelector(".auth-error");u&&(u.textContent=n,u.style.display="block")}return}t.suspendPanelOps=!0,ht(e);const o=document.createElement("div");o.className="tutor-panel-auth",e.appendChild(o);const i=(u,l)=>{if(!u||!l)return;const p=()=>{const d=u.type==="password";l.setAttribute("aria-label",d?"Show password":"Hide password")};l.addEventListener("click",()=>{u.type=u.type==="password"?"text":"password",p(),u.focus(),u.setSelectionRange(u.value.length,u.value.length)}),p()},s=async u=>{const l=t.currentTutorSession?.userId??"",p=t.currentTutorSession?.problem??O();if(t.suspendPanelOps=!1,l&&l===u){t.sessionRestorePending=!1,Ae(e),o.remove(),h(e);return}l&&l!==u&&(await P(e,{force:!0}),gt(e,u,p));const d=await te(u,p);d&&oe(d,u,M(window.location.href))?(ve(e,d),await ne(u,d.state.problem),t.pendingStoredSession=null):d&&await ne(u,d.state.problem),t.currentTutorSession&&(t.currentTutorSession.userId=u,D(t.currentTutorSession)),t.sessionRestorePending=!1,Ae(e),o.remove(),h(e)},a=u=>{o.innerHTML=`
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
    `;const l=o.querySelector(".auth-email"),p=o.querySelector(".auth-password"),d=o.querySelector(".auth-login"),f=o.querySelector(".auth-signup"),T=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error");u&&m&&(m.textContent=u,m.style.display="block");const b=()=>{m&&(m.style.display="none")};l?.addEventListener("input",b),p?.addEventListener("input",b),i(p,T),d?.addEventListener("click",async()=>{const y=l?.value.trim()??"",E=p?.value.trim()??"";if(!y||!E)return;const g=await Qe({email:y,password:E});if(g?.success===!1){m&&(m.textContent=g.error||"Internal server error",m.style.display="block");return}g?.userId&&g?.jwt?await s(g.userId):m&&(m.textContent="Invalid creds",m.style.display="block")}),f?.addEventListener("click",()=>{c()})},c=()=>{o.innerHTML=`
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
    `;const u=o.querySelector(".auth-first-name"),l=o.querySelector(".auth-last-name"),p=o.querySelector(".auth-email"),d=o.querySelector(".auth-password"),f=o.querySelector(".auth-signup-submit"),T=o.querySelector(".auth-password-toggle"),m=o.querySelector(".auth-error"),b=o.querySelector(".auth-password-hint"),y=()=>{m&&(m.style.display="none")};u?.addEventListener("input",y),l?.addEventListener("input",y),p?.addEventListener("input",y),d?.addEventListener("input",y),i(d,T),d?.addEventListener("blur",()=>{if(!b||!d)return;const g=d.value.trim();g&&!re(g)?(b.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",b.style.display="block"):b.style.display="none"}),d?.addEventListener("input",()=>{if(!b||!d)return;const g=d.value.trim();g&&re(g)&&(b.style.display="none")}),f?.addEventListener("click",async()=>{const g=u?.value.trim()??"",w=l?.value.trim()??"",x=p?.value.trim()??"",v=d?.value.trim()??"";if(!g||!w||!x||!v)return;if(!re(v)){b&&(b.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",b.style.display="block");return}const L=await Ze({fname:g,lname:w,email:x,password:v});if(L?.success===!1){m&&(m.textContent=L.error||"Internal server error",m.style.display="block");return}L?.requiresVerification?a("Waiting for verification, check email"):L?.userId&&L?.jwt?await s(L.userId):m&&(m.style.display="block")}),o.querySelector(".auth-back")?.addEventListener("click",()=>{a()})};a(n)}function Pe(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const n=40,r=Math.round(window.innerHeight*.38),o=window.innerWidth-e.offsetWidth-20,i=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(n,o))}px`,e.style.top=`${Math.max(20,Math.min(r,i))}px`,setTimeout(()=>e.classList.add("open"),10),Ft(e),e}function Fe(){t.currentTutorSession?.element&&(At(t.currentTutorSession.element),Mt(t.currentTutorSession.element),De(),t.isWindowOpen=!1,h(t.currentTutorSession.element))}function Ht(e){}function $(){t.widget&&(t.widget.style.display="none")}function De(){t.widget&&(t.widget.style.display="block")}async function Be(){}async function vt(){}function z(){return document.querySelector(".monaco-editor textarea.inputarea")}function qe(e,n){return e.slice(0,Math.max(0,n)).split(`
`).length}function W(){t.guideTouchedLines.clear(),t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchStarted=!1,t.guideBatchTimerId!==null&&(window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=null)}async function le(e){const n=Ct(),o=z()?.value??"",i=Array.from(t.guideTouchedLines)[0]??1;if(!i){W();return}const s=Date.now();if(t.lastGuideFlushLine===i&&s-t.lastGuideFlushAt<250)return;if(t.lastGuideFlushLine=i,t.lastGuideFlushAt=s,!n){W();return}let a="";if(o&&(a=Ne(o,i)),!a.trim()&&i>1&&o){const u=Ne(o,i-1);u.trim()&&(a=u)}let c=n;try{const u=await Se();u?.ok&&typeof u.code=="string"&&(c=u.code)}catch{}kt(a)&&(t.queue.push([c,a]),It()),W()}function kt(e){const n=e.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Ne(e,n){return e.split(`
`)[n-1]??""}async function It(){if(!t.guideDrainInFlight){if(t.suspendPanelOps){t.queue=[];return}t.guideDrainInFlight=!0;try{for(;t.queue.length>0;){if(t.suspendPanelOps){t.queue=[];break}const[e,n]=t.queue.shift();console.log("This is the focus line: ",n),console.log("the code so far: ",e),k(),t.flushInFlight=!0;const r=await Ye({action:"guide-mode",sessionId:t.currentTutorSession?.sessionId??"",problem:t.currentTutorSession?.problem??"",topics:t.currentTutorSession?.topics,code:e,focusLine:n,language:t.currentTutorSession?.language??C(),rollingStateGuideMode:t.currentTutorSession?.rollingStateGuideMode});if(q(t.currentTutorSession?.element??null,r,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){t.flushInFlight=!1;continue}if(!r)console.log("failure for guide mode");else{const o=r.success?r.reply:null;o?.state_update?.lastEdit?.trim()&&t.currentTutorSession&&(t.currentTutorSession.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const i=o?.nudge;if(t.currentTutorSession&&typeof i=="string"){const a=i.trim();a&&(t.currentTutorSession.rollingStateGuideMode.nudges.push(a),t.currentTutorSession.content.push(`${a}
`),t.currentTutorSession.element!=null&&await pe(t.currentTutorSession.element,"","guideAssistant",a),h(t.currentTutorSession.element??null))}const s=o?.topics;if(s&&typeof s=="object"&&t.currentTutorSession)for(const[a,c]of Object.entries(s)){if(!c||typeof c!="object")continue;const u=he(t.currentTutorSession.topics,a),l=c.thoughts_to_remember,p=c.pitfalls,d=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[],f=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[];t.currentTutorSession&&(d.length>0&&t.currentTutorSession.topics[u].thoughts_to_remember.push(...d),f.length>0&&t.currentTutorSession.topics[u].pitfalls.push(...f))}t.currentTutorSession?.element&&h(t.currentTutorSession.element),t.flushInFlight=!1}}}finally{t.guideDrainInFlight=!1}}}function ze(){if(!t.currentTutorSession?.guideModeEnabled)return;const e=z();if(!e)return;const n=e.value??"",r=e.selectionStart??0,o=qe(n,r);!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==0&&t.guideTouchedLines.add(o),t.guideBatchStarted||(t.guideBatchStarted=!0),t.guideBatchTimerId!==null&&window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=window.setTimeout(()=>{le()},1e4),!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==1&&le()}function He(){if(!t.currentTutorSession?.guideModeEnabled||!t.guideBatchStarted)return;const e=z();if(!e)return;const n=e.value??"",r=e.selectionStart??0,o=qe(n,r);if(t.lastGuideSelectionLine===null){t.lastGuideSelectionLine=o;return}o!==t.lastGuideSelectionLine&&(t.lastGuideSelectionLine=o,!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==1&&le())}function Oe(){const e=z();if(!e){t.guideAttachAttempts<5&&(t.guideAttachAttempts+=1,window.setTimeout(Oe,500));return}e.addEventListener("input",ze),document.addEventListener("selectionchange",He)}function ce(){const e=z();e&&(e.removeEventListener("input",ze),document.removeEventListener("selectionchange",He))}function Ot(){}function Et(e){const n=e.querySelector(".tutor-panel-content");if(!n)return null;const r=document.createElement("div");r.className="tutor-panel-assistant-loading";const o=document.createElement("div");return o.className="tutor-panel-assistant-loading-dot",r.appendChild(o),n.appendChild(r),n.scrollTop=r.offsetTop,r}async function Lt(e,n){const r=Et(e),o=t.currentTutorSession?.language||C(),i=await Ve({sessionId:t.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:t.currentTutorSession?.sessionRollingHistory.qaHistory,summary:t.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:o});if(q(e,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return r?.remove(),"Failure";const s=typeof i=="string"?i:i?.reply;return typeof s=="string"&&s.trim()&&(r?.remove(),pe(e,"","assistant",s)),r?.remove(),s||"Failure"}function G(e){t.panelHideTimerId!==null&&(window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function At(e){e.classList.remove("open"),e.classList.add("closing"),t.panelHideTimerId!==null&&window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),t.panelHideTimerId=null},180)}function Mt(e){if(!t.widget)return;const n=e.getBoundingClientRect(),r=t.widget.getBoundingClientRect(),o=r.width||50,i=r.height||50,c=n.left+n.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,u=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));t.widget.style.left=`${c}px`,t.widget.style.top=`${u}px`,t.widget.style.right="auto",t.widget.style.bottom="auto",t.widget.style.transform="",t.lastPosition={x:c,y:u},Be()}function Ct(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function _(e,n,r){const o=e.querySelector(".tutor-panel-content");if(!o)return null;const i=document.createElement("div");if(r==="assistant")i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n);else if(r==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(r==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n),s.appendChild(i),o.appendChild(s),s}else if(r==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n),s.appendChild(i),o.appendChild(s),s}else i.textContent=n;return o.append(i),o.scrollTop=i.offsetTop,i}function Re(e,n){const r=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=e.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function U(e,n){const r=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=e.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function de(e,n,r,o){return new Promise(i=>{let s=0;const a=2,c=e.offsetTop;n.scrollTop=c;let u=!0;const l=()=>{Math.abs(n.scrollTop-c)>8&&(u=!1)};n.addEventListener("scroll",l,{passive:!0});const p=()=>{s=Math.min(r.length,s+a);const d=r.slice(0,s);o?.render?e.innerHTML=o.render(d):e.textContent=d,u&&(n.scrollTop=c),s<r.length?window.setTimeout(p,12):(n.removeEventListener("scroll",l),i())};p()})}async function pe(e,n,r,o){const i=rt(o),s=e.querySelector(".tutor-panel-content");if(s&&typeof o=="string"){if(r==="assistant"){const a=_(e,"","assistant");if(!a)return;await de(a,s,i,{render:I}),a.innerHTML=I(i),t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${o}`),t.currentTutorSession&&ae(t.currentTutorSession.sessionRollingHistory),s.scrollTop=a.offsetTop,h(e)}else if(r==="guideAssistant"){let a=t.guideActiveSlab&&s.contains(t.guideActiveSlab)?t.guideActiveSlab:null;if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const l=document.createElement("ul");l.className="guide-list",a.appendChild(l),s.appendChild(a),t.guideActiveSlab=a}const c=a.querySelector(".guide-list")??document.createElement("ul");c.classList.contains("guide-list")||(c.className="guide-list",a.appendChild(c));const u=document.createElement("li");u.className="guide-item",c.appendChild(u),t.guideMessageCount===0&&a.classList.add("guide-start"),t.guideMessageCount+=1,t.lastGuideMessageEl=a,await de(u,s,i,{render:I}),u.innerHTML=I(i),s.scrollTop=a.offsetTop,h(e)}else if(r==="checkAssistant"){const a=_(e,"","checkAssistant");if(!a)return;const c=a.querySelector(".tutor-panel-message--checkAssistant");if(!c)return;a.classList.add("check-start"),await de(c,s,i,{render:I}),c.innerHTML=I(i),a.classList.add("check-end"),s.scrollTop=a.offsetTop,t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${o}`),t.currentTutorSession&&ae(t.currentTutorSession.sessionRollingHistory),h(e)}}}async function Pt(e,n){try{k();const r=await Xe({sessionId:t.currentTutorSession?.sessionId??"",topics:t.currentTutorSession?.topics,code:n,action:"check-code",language:t.currentTutorSession?.language??C(),problem_no:be(t.currentTutorSession?.problem??""),problem_name:t.currentTutorSession?.problem??"",problem_url:t.currentTutorSession?.problemUrl??""});if(q(e,r,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const o=r?.resp;t.currentTutorSession&&typeof o=="string"&&t.currentTutorSession.content.push(`${o}
`),typeof o=="string"&&o.trim()&&await pe(e,"","checkAssistant",o);const i=r?.topics;if(i&&typeof i=="object"&&t.currentTutorSession)for(const[s,a]of Object.entries(i)){if(!a||typeof a!="object")continue;const c=he(t.currentTutorSession.topics,s),u=a.thoughts_to_remember,l=a.pitfalls,p=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[],d=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[];t.currentTutorSession&&(p.length>0&&t.currentTutorSession.topics[c].thoughts_to_remember.push(...p),d.length>0&&t.currentTutorSession.topics[c].pitfalls.push(...d))}return console.log("this is the object now: ",t.currentTutorSession?.topics),h(e),r?.resp}catch(r){return console.error("checkMode failed",r),"Failure"}}function Ft(e){const n=e.querySelector(".tutor-panel-close"),r=e.querySelector(".btn-help-mode"),o=e.querySelector(".btn-guide-mode"),i=e.querySelector(".btn-gotToWorkspace");o?.addEventListener("click",()=>{if(!t.currentTutorSession)return;t.currentTutorSession.guideModeEnabled=!t.currentTutorSession.guideModeEnabled;const g=e.querySelector(".btn-guide-mode");if(t.currentTutorSession.userId){const w=t.currentTutorSession.problem,x=be(w);je({enabled:t.currentTutorSession.guideModeEnabled,sessionId:t.currentTutorSession.sessionId,problem_no:x,problem_name:w,problem_url:t.currentTutorSession.problemUrl})}Re(e,!0),e.classList.add("guidemode-active"),t.currentTutorSession.guideModeEnabled?(g?.classList.add("is-loading"),t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null,Oe()):(ce(),t.lastGuideMessageEl&&t.lastGuideMessageEl.classList.add("guide-end"),Re(e,!1),e.classList.remove("guidemode-active"),g?.classList.remove("is-loading")),h(e)}),i?.addEventListener("click",async()=>{const g=await Ke({url:ct});q(e,g,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const s=e.querySelector(".tutor-panel-prompt"),a=e.querySelector(".tutor-panel-send");s?.addEventListener("keydown",async g=>{g.key!=="Enter"||g.shiftKey||(g.preventDefault(),a?.click())}),a?.addEventListener("click",async()=>{if(k(),t.currentTutorSession?.prompt){const g=t.currentTutorSession.prompt;s&&(s.value=""),t.currentTutorSession&&(t.currentTutorSession.prompt=""),_(e,g,"user"),t.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${g}`),ae(t.currentTutorSession.sessionRollingHistory),h(e),await Lt(e,g),t.currentTutorSession.prompt="",h(e)}else return void 0}),n?.addEventListener("mousedown",g=>{g.stopPropagation()}),n?.addEventListener("click",async()=>Fe()),r?.addEventListener("click",async()=>{const g=e.querySelector(".btn-help-mode");let w="";t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!0,g?.classList.add("is-loading")),U(e,!0),e.classList.add("checkmode-active");try{const x=await Se();x?.ok&&typeof x.code=="string"&&t.currentTutorSession&&(w=x.code);const v=await Pt(e,w);console.log("this is the response: ",v)}catch{}finally{t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!1,g?.classList.remove("is-loading")),U(e,!1),e.classList.remove("checkmode-active"),h(e)}}),s?.addEventListener("input",()=>{t.currentTutorSession&&(t.currentTutorSession.prompt=s.value),h(e)});let c=!1,u=0,l=0,p=0,d=0,f=null;const T=.6,m=e.querySelector(".tutor-panel-shellbar"),b=()=>{if(!c){f=null;return}const g=e.offsetLeft,w=e.offsetTop,x=g+(p-g)*T,v=w+(d-w)*T;e.style.left=`${x}px`,e.style.top=`${v}px`,f=requestAnimationFrame(b)},y=g=>{if(!c)return;const w=g.clientX-u,x=g.clientY-l,v=window.innerWidth-e.offsetWidth,L=window.innerHeight-e.offsetHeight;p=Math.max(10,Math.min(w,v)),d=Math.max(10,Math.min(x,L)),f===null&&(f=requestAnimationFrame(b))},E=()=>{c&&(c=!1,document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",E),f!==null&&(cancelAnimationFrame(f),f=null),e.style.left=`${p}px`,e.style.top=`${d}px`,t.currentTutorSession&&(t.currentTutorSession.position={x:e.offsetLeft,y:e.offsetTop}),h(e))};m?.addEventListener("mousedown",g=>{g.preventDefault(),c=!0,u=g.clientX-e.getBoundingClientRect().left,l=g.clientY-e.getBoundingClientRect().top,p=e.offsetLeft,d=e.offsetTop,document.addEventListener("mousemove",y),document.addEventListener("mouseup",E)})}function Y(e,...n){}const Dt={debug:(...e)=>Y(console.debug,...e),log:(...e)=>Y(console.log,...e),warn:(...e)=>Y(console.warn,...e),error:(...e)=>Y(console.error,...e)};class ge extends Event{constructor(n,r){super(ge.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=r}static EVENT_NAME=me("wxt:locationchange")}function me(e){return`${S?.runtime?.id}:content:${e}`}function Bt(e){let n,r;return{run(){n==null&&(r=new URL(location.href),n=e.setInterval(()=>{let o=new URL(location.href);o.href!==r.href&&(window.dispatchEvent(new ge(o,r)),r=o)},1e3))}}}class j{constructor(n,r){this.contentScriptName=n,this.options=r,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=me("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Bt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return S.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,r){const o=setInterval(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(n,r){const o=setTimeout(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(n){const r=requestAnimationFrame((...o)=>{this.isValid&&n(...o)});return this.onInvalidated(()=>cancelAnimationFrame(r)),r}requestIdleCallback(n,r){const o=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},r);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(n,r,o,i){r==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(r.startsWith("wxt:")?me(r):r,o,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Dt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:j.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const r=n.data?.type===j.SCRIPT_STARTED_MESSAGE_TYPE,o=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return r&&o&&i}listenForNewerScripts(n){let r=!0;const o=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=r;if(r=!1,s&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function Rt(){}function X(e,...n){}const qt={debug:(...e)=>X(console.debug,...e),log:(...e)=>X(console.log,...e),warn:(...e)=>X(console.warn,...e),error:(...e)=>X(console.error,...e)};return(async()=>{try{const{main:e,...n}=it,r=new j("content",n);return await e(r)}catch(e){throw qt.error('The content script "content" crashed on startup!',e),e}})()})();
content;