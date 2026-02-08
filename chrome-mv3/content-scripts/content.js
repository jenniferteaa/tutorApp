var content=(function(){"use strict";function In(e){return e}const t={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null},ut=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],De={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function ne(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const Y=new Map(ut.map(e=>[ne(e),De[e]??e]));Object.values(De).forEach(e=>{Y.set(ne(e),e)});function lt(e){return e.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function re(e){const n=ne(e);if(!n)return e.trim();const r=Y.get(n);if(r)return r;const o=n.split(" ");if(o.length>0){const i=o[o.length-1];if(i.endsWith("s")){o[o.length-1]=i.slice(0,-1);const s=o.join(" "),a=Y.get(s);if(a)return a}else{o[o.length-1]=`${i}s`;const s=o.join(" "),a=Y.get(s);if(a)return a}}return lt(n)}function Fe(e,n){const r=re(n),o=Object.keys(e).find(i=>re(i)===r);return o&&o!==r&&(e[r]=e[o],delete e[o]),e[r]??={thoughts_to_remember:[],pitfalls:[]},r}function B(e){try{const{origin:n,pathname:r}=new URL(e),o=r.match(/^\/problems\/[^/]+/);return o?`${n}${o[0]}`:`${n}${r}`}catch{return e}}function q(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Be(e){const n=e.match(/^\s*(\d+)/);if(!n)return null;const r=Number(n[1]);return Number.isFinite(r)?r:null}function ct(){const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(r=>r.getAttribute("href")).filter(r=>!!r).map(r=>r.replace("/tag/","").replace("/","")).map(r=>re(r));return Object.fromEntries(Array.from(new Set(n)).map(r=>[r,{thoughts_to_remember:[],pitfalls:[]}]))}function N(){const e=document.querySelector("#editor");if(!e)return"";const n=e.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(o=>o.nodeType===Node.TEXT_NODE&&o.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}const dt='#editor button[aria-haspopup="dialog"]';function C(e){if(!t.currentTutorSession)return;const n=N();n&&t.currentTutorSession.language!==n&&(t.currentTutorSession.language=n,e(t.currentTutorSession.element??null))}function oe(e){const n=document.querySelector(dt);if(n){if(n.dataset.tutorLangListener||(n.dataset.tutorLangListener="true",n.addEventListener("click",()=>{window.setTimeout(()=>C(e),50)},{passive:!0})),t.languageObserverTarget===n&&t.languageObserver){C(e);return}t.languageObserver?.disconnect(),t.languageObserverTarget=n,t.languageObserver=new MutationObserver(()=>{C(e)}),t.languageObserver.observe(n,{childList:!0,characterData:!0,subtree:!0}),C(e)}}const w=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function pt(e){return w.runtime.sendMessage({action:"summarize-history",payload:e})}function gt(e){return w.runtime.sendMessage({action:"init-session-topics",payload:e})}function ft(e){return w.runtime.sendMessage({action:"guide-mode",payload:e})}function mt(e){return w.runtime.sendMessage({action:"guide-mode-status",payload:e})}function ht(e){return w.runtime.sendMessage({action:"check-code",payload:e})}function bt(e){return w.runtime.sendMessage({action:"ask-anything",payload:e})}function St(e){return w.runtime.sendMessage({action:"go-to-workspace",payload:e})}function wt(e){return w.runtime.sendMessage({action:"supabase-login",payload:e})}function yt(e){return w.runtime.sendMessage({action:"supabase-signup",payload:e})}function qe(){return w.runtime.sendMessage({type:"GET_MONACO_CODE"})}const j="vibetutor-auth",Ne="vibetutor-session",ze=1440*60*1e3,Tt=1800*1e3,xt=`${Ne}:`;let ie=null,Oe=!1;function se(e,n){return`${Ne}:${encodeURIComponent(e)}:${encodeURIComponent(n)}`}async function ae(){return(await w.storage.local.get(j))[j]??null}function vt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function He(){await w.storage.local.remove(j),await w.runtime.sendMessage({action:"clear-auth"})}async function ue(e,n){const r=se(e,n),i=(await w.storage.local.get(r))[r]??null;return i?Date.now()-(i.lastActivityAt??0)>ze?(await w.storage.local.remove(r),null):i:null}async function le(e,n){const r=se(e,n);await w.storage.local.remove(r)}async function We(){const e=await w.storage.local.get(null),n=Date.now(),r=[];for(const[o,i]of Object.entries(e)){if(!o.startsWith(xt))continue;const a=i?.lastActivityAt??0;n-a>ze&&r.push(o)}r.length>0&&await w.storage.local.remove(r)}function kt(){We(),ie&&window.clearInterval(ie),ie=window.setInterval(()=>{We()},Tt)}function Et(e){Oe||(Oe=!0,w.storage.onChanged.addListener((n,r)=>{if(r!=="local")return;const o=n[j];o&&o.newValue==null&&e()}))}function ce(e,n,r){return e.state.userId?e.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):e.state.problemUrl===r:(console.log("There was no stored user in the browser."),!1)}async function z(e,n){if(!t.currentTutorSession||!t.currentTutorSession.userId||t.sessionRestorePending&&!n?.force)return;const r=e?.querySelector(".tutor-panel-content")??t.currentTutorSession.element?.querySelector(".tutor-panel-content"),o=se(t.currentTutorSession.userId,t.currentTutorSession.problem),i={state:{sessionId:t.currentTutorSession.sessionId,userId:t.currentTutorSession.userId,content:t.currentTutorSession.content,sessionTopicsInitialized:t.currentTutorSession.sessionTopicsInitialized,language:t.currentTutorSession.language,problem:t.currentTutorSession.problem,problemUrl:t.currentTutorSession.problemUrl,topics:t.currentTutorSession.topics,prompt:t.currentTutorSession.prompt,position:t.currentTutorSession.position,size:t.currentTutorSession.size,guideModeEnabled:t.currentTutorSession.guideModeEnabled,checkModeEnabled:t.currentTutorSession.checkModeEnabled,rollingStateGuideMode:t.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:t.currentTutorSession.sessionRollingHistory},panelOpen:t.isWindowOpen,contentHtml:r?.innerHTML??"",contentScrollTop:r?.scrollTop??0,lastActivityAt:t.lastActivityAt};await w.storage.local.set({[o]:i})}function y(e){t.sessionRestorePending||t.persistTimerId||(t.persistTimerId=window.setTimeout(()=>{t.persistTimerId=null,z(e)},500))}function Re(e,n){t.currentTutorSession={...n.state,element:e},t.currentTutorSession&&!t.currentTutorSession.language&&(t.currentTutorSession.language=N()),t.currentTutorSession&&t.currentTutorSession.sessionTopicsInitialized==null&&(t.currentTutorSession.sessionTopicsInitialized=!1);const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{r.scrollTop=r.scrollHeight}));const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=t.currentTutorSession.prompt??""),t.currentTutorSession.position&&(e.style.left=`${t.currentTutorSession.position.x}px`,e.style.top=`${t.currentTutorSession.position.y}px`),t.currentTutorSession.size&&(e.style.width=`${t.currentTutorSession.size.width}px`,e.style.height=`${t.currentTutorSession.size.height}px`);const i=e.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const s=i[i.length-1],a=s.querySelectorAll(".guide-item");t.guideMessageCount=a.length,t.lastGuideMessageEl=s,t.guideActiveSlab=t.currentTutorSession?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");t.guideMessageCount=s.length,t.lastGuideMessageEl=s.length>0?s[s.length-1]:null,t.guideActiveSlab=null}}async function Ge(){const e=await ae();if(!e?.userId){t.pendingStoredSession=null;return}const n=await ue(e.userId,q());if(!n){t.pendingStoredSession=null;return}if(!ce(n,e.userId,B(window.location.href))){await le(e.userId,n.state.problem),t.pendingStoredSession=null;return}t.pendingStoredSession=n,t.lastActivityAt=n.lastActivityAt??Date.now()}let de=null;function It(e){de=e}function Lt(){if(!de)throw new Error("Guide dependencies not configured");return de}function pe(){t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchTimerId=null,t.guideBatchStarted=!1,t.guideTouchedLines=new Set,t.maxLines=0,t.guideAttachAttempts=0,t.guideDrainInFlight=!1,t.lastGuideSelectionLine=null,t.lastGuideFlushLine=null,t.lastGuideFlushAt=0,t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null}function R(){return document.querySelector(".monaco-editor textarea.inputarea")}function $e(e,n){return e.slice(0,Math.max(0,n)).split(`
`).length}function _e(e,n){return e.split(`
`)[n-1]??""}function At(e){const n=e.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Mt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function V(){t.guideTouchedLines.clear(),t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchStarted=!1,t.guideBatchTimerId!==null&&(window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=null)}async function ge(e){const n=Mt(),o=R()?.value??"",i=Array.from(t.guideTouchedLines)[0]??1;if(!i){V();return}const s=Date.now();if(t.lastGuideFlushLine===i&&s-t.lastGuideFlushAt<250)return;if(t.lastGuideFlushLine=i,t.lastGuideFlushAt=s,!n){V();return}let a="";if(o&&(a=_e(o,i)),!a.trim()&&i>1&&o){const l=_e(o,i-1);l.trim()&&(a=l)}let u=n;try{const l=await qe();l?.ok&&typeof l.code=="string"&&(u=l.code)}catch{}At(a)&&(t.queue.push([u,a]),Ct()),V()}async function Ct(){const{appendToContentPanel:e,handleBackendError:n,scheduleSessionPersist:r,syncSessionLanguageFromPage:o}=Lt();if(!t.guideDrainInFlight){if(t.suspendPanelOps){t.queue=[];return}t.guideDrainInFlight=!0;try{for(;t.queue.length>0;){if(t.suspendPanelOps){t.queue=[];break}const[i,s]=t.queue.shift();if(!i||!i.trim()){t.currentTutorSession?.element&&await e(t.currentTutorSession.element,"","assistant","Couldn't read editor code. Try clicking inside the editor or reload the page.");continue}console.log("This is the focus line: ",s),console.log("the code so far: ",i),o(),t.flushInFlight=!0;const a=await ft({action:"guide-mode",sessionId:t.currentTutorSession?.sessionId??"",problem:t.currentTutorSession?.problem??"",topics:t.currentTutorSession?.topics,code:i,focusLine:s,language:t.currentTutorSession?.language??N(),rollingStateGuideMode:t.currentTutorSession?.rollingStateGuideMode});if(n(t.currentTutorSession?.element??null,a,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){t.flushInFlight=!1;continue}if(!a)console.log("failure for guide mode");else{const u=a?.data?.reply;u?.state_update?.lastEdit?.trim()&&t.currentTutorSession&&(t.currentTutorSession.rollingStateGuideMode.lastEdit=u.state_update.lastEdit);const l=u?.nudge;if(t.currentTutorSession&&typeof l=="string"){const d=l.trim();d&&(t.currentTutorSession.rollingStateGuideMode.nudges.push(d),t.currentTutorSession.content.push(`${d}
`),t.currentTutorSession.element!=null&&await e(t.currentTutorSession.element,"","guideAssistant",d),r(t.currentTutorSession.element??null))}const c=u?.topics;if(c&&typeof c=="object"&&t.currentTutorSession)for(const[d,f]of Object.entries(c)){if(!f||typeof f!="object")continue;const m=Fe(t.currentTutorSession.topics,d),p=f.thoughts_to_remember,h=f.pitfalls,g=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[],b=Array.isArray(h)?h:typeof h=="string"&&h.trim()?[h.trim()]:[];t.currentTutorSession&&(g.length>0&&t.currentTutorSession.topics[m].thoughts_to_remember.push(...g),b.length>0&&t.currentTutorSession.topics[m].pitfalls.push(...b))}t.currentTutorSession?.element&&r(t.currentTutorSession.element),t.flushInFlight=!1}}}finally{t.guideDrainInFlight=!1}}}function Ue(){if(!t.currentTutorSession?.guideModeEnabled)return;const e=R();if(!e)return;const n=e.value??"",r=e.selectionStart??0,o=$e(n,r);!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==0&&t.guideTouchedLines.add(o),t.guideBatchStarted||(t.guideBatchStarted=!0),t.guideBatchTimerId!==null&&window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=window.setTimeout(()=>{ge()},1e4),!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==1&&ge()}function Ye(){if(!t.currentTutorSession?.guideModeEnabled||!t.guideBatchStarted)return;const e=R();if(!e)return;const n=e.value??"",r=e.selectionStart??0,o=$e(n,r);if(t.lastGuideSelectionLine===null){t.lastGuideSelectionLine=o;return}o!==t.lastGuideSelectionLine&&(t.lastGuideSelectionLine=o,!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==1&&ge())}function je(){const e=R();if(!e){t.guideAttachAttempts<5&&(t.guideAttachAttempts+=1,window.setTimeout(je,500));return}e.addEventListener("input",Ue),document.addEventListener("selectionchange",Ye)}function fe(){const e=R();e&&(e.removeEventListener("input",Ue),document.removeEventListener("selectionchange",Ye))}let me=null;function Pt(e){me=e}function X(){if(!me)throw new Error("Error handling dependencies not configured");return me}const Ve="Session expired, please log back in";function G(e){const{setPanelControlsDisabled:n}=X();e.classList.add("tutor-panel-locked"),n(e,!0)}function Dt(e){const{setPanelControlsDisabled:n}=X();e.classList.remove("tutor-panel-locked"),n(e,!1)}function Ft(e){return typeof e=="object"&&e!==null&&e.success===!1}function Bt(e){const n=e.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(o=>{o.textContent?.trim()===Ve&&o.remove()})}function Xe(e,n){const{appendPanelMessage:r,scheduleSessionPersist:o}=X(),i=e.querySelector(".tutor-panel-content");if(!i)return;const s=r(e,n,"assistant");s&&(i.scrollTop=s.offsetTop,o(e))}function O(e,n,r){if(!Ft(n))return!1;const o=e??t.currentTutorSession?.element??null;if(!o)return!0;const{ensureAuthPrompt:i,hideWidget:s,markUserActivity:a,scheduleSessionPersist:u,showTutorPanel:l}=X();if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return G(o),i(o,Ve),t.isWindowOpen||(l(o),s(),t.isWindowOpen=!0,a(),u(o)),Bt(o),!0;if(r?.silent)return console.debug("Silent backend error",n),!0;if(n.timeout)return Xe(o,r?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const c=r?.serverMessage??"Internal server error. Please try again in a moment.";return r?.lockOnServerError===!0&&G(o),Xe(o,c),!0}function qt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function Nt(){document.getElementById("tutor-panel-loading")?.remove()}let he=null;function zt(e){he=e}function Ot(){if(!he)throw new Error("Check dependencies not configured");return he}async function Ht(e,n){const{appendToContentPanel:r,handleBackendError:o,scheduleSessionPersist:i,syncSessionLanguageFromPage:s}=Ot();try{s();const a=await ht({sessionId:t.currentTutorSession?.sessionId??"",topics:t.currentTutorSession?.topics,code:n,action:"check-code",language:t.currentTutorSession?.language??N(),problem_no:Be(t.currentTutorSession?.problem??""),problem_name:t.currentTutorSession?.problem??"",problem_url:t.currentTutorSession?.problemUrl??""});if(o(e,a,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const u=a?.data?.resp;t.currentTutorSession&&typeof u=="string"&&t.currentTutorSession.content.push(`${u}
`),typeof u=="string"&&u.trim()&&await r(e,"","checkAssistant",u);const l=a?.data?.topics;if(l&&typeof l=="object"&&t.currentTutorSession)for(const[c,d]of Object.entries(l)){if(!d||typeof d!="object")continue;const f=Fe(t.currentTutorSession.topics,c),m=d.thoughts_to_remember,p=d.pitfalls,h=Array.isArray(m)?m:typeof m=="string"&&m.trim()?[m.trim()]:[],g=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[];t.currentTutorSession&&(h.length>0&&t.currentTutorSession.topics[f].thoughts_to_remember.push(...h),g.length>0&&t.currentTutorSession.topics[f].pitfalls.push(...g))}return console.log("this is the object now: ",t.currentTutorSession?.topics),i(e),a?.data?.resp}catch(a){return console.error("checkMode failed",a),"Failure"}}let be=null;function Wt(e){be=e}function Ke(){if(!be)throw new Error("Widget dependencies not configured");return be}function Rt(){const{closeTutorPanel:e,openTutorPanel:n}=Ke(),r=document.getElementById("tutor-widget");r&&r.remove(),t.widget=document.createElement("div"),t.widget.id="tutor-widget",t.widget.innerHTML=`
  <div class="widget-main-button" id="main-button">
  </div>
  `;const o=document.createElement("style");o.textContent=`
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
 /* font-weight: 700; */
  font-size: 13px;
}
.tutor-panel-auth .auth-password-hint{
  display: none;
  width: 100%;
  margin: 6px 0 0 0;
  color: rgba(195, 49, 38, 0.95);
  /* font-weight: 100; */
  font-size: 10px;
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

`,document.head.appendChild(o),document.body.appendChild(t.widget);const i=document.getElementById("main-button");if(!i||!t.widget)return;let s=0,a={x:0,y:0},u=!1,l=!1;function c(p,h){const g=t.widget.offsetWidth,b=t.widget.offsetHeight;return{x:Math.max(0,Math.min(p,window.innerWidth-g)),y:Math.max(0,Math.min(h,window.innerHeight-b))}}function d(p,h){const g=t.widget.offsetWidth,b=t.widget.offsetHeight;return{x:p<window.innerWidth/2?0:window.innerWidth-g,y:Math.max(0,Math.min(h,window.innerHeight-b))}}i.addEventListener("mousedown",p=>{s=Date.now(),a={x:p.clientX,y:p.clientY},u=!1,l=!1;const h=t.widget.getBoundingClientRect();t.dragOffset.x=p.clientX-h.left,t.dragOffset.y=p.clientY-h.top,document.addEventListener("mousemove",f),document.addEventListener("mouseup",m),i&&i.classList.add("dragging")}),i.addEventListener("click",p=>{if(l){l=!1;return}!t.isDragging&&!u&&(p.preventDefault(),p.stopPropagation(),t.isWindowOpen?e():n())});function f(p){const h=Date.now()-s,g=Math.sqrt(Math.pow(p.clientX-a.x,2)+Math.pow(p.clientY-a.y,2));if(!t.isDragging&&(g>3||h>100)&&(t.isDragging=!0,u=!0,document.body.style.cursor="grabbing"),t.isDragging){const b=p.clientX-t.dragOffset.x,x=p.clientY-t.dragOffset.y,v=c(b,x);Se(v.x,v.y),t.lastPosition={x:v.x,y:v.y}}}function m(){if(document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",m),i?.classList.remove("dragging"),document.body.style.cursor="",t.isDragging&&t.widget){l=!0;const p=d(t.lastPosition.x,t.lastPosition.y);t.widget.style.transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1)",Se(p.x,p.y),window.setTimeout(()=>{t.widget&&(t.widget.style.transition="")},300),Ze()}t.isDragging=!1,u=!1}}function Se(e,n){if(!t.widget)return;const r=t.widget.offsetWidth||50,o=t.widget.offsetHeight||50,i=Math.max(0,Math.min(e,window.innerWidth-r)),s=Math.max(0,Math.min(n,window.innerHeight-o));t.widget.style.left=`${i}px`,t.widget.style.top=`${s}px`,t.widget.style.right="auto",t.widget.style.bottom="auto",t.widget.style.transform="",t.lastPosition={x:i,y:s}}function $(){t.widget&&(t.widget.style.display="none")}function Qe(){t.widget&&(t.widget.style.display="block")}async function Ze(){}async function Gt(){}function $t(e){if(!t.widget)return;const n=e.getBoundingClientRect(),r=t.widget.getBoundingClientRect(),o=r.width||50,i=r.height||50,u=n.left+n.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,l=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));Se(u,l),Ze()}function D(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function K(e){const n=e.split("`"),r=o=>{const i=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,u;for(;(u=i.exec(o))!==null;){s+=D(o.slice(a,u.index));const l=u[1];l.startsWith("**")?s+=`<strong>${D(l.slice(2,-2))}</strong>`:s+=`<code>${D(l.slice(1,-1))}</code>`,a=i.lastIndex}return s+=D(o.slice(a)),s};return n.map((o,i)=>i%2===1?`<code>${D(o)}</code>`:r(o)).join("")}function _t(e){const n=e.replace(/\r\n/g,`
`).split(`
`);let r="",o=[],i=null;const s=()=>{o.length!==0&&(r+=`<p>${K(o.join(" "))}</p>`,o=[])},a=()=>{i&&(r+=`</${i}>`,i=null)};for(const u of n){const l=u.trim();if(!l){s(),a();continue}const c=l.match(/^(#{1,3})\s+(.*)$/);if(c){s(),a();const m=c[1].length;r+=`<h${m}>${K(c[2])}</h${m}>`;continue}const d=l.match(/^(\d+)[.)]\s+(.*)$/);if(d){s(),i&&i!=="ol"&&a(),i||(i="ol",r+="<ol>"),r+=`<li>${K(d[2])}</li>`;continue}const f=l.match(/^[-*]\s+(.*)$/);if(f){s(),i&&i!=="ul"&&a(),i||(i="ul",r+="<ul>"),r+=`<li>${K(f[1])}</li>`;continue}o.push(l)}return s(),a(),r}function Je(e){const n=e.split(`
`),r=u=>/^\s*\|?[-:\s|]+\|?\s*$/.test(u),o=u=>(u.match(/\|/g)?.length??0)>=2;let i=!1;const s=[];let a=0;for(;a<n.length;){const u=n[a];if(u.trim().startsWith("```")){i=!i,s.push(u),a+=1;continue}if(i){s.push(u),a+=1;continue}if(o(u)||r(u)){const l=[];for(;a<n.length;){const c=n[a];if(c.trim().startsWith("```")||!(o(c)||r(c)))break;l.push(c),a+=1}l.length>0&&(s.push("```table"),s.push(...l),s.push("```"));continue}s.push(u),a+=1}return s.join(`
`)}function Ut(e){const n=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return Je(e);const r=n[1].trim(),i=n[2].trim().split(";").map(u=>u.trim()).filter(Boolean);if(i.length===0)return e;const s=i.map(u=>`- ${u.replace(/\.$/,"")}`).join(`
`),a=`${r}

**To fix**
${s}`;return Je(a)}function L(e){const n=e.replace(/\r\n/g,`
`),o=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,u;for(;(u=s.exec(o))!==null;)u.index>a&&i.push({type:"text",content:o.slice(a,u.index)}),i.push({type:"code",content:u[2]??"",lang:u[1]??""}),a=s.lastIndex;return a<o.length&&i.push({type:"text",content:o.slice(a)}),i.map(l=>{if(l.type==="code"){const c=l.lang?` data-lang="${D(l.lang)}"`:"";return`<pre${l.lang==="table"?' class="table-block"':""}><code${c}>${D(l.content.trimEnd())}</code></pre>`}return _t(l.content)}).join("")}function Yt(e){const n=e.querySelector(".tutor-panel-content");if(!n)return null;const r=document.createElement("div");r.className="tutor-panel-assistant-loading";const o=document.createElement("div");return o.className="tutor-panel-assistant-loading-dot",r.appendChild(o),n.appendChild(r),n.scrollTop=r.offsetTop,r}function Q(e,n,r){const o=e.querySelector(".tutor-panel-content");if(!o)return null;const i=document.createElement("div");if(r==="assistant")i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=L(n);else if(r==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(r==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=L(n),s.appendChild(i),o.appendChild(s),s}else if(r==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=L(n),s.appendChild(i),o.appendChild(s),s}else i.textContent=n;return o.append(i),o.scrollTop=i.offsetTop,i}function we(e,n,r,o){return new Promise(i=>{let s=0;const a=2,u=e.offsetTop;n.scrollTop=u;let l=!0;const c=()=>{Math.abs(n.scrollTop-u)>8&&(l=!1)};n.addEventListener("scroll",c,{passive:!0});const d=()=>{s=Math.min(r.length,s+a);const f=r.slice(0,s);o?.render?e.innerHTML=o.render(f):e.textContent=f,l&&(n.scrollTop=u),s<r.length?window.setTimeout(d,12):(n.removeEventListener("scroll",c),i())};d()})}let ye=null;function jt(e){ye=e}function Vt(){if(!ye)throw new Error("Panel dependencies not configured");return ye}function et(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const n=40,r=Math.round(window.innerHeight*.38),o=window.innerWidth-e.offsetWidth-20,i=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(n,o))}px`,e.style.top=`${Math.max(20,Math.min(r,i))}px`,setTimeout(()=>e.classList.add("open"),10),Kt(e),e}function _(e){t.panelHideTimerId!==null&&(window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Xt(e){e.classList.remove("open"),e.classList.add("closing"),t.panelHideTimerId!==null&&window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),t.panelHideTimerId=null},180)}function tt(e,n){const r=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=e.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function Te(e,n){const r=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=e.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}async function xe(e,n,r,o){const{maybeQueueSummary:i,scheduleSessionPersist:s}=Vt(),a=Ut(o),u=e.querySelector(".tutor-panel-content");if(u&&typeof o=="string"){if(r==="assistant"){const l=Q(e,"","assistant");if(!l)return;await we(l,u,a,{render:L}),l.innerHTML=L(a),t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${o}`),t.currentTutorSession&&i(t.currentTutorSession.sessionRollingHistory),u.scrollTop=l.offsetTop,s(e)}else if(r==="guideAssistant"){let l=t.guideActiveSlab&&u.contains(t.guideActiveSlab)?t.guideActiveSlab:null;if(!l){l=document.createElement("div"),l.className="guide-wrapper guide-slab";const f=document.createElement("ul");f.className="guide-list",l.appendChild(f),u.appendChild(l),t.guideActiveSlab=l}const c=l.querySelector(".guide-list")??document.createElement("ul");c.classList.contains("guide-list")||(c.className="guide-list",l.appendChild(c));const d=document.createElement("li");d.className="guide-item",c.appendChild(d),t.guideMessageCount===0&&l.classList.add("guide-start"),t.guideMessageCount+=1,t.lastGuideMessageEl=l,await we(d,u,a,{render:L}),d.innerHTML=L(a),u.scrollTop=l.offsetTop,s(e)}else if(r==="checkAssistant"){const l=Q(e,"","checkAssistant");if(!l)return;const c=l.querySelector(".tutor-panel-message--checkAssistant");if(!c)return;l.classList.add("check-start"),await we(c,u,a,{render:L}),c.innerHTML=L(a),l.classList.add("check-end"),u.scrollTop=l.offsetTop,t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${o}`),t.currentTutorSession&&i(t.currentTutorSession.sessionRollingHistory),s(e)}}}function Kt(e){const{askAnything:n,appendPanelMessage:r,closeTutorPanel:o,handleBackendError:i,highlightAskArea:s,maybeQueueSummary:a,scheduleSessionPersist:u,syncSessionLanguageFromPage:l,workspaceUrl:c}=Ke(),d=e.querySelector(".tutor-panel-close"),f=e.querySelector(".btn-help-mode"),m=e.querySelector(".btn-guide-mode"),p=e.querySelector(".btn-gotToWorkspace");m?.addEventListener("click",()=>{if(!t.currentTutorSession)return;t.currentTutorSession.guideModeEnabled=!t.currentTutorSession.guideModeEnabled;const S=e.querySelector(".btn-guide-mode"),E=t.currentTutorSession.problem,A=Be(E);(async()=>{let P=!1;for(;;){const M=await mt({enabled:t.currentTutorSession?.guideModeEnabled??!1,sessionId:t.currentTutorSession?.sessionId??"",problem_no:A,problem_name:E,problem_url:t.currentTutorSession?.problemUrl});if(M&&M?.unauthorized){i(e,M);return}if(!M?.success){const En=M?.error?.toLowerCase()??"";if((M?.timeout||En.includes("network"))&&!P){P=!0;continue}console.debug("Guide mode status update failed",M);return}return}})(),tt(e,!0),e.classList.add("guidemode-active"),t.currentTutorSession.guideModeEnabled?(S?.classList.add("is-loading"),t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null,je()):(fe(),t.lastGuideMessageEl&&t.lastGuideMessageEl.classList.add("guide-end"),tt(e,!1),e.classList.remove("guidemode-active"),S?.classList.remove("is-loading")),u(e)}),p?.addEventListener("click",async()=>{if(!c){console.warn("Workspace URL is not set.");return}const S=await St({url:c});i(e,S,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const h=e.querySelector(".tutor-panel-prompt"),g=e.querySelector(".tutor-panel-send");h?.addEventListener("keydown",async S=>{S.key!=="Enter"||S.shiftKey||(S.preventDefault(),g?.click())}),g?.addEventListener("click",async()=>{if(l(),t.currentTutorSession?.prompt){const S=t.currentTutorSession.prompt;h&&(h.value=""),t.currentTutorSession&&(t.currentTutorSession.prompt=""),r(e,S,"user"),t.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${S}`),a(t.currentTutorSession.sessionRollingHistory),u(e),await n(e,S),t.currentTutorSession.prompt="",u(e)}else return s()}),d?.addEventListener("mousedown",S=>{S.stopPropagation()}),d?.addEventListener("click",async()=>o()),f?.addEventListener("click",async()=>{const S=e.querySelector(".btn-help-mode");let E="";t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!0,S?.classList.add("is-loading")),Te(e,!0),e.classList.add("checkmode-active");try{const A=await qe();if(A?.ok&&typeof A.code=="string"&&t.currentTutorSession&&(E=A.code),!E.trim()){r(e,"Couldn't read editor code. Try clicking inside the editor or reload the page.","assistant");return}const P=await Ht(e,E);console.log("this is the response: ",P)}catch{}finally{t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!1,S?.classList.remove("is-loading")),Te(e,!1),e.classList.remove("checkmode-active"),u(e)}}),h?.addEventListener("input",()=>{t.currentTutorSession&&(t.currentTutorSession.prompt=h.value),u(e)});let b=!1,x=0,v=0,T=0,k=0,I=null;const W=.6,U=e.querySelector(".tutor-panel-shellbar"),F=()=>{if(!b){I=null;return}const S=e.offsetLeft,E=e.offsetTop,A=S+(T-S)*W,P=E+(k-E)*W;e.style.left=`${A}px`,e.style.top=`${P}px`,I=requestAnimationFrame(F)},st=S=>{if(!b)return;const E=S.clientX-x,A=S.clientY-v,P=window.innerWidth-e.offsetWidth,M=window.innerHeight-e.offsetHeight;T=Math.max(10,Math.min(E,P)),k=Math.max(10,Math.min(A,M)),I===null&&(I=requestAnimationFrame(F))},at=()=>{b&&(b=!1,document.removeEventListener("mousemove",st),document.removeEventListener("mouseup",at),I!==null&&(cancelAnimationFrame(I),I=null),e.style.left=`${T}px`,e.style.top=`${k}px`,t.currentTutorSession&&(t.currentTutorSession.position={x:e.offsetLeft,y:e.offsetTop}),u(e))};U?.addEventListener("mousedown",S=>{S.preventDefault(),b=!0,x=S.clientX-e.getBoundingClientRect().left,v=S.clientY-e.getBoundingClientRect().top,T=e.offsetLeft,k=e.offsetTop,document.addEventListener("mousemove",st),document.addEventListener("mouseup",at)})}let ve=null;function Qt(e){ve=e}function Zt(){if(!ve)throw new Error("Lifecycle dependencies not configured");return ve}function nt(e,n,r){const o=r??q(),i=crypto.randomUUID();return{element:e,sessionId:i,userId:n,problem:o,problemUrl:B(window.location.href),language:N(),topics:ct(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function ke(){const{highlightExistingPanel:e,lockPanel:n,markUserActivity:r,showPanelLoading:o,hidePanelLoading:i,initSessionTopicsIfNeeded:s}=Zt(),a=await ae(),u=vt(a),l=a?.userId??"";if(u&&await He(),t.currentTutorSession&&t.currentTutorSession.element&&document.body.contains(t.currentTutorSession.element)){oe(y),C(y),_(t.currentTutorSession.element),$(),t.isWindowOpen=!0,e(t.currentTutorSession.element);const d=t.currentTutorSession.element.querySelector(".tutor-panel-content");d&&requestAnimationFrame(()=>{d.scrollTop=d.scrollHeight}),!l||u?(n(t.currentTutorSession.element),H(t.currentTutorSession.element,u?"session expired, please log back in":void 0)):s(t.currentTutorSession),r(),y(t.currentTutorSession.element);return}if(t.currentTutorSession?.userId){o();try{await z(t.currentTutorSession.element??null,{force:!0})}finally{i()}}if(!t.pendingStoredSession&&l){const d=await ue(l,q());d&&ce(d,l,B(window.location.href))&&(t.pendingStoredSession=d)}if(t.pendingStoredSession){const d=et();Re(d,t.pendingStoredSession),t.pendingStoredSession=null,oe(y),C(y),_(d),$(),t.isWindowOpen=!0,r(),!l||u?(n(d),H(d,u?"session expired, please log back in":void 0)):t.currentTutorSession&&s(t.currentTutorSession),y(d);return}const c=et();if(!c){console.log("There was an error creating a panel");return}t.currentTutorSession=nt(c,l),oe(y),C(y),_(c),$(),t.isWindowOpen=!0,r(),y(c),t.currentTutorSession&&(!l||u?(n(c),H(c,u?"session expired, please log back in":void 0)):(t.currentTutorSession.userId=l,s(t.currentTutorSession)),setTimeout(()=>{const d=c.querySelector(".tutor-panel-prompt");d&&(d.focus(),d.setSelectionRange(d.value.length,d.value.length))},100))}function Jt(){t.currentTutorSession?.element&&(Xt(t.currentTutorSession.element),$t(t.currentTutorSession.element),Qe(),t.isWindowOpen=!1,y(t.currentTutorSession.element))}async function en(e){t.currentTutorSession?.userId&&t.currentTutorSession.element&&await z(t.currentTutorSession.element,{force:!0}),t.pendingStoredSession=null,pe();const n=t.isWindowOpen;t.currentTutorSession?.element&&t.currentTutorSession.element.remove(),t.currentTutorSession=null,t.isWindowOpen=!1,Qe(),await Ge(),n&&(await nn(),ke())}function tn(){t.problemUrlWatcherId&&window.clearInterval(t.problemUrlWatcherId),t.problemUrlWatcherId=window.setInterval(()=>{const e=B(window.location.href);e!==t.lastCanonicalProblemUrl&&(t.lastCanonicalProblemUrl=e,en())},1e3)}async function nn(e=2e3,n=100){const r=Date.now()+e;let o=q();for(;!o&&Date.now()<r;)await new Promise(i=>setTimeout(i,n)),o=q();return o}async function Ee(e){if(e.sessionTopicsInitialized)return;let n=!1;for(;;){const r=await gt({sessionId:e.sessionId,topics:e.topics});if(r&&r?.unauthorized){O(e.element??null,r);return}if(!r?.success){const o=r?.error?.toLowerCase()??"";if((r?.timeout||o.includes("network"))&&!n){n=!0;continue}console.debug("Init session topics failed",r);return}e.sessionTopicsInitialized=!0,y(e.element??null);return}}function rn(e,n,r){pe();const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML="");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=""),t.currentTutorSession=nt(e,n,r),t.currentTutorSession&&Ee(t.currentTutorSession)}function Ie(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}async function on(e,n){return wt({email:e,password:n})}async function sn(e){return yt(e)}async function rt(e,n,r,o){const i=t.currentTutorSession?.userId??"",s=t.currentTutorSession?.problem??q();if(t.suspendPanelOps=!1,i&&i===r){t.sessionRestorePending=!1,o.unlockPanel(e),n.remove(),y(e);return}i&&i!==r&&(await z(e,{force:!0}),rn(e,r,s));const a=await ue(r,s);a&&ce(a,r,B(window.location.href))?(Re(e,a),await le(r,a.state.problem),t.pendingStoredSession=null):a&&await le(r,a.state.problem),t.currentTutorSession&&(t.currentTutorSession.userId=r,Ee(t.currentTutorSession)),t.sessionRestorePending=!1,o.unlockPanel(e),n.remove(),y(e)}let Le=null;function an(e){Le=e}function un(){if(!Le)throw new Error("Auth overlay dependencies not configured");return Le}function H(e,n){const r=e.querySelector(".tutor-panel-auth");if(r){if(n){const c=r.querySelector(".auth-error");c&&(c.textContent=n,c.style.display="block")}return}const{stopPanelOperations:o,unlockPanel:i}=un();t.suspendPanelOps=!0,o(e);const s=document.createElement("div");s.className="tutor-panel-auth",e.appendChild(s);const a=(c,d)=>{if(!c||!d)return;const f=()=>{const m=c.type==="password";d.setAttribute("aria-label",m?"Show password":"Hide password")};d.addEventListener("click",()=>{c.type=c.type==="password"?"text":"password",f(),c.focus(),c.setSelectionRange(c.value.length,c.value.length)}),f()},u=c=>{s.innerHTML=`
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
    `;const d=s.querySelector(".auth-email"),f=s.querySelector(".auth-password"),m=s.querySelector(".auth-login"),p=s.querySelector(".auth-signup"),h=s.querySelector(".auth-password-toggle"),g=s.querySelector(".auth-error");c&&g&&(g.textContent=c,g.style.display="block");const b=()=>{g&&(g.style.display="none")};d?.addEventListener("input",b),f?.addEventListener("input",b),a(f,h),m?.addEventListener("click",async()=>{const x=d?.value.trim()??"",v=f?.value.trim()??"";if(!x||!v)return;const T=await on(x,v);if(T?.success===!1){g&&(g.textContent=T.error||"Internal server error",g.style.display="block");return}const k=T?.data;k?.userId&&k?.jwt?await rt(e,s,k.userId,{unlockPanel:i}):g&&(console.log("this is the resp: ",T),g.textContent="Invalid creds",g.style.display="block")}),p?.addEventListener("click",()=>{l()})},l=()=>{s.innerHTML=`
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
    `;const c=s.querySelector(".auth-first-name"),d=s.querySelector(".auth-last-name"),f=s.querySelector(".auth-email"),m=s.querySelector(".auth-password"),p=s.querySelector(".auth-signup-submit"),h=s.querySelector(".auth-password-toggle"),g=s.querySelector(".auth-error"),b=s.querySelector(".auth-password-hint"),x=()=>{g&&(g.style.display="none")};c?.addEventListener("input",x),d?.addEventListener("input",x),f?.addEventListener("input",x),m?.addEventListener("input",x),a(m,h),m?.addEventListener("blur",()=>{if(!b||!m)return;const T=m.value.trim();T&&!Ie(T)?(b.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",b.style.display="block"):b.style.display="none"}),m?.addEventListener("input",()=>{if(!b||!m)return;const T=m.value.trim();T&&Ie(T)&&(b.style.display="none")}),p?.addEventListener("click",async()=>{const T=c?.value.trim()??"",k=d?.value.trim()??"",I=f?.value.trim()??"",W=m?.value.trim()??"";if(!T||!k||!I||!W)return;if(!Ie(W)){b&&(b.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",b.style.display="block");return}const U=await sn({fname:T,lname:k,email:I,password:W});if(U?.success===!1){g&&(g.textContent=U.error||"Internal server error",g.style.display="block");return}const F=U?.data;F?.requiresVerification?u("Waiting for verification, check email"):F?.userId&&F?.jwt?await rt(e,s,F.userId,{unlockPanel:i}):g&&(g.style.display="block")}),s.querySelector(".auth-back")?.addEventListener("click",()=>{u()})};u(n)}async function ln(e,n){const r=Yt(e),o=t.currentTutorSession?.language||N(),i=await bt({sessionId:t.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:t.currentTutorSession?.sessionRollingHistory.qaHistory,summary:t.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:o});if(O(e,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return r?.remove(),"Failure";const s=typeof i=="string"?i:i?.data?.reply??"";return s.trim()&&(r?.remove(),xe(e,"","assistant",s)),r?.remove(),s||"Failure"}async function cn(e){if(t.summarizeInFlight||e.toSummarize.length===0)return;const n=e.toSummarize.splice(0);t.summarizeInFlight=!0;let r=!1;try{for(;;){const o=await pt({sessionId:t.currentTutorSession?.sessionId??"",summarize:n,summary:e.summary});if(o&&o?.unauthorized){O(t.currentTutorSession?.element??null,o);return}if(!o?.success){const s=o?.error?.toLowerCase()??"";if((o?.timeout||s.includes("network"))&&!r){r=!0;continue}console.debug("Summarize history failed",o);return}const i=o?.data?.reply;typeof i=="string"&&(e.summary=i);return}}finally{t.summarizeInFlight=!1}}function ot(e){if(e.qaHistory.length<=40)return;const n=e.qaHistory.splice(0,20);e.toSummarize.push(...n),cn(e)}let Ae=null;function dn(e){Ae=e}function pn(){if(!Ae)throw new Error("Activity dependencies not configured");return Ae}const gn=960*60*1e3,fn=15e3;function Z(){t.lastActivityAt=Date.now(),Date.now()-t.lastActivityStoredAt>fn&&(t.lastActivityStoredAt=Date.now(),y())}async function mn(){const{lockPanel:e}=pn();if(t.currentTutorSession?.element&&(await z(t.currentTutorSession.element,{force:!0}),t.sessionRestorePending=!0),await He(),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),t.currentTutorSession?.element){const n=t.currentTutorSession.element;fe(),n.classList.remove("guidemode-active","checkmode-active"),e(n),H(n,"session expired, please log back in")}}function hn(){const e=()=>Z(),n=["mousemove","keydown","click","scroll","input"];for(const r of n)document.addEventListener(r,e,{passive:!0});t.inactivityTimerId&&window.clearInterval(t.inactivityTimerId),t.inactivityTimerId=window.setInterval(async()=>{Date.now()-t.lastActivityAt<gn||!(await ae())?.userId||await mn()},6e4)}function bn(e){t.queue=[],t.flushInFlight=!1,pe(),fe(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}const Sn={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{it()}):it()}};function it(){console.log("The widget is being loaded to the page"),t.lastCanonicalProblemUrl=B(window.location.href),It({appendToContentPanel:xe,scheduleSessionPersist:y,syncSessionLanguageFromPage:Me,handleBackendError:O}),zt({appendToContentPanel:xe,scheduleSessionPersist:y,syncSessionLanguageFromPage:Me,handleBackendError:O}),Pt({ensureAuthPrompt:H,showTutorPanel:_,hideWidget:$,markUserActivity:Z,scheduleSessionPersist:y,appendPanelMessage:Q,setPanelControlsDisabled:Te}),dn({lockPanel:G}),Qt({highlightExistingPanel:yn,lockPanel:G,markUserActivity:Z,showPanelLoading:qt,hidePanelLoading:Nt,initSessionTopicsIfNeeded:Ee}),jt({maybeQueueSummary:ot,scheduleSessionPersist:y}),an({stopPanelOperations:bn,unlockPanel:Dt}),Et(()=>{const e=t.currentTutorSession?.element;e&&(G(e),H(e),t.isWindowOpen||(_(e),$(),t.isWindowOpen=!0,Z(),y(e)))}),Wt({openTutorPanel:ke,closeTutorPanel:Jt,askAnything:ln,highlightAskArea:Tn,appendPanelMessage:Q,maybeQueueSummary:ot,scheduleSessionPersist:y,syncSessionLanguageFromPage:Me,handleBackendError:O,workspaceUrl:wn}),Rt(),Gt(),hn(),tn(),kt(),Ge().then(()=>{t.pendingStoredSession?.panelOpen&&ke()}),window.addEventListener("beforeunload",()=>{z(t.currentTutorSession?.element??null)})}function Me(){C(y)}const wn="http://localhost:3000/auth/bridge";function yn(e){}function Tn(){}function J(e,...n){}const xn={debug:(...e)=>J(console.debug,...e),log:(...e)=>J(console.log,...e),warn:(...e)=>J(console.warn,...e),error:(...e)=>J(console.error,...e)};class Ce extends Event{constructor(n,r){super(Ce.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=r}static EVENT_NAME=Pe("wxt:locationchange")}function Pe(e){return`${w?.runtime?.id}:content:${e}`}function vn(e){let n,r;return{run(){n==null&&(r=new URL(location.href),n=e.setInterval(()=>{let o=new URL(location.href);o.href!==r.href&&(window.dispatchEvent(new Ce(o,r)),r=o)},1e3))}}}class ee{constructor(n,r){this.contentScriptName=n,this.options=r,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Pe("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=vn(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return w.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,r){const o=setInterval(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(n,r){const o=setTimeout(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(n){const r=requestAnimationFrame((...o)=>{this.isValid&&n(...o)});return this.onInvalidated(()=>cancelAnimationFrame(r)),r}requestIdleCallback(n,r){const o=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},r);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(n,r,o,i){r==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(r.startsWith("wxt:")?Pe(r):r,o,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),xn.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:ee.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const r=n.data?.type===ee.SCRIPT_STARTED_MESSAGE_TYPE,o=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return r&&o&&i}listenForNewerScripts(n){let r=!0;const o=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=r;if(r=!1,s&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function An(){}function te(e,...n){}const kn={debug:(...e)=>te(console.debug,...e),log:(...e)=>te(console.log,...e),warn:(...e)=>te(console.warn,...e),error:(...e)=>te(console.error,...e)};return(async()=>{try{const{main:e,...n}=Sn,r=new ee("content",n);return await e(r)}catch(e){throw kn.error('The content script "content" crashed on startup!',e),e}})()})();
content;