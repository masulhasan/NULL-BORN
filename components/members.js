/* Members: procedural noise avatars + skill bars */
(function(){
  const MEMBERS = [
    { code:"V0ID",      real:"ANONYMOUS::01", role:"kernel surgeon",        skills:[["packet weaving",96],["sleep",12],["forgery",78]] },
    { code:"HEX_RUTH",  real:"ANONYMOUS::02", role:"social engineer",       skills:[["pretexts",91],["patience",88],["regret",4]] },
    { code:"GREY_OWL",  real:"ANONYMOUS::03", role:"signals analyst",       skills:[["radio drift",84],["maths",92],["sleep",6]] },
    { code:"M0THER",    real:"ANONYMOUS::04", role:"infra · ghost ops",     skills:[["dead drops",89],["redaction",95],["empathy",71]] },
    { code:"PATIENT_07",real:"ANONYMOUS::05", role:"payload composer",      skills:[["asm",97],["restraint",62],["sleep",2]] },
    { code:"SILENT_E",  real:"ANONYMOUS::06", role:"counter-intel",         skills:[["paranoia",99],["pattern",90],["trust",0]] },
  ];

  const grid = document.getElementById("memGrid");
  if(!grid) return;

  function drawAvatar(canvas, seed){
    canvas.width = 168; canvas.height = 168;
    const ctx = canvas.getContext("2d");
    // procedural noise face: pixel grid with symmetry
    const cols = 14, rows = 14, cell = 12;
    // seeded RNG
    let s = seed * 9301 + 49297;
    const rnd = ()=> { s = (s*9301+49297)%233280; return s/233280; };

    ctx.fillStyle = "#000"; ctx.fillRect(0,0,168,168);

    // base scanline
    for(let y=0;y<rows;y++){
      for(let x=0;x<Math.ceil(cols/2); x++){
        const v = rnd();
        // shape regions: head ring vs interior
        const cx = (cols-1)/2, cy=(rows-1)/2;
        const d = Math.hypot(x-cx, y-cy);
        if(d > 6.5) continue;
        let color;
        if(v < 0.12) color = "rgba(255,69,0,0.85)";
        else if(v < 0.55) color = "rgba(0,255,65,0.85)";
        else if(v < 0.78) color = "rgba(0,255,65,0.35)";
        else color = "rgba(240,240,240,0.6)";
        ctx.fillStyle = color;
        ctx.fillRect(x*cell, y*cell, cell-1, cell-1);
        // mirror
        ctx.fillRect((cols-1-x)*cell, y*cell, cell-1, cell-1);
      }
    }
    // eyes
    ctx.fillStyle = "#080808";
    ctx.fillRect(4*cell, 5*cell, cell, cell);
    ctx.fillRect(9*cell, 5*cell, cell, cell);
    ctx.fillStyle = "#00FF41";
    ctx.fillRect(4*cell+3, 5*cell+3, 4, 4);
    ctx.fillRect(9*cell+3, 5*cell+3, 4, 4);
    // mouth: redacted bar
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(4*cell, 9*cell+4, 6*cell, cell-2);
    ctx.strokeStyle = "rgba(240,240,240,0.85)";
    ctx.strokeRect(4*cell+0.5, 9*cell+4.5, 6*cell-1, cell-3);

    // scanline overlay
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    for(let y=0;y<168;y+=2) ctx.fillRect(0,y,168,1);
  }

  function tickReroll(canvas, seed){
    // tiny live flicker — re-render a few cells every few seconds
    setInterval(()=>{
      drawAvatar(canvas, seed + Math.floor(Math.random()*1000));
    }, 1800 + Math.random()*2200);
  }

  MEMBERS.forEach((m,i)=>{
    const el = document.createElement("article");
    el.className = "mem-card";
    el.innerHTML = `
      <div class="top">
        <canvas class="avatar"></canvas>
        <div class="who">
          <div class="codename">${m.code}</div>
          <div class="real">${m.real}</div>
          <div class="role">${m.role}</div>
        </div>
        <div class="status"><span class="led"></span><span>ACTIVE</span></div>
      </div>
      <div class="skills">
        ${m.skills.map(s=>`
          <div class="skill ${s[1]>90?'high':''}" data-v="${s[1]}">
            <div class="row"><span>${s[0]}</span><span class="dim">${s[1]<10?'0':''}${s[1]}%</span></div>
            <div class="bar"><i style="width:0%"></i></div>
          </div>
        `).join("")}
      </div>
      <div class="foot">
        <span>joined · ████/██/██</span>
        <span>last seen · 00:00:0${(i+1)}</span>
      </div>
    `;
    grid.appendChild(el);
    const canvas = el.querySelector("canvas.avatar");
    drawAvatar(canvas, i*73 + 11);
    tickReroll(canvas, i*73 + 11);
  });

  // animate skill bars on scroll-in
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll(".skill").forEach((s, idx)=>{
        const v = +s.dataset.v;
        const bar = s.querySelector("i");
        setTimeout(()=> bar.style.transition = "width 1.2s cubic-bezier(.2,.8,.2,1)", 50);
        setTimeout(()=> bar.style.width = v + "%", 80 + idx*120);
      });
      io.unobserve(e.target);
    });
  }, { threshold:0.3 });
  grid.querySelectorAll(".mem-card").forEach(c => io.observe(c));
})();
