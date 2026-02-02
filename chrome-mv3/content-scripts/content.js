var content=(function(){"use strict";function qt(e){return e}const m=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,Ze={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Me()}):Me()}};let g=null,N=!1,C=!1,W={x:0,y:0},L={x:0,y:0},Ie,Le,P=null,oe=[];function Me(){console.log("The widget is being loaded to the page"),et(),wt(),mt(),xt(),dt(),ze().then(()=>{S?.panelOpen&&re()}),window.addEventListener("beforeunload",()=>{H(i?.element??null)})}function et(){const e=document.getElementById("tutor-widget");e&&e.remove(),g=document.createElement("div"),g.id="tutor-widget";let t;try{t=m.runtime.getURL("assets/logo2.png"),Ie=t}catch(o){console.warn("There is an error loading the logo: ",o),t=`chrome-extension://${m.runtime.id||chrome.runtime.id}/assets/logo2.png`,Ie=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",m.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),g.innerHTML=`
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
      background: linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgb(200, 208, 204);
      transition: all 0.3s ease;
      /*border: 2px solid rgba(255, 255, 255, 0.3); */
      backdrop-filter: blur(2px);
      position: relative;
    }
      .widget-main-button.dragging {
      cursor: grabbing !important;
      transform: scale(0.95);
      box-shadow: 
        0 8px 30px rgb(120, 126, 123),
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

  background: #F9FAFB;
  border-radius: 7px;
  border: none;
  box-shadow:
    0 14px 30px rgba(0,0,0,0.18),
    0 2px 6px rgba(0,0,0,0.10);

  z-index: 999997;
  font-family: 'Inconsolata', ui-monospace, "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace;
  font-size: 12px;

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
  background: #E5E7EB;
  /* background: rgba(205, 201, 203, 0.40); */
  /* background: rgba(200,208,204); */
  border-bottom: 1px solid rgba(95, 100, 80, 0.3);
  transition: background-color 160ms ease, box-shadow 160ms ease;
  cursor: grab;
  justify-content: flex-end;
}
.tutor-panel-shellbar:hover{
/* background: rgba(0, 0, 0, 0.03); */
/* background: rgba(255, 255, 255, 0.75); */
background: #D1D5DB;
}

.tutor-panel-shellbar:active{
  /* background: rgb(159, 172, 164); */
  background: #D1D5DB;
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
  color: rgba(0,0,0,0.65);
  font-size: 25px;
  line-height: 1;

  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 120ms ease, background 120ms ease;
}
.tutor-panel-close:hover{
  transform: scale(1.06);
  background: rgba(205, 201, 203, 0.3);
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
  background: rgb(159, 172, 164);
}


@keyframes hoverPulse {
  0%   { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
  50%  { transform: translateY(-2px); filter: brightness(1.02) saturate(1.15); }
  100% { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
}

.btn-guide-mode.is-loading{
  background: rgb(159, 172, 164);
  animation: hoverPulse 1.2s ease-in-out infinite;
}


.btn-help-mode.is-loading{
  background: rgb(159, 172, 164);
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
  inset: 0;
  transform: none;
  width: auto;
  padding: 60px 16px 16px;
  z-index: 2;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.5);
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
  font-size: 12px;
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
  max-width: 320px;
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
  font-weight: 600;
  cursor: pointer;
}
.tutor-panel-auth .auth-actions button{
  margin-top: 0;
}

.tutor-panel-auth input:focus{
  outline: none;
  box-shadow: none;
  border-color: rgba(0,0,0,0.5); /* keep same border */
}


.tutor-panel-auth .auth-back{
  margin-top: -6px; /* or 2px */
}

.tutor-panel-auth button{
  color: rgba(0,0,0,0.5)
}

.tutor-panel-auth button:hover {
  color: #000000; /* pick the text color you want on hover */
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
/*  padding-top: 7px; */
/*  padding: 6px 10px; */
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
/*
.tutor-panel-send:active{
  transform: translateY(0px);
} */

/* Align all text sizes to Enter button */
.tutor-panel *{
  font-size: inherit;
}

`,document.head.appendChild(n),document.body.appendChild(g);const r=document.getElementById("logo-image");r&&(r.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),r.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),r.style.display="none"})),nt()}function tt(e){const t=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!t)return e;const n=t[1].trim(),o=t[2].trim().split(";").map(a=>a.trim()).filter(Boolean);if(o.length===0)return e;const s=o.map(a=>`- ${a.replace(/\.$/,"")}`).join(`
`);return`${n}

**To fix**
${s}`}function nt(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},r=!1,o=!1;function s(u,d){if(!g)return{x:u,y:d};const p={width:50,height:50},b=window.innerWidth,w=window.innerHeight,h=10;let k=Math.max(h,u);k=Math.min(b-p.width-h,k);let E=Math.max(h,d);return E=Math.min(w-p.height-h,E),{x:k,y:E}}function a(u,d){if(!g)return{x:u,y:d};const p={width:50,height:50},b=window.innerWidth,w=window.innerHeight,h=20,k=u,E=b-(u+p.width),I=d,f=w-(d+p.height),y=Math.min(k,E,I,f);let v=u,A=d;return(u<0||u+p.width>b||d<0||d+p.height>w)&&(y===k?v=h:y===E?v=b-p.width-h:y===I?A=h:y===f&&(A=w-p.height-h)),{x:v,y:A}}e.addEventListener("mousedown",u=>{u.preventDefault(),t=Date.now(),n={x:u.clientX,y:u.clientY},r=!1;const d=g.getBoundingClientRect();W.x=u.clientX-d.left,W.y=u.clientY-d.top,e.classList.add("dragging"),document.addEventListener("mousemove",l),document.addEventListener("mouseup",c)}),e.addEventListener("click",u=>{if(o){o=!1;return}!N&&!r&&(u.preventDefault(),u.stopPropagation(),C?Ue():re())});function l(u){const d=Date.now()-t,p=Math.sqrt(Math.pow(u.clientX-n.x,2)+Math.pow(u.clientY-n.y,2));if(!N&&(p>3||d>100)&&(N=!0,r=!0,document.body.style.cursor="grabbing"),N){const b=u.clientX-W.x,w=u.clientY-W.y,h=s(b,w);g.style.transform=`translate(${h.x}px, ${h.y}px)`,g.style.left="0",g.style.top="0",L={x:h.x,y:h.y}}}function c(){if(document.removeEventListener("mousemove",l),document.removeEventListener("mouseup",c),e&&e.classList.remove("dragging"),document.body.style.cursor="",N){o=!0;const u=a(L.x,L.y);u.x!==L.x||u.y!==L.y?(g.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",g.style.left=u.x+"px",g.style.top=u.y+"px",g.style.transform="",setTimeout(()=>{g&&(g.style.transition="")},15e3),L=u):(g.style.left=L.x+"px",g.style.top=L.y+"px",g.style.transform=""),Ge()}N=!1,r=!1}}function U(e){try{const{origin:t,pathname:n}=new URL(e),r=n.match(/^\/problems\/[^/]+/);return r?`${t}${r[0]}`:`${t}${n}`}catch{return e}}function O(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Ae(e){const t=e.match(/^\s*(\d+)/);if(!t)return null;const n=Number(t[1]);return Number.isFinite(n)?n:null}function ie(e,t){return`${$e}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function ot(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(n=>n.getAttribute("href")).filter(n=>!!n).map(n=>n.replace("/tag/","").replace("/","").replace("-","_"));return Object.fromEntries(Array.from(new Set(t)).map(n=>[n,{thoughts_to_remember:[],pitfalls:[]}]))}function Ce(e,t,n){const r=n??O(),o=crypto.randomUUID();return{element:e,sessionId:o,userId:t,problem:r,problemUrl:U(window.location.href),topics:ot(),content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function re(){const e=await pe(),t=ut(e),n=e?.userId??"";if(t&&await Re(),i&&i.element&&document.body.contains(i.element)){ve(i.element),he(),C=!0,i.element,(!n||t)&&(j(i.element),X(i.element)),Y(),x(i.element);return}if(i?.userId){ft();try{await H(i.element??null,{force:!0})}finally{ht()}}if(!S&&n){const o=await ge(n,O());o&&fe(o,n)&&(S=o)}if(S){const o=We();Fe(o,S),S=null,ve(o),he(),C=!0,Y(),(!n||t)&&(j(o),X(o)),x(o);return}const r=We();if(!r){console.log("There was an error creating a panel");return}i=Ce(r,n),ve(r),he(),C=!0,Y(),x(r),i&&(!n||t?(j(r),X(r)):i.userId=n,setTimeout(()=>{const o=r.querySelector(".tutor-panel-prompt");o&&(o.focus(),o.setSelectionRange(o.value.length,o.value.length))},100))}let se=!1;async function it(e){if(se||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);se=!0;try{const n=await m.runtime.sendMessage({action:"summarize-history",payload:{sessionId:i?.sessionId??"",summarize:t,summary:e.summary}});typeof n=="string"&&(e.summary=n)}finally{se=!1}}function Pe(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),it(e)}let i=null;const ae="vibetutor-auth",$e="vibetutor-session",rt="http://localhost:3000/auth/bridge",st=960*60*1e3,at=15e3,qe=1440*60*1e3,lt=1800*1e3,ct=`${$e}:`;let S=null,G=Date.now(),Ne=0,_=!1,le=null,ce=null,ue=null,He=U(window.location.href),de=null;async function pe(){return(await m.storage.local.get(ae))[ae]??null}function ut(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Re(){await m.storage.local.remove(ae),await m.runtime.sendMessage({action:"clear-auth"})}async function H(e,t){if(!i||!i.userId||_&&!t?.force)return;const n=e?.querySelector(".tutor-panel-content")??i.element?.querySelector(".tutor-panel-content"),r=ie(i.userId,i.problem),o={state:{sessionId:i.sessionId,userId:i.userId,content:i.content,problem:i.problem,problemUrl:i.problemUrl,topics:i.topics,prompt:i.prompt,position:i.position,size:i.size,guideModeEnabled:i.guideModeEnabled,checkModeEnabled:i.checkModeEnabled,timerEnabled:i.timerEnabled,rollingStateGuideMode:i.rollingStateGuideMode,sessionRollingHistory:i.sessionRollingHistory},panelOpen:C,contentHtml:n?.innerHTML??"",lastActivityAt:G};await m.storage.local.set({[r]:o})}function x(e){_||le||(le=window.setTimeout(()=>{le=null,H(e)},500))}async function ge(e,t){const n=ie(e,t),o=(await m.storage.local.get(n))[n]??null;return o?Date.now()-(o.lastActivityAt??0)>qe?(await m.storage.local.remove(n),null):o:null}async function me(e,t){const n=ie(e,t);await m.storage.local.remove(n)}async function _e(){const e=await m.storage.local.get(null),t=Date.now(),n=[];for(const[r,o]of Object.entries(e)){if(!r.startsWith(ct))continue;const a=o?.lastActivityAt??0;t-a>qe&&n.push(r)}n.length>0&&await m.storage.local.remove(n)}function dt(){_e(),de&&window.clearInterval(de),de=window.setInterval(()=>{_e()},lt)}function fe(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const n=U(window.location.href);return e.state.problemUrl===n}function Fe(e,t){i={...t.state,element:e};const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML=t.contentHtml||"");const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=i.prompt??""),i.position&&(e.style.left=`${i.position.x}px`,e.style.top=`${i.position.y}px`),i.size&&(e.style.width=`${i.size.width}px`,e.style.height=`${i.size.height}px`);const o=e.querySelectorAll(".guide-wrapper");B=o.length,R=o.length>0?o[o.length-1]:null}function pt(e,t,n){Be();const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML="");const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=""),i=Ce(e,t,n)}async function ze(){const e=await pe();if(!e?.userId){S=null;return}const t=await ge(e.userId,O());if(!t){S=null;return}if(!fe(t,e.userId)){await me(e.userId,t.state.problem),S=null;return}S=t,G=t.lastActivityAt??Date.now()}function Y(){G=Date.now(),Date.now()-Ne>at&&(Ne=Date.now(),x())}async function gt(){if(i?.element&&(await H(i.element,{force:!0}),_=!0),await Re(),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),i?.element){const e=i.element;Qe(),e.classList.remove("guidemode-active","checkmode-active"),j(e),X(e)}}function mt(){const e=()=>Y(),t=["mousemove","keydown","click","scroll","input"];for(const n of t)document.addEventListener(n,e,{passive:!0});ce&&window.clearInterval(ce),ce=window.setInterval(async()=>{Date.now()-G<st||!(await pe())?.userId||await gt()},6e4)}function Be(){$=null,F=!1,T=new Set,be=0,V=!1,z=null,xe=null,we=0,B=0,R=null}function j(e){e.classList.add("tutor-panel-locked"),Z(e,!0)}function De(e){e.classList.remove("tutor-panel-locked"),Z(e,!1)}function ft(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function ht(){document.getElementById("tutor-panel-loading")?.remove()}async function bt(e){i?.userId&&i.element&&await H(i.element,{force:!0}),S=null,Be();const t=C;i?.element&&i.element.remove(),i=null,C=!1,Oe(),await ze(),t&&re()}function xt(){ue&&window.clearInterval(ue),ue=window.setInterval(()=>{const e=U(window.location.href);e!==He&&(He=e,bt())},1e3)}function X(e){if(e.querySelector(".tutor-panel-auth"))return;const t=document.createElement("div");t.className="tutor-panel-auth",e.appendChild(t);const n=async s=>{const a=i?.userId??"",l=i?.problem??O();if(a&&a===s){_=!1,De(e),t.remove(),x(e);return}a&&a!==s&&(await H(e,{force:!0}),pt(e,s,l));const c=await ge(s,l);c&&fe(c,s)?(Fe(e,c),await me(s,c.state.problem),S=null):c&&await me(s,c.state.problem),i&&(i.userId=s),_=!1,De(e),t.remove(),x(e)},r=s=>{t.innerHTML=`
      <div class="auth-error"></div>
      <h4>Login Required</h4>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <input type="password" class="auth-password" placeholder="password" />
      <div class="auth-actions">
        <button type="button" class="auth-login">Login</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-signup">Sign up</button>
      </div>
    `;const a=t.querySelector(".auth-email"),l=t.querySelector(".auth-password"),c=t.querySelector(".auth-login"),u=t.querySelector(".auth-signup"),d=t.querySelector(".auth-error");s&&d&&(d.textContent=s,d.style.display="block");const p=()=>{d&&(d.style.display="none")};a?.addEventListener("input",p),l?.addEventListener("input",p),c?.addEventListener("click",async()=>{const b=a?.value.trim()??"",w=l?.value.trim()??"";if(!b||!w)return;const h=await m.runtime.sendMessage({action:"supabase-login",payload:{email:b,password:w}});h?.userId&&h?.jwt?await n(h.userId):d&&(d.textContent="Invalid creds",d.style.display="block")}),u?.addEventListener("click",()=>{o()})},o=()=>{t.innerHTML=`
      <div class="auth-error">Signup failed</div>
      <h4>Create account</h4>
      <div class="auth-name-row">
        <input type="text" class="auth-first-name" placeholder="First name" />
        <input type="text" class="auth-last-name" placeholder="Last name" />
      </div>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <input type="password" class="auth-password" placeholder="password" />
      <div class="auth-actions">
        <button type="button" class="auth-signup-submit">Sign up</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-back">Back to login</button>
      </div>
    `;const s=t.querySelector(".auth-first-name"),a=t.querySelector(".auth-last-name"),l=t.querySelector(".auth-email"),c=t.querySelector(".auth-password"),u=t.querySelector(".auth-signup-submit"),d=t.querySelector(".auth-error"),p=()=>{d&&(d.style.display="none")};s?.addEventListener("input",p),a?.addEventListener("input",p),l?.addEventListener("input",p),c?.addEventListener("input",p),u?.addEventListener("click",async()=>{const w=s?.value.trim()??"",h=a?.value.trim()??"",k=l?.value.trim()??"",E=c?.value.trim()??"";if(!w||!h||!k||!E)return;const I=await m.runtime.sendMessage({action:"supabase-signup",payload:{fname:w,lname:h,email:k,password:E}});I?.requiresVerification?r("Waiting for verification, check email"):I?.userId&&I?.jwt?await n(I.userId):d&&(d.style.display="block")}),t.querySelector(".auth-back")?.addEventListener("click",()=>{r()})};r()}function We(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
        <button class="tutor-panel-send">Send</button>
      </div>
    </div>
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const t=40,n=Math.round(window.innerHeight*.38),r=window.innerWidth-e.offsetWidth-20,o=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(t,r))}px`,e.style.top=`${Math.max(20,Math.min(n,o))}px`,setTimeout(()=>e.classList.add("open"),10),Mt(e),e}function Ue(){i?.element&&(kt(i.element),Et(i.element),Oe(),C=!1,x(i.element))}function Ht(e){}function he(){g&&(g.style.display="none")}function Oe(){g&&(g.style.display="block")}async function Ge(){}async function wt(){}let $=null,F=!1,T=new Set,be=0,V=!1,z=null,xe=null,we=0,B=0,R=null;function D(){return document.querySelector(".monaco-editor textarea.inputarea")}function Ye(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function K(){T.clear(),F=!1,$!==null&&(window.clearTimeout($),$=null)}async function ye(e){const t=Tt(),r=D()?.value??"",o=Array.from(T)[0]??1;if(!o){K();return}const s=Date.now();if(xe===o&&s-we<250)return;if(xe=o,we=s,!t){K();return}let a="";if(r&&(a=je(r,o)),!a.trim()&&o>1&&r){const c=je(r,o-1);c.trim()&&(a=c)}let l=t;try{const c=await m.runtime.sendMessage({type:"GET_MONACO_CODE"});c?.ok&&typeof c.code=="string"&&(l=c.code)}catch{}yt(a)&&(oe.push([l,a]),vt()),K()}function yt(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function je(e,t){return e.split(`
`)[t-1]??""}async function vt(){if(!V){V=!0;try{for(;oe.length>0;){const[e,t]=oe.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),Le=!0;const n=await m.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:e,focusLine:t,rollingStateGuideMode:i?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const r=n.success?n.reply:null;r?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=r.state_update.lastEdit);const o=r?.nudge;i&&typeof o=="string"&&(i.content.push(`${o}
`),i.element!=null&&await ke(i.element,"","guideAssistant",o),x(i.element??null));const s=r?.topics;if(s&&typeof s=="object")for(const[a,l]of Object.entries(s)){if(!l||typeof l!="object")continue;const c=l.thoughts_to_remember,u=l.pitfalls,d=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],p=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[];i&&(i.topics[a]??={thoughts_to_remember:[],pitfalls:[]},d.length>0&&i.topics[a].thoughts_to_remember.push(...d),p.length>0&&i.topics[a].pitfalls.push(...p))}i?.element&&x(i.element),Le=!1}}}finally{V=!1}}}function Xe(){if(!i?.guideModeEnabled)return;const e=D();if(!e)return;const t=e.value??"",n=e.selectionStart??0,r=Ye(t,n);!T.has(r)&&T.size==0&&T.add(r),F||(F=!0),$!==null&&window.clearTimeout($),$=window.setTimeout(()=>{ye()},1e4),!T.has(r)&&T.size==1&&ye()}function Ve(){if(!i?.guideModeEnabled||!F)return;const e=D();if(!e)return;const t=e.value??"",n=e.selectionStart??0,r=Ye(t,n);if(z===null){z=r;return}r!==z&&(z=r,!T.has(r)&&T.size==1&&ye())}function Ke(){const e=D();if(!e){be<5&&(be+=1,window.setTimeout(Ke,500));return}e.addEventListener("input",Xe),document.addEventListener("selectionchange",Ve)}function Qe(){const e=D();e&&(e.removeEventListener("input",Xe),document.removeEventListener("selectionchange",Ve))}function Rt(){}async function St(e,t){const n=await m.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",action:"ask-anything",rollingHistory:i?.sessionRollingHistory.qaHistory,summary:i?.sessionRollingHistory.summary??"",query:t}});return n&&ke(e,"","assistant",n),n||"Failure"}function ve(e){P!==null&&(window.clearTimeout(P),P=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function kt(e){e.classList.remove("open"),e.classList.add("closing"),P!==null&&window.clearTimeout(P),P=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),P=null},180)}function Et(e){if(!g)return;const t=e.getBoundingClientRect(),n=g.getBoundingClientRect(),r=n.width||50,o=n.height||50,l=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-r-10,c=Math.max(10,Math.min(window.innerHeight/2-o/2,window.innerHeight-o-10));g.style.left=`${l}px`,g.style.top=`${c}px`,g.style.right="auto",g.style.bottom="auto",g.style.transform="",L={x:l,y:c},Ge()}function Tt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(e){const t=e.split("`"),n=r=>{const o=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,l;for(;(l=o.exec(r))!==null;){s+=q(r.slice(a,l.index));const c=l[1];c.startsWith("**")?s+=`<strong>${q(c.slice(2,-2))}</strong>`:s+=`<code>${q(c.slice(1,-1))}</code>`,a=o.lastIndex}return s+=q(r.slice(a)),s};return t.map((r,o)=>o%2===1?`<code>${q(r)}</code>`:n(r)).join("")}function It(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",r=[],o=null;const s=()=>{r.length!==0&&(n+=`<p>${Q(r.join(" "))}</p>`,r=[])},a=()=>{o&&(n+=`</${o}>`,o=null)};for(const l of t){const c=l.trim();if(!c){s(),a();continue}const u=c.match(/^(#{1,3})\s+(.*)$/);if(u){s(),a();const b=u[1].length;n+=`<h${b}>${Q(u[2])}</h${b}>`;continue}const d=c.match(/^(\d+)[.)]\s+(.*)$/);if(d){s(),o&&o!=="ol"&&a(),o||(o="ol",n+="<ol>"),n+=`<li>${Q(d[2])}</li>`;continue}const p=c.match(/^[-*]\s+(.*)$/);if(p){s(),o&&o!=="ul"&&a(),o||(o="ul",n+="<ul>"),n+=`<li>${Q(p[1])}</li>`;continue}r.push(c)}return s(),a(),n}function M(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let r=0,o;for(;(o=n.exec(e))!==null;)o.index>r&&t.push({type:"text",content:e.slice(r,o.index)}),t.push({type:"code",content:o[2]??"",lang:o[1]??""}),r=n.lastIndex;return r<e.length&&t.push({type:"text",content:e.slice(r)}),t.map(s=>s.type==="code"?`<pre><code${s.lang?` data-lang="${q(s.lang)}"`:""}>${q(s.content.trimEnd())}</code></pre>`:It(s.content)).join("")}function J(e,t,n){const r=e.querySelector(".tutor-panel-content");if(!r)return null;const o=document.createElement("div");if(n==="assistant")o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=M(t);else if(n==="user")o.className="tutor-panel-message tutor-panel-message--user",o.textContent=t;else if(n==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=M(t),s.appendChild(o),r.appendChild(s),s}else if(n==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=M(t),s.appendChild(o),r.appendChild(s),s}else o.textContent=t;return r.append(o),r.scrollTop=o.offsetTop,o}function Je(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const r of n){const o=e.querySelector(r);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function Z(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const r of n){const o=e.querySelector(r);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function Se(e,t,n,r){return new Promise(o=>{let s=0;const a=2,l=e.offsetTop;t.scrollTop=l;let c=!0;const u=()=>{Math.abs(t.scrollTop-l)>8&&(c=!1)};t.addEventListener("scroll",u,{passive:!0});const d=()=>{s=Math.min(n.length,s+a);const p=n.slice(0,s);r?.render?e.innerHTML=r.render(p):e.textContent=p,c&&(t.scrollTop=l),s<n.length?window.setTimeout(d,12):(t.removeEventListener("scroll",u),o())};d()})}async function ke(e,t,n,r){const o=tt(r),s=e.querySelector(".tutor-panel-content");if(s&&typeof r=="string"){if(n==="assistant"){const a=J(e,"","assistant");if(!a)return;await Se(a,s,o,{render:M}),a.innerHTML=M(o),i?.sessionRollingHistory.qaHistory.push(`Assitant: ${r}`),i&&Pe(i.sessionRollingHistory),s.scrollTop=a.offsetTop,x(e)}else if(n==="guideAssistant"){const a=J(e,"","guideAssistant");if(!a)return;const l=a.querySelector(".tutor-panel-message--guideAssistant");if(!l)return;B===0&&a.classList.add("guide-start"),B+=1,R=a,await Se(l,s,o,{render:M}),l.innerHTML=M(o),s.scrollTop=a.offsetTop,x(e)}else if(n==="checkAssistant"){const a=J(e,"","checkAssistant");if(!a)return;const l=a.querySelector(".tutor-panel-message--checkAssistant");if(!l)return;a.classList.add("check-start"),await Se(l,s,o,{render:M}),l.innerHTML=M(o),a.classList.add("check-end"),s.scrollTop=a.offsetTop,x(e)}}}async function Lt(e,t){try{const n=await m.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:t,action:"check-code",problem_no:Ae(i?.problem??""),problem_name:i?.problem??"",problem_url:i?.problemUrl??""}}),r=n?.resp;i&&typeof r=="string"&&i.content.push(`${r}
`),await ke(e,"","checkAssistant",r);const o=n?.topics;if(o&&typeof o=="object")for(const[s,a]of Object.entries(o)){if(!a||typeof a!="object")continue;const l=a.thoughts_to_remember,c=a.pitfalls,u=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[],d=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];i&&(i.topics[s]??={thoughts_to_remember:[],pitfalls:[]},u.length>0&&i.topics[s].thoughts_to_remember.push(...u),d.length>0&&i.topics[s].pitfalls.push(...d))}return console.log("this is the object now: ",i?.topics),x(e),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Mt(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode"),r=e.querySelector(".btn-guide-mode"),o=e.querySelector(".btn-gotToWorkspace");r?.addEventListener("click",()=>{if(!i)return;i.guideModeEnabled=!i.guideModeEnabled;const f=e.querySelector(".btn-guide-mode");if(i.userId){const y=i.problem,v=Ae(y);m.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:i.guideModeEnabled,sessionId:i.sessionId,problem_no:v,problem_name:y,problem_url:i.problemUrl}})}Je(e,!0),e.classList.add("guidemode-active"),i.guideModeEnabled?(f?.classList.add("is-loading"),B=0,R=null,Ke()):(Qe(),R&&R.classList.add("guide-end"),Je(e,!1),e.classList.remove("guidemode-active"),f?.classList.remove("is-loading")),x(e)}),o?.addEventListener("click",async()=>{await m.runtime.sendMessage({action:"go-to-workspace",payload:{url:rt}})});const s=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const f=i.prompt;s&&(s.value=""),i&&(i.prompt=""),J(e,f,"user"),i.sessionRollingHistory.qaHistory.push(`user: ${f}`),Pe(i.sessionRollingHistory),x(e),await St(e,f),i.prompt="",x(e)}else return void 0}),t?.addEventListener("mousedown",f=>{f.stopPropagation()}),t?.addEventListener("click",async()=>Ue()),n?.addEventListener("click",async()=>{const f=e.querySelector(".btn-help-mode");let y="";i&&(i.checkModeEnabled=!0,f?.classList.add("is-loading")),Z(e,!0),e.classList.add("checkmode-active");try{const v=await m.runtime.sendMessage({type:"GET_MONACO_CODE"});v?.ok&&typeof v.code=="string"&&i&&(y=v.code);const A=await Lt(e,y);console.log("this is the response: ",A)}catch{}finally{i&&(i.checkModeEnabled=!1,f?.classList.remove("is-loading")),Z(e,!1),e.classList.remove("checkmode-active"),x(e)}}),s?.addEventListener("input",()=>{i&&(i.prompt=s.value),x(e)});let l=!1,c=0,u=0,d=0,p=0,b=null;const w=.6,h=e.querySelector(".tutor-panel-shellbar"),k=()=>{if(!l){b=null;return}const f=e.offsetLeft,y=e.offsetTop,v=f+(d-f)*w,A=y+(p-y)*w;e.style.left=`${v}px`,e.style.top=`${A}px`,b=requestAnimationFrame(k)},E=f=>{if(!l)return;const y=f.clientX-c,v=f.clientY-u,A=window.innerWidth-e.offsetWidth,$t=window.innerHeight-e.offsetHeight;d=Math.max(10,Math.min(y,A)),p=Math.max(10,Math.min(v,$t)),b===null&&(b=requestAnimationFrame(k))},I=()=>{l&&(l=!1,document.removeEventListener("mousemove",E),document.removeEventListener("mouseup",I),b!==null&&(cancelAnimationFrame(b),b=null),e.style.left=`${d}px`,e.style.top=`${p}px`,i&&(i.position={x:e.offsetLeft,y:e.offsetTop}),x(e))};h?.addEventListener("mousedown",f=>{f.preventDefault(),l=!0,c=f.clientX-e.getBoundingClientRect().left,u=f.clientY-e.getBoundingClientRect().top,d=e.offsetLeft,p=e.offsetTop,document.addEventListener("mousemove",E),document.addEventListener("mouseup",I)})}function ee(e,...t){}const At={debug:(...e)=>ee(console.debug,...e),log:(...e)=>ee(console.log,...e),warn:(...e)=>ee(console.warn,...e),error:(...e)=>ee(console.error,...e)};class Ee extends Event{constructor(t,n){super(Ee.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=Te("wxt:locationchange")}function Te(e){return`${m?.runtime?.id}:content:${e}`}function Ct(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let r=new URL(location.href);r.href!==n.href&&(window.dispatchEvent(new Ee(r,n)),n=r)},1e3))}}}class te{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Te("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Ct(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return m.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const r=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(t,n){const r=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(t){const n=requestAnimationFrame((...r)=>{this.isValid&&t(...r)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const r=requestIdleCallback((...o)=>{this.signal.aborted||t(...o)},n);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(t,n,r,o){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?Te(n):n,r,{...o,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),At.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:te.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===te.SCRIPT_STARTED_MESSAGE_TYPE,r=t.data?.contentScriptName===this.contentScriptName,o=!this.receivedMessageIds.has(t.data?.messageId);return n&&r&&o}listenForNewerScripts(t){let n=!0;const r=o=>{if(this.verifyScriptStartedEvent(o)){this.receivedMessageIds.add(o.data.messageId);const s=n;if(n=!1,s&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}}function _t(){}function ne(e,...t){}const Pt={debug:(...e)=>ne(console.debug,...e),log:(...e)=>ne(console.log,...e),warn:(...e)=>ne(console.warn,...e),error:(...e)=>ne(console.error,...e)};return(async()=>{try{const{main:e,...t}=Ze,n=new te("content",t);return await e(n)}catch(e){throw Pt.error('The content script "content" crashed on startup!',e),e}})()})();
content;