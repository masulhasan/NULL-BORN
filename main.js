/* Main: scroll-driven manifesto words, nav smooth scroll, join form */
(function(){
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
  }

  // Smooth scroll on nav
  document.querySelectorAll("[data-nav]").forEach(a=>{
    a.addEventListener("click",(e)=>{
      const id = a.getAttribute("href");
      if(id && id.startsWith("#")){
        e.preventDefault();
        const el = document.querySelector(id);
        if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
      }
    });
  });

  // Manifesto words — 3D-staggered, pulled toward camera on scroll
  function setupManifesto(){
    const stage = document.querySelector(".mani-stage");
    if(!stage) return;
    const words = stage.querySelectorAll(".mani-word");
    // initial positions (Z-staggered)
    const place = ()=>{
      const w = stage.clientWidth;
      const baseY = stage.clientHeight/2;
      words.forEach((el, i)=>{
        const z = +el.dataset.z;
        // arrange diagonally across the stage
        const xs = [-0.34, -0.10, 0.16, 0.40];
        const ys = [-0.18, -0.04,  0.10, 0.24];
        const cx = w/2 + xs[i]*w;
        const cy = baseY + ys[i]*stage.clientHeight*0.6;
        el.style.left = cx + "px";
        el.style.top = cy + "px";
        const tz = -300 - z*180;          // far away
        const rot = (i-1.5) * 2;          // slight skew
        el.style.transform = `translate(-50%,-50%) translateZ(${tz}px) rotateY(${rot}deg)`;
        el.style.opacity = 0.18 + z*0.18;
      });
    };
    place();
    window.addEventListener("resize", place);

    if(!window.gsap || !ScrollTrigger) return;

    // Scroll-driven: pull each word toward camera, increase opacity, then push past
    words.forEach((el, i)=>{
      const z = +el.dataset.z;
      gsap.to(el, {
        scrollTrigger:{
          trigger:".mani-stage",
          start:"top bottom",
          end:"bottom top",
          scrub: 0.6,
        },
        keyframes:[
          { translateZ: -300 - z*180, opacity: 0.18 + z*0.18, ease:"none" },
          { translateZ:  120 - i*30,  opacity: 1.0, ease:"none" },
          { translateZ:  480,         opacity: 0.0, ease:"none" },
        ],
      });
    });

    // operations cards: slight pop-in on scroll
    gsap.utils.toArray(".ops-card").forEach((c, i)=>{
      gsap.from(c, {
        y:60, opacity:0, duration:.8, ease:"power3.out",
        scrollTrigger:{ trigger:c, start:"top 92%" },
        delay: (i%3)*0.06,
      });
    });

    // section markers slide in
    gsap.utils.toArray(".section-marker").forEach((m)=>{
      gsap.from(m.querySelectorAll(".num,.lbl,.line"), {
        x:-30, opacity:0, duration:.6, stagger:0.08, ease:"power2.out",
        scrollTrigger:{ trigger:m, start:"top 85%" },
      });
    });
  }

  // Join form
  function setupJoin(){
    const form = document.getElementById("joinForm");
    const input = document.getElementById("joinInput");
    const receipt = document.getElementById("joinReceipt");
    const big = document.getElementById("bigGlitch");
    if(!form) return;

    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      const val = (input.value || "").trim();
      if(!val) { input.focus(); shake(form); return; }

      // big glitch
      big.classList.add("on");
      flashGlitch(big, 700);
      if(window.SFX){ SFX.noise(220); SFX.beep(120,.08,"square",.03); }
      setTimeout(()=> big.classList.remove("on"), 720);

      receipt.textContent = "";
      const final = `> TRANSMISSION RECEIVED.\n> signal: "${val.slice(0,64)}"\n> we will find you.\n> do not refresh.`;
      window.Glitch && Glitch.scrambleTo(receipt, final, 1200);

      input.disabled = true;
      input.value = "";
    });

    input.addEventListener("input",()=>{
      if(window.SFX) SFX.beep(1200+Math.random()*400, .02, "square", .005);
    });

    function shake(el){
      el.animate(
        [{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(-3px)"},{transform:"translateX(0)"}],
        { duration:200 }
      );
    }
    function flashGlitch(el, dur){
      const start = performance.now();
      function f(now){
        const t = (now-start)/dur;
        if(t>=1){ el.style.background = ""; return; }
        const hue = Math.random()<.5 ? "0,255,65" : "255,69,0";
        el.style.background = `linear-gradient(${Math.random()*360}deg, rgba(${hue},${.2+Math.random()*.5}), transparent),
          repeating-linear-gradient(0deg, rgba(255,255,255,${.05+Math.random()*.1}) 0 ${1+Math.random()*3}px, transparent ${1+Math.random()*3}px ${4+Math.random()*8}px)`;
        requestAnimationFrame(f);
      }
      requestAnimationFrame(f);
    }
  }

  window.addEventListener("nullborn:ready", ()=>{
    setupManifesto();
    setupJoin();
  });
})();
