var content=(function(){"use strict";function en(t){return t}const Qe=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],Te={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function J(t){return t.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const $=new Map(Qe.map(t=>[J(t),Te[t]??t]));Object.values(Te).forEach(t=>{$.set(J(t),t)});function Ze(t){return t.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function ee(t){const n=J(t);if(!n)return t.trim();const o=$.get(n);if(o)return o;const r=n.split(" ");if(r.length>0){const i=r[r.length-1];if(i.endsWith("s")){r[r.length-1]=i.slice(0,-1);const a=r.join(" "),s=$.get(a);if(s)return s}else{r[r.length-1]=`${i}s`;const a=r.join(" "),s=$.get(a);if(s)return s}}return Ze(n)}function ve(t,n){const o=ee(n),r=Object.keys(t).find(i=>ee(i)===o);return r&&r!==o&&(t[o]=t[r],delete t[r]),t[o]??={thoughts_to_remember:[],pitfalls:[]},o}function F(t){try{const{origin:n,pathname:o}=new URL(t),r=o.match(/^\/problems\/[^/]+/);return r?`${n}${r[0]}`:`${n}${o}`}catch{return t}}function G(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function ke(t){const n=t.match(/^\s*(\d+)/);if(!n)return null;const o=Number(n[1]);return Number.isFinite(o)?o:null}function Je(){const t=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(t).map(o=>o.getAttribute("href")).filter(o=>!!o).map(o=>o.replace("/tag/","").replace("/","")).map(o=>ee(o));return Object.fromEntries(Array.from(new Set(n)).map(o=>[o,{thoughts_to_remember:[],pitfalls:[]}]))}function D(){const t=document.querySelector("#editor");if(!t)return"";const n=t.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(r=>r.nodeType===Node.TEXT_NODE&&r.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}const w=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function et(t){return w.runtime.sendMessage({action:"summarize-history",payload:t})}function tt(t){return w.runtime.sendMessage({action:"init-session-topics",payload:t})}function nt(t){return w.runtime.sendMessage({action:"guide-mode",payload:t})}function ot(t){return w.runtime.sendMessage({action:"guide-mode-status",payload:t})}function rt(t){return w.runtime.sendMessage({action:"check-code",payload:t})}function it(t){return w.runtime.sendMessage({action:"ask-anything",payload:t})}function st(t){return w.runtime.sendMessage({action:"go-to-workspace",payload:t})}function at(t){return w.runtime.sendMessage({action:"supabase-login",payload:t})}function ut(t){return w.runtime.sendMessage({action:"supabase-signup",payload:t})}function Ie(){return w.runtime.sendMessage({type:"GET_MONACO_CODE"})}const e={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null};let te=null;function lt(t){te=t}function ct(){if(!te)throw new Error("Check dependencies not configured");return te}async function dt(t,n){const{appendToContentPanel:o,handleBackendError:r,scheduleSessionPersist:i,syncSessionLanguageFromPage:a}=ct();try{a();const s=await rt({sessionId:e.currentTutorSession?.sessionId??"",topics:e.currentTutorSession?.topics,code:n,action:"check-code",language:e.currentTutorSession?.language??D(),problem_no:ke(e.currentTutorSession?.problem??""),problem_name:e.currentTutorSession?.problem??"",problem_url:e.currentTutorSession?.problemUrl??""});if(r(t,s,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const l=s?.resp;e.currentTutorSession&&typeof l=="string"&&e.currentTutorSession.content.push(`${l}
`),typeof l=="string"&&l.trim()&&await o(t,"","checkAssistant",l);const u=s?.topics;if(u&&typeof u=="object"&&e.currentTutorSession)for(const[d,m]of Object.entries(u)){if(!m||typeof m!="object")continue;const g=ve(e.currentTutorSession.topics,d),y=m.thoughts_to_remember,p=m.pitfalls,c=Array.isArray(y)?y:typeof y=="string"&&y.trim()?[y.trim()]:[],f=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[];e.currentTutorSession&&(c.length>0&&e.currentTutorSession.topics[g].thoughts_to_remember.push(...c),f.length>0&&e.currentTutorSession.topics[g].pitfalls.push(...f))}return console.log("this is the object now: ",e.currentTutorSession?.topics),i(t),s?.resp}catch(s){return console.error("checkMode failed",s),"Failure"}}let ne=null;function pt(t){ne=t}function gt(){if(!ne)throw new Error("Guide dependencies not configured");return ne}function oe(){e.guideMinIdx=Number.POSITIVE_INFINITY,e.guideMaxIdx=-1,e.guideBatchTimerId=null,e.guideBatchStarted=!1,e.guideTouchedLines=new Set,e.maxLines=0,e.guideAttachAttempts=0,e.guideDrainInFlight=!1,e.lastGuideSelectionLine=null,e.lastGuideFlushLine=null,e.lastGuideFlushAt=0,e.guideMessageCount=0,e.lastGuideMessageEl=null,e.guideActiveSlab=null}function N(){return document.querySelector(".monaco-editor textarea.inputarea")}function Ee(t,n){return t.slice(0,Math.max(0,n)).split(`
`).length}function Le(t,n){return t.split(`
`)[n-1]??""}function mt(t){const n=t.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function ft(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function _(){e.guideTouchedLines.clear(),e.guideMinIdx=Number.POSITIVE_INFINITY,e.guideMaxIdx=-1,e.guideBatchStarted=!1,e.guideBatchTimerId!==null&&(window.clearTimeout(e.guideBatchTimerId),e.guideBatchTimerId=null)}async function re(t){const n=ft(),r=N()?.value??"",i=Array.from(e.guideTouchedLines)[0]??1;if(!i){_();return}const a=Date.now();if(e.lastGuideFlushLine===i&&a-e.lastGuideFlushAt<250)return;if(e.lastGuideFlushLine=i,e.lastGuideFlushAt=a,!n){_();return}let s="";if(r&&(s=Le(r,i)),!s.trim()&&i>1&&r){const u=Le(r,i-1);u.trim()&&(s=u)}let l=n;try{const u=await Ie();u?.ok&&typeof u.code=="string"&&(l=u.code)}catch{}mt(s)&&(e.queue.push([l,s]),ht()),_()}async function ht(){const{appendToContentPanel:t,handleBackendError:n,scheduleSessionPersist:o,syncSessionLanguageFromPage:r}=gt();if(!e.guideDrainInFlight){if(e.suspendPanelOps){e.queue=[];return}e.guideDrainInFlight=!0;try{for(;e.queue.length>0;){if(e.suspendPanelOps){e.queue=[];break}const[i,a]=e.queue.shift();console.log("This is the focus line: ",a),console.log("the code so far: ",i),r(),e.flushInFlight=!0;const s=await nt({action:"guide-mode",sessionId:e.currentTutorSession?.sessionId??"",problem:e.currentTutorSession?.problem??"",topics:e.currentTutorSession?.topics,code:i,focusLine:a,language:e.currentTutorSession?.language??D(),rollingStateGuideMode:e.currentTutorSession?.rollingStateGuideMode});if(n(e.currentTutorSession?.element??null,s,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){e.flushInFlight=!1;continue}if(!s)console.log("failure for guide mode");else{const l=s.success?s.reply:null;l?.state_update?.lastEdit?.trim()&&e.currentTutorSession&&(e.currentTutorSession.rollingStateGuideMode.lastEdit=l.state_update.lastEdit);const u=l?.nudge;if(e.currentTutorSession&&typeof u=="string"){const m=u.trim();m&&(e.currentTutorSession.rollingStateGuideMode.nudges.push(m),e.currentTutorSession.content.push(`${m}
`),e.currentTutorSession.element!=null&&await t(e.currentTutorSession.element,"","guideAssistant",m),o(e.currentTutorSession.element??null))}const d=l?.topics;if(d&&typeof d=="object"&&e.currentTutorSession)for(const[m,g]of Object.entries(d)){if(!g||typeof g!="object")continue;const y=ve(e.currentTutorSession.topics,m),p=g.thoughts_to_remember,c=g.pitfalls,f=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[],b=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];e.currentTutorSession&&(f.length>0&&e.currentTutorSession.topics[y].thoughts_to_remember.push(...f),b.length>0&&e.currentTutorSession.topics[y].pitfalls.push(...b))}e.currentTutorSession?.element&&o(e.currentTutorSession.element),e.flushInFlight=!1}}}finally{e.guideDrainInFlight=!1}}}function Ae(){if(!e.currentTutorSession?.guideModeEnabled)return;const t=N();if(!t)return;const n=t.value??"",o=t.selectionStart??0,r=Ee(n,o);!e.guideTouchedLines.has(r)&&e.guideTouchedLines.size==0&&e.guideTouchedLines.add(r),e.guideBatchStarted||(e.guideBatchStarted=!0),e.guideBatchTimerId!==null&&window.clearTimeout(e.guideBatchTimerId),e.guideBatchTimerId=window.setTimeout(()=>{re()},1e4),!e.guideTouchedLines.has(r)&&e.guideTouchedLines.size==1&&re()}function Me(){if(!e.currentTutorSession?.guideModeEnabled||!e.guideBatchStarted)return;const t=N();if(!t)return;const n=t.value??"",o=t.selectionStart??0,r=Ee(n,o);if(e.lastGuideSelectionLine===null){e.lastGuideSelectionLine=r;return}r!==e.lastGuideSelectionLine&&(e.lastGuideSelectionLine=r,!e.guideTouchedLines.has(r)&&e.guideTouchedLines.size==1&&re())}function Ce(){const t=N();if(!t){e.guideAttachAttempts<5&&(e.guideAttachAttempts+=1,window.setTimeout(Ce,500));return}t.addEventListener("input",Ae),document.addEventListener("selectionchange",Me)}function ie(){const t=N();t&&(t.removeEventListener("input",Ae),document.removeEventListener("selectionchange",Me))}const se="vibetutor-auth",Pe="vibetutor-session",Fe=1440*60*1e3,bt=1800*1e3,St=`${Pe}:`;let ae=null;function ue(t,n){return`${Pe}:${encodeURIComponent(t)}:${encodeURIComponent(n)}`}async function le(){return(await w.storage.local.get(se))[se]??null}function wt(t){return t?.expiresAt?Date.now()>t.expiresAt:!1}async function De(){await w.storage.local.remove(se),await w.runtime.sendMessage({action:"clear-auth"})}async function ce(t,n){const o=ue(t,n),i=(await w.storage.local.get(o))[o]??null;return i?Date.now()-(i.lastActivityAt??0)>Fe?(await w.storage.local.remove(o),null):i:null}async function de(t,n){const o=ue(t,n);await w.storage.local.remove(o)}async function Be(){const t=await w.storage.local.get(null),n=Date.now(),o=[];for(const[r,i]of Object.entries(t)){if(!r.startsWith(St))continue;const s=i?.lastActivityAt??0;n-s>Fe&&o.push(r)}o.length>0&&await w.storage.local.remove(o)}function yt(){Be(),ae&&window.clearInterval(ae),ae=window.setInterval(()=>{Be()},bt)}function pe(t,n,o){return t.state.userId?t.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):t.state.problemUrl===o:(console.log("There was no stored user in the browser."),!1)}async function B(t,n){if(!e.currentTutorSession||!e.currentTutorSession.userId||e.sessionRestorePending&&!n?.force)return;const o=t?.querySelector(".tutor-panel-content")??e.currentTutorSession.element?.querySelector(".tutor-panel-content"),r=ue(e.currentTutorSession.userId,e.currentTutorSession.problem),i={state:{sessionId:e.currentTutorSession.sessionId,userId:e.currentTutorSession.userId,content:e.currentTutorSession.content,sessionTopicsInitialized:e.currentTutorSession.sessionTopicsInitialized,language:e.currentTutorSession.language,problem:e.currentTutorSession.problem,problemUrl:e.currentTutorSession.problemUrl,topics:e.currentTutorSession.topics,prompt:e.currentTutorSession.prompt,position:e.currentTutorSession.position,size:e.currentTutorSession.size,guideModeEnabled:e.currentTutorSession.guideModeEnabled,checkModeEnabled:e.currentTutorSession.checkModeEnabled,rollingStateGuideMode:e.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:e.currentTutorSession.sessionRollingHistory},panelOpen:e.isWindowOpen,contentHtml:o?.innerHTML??"",contentScrollTop:o?.scrollTop??0,lastActivityAt:e.lastActivityAt};await w.storage.local.set({[r]:i})}function x(t){e.sessionRestorePending||e.persistTimerId||(e.persistTimerId=window.setTimeout(()=>{e.persistTimerId=null,B(t)},500))}function qe(t,n){e.currentTutorSession={...n.state,element:t},e.currentTutorSession&&!e.currentTutorSession.language&&(e.currentTutorSession.language=D()),e.currentTutorSession&&e.currentTutorSession.sessionTopicsInitialized==null&&(e.currentTutorSession.sessionTopicsInitialized=!1);const o=t.querySelector(".tutor-panel-content");o&&(o.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{o.scrollTop=o.scrollHeight}));const r=t.querySelector(".tutor-panel-prompt");r&&(r.value=e.currentTutorSession.prompt??""),e.currentTutorSession.position&&(t.style.left=`${e.currentTutorSession.position.x}px`,t.style.top=`${e.currentTutorSession.position.y}px`),e.currentTutorSession.size&&(t.style.width=`${e.currentTutorSession.size.width}px`,t.style.height=`${e.currentTutorSession.size.height}px`);const i=t.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const a=i[i.length-1],s=a.querySelectorAll(".guide-item");e.guideMessageCount=s.length,e.lastGuideMessageEl=a,e.guideActiveSlab=e.currentTutorSession?.guideModeEnabled?a:null}else{const a=t.querySelectorAll(".guide-wrapper");e.guideMessageCount=a.length,e.lastGuideMessageEl=a.length>0?a[a.length-1]:null,e.guideActiveSlab=null}}async function Ne(){const t=await le();if(!t?.userId){e.pendingStoredSession=null;return}const n=await ce(t.userId,G());if(!n){e.pendingStoredSession=null;return}if(!pe(n,t.userId,F(window.location.href))){await de(t.userId,n.state.problem),e.pendingStoredSession=null;return}e.pendingStoredSession=n,e.lastActivityAt=n.lastActivityAt??Date.now()}function M(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function U(t){const n=t.split("`"),o=r=>{const i=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let a="",s=0,l;for(;(l=i.exec(r))!==null;){a+=M(r.slice(s,l.index));const u=l[1];u.startsWith("**")?a+=`<strong>${M(u.slice(2,-2))}</strong>`:a+=`<code>${M(u.slice(1,-1))}</code>`,s=i.lastIndex}return a+=M(r.slice(s)),a};return n.map((r,i)=>i%2===1?`<code>${M(r)}</code>`:o(r)).join("")}function xt(t){const n=t.replace(/\r\n/g,`
`).split(`
`);let o="",r=[],i=null;const a=()=>{r.length!==0&&(o+=`<p>${U(r.join(" "))}</p>`,r=[])},s=()=>{i&&(o+=`</${i}>`,i=null)};for(const l of n){const u=l.trim();if(!u){a(),s();continue}const d=u.match(/^(#{1,3})\s+(.*)$/);if(d){a(),s();const y=d[1].length;o+=`<h${y}>${U(d[2])}</h${y}>`;continue}const m=u.match(/^(\d+)[.)]\s+(.*)$/);if(m){a(),i&&i!=="ol"&&s(),i||(i="ol",o+="<ol>"),o+=`<li>${U(m[2])}</li>`;continue}const g=u.match(/^[-*]\s+(.*)$/);if(g){a(),i&&i!=="ul"&&s(),i||(i="ul",o+="<ul>"),o+=`<li>${U(g[1])}</li>`;continue}r.push(u)}return a(),s(),o}function ze(t){const n=t.split(`
`),o=l=>/^\s*\|?[-:\s|]+\|?\s*$/.test(l),r=l=>(l.match(/\|/g)?.length??0)>=2;let i=!1;const a=[];let s=0;for(;s<n.length;){const l=n[s];if(l.trim().startsWith("```")){i=!i,a.push(l),s+=1;continue}if(i){a.push(l),s+=1;continue}if(r(l)||o(l)){const u=[];for(;s<n.length;){const d=n[s];if(d.trim().startsWith("```")||!(r(d)||o(d)))break;u.push(d),s+=1}u.length>0&&(a.push("```table"),a.push(...u),a.push("```"));continue}a.push(l),s+=1}return a.join(`
`)}function Tt(t){const n=t.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return ze(t);const o=n[1].trim(),i=n[2].trim().split(";").map(l=>l.trim()).filter(Boolean);if(i.length===0)return t;const a=i.map(l=>`- ${l.replace(/\.$/,"")}`).join(`
`),s=`${o}

**To fix**
${a}`;return ze(s)}function I(t){const n=t.replace(/\r\n/g,`
`),r=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],a=/```(\w+)?\r?\n([\s\S]*?)```/g;let s=0,l;for(;(l=a.exec(r))!==null;)l.index>s&&i.push({type:"text",content:r.slice(s,l.index)}),i.push({type:"code",content:l[2]??"",lang:l[1]??""}),s=a.lastIndex;return s<r.length&&i.push({type:"text",content:r.slice(s)}),i.map(u=>{if(u.type==="code"){const d=u.lang?` data-lang="${M(u.lang)}"`:"";return`<pre${u.lang==="table"?' class="table-block"':""}><code${d}>${M(u.content.trimEnd())}</code></pre>`}return xt(u.content)}).join("")}let ge=null;function vt(t){ge=t}function He(){if(!ge)throw new Error("Widget dependencies not configured");return ge}function kt(){const{closeTutorPanel:t,openTutorPanel:n}=He(),o=document.getElementById("tutor-widget");o&&o.remove(),e.widget=document.createElement("div"),e.widget.id="tutor-widget",e.widget.innerHTML=`
  <div class="widget-main-button" id="main-button">
  </div>
  `;const r=document.createElement("style");r.textContent=`
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

`,document.head.appendChild(r),document.body.appendChild(e.widget);const i=document.getElementById("main-button");if(!i||!e.widget)return;let a=0,s={x:0,y:0},l=!1,u=!1;function d(p,c){const f=e.widget.offsetWidth,b=e.widget.offsetHeight;return{x:Math.max(0,Math.min(p,window.innerWidth-f)),y:Math.max(0,Math.min(c,window.innerHeight-b))}}function m(p,c){const f=e.widget.offsetWidth,b=e.widget.offsetHeight;return{x:p<window.innerWidth/2?0:window.innerWidth-f,y:Math.max(0,Math.min(c,window.innerHeight-b))}}i.addEventListener("mousedown",p=>{a=Date.now(),s={x:p.clientX,y:p.clientY},l=!1,u=!1;const c=e.widget.getBoundingClientRect();e.dragOffset.x=p.clientX-c.left,e.dragOffset.y=p.clientY-c.top,document.addEventListener("mousemove",g),document.addEventListener("mouseup",y),i&&i.classList.add("dragging")}),i.addEventListener("click",p=>{if(u){u=!1;return}!e.isDragging&&!l&&(p.preventDefault(),p.stopPropagation(),e.isWindowOpen?t():n())});function g(p){const c=Date.now()-a,f=Math.sqrt(Math.pow(p.clientX-s.x,2)+Math.pow(p.clientY-s.y,2));if(!e.isDragging&&(f>3||c>100)&&(e.isDragging=!0,l=!0,document.body.style.cursor="grabbing"),e.isDragging){const b=p.clientX-e.dragOffset.x,A=p.clientY-e.dragOffset.y,S=d(b,A);e.widget.style.transform=`translate(${S.x}px, ${S.y}px)`,e.widget.style.left="0",e.widget.style.top="0",e.lastPosition={x:S.x,y:S.y}}}function y(){if(document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",y),i&&i.classList.remove("dragging"),document.body.style.cursor="",e.isDragging){u=!0;const p=m(e.lastPosition.x,e.lastPosition.y);p.x!==e.lastPosition.x||p.y!==e.lastPosition.y?(e.widget.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",e.widget.style.left=p.x+"px",e.widget.style.top=p.y+"px",e.widget.style.transform="",setTimeout(()=>{e.widget&&(e.widget.style.transition="")},15e3),e.lastPosition=p):(e.widget.style.left=e.lastPosition.x+"px",e.widget.style.top=e.lastPosition.y+"px",e.widget.style.transform=""),We()}e.isDragging=!1,l=!1}}function Oe(){document.getElementById("tutor-panel")?.remove();const t=document.createElement("div");t.id="tutor-panel",t.classList.add("tutor-panel"),t.innerHTML=`
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
  `,t.style.position="fixed",t.style.zIndex="1000000",t.style.left="50%",t.style.top="50%",t.style.right="50%",t.style.bottom="50%",document.body.appendChild(t);const n=40,o=Math.round(window.innerHeight*.38),r=window.innerWidth-t.offsetWidth-20,i=window.innerHeight-t.offsetHeight-20;return t.style.left=`${Math.max(20,Math.min(n,r))}px`,t.style.top=`${Math.max(20,Math.min(o,i))}px`,setTimeout(()=>t.classList.add("open"),10),At(t),t}function j(){e.widget&&(e.widget.style.display="none")}function Re(){e.widget&&(e.widget.style.display="block")}async function We(){}async function It(){}function Y(t){e.panelHideTimerId!==null&&(window.clearTimeout(e.panelHideTimerId),e.panelHideTimerId=null),t.classList.remove("closing"),t.style.display="flex",t.classList.add("open")}function Et(t){t.classList.remove("open"),t.classList.add("closing"),e.panelHideTimerId!==null&&window.clearTimeout(e.panelHideTimerId),e.panelHideTimerId=window.setTimeout(()=>{t.style.display="none",t.classList.remove("closing"),e.panelHideTimerId=null},180)}function Lt(t){if(!e.widget)return;const n=t.getBoundingClientRect(),o=e.widget.getBoundingClientRect(),r=o.width||50,i=o.height||50,l=n.left+n.width/2<=window.innerWidth/2?10:window.innerWidth-r-10,u=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));e.widget.style.left=`${l}px`,e.widget.style.top=`${u}px`,e.widget.style.right="auto",e.widget.style.bottom="auto",e.widget.style.transform="",e.lastPosition={x:l,y:u},We()}function $e(t,n){const o=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=t.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function V(t,n){const o=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=t.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function At(t){const{askAnything:n,appendPanelMessage:o,closeTutorPanel:r,handleBackendError:i,highlightAskArea:a,maybeQueueSummary:s,scheduleSessionPersist:l,syncSessionLanguageFromPage:u,workspaceUrl:d}=He(),m=t.querySelector(".tutor-panel-close"),g=t.querySelector(".btn-help-mode"),y=t.querySelector(".btn-guide-mode"),p=t.querySelector(".btn-gotToWorkspace");y?.addEventListener("click",()=>{if(!e.currentTutorSession)return;e.currentTutorSession.guideModeEnabled=!e.currentTutorSession.guideModeEnabled;const h=t.querySelector(".btn-guide-mode");if(e.currentTutorSession.userId){const k=e.currentTutorSession.problem,L=ke(k);ot({enabled:e.currentTutorSession.guideModeEnabled,sessionId:e.currentTutorSession.sessionId,problem_no:L,problem_name:k,problem_url:e.currentTutorSession.problemUrl})}$e(t,!0),t.classList.add("guidemode-active"),e.currentTutorSession.guideModeEnabled?(h?.classList.add("is-loading"),e.guideMessageCount=0,e.lastGuideMessageEl=null,e.guideActiveSlab=null,Ce()):(ie(),e.lastGuideMessageEl&&e.lastGuideMessageEl.classList.add("guide-end"),$e(t,!1),t.classList.remove("guidemode-active"),h?.classList.remove("is-loading")),l(t)}),p?.addEventListener("click",async()=>{if(!d){console.warn("Workspace URL is not set.");return}const h=await st({url:d});i(t,h,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const c=t.querySelector(".tutor-panel-prompt"),f=t.querySelector(".tutor-panel-send");c?.addEventListener("keydown",async h=>{h.key!=="Enter"||h.shiftKey||(h.preventDefault(),f?.click())}),f?.addEventListener("click",async()=>{if(u(),e.currentTutorSession?.prompt){const h=e.currentTutorSession.prompt;c&&(c.value=""),e.currentTutorSession&&(e.currentTutorSession.prompt=""),o(t,h,"user"),e.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${h}`),s(e.currentTutorSession.sessionRollingHistory),l(t),await n(t,h),e.currentTutorSession.prompt="",l(t)}else return a()}),m?.addEventListener("mousedown",h=>{h.stopPropagation()}),m?.addEventListener("click",async()=>r()),g?.addEventListener("click",async()=>{const h=t.querySelector(".btn-help-mode");let k="";e.currentTutorSession&&(e.currentTutorSession.checkModeEnabled=!0,h?.classList.add("is-loading")),V(t,!0),t.classList.add("checkmode-active");try{const L=await Ie();L?.ok&&typeof L.code=="string"&&e.currentTutorSession&&(k=L.code);const W=await dt(t,k);console.log("this is the response: ",W)}catch{}finally{e.currentTutorSession&&(e.currentTutorSession.checkModeEnabled=!1,h?.classList.remove("is-loading")),V(t,!1),t.classList.remove("checkmode-active"),l(t)}}),c?.addEventListener("input",()=>{e.currentTutorSession&&(e.currentTutorSession.prompt=c.value),l(t)});let b=!1,A=0,S=0,C=0,P=0,T=null;const E=.6,Zt=t.querySelector(".tutor-panel-shellbar"),Ve=()=>{if(!b){T=null;return}const h=t.offsetLeft,k=t.offsetTop,L=h+(C-h)*E,W=k+(P-k)*E;t.style.left=`${L}px`,t.style.top=`${W}px`,T=requestAnimationFrame(Ve)},Xe=h=>{if(!b)return;const k=h.clientX-A,L=h.clientY-S,W=window.innerWidth-t.offsetWidth,Jt=window.innerHeight-t.offsetHeight;C=Math.max(10,Math.min(k,W)),P=Math.max(10,Math.min(L,Jt)),T===null&&(T=requestAnimationFrame(Ve))},Ke=()=>{b&&(b=!1,document.removeEventListener("mousemove",Xe),document.removeEventListener("mouseup",Ke),T!==null&&(cancelAnimationFrame(T),T=null),t.style.left=`${C}px`,t.style.top=`${P}px`,e.currentTutorSession&&(e.currentTutorSession.position={x:t.offsetLeft,y:t.offsetTop}),l(t))};Zt?.addEventListener("mousedown",h=>{h.preventDefault(),b=!0,A=h.clientX-t.getBoundingClientRect().left,S=h.clientY-t.getBoundingClientRect().top,C=t.offsetLeft,P=t.offsetTop,document.addEventListener("mousemove",Xe),document.addEventListener("mouseup",Ke)})}const Mt={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Ge()}):Ge()}};function Ge(){console.log("The widget is being loaded to the page"),e.lastCanonicalProblemUrl=F(window.location.href),pt({appendToContentPanel:we,scheduleSessionPersist:x,syncSessionLanguageFromPage:v,handleBackendError:O}),lt({appendToContentPanel:we,scheduleSessionPersist:x,syncSessionLanguageFromPage:v,handleBackendError:O}),vt({openTutorPanel:he,closeTutorPanel:Ut,askAnything:Vt,highlightAskArea:jt,appendPanelMessage:X,maybeQueueSummary:be,scheduleSessionPersist:x,syncSessionLanguageFromPage:v,handleBackendError:O,workspaceUrl:Ft}),kt(),It(),zt(),_t(),yt(),Ne().then(()=>{e.pendingStoredSession?.panelOpen&&he()}),window.addEventListener("beforeunload",()=>{B(e.currentTutorSession?.element??null)})}function me(t){return!(t.length<8||/\s/.test(t)||!/[A-Z]/.test(t)||!/[a-z]/.test(t)||!/[0-9]/.test(t)||!/[^A-Za-z0-9]/.test(t))}const Ct='#editor button[aria-haspopup="dialog"]';function v(){if(!e.currentTutorSession)return;const t=D();t&&e.currentTutorSession.language!==t&&(e.currentTutorSession.language=t,x(e.currentTutorSession.element??null))}function fe(){const t=document.querySelector(Ct);if(t){if(t.dataset.tutorLangListener||(t.dataset.tutorLangListener="true",t.addEventListener("click",()=>{window.setTimeout(v,50)},{passive:!0})),e.languageObserverTarget===t&&e.languageObserver){v();return}e.languageObserver?.disconnect(),e.languageObserverTarget=t,e.languageObserver=new MutationObserver(()=>{v()}),e.languageObserver.observe(t,{childList:!0,characterData:!0,subtree:!0}),v()}}function _e(t,n,o){const r=o??G(),i=crypto.randomUUID();return{element:t,sessionId:i,userId:n,problem:r,problemUrl:F(window.location.href),language:D(),topics:Je(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function he(){const t=await le(),n=wt(t),o=t?.userId??"";if(n&&await De(),e.currentTutorSession&&e.currentTutorSession.element&&document.body.contains(e.currentTutorSession.element)){fe(),v(),Y(e.currentTutorSession.element),j(),e.isWindowOpen=!0,e.currentTutorSession.element;const i=e.currentTutorSession.element.querySelector(".tutor-panel-content");i&&requestAnimationFrame(()=>{i.scrollTop=i.scrollHeight}),!o||n?(q(e.currentTutorSession.element),R(e.currentTutorSession.element,n?"session expired, please log back in":void 0)):z(e.currentTutorSession),H(),x(e.currentTutorSession.element);return}if(e.currentTutorSession?.userId){Wt();try{await B(e.currentTutorSession.element??null,{force:!0})}finally{$t()}}if(!e.pendingStoredSession&&o){const i=await ce(o,G());i&&pe(i,o,F(window.location.href))&&(e.pendingStoredSession=i)}if(e.pendingStoredSession){const i=Oe();qe(i,e.pendingStoredSession),e.pendingStoredSession=null,fe(),v(),Y(i),j(),e.isWindowOpen=!0,H(),!o||n?(q(i),R(i,n?"session expired, please log back in":void 0)):e.currentTutorSession&&z(e.currentTutorSession),x(i);return}const r=Oe();if(!r){console.log("There was an error creating a panel");return}e.currentTutorSession=_e(r,o),fe(),v(),Y(r),j(),e.isWindowOpen=!0,H(),x(r),e.currentTutorSession&&(!o||n?(q(r),R(r,n?"session expired, please log back in":void 0)):(e.currentTutorSession.userId=o,z(e.currentTutorSession)),setTimeout(()=>{const i=r.querySelector(".tutor-panel-prompt");i&&(i.focus(),i.setSelectionRange(i.value.length,i.value.length))},100))}async function Pt(t){if(e.summarizeInFlight||t.toSummarize.length===0)return;const n=t.toSummarize.splice(0);e.summarizeInFlight=!0;try{const o=await et({sessionId:e.currentTutorSession?.sessionId??"",summarize:n,summary:t.summary});if(O(e.currentTutorSession?.element??null,o,{silent:!0}))return;const r=typeof o=="string"?o:o?.reply;typeof r=="string"&&(t.summary=r)}finally{e.summarizeInFlight=!1}}function be(t){if(t.qaHistory.length<=40)return;const n=t.qaHistory.splice(0,20);t.toSummarize.push(...n),Pt(t)}async function z(t){if(t.sessionTopicsInitialized||!t.userId)return;(await tt({sessionId:t.sessionId,topics:t.topics}))?.success&&(t.sessionTopicsInitialized=!0,x(t.element??null))}const Ft="http://localhost:3000/auth/bridge",Dt=960*60*1e3,Bt=15e3;function qt(t,n,o){oe();const r=t.querySelector(".tutor-panel-content");r&&(r.innerHTML="");const i=t.querySelector(".tutor-panel-prompt");i&&(i.value=""),e.currentTutorSession=_e(t,n,o),e.currentTutorSession&&z(e.currentTutorSession)}function H(){e.lastActivityAt=Date.now(),Date.now()-e.lastActivityStoredAt>Bt&&(e.lastActivityStoredAt=Date.now(),x())}async function Nt(){if(e.currentTutorSession?.element&&(await B(e.currentTutorSession.element,{force:!0}),e.sessionRestorePending=!0),await De(),e.currentTutorSession&&(e.currentTutorSession.guideModeEnabled=!1,e.currentTutorSession.checkModeEnabled=!1),e.currentTutorSession?.element){const t=e.currentTutorSession.element;ie(),t.classList.remove("guidemode-active","checkmode-active"),q(t),R(t,"session expired, please log back in")}}function zt(){const t=()=>H(),n=["mousemove","keydown","click","scroll","input"];for(const o of n)document.addEventListener(o,t,{passive:!0});e.inactivityTimerId&&window.clearInterval(e.inactivityTimerId),e.inactivityTimerId=window.setInterval(async()=>{Date.now()-e.lastActivityAt<Dt||!(await le())?.userId||await Nt()},6e4)}function Ht(t){e.queue=[],e.flushInFlight=!1,oe(),ie(),t.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),e.currentTutorSession&&(e.currentTutorSession.guideModeEnabled=!1,e.currentTutorSession.checkModeEnabled=!1),t.classList.remove("guidemode-active","checkmode-active"),t.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),t.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function q(t){t.classList.add("tutor-panel-locked"),V(t,!0)}function Ue(t){t.classList.remove("tutor-panel-locked"),V(t,!1)}const je="session expired, please log back in";function Ot(t){return typeof t=="object"&&t!==null&&t.success===!1}function Rt(t){const n=t.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(r=>{r.textContent?.trim()===je&&r.remove()})}function Ye(t,n){const o=t.querySelector(".tutor-panel-content");if(!o)return;const r=X(t,n,"assistant");r&&(o.scrollTop=r.offsetTop,x(t))}function O(t,n,o){if(!Ot(n))return!1;if(o?.silent)return!0;const r=t??e.currentTutorSession?.element??null;if(!r)return!0;if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return q(r),R(r,je),e.isWindowOpen||(Y(r),j(),e.isWindowOpen=!0,H(),x(r)),Rt(r),!0;if(n.timeout)return Ye(r,o?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const i=o?.serverMessage??"Internal server error. Please try again in a moment.";return o?.lockOnServerError===!0&&q(r),Ye(r,i),!0}function Wt(){if(document.getElementById("tutor-panel-loading"))return;const t=document.createElement("div");t.id="tutor-panel-loading",t.className="tutor-panel-loading",t.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(t)}function $t(){document.getElementById("tutor-panel-loading")?.remove()}async function Gt(t){e.currentTutorSession?.userId&&e.currentTutorSession.element&&await B(e.currentTutorSession.element,{force:!0}),e.pendingStoredSession=null,oe();const n=e.isWindowOpen;e.currentTutorSession?.element&&e.currentTutorSession.element.remove(),e.currentTutorSession=null,e.isWindowOpen=!1,Re(),await Ne(),n&&he()}function _t(){e.problemUrlWatcherId&&window.clearInterval(e.problemUrlWatcherId),e.problemUrlWatcherId=window.setInterval(()=>{const t=F(window.location.href);t!==e.lastCanonicalProblemUrl&&(e.lastCanonicalProblemUrl=t,Gt())},1e3)}function R(t,n){const o=t.querySelector(".tutor-panel-auth");if(o){if(n){const u=o.querySelector(".auth-error");u&&(u.textContent=n,u.style.display="block")}return}e.suspendPanelOps=!0,Ht(t);const r=document.createElement("div");r.className="tutor-panel-auth",t.appendChild(r);const i=(u,d)=>{if(!u||!d)return;const m=()=>{const g=u.type==="password";d.setAttribute("aria-label",g?"Show password":"Hide password")};d.addEventListener("click",()=>{u.type=u.type==="password"?"text":"password",m(),u.focus(),u.setSelectionRange(u.value.length,u.value.length)}),m()},a=async u=>{const d=e.currentTutorSession?.userId??"",m=e.currentTutorSession?.problem??G();if(e.suspendPanelOps=!1,d&&d===u){e.sessionRestorePending=!1,Ue(t),r.remove(),x(t);return}d&&d!==u&&(await B(t,{force:!0}),qt(t,u,m));const g=await ce(u,m);g&&pe(g,u,F(window.location.href))?(qe(t,g),await de(u,g.state.problem),e.pendingStoredSession=null):g&&await de(u,g.state.problem),e.currentTutorSession&&(e.currentTutorSession.userId=u,z(e.currentTutorSession)),e.sessionRestorePending=!1,Ue(t),r.remove(),x(t)},s=u=>{r.innerHTML=`
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
    `;const d=r.querySelector(".auth-email"),m=r.querySelector(".auth-password"),g=r.querySelector(".auth-login"),y=r.querySelector(".auth-signup"),p=r.querySelector(".auth-password-toggle"),c=r.querySelector(".auth-error");u&&c&&(c.textContent=u,c.style.display="block");const f=()=>{c&&(c.style.display="none")};d?.addEventListener("input",f),m?.addEventListener("input",f),i(m,p),g?.addEventListener("click",async()=>{const b=d?.value.trim()??"",A=m?.value.trim()??"";if(!b||!A)return;const S=await at({email:b,password:A});if(S?.success===!1){c&&(c.textContent=S.error||"Internal server error",c.style.display="block");return}S?.userId&&S?.jwt?await a(S.userId):c&&(c.textContent="Invalid creds",c.style.display="block")}),y?.addEventListener("click",()=>{l()})},l=()=>{r.innerHTML=`
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
    `;const u=r.querySelector(".auth-first-name"),d=r.querySelector(".auth-last-name"),m=r.querySelector(".auth-email"),g=r.querySelector(".auth-password"),y=r.querySelector(".auth-signup-submit"),p=r.querySelector(".auth-password-toggle"),c=r.querySelector(".auth-error"),f=r.querySelector(".auth-password-hint"),b=()=>{c&&(c.style.display="none")};u?.addEventListener("input",b),d?.addEventListener("input",b),m?.addEventListener("input",b),g?.addEventListener("input",b),i(g,p),g?.addEventListener("blur",()=>{if(!f||!g)return;const S=g.value.trim();S&&!me(S)?(f.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",f.style.display="block"):f.style.display="none"}),g?.addEventListener("input",()=>{if(!f||!g)return;const S=g.value.trim();S&&me(S)&&(f.style.display="none")}),y?.addEventListener("click",async()=>{const S=u?.value.trim()??"",C=d?.value.trim()??"",P=m?.value.trim()??"",T=g?.value.trim()??"";if(!S||!C||!P||!T)return;if(!me(T)){f&&(f.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",f.style.display="block");return}const E=await ut({fname:S,lname:C,email:P,password:T});if(E?.success===!1){c&&(c.textContent=E.error||"Internal server error",c.style.display="block");return}E?.requiresVerification?s("Waiting for verification, check email"):E?.userId&&E?.jwt?await a(E.userId):c&&(c.style.display="block")}),r.querySelector(".auth-back")?.addEventListener("click",()=>{s()})};s(n)}function Ut(){e.currentTutorSession?.element&&(Et(e.currentTutorSession.element),Lt(e.currentTutorSession.element),Re(),e.isWindowOpen=!1,x(e.currentTutorSession.element))}function nn(t){}function jt(){}function Yt(t){const n=t.querySelector(".tutor-panel-content");if(!n)return null;const o=document.createElement("div");o.className="tutor-panel-assistant-loading";const r=document.createElement("div");return r.className="tutor-panel-assistant-loading-dot",o.appendChild(r),n.appendChild(o),n.scrollTop=o.offsetTop,o}async function Vt(t,n){const o=Yt(t),r=e.currentTutorSession?.language||D(),i=await it({sessionId:e.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:e.currentTutorSession?.sessionRollingHistory.qaHistory,summary:e.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:r});if(O(t,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return o?.remove(),"Failure";const a=typeof i=="string"?i:i?.reply;return typeof a=="string"&&a.trim()&&(o?.remove(),we(t,"","assistant",a)),o?.remove(),a||"Failure"}function X(t,n,o){const r=t.querySelector(".tutor-panel-content");if(!r)return null;const i=document.createElement("div");if(o==="assistant")i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n);else if(o==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(o==="guideAssistant"){const a=document.createElement("div");return a.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),a.appendChild(i),r.appendChild(a),a}else if(o==="checkAssistant"){const a=document.createElement("div");return a.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),a.appendChild(i),r.appendChild(a),a}else i.textContent=n;return r.append(i),r.scrollTop=i.offsetTop,i}function Se(t,n,o,r){return new Promise(i=>{let a=0;const s=2,l=t.offsetTop;n.scrollTop=l;let u=!0;const d=()=>{Math.abs(n.scrollTop-l)>8&&(u=!1)};n.addEventListener("scroll",d,{passive:!0});const m=()=>{a=Math.min(o.length,a+s);const g=o.slice(0,a);r?.render?t.innerHTML=r.render(g):t.textContent=g,u&&(n.scrollTop=l),a<o.length?window.setTimeout(m,12):(n.removeEventListener("scroll",d),i())};m()})}async function we(t,n,o,r){const i=Tt(r),a=t.querySelector(".tutor-panel-content");if(a&&typeof r=="string"){if(o==="assistant"){const s=X(t,"","assistant");if(!s)return;await Se(s,a,i,{render:I}),s.innerHTML=I(i),e.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${r}`),e.currentTutorSession&&be(e.currentTutorSession.sessionRollingHistory),a.scrollTop=s.offsetTop,x(t)}else if(o==="guideAssistant"){let s=e.guideActiveSlab&&a.contains(e.guideActiveSlab)?e.guideActiveSlab:null;if(!s){s=document.createElement("div"),s.className="guide-wrapper guide-slab";const d=document.createElement("ul");d.className="guide-list",s.appendChild(d),a.appendChild(s),e.guideActiveSlab=s}const l=s.querySelector(".guide-list")??document.createElement("ul");l.classList.contains("guide-list")||(l.className="guide-list",s.appendChild(l));const u=document.createElement("li");u.className="guide-item",l.appendChild(u),e.guideMessageCount===0&&s.classList.add("guide-start"),e.guideMessageCount+=1,e.lastGuideMessageEl=s,await Se(u,a,i,{render:I}),u.innerHTML=I(i),a.scrollTop=s.offsetTop,x(t)}else if(o==="checkAssistant"){const s=X(t,"","checkAssistant");if(!s)return;const l=s.querySelector(".tutor-panel-message--checkAssistant");if(!l)return;s.classList.add("check-start"),await Se(l,a,i,{render:I}),l.innerHTML=I(i),s.classList.add("check-end"),a.scrollTop=s.offsetTop,e.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${r}`),e.currentTutorSession&&be(e.currentTutorSession.sessionRollingHistory),x(t)}}}function K(t,...n){}const Xt={debug:(...t)=>K(console.debug,...t),log:(...t)=>K(console.log,...t),warn:(...t)=>K(console.warn,...t),error:(...t)=>K(console.error,...t)};class ye extends Event{constructor(n,o){super(ye.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=o}static EVENT_NAME=xe("wxt:locationchange")}function xe(t){return`${w?.runtime?.id}:content:${t}`}function Kt(t){let n,o;return{run(){n==null&&(o=new URL(location.href),n=t.setInterval(()=>{let r=new URL(location.href);r.href!==o.href&&(window.dispatchEvent(new ye(r,o)),o=r)},1e3))}}}class Q{constructor(n,o){this.contentScriptName=n,this.options=o,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=xe("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Kt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return w.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,o){const r=setInterval(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(n,o){const r=setTimeout(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(n){const o=requestAnimationFrame((...r)=>{this.isValid&&n(...r)});return this.onInvalidated(()=>cancelAnimationFrame(o)),o}requestIdleCallback(n,o){const r=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},o);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(n,o,r,i){o==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(o.startsWith("wxt:")?xe(o):o,r,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Xt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:Q.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const o=n.data?.type===Q.SCRIPT_STARTED_MESSAGE_TYPE,r=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return o&&r&&i}listenForNewerScripts(n){let o=!0;const r=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const a=o;if(o=!1,a&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}}function on(){}function Z(t,...n){}const Qt={debug:(...t)=>Z(console.debug,...t),log:(...t)=>Z(console.log,...t),warn:(...t)=>Z(console.warn,...t),error:(...t)=>Z(console.error,...t)};return(async()=>{try{const{main:t,...n}=Mt,o=new Q("content",n);return await t(o)}catch(t){throw Qt.error('The content script "content" crashed on startup!',t),t}})()})();
content;