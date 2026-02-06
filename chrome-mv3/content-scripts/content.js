var content=(function(){"use strict";function Gt(e){return e}const We=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],be={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function V(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const H=new Map(We.map(e=>[V(e),be[e]??e]));Object.values(be).forEach(e=>{H.set(V(e),e)});function _e(e){return e.split(" ").filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function K(e){const n=V(e);if(!n)return e.trim();const r=H.get(n);if(r)return r;const o=n.split(" ");if(o.length>0){const i=o[o.length-1];if(i.endsWith("s")){o[o.length-1]=i.slice(0,-1);const s=o.join(" "),a=H.get(s);if(a)return a}else{o[o.length-1]=`${i}s`;const s=o.join(" "),a=H.get(s);if(a)return a}}return _e(n)}function Se(e,n){const r=K(n),o=Object.keys(e).find(i=>K(i)===r);return o&&o!==r&&(e[r]=e[o],delete e[o]),e[r]??={thoughts_to_remember:[],pitfalls:[]},r}function M(e){try{const{origin:n,pathname:r}=new URL(e),o=r.match(/^\/problems\/[^/]+/);return o?`${n}${o[0]}`:`${n}${r}`}catch{return e}}function O(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function we(e){const n=e.match(/^\s*(\d+)/);if(!n)return null;const r=Number(n[1]);return Number.isFinite(r)?r:null}function Ue(){const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(r=>r.getAttribute("href")).filter(r=>!!r).map(r=>r.replace("/tag/","").replace("/","")).map(r=>K(r));return Object.fromEntries(Array.from(new Set(n)).map(r=>[r,{thoughts_to_remember:[],pitfalls:[]}]))}function C(){const e=document.querySelector("#editor");if(!e)return"";const n=e.querySelector('button[aria-haspopup="dialog"]');return n?Array.from(n.childNodes).find(o=>o.nodeType===Node.TEXT_NODE&&o.textContent?.trim())?.textContent?.trim()??n.textContent?.trim()??"":""}const w=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome;function Ye(e){return w.runtime.sendMessage({action:"summarize-history",payload:e})}function je(e){return w.runtime.sendMessage({action:"init-session-topics",payload:e})}function Xe(e){return w.runtime.sendMessage({action:"guide-mode",payload:e})}function Ve(e){return w.runtime.sendMessage({action:"guide-mode-status",payload:e})}function Ke(e){return w.runtime.sendMessage({action:"check-code",payload:e})}function Qe(e){return w.runtime.sendMessage({action:"ask-anything",payload:e})}function Ze(e){return w.runtime.sendMessage({action:"go-to-workspace",payload:e})}function Je(e){return w.runtime.sendMessage({action:"supabase-login",payload:e})}function et(e){return w.runtime.sendMessage({action:"supabase-signup",payload:e})}function ye(){return w.runtime.sendMessage({type:"GET_MONACO_CODE"})}const t={widget:null,panel:null,isDragging:!1,isWindowOpen:!1,dragOffset:{x:0,y:0},lastPosition:{x:0,y:0},menuCloseTimeout:null,globalMouseMoveHandler:null,flushInFlight:!1,panelHideTimerId:null,suspendPanelOps:!1,queue:[],currentBatch:null,editedLineQueue:[],lastGuideCursorLine:null,languageObserver:null,languageObserverTarget:null,summarizeInFlight:!1,currentTutorSession:null,pendingStoredSession:null,lastActivityAt:Date.now(),lastActivityStoredAt:0,sessionRestorePending:!1,persistTimerId:null,inactivityTimerId:null,problemUrlWatcherId:null,lastCanonicalProblemUrl:"",guideMinIdx:Number.POSITIVE_INFINITY,guideMaxIdx:-1,guideBatchTimerId:null,guideBatchStarted:!1,guideTouchedLines:new Set,maxLines:0,guideAttachAttempts:0,guideDrainInFlight:!1,lastGuideSelectionLine:null,lastGuideFlushLine:null,lastGuideFlushAt:0,guideMessageCount:0,lastGuideMessageEl:null,guideActiveSlab:null};let Q=null;function tt(e){Q=e}function nt(){if(!Q)throw new Error("Guide dependencies not configured");return Q}function Z(){t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchTimerId=null,t.guideBatchStarted=!1,t.guideTouchedLines=new Set,t.maxLines=0,t.guideAttachAttempts=0,t.guideDrainInFlight=!1,t.lastGuideSelectionLine=null,t.lastGuideFlushLine=null,t.lastGuideFlushAt=0,t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null}function D(){return document.querySelector(".monaco-editor textarea.inputarea")}function xe(e,n){return e.slice(0,Math.max(0,n)).split(`
`).length}function Te(e,n){return e.split(`
`)[n-1]??""}function ot(e){const n=e.trim();return n?/[;}]\s*$/.test(n)?!0:n==="else"||n==="if"||n==="while"||/^else\b/.test(n)&&/\{\s*$/.test(n)?!1:n.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function rt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function R(){t.guideTouchedLines.clear(),t.guideMinIdx=Number.POSITIVE_INFINITY,t.guideMaxIdx=-1,t.guideBatchStarted=!1,t.guideBatchTimerId!==null&&(window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=null)}async function J(e){const n=rt(),o=D()?.value??"",i=Array.from(t.guideTouchedLines)[0]??1;if(!i){R();return}const s=Date.now();if(t.lastGuideFlushLine===i&&s-t.lastGuideFlushAt<250)return;if(t.lastGuideFlushLine=i,t.lastGuideFlushAt=s,!n){R();return}let a="";if(o&&(a=Te(o,i)),!a.trim()&&i>1&&o){const u=Te(o,i-1);u.trim()&&(a=u)}let c=n;try{const u=await ye();u?.ok&&typeof u.code=="string"&&(c=u.code)}catch{}ot(a)&&(t.queue.push([c,a]),it()),R()}async function it(){const{appendToContentPanel:e,handleBackendError:n,scheduleSessionPersist:r,syncSessionLanguageFromPage:o}=nt();if(!t.guideDrainInFlight){if(t.suspendPanelOps){t.queue=[];return}t.guideDrainInFlight=!0;try{for(;t.queue.length>0;){if(t.suspendPanelOps){t.queue=[];break}const[i,s]=t.queue.shift();console.log("This is the focus line: ",s),console.log("the code so far: ",i),o(),t.flushInFlight=!0;const a=await Xe({action:"guide-mode",sessionId:t.currentTutorSession?.sessionId??"",problem:t.currentTutorSession?.problem??"",topics:t.currentTutorSession?.topics,code:i,focusLine:s,language:t.currentTutorSession?.language??C(),rollingStateGuideMode:t.currentTutorSession?.rollingStateGuideMode});if(n(t.currentTutorSession?.element??null,a,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){t.flushInFlight=!1;continue}if(!a)console.log("failure for guide mode");else{const c=a.success?a.reply:null;c?.state_update?.lastEdit?.trim()&&t.currentTutorSession&&(t.currentTutorSession.rollingStateGuideMode.lastEdit=c.state_update.lastEdit);const u=c?.nudge;if(t.currentTutorSession&&typeof u=="string"){const d=u.trim();d&&(t.currentTutorSession.rollingStateGuideMode.nudges.push(d),t.currentTutorSession.content.push(`${d}
`),t.currentTutorSession.element!=null&&await e(t.currentTutorSession.element,"","guideAssistant",d),r(t.currentTutorSession.element??null))}const l=c?.topics;if(l&&typeof l=="object"&&t.currentTutorSession)for(const[d,p]of Object.entries(l)){if(!p||typeof p!="object")continue;const f=Se(t.currentTutorSession.topics,d),b=p.thoughts_to_remember,g=p.pitfalls,h=Array.isArray(b)?b:typeof b=="string"&&b.trim()?[b.trim()]:[],y=Array.isArray(g)?g:typeof g=="string"&&g.trim()?[g.trim()]:[];t.currentTutorSession&&(h.length>0&&t.currentTutorSession.topics[f].thoughts_to_remember.push(...h),y.length>0&&t.currentTutorSession.topics[f].pitfalls.push(...y))}t.currentTutorSession?.element&&r(t.currentTutorSession.element),t.flushInFlight=!1}}}finally{t.guideDrainInFlight=!1}}}function ve(){if(!t.currentTutorSession?.guideModeEnabled)return;const e=D();if(!e)return;const n=e.value??"",r=e.selectionStart??0,o=xe(n,r);!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==0&&t.guideTouchedLines.add(o),t.guideBatchStarted||(t.guideBatchStarted=!0),t.guideBatchTimerId!==null&&window.clearTimeout(t.guideBatchTimerId),t.guideBatchTimerId=window.setTimeout(()=>{J()},1e4),!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==1&&J()}function ke(){if(!t.currentTutorSession?.guideModeEnabled||!t.guideBatchStarted)return;const e=D();if(!e)return;const n=e.value??"",r=e.selectionStart??0,o=xe(n,r);if(t.lastGuideSelectionLine===null){t.lastGuideSelectionLine=o;return}o!==t.lastGuideSelectionLine&&(t.lastGuideSelectionLine=o,!t.guideTouchedLines.has(o)&&t.guideTouchedLines.size==1&&J())}function Ie(){const e=D();if(!e){t.guideAttachAttempts<5&&(t.guideAttachAttempts+=1,window.setTimeout(Ie,500));return}e.addEventListener("input",ve),document.addEventListener("selectionchange",ke)}function ee(){const e=D();e&&(e.removeEventListener("input",ve),document.removeEventListener("selectionchange",ke))}let te=null;function st(e){te=e}function at(){if(!te)throw new Error("Check dependencies not configured");return te}async function ut(e,n){const{appendToContentPanel:r,handleBackendError:o,scheduleSessionPersist:i,syncSessionLanguageFromPage:s}=at();try{s();const a=await Ke({sessionId:t.currentTutorSession?.sessionId??"",topics:t.currentTutorSession?.topics,code:n,action:"check-code",language:t.currentTutorSession?.language??C(),problem_no:we(t.currentTutorSession?.problem??""),problem_name:t.currentTutorSession?.problem??"",problem_url:t.currentTutorSession?.problemUrl??""});if(o(e,a,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const c=a?.resp;t.currentTutorSession&&typeof c=="string"&&t.currentTutorSession.content.push(`${c}
`),typeof c=="string"&&c.trim()&&await r(e,"","checkAssistant",c);const u=a?.topics;if(u&&typeof u=="object"&&t.currentTutorSession)for(const[l,d]of Object.entries(u)){if(!d||typeof d!="object")continue;const p=Se(t.currentTutorSession.topics,l),f=d.thoughts_to_remember,b=d.pitfalls,g=Array.isArray(f)?f:typeof f=="string"&&f.trim()?[f.trim()]:[],h=Array.isArray(b)?b:typeof b=="string"&&b.trim()?[b.trim()]:[];t.currentTutorSession&&(g.length>0&&t.currentTutorSession.topics[p].thoughts_to_remember.push(...g),h.length>0&&t.currentTutorSession.topics[p].pitfalls.push(...h))}return console.log("this is the object now: ",t.currentTutorSession?.topics),i(e),a?.resp}catch(a){return console.error("checkMode failed",a),"Failure"}}const ne="vibetutor-auth",Ee="vibetutor-session",Le=1440*60*1e3,lt=1800*1e3,ct=`${Ee}:`;let oe=null;function re(e,n){return`${Ee}:${encodeURIComponent(e)}:${encodeURIComponent(n)}`}async function ie(){return(await w.storage.local.get(ne))[ne]??null}function dt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Ae(){await w.storage.local.remove(ne),await w.runtime.sendMessage({action:"clear-auth"})}async function se(e,n){const r=re(e,n),i=(await w.storage.local.get(r))[r]??null;return i?Date.now()-(i.lastActivityAt??0)>Le?(await w.storage.local.remove(r),null):i:null}async function ae(e,n){const r=re(e,n);await w.storage.local.remove(r)}async function Me(){const e=await w.storage.local.get(null),n=Date.now(),r=[];for(const[o,i]of Object.entries(e)){if(!o.startsWith(ct))continue;const a=i?.lastActivityAt??0;n-a>Le&&r.push(o)}r.length>0&&await w.storage.local.remove(r)}function pt(){Me(),oe&&window.clearInterval(oe),oe=window.setInterval(()=>{Me()},lt)}function ue(e,n,r){return e.state.userId?e.state.userId!==n?(console.log("The stored user earlier is different from the one logging in now."),!1):e.state.problemUrl===r:(console.log("There was no stored user in the browser."),!1)}async function P(e,n){if(!t.currentTutorSession||!t.currentTutorSession.userId||t.sessionRestorePending&&!n?.force)return;const r=e?.querySelector(".tutor-panel-content")??t.currentTutorSession.element?.querySelector(".tutor-panel-content"),o=re(t.currentTutorSession.userId,t.currentTutorSession.problem),i={state:{sessionId:t.currentTutorSession.sessionId,userId:t.currentTutorSession.userId,content:t.currentTutorSession.content,sessionTopicsInitialized:t.currentTutorSession.sessionTopicsInitialized,language:t.currentTutorSession.language,problem:t.currentTutorSession.problem,problemUrl:t.currentTutorSession.problemUrl,topics:t.currentTutorSession.topics,prompt:t.currentTutorSession.prompt,position:t.currentTutorSession.position,size:t.currentTutorSession.size,guideModeEnabled:t.currentTutorSession.guideModeEnabled,checkModeEnabled:t.currentTutorSession.checkModeEnabled,rollingStateGuideMode:t.currentTutorSession.rollingStateGuideMode,sessionRollingHistory:t.currentTutorSession.sessionRollingHistory},panelOpen:t.isWindowOpen,contentHtml:r?.innerHTML??"",contentScrollTop:r?.scrollTop??0,lastActivityAt:t.lastActivityAt};await w.storage.local.set({[o]:i})}function S(e){t.sessionRestorePending||t.persistTimerId||(t.persistTimerId=window.setTimeout(()=>{t.persistTimerId=null,P(e)},500))}function Ce(e,n){t.currentTutorSession={...n.state,element:e},t.currentTutorSession&&!t.currentTutorSession.language&&(t.currentTutorSession.language=C()),t.currentTutorSession&&t.currentTutorSession.sessionTopicsInitialized==null&&(t.currentTutorSession.sessionTopicsInitialized=!1);const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML=n.contentHtml||"",requestAnimationFrame(()=>{r.scrollTop=r.scrollHeight}));const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=t.currentTutorSession.prompt??""),t.currentTutorSession.position&&(e.style.left=`${t.currentTutorSession.position.x}px`,e.style.top=`${t.currentTutorSession.position.y}px`),t.currentTutorSession.size&&(e.style.width=`${t.currentTutorSession.size.width}px`,e.style.height=`${t.currentTutorSession.size.height}px`);const i=e.querySelectorAll(".guide-wrapper.guide-slab");if(i.length>0){const s=i[i.length-1],a=s.querySelectorAll(".guide-item");t.guideMessageCount=a.length,t.lastGuideMessageEl=s,t.guideActiveSlab=t.currentTutorSession?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");t.guideMessageCount=s.length,t.lastGuideMessageEl=s.length>0?s[s.length-1]:null,t.guideActiveSlab=null}}async function Pe(){const e=await ie();if(!e?.userId){t.pendingStoredSession=null;return}const n=await se(e.userId,O());if(!n){t.pendingStoredSession=null;return}if(!ue(n,e.userId,M(window.location.href))){await ae(e.userId,n.state.problem),t.pendingStoredSession=null;return}t.pendingStoredSession=n,t.lastActivityAt=n.lastActivityAt??Date.now()}function A(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $(e){const n=e.split("`"),r=o=>{const i=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,c;for(;(c=i.exec(o))!==null;){s+=A(o.slice(a,c.index));const u=c[1];u.startsWith("**")?s+=`<strong>${A(u.slice(2,-2))}</strong>`:s+=`<code>${A(u.slice(1,-1))}</code>`,a=i.lastIndex}return s+=A(o.slice(a)),s};return n.map((o,i)=>i%2===1?`<code>${A(o)}</code>`:r(o)).join("")}function gt(e){const n=e.replace(/\r\n/g,`
`).split(`
`);let r="",o=[],i=null;const s=()=>{o.length!==0&&(r+=`<p>${$(o.join(" "))}</p>`,o=[])},a=()=>{i&&(r+=`</${i}>`,i=null)};for(const c of n){const u=c.trim();if(!u){s(),a();continue}const l=u.match(/^(#{1,3})\s+(.*)$/);if(l){s(),a();const f=l[1].length;r+=`<h${f}>${$(l[2])}</h${f}>`;continue}const d=u.match(/^(\d+)[.)]\s+(.*)$/);if(d){s(),i&&i!=="ol"&&a(),i||(i="ol",r+="<ol>"),r+=`<li>${$(d[2])}</li>`;continue}const p=u.match(/^[-*]\s+(.*)$/);if(p){s(),i&&i!=="ul"&&a(),i||(i="ul",r+="<ul>"),r+=`<li>${$(p[1])}</li>`;continue}o.push(u)}return s(),a(),r}function Fe(e){const n=e.split(`
`),r=c=>/^\s*\|?[-:\s|]+\|?\s*$/.test(c),o=c=>(c.match(/\|/g)?.length??0)>=2;let i=!1;const s=[];let a=0;for(;a<n.length;){const c=n[a];if(c.trim().startsWith("```")){i=!i,s.push(c),a+=1;continue}if(i){s.push(c),a+=1;continue}if(o(c)||r(c)){const u=[];for(;a<n.length;){const l=n[a];if(l.trim().startsWith("```")||!(o(l)||r(l)))break;u.push(l),a+=1}u.length>0&&(s.push("```table"),s.push(...u),s.push("```"));continue}s.push(c),a+=1}return s.join(`
`)}function mt(e){const n=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!n)return Fe(e);const r=n[1].trim(),i=n[2].trim().split(";").map(c=>c.trim()).filter(Boolean);if(i.length===0)return e;const s=i.map(c=>`- ${c.replace(/\.$/,"")}`).join(`
`),a=`${r}

**To fix**
${s}`;return Fe(a)}function I(e){const n=e.replace(/\r\n/g,`
`),o=(n.match(/```/g)||[]).length%2===1?`${n}
\`\`\``:n,i=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,c;for(;(c=s.exec(o))!==null;)c.index>a&&i.push({type:"text",content:o.slice(a,c.index)}),i.push({type:"code",content:c[2]??"",lang:c[1]??""}),a=s.lastIndex;return a<o.length&&i.push({type:"text",content:o.slice(a)}),i.map(u=>{if(u.type==="code"){const l=u.lang?` data-lang="${A(u.lang)}"`:"";return`<pre${u.lang==="table"?' class="table-block"':""}><code${l}>${A(u.content.trimEnd())}</code></pre>`}return gt(u.content)}).join("")}const ft={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{De()}):De()}};function De(){console.log("The widget is being loaded to the page"),t.lastCanonicalProblemUrl=M(window.location.href),tt({appendToContentPanel:me,scheduleSessionPersist:S,syncSessionLanguageFromPage:k,handleBackendError:N}),st({appendToContentPanel:me,scheduleSessionPersist:S,syncSessionLanguageFromPage:k,handleBackendError:N}),ht(),Dt(),It(),Ft(),pt(),Pe().then(()=>{t.pendingStoredSession?.panelOpen&&de()}),window.addEventListener("beforeunload",()=>{P(t.currentTutorSession?.element??null)})}function ht(){const e=document.getElementById("tutor-widget");e&&e.remove(),t.widget=document.createElement("div"),t.widget.id="tutor-widget",t.widget.innerHTML=`
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

`,document.head.appendChild(n),document.body.appendChild(t.widget),bt()}function bt(){const e=document.getElementById("main-button");if(!e)return;let n=0,r={x:0,y:0},o=!1,i=!1;function s(l,d){if(!t.widget)return{x:l,y:d};const p={width:50,height:50},f=window.innerWidth,b=window.innerHeight,g=10;let h=Math.max(g,l);h=Math.min(f-p.width-g,h);let y=Math.max(g,d);return y=Math.min(b-p.height-g,y),{x:h,y}}function a(l,d){if(!t.widget)return{x:l,y:d};const p={width:50,height:50},f=window.innerWidth,b=window.innerHeight,g=20,h=l,y=f-(l+p.width),E=d,m=b-(d+p.height),x=Math.min(h,y,E,m);let T=l,v=d;return(l<0||l+p.width>f||d<0||d+p.height>b)&&(x===h?T=g:x===y?T=f-p.width-g:x===E?v=g:x===m&&(v=b-p.height-g)),{x:T,y:v}}e.addEventListener("mousedown",l=>{l.preventDefault(),n=Date.now(),r={x:l.clientX,y:l.clientY},o=!1;const d=t.widget.getBoundingClientRect();t.dragOffset.x=l.clientX-d.left,t.dragOffset.y=l.clientY-d.top,e.classList.add("dragging"),document.addEventListener("mousemove",c),document.addEventListener("mouseup",u)}),e.addEventListener("click",l=>{if(i){i=!1;return}!t.isDragging&&!o&&(l.preventDefault(),l.stopPropagation(),t.isWindowOpen?Oe():de())});function c(l){const d=Date.now()-n,p=Math.sqrt(Math.pow(l.clientX-r.x,2)+Math.pow(l.clientY-r.y,2));if(!t.isDragging&&(p>3||d>100)&&(t.isDragging=!0,o=!0,document.body.style.cursor="grabbing"),t.isDragging){const f=l.clientX-t.dragOffset.x,b=l.clientY-t.dragOffset.y,g=s(f,b);t.widget.style.transform=`translate(${g.x}px, ${g.y}px)`,t.widget.style.left="0",t.widget.style.top="0",t.lastPosition={x:g.x,y:g.y}}}function u(){if(document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",u),e&&e.classList.remove("dragging"),document.body.style.cursor="",t.isDragging){i=!0;const l=a(t.lastPosition.x,t.lastPosition.y);l.x!==t.lastPosition.x||l.y!==t.lastPosition.y?(t.widget.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",t.widget.style.left=l.x+"px",t.widget.style.top=l.y+"px",t.widget.style.transform="",setTimeout(()=>{t.widget&&(t.widget.style.transition="")},15e3),t.lastPosition=l):(t.widget.style.left=t.lastPosition.x+"px",t.widget.style.top=t.lastPosition.y+"px",t.widget.style.transform=""),$e()}t.isDragging=!1,o=!1}}function le(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}const St='#editor button[aria-haspopup="dialog"]';function k(){if(!t.currentTutorSession)return;const e=C();e&&t.currentTutorSession.language!==e&&(t.currentTutorSession.language=e,S(t.currentTutorSession.element??null))}function ce(){const e=document.querySelector(St);if(e){if(e.dataset.tutorLangListener||(e.dataset.tutorLangListener="true",e.addEventListener("click",()=>{window.setTimeout(k,50)},{passive:!0})),t.languageObserverTarget===e&&t.languageObserver){k();return}t.languageObserver?.disconnect(),t.languageObserverTarget=e,t.languageObserver=new MutationObserver(()=>{k()}),t.languageObserver.observe(e,{childList:!0,characterData:!0,subtree:!0}),k()}}function Be(e,n,r){const o=r??O(),i=crypto.randomUUID();return{element:e,sessionId:i,userId:n,problem:o,problemUrl:M(window.location.href),language:C(),topics:Ue(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function de(){const e=await ie(),n=dt(e),r=e?.userId??"";if(n&&await Ae(),t.currentTutorSession&&t.currentTutorSession.element&&document.body.contains(t.currentTutorSession.element)){ce(),k(),W(t.currentTutorSession.element),G(),t.isWindowOpen=!0,t.currentTutorSession.element;const i=t.currentTutorSession.element.querySelector(".tutor-panel-content");i&&requestAnimationFrame(()=>{i.scrollTop=i.scrollHeight}),!r||n?(F(t.currentTutorSession.element),z(t.currentTutorSession.element,n?"session expired, please log back in":void 0)):B(t.currentTutorSession),q(),S(t.currentTutorSession.element);return}if(t.currentTutorSession?.userId){Mt();try{await P(t.currentTutorSession.element??null,{force:!0})}finally{Ct()}}if(!t.pendingStoredSession&&r){const i=await se(r,O());i&&ue(i,r,M(window.location.href))&&(t.pendingStoredSession=i)}if(t.pendingStoredSession){const i=He();Ce(i,t.pendingStoredSession),t.pendingStoredSession=null,ce(),k(),W(i),G(),t.isWindowOpen=!0,q(),!r||n?(F(i),z(i,n?"session expired, please log back in":void 0)):t.currentTutorSession&&B(t.currentTutorSession),S(i);return}const o=He();if(!o){console.log("There was an error creating a panel");return}t.currentTutorSession=Be(o,r),ce(),k(),W(o),G(),t.isWindowOpen=!0,q(),S(o),t.currentTutorSession&&(!r||n?(F(o),z(o,n?"session expired, please log back in":void 0)):(t.currentTutorSession.userId=r,B(t.currentTutorSession)),setTimeout(()=>{const i=o.querySelector(".tutor-panel-prompt");i&&(i.focus(),i.setSelectionRange(i.value.length,i.value.length))},100))}async function wt(e){if(t.summarizeInFlight||e.toSummarize.length===0)return;const n=e.toSummarize.splice(0);t.summarizeInFlight=!0;try{const r=await Ye({sessionId:t.currentTutorSession?.sessionId??"",summarize:n,summary:e.summary});if(N(t.currentTutorSession?.element??null,r,{silent:!0}))return;const o=typeof r=="string"?r:r?.reply;typeof o=="string"&&(e.summary=o)}finally{t.summarizeInFlight=!1}}function pe(e){if(e.qaHistory.length<=40)return;const n=e.qaHistory.splice(0,20);e.toSummarize.push(...n),wt(e)}async function B(e){if(e.sessionTopicsInitialized||!e.userId)return;(await je({sessionId:e.sessionId,topics:e.topics}))?.success&&(e.sessionTopicsInitialized=!0,S(e.element??null))}const yt="http://localhost:3000/auth/bridge",xt=960*60*1e3,Tt=15e3;function vt(e,n,r){Z();const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML="");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=""),t.currentTutorSession=Be(e,n,r),t.currentTutorSession&&B(t.currentTutorSession)}function q(){t.lastActivityAt=Date.now(),Date.now()-t.lastActivityStoredAt>Tt&&(t.lastActivityStoredAt=Date.now(),S())}async function kt(){if(t.currentTutorSession?.element&&(await P(t.currentTutorSession.element,{force:!0}),t.sessionRestorePending=!0),await Ae(),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),t.currentTutorSession?.element){const e=t.currentTutorSession.element;ee(),e.classList.remove("guidemode-active","checkmode-active"),F(e),z(e,"session expired, please log back in")}}function It(){const e=()=>q(),n=["mousemove","keydown","click","scroll","input"];for(const r of n)document.addEventListener(r,e,{passive:!0});t.inactivityTimerId&&window.clearInterval(t.inactivityTimerId),t.inactivityTimerId=window.setInterval(async()=>{Date.now()-t.lastActivityAt<xt||!(await ie())?.userId||await kt()},6e4)}function Et(e){t.queue=[],t.flushInFlight=!1,Z(),ee(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(n=>{n.remove()}),t.currentTutorSession&&(t.currentTutorSession.guideModeEnabled=!1,t.currentTutorSession.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function F(e){e.classList.add("tutor-panel-locked"),U(e,!0)}function qe(e){e.classList.remove("tutor-panel-locked"),U(e,!1)}const Ne="session expired, please log back in";function Lt(e){return typeof e=="object"&&e!==null&&e.success===!1}function At(e){const n=e.querySelector(".tutor-panel-content");if(!n)return;n.querySelectorAll(".tutor-panel-message--assistant").forEach(o=>{o.textContent?.trim()===Ne&&o.remove()})}function ze(e,n){const r=e.querySelector(".tutor-panel-content");if(!r)return;const o=_(e,n,"assistant");o&&(r.scrollTop=o.offsetTop,S(e))}function N(e,n,r){if(!Lt(n))return!1;if(r?.silent)return!0;const o=e??t.currentTutorSession?.element??null;if(!o)return!0;if(n.unauthorized||n.status===401||n.status===403||n.error&&/unauthorized/i.test(n.error))return F(o),z(o,Ne),t.isWindowOpen||(W(o),G(),t.isWindowOpen=!0,q(),S(o)),At(o),!0;if(n.timeout)return ze(o,r?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const i=r?.serverMessage??"Internal server error. Please try again in a moment.";return r?.lockOnServerError===!0&&F(o),ze(o,i),!0}function Mt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function Ct(){document.getElementById("tutor-panel-loading")?.remove()}async function Pt(e){t.currentTutorSession?.userId&&t.currentTutorSession.element&&await P(t.currentTutorSession.element,{force:!0}),t.pendingStoredSession=null,Z();const n=t.isWindowOpen;t.currentTutorSession?.element&&t.currentTutorSession.element.remove(),t.currentTutorSession=null,t.isWindowOpen=!1,Re(),await Pe(),n&&de()}function Ft(){t.problemUrlWatcherId&&window.clearInterval(t.problemUrlWatcherId),t.problemUrlWatcherId=window.setInterval(()=>{const e=M(window.location.href);e!==t.lastCanonicalProblemUrl&&(t.lastCanonicalProblemUrl=e,Pt())},1e3)}function z(e,n){const r=e.querySelector(".tutor-panel-auth");if(r){if(n){const u=r.querySelector(".auth-error");u&&(u.textContent=n,u.style.display="block")}return}t.suspendPanelOps=!0,Et(e);const o=document.createElement("div");o.className="tutor-panel-auth",e.appendChild(o);const i=(u,l)=>{if(!u||!l)return;const d=()=>{const p=u.type==="password";l.setAttribute("aria-label",p?"Show password":"Hide password")};l.addEventListener("click",()=>{u.type=u.type==="password"?"text":"password",d(),u.focus(),u.setSelectionRange(u.value.length,u.value.length)}),d()},s=async u=>{const l=t.currentTutorSession?.userId??"",d=t.currentTutorSession?.problem??O();if(t.suspendPanelOps=!1,l&&l===u){t.sessionRestorePending=!1,qe(e),o.remove(),S(e);return}l&&l!==u&&(await P(e,{force:!0}),vt(e,u,d));const p=await se(u,d);p&&ue(p,u,M(window.location.href))?(Ce(e,p),await ae(u,p.state.problem),t.pendingStoredSession=null):p&&await ae(u,p.state.problem),t.currentTutorSession&&(t.currentTutorSession.userId=u,B(t.currentTutorSession)),t.sessionRestorePending=!1,qe(e),o.remove(),S(e)},a=u=>{o.innerHTML=`
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
    `;const l=o.querySelector(".auth-email"),d=o.querySelector(".auth-password"),p=o.querySelector(".auth-login"),f=o.querySelector(".auth-signup"),b=o.querySelector(".auth-password-toggle"),g=o.querySelector(".auth-error");u&&g&&(g.textContent=u,g.style.display="block");const h=()=>{g&&(g.style.display="none")};l?.addEventListener("input",h),d?.addEventListener("input",h),i(d,b),p?.addEventListener("click",async()=>{const y=l?.value.trim()??"",E=d?.value.trim()??"";if(!y||!E)return;const m=await Je({email:y,password:E});if(m?.success===!1){g&&(g.textContent=m.error||"Internal server error",g.style.display="block");return}m?.userId&&m?.jwt?await s(m.userId):g&&(g.textContent="Invalid creds",g.style.display="block")}),f?.addEventListener("click",()=>{c()})},c=()=>{o.innerHTML=`
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
    `;const u=o.querySelector(".auth-first-name"),l=o.querySelector(".auth-last-name"),d=o.querySelector(".auth-email"),p=o.querySelector(".auth-password"),f=o.querySelector(".auth-signup-submit"),b=o.querySelector(".auth-password-toggle"),g=o.querySelector(".auth-error"),h=o.querySelector(".auth-password-hint"),y=()=>{g&&(g.style.display="none")};u?.addEventListener("input",y),l?.addEventListener("input",y),d?.addEventListener("input",y),p?.addEventListener("input",y),i(p,b),p?.addEventListener("blur",()=>{if(!h||!p)return;const m=p.value.trim();m&&!le(m)?(h.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",h.style.display="block"):h.style.display="none"}),p?.addEventListener("input",()=>{if(!h||!p)return;const m=p.value.trim();m&&le(m)&&(h.style.display="none")}),f?.addEventListener("click",async()=>{const m=u?.value.trim()??"",x=l?.value.trim()??"",T=d?.value.trim()??"",v=p?.value.trim()??"";if(!m||!x||!T||!v)return;if(!le(v)){h&&(h.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",h.style.display="block");return}const L=await et({fname:m,lname:x,email:T,password:v});if(L?.success===!1){g&&(g.textContent=L.error||"Internal server error",g.style.display="block");return}L?.requiresVerification?a("Waiting for verification, check email"):L?.userId&&L?.jwt?await s(L.userId):g&&(g.style.display="block")}),o.querySelector(".auth-back")?.addEventListener("click",()=>{a()})};a(n)}function He(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const n=40,r=Math.round(window.innerHeight*.38),o=window.innerWidth-e.offsetWidth-20,i=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(n,o))}px`,e.style.top=`${Math.max(20,Math.min(r,i))}px`,setTimeout(()=>e.classList.add("open"),10),Ht(e),e}function Oe(){t.currentTutorSession?.element&&(Nt(t.currentTutorSession.element),zt(t.currentTutorSession.element),Re(),t.isWindowOpen=!1,S(t.currentTutorSession.element))}function _t(e){}function G(){t.widget&&(t.widget.style.display="none")}function Re(){t.widget&&(t.widget.style.display="block")}async function $e(){}async function Dt(){}function Ut(){}function Bt(e){const n=e.querySelector(".tutor-panel-content");if(!n)return null;const r=document.createElement("div");r.className="tutor-panel-assistant-loading";const o=document.createElement("div");return o.className="tutor-panel-assistant-loading-dot",r.appendChild(o),n.appendChild(r),n.scrollTop=r.offsetTop,r}async function qt(e,n){const r=Bt(e),o=t.currentTutorSession?.language||C(),i=await Qe({sessionId:t.currentTutorSession?.sessionId??"",action:"ask-anything",rollingHistory:t.currentTutorSession?.sessionRollingHistory.qaHistory,summary:t.currentTutorSession?.sessionRollingHistory.summary??"",query:n,language:o});if(N(e,i,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return r?.remove(),"Failure";const s=typeof i=="string"?i:i?.reply;return typeof s=="string"&&s.trim()&&(r?.remove(),me(e,"","assistant",s)),r?.remove(),s||"Failure"}function W(e){t.panelHideTimerId!==null&&(window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Nt(e){e.classList.remove("open"),e.classList.add("closing"),t.panelHideTimerId!==null&&window.clearTimeout(t.panelHideTimerId),t.panelHideTimerId=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),t.panelHideTimerId=null},180)}function zt(e){if(!t.widget)return;const n=e.getBoundingClientRect(),r=t.widget.getBoundingClientRect(),o=r.width||50,i=r.height||50,c=n.left+n.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,u=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));t.widget.style.left=`${c}px`,t.widget.style.top=`${u}px`,t.widget.style.right="auto",t.widget.style.bottom="auto",t.widget.style.transform="",t.lastPosition={x:c,y:u},$e()}function _(e,n,r){const o=e.querySelector(".tutor-panel-content");if(!o)return null;const i=document.createElement("div");if(r==="assistant")i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n);else if(r==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=n;else if(r==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n),s.appendChild(i),o.appendChild(s),s}else if(r==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${r}`,i.innerHTML=I(n),s.appendChild(i),o.appendChild(s),s}else i.textContent=n;return o.append(i),o.scrollTop=i.offsetTop,i}function Ge(e,n){const r=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=e.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function U(e,n){const r=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const o of r){const i=e.querySelector(o);if(i){if(i instanceof HTMLButtonElement){i.disabled=n;continue}if(i instanceof HTMLTextAreaElement){i.disabled=n;continue}i.setAttribute("aria-disabled",n?"true":"false")}}}function ge(e,n,r,o){return new Promise(i=>{let s=0;const a=2,c=e.offsetTop;n.scrollTop=c;let u=!0;const l=()=>{Math.abs(n.scrollTop-c)>8&&(u=!1)};n.addEventListener("scroll",l,{passive:!0});const d=()=>{s=Math.min(r.length,s+a);const p=r.slice(0,s);o?.render?e.innerHTML=o.render(p):e.textContent=p,u&&(n.scrollTop=c),s<r.length?window.setTimeout(d,12):(n.removeEventListener("scroll",l),i())};d()})}async function me(e,n,r,o){const i=mt(o),s=e.querySelector(".tutor-panel-content");if(s&&typeof o=="string"){if(r==="assistant"){const a=_(e,"","assistant");if(!a)return;await ge(a,s,i,{render:I}),a.innerHTML=I(i),t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Assitant: ${o}`),t.currentTutorSession&&pe(t.currentTutorSession.sessionRollingHistory),s.scrollTop=a.offsetTop,S(e)}else if(r==="guideAssistant"){let a=t.guideActiveSlab&&s.contains(t.guideActiveSlab)?t.guideActiveSlab:null;if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const l=document.createElement("ul");l.className="guide-list",a.appendChild(l),s.appendChild(a),t.guideActiveSlab=a}const c=a.querySelector(".guide-list")??document.createElement("ul");c.classList.contains("guide-list")||(c.className="guide-list",a.appendChild(c));const u=document.createElement("li");u.className="guide-item",c.appendChild(u),t.guideMessageCount===0&&a.classList.add("guide-start"),t.guideMessageCount+=1,t.lastGuideMessageEl=a,await ge(u,s,i,{render:I}),u.innerHTML=I(i),s.scrollTop=a.offsetTop,S(e)}else if(r==="checkAssistant"){const a=_(e,"","checkAssistant");if(!a)return;const c=a.querySelector(".tutor-panel-message--checkAssistant");if(!c)return;a.classList.add("check-start"),await ge(c,s,i,{render:I}),c.innerHTML=I(i),a.classList.add("check-end"),s.scrollTop=a.offsetTop,t.currentTutorSession?.sessionRollingHistory.qaHistory.push(`Check: ${o}`),t.currentTutorSession&&pe(t.currentTutorSession.sessionRollingHistory),S(e)}}}function Ht(e){const n=e.querySelector(".tutor-panel-close"),r=e.querySelector(".btn-help-mode"),o=e.querySelector(".btn-guide-mode"),i=e.querySelector(".btn-gotToWorkspace");o?.addEventListener("click",()=>{if(!t.currentTutorSession)return;t.currentTutorSession.guideModeEnabled=!t.currentTutorSession.guideModeEnabled;const m=e.querySelector(".btn-guide-mode");if(t.currentTutorSession.userId){const x=t.currentTutorSession.problem,T=we(x);Ve({enabled:t.currentTutorSession.guideModeEnabled,sessionId:t.currentTutorSession.sessionId,problem_no:T,problem_name:x,problem_url:t.currentTutorSession.problemUrl})}Ge(e,!0),e.classList.add("guidemode-active"),t.currentTutorSession.guideModeEnabled?(m?.classList.add("is-loading"),t.guideMessageCount=0,t.lastGuideMessageEl=null,t.guideActiveSlab=null,Ie()):(ee(),t.lastGuideMessageEl&&t.lastGuideMessageEl.classList.add("guide-end"),Ge(e,!1),e.classList.remove("guidemode-active"),m?.classList.remove("is-loading")),S(e)}),i?.addEventListener("click",async()=>{const m=await Ze({url:yt});N(e,m,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const s=e.querySelector(".tutor-panel-prompt"),a=e.querySelector(".tutor-panel-send");s?.addEventListener("keydown",async m=>{m.key!=="Enter"||m.shiftKey||(m.preventDefault(),a?.click())}),a?.addEventListener("click",async()=>{if(k(),t.currentTutorSession?.prompt){const m=t.currentTutorSession.prompt;s&&(s.value=""),t.currentTutorSession&&(t.currentTutorSession.prompt=""),_(e,m,"user"),t.currentTutorSession.sessionRollingHistory.qaHistory.push(`user: ${m}`),pe(t.currentTutorSession.sessionRollingHistory),S(e),await qt(e,m),t.currentTutorSession.prompt="",S(e)}else return void 0}),n?.addEventListener("mousedown",m=>{m.stopPropagation()}),n?.addEventListener("click",async()=>Oe()),r?.addEventListener("click",async()=>{const m=e.querySelector(".btn-help-mode");let x="";t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!0,m?.classList.add("is-loading")),U(e,!0),e.classList.add("checkmode-active");try{const T=await ye();T?.ok&&typeof T.code=="string"&&t.currentTutorSession&&(x=T.code);const v=await ut(e,x);console.log("this is the response: ",v)}catch{}finally{t.currentTutorSession&&(t.currentTutorSession.checkModeEnabled=!1,m?.classList.remove("is-loading")),U(e,!1),e.classList.remove("checkmode-active"),S(e)}}),s?.addEventListener("input",()=>{t.currentTutorSession&&(t.currentTutorSession.prompt=s.value),S(e)});let c=!1,u=0,l=0,d=0,p=0,f=null;const b=.6,g=e.querySelector(".tutor-panel-shellbar"),h=()=>{if(!c){f=null;return}const m=e.offsetLeft,x=e.offsetTop,T=m+(d-m)*b,v=x+(p-x)*b;e.style.left=`${T}px`,e.style.top=`${v}px`,f=requestAnimationFrame(h)},y=m=>{if(!c)return;const x=m.clientX-u,T=m.clientY-l,v=window.innerWidth-e.offsetWidth,L=window.innerHeight-e.offsetHeight;d=Math.max(10,Math.min(x,v)),p=Math.max(10,Math.min(T,L)),f===null&&(f=requestAnimationFrame(h))},E=()=>{c&&(c=!1,document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",E),f!==null&&(cancelAnimationFrame(f),f=null),e.style.left=`${d}px`,e.style.top=`${p}px`,t.currentTutorSession&&(t.currentTutorSession.position={x:e.offsetLeft,y:e.offsetTop}),S(e))};g?.addEventListener("mousedown",m=>{m.preventDefault(),c=!0,u=m.clientX-e.getBoundingClientRect().left,l=m.clientY-e.getBoundingClientRect().top,d=e.offsetLeft,p=e.offsetTop,document.addEventListener("mousemove",y),document.addEventListener("mouseup",E)})}function Y(e,...n){}const Ot={debug:(...e)=>Y(console.debug,...e),log:(...e)=>Y(console.log,...e),warn:(...e)=>Y(console.warn,...e),error:(...e)=>Y(console.error,...e)};class fe extends Event{constructor(n,r){super(fe.EVENT_NAME,{}),this.newUrl=n,this.oldUrl=r}static EVENT_NAME=he("wxt:locationchange")}function he(e){return`${w?.runtime?.id}:content:${e}`}function Rt(e){let n,r;return{run(){n==null&&(r=new URL(location.href),n=e.setInterval(()=>{let o=new URL(location.href);o.href!==r.href&&(window.dispatchEvent(new fe(o,r)),r=o)},1e3))}}}class j{constructor(n,r){this.contentScriptName=n,this.options=r,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=he("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Rt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(n){return this.abortController.abort(n)}get isInvalid(){return w.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(n){return this.signal.addEventListener("abort",n),()=>this.signal.removeEventListener("abort",n)}block(){return new Promise(()=>{})}setInterval(n,r){const o=setInterval(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(n,r){const o=setTimeout(()=>{this.isValid&&n()},r);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(n){const r=requestAnimationFrame((...o)=>{this.isValid&&n(...o)});return this.onInvalidated(()=>cancelAnimationFrame(r)),r}requestIdleCallback(n,r){const o=requestIdleCallback((...i)=>{this.signal.aborted||n(...i)},r);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(n,r,o,i){r==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),n.addEventListener?.(r.startsWith("wxt:")?he(r):r,o,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Ot.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:j.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(n){const r=n.data?.type===j.SCRIPT_STARTED_MESSAGE_TYPE,o=n.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(n.data?.messageId);return r&&o&&i}listenForNewerScripts(n){let r=!0;const o=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=r;if(r=!1,s&&n?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function Yt(){}function X(e,...n){}const $t={debug:(...e)=>X(console.debug,...e),log:(...e)=>X(console.log,...e),warn:(...e)=>X(console.warn,...e),error:(...e)=>X(console.error,...e)};return(async()=>{try{const{main:e,...n}=ft,r=new j("content",n);return await e(r)}catch(e){throw $t.error('The content script "content" crashed on startup!',e),e}})()})();
content;