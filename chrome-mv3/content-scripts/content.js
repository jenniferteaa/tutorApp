var content=(function(){"use strict";function Be(e){return e}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,me={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{K()}):K()}};let d=null,E=!1,L=!1,S={x:0,y:0},w={x:0,y:0},Q,J,_=[];function K(){console.log("The widget is being loaded to the page"),fe(),ye()}function fe(){const e=document.getElementById("tutor-widget");e&&e.remove(),d=document.createElement("div"),d.id="tutor-widget";let t;try{t=b.runtime.getURL("logo.png"),Q=t}catch(o){console.warn("There is an error loading the logo: ",o),t=`chrome-extension://${b.runtime.id||chrome.runtime.id}/logo.png`,Q=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",b.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),d.innerHTML=`
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

.tutor-panel-message--guideAssistant{
  border: none;
  background: rgba(15, 23, 42, 0.06);
  border-radius: 7px;
  padding: 10px 20px;
  align-self: flex-start;
}

.guide-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

/* Border + GAP live here */
.guide-wrapper.guide-start{
  border-top: 2px solid rgba(0,0,0,0.45);
  margin-top: 14px;
  padding-top: 14px; /* ✅ gap between border and bubble */
}

.guide-wrapper.guide-end{
  border-bottom: 2px solid rgba(0,0,0,0.45);
  margin-bottom: 14px;
  padding-bottom: 14px; /* ✅ gap between bubble and border */
}

.tutor-panel-message--checkAssistant{
  border: none;
  background: rgba(15, 23, 42, 0.06);
  border-radius: 7px;
  padding: 10px 20px;
  align-self: flex-start;
}
.check-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

.check-wrapper.check-start{
  border-top: 2px solid rgba(0,0,0,0.45);
  margin-top: 14px;
  padding-top: 14px;
}

.check-wrapper.check-end{
  border-bottom: 2px solid rgba(0,0,0,0.45);
  margin-bottom: 14px;
  padding-bottom: 14px;
}
.tutor-panel-message--checkAssistant{
  background: rgba(0, 0, 0, 0.06); /* a bit warmer/neutral */
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
}`,document.head.appendChild(n),document.body.appendChild(d);const i=document.getElementById("logo-image");i&&(i.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),i.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),i.style.display="none"})),he()}function he(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},i=!1,o=!1;function r(l,p){if(!d)return{x:l,y:p};const m={width:50,height:50},g=window.innerWidth,h=window.innerHeight,f=10;let x=Math.max(f,l);x=Math.min(g-m.width-f,x);let v=Math.max(f,p);return v=Math.min(h-m.height-f,v),{x,y:v}}function s(l,p){if(!d)return{x:l,y:p};const m={width:50,height:50},g=window.innerWidth,h=window.innerHeight,f=20,x=l,v=g-(l+m.width),D=p,H=h-(p+m.height),R=Math.min(x,v,D,H);let U=l,V=p;return(l<0||l+m.width>g||p<0||p+m.height>h)&&(R===x?U=f:R===v?U=g-m.width-f:R===D?V=f:R===H&&(V=h-m.height-f)),{x:U,y:V}}e.addEventListener("mousedown",l=>{l.preventDefault(),t=Date.now(),n={x:l.clientX,y:l.clientY},i=!1;const p=d.getBoundingClientRect();S.x=l.clientX-p.left,S.y=l.clientY-p.top,e.classList.add("dragging"),document.addEventListener("mousemove",u),document.addEventListener("mouseup",c)}),e.addEventListener("click",l=>{if(o){o=!1;return}!E&&!i&&(l.preventDefault(),l.stopPropagation(),L?Z():be())});function u(l){const p=Date.now()-t,m=Math.sqrt(Math.pow(l.clientX-n.x,2)+Math.pow(l.clientY-n.y,2));if(!E&&(m>3||p>100)&&(E=!0,i=!0,document.body.style.cursor="grabbing"),E){const g=l.clientX-S.x,h=l.clientY-S.y,f=r(g,h);d.style.transform=`translate(${f.x}px, ${f.y}px)`,d.style.left="0",d.style.top="0",w={x:f.x,y:f.y}}}function c(){if(document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",c),e&&e.classList.remove("dragging"),document.body.style.cursor="",E){o=!0;const l=s(w.x,w.y);l.x!==w.x||l.y!==w.y?(d.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",d.style.left=l.x+"px",d.style.top=l.y+"px",d.style.transform="",setTimeout(()=>{d&&(d.style.transition="")},15e3),w=l):(d.style.left=w.x+"px",d.style.top=w.y+"px",d.style.transform=""),te()}E=!1,i=!1}}function be(){if(a&&a.element&&document.body.contains(a.element)){de(a.element),ee(),L=!0,a.element;return}const e=xe();if(!e){console.log("There was an error creating a panel");return}const t=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(t).map(s=>s.getAttribute("href")).filter(s=>!!s).map(s=>s.replace("/tag/","").replace("/","").replace("-","_"));Object.fromEntries(Array.from(new Set(n)).map(s=>[s,[]]));const i=Object.fromEntries(Array.from(new Set(n)).map(s=>[s,{thoughts_to_remember:[],pitfalls:[]}])),o=document.querySelector("div.text-title-large a")?.textContent?.trim()??"";console.log(o);const r=crypto.randomUUID();a={element:e,sessionId:r,problem:o,topics:i,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:""}},de(e),ee(),L=!0,setTimeout(()=>{const s=e.querySelector(".tutor-panel-prompt");s&&(s.focus(),s.setSelectionRange(s.value.length,s.value.length))},100)}let a=null;function xe(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",document.body.appendChild(e);const t=document.getElementById("tutor-widget");if(t){const n=t.getBoundingClientRect();e.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",e.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else e.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",e.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>e.classList.add("open"),10),Ce(e),e}function Z(){a?.element&&(Te(a.element),Le(a.element),we(),L=!1)}function qe(e){}function ee(){d&&(d.style.display="none")}function we(){d&&(d.style.display="block")}async function te(){}async function ye(){}let M=null,A=!1,y=new Set,ne=0,G=!1,I=null,oe=null,ie=0,Y=0,C=null;function T(){return document.querySelector(".monaco-editor textarea.inputarea")}function re(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function P(){y.clear(),A=!1,M!==null&&(window.clearTimeout(M),M=null)}async function z(e){const t=Se(),i=T()?.value??"",o=Array.from(y)[0]??1;if(!o){P();return}const r=Date.now();if(oe===o&&r-ie<250)return;if(oe=o,ie=r,!t){P();return}let s="";if(i&&(s=se(i,o)),!s.trim()&&o>1&&i){const c=se(i,o-1);c.trim()&&(s=c)}let u=t;try{const c=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});c?.ok&&typeof c.code=="string"&&(u=c.code)}catch{}ve(s)&&(_.push([u,s]),Ee()),P()}function ve(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function se(e,t){return e.split(`
`)[t-1]??""}async function Ee(){if(!G){G=!0;try{for(;_.length>0;){const[e,t]=_.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),J=!0;const n=await b.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:a?.sessionId??"",problem:a?.problem??"",topics:a?.topics,code:e,focusLine:t,rollingStateGuideMode:a?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const i=n.success?n.reply:null;i?.state_update?.lastEdit?.trim()&&a&&(a.rollingStateGuideMode.lastEdit=i.state_update.lastEdit);const o=i?.nudge;a&&typeof o=="string"&&(a.content.push(`${o}
`),a.element!=null&&await ge(a.element,"","guideAssistant",o));const r=i?.topics;if(r&&typeof r=="object")for(const[s,u]of Object.entries(r)){if(!u||typeof u!="object")continue;const c=u.thoughts_to_remember,l=u.pitfalls,p=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],m=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[];a&&(a.topics[s]??={thoughts_to_remember:[],pitfalls:[]},p.length>0&&a.topics[s].thoughts_to_remember.push(...p),m.length>0&&a.topics[s].pitfalls.push(...m))}J=!1}}}finally{G=!1}}}function ae(){if(!a?.guideModeEnabled)return;const e=T();if(!e)return;const t=e.value??"",n=e.selectionStart??0,i=re(t,n);!y.has(i)&&y.size==0&&y.add(i),A||(A=!0),M!==null&&window.clearTimeout(M),M=window.setTimeout(()=>{z()},1e4),!y.has(i)&&y.size==1&&z()}function le(){if(!a?.guideModeEnabled||!A)return;const e=T();if(!e)return;const t=e.value??"",n=e.selectionStart??0,i=re(t,n);if(I===null){I=i;return}i!==I&&(I=i,!y.has(i)&&y.size==1&&z())}function ce(){const e=T();if(!e){ne<5&&(ne+=1,window.setTimeout(ce,500));return}e.addEventListener("input",ae),document.addEventListener("selectionchange",le)}function Me(){const e=T();e&&(e.removeEventListener("input",ae),document.removeEventListener("selectionchange",le))}function We(){}async function ke(e,t){console.log("this is the query asked: ",t);const n=await b.runtime.sendMessage({action:"ask-anything",payload:{sessionId:a?.sessionId??"",query:t,action:"ask-anything"}});return console.log("this is the response: ",n),n||"Failure"}function de(e){e.style.display="flex",e.classList.add("open")}function Te(e){e.classList.remove("open"),e.style.display="none"}function Le(e){if(!d)return;const t=e.getBoundingClientRect(),n=d.getBoundingClientRect(),i=n.width||50,o=n.height||50,u=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-i-10,c=Math.max(10,Math.min(window.innerHeight/2-o/2,window.innerHeight-o-10));d.style.left=`${u}px`,d.style.top=`${c}px`,d.style.right="auto",d.style.bottom="auto",d.style.transform="",w={x:u,y:c},te()}function Se(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function N(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $(e){return e.split("`").map((n,i)=>i%2===1?`<code>${N(n)}</code>`:N(n)).join("")}function Ae(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",i=[],o=null;const r=()=>{i.length!==0&&(n+=`<p>${$(i.join(" "))}</p>`,i=[])},s=()=>{o&&(n+=`</${o}>`,o=null)};for(const u of t){const c=u.trim();if(!c){r(),s();continue}const l=c.match(/^(#{1,3})\s+(.*)$/);if(l){r(),s();const g=l[1].length;n+=`<h${g}>${$(l[2])}</h${g}>`;continue}const p=c.match(/^(\d+)\.\s+(.*)$/);if(p){r(),o&&o!=="ol"&&s(),o||(o="ol",n+="<ol>"),n+=`<li>${$(p[2])}</li>`;continue}const m=c.match(/^[-*]\s+(.*)$/);if(m){r(),o&&o!=="ul"&&s(),o||(o="ul",n+="<ul>"),n+=`<li>${$(m[1])}</li>`;continue}i.push(c)}return r(),s(),n}function k(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let i=0,o;for(;(o=n.exec(e))!==null;)o.index>i&&t.push({type:"text",content:e.slice(i,o.index)}),t.push({type:"code",content:o[2]??"",lang:o[1]??""}),i=n.lastIndex;return i<e.length&&t.push({type:"text",content:e.slice(i)}),t.map(r=>r.type==="code"?`<pre><code${r.lang?` data-lang="${N(r.lang)}"`:""}>${N(r.content.trimEnd())}</code></pre>`:Ae(r.content)).join("")}function B(e,t,n){const i=e.querySelector(".tutor-panel-content");if(!i)return null;const o=document.createElement("div");if(n==="assistant")o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=k(t);else if(n==="guideAssistant"){const r=document.createElement("div");return r.className="guide-wrapper",o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=k(t),r.appendChild(o),i.appendChild(r),r}else if(n==="checkAssistant"){const r=document.createElement("div");return r.className="check-wrapper",o.className="tutor-panel-message tutor-panel-message--checkAssistant",o.innerHTML=k(t),r.appendChild(o),i.appendChild(r),r}else o.textContent=t;return i.append(o),i.scrollTop=o.offsetTop,o}function ue(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const i of n){const o=e.querySelector(i);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function pe(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const i of n){const o=e.querySelector(i);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function O(e,t,n){return new Promise(i=>{let o=0;const r=2,s=e.offsetTop;t.scrollTop=s;let u=!0;const c=()=>{Math.abs(t.scrollTop-s)>8&&(u=!1)};t.addEventListener("scroll",c,{passive:!0});const l=()=>{o=Math.min(n.length,o+r),e.textContent=n.slice(0,o),u&&(t.scrollTop=s),o<n.length?window.setTimeout(l,12):(t.removeEventListener("scroll",c),i())};l()})}async function ge(e,t,n,i){const o=e.querySelector(".tutor-panel-content");if(o&&typeof i=="string"){if(n==="assistant"){const r=B(e,"","assistant");if(!r)return;await O(r,o,i),r.innerHTML=k(i),o.scrollTop=r.offsetTop}else if(n==="guideAssistant"){const r=B(e,"","guideAssistant");if(!r)return;const s=r.querySelector(".tutor-panel-message--guideAssistant");if(!s)return;Y===0&&r.classList.add("guide-start"),Y+=1,C=r,await O(s,o,i),s.innerHTML=k(i),o.scrollTop=r.offsetTop}else if(n==="checkAssistant"){const r=B(e,"","checkAssistant");if(!r)return;const s=r.querySelector(".tutor-panel-message--checkAssistant");if(!s)return;r.classList.add("check-start"),await O(s,o,i),s.innerHTML=k(i),r.classList.add("check-end"),o.scrollTop=r.offsetTop}}}async function Ie(e,t){try{const n=await b.runtime.sendMessage({action:"check-code",payload:{sessionId:a?.sessionId??"",topics:a?.topics,code:t,action:"check-code"}}),i=n?.resp;a&&typeof i=="string"&&a.content.push(`${i}
`),await ge(e,"","checkAssistant",i);const o=n?.topics;if(o&&typeof o=="object")for(const[r,s]of Object.entries(o)){if(!s||typeof s!="object")continue;const u=s.thoughts_to_remember,c=s.pitfalls,l=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[],p=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];a&&(a.topics[r]??={thoughts_to_remember:[],pitfalls:[]},l.length>0&&a.topics[r].thoughts_to_remember.push(...l),p.length>0&&a.topics[r].pitfalls.push(...p))}return console.log("this is the object now: ",a?.topics),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Ce(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode");e.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{if(!a)return;a.guideModeEnabled=!a.guideModeEnabled;const g=e.querySelector(".btn-guide-mode");ue(e,!0),e.classList.add("guidemode-active"),a.guideModeEnabled?(g?.classList.add("is-loading"),Y=0,C=null,ce()):(Me(),C&&C.classList.add("guide-end"),ue(e,!1),e.classList.remove("guidemode-active"),g?.classList.remove("is-loading"))});const o=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(a?.prompt){const g=a.prompt;B(e,g,"user"),await ke(e,g),a.prompt=""}else return void 0}),t?.addEventListener("click",async()=>Z()),n?.addEventListener("click",async()=>{const g=e.querySelector(".btn-help-mode");let h="";a&&(a.checkModeEnabled=!0,g?.classList.add("is-loading")),pe(e,!0),e.classList.add("checkmode-active");try{const f=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});f?.ok&&typeof f.code=="string"&&a&&(h=f.code);const x=await Ie(e,h);console.log("this is the response: ",x)}catch{}finally{a&&(a.checkModeEnabled=!1,g?.classList.remove("is-loading")),pe(e,!1),e.classList.remove("checkmode-active")}}),o?.addEventListener("input",()=>{a&&(a.prompt=o.value)});let s=!1,u=0,c=0;const l=e.querySelector(".tutor-panel-topbar"),p=g=>{if(!s)return;const h=g.clientX-u,f=g.clientY-c,x=window.innerWidth-e.offsetWidth,v=window.innerHeight-e.offsetHeight,D=Math.max(10,Math.min(h,x)),H=Math.max(10,Math.min(f,v));e.style.left=`${D}px`,e.style.top=`${H}px`},m=()=>{s&&(s=!1,document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",m),a&&(a.position={x:e.offsetLeft,y:e.offsetTop}))};l?.addEventListener("mousedown",g=>{g.preventDefault(),s=!0,u=g.clientX-e.getBoundingClientRect().left,c=g.clientY-e.getBoundingClientRect().top,document.addEventListener("mousemove",p),document.addEventListener("mouseup",m)})}function F(e,...t){}const Pe={debug:(...e)=>F(console.debug,...e),log:(...e)=>F(console.log,...e),warn:(...e)=>F(console.warn,...e),error:(...e)=>F(console.error,...e)};class X extends Event{constructor(t,n){super(X.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=j("wxt:locationchange")}function j(e){return`${b?.runtime?.id}:content:${e}`}function Ne(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let i=new URL(location.href);i.href!==n.href&&(window.dispatchEvent(new X(i,n)),n=i)},1e3))}}}class q{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=j("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Ne(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const i=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(i)),i}setTimeout(t,n){const i=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(i)),i}requestAnimationFrame(t){const n=requestAnimationFrame((...i)=>{this.isValid&&t(...i)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const i=requestIdleCallback((...o)=>{this.signal.aborted||t(...o)},n);return this.onInvalidated(()=>cancelIdleCallback(i)),i}addEventListener(t,n,i,o){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?j(n):n,i,{...o,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Pe.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:q.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===q.SCRIPT_STARTED_MESSAGE_TYPE,i=t.data?.contentScriptName===this.contentScriptName,o=!this.receivedMessageIds.has(t.data?.messageId);return n&&i&&o}listenForNewerScripts(t){let n=!0;const i=o=>{if(this.verifyScriptStartedEvent(o)){this.receivedMessageIds.add(o.data.messageId);const r=n;if(n=!1,r&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",i),this.onInvalidated(()=>removeEventListener("message",i))}}function De(){}function W(e,...t){}const $e={debug:(...e)=>W(console.debug,...e),log:(...e)=>W(console.log,...e),warn:(...e)=>W(console.warn,...e),error:(...e)=>W(console.error,...e)};return(async()=>{try{const{main:e,...t}=me,n=new q("content",t);return await e(n)}catch(e){throw $e.error('The content script "content" crashed on startup!',e),e}})()})();
content;