var content=(function(){"use strict";function Ht(e){return e}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,et={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Ae()}):Ae()}};let g=null,N=!1,A=!1,Y={x:0,y:0},M={x:0,y:0},re,P=null,ie=[];function Ae(){console.log("The widget is being loaded to the page"),tt(),vt(),ft(),yt(),pt(),Be().then(()=>{E?.panelOpen&&ae()}),window.addEventListener("beforeunload",()=>{H(i?.element??null)})}function tt(){const e=document.getElementById("tutor-widget");e&&e.remove(),g=document.createElement("div"),g.id="tutor-widget",g.innerHTML=`
  <div class="widget-main-button" id="main-button">
  </div>
  `;const t=document.createElement("style");t.textContent=`
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
      color: #ffffff;
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
  color: rgba(0,0,0,0.55);
  cursor: pointer;
}
.tutor-panel-auth .auth-password-toggle:hover{
  color: rgba(0,0,0,0.85);
}
.tutor-panel-auth .auth-password-toggle svg{
  width: 18px;
  height: 18px;
  stroke: currentColor;
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

`,document.head.appendChild(t),document.body.appendChild(g),ot()}function nt(e){const t=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!t)return e;const n=t[1].trim(),r=t[2].trim().split(";").map(s=>s.trim()).filter(Boolean);if(r.length===0)return e;const a=r.map(s=>`- ${s.replace(/\.$/,"")}`).join(`
`);return`${n}

**To fix**
${a}`}function ot(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},o=!1,r=!1;function a(l,p){if(!g)return{x:l,y:p};const m={width:50,height:50},d=window.innerWidth,y=window.innerHeight,x=10;let S=Math.max(x,l);S=Math.min(d-m.width-x,S);let v=Math.max(x,p);return v=Math.min(y-m.height-x,v),{x:S,y:v}}function s(l,p){if(!g)return{x:l,y:p};const m={width:50,height:50},d=window.innerWidth,y=window.innerHeight,x=20,S=l,v=d-(l+m.width),C=p,f=y-(p+m.height),h=Math.min(S,v,C,f);let k=l,I=p;return(l<0||l+m.width>d||p<0||p+m.height>y)&&(h===S?k=x:h===v?k=d-m.width-x:h===C?I=x:h===f&&(I=y-m.height-x)),{x:k,y:I}}e.addEventListener("mousedown",l=>{l.preventDefault(),t=Date.now(),n={x:l.clientX,y:l.clientY},o=!1;const p=g.getBoundingClientRect();Y.x=l.clientX-p.left,Y.y=l.clientY-p.top,e.classList.add("dragging"),document.addEventListener("mousemove",c),document.addEventListener("mouseup",u)}),e.addEventListener("click",l=>{if(r){r=!1;return}!N&&!o&&(l.preventDefault(),l.stopPropagation(),A?Oe():ae())});function c(l){const p=Date.now()-t,m=Math.sqrt(Math.pow(l.clientX-n.x,2)+Math.pow(l.clientY-n.y,2));if(!N&&(m>3||p>100)&&(N=!0,o=!0,document.body.style.cursor="grabbing"),N){const d=l.clientX-Y.x,y=l.clientY-Y.y,x=a(d,y);g.style.transform=`translate(${x.x}px, ${x.y}px)`,g.style.left="0",g.style.top="0",M={x:x.x,y:x.y}}}function u(){if(document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",u),e&&e.classList.remove("dragging"),document.body.style.cursor="",N){r=!0;const l=s(M.x,M.y);l.x!==M.x||l.y!==M.y?(g.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",g.style.left=l.x+"px",g.style.top=l.y+"px",g.style.transform="",setTimeout(()=>{g&&(g.style.transition="")},15e3),M=l):(g.style.left=M.x+"px",g.style.top=M.y+"px",g.style.transform=""),Ye()}N=!1,o=!1}}function j(e){try{const{origin:t,pathname:n}=new URL(e),o=n.match(/^\/problems\/[^/]+/);return o?`${t}${o[0]}`:`${t}${n}`}catch{return e}}function X(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Ce(e){const t=e.match(/^\s*(\d+)/);if(!t)return null;const n=Number(t[1]);return Number.isFinite(n)?n:null}function se(e,t){return`${$e}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function rt(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(n=>n.getAttribute("href")).filter(n=>!!n).map(n=>n.replace("/tag/","").replace("/","").replace("-","_"));return Object.fromEntries(Array.from(new Set(t)).map(n=>[n,{thoughts_to_remember:[],pitfalls:[]}]))}function Pe(e,t,n){const o=n??X(),r=crypto.randomUUID();return{element:e,sessionId:r,userId:t,problem:o,problemUrl:j(window.location.href),topics:rt(),content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:o,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function ae(){const e=await me(),t=dt(e),n=e?.userId??"";if(t&&await Fe(),i&&i.element&&document.body.contains(i.element)){Ee(i.element),xe(),A=!0,i.element,(!n||t)&&(R(i.element),B(i.element)),K(),w(i.element);return}if(i?.userId){bt();try{await H(i.element??null,{force:!0})}finally{wt()}}if(!E&&n){const r=await fe(n,X());r&&be(r,n)&&(E=r)}if(E){const r=Ue();ze(r,E),E=null,Ee(r),xe(),A=!0,K(),(!n||t)&&(R(r),B(r)),w(r);return}const o=Ue();if(!o){console.log("There was an error creating a panel");return}i=Pe(o,n),Ee(o),xe(),A=!0,K(),w(o),i&&(!n||t?(R(o),B(o)):i.userId=n,setTimeout(()=>{const r=o.querySelector(".tutor-panel-prompt");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},100))}let le=!1;async function it(e){if(le||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);le=!0;try{const n=await b.runtime.sendMessage({action:"summarize-history",payload:{sessionId:i?.sessionId??"",summarize:t,summary:e.summary}});if(z(i?.element??null,n,{silent:!0}))return;const o=typeof n=="string"?n:n?.reply;typeof o=="string"&&(e.summary=o)}finally{le=!1}}function qe(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),it(e)}let i=null;const ce="vibetutor-auth",$e="vibetutor-session",st="http://localhost:3000/auth/bridge",at=960*60*1e3,lt=15e3,Ne=1440*60*1e3,ct=1800*1e3,ut=`${$e}:`;let E=null,V=Date.now(),He=0,_=!1,ue=null,de=null,pe=null,Re=j(window.location.href),ge=null;async function me(){return(await b.storage.local.get(ce))[ce]??null}function dt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function Fe(){await b.storage.local.remove(ce),await b.runtime.sendMessage({action:"clear-auth"})}async function H(e,t){if(!i||!i.userId||_&&!t?.force)return;const n=e?.querySelector(".tutor-panel-content")??i.element?.querySelector(".tutor-panel-content"),o=se(i.userId,i.problem),r={state:{sessionId:i.sessionId,userId:i.userId,content:i.content,problem:i.problem,problemUrl:i.problemUrl,topics:i.topics,prompt:i.prompt,position:i.position,size:i.size,guideModeEnabled:i.guideModeEnabled,checkModeEnabled:i.checkModeEnabled,timerEnabled:i.timerEnabled,rollingStateGuideMode:i.rollingStateGuideMode,sessionRollingHistory:i.sessionRollingHistory},panelOpen:A,contentHtml:n?.innerHTML??"",lastActivityAt:V};await b.storage.local.set({[o]:r})}function w(e){_||ue||(ue=window.setTimeout(()=>{ue=null,H(e)},500))}async function fe(e,t){const n=se(e,t),r=(await b.storage.local.get(n))[n]??null;return r?Date.now()-(r.lastActivityAt??0)>Ne?(await b.storage.local.remove(n),null):r:null}async function he(e,t){const n=se(e,t);await b.storage.local.remove(n)}async function _e(){const e=await b.storage.local.get(null),t=Date.now(),n=[];for(const[o,r]of Object.entries(e)){if(!o.startsWith(ut))continue;const s=r?.lastActivityAt??0;t-s>Ne&&n.push(o)}n.length>0&&await b.storage.local.remove(n)}function pt(){_e(),ge&&window.clearInterval(ge),ge=window.setInterval(()=>{_e()},ct)}function be(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const n=j(window.location.href);return e.state.problemUrl===n}function ze(e,t){i={...t.state,element:e};const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML=t.contentHtml||"");const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=i.prompt??""),i.position&&(e.style.left=`${i.position.x}px`,e.style.top=`${i.position.y}px`),i.size&&(e.style.width=`${i.size.width}px`,e.style.height=`${i.size.height}px`);const r=e.querySelectorAll(".guide-wrapper");U=r.length,F=r.length>0?r[r.length-1]:null}function gt(e,t,n){De();const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML="");const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=""),i=Pe(e,t,n)}async function Be(){const e=await me();if(!e?.userId){E=null;return}const t=await fe(e.userId,X());if(!t){E=null;return}if(!be(t,e.userId)){await he(e.userId,t.state.problem),E=null;return}E=t,V=t.lastActivityAt??Date.now()}function K(){V=Date.now(),Date.now()-He>lt&&(He=Date.now(),w())}async function mt(){if(i?.element&&(await H(i.element,{force:!0}),_=!0),await Fe(),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),i?.element){const e=i.element;Ze(),e.classList.remove("guidemode-active","checkmode-active"),R(e),B(e)}}function ft(){const e=()=>K(),t=["mousemove","keydown","click","scroll","input"];for(const n of t)document.addEventListener(n,e,{passive:!0});de&&window.clearInterval(de),de=window.setInterval(async()=>{Date.now()-V<at||!(await me())?.userId||await mt()},6e4)}function De(){q=null,D=!1,T=new Set,ye=0,Q=!1,W=null,ve=null,Se=0,U=0,F=null}function R(e){e.classList.add("tutor-panel-locked"),ee(e,!0)}function We(e){e.classList.remove("tutor-panel-locked"),ee(e,!1)}function ht(e){return typeof e=="object"&&e!==null&&e.success===!1}function we(e,t){const n=e.querySelector(".tutor-panel-content");if(!n)return;const o=G(e,t,"assistant");o&&(n.scrollTop=o.offsetTop,w(e))}function z(e,t,n){if(!ht(t))return!1;if(n?.silent)return!0;const o=e??i?.element??null;if(!o)return!0;if(t.unauthorized||t.status===401||t.status===403||t.error&&/unauthorized/i.test(t.error))return R(o),B(o),we(o,"Session expired. Please log in again."),!0;if(t.timeout)return we(o,n?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const r=n?.serverMessage??"Internal server error. Please try again in a moment.";return n?.lockOnServerError!==!1&&R(o),we(o,r),!0}function bt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function wt(){document.getElementById("tutor-panel-loading")?.remove()}async function xt(e){i?.userId&&i.element&&await H(i.element,{force:!0}),E=null,De();const t=A;i?.element&&i.element.remove(),i=null,A=!1,Ge(),await Be(),t&&ae()}function yt(){pe&&window.clearInterval(pe),pe=window.setInterval(()=>{const e=j(window.location.href);e!==Re&&(Re=e,xt())},1e3)}function B(e){if(e.querySelector(".tutor-panel-auth"))return;const t=document.createElement("div");t.className="tutor-panel-auth",e.appendChild(t);const n=(s,c)=>{if(!s||!c)return;const u=()=>{const l=s.type==="password";c.setAttribute("aria-label",l?"Show password":"Hide password")};c.addEventListener("click",()=>{s.type=s.type==="password"?"text":"password",u(),s.focus(),s.setSelectionRange(s.value.length,s.value.length)}),u()},o=async s=>{const c=i?.userId??"",u=i?.problem??X();if(c&&c===s){_=!1,We(e),t.remove(),w(e);return}c&&c!==s&&(await H(e,{force:!0}),gt(e,s,u));const l=await fe(s,u);l&&be(l,s)?(ze(e,l),await he(s,l.state.problem),E=null):l&&await he(s,l.state.problem),i&&(i.userId=s),_=!1,We(e),t.remove(),w(e)},r=s=>{t.innerHTML=`
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
    `;const c=t.querySelector(".auth-email"),u=t.querySelector(".auth-password"),l=t.querySelector(".auth-login"),p=t.querySelector(".auth-signup"),m=t.querySelector(".auth-password-toggle"),d=t.querySelector(".auth-error");s&&d&&(d.textContent=s,d.style.display="block");const y=()=>{d&&(d.style.display="none")};c?.addEventListener("input",y),u?.addEventListener("input",y),n(u,m),l?.addEventListener("click",async()=>{const x=c?.value.trim()??"",S=u?.value.trim()??"";if(!x||!S)return;const v=await b.runtime.sendMessage({action:"supabase-login",payload:{email:x,password:S}});if(v?.success===!1){d&&(d.textContent=v.error||"Internal server error",d.style.display="block");return}v?.userId&&v?.jwt?await o(v.userId):d&&(d.textContent="Invalid creds",d.style.display="block")}),p?.addEventListener("click",()=>{a()})},a=()=>{t.innerHTML=`
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
      <div class="auth-actions">
        <button type="button" class="auth-signup-submit">Sign up</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-back">Back to login</button>
      </div>
    `;const s=t.querySelector(".auth-first-name"),c=t.querySelector(".auth-last-name"),u=t.querySelector(".auth-email"),l=t.querySelector(".auth-password"),p=t.querySelector(".auth-signup-submit"),m=t.querySelector(".auth-password-toggle"),d=t.querySelector(".auth-error"),y=()=>{d&&(d.style.display="none")};s?.addEventListener("input",y),c?.addEventListener("input",y),u?.addEventListener("input",y),l?.addEventListener("input",y),n(l,m),p?.addEventListener("click",async()=>{const S=s?.value.trim()??"",v=c?.value.trim()??"",C=u?.value.trim()??"",f=l?.value.trim()??"";if(!S||!v||!C||!f)return;const h=await b.runtime.sendMessage({action:"supabase-signup",payload:{fname:S,lname:v,email:C,password:f}});if(h?.success===!1){d&&(d.textContent=h.error||"Internal server error",d.style.display="block");return}h?.requiresVerification?r("Waiting for verification, check email"):h?.userId&&h?.jwt?await o(h.userId):d&&(d.style.display="block")}),t.querySelector(".auth-back")?.addEventListener("click",()=>{r()})};r()}function Ue(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
    <div class="tutor-panel-shellbar">
      <button class="tutor-panel-close">×</button>
    </div>

    <div class="tutor-panel-inner">
      <div class="tutor-panel-topbar">
        <div class="tutor-panel-actions">
          <button class="btn-guide-mode">Guide me</button>
          <button class="btn-help-mode">Check mode</button>
          <button class="btn-timer">Timer</button>
          <button class="btn-gotToWorkspace">Notes made</button>
        </div>
      </div>

      <div class="tutor-panel-content"></div>

      <div class="tutor-panel-inputbar">
        <textarea class="tutor-panel-prompt" placeholder="Ask anything..."></textarea>
        <button class="tutor-panel-send">Send</button>
      </div>
    </div>
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const t=40,n=Math.round(window.innerHeight*.38),o=window.innerWidth-e.offsetWidth-20,r=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(t,o))}px`,e.style.top=`${Math.max(20,Math.min(n,r))}px`,setTimeout(()=>e.classList.add("open"),10),Ct(e),e}function Oe(){i?.element&&(Tt(i.element),Mt(i.element),Ge(),A=!1,w(i.element))}function Ft(e){}function xe(){g&&(g.style.display="none")}function Ge(){g&&(g.style.display="block")}async function Ye(){}async function vt(){}let q=null,D=!1,T=new Set,ye=0,Q=!1,W=null,ve=null,Se=0,U=0,F=null;function O(){return document.querySelector(".monaco-editor textarea.inputarea")}function je(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function Z(){T.clear(),D=!1,q!==null&&(window.clearTimeout(q),q=null)}async function ke(e){const t=Lt(),o=O()?.value??"",r=Array.from(T)[0]??1;if(!r){Z();return}const a=Date.now();if(ve===r&&a-Se<250)return;if(ve=r,Se=a,!t){Z();return}let s="";if(o&&(s=Xe(o,r)),!s.trim()&&r>1&&o){const u=Xe(o,r-1);u.trim()&&(s=u)}let c=t;try{const u=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});u?.ok&&typeof u.code=="string"&&(c=u.code)}catch{}St(s)&&(ie.push([c,s]),kt()),Z()}function St(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Xe(e,t){return e.split(`
`)[t-1]??""}async function kt(){if(!Q){Q=!0;try{for(;ie.length>0;){const[e,t]=ie.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),re=!0;const n=await b.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:e,focusLine:t,rollingStateGuideMode:i?.rollingStateGuideMode}});if(z(i?.element??null,n,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){re=!1;continue}if(!n)console.log("failure for guide mode");else{const o=n.success?n.reply:null;o?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const r=o?.nudge;i&&typeof r=="string"&&(i.content.push(`${r}
`),i.element!=null&&await Me(i.element,"","guideAssistant",r),w(i.element??null));const a=o?.topics;if(a&&typeof a=="object")for(const[s,c]of Object.entries(a)){if(!c||typeof c!="object")continue;const u=c.thoughts_to_remember,l=c.pitfalls,p=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[],m=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[];i&&(i.topics[s]??={thoughts_to_remember:[],pitfalls:[]},p.length>0&&i.topics[s].thoughts_to_remember.push(...p),m.length>0&&i.topics[s].pitfalls.push(...m))}i?.element&&w(i.element),re=!1}}}finally{Q=!1}}}function Ve(){if(!i?.guideModeEnabled)return;const e=O();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=je(t,n);!T.has(o)&&T.size==0&&T.add(o),D||(D=!0),q!==null&&window.clearTimeout(q),q=window.setTimeout(()=>{ke()},1e4),!T.has(o)&&T.size==1&&ke()}function Ke(){if(!i?.guideModeEnabled||!D)return;const e=O();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=je(t,n);if(W===null){W=o;return}o!==W&&(W=o,!T.has(o)&&T.size==1&&ke())}function Qe(){const e=O();if(!e){ye<5&&(ye+=1,window.setTimeout(Qe,500));return}e.addEventListener("input",Ve),document.addEventListener("selectionchange",Ke)}function Ze(){const e=O();e&&(e.removeEventListener("input",Ve),document.removeEventListener("selectionchange",Ke))}function _t(){}async function Et(e,t){const n=await b.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",action:"ask-anything",rollingHistory:i?.sessionRollingHistory.qaHistory,summary:i?.sessionRollingHistory.summary??"",query:t}});if(z(e,n,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const o=typeof n=="string"?n:n?.reply;return typeof o=="string"&&o.trim()&&Me(e,"","assistant",o),o||"Failure"}function Ee(e){P!==null&&(window.clearTimeout(P),P=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Tt(e){e.classList.remove("open"),e.classList.add("closing"),P!==null&&window.clearTimeout(P),P=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),P=null},180)}function Mt(e){if(!g)return;const t=e.getBoundingClientRect(),n=g.getBoundingClientRect(),o=n.width||50,r=n.height||50,c=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,u=Math.max(10,Math.min(window.innerHeight/2-r/2,window.innerHeight-r-10));g.style.left=`${c}px`,g.style.top=`${u}px`,g.style.right="auto",g.style.bottom="auto",g.style.transform="",M={x:c,y:u},Ye()}function Lt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function $(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function J(e){const t=e.split("`"),n=o=>{const r=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let a="",s=0,c;for(;(c=r.exec(o))!==null;){a+=$(o.slice(s,c.index));const u=c[1];u.startsWith("**")?a+=`<strong>${$(u.slice(2,-2))}</strong>`:a+=`<code>${$(u.slice(1,-1))}</code>`,s=r.lastIndex}return a+=$(o.slice(s)),a};return t.map((o,r)=>r%2===1?`<code>${$(o)}</code>`:n(o)).join("")}function It(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",o=[],r=null;const a=()=>{o.length!==0&&(n+=`<p>${J(o.join(" "))}</p>`,o=[])},s=()=>{r&&(n+=`</${r}>`,r=null)};for(const c of t){const u=c.trim();if(!u){a(),s();continue}const l=u.match(/^(#{1,3})\s+(.*)$/);if(l){a(),s();const d=l[1].length;n+=`<h${d}>${J(l[2])}</h${d}>`;continue}const p=u.match(/^(\d+)[.)]\s+(.*)$/);if(p){a(),r&&r!=="ol"&&s(),r||(r="ol",n+="<ol>"),n+=`<li>${J(p[2])}</li>`;continue}const m=u.match(/^[-*]\s+(.*)$/);if(m){a(),r&&r!=="ul"&&s(),r||(r="ul",n+="<ul>"),n+=`<li>${J(m[1])}</li>`;continue}o.push(u)}return a(),s(),n}function L(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let o=0,r;for(;(r=n.exec(e))!==null;)r.index>o&&t.push({type:"text",content:e.slice(o,r.index)}),t.push({type:"code",content:r[2]??"",lang:r[1]??""}),o=n.lastIndex;return o<e.length&&t.push({type:"text",content:e.slice(o)}),t.map(a=>a.type==="code"?`<pre><code${a.lang?` data-lang="${$(a.lang)}"`:""}>${$(a.content.trimEnd())}</code></pre>`:It(a.content)).join("")}function G(e,t,n){const o=e.querySelector(".tutor-panel-content");if(!o)return null;const r=document.createElement("div");if(n==="assistant")r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=L(t);else if(n==="user")r.className="tutor-panel-message tutor-panel-message--user",r.textContent=t;else if(n==="guideAssistant"){const a=document.createElement("div");return a.className="guide-wrapper",r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=L(t),a.appendChild(r),o.appendChild(a),a}else if(n==="checkAssistant"){const a=document.createElement("div");return a.className="check-wrapper",r.className=`tutor-panel-message tutor-panel-message--${n}`,r.innerHTML=L(t),a.appendChild(r),o.appendChild(a),a}else r.textContent=t;return o.append(r),o.scrollTop=r.offsetTop,r}function Je(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const o of n){const r=e.querySelector(o);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function ee(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const o of n){const r=e.querySelector(o);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function Te(e,t,n,o){return new Promise(r=>{let a=0;const s=2,c=e.offsetTop;t.scrollTop=c;let u=!0;const l=()=>{Math.abs(t.scrollTop-c)>8&&(u=!1)};t.addEventListener("scroll",l,{passive:!0});const p=()=>{a=Math.min(n.length,a+s);const m=n.slice(0,a);o?.render?e.innerHTML=o.render(m):e.textContent=m,u&&(t.scrollTop=c),a<n.length?window.setTimeout(p,12):(t.removeEventListener("scroll",l),r())};p()})}async function Me(e,t,n,o){const r=nt(o),a=e.querySelector(".tutor-panel-content");if(a&&typeof o=="string"){if(n==="assistant"){const s=G(e,"","assistant");if(!s)return;await Te(s,a,r,{render:L}),s.innerHTML=L(r),i?.sessionRollingHistory.qaHistory.push(`Assitant: ${o}`),i&&qe(i.sessionRollingHistory),a.scrollTop=s.offsetTop,w(e)}else if(n==="guideAssistant"){const s=G(e,"","guideAssistant");if(!s)return;const c=s.querySelector(".tutor-panel-message--guideAssistant");if(!c)return;U===0&&s.classList.add("guide-start"),U+=1,F=s,await Te(c,a,r,{render:L}),c.innerHTML=L(r),a.scrollTop=s.offsetTop,w(e)}else if(n==="checkAssistant"){const s=G(e,"","checkAssistant");if(!s)return;const c=s.querySelector(".tutor-panel-message--checkAssistant");if(!c)return;s.classList.add("check-start"),await Te(c,a,r,{render:L}),c.innerHTML=L(r),s.classList.add("check-end"),a.scrollTop=s.offsetTop,w(e)}}}async function At(e,t){try{const n=await b.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:t,action:"check-code",problem_no:Ce(i?.problem??""),problem_name:i?.problem??"",problem_url:i?.problemUrl??""}});if(z(e,n,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const o=n?.resp;i&&typeof o=="string"&&i.content.push(`${o}
`),typeof o=="string"&&o.trim()&&await Me(e,"","checkAssistant",o);const r=n?.topics;if(r&&typeof r=="object")for(const[a,s]of Object.entries(r)){if(!s||typeof s!="object")continue;const c=s.thoughts_to_remember,u=s.pitfalls,l=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],p=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[];i&&(i.topics[a]??={thoughts_to_remember:[],pitfalls:[]},l.length>0&&i.topics[a].thoughts_to_remember.push(...l),p.length>0&&i.topics[a].pitfalls.push(...p))}return console.log("this is the object now: ",i?.topics),w(e),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Ct(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode"),o=e.querySelector(".btn-guide-mode"),r=e.querySelector(".btn-gotToWorkspace");o?.addEventListener("click",()=>{if(!i)return;i.guideModeEnabled=!i.guideModeEnabled;const f=e.querySelector(".btn-guide-mode");if(i.userId){const h=i.problem,k=Ce(h);b.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:i.guideModeEnabled,sessionId:i.sessionId,problem_no:k,problem_name:h,problem_url:i.problemUrl}})}Je(e,!0),e.classList.add("guidemode-active"),i.guideModeEnabled?(f?.classList.add("is-loading"),U=0,F=null,Qe()):(Ze(),F&&F.classList.add("guide-end"),Je(e,!1),e.classList.remove("guidemode-active"),f?.classList.remove("is-loading")),w(e)}),r?.addEventListener("click",async()=>{const f=await b.runtime.sendMessage({action:"go-to-workspace",payload:{url:st}});z(e,f,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const a=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(i?.prompt){const f=i.prompt;a&&(a.value=""),i&&(i.prompt=""),G(e,f,"user"),i.sessionRollingHistory.qaHistory.push(`user: ${f}`),qe(i.sessionRollingHistory),w(e),await Et(e,f),i.prompt="",w(e)}else return void 0}),t?.addEventListener("mousedown",f=>{f.stopPropagation()}),t?.addEventListener("click",async()=>Oe()),n?.addEventListener("click",async()=>{const f=e.querySelector(".btn-help-mode");let h="";i&&(i.checkModeEnabled=!0,f?.classList.add("is-loading")),ee(e,!0),e.classList.add("checkmode-active");try{const k=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});k?.ok&&typeof k.code=="string"&&i&&(h=k.code);const I=await At(e,h);console.log("this is the response: ",I)}catch{}finally{i&&(i.checkModeEnabled=!1,f?.classList.remove("is-loading")),ee(e,!1),e.classList.remove("checkmode-active"),w(e)}}),a?.addEventListener("input",()=>{i&&(i.prompt=a.value),w(e)});let c=!1,u=0,l=0,p=0,m=0,d=null;const y=.6,x=e.querySelector(".tutor-panel-shellbar"),S=()=>{if(!c){d=null;return}const f=e.offsetLeft,h=e.offsetTop,k=f+(p-f)*y,I=h+(m-h)*y;e.style.left=`${k}px`,e.style.top=`${I}px`,d=requestAnimationFrame(S)},v=f=>{if(!c)return;const h=f.clientX-u,k=f.clientY-l,I=window.innerWidth-e.offsetWidth,Nt=window.innerHeight-e.offsetHeight;p=Math.max(10,Math.min(h,I)),m=Math.max(10,Math.min(k,Nt)),d===null&&(d=requestAnimationFrame(S))},C=()=>{c&&(c=!1,document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",C),d!==null&&(cancelAnimationFrame(d),d=null),e.style.left=`${p}px`,e.style.top=`${m}px`,i&&(i.position={x:e.offsetLeft,y:e.offsetTop}),w(e))};x?.addEventListener("mousedown",f=>{f.preventDefault(),c=!0,u=f.clientX-e.getBoundingClientRect().left,l=f.clientY-e.getBoundingClientRect().top,p=e.offsetLeft,m=e.offsetTop,document.addEventListener("mousemove",v),document.addEventListener("mouseup",C)})}function te(e,...t){}const Pt={debug:(...e)=>te(console.debug,...e),log:(...e)=>te(console.log,...e),warn:(...e)=>te(console.warn,...e),error:(...e)=>te(console.error,...e)};class Le extends Event{constructor(t,n){super(Le.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=Ie("wxt:locationchange")}function Ie(e){return`${b?.runtime?.id}:content:${e}`}function qt(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new Le(o,n)),n=o)},1e3))}}}class ne{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Ie("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=qt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const o=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(t,n){const o=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(t){const n=requestAnimationFrame((...o)=>{this.isValid&&t(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const o=requestIdleCallback((...r)=>{this.signal.aborted||t(...r)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(t,n,o,r){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?Ie(n):n,o,{...r,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),Pt.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:ne.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===ne.SCRIPT_STARTED_MESSAGE_TYPE,o=t.data?.contentScriptName===this.contentScriptName,r=!this.receivedMessageIds.has(t.data?.messageId);return n&&o&&r}listenForNewerScripts(t){let n=!0;const o=r=>{if(this.verifyScriptStartedEvent(r)){this.receivedMessageIds.add(r.data.messageId);const a=n;if(n=!1,a&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function zt(){}function oe(e,...t){}const $t={debug:(...e)=>oe(console.debug,...e),log:(...e)=>oe(console.log,...e),warn:(...e)=>oe(console.warn,...e),error:(...e)=>oe(console.error,...e)};return(async()=>{try{const{main:e,...t}=et,n=new ne("content",t);return await e(n)}catch(e){throw $t.error('The content script "content" crashed on startup!',e),e}})()})();
content;