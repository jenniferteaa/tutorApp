var content=(function(){"use strict";function be(e){return e}const h=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,K={matches:["<all_urls>"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{z()}):z()}};let r=null,y=!1,I=!1,M={x:0,y:0},m={x:0,y:0},$,X,W=[];function z(){console.log("The widget is being loaded to the page"),Z(),ie()}function Z(){const e=document.getElementById("tutor-widget");e&&e.remove(),r=document.createElement("div"),r.id="tutor-widget";let t;try{t=h.runtime.getURL("logo.png"),$=t}catch(a){console.warn("There is an error loading the logo: ",a),t=`chrome-extension://${h.runtime.id||chrome.runtime.id}/logo.png`,$=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",h.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),r.innerHTML=`
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
}`,document.head.appendChild(n),document.body.appendChild(r);const o=document.getElementById("logo-image");o&&(o.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),o.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),o.style.display="none"})),ee()}function ee(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},o=!1,a=!1;function E(i,c){if(!r)return{x:i,y:c};const u={width:50,height:50},p=window.innerWidth,l=window.innerHeight,d=10;let b=Math.max(d,i);b=Math.min(p-u.width-d,b);let x=Math.max(d,c);return x=Math.min(l-u.height-d,x),{x:b,y:x}}function S(i,c){if(!r)return{x:i,y:c};const u={width:50,height:50},p=window.innerWidth,l=window.innerHeight,d=20,b=i,x=p-(i+u.width),N=c,P=l-(c+u.height),T=Math.min(b,x,N,P);let Y=i,q=c;return(i<0||i+u.width>p||c<0||c+u.height>l)&&(T===b?Y=d:T===x?Y=p-u.width-d:T===N?q=d:T===P&&(q=l-u.height-d)),{x:Y,y:q}}e.addEventListener("mousedown",i=>{i.preventDefault(),t=Date.now(),n={x:i.clientX,y:i.clientY},o=!1;const c=r.getBoundingClientRect();M.x=i.clientX-c.left,M.y=i.clientY-c.top,e.classList.add("dragging"),document.addEventListener("mousemove",g),document.addEventListener("mouseup",f)}),e.addEventListener("click",i=>{if(a){a=!1;return}!y&&!o&&(i.preventDefault(),i.stopPropagation(),I?H():te())});function g(i){const c=Date.now()-t,u=Math.sqrt(Math.pow(i.clientX-n.x,2)+Math.pow(i.clientY-n.y,2));if(!y&&(u>3||c>100)&&(y=!0,o=!0,document.body.style.cursor="grabbing"),y){const p=i.clientX-M.x,l=i.clientY-M.y,d=E(p,l);r.style.transform=`translate(${d.x}px, ${d.y}px)`,r.style.left="0",r.style.top="0",m={x:d.x,y:d.y}}}function f(){if(document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",f),e&&e.classList.remove("dragging"),document.body.style.cursor="",y){a=!0;const i=S(m.x,m.y);i.x!==m.x||i.y!==m.y?(r.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",r.style.left=i.x+"px",r.style.top=i.y+"px",r.style.transform="",setTimeout(()=>{r&&(r.style.transition="")},15e3),m=i):(r.style.left=m.x+"px",r.style.top=m.y+"px",r.style.transform=""),G()}y=!1,o=!1}}function te(){if(s&&s.element&&document.body.contains(s.element)){j(s.element),U(),I=!0,s.element;return}const e=ne();if(!e){console.log("There was an error creating a panel");return}s={element:e,content:"",prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1},j(e),U(),I=!0,setTimeout(()=>{const t=e.querySelector(".tutor-panel-prompt");t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length))},100)}let s=null;function ne(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",document.body.appendChild(e);const t=document.getElementById("tutor-widget");if(t){const n=t.getBoundingClientRect();e.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",e.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else e.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",e.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>e.classList.add("open"),10),pe(e),e}function H(){s?.element&&(ce(s.element),ue(s.element),oe(),I=!1)}function we(e){}function U(){r&&(r.style.display="none")}function oe(){r&&(r.style.display="block")}async function G(){}async function ie(){}let v=null,w=new Set,O=0,B=!1;function L(){return document.querySelector(".monaco-editor textarea.inputarea")}function re(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function F(){w.clear(),v!==null&&(window.clearTimeout(v),v=null)}async function _(e){const t=J();L();const n=Array.from(w)[0]??1;if(!n){F();return}if(!t){F();return}let o="";t&&(o=se(t,n)),console.log("Being pushed into the queue: ",o),W.push([t,o]),ae(),F()}function se(e,t){return e.split(`
`)[t-1]??""}async function ae(){if(!B){B=!0;try{for(;W.length>0;){const[e,t]=W.shift();console.log("This is the focus line: ",t),X=!0;const n=await h.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",code:e,focusLine:t}});n?console.log("this is the reponse: ",n):console.log("failure for guide mode"),X=!1}}finally{B=!1}}}function V(){if(!s?.guideModeEnabled)return;const e=L();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=re(t,n);!w.has(o)&&w.size==0&&w.add(o),v!==null&&window.clearTimeout(v),v=window.setTimeout(()=>{_()},1e4),!w.has(o)&&w.size==1&&_()}function Q(){const e=L();if(!e){O<5&&(O+=1,window.setTimeout(Q,500));return}e.addEventListener("input",V)}function le(){const e=L();e&&e.removeEventListener("input",V)}function ye(){}async function de(e,t){console.log("this is the query asked: ",t);const n=await h.runtime.sendMessage({action:"ask-anything",payload:{query:t,action:"ask-anything"}});return console.log("this is the response: ",n),n||"Failure"}function j(e){e.style.display="flex",e.classList.add("open")}function ce(e){e.classList.remove("open"),e.style.display="none"}function ue(e){if(!r)return;const t=e.getBoundingClientRect(),n=r.getBoundingClientRect(),o=n.width||50,a=n.height||50,g=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,f=Math.max(10,Math.min(window.innerHeight/2-a/2,window.innerHeight-a-10));r.style.left=`${g}px`,r.style.top=`${f}px`,r.style.right="auto",r.style.bottom="auto",r.style.transform="",m={x:g,y:f},G()}function J(){return document.querySelector(".monaco-editor textarea.inputarea")?.value}async function ge(e,t){console.log("this is the code written so far: ",t);const n=await h.runtime.sendMessage({action:"check-code",payload:{code:t,action:"check-code"}});return n||"Failure"}function pe(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode");e.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{s&&(s.guideModeEnabled=!s.guideModeEnabled,s.guideModeEnabled?Q():le())});const a=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(s?.prompt){const l=s.prompt;await de(e,l),s.prompt=""}else return void 0});const S=e.querySelector(".tutor-panel-content");t?.addEventListener("click",async()=>H()),n?.addEventListener("click",async()=>{const l=J(),d=await ge(e,l);console.log("this is the response: ",d)}),a?.addEventListener("input",()=>{s&&(s.prompt=a.value)}),S&&s?.content&&(S.innerHTML=s.content);let g=!1,f=0,i=0;const c=e.querySelector(".tutor-panel-topbar"),u=l=>{if(!g)return;const d=l.clientX-f,b=l.clientY-i,x=window.innerWidth-e.offsetWidth,N=window.innerHeight-e.offsetHeight,P=Math.max(10,Math.min(d,x)),T=Math.max(10,Math.min(b,N));e.style.left=`${P}px`,e.style.top=`${T}px`},p=()=>{g&&(g=!1,document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",p),s&&(s.position={x:e.offsetLeft,y:e.offsetTop}))};c?.addEventListener("mousedown",l=>{l.preventDefault(),g=!0,f=l.clientX-e.getBoundingClientRect().left,i=l.clientY-e.getBoundingClientRect().top,document.addEventListener("mousemove",u),document.addEventListener("mouseup",p)})}function k(e,...t){}const me={debug:(...e)=>k(console.debug,...e),log:(...e)=>k(console.log,...e),warn:(...e)=>k(console.warn,...e),error:(...e)=>k(console.error,...e)};class R extends Event{constructor(t,n){super(R.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=D("wxt:locationchange")}function D(e){return`${h?.runtime?.id}:content:${e}`}function he(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new R(o,n)),n=o)},1e3))}}}class C{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=D("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=he(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return h.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const o=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(t,n){const o=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(t){const n=requestAnimationFrame((...o)=>{this.isValid&&t(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const o=requestIdleCallback((...a)=>{this.signal.aborted||t(...a)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(t,n,o,a){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?D(n):n,o,{...a,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),me.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:C.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===C.SCRIPT_STARTED_MESSAGE_TYPE,o=t.data?.contentScriptName===this.contentScriptName,a=!this.receivedMessageIds.has(t.data?.messageId);return n&&o&&a}listenForNewerScripts(t){let n=!0;const o=a=>{if(this.verifyScriptStartedEvent(a)){this.receivedMessageIds.add(a.data.messageId);const E=n;if(n=!1,E&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function ve(){}function A(e,...t){}const fe={debug:(...e)=>A(console.debug,...e),log:(...e)=>A(console.log,...e),warn:(...e)=>A(console.warn,...e),error:(...e)=>A(console.error,...e)};return(async()=>{try{const{main:e,...t}=K,n=new C("content",t);return await e(n)}catch(e){throw fe.error('The content script "content" crashed on startup!',e),e}})()})();
content;