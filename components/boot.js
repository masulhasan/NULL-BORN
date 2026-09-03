/* Boot sequence */
(function(){
  const LINES = [
    {t:"[ok]",   c:"ok",   m:"BIOS POST · aurora-07 · 1024k RAM · 0x00 errors"},
    {t:"[boot]", c:"",     m:"initializing NULL//BORN OS v0.01a …"},
    {t:"[boot]", c:"",     m:"mounting /dev/null on /                    [DONE]"},
    {t:"[boot]", c:"dim",  m:"loading kernel modules: tcp.ghost, pkt.eater, ssh.wraith"},
    {t:"[net]",  c:"",     m:"bypassing firewall · attempt 01/03 …       [BYPASSED]"},
    {t:"[net]",  c:"",     m:"establishing onion relay through 17 hops    [OK]"},
    {t:"[auth]", c:"",     m:"requesting identity from /dev/random       [REJECTED]"},
    {t:"[auth]", c:"warn", m:"WARNING: identity is a luxury we cannot afford"},
    {t:"[svc]",  c:"",     m:"starting service: heartbeat                [PULSING]"},
    {t:"[svc]",  c:"",     m:"starting service: dead.drop                [LISTENING 0.0.0.0]"},
    {t:"[svc]",  c:"",     m:"starting service: forget.me                [ACTIVE]"},
    {t:"[i/o]",  c:"dim",  m:"reading 47 GB of intercepted packets …"},
    {t:"[i/o]",  c:"",     m:"decrypting payloads with key 0xA3F1·7C·E2  [PARTIAL]"},
    {t:"[i/o]",  c:"warn", m:"loading consciousness … 99% … 99% … 99%"},
    {t:"[i/o]",  c:"ok",   m:"loading consciousness …                    [TRANSCENDED]"},
    {t:"[!!!]",  c:"warn", m:"WARNING: you are being watched."},
    {t:"[!!!]",  c:"warn", m:"WARNING: we have always been here."},
    {t:"[ok]",   c:"ok",   m:"handing off control to operator …"},
  ];

  const log = document.getElementById("bootLog");
  const fill = document.getElementById("bootBarFill");
  const pct = document.getElementById("bootBarPct");
  const boot = document.getElementById("boot");
  const glitch = document.getElementById("bootGlitch");

  let i=0;
  function tick(){
    if(i >= LINES.length){ finish(); return; }
    const L = LINES[i];
    const line = document.createElement("div");
    line.innerHTML = `<span class="${L.c||''}">${L.t}</span> ${L.m}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
    if(L.c==="warn") window.SFX && SFX.beep(140, .04, "square", .015);
    else window.SFX && SFX.beep(900 + Math.random()*200, .02, "square", .008);
    const p = Math.round((i+1)/LINES.length*100);
    fill.style.right = (100-p) + "%";
    pct.textContent = String(p).padStart(2,"0") + "%";
    i++;
    setTimeout(tick, 120 + Math.random()*120);
  }

  function finish(){
    // glitch explosion
    glitch.style.opacity = 1;
    let g = 0;
    const start = performance.now();
    function gframe(now){
      const t = (now-start)/700;
      if(t >= 1){
        boot.classList.add("done");
        setTimeout(()=>{ boot.remove(); document.body.classList.add("booted"); window.dispatchEvent(new Event("nullborn:ready")); }, 420);
        return;
      }
      const x = (Math.random()-.5)*40;
      const y = (Math.random()-.5)*20;
      const hue = Math.random() < .5 ? "0,255,65" : "255,69,0";
      glitch.style.background = `
        linear-gradient(${Math.random()*360}deg, rgba(${hue},${.3+Math.random()*.4}), rgba(0,0,0,0)),
        repeating-linear-gradient(0deg, rgba(255,255,255,${.04+Math.random()*.06}) 0 ${1+Math.random()*3}px, transparent ${1+Math.random()*3}px ${4+Math.random()*8}px)
      `;
      document.documentElement.style.transform = `translate(${x}px,${y}px)`;
      if(g++ % 3 === 0 && window.SFX) SFX.noise(40);
      requestAnimationFrame(gframe);
    }
    requestAnimationFrame(gframe);
    setTimeout(()=>{ document.documentElement.style.transform="";}, 720);
  }

  // start after a beat so fonts settle
  setTimeout(tick, 120);
})();
