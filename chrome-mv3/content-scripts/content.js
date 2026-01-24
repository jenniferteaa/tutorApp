var content=(function(){"use strict";function $e(e){return e}const b=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,le={matches:["<all_urls>"],main(){console.log("🎯 StickyNoteAI v2.2 CSS FIXED + MENU POSITIONING - Loading..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{j()}):j()}};let d=null,E=!1,T=!1,I={x:0,y:0},x={x:0,y:0},H,X,R=[];function j(){console.log("The widget is being loaded to the page"),ce(),fe()}function ce(){const e=document.getElementById("tutor-widget");e&&e.remove(),d=document.createElement("div"),d.id="tutor-widget";let t;try{t=b.runtime.getURL("logo.png"),H=t}catch(i){console.warn("There is an error loading the logo: ",i),t=`chrome-extension://${b.runtime.id||chrome.runtime.id}/logo.png`,H=t}console.log("StickyNoteAI: Image URLs:",{logo:t}),console.log("StickyNoteAI: Extension ID:",b.runtime.id),console.log("StickyNoteAI: Chrome runtime ID:",chrome.runtime.id),d.innerHTML=`
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
}`,document.head.appendChild(n),document.body.appendChild(d);const o=document.getElementById("logo-image");o&&(o.addEventListener("load",()=>{console.log("✅ image loaded successfully")}),o.addEventListener("error",()=>{console.error("❌ Failed to load logo image:",t),o.style.display="none"})),de()}function de(){const e=document.getElementById("main-button");if(!e)return;let t=0,n={x:0,y:0},o=!1,i=!1;function l(a,u){if(!d)return{x:a,y:u};const g={width:50,height:50},f=window.innerWidth,h=window.innerHeight,m=10;let w=Math.max(m,a);w=Math.min(f-g.width-m,w);let v=Math.max(m,u);return v=Math.min(h-g.height-m,v),{x:w,y:v}}function r(a,u){if(!d)return{x:a,y:u};const g={width:50,height:50},f=window.innerWidth,h=window.innerHeight,m=20,w=a,v=f-(a+g.width),F=u,W=h-(u+g.height),q=Math.min(w,v,F,W);let Y=a,z=u;return(a<0||a+g.width>f||u<0||u+g.height>h)&&(q===w?Y=m:q===v?Y=f-g.width-m:q===F?z=m:q===W&&(z=h-g.height-m)),{x:Y,y:z}}e.addEventListener("mousedown",a=>{a.preventDefault(),t=Date.now(),n={x:a.clientX,y:a.clientY},o=!1;const u=d.getBoundingClientRect();I.x=a.clientX-u.left,I.y=a.clientY-u.top,e.classList.add("dragging"),document.addEventListener("mousemove",p),document.addEventListener("mouseup",c)}),e.addEventListener("click",a=>{if(i){i=!1;return}!E&&!o&&(a.preventDefault(),a.stopPropagation(),T?U():ue())});function p(a){const u=Date.now()-t,g=Math.sqrt(Math.pow(a.clientX-n.x,2)+Math.pow(a.clientY-n.y,2));if(!E&&(g>3||u>100)&&(E=!0,o=!0,document.body.style.cursor="grabbing"),E){const f=a.clientX-I.x,h=a.clientY-I.y,m=l(f,h);d.style.transform=`translate(${m.x}px, ${m.y}px)`,d.style.left="0",d.style.top="0",x={x:m.x,y:m.y}}}function c(){if(document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",c),e&&e.classList.remove("dragging"),document.body.style.cursor="",E){i=!0;const a=r(x.x,x.y);a.x!==x.x||a.y!==x.y?(d.style.transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",d.style.left=a.x+"px",d.style.top=a.y+"px",d.style.transform="",setTimeout(()=>{d&&(d.style.transition="")},15e3),x=a):(d.style.left=x.x+"px",d.style.top=x.y+"px",d.style.transform=""),Q()}E=!1,o=!1}}function ue(){if(s&&s.element&&document.body.contains(s.element)){re(s.element),V(),T=!0,s.element;return}const e=pe();if(!e){console.log("There was an error creating a panel");return}const t=document.querySelectorAll('a[href^="/tag/"]'),n=Array.from(t).map(r=>r.getAttribute("href")).filter(r=>!!r).map(r=>r.replace("/tag/","").replace("/","").replace("-","_"));Object.fromEntries(Array.from(new Set(n)).map(r=>[r,[]]));const o=Object.fromEntries(Array.from(new Set(n)).map(r=>[r,{thoughts_to_remember:[],pitfalls:[]}])),i=document.querySelector("div.text-title-large a")?.textContent?.trim()??"";console.log(i);const l=crypto.randomUUID();s={element:e,sessionId:l,problem:i,topics:o,content:[],prompt:"",position:null,size:null,guideModeEnabled:!1,checkModeEnabled:!1,timerEnabled:!1,rollingStateGuideMode:{problem:i,nudges:[],lastEdit:""},sessionRollingHistory:{qaHistory:[],summary:""}},re(e),V(),T=!0,setTimeout(()=>{const r=e.querySelector(".tutor-panel-prompt");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},100)}let s=null;function pe(){document.getElementById("tutor-panel")?.remove();const e=document.createElement("div");e.id="tutor-panel",e.classList.add("tutor-panel"),e.innerHTML=`
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
  `,e.style.position="fixed",e.style.zIndex="1000000",document.body.appendChild(e);const t=document.getElementById("tutor-widget");if(t){const n=t.getBoundingClientRect();e.style.left=Math.max(20,Math.min(n.left-320,window.innerWidth-340))+"px",e.style.top=Math.max(20,Math.min(n.top,window.innerHeight-220))+"px"}else e.style.left=Math.max(20,(window.innerWidth-300)/2)+"px",e.style.top=Math.max(20,(window.innerHeight-200)/2)+"px";return setTimeout(()=>e.classList.add("open"),10),Le(e),e}function U(){s?.element&&(ye(s.element),we(s.element),ge(),T=!1)}function _e(e){}function V(){d&&(d.style.display="none")}function ge(){d&&(d.style.display="block")}async function Q(){}async function fe(){}let M=null,L=!1,y=new Set,J=0,B=!1,k=null,K=null,Z=0;function S(){return document.querySelector(".monaco-editor textarea.inputarea")}function ee(e,t){return e.slice(0,Math.max(0,t)).split(`
`).length}function A(){y.clear(),L=!1,M!==null&&(window.clearTimeout(M),M=null)}async function D(e){const t=ve(),o=S()?.value??"",i=Array.from(y)[0]??1;if(!i){A();return}const l=Date.now();if(K===i&&l-Z<250)return;if(K=i,Z=l,!t){A();return}let r="";if(o&&(r=te(o,i)),!r.trim()&&i>1&&o){const c=te(o,i-1);c.trim()&&(r=c)}let p=t;try{const c=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});c?.ok&&typeof c.code=="string"&&(p=c.code)}catch{}me(r)&&(R.push([p,r]),he()),A()}function me(e){const t=e.trim();return t?/[;}]\s*$/.test(t)?!0:t==="else"||t==="if"||t==="while"||/^else\b/.test(t)&&/\{\s*$/.test(t)?!1:t.replace(/[{}();]/g," ").trim().split(/\s+/).filter(Boolean).length>1:!1}function te(e,t){return e.split(`
`)[t-1]??""}async function he(){if(!B){B=!0;try{for(;R.length>0;){const[e,t]=R.shift();console.log("This is the focus line: ",t),console.log("the code so far: ",e),X=!0;const n=await b.runtime.sendMessage({action:"guide-mode",payload:{action:"guide-mode",sessionId:s?.sessionId??"",problem:s?.problem??"",topics:s?.topics,code:e,focusLine:t,rollingStateGuideMode:s?.rollingStateGuideMode}});if(!n)console.log("failure for guide mode");else{const o=n.success?n.reply:null;o?.state_update?.lastEdit?.trim()&&s&&(s.rollingStateGuideMode.lastEdit=o.state_update.lastEdit);const i=o?.nudge;s&&typeof i=="string"&&s.content.push(`${i}
`);const l=o?.topics;if(l&&typeof l=="object")for(const[r,p]of Object.entries(l)){if(!p||typeof p!="object")continue;const c=p.thoughts_to_remember,a=p.pitfalls,u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],g=Array.isArray(a)?a:typeof a=="string"&&a.trim()?[a.trim()]:[];s&&(s.topics[r]??={thoughts_to_remember:[],pitfalls:[]},u.length>0&&s.topics[r].thoughts_to_remember.push(...u),g.length>0&&s.topics[r].pitfalls.push(...g))}X=!1}}}finally{B=!1}}}function ne(){if(!s?.guideModeEnabled)return;const e=S();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=ee(t,n);!y.has(o)&&y.size==0&&y.add(o),L||(L=!0),M!==null&&window.clearTimeout(M),M=window.setTimeout(()=>{D()},1e4),!y.has(o)&&y.size==1&&D()}function oe(){if(!s?.guideModeEnabled||!L)return;const e=S();if(!e)return;const t=e.value??"",n=e.selectionStart??0,o=ee(t,n);if(k===null){k=o;return}o!==k&&(k=o,!y.has(o)&&y.size==1&&D())}function ie(){const e=S();if(!e){J<5&&(J+=1,window.setTimeout(ie,500));return}e.addEventListener("input",ne),document.addEventListener("selectionchange",oe)}function be(){const e=S();e&&(e.removeEventListener("input",ne),document.removeEventListener("selectionchange",oe))}function Pe(){}async function xe(e,t){console.log("this is the query asked: ",t);const n=await b.runtime.sendMessage({action:"ask-anything",payload:{sessionId:s?.sessionId??"",query:t,action:"ask-anything"}});return console.log("this is the response: ",n),n||"Failure"}function re(e){e.style.display="flex",e.classList.add("open")}function ye(e){e.classList.remove("open"),e.style.display="none"}function we(e){if(!d)return;const t=e.getBoundingClientRect(),n=d.getBoundingClientRect(),o=n.width||50,i=n.height||50,p=t.left+t.width/2<=window.innerWidth/2?10:window.innerWidth-o-10,c=Math.max(10,Math.min(window.innerHeight/2-i/2,window.innerHeight-i-10));d.style.left=`${p}px`,d.style.top=`${c}px`,d.style.right="auto",d.style.bottom="auto",d.style.transform="",x={x:p,y:c},Q()}function ve(){return document.querySelector(".monaco-scrollable-element.editor-scrollable.vs.mac")?.innerText??""}function C(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $(e){return e.split("`").map((n,o)=>o%2===1?`<code>${C(n)}</code>`:C(n)).join("")}function Ee(e){const t=e.replace(/\r\n/g,`
`).split(`
`);let n="",o=[],i=null;const l=()=>{o.length!==0&&(n+=`<p>${$(o.join(" "))}</p>`,o=[])},r=()=>{i&&(n+=`</${i}>`,i=null)};for(const p of t){const c=p.trim();if(!c){l(),r();continue}const a=c.match(/^(#{1,3})\s+(.*)$/);if(a){l(),r();const f=a[1].length;n+=`<h${f}>${$(a[2])}</h${f}>`;continue}const u=c.match(/^(\d+)\.\s+(.*)$/);if(u){l(),i&&i!=="ol"&&r(),i||(i="ol",n+="<ol>"),n+=`<li>${$(u[2])}</li>`;continue}const g=c.match(/^[-*]\s+(.*)$/);if(g){l(),i&&i!=="ul"&&r(),i||(i="ul",n+="<ul>"),n+=`<li>${$(g[1])}</li>`;continue}o.push(c)}return l(),r(),n}function se(e){const t=[],n=/```(\w+)?\n([\s\S]*?)```/g;let o=0,i;for(;(i=n.exec(e))!==null;)i.index>o&&t.push({type:"text",content:e.slice(o,i.index)}),t.push({type:"code",content:i[2]??"",lang:i[1]??""}),o=n.lastIndex;return o<e.length&&t.push({type:"text",content:e.slice(o)}),t.map(l=>l.type==="code"?`<pre><code${l.lang?` data-lang="${C(l.lang)}"`:""}>${C(l.content.trimEnd())}</code></pre>`:Ee(l.content)).join("")}function ae(e,t,n){const o=e.querySelector(".tutor-panel-content");if(!o)return null;const i=document.createElement("div");return i.className=`tutor-panel-message tutor-panel-message--${n}`,n==="assistant"?i.innerHTML=se(t):i.textContent=t,o.append(i),o.scrollTop=i.offsetTop,i}function Me(e){const t=e.querySelector(".tutor-panel-content");if(!t||t.querySelector(".tutor-panel-loading"))return;const n=document.createElement("div");n.className="tutor-panel-loading",n.textContent="Checking...",t.append(n),t.scrollTop=n.offsetTop}function Se(e){e.querySelector(".tutor-panel-content")?.querySelector(".tutor-panel-loading")?.remove()}function Te(e,t,n){return new Promise(o=>{let i=0;const l=2,r=()=>{i=Math.min(n.length,i+l),e.textContent=n.slice(0,i),t.scrollTop=e.offsetTop,i<n.length?window.setTimeout(r,12):o()};r()})}async function Ie(e,t){try{const n=await b.runtime.sendMessage({action:"check-code",payload:{sessionId:s?.sessionId??"",topics:s?.topics,code:t,action:"check-code"}}),o=n?.resp;s&&typeof o=="string"&&s.content.push(`${o}
`);const i=e.querySelector(".tutor-panel-content");if(i&&typeof o=="string"){const r=ae(e,"","assistant");if(!r)return;await Te(r,i,o),r.innerHTML=se(o),i.scrollTop=r.offsetTop}const l=n?.topics;if(l&&typeof l=="object")for(const[r,p]of Object.entries(l)){if(!p||typeof p!="object")continue;const c=p.thoughts_to_remember,a=p.pitfalls,u=Array.isArray(c)?c:typeof c=="string"&&c.trim()?[c.trim()]:[],g=Array.isArray(a)?a:typeof a=="string"&&a.trim()?[a.trim()]:[];s&&(s.topics[r]??={thoughts_to_remember:[],pitfalls:[]},u.length>0&&s.topics[r].thoughts_to_remember.push(...u),g.length>0&&s.topics[r].pitfalls.push(...g))}return console.log("this is the object now: ",s?.topics),n?.resp}catch(n){return console.error("checkMode failed",n),"Failure"}}function Le(e){const t=e.querySelector(".tutor-panel-close"),n=e.querySelector(".btn-help-mode");e.querySelector(".btn-guide-mode")?.addEventListener("click",()=>{s&&(s.guideModeEnabled=!s.guideModeEnabled,s.guideModeEnabled?ie():be())});const i=e.querySelector(".tutor-panel-prompt");e.querySelector(".tutor-panel-send")?.addEventListener("click",async()=>{if(s?.prompt){const f=s.prompt;ae(e,f,"user"),await xe(e,f),s.prompt=""}else return void 0}),t?.addEventListener("click",async()=>U()),n?.addEventListener("click",async()=>{let f="";s&&(s.checkModeEnabled=!0),Me(e);try{const h=await b.runtime.sendMessage({type:"GET_MONACO_CODE"});h?.ok&&typeof h.code=="string"&&s&&(f=h.code);const m=await Ie(e,f);console.log("this is the response: ",m)}catch{}finally{s&&(s.checkModeEnabled=!1),Se(e)}}),i?.addEventListener("input",()=>{s&&(s.prompt=i.value)});let r=!1,p=0,c=0;const a=e.querySelector(".tutor-panel-topbar"),u=f=>{if(!r)return;const h=f.clientX-p,m=f.clientY-c,w=window.innerWidth-e.offsetWidth,v=window.innerHeight-e.offsetHeight,F=Math.max(10,Math.min(h,w)),W=Math.max(10,Math.min(m,v));e.style.left=`${F}px`,e.style.top=`${W}px`},g=()=>{r&&(r=!1,document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",g),s&&(s.position={x:e.offsetLeft,y:e.offsetTop}))};a?.addEventListener("mousedown",f=>{f.preventDefault(),r=!0,p=f.clientX-e.getBoundingClientRect().left,c=f.clientY-e.getBoundingClientRect().top,document.addEventListener("mousemove",u),document.addEventListener("mouseup",g)})}function N(e,...t){}const ke={debug:(...e)=>N(console.debug,...e),log:(...e)=>N(console.log,...e),warn:(...e)=>N(console.warn,...e),error:(...e)=>N(console.error,...e)};class G extends Event{constructor(t,n){super(G.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}static EVENT_NAME=O("wxt:locationchange")}function O(e){return`${b?.runtime?.id}:content:${e}`}function Ae(e){let t,n;return{run(){t==null&&(n=new URL(location.href),t=e.setInterval(()=>{let o=new URL(location.href);o.href!==n.href&&(window.dispatchEvent(new G(o,n)),n=o)},1e3))}}}class _{constructor(t,n){this.contentScriptName=t,this.options=n,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}static SCRIPT_STARTED_MESSAGE_TYPE=O("wxt:content-script-started");isTopFrame=window.self===window.top;abortController;locationWatcher=Ae(this);receivedMessageIds=new Set;get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return b.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,n){const o=setInterval(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearInterval(o)),o}setTimeout(t,n){const o=setTimeout(()=>{this.isValid&&t()},n);return this.onInvalidated(()=>clearTimeout(o)),o}requestAnimationFrame(t){const n=requestAnimationFrame((...o)=>{this.isValid&&t(...o)});return this.onInvalidated(()=>cancelAnimationFrame(n)),n}requestIdleCallback(t,n){const o=requestIdleCallback((...i)=>{this.signal.aborted||t(...i)},n);return this.onInvalidated(()=>cancelIdleCallback(o)),o}addEventListener(t,n,o,i){n==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),t.addEventListener?.(n.startsWith("wxt:")?O(n):n,o,{...i,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),ke.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:_.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){const n=t.data?.type===_.SCRIPT_STARTED_MESSAGE_TYPE,o=t.data?.contentScriptName===this.contentScriptName,i=!this.receivedMessageIds.has(t.data?.messageId);return n&&o&&i}listenForNewerScripts(t){let n=!0;const o=i=>{if(this.verifyScriptStartedEvent(i)){this.receivedMessageIds.add(i.data.messageId);const l=n;if(n=!1,l&&t?.ignoreFirstEvent)return;this.notifyInvalidated()}};addEventListener("message",o),this.onInvalidated(()=>removeEventListener("message",o))}}function Fe(){}function P(e,...t){}const Ce={debug:(...e)=>P(console.debug,...e),log:(...e)=>P(console.log,...e),warn:(...e)=>P(console.warn,...e),error:(...e)=>P(console.error,...e)};return(async()=>{try{const{main:e,...t}=le,n=new _("content",t);return await e(n)}catch(e){throw Ce.error('The content script "content" crashed on startup!',e),e}})()})();
content;