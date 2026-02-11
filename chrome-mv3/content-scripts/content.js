var content=(function(){"use strict";function Xn(e){return e}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function pt(e){return b.runtime.sendMessage({action:"summarize-history",payload:e})}function ft(e){return b.runtime.sendMessage({action:"init-session-topics",payload:e})}function mt(e){return b.runtime.sendMessage({action:"guide-mode",payload:e})}function ht(e){return b.runtime.sendMessage({action:"guide-mode-status",payload:e})}function bt(e){return b.runtime.sendMessage({action:"check-code",payload:e})}function At(e){return b.runtime.sendMessage({action:"ask-anything",payload:e})}function wt(e){return b.runtime.sendMessage({action:"go-to-workspace",payload:e})}function St(e){return b.runtime.sendMessage({action:"supabase-login",payload:e})}function yt(e){return b.runtime.sendMessage({action:"supabase-signup",payload:e})}function Ge(){return b.runtime.sendMessage({type:"GET_MONACO_CODE"})}function X(){return b.runtime.sendMessage({action:"backend-health"})}const t={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null},Tt=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],We={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function re(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const Q=new Map(Tt.map(e=>[re(e),We[e]??e]));Object.values(We).forEach(e=>{Q.set(re(e),e)});function xt(e){return e.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function ie(e){const n=re(e);if(!n)return e.trim();const o=Q.get(n);if(o)return o;const r=n.split(" ");if(r.length>0){const i=r[r.length-1];if(i.endsWith("s")){r[r.length-1]=i.slice(0,-1);const s=r.join(" "),a=Q.get(s);if(a)return a}else{r[r.length-1]=`${i}s`;const s=r.join(" "),a=Q.get(s);if(a)return a}}return xt(n)}function Oe(e,n){const o=ie(n),r=Object.keys(e).find(i=>ie(i)===o);return r&&r!==o&&(e[o]=e[r],delete e[r]),e[o]??={thoughts_to_remember:[],pitfalls:[]},o}function N(e){try{const{origin:n,pathname:o}=new URL(e),r=o.match(/^\/problems\/[^/]+/);return r?`${n}${r[0]}`:`${n}${o}`}catch{return e}}function R(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function ze(e){const n=e.match(/^\s*(\d+)/);if(!n)return null;const o=Number(n[1]);return Number.isFinite(o)?o:null}function vt(){const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(o=>o.getAttribute("href")).filter(o=>!!o).map(o=>o.replace("/tag/","").replace("/","")).map(o=>ie(o));return Object.fromEntries(Array.from(new Set(n)).map(o=>[o,{thoughts_to_remember:[],pitfalls:[]}]))}function H(){const e=document.querySelector("#editor");if(!e)return"";const n=e.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(r=>r.nodeType===Node.TEXT_NODE&&r.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}const kt='#editor button[aria-haspopup="dialog"]';function L(e){if(!t.currentTutorSession)return;const n=H();n&&t.currentTutorSession.language!==n&&(t.currentTutorSession.language=n,e(t.currentTutorSession.element??null))}function se(e){const n=document.querySelector(kt);if(n){if(n.dataset.tutorLangListener||(n.dataset.tutorLangListener="true",n.addEventListener("click",()=>{window.setTimeout(()=>L(e),50)},{passive:!0})),t.languageObserverTarget===n&&t.languageObserver){L(e);return}t.languageObserver?.disconnect(),t.languageObserverTarget=n,t.languageObserver=new MutationObserver(()=>{L(e)}),t.languageObserver.observe(n,{childList:!0,characterData:!0,subtree:!0}),L(e)}}const V="vibetutor-auth",qe="vibetutor-session",Ye=1440*60*1e3,It=1800*1e3,Et=`${qe}:`;let ae=null,Ue=!1;function ue(e,n){return`${qe}:${encodeURIComponent(e)}:${encodeURIComponent(n)}`}async function le(){return(await b.storage.local.get(V))[V]??null}function Ct(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function je(){await b.storage.local.remove(V),await b.runtime.sendMessage({action:"clear-auth"})}async function ce(e,n){const o=ue(e,n),i=(await b.storage.local.get(o))[o]??null;return i?Date.now()-(i.lastActivityAt??0)>Ye?(await b.storage.local.remove(o),null):i:null}async function de(e,n){const o=ue(e,n);await b.storage.local.remove(o)}async function Xe(){const e=await b.storage.local.get(null),n=Date.now(),o=[];for(const[r,i]of Object.entries(e)){if(!r.startsWith(Et))continue;const a=i?.lastActivityAt??0;n-a>Ye&&o.push(r)}o.length>0&&await b.storage.local.remove(o)}function Lt(){Xe(),ae&&window.clearInterval(ae),ae=window.setInterval(()=>{Xe()},It)}function Mt(e){Ue||(Ue=!0,b.storage.onChanged.addListener((n,o)=>{if(o!=="local")return;const r=n[V];r&&r.newValue==null&&e()}))}function ge(e,n,o){return e.state.userId?e.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):e.state.problemUrl===o:(console.log("There was no stored user in the browser."),!1)}async function F(e,n){if(!t.currentTutorSession||!t.currentTutorSession.userId||t.sessionRestorePending&&!n?.force)return;const o=e?.querySelector(".tutor-panel-content")??t.currentTutorSession.element?.querySelector(".tutor-panel-content"),r=ue(t.currentTutorSession.userId,t.currentTutorSession.problem),i={state:{sessionId:t.currentTutorSession.sessionId,userId:t.currentTutorSession.userId,content:t.currentTutorSession.content,sessionTopicsInitialized:t.currentTutorSession.sessionTopicsInitialized,language:t.currentTutorSession.language,problem:t.currentTutorSession.problem,problemUrl:t.currentTutorSession.problemUrl,topics:t.currentTutorSession.topics,prompt:t.currentTutorSession.prompt,position:t.currentTutorSession.position,size:t.currentTutorSession.size,guideModeEnabled:t.currentTutorSession.guideModeEnabled,checkModeEnabled:t.currentTutorSession.checkModeEnabled,rollingStateGuideMode:t.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:t.currentTutorSession.sessionRollingHistory},panelOpen:t.isWindowOpen,contentHtml:o?.innerHTML??"",contentScrollTop:o?.scrollTop??0,lastActivityAt:t.lastActivityAt};await b.storage.local.set({[r]:i})}function A(e){t.sessionRestorePending||t.persistTimerId||(t.persistTimerId=window.setTimeout(()=>{t.persistTimerId=null,F(e)},500))}function Qe(e,n){t.currentTutorSession={...n.state,element:e},t.currentTutorSession&&!t.currentTutorSession.language&&(t.currentTutorSession.language=H()),t.currentTutorSession&&t.currentTutorSession.sessionTopicsInitialized==null&&(t.currentTutorSession.sessionTopicsInitialized=!1);const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{o.scrollTop=o.scrollHeight}));const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=t.currentTutorSession.prompt??""),t.currentTutorSession.position&&(e.style.left=`${t.currentTutorSession.position.x}px`,e.style.top=`${t.currentTutorSession.position.y}px`),t.currentTutorSession.size&&(e.style.width=`${t.currentTutorSession.size.width}px`,e.style.height=`${t.currentTutorSession.size.height}px`);const i=e.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const s=i[i.length-1],a=s.querySelectorAll(".guide-item");t.guideMessageCount=a.length,t.lastGuideMessageEl=s,t.guideActiveSlab=t.currentTutorSession?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");t.guideMessageCount=s.length,t.lastGuideMessageEl=s.length>0?s[s.length-1]:null,t.guideActiveSlab=null}}async function Ve(){const e=await le();if(!e?.userId){t.pendingStoredSession=null;return}const n=await ce(e.userId,R());if(!n){t.pendingStoredSession=null;return}if(!ge(n,e.userId,N(window.location.href))){await de(e.userId,n.state.problem),t.pendingStoredSession=null;return}t.pendingStoredSession=n,t.lastActivityAt=n.lastActivityAt??Date.now()}let pe=null;function Pt(e){pe=e}function Bt(){if(!pe)throw new Error("Guide dependencies not configured");return pe}function fe(){t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchTimerId=null,t.guideBatchStarted=!1,t.guideTouchedLines=new Set,t.maxLines=0,t.guideAttachAttempts=0,t.guideDrainInFlight=!1,t.lastGuideSelectionLine=null,t.lastGuideFlushLine=null,t.lastGuideFlushAt=0,t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null}function Y(){return document.querySelector(".monaco-editor textarea.inputarea")}function Ze(e,n){return e.slice(0,Math.max(0,n)).split(`
`).length}function Ke(e,n){return e.split(`
`)[n-1]??""}function Dt(e){const n=e.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Nt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function Z(){t.guideTouchedLines.clear(),t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchStarted=!1,t.guideBatchTimerId!==null&&(window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=null)}async function me(e){const n=Nt(),r=Y()?.value??"",i=Array.from(t.guideTouchedLines)[0]??1;if(!i){Z();return}const s=Date.now();if(t.lastGuideFlushLine===i&&s-t.lastGuideFlushAt<250)return;if(t.lastGuideFlushLine=i,t.lastGuideFlushAt=s,!n){Z();return}let a="";if(r&&(a=Ke(r,i)),!a.trim()&&i>1&&r){const u=Ke(r,i-1);u.trim()&&(a=u)}let l=n;try{const u=await Ge();u?.ok&&typeof u.code=="string"&&(l=u.code)}catch{}Dt(a)&&(t.queue.push([l,a]),Rt()),Z()}async function Rt(){const{appendToContentPanel:e,handleBackendError:n,scheduleSessionPersist:o,syncSessionLanguageFromPage:r}=Bt();if(!t.guideDrainInFlight){if(t.suspendPanelOps){t.queue=[];return}t.guideDrainInFlight=!0;try{for(;t.queue.length>0;){if(t.suspendPanelOps){t.queue=[];break}const[i,s]=t.queue.shift();if(!i||!i.trim()){t.currentTutorSession?.element&&await e(t.currentTutorSession.element,"","assistant","Couldn't read editor code. Try clicking inside the editor or reload the page.");continue}console.log("This is the focus line: ",s),console.log("the code so far: ",i),r(),t.flushInFlight=!0;const a=await mt({action:"guide-mode",sessionId:t.currentTutorSession?.sessionId??"",problem:t.currentTutorSession?.problem??"",topics:t.currentTutorSession?.topics,code:i,focusLine:s,language:t.currentTutorSession?.language??H(),rollingStateGuideMode:t.currentTutorSession?.rollingStateGuideMode});if(n(t.currentTutorSession?.element??null,a,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){t.flushInFlight=!1;continue}if(!a)console.log("failure for guide mode");else{const l=a?.data?.reply;l?.state_update?.lastEdit?.trim()&&t.currentTutorSession&&(t.currentTutorSession.rollingStateGuideMode.lastEdit=l.state_update.lastEdit);const u=l?.nudge;if(t.currentTutorSession&&typeof u=="string"){const d=u.trim();d&&(t.currentTutorSession.rollingStateGuideMode.nudges.push(d),t.currentTutorSession.content.push(`${d}
`),t.currentTutorSession.element!=null&&await e(t.currentTutorSession.element,"","guideAssistant",d),o(t.currentTutorSession.element??null))}const c=l?.topics;if(c&&typeof c=="object"&&t.currentTutorSession)for(const[d,p]of Object.entries(c)){if(!p||typeof p!="object")continue;const m=Oe(t.currentTutorSession.topics,d),S=p.thoughts_to_remember,w=p.pitfalls,g=Array.isArray(S)?S:typeof S=="string"&&S.trim()?[S.trim()]:[],f=Array.isArray(w)?w:typeof w=="string"&&w.trim()?[w.trim()]:[];t.currentTutorSession&&(g.length>0&&t.currentTutorSession.topics[m].thoughts_to_remember.push(...g),f.length>0&&t.currentTutorSession.topics[m].pitfalls.push(...f))}t.currentTutorSession?.element&&o(t.currentTutorSession.element),t.flushInFlight=!1}}}finally{t.guideDrainInFlight=!1}}}function Je(){if(!t.currentTutorSession?.guideModeEnabled)return;const e=Y();if(!e)return;const n=e.value??"",o=e.selectionStart??0,r=Ze(n,o);!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==0&&t.guideTouchedLines.add(r),t.guideBatchStarted||(t.guideBatchStarted=!0),t.guideBatchTimerId!==null&&window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=window.setTimeout(()=>{me()},1e4),!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==1&&me()}function _e(){if(!t.currentTutorSession?.guideModeEnabled||!t.guideBatchStarted)return;const e=Y();if(!e)return;const n=e.value??"",o=e.selectionStart??0,r=Ze(n,o);if(t.lastGuideSelectionLine===null){t.lastGuideSelectionLine=r;return}r!==t.lastGuideSelectionLine&&(t.lastGuideSelectionLine=r,!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==1&&me())}function $e(){const e=Y();if(!e){t.guideAttachAttempts<5&&(t.guideAttachAttempts+=1,window.setTimeout($e,500));return}e.addEventListener("input",Je),document.addEventListener("selectionchange",_e)}function he(){const e=Y();e&&(e.removeEventListener("input",Je),document.removeEventListener("selectionchange",_e))}let be=null;function Ht(e){be=e}function K(){if(!be)throw new Error("Error handling dependencies not configured");return be}const et="Session expired, please log back in",Ft="Starting up the server...",Gt="Server is back. You can continue.",Wt=3e3,Ot=20;let Ae=!1;function U(e){const{setPanelControlsDisabled:n}=K();e.classList.add("tutor-panel-locked"),n(e,!0)}function zt(e){const{setPanelControlsDisabled:n}=K();e.classList.remove("tutor-panel-locked"),n(e,!1)}function qt(e){return typeof e=="object"&&e!==null&&e.success===!1}function Yt(e){const n=e.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(r=>{r.textContent?.trim()===et&&r.remove()})}function J(e,n){const{appendPanelMessage:o,scheduleSessionPersist:r}=K(),i=e.querySelector(".tutor-panel-content");if(!i)return;const s=o(e,n,"assistant");s&&(i.scrollTop=s.offsetTop,r(e))}function Ut(e){return!!(e.error&&/network/i.test(e.error))}async function jt(e,n){if(!Ae){Ae=!0;try{if((await X())?.success){J(e,n??"The model is taking longer than usual. Please try again.");return}J(e,Ft);for(let r=0;r<Ot;r+=1)if(await new Promise(s=>setTimeout(s,Wt)),(await X())?.success){J(e,Gt);return}}finally{Ae=!1}}}function G(e,n,o){if(!qt(n))return!1;const r=e??t.currentTutorSession?.element??null;if(!r)return!0;const{ensureAuthPrompt:i,hideWidget:s,markUserActivity:a,scheduleSessionPersist:l,showTutorPanel:u}=K();if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return U(r),i(r,et),t.isWindowOpen||(u(r),s(),t.isWindowOpen=!0,a(),l(r)),Yt(r),!0;if(o?.silent)return console.debug("Silent backend error",n),!0;if(n.timeout||Ut(n))return jt(r,o?.timeoutMessage),!0;const c=o?.serverMessage??"Internal server error. Please try again in a moment.";return o?.lockOnServerError===!0&&U(r),J(r,c),!0}function Xt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function Qt(){document.getElementById("tutor-panel-loading")?.remove()}let we=null;function Vt(e){we=e}function Zt(){if(!we)throw new Error("Check dependencies not configured");return we}async function Kt(e,n){const{appendToContentPanel:o,handleBackendError:r,scheduleSessionPersist:i,syncSessionLanguageFromPage:s}=Zt();try{s();const a=await bt({sessionId:t.currentTutorSession?.sessionId??"",topics:t.currentTutorSession?.topics,code:n,action:"check-code",language:t.currentTutorSession?.language??H(),problem_no:ze(t.currentTutorSession?.problem??""),problem_name:t.currentTutorSession?.problem??"",problem_url:t.currentTutorSession?.problemUrl??""});if(r(e,a,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const l=a?.data?.resp;t.currentTutorSession&&typeof l=="string"&&t.currentTutorSession.content.push(`${l}
`),typeof l=="string"&&l.trim()&&await o(e,"","checkAssistant",l);const u=a?.data?.topics;if(u&&typeof u=="object"&&t.currentTutorSession)for(const[c,d]of Object.entries(u)){if(!d||typeof d!="object")continue;const p=Oe(t.currentTutorSession.topics,c),m=d.thoughts_to_remember,S=d.pitfalls,w=Array.isArray(m)?m:typeof m=="string"&&m.trim()?[m.trim()]:[],g=Array.isArray(S)?S:typeof S=="string"&&S.trim()?[S.trim()]:[];t.currentTutorSession&&(w.length>0&&t.currentTutorSession.topics[p].thoughts_to_remember.push(...w),g.length>0&&t.currentTutorSession.topics[p].pitfalls.push(...g))}return console.log("this is the object now: ",t.currentTutorSession?.topics),i(e),a?.data?.resp}catch(a){return console.error("checkMode failed",a),"Failure"}}const Jt="data:image/png;base64,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";let Se=null;function _t(e){Se=e}function tt(){if(!Se)throw new Error("Widget dependencies not configured");return Se}function $t(){const{closeTutorPanel:e,openTutorPanel:n}=tt(),o=document.getElementById("tutor-widget");o&&o.remove(),t.widget=document.createElement("div"),t.widget.id="tutor-widget",t.widget.innerHTML=`
  <div class="widget-main-button" id="main-button" aria-label="Open tutor panel">
    <img class="widget-icon" src="${Jt}" alt="Tutor" draggable="false" />
    <button class="widget-close" type="button" aria-label="Close widget">×</button>
  </div>
  `;const r=document.createElement("style");r.textContent=`
  #tutor-widget{
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  user-select: none;
  pointer-events: auto;
  }
  
.widget-main-button {
      width: 56px;
      height: 56px;
      background: #0c0c0c;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(2px);
      position: relative;
      color: #ffffff;
    }

    .widget-main-button.is-attention {
      animation: widgetBob 1.6s ease-in-out infinite;
    }

.widget-main-button .widget-icon {
      width: 34px;
      height: 34px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45));
      -webkit-user-drag: none;
      user-drag: none;
      user-select: none;
      -webkit-user-select: none;
      pointer-events: none;
    }
.widget-main-button .widget-close {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      border: none;
      background: #575757;
      color: #ffffff;
      font-size: 12px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: none;
      opacity: 0;
      pointer-events: none;
      transition: opacity 150ms ease;
    }
.widget-main-button:hover .widget-close {
      opacity: 1;
      pointer-events: auto;
    }
.widget-main-button .widget-close:hover {
      color: #ffffff;
      background: #0b0b0b;
    }
.widget-main-button.dragging {
      cursor: grabbing !important;
     /* transform: scale(0.95); */
      box-shadow:
        0 8px 30px rgba(47,59,56,0.35),
      animation: none;
    }

@keyframes widgetBob {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}
      
    /* =========================
   PANEL - Better Layout
   ========================= */

.tutor-panel{
  position: fixed;
  width: 430px;
  height: 280px;

  /* background: linear-gradient(180deg, #eef3f1 0%, #f6f3ed 50%, #eef3f1 100%); */
  background: #EEF1F0;
  border-radius: 7px;
  border: none;
  box-shadow:
    0 14px 30px rgba(47,59,56,0.18),
    0 2px 6px rgba(47,59,56,0.10);

  z-index: 999997;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
  background: #C8D0CC;
  border-bottom: 1px solid #C1C9C5;
  transition: background-color 160ms ease, box-shadow 160ms ease;
  cursor: grab;
  justify-content: flex-end;
}
.tutor-panel-shellbar:hover{
  background: #b9c2bd;
}

.tutor-panel-shellbar:active{
  background: #b9c2bd;
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
  color: #000000;

  padding: 6px 10px;
  border-radius: 8px;

  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.01em;

  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.btn-guide-mode:not(:disabled):hover,
.btn-help-mode:not(:disabled):hover,
.btn-gotToWorkspace:not(:disabled):hover{
  background: #a5b6ae;
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-gotToWorkspace:active{
  background: #a5b6ae;
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

  background: #fbfbfb;
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
  color: #040605; /* pick the text color you want on hover */
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
  padding: 7px 10px;
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

`,document.head.appendChild(r),document.body.appendChild(t.widget);const i=document.getElementById("main-button");if(!i||!t.widget)return;const s=t.widget.querySelector(".widget-icon");s&&(s.draggable=!1,s.addEventListener("dragstart",g=>g.preventDefault())),t.widget.querySelector(".widget-close")?.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),W()});let l=0,u={x:0,y:0},c=!1,d=!1;function p(g,f){t.widget.offsetWidth;const y=t.widget.offsetHeight;return{x:0,y:Math.max(0,Math.min(f,window.innerHeight-y))}}function m(g,f){t.widget.offsetWidth;const y=t.widget.offsetHeight;return{x:0,y:Math.max(0,Math.min(f,window.innerHeight-y))}}i.addEventListener("mousedown",g=>{l=Date.now(),u={x:g.clientX,y:g.clientY},c=!1,d=!1;const f=t.widget.getBoundingClientRect();t.dragOffset.x=g.clientX-f.left,t.dragOffset.y=g.clientY-f.top,document.addEventListener("mousemove",S),document.addEventListener("mouseup",w),i&&i.classList.add("dragging")}),i.addEventListener("click",g=>{if(d){d=!1;return}!t.isDragging&&!c&&(g.preventDefault(),g.stopPropagation(),t.isWindowOpen?e():n())});function S(g){const f=Date.now()-l,y=Math.sqrt(Math.pow(g.clientX-u.x,2)+Math.pow(g.clientY-u.y,2));if(!t.isDragging&&(y>3||f>100)&&(t.isDragging=!0,c=!0,document.body.style.cursor="grabbing"),t.isDragging){const M=g.clientX-t.dragOffset.x,T=g.clientY-t.dragOffset.y,x=p(M,T);ye(x.x,x.y),t.lastPosition={x:x.x,y:x.y}}}function w(){if(document.removeEventListener("mousemove",S),document.removeEventListener("mouseup",w),i?.classList.remove("dragging"),document.body.style.cursor="",t.isDragging&&t.widget){d=!0;const g=m(t.lastPosition.x,t.lastPosition.y);t.widget.style.transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1)",ye(g.x,g.y),window.setTimeout(()=>{t.widget&&(t.widget.style.transition="")},300),nt()}t.isDragging=!1,c=!1}}function ye(e,n){if(!t.widget)return;t.widget.offsetWidth;const o=t.widget.offsetHeight||50,r=0,i=Math.max(0,Math.min(n,window.innerHeight-o));t.widget.style.left=`${r}px`,t.widget.style.top=`${i}px`,t.widget.style.right="auto",t.widget.style.bottom="auto",t.widget.style.transform="",t.lastPosition={x:r,y:i}}function W(){t.widget&&(t.widget.style.display="none")}function Te(){t.widget&&(t.widget.style.display="block")}function xe(e){const n=document.getElementById("main-button");n&&(e?n.classList.add("is-attention"):n.classList.remove("is-attention"))}async function nt(){}async function en(){}function tn(e){if(!t.widget)return;const n=e.getBoundingClientRect(),o=t.widget.getBoundingClientRect();o.width;const r=o.height||50,i=0,s=Math.max(10,Math.min(n.top,window.innerHeight-r-10));ye(i,s),nt()}function B(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _(e){const n=e.split("`"),o=r=>{const i=new RegExp("(\\*\\*[^*\\n]+\\*\\*|(?<![\\w])'[^'\\n]+'(?![\\w]))","g");let s="",a=0,l;for(;(l=i.exec(r))!==null;){s+=B(r.slice(a,l.index));const u=l[1];u.startsWith("**")?s+=`<strong>${B(u.slice(2,-2))}</strong>`:s+=`<code>${B(u.slice(1,-1))}</code>`,a=i.lastIndex}return s+=B(r.slice(a)),s};return n.map((r,i)=>i%2===1?`<code>${B(r)}</code>`:o(r)).join("")}function nn(e){const n=e.replace(/\r\n/g,`
`).split(`
`);let o="",r=[],i=null;const s=()=>{r.length!==0&&(o+=`<p>${_(r.join(" "))}</p>`,r=[])},a=()=>{i&&(o+=`</${i}>`,i=null)};for(const l of n){const u=l.trim();if(!u){s(),a();continue}const c=u.match(/^(#{1,3})\s+(.*)$/);if(c){s(),a();const m=c[1].length;o+=`<h${m}>${_(c[2])}</h${m}>`;continue}const d=u.match(/^(\d+)[.)]\s+(.*)$/);if(d){s(),i&&i!=="ol"&&a(),i||(i="ol",o+="<ol>"),o+=`<li>${_(d[2])}</li>`;continue}const p=u.match(/^[-*]\s+(.*)$/);if(p){s(),i&&i!=="ul"&&a(),i||(i="ul",o+="<ul>"),o+=`<li>${_(p[1])}</li>`;continue}r.push(u)}return s(),a(),o}function ot(e){const n=e.split(`
`),o=l=>/^\s*\|?[-:\s|]+\|?\s*$/.test(l),r=l=>(l.match(/\|/g)?.length??0)>=2;let i=!1;const s=[];let a=0;for(;a<n.length;){const l=n[a];if(l.trim().startsWith("```")){i=!i,s.push(l),a+=1;continue}if(i){s.push(l),a+=1;continue}if(r(l)||o(l)){const u=[];for(;a<n.length;){const c=n[a];if(c.trim().startsWith("```")||!(r(c)||o(c)))break;u.push(c),a+=1}u.length>0&&(s.push("```table"),s.push(...u),s.push("```"));continue}s.push(l),a+=1}return s.join(`
`)}function on(e){const n=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return ot(e);const o=n[1].trim(),i=n[2].trim().split(";").map(l=>l.trim()).filter(Boolean);if(i.length===0)return e;const s=i.map(l=>`- ${l.replace(/\.$/,"")}`).join(`
`),a=`${o}

**To fix**
${s}`;return ot(a)}function I(e){const n=e.replace(/\r\n/g,`
`),r=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,l;for(;(l=s.exec(r))!==null;)l.index>a&&i.push({type:"text",content:r.slice(a,l.index)}),i.push({type:"code",content:l[2]??"",lang:l[1]??""}),a=s.lastIndex;return a<r.length&&i.push({type:"text",content:r.slice(a)}),i.map(u=>{if(u.type==="code"){const c=u.lang?` data-lang="${B(u.lang)}"`:"";return`<pre${u.lang==="table"?' class="table-block"':""}><code${c}>${B(u.content.trimEnd())}</code></pre>`}return nn(u.content)}).join("")}function rn(e){const n=e.querySelector(".tutor-panel-content");if(!n)return null;const o=document.createElement("div");o.className="tutor-panel-assistant-loading";const r=document.createElement("div");return r.className="tutor-panel-assistant-loading-dot",o.appendChild(r),n.appendChild(o),n.scrollTop=o.offsetTop,o}function $(e,n,o){const r=e.querySelector(".tutor-panel-content");if(!r)return null;const i=document.createElement("div");if(o==="assistant")i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n);else if(o==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(o==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),s.appendChild(i),r.appendChild(s),s}else if(o==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),s.appendChild(i),r.appendChild(s),s}else i.textContent=n;return r.append(i),r.scrollTop=i.offsetTop,i}function ve(e,n,o,r){return new Promise(i=>{let s=0;const a=2,l=e.offsetTop;n.scrollTop=l;let u=!0;const c=()=>{Math.abs(n.scrollTop-l)>8&&(u=!1)};n.addEventListener("scroll",c,{passive:!0});const d=()=>{s=Math.min(o.length,s+a);const p=o.slice(0,s);r?.render?e.innerHTML=r.render(p):e.textContent=p,u&&(n.scrollTop=l),s<o.length?window.setTimeout(d,12):(n.removeEventListener("scroll",c),i())};d()})}let ke=null;function sn(e){ke=e}function an(){if(!ke)throw new Error("Panel dependencies not configured");return ke}function rt(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const n=t.widget?.getBoundingClientRect()??null,o=n?n.right+12:40,r=n?n.top:Math.round(window.innerHeight*.38),i=window.innerWidth-e.offsetWidth-20,s=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(o,i))}px`,e.style.top=`${Math.max(20,Math.min(r,s))}px`,setTimeout(()=>e.classList.add("open"),10),ln(e),e}function j(e){t.panelHideTimerId!==null&&(window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function un(e){e.classList.remove("open"),e.classList.add("closing"),t.panelHideTimerId!==null&&window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),t.panelHideTimerId=null},180)}function it(e,n){const o=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function Ie(e,n){const o=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}async function Ee(e,n,o,r){const{maybeQueueSummary:i,scheduleSessionPersist:s}=an(),a=on(r),l=e.querySelector(".tutor-panel-content");if(l&&typeof r=="string"){if(o==="assistant"){const u=$(e,"","assistant");if(!u)return;await ve(u,l,a,{render:I}),u.innerHTML=I(a),t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${r}`),t.currentTutorSession&&i(t.currentTutorSession.sessionRollingHistory),l.scrollTop=u.offsetTop,s(e)}else if(o==="guideAssistant"){let u=t.guideActiveSlab&&l.contains(t.guideActiveSlab)?t.guideActiveSlab:null;if(!u){u=document.createElement("div"),u.className="guide-wrapper guide-slab";const p=document.createElement("ul");p.className="guide-list",u.appendChild(p),l.appendChild(u),t.guideActiveSlab=u}const c=u.querySelector(".guide-list")??document.createElement("ul");c.classList.contains("guide-list")||(c.className="guide-list",u.appendChild(c));const d=document.createElement("li");d.className="guide-item",c.appendChild(d),t.guideMessageCount===0&&u.classList.add("guide-start"),t.guideMessageCount+=1,t.lastGuideMessageEl=u,await ve(d,l,a,{render:I}),d.innerHTML=I(a),l.scrollTop=u.offsetTop,s(e)}else if(o==="checkAssistant"){const u=$(e,"","checkAssistant");if(!u)return;const c=u.querySelector(".tutor-panel-message--checkAssistant");if(!c)return;u.classList.add("check-start"),await ve(c,l,a,{render:I}),c.innerHTML=I(a),u.classList.add("check-end"),l.scrollTop=u.offsetTop,t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${r}`),t.currentTutorSession&&i(t.currentTutorSession.sessionRollingHistory),s(e)}}}function ln(e){const{askAnything:n,appendPanelMessage:o,closeTutorPanel:r,handleBackendError:i,highlightAskArea:s,maybeQueueSummary:a,scheduleSessionPersist:l,syncSessionLanguageFromPage:u,workspaceUrl:c}=tt(),d=e.querySelector(".tutor-panel-close"),p=e.querySelector(".btn-help-mode"),m=e.querySelector(".btn-guide-mode"),S=e.querySelector(".btn-gotToWorkspace");m?.addEventListener("click",()=>{if(!t.currentTutorSession)return;t.currentTutorSession.guideModeEnabled=!t.currentTutorSession.guideModeEnabled;const h=e.querySelector(".btn-guide-mode"),k=t.currentTutorSession.problem,E=ze(k);(async()=>{let P=!1;for(;;){const C=await ht({enabled:t.currentTutorSession?.guideModeEnabled??!1,sessionId:t.currentTutorSession?.sessionId??"",problem_no:E,problem_name:k,problem_url:t.currentTutorSession?.problemUrl});if(C&&C?.unauthorized){i(e,C);return}if(!C?.success){const jn=C?.error?.toLowerCase()??"";if((C?.timeout||jn.includes("network"))&&!P){P=!0;continue}console.debug("Guide mode status update failed",C);return}return}})(),it(e,!0),e.classList.add("guidemode-active"),t.currentTutorSession.guideModeEnabled?(h?.classList.add("is-loading"),t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null,$e()):(he(),t.lastGuideMessageEl&&t.lastGuideMessageEl.classList.add("guide-end"),it(e,!1),e.classList.remove("guidemode-active"),h?.classList.remove("is-loading")),l(e)}),S?.addEventListener("click",async()=>{if(!c){console.warn("Workspace URL is not set.");return}const h=await wt({url:c});i(e,h,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const w=e.querySelector(".tutor-panel-prompt"),g=e.querySelector(".tutor-panel-send");w?.addEventListener("keydown",async h=>{h.key!=="Enter"||h.shiftKey||(h.preventDefault(),g?.click())}),g?.addEventListener("click",async()=>{if(u(),t.currentTutorSession?.prompt){const h=t.currentTutorSession.prompt;w&&(w.value=""),t.currentTutorSession&&(t.currentTutorSession.prompt=""),o(e,h,"user"),t.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${h}`),a(t.currentTutorSession.sessionRollingHistory),l(e),await n(e,h),t.currentTutorSession.prompt="",l(e)}else return s()}),d?.addEventListener("mousedown",h=>{h.stopPropagation()}),d?.addEventListener("click",async()=>r()),p?.addEventListener("click",async()=>{const h=e.querySelector(".btn-help-mode");let k="";t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!0,h?.classList.add("is-loading")),Ie(e,!0),e.classList.add("checkmode-active");try{const E=await Ge();if(E?.ok&&typeof E.code=="string"&&t.currentTutorSession&&(k=E.code),!k.trim()){o(e,"Couldn't read editor code. Try clicking inside the editor or reload the page.","assistant");return}const P=await Kt(e,k);console.log("this is the response: ",P)}catch{}finally{t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!1,h?.classList.remove("is-loading")),Ie(e,!1),e.classList.remove("checkmode-active"),l(e)}}),w?.addEventListener("input",()=>{t.currentTutorSession&&(t.currentTutorSession.prompt=w.value),l(e)});let f=!1,y=0,M=0,T=0,x=0,v=null;const z=.6,dt=e.querySelector(".tutor-panel-shellbar"),q=()=>{if(!f){v=null;return}const h=e.offsetLeft,k=e.offsetTop,E=h+(T-h)*z,P=k+(x-k)*z;e.style.left=`${E}px`,e.style.top=`${P}px`,v=requestAnimationFrame(q)},D=h=>{if(!f)return;const k=h.clientX-y,E=h.clientY-M,P=window.innerWidth-e.offsetWidth,C=window.innerHeight-e.offsetHeight;T=Math.max(10,Math.min(k,P)),x=Math.max(10,Math.min(E,C)),v===null&&(v=requestAnimationFrame(q))},gt=()=>{f&&(f=!1,document.removeEventListener("mousemove",D),document.removeEventListener("mouseup",gt),v!==null&&(cancelAnimationFrame(v),v=null),e.style.left=`${T}px`,e.style.top=`${x}px`,t.currentTutorSession&&(t.currentTutorSession.position={x:e.offsetLeft,y:e.offsetTop}),l(e))};dt?.addEventListener("mousedown",h=>{h.preventDefault(),f=!0,y=h.clientX-e.getBoundingClientRect().left,M=h.clientY-e.getBoundingClientRect().top,T=e.offsetLeft,x=e.offsetTop,document.addEventListener("mousemove",D),document.addEventListener("mouseup",gt)})}let Ce=null;function cn(e){Ce=e}function dn(){if(!Ce)throw new Error("Lifecycle dependencies not configured");return Ce}function st(e,n,o){const r=o??R(),i=crypto.randomUUID();return{element:e,sessionId:i,userId:n,problem:r,problemUrl:N(window.location.href),language:H(),topics:vt(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function Le(){const{highlightExistingPanel:e,lockPanel:n,markUserActivity:o,showPanelLoading:r,hidePanelLoading:i,initSessionTopicsIfNeeded:s}=dn(),a=await le(),l=Ct(a),u=a?.userId??"";if(l&&await je(),t.currentTutorSession&&t.currentTutorSession.element&&document.body.contains(t.currentTutorSession.element)){se(A),L(A),j(t.currentTutorSession.element),W(),t.isWindowOpen=!0,e(t.currentTutorSession.element);const d=t.currentTutorSession.element.querySelector(".tutor-panel-content");d&&requestAnimationFrame(()=>{d.scrollTop=d.scrollHeight}),!u||l?(n(t.currentTutorSession.element),O(t.currentTutorSession.element,l?"session expired, please log back in":void 0)):s(t.currentTutorSession),o(),A(t.currentTutorSession.element);return}if(t.currentTutorSession?.userId){r();try{await F(t.currentTutorSession.element??null,{force:!0})}finally{i()}}if(!t.pendingStoredSession&&u){const d=await ce(u,R());d&&ge(d,u,N(window.location.href))&&(t.pendingStoredSession=d)}if(t.pendingStoredSession){const d=rt();Qe(d,t.pendingStoredSession),t.pendingStoredSession=null,se(A),L(A),j(d),W(),t.isWindowOpen=!0,o(),!u||l?(n(d),O(d,l?"session expired, please log back in":void 0)):t.currentTutorSession&&s(t.currentTutorSession),A(d);return}const c=rt();if(!c){console.log("There was an error creating a panel");return}t.currentTutorSession=st(c,u),se(A),L(A),j(c),W(),xe(!1),t.isWindowOpen=!0,o(),A(c),t.currentTutorSession&&(!u||l?(n(c),O(c,l?"session expired, please log back in":void 0)):(t.currentTutorSession.userId=u,s(t.currentTutorSession)),setTimeout(()=>{const d=c.querySelector(".tutor-panel-prompt");d&&(d.focus(),d.setSelectionRange(d.value.length,d.value.length))},100))}function gn(){if(!t.currentTutorSession?.element)return;un(t.currentTutorSession.element),tn(t.currentTutorSession.element),Te();const e=!!(t.currentTutorSession?.guideModeEnabled||t.currentTutorSession?.checkModeEnabled);xe(e),t.isWindowOpen=!1,A(t.currentTutorSession.element)}async function pn(e){t.currentTutorSession?.userId&&t.currentTutorSession.element&&await F(t.currentTutorSession.element,{force:!0}),t.pendingStoredSession=null,fe();const n=t.isWindowOpen;t.currentTutorSession?.element&&t.currentTutorSession.element.remove(),t.currentTutorSession=null,t.isWindowOpen=!1,Te(),xe(!1),await Ve(),n&&(await mn(),Le())}function fn(){t.problemUrlWatcherId&&window.clearInterval(t.problemUrlWatcherId),t.problemUrlWatcherId=window.setInterval(()=>{const e=N(window.location.href);e!==t.lastCanonicalProblemUrl&&(t.lastCanonicalProblemUrl=e,pn())},1e3)}async function mn(e=2e3,n=100){const o=Date.now()+e;let r=R();for(;!r&&Date.now()<o;)await new Promise(i=>setTimeout(i,n)),r=R();return r}async function Me(e){if(e.sessionTopicsInitialized)return;let n=!1;for(;;){const o=await ft({sessionId:e.sessionId,topics:e.topics});if(o&&o?.unauthorized){G(e.element??null,o);return}if(!o?.success){const r=o?.error?.toLowerCase()??"";if((o?.timeout||r.includes("network"))&&!n){n=!0;continue}console.debug("Init session topics failed",o);return}e.sessionTopicsInitialized=!0,A(e.element??null);return}}function hn(e,n,o){fe();const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML="");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=""),t.currentTutorSession=st(e,n,o),t.currentTutorSession&&Me(t.currentTutorSession)}function Pe(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}async function bn(e,n){return St({email:e,password:n})}async function An(e){return yt(e)}async function at(e,n,o,r){const i=t.currentTutorSession?.userId??"",s=t.currentTutorSession?.problem??R();if(t.suspendPanelOps=!1,i&&i===o){t.sessionRestorePending=!1,r.unlockPanel(e),n.remove(),A(e);return}i&&i!==o&&(await F(e,{force:!0}),hn(e,o,s));const a=await ce(o,s);a&&ge(a,o,N(window.location.href))?(Qe(e,a),await de(o,a.state.problem),t.pendingStoredSession=null):a&&await de(o,a.state.problem),t.currentTutorSession&&(t.currentTutorSession.userId=o,Me(t.currentTutorSession)),t.sessionRestorePending=!1,r.unlockPanel(e),n.remove(),A(e)}let Be=null,De=!1;const wn="#c58313",Sn="#136f35",yn=5e3,Tn=24,xn="Starting up the server...",vn="Server started. Logging you in...",kn="Server is taking longer than usual. Please try again.";async function ut(e){if(De)return!1;De=!0;try{if((await X())?.success)return!0;e&&(e.textContent=xn,e.style.color=wn,e.style.display="block");for(let o=0;o<Tn;o+=1){if(await new Promise(i=>setTimeout(i,yn)),(await X())?.success)return e&&(e.textContent=vn,e.style.color=Sn,e.style.display="block"),!0;console.log("pinging again")}return e&&(e.textContent=kn,e.style.display="block"),!1}finally{De=!1}}function In(e){Be=e}function En(){if(!Be)throw new Error("Auth overlay dependencies not configured");return Be}function O(e,n){const o=e.querySelector(".tutor-panel-auth");if(o){if(n){const c=o.querySelector(".auth-error");c&&(c.textContent=n,c.style.display="block")}return}const{stopPanelOperations:r,unlockPanel:i}=En();t.suspendPanelOps=!0,r(e);const s=document.createElement("div");s.className="tutor-panel-auth",e.appendChild(s);const a=(c,d)=>{if(!c||!d)return;const p=()=>{const m=c.type==="password";d.setAttribute("aria-label",m?"Show password":"Hide password")};d.addEventListener("click",()=>{c.type=c.type==="password"?"text":"password",p(),c.focus(),c.setSelectionRange(c.value.length,c.value.length)}),p()},l=c=>{s.innerHTML=`
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
    `;const d=s.querySelector(".auth-email"),p=s.querySelector(".auth-password"),m=s.querySelector(".auth-login"),S=s.querySelector(".auth-signup"),w=s.querySelector(".auth-password-toggle"),g=s.querySelector(".auth-error");c&&g&&(g.textContent=c,g.style.display="block");const f=()=>{g&&(g.style.display="none")};d?.addEventListener("input",f),p?.addEventListener("input",f),a(p,w),m?.addEventListener("click",async()=>{const y=d?.value.trim()??"",M=p?.value.trim()??"";if(!y||!M||!await ut(g??null))return;const x=await bn(y,M);if(x?.success===!1){g&&(g.textContent=x.error||"Internal server error",g.style.display="block");return}const v=x?.data;v?.userId&&v?.jwt?await at(e,s,v.userId,{unlockPanel:i}):g&&(g.textContent="Invalid creds",g.style.display="block")}),S?.addEventListener("click",()=>{u()})},u=()=>{s.innerHTML=`
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
    `;const c=s.querySelector(".auth-first-name"),d=s.querySelector(".auth-last-name"),p=s.querySelector(".auth-email"),m=s.querySelector(".auth-password"),S=s.querySelector(".auth-signup-submit"),w=s.querySelector(".auth-password-toggle"),g=s.querySelector(".auth-error"),f=s.querySelector(".auth-password-hint"),y=()=>{g&&(g.style.display="none")};c?.addEventListener("input",y),d?.addEventListener("input",y),p?.addEventListener("input",y),m?.addEventListener("input",y),a(m,w),m?.addEventListener("blur",()=>{if(!f||!m)return;const T=m.value.trim();T&&!Pe(T)?(f.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",f.style.display="block"):f.style.display="none"}),m?.addEventListener("input",()=>{if(!f||!m)return;const T=m.value.trim();T&&Pe(T)&&(f.style.display="none")}),S?.addEventListener("click",async()=>{const T=c?.value.trim()??"",x=d?.value.trim()??"",v=p?.value.trim()??"",z=m?.value.trim()??"";if(!T||!x||!v||!z)return;if(!Pe(z)){f&&(f.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",f.style.display="block");return}if(!await ut(g??null))return;const q=await An({fname:T,lname:x,email:v,password:z});if(q?.success===!1){g&&(g.textContent=q.error||"Internal server error",g.style.display="block");return}const D=q?.data;D?.requiresVerification?l("Waiting for verification, check email"):D?.userId&&D?.jwt?await at(e,s,D.userId,{unlockPanel:i}):g&&(g.style.display="block")}),s.querySelector(".auth-back")?.addEventListener("click",()=>{l()})};l(n)}async function Cn(e,n){const o=rn(e),r=t.currentTutorSession?.language||H(),i=await At({sessionId:t.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:t.currentTutorSession?.sessionRollingHistory.qaHistory,summary:t.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:r});if(G(e,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return o?.remove(),"Failure";const s=typeof i=="string"?i:i?.data?.reply??"";return s.trim()&&(o?.remove(),Ee(e,"","assistant",s)),o?.remove(),s||"Failure"}async function Ln(e){if(t.summarizeInFlight||e.toSummarize.length===0)return;const n=e.toSummarize.splice(0);t.summarizeInFlight=!0;let o=!1;try{for(;;){const r=await pt({sessionId:t.currentTutorSession?.sessionId??"",summarize:n,summary:e.summary});if(r&&r?.unauthorized){G(t.currentTutorSession?.element??null,r);return}if(!r?.success){const s=r?.error?.toLowerCase()??"";if((r?.timeout||s.includes("network"))&&!o){o=!0;continue}console.debug("Summarize history failed",r);return}const i=r?.data?.reply;typeof i=="string"&&(e.summary=i);return}}finally{t.summarizeInFlight=!1}}function lt(e){if(e.qaHistory.length<=40)return;const n=e.qaHistory.splice(0,20);e.toSummarize.push(...n),Ln(e)}let Ne=null;function Mn(e){Ne=e}function Pn(){if(!Ne)throw new Error("Activity dependencies not configured");return Ne}const Bn=960*60*1e3,Dn=15e3;function ee(){t.lastActivityAt=Date.now(),Date.now()-t.lastActivityStoredAt>Dn&&(t.lastActivityStoredAt=Date.now(),A())}async function Nn(){const{lockPanel:e}=Pn();if(t.currentTutorSession?.element&&(await F(t.currentTutorSession.element,{force:!0}),t.sessionRestorePending=!0),await je(),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),t.currentTutorSession?.element){const n=t.currentTutorSession.element;he(),n.classList.remove("guidemode-active","checkmode-active"),e(n),O(n,"session expired, please log back in")}}function Rn(){const e=()=>ee(),n=["mousemove","keydown","click","scroll","input"];for(const o of n)document.addEventListener(o,e,{passive:!0});t.inactivityTimerId&&window.clearInterval(t.inactivityTimerId),t.inactivityTimerId=window.setInterval(async()=>{Date.now()-t.lastActivityAt<Bn||!(await le())?.userId||await Nn()},6e4)}function Hn(e){t.queue=[],t.flushInFlight=!1,fe(),he(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}const Fn={matches:["https://leetcode.com/problems/*"],main(){console.log("Tutor - ai extension loaded."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{ct()}):ct()}};function ct(){console.log("The widget is being loaded to the page"),t.lastCanonicalProblemUrl=N(window.location.href),Pt({appendToContentPanel:Ee,scheduleSessionPersist:A,syncSessionLanguageFromPage:Re,handleBackendError:G}),Vt({appendToContentPanel:Ee,scheduleSessionPersist:A,syncSessionLanguageFromPage:Re,handleBackendError:G}),Ht({ensureAuthPrompt:O,showTutorPanel:j,hideWidget:W,markUserActivity:ee,scheduleSessionPersist:A,appendPanelMessage:$,setPanelControlsDisabled:Ie}),Mn({lockPanel:U}),cn({highlightExistingPanel:Wn,lockPanel:U,markUserActivity:ee,showPanelLoading:Xt,hidePanelLoading:Qt,initSessionTopicsIfNeeded:Me}),sn({maybeQueueSummary:lt,scheduleSessionPersist:A}),In({stopPanelOperations:Hn,unlockPanel:zt}),Mt(()=>{const e=t.currentTutorSession?.element;e&&(U(e),O(e),t.isWindowOpen||(j(e),W(),t.isWindowOpen=!0,ee(),A(e)))}),_t({openTutorPanel:Le,closeTutorPanel:gn,askAnything:Cn,highlightAskArea:zn,appendPanelMessage:$,maybeQueueSummary:lt,scheduleSessionPersist:A,syncSessionLanguageFromPage:Re,handleBackendError:G,workspaceUrl:Gn}),$t(),en(),On(),Rn(),fn(),Lt(),Ve().then(()=>{t.pendingStoredSession?.panelOpen&&Le()}),window.addEventListener("beforeunload",()=>{F(t.currentTutorSession?.element??null)})}function Re(){L(A)}const Gn="https://tutor-app-kappa-weld.vercel.app/auth/bridge";function Wn(e){}function On(){b.runtime.onMessage.addListener(e=>{if(!(!e||typeof e!="object")&&"action"in e&&e.action==="show-widget")return Te(),Promise.resolve({success:!0})})}function zn(){}function te(e,...n){}const qn={debug:(...e)=>te(console.debug,...e),log:(...e)=>te(console.log,...e),warn:(...e)=>te(console.warn,...e),error:(...e)=>te(console.error,...e)};class He extends Event{constructor(n,o){super(He.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=o}static EVENT_NAME=Fe("wxt:locationchange")}function Fe(e){return`${b?.runtime?.id}:content:${e}`}function Yn(e){let n,o;return{run(){n==null&&(o=new URL(location.href),n=e.setInterval(()=>{let r=new URL(location.href);r.href!==o.href&&(window.dispatchEvent(new He(r,o)),o=r)},1e3))}}}class ne{constructor(n,o){this.contentScriptName=n,this.options=o,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Fe("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Yn(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,o){const r=setInterval(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(n,o){const r=setTimeout(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(n){const o=requestAnimationFrame((...r)=>{this.isValid&&n(...r)});return this.onInvalidated(()=>cancelAnimationFrame(o)),o}requestIdleCallback(n,o){const r=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},o);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(n,o,r,i){o==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(o.startsWith("wxt:")?Fe(o):o,r,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),qn.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:ne.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const o=n.data?.type===ne.SCRIPT_STARTED_MESSAGE_TYPE,r=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return o&&r&&i}listenForNewerScripts(n){let o=!0;const r=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=o;if(o=!1,s&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}}function Vn(){}function oe(e,...n){}const Un={debug:(...e)=>oe(console.debug,...e),log:(...e)=>oe(console.log,...e),warn:(...e)=>oe(console.warn,...e),error:(...e)=>oe(console.error,...e)};return(async()=>{try{const{main:e,...n}=Fn,o=new ne("content",n);return await e(o)}catch(e){throw Un.error('The content script "content" crashed on startup!',e),e}})()})();
content;