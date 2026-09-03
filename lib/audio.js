/* tiny Web Audio FX */
(function(){
  let ctx;
  function ac(){
    if(!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)();
    return ctx;
  }
  function beep(freq=440, dur=.08, type="square", gain=.03){
    try{
      const c = ac();
      const o = c.createOscillator(); const g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g); g.connect(c.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.stop(c.currentTime + dur + .02);
    } catch(e){}
  }
  function siren(durMs=2400){
    try{
      const c = ac();
      const o = c.createOscillator(); const g = c.createGain();
      o.type = "sawtooth";
      o.frequency.value = 380;
      g.gain.value = 0.04;
      o.connect(g); g.connect(c.destination);
      o.start();
      const start = c.currentTime;
      // wail up/down
      let i=0;
      const id = setInterval(()=>{
        i++;
        const f = 380 + Math.sin(i/3)*220;
        o.frequency.setTargetAtTime(f, c.currentTime, 0.05);
      }, 60);
      setTimeout(()=>{
        clearInterval(id);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + .2);
        o.stop(c.currentTime + .25);
      }, durMs);
    } catch(e){}
  }
  function noise(durMs=200){
    try{
      const c = ac();
      const buf = c.createBuffer(1, c.sampleRate*durMs/1000, c.sampleRate);
      const data = buf.getChannelData(0);
      for(let i=0;i<data.length;i++) data[i] = (Math.random()*2-1)*0.4;
      const src = c.createBufferSource(); src.buffer = buf;
      const g = c.createGain(); g.gain.value = 0.05;
      src.connect(g); g.connect(c.destination);
      src.start();
    } catch(e){}
  }
  window.SFX = { beep, siren, noise };
})();
