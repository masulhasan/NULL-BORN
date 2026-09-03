/* glitch text utility */
(function(){
  const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@█▓▒░01∆Ξ¥Φ◇◆◢◣◤◥".split("");

  function rnd(){ return GLYPHS[Math.floor(Math.random()*GLYPHS.length)]; }

  // Reveal text from scrambled glyphs over `dur` ms
  function scrambleTo(el, finalText, dur=600){
    if(el.__glitching) return;
    el.__glitching = true;
    el.classList.add("glitching");
    const start = performance.now();
    const len = finalText.length;
    function frame(now){
      const t = Math.min(1, (now-start)/dur);
      let out = "";
      for(let i=0; i<len; i++){
        const reveal = i / len;
        if(t > reveal + 0.05){ out += finalText[i]; }
        else if(finalText[i] === " "){ out += " "; }
        else { out += rnd(); }
      }
      el.textContent = out;
      if(t < 1) requestAnimationFrame(frame);
      else {
        el.textContent = finalText;
        el.classList.remove("glitching");
        el.__glitching = false;
      }
    }
    requestAnimationFrame(frame);
  }

  // Brief 300ms random char glitch on hover/load
  function flicker(el, dur=300){
    if(el.__flick) return;
    el.__flick = true;
    const orig = el.dataset.origText || (el.dataset.origText = el.textContent);
    const start = performance.now();
    function step(now){
      const t = (now-start)/dur;
      if(t >= 1){ el.textContent = orig; el.__flick = false; return; }
      let s = "";
      for(let i=0;i<orig.length;i++){
        if(Math.random() < 0.7 || orig[i]===" "){ s += orig[i]; }
        else { s += rnd(); }
      }
      el.textContent = s;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  window.Glitch = { scrambleTo, flicker, rnd };
})();
