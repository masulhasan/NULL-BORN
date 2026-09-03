/* Intruder popup, Konami code, DevTools detect, manifesto ticker, hud clock */
(function(){
  // ---- ticker text ----
  const tk = document.getElementById("maniTicker");
  if(tk){
    const phrases = ["NULL//BORN · NULL//BORN · ", "we are not coming · we are already here · ", "404 // SOUL NOT FOUND · ", "uplink secure · uplink lies · ", "every packet has a memory · ", "ssh -l null we.are@root · "];
    const text = phrases.concat(phrases).concat(phrases).join("");
    const span = document.createElement("span");
    span.textContent = text + text;
    tk.appendChild(span);
  }

  // ---- HUD clock ----
  const clock = document.getElementById("hudClock");
  function tickClock(){
    if(!clock) return;
    const d = new Date();
    clock.textContent = d.toISOString().slice(11,19);
  }
  setInterval(tickClock, 1000); tickClock();

  // ---- Intruder random popup ----
  const intruder = document.getElementById("intruder");
  const ipEl = document.getElementById("intruderIp");
  function randIp(){
    return [0,0,0,0].map(()=>String(100+Math.floor(Math.random()*155)).padStart(3,"0")).join(".");
  }
  function spawnIntruder(){
    if(!intruder) return;
    ipEl.textContent = randIp();
    intruder.classList.add("on");
    if(window.SFX) SFX.beep(180,.08,"square",.02);
    setTimeout(()=> intruder.classList.remove("on"), 2000);
  }
  // first one a few seconds after boot, then random
  window.addEventListener("nullborn:ready", ()=>{
    setTimeout(spawnIntruder, 6000);
    setInterval(()=>{
      if(Math.random() < 0.5) spawnIntruder();
    }, 18000);
  });

  // ---- Konami code ----
  const KCODE = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];
  let kpos = 0;
  const alert = document.getElementById("alert");
  window.addEventListener("keydown", (e)=>{
    const key = e.code;
    if(key === KCODE[kpos]) kpos++; else kpos = (key===KCODE[0]?1:0);
    if(kpos === KCODE.length){
      kpos = 0;
      triggerAlert();
    }
  });
  function triggerAlert(){
    if(!alert) return;
    alert.classList.add("on");
    if(window.SFX) SFX.siren(2600);
    setTimeout(()=> alert.classList.remove("on"), 2800);
  }

  // ---- DevTools detect: threshold trick ----
  function checkDevtools(){
    const wDelta = Math.abs(window.outerWidth - window.innerWidth);
    const hDelta = Math.abs(window.outerHeight - window.innerHeight);
    const open = wDelta > 160 || hDelta > 200;
    document.body.classList.toggle("devtools-open", open);
  }
  setInterval(checkDevtools, 800);

  // ---- Custom cursor ----
  const cursor = document.getElementById("cursor");
  const cx = document.getElementById("curX");
  const cy = document.getElementById("curY");
  if(cursor){
    let mx=window.innerWidth/2, my=window.innerHeight/2;
    let tx=mx, ty=my;
    window.addEventListener("mousemove",(e)=>{ tx=e.clientX; ty=e.clientY; });
    function tick(){
      mx += (tx-mx)*0.4; my += (ty-my)*0.4;
      cursor.style.transform = `translate(${mx}px, ${my}px)`;
      cx.textContent = "X:" + String(Math.round(mx)).padStart(4,"0");
      cy.textContent = "Y:" + String(Math.round(my)).padStart(4,"0");
      requestAnimationFrame(tick);
    }
    tick();
    document.addEventListener("mouseover",(e)=>{
      const t = e.target;
      const hot = t.closest && (t.closest("a,button,input,.ops-card,.mem-card,.tab"));
      cursor.classList.toggle("cursor-hot", !!hot);
    });
  }

  // ---- Glitch text on load + hover ----
  function applyGlitch(){
    const els = document.querySelectorAll("[data-glitch], h1, h2");
    els.forEach(el=>{
      // skip giant manifesto words (handled separately) and section markers
      if(el.closest(".mani-stage")) return;
      if(el.closest(".section-marker")) return;
      // skip nodes whose textContent has children — only flick plain text
      if(el.childElementCount > 0) return;
      el.addEventListener("mouseenter", ()=> window.Glitch && Glitch.flicker(el, 280));
    });
  }
  window.addEventListener("nullborn:ready", ()=>{
    applyGlitch();
    // run a one-shot scramble on hero title + sub
    const t = document.querySelector(".title");
    const s = document.querySelector(".sub");
    if(t) Glitch.scrambleTo(t, "NULL//BORN", 700);
    if(s) Glitch.scrambleTo(s, "we didn't break the system. we became it.", 1100);
  });
})();
