var content=(function(){"use strict";function bt(t){return t}const x=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,K={matches:["<all_urls>"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{G()}):G()}};let r=null,E=!1,T=!1,M={x:0,y:0},b={x:0,y:0},_,$,W=[];function G(){console.log("The widget is being loaded to the page"),Z(),it()}function Z(){const t=document.getElementById("tutor-widget");t&&t.remove(),r=document.createElement("div"),r.id="tutor-widget";let e;try{e=x.runtime.getURL("logo.png"),_=e}catch(a){console.warn("There is an error loading the logo: ",a),e=`chrome-extension://${x.runtime.id||chrome.runtime.id}/logo.png`,_=e}console.log("StickyNoteAI: Image URLs:",{logo:e}),console.log("StickyNoteAI: Extension ID:",x.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),r.innerHTML=`
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
}`,document.head.appendChild(n),document.body.appendChild(r);const o=document.getElementById("logo-image");o&&(o.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),o.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",e),o.style.display="none"})),tt()}function tt(){const t=document.getElementById("main-button");if(!t)return;let e=0,n={x:0,y:0},o=!1,a=!1;function h(s,d){if(!r)return{x:s,y:d};const g={width:50,height:50},f=window.innerWidth,c=window.innerHeight,u=10;let w=Math.max(u,s);w=Math.min(f-g.width-u,w);let y=Math.max(u,d);return y=Math.min(c-g.height-u,y),{x:w,y}}function l(s,d){if(!r)return{x:s,y:d};const g={width:50,height:50},f=window.innerWidth,c=window.innerHeight,u=20,w=s,y=f-(s+g.width),N=d,P=c-(d+g.height),I=Math.min(w,y,N,P);let q=s,Y=d;return(s<0||s+g.width>f||d<0||d+g.height>c)&&(I===w?q=u:I===y?q=f-g.width-u:I===N?Y=u:I===P&&(Y=c-g.height-u)),{x:q,y:Y}}t.addEventListener("mousedown",s=>{s.preventDefault(),e=Date.now(),n={x:s.clientX,y:s.clientY},o=!1;const d=r.getBoundingClientRect();M.x=s.clientX-d.left,M.y=s.clientY-d.top,t.classList.add("dragging"),document.addEventListener("mousemove",p),document.addEventListener("mouseup",m)}),t.addEventListener("click",s=>{if(a){a=!1;return}!E&&!o&&(s.preventDefault(),s.stopPropagation(),T?H():et())});function p(s){const d=Date.now()-e,g=Math.sqrt(Math.pow(s.clientX-n.x,2)+Math.pow(s.clientY-n.y,2));if(!E&&(g>3||d>100)&&(E=!0,o=!0,document.body.style.cursor="grabbing"),E){const f=s.clientX-M.x,c=s.clientY-M.y,u=h(f,c);r.style.transform=`translate(${u.x}px, ${u.y}px)`,r.style.left="0",r.style.top="0",b={x:u.x,y:u.y}}}function m(){if(document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",m),t&&t.classList.remove("dragging"),document.body.style.cursor="",E){a=!0;const s=l(b.x,b.y);s.x!==b.x||s.y!==b.y?(r.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",r.style.left=s.x+"px",r.style.top=s.y+"px",r.style.transform="",setTimeout(()=>{r&&(r.style.transition="")},15e3),b=s):(r.style.left=b.x+"px",r.style.top=b.y+"px",r.style.transform=""),z()}E=!1,o=!1}}function et(){if(i&&i.element&&document.body.contains(i.element)){Q(i.element),X(),T=!0,i.element;return}const t=nt();if(!t){console.log("There was an error creating a panel");return}const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(l=>l.getAttribute("href")).filter(l=>!!l).map(l=>l.replace("/tag/","").replace("/","").replace("-","_"));Object.fromEntries(Array.from(new Set(n)).map(l=>[l,[]]));const o=Object.fromEntries(Array.from(new Set(n)).map(l=>[l,{thoughts_to_remember:[],pitfalls:[]}])),a=document.querySelector("div.text-title-large a")?.textContent?.trim()??"";console.log(a);const h=crypto.randomUUID();i={element:t,sessionId:h,problem:a,topics:o,content:"",prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:a,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:""}},Q(t),X(),T=!0,setTimeout(()=>{const l=t.querySelector(".tutor-panel-prompt");l&&(l.focus(),l.setSelectionRange(l.value.length,l.value.length))},100)}let i=null;function nt(){document.getElementById("tutor-panel")?.remove();const t=document.createElement("div");t.id="tutor-panel",t.classList.add("tutor-panel"),t.innerHTML=`
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
  `,t.style.position="fixed",t.style.zIndex="1000000",document.body.appendChild(t);const e=document.getElementById("tutor-widget");if(e){const n=e.getBoundingClientRect();t.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",t.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else t.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",t.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>t.classList.add("open"),10),pt(t),t}function H(){i?.element&&(ct(i.element),ut(i.element),ot(),T=!1)}function wt(t){}function X(){r&&(r.style.display="none")}function ot(){r&&(r.style.display="block")}async function z(){}async function it(){}let S=null,v=new Set,U=0,R=!1;function L(){return document.querySelector(".monaco-editor textarea.inputarea")}function st(t,e){return t.slice(0,Math.max(0,e)).split(`
`).length}function F(){v.clear(),S!==null&&(window.clearTimeout(S),S=null)}async function O(t){const e=J();L();const n=Array.from(v)[0]??1;if(!n){F();return}if(!e){F();return}let o="";e&&(o=rt(e,n)),W.push([e,o]),at(),F()}function rt(t,e){return t.split(`
`)[e-1]??""}async function at(){if(!R){R=!0;try{for(;W.length>0;){const[t,e]=W.shift();console.log("This is the focus line: ",e),console.log("the code so far: ",t),$=!0;const n=await x.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:t,focusLine:e,rollingStateGuideMode:i?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{console.log("This is the response from the LLM: ",n);const o=n.success?n.reply:null;o?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const a=o?.nudge;typeof a=="string"&&a.trim().length>0&&i?.rollingStateGuideMode.nudges.push(a.trim());const h=o?.topics;if(h&&typeof h=="object")for(const[l,p]of Object.entries(h)){if(!p||typeof p!="object")continue;const m=p.thoughts_to_remember,s=p.pitfalls,d=Array.isArray(m)?m:typeof m=="string"&&m.trim()?[m.trim()]:[],g=Array.isArray(s)?s:typeof s=="string"&&s.trim()?[s.trim()]:[];i&&(i.topics[l]??={thoughts_to_remember:[],pitfalls:[]},d.length>0&&i.topics[l].thoughts_to_remember.push(...d),g.length>0&&i.topics[l].pitfalls.push(...g))}console.log(i),$=!1}}}finally{R=!1}}}function V(){if(!i?.guideModeEnabled)return;const t=L();if(!t)return;const e=t.value??"",n=t.selectionStart??0,o=st(e,n);!v.has(o)&&v.size==0&&v.add(o),S!==null&&window.clearTimeout(S),S=window.setTimeout(()=>{O()},1e4),!v.has(o)&&v.size==1&&O()}function j(){const t=L();if(!t){U<5&&(U+=1,window.setTimeout(j,500));return}t.addEventListener("input",V)}function lt(){const t=L();t&&t.removeEventListener("input",V)}function yt(){}async function dt(t,e){console.log("this is the query asked: ",e);const n=await x.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",query:e,action:"ask-anything"}});return console.log("this is the response: ",n),n||"Failure"}function Q(t){t.style.display="flex",t.classList.add("open")}function ct(t){t.classList.remove("open"),t.style.display="none"}function ut(t){if(!r)return;const e=t.getBoundingClientRect(),n=r.getBoundingClientRect(),o=n.width||50,a=n.height||50,p=e.left+e.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,m=Math.max(10,Math.min(window.innerHeight/2-a/2,window.innerHeight-a-10));r.style.left=`${p}px`,r.style.top=`${m}px`,r.style.right="auto",r.style.bottom="auto",r.style.transform="",b={x:p,y:m},z()}function J(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}async function gt(t,e){console.log("this is the code written so far: ",e);const n=await x.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:e,action:"check-code"}});return console.log("this is the respnse: ",n),n||"Failure"}function pt(t){const e=t.querySelector(".tutor-panel-close"),n=t.querySelector(".btn-help-mode");t.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{i&&(i.guideModeEnabled=!i.guideModeEnabled,i.guideModeEnabled?j():lt())});const a=t.querySelector(".tutor-panel-prompt");t.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const c=i.prompt;await dt(t,c),i.prompt=""}else return void 0});const l=t.querySelector(".tutor-panel-content");e?.addEventListener("click",async()=>H()),n?.addEventListener("click",async()=>{const c=J(),u=await gt(t,c);console.log("this is the response: ",u)}),a?.addEventListener("input",()=>{i&&(i.prompt=a.value)}),l&&i?.content&&(l.innerHTML=i.content);let p=!1,m=0,s=0;const d=t.querySelector(".tutor-panel-topbar"),g=c=>{if(!p)return;const u=c.clientX-m,w=c.clientY-s,y=window.innerWidth-t.offsetWidth,N=window.innerHeight-t.offsetHeight,P=Math.max(10,Math.min(u,y)),I=Math.max(10,Math.min(w,N));t.style.left=`${P}px`,t.style.top=`${I}px`},f=()=>{p&&(p=!1,document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",f),i&&(i.position={x:t.offsetLeft,y:t.offsetTop}))};d?.addEventListener("mousedown",c=>{c.preventDefault(),p=!0,m=c.clientX-t.getBoundingClientRect().left,s=c.clientY-t.getBoundingClientRect().top,document.addEventListener("mousemove",g),document.addEventListener("mouseup",f)})}function k(t,...e){}const mt={debug:(...t)=>k(console.debug,...t),log:(...t)=>k(console.log,...t),warn:(...t)=>k(console.warn,...t),error:(...t)=>k(console.error,...t)};class B extends Event{constructor(e,n){super(B.EVENT_NAME,{}),this.newUrl=e,this.oldUrl=n}static EVENT_NAME=D("wxt:locationchange")}function D(t){return`${x?.runtime?.id}:content:${t}`}function ht(t){let e,n;return{run(){e==null&&(n=new URL(location.href),e=t.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new B(o,n)),n=o)},1e3))}}}class A{constructor(e,n){this.contentScriptName=e,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=D("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=ht(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return x.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener("abort",e),()=>this.signal.removeEventListener("abort",e)}block(){return new Promise(()=>{})}setInterval(e,n){const o=setInterval(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(e,n){const o=setTimeout(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(e){const n=requestAnimationFrame((...o)=>{this.isValid&&e(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(e,n){const o=requestIdleCallback((...a)=>{this.signal.aborted||e(...a)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(e,n,o,a){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(n.startsWith("wxt:")?D(n):n,o,{...a,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),mt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:A.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(e){const n=e.data?.type===A.SCRIPT_STARTED_MESSAGE_TYPE,o=e.data?.contentScriptName===this.contentScriptName,a=!this.receivedMessageIds.has(e.data?.messageId);return n&&o&&a}listenForNewerScripts(e){let n=!0;const o=a=>{if(this.verifyScriptStartedEvent(a)){this.receivedMessageIds.add(a.data.messageId);const h=n;if(n=!1,h&&e?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function vt(){}function C(t,...e){}const ft={debug:(...t)=>C(console.debug,...t),log:(...t)=>C(console.log,...t),warn:(...t)=>C(console.warn,...t),error:(...t)=>C(console.error,...t)};return(async()=>{try{const{main:t,...e}=K,n=new A("content",e);return await t(n)}catch(t){throw ft.error('The content script "content" crashed on startup!',t),t}})()})();
content;