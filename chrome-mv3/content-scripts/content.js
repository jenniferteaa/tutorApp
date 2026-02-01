var content=(function(){"use strict";function Pt(e){return e}const h=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,Je={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Te()}):Te()}};let m=null,A=!1,M=!1,F={x:0,y:0},E={x:0,y:0},Ie,Me,ee=[];function Te(){console.log("The widget is being loaded to the page"),Ze(),xt(),gt(),bt(),dt(),Fe().then(()=>{v?.panelOpen&&ne()}),window.addEventListener("beforeunload",()=>{C(i?.element??null)})}function Ze(){const e=document.getElementById("tutor-widget");e&&e.remove(),m=document.createElement("div"),m.id="tutor-widget";let t;try{t=h.runtime.getURL("logo.png"),Ie=t}catch(o){console.warn("There is an error loading the logo: ",o),t=`chrome-extension://${h.runtime.id||chrome.runtime.id}/logo.png`,Ie=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",h.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),m.innerHTML=`
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
      backdrop-filter: blur(2px);
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
  width: 450px;
  height: 350px;

  background: #F9FAFB;
  border-radius: 13px;
  border: none;
  box-shadow:
    0 14px 30px rgba(0,0,0,0.18),
    0 2px 6px rgba(0,0,0,0.10);

  z-index: 999997;
  font-family: 'Inconsolata', ui-monospace, "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace;
  font-size: 13px;

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
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 12px;
  background: #F9FAFB;
  border-bottom: 1px solid rgba(0, 0, 0, 0.21);
  cursor: grab;
  justify-content: flex-end;
}
.tutor-panel-shellbar:hover{
background: rgba(0, 0, 0, 0.03);
}

.tutor-panel-shellbar:active{
  background: rgba(0, 0, 0, 0.03);
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

.tutor-panel-loading{
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000001;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0,0,0,0.75);
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}

.tutor-panel-loading-spinner{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: rgba(0,0,0,0.6);
  animation: tutorPanelSpin 0.8s linear infinite;
}

@keyframes tutorPanelSpin{
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  background: rgba(205, 201, 203, 0.55);
}

/* Actions row */
.tutor-panel-actions{
  display: flex;
  align-items: center;
  gap: 12px;

  /* IMPORTANT: don’t let this become a giant green slab */
  background: transparent;
  /* background: rgba(205, 201, 203, 0.55); */
  padding: 0;
  margin: 0;
}

/* Buttons */
.btn-guide-mode,
.btn-help-mode,
.btn-timer,
.btn-gotToWorkspace{
  border: none;
  background: rgba(205, 201, 203, 0.40);
  color: rgba(0,0,0,0.9);

  padding: 6px 10px;
  border-radius: 8px;

  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;

  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.btn-guide-mode:not(:disabled):hover,
.btn-help-mode:not(:disabled):hover,
.btn-timer:not(:disabled):hover,
.btn-gotToWorkspace:not(:disabled):hover{
  background: rgba(0, 0, 0, 0.06);
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-timer:active,
.btn-gotToWorkspace:active{
  background: rgba(0, 0, 0, 0.1);
}


@keyframes hoverPulse {
  0%   { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
  50%  { transform: translateY(-2px); filter: brightness(1.02) saturate(1.15); }
  100% { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
}

.btn-guide-mode.is-loading{
  background: rgba(0, 0, 0, 0.08);
  animation: hoverPulse 1.2s ease-in-out infinite;
}


.btn-help-mode.is-loading{
  background: rgba(0, 0, 0, 0.08);
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

  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tutor-panel-auth{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 280px;      /* smaller box */
  padding: 12px;
 /* inset: 16px; */
  z-index: 2;
  padding: 12px;
 /* border: 1px dashed rgba(0,0,0,0.2); */
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
  font-size: 12px;
}
.tutor-panel-auth .auth-actions{
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.tutor-panel-auth .auth-name-row{
  display: flex;
  gap: 8px;
  width: 100%;
}
.tutor-panel-auth .auth-name-row input{
  flex: 1;
  min-width: 0;
}
.tutor-panel-auth .auth-sep{
  font-weight: 700;
  color: rgba(0,0,0,0.45);
  user-select: none;
}
.tutor-panel-auth h4{
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 700;
}
.tutor-panel-auth label{
  display: block;
  font-size: 12px;
  margin: 6px 0 2px;
}
.tutor-panel-auth input{
  width: 100%;
  padding: 6px 8px;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 6px;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.9);
}
.tutor-panel-auth button{
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.2);
  background: rgba(229, 233, 226, 0.92);
  font-weight: 600;
  cursor: pointer;
}

.tutor-panel-auth .auth-supabase{
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.tutor-panel-message{
  margin: 0;
  padding: 10px 20px 10px 10px;
  /* background: rgba(255, 255, 255, 0.75); */
 /* border: 1px solid rgba(0,0,0,0.08); */
  border-radius: 4px;
  color: rgba(0,0,0,0.86);
  font-size: 14px;
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
  /*background: rgba(15, 23, 42, 0.06); */
  background: transparent;
  border-radius: 7px;
  align-self: flex-start;
}

.guide-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

/* Border + GAP live here */
.guide-wrapper.guide-start{
  border-top: 1px solid rgba(0,0,0,0.08);
  margin-top: 14px;
  padding-top: 14px;
}

.guide-wrapper.guide-end{
  /* border-bottom: 1px solid rgba(0,0,0,0.08); */
  margin-bottom: 14px;
  padding-bottom: 14px;
}

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
  border-top: 1px solid rgba(0,0,0,0.08);
  margin-top: 14px;
  padding-top: 14px;
}

.check-wrapper.check-end{
  /* border-bottom: 1px solid rgba(0,0,0,0.08); */
  margin-bottom: 14px;
  padding-bottom: 14px;
}
.tutor-panel-message--checkAssistant{
  /* background: rgba(0, 0, 0, 0.06); */ /* a bit warmer/neutral */
 /* background: rgba(0, 0, 0, 0.04); */
}


.tutor-panel-loading{
  font-size: 13px;
  color: rgba(0,0,0,0.6);
  padding: 6px 12px;
  align-self: flex-start;
}


.tutor-panel-message--user{
  align-self: flex-end;
  padding: 10px 10px;
  max-width: 75%;
  border-radius: 9px;
  background: rgba(205, 201, 203, 0.55);
}

.tutor-panel-message p{
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
  background: rgba(0,0,0,0.06);
  padding: 1px 4px;
  border-radius: 4px;
}
.tutor-panel-message strong{
  font-weight: 800;
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

  padding: 10px 18px;

  background: transparent;
  border-top: none;
}

/* Textarea */
.tutor-panel-prompt{
  flex: 1;
  min-height: 44px;
  height: 44px;
  max-height: 110px;
  resize: none;

  padding: 12px 14px;
  box-sizing: border-box;

  border-radius: 4px;
  /* border: 1px solid rgba(0,0,0,0.16); */
  outline: none;

  background: rgba(0, 0, 0, 0.04);
  font-size: 10px;
  line-height: 1.2;
}
/* .tutor-panel-prompt:focus{
  border-color: rgba(0,0,0,0.3);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
} */

/* Send */
.tutor-panel-send{
  border: none;
  background: rgba(37, 35, 35, 0.9);
  color: rgba(255, 255, 255, 0.95);

  border-radius: 4px;
  height: 44px;
  padding: 0 18px;

  font-weight: 800;
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease, background 120ms ease;
  white-space: nowrap;
}
/*
.tutor-panel-send:active{
  transform: translateY(0px);
} */

/* Align all text sizes to Enter button */
.tutor-panel *{
  font-size: inherit;
}`,document.head.appendChild(n),document.body.appendChild(m);const r=document.getElementById("logo-image");r&&(r.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),r.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),r.style.display="none"})),tt()}function et(e){const t=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!t)return e;const n=t[1].trim(),o=t[2].trim().split(";").map(a=>a.trim()).filter(Boolean);if(o.length===0)return e;const s=o.map(a=>`- ${a.replace(/\.$/,"")}`).join(`
`);return`${n}

**To fix**
${s}`}function tt(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},r=!1,o=!1;function s(c,u){if(!m)return{x:c,y:u};const g={width:50,height:50},x=window.innerWidth,p=window.innerHeight,f=10;let y=Math.max(f,c);y=Math.min(x-g.width-f,y);let w=Math.max(f,u);return w=Math.min(p-g.height-f,w),{x:y,y:w}}function a(c,u){if(!m)return{x:c,y:u};const g={width:50,height:50},x=window.innerWidth,p=window.innerHeight,f=20,y=c,w=x-(c+g.width),I=u,Z=p-(u+g.height),$=Math.min(y,w,I,Z);let Ee=c,ke=u;return(c<0||c+g.width>x||u<0||u+g.height>p)&&($===y?Ee=f:$===w?Ee=x-g.width-f:$===I?ke=f:$===Z&&(ke=p-g.height-f)),{x:Ee,y:ke}}e.addEventListener("mousedown",c=>{c.preventDefault(),t=Date.now(),n={x:c.clientX,y:c.clientY},r=!1;const u=m.getBoundingClientRect();F.x=c.clientX-u.left,F.y=c.clientY-u.top,e.classList.add("dragging"),document.addEventListener("mousemove",d),document.addEventListener("mouseup",l)}),e.addEventListener("click",c=>{if(o){o=!1;return}!A&&!r&&(c.preventDefault(),c.stopPropagation(),M?Ue():ne())});function d(c){const u=Date.now()-t,g=Math.sqrt(Math.pow(c.clientX-n.x,2)+Math.pow(c.clientY-n.y,2));if(!A&&(g>3||u>100)&&(A=!0,r=!0,document.body.style.cursor="grabbing"),A){const x=c.clientX-F.x,p=c.clientY-F.y,f=s(x,p);m.style.transform=`translate(${f.x}px, ${f.y}px)`,m.style.left="0",m.style.top="0",E={x:f.x,y:f.y}}}function l(){if(document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",l),e&&e.classList.remove("dragging"),document.body.style.cursor="",A){o=!0;const c=a(E.x,E.y);c.x!==E.x||c.y!==E.y?(m.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",m.style.left=c.x+"px",m.style.top=c.y+"px",m.style.transform="",setTimeout(()=>{m&&(m.style.transition="")},15e3),E=c):(m.style.left=E.x+"px",m.style.top=E.y+"px",m.style.transform=""),Oe()}A=!1,r=!1}}function z(e){try{const{origin:t,pathname:n}=new URL(e),r=n.match(/^\/problems\/[^/]+/);return r?`${t}${r[0]}`:`${t}${n}`}catch{return e}}function B(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Le(e){const t=e.match(/^\s*(\d+)/);if(!t)return null;const n=Number(t[1]);return Number.isFinite(n)?n:null}function te(e,t){return`${Pe}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function nt(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(n=>n.getAttribute("href")).filter(n=>!!n).map(n=>n.replace("/tag/","").replace("/","").replace("-","_"));return Object.fromEntries(Array.from(new Set(t)).map(n=>[n,{thoughts_to_remember:[],pitfalls:[]}]))}function Ae(e,t,n){const r=n??B(),o=crypto.randomUUID();return{element:e,sessionId:o,userId:t,problem:r,problemUrl:z(window.location.href),topics:nt(),content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function ne(){const e=await ce(),t=ct(e),n=e?.userId??"";if(t&&await Re(),i&&i.element&&document.body.contains(i.element)){xe(i.element),ge(),M=!0,i.element,(!n||t)&&(D(i.element),O(i.element)),U(),b(i.element);return}if(i?.userId){mt();try{await C(i.element??null,{force:!0})}finally{ft()}}if(!v&&n){const o=await de(n,B());o&&pe(o,n)&&(v=o)}if(v){const o=We();_e(o,v),v=null,xe(o),ge(),M=!0,U(),(!n||t)&&(D(o),O(o)),b(o);return}const r=We();if(!r){console.log("There was an error creating a panel");return}i=Ae(r,n),xe(r),ge(),M=!0,U(),b(r),i&&(!n||t?(D(r),O(r)):i.userId=n,setTimeout(()=>{const o=r.querySelector(".tutor-panel-prompt");o&&(o.focus(),o.setSelectionRange(o.value.length,o.value.length))},100))}let oe=!1;async function ot(e){if(oe||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);oe=!0;try{const n=await h.runtime.sendMessage({action:"summarize-history",payload:{sessionId:i?.sessionId??"",summarize:t,summary:e.summary}});typeof n=="string"&&(e.summary=n)}finally{oe=!1}}function Ce(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),ot(e)}let i=null;const ie="vibetutor-auth",Pe="vibetutor-session",it="http://localhost:3000/auth/bridge",rt=960*60*1e3,st=15e3,$e=1440*60*1e3,at=1800*1e3,lt=`${Pe}:`;let v=null,W=Date.now(),qe=0,q=!1,re=null,se=null,ae=null,Ne=z(window.location.href),le=null;async function ce(){return(await h.storage.local.get(ie))[ie]??null}function ct(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Re(){await h.storage.local.remove(ie),await h.runtime.sendMessage({action:"clear-auth"})}async function C(e,t){if(!i||!i.userId||q&&!t?.force)return;const n=e?.querySelector(".tutor-panel-content")??i.element?.querySelector(".tutor-panel-content"),r=te(i.userId,i.problem),o={state:{sessionId:i.sessionId,userId:i.userId,content:i.content,problem:i.problem,problemUrl:i.problemUrl,topics:i.topics,prompt:i.prompt,position:i.position,size:i.size,guideModeEnabled:i.guideModeEnabled,checkModeEnabled:i.checkModeEnabled,timerEnabled:i.timerEnabled,rollingStateGuideMode:i.rollingStateGuideMode,sessionRollingHistory:i.sessionRollingHistory},panelOpen:M,contentHtml:n?.innerHTML??"",lastActivityAt:W};await h.storage.local.set({[r]:o})}function b(e){q||re||(re=window.setTimeout(()=>{re=null,C(e)},500))}async function de(e,t){const n=te(e,t),o=(await h.storage.local.get(n))[n]??null;return o?Date.now()-(o.lastActivityAt??0)>$e?(await h.storage.local.remove(n),null):o:null}async function ue(e,t){const n=te(e,t);await h.storage.local.remove(n)}async function He(){const e=await h.storage.local.get(null),t=Date.now(),n=[];for(const[r,o]of Object.entries(e)){if(!r.startsWith(lt))continue;const a=o?.lastActivityAt??0;t-a>$e&&n.push(r)}n.length>0&&await h.storage.local.remove(n)}function dt(){He(),le&&window.clearInterval(le),le=window.setInterval(()=>{He()},at)}function pe(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const n=z(window.location.href);return e.state.problemUrl===n}function _e(e,t){i={...t.state,element:e};const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML=t.contentHtml||"");const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=i.prompt??""),i.position&&(e.style.left=`${i.position.x}px`,e.style.top=`${i.position.y}px`),i.size&&(e.style.width=`${i.size.width}px`,e.style.height=`${i.size.height}px`);const o=e.querySelectorAll(".guide-wrapper");H=o.length,P=o.length>0?o[o.length-1]:null}function ut(e,t,n){ze();const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML="");const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=""),i=Ae(e,t,n)}async function Fe(){const e=await ce();if(!e?.userId){v=null;return}const t=await de(e.userId,B());if(!t){v=null;return}if(!pe(t,e.userId)){await ue(e.userId,t.state.problem),v=null;return}v=t,W=t.lastActivityAt??Date.now()}function U(){W=Date.now(),Date.now()-qe>st&&(qe=Date.now(),b())}async function pt(){if(i?.element&&(await C(i.element,{force:!0}),q=!0),await Re(),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),i?.element){const e=i.element;Ke(),e.classList.remove("guidemode-active","checkmode-active"),D(e),O(e)}}function gt(){const e=()=>U(),t=["mousemove","keydown","click","scroll","input"];for(const n of t)document.addEventListener(n,e,{passive:!0});se&&window.clearInterval(se),se=window.setInterval(async()=>{Date.now()-W<rt||!(await ce())?.userId||await pt()},6e4)}function ze(){T=null,N=!1,S=new Set,me=0,G=!1,R=null,fe=null,he=0,H=0,P=null}function D(e){e.classList.add("tutor-panel-locked"),X(e,!0)}function Be(e){e.classList.remove("tutor-panel-locked"),X(e,!1)}function mt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function ft(){document.getElementById("tutor-panel-loading")?.remove()}async function ht(e){i?.userId&&i.element&&await C(i.element,{force:!0}),v=null,ze();const t=M;i?.element&&i.element.remove(),i=null,M=!1,De(),await Fe(),t&&ne()}function bt(){ae&&window.clearInterval(ae),ae=window.setInterval(()=>{const e=z(window.location.href);e!==Ne&&(Ne=e,ht())},1e3)}function O(e){if(e.querySelector(".tutor-panel-auth"))return;const t=document.createElement("div");t.className="tutor-panel-auth",e.appendChild(t);const n=async s=>{const a=i?.userId??"",d=i?.problem??B();if(a&&a===s){q=!1,Be(e),t.remove(),b(e);return}a&&a!==s&&(await C(e,{force:!0}),ut(e,s,d));const l=await de(s,d);l&&pe(l,s)?(_e(e,l),await ue(s,l.state.problem),v=null):l&&await ue(s,l.state.problem),i&&(i.userId=s),q=!1,Be(e),t.remove(),b(e)},r=s=>{t.innerHTML=`
      <div class="auth-error"></div>
      <h4>Login Required</h4>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <input type="password" class="auth-password" placeholder="password" />
      <div class="auth-actions">
        <button type="button" class="auth-login">Login</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-signup">Sign up</button>
      </div>
    `;const a=t.querySelector(".auth-email"),d=t.querySelector(".auth-password"),l=t.querySelector(".auth-login"),c=t.querySelector(".auth-signup"),u=t.querySelector(".auth-error");s&&u&&(u.textContent=s,u.style.display="block");const g=()=>{u&&(u.style.display="none")};a?.addEventListener("input",g),d?.addEventListener("input",g),l?.addEventListener("click",async()=>{const x=a?.value.trim()??"",p=d?.value.trim()??"";if(!x||!p)return;const f=await h.runtime.sendMessage({action:"supabase-login",payload:{email:x,password:p}});f?.userId&&f?.jwt?await n(f.userId):u&&(u.textContent="Invalid creds",u.style.display="block")}),c?.addEventListener("click",()=>{o()})},o=()=>{t.innerHTML=`
      <h4>Create account</h4>
      <div class="auth-error">Signup failed</div>
      <div class="auth-name-row">
        <input type="text" class="auth-first-name" placeholder="First name" />
        <input type="text" class="auth-last-name" placeholder="Last name" />
      </div>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <input type="password" class="auth-password" placeholder="password" />
      <button type="button" class="auth-signup-submit">Sign up</button>
      <button type="button" class="auth-back">Back to login</button>
    `;const s=t.querySelector(".auth-first-name"),a=t.querySelector(".auth-last-name"),d=t.querySelector(".auth-email"),l=t.querySelector(".auth-password"),c=t.querySelector(".auth-signup-submit"),u=t.querySelector(".auth-error"),g=()=>{u&&(u.style.display="none")};s?.addEventListener("input",g),a?.addEventListener("input",g),d?.addEventListener("input",g),l?.addEventListener("input",g),c?.addEventListener("click",async()=>{const p=s?.value.trim()??"",f=a?.value.trim()??"",y=d?.value.trim()??"",w=l?.value.trim()??"";if(!p||!f||!y||!w)return;const I=await h.runtime.sendMessage({action:"supabase-signup",payload:{fname:p,lname:f,email:y,password:w}});I?.requiresVerification?r("Waiting for verification, check email"):I?.userId&&I?.jwt?await n(I.userId):u&&(u.style.display="block")}),t.querySelector(".auth-back")?.addEventListener("click",()=>{r()})};r()}function We(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
    <div class="tutor-panel-shellbar">
      <button class="tutor-panel-close">×</button>
    </div>

    <div class="tutor-panel-inner">
      <div class="tutor-panel-topbar">
        <div class="tutor-panel-actions">
          <button class="btn-guide-mode">Guide me</button>
          <button class="btn-help-mode">Check mode</button>
          <button class="btn-timer">Timer</button>
          <button class="btn-gotToWorkspace">Workspace</button>
        </div>
      </div>

      <div class="tutor-panel-content"></div>

      <div class="tutor-panel-inputbar">
        <textarea class="tutor-panel-prompt" placeholder="Ask anything..."></textarea>
        <button class="tutor-panel-send">Enter</button>
      </div>
    </div>
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const t=document.getElementById("tutor-widget");if(t){const n=t.getBoundingClientRect();e.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",e.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else e.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",e.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>e.classList.add("open"),10),Tt(e),e}function Ue(){i?.element&&(St(i.element),Et(i.element),De(),M=!1,b(i.element))}function qt(e){}function ge(){m&&(m.style.display="none")}function De(){m&&(m.style.display="block")}async function Oe(){}async function xt(){}let T=null,N=!1,S=new Set,me=0,G=!1,R=null,fe=null,he=0,H=0,P=null;function _(){return document.querySelector(".monaco-editor textarea.inputarea")}function Ge(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function Y(){S.clear(),N=!1,T!==null&&(window.clearTimeout(T),T=null)}async function be(e){const t=kt(),r=_()?.value??"",o=Array.from(S)[0]??1;if(!o){Y();return}const s=Date.now();if(fe===o&&s-he<250)return;if(fe=o,he=s,!t){Y();return}let a="";if(r&&(a=Ye(r,o)),!a.trim()&&o>1&&r){const l=Ye(r,o-1);l.trim()&&(a=l)}let d=t;try{const l=await h.runtime.sendMessage({type:"GET_MONACO_CODE"});l?.ok&&typeof l.code=="string"&&(d=l.code)}catch{}yt(a)&&(ee.push([d,a]),wt()),Y()}function yt(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Ye(e,t){return e.split(`
`)[t-1]??""}async function wt(){if(!G){G=!0;try{for(;ee.length>0;){const[e,t]=ee.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),Me=!0;const n=await h.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:e,focusLine:t,rollingStateGuideMode:i?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const r=n.success?n.reply:null;r?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=r.state_update.lastEdit);const o=r?.nudge;i&&typeof o=="string"&&(i.content.push(`${o}
`),i.element!=null&&await we(i.element,"","guideAssistant",o),b(i.element??null));const s=r?.topics;if(s&&typeof s=="object")for(const[a,d]of Object.entries(s)){if(!d||typeof d!="object")continue;const l=d.thoughts_to_remember,c=d.pitfalls,u=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[],g=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];i&&(i.topics[a]??={thoughts_to_remember:[],pitfalls:[]},u.length>0&&i.topics[a].thoughts_to_remember.push(...u),g.length>0&&i.topics[a].pitfalls.push(...g))}i?.element&&b(i.element),Me=!1}}}finally{G=!1}}}function je(){if(!i?.guideModeEnabled)return;const e=_();if(!e)return;const t=e.value??"",n=e.selectionStart??0,r=Ge(t,n);!S.has(r)&&S.size==0&&S.add(r),N||(N=!0),T!==null&&window.clearTimeout(T),T=window.setTimeout(()=>{be()},1e4),!S.has(r)&&S.size==1&&be()}function Ve(){if(!i?.guideModeEnabled||!N)return;const e=_();if(!e)return;const t=e.value??"",n=e.selectionStart??0,r=Ge(t,n);if(R===null){R=r;return}r!==R&&(R=r,!S.has(r)&&S.size==1&&be())}function Xe(){const e=_();if(!e){me<5&&(me+=1,window.setTimeout(Xe,500));return}e.addEventListener("input",je),document.addEventListener("selectionchange",Ve)}function Ke(){const e=_();e&&(e.removeEventListener("input",je),document.removeEventListener("selectionchange",Ve))}function Nt(){}async function vt(e,t){const n=await h.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",action:"ask-anything",rollingHistory:i?.sessionRollingHistory.qaHistory,summary:i?.sessionRollingHistory.summary??"",query:t}});return n&&we(e,"","assistant",n),n||"Failure"}function xe(e){e.style.display="flex",e.classList.add("open")}function St(e){e.classList.remove("open"),e.style.display="none"}function Et(e){if(!m)return;const t=e.getBoundingClientRect(),n=m.getBoundingClientRect(),r=n.width||50,o=n.height||50,d=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-r-10,l=Math.max(10,Math.min(window.innerHeight/2-o/2,window.innerHeight-o-10));m.style.left=`${d}px`,m.style.top=`${l}px`,m.style.right="auto",m.style.bottom="auto",m.style.transform="",E={x:d,y:l},Oe()}function kt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function L(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function j(e){const t=e.split("`"),n=r=>{const o=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,d;for(;(d=o.exec(r))!==null;){s+=L(r.slice(a,d.index));const l=d[1];l.startsWith("**")?s+=`<strong>${L(l.slice(2,-2))}</strong>`:s+=`<code>${L(l.slice(1,-1))}</code>`,a=o.lastIndex}return s+=L(r.slice(a)),s};return t.map((r,o)=>o%2===1?`<code>${L(r)}</code>`:n(r)).join("")}function It(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",r=[],o=null;const s=()=>{r.length!==0&&(n+=`<p>${j(r.join(" "))}</p>`,r=[])},a=()=>{o&&(n+=`</${o}>`,o=null)};for(const d of t){const l=d.trim();if(!l){s(),a();continue}const c=l.match(/^(#{1,3})\s+(.*)$/);if(c){s(),a();const x=c[1].length;n+=`<h${x}>${j(c[2])}</h${x}>`;continue}const u=l.match(/^(\d+)[.)]\s+(.*)$/);if(u){s(),o&&o!=="ol"&&a(),o||(o="ol",n+="<ol>"),n+=`<li>${j(u[2])}</li>`;continue}const g=l.match(/^[-*]\s+(.*)$/);if(g){s(),o&&o!=="ul"&&a(),o||(o="ul",n+="<ul>"),n+=`<li>${j(g[1])}</li>`;continue}r.push(l)}return s(),a(),n}function k(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let r=0,o;for(;(o=n.exec(e))!==null;)o.index>r&&t.push({type:"text",content:e.slice(r,o.index)}),t.push({type:"code",content:o[2]??"",lang:o[1]??""}),r=n.lastIndex;return r<e.length&&t.push({type:"text",content:e.slice(r)}),t.map(s=>s.type==="code"?`<pre><code${s.lang?` data-lang="${L(s.lang)}"`:""}>${L(s.content.trimEnd())}</code></pre>`:It(s.content)).join("")}function V(e,t,n){const r=e.querySelector(".tutor-panel-content");if(!r)return null;const o=document.createElement("div");if(n==="assistant")o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=k(t);else if(n==="user")o.className="tutor-panel-message tutor-panel-message--user",o.textContent=t;else if(n==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=k(t),s.appendChild(o),r.appendChild(s),s}else if(n==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=k(t),s.appendChild(o),r.appendChild(s),s}else o.textContent=t;return r.append(o),r.scrollTop=o.offsetTop,o}function Qe(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const r of n){const o=e.querySelector(r);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function X(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const r of n){const o=e.querySelector(r);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function ye(e,t,n,r){return new Promise(o=>{let s=0;const a=2,d=e.offsetTop;t.scrollTop=d;let l=!0;const c=()=>{Math.abs(t.scrollTop-d)>8&&(l=!1)};t.addEventListener("scroll",c,{passive:!0});const u=()=>{s=Math.min(n.length,s+a);const g=n.slice(0,s);r?.render?e.innerHTML=r.render(g):e.textContent=g,l&&(t.scrollTop=d),s<n.length?window.setTimeout(u,12):(t.removeEventListener("scroll",c),o())};u()})}async function we(e,t,n,r){const o=et(r),s=e.querySelector(".tutor-panel-content");if(s&&typeof r=="string"){if(n==="assistant"){const a=V(e,"","assistant");if(!a)return;await ye(a,s,o,{render:k}),a.innerHTML=k(o),i?.sessionRollingHistory.qaHistory.push(`Assitant: ${r}`),i&&Ce(i.sessionRollingHistory),s.scrollTop=a.offsetTop,b(e)}else if(n==="guideAssistant"){const a=V(e,"","guideAssistant");if(!a)return;const d=a.querySelector(".tutor-panel-message--guideAssistant");if(!d)return;H===0&&a.classList.add("guide-start"),H+=1,P=a,await ye(d,s,o,{render:k}),d.innerHTML=k(o),s.scrollTop=a.offsetTop,b(e)}else if(n==="checkAssistant"){const a=V(e,"","checkAssistant");if(!a)return;const d=a.querySelector(".tutor-panel-message--checkAssistant");if(!d)return;a.classList.add("check-start"),await ye(d,s,o,{render:k}),d.innerHTML=k(o),a.classList.add("check-end"),s.scrollTop=a.offsetTop,b(e)}}}async function Mt(e,t){try{const n=await h.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:t,action:"check-code",problem_no:Le(i?.problem??""),problem_name:i?.problem??"",problem_url:i?.problemUrl??""}}),r=n?.resp;i&&typeof r=="string"&&i.content.push(`${r}
`),await we(e,"","checkAssistant",r);const o=n?.topics;if(o&&typeof o=="object")for(const[s,a]of Object.entries(o)){if(!a||typeof a!="object")continue;const d=a.thoughts_to_remember,l=a.pitfalls,c=Array.isArray(d)?d:typeof d=="string"&&d.trim()?[d.trim()]:[],u=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[];i&&(i.topics[s]??={thoughts_to_remember:[],pitfalls:[]},c.length>0&&i.topics[s].thoughts_to_remember.push(...c),u.length>0&&i.topics[s].pitfalls.push(...u))}return console.log("this is the object now: ",i?.topics),b(e),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Tt(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode"),r=e.querySelector(".btn-guide-mode"),o=e.querySelector(".btn-gotToWorkspace");r?.addEventListener("click",()=>{if(!i)return;i.guideModeEnabled=!i.guideModeEnabled;const p=e.querySelector(".btn-guide-mode");if(i.userId){const f=i.problem,y=Le(f);h.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:i.guideModeEnabled,sessionId:i.sessionId,problem_no:y,problem_name:f,problem_url:i.problemUrl}})}Qe(e,!0),e.classList.add("guidemode-active"),i.guideModeEnabled?(p?.classList.add("is-loading"),H=0,P=null,Xe()):(Ke(),P&&P.classList.add("guide-end"),Qe(e,!1),e.classList.remove("guidemode-active"),p?.classList.remove("is-loading")),b(e)}),o?.addEventListener("click",async()=>{await h.runtime.sendMessage({action:"go-to-workspace",payload:{url:it}})});const s=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const p=i.prompt;s&&(s.value=""),i&&(i.prompt=""),V(e,p,"user"),i.sessionRollingHistory.qaHistory.push(`user: ${p}`),Ce(i.sessionRollingHistory),b(e),await vt(e,p),i.prompt="",b(e)}else return void 0}),t?.addEventListener("mousedown",p=>{p.stopPropagation()}),t?.addEventListener("click",async()=>Ue()),n?.addEventListener("click",async()=>{const p=e.querySelector(".btn-help-mode");let f="";i&&(i.checkModeEnabled=!0,p?.classList.add("is-loading")),X(e,!0),e.classList.add("checkmode-active");try{const y=await h.runtime.sendMessage({type:"GET_MONACO_CODE"});y?.ok&&typeof y.code=="string"&&i&&(f=y.code);const w=await Mt(e,f);console.log("this is the response: ",w)}catch{}finally{i&&(i.checkModeEnabled=!1,p?.classList.remove("is-loading")),X(e,!1),e.classList.remove("checkmode-active"),b(e)}}),s?.addEventListener("input",()=>{i&&(i.prompt=s.value),b(e)});let d=!1,l=0,c=0;const u=e.querySelector(".tutor-panel-shellbar"),g=p=>{if(!d)return;const f=p.clientX-l,y=p.clientY-c,w=window.innerWidth-e.offsetWidth,I=window.innerHeight-e.offsetHeight,Z=Math.max(10,Math.min(f,w)),$=Math.max(10,Math.min(y,I));e.style.left=`${Z}px`,e.style.top=`${$}px`},x=()=>{d&&(d=!1,document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",x),i&&(i.position={x:e.offsetLeft,y:e.offsetTop}),b(e))};u?.addEventListener("mousedown",p=>{p.preventDefault(),d=!0,l=p.clientX-e.getBoundingClientRect().left,c=p.clientY-e.getBoundingClientRect().top,document.addEventListener("mousemove",g),document.addEventListener("mouseup",x)})}function K(e,...t){}const Lt={debug:(...e)=>K(console.debug,...e),log:(...e)=>K(console.log,...e),warn:(...e)=>K(console.warn,...e),error:(...e)=>K(console.error,...e)};class ve extends Event{constructor(t,n){super(ve.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=Se("wxt:locationchange")}function Se(e){return`${h?.runtime?.id}:content:${e}`}function At(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let r=new URL(location.href);r.href!==n.href&&(window.dispatchEvent(new ve(r,n)),n=r)},1e3))}}}class Q{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Se("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=At(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return h.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const r=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(t,n){const r=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(t){const n=requestAnimationFrame((...r)=>{this.isValid&&t(...r)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const r=requestIdleCallback((...o)=>{this.signal.aborted||t(...o)},n);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(t,n,r,o){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?Se(n):n,r,{...o,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Lt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:Q.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===Q.SCRIPT_STARTED_MESSAGE_TYPE,r=t.data?.contentScriptName===this.contentScriptName,o=!this.receivedMessageIds.has(t.data?.messageId);return n&&r&&o}listenForNewerScripts(t){let n=!0;const r=o=>{if(this.verifyScriptStartedEvent(o)){this.receivedMessageIds.add(o.data.messageId);const s=n;if(n=!1,s&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}}function Rt(){}function J(e,...t){}const Ct={debug:(...e)=>J(console.debug,...e),log:(...e)=>J(console.log,...e),warn:(...e)=>J(console.warn,...e),error:(...e)=>J(console.error,...e)};return(async()=>{try{const{main:e,...t}=Je,n=new Q("content",t);return await e(n)}catch(e){throw Ct.error('The content script "content" crashed on startup!',e),e}})()})();
content;