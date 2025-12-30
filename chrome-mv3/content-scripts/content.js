var content=(function(){"use strict";function et(t){return t}const w=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,q={matches:["<all_urls>"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{R()}):R()}};let r=null,y=!1,E=!1,S={x:0,y:0},g={x:0,y:0},N;function R(){console.log("The widget is being loaded to the page"),X(),_()}function X(){const t=document.getElementById("tutor-widget");t&&t.remove(),r=document.createElement("div"),r.id="tutor-widget";let e;try{e=w.runtime.getURL("logo.png"),N=e}catch(s){console.warn("There is an error loading the logo: ",s),e=`chrome-extension://${w.runtime.id||chrome.runtime.id}/logo.png`,N=e}console.log("StickyNoteAI: Image URLs:",{logo:e}),console.log("StickyNoteAI: Extension ID:",w.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),r.innerHTML=`
  <div class="widget-main-button" id="main-button">
  <img src="${e}" alt="Widget" style="width: 24px; height: 24px;" id="logo-image">
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
}`,document.head.appendChild(n),document.body.appendChild(r);const o=document.getElementById("logo-image");o&&(o.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),o.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",e),o.style.display="none"})),H()}function H(){const t=document.getElementById("main-button");if(!t)return;let e=0,n={x:0,y:0},o=!1,s=!1;function u(i,l){if(!r)return{x:i,y:l};const a={width:50,height:50},p=window.innerWidth,m=window.innerHeight,d=10;let f=Math.max(d,i);f=Math.min(p-a.width-d,f);let b=Math.max(d,l);return b=Math.min(m-a.height-d,b),{x:f,y:b}}function v(i,l){if(!r)return{x:i,y:l};const a={width:50,height:50},p=window.innerWidth,m=window.innerHeight,d=20,f=i,b=p-(i+a.width),L=l,$=m-(l+a.height),k=Math.min(f,b,L,$);let W=i,A=l;return(i<0||i+a.width>p||l<0||l+a.height>m)&&(k===f?W=d:k===b?W=p-a.width-d:k===L?A=d:k===$&&(A=m-a.height-d)),{x:W,y:A}}t.addEventListener("mousedown",i=>{i.preventDefault(),e=Date.now(),n={x:i.clientX,y:i.clientY},o=!1;const l=r.getBoundingClientRect();S.x=i.clientX-l.left,S.y=i.clientY-l.top,t.classList.add("dragging"),document.addEventListener("mousemove",h),document.addEventListener("mouseup",x)}),t.addEventListener("click",i=>{if(s){s=!1;return}!y&&!o&&(i.preventDefault(),i.stopPropagation(),E?Y():z())});function h(i){const l=Date.now()-e,a=Math.sqrt(Math.pow(i.clientX-n.x,2)+Math.pow(i.clientY-n.y,2));if(!y&&(a>3||l>100)&&(y=!0,o=!0,document.body.style.cursor="grabbing"),y){const p=i.clientX-S.x,m=i.clientY-S.y,d=u(p,m);r.style.transform=`translate(${d.x}px, ${d.y}px)`,r.style.left="0",r.style.top="0",g={x:d.x,y:d.y}}}function x(){if(document.removeEventListener("mousemove",h),document.removeEventListener("mouseup",x),t&&t.classList.remove("dragging"),document.body.style.cursor="",y){s=!0;const i=v(g.x,g.y);i.x!==g.x||i.y!==g.y?(r.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",r.style.left=i.x+"px",r.style.top=i.y+"px",r.style.transform="",setTimeout(()=>{r&&(r.style.transition="")},15e3),g=i):(r.style.left=g.x+"px",r.style.top=g.y+"px",r.style.transform=""),F()}y=!1,o=!1}}function z(){if(c&&c.element&&document.body.contains(c.element)){B(c.element),D(),E=!0,c.element;return}const t=U();if(!t){console.log("There was an error creating a panel");return}c={element:t,content:"",prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1},B(t),D(),E=!0,setTimeout(()=>{const e=t.querySelector(".tutor-panel-prompt");e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},100)}let c=null;function U(){document.getElementById("tutor-panel")?.remove();const t=document.createElement("div");t.id="tutor-panel",t.classList.add("tutor-panel"),t.innerHTML=`
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
  `,t.style.position="fixed",t.style.zIndex="1000000",document.body.appendChild(t);const e=document.getElementById("tutor-widget");if(e){const n=e.getBoundingClientRect();t.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",t.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else t.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",t.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>t.classList.add("open"),10),K(t),t}function Y(){c?.element&&(V(c.element),G(c.element),O(),E=!1)}function ot(t){}function D(){r&&(r.style.display="none")}function O(){r&&(r.style.display="block")}async function F(){}async function _(){}function B(t){t.style.display="flex",t.classList.add("open")}function V(t){t.classList.remove("open"),t.style.display="none"}function G(t){if(!r)return;const e=t.getBoundingClientRect(),n=r.getBoundingClientRect(),o=n.width||50,s=n.height||50,h=e.left+e.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,x=Math.max(10,Math.min(window.innerHeight/2-s/2,window.innerHeight-s-10));r.style.left=`${h}px`,r.style.top=`${x}px`,r.style.right="auto",r.style.bottom="auto",r.style.transform="",g={x:h,y:x},F()}function j(){const t=document.querySelector(".monaco-editor textarea.inputarea");if(t&&t.value.trim().length>0)return t.value;const e=document.querySelector(".monaco-editor .view-lines");if(e){const n=Array.from(e.querySelectorAll(".view-line")).map(o=>o.innerText.replace(/\u00a0/g," ")).join(`
`);if(n.trim().length>0)return n}return""}async function J(t,e){console.log("this is the written code: ",e);const n=await w.runtime.sendMessage({action:"check-code",payload:{code:e,action:"check-code"}});return console.log("this is the respnse: ",n),n||"Failure"}function K(t){const e=t.querySelector(".tutor-panel-close"),n=t.querySelector(".btn-help-mode");t.querySelector(".btn-guide-mode");const o=t.querySelector(".tutor-panel-prompt"),s=t.querySelector(".tutor-panel-content");e?.addEventListener("click",()=>Y()),n?.addEventListener("click",async()=>{const a=j();await J(t,a)}),o?.addEventListener("input",()=>{c&&(c.prompt=o.value)}),s&&c?.content&&(s.innerHTML=c.content);let u=!1,v=0,h=0;const x=t.querySelector(".tutor-panel-topbar"),i=a=>{if(!u)return;const p=a.clientX-v,m=a.clientY-h,d=window.innerWidth-t.offsetWidth,f=window.innerHeight-t.offsetHeight,b=Math.max(10,Math.min(p,d)),L=Math.max(10,Math.min(m,f));t.style.left=`${b}px`,t.style.top=`${L}px`},l=()=>{u&&(u=!1,document.removeEventListener("mousemove",i),document.removeEventListener("mouseup",l),c&&(c.position={x:t.offsetLeft,y:t.offsetTop}))};x?.addEventListener("mousedown",a=>{a.preventDefault(),u=!0,v=a.clientX-t.getBoundingClientRect().left,h=a.clientY-t.getBoundingClientRect().top,document.addEventListener("mousemove",i),document.addEventListener("mouseup",l)})}function T(t,...e){}const Q={debug:(...t)=>T(console.debug,...t),log:(...t)=>T(console.log,...t),warn:(...t)=>T(console.warn,...t),error:(...t)=>T(console.error,...t)};class C extends Event{constructor(e,n){super(C.EVENT_NAME,{}),this.newUrl=e,this.oldUrl=n}static EVENT_NAME=P("wxt:locationchange")}function P(t){return`${w?.runtime?.id}:content:${t}`}function Z(t){let e,n;return{run(){e==null&&(n=new URL(location.href),e=t.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new C(o,n)),n=o)},1e3))}}}class I{constructor(e,n){this.contentScriptName=e,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=P("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Z(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return w.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener("abort",e),()=>this.signal.removeEventListener("abort",e)}block(){return new Promise(()=>{})}setInterval(e,n){const o=setInterval(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(e,n){const o=setTimeout(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(e){const n=requestAnimationFrame((...o)=>{this.isValid&&e(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(e,n){const o=requestIdleCallback((...s)=>{this.signal.aborted||e(...s)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(e,n,o,s){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(n.startsWith("wxt:")?P(n):n,o,{...s,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Q.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:I.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(e){const n=e.data?.type===I.SCRIPT_STARTED_MESSAGE_TYPE,o=e.data?.contentScriptName===this.contentScriptName,s=!this.receivedMessageIds.has(e.data?.messageId);return n&&o&&s}listenForNewerScripts(e){let n=!0;const o=s=>{if(this.verifyScriptStartedEvent(s)){this.receivedMessageIds.add(s.data.messageId);const u=n;if(n=!1,u&&e?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function it(){}function M(t,...e){}const tt={debug:(...t)=>M(console.debug,...t),log:(...t)=>M(console.log,...t),warn:(...t)=>M(console.warn,...t),error:(...t)=>M(console.error,...t)};return(async()=>{try{const{main:t,...e}=q,n=new I("content",e);return await t(n)}catch(t){throw tt.error('The content script "content" crashed on startup!',t),t}})()})();
content;