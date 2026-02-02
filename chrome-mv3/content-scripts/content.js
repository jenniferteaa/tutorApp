var content=(function(){"use strict";function qt(e){return e}const h=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,Ze={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Le()}):Le()}};let g=null,N=!1,A=!1,W={x:0,y:0},M={x:0,y:0},Me,P=null,oe=[];function Le(){console.log("The widget is being loaded to the page"),Je(),wt(),gt(),bt(),ut(),Fe().then(()=>{E?.panelOpen&&ie()}),window.addEventListener("beforeunload",()=>{H(r?.element??null)})}function Je(){const e=document.getElementById("tutor-widget");e&&e.remove(),g=document.createElement("div"),g.id="tutor-widget",g.innerHTML=`
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

`,document.head.appendChild(t),document.body.appendChild(g),tt()}function et(e){const t=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!t)return e;const n=t[1].trim(),o=t[2].trim().split(";").map(s=>s.trim()).filter(Boolean);if(o.length===0)return e;const a=o.map(s=>`- ${s.replace(/\.$/,"")}`).join(`
`);return`${n}

**To fix**
${a}`}function tt(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},i=!1,o=!1;function a(l,d){if(!g)return{x:l,y:d};const m={width:50,height:50},p=window.innerWidth,y=window.innerHeight,b=10;let S=Math.max(b,l);S=Math.min(p-m.width-b,S);let v=Math.max(b,d);return v=Math.min(y-m.height-b,v),{x:S,y:v}}function s(l,d){if(!g)return{x:l,y:d};const m={width:50,height:50},p=window.innerWidth,y=window.innerHeight,b=20,S=l,v=p-(l+m.width),C=d,f=y-(d+m.height),w=Math.min(S,v,C,f);let k=l,I=d;return(l<0||l+m.width>p||d<0||d+m.height>y)&&(w===S?k=b:w===v?k=p-m.width-b:w===C?I=b:w===f&&(I=y-m.height-b)),{x:k,y:I}}e.addEventListener("mousedown",l=>{l.preventDefault(),t=Date.now(),n={x:l.clientX,y:l.clientY},i=!1;const d=g.getBoundingClientRect();W.x=l.clientX-d.left,W.y=l.clientY-d.top,e.classList.add("dragging"),document.addEventListener("mousemove",c),document.addEventListener("mouseup",u)}),e.addEventListener("click",l=>{if(o){o=!1;return}!N&&!i&&(l.preventDefault(),l.stopPropagation(),A?We():ie())});function c(l){const d=Date.now()-t,m=Math.sqrt(Math.pow(l.clientX-n.x,2)+Math.pow(l.clientY-n.y,2));if(!N&&(m>3||d>100)&&(N=!0,i=!0,document.body.style.cursor="grabbing"),N){const p=l.clientX-W.x,y=l.clientY-W.y,b=a(p,y);g.style.transform=`translate(${b.x}px, ${b.y}px)`,g.style.left="0",g.style.top="0",M={x:b.x,y:b.y}}}function u(){if(document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",u),e&&e.classList.remove("dragging"),document.body.style.cursor="",N){o=!0;const l=s(M.x,M.y);l.x!==M.x||l.y!==M.y?(g.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",g.style.left=l.x+"px",g.style.top=l.y+"px",g.style.transform="",setTimeout(()=>{g&&(g.style.transition="")},15e3),M=l):(g.style.left=M.x+"px",g.style.top=M.y+"px",g.style.transform=""),Oe()}N=!1,i=!1}}function U(e){try{const{origin:t,pathname:n}=new URL(e),i=n.match(/^\/problems\/[^/]+/);return i?`${t}${i[0]}`:`${t}${n}`}catch{return e}}function O(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Ie(e){const t=e.match(/^\s*(\d+)/);if(!t)return null;const n=Number(t[1]);return Number.isFinite(n)?n:null}function re(e,t){return`${Pe}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function nt(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(n=>n.getAttribute("href")).filter(n=>!!n).map(n=>n.replace("/tag/","").replace("/","").replace("-","_"));return Object.fromEntries(Array.from(new Set(t)).map(n=>[n,{thoughts_to_remember:[],pitfalls:[]}]))}function Ae(e,t,n){const i=n??O(),o=crypto.randomUUID();return{element:e,sessionId:o,userId:t,problem:i,problemUrl:U(window.location.href),topics:nt(),content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:i,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function ie(){const e=await pe(),t=ct(e),n=e?.userId??"";if(t&&await He(),r&&r.element&&document.body.contains(r.element)){ve(r.element),he(),A=!0,r.element,(!n||t)&&(j(r.element),X(r.element)),Y(),x(r.element);return}if(r?.userId){mt();try{await H(r.element??null,{force:!0})}finally{ft()}}if(!E&&n){const o=await ge(n,O());o&&fe(o,n)&&(E=o)}if(E){const o=De();_e(o,E),E=null,ve(o),he(),A=!0,Y(),(!n||t)&&(j(o),X(o)),x(o);return}const i=De();if(!i){console.log("There was an error creating a panel");return}r=Ae(i,n),ve(i),he(),A=!0,Y(),x(i),r&&(!n||t?(j(i),X(i)):r.userId=n,setTimeout(()=>{const o=i.querySelector(".tutor-panel-prompt");o&&(o.focus(),o.setSelectionRange(o.value.length,o.value.length))},100))}let se=!1;async function ot(e){if(se||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);se=!0;try{const n=await h.runtime.sendMessage({action:"summarize-history",payload:{sessionId:r?.sessionId??"",summarize:t,summary:e.summary}});typeof n=="string"&&(e.summary=n)}finally{se=!1}}function Ce(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),ot(e)}let r=null;const ae="vibetutor-auth",Pe="vibetutor-session",rt="http://localhost:3000/auth/bridge",it=960*60*1e3,st=15e3,qe=1440*60*1e3,at=1800*1e3,lt=`${Pe}:`;let E=null,G=Date.now(),$e=0,_=!1,le=null,ce=null,ue=null,Ne=U(window.location.href),de=null;async function pe(){return(await h.storage.local.get(ae))[ae]??null}function ct(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function He(){await h.storage.local.remove(ae),await h.runtime.sendMessage({action:"clear-auth"})}async function H(e,t){if(!r||!r.userId||_&&!t?.force)return;const n=e?.querySelector(".tutor-panel-content")??r.element?.querySelector(".tutor-panel-content"),i=re(r.userId,r.problem),o={state:{sessionId:r.sessionId,userId:r.userId,content:r.content,problem:r.problem,problemUrl:r.problemUrl,topics:r.topics,prompt:r.prompt,position:r.position,size:r.size,guideModeEnabled:r.guideModeEnabled,checkModeEnabled:r.checkModeEnabled,timerEnabled:r.timerEnabled,rollingStateGuideMode:r.rollingStateGuideMode,sessionRollingHistory:r.sessionRollingHistory},panelOpen:A,contentHtml:n?.innerHTML??"",lastActivityAt:G};await h.storage.local.set({[i]:o})}function x(e){_||le||(le=window.setTimeout(()=>{le=null,H(e)},500))}async function ge(e,t){const n=re(e,t),o=(await h.storage.local.get(n))[n]??null;return o?Date.now()-(o.lastActivityAt??0)>qe?(await h.storage.local.remove(n),null):o:null}async function me(e,t){const n=re(e,t);await h.storage.local.remove(n)}async function Re(){const e=await h.storage.local.get(null),t=Date.now(),n=[];for(const[i,o]of Object.entries(e)){if(!i.startsWith(lt))continue;const s=o?.lastActivityAt??0;t-s>qe&&n.push(i)}n.length>0&&await h.storage.local.remove(n)}function ut(){Re(),de&&window.clearInterval(de),de=window.setInterval(()=>{Re()},at)}function fe(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const n=U(window.location.href);return e.state.problemUrl===n}function _e(e,t){r={...t.state,element:e};const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML=t.contentHtml||"");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=r.prompt??""),r.position&&(e.style.left=`${r.position.x}px`,e.style.top=`${r.position.y}px`),r.size&&(e.style.width=`${r.size.width}px`,e.style.height=`${r.size.height}px`);const o=e.querySelectorAll(".guide-wrapper");B=o.length,R=o.length>0?o[o.length-1]:null}function dt(e,t,n){ze();const i=e.querySelector(".tutor-panel-content");i&&(i.innerHTML="");const o=e.querySelector(".tutor-panel-prompt");o&&(o.value=""),r=Ae(e,t,n)}async function Fe(){const e=await pe();if(!e?.userId){E=null;return}const t=await ge(e.userId,O());if(!t){E=null;return}if(!fe(t,e.userId)){await me(e.userId,t.state.problem),E=null;return}E=t,G=t.lastActivityAt??Date.now()}function Y(){G=Date.now(),Date.now()-$e>st&&($e=Date.now(),x())}async function pt(){if(r?.element&&(await H(r.element,{force:!0}),_=!0),await He(),r&&(r.guideModeEnabled=!1,r.checkModeEnabled=!1),r?.element){const e=r.element;Ke(),e.classList.remove("guidemode-active","checkmode-active"),j(e),X(e)}}function gt(){const e=()=>Y(),t=["mousemove","keydown","click","scroll","input"];for(const n of t)document.addEventListener(n,e,{passive:!0});ce&&window.clearInterval(ce),ce=window.setInterval(async()=>{Date.now()-G<it||!(await pe())?.userId||await pt()},6e4)}function ze(){q=null,F=!1,T=new Set,be=0,V=!1,z=null,we=null,xe=0,B=0,R=null}function j(e){e.classList.add("tutor-panel-locked"),J(e,!0)}function Be(e){e.classList.remove("tutor-panel-locked"),J(e,!1)}function mt(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function ft(){document.getElementById("tutor-panel-loading")?.remove()}async function ht(e){r?.userId&&r.element&&await H(r.element,{force:!0}),E=null,ze();const t=A;r?.element&&r.element.remove(),r=null,A=!1,Ue(),await Fe(),t&&ie()}function bt(){ue&&window.clearInterval(ue),ue=window.setInterval(()=>{const e=U(window.location.href);e!==Ne&&(Ne=e,ht())},1e3)}function X(e){if(e.querySelector(".tutor-panel-auth"))return;const t=document.createElement("div");t.className="tutor-panel-auth",e.appendChild(t);const n=(s,c)=>{if(!s||!c)return;const u=()=>{const l=s.type==="password";c.setAttribute("aria-label",l?"Show password":"Hide password")};c.addEventListener("click",()=>{s.type=s.type==="password"?"text":"password",u(),s.focus(),s.setSelectionRange(s.value.length,s.value.length)}),u()},i=async s=>{const c=r?.userId??"",u=r?.problem??O();if(c&&c===s){_=!1,Be(e),t.remove(),x(e);return}c&&c!==s&&(await H(e,{force:!0}),dt(e,s,u));const l=await ge(s,u);l&&fe(l,s)?(_e(e,l),await me(s,l.state.problem),E=null):l&&await me(s,l.state.problem),r&&(r.userId=s),_=!1,Be(e),t.remove(),x(e)},o=s=>{t.innerHTML=`
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
    `;const c=t.querySelector(".auth-email"),u=t.querySelector(".auth-password"),l=t.querySelector(".auth-login"),d=t.querySelector(".auth-signup"),m=t.querySelector(".auth-password-toggle"),p=t.querySelector(".auth-error");s&&p&&(p.textContent=s,p.style.display="block");const y=()=>{p&&(p.style.display="none")};c?.addEventListener("input",y),u?.addEventListener("input",y),n(u,m),l?.addEventListener("click",async()=>{const b=c?.value.trim()??"",S=u?.value.trim()??"";if(!b||!S)return;const v=await h.runtime.sendMessage({action:"supabase-login",payload:{email:b,password:S}});v?.userId&&v?.jwt?await i(v.userId):p&&(p.textContent="Invalid creds",p.style.display="block")}),d?.addEventListener("click",()=>{a()})},a=()=>{t.innerHTML=`
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
    `;const s=t.querySelector(".auth-first-name"),c=t.querySelector(".auth-last-name"),u=t.querySelector(".auth-email"),l=t.querySelector(".auth-password"),d=t.querySelector(".auth-signup-submit"),m=t.querySelector(".auth-password-toggle"),p=t.querySelector(".auth-error"),y=()=>{p&&(p.style.display="none")};s?.addEventListener("input",y),c?.addEventListener("input",y),u?.addEventListener("input",y),l?.addEventListener("input",y),n(l,m),d?.addEventListener("click",async()=>{const S=s?.value.trim()??"",v=c?.value.trim()??"",C=u?.value.trim()??"",f=l?.value.trim()??"";if(!S||!v||!C||!f)return;const w=await h.runtime.sendMessage({action:"supabase-signup",payload:{fname:S,lname:v,email:C,password:f}});w?.requiresVerification?o("Waiting for verification, check email"):w?.userId&&w?.jwt?await i(w.userId):p&&(p.style.display="block")}),t.querySelector(".auth-back")?.addEventListener("click",()=>{o()})};o()}function De(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const t=40,n=Math.round(window.innerHeight*.38),i=window.innerWidth-e.offsetWidth-20,o=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(t,i))}px`,e.style.top=`${Math.max(20,Math.min(n,o))}px`,setTimeout(()=>e.classList.add("open"),10),Lt(e),e}function We(){r?.element&&(St(r.element),kt(r.element),Ue(),A=!1,x(r.element))}function Nt(e){}function he(){g&&(g.style.display="none")}function Ue(){g&&(g.style.display="block")}async function Oe(){}async function wt(){}let q=null,F=!1,T=new Set,be=0,V=!1,z=null,we=null,xe=0,B=0,R=null;function D(){return document.querySelector(".monaco-editor textarea.inputarea")}function Ge(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function K(){T.clear(),F=!1,q!==null&&(window.clearTimeout(q),q=null)}async function ye(e){const t=Et(),i=D()?.value??"",o=Array.from(T)[0]??1;if(!o){K();return}const a=Date.now();if(we===o&&a-xe<250)return;if(we=o,xe=a,!t){K();return}let s="";if(i&&(s=Ye(i,o)),!s.trim()&&o>1&&i){const u=Ye(i,o-1);u.trim()&&(s=u)}let c=t;try{const u=await h.runtime.sendMessage({type:"GET_MONACO_CODE"});u?.ok&&typeof u.code=="string"&&(c=u.code)}catch{}xt(s)&&(oe.push([c,s]),yt()),K()}function xt(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function Ye(e,t){return e.split(`
`)[t-1]??""}async function yt(){if(!V){V=!0;try{for(;oe.length>0;){const[e,t]=oe.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),Me=!0;const n=await h.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:r?.sessionId??"",problem:r?.problem??"",topics:r?.topics,code:e,focusLine:t,rollingStateGuideMode:r?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const i=n.success?n.reply:null;i?.state_update?.lastEdit?.trim()&&r&&(r.rollingStateGuideMode.lastEdit=i.state_update.lastEdit);const o=i?.nudge;r&&typeof o=="string"&&(r.content.push(`${o}
`),r.element!=null&&await ke(r.element,"","guideAssistant",o),x(r.element??null));const a=i?.topics;if(a&&typeof a=="object")for(const[s,c]of Object.entries(a)){if(!c||typeof c!="object")continue;const u=c.thoughts_to_remember,l=c.pitfalls,d=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[],m=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[];r&&(r.topics[s]??={thoughts_to_remember:[],pitfalls:[]},d.length>0&&r.topics[s].thoughts_to_remember.push(...d),m.length>0&&r.topics[s].pitfalls.push(...m))}r?.element&&x(r.element),Me=!1}}}finally{V=!1}}}function je(){if(!r?.guideModeEnabled)return;const e=D();if(!e)return;const t=e.value??"",n=e.selectionStart??0,i=Ge(t,n);!T.has(i)&&T.size==0&&T.add(i),F||(F=!0),q!==null&&window.clearTimeout(q),q=window.setTimeout(()=>{ye()},1e4),!T.has(i)&&T.size==1&&ye()}function Xe(){if(!r?.guideModeEnabled||!F)return;const e=D();if(!e)return;const t=e.value??"",n=e.selectionStart??0,i=Ge(t,n);if(z===null){z=i;return}i!==z&&(z=i,!T.has(i)&&T.size==1&&ye())}function Ve(){const e=D();if(!e){be<5&&(be+=1,window.setTimeout(Ve,500));return}e.addEventListener("input",je),document.addEventListener("selectionchange",Xe)}function Ke(){const e=D();e&&(e.removeEventListener("input",je),document.removeEventListener("selectionchange",Xe))}function Ht(){}async function vt(e,t){const n=await h.runtime.sendMessage({action:"ask-anything",payload:{sessionId:r?.sessionId??"",action:"ask-anything",rollingHistory:r?.sessionRollingHistory.qaHistory,summary:r?.sessionRollingHistory.summary??"",query:t}});return n&&ke(e,"","assistant",n),n||"Failure"}function ve(e){P!==null&&(window.clearTimeout(P),P=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function St(e){e.classList.remove("open"),e.classList.add("closing"),P!==null&&window.clearTimeout(P),P=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),P=null},180)}function kt(e){if(!g)return;const t=e.getBoundingClientRect(),n=g.getBoundingClientRect(),i=n.width||50,o=n.height||50,c=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-i-10,u=Math.max(10,Math.min(window.innerHeight/2-o/2,window.innerHeight-o-10));g.style.left=`${c}px`,g.style.top=`${u}px`,g.style.right="auto",g.style.bottom="auto",g.style.transform="",M={x:c,y:u},Oe()}function Et(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function $(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(e){const t=e.split("`"),n=i=>{const o=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let a="",s=0,c;for(;(c=o.exec(i))!==null;){a+=$(i.slice(s,c.index));const u=c[1];u.startsWith("**")?a+=`<strong>${$(u.slice(2,-2))}</strong>`:a+=`<code>${$(u.slice(1,-1))}</code>`,s=o.lastIndex}return a+=$(i.slice(s)),a};return t.map((i,o)=>o%2===1?`<code>${$(i)}</code>`:n(i)).join("")}function Tt(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",i=[],o=null;const a=()=>{i.length!==0&&(n+=`<p>${Q(i.join(" "))}</p>`,i=[])},s=()=>{o&&(n+=`</${o}>`,o=null)};for(const c of t){const u=c.trim();if(!u){a(),s();continue}const l=u.match(/^(#{1,3})\s+(.*)$/);if(l){a(),s();const p=l[1].length;n+=`<h${p}>${Q(l[2])}</h${p}>`;continue}const d=u.match(/^(\d+)[.)]\s+(.*)$/);if(d){a(),o&&o!=="ol"&&s(),o||(o="ol",n+="<ol>"),n+=`<li>${Q(d[2])}</li>`;continue}const m=u.match(/^[-*]\s+(.*)$/);if(m){a(),o&&o!=="ul"&&s(),o||(o="ul",n+="<ul>"),n+=`<li>${Q(m[1])}</li>`;continue}i.push(u)}return a(),s(),n}function L(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let i=0,o;for(;(o=n.exec(e))!==null;)o.index>i&&t.push({type:"text",content:e.slice(i,o.index)}),t.push({type:"code",content:o[2]??"",lang:o[1]??""}),i=n.lastIndex;return i<e.length&&t.push({type:"text",content:e.slice(i)}),t.map(a=>a.type==="code"?`<pre><code${a.lang?` data-lang="${$(a.lang)}"`:""}>${$(a.content.trimEnd())}</code></pre>`:Tt(a.content)).join("")}function Z(e,t,n){const i=e.querySelector(".tutor-panel-content");if(!i)return null;const o=document.createElement("div");if(n==="assistant")o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=L(t);else if(n==="user")o.className="tutor-panel-message tutor-panel-message--user",o.textContent=t;else if(n==="guideAssistant"){const a=document.createElement("div");return a.className="guide-wrapper",o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=L(t),a.appendChild(o),i.appendChild(a),a}else if(n==="checkAssistant"){const a=document.createElement("div");return a.className="check-wrapper",o.className=`tutor-panel-message tutor-panel-message--${n}`,o.innerHTML=L(t),a.appendChild(o),i.appendChild(a),a}else o.textContent=t;return i.append(o),i.scrollTop=o.offsetTop,o}function Qe(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const i of n){const o=e.querySelector(i);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function J(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const i of n){const o=e.querySelector(i);if(o){if(o instanceof HTMLButtonElement){o.disabled=t;continue}if(o instanceof HTMLTextAreaElement){o.disabled=t;continue}o.setAttribute("aria-disabled",t?"true":"false")}}}function Se(e,t,n,i){return new Promise(o=>{let a=0;const s=2,c=e.offsetTop;t.scrollTop=c;let u=!0;const l=()=>{Math.abs(t.scrollTop-c)>8&&(u=!1)};t.addEventListener("scroll",l,{passive:!0});const d=()=>{a=Math.min(n.length,a+s);const m=n.slice(0,a);i?.render?e.innerHTML=i.render(m):e.textContent=m,u&&(t.scrollTop=c),a<n.length?window.setTimeout(d,12):(t.removeEventListener("scroll",l),o())};d()})}async function ke(e,t,n,i){const o=et(i),a=e.querySelector(".tutor-panel-content");if(a&&typeof i=="string"){if(n==="assistant"){const s=Z(e,"","assistant");if(!s)return;await Se(s,a,o,{render:L}),s.innerHTML=L(o),r?.sessionRollingHistory.qaHistory.push(`Assitant: ${i}`),r&&Ce(r.sessionRollingHistory),a.scrollTop=s.offsetTop,x(e)}else if(n==="guideAssistant"){const s=Z(e,"","guideAssistant");if(!s)return;const c=s.querySelector(".tutor-panel-message--guideAssistant");if(!c)return;B===0&&s.classList.add("guide-start"),B+=1,R=s,await Se(c,a,o,{render:L}),c.innerHTML=L(o),a.scrollTop=s.offsetTop,x(e)}else if(n==="checkAssistant"){const s=Z(e,"","checkAssistant");if(!s)return;const c=s.querySelector(".tutor-panel-message--checkAssistant");if(!c)return;s.classList.add("check-start"),await Se(c,a,o,{render:L}),c.innerHTML=L(o),s.classList.add("check-end"),a.scrollTop=s.offsetTop,x(e)}}}async function Mt(e,t){try{const n=await h.runtime.sendMessage({action:"check-code",payload:{sessionId:r?.sessionId??"",topics:r?.topics,code:t,action:"check-code",problem_no:Ie(r?.problem??""),problem_name:r?.problem??"",problem_url:r?.problemUrl??""}}),i=n?.resp;r&&typeof i=="string"&&r.content.push(`${i}
`),await ke(e,"","checkAssistant",i);const o=n?.topics;if(o&&typeof o=="object")for(const[a,s]of Object.entries(o)){if(!s||typeof s!="object")continue;const c=s.thoughts_to_remember,u=s.pitfalls,l=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],d=Array.isArray(u)?u:typeof u=="string"&&u.trim()?[u.trim()]:[];r&&(r.topics[a]??={thoughts_to_remember:[],pitfalls:[]},l.length>0&&r.topics[a].thoughts_to_remember.push(...l),d.length>0&&r.topics[a].pitfalls.push(...d))}return console.log("this is the object now: ",r?.topics),x(e),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Lt(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode"),i=e.querySelector(".btn-guide-mode"),o=e.querySelector(".btn-gotToWorkspace");i?.addEventListener("click",()=>{if(!r)return;r.guideModeEnabled=!r.guideModeEnabled;const f=e.querySelector(".btn-guide-mode");if(r.userId){const w=r.problem,k=Ie(w);h.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:r.guideModeEnabled,sessionId:r.sessionId,problem_no:k,problem_name:w,problem_url:r.problemUrl}})}Qe(e,!0),e.classList.add("guidemode-active"),r.guideModeEnabled?(f?.classList.add("is-loading"),B=0,R=null,Ve()):(Ke(),R&&R.classList.add("guide-end"),Qe(e,!1),e.classList.remove("guidemode-active"),f?.classList.remove("is-loading")),x(e)}),o?.addEventListener("click",async()=>{await h.runtime.sendMessage({action:"go-to-workspace",payload:{url:rt}})});const a=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(r?.prompt){const f=r.prompt;a&&(a.value=""),r&&(r.prompt=""),Z(e,f,"user"),r.sessionRollingHistory.qaHistory.push(`user: ${f}`),Ce(r.sessionRollingHistory),x(e),await vt(e,f),r.prompt="",x(e)}else return void 0}),t?.addEventListener("mousedown",f=>{f.stopPropagation()}),t?.addEventListener("click",async()=>We()),n?.addEventListener("click",async()=>{const f=e.querySelector(".btn-help-mode");let w="";r&&(r.checkModeEnabled=!0,f?.classList.add("is-loading")),J(e,!0),e.classList.add("checkmode-active");try{const k=await h.runtime.sendMessage({type:"GET_MONACO_CODE"});k?.ok&&typeof k.code=="string"&&r&&(w=k.code);const I=await Mt(e,w);console.log("this is the response: ",I)}catch{}finally{r&&(r.checkModeEnabled=!1,f?.classList.remove("is-loading")),J(e,!1),e.classList.remove("checkmode-active"),x(e)}}),a?.addEventListener("input",()=>{r&&(r.prompt=a.value),x(e)});let c=!1,u=0,l=0,d=0,m=0,p=null;const y=.6,b=e.querySelector(".tutor-panel-shellbar"),S=()=>{if(!c){p=null;return}const f=e.offsetLeft,w=e.offsetTop,k=f+(d-f)*y,I=w+(m-w)*y;e.style.left=`${k}px`,e.style.top=`${I}px`,p=requestAnimationFrame(S)},v=f=>{if(!c)return;const w=f.clientX-u,k=f.clientY-l,I=window.innerWidth-e.offsetWidth,Pt=window.innerHeight-e.offsetHeight;d=Math.max(10,Math.min(w,I)),m=Math.max(10,Math.min(k,Pt)),p===null&&(p=requestAnimationFrame(S))},C=()=>{c&&(c=!1,document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",C),p!==null&&(cancelAnimationFrame(p),p=null),e.style.left=`${d}px`,e.style.top=`${m}px`,r&&(r.position={x:e.offsetLeft,y:e.offsetTop}),x(e))};b?.addEventListener("mousedown",f=>{f.preventDefault(),c=!0,u=f.clientX-e.getBoundingClientRect().left,l=f.clientY-e.getBoundingClientRect().top,d=e.offsetLeft,m=e.offsetTop,document.addEventListener("mousemove",v),document.addEventListener("mouseup",C)})}function ee(e,...t){}const It={debug:(...e)=>ee(console.debug,...e),log:(...e)=>ee(console.log,...e),warn:(...e)=>ee(console.warn,...e),error:(...e)=>ee(console.error,...e)};class Ee extends Event{constructor(t,n){super(Ee.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=Te("wxt:locationchange")}function Te(e){return`${h?.runtime?.id}:content:${e}`}function At(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let i=new URL(location.href);i.href!==n.href&&(window.dispatchEvent(new Ee(i,n)),n=i)},1e3))}}}class te{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Te("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=At(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return h.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const i=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(i)),i}setTimeout(t,n){const i=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(i)),i}requestAnimationFrame(t){const n=requestAnimationFrame((...i)=>{this.isValid&&t(...i)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const i=requestIdleCallback((...o)=>{this.signal.aborted||t(...o)},n);return this.onInvalidated(()=>cancelIdleCallback(i)),i}addEventListener(t,n,i,o){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?Te(n):n,i,{...o,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),It.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:te.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===te.SCRIPT_STARTED_MESSAGE_TYPE,i=t.data?.contentScriptName===this.contentScriptName,o=!this.receivedMessageIds.has(t.data?.messageId);return n&&i&&o}listenForNewerScripts(t){let n=!0;const i=o=>{if(this.verifyScriptStartedEvent(o)){this.receivedMessageIds.add(o.data.messageId);const a=n;if(n=!1,a&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",i),this.onInvalidated(()=>removeEventListener("message",i))}}function Rt(){}function ne(e,...t){}const Ct={debug:(...e)=>ne(console.debug,...e),log:(...e)=>ne(console.log,...e),warn:(...e)=>ne(console.warn,...e),error:(...e)=>ne(console.error,...e)};return(async()=>{try{const{main:e,...t}=Ze,n=new te("content",t);return await e(n)}catch(e){throw Ct.error('The content script "content" crashed on startup!',e),e}})()})();
content;