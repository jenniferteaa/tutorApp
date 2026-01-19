var content=(function(){"use strict";function be(e){return e}const x=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,K={matches:["<all_urls>"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{$()}):$()}};let r=null,E=!1,I=!1,T={x:0,y:0},f={x:0,y:0},Y,q,W=[];function $(){console.log("The widget is being loaded to the page"),Z(),ie()}function Z(){const e=document.getElementById("tutor-widget");e&&e.remove(),r=document.createElement("div"),r.id="tutor-widget";let t;try{t=x.runtime.getURL("logo.png"),Y=t}catch(a){console.warn("There is an error loading the logo: ",a),t=`chrome-extension://${x.runtime.id||chrome.runtime.id}/logo.png`,Y=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",x.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),r.innerHTML=`
  <div class="widget-main-button" id="main-button">
  <img src="${t}" alt="Widget" style="width: 24px; height: 24px;" id="logo-image">
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
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      position: relative;
    }
      .widget-main-button.dragging {
      cursor: grabbing !important;
      transform: scale(0.95);
      box-shadow: 
        0 8px 30px rgba(153, 41, 234, 0.7),
        0 0 25px rgba(153, 41, 234, 0.9),
        0 0 50px rgba(204, 102, 218, 0.7),
        0 0 80px rgba(204, 102, 218, 0.5);
      animation: none;
    }
      
    /* =========================
   PANEL - Better Layout
   ========================= */

.tutor-panel{
  position: fixed;
  width: 320px;
  height: 260px;

  /* Sticky note look */
  background: rgba(255, 251, 147, 0.98);
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.10);

/*  box-shadow:
    0 14px 30px rgba(0,0,0,0.18),
    0 2px 6px rgba(0,0,0,0.10); */

  z-index: 999997;
  font-family: 'Segoe UI', system-ui, sans-serif;

  transform: scale(0.9) rotate(0deg);
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

.tutor-panel.open {
  opacity: 1;
  transform: scale(0.9) rotate(0deg);
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

  background: rgba(239, 230, 188, 0.75);
  border-bottom: 1px solid rgba(0,0,0,0.10);
}

/* Close button */
.tutor-panel-close{
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;

  background: rgba(231, 218, 225, 0.45);
  color: rgba(0,0,0,0.85);
  font-size: 18px;
  line-height: 1;

  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 120ms ease, background 120ms ease;
}
.tutor-panel-close:hover{
  transform: scale(1.06);
  background: rgba(237, 107, 172, 0.55);
}

/* Actions row */
.tutor-panel-actions{
  display: flex;
  align-items: center;
  gap: 8px;

  /* IMPORTANT: don’t let this become a giant green slab */
  background: transparent;
  padding: 0;
  margin: 0;
}

/* Buttons */
.btn-guide-mode,
.btn-help-mode,
.btn-timer{
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(229, 233, 226, 0.92);
  color: rgba(0,0,0,0.85);

  padding: 6px 10px;
  border-radius: 4px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
}
.btn-guide-mode:hover,
.btn-help-mode:hover,
.btn-timer:hover{
  transform: translateY(-1px);
  filter: brightness(0.98);
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-timer:active{
  transform: translateY(0px);
}

/* Content area */
.tutor-panel-content{
  flex: 1;                 /* takes remaining space */
  padding: 12px;
  overflow: auto;

  background: rgba(255, 255, 255, 0.35);
}

/* Input bar pinned at bottom */
.tutor-panel-inputbar{
  display: flex;
  align-items: flex-end;
  gap: 10px;

  padding: 10px;

  background: rgba(228, 235, 192, 0.92);
  border-top: 1px solid rgba(0,0,0,0.10);
}

/* Textarea */
.tutor-panel-prompt{
  flex: 1;
  min-height: 44px;
  max-height: 110px;
  resize: none;

  padding: 10px 12px;

  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.14);
  outline: none;

  background: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  line-height: 1;
}
.tutor-panel-prompt:focus{
  border-color: rgba(0,0,0,0.22);
  box-shadow: 0 0 0 3px rgba(146, 229, 83, 0.25);
}

/* Send */
.tutor-panel-send{
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(4, 5, 4, 0.92);
  color: rgba(255, 255, 255, 0.85);

  border-radius: 4px;
  padding: 10px 14px;

  font-weight: 800;
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease;
  white-space: nowrap;
}
.tutor-panel-send:hover{
  transform: translateY(-1px);
  filter: brightness(0.98);
}
.tutor-panel-send:active{
  transform: translateY(0px);
}`,document.head.appendChild(n),document.body.appendChild(r);const o=document.getElementById("logo-image");o&&(o.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),o.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),o.style.display="none"})),ee()}function ee(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},o=!1,a=!1;function l(s,d){if(!r)return{x:s,y:d};const p={width:50,height:50},h=window.innerWidth,c=window.innerHeight,u=10;let w=Math.max(u,s);w=Math.min(h-p.width-u,w);let y=Math.max(u,d);return y=Math.min(c-p.height-u,y),{x:w,y}}function b(s,d){if(!r)return{x:s,y:d};const p={width:50,height:50},h=window.innerWidth,c=window.innerHeight,u=20,w=s,y=h-(s+p.width),N=d,P=c-(d+p.height),M=Math.min(w,y,N,P);let D=s,G=d;return(s<0||s+p.width>h||d<0||d+p.height>c)&&(M===w?D=u:M===y?D=h-p.width-u:M===N?G=u:M===P&&(G=c-p.height-u)),{x:D,y:G}}e.addEventListener("mousedown",s=>{s.preventDefault(),t=Date.now(),n={x:s.clientX,y:s.clientY},o=!1;const d=r.getBoundingClientRect();T.x=s.clientX-d.left,T.y=s.clientY-d.top,e.classList.add("dragging"),document.addEventListener("mousemove",g),document.addEventListener("mouseup",m)}),e.addEventListener("click",s=>{if(a){a=!1;return}!E&&!o&&(s.preventDefault(),s.stopPropagation(),I?H():te())});function g(s){const d=Date.now()-t,p=Math.sqrt(Math.pow(s.clientX-n.x,2)+Math.pow(s.clientY-n.y,2));if(!E&&(p>3||d>100)&&(E=!0,o=!0,document.body.style.cursor="grabbing"),E){const h=s.clientX-T.x,c=s.clientY-T.y,u=l(h,c);r.style.transform=`translate(${u.x}px, ${u.y}px)`,r.style.left="0",r.style.top="0",f={x:u.x,y:u.y}}}function m(){if(document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",m),e&&e.classList.remove("dragging"),document.body.style.cursor="",E){a=!0;const s=b(f.x,f.y);s.x!==f.x||s.y!==f.y?(r.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",r.style.left=s.x+"px",r.style.top=s.y+"px",r.style.transform="",setTimeout(()=>{r&&(r.style.transition="")},15e3),f=s):(r.style.left=f.x+"px",r.style.top=f.y+"px",r.style.transform=""),z()}E=!1,o=!1}}function te(){if(i&&i.element&&document.body.contains(i.element)){Q(i.element),X(),I=!0,i.element;return}const e=ne();if(!e){console.log("There was an error creating a panel");return}const t=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(t).map(l=>l.getAttribute("href")).filter(l=>!!l).map(l=>l.replace("/tag/","").replace("/","").replace("-","_")),o=Object.fromEntries(Array.from(new Set(n)).map(l=>[l,[]])),a=crypto.randomUUID();i={element:e,sessionId:a,problem:"",topics:o,content:"",prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:"",topics:{},approach:"",decisions:[],pitfallsFlagged:[],lastEdit:"",nudges:[],thoughts_to_remember:[]},sessionRollingHistory:{qaHistory:[],summary:""}},Q(e),X(),I=!0,setTimeout(()=>{const l=e.querySelector(".tutor-panel-prompt");l&&(l.focus(),l.setSelectionRange(l.value.length,l.value.length))},100)}let i=null;function ne(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
    <div class="tutor-panel-topbar">
      <button class="tutor-panel-close">×</button>
      <div class="tutor-panel-actions">
        <button class="btn-guide-mode">Guide me</button>
        <button class="btn-help-mode">Check mode</button>
        <button class="btn-timer">Timer</button>
      </div>
    </div>

    <div class="tutor-panel-content"></div>

    <div class="tutor-panel-inputbar">
      <textarea class="tutor-panel-prompt" placeholder="Ask anything"></textarea>
      <button class="tutor-panel-send">Enter</button>
    </div>
  `,e.style.position="fixed",e.style.zIndex="1000000",document.body.appendChild(e);const t=document.getElementById("tutor-widget");if(t){const n=t.getBoundingClientRect();e.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",e.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else e.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",e.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>e.classList.add("open"),10),pe(e),e}function H(){i?.element&&(ce(i.element),ue(i.element),oe(),I=!1)}function we(e){}function X(){r&&(r.style.display="none")}function oe(){r&&(r.style.display="block")}async function z(){}async function ie(){}let S=null,v=new Set,U=0,F=!1;function L(){return document.querySelector(".monaco-editor textarea.inputarea")}function se(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function R(){v.clear(),S!==null&&(window.clearTimeout(S),S=null)}async function O(e){const t=J();L();const n=Array.from(v)[0]??1;if(!n){R();return}if(!t){R();return}let o="";t&&(o=re(t,n)),W.push([t,o]),ae(),R()}function re(e,t){return e.split(`
`)[t-1]??""}async function ae(){if(!F){F=!0;try{for(;W.length>0;){const[e,t]=W.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),q=!0;const n=await x.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:e,focusLine:t,rollingStateGuideMode:i?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const o=n.success?n.reply:null;o?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const a=o?.nudge;typeof a=="string"&&a.trim().length>0&&i?.rollingStateGuideMode.nudges.push(a.trim());const l=o?.state_update?.decisions;typeof l=="string"&&l.trim().length>0&&i?.rollingStateGuideMode.decisions.push(l.trim());const b=o?.state_update?.pitfallsFlagged;typeof b=="string"&&b.trim().length>0&&i?.rollingStateGuideMode.pitfallsFlagged.push(b.trim());const g=o?.thoughts_to_remember;if(typeof g=="string"&&g.trim().length>0&&i?.rollingStateGuideMode.thoughts_to_remember.push(g.trim()),o?.topics&&typeof o.topics=="object")for(const[m,s]of Object.entries(o.topics)){const d=Array.isArray(s)?s:typeof s=="string"&&s.trim()?[s.trim()]:[];d.length!==0&&i&&(i.rollingStateGuideMode.topics[m]??=[],i.rollingStateGuideMode.topics[m].push(...d))}console.log(i),q=!1}}}finally{F=!1}}}function V(){if(!i?.guideModeEnabled)return;const e=L();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=se(t,n);!v.has(o)&&v.size==0&&v.add(o),S!==null&&window.clearTimeout(S),S=window.setTimeout(()=>{O()},1e4),!v.has(o)&&v.size==1&&O()}function j(){const e=L();if(!e){U<5&&(U+=1,window.setTimeout(j,500));return}e.addEventListener("input",V)}function le(){const e=L();e&&e.removeEventListener("input",V)}function ye(){}async function de(e,t){console.log("this is the query asked: ",t);const n=await x.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",query:t,action:"ask-anything"}});return console.log("this is the response: ",n),n||"Failure"}function Q(e){e.style.display="flex",e.classList.add("open")}function ce(e){e.classList.remove("open"),e.style.display="none"}function ue(e){if(!r)return;const t=e.getBoundingClientRect(),n=r.getBoundingClientRect(),o=n.width||50,a=n.height||50,g=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,m=Math.max(10,Math.min(window.innerHeight/2-a/2,window.innerHeight-a-10));r.style.left=`${g}px`,r.style.top=`${m}px`,r.style.right="auto",r.style.bottom="auto",r.style.transform="",f={x:g,y:m},z()}function J(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}async function ge(e,t){console.log("this is the code written so far: ",t);const n=await x.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",code:t,action:"check-code"}});return console.log("this is the respnse: ",n),n||"Failure"}function pe(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode");e.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{i&&(i.guideModeEnabled=!i.guideModeEnabled,i.guideModeEnabled?j():le())});const a=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const c=i.prompt;await de(e,c),i.prompt=""}else return void 0});const b=e.querySelector(".tutor-panel-content");t?.addEventListener("click",async()=>H()),n?.addEventListener("click",async()=>{const c=J(),u=await ge(e,c);console.log("this is the response: ",u)}),a?.addEventListener("input",()=>{i&&(i.prompt=a.value)}),b&&i?.content&&(b.innerHTML=i.content);let g=!1,m=0,s=0;const d=e.querySelector(".tutor-panel-topbar"),p=c=>{if(!g)return;const u=c.clientX-m,w=c.clientY-s,y=window.innerWidth-e.offsetWidth,N=window.innerHeight-e.offsetHeight,P=Math.max(10,Math.min(u,y)),M=Math.max(10,Math.min(w,N));e.style.left=`${P}px`,e.style.top=`${M}px`},h=()=>{g&&(g=!1,document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",h),i&&(i.position={x:e.offsetLeft,y:e.offsetTop}))};d?.addEventListener("mousedown",c=>{c.preventDefault(),g=!0,m=c.clientX-e.getBoundingClientRect().left,s=c.clientY-e.getBoundingClientRect().top,document.addEventListener("mousemove",p),document.addEventListener("mouseup",h)})}function k(e,...t){}const me={debug:(...e)=>k(console.debug,...e),log:(...e)=>k(console.log,...e),warn:(...e)=>k(console.warn,...e),error:(...e)=>k(console.error,...e)};class B extends Event{constructor(t,n){super(B.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=_("wxt:locationchange")}function _(e){return`${x?.runtime?.id}:content:${e}`}function he(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new B(o,n)),n=o)},1e3))}}}class A{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=_("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=he(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return x.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const o=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(t,n){const o=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(t){const n=requestAnimationFrame((...o)=>{this.isValid&&t(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const o=requestIdleCallback((...a)=>{this.signal.aborted||t(...a)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(t,n,o,a){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?_(n):n,o,{...a,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),me.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:A.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===A.SCRIPT_STARTED_MESSAGE_TYPE,o=t.data?.contentScriptName===this.contentScriptName,a=!this.receivedMessageIds.has(t.data?.messageId);return n&&o&&a}listenForNewerScripts(t){let n=!0;const o=a=>{if(this.verifyScriptStartedEvent(a)){this.receivedMessageIds.add(a.data.messageId);const l=n;if(n=!1,l&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function ve(){}function C(e,...t){}const fe={debug:(...e)=>C(console.debug,...e),log:(...e)=>C(console.log,...e),warn:(...e)=>C(console.warn,...e),error:(...e)=>C(console.error,...e)};return(async()=>{try{const{main:e,...t}=K,n=new A("content",t);return await e(n)}catch(e){throw fe.error('The content script "content" crashed on startup!',e),e}})()})();
content;