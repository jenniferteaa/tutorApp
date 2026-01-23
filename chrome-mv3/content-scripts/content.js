var content=(function(){"use strict";function St(t){return t}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,it={matches:["<all_urls>"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{H()}):H()}};let l=null,E=!1,T=!1,L={x:0,y:0},y={x:0,y:0},$,z,B=[];function H(){console.log("The widget is being loaded to the page"),rt(),dt()}function rt(){const t=document.getElementById("tutor-widget");t&&t.remove(),l=document.createElement("div"),l.id="tutor-widget";let e;try{e=b.runtime.getURL("logo.png"),$=e}catch(r){console.warn("There is an error loading the logo: ",r),e=`chrome-extension://${b.runtime.id||chrome.runtime.id}/logo.png`,$=e}console.log("StickyNoteAI: Image URLs:",{logo:e}),console.log("StickyNoteAI: Extension ID:",b.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),l.innerHTML=`
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
}`,document.head.appendChild(n),document.body.appendChild(l);const o=document.getElementById("logo-image");o&&(o.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),o.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",e),o.style.display="none"})),st()}function st(){const t=document.getElementById("main-button");if(!t)return;let e=0,n={x:0,y:0},o=!1,r=!1;function u(s,p){if(!l)return{x:s,y:p};const f={width:50,height:50},x=window.innerWidth,g=window.innerHeight,m=10;let h=Math.max(m,s);h=Math.min(x-f.width-m,h);let v=Math.max(m,p);return v=Math.min(g-f.height-m,v),{x:h,y:v}}function a(s,p){if(!l)return{x:s,y:p};const f={width:50,height:50},x=window.innerWidth,g=window.innerHeight,m=20,h=s,v=x-(s+f.width),P=p,W=g-(p+f.height),M=Math.min(h,v,P,W);let O=s,Y=p;return(s<0||s+f.width>x||p<0||p+f.height>g)&&(M===h?O=m:M===v?O=x-f.width-m:M===P?Y=m:M===W&&(Y=g-f.height-m)),{x:O,y:Y}}t.addEventListener("mousedown",s=>{s.preventDefault(),e=Date.now(),n={x:s.clientX,y:s.clientY},o=!1;const p=l.getBoundingClientRect();L.x=s.clientX-p.left,L.y=s.clientY-p.top,t.classList.add("dragging"),document.addEventListener("mousemove",c),document.addEventListener("mouseup",d)}),t.addEventListener("click",s=>{if(r){r=!1;return}!E&&!o&&(s.preventDefault(),s.stopPropagation(),T?X():at())});function c(s){const p=Date.now()-e,f=Math.sqrt(Math.pow(s.clientX-n.x,2)+Math.pow(s.clientY-n.y,2));if(!E&&(f>3||p>100)&&(E=!0,o=!0,document.body.style.cursor="grabbing"),E){const x=s.clientX-L.x,g=s.clientY-L.y,m=u(x,g);l.style.transform=`translate(${m.x}px, ${m.y}px)`,l.style.left="0",l.style.top="0",y={x:m.x,y:m.y}}}function d(){if(document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",d),t&&t.classList.remove("dragging"),document.body.style.cursor="",E){r=!0;const s=a(y.x,y.y);s.x!==y.x||s.y!==y.y?(l.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",l.style.left=s.x+"px",l.style.top=s.y+"px",l.style.transform="",setTimeout(()=>{l&&(l.style.transition="")},15e3),y=s):(l.style.left=y.x+"px",l.style.top=y.y+"px",l.style.transform=""),V()}E=!1,o=!1}}function at(){if(i&&i.element&&document.body.contains(i.element)){ot(i.element),U(),T=!0,i.element;return}const t=lt();if(!t){console.log("There was an error creating a panel");return}const e=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(e).map(a=>a.getAttribute("href")).filter(a=>!!a).map(a=>a.replace("/tag/","").replace("/","").replace("-","_"));Object.fromEntries(Array.from(new Set(n)).map(a=>[a,[]]));const o=Object.fromEntries(Array.from(new Set(n)).map(a=>[a,{thoughts_to_remember:[],pitfalls:[]}])),r=document.querySelector("div.text-title-large a")?.textContent?.trim()??"";console.log(r);const u=crypto.randomUUID();i={element:t,sessionId:u,problem:r,topics:o,content:"",prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:""}},ot(t),U(),T=!0,setTimeout(()=>{const a=t.querySelector(".tutor-panel-prompt");a&&(a.focus(),a.setSelectionRange(a.value.length,a.value.length))},100)}let i=null;function lt(){document.getElementById("tutor-panel")?.remove();const t=document.createElement("div");t.id="tutor-panel",t.classList.add("tutor-panel"),t.innerHTML=`
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
  `,t.style.position="fixed",t.style.zIndex="1000000",document.body.appendChild(t);const e=document.getElementById("tutor-widget");if(e){const n=e.getBoundingClientRect();t.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",t.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else t.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",t.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>t.classList.add("open"),10),yt(t),t}function X(){i?.element&&(ft(i.element),ht(i.element),ct(),T=!1)}function It(t){}function U(){l&&(l.style.display="none")}function ct(){l&&(l.style.display="block")}async function V(){}async function dt(){}let S=null,A=!1,w=new Set,j=0,D=!1,k=null,Q=null,J=0;function I(){return document.querySelector(".monaco-editor textarea.inputarea")}function K(t,e){return t.slice(0,Math.max(0,e)).split(`
`).length}function C(){w.clear(),A=!1,S!==null&&(window.clearTimeout(S),S=null)}async function R(t){const e=bt(),o=I()?.value??"",r=Array.from(w)[0]??1;if(!r){C();return}const u=Date.now();if(Q===r&&u-J<250)return;if(Q=r,J=u,!e){C();return}let a="";if(o&&(a=Z(o,r)),!a.trim()&&r>1&&o){const d=Z(o,r-1);d.trim()&&(a=d)}let c=e;try{const d=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});d?.ok&&typeof d.code=="string"&&(c=d.code)}catch{}ut(a)&&(B.push([c,a]),pt()),C()}function ut(t){const e=t.trim();return e?/[;}]\s*$/.test(e)?!0:e==="else"||e==="if"||e==="while"||/^else\b/.test(e)&&/\{\s*$/.test(e)?!1:e.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Z(t,e){return t.split(`
`)[e-1]??""}async function pt(){if(!D){D=!0;try{for(;B.length>0;){const[t,e]=B.shift();console.log("This is the focus line: ",e),console.log("the code so far: ",t),z=!0;const n=await b.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:t,focusLine:e,rollingStateGuideMode:i?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const o=n.success?n.reply:null;o?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const r=o?.nudge;typeof r=="string"&&r.trim().length>0&&i?.rollingStateGuideMode.nudges.push(r.trim());const u=o?.topics;if(u&&typeof u=="object")for(const[a,c]of Object.entries(u)){if(!c||typeof c!="object")continue;const d=c.thoughts_to_remember,s=c.pitfalls,p=Array.isArray(d)?d:typeof d=="string"&&d.trim()?[d.trim()]:[],f=Array.isArray(s)?s:typeof s=="string"&&s.trim()?[s.trim()]:[];i&&(i.topics[a]??={thoughts_to_remember:[],pitfalls:[]},p.length>0&&i.topics[a].thoughts_to_remember.push(...p),f.length>0&&i.topics[a].pitfalls.push(...f))}z=!1}}}finally{D=!1}}}function tt(t){if(!i?.guideModeEnabled)return;const e=I();if(!e)return;const n=e.value??"",o=e.selectionStart??0,r=K(n,o);!w.has(r)&&w.size==0&&w.add(r),A||(A=!0),S!==null&&window.clearTimeout(S),S=window.setTimeout(()=>{R()},1e4),!w.has(r)&&w.size==1&&R()}function et(){if(!i?.guideModeEnabled||!A)return;const t=I();if(!t)return;const e=t.value??"",n=t.selectionStart??0,o=K(e,n);if(k===null){k=o;return}o!==k&&(k=o,!w.has(o)&&w.size==1&&R())}function nt(){const t=I();if(!t){j<5&&(j+=1,window.setTimeout(nt,500));return}t.addEventListener("input",tt),document.addEventListener("selectionchange",et)}function gt(){const t=I();t&&(t.removeEventListener("input",tt),document.removeEventListener("selectionchange",et))}function Tt(){}async function mt(t,e){console.log("this is the query asked: ",e);const n=await b.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",query:e,action:"ask-anything"}});return console.log("this is the response: ",n),n||"Failure"}function ot(t){t.style.display="flex",t.classList.add("open")}function ft(t){t.classList.remove("open"),t.style.display="none"}function ht(t){if(!l)return;const e=t.getBoundingClientRect(),n=l.getBoundingClientRect(),o=n.width||50,r=n.height||50,c=e.left+e.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,d=Math.max(10,Math.min(window.innerHeight/2-r/2,window.innerHeight-r-10));l.style.left=`${c}px`,l.style.top=`${d}px`,l.style.right="auto",l.style.bottom="auto",l.style.transform="",y={x:c,y:d},V()}function bt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}async function xt(t,e){try{const n=await b.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:e,action:"check-code"}}),o=n?.topics;if(o&&typeof o=="object")for(const[r,u]of Object.entries(o)){if(!u||typeof u!="object")continue;const a=u.thoughts_to_remember,c=u.pitfalls,d=Array.isArray(a)?a:typeof a=="string"&&a.trim()?[a.trim()]:[],s=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];i&&(i.topics[r]??={thoughts_to_remember:[],pitfalls:[]},d.length>0&&i.topics[r].thoughts_to_remember.push(...d),s.length>0&&i.topics[r].pitfalls.push(...s))}return console.log("this is the object now: ",i?.topics),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function yt(t){const e=t.querySelector(".tutor-panel-close"),n=t.querySelector(".btn-help-mode");t.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{i&&(i.guideModeEnabled=!i.guideModeEnabled,i.guideModeEnabled?nt():gt())});const r=t.querySelector(".tutor-panel-prompt");t.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const g=i.prompt;await mt(t,g),i.prompt=""}else return void 0});const a=t.querySelector(".tutor-panel-content");e?.addEventListener("click",async()=>X()),n?.addEventListener("click",async()=>{let g="";try{const h=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});h?.ok&&typeof h.code=="string"&&(g=h.code)}catch{}const m=await xt(t,g);console.log("this is the response: ",m)}),r?.addEventListener("input",()=>{i&&(i.prompt=r.value)}),a&&i?.content&&(a.innerHTML=i.content);let c=!1,d=0,s=0;const p=t.querySelector(".tutor-panel-topbar"),f=g=>{if(!c)return;const m=g.clientX-d,h=g.clientY-s,v=window.innerWidth-t.offsetWidth,P=window.innerHeight-t.offsetHeight,W=Math.max(10,Math.min(m,v)),M=Math.max(10,Math.min(h,P));t.style.left=`${W}px`,t.style.top=`${M}px`},x=()=>{c&&(c=!1,document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",x),i&&(i.position={x:t.offsetLeft,y:t.offsetTop}))};p?.addEventListener("mousedown",g=>{g.preventDefault(),c=!0,d=g.clientX-t.getBoundingClientRect().left,s=g.clientY-t.getBoundingClientRect().top,document.addEventListener("mousemove",f),document.addEventListener("mouseup",x)})}function N(t,...e){}const wt={debug:(...t)=>N(console.debug,...t),log:(...t)=>N(console.log,...t),warn:(...t)=>N(console.warn,...t),error:(...t)=>N(console.error,...t)};class G extends Event{constructor(e,n){super(G.EVENT_NAME,{}),this.newUrl=e,this.oldUrl=n}static EVENT_NAME=q("wxt:locationchange")}function q(t){return`${b?.runtime?.id}:content:${t}`}function vt(t){let e,n;return{run(){e==null&&(n=new URL(location.href),e=t.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new G(o,n)),n=o)},1e3))}}}class _{constructor(e,n){this.contentScriptName=e,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=q("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=vt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener("abort",e),()=>this.signal.removeEventListener("abort",e)}block(){return new Promise(()=>{})}setInterval(e,n){const o=setInterval(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(e,n){const o=setTimeout(()=>{this.isValid&&e()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(e){const n=requestAnimationFrame((...o)=>{this.isValid&&e(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(e,n){const o=requestIdleCallback((...r)=>{this.signal.aborted||e(...r)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(e,n,o,r){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(n.startsWith("wxt:")?q(n):n,o,{...r,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),wt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:_.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(e){const n=e.data?.type===_.SCRIPT_STARTED_MESSAGE_TYPE,o=e.data?.contentScriptName===this.contentScriptName,r=!this.receivedMessageIds.has(e.data?.messageId);return n&&o&&r}listenForNewerScripts(e){let n=!0;const o=r=>{if(this.verifyScriptStartedEvent(r)){this.receivedMessageIds.add(r.data.messageId);const u=n;if(n=!1,u&&e?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function Lt(){}function F(t,...e){}const Et={debug:(...t)=>F(console.debug,...t),log:(...t)=>F(console.log,...t),warn:(...t)=>F(console.warn,...t),error:(...t)=>F(console.error,...t)};return(async()=>{try{const{main:t,...e}=it,n=new _("content",e);return await t(n)}catch(t){throw Et.error('The content script "content" crashed on startup!',t),t}})()})();
content;