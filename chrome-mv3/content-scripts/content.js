var content=(function(){"use strict";function on(e){return e}const y=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,bt={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{We()}):We()}};let m=null,F=!1,L=!1,Z={x:0,y:0},A={x:0,y:0},J,D=null,ee=!1,H=[];function We(){console.log("The widget is being loaded to the page"),yt(),Wt(),Bt(),Ot(),qt(),ot().then(()=>{E?.panelOpen&&ve()}),window.addEventListener("beforeunload",()=>{_(i?.element??null)})}function yt(){const e=document.getElementById("tutor-widget");e&&e.remove(),m=document.createElement("div"),m.id="tutor-widget",m.innerHTML=`
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
      background: linear-gradient(135deg, #C8D0CC 0%, #A7B2AD 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(47,59,56,0.18);
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
        0 8px 30px rgba(47,59,56,0.35),
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

  background: #EEF1F0;
  border-radius: 7px;
  border: none;
  box-shadow:
    0 14px 30px rgba(47,59,56,0.18),
    0 2px 6px rgba(47,59,56,0.10);

  z-index: 999997;
  font-family: Calibri, sans-serif;
  font-size: 13px;
  color: #2F3B38;
  font-weight: 500;

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
  background: #D6DDD9;
  border-bottom: 1px solid #C1C9C5;
  transition: background-color 160ms ease, box-shadow 160ms ease;
  cursor: grab;
  justify-content: flex-end;
}
.tutor-panel-shellbar:hover{
  background: #C8D0CC;
}

.tutor-panel-shellbar:active{
  background: #C8D0CC;
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
  background: #F7F9F8;
  border: 1px solid #C1C9C5;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #2F3B38;
  box-shadow: 0 6px 14px rgba(47,59,56,0.12);
}

.tutor-panel-loading-spinner{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(93,106,102,0.35);
  border-top-color: rgba(93,106,102,0.9);
  animation: tutorPanelSpin 0.8s linear infinite;
}

@keyframes tutorPanelSpin{
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tutor-panel-assistant-loading{
  display: flex;
  align-items: center;
  padding: 8px 12px;
}

.tutor-panel-assistant-loading-dot{
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(82, 99, 94, 0.9);
  animation: tutorPanelBlink 0.9s ease-in-out infinite;
}

@keyframes tutorPanelBlink{
  0%, 100% { opacity: 0.25; transform: scale(0.9); }
  50% { opacity: 0.9; transform: scale(1); }
}

.tutor-panel.dragging{
  cursor: grabbing !important;
  transform: scale(0.98) rotate(-0.4deg);
  box-shadow:
    0 18px 50px rgba(47,59,56,0.25),
    0 2px 10px rgba(47,59,56,0.12);
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
  color: #5D6A66;
  font-size: 13px;
  line-height: 1;

  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 120ms ease, background 120ms ease;
}
.tutor-panel-close:hover{
  transform: scale(1.06);
  background: rgba(200,208,204,0.6);
}

/* Actions row */
.tutor-panel-actions{
  display: flex;
  align-items: center;
  gap: 12px;

  /* IMPORTANT: don’t let this become a giant green slab */
  background: transparent;
  padding: 0;
  margin: 0;
}

/* Buttons */
.btn-guide-mode,
.btn-help-mode,
.btn-gotToWorkspace{
  border: none;
  background: #D6DDD9;
  color: #2F3B38;

  padding: 6px 10px;
  border-radius: 8px;

  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.01em;

  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.btn-guide-mode:not(:disabled):hover,
.btn-help-mode:not(:disabled):hover,
.btn-gotToWorkspace:not(:disabled):hover{
  background: #C8D0CC;
}
.btn-guide-mode:active,
.btn-help-mode:active,
.btn-gotToWorkspace:active{
  background: #C8D0CC;
}


@keyframes hoverPulse {
  0%   { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
  50%  { transform: translateY(-2px); filter: brightness(1.02) saturate(1.15); }
  100% { transform: translateY(0); filter: brightness(0.95) saturate(1.1); }
}

.btn-guide-mode.is-loading{
  background: #A7B2AD;
  animation: hoverPulse 1.2s ease-in-out infinite;
}


.btn-help-mode.is-loading{
  background: #A7B2AD;
  animation: hoverPulse 1.2s ease-in-out infinite;
  }

.tutor-panel.checkmode-active .btn-guide-mode,
.tutor-panel.checkmode-active .tutor-panel-send,
.tutor-panel.checkmode-active .btn-gotToWorkspace{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.checkmode-active .btn-guide-mode::after,
.tutor-panel.checkmode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #5D6A66;
}

.tutor-panel.guidemode-active .btn-help-mode,
.tutor-panel.guidemode-active .tutor-panel-send,
.tutor-panel.guidemode-active .btn-gotToWorkspace{
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
.tutor-panel.guidemode-active .btn-help-mode::after,
.tutor-panel.guidemode-active .tutor-panel-send::after{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #5D6A66;
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
  font-size: 13px;
}

.tutor-panel-auth{
  position: absolute;
  inset: 0;
  transform: none;
  width: auto;
  padding: 60px 16px 16px;
  z-index: 2;
  border-radius: 7px;
  background: rgba(238, 241, 240, 0.85);
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
  font-size: 13px;
}
.tutor-panel-auth .auth-password-hint{
  display: none;
  width: 100%;
  margin: 6px 0 0 0;
  color: rgba(195, 49, 38, 0.95);
  /* font-weight: 100; */
  font-size: 13px;
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
  color: #5D6A66;
  cursor: pointer;
}
.tutor-panel-auth .auth-password-toggle:hover{
  color: #2F3B38;
}
.tutor-panel-auth .auth-password-toggle svg{
  width: 18px;
  height: 18px;
  stroke: currentColor;
}
.tutor-panel-auth .auth-sep{
  font-weight: 700;
  color: #7C8A85;
  user-select: none;
}
.tutor-panel-auth h4{
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 700;
}
.tutor-panel-auth label{
  display: block;
  font-size: 13px;
  margin: 6px 0 2px;
}
.tutor-panel-auth input{
  width: 100%;
  max-width: 320px;
  padding: 6px 8px;
  border: 1px solid #A7B2AD;
  border-radius: 6px;
  margin-top: 6px;
  background: #F7F9F8;
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
  border-color: #7C8A85; /* keep same border */
}


.tutor-panel-auth .auth-back{
  margin-top: -6px; /* or 2px */
}

.tutor-panel-auth button{
  color: #5D6A66;
}

.tutor-panel-auth button:hover {
  color: #2F3B38; /* pick the text color you want on hover */
}

.tutor-panel-auth .auth-supabase{
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #C1C9C5;
}

.tutor-panel-message{
  margin: 0;
  padding: 10px 20px 10px 10px;
  /* background: rgba(255, 255, 255, 0.75); */
 /* border: 1px solid rgba(0,0,0,0.08); */
  border-radius: 4px;
  color: #2F3B38;
  font-size: 13px;
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
  background: rgba(200,208,204,0.35); /* or transparent if you want none */
  border-radius: 3px;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  display: block;
}


/*
.tutor-panel-message--guideAssistant{
  border: none;
  background: rgba(15, 23, 42, 0.06);
  border-radius: 7px;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
} */

.guide-wrapper{
  align-self: stretch;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.guide-wrapper.guide-slab{
  background: #E3E9E6;
  border-radius: 7px;
  padding: 10px 12px;
  box-sizing: border-box;
}

.guide-list{
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.guide-item{
  margin: 0 0 8px 0;
  padding-left: 18px;
  position: relative;
}

.guide-wrapper.guide-slab .guide-item::before{
  content: "–";
  font-size: 11px;
  position: absolute;
  left: 0;
  top: 0;
  color: #5D6A66;
}

.guide-item:last-child{
  margin-bottom: 0;
}

.guide-wrapper.guide-slab .guide-item p{
  margin: 0 0 8px 0;
}

.guide-wrapper.guide-slab .guide-item:last-child p:last-child{
  margin-bottom: 10px;
}


/*
.guide-wrapper{
  align-self: flex-start;
  display: flex;
  flex-direction: column;
} */

/* Border + GAP live here */
.guide-wrapper.guide-start{
  border-top: 1px solid #C1C9C5;
  margin-top: 14px;
  padding-top: 14px;
}

/*
.guide-wrapper.guide-end{
  /* border-bottom: 1px solid rgba(0,0,0,0.08); */
  margin-bottom: 14px;
  padding-bottom: 14px;
} */

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
  border-top: 1px solid #C1C9C5;
  margin-top: 14px;
  padding-top: 14px;
}

/*
.check-wrapper.check-end{
  /* border-bottom: 1px solid rgba(0,0,0,0.08); */
  margin-bottom: 14px;
  padding-bottom: 14px;
} */

/* START separators */
.guide-wrapper.guide-start,
.check-wrapper.check-start{
  margin-top: 12px;
  padding-top: 12px;
}

/* END separators — tighter */
.guide-wrapper.guide-end,
.check-wrapper.check-end{
  margin-bottom: 6px;
  padding-bottom: 4px;
}


.tutor-panel-message--checkAssistant{
  /* background: rgba(0, 0, 0, 0.06); */ /* a bit warmer/neutral */
 /* background: rgba(0, 0, 0, 0.04); */
}


.tutor-panel-loading{
  font-size: 13px;
  color: #5D6A66;
  padding: 6px 12px;
  align-self: flex-start;
}


.tutor-panel-message--user{
  align-self: flex-end;
  padding: 10px 10px;
  max-width: 75%;
  border-radius: 9px;
  background: #D6DDD9;
}

.tutor-panel-message p{
  margin: 0 0 10px 0;
}
.tutor-panel-message h1,
.tutor-panel-message h2,
.tutor-panel-message h3{
  font-size: 1em;
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
  background: rgba(200,208,204,0.5);
  padding: 1px 4px;
  font-size: 12px;
  border-radius: 4px;
}
.tutor-panel-message strong{
  font-weight: 800;
}
.tutor-panel-message pre{
  background: rgba(200,208,204,0.5);
  padding: 10px 12px;
  border-radius: 8px;
  overflow: auto;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.45;
}
.tutor-panel-message pre.table-block{
  white-space: pre;
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
  box-sizing: border-box;

  border-radius: 4px;
  outline: none;

  background: rgba(200,208,204,0.35);
  font-size: 13px;
  line-height: 1.2;
}

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


/* Align all text sizes to Enter button */
.tutor-panel *{
  font-size: inherit;
}

`,document.head.appendChild(t),document.body.appendChild(m),wt()}function xt(e){const t=e.match(/([\s\S]*?)\bTo fix:\s*([\s\S]*)/i);if(!t)return Ue(e);const o=t[1].trim(),r=t[2].trim().split(";").map(u=>u.trim()).filter(Boolean);if(r.length===0)return e;const s=r.map(u=>`- ${u.replace(/\.$/,"")}`).join(`
`),a=`${o}

**To fix**
${s}`;return Ue(a)}function Ue(e){const t=e.split(`
`),o=u=>/^\s*\|?[-:\s|]+\|?\s*$/.test(u),n=u=>(u.match(/\|/g)?.length??0)>=2;let r=!1;const s=[];let a=0;for(;a<t.length;){const u=t[a];if(u.trim().startsWith("```")){r=!r,s.push(u),a+=1;continue}if(r){s.push(u),a+=1;continue}if(n(u)||o(u)){const l=[];for(;a<t.length;){const c=t[a];if(c.trim().startsWith("```")||!(n(c)||o(c)))break;l.push(c),a+=1}l.length>0&&(s.push("```table"),s.push(...l),s.push("```"));continue}s.push(u),a+=1}return s.join(`
`)}function wt(){const e=document.getElementById("main-button");if(!e)return;let t=0,o={x:0,y:0},n=!1,r=!1;function s(c,p){if(!m)return{x:c,y:p};const d={width:50,height:50},h=window.innerWidth,k=window.innerHeight,f=10;let x=Math.max(f,c);x=Math.min(h-d.width-f,x);let v=Math.max(f,p);return v=Math.min(k-d.height-f,v),{x,y:v}}function a(c,p){if(!m)return{x:c,y:p};const d={width:50,height:50},h=window.innerWidth,k=window.innerHeight,f=20,x=c,v=h-(c+d.width),C=p,g=k-(p+d.height),w=Math.min(x,v,C,g);let S=c,T=p;return(c<0||c+d.width>h||p<0||p+d.height>k)&&(w===x?S=f:w===v?S=h-d.width-f:w===C?T=f:w===g&&(T=k-d.height-f)),{x:S,y:T}}e.addEventListener("mousedown",c=>{c.preventDefault(),t=Date.now(),o={x:c.clientX,y:c.clientY},n=!1;const p=m.getBoundingClientRect();Z.x=c.clientX-p.left,Z.y=c.clientY-p.top,e.classList.add("dragging"),document.addEventListener("mousemove",u),document.addEventListener("mouseup",l)}),e.addEventListener("click",c=>{if(r){r=!1;return}!F&&!n&&(c.preventDefault(),c.stopPropagation(),L?lt():ve())});function u(c){const p=Date.now()-t,d=Math.sqrt(Math.pow(c.clientX-o.x,2)+Math.pow(c.clientY-o.y,2));if(!F&&(d>3||p>100)&&(F=!0,n=!0,document.body.style.cursor="grabbing"),F){const h=c.clientX-Z.x,k=c.clientY-Z.y,f=s(h,k);m.style.transform=`translate(${f.x}px, ${f.y}px)`,m.style.left="0",m.style.top="0",A={x:f.x,y:f.y}}}function l(){if(document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",l),e&&e.classList.remove("dragging"),document.body.style.cursor="",F){r=!0;const c=a(A.x,A.y);c.x!==A.x||c.y!==A.y?(m.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",m.style.left=c.x+"px",m.style.top=c.y+"px",m.style.transform="",setTimeout(()=>{m&&(m.style.transition="")},15e3),A=c):(m.style.left=A.x+"px",m.style.top=A.y+"px",m.style.transform=""),ut()}F=!1,n=!1}}function te(e){try{const{origin:t,pathname:o}=new URL(e),n=o.match(/^\/problems\/[^/]+/);return n?`${t}${n[0]}`:`${t}${o}`}catch{return e}}function ne(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function Ge(e){const t=e.match(/^\s*(\d+)/);if(!t)return null;const o=Number(t[1]);return Number.isFinite(o)?o:null}function he(e){return!(e.length<8||/\s/.test(e)||!/[A-Z]/.test(e)||!/[a-z]/.test(e)||!/[0-9]/.test(e)||!/[^A-Za-z0-9]/.test(e))}const vt=["Array","String","Hash Table","Math","Dynamic Programming","Sorting","Greedy","Depth-First Search","Binary Search","Database","Matrix","Bit Manipulation","Tree","Breadth-First Search","Two Pointers","Prefix Sum","Heap (Priority Queue)","Simulation","Counting","Graph Theory","Binary Tree","Stack","Sliding Window","Enumeration","Design","Backtracking","Union-Find","Number Theory","Linked List","Ordered Set","Segment Tree","Monotonic Stack","Trie","Divide and Conquer","Combinatorics","Bitmask","Recursion","Queue","Geometry","Binary Indexed Tree","Memoization","Hash Function","Binary Search Tree","Shortest Path","String Matching","Topological Sort","Rolling Hash","Game Theory","Interactive","Data Stream","Monotonic Queue","Brainteaser","Doubly-Linked List","Merge Sort","Randomized","Counting Sort","Iterator","Concurrency","Quickselect","Suffix Array","Sweep Line","Minimum Spanning Tree","Bucket Sort","Shell","Reservoir Sampling","Radix Sort","Rejection Sampling"],je={"Dynamic Programming":"DP","Depth-First Search":"DFS","Breadth-First Search":"BFS","Heap (Priority Queue)":"Heaps (PQ)","Binary Indexed Tree":"Binary Trees","Binary Search Tree":"BST","Doubly-Linked List":"DLL","Minimum Spanning Tree":"MST"};function be(e){return e.toLowerCase().replace(/[_/]+/g," ").replace(/-/g," ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim()}const oe=new Map(vt.map(e=>[be(e),je[e]??e]));Object.values(je).forEach(e=>{oe.set(be(e),e)});function St(e){return e.split(" ").filter(Boolean).map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function ye(e){const t=be(e);if(!t)return e.trim();const o=oe.get(t);if(o)return o;const n=t.split(" ");if(n.length>0){const r=n[n.length-1];if(r.endsWith("s")){n[n.length-1]=r.slice(0,-1);const s=n.join(" "),a=oe.get(s);if(a)return a}else{n[n.length-1]=`${r}s`;const s=n.join(" "),a=oe.get(s);if(a)return a}}return St(t)}function Ye(e,t){const o=ye(t),n=Object.keys(e.topics).find(r=>ye(r)===o);return n&&n!==o&&(e.topics[o]=e.topics[n],delete e.topics[n]),e.topics[o]??={thoughts_to_remember:[],pitfalls:[]},o}function xe(e,t){return`${Ke}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function kt(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(o=>o.getAttribute("href")).filter(o=>!!o).map(o=>o.replace("/tag/","").replace("/","")).map(o=>ye(o));return Object.fromEntries(Array.from(new Set(t)).map(o=>[o,{thoughts_to_remember:[],pitfalls:[]}]))}function $(){const e=document.querySelector("#editor");if(!e)return"";const t=e.querySelector('button[aria-haspopup="dialog"]');return t?Array.from(t.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent?.trim())?.textContent?.trim()??t.textContent?.trim()??"":""}const Tt='#editor button[aria-haspopup="dialog"]';let ie=null,Xe=null;function R(){if(!i)return;const e=$();e&&i.language!==e&&(i.language=e,b(i.element??null))}function we(){const e=document.querySelector(Tt);if(e){if(e.dataset.tutorLangListener||(e.dataset.tutorLangListener="true",e.addEventListener("click",()=>{window.setTimeout(R,50)},{passive:!0})),Xe===e&&ie){R();return}ie?.disconnect(),Xe=e,ie=new MutationObserver(()=>{R()}),ie.observe(e,{childList:!0,characterData:!0,subtree:!0}),R()}}function Ve(e,t,o){const n=o??ne(),r=crypto.randomUUID();return{element:e,sessionId:r,userId:t,problem:n,problemUrl:te(window.location.href),language:$(),topics:kt(),sessionTopicsInitialized:!1,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,rollingStateGuideMode:{problem:n,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}async function ve(){const e=await Ie(),t=Pt(e),o=e?.userId??"";if(t&&await et(),i&&i.element&&document.body.contains(i.element)){we(),R(),ce(i.element),se(),L=!0,i.element;const r=i.element.querySelector(".tutor-panel-content");r&&requestAnimationFrame(()=>{r.scrollTop=r.scrollHeight}),!o||t?(O(i.element),X(i.element,t?"session expired, please log back in":void 0)):U(i),j(),b(i.element);return}if(i?.userId){$t();try{await _(i.element??null,{force:!0})}finally{Rt()}}if(!E&&o){const r=await Ce(o,ne());r&&qe(r,o)&&(E=r)}if(E){const r=at();nt(r,E),E=null,we(),R(),ce(r),se(),L=!0,j(),!o||t?(O(r),X(r,t?"session expired, please log back in":void 0)):i&&U(i),b(r);return}const n=at();if(!n){console.log("There was an error creating a panel");return}i=Ve(n,o),we(),ce(n),se(),L=!0,j(),b(n),i&&(!o||t?(O(n),X(n,t?"session expired, please log back in":void 0)):(i.userId=o,U(i)),setTimeout(()=>{const r=n.querySelector(".tutor-panel-prompt");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},100))}let Se=!1;async function Et(e){if(Se||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);Se=!0;try{const o=await y.runtime.sendMessage({action:"summarize-history",payload:{sessionId:i?.sessionId??"",summarize:t,summary:e.summary}});if(Y(i?.element??null,o,{silent:!0}))return;const n=typeof o=="string"?o:o?.reply;typeof n=="string"&&(e.summary=n)}finally{Se=!1}}function ke(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),Et(e)}let i=null;async function U(e){if(e.sessionTopicsInitialized||!e.userId)return;(await y.runtime.sendMessage({action:"init-session-topics",payload:{sessionId:e.sessionId,topics:e.topics}}))?.success&&(e.sessionTopicsInitialized=!0,b(e.element??null))}const Te="vibetutor-auth",Ke="vibetutor-session",Lt="http://localhost:3000/auth/bridge",Mt=960*60*1e3,At=15e3,Qe=1440*60*1e3,It=1800*1e3,Ct=`${Ke}:`;let E=null,re=Date.now(),Ze=0,G=!1,Ee=null,Le=null,Me=null,Je=te(window.location.href),Ae=null;async function Ie(){return(await y.storage.local.get(Te))[Te]??null}function Pt(e){return e?.expiresAt?Date.now()>e.expiresAt:!1}async function et(){await y.storage.local.remove(Te),await y.runtime.sendMessage({action:"clear-auth"})}async function _(e,t){if(!i||!i.userId||G&&!t?.force)return;const o=e?.querySelector(".tutor-panel-content")??i.element?.querySelector(".tutor-panel-content"),n=xe(i.userId,i.problem),r={state:{sessionId:i.sessionId,userId:i.userId,content:i.content,sessionTopicsInitialized:i.sessionTopicsInitialized,language:i.language,problem:i.problem,problemUrl:i.problemUrl,topics:i.topics,prompt:i.prompt,position:i.position,size:i.size,guideModeEnabled:i.guideModeEnabled,checkModeEnabled:i.checkModeEnabled,rollingStateGuideMode:i.rollingStateGuideMode,sessionRollingHistory:i.sessionRollingHistory},panelOpen:L,contentHtml:o?.innerHTML??"",contentScrollTop:o?.scrollTop??0,lastActivityAt:re};await y.storage.local.set({[n]:r})}function b(e){G||Ee||(Ee=window.setTimeout(()=>{Ee=null,_(e)},500))}async function Ce(e,t){const o=xe(e,t),r=(await y.storage.local.get(o))[o]??null;return r?Date.now()-(r.lastActivityAt??0)>Qe?(await y.storage.local.remove(o),null):r:null}async function Pe(e,t){const o=xe(e,t);await y.storage.local.remove(o)}async function tt(){const e=await y.storage.local.get(null),t=Date.now(),o=[];for(const[n,r]of Object.entries(e)){if(!n.startsWith(Ct))continue;const a=r?.lastActivityAt??0;t-a>Qe&&o.push(n)}o.length>0&&await y.storage.local.remove(o)}function qt(){tt(),Ae&&window.clearInterval(Ae),Ae=window.setInterval(()=>{tt()},It)}function qe(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const o=te(window.location.href);return e.state.problemUrl===o}function nt(e,t){i={...t.state,element:e},i&&!i.language&&(i.language=$()),i&&i.sessionTopicsInitialized==null&&(i.sessionTopicsInitialized=!1);const o=e.querySelector(".tutor-panel-content");o&&(o.innerHTML=t.contentHtml||"",requestAnimationFrame(()=>{o.scrollTop=o.scrollHeight}));const n=e.querySelector(".tutor-panel-prompt");n&&(n.value=i.prompt??""),i.position&&(e.style.left=`${i.position.x}px`,e.style.top=`${i.position.y}px`),i.size&&(e.style.width=`${i.size.width}px`,e.style.height=`${i.size.height}px`);const r=e.querySelectorAll(".guide-wrapper.guide-slab");if(r.length>0){const s=r[r.length-1];W=s.querySelectorAll(".guide-item").length,B=s,P=i?.guideModeEnabled?s:null}else{const s=e.querySelectorAll(".guide-wrapper");W=s.length,B=s.length>0?s[s.length-1]:null,P=null}}function Dt(e,t,o){De();const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML="");const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=""),i=Ve(e,t,o),i&&U(i)}async function ot(){const e=await Ie();if(!e?.userId){E=null;return}const t=await Ce(e.userId,ne());if(!t){E=null;return}if(!qe(t,e.userId)){await Pe(e.userId,t.state.problem),E=null;return}E=t,re=t.lastActivityAt??Date.now()}function j(){re=Date.now(),Date.now()-Ze>At&&(Ze=Date.now(),b())}async function Nt(){if(i?.element&&(await _(i.element,{force:!0}),G=!0),await et(),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),i?.element){const e=i.element;He(),e.classList.remove("guidemode-active","checkmode-active"),O(e),X(e,"session expired, please log back in")}}function Bt(){const e=()=>j(),t=["mousemove","keydown","click","scroll","input"];for(const o of t)document.addEventListener(o,e,{passive:!0});Le&&window.clearInterval(Le),Le=window.setInterval(async()=>{Date.now()-re<Mt||!(await Ie())?.userId||await Nt()},6e4)}function De(){N=null,V=!1,M=new Set,Ne=0,ae=!1,K=null,Be=null,ze=0,W=0,B=null,P=null}function zt(e){H=[],J=!1,De(),He(),e.querySelectorAll(".tutor-panel-assistant-loading").forEach(t=>{t.remove()}),i&&(i.guideModeEnabled=!1,i.checkModeEnabled=!1),e.classList.remove("guidemode-active","checkmode-active"),e.querySelector(".btn-guide-mode")?.classList.remove("is-loading"),e.querySelector(".btn-help-mode")?.classList.remove("is-loading")}function O(e){e.classList.add("tutor-panel-locked"),pe(e,!0)}function it(e){e.classList.remove("tutor-panel-locked"),pe(e,!1)}const rt="session expired, please log back in";function Ft(e){return typeof e=="object"&&e!==null&&e.success===!1}function Ht(e){const t=e.querySelector(".tutor-panel-content");if(!t)return;t.querySelectorAll(".tutor-panel-message--assistant").forEach(n=>{n.textContent?.trim()===rt&&n.remove()})}function st(e,t){const o=e.querySelector(".tutor-panel-content");if(!o)return;const n=de(e,t,"assistant");n&&(o.scrollTop=n.offsetTop,b(e))}function Y(e,t,o){if(!Ft(t))return!1;if(o?.silent)return!0;const n=e??i?.element??null;if(!n)return!0;if(t.unauthorized||t.status===401||t.status===403||t.error&&/unauthorized/i.test(t.error))return O(n),X(n,rt),L||(ce(n),se(),L=!0,j(),b(n)),Ht(n),!0;if(t.timeout)return st(n,o?.timeoutMessage??"The model is taking longer than usual. Please try again."),!0;const r=o?.serverMessage??"Internal server error. Please try again in a moment.";return o?.lockOnServerError===!0&&O(n),st(n,r),!0}function $t(){if(document.getElementById("tutor-panel-loading"))return;const e=document.createElement("div");e.id="tutor-panel-loading",e.className="tutor-panel-loading",e.innerHTML='<span class="tutor-panel-loading-spinner"></span><span>Restoring session...</span>',document.body.appendChild(e)}function Rt(){document.getElementById("tutor-panel-loading")?.remove()}async function _t(e){i?.userId&&i.element&&await _(i.element,{force:!0}),E=null,De();const t=L;i?.element&&i.element.remove(),i=null,L=!1,ct(),await ot(),t&&ve()}function Ot(){Me&&window.clearInterval(Me),Me=window.setInterval(()=>{const e=te(window.location.href);e!==Je&&(Je=e,_t())},1e3)}function X(e,t){const o=e.querySelector(".tutor-panel-auth");if(o){if(t){const l=o.querySelector(".auth-error");l&&(l.textContent=t,l.style.display="block")}return}ee=!0,zt(e);const n=document.createElement("div");n.className="tutor-panel-auth",e.appendChild(n);const r=(l,c)=>{if(!l||!c)return;const p=()=>{const d=l.type==="password";c.setAttribute("aria-label",d?"Show password":"Hide password")};c.addEventListener("click",()=>{l.type=l.type==="password"?"text":"password",p(),l.focus(),l.setSelectionRange(l.value.length,l.value.length)}),p()},s=async l=>{const c=i?.userId??"",p=i?.problem??ne();if(ee=!1,c&&c===l){G=!1,it(e),n.remove(),b(e);return}c&&c!==l&&(await _(e,{force:!0}),Dt(e,l,p));const d=await Ce(l,p);d&&qe(d,l)?(nt(e,d),await Pe(l,d.state.problem),E=null):d&&await Pe(l,d.state.problem),i&&(i.userId=l,U(i)),G=!1,it(e),n.remove(),b(e)},a=l=>{n.innerHTML=`
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
    `;const c=n.querySelector(".auth-email"),p=n.querySelector(".auth-password"),d=n.querySelector(".auth-login"),h=n.querySelector(".auth-signup"),k=n.querySelector(".auth-password-toggle"),f=n.querySelector(".auth-error");l&&f&&(f.textContent=l,f.style.display="block");const x=()=>{f&&(f.style.display="none")};c?.addEventListener("input",x),p?.addEventListener("input",x),r(p,k),d?.addEventListener("click",async()=>{const v=c?.value.trim()??"",C=p?.value.trim()??"";if(!v||!C)return;const g=await y.runtime.sendMessage({action:"supabase-login",payload:{email:v,password:C}});if(g?.success===!1){f&&(f.textContent=g.error||"Internal server error",f.style.display="block");return}g?.userId&&g?.jwt?await s(g.userId):f&&(f.textContent="Invalid creds",f.style.display="block")}),h?.addEventListener("click",()=>{u()})},u=()=>{n.innerHTML=`
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
      <div class="auth-password-hint"></div>
      <div class="auth-actions">
        <button type="button" class="auth-signup-submit">Sign up</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-back">Back to login</button>
      </div>
    `;const l=n.querySelector(".auth-first-name"),c=n.querySelector(".auth-last-name"),p=n.querySelector(".auth-email"),d=n.querySelector(".auth-password"),h=n.querySelector(".auth-signup-submit"),k=n.querySelector(".auth-password-toggle"),f=n.querySelector(".auth-error"),x=n.querySelector(".auth-password-hint"),v=()=>{f&&(f.style.display="none")};l?.addEventListener("input",v),c?.addEventListener("input",v),p?.addEventListener("input",v),d?.addEventListener("input",v),r(d,k),d?.addEventListener("blur",()=>{if(!x||!d)return;const g=d.value.trim();g&&!he(g)?(x.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",x.style.display="block"):x.style.display="none"}),d?.addEventListener("input",()=>{if(!x||!d)return;const g=d.value.trim();g&&he(g)&&(x.style.display="none")}),h?.addEventListener("click",async()=>{const g=l?.value.trim()??"",w=c?.value.trim()??"",S=p?.value.trim()??"",T=d?.value.trim()??"";if(!g||!w||!S||!T)return;if(!he(T)){x&&(x.textContent="Must be at least 8 characters with letter and number, no special or non-ASCII characters.",x.style.display="block");return}const q=await y.runtime.sendMessage({action:"supabase-signup",payload:{fname:g,lname:w,email:S,password:T}});if(q?.success===!1){f&&(f.textContent=q.error||"Internal server error",f.style.display="block");return}q?.requiresVerification?a("Waiting for verification, check email"):q?.userId&&q?.jwt?await s(q.userId):f&&(f.style.display="block")}),n.querySelector(".auth-back")?.addEventListener("click",()=>{a()})};a(t)}function at(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
    <div class="tutor-panel-shellbar">
      <button class="tutor-panel-close">×</button>
    </div>

    <div class="tutor-panel-inner">
      <div class="tutor-panel-topbar">
        <div class="tutor-panel-actions">
          <button class="btn-guide-mode">Guide me</button>
          <button class="btn-help-mode">Check mode</button>
          <button class="btn-gotToWorkspace">Notes made</button>
        </div>
      </div>

      <div class="tutor-panel-content"></div>

      <div class="tutor-panel-inputbar">
        <textarea class="tutor-panel-prompt" placeholder="Ask anything..."></textarea>
        <button class="tutor-panel-send">Send</button>
      </div>
    </div>
  `,e.style.position="fixed",e.style.zIndex="1000000",e.style.left="50%",e.style.top="50%",e.style.right="50%",e.style.bottom="50%",document.body.appendChild(e);const t=40,o=Math.round(window.innerHeight*.38),n=window.innerWidth-e.offsetWidth-20,r=window.innerHeight-e.offsetHeight-20;return e.style.left=`${Math.max(20,Math.min(t,n))}px`,e.style.top=`${Math.max(20,Math.min(o,r))}px`,setTimeout(()=>e.classList.add("open"),10),Jt(e),e}function lt(){i?.element&&(Xt(i.element),Vt(i.element),ct(),L=!1,b(i.element))}function sn(e){}function se(){m&&(m.style.display="none")}function ct(){m&&(m.style.display="block")}async function ut(){}async function Wt(){}let N=null,V=!1,M=new Set,Ne=0,ae=!1,K=null,Be=null,ze=0,W=0,B=null,P=null;function Q(){return document.querySelector(".monaco-editor textarea.inputarea")}function dt(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function le(){M.clear(),V=!1,N!==null&&(window.clearTimeout(N),N=null)}async function Fe(e){const t=Kt(),n=Q()?.value??"",r=Array.from(M)[0]??1;if(!r){le();return}const s=Date.now();if(Be===r&&s-ze<250)return;if(Be=r,ze=s,!t){le();return}let a="";if(n&&(a=pt(n,r)),!a.trim()&&r>1&&n){const l=pt(n,r-1);l.trim()&&(a=l)}let u=t;try{const l=await y.runtime.sendMessage({type:"GET_MONACO_CODE"});l?.ok&&typeof l.code=="string"&&(u=l.code)}catch{}Ut(a)&&(H.push([u,a]),Gt()),le()}function Ut(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function pt(e,t){return e.split(`
`)[t-1]??""}async function Gt(){if(!ae){if(ee){H=[];return}ae=!0;try{for(;H.length>0;){if(ee){H=[];break}const[e,t]=H.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),J=!0;const o=await y.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:i?.sessionId??"",problem:i?.problem??"",topics:i?.topics,code:e,focusLine:t,language:i?.language??$(),rollingStateGuideMode:i?.rollingStateGuideMode}});if(Y(i?.element??null,o,{timeoutMessage:"Guide mode is taking longer than usual. Please try again."})){J=!1;continue}if(!o)console.log("failure for guide mode");else{const n=o.success?o.reply:null;n?.state_update?.lastEdit?.trim()&&i&&(i.rollingStateGuideMode.lastEdit=n.state_update.lastEdit);const r=n?.nudge;if(i&&typeof r=="string"){const a=r.trim();a&&(i.rollingStateGuideMode.nudges.push(a),i.content.push(`${a}
`),i.element!=null&&await Re(i.element,"","guideAssistant",a),b(i.element??null))}const s=n?.topics;if(s&&typeof s=="object"&&i)for(const[a,u]of Object.entries(s)){if(!u||typeof u!="object")continue;const l=Ye(i,a),c=u.thoughts_to_remember,p=u.pitfalls,d=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],h=Array.isArray(p)?p:typeof p=="string"&&p.trim()?[p.trim()]:[];i&&(d.length>0&&i.topics[l].thoughts_to_remember.push(...d),h.length>0&&i.topics[l].pitfalls.push(...h))}i?.element&&b(i.element),J=!1}}}finally{ae=!1}}}function gt(){if(!i?.guideModeEnabled)return;const e=Q();if(!e)return;const t=e.value??"",o=e.selectionStart??0,n=dt(t,o);!M.has(n)&&M.size==0&&M.add(n),V||(V=!0),N!==null&&window.clearTimeout(N),N=window.setTimeout(()=>{Fe()},1e4),!M.has(n)&&M.size==1&&Fe()}function ft(){if(!i?.guideModeEnabled||!V)return;const e=Q();if(!e)return;const t=e.value??"",o=e.selectionStart??0,n=dt(t,o);if(K===null){K=n;return}n!==K&&(K=n,!M.has(n)&&M.size==1&&Fe())}function mt(){const e=Q();if(!e){Ne<5&&(Ne+=1,window.setTimeout(mt,500));return}e.addEventListener("input",gt),document.addEventListener("selectionchange",ft)}function He(){const e=Q();e&&(e.removeEventListener("input",gt),document.removeEventListener("selectionchange",ft))}function an(){}function jt(e){const t=e.querySelector(".tutor-panel-content");if(!t)return null;const o=document.createElement("div");o.className="tutor-panel-assistant-loading";const n=document.createElement("div");return n.className="tutor-panel-assistant-loading-dot",o.appendChild(n),t.appendChild(o),t.scrollTop=o.offsetTop,o}async function Yt(e,t){const o=jt(e),n=i?.language||$(),r=await y.runtime.sendMessage({action:"ask-anything",payload:{sessionId:i?.sessionId??"",action:"ask-anything",rollingHistory:i?.sessionRollingHistory.qaHistory,summary:i?.sessionRollingHistory.summary??"",query:t,language:n}});if(Y(e,r,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return o?.remove(),"Failure";const s=typeof r=="string"?r:r?.reply;return typeof s=="string"&&s.trim()&&(o?.remove(),Re(e,"","assistant",s)),o?.remove(),s||"Failure"}function ce(e){D!==null&&(window.clearTimeout(D),D=null),e.classList.remove("closing"),e.style.display="flex",e.classList.add("open")}function Xt(e){e.classList.remove("open"),e.classList.add("closing"),D!==null&&window.clearTimeout(D),D=window.setTimeout(()=>{e.style.display="none",e.classList.remove("closing"),D=null},180)}function Vt(e){if(!m)return;const t=e.getBoundingClientRect(),o=m.getBoundingClientRect(),n=o.width||50,r=o.height||50,u=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-n-10,l=Math.max(10,Math.min(window.innerHeight/2-r/2,window.innerHeight-r-10));m.style.left=`${u}px`,m.style.top=`${l}px`,m.style.right="auto",m.style.bottom="auto",m.style.transform="",A={x:u,y:l},ut()}function Kt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function z(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ue(e){const t=e.split("`"),o=n=>{const r=/(\*\*[^*\n]+\*\*|'[^'\n]+')/g;let s="",a=0,u;for(;(u=r.exec(n))!==null;){s+=z(n.slice(a,u.index));const l=u[1];l.startsWith("**")?s+=`<strong>${z(l.slice(2,-2))}</strong>`:s+=`<code>${z(l.slice(1,-1))}</code>`,a=r.lastIndex}return s+=z(n.slice(a)),s};return t.map((n,r)=>r%2===1?`<code>${z(n)}</code>`:o(n)).join("")}function Qt(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let o="",n=[],r=null;const s=()=>{n.length!==0&&(o+=`<p>${ue(n.join(" "))}</p>`,n=[])},a=()=>{r&&(o+=`</${r}>`,r=null)};for(const u of t){const l=u.trim();if(!l){s(),a();continue}const c=l.match(/^(#{1,3})\s+(.*)$/);if(c){s(),a();const h=c[1].length;o+=`<h${h}>${ue(c[2])}</h${h}>`;continue}const p=l.match(/^(\d+)[.)]\s+(.*)$/);if(p){s(),r&&r!=="ol"&&a(),r||(r="ol",o+="<ol>"),o+=`<li>${ue(p[2])}</li>`;continue}const d=l.match(/^[-*]\s+(.*)$/);if(d){s(),r&&r!=="ul"&&a(),r||(r="ul",o+="<ul>"),o+=`<li>${ue(d[1])}</li>`;continue}n.push(l)}return s(),a(),o}function I(e){const t=e.replace(/\r\n/g,`
`),n=(t.match(/```/g)||[]).length%2===1?`${t}
\`\`\``:t,r=[],s=/```(\w+)?\r?\n([\s\S]*?)```/g;let a=0,u;for(;(u=s.exec(n))!==null;)u.index>a&&r.push({type:"text",content:n.slice(a,u.index)}),r.push({type:"code",content:u[2]??"",lang:u[1]??""}),a=s.lastIndex;return a<n.length&&r.push({type:"text",content:n.slice(a)}),r.map(l=>{if(l.type==="code"){const c=l.lang?` data-lang="${z(l.lang)}"`:"";return`<pre${l.lang==="table"?' class="table-block"':""}><code${c}>${z(l.content.trimEnd())}</code></pre>`}return Qt(l.content)}).join("")}function de(e,t,o){const n=e.querySelector(".tutor-panel-content");if(!n)return null;const r=document.createElement("div");if(o==="assistant")r.className=`tutor-panel-message tutor-panel-message--${o}`,r.innerHTML=I(t);else if(o==="user")r.className="tutor-panel-message tutor-panel-message--user",r.textContent=t;else if(o==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",r.className=`tutor-panel-message tutor-panel-message--${o}`,r.innerHTML=I(t),s.appendChild(r),n.appendChild(s),s}else if(o==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",r.className=`tutor-panel-message tutor-panel-message--${o}`,r.innerHTML=I(t),s.appendChild(r),n.appendChild(s),s}else r.textContent=t;return n.append(r),n.scrollTop=r.offsetTop,r}function ht(e,t){const o=[".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const n of o){const r=e.querySelector(n);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function pe(e,t){const o=[".btn-guide-mode",".btn-help-mode",".tutor-panel-send",".tutor-panel-prompt",".btn-gotToWorkspace"];for(const n of o){const r=e.querySelector(n);if(r){if(r instanceof HTMLButtonElement){r.disabled=t;continue}if(r instanceof HTMLTextAreaElement){r.disabled=t;continue}r.setAttribute("aria-disabled",t?"true":"false")}}}function $e(e,t,o,n){return new Promise(r=>{let s=0;const a=2,u=e.offsetTop;t.scrollTop=u;let l=!0;const c=()=>{Math.abs(t.scrollTop-u)>8&&(l=!1)};t.addEventListener("scroll",c,{passive:!0});const p=()=>{s=Math.min(o.length,s+a);const d=o.slice(0,s);n?.render?e.innerHTML=n.render(d):e.textContent=d,l&&(t.scrollTop=u),s<o.length?window.setTimeout(p,12):(t.removeEventListener("scroll",c),r())};p()})}async function Re(e,t,o,n){const r=xt(n),s=e.querySelector(".tutor-panel-content");if(s&&typeof n=="string"){if(o==="assistant"){const a=de(e,"","assistant");if(!a)return;await $e(a,s,r,{render:I}),a.innerHTML=I(r),i?.sessionRollingHistory.qaHistory.push(`Assitant: ${n}`),i&&ke(i.sessionRollingHistory),s.scrollTop=a.offsetTop,b(e)}else if(o==="guideAssistant"){let a=P&&s.contains(P)?P:null;if(!a){a=document.createElement("div"),a.className="guide-wrapper guide-slab";const c=document.createElement("ul");c.className="guide-list",a.appendChild(c),s.appendChild(a),P=a}const u=a.querySelector(".guide-list")??document.createElement("ul");u.classList.contains("guide-list")||(u.className="guide-list",a.appendChild(u));const l=document.createElement("li");l.className="guide-item",u.appendChild(l),W===0&&a.classList.add("guide-start"),W+=1,B=a,await $e(l,s,r,{render:I}),l.innerHTML=I(r),s.scrollTop=a.offsetTop,b(e)}else if(o==="checkAssistant"){const a=de(e,"","checkAssistant");if(!a)return;const u=a.querySelector(".tutor-panel-message--checkAssistant");if(!u)return;a.classList.add("check-start"),await $e(u,s,r,{render:I}),u.innerHTML=I(r),a.classList.add("check-end"),s.scrollTop=a.offsetTop,i?.sessionRollingHistory.qaHistory.push(`Check: ${n}`),i&&ke(i.sessionRollingHistory),b(e)}}}async function Zt(e,t){try{const o=await y.runtime.sendMessage({action:"check-code",payload:{sessionId:i?.sessionId??"",topics:i?.topics,code:t,action:"check-code",language:i?.language??$(),problem_no:Ge(i?.problem??""),problem_name:i?.problem??"",problem_url:i?.problemUrl??""}});if(Y(e,o,{timeoutMessage:"The model is taking longer than usual. Please try again."}))return"Failure";const n=o?.resp;i&&typeof n=="string"&&i.content.push(`${n}
`),typeof n=="string"&&n.trim()&&await Re(e,"","checkAssistant",n);const r=o?.topics;if(r&&typeof r=="object"&&i)for(const[s,a]of Object.entries(r)){if(!a||typeof a!="object")continue;const u=Ye(i,s),l=a.thoughts_to_remember,c=a.pitfalls,p=Array.isArray(l)?l:typeof l=="string"&&l.trim()?[l.trim()]:[],d=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];i&&(p.length>0&&i.topics[u].thoughts_to_remember.push(...p),d.length>0&&i.topics[u].pitfalls.push(...d))}return console.log("this is the object now: ",i?.topics),b(e),o?.resp}catch(o){return console.error("checkMode failed",o),"Failure"}}function Jt(e){const t=e.querySelector(".tutor-panel-close"),o=e.querySelector(".btn-help-mode"),n=e.querySelector(".btn-guide-mode"),r=e.querySelector(".btn-gotToWorkspace");n?.addEventListener("click",()=>{if(!i)return;i.guideModeEnabled=!i.guideModeEnabled;const g=e.querySelector(".btn-guide-mode");if(i.userId){const w=i.problem,S=Ge(w);y.runtime.sendMessage({action:"guide-mode-status",payload:{enabled:i.guideModeEnabled,sessionId:i.sessionId,problem_no:S,problem_name:w,problem_url:i.problemUrl}})}ht(e,!0),e.classList.add("guidemode-active"),i.guideModeEnabled?(g?.classList.add("is-loading"),W=0,B=null,P=null,mt()):(He(),B&&B.classList.add("guide-end"),ht(e,!1),e.classList.remove("guidemode-active"),g?.classList.remove("is-loading")),b(e)}),r?.addEventListener("click",async()=>{const g=await y.runtime.sendMessage({action:"go-to-workspace",payload:{url:Lt}});Y(e,g,{serverMessage:"Unable to open workspace right now.",lockOnServerError:!1})});const s=e.querySelector(".tutor-panel-prompt"),a=e.querySelector(".tutor-panel-send");s?.addEventListener("keydown",async g=>{g.key!=="Enter"||g.shiftKey||(g.preventDefault(),a?.click())}),a?.addEventListener("click",async()=>{if(i?.prompt){const g=i.prompt;s&&(s.value=""),i&&(i.prompt=""),de(e,g,"user"),i.sessionRollingHistory.qaHistory.push(`user: ${g}`),ke(i.sessionRollingHistory),b(e),await Yt(e,g),i.prompt="",b(e)}else return void 0}),t?.addEventListener("mousedown",g=>{g.stopPropagation()}),t?.addEventListener("click",async()=>lt()),o?.addEventListener("click",async()=>{const g=e.querySelector(".btn-help-mode");let w="";i&&(i.checkModeEnabled=!0,g?.classList.add("is-loading")),pe(e,!0),e.classList.add("checkmode-active");try{const S=await y.runtime.sendMessage({type:"GET_MONACO_CODE"});S?.ok&&typeof S.code=="string"&&i&&(w=S.code);const T=await Zt(e,w);console.log("this is the response: ",T)}catch{}finally{i&&(i.checkModeEnabled=!1,g?.classList.remove("is-loading")),pe(e,!1),e.classList.remove("checkmode-active"),b(e)}}),s?.addEventListener("input",()=>{i&&(i.prompt=s.value),b(e)});let u=!1,l=0,c=0,p=0,d=0,h=null;const k=.6,f=e.querySelector(".tutor-panel-shellbar"),x=()=>{if(!u){h=null;return}const g=e.offsetLeft,w=e.offsetTop,S=g+(p-g)*k,T=w+(d-w)*k;e.style.left=`${S}px`,e.style.top=`${T}px`,h=requestAnimationFrame(x)},v=g=>{if(!u)return;const w=g.clientX-l,S=g.clientY-c,T=window.innerWidth-e.offsetWidth,q=window.innerHeight-e.offsetHeight;p=Math.max(10,Math.min(w,T)),d=Math.max(10,Math.min(S,q)),h===null&&(h=requestAnimationFrame(x))},C=()=>{u&&(u=!1,document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",C),h!==null&&(cancelAnimationFrame(h),h=null),e.style.left=`${p}px`,e.style.top=`${d}px`,i&&(i.position={x:e.offsetLeft,y:e.offsetTop}),b(e))};f?.addEventListener("mousedown",g=>{g.preventDefault(),u=!0,l=g.clientX-e.getBoundingClientRect().left,c=g.clientY-e.getBoundingClientRect().top,p=e.offsetLeft,d=e.offsetTop,document.addEventListener("mousemove",v),document.addEventListener("mouseup",C)})}function ge(e,...t){}const en={debug:(...e)=>ge(console.debug,...e),log:(...e)=>ge(console.log,...e),warn:(...e)=>ge(console.warn,...e),error:(...e)=>ge(console.error,...e)};class _e extends Event{constructor(t,o){super(_e.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=o}static EVENT_NAME=Oe("wxt:locationchange")}function Oe(e){return`${y?.runtime?.id}:content:${e}`}function tn(e){let t,o;return{run(){t==null&&(o=new URL(location.href),t=e.setInterval(()=>{let n=new URL(location.href);n.href!==o.href&&(window.dispatchEvent(new _e(n,o)),o=n)},1e3))}}}class fe{constructor(t,o){this.contentScriptName=t,this.options=o,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=Oe("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=tn(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return y.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,o){const n=setInterval(()=>{this.isValid&&t()},o);return this.onInvalidated(()=>clearInterval(n)),n}setTimeout(t,o){const n=setTimeout(()=>{this.isValid&&t()},o);return this.onInvalidated(()=>clearTimeout(n)),n}requestAnimationFrame(t){const o=requestAnimationFrame((...n)=>{this.isValid&&t(...n)});return this.onInvalidated(()=>cancelAnimationFrame(o)),o}requestIdleCallback(t,o){const n=requestIdleCallback((...r)=>{this.signal.aborted||t(...r)},o);return this.onInvalidated(()=>cancelIdleCallback(n)),n}addEventListener(t,o,n,r){o==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(o.startsWith("wxt:")?Oe(o):o,n,{...r,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),en.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:fe.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const o=t.data?.type===fe.SCRIPT_STARTED_MESSAGE_TYPE,n=t.data?.contentScriptName===this.contentScriptName,r=!this.receivedMessageIds.has(t.data?.messageId);return o&&n&&r}listenForNewerScripts(t){let o=!0;const n=r=>{if(this.verifyScriptStartedEvent(r)){this.receivedMessageIds.add(r.data.messageId);const s=o;if(o=!1,s&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",n),this.onInvalidated(()=>removeEventListener("message",n))}}function ln(){}function me(e,...t){}const nn={debug:(...e)=>me(console.debug,...e),log:(...e)=>me(console.log,...e),warn:(...e)=>me(console.warn,...e),error:(...e)=>me(console.error,...e)};return(async()=>{try{const{main:e,...t}=bt,o=new fe("content",t);return await e(o)}catch(e){throw nn.error('The content script "content" crashed on startup!',e),e}})()})();
content;