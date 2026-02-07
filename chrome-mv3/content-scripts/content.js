var content=(function(){"use strict";function wn(e){return e}const t={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null},it=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],Ce={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function Z(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const W=new Map(it.map(e=>[Z(e),Ce[e]??e]));Object.values(Ce).forEach(e=>{W.set(Z(e),e)});function st(e){return e.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function J(e){const n=Z(e);if(!n)return e.trim();const o=W.get(n);if(o)return o;const r=n.split(" ");if(r.length>0){const i=r[r.length-1];if(i.endsWith("s")){r[r.length-1]=i.slice(0,-1);const s=r.join(" "),a=W.get(s);if(a)return a}else{r[r.length-1]=`${i}s`;const s=r.join(" "),a=W.get(s);if(a)return a}}return st(n)}function Pe(e,n){const o=J(n),r=Object.keys(e).find(i=>J(i)===o);return r&&r!==o&&(e[o]=e[r],delete e[r]),e[o]??={thoughts_to_remember:[],pitfalls:[]},o}function D(e){try{const{origin:n,pathname:o}=new URL(e),r=o.match(/^\/problems\/[^/]+/);return r?`${n}${r[0]}`:`${n}${o}`}catch{return e}}function R(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function De(e){const n=e.match(/^\s*(\d+)/);if(!n)return null;const o=Number(n[1]);return Number.isFinite(o)?o:null}function at(){const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(o=>o.getAttribute("href")).filter(o=>!!o).map(o=>o.replace("/tag/","").replace("/","")).map(o=>J(o));return Object.fromEntries(Array.from(new Set(n)).map(o=>[o,{thoughts_to_remember:[],pitfalls:[]}]))}function F(){const e=document.querySelector("#editor");if(!e)return"";const n=e.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(r=>r.nodeType===Node.TEXT_NODE&&r.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}const ut='#editor button[aria-haspopup="dialog"]';function A(e){if(!t.currentTutorSession)return;const n=F();n&&t.currentTutorSession.language!==n&&(t.currentTutorSession.language=n,e(t.currentTutorSession.element??null))}function ee(e){const n=document.querySelector(ut);if(n){if(n.dataset.tutorLangListener||(n.dataset.tutorLangListener="true",n.addEventListener("click",()=>{window.setTimeout(()=>A(e),50)},{passive:!0})),t.languageObserverTarget===n&&t.languageObserver){A(e);return}t.languageObserver?.disconnect(),t.languageObserverTarget=n,t.languageObserver=new MutationObserver(()=>{A(e)}),t.languageObserver.observe(n,{childList:!0,characterData:!0,subtree:!0}),A(e)}}const y=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function lt(e){return y.runtime.sendMessage({action:"summarize-history",payload:e})}function ct(e){return y.runtime.sendMessage({action:"init-session-topics",payload:e})}function dt(e){return y.runtime.sendMessage({action:"guide-mode",payload:e})}function pt(e){return y.runtime.sendMessage({action:"guide-mode-status",payload:e})}function gt(e){return y.runtime.sendMessage({action:"check-code",payload:e})}function ft(e){return y.runtime.sendMessage({action:"ask-anything",payload:e})}function mt(e){return y.runtime.sendMessage({action:"go-to-workspace",payload:e})}function ht(e){return y.runtime.sendMessage({action:"supabase-login",payload:e})}function bt(e){return y.runtime.sendMessage({action:"supabase-signup",payload:e})}function Fe(){return y.runtime.sendMessage({type:"GET_MONACO_CODE"})}const te="vibetutor-auth",Be="vibetutor-session",qe=1440*60*1e3,St=1800*1e3,wt=`${Be}:`;let ne=null;function oe(e,n){return`${Be}:${encodeURIComponent(e)}:${encodeURIComponent(n)}`}async function re(){return(await y.storage.local.get(te))[te]??null}function yt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Ne(){await y.storage.local.remove(te),await y.runtime.sendMessage({action:"clear-auth"})}async function ie(e,n){const o=oe(e,n),i=(await y.storage.local.get(o))[o]??null;return i?Date.now()-(i.lastActivityAt??0)>qe?(await y.storage.local.remove(o),null):i:null}async function se(e,n){const o=oe(e,n);await y.storage.local.remove(o)}async function He(){const e=await y.storage.local.get(null),n=Date.now(),o=[];for(const[r,i]of Object.entries(e)){if(!r.startsWith(wt))continue;const a=i?.lastActivityAt??0;n-a>qe&&o.push(r)}o.length>0&&await y.storage.local.remove(o)}function xt(){He(),ne&&window.clearInterval(ne),ne=window.setInterval(()=>{He()},St)}function ae(e,n,o){return e.state.userId?e.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):e.state.problemUrl===o:(console.log("There was no stored user in the browser."),!1)}async function B(e,n){if(!t.currentTutorSession||!t.currentTutorSession.userId||t.sessionRestorePending&&!n?.force)return;const o=e?.querySelector(".tutor-panel-content")??t.currentTutorSession.element?.querySelector(".tutor-panel-content"),r=oe(t.currentTutorSession.userId,t.currentTutorSession.problem),i={state:{sessionId:t.currentTutorSession.sessionId,userId:t.currentTutorSession.userId,content:t.currentTutorSession.content,sessionTopicsInitialized:t.currentTutorSession.sessionTopicsInitialized,language:t.currentTutorSession.language,problem:t.currentTutorSession.problem,problemUrl:t.currentTutorSession.problemUrl,topics:t.currentTutorSession.topics,prompt:t.currentTutorSession.prompt,position:t.currentTutorSession.position,size:t.currentTutorSession.size,guideModeEnabled:t.currentTutorSession.guideModeEnabled,checkModeEnabled:t.currentTutorSession.checkModeEnabled,rollingStateGuideMode:t.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:t.currentTutorSession.sessionRollingHistory},panelOpen:t.isWindowOpen,contentHtml:o?.innerHTML??"",contentScrollTop:o?.scrollTop??0,lastActivityAt:t.lastActivityAt};await y.storage.local.set({[r]:i})}function w(e){t.sessionRestorePending||t.persistTimerId||(t.persistTimerId=window.setTimeout(()=>{t.persistTimerId=null,B(e)},500))}function ze(e,n){t.currentTutorSession={...n.state,element:e},t.currentTutorSession&&!t.currentTutorSession.language&&(t.currentTutorSession.language=F()),t.currentTutorSession&&t.currentTutorSession.sessionTopicsInitialized==null&&(t.currentTutorSession.sessionTopicsInitialized=!1);const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{o.scrollTop=o.scrollHeight}));const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=t.currentTutorSession.prompt??""),t.currentTutorSession.position&&(e.style.left=`${t.currentTutorSession.position.x}px`,e.style.top=`${t.currentTutorSession.position.y}px`),t.currentTutorSession.size&&(e.style.width=`${t.currentTutorSession.size.width}px`,e.style.height=`${t.currentTutorSession.size.height}px`);const i=e.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const s=i[i.length-1],a=s.querySelectorAll(".guide-item");t.guideMessageCount=a.length,t.lastGuideMessageEl=s,t.guideActiveSlab=t.currentTutorSession?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");t.guideMessageCount=s.length,t.lastGuideMessageEl=s.length>0?s[s.length-1]:null,t.guideActiveSlab=null}}async function Oe(){const e=await re();if(!e?.userId){t.pendingStoredSession=null;return}const n=await ie(e.userId,R());if(!n){t.pendingStoredSession=null;return}if(!ae(n,e.userId,D(window.location.href))){await se(e.userId,n.state.problem),t.pendingStoredSession=null;return}t.pendingStoredSession=n,t.lastActivityAt=n.lastActivityAt??Date.now()}let ue=null;function Tt(e){ue=e}function vt(){if(!ue)throw new Error("Guide dependencies not configured");return ue}function le(){t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchTimerId=null,t.guideBatchStarted=!1,t.guideTouchedLines=new Set,t.maxLines=0,t.guideAttachAttempts=0,t.guideDrainInFlight=!1,t.lastGuideSelectionLine=null,t.lastGuideFlushLine=null,t.lastGuideFlushAt=0,t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null}function N(){return document.querySelector(".monaco-editor textarea.inputarea")}function We(e,n){return e.slice(0,Math.max(0,n)).split(`
`).length}function Re(e,n){return e.split(`
`)[n-1]??""}function kt(e){const n=e.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Et(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function $(){t.guideTouchedLines.clear(),t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchStarted=!1,t.guideBatchTimerId!==null&&(window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=null)}async function ce(e){const n=Et(),r=N()?.value??"",i=Array.from(t.guideTouchedLines)[0]??1;if(!i){$();return}const s=Date.now();if(t.lastGuideFlushLine===i&&s-t.lastGuideFlushAt<250)return;if(t.lastGuideFlushLine=i,t.lastGuideFlushAt=s,!n){$();return}let a="";if(r&&(a=Re(r,i)),!a.trim()&&i>1&&r){const l=Re(r,i-1);l.trim()&&(a=l)}let u=n;try{const l=await Fe();l?.ok&&typeof l.code=="string"&&(u=l.code)}catch{}kt(a)&&(t.queue.push([u,a]),It()),$()}async function It(){const{appendToContentPanel:e,handleBackendError:n,scheduleSessionPersist:o,syncSessionLanguageFromPage:r}=vt();if(!t.guideDrainInFlight){if(t.suspendPanelOps){t.queue=[];return}t.guideDrainInFlight=!0;try{for(;t.queue.length>0;){if(t.suspendPanelOps){t.queue=[];break}const[i,s]=t.queue.shift();console.log("This is the focus line: ",s),console.log("the code so far: ",i),r(),t.flushInFlight=!0;const a=await dt({action:"guide-mode",sessionId:t.currentTutorSession?.sessionId??"",problem:t.currentTutorSession?.problem??"",topics:t.currentTutorSession?.topics,code:i,focusLine:s,language:t.currentTutorSession?.language??F(),rollingStateGuideMode:t.currentTutorSession?.rollingStateGuideMode});if(n(t.currentTutorSession?.element??null,a,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){t.flushInFlight=!1;continue}if(!a)console.log("failure for guide mode");else{const u=a.success?a.reply:null;u?.state_update?.lastEdit?.trim()&&t.currentTutorSession&&(t.currentTutorSession.rollingStateGuideMode.lastEdit=u.state_update.lastEdit);const l=u?.nudge;if(t.currentTutorSession&&typeof l=="string"){const d=l.trim();d&&(t.currentTutorSession.rollingStateGuideMode.nudges.push(d),t.currentTutorSession.content.push(`${d}
`),t.currentTutorSession.element!=null&&await e(t.currentTutorSession.element,"","guideAssistant",d),o(t.currentTutorSession.element??null))}const c=u?.topics;if(c&&typeof c=="object"&&t.currentTutorSession)for(const[d,m]of Object.entries(c)){if(!m||typeof m!="object")continue;const f=Pe(t.currentTutorSession.topics,d),p=m.thoughts_to_remember,h=m.pitfalls,g=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[],b=Array.isArray(h)?h:typeof h=="string"&&h.trim()?[h.trim()]:[];t.currentTutorSession&&(g.length>0&&t.currentTutorSession.topics[f].thoughts_to_remember.push(...g),b.length>0&&t.currentTutorSession.topics[f].pitfalls.push(...b))}t.currentTutorSession?.element&&o(t.currentTutorSession.element),t.flushInFlight=!1}}}finally{t.guideDrainInFlight=!1}}}function $e(){if(!t.currentTutorSession?.guideModeEnabled)return;const e=N();if(!e)return;const n=e.value??"",o=e.selectionStart??0,r=We(n,o);!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==0&&t.guideTouchedLines.add(r),t.guideBatchStarted||(t.guideBatchStarted=!0),t.guideBatchTimerId!==null&&window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=window.setTimeout(()=>{ce()},1e4),!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==1&&ce()}function Ge(){if(!t.currentTutorSession?.guideModeEnabled||!t.guideBatchStarted)return;const e=N();if(!e)return;const n=e.value??"",o=e.selectionStart??0,r=We(n,o);if(t.lastGuideSelectionLine===null){t.lastGuideSelectionLine=r;return}r!==t.lastGuideSelectionLine&&(t.lastGuideSelectionLine=r,!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==1&&ce())}function _e(){const e=N();if(!e){t.guideAttachAttempts<5&&(t.guideAttachAttempts+=1,window.setTimeout(_e,500));return}e.addEventListener("input",$e),document.addEventListener("selectionchange",Ge)}function de(){const e=N();e&&(e.removeEventListener("input",$e),document.removeEventListener("selectionchange",Ge))}let pe=null;function Lt(e){pe=e}function At(){if(!pe)throw new Error("Check dependencies not configured");return pe}async function Mt(e,n){const{appendToContentPanel:o,handleBackendError:r,scheduleSessionPersist:i,syncSessionLanguageFromPage:s}=At();try{s();const a=await gt({sessionId:t.currentTutorSession?.sessionId??"",topics:t.currentTutorSession?.topics,code:n,action:"check-code",language:t.currentTutorSession?.language??F(),problem_no:De(t.currentTutorSession?.problem??""),problem_name:t.currentTutorSession?.problem??"",problem_url:t.currentTutorSession?.problemUrl??""});if(r(e,a,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const u=a?.resp;t.currentTutorSession&&typeof u=="string"&&t.currentTutorSession.content.push(`${u}
`),typeof u=="string"&&u.trim()&&await o(e,"","checkAssistant",u);const l=a?.topics;if(l&&typeof l=="object"&&t.currentTutorSession)for(const[c,d]of Object.entries(l)){if(!d||typeof d!="object")continue;const m=Pe(t.currentTutorSession.topics,c),f=d.thoughts_to_remember,p=d.pitfalls,h=Array.isArray(f)?f:typeof f=="string"&&f.trim()?[f.trim()]:[],g=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[];t.currentTutorSession&&(h.length>0&&t.currentTutorSession.topics[m].thoughts_to_remember.push(...h),g.length>0&&t.currentTutorSession.topics[m].pitfalls.push(...g))}return console.log("this is the object now: ",t.currentTutorSession?.topics),i(e),a?.resp}catch(a){return console.error("checkMode failed",a),"Failure"}}let ge=null;function Ct(e){ge=e}function Ue(){if(!ge)throw new Error("Widget dependencies not configured");return ge}function Pt(){const{closeTutorPanel:e,openTutorPanel:n}=Ue(),o=document.getElementById("tutor-widget");o&&o.remove(),t.widget=document.createElement("div"),t.widget.id="tutor-widget",t.widget.innerHTML=`
  <div class="widget-main-button" id="main-button">
  </div>
  `;const r=document.createElement("style");r.textContent=`
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

`,document.head.appendChild(r),document.body.appendChild(t.widget);const i=document.getElementById("main-button");if(!i||!t.widget)return;let s=0,a={x:0,y:0},u=!1,l=!1;function c(p,h){const g=t.widget.offsetWidth,b=t.widget.offsetHeight;return{x:Math.max(0,Math.min(p,window.innerWidth-g)),y:Math.max(0,Math.min(h,window.innerHeight-b))}}function d(p,h){const g=t.widget.offsetWidth,b=t.widget.offsetHeight;return{x:p<window.innerWidth/2?0:window.innerWidth-g,y:Math.max(0,Math.min(h,window.innerHeight-b))}}i.addEventListener("mousedown",p=>{s=Date.now(),a={x:p.clientX,y:p.clientY},u=!1,l=!1;const h=t.widget.getBoundingClientRect();t.dragOffset.x=p.clientX-h.left,t.dragOffset.y=p.clientY-h.top,document.addEventListener("mousemove",m),document.addEventListener("mouseup",f),i&&i.classList.add("dragging")}),i.addEventListener("click",p=>{if(l){l=!1;return}!t.isDragging&&!u&&(p.preventDefault(),p.stopPropagation(),t.isWindowOpen?e():n())});function m(p){const h=Date.now()-s,g=Math.sqrt(Math.pow(p.clientX-a.x,2)+Math.pow(p.clientY-a.y,2));if(!t.isDragging&&(g>3||h>100)&&(t.isDragging=!0,u=!0,document.body.style.cursor="grabbing"),t.isDragging){const b=p.clientX-t.dragOffset.x,T=p.clientY-t.dragOffset.y,v=c(b,T);fe(v.x,v.y),t.lastPosition={x:v.x,y:v.y}}}function f(){if(document.removeEventListener("mousemove",m),document.removeEventListener("mouseup",f),i?.classList.remove("dragging"),document.body.style.cursor="",t.isDragging&&t.widget){l=!0;const p=d(t.lastPosition.x,t.lastPosition.y);t.widget.style.transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1)",fe(p.x,p.y),window.setTimeout(()=>{t.widget&&(t.widget.style.transition="")},300),je()}t.isDragging=!1,u=!1}}function fe(e,n){if(!t.widget)return;const o=t.widget.offsetWidth||50,r=t.widget.offsetHeight||50,i=Math.max(0,Math.min(e,window.innerWidth-o)),s=Math.max(0,Math.min(n,window.innerHeight-r));t.widget.style.left=`${i}px`,t.widget.style.top=`${s}px`,t.widget.style.right="auto",t.widget.style.bottom="auto",t.widget.style.transform="",t.lastPosition={x:i,y:s}}function G(){t.widget&&(t.widget.style.display="none")}function Ye(){t.widget&&(t.widget.style.display="block")}async function je(){}async function Dt(){}function Ft(e){if(!t.widget)return;const n=e.getBoundingClientRect(),o=t.widget.getBoundingClientRect(),r=o.width||50,i=o.height||50,u=n.left+n.width/2<=window.innerWidth/2?10:window.innerWidth-r-10,l=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));fe(u,l),je()}function Ve(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const n=40,o=Math.round(window.innerHeight*.38),r=window.innerWidth-e.offsetWidth-20,i=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(n,r))}px`,e.style.top=`${Math.max(20,Math.min(o,i))}px`,setTimeout(()=>e.classList.add("open"),10),qt(e),e}function _(e){t.panelHideTimerId!==null&&(window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Bt(e){e.classList.remove("open"),e.classList.add("closing"),t.panelHideTimerId!==null&&window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),t.panelHideTimerId=null},180)}function Xe(e,n){const o=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function me(e,n){const o=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function qt(e){const{askAnything:n,appendPanelMessage:o,closeTutorPanel:r,handleBackendError:i,highlightAskArea:s,maybeQueueSummary:a,scheduleSessionPersist:u,syncSessionLanguageFromPage:l,workspaceUrl:c}=Ue(),d=e.querySelector(".tutor-panel-close"),m=e.querySelector(".btn-help-mode"),f=e.querySelector(".btn-guide-mode"),p=e.querySelector(".btn-gotToWorkspace");f?.addEventListener("click",()=>{if(!t.currentTutorSession)return;t.currentTutorSession.guideModeEnabled=!t.currentTutorSession.guideModeEnabled;const S=e.querySelector(".btn-guide-mode");if(t.currentTutorSession.userId){const E=t.currentTutorSession.problem,L=De(E);pt({enabled:t.currentTutorSession.guideModeEnabled,sessionId:t.currentTutorSession.sessionId,problem_no:L,problem_name:E,problem_url:t.currentTutorSession.problemUrl})}Xe(e,!0),e.classList.add("guidemode-active"),t.currentTutorSession.guideModeEnabled?(S?.classList.add("is-loading"),t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null,_e()):(de(),t.lastGuideMessageEl&&t.lastGuideMessageEl.classList.add("guide-end"),Xe(e,!1),e.classList.remove("guidemode-active"),S?.classList.remove("is-loading")),u(e)}),p?.addEventListener("click",async()=>{if(!c){console.warn("Workspace URL is not set.");return}const S=await mt({url:c});i(e,S,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const h=e.querySelector(".tutor-panel-prompt"),g=e.querySelector(".tutor-panel-send");h?.addEventListener("keydown",async S=>{S.key!=="Enter"||S.shiftKey||(S.preventDefault(),g?.click())}),g?.addEventListener("click",async()=>{if(l(),t.currentTutorSession?.prompt){const S=t.currentTutorSession.prompt;h&&(h.value=""),t.currentTutorSession&&(t.currentTutorSession.prompt=""),o(e,S,"user"),t.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${S}`),a(t.currentTutorSession.sessionRollingHistory),u(e),await n(e,S),t.currentTutorSession.prompt="",u(e)}else return s()}),d?.addEventListener("mousedown",S=>{S.stopPropagation()}),d?.addEventListener("click",async()=>r()),m?.addEventListener("click",async()=>{const S=e.querySelector(".btn-help-mode");let E="";t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!0,S?.classList.add("is-loading")),me(e,!0),e.classList.add("checkmode-active");try{const L=await Fe();L?.ok&&typeof L.code=="string"&&t.currentTutorSession&&(E=L.code);const O=await Mt(e,E);console.log("this is the response: ",O)}catch{}finally{t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!1,S?.classList.remove("is-loading")),me(e,!1),e.classList.remove("checkmode-active"),u(e)}}),h?.addEventListener("input",()=>{t.currentTutorSession&&(t.currentTutorSession.prompt=h.value),u(e)});let b=!1,T=0,v=0,x=0,P=0,k=null;const q=.6,M=e.querySelector(".tutor-panel-shellbar"),nt=()=>{if(!b){k=null;return}const S=e.offsetLeft,E=e.offsetTop,L=S+(x-S)*q,O=E+(P-E)*q;e.style.left=`${L}px`,e.style.top=`${O}px`,k=requestAnimationFrame(nt)},ot=S=>{if(!b)return;const E=S.clientX-T,L=S.clientY-v,O=window.innerWidth-e.offsetWidth,Sn=window.innerHeight-e.offsetHeight;x=Math.max(10,Math.min(E,O)),P=Math.max(10,Math.min(L,Sn)),k===null&&(k=requestAnimationFrame(nt))},rt=()=>{b&&(b=!1,document.removeEventListener("mousemove",ot),document.removeEventListener("mouseup",rt),k!==null&&(cancelAnimationFrame(k),k=null),e.style.left=`${x}px`,e.style.top=`${P}px`,t.currentTutorSession&&(t.currentTutorSession.position={x:e.offsetLeft,y:e.offsetTop}),u(e))};M?.addEventListener("mousedown",S=>{S.preventDefault(),b=!0,T=S.clientX-e.getBoundingClientRect().left,v=S.clientY-e.getBoundingClientRect().top,x=e.offsetLeft,P=e.offsetTop,document.addEventListener("mousemove",ot),document.addEventListener("mouseup",rt)})}let he=null;function Nt(e){he=e}function Ht(){if(!he)throw new Error("Lifecycle dependencies not configured");return he}function Ke(e,n,o){const r=o??R(),i=crypto.randomUUID();return{element:e,sessionId:i,userId:n,problem:r,problemUrl:D(window.location.href),language:F(),topics:at(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function be(){const{highlightExistingPanel:e,lockPanel:n,markUserActivity:o,showPanelLoading:r,hidePanelLoading:i,initSessionTopicsIfNeeded:s}=Ht(),a=await re(),u=yt(a),l=a?.userId??"";if(u&&await Ne(),t.currentTutorSession&&t.currentTutorSession.element&&document.body.contains(t.currentTutorSession.element)){ee(w),A(w),_(t.currentTutorSession.element),G(),t.isWindowOpen=!0,e(t.currentTutorSession.element);const d=t.currentTutorSession.element.querySelector(".tutor-panel-content");d&&requestAnimationFrame(()=>{d.scrollTop=d.scrollHeight}),!l||u?(n(t.currentTutorSession.element),H(t.currentTutorSession.element,u?"session expired, please log back in":void 0)):s(t.currentTutorSession),o(),w(t.currentTutorSession.element);return}if(t.currentTutorSession?.userId){r();try{await B(t.currentTutorSession.element??null,{force:!0})}finally{i()}}if(!t.pendingStoredSession&&l){const d=await ie(l,R());d&&ae(d,l,D(window.location.href))&&(t.pendingStoredSession=d)}if(t.pendingStoredSession){const d=Ve();ze(d,t.pendingStoredSession),t.pendingStoredSession=null,ee(w),A(w),_(d),G(),t.isWindowOpen=!0,o(),!l||u?(n(d),H(d,u?"session expired, please log back in":void 0)):t.currentTutorSession&&s(t.currentTutorSession),w(d);return}const c=Ve();if(!c){console.log("There was an error creating a panel");return}t.currentTutorSession=Ke(c,l),ee(w),A(w),_(c),G(),t.isWindowOpen=!0,o(),w(c),t.currentTutorSession&&(!l||u?(n(c),H(c,u?"session expired, please log back in":void 0)):(t.currentTutorSession.userId=l,s(t.currentTutorSession)),setTimeout(()=>{const d=c.querySelector(".tutor-panel-prompt");d&&(d.focus(),d.setSelectionRange(d.value.length,d.value.length))},100))}function zt(){t.currentTutorSession?.element&&(Bt(t.currentTutorSession.element),Ft(t.currentTutorSession.element),Ye(),t.isWindowOpen=!1,w(t.currentTutorSession.element))}async function Ot(e){t.currentTutorSession?.userId&&t.currentTutorSession.element&&await B(t.currentTutorSession.element,{force:!0}),t.pendingStoredSession=null,le();const n=t.isWindowOpen;t.currentTutorSession?.element&&t.currentTutorSession.element.remove(),t.currentTutorSession=null,t.isWindowOpen=!1,Ye(),await Oe(),n&&be()}function Wt(){t.problemUrlWatcherId&&window.clearInterval(t.problemUrlWatcherId),t.problemUrlWatcherId=window.setInterval(()=>{const e=D(window.location.href);e!==t.lastCanonicalProblemUrl&&(t.lastCanonicalProblemUrl=e,Ot())},1e3)}async function Se(e){if(e.sessionTopicsInitialized||!e.userId)return;(await ct({sessionId:e.sessionId,topics:e.topics}))?.success&&(e.sessionTopicsInitialized=!0,w(e.element??null))}function Rt(e,n,o){le();const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML="");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=""),t.currentTutorSession=Ke(e,n,o),t.currentTutorSession&&Se(t.currentTutorSession)}function we(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}async function $t(e,n){return ht({email:e,password:n})}async function Gt(e){return bt(e)}async function Qe(e,n,o,r){const i=t.currentTutorSession?.userId??"",s=t.currentTutorSession?.problem??R();if(t.suspendPanelOps=!1,i&&i===o){t.sessionRestorePending=!1,r.unlockPanel(e),n.remove(),w(e);return}i&&i!==o&&(await B(e,{force:!0}),Rt(e,o,s));const a=await ie(o,s);a&&ae(a,o,D(window.location.href))?(ze(e,a),await se(o,a.state.problem),t.pendingStoredSession=null):a&&await se(o,a.state.problem),t.currentTutorSession&&(t.currentTutorSession.userId=o,Se(t.currentTutorSession)),t.sessionRestorePending=!1,r.unlockPanel(e),n.remove(),w(e)}let ye=null;function _t(e){ye=e}function Ut(){if(!ye)throw new Error("Auth overlay dependencies not configured");return ye}function H(e,n){const o=e.querySelector(".tutor-panel-auth");if(o){if(n){const c=o.querySelector(".auth-error");c&&(c.textContent=n,c.style.display="block")}return}const{stopPanelOperations:r,unlockPanel:i}=Ut();t.suspendPanelOps=!0,r(e);const s=document.createElement("div");s.className="tutor-panel-auth",e.appendChild(s);const a=(c,d)=>{if(!c||!d)return;const m=()=>{const f=c.type==="password";d.setAttribute("aria-label",f?"Show password":"Hide password")};d.addEventListener("click",()=>{c.type=c.type==="password"?"text":"password",m(),c.focus(),c.setSelectionRange(c.value.length,c.value.length)}),m()},u=c=>{s.innerHTML=`
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
    `;const d=s.querySelector(".auth-email"),m=s.querySelector(".auth-password"),f=s.querySelector(".auth-login"),p=s.querySelector(".auth-signup"),h=s.querySelector(".auth-password-toggle"),g=s.querySelector(".auth-error");c&&g&&(g.textContent=c,g.style.display="block");const b=()=>{g&&(g.style.display="none")};d?.addEventListener("input",b),m?.addEventListener("input",b),a(m,h),f?.addEventListener("click",async()=>{const T=d?.value.trim()??"",v=m?.value.trim()??"";if(!T||!v)return;const x=await $t(T,v);if(x?.success===!1){g&&(g.textContent=x.error||"Internal server error",g.style.display="block");return}x?.userId&&x?.jwt?await Qe(e,s,x.userId,{unlockPanel:i}):g&&(g.textContent="Invalid creds",g.style.display="block")}),p?.addEventListener("click",()=>{l()})},l=()=>{s.innerHTML=`
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
    `;const c=s.querySelector(".auth-first-name"),d=s.querySelector(".auth-last-name"),m=s.querySelector(".auth-email"),f=s.querySelector(".auth-password"),p=s.querySelector(".auth-signup-submit"),h=s.querySelector(".auth-password-toggle"),g=s.querySelector(".auth-error"),b=s.querySelector(".auth-password-hint"),T=()=>{g&&(g.style.display="none")};c?.addEventListener("input",T),d?.addEventListener("input",T),m?.addEventListener("input",T),f?.addEventListener("input",T),a(f,h),f?.addEventListener("blur",()=>{if(!b||!f)return;const x=f.value.trim();x&&!we(x)?(b.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",b.style.display="block"):b.style.display="none"}),f?.addEventListener("input",()=>{if(!b||!f)return;const x=f.value.trim();x&&we(x)&&(b.style.display="none")}),p?.addEventListener("click",async()=>{const x=c?.value.trim()??"",P=d?.value.trim()??"",k=m?.value.trim()??"",q=f?.value.trim()??"";if(!x||!P||!k||!q)return;if(!we(q)){b&&(b.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",b.style.display="block");return}const M=await Gt({fname:x,lname:P,email:k,password:q});if(M?.success===!1){g&&(g.textContent=M.error||"Internal server error",g.style.display="block");return}M?.requiresVerification?u("Waiting for verification, check email"):M?.userId&&M?.jwt?await Qe(e,s,M.userId,{unlockPanel:i}):g&&(g.style.display="block")}),s.querySelector(".auth-back")?.addEventListener("click",()=>{u()})};u(n)}let xe=null;function Yt(e){xe=e}function jt(){if(!xe)throw new Error("Activity dependencies not configured");return xe}const Vt=960*60*1e3,Xt=15e3;function Te(){t.lastActivityAt=Date.now(),Date.now()-t.lastActivityStoredAt>Xt&&(t.lastActivityStoredAt=Date.now(),w())}async function Kt(){const{lockPanel:e}=jt();if(t.currentTutorSession?.element&&(await B(t.currentTutorSession.element,{force:!0}),t.sessionRestorePending=!0),await Ne(),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),t.currentTutorSession?.element){const n=t.currentTutorSession.element;de(),n.classList.remove("guidemode-active","checkmode-active"),e(n),H(n,"session expired, please log back in")}}function Qt(){const e=()=>Te(),n=["mousemove","keydown","click","scroll","input"];for(const o of n)document.addEventListener(o,e,{passive:!0});t.inactivityTimerId&&window.clearInterval(t.inactivityTimerId),t.inactivityTimerId=window.setInterval(async()=>{Date.now()-t.lastActivityAt<Vt||!(await re())?.userId||await Kt()},6e4)}function Zt(e){t.queue=[],t.flushInFlight=!1,le(),de(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function C(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function U(e){const n=e.split("`"),o=r=>{const i=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,u;for(;(u=i.exec(r))!==null;){s+=C(r.slice(a,u.index));const l=u[1];l.startsWith("**")?s+=`<strong>${C(l.slice(2,-2))}</strong>`:s+=`<code>${C(l.slice(1,-1))}</code>`,a=i.lastIndex}return s+=C(r.slice(a)),s};return n.map((r,i)=>i%2===1?`<code>${C(r)}</code>`:o(r)).join("")}function Jt(e){const n=e.replace(/\r\n/g,`
`).split(`
`);let o="",r=[],i=null;const s=()=>{r.length!==0&&(o+=`<p>${U(r.join(" "))}</p>`,r=[])},a=()=>{i&&(o+=`</${i}>`,i=null)};for(const u of n){const l=u.trim();if(!l){s(),a();continue}const c=l.match(/^(#{1,3})\s+(.*)$/);if(c){s(),a();const f=c[1].length;o+=`<h${f}>${U(c[2])}</h${f}>`;continue}const d=l.match(/^(\d+)[.)]\s+(.*)$/);if(d){s(),i&&i!=="ol"&&a(),i||(i="ol",o+="<ol>"),o+=`<li>${U(d[2])}</li>`;continue}const m=l.match(/^[-*]\s+(.*)$/);if(m){s(),i&&i!=="ul"&&a(),i||(i="ul",o+="<ul>"),o+=`<li>${U(m[1])}</li>`;continue}r.push(l)}return s(),a(),o}function Ze(e){const n=e.split(`
`),o=u=>/^\s*\|?[-:\s|]+\|?\s*$/.test(u),r=u=>(u.match(/\|/g)?.length??0)>=2;let i=!1;const s=[];let a=0;for(;a<n.length;){const u=n[a];if(u.trim().startsWith("```")){i=!i,s.push(u),a+=1;continue}if(i){s.push(u),a+=1;continue}if(r(u)||o(u)){const l=[];for(;a<n.length;){const c=n[a];if(c.trim().startsWith("```")||!(r(c)||o(c)))break;l.push(c),a+=1}l.length>0&&(s.push("```table"),s.push(...l),s.push("```"));continue}s.push(u),a+=1}return s.join(`
`)}function en(e){const n=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return Ze(e);const o=n[1].trim(),i=n[2].trim().split(";").map(u=>u.trim()).filter(Boolean);if(i.length===0)return e;const s=i.map(u=>`- ${u.replace(/\.$/,"")}`).join(`
`),a=`${o}

**To fix**
${s}`;return Ze(a)}function I(e){const n=e.replace(/\r\n/g,`
`),r=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,u;for(;(u=s.exec(r))!==null;)u.index>a&&i.push({type:"text",content:r.slice(a,u.index)}),i.push({type:"code",content:u[2]??"",lang:u[1]??""}),a=s.lastIndex;return a<r.length&&i.push({type:"text",content:r.slice(a)}),i.map(l=>{if(l.type==="code"){const c=l.lang?` data-lang="${C(l.lang)}"`:"";return`<pre${l.lang==="table"?' class="table-block"':""}><code${c}>${C(l.content.trimEnd())}</code></pre>`}return Jt(l.content)}).join("")}function tn(e){const n=e.querySelector(".tutor-panel-content");if(!n)return null;const o=document.createElement("div");o.className="tutor-panel-assistant-loading";const r=document.createElement("div");return r.className="tutor-panel-assistant-loading-dot",o.appendChild(r),n.appendChild(o),n.scrollTop=o.offsetTop,o}function Y(e,n,o){const r=e.querySelector(".tutor-panel-content");if(!r)return null;const i=document.createElement("div");if(o==="assistant")i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n);else if(o==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(o==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),s.appendChild(i),r.appendChild(s),s}else if(o==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),s.appendChild(i),r.appendChild(s),s}else i.textContent=n;return r.append(i),r.scrollTop=i.offsetTop,i}function ve(e,n,o,r){return new Promise(i=>{let s=0;const a=2,u=e.offsetTop;n.scrollTop=u;let l=!0;const c=()=>{Math.abs(n.scrollTop-u)>8&&(l=!1)};n.addEventListener("scroll",c,{passive:!0});const d=()=>{s=Math.min(o.length,s+a);const m=o.slice(0,s);r?.render?e.innerHTML=r.render(m):e.textContent=m,l&&(n.scrollTop=u),s<o.length?window.setTimeout(d,12):(n.removeEventListener("scroll",c),i())};d()})}let ke=null;function nn(e){ke=e}function j(){if(!ke)throw new Error("Error handling dependencies not configured");return ke}const Je="session expired, please log back in";function V(e){const{setPanelControlsDisabled:n}=j();e.classList.add("tutor-panel-locked"),n(e,!0)}function on(e){const{setPanelControlsDisabled:n}=j();e.classList.remove("tutor-panel-locked"),n(e,!1)}function rn(e){return typeof e=="object"&&e!==null&&e.success===!1}function sn(e){const n=e.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(r=>{r.textContent?.trim()===Je&&r.remove()})}function et(e,n){const{appendPanelMessage:o,scheduleSessionPersist:r}=j(),i=e.querySelector(".tutor-panel-content");if(!i)return;const s=o(e,n,"assistant");s&&(i.scrollTop=s.offsetTop,r(e))}function z(e,n,o){if(!rn(n))return!1;if(o?.silent)return!0;const r=e??t.currentTutorSession?.element??null;if(!r)return!0;const{ensureAuthPrompt:i,hideWidget:s,markUserActivity:a,scheduleSessionPersist:u,showTutorPanel:l}=j();if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return V(r),i(r,Je),t.isWindowOpen||(l(r),s(),t.isWindowOpen=!0,a(),u(r)),sn(r),!0;if(n.timeout)return et(r,o?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const c=o?.serverMessage??"Internal server error. Please try again in a moment.";return o?.lockOnServerError===!0&&V(r),et(r,c),!0}function an(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function un(){document.getElementById("tutor-panel-loading")?.remove()}const ln={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{tt()}):tt()}};function tt(){console.log("The widget is being loaded to the page"),t.lastCanonicalProblemUrl=D(window.location.href),Tt({appendToContentPanel:Le,scheduleSessionPersist:w,syncSessionLanguageFromPage:Ee,handleBackendError:z}),Lt({appendToContentPanel:Le,scheduleSessionPersist:w,syncSessionLanguageFromPage:Ee,handleBackendError:z}),nn({ensureAuthPrompt:H,showTutorPanel:_,hideWidget:G,markUserActivity:Te,scheduleSessionPersist:w,appendPanelMessage:Y,setPanelControlsDisabled:me}),Yt({lockPanel:V}),Nt({highlightExistingPanel:pn,lockPanel:V,markUserActivity:Te,showPanelLoading:an,hidePanelLoading:un,initSessionTopicsIfNeeded:Se}),_t({stopPanelOperations:Zt,unlockPanel:on}),Ct({openTutorPanel:be,closeTutorPanel:zt,askAnything:fn,highlightAskArea:gn,appendPanelMessage:Y,maybeQueueSummary:Ie,scheduleSessionPersist:w,syncSessionLanguageFromPage:Ee,handleBackendError:z,workspaceUrl:dn}),Pt(),Dt(),Qt(),Wt(),xt(),Oe().then(()=>{t.pendingStoredSession?.panelOpen&&be()}),window.addEventListener("beforeunload",()=>{B(t.currentTutorSession?.element??null)})}function Ee(){A(w)}async function cn(e){if(t.summarizeInFlight||e.toSummarize.length===0)return;const n=e.toSummarize.splice(0);t.summarizeInFlight=!0;try{const o=await lt({sessionId:t.currentTutorSession?.sessionId??"",summarize:n,summary:e.summary});if(z(t.currentTutorSession?.element??null,o,{silent:!0}))return;const r=typeof o=="string"?o:o?.reply;typeof r=="string"&&(e.summary=r)}finally{t.summarizeInFlight=!1}}function Ie(e){if(e.qaHistory.length<=40)return;const n=e.qaHistory.splice(0,20);e.toSummarize.push(...n),cn(e)}const dn="http://localhost:3000/auth/bridge";function pn(e){}function gn(){}async function fn(e,n){const o=tn(e),r=t.currentTutorSession?.language||F(),i=await ft({sessionId:t.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:t.currentTutorSession?.sessionRollingHistory.qaHistory,summary:t.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:r});if(z(e,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return o?.remove(),"Failure";const s=typeof i=="string"?i:i?.reply;return typeof s=="string"&&s.trim()&&(o?.remove(),Le(e,"","assistant",s)),o?.remove(),s||"Failure"}async function Le(e,n,o,r){const i=en(r),s=e.querySelector(".tutor-panel-content");if(s&&typeof r=="string"){if(o==="assistant"){const a=Y(e,"","assistant");if(!a)return;await ve(a,s,i,{render:I}),a.innerHTML=I(i),t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${r}`),t.currentTutorSession&&Ie(t.currentTutorSession.sessionRollingHistory),s.scrollTop=a.offsetTop,w(e)}else if(o==="guideAssistant"){let a=t.guideActiveSlab&&s.contains(t.guideActiveSlab)?t.guideActiveSlab:null;if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const c=document.createElement("ul");c.className="guide-list",a.appendChild(c),s.appendChild(a),t.guideActiveSlab=a}const u=a.querySelector(".guide-list")??document.createElement("ul");u.classList.contains("guide-list")||(u.className="guide-list",a.appendChild(u));const l=document.createElement("li");l.className="guide-item",u.appendChild(l),t.guideMessageCount===0&&a.classList.add("guide-start"),t.guideMessageCount+=1,t.lastGuideMessageEl=a,await ve(l,s,i,{render:I}),l.innerHTML=I(i),s.scrollTop=a.offsetTop,w(e)}else if(o==="checkAssistant"){const a=Y(e,"","checkAssistant");if(!a)return;const u=a.querySelector(".tutor-panel-message--checkAssistant");if(!u)return;a.classList.add("check-start"),await ve(u,s,i,{render:I}),u.innerHTML=I(i),a.classList.add("check-end"),s.scrollTop=a.offsetTop,t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${r}`),t.currentTutorSession&&Ie(t.currentTutorSession.sessionRollingHistory),w(e)}}}function X(e,...n){}const mn={debug:(...e)=>X(console.debug,...e),log:(...e)=>X(console.log,...e),warn:(...e)=>X(console.warn,...e),error:(...e)=>X(console.error,...e)};class Ae extends Event{constructor(n,o){super(Ae.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=o}static EVENT_NAME=Me("wxt:locationchange")}function Me(e){return`${y?.runtime?.id}:content:${e}`}function hn(e){let n,o;return{run(){n==null&&(o=new URL(location.href),n=e.setInterval(()=>{let r=new URL(location.href);r.href!==o.href&&(window.dispatchEvent(new Ae(r,o)),o=r)},1e3))}}}class K{constructor(n,o){this.contentScriptName=n,this.options=o,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Me("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=hn(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return y.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,o){const r=setInterval(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(n,o){const r=setTimeout(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(n){const o=requestAnimationFrame((...r)=>{this.isValid&&n(...r)});return this.onInvalidated(()=>cancelAnimationFrame(o)),o}requestIdleCallback(n,o){const r=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},o);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(n,o,r,i){o==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(o.startsWith("wxt:")?Me(o):o,r,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),mn.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:K.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const o=n.data?.type===K.SCRIPT_STARTED_MESSAGE_TYPE,r=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return o&&r&&i}listenForNewerScripts(n){let o=!0;const r=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=o;if(o=!1,s&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}}function xn(){}function Q(e,...n){}const bn={debug:(...e)=>Q(console.debug,...e),log:(...e)=>Q(console.log,...e),warn:(...e)=>Q(console.warn,...e),error:(...e)=>Q(console.error,...e)};return(async()=>{try{const{main:e,...n}=ln,o=new K("content",n);return await e(o)}catch(e){throw bn.error('The content script "content" crashed on startup!',e),e}})()})();
content;