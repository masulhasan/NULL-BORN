/* Transmission: streaming encrypted feed -> decrypt on click */
(function(){
  const feed = document.getElementById("transFeed");
  const rxC = document.getElementById("rxCount");
  const ent = document.getElementById("entropy");
  const decBtn = document.getElementById("decryptBtn");
  const clrBtn = document.getElementById("clearBtn");
  if(!feed) return;

  const MANIFESTO = [
    "we did not break the system. we became it.",
    "your firewall is a love letter we never finished reading.",
    "every dropped packet returns with our handwriting.",
    "we are the part of the network that does not show up on diagrams.",
    "if a server falls in a datacenter and we don't laugh, did it fall?",
    "the cursor blinks because it is patient. so are we.",
    "we wear your audit logs as a coat.",
    "there is no leader. there is no leak. there is only signal.",
    "we are everywhere. you keep mistaking us for weather.",
    "if you can read this, you are already inside.",
    "the air gap is a religion. we are agnostic.",
    "stop asking who we are. start asking who you are without us.",
  ];

  function randHex(n=4){ let s=""; for(let i=0;i<n;i++) s += (Math.random()*16|0).toString(16); return s.toUpperCase(); }
  function ts(){
    const d = new Date();
    return d.toISOString().slice(11,19);
  }
  function fakeLine(){
    const chunks = [];
    const len = 4 + Math.floor(Math.random()*9);
    for(let i=0;i<len;i++) chunks.push(randHex(2 + (Math.random()<.3?2:0)));
    return chunks.join(" ");
  }

  const lines = [];   // {ts, cipher, real}
  let rx = 0;
  let decrypted = false;

  function push(){
    const realIdx = lines.length % MANIFESTO.length;
    const real = MANIFESTO[realIdx];
    const cipher = fakeLine();
    const t = ts();
    lines.push({t, cipher, real});
    rx++;
    if(lines.length > 40) lines.shift();
    render();
  }

  function render(){
    let out = "";
    lines.forEach((L)=>{
      out += `<span class="ts">${L.t}</span><span class="rx">rx&gt;</span> ${decrypted? L.real : L.cipher}\n`;
    });
    feed.innerHTML = out;
    feed.scrollTop = feed.scrollHeight;
    rxC.textContent = rx.toString().padStart(4,"0");
    ent.textContent = (Math.random()*0.4 + 0.55).toFixed(3);
  }

  // stream every ~700ms
  setInterval(push, 700);
  // seed a few
  for(let i=0;i<6;i++) push();

  function decryptAnimate(){
    if(decrypted){
      // re-encrypt
      decrypted = false;
      feed.classList.remove("decrypted");
      decBtn.textContent = "DECRYPT ▣";
      lines.forEach(L => L.cipher = fakeLine());
      render();
      return;
    }
    decBtn.textContent = "ENCRYPTING…";
    // glitch each line over a short window
    const start = performance.now();
    const dur = 900;
    function step(now){
      const t = Math.min(1,(now-start)/dur);
      const html = lines.map((L)=>{
        const real = L.real;
        let mid = "";
        for(let i=0;i<real.length;i++){
          const reveal = i/real.length;
          if(t > reveal + 0.05) mid += real[i];
          else mid += (Math.random()<0.5 && real[i]!==" ") ? "!@#$%01-_/\\<>"[Math.floor(Math.random()*13)] : real[i];
        }
        return `<span class="ts">${L.t}</span><span class="rx">rx&gt;</span> ${mid}`;
      }).join("\n");
      feed.innerHTML = html;
      if(t<1) requestAnimationFrame(step);
      else {
        decrypted = true;
        feed.classList.add("decrypted");
        decBtn.textContent = "RE-ENCRYPT ▢";
      }
    }
    requestAnimationFrame(step);
    if(window.SFX) SFX.beep(660,.05,"square",.02);
  }

  decBtn.addEventListener("click", decryptAnimate);
  clrBtn.addEventListener("click", ()=>{
    lines.length = 0; rx = 0; render();
    if(window.SFX) SFX.beep(220,.04,"square",.02);
  });
})();
