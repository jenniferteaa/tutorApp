var content=(function(){"use strict";function $e(e){return e}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,ue={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{j()}):j()}};let d=null,E=!1,S=!1,L={x:0,y:0},w={x:0,y:0},O,X,q=[];function j(){console.log("The widget is being loaded to the page"),pe(),be()}function pe(){const e=document.getElementById("tutor-widget");e&&e.remove(),d=document.createElement("div"),d.id="tutor-widget";let t;try{t=b.runtime.getURL("logo.png"),O=t}catch(o){console.warn("There is an error loading the logo: ",o),t=`chrome-extension://${b.runtime.id||chrome.runtime.id}/logo.png`,O=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",b.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),d.innerHTML=`
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
.btn-guide-mode:not(:disabled):hover,
.btn-timer:not(:disabled):hover{
  transform: translateY(-1px);
  filter: brightness(0.98);
  
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-timer:active{
  transform: translateY(0px);
}

.btn-help-mode:not(:disabled):hover
{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
}

.btn-guide-mode:not(:disabled):hover
{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
}


@keyframes hoverPulse {
  0%   { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
  50%  { transform: translateY(-2px); filter: brightness(1.02) saturate(1.15); }
  100% { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
}

.btn-guide-mode.is-loading{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
  animation: hoverPulse 1.2s ease-in-out infinite;
}


.btn-help-mode.is-loading{
  filter: brightness(0.95) saturate(1.1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border-color: rgba(0,0,0,0.25);
  background: rgba(195, 237, 152, 0.95);
  animation: hoverPulse 1.2s ease-in-out infinite;
  }

.tutor-panel.checkmode-active .btn-guide-mode,
.tutor-panel.checkmode-active .btn-timer,
.tutor-panel.checkmode-active .tutor-panel-send{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.checkmode-active .btn-guide-mode::after,
.tutor-panel.checkmode-active .btn-timer::after,
.tutor-panel.checkmode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
  color: rgba(0,0,0,0.7);
}

.tutor-panel.guidemode-active .btn-help-mode,
.tutor-panel.guidemode-active .btn-timer,
.tutor-panel.guidemode-active .tutor-panel-send{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.guidemode-active .btn-help-mode::after,
.tutor-panel.guidemode-active .btn-timer::after,
.tutor-panel.guidemode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 700;
  color: rgba(0,0,0,0.7);
}


/* Content area */
.tutor-panel-content{
  flex: 1;                 /* takes remaining space */
  padding: 12px;
  overflow-x: hidden;

  background: rgba(255, 255, 255, 0.35);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tutor-panel-message{
  margin: 0;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 8px;
  color: rgba(0,0,0,0.86);
  font-size: 14px;
  line-height: 1.7;
}

.tutor-panel-message--assistant{
  background: transparent;
  border-radius: 1px;
  border: none;
  padding: 10px 20px;
  align-self: flex-start;
  border-top: 2px solid rgba(0,0,0,0.45);
  margin-top: 14px;
  padding-top: 18px 20px;

}

.tutor-panel-loading{
  font-size: 13px;
  color: rgba(0,0,0,0.6);
  padding: 6px 12px;
  align-self: flex-start;
}


.tutor-panel-message--user{
  align-self: flex-end;
  max-width: 75%;
  background: rgba(255, 255, 255, 0.85);
}

.tutor-panel-message p{
  margin: 0 0 8px 0;
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
  background: rgba(0,0,0,0.06);
  padding: 1px 4px;
  border-radius: 4px;
}
.tutor-panel-message pre{
  background: rgba(15, 23, 42, 0.06);
  padding: 10px 12px;
  border-radius: 8px;
  overflow: auto;
  white-space: pre-wrap;
}
.tutor-panel-message pre code{
  background: transparent;
  padding: 0;
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
}`,document.head.appendChild(n),document.body.appendChild(d);const i=document.getElementById("logo-image");i&&(i.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),i.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),i.style.display="none"})),ge()}function ge(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},i=!1,o=!1;function l(a,p){if(!d)return{x:a,y:p};const m={width:50,height:50},g=window.innerWidth,h=window.innerHeight,f=10;let x=Math.max(f,a);x=Math.min(g-m.width-f,x);let v=Math.max(f,p);return v=Math.min(h-m.height-f,v),{x,y:v}}function s(a,p){if(!d)return{x:a,y:p};const m={width:50,height:50},g=window.innerWidth,h=window.innerHeight,f=20,x=a,v=g-(a+m.width),_=p,B=h-(p+m.height),W=Math.min(x,v,_,B);let H=a,z=p;return(a<0||a+m.width>g||p<0||p+m.height>h)&&(W===x?H=f:W===v?H=g-m.width-f:W===_?z=f:W===B&&(z=h-m.height-f)),{x:H,y:z}}e.addEventListener("mousedown",a=>{a.preventDefault(),t=Date.now(),n={x:a.clientX,y:a.clientY},i=!1;const p=d.getBoundingClientRect();L.x=a.clientX-p.left,L.y=a.clientY-p.top,e.classList.add("dragging"),document.addEventListener("mousemove",u),document.addEventListener("mouseup",c)}),e.addEventListener("click",a=>{if(o){o=!1;return}!E&&!i&&(a.preventDefault(),a.stopPropagation(),S?U():me())});function u(a){const p=Date.now()-t,m=Math.sqrt(Math.pow(a.clientX-n.x,2)+Math.pow(a.clientY-n.y,2));if(!E&&(m>3||p>100)&&(E=!0,i=!0,document.body.style.cursor="grabbing"),E){const g=a.clientX-L.x,h=a.clientY-L.y,f=l(g,h);d.style.transform=`translate(${f.x}px, ${f.y}px)`,d.style.left="0",d.style.top="0",w={x:f.x,y:f.y}}}function c(){if(document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",c),e&&e.classList.remove("dragging"),document.body.style.cursor="",E){o=!0;const a=s(w.x,w.y);a.x!==w.x||a.y!==w.y?(d.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",d.style.left=a.x+"px",d.style.top=a.y+"px",d.style.transform="",setTimeout(()=>{d&&(d.style.transition="")},15e3),w=a):(d.style.left=w.x+"px",d.style.top=w.y+"px",d.style.transform=""),Q()}E=!1,i=!1}}function me(){if(r&&r.element&&document.body.contains(r.element)){re(r.element),V(),S=!0,r.element;return}const e=fe();if(!e){console.log("There was an error creating a panel");return}const t=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(t).map(s=>s.getAttribute("href")).filter(s=>!!s).map(s=>s.replace("/tag/","").replace("/","").replace("-","_"));Object.fromEntries(Array.from(new Set(n)).map(s=>[s,[]]));const i=Object.fromEntries(Array.from(new Set(n)).map(s=>[s,{thoughts_to_remember:[],pitfalls:[]}])),o=document.querySelector("div.text-title-large a")?.textContent?.trim()??"";console.log(o);const l=crypto.randomUUID();r={element:e,sessionId:l,problem:o,topics:i,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:""}},re(e),V(),S=!0,setTimeout(()=>{const s=e.querySelector(".tutor-panel-prompt");s&&(s.focus(),s.setSelectionRange(s.value.length,s.value.length))},100)}let r=null;function fe(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",document.body.appendChild(e);const t=document.getElementById("tutor-widget");if(t){const n=t.getBoundingClientRect();e.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",e.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else e.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",e.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>e.classList.add("open"),10),Ie(e),e}function U(){r?.element&&(Ee(r.element),Me(r.element),he(),S=!1)}function Fe(e){}function V(){d&&(d.style.display="none")}function he(){d&&(d.style.display="block")}async function Q(){}async function be(){}let M=null,k=!1,y=new Set,J=0,D=!1,I=null,K=null,Z=0;function T(){return document.querySelector(".monaco-editor textarea.inputarea")}function ee(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function A(){y.clear(),k=!1,M!==null&&(window.clearTimeout(M),M=null)}async function R(e){const t=Te(),i=T()?.value??"",o=Array.from(y)[0]??1;if(!o){A();return}const l=Date.now();if(K===o&&l-Z<250)return;if(K=o,Z=l,!t){A();return}let s="";if(i&&(s=te(i,o)),!s.trim()&&o>1&&i){const c=te(i,o-1);c.trim()&&(s=c)}let u=t;try{const c=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});c?.ok&&typeof c.code=="string"&&(u=c.code)}catch{}xe(s)&&(q.push([u,s]),we()),A()}function xe(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function te(e,t){return e.split(`
`)[t-1]??""}async function we(){if(!D){D=!0;try{for(;q.length>0;){const[e,t]=q.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),X=!0;const n=await b.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:r?.sessionId??"",problem:r?.problem??"",topics:r?.topics,code:e,focusLine:t,rollingStateGuideMode:r?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const i=n.success?n.reply:null;i?.state_update?.lastEdit?.trim()&&r&&(r.rollingStateGuideMode.lastEdit=i.state_update.lastEdit);const o=i?.nudge;r&&typeof o=="string"&&(r.content.push(`${o}
`),r.element!=null&&await de(r.element,"","assistant",o));const l=i?.topics;if(l&&typeof l=="object")for(const[s,u]of Object.entries(l)){if(!u||typeof u!="object")continue;const c=u.thoughts_to_remember,a=u.pitfalls,p=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],m=Array.isArray(a)?a:typeof a=="string"&&a.trim()?[a.trim()]:[];r&&(r.topics[s]??={thoughts_to_remember:[],pitfalls:[]},p.length>0&&r.topics[s].thoughts_to_remember.push(...p),m.length>0&&r.topics[s].pitfalls.push(...m))}X=!1}}}finally{D=!1}}}function ne(){if(!r?.guideModeEnabled)return;const e=T();if(!e)return;const t=e.value??"",n=e.selectionStart??0,i=ee(t,n);!y.has(i)&&y.size==0&&y.add(i),k||(k=!0),M!==null&&window.clearTimeout(M),M=window.setTimeout(()=>{R()},1e4),!y.has(i)&&y.size==1&&R()}function oe(){if(!r?.guideModeEnabled||!k)return;const e=T();if(!e)return;const t=e.value??"",n=e.selectionStart??0,i=ee(t,n);if(I===null){I=i;return}i!==I&&(I=i,!y.has(i)&&y.size==1&&R())}function ie(){const e=T();if(!e){J<5&&(J+=1,window.setTimeout(ie,500));return}e.addEventListener("input",ne),document.addEventListener("selectionchange",oe)}function ye(){const e=T();e&&(e.removeEventListener("input",ne),document.removeEventListener("selectionchange",oe))}function _e(){}async function ve(e,t){console.log("this is the query asked: ",t);const n=await b.runtime.sendMessage({action:"ask-anything",payload:{sessionId:r?.sessionId??"",query:t,action:"ask-anything"}});return console.log("this is the response: ",n),n||"Failure"}function re(e){e.style.display="flex",e.classList.add("open")}function Ee(e){e.classList.remove("open"),e.style.display="none"}function Me(e){if(!d)return;const t=e.getBoundingClientRect(),n=d.getBoundingClientRect(),i=n.width||50,o=n.height||50,u=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-i-10,c=Math.max(10,Math.min(window.innerHeight/2-o/2,window.innerHeight-o-10));d.style.left=`${u}px`,d.style.top=`${c}px`,d.style.right="auto",d.style.bottom="auto",d.style.transform="",w={x:u,y:c},Q()}function Te(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function C(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(e){return e.split("`").map((n,i)=>i%2===1?`<code>${C(n)}</code>`:C(n)).join("")}function Se(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",i=[],o=null;const l=()=>{i.length!==0&&(n+=`<p>${P(i.join(" "))}</p>`,i=[])},s=()=>{o&&(n+=`</${o}>`,o=null)};for(const u of t){const c=u.trim();if(!c){l(),s();continue}const a=c.match(/^(#{1,3})\s+(.*)$/);if(a){l(),s();const g=a[1].length;n+=`<h${g}>${P(a[2])}</h${g}>`;continue}const p=c.match(/^(\d+)\.\s+(.*)$/);if(p){l(),o&&o!=="ol"&&s(),o||(o="ol",n+="<ol>"),n+=`<li>${P(p[2])}</li>`;continue}const m=c.match(/^[-*]\s+(.*)$/);if(m){l(),o&&o!=="ul"&&s(),o||(o="ul",n+="<ul>"),n+=`<li>${P(m[1])}</li>`;continue}i.push(c)}return l(),s(),n}function se(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let i=0,o;for(;(o=n.exec(e))!==null;)o.index>i&&t.push({type:"text",content:e.slice(i,o.index)}),t.push({type:"code",content:o[2]??"",lang:o[1]??""}),i=n.lastIndex;return i<e.length&&t.push({type:"text",content:e.slice(i)}),t.map(l=>l.type==="code"?`<pre><code${l.lang?` data-lang="${C(l.lang)}"`:""}>${C(l.content.trimEnd())}</code></pre>`:Se(l.content)).join("")}function ae(e,t,n){const i=e.querySelector(".tutor-panel-content");if(!i)return null;const o=document.createElement("div");return o.className=`tutor-panel-message tutor-panel-message--${n}`,n==="assistant"?o.innerHTML=se(t):o.textContent=t,i.append(o),i.scrollTop=o.offsetTop,o}function le(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const i of n){const o=e.querySelector(i);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function ce(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const i of n){const o=e.querySelector(i);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function Le(e,t,n){return new Promise(i=>{let o=0;const l=2,s=e.offsetTop;t.scrollTop=s;let u=!0;const c=()=>{Math.abs(t.scrollTop-s)>8&&(u=!1)};t.addEventListener("scroll",c,{passive:!0});const a=()=>{o=Math.min(n.length,o+l),e.textContent=n.slice(0,o),u&&(t.scrollTop=s),o<n.length?window.setTimeout(a,12):(t.removeEventListener("scroll",c),i())};a()})}async function de(e,t,n,i){const o=e.querySelector(".tutor-panel-content");if(o&&typeof i=="string"){const l=ae(e,"","assistant");if(!l)return;await Le(l,o,i),l.innerHTML=se(i),o.scrollTop=l.offsetTop}}async function ke(e,t){try{const n=await b.runtime.sendMessage({action:"check-code",payload:{sessionId:r?.sessionId??"",topics:r?.topics,code:t,action:"check-code"}}),i=n?.resp;r&&typeof i=="string"&&r.content.push(`${i}
`),await de(e,"","assistant",i);const o=n?.topics;if(o&&typeof o=="object")for(const[l,s]of Object.entries(o)){if(!s||typeof s!="object")continue;const u=s.thoughts_to_remember,c=s.pitfalls,a=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[],p=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];r&&(r.topics[l]??={thoughts_to_remember:[],pitfalls:[]},a.length>0&&r.topics[l].thoughts_to_remember.push(...a),p.length>0&&r.topics[l].pitfalls.push(...p))}return console.log("this is the object now: ",r?.topics),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Ie(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode");e.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{if(!r)return;r.guideModeEnabled=!r.guideModeEnabled;const g=e.querySelector(".btn-guide-mode");le(e,!0),e.classList.add("guidemode-active"),r.guideModeEnabled?(g?.classList.add("is-loading"),ie()):(ye(),le(e,!1),e.classList.remove("guidemode-active"),g?.classList.remove("is-loading"))});const o=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(r?.prompt){const g=r.prompt;ae(e,g,"user"),await ve(e,g),r.prompt=""}else return void 0}),t?.addEventListener("click",async()=>U()),n?.addEventListener("click",async()=>{const g=e.querySelector(".btn-help-mode");let h="";r&&(r.checkModeEnabled=!0,g?.classList.add("is-loading")),ce(e,!0),e.classList.add("checkmode-active");try{const f=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});f?.ok&&typeof f.code=="string"&&r&&(h=f.code);const x=await ke(e,h);console.log("this is the response: ",x)}catch{}finally{r&&(r.checkModeEnabled=!1,g?.classList.remove("is-loading")),ce(e,!1),e.classList.remove("checkmode-active")}}),o?.addEventListener("input",()=>{r&&(r.prompt=o.value)});let s=!1,u=0,c=0;const a=e.querySelector(".tutor-panel-topbar"),p=g=>{if(!s)return;const h=g.clientX-u,f=g.clientY-c,x=window.innerWidth-e.offsetWidth,v=window.innerHeight-e.offsetHeight,_=Math.max(10,Math.min(h,x)),B=Math.max(10,Math.min(f,v));e.style.left=`${_}px`,e.style.top=`${B}px`},m=()=>{s&&(s=!1,document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",m),r&&(r.position={x:e.offsetLeft,y:e.offsetTop}))};a?.addEventListener("mousedown",g=>{g.preventDefault(),s=!0,u=g.clientX-e.getBoundingClientRect().left,c=g.clientY-e.getBoundingClientRect().top,document.addEventListener("mousemove",p),document.addEventListener("mouseup",m)})}function $(e,...t){}const Ae={debug:(...e)=>$(console.debug,...e),log:(...e)=>$(console.log,...e),warn:(...e)=>$(console.warn,...e),error:(...e)=>$(console.error,...e)};class Y extends Event{constructor(t,n){super(Y.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=G("wxt:locationchange")}function G(e){return`${b?.runtime?.id}:content:${e}`}function Ce(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let i=new URL(location.href);i.href!==n.href&&(window.dispatchEvent(new Y(i,n)),n=i)},1e3))}}}class N{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=G("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Ce(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const i=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(i)),i}setTimeout(t,n){const i=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(i)),i}requestAnimationFrame(t){const n=requestAnimationFrame((...i)=>{this.isValid&&t(...i)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const i=requestIdleCallback((...o)=>{this.signal.aborted||t(...o)},n);return this.onInvalidated(()=>cancelIdleCallback(i)),i}addEventListener(t,n,i,o){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?G(n):n,i,{...o,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Ae.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:N.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===N.SCRIPT_STARTED_MESSAGE_TYPE,i=t.data?.contentScriptName===this.contentScriptName,o=!this.receivedMessageIds.has(t.data?.messageId);return n&&i&&o}listenForNewerScripts(t){let n=!0;const i=o=>{if(this.verifyScriptStartedEvent(o)){this.receivedMessageIds.add(o.data.messageId);const l=n;if(n=!1,l&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",i),this.onInvalidated(()=>removeEventListener("message",i))}}function Be(){}function F(e,...t){}const Pe={debug:(...e)=>F(console.debug,...e),log:(...e)=>F(console.log,...e),warn:(...e)=>F(console.warn,...e),error:(...e)=>F(console.error,...e)};return(async()=>{try{const{main:e,...t}=ue,n=new N("content",t);return await e(n)}catch(e){throw Pe.error('The content script "content" crashed on startup!',e),e}})()})();
content;