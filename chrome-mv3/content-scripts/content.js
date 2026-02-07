var content=(function(){"use strict";function tn(e){return e}const Ze=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],ve={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function J(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const G=new Map(Ze.map(e=>[J(e),ve[e]??e]));Object.values(ve).forEach(e=>{G.set(J(e),e)});function Je(e){return e.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function ee(e){const n=J(e);if(!n)return e.trim();const o=G.get(n);if(o)return o;const r=n.split(" ");if(r.length>0){const i=r[r.length-1];if(i.endsWith("s")){r[r.length-1]=i.slice(0,-1);const s=r.join(" "),a=G.get(s);if(a)return a}else{r[r.length-1]=`${i}s`;const s=r.join(" "),a=G.get(s);if(a)return a}}return Je(n)}function ke(e,n){const o=ee(n),r=Object.keys(e).find(i=>ee(i)===o);return r&&r!==o&&(e[o]=e[r],delete e[r]),e[o]??={thoughts_to_remember:[],pitfalls:[]},o}function F(e){try{const{origin:n,pathname:o}=new URL(e),r=o.match(/^\/problems\/[^/]+/);return r?`${n}${r[0]}`:`${n}${o}`}catch{return e}}function $(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Ie(e){const n=e.match(/^\s*(\d+)/);if(!n)return null;const o=Number(n[1]);return Number.isFinite(o)?o:null}function et(){const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(o=>o.getAttribute("href")).filter(o=>!!o).map(o=>o.replace("/tag/","").replace("/","")).map(o=>ee(o));return Object.fromEntries(Array.from(new Set(n)).map(o=>[o,{thoughts_to_remember:[],pitfalls:[]}]))}function D(){const e=document.querySelector("#editor");if(!e)return"";const n=e.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(r=>r.nodeType===Node.TEXT_NODE&&r.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}const w=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function tt(e){return w.runtime.sendMessage({action:"summarize-history",payload:e})}function nt(e){return w.runtime.sendMessage({action:"init-session-topics",payload:e})}function ot(e){return w.runtime.sendMessage({action:"guide-mode",payload:e})}function rt(e){return w.runtime.sendMessage({action:"guide-mode-status",payload:e})}function it(e){return w.runtime.sendMessage({action:"check-code",payload:e})}function st(e){return w.runtime.sendMessage({action:"ask-anything",payload:e})}function at(e){return w.runtime.sendMessage({action:"go-to-workspace",payload:e})}function ut(e){return w.runtime.sendMessage({action:"supabase-login",payload:e})}function lt(e){return w.runtime.sendMessage({action:"supabase-signup",payload:e})}function Ee(){return w.runtime.sendMessage({type:"GET_MONACO_CODE"})}const t={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null};let te=null;function ct(e){te=e}function dt(){if(!te)throw new Error("Check dependencies not configured");return te}async function pt(e,n){const{appendToContentPanel:o,handleBackendError:r,scheduleSessionPersist:i,syncSessionLanguageFromPage:s}=dt();try{s();const a=await it({sessionId:t.currentTutorSession?.sessionId??"",topics:t.currentTutorSession?.topics,code:n,action:"check-code",language:t.currentTutorSession?.language??D(),problem_no:Ie(t.currentTutorSession?.problem??""),problem_name:t.currentTutorSession?.problem??"",problem_url:t.currentTutorSession?.problemUrl??""});if(r(e,a,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const l=a?.resp;t.currentTutorSession&&typeof l=="string"&&t.currentTutorSession.content.push(`${l}
`),typeof l=="string"&&l.trim()&&await o(e,"","checkAssistant",l);const u=a?.topics;if(u&&typeof u=="object"&&t.currentTutorSession)for(const[d,m]of Object.entries(u)){if(!m||typeof m!="object")continue;const p=ke(t.currentTutorSession.topics,d),y=m.thoughts_to_remember,g=m.pitfalls,c=Array.isArray(y)?y:typeof y=="string"&&y.trim()?[y.trim()]:[],f=Array.isArray(g)?g:typeof g=="string"&&g.trim()?[g.trim()]:[];t.currentTutorSession&&(c.length>0&&t.currentTutorSession.topics[p].thoughts_to_remember.push(...c),f.length>0&&t.currentTutorSession.topics[p].pitfalls.push(...f))}return console.log("this is the object now: ",t.currentTutorSession?.topics),i(e),a?.resp}catch(a){return console.error("checkMode failed",a),"Failure"}}let ne=null;function gt(e){ne=e}function mt(){if(!ne)throw new Error("Guide dependencies not configured");return ne}function oe(){t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchTimerId=null,t.guideBatchStarted=!1,t.guideTouchedLines=new Set,t.maxLines=0,t.guideAttachAttempts=0,t.guideDrainInFlight=!1,t.lastGuideSelectionLine=null,t.lastGuideFlushLine=null,t.lastGuideFlushAt=0,t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null}function N(){return document.querySelector(".monaco-editor textarea.inputarea")}function Le(e,n){return e.slice(0,Math.max(0,n)).split(`
`).length}function Me(e,n){return e.split(`
`)[n-1]??""}function ft(e){const n=e.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function ht(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function _(){t.guideTouchedLines.clear(),t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchStarted=!1,t.guideBatchTimerId!==null&&(window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=null)}async function re(e){const n=ht(),r=N()?.value??"",i=Array.from(t.guideTouchedLines)[0]??1;if(!i){_();return}const s=Date.now();if(t.lastGuideFlushLine===i&&s-t.lastGuideFlushAt<250)return;if(t.lastGuideFlushLine=i,t.lastGuideFlushAt=s,!n){_();return}let a="";if(r&&(a=Me(r,i)),!a.trim()&&i>1&&r){const u=Me(r,i-1);u.trim()&&(a=u)}let l=n;try{const u=await Ee();u?.ok&&typeof u.code=="string"&&(l=u.code)}catch{}ft(a)&&(t.queue.push([l,a]),bt()),_()}async function bt(){const{appendToContentPanel:e,handleBackendError:n,scheduleSessionPersist:o,syncSessionLanguageFromPage:r}=mt();if(!t.guideDrainInFlight){if(t.suspendPanelOps){t.queue=[];return}t.guideDrainInFlight=!0;try{for(;t.queue.length>0;){if(t.suspendPanelOps){t.queue=[];break}const[i,s]=t.queue.shift();console.log("This is the focus line: ",s),console.log("the code so far: ",i),r(),t.flushInFlight=!0;const a=await ot({action:"guide-mode",sessionId:t.currentTutorSession?.sessionId??"",problem:t.currentTutorSession?.problem??"",topics:t.currentTutorSession?.topics,code:i,focusLine:s,language:t.currentTutorSession?.language??D(),rollingStateGuideMode:t.currentTutorSession?.rollingStateGuideMode});if(n(t.currentTutorSession?.element??null,a,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){t.flushInFlight=!1;continue}if(!a)console.log("failure for guide mode");else{const l=a.success?a.reply:null;l?.state_update?.lastEdit?.trim()&&t.currentTutorSession&&(t.currentTutorSession.rollingStateGuideMode.lastEdit=l.state_update.lastEdit);const u=l?.nudge;if(t.currentTutorSession&&typeof u=="string"){const m=u.trim();m&&(t.currentTutorSession.rollingStateGuideMode.nudges.push(m),t.currentTutorSession.content.push(`${m}
`),t.currentTutorSession.element!=null&&await e(t.currentTutorSession.element,"","guideAssistant",m),o(t.currentTutorSession.element??null))}const d=l?.topics;if(d&&typeof d=="object"&&t.currentTutorSession)for(const[m,p]of Object.entries(d)){if(!p||typeof p!="object")continue;const y=ke(t.currentTutorSession.topics,m),g=p.thoughts_to_remember,c=p.pitfalls,f=Array.isArray(g)?g:typeof g=="string"&&g.trim()?[g.trim()]:[],b=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];t.currentTutorSession&&(f.length>0&&t.currentTutorSession.topics[y].thoughts_to_remember.push(...f),b.length>0&&t.currentTutorSession.topics[y].pitfalls.push(...b))}t.currentTutorSession?.element&&o(t.currentTutorSession.element),t.flushInFlight=!1}}}finally{t.guideDrainInFlight=!1}}}function Ae(){if(!t.currentTutorSession?.guideModeEnabled)return;const e=N();if(!e)return;const n=e.value??"",o=e.selectionStart??0,r=Le(n,o);!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==0&&t.guideTouchedLines.add(r),t.guideBatchStarted||(t.guideBatchStarted=!0),t.guideBatchTimerId!==null&&window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=window.setTimeout(()=>{re()},1e4),!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==1&&re()}function Ce(){if(!t.currentTutorSession?.guideModeEnabled||!t.guideBatchStarted)return;const e=N();if(!e)return;const n=e.value??"",o=e.selectionStart??0,r=Le(n,o);if(t.lastGuideSelectionLine===null){t.lastGuideSelectionLine=r;return}r!==t.lastGuideSelectionLine&&(t.lastGuideSelectionLine=r,!t.guideTouchedLines.has(r)&&t.guideTouchedLines.size==1&&re())}function Pe(){const e=N();if(!e){t.guideAttachAttempts<5&&(t.guideAttachAttempts+=1,window.setTimeout(Pe,500));return}e.addEventListener("input",Ae),document.addEventListener("selectionchange",Ce)}function ie(){const e=N();e&&(e.removeEventListener("input",Ae),document.removeEventListener("selectionchange",Ce))}const se="vibetutor-auth",Fe="vibetutor-session",De=1440*60*1e3,St=1800*1e3,wt=`${Fe}:`;let ae=null;function ue(e,n){return`${Fe}:${encodeURIComponent(e)}:${encodeURIComponent(n)}`}async function le(){return(await w.storage.local.get(se))[se]??null}function yt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Be(){await w.storage.local.remove(se),await w.runtime.sendMessage({action:"clear-auth"})}async function ce(e,n){const o=ue(e,n),i=(await w.storage.local.get(o))[o]??null;return i?Date.now()-(i.lastActivityAt??0)>De?(await w.storage.local.remove(o),null):i:null}async function de(e,n){const o=ue(e,n);await w.storage.local.remove(o)}async function qe(){const e=await w.storage.local.get(null),n=Date.now(),o=[];for(const[r,i]of Object.entries(e)){if(!r.startsWith(wt))continue;const a=i?.lastActivityAt??0;n-a>De&&o.push(r)}o.length>0&&await w.storage.local.remove(o)}function xt(){qe(),ae&&window.clearInterval(ae),ae=window.setInterval(()=>{qe()},St)}function pe(e,n,o){return e.state.userId?e.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):e.state.problemUrl===o:(console.log("There was no stored user in the browser."),!1)}async function B(e,n){if(!t.currentTutorSession||!t.currentTutorSession.userId||t.sessionRestorePending&&!n?.force)return;const o=e?.querySelector(".tutor-panel-content")??t.currentTutorSession.element?.querySelector(".tutor-panel-content"),r=ue(t.currentTutorSession.userId,t.currentTutorSession.problem),i={state:{sessionId:t.currentTutorSession.sessionId,userId:t.currentTutorSession.userId,content:t.currentTutorSession.content,sessionTopicsInitialized:t.currentTutorSession.sessionTopicsInitialized,language:t.currentTutorSession.language,problem:t.currentTutorSession.problem,problemUrl:t.currentTutorSession.problemUrl,topics:t.currentTutorSession.topics,prompt:t.currentTutorSession.prompt,position:t.currentTutorSession.position,size:t.currentTutorSession.size,guideModeEnabled:t.currentTutorSession.guideModeEnabled,checkModeEnabled:t.currentTutorSession.checkModeEnabled,rollingStateGuideMode:t.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:t.currentTutorSession.sessionRollingHistory},panelOpen:t.isWindowOpen,contentHtml:o?.innerHTML??"",contentScrollTop:o?.scrollTop??0,lastActivityAt:t.lastActivityAt};await w.storage.local.set({[r]:i})}function x(e){t.sessionRestorePending||t.persistTimerId||(t.persistTimerId=window.setTimeout(()=>{t.persistTimerId=null,B(e)},500))}function Ne(e,n){t.currentTutorSession={...n.state,element:e},t.currentTutorSession&&!t.currentTutorSession.language&&(t.currentTutorSession.language=D()),t.currentTutorSession&&t.currentTutorSession.sessionTopicsInitialized==null&&(t.currentTutorSession.sessionTopicsInitialized=!1);const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{o.scrollTop=o.scrollHeight}));const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=t.currentTutorSession.prompt??""),t.currentTutorSession.position&&(e.style.left=`${t.currentTutorSession.position.x}px`,e.style.top=`${t.currentTutorSession.position.y}px`),t.currentTutorSession.size&&(e.style.width=`${t.currentTutorSession.size.width}px`,e.style.height=`${t.currentTutorSession.size.height}px`);const i=e.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const s=i[i.length-1],a=s.querySelectorAll(".guide-item");t.guideMessageCount=a.length,t.lastGuideMessageEl=s,t.guideActiveSlab=t.currentTutorSession?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");t.guideMessageCount=s.length,t.lastGuideMessageEl=s.length>0?s[s.length-1]:null,t.guideActiveSlab=null}}async function He(){const e=await le();if(!e?.userId){t.pendingStoredSession=null;return}const n=await ce(e.userId,$());if(!n){t.pendingStoredSession=null;return}if(!pe(n,e.userId,F(window.location.href))){await de(e.userId,n.state.problem),t.pendingStoredSession=null;return}t.pendingStoredSession=n,t.lastActivityAt=n.lastActivityAt??Date.now()}function A(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function U(e){const n=e.split("`"),o=r=>{const i=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,l;for(;(l=i.exec(r))!==null;){s+=A(r.slice(a,l.index));const u=l[1];u.startsWith("**")?s+=`<strong>${A(u.slice(2,-2))}</strong>`:s+=`<code>${A(u.slice(1,-1))}</code>`,a=i.lastIndex}return s+=A(r.slice(a)),s};return n.map((r,i)=>i%2===1?`<code>${A(r)}</code>`:o(r)).join("")}function Tt(e){const n=e.replace(/\r\n/g,`
`).split(`
`);let o="",r=[],i=null;const s=()=>{r.length!==0&&(o+=`<p>${U(r.join(" "))}</p>`,r=[])},a=()=>{i&&(o+=`</${i}>`,i=null)};for(const l of n){const u=l.trim();if(!u){s(),a();continue}const d=u.match(/^(#{1,3})\s+(.*)$/);if(d){s(),a();const y=d[1].length;o+=`<h${y}>${U(d[2])}</h${y}>`;continue}const m=u.match(/^(\d+)[.)]\s+(.*)$/);if(m){s(),i&&i!=="ol"&&a(),i||(i="ol",o+="<ol>"),o+=`<li>${U(m[2])}</li>`;continue}const p=u.match(/^[-*]\s+(.*)$/);if(p){s(),i&&i!=="ul"&&a(),i||(i="ul",o+="<ul>"),o+=`<li>${U(p[1])}</li>`;continue}r.push(u)}return s(),a(),o}function ze(e){const n=e.split(`
`),o=l=>/^\s*\|?[-:\s|]+\|?\s*$/.test(l),r=l=>(l.match(/\|/g)?.length??0)>=2;let i=!1;const s=[];let a=0;for(;a<n.length;){const l=n[a];if(l.trim().startsWith("```")){i=!i,s.push(l),a+=1;continue}if(i){s.push(l),a+=1;continue}if(r(l)||o(l)){const u=[];for(;a<n.length;){const d=n[a];if(d.trim().startsWith("```")||!(r(d)||o(d)))break;u.push(d),a+=1}u.length>0&&(s.push("```table"),s.push(...u),s.push("```"));continue}s.push(l),a+=1}return s.join(`
`)}function vt(e){const n=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return ze(e);const o=n[1].trim(),i=n[2].trim().split(";").map(l=>l.trim()).filter(Boolean);if(i.length===0)return e;const s=i.map(l=>`- ${l.replace(/\.$/,"")}`).join(`
`),a=`${o}

**To fix**
${s}`;return ze(a)}function I(e){const n=e.replace(/\r\n/g,`
`),r=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,l;for(;(l=s.exec(r))!==null;)l.index>a&&i.push({type:"text",content:r.slice(a,l.index)}),i.push({type:"code",content:l[2]??"",lang:l[1]??""}),a=s.lastIndex;return a<r.length&&i.push({type:"text",content:r.slice(a)}),i.map(u=>{if(u.type==="code"){const d=u.lang?` data-lang="${A(u.lang)}"`:"";return`<pre${u.lang==="table"?' class="table-block"':""}><code${d}>${A(u.content.trimEnd())}</code></pre>`}return Tt(u.content)}).join("")}let ge=null;function kt(e){ge=e}function Oe(){if(!ge)throw new Error("Widget dependencies not configured");return ge}function It(){const{closeTutorPanel:e,openTutorPanel:n}=Oe(),o=document.getElementById("tutor-widget");o&&o.remove(),t.widget=document.createElement("div"),t.widget.id="tutor-widget",t.widget.innerHTML=`
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

`,document.head.appendChild(r),document.body.appendChild(t.widget);const i=document.getElementById("main-button");if(!i||!t.widget)return;let s=0,a={x:0,y:0},l=!1,u=!1;function d(g,c){const f=t.widget.offsetWidth,b=t.widget.offsetHeight;return{x:Math.max(0,Math.min(g,window.innerWidth-f)),y:Math.max(0,Math.min(c,window.innerHeight-b))}}function m(g,c){const f=t.widget.offsetWidth,b=t.widget.offsetHeight;return{x:g<window.innerWidth/2?0:window.innerWidth-f,y:Math.max(0,Math.min(c,window.innerHeight-b))}}i.addEventListener("mousedown",g=>{s=Date.now(),a={x:g.clientX,y:g.clientY},l=!1,u=!1;const c=t.widget.getBoundingClientRect();t.dragOffset.x=g.clientX-c.left,t.dragOffset.y=g.clientY-c.top,document.addEventListener("mousemove",p),document.addEventListener("mouseup",y),i&&i.classList.add("dragging")}),i.addEventListener("click",g=>{if(u){u=!1;return}!t.isDragging&&!l&&(g.preventDefault(),g.stopPropagation(),t.isWindowOpen?e():n())});function p(g){const c=Date.now()-s,f=Math.sqrt(Math.pow(g.clientX-a.x,2)+Math.pow(g.clientY-a.y,2));if(!t.isDragging&&(f>3||c>100)&&(t.isDragging=!0,l=!0,document.body.style.cursor="grabbing"),t.isDragging){const b=g.clientX-t.dragOffset.x,M=g.clientY-t.dragOffset.y,S=d(b,M);me(S.x,S.y),t.lastPosition={x:S.x,y:S.y}}}function y(){if(document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",y),i?.classList.remove("dragging"),document.body.style.cursor="",t.isDragging&&t.widget){u=!0;const g=m(t.lastPosition.x,t.lastPosition.y);t.widget.style.transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0, 0.2, 1)",me(g.x,g.y),window.setTimeout(()=>{t.widget&&(t.widget.style.transition="")},300),Re()}t.isDragging=!1,l=!1}}function me(e,n){if(!t.widget)return;const o=t.widget.offsetWidth||50,r=t.widget.offsetHeight||50,i=Math.max(0,Math.min(e,window.innerWidth-o)),s=Math.max(0,Math.min(n,window.innerHeight-r));t.widget.style.left=`${i}px`,t.widget.style.top=`${s}px`,t.widget.style.right="auto",t.widget.style.bottom="auto",t.widget.style.transform="",t.lastPosition={x:i,y:s}}function Y(){t.widget&&(t.widget.style.display="none")}function We(){t.widget&&(t.widget.style.display="block")}async function Re(){}async function Et(){}function Lt(e){if(!t.widget)return;const n=e.getBoundingClientRect(),o=t.widget.getBoundingClientRect(),r=o.width||50,i=o.height||50,l=n.left+n.width/2<=window.innerWidth/2?10:window.innerWidth-r-10,u=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));me(l,u),Re()}function Ge(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const n=40,o=Math.round(window.innerHeight*.38),r=window.innerWidth-e.offsetWidth-20,i=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(n,r))}px`,e.style.top=`${Math.max(20,Math.min(o,i))}px`,setTimeout(()=>e.classList.add("open"),10),At(e),e}function j(e){t.panelHideTimerId!==null&&(window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Mt(e){e.classList.remove("open"),e.classList.add("closing"),t.panelHideTimerId!==null&&window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),t.panelHideTimerId=null},180)}function $e(e,n){const o=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function V(e,n){const o=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const r of o){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function At(e){const{askAnything:n,appendPanelMessage:o,closeTutorPanel:r,handleBackendError:i,highlightAskArea:s,maybeQueueSummary:a,scheduleSessionPersist:l,syncSessionLanguageFromPage:u,workspaceUrl:d}=Oe(),m=e.querySelector(".tutor-panel-close"),p=e.querySelector(".btn-help-mode"),y=e.querySelector(".btn-guide-mode"),g=e.querySelector(".btn-gotToWorkspace");y?.addEventListener("click",()=>{if(!t.currentTutorSession)return;t.currentTutorSession.guideModeEnabled=!t.currentTutorSession.guideModeEnabled;const h=e.querySelector(".btn-guide-mode");if(t.currentTutorSession.userId){const k=t.currentTutorSession.problem,L=Ie(k);rt({enabled:t.currentTutorSession.guideModeEnabled,sessionId:t.currentTutorSession.sessionId,problem_no:L,problem_name:k,problem_url:t.currentTutorSession.problemUrl})}$e(e,!0),e.classList.add("guidemode-active"),t.currentTutorSession.guideModeEnabled?(h?.classList.add("is-loading"),t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null,Pe()):(ie(),t.lastGuideMessageEl&&t.lastGuideMessageEl.classList.add("guide-end"),$e(e,!1),e.classList.remove("guidemode-active"),h?.classList.remove("is-loading")),l(e)}),g?.addEventListener("click",async()=>{if(!d){console.warn("Workspace URL is not set.");return}const h=await at({url:d});i(e,h,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const c=e.querySelector(".tutor-panel-prompt"),f=e.querySelector(".tutor-panel-send");c?.addEventListener("keydown",async h=>{h.key!=="Enter"||h.shiftKey||(h.preventDefault(),f?.click())}),f?.addEventListener("click",async()=>{if(u(),t.currentTutorSession?.prompt){const h=t.currentTutorSession.prompt;c&&(c.value=""),t.currentTutorSession&&(t.currentTutorSession.prompt=""),o(e,h,"user"),t.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${h}`),a(t.currentTutorSession.sessionRollingHistory),l(e),await n(e,h),t.currentTutorSession.prompt="",l(e)}else return s()}),m?.addEventListener("mousedown",h=>{h.stopPropagation()}),m?.addEventListener("click",async()=>r()),p?.addEventListener("click",async()=>{const h=e.querySelector(".btn-help-mode");let k="";t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!0,h?.classList.add("is-loading")),V(e,!0),e.classList.add("checkmode-active");try{const L=await Ee();L?.ok&&typeof L.code=="string"&&t.currentTutorSession&&(k=L.code);const R=await pt(e,k);console.log("this is the response: ",R)}catch{}finally{t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!1,h?.classList.remove("is-loading")),V(e,!1),e.classList.remove("checkmode-active"),l(e)}}),c?.addEventListener("input",()=>{t.currentTutorSession&&(t.currentTutorSession.prompt=c.value),l(e)});let b=!1,M=0,S=0,C=0,P=0,T=null;const E=.6,Jt=e.querySelector(".tutor-panel-shellbar"),Xe=()=>{if(!b){T=null;return}const h=e.offsetLeft,k=e.offsetTop,L=h+(C-h)*E,R=k+(P-k)*E;e.style.left=`${L}px`,e.style.top=`${R}px`,T=requestAnimationFrame(Xe)},Ke=h=>{if(!b)return;const k=h.clientX-M,L=h.clientY-S,R=window.innerWidth-e.offsetWidth,en=window.innerHeight-e.offsetHeight;C=Math.max(10,Math.min(k,R)),P=Math.max(10,Math.min(L,en)),T===null&&(T=requestAnimationFrame(Xe))},Qe=()=>{b&&(b=!1,document.removeEventListener("mousemove",Ke),document.removeEventListener("mouseup",Qe),T!==null&&(cancelAnimationFrame(T),T=null),e.style.left=`${C}px`,e.style.top=`${P}px`,t.currentTutorSession&&(t.currentTutorSession.position={x:e.offsetLeft,y:e.offsetTop}),l(e))};Jt?.addEventListener("mousedown",h=>{h.preventDefault(),b=!0,M=h.clientX-e.getBoundingClientRect().left,S=h.clientY-e.getBoundingClientRect().top,C=e.offsetLeft,P=e.offsetTop,document.addEventListener("mousemove",Ke),document.addEventListener("mouseup",Qe)})}const Ct={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{_e()}):_e()}};function _e(){console.log("The widget is being loaded to the page"),t.lastCanonicalProblemUrl=F(window.location.href),gt({appendToContentPanel:ye,scheduleSessionPersist:x,syncSessionLanguageFromPage:v,handleBackendError:O}),ct({appendToContentPanel:ye,scheduleSessionPersist:x,syncSessionLanguageFromPage:v,handleBackendError:O}),kt({openTutorPanel:be,closeTutorPanel:Yt,askAnything:Xt,highlightAskArea:jt,appendPanelMessage:X,maybeQueueSummary:Se,scheduleSessionPersist:x,syncSessionLanguageFromPage:v,handleBackendError:O,workspaceUrl:Dt}),It(),Et(),zt(),Ut(),xt(),He().then(()=>{t.pendingStoredSession?.panelOpen&&be()}),window.addEventListener("beforeunload",()=>{B(t.currentTutorSession?.element??null)})}function fe(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}const Pt='#editor button[aria-haspopup="dialog"]';function v(){if(!t.currentTutorSession)return;const e=D();e&&t.currentTutorSession.language!==e&&(t.currentTutorSession.language=e,x(t.currentTutorSession.element??null))}function he(){const e=document.querySelector(Pt);if(e){if(e.dataset.tutorLangListener||(e.dataset.tutorLangListener="true",e.addEventListener("click",()=>{window.setTimeout(v,50)},{passive:!0})),t.languageObserverTarget===e&&t.languageObserver){v();return}t.languageObserver?.disconnect(),t.languageObserverTarget=e,t.languageObserver=new MutationObserver(()=>{v()}),t.languageObserver.observe(e,{childList:!0,characterData:!0,subtree:!0}),v()}}function Ue(e,n,o){const r=o??$(),i=crypto.randomUUID();return{element:e,sessionId:i,userId:n,problem:r,problemUrl:F(window.location.href),language:D(),topics:et(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function be(){const e=await le(),n=yt(e),o=e?.userId??"";if(n&&await Be(),t.currentTutorSession&&t.currentTutorSession.element&&document.body.contains(t.currentTutorSession.element)){he(),v(),j(t.currentTutorSession.element),Y(),t.isWindowOpen=!0,t.currentTutorSession.element;const i=t.currentTutorSession.element.querySelector(".tutor-panel-content");i&&requestAnimationFrame(()=>{i.scrollTop=i.scrollHeight}),!o||n?(q(t.currentTutorSession.element),W(t.currentTutorSession.element,n?"session expired, please log back in":void 0)):H(t.currentTutorSession),z(),x(t.currentTutorSession.element);return}if(t.currentTutorSession?.userId){Gt();try{await B(t.currentTutorSession.element??null,{force:!0})}finally{$t()}}if(!t.pendingStoredSession&&o){const i=await ce(o,$());i&&pe(i,o,F(window.location.href))&&(t.pendingStoredSession=i)}if(t.pendingStoredSession){const i=Ge();Ne(i,t.pendingStoredSession),t.pendingStoredSession=null,he(),v(),j(i),Y(),t.isWindowOpen=!0,z(),!o||n?(q(i),W(i,n?"session expired, please log back in":void 0)):t.currentTutorSession&&H(t.currentTutorSession),x(i);return}const r=Ge();if(!r){console.log("There was an error creating a panel");return}t.currentTutorSession=Ue(r,o),he(),v(),j(r),Y(),t.isWindowOpen=!0,z(),x(r),t.currentTutorSession&&(!o||n?(q(r),W(r,n?"session expired, please log back in":void 0)):(t.currentTutorSession.userId=o,H(t.currentTutorSession)),setTimeout(()=>{const i=r.querySelector(".tutor-panel-prompt");i&&(i.focus(),i.setSelectionRange(i.value.length,i.value.length))},100))}async function Ft(e){if(t.summarizeInFlight||e.toSummarize.length===0)return;const n=e.toSummarize.splice(0);t.summarizeInFlight=!0;try{const o=await tt({sessionId:t.currentTutorSession?.sessionId??"",summarize:n,summary:e.summary});if(O(t.currentTutorSession?.element??null,o,{silent:!0}))return;const r=typeof o=="string"?o:o?.reply;typeof r=="string"&&(e.summary=r)}finally{t.summarizeInFlight=!1}}function Se(e){if(e.qaHistory.length<=40)return;const n=e.qaHistory.splice(0,20);e.toSummarize.push(...n),Ft(e)}async function H(e){if(e.sessionTopicsInitialized||!e.userId)return;(await nt({sessionId:e.sessionId,topics:e.topics}))?.success&&(e.sessionTopicsInitialized=!0,x(e.element??null))}const Dt="http://localhost:3000/auth/bridge",Bt=960*60*1e3,qt=15e3;function Nt(e,n,o){oe();const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML="");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=""),t.currentTutorSession=Ue(e,n,o),t.currentTutorSession&&H(t.currentTutorSession)}function z(){t.lastActivityAt=Date.now(),Date.now()-t.lastActivityStoredAt>qt&&(t.lastActivityStoredAt=Date.now(),x())}async function Ht(){if(t.currentTutorSession?.element&&(await B(t.currentTutorSession.element,{force:!0}),t.sessionRestorePending=!0),await Be(),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),t.currentTutorSession?.element){const e=t.currentTutorSession.element;ie(),e.classList.remove("guidemode-active","checkmode-active"),q(e),W(e,"session expired, please log back in")}}function zt(){const e=()=>z(),n=["mousemove","keydown","click","scroll","input"];for(const o of n)document.addEventListener(o,e,{passive:!0});t.inactivityTimerId&&window.clearInterval(t.inactivityTimerId),t.inactivityTimerId=window.setInterval(async()=>{Date.now()-t.lastActivityAt<Bt||!(await le())?.userId||await Ht()},6e4)}function Ot(e){t.queue=[],t.flushInFlight=!1,oe(),ie(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function q(e){e.classList.add("tutor-panel-locked"),V(e,!0)}function Ye(e){e.classList.remove("tutor-panel-locked"),V(e,!1)}const je="session expired, please log back in";function Wt(e){return typeof e=="object"&&e!==null&&e.success===!1}function Rt(e){const n=e.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(r=>{r.textContent?.trim()===je&&r.remove()})}function Ve(e,n){const o=e.querySelector(".tutor-panel-content");if(!o)return;const r=X(e,n,"assistant");r&&(o.scrollTop=r.offsetTop,x(e))}function O(e,n,o){if(!Wt(n))return!1;if(o?.silent)return!0;const r=e??t.currentTutorSession?.element??null;if(!r)return!0;if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return q(r),W(r,je),t.isWindowOpen||(j(r),Y(),t.isWindowOpen=!0,z(),x(r)),Rt(r),!0;if(n.timeout)return Ve(r,o?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const i=o?.serverMessage??"Internal server error. Please try again in a moment.";return o?.lockOnServerError===!0&&q(r),Ve(r,i),!0}function Gt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function $t(){document.getElementById("tutor-panel-loading")?.remove()}async function _t(e){t.currentTutorSession?.userId&&t.currentTutorSession.element&&await B(t.currentTutorSession.element,{force:!0}),t.pendingStoredSession=null,oe();const n=t.isWindowOpen;t.currentTutorSession?.element&&t.currentTutorSession.element.remove(),t.currentTutorSession=null,t.isWindowOpen=!1,We(),await He(),n&&be()}function Ut(){t.problemUrlWatcherId&&window.clearInterval(t.problemUrlWatcherId),t.problemUrlWatcherId=window.setInterval(()=>{const e=F(window.location.href);e!==t.lastCanonicalProblemUrl&&(t.lastCanonicalProblemUrl=e,_t())},1e3)}function W(e,n){const o=e.querySelector(".tutor-panel-auth");if(o){if(n){const u=o.querySelector(".auth-error");u&&(u.textContent=n,u.style.display="block")}return}t.suspendPanelOps=!0,Ot(e);const r=document.createElement("div");r.className="tutor-panel-auth",e.appendChild(r);const i=(u,d)=>{if(!u||!d)return;const m=()=>{const p=u.type==="password";d.setAttribute("aria-label",p?"Show password":"Hide password")};d.addEventListener("click",()=>{u.type=u.type==="password"?"text":"password",m(),u.focus(),u.setSelectionRange(u.value.length,u.value.length)}),m()},s=async u=>{const d=t.currentTutorSession?.userId??"",m=t.currentTutorSession?.problem??$();if(t.suspendPanelOps=!1,d&&d===u){t.sessionRestorePending=!1,Ye(e),r.remove(),x(e);return}d&&d!==u&&(await B(e,{force:!0}),Nt(e,u,m));const p=await ce(u,m);p&&pe(p,u,F(window.location.href))?(Ne(e,p),await de(u,p.state.problem),t.pendingStoredSession=null):p&&await de(u,p.state.problem),t.currentTutorSession&&(t.currentTutorSession.userId=u,H(t.currentTutorSession)),t.sessionRestorePending=!1,Ye(e),r.remove(),x(e)},a=u=>{r.innerHTML=`
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
    `;const d=r.querySelector(".auth-email"),m=r.querySelector(".auth-password"),p=r.querySelector(".auth-login"),y=r.querySelector(".auth-signup"),g=r.querySelector(".auth-password-toggle"),c=r.querySelector(".auth-error");u&&c&&(c.textContent=u,c.style.display="block");const f=()=>{c&&(c.style.display="none")};d?.addEventListener("input",f),m?.addEventListener("input",f),i(m,g),p?.addEventListener("click",async()=>{const b=d?.value.trim()??"",M=m?.value.trim()??"";if(!b||!M)return;const S=await ut({email:b,password:M});if(S?.success===!1){c&&(c.textContent=S.error||"Internal server error",c.style.display="block");return}S?.userId&&S?.jwt?await s(S.userId):c&&(c.textContent="Invalid creds",c.style.display="block")}),y?.addEventListener("click",()=>{l()})},l=()=>{r.innerHTML=`
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
    `;const u=r.querySelector(".auth-first-name"),d=r.querySelector(".auth-last-name"),m=r.querySelector(".auth-email"),p=r.querySelector(".auth-password"),y=r.querySelector(".auth-signup-submit"),g=r.querySelector(".auth-password-toggle"),c=r.querySelector(".auth-error"),f=r.querySelector(".auth-password-hint"),b=()=>{c&&(c.style.display="none")};u?.addEventListener("input",b),d?.addEventListener("input",b),m?.addEventListener("input",b),p?.addEventListener("input",b),i(p,g),p?.addEventListener("blur",()=>{if(!f||!p)return;const S=p.value.trim();S&&!fe(S)?(f.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",f.style.display="block"):f.style.display="none"}),p?.addEventListener("input",()=>{if(!f||!p)return;const S=p.value.trim();S&&fe(S)&&(f.style.display="none")}),y?.addEventListener("click",async()=>{const S=u?.value.trim()??"",C=d?.value.trim()??"",P=m?.value.trim()??"",T=p?.value.trim()??"";if(!S||!C||!P||!T)return;if(!fe(T)){f&&(f.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",f.style.display="block");return}const E=await lt({fname:S,lname:C,email:P,password:T});if(E?.success===!1){c&&(c.textContent=E.error||"Internal server error",c.style.display="block");return}E?.requiresVerification?a("Waiting for verification, check email"):E?.userId&&E?.jwt?await s(E.userId):c&&(c.style.display="block")}),r.querySelector(".auth-back")?.addEventListener("click",()=>{a()})};a(n)}function Yt(){t.currentTutorSession?.element&&(Mt(t.currentTutorSession.element),Lt(t.currentTutorSession.element),We(),t.isWindowOpen=!1,x(t.currentTutorSession.element))}function on(e){}function jt(){}function Vt(e){const n=e.querySelector(".tutor-panel-content");if(!n)return null;const o=document.createElement("div");o.className="tutor-panel-assistant-loading";const r=document.createElement("div");return r.className="tutor-panel-assistant-loading-dot",o.appendChild(r),n.appendChild(o),n.scrollTop=o.offsetTop,o}async function Xt(e,n){const o=Vt(e),r=t.currentTutorSession?.language||D(),i=await st({sessionId:t.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:t.currentTutorSession?.sessionRollingHistory.qaHistory,summary:t.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:r});if(O(e,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return o?.remove(),"Failure";const s=typeof i=="string"?i:i?.reply;return typeof s=="string"&&s.trim()&&(o?.remove(),ye(e,"","assistant",s)),o?.remove(),s||"Failure"}function X(e,n,o){const r=e.querySelector(".tutor-panel-content");if(!r)return null;const i=document.createElement("div");if(o==="assistant")i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n);else if(o==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(o==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),s.appendChild(i),r.appendChild(s),s}else if(o==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${o}`,i.innerHTML=I(n),s.appendChild(i),r.appendChild(s),s}else i.textContent=n;return r.append(i),r.scrollTop=i.offsetTop,i}function we(e,n,o,r){return new Promise(i=>{let s=0;const a=2,l=e.offsetTop;n.scrollTop=l;let u=!0;const d=()=>{Math.abs(n.scrollTop-l)>8&&(u=!1)};n.addEventListener("scroll",d,{passive:!0});const m=()=>{s=Math.min(o.length,s+a);const p=o.slice(0,s);r?.render?e.innerHTML=r.render(p):e.textContent=p,u&&(n.scrollTop=l),s<o.length?window.setTimeout(m,12):(n.removeEventListener("scroll",d),i())};m()})}async function ye(e,n,o,r){const i=vt(r),s=e.querySelector(".tutor-panel-content");if(s&&typeof r=="string"){if(o==="assistant"){const a=X(e,"","assistant");if(!a)return;await we(a,s,i,{render:I}),a.innerHTML=I(i),t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${r}`),t.currentTutorSession&&Se(t.currentTutorSession.sessionRollingHistory),s.scrollTop=a.offsetTop,x(e)}else if(o==="guideAssistant"){let a=t.guideActiveSlab&&s.contains(t.guideActiveSlab)?t.guideActiveSlab:null;if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const d=document.createElement("ul");d.className="guide-list",a.appendChild(d),s.appendChild(a),t.guideActiveSlab=a}const l=a.querySelector(".guide-list")??document.createElement("ul");l.classList.contains("guide-list")||(l.className="guide-list",a.appendChild(l));const u=document.createElement("li");u.className="guide-item",l.appendChild(u),t.guideMessageCount===0&&a.classList.add("guide-start"),t.guideMessageCount+=1,t.lastGuideMessageEl=a,await we(u,s,i,{render:I}),u.innerHTML=I(i),s.scrollTop=a.offsetTop,x(e)}else if(o==="checkAssistant"){const a=X(e,"","checkAssistant");if(!a)return;const l=a.querySelector(".tutor-panel-message--checkAssistant");if(!l)return;a.classList.add("check-start"),await we(l,s,i,{render:I}),l.innerHTML=I(i),a.classList.add("check-end"),s.scrollTop=a.offsetTop,t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${r}`),t.currentTutorSession&&Se(t.currentTutorSession.sessionRollingHistory),x(e)}}}function K(e,...n){}const Kt={debug:(...e)=>K(console.debug,...e),log:(...e)=>K(console.log,...e),warn:(...e)=>K(console.warn,...e),error:(...e)=>K(console.error,...e)};class xe extends Event{constructor(n,o){super(xe.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=o}static EVENT_NAME=Te("wxt:locationchange")}function Te(e){return`${w?.runtime?.id}:content:${e}`}function Qt(e){let n,o;return{run(){n==null&&(o=new URL(location.href),n=e.setInterval(()=>{let r=new URL(location.href);r.href!==o.href&&(window.dispatchEvent(new xe(r,o)),o=r)},1e3))}}}class Q{constructor(n,o){this.contentScriptName=n,this.options=o,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Te("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Qt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return w.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,o){const r=setInterval(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(n,o){const r=setTimeout(()=>{this.isValid&&n()},o);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(n){const o=requestAnimationFrame((...r)=>{this.isValid&&n(...r)});return this.onInvalidated(()=>cancelAnimationFrame(o)),o}requestIdleCallback(n,o){const r=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},o);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(n,o,r,i){o==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(o.startsWith("wxt:")?Te(o):o,r,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Kt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:Q.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const o=n.data?.type===Q.SCRIPT_STARTED_MESSAGE_TYPE,r=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return o&&r&&i}listenForNewerScripts(n){let o=!0;const r=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=o;if(o=!1,s&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}}function rn(){}function Z(e,...n){}const Zt={debug:(...e)=>Z(console.debug,...e),log:(...e)=>Z(console.log,...e),warn:(...e)=>Z(console.warn,...e),error:(...e)=>Z(console.error,...e)};return(async()=>{try{const{main:e,...n}=Ct,o=new Q("content",n);return await e(o)}catch(e){throw Zt.error('The content script "content" crashed on startup!',e),e}})()})();
content;