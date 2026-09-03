/* 3D wireframe globe with orbiting points + breach pulses */
(function(){
  const canvas = document.getElementById("globe");
  if(!canvas || !window.THREE) return;

  const isMobile = window.matchMedia("(max-width: 720px)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 5.6);

  function resize(){
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize(); window.addEventListener("resize", resize);

  const group = new THREE.Group();
  scene.add(group);

  // ---- wireframe globe ----
  const R = 1.8;
  const sphere = new THREE.SphereGeometry(R, 36, 24);
  const wire = new THREE.WireframeGeometry(sphere);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x00FF41, transparent:true, opacity:0.18 });
  const wireMesh = new THREE.LineSegments(wire, wireMat);
  group.add(wireMesh);

  // bold equator + meridian
  function ring(radius, color, op){
    const pts = [];
    for(let i=0;i<=128;i++){
      const a = (i/128)*Math.PI*2;
      pts.push(new THREE.Vector3(Math.cos(a)*radius, 0, Math.sin(a)*radius));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(g, new THREE.LineBasicMaterial({color, transparent:true, opacity:op}));
  }
  const eq = ring(R*1.001, 0x00FF41, .55);
  const mer = ring(R*1.001, 0x00FF41, .35); mer.rotation.x = Math.PI/2;
  const mer2 = ring(R*1.001, 0x00FF41, .25); mer2.rotation.z = Math.PI/2;
  group.add(eq, mer, mer2);

  // ---- surface beach-points (on sphere) ----
  const surfaceCount = isMobile ? 220 : 600;
  const surfGeom = new THREE.BufferGeometry();
  const sPos = new Float32Array(surfaceCount*3);
  const sCol = new Float32Array(surfaceCount*3);
  const sSize = new Float32Array(surfaceCount);
  for(let i=0;i<surfaceCount;i++){
    // uniformly distributed on sphere
    const u = Math.random(), v = Math.random();
    const theta = 2*Math.PI*u;
    const phi = Math.acos(2*v-1);
    const x = R * Math.sin(phi)*Math.cos(theta);
    const y = R * Math.sin(phi)*Math.sin(theta);
    const z = R * Math.cos(phi);
    sPos[i*3]=x; sPos[i*3+1]=y; sPos[i*3+2]=z;
    const isBreach = Math.random() < 0.03;
    if(isBreach){ sCol[i*3]=1; sCol[i*3+1]=0.27; sCol[i*3+2]=0;}
    else { sCol[i*3]=0; sCol[i*3+1]=1; sCol[i*3+2]=0.25;}
    sSize[i] = isBreach ? 4 : (Math.random()*1.4 + 0.6);
  }
  surfGeom.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
  surfGeom.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
  surfGeom.setAttribute("aSize", new THREE.BufferAttribute(sSize, 1));

  // simple round point texture
  function pointTex(){
    const s=64; const c = document.createElement("canvas"); c.width=c.height=s;
    const x = c.getContext("2d");
    const grd = x.createRadialGradient(s/2,s/2,0, s/2,s/2,s/2);
    grd.addColorStop(0,"rgba(255,255,255,1)");
    grd.addColorStop(0.3,"rgba(255,255,255,0.6)");
    grd.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle=grd; x.fillRect(0,0,s,s);
    const t = new THREE.CanvasTexture(c);
    return t;
  }
  const ptex = pointTex();

  const surfMat = new THREE.PointsMaterial({
    size: 0.045, vertexColors:true, transparent:true, opacity:1,
    map:ptex, alphaTest:0.01, depthWrite:false,
    blending:THREE.AdditiveBlending,
  });
  const surfPoints = new THREE.Points(surfGeom, surfMat);
  group.add(surfPoints);

  // ---- orbiting satellites ----
  const orbCount = isMobile ? 140 : 350;
  const orbGeom = new THREE.BufferGeometry();
  const oPos = new Float32Array(orbCount*3);
  const oCol = new Float32Array(orbCount*3);
  // store params per particle: radius, theta0, phi (orbit tilt), speed
  const orbits = [];
  for(let i=0;i<orbCount;i++){
    const r = R * (1.15 + Math.random()*1.25);
    const theta = Math.random()*Math.PI*2;
    const tilt = (Math.random()-.5)*Math.PI;
    const spin = (Math.random()-.5)*Math.PI*0.4;
    const speed = (0.15 + Math.random()*0.6) * (Math.random()<.5?1:-1);
    orbits.push({r,theta,tilt,spin,speed});
    oCol[i*3]=0; oCol[i*3+1]=1; oCol[i*3+2]=0.25;
  }
  orbGeom.setAttribute("position", new THREE.BufferAttribute(oPos, 3));
  orbGeom.setAttribute("color", new THREE.BufferAttribute(oCol, 3));
  const orbMat = new THREE.PointsMaterial({ size:0.06, vertexColors:true, transparent:true, opacity:.9, map:ptex, depthWrite:false, blending:THREE.AdditiveBlending });
  const orbPts = new THREE.Points(orbGeom, orbMat);
  group.add(orbPts);

  // ---- breach pulse rings ----
  const breaches = [];
  function spawnBreach(){
    // pick a random surface point with high probability of being a breach (orange)
    const idx = Math.floor(Math.random()*surfaceCount);
    const x = sPos[idx*3], y=sPos[idx*3+1], z=sPos[idx*3+2];
    const isOrange = sCol[idx*3] > .5;
    const color = isOrange ? 0xFF4500 : 0x00FF41;
    const ringG = new THREE.RingGeometry(0.02, 0.025, 32);
    const ringM = new THREE.MeshBasicMaterial({ color, transparent:true, opacity:.9, side:THREE.DoubleSide });
    const m = new THREE.Mesh(ringG, ringM);
    m.position.set(x,y,z);
    // orient ring to face outward
    m.lookAt(0,0,0);
    m.userData.t = 0;
    m.userData.life = 1.2 + Math.random()*0.8;
    group.add(m);
    breaches.push(m);
  }
  setInterval(spawnBreach, 320);

  // ---- ASCII drift sprites ----
  const asciiFragments = ["01001110", "0x4E55", "[REDACTED]", "ghost.exe", "ssh -l null", "./run --null", "404 // SOUL", "ROOT::ACCESS", "EOF", "NULL//BORN"];
  const sprites = [];
  function asciiTex(text){
    const c = document.createElement("canvas"); c.width=512; c.height=64;
    const x = c.getContext("2d");
    x.fillStyle = "rgba(0,0,0,0)"; x.fillRect(0,0,512,64);
    x.font = "28px 'Share Tech Mono', monospace";
    x.textBaseline="middle";
    x.fillStyle = "rgba(0,255,65,0.55)";
    x.fillText(text, 8, 32);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }
  if(!isMobile){
    for(let i=0;i<10;i++){
      const tx = asciiTex(asciiFragments[i%asciiFragments.length]);
      const mat = new THREE.SpriteMaterial({ map:tx, transparent:true, opacity:0.4, depthWrite:false });
      const s = new THREE.Sprite(mat);
      s.scale.set(2.4, 0.3, 1);
      s.position.set((Math.random()-.5)*6, (Math.random()-.5)*4, (Math.random()-.5)*4);
      s.userData = { vx: (Math.random()-.5)*0.005, vy: (Math.random()-.5)*0.002 };
      scene.add(s); sprites.push(s);
    }
  }

  // ---- mouse tilt ----
  const target = { x:0, y:0 };
  window.addEventListener("mousemove", (e)=>{
    target.x = (e.clientX/window.innerWidth - 0.5) * 0.8;
    target.y = (e.clientY/window.innerHeight - 0.5) * 0.6;
  });

  // ---- animate ----
  let t0 = performance.now();
  function tick(now){
    const dt = Math.min(0.05, (now-t0)/1000);
    t0 = now;

    group.rotation.y += dt * 0.08;
    group.rotation.x += (target.y - group.rotation.x) * 0.05;
    group.rotation.z += (target.x*0.4 - group.rotation.z) * 0.05;

    // orbits
    const op = orbGeom.attributes.position.array;
    for(let i=0;i<orbCount;i++){
      const o = orbits[i];
      o.theta += dt * o.speed;
      const x = Math.cos(o.theta)*o.r;
      const y = Math.sin(o.theta)*o.r*0.3;
      const z = Math.sin(o.theta)*o.r;
      // tilt the orbit plane
      const ct = Math.cos(o.tilt), st = Math.sin(o.tilt);
      const yy = y*ct - z*st;
      const zz = y*st + z*ct;
      op[i*3]=x; op[i*3+1]=yy; op[i*3+2]=zz;
    }
    orbGeom.attributes.position.needsUpdate = true;

    // breaches
    for(let i=breaches.length-1; i>=0; i--){
      const b = breaches[i];
      b.userData.t += dt;
      const k = b.userData.t / b.userData.life;
      const s = 1 + k*8;
      b.scale.set(s,s,s);
      b.material.opacity = Math.max(0, 0.9*(1-k));
      if(k >= 1){
        group.remove(b);
        b.geometry.dispose(); b.material.dispose();
        breaches.splice(i,1);
      }
    }

    // sprites
    sprites.forEach(s=>{
      s.position.x += s.userData.vx;
      s.position.y += s.userData.vy;
      if(s.position.x > 4) s.position.x = -4;
      if(s.position.x < -4) s.position.x = 4;
      if(s.position.y > 3) s.position.y = -3;
      if(s.position.y < -3) s.position.y = 3;
    });

    // small surface flicker
    surfMat.opacity = 0.85 + Math.sin(now*0.003)*0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
