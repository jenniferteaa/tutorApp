var content=(function(){"use strict";function wt(e){return e}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,Ge={matches:["https://leetcode.com/problems/*"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Ee()}):Ee()}};let p=null,M=!1,E=!1,q={x:0,y:0},S={x:0,y:0},ve,Se,J=[];function Ee(){console.log("The widget is being loaded to the page"),Ye(),st(),nt(),rt(),et().then(()=>{w?.panelOpen&&te()}),window.addEventListener("beforeunload",()=>{F(o?.element??null)})}function Ye(){const e=document.getElementById("tutor-widget");e&&e.remove(),p=document.createElement("div"),p.id="tutor-widget";let t;try{t=b.runtime.getURL("logo.png"),ve=t}catch(i){console.warn("There is an error loading the logo: ",i),t=`chrome-extension://${b.runtime.id||chrome.runtime.id}/logo.png`,ve=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",b.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),p.innerHTML=`
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

.tutor-panel.tutor-panel-locked .tutor-panel-topbar,
.tutor-panel.tutor-panel-locked .tutor-panel-content,
.tutor-panel.tutor-panel-locked .tutor-panel-inputbar{
  filter: blur(3px);
  pointer-events: none;
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

.tutor-panel-auth{
  position: absolute;
  inset: 16px;
  z-index: 2;
  padding: 12px;
  border: 1px dashed rgba(0,0,0,0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
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
  border-radius: 7px;
  border: none;
  padding: 10px 8px;
  align-self: flex-start;
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
  padding-top: 14px;
}

.guide-wrapper.guide-end{
  border-bottom: 2px solid rgba(0,0,0,0.45);
  margin-bottom: 14px;
  padding-bottom: 14px;
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
  border-radius: 9px;
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
}`,document.head.appendChild(n),document.body.appendChild(p);const r=document.getElementById("logo-image");r&&(r.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),r.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),r.style.display="none"})),Oe()}function Oe(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},r=!1,i=!1;function s(a,u){if(!p)return{x:a,y:u};const m={width:50,height:50},g=window.innerWidth,x=window.innerHeight,f=10;let v=Math.max(f,a);v=Math.min(g-m.width-f,v);let I=Math.max(f,u);return I=Math.min(x-m.height-f,I),{x:v,y:I}}function l(a,u){if(!p)return{x:a,y:u};const m={width:50,height:50},g=window.innerWidth,x=window.innerHeight,f=20,v=a,I=g-(a+m.width),j=u,K=x-(u+m.height),Q=Math.min(v,I,j,K);let we=a,ye=u;return(a<0||a+m.width>g||u<0||u+m.height>x)&&(Q===v?we=f:Q===I?we=g-m.width-f:Q===j?ye=f:Q===K&&(ye=x-m.height-f)),{x:we,y:ye}}e.addEventListener("mousedown",a=>{a.preventDefault(),t=Date.now(),n={x:a.clientX,y:a.clientY},r=!1;const u=p.getBoundingClientRect();q.x=a.clientX-u.left,q.y=a.clientY-u.top,e.classList.add("dragging"),document.addEventListener("mousemove",d),document.addEventListener("mouseup",c)}),e.addEventListener("click",a=>{if(i){i=!1;return}!M&&!r&&(a.preventDefault(),a.stopPropagation(),E?qe():te())});function d(a){const u=Date.now()-t,m=Math.sqrt(Math.pow(a.clientX-n.x,2)+Math.pow(a.clientY-n.y,2));if(!M&&(m>3||u>100)&&(M=!0,r=!0,document.body.style.cursor="grabbing"),M){const g=a.clientX-q.x,x=a.clientY-q.y,f=s(g,x);p.style.transform=`translate(${f.x}px, ${f.y}px)`,p.style.left="0",p.style.top="0",S={x:f.x,y:f.y}}}function c(){if(document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",c),e&&e.classList.remove("dragging"),document.body.style.cursor="",M){i=!0;const a=l(S.x,S.y);a.x!==S.x||a.y!==S.y?(p.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",p.style.left=a.x+"px",p.style.top=a.y+"px",p.style.transform="",setTimeout(()=>{p&&(p.style.transition="")},15e3),S=a):(p.style.left=S.x+"px",p.style.top=S.y+"px",p.style.transform=""),Re()}M=!1,r=!1}}function N(e){try{const{origin:t,pathname:n}=new URL(e),r=n.match(/^\/problems\/[^/]+/);return r?`${t}${r[0]}`:`${t}${n}`}catch{return e}}function Z(){return document.querySelector("div.text-title-large a")?.textContent?.trim()??""}function ee(e,t){return`${je}:${encodeURIComponent(e)}:${encodeURIComponent(t)}`}function Xe(){const e=document.querySelectorAll('a[href^="/tag/"]'),t=Array.from(e).map(n=>n.getAttribute("href")).filter(n=>!!n).map(n=>n.replace("/tag/","").replace("/","").replace("-","_"));return Object.fromEntries(Array.from(new Set(t)).map(n=>[n,{thoughts_to_remember:[],pitfalls:[]}]))}function Ie(e,t,n){const r=n??Z(),i=crypto.randomUUID();return{element:e,sessionId:i,userId:t,problem:r,problemUrl:N(window.location.href),topics:Xe(),content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:r,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:"",toSummarize:[]}}}function te(){if(o&&o.element&&document.body.contains(o.element)){me(o.element),ce(),E=!0,o.element,U(),h(o.element);return}if(w){const t=He();Ce(t,w),w=null,me(t),ce(),E=!0,U(),o?.userId||le(t),h(t);return}const e=He();if(!e){console.log("There was an error creating a panel");return}o=Ie(e,""),me(e),ce(),E=!0,U(),h(e),ae().then(t=>{if(o){if(t?.userId){o.userId=t.userId;return}le(e)}}),setTimeout(()=>{const t=e.querySelector(".tutor-panel-prompt");t&&(t.focus(),t.setSelectionRange(t.value.length,t.value.length))},100)}let ne=!1;async function Ve(e){if(ne||e.toSummarize.length===0)return;const t=e.toSummarize.splice(0);ne=!0;try{const n=await b.runtime.sendMessage({action:"summarize-history",payload:{sessionId:o?.sessionId??"",summarize:t,summary:e.summary}});typeof n=="string"&&(e.summary=n)}finally{ne=!1}}function ke(e){if(e.qaHistory.length<=40)return;const t=e.qaHistory.splice(0,20);e.toSummarize.push(...t),Ve(e)}let o=null;const oe="vibetutor-auth",je="vibetutor-session",Ke=120*1e3,Qe=15e3;let w=null,R=Date.now(),Me=0,A=!1,ie=null,re=null,se=null,Te=N(window.location.href);async function ae(){return(await b.storage.local.get(oe))[oe]??null}async function Je(){await b.storage.local.remove(oe),await b.runtime.sendMessage({action:"clear-auth"})}async function F(e,t){if(!o||!o.userId||A&&!t?.force)return;const n=e?.querySelector(".tutor-panel-content")??o.element?.querySelector(".tutor-panel-content"),r=ee(o.userId,o.problem),i={state:{sessionId:o.sessionId,userId:o.userId,content:o.content,problem:o.problem,problemUrl:o.problemUrl,topics:o.topics,prompt:o.prompt,position:o.position,size:o.size,guideModeEnabled:o.guideModeEnabled,checkModeEnabled:o.checkModeEnabled,timerEnabled:o.timerEnabled,rollingStateGuideMode:o.rollingStateGuideMode,sessionRollingHistory:o.sessionRollingHistory},panelOpen:E,contentHtml:n?.innerHTML??"",lastActivityAt:R};await b.storage.local.set({[r]:i})}function h(e){A||ie||(ie=window.setTimeout(()=>{ie=null,F(e)},500))}async function Le(e,t){const n=ee(e,t);return(await b.storage.local.get(n))[n]??null}async function z(e,t){const n=ee(e,t);await b.storage.local.remove(n)}function Ae(e,t){if(!e.state.userId)return console.log("There was no stored user in the browser."),!1;if(e.state.userId!==t)return console.log("The stored user earlier is different from the one logging in now."),!1;const n=N(window.location.href);return e.state.problemUrl===n}function Ce(e,t){o={...t.state,element:e};const n=e.querySelector(".tutor-panel-content");n&&(n.innerHTML=t.contentHtml||"");const r=e.querySelector(".tutor-panel-prompt");r&&(r.value=o.prompt??""),o.position&&(e.style.left=`${o.position.x}px`,e.style.top=`${o.position.y}px`),o.size&&(e.style.width=`${o.size.width}px`,e.style.height=`${o.size.height}px`);const i=e.querySelectorAll(".guide-wrapper");$=i.length,T=i.length>0?i[i.length-1]:null}function Ze(e,t,n){Pe();const r=e.querySelector(".tutor-panel-content");r&&(r.innerHTML="");const i=e.querySelector(".tutor-panel-prompt");i&&(i.value=""),o=Ie(e,t,n)}async function et(){const e=await ae();if(!e?.userId){w=null;return}const t=await Le(e.userId,Z());if(!t){w=null;return}if(!Ae(t,e.userId)){await z(e.userId,t.state.problem),w=null;return}w=t,R=t.lastActivityAt??Date.now()}function U(){R=Date.now(),Date.now()-Me>Qe&&(Me=Date.now(),h())}async function tt(){if(o?.element&&(await F(o.element,{force:!0}),A=!0),await Je(),o&&(o.guideModeEnabled=!1,o.checkModeEnabled=!1),o?.element){const e=o.element;Be(),e.classList.remove("guidemode-active","checkmode-active"),ot(e),le(e)}}function nt(){const e=()=>U(),t=["mousemove","keydown","click","scroll","input"];for(const n of t)document.addEventListener(n,e,{passive:!0});re&&window.clearInterval(re),re=window.setInterval(async()=>{Date.now()-R<Ke||!(await ae())?.userId||await tt()},6e4)}function Pe(){k=null,C=!1,y=new Set,de=0,D=!1,P=null,ue=null,pe=0,$=0,T=null}function ot(e){e.classList.add("tutor-panel-locked"),Y(e,!0)}function $e(e){e.classList.remove("tutor-panel-locked"),Y(e,!1)}async function it(e){o?.userId&&await z(o.userId,o.problem),w=null,Pe();const t=E;o?.element&&o.element.remove(),o=null,E=!1,Ne(),t&&te()}function rt(){se&&window.clearInterval(se),se=window.setInterval(()=>{const e=N(window.location.href);e!==Te&&(Te=e,it())},1e3)}function le(e){if(e.querySelector(".tutor-panel-auth"))return;const t=document.createElement("div");t.className="tutor-panel-auth",t.innerHTML=`
    <h4>Login Required</h4>
    <label>Email</label>
    <input type="email" class="auth-email" placeholder="you@example.com" />
    <label>Password</label>
    <input type="password" class="auth-password" placeholder="password" />
    <button type="button" class="auth-login">Login</button>
  `,e.appendChild(t);const n=t.querySelector(".auth-email"),r=t.querySelector(".auth-password");t.querySelector(".auth-login")?.addEventListener("click",async()=>{const s=n?.value.trim()??"",l=r?.value.trim()??"";if(!s||!l)return;const d=await b.runtime.sendMessage({action:"supabase-login",payload:{email:s,password:l}});if(d?.userId&&d?.jwt){const c=o?.userId??"",a=o?.problem??Z();if(c&&c===d.userId){A=!1,$e(e),t.remove(),h(e);return}c&&c!==d.userId&&(await F(e,{force:!0}),Ze(e,d.userId,a));const u=await Le(d.userId,a);u&&Ae(u,d.userId)?(Ce(e,u),await z(d.userId,u.state.problem),w=null):u&&await z(d.userId,u.state.problem),o&&(o.userId=d.userId),A=!1,$e(e),t.remove(),h(e)}})}function He(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",document.body.appendChild(e);const t=document.getElementById("tutor-widget");if(t){const n=t.getBoundingClientRect();e.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",e.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else e.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",e.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>e.classList.add("open"),10),ft(e),e}function qe(){o?.element&&(dt(o.element),ut(o.element),Ne(),E=!1,h(o.element))}function vt(e){}function ce(){p&&(p.style.display="none")}function Ne(){p&&(p.style.display="block")}async function Re(){}async function st(){}let k=null,C=!1,y=new Set,de=0,D=!1,P=null,ue=null,pe=0,$=0,T=null;function H(){return document.querySelector(".monaco-editor textarea.inputarea")}function Fe(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function _(){y.clear(),C=!1,k!==null&&(window.clearTimeout(k),k=null)}async function ge(e){const t=pt(),r=H()?.value??"",i=Array.from(y)[0]??1;if(!i){_();return}const s=Date.now();if(ue===i&&s-pe<250)return;if(ue=i,pe=s,!t){_();return}let l="";if(r&&(l=ze(r,i)),!l.trim()&&i>1&&r){const c=ze(r,i-1);c.trim()&&(l=c)}let d=t;try{const c=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});c?.ok&&typeof c.code=="string"&&(d=c.code)}catch{}at(l)&&(J.push([d,l]),lt()),_()}function at(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function ze(e,t){return e.split(`
`)[t-1]??""}async function lt(){if(!D){D=!0;try{for(;J.length>0;){const[e,t]=J.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),Se=!0;const n=await b.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:o?.sessionId??"",problem:o?.problem??"",topics:o?.topics,code:e,focusLine:t,rollingStateGuideMode:o?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const r=n.success?n.reply:null;r?.state_update?.lastEdit?.trim()&&o&&(o.rollingStateGuideMode.lastEdit=r.state_update.lastEdit);const i=r?.nudge;o&&typeof i=="string"&&(o.content.push(`${i}
`),o.element!=null&&await he(o.element,"","guideAssistant",i),h(o.element??null));const s=r?.topics;if(s&&typeof s=="object")for(const[l,d]of Object.entries(s)){if(!d||typeof d!="object")continue;const c=d.thoughts_to_remember,a=d.pitfalls,u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],m=Array.isArray(a)?a:typeof a=="string"&&a.trim()?[a.trim()]:[];o&&(o.topics[l]??={thoughts_to_remember:[],pitfalls:[]},u.length>0&&o.topics[l].thoughts_to_remember.push(...u),m.length>0&&o.topics[l].pitfalls.push(...m))}o?.element&&h(o.element),Se=!1}}}finally{D=!1}}}function Ue(){if(!o?.guideModeEnabled)return;const e=H();if(!e)return;const t=e.value??"",n=e.selectionStart??0,r=Fe(t,n);!y.has(r)&&y.size==0&&y.add(r),C||(C=!0),k!==null&&window.clearTimeout(k),k=window.setTimeout(()=>{ge()},1e4),!y.has(r)&&y.size==1&&ge()}function De(){if(!o?.guideModeEnabled||!C)return;const e=H();if(!e)return;const t=e.value??"",n=e.selectionStart??0,r=Fe(t,n);if(P===null){P=r;return}r!==P&&(P=r,!y.has(r)&&y.size==1&&ge())}function _e(){const e=H();if(!e){de<5&&(de+=1,window.setTimeout(_e,500));return}e.addEventListener("input",Ue),document.addEventListener("selectionchange",De)}function Be(){const e=H();e&&(e.removeEventListener("input",Ue),document.removeEventListener("selectionchange",De))}function St(){}async function ct(e,t){const n=await b.runtime.sendMessage({action:"ask-anything",payload:{sessionId:o?.sessionId??"",action:"ask-anything",rollingHistory:o?.sessionRollingHistory.qaHistory,summary:o?.sessionRollingHistory.summary??"",query:t}});return n&&he(e,"","assistant",n),n||"Failure"}function me(e){e.style.display="flex",e.classList.add("open")}function dt(e){e.classList.remove("open"),e.style.display="none"}function ut(e){if(!p)return;const t=e.getBoundingClientRect(),n=p.getBoundingClientRect(),r=n.width||50,i=n.height||50,d=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-r-10,c=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));p.style.left=`${d}px`,p.style.top=`${c}px`,p.style.right="auto",p.style.bottom="auto",p.style.transform="",S={x:d,y:c},Re()}function pt(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function B(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function W(e){return e.split("`").map((n,r)=>r%2===1?`<code>${B(n)}</code>`:B(n)).join("")}function gt(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",r=[],i=null;const s=()=>{r.length!==0&&(n+=`<p>${W(r.join(" "))}</p>`,r=[])},l=()=>{i&&(n+=`</${i}>`,i=null)};for(const d of t){const c=d.trim();if(!c){s(),l();continue}const a=c.match(/^(#{1,3})\s+(.*)$/);if(a){s(),l();const g=a[1].length;n+=`<h${g}>${W(a[2])}</h${g}>`;continue}const u=c.match(/^(\d+)\.\s+(.*)$/);if(u){s(),i&&i!=="ol"&&l(),i||(i="ol",n+="<ol>"),n+=`<li>${W(u[2])}</li>`;continue}const m=c.match(/^[-*]\s+(.*)$/);if(m){s(),i&&i!=="ul"&&l(),i||(i="ul",n+="<ul>"),n+=`<li>${W(m[1])}</li>`;continue}r.push(c)}return s(),l(),n}function L(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let r=0,i;for(;(i=n.exec(e))!==null;)i.index>r&&t.push({type:"text",content:e.slice(r,i.index)}),t.push({type:"code",content:i[2]??"",lang:i[1]??""}),r=n.lastIndex;return r<e.length&&t.push({type:"text",content:e.slice(r)}),t.map(s=>s.type==="code"?`<pre><code${s.lang?` data-lang="${B(s.lang)}"`:""}>${B(s.content.trimEnd())}</code></pre>`:gt(s.content)).join("")}function G(e,t,n){const r=e.querySelector(".tutor-panel-content");if(!r)return null;const i=document.createElement("div");if(n==="assistant")i.className=`tutor-panel-message tutor-panel-message--${n}`,i.innerHTML=L(t);else if(n==="user")i.className="tutor-panel-message tutor-panel-message--user",i.textContent=t;else if(n==="guideAssistant"){const s=document.createElement("div");return s.className="guide-wrapper",i.className=`tutor-panel-message tutor-panel-message--${n}`,i.innerHTML=L(t),s.appendChild(i),r.appendChild(s),s}else if(n==="checkAssistant"){const s=document.createElement("div");return s.className="check-wrapper",i.className=`tutor-panel-message tutor-panel-message--${n}`,i.innerHTML=L(t),s.appendChild(i),r.appendChild(s),s}else i.textContent=t;return r.append(i),r.scrollTop=i.offsetTop,i}function We(e,t){const n=[".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const r of n){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=t;continue}if(i instanceof HTMLTextAreaElement){i.disabled=t;continue}i.setAttribute("aria-disabled",t?"true":"false")}}}function Y(e,t){const n=[".btn-guide-mode",".btn-help-mode",".btn-timer",".tutor-panel-send",".tutor-panel-prompt"];for(const r of n){const i=e.querySelector(r);if(i){if(i instanceof HTMLButtonElement){i.disabled=t;continue}if(i instanceof HTMLTextAreaElement){i.disabled=t;continue}i.setAttribute("aria-disabled",t?"true":"false")}}}function fe(e,t,n){return new Promise(r=>{let i=0;const s=2,l=e.offsetTop;t.scrollTop=l;let d=!0;const c=()=>{Math.abs(t.scrollTop-l)>8&&(d=!1)};t.addEventListener("scroll",c,{passive:!0});const a=()=>{i=Math.min(n.length,i+s),e.textContent=n.slice(0,i),d&&(t.scrollTop=l),i<n.length?window.setTimeout(a,12):(t.removeEventListener("scroll",c),r())};a()})}async function he(e,t,n,r){const i=e.querySelector(".tutor-panel-content");if(i&&typeof r=="string"){if(n==="assistant"){const s=G(e,"","assistant");if(!s)return;await fe(s,i,r),s.innerHTML=L(r),o?.sessionRollingHistory.qaHistory.push(`Assitant: ${r}`),o&&ke(o.sessionRollingHistory),i.scrollTop=s.offsetTop,h(e)}else if(n==="guideAssistant"){const s=G(e,"","guideAssistant");if(!s)return;const l=s.querySelector(".tutor-panel-message--guideAssistant");if(!l)return;$===0&&s.classList.add("guide-start"),$+=1,T=s,await fe(l,i,r),l.innerHTML=L(r),i.scrollTop=s.offsetTop,h(e)}else if(n==="checkAssistant"){const s=G(e,"","checkAssistant");if(!s)return;const l=s.querySelector(".tutor-panel-message--checkAssistant");if(!l)return;s.classList.add("check-start"),await fe(l,i,r),l.innerHTML=L(r),s.classList.add("check-end"),i.scrollTop=s.offsetTop,h(e)}}}async function mt(e,t){try{const n=await b.runtime.sendMessage({action:"check-code",payload:{sessionId:o?.sessionId??"",topics:o?.topics,code:t,action:"check-code"}}),r=n?.resp;o&&typeof r=="string"&&o.content.push(`${r}
`),await he(e,"","checkAssistant",r);const i=n?.topics;if(i&&typeof i=="object")for(const[s,l]of Object.entries(i)){if(!l||typeof l!="object")continue;const d=l.thoughts_to_remember,c=l.pitfalls,a=Array.isArray(d)?d:typeof d=="string"&&d.trim()?[d.trim()]:[],u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[];o&&(o.topics[s]??={thoughts_to_remember:[],pitfalls:[]},a.length>0&&o.topics[s].thoughts_to_remember.push(...a),u.length>0&&o.topics[s].pitfalls.push(...u))}return console.log("this is the object now: ",o?.topics),h(e),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function ft(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode");e.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{if(!o)return;o.guideModeEnabled=!o.guideModeEnabled;const g=e.querySelector(".btn-guide-mode");We(e,!0),e.classList.add("guidemode-active"),o.guideModeEnabled?(g?.classList.add("is-loading"),$=0,T=null,_e()):(Be(),T&&T.classList.add("guide-end"),We(e,!1),e.classList.remove("guidemode-active"),g?.classList.remove("is-loading")),h(e)});const i=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(o?.prompt){const g=o.prompt;i&&(i.value=""),o&&(o.prompt=""),G(e,g,"user"),o.sessionRollingHistory.qaHistory.push(`user: ${g}`),ke(o.sessionRollingHistory),h(e),await ct(e,g),o.prompt="",h(e)}else return void 0}),t?.addEventListener("click",async()=>qe()),n?.addEventListener("click",async()=>{const g=e.querySelector(".btn-help-mode");let x="";o&&(o.checkModeEnabled=!0,g?.classList.add("is-loading")),Y(e,!0),e.classList.add("checkmode-active");try{const f=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});f?.ok&&typeof f.code=="string"&&o&&(x=f.code);const v=await mt(e,x);console.log("this is the response: ",v)}catch{}finally{o&&(o.checkModeEnabled=!1,g?.classList.remove("is-loading")),Y(e,!1),e.classList.remove("checkmode-active"),h(e)}}),i?.addEventListener("input",()=>{o&&(o.prompt=i.value),h(e)});let l=!1,d=0,c=0;const a=e.querySelector(".tutor-panel-topbar"),u=g=>{if(!l)return;const x=g.clientX-d,f=g.clientY-c,v=window.innerWidth-e.offsetWidth,I=window.innerHeight-e.offsetHeight,j=Math.max(10,Math.min(x,v)),K=Math.max(10,Math.min(f,I));e.style.left=`${j}px`,e.style.top=`${K}px`},m=()=>{l&&(l=!1,document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",m),o&&(o.position={x:e.offsetLeft,y:e.offsetTop}),h(e))};a?.addEventListener("mousedown",g=>{g.preventDefault(),l=!0,d=g.clientX-e.getBoundingClientRect().left,c=g.clientY-e.getBoundingClientRect().top,document.addEventListener("mousemove",u),document.addEventListener("mouseup",m)})}function O(e,...t){}const ht={debug:(...e)=>O(console.debug,...e),log:(...e)=>O(console.log,...e),warn:(...e)=>O(console.warn,...e),error:(...e)=>O(console.error,...e)};class be extends Event{constructor(t,n){super(be.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=xe("wxt:locationchange")}function xe(e){return`${b?.runtime?.id}:content:${e}`}function bt(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let r=new URL(location.href);r.href!==n.href&&(window.dispatchEvent(new be(r,n)),n=r)},1e3))}}}class X{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=xe("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=bt(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const r=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(t,n){const r=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(t){const n=requestAnimationFrame((...r)=>{this.isValid&&t(...r)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const r=requestIdleCallback((...i)=>{this.signal.aborted||t(...i)},n);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(t,n,r,i){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?xe(n):n,r,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),ht.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:X.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===X.SCRIPT_STARTED_MESSAGE_TYPE,r=t.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(t.data?.messageId);return n&&r&&i}listenForNewerScripts(t){let n=!0;const r=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const s=n;if(n=!1,s&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}}function Et(){}function V(e,...t){}const xt={debug:(...e)=>V(console.debug,...e),log:(...e)=>V(console.log,...e),warn:(...e)=>V(console.warn,...e),error:(...e)=>V(console.error,...e)};return(async()=>{try{const{main:e,...t}=Ge,n=new X("content",t);return await e(n)}catch(e){throw xt.error('The content script "content" crashed on startup!',e),e}})()})();
content;