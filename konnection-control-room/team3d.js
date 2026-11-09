/* Konnection Control Room — AI team office (same scene, poses and motion as the Newton build, Konnection palette). Demo data. */
const TEAM3D = (() => {
  const THREE_SRC = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
  const SKIN = 0xf1c7a8, SKIN_D = 0xdca788;
  const LOOK = {
    flash: {shirt: 0x8b4d7b, under: 0xf6f1ee, pants: 0x2b262c, shoe: 0xf3ece6, hair: 0x1a1414, cap: 0x2b262c, cup: true},
    reva:  {shirt: 0xb77aa6, under: 0xf6f1ee, pants: 0x3a3339, shoe: 0x2b262c, hair: 0x5a2e1a, style: 'long'},
    nadia: {shirt: 0xf6f1ee, under: 0xd9cfe9, pants: 0x6f6aa8, shoe: 0x8b4d7b, hair: 0x1b1515, style: 'bun', glasses: true, cup: true},
    tess:  {shirt: 0xa8b59a, under: 0xf6f1ee, pants: 0x2b262c, shoe: 0xf3ece6, hair: 0x8a4a2a, style: 'bob'},
    milo:  {shirt: 0x3a3339, under: 0xc99bbb, pants: 0xc8bec4, shoe: 0x2b262c, hair: 0x2a1c16, cap: 0x8b4d7b, beard: true},
    dex:   {shirt: 0x7c97a8, under: 0xf6f1ee, pants: 0x2b262c, shoe: 0xf3ece6, hair: 0x141212, glasses: true, beard: true, cup: true},
    jada:  {shirt: 0xc98a9e, under: 0xf3e6ee, pants: 0xf6f1ee, shoe: 0x2b262c, hair: 0x120e0e, style: 'long'},
    ray:   {shirt: 0xc99a5b, under: 0x2b262c, pants: 0x3a3339, shoe: 0x8b4d7b, hair: 0x3a2a20, glasses: true},
  };
  const A = [['flash','FLASH','Inquiries','m'],['reva','REVA','The 8,000','f'],['nadia','NADIA','New owners','f'],['tess','TESS','Meetings','f'],['milo','MILO','No-shows','m'],['dex','DEX','Documents','m'],['jada','JADA','After signature','f'],['ray','RAY','Missed calls','m']].map(([id,name,role,g])=>({id,name,role,gender:g,active:true}));
  let sel = null, three = null;
  const esc = s => String(s ?? '');
  function loadThree() {
    if (window.THREE) return Promise.resolve();
    return new Promise((ok, no) => { const s = document.createElement('script'); s.src = THREE_SRC; s.onload = ok; s.onerror = () => no(new Error('3D engine failed to load')); document.head.appendChild(s) });
  }

  async function world() {
    const cv = document.getElementById('t-cv'), stage = document.getElementById('t-stage');
    try { await loadThree() } catch (e) { cv.replaceWith(Object.assign(document.createElement('div'), {className: 'none', style: 'padding:40px', textContent: e.message})); return }
    const T = window.THREE; if (T.ColorManagement) T.ColorManagement.legacyMode = false;  // hex colours are sRGB
    const R = new T.WebGLRenderer({canvas: cv, antialias: true, alpha: false});
    R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
    R.outputEncoding = T.sRGBEncoding; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
    const scene = new T.Scene(); scene.background = new T.Color(0xf5f1ec); scene.fog = new T.Fog(0xf5f1ec, 16, 34);
    const cam = new T.PerspectiveCamera(38, 1, .1, 100);
    const M = (c, o = {}) => new T.MeshStandardMaterial({color: c, flatShading: true, roughness: .62, metalness: .02, ...o});
    const box = (w, h, d, m, x = 0, y = 0, z = 0, p = scene) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; p.add(b); return b };
    const cyl = (rt, rb, h, seg, m, x = 0, y = 0, z = 0, p = scene) => { const b = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; p.add(b); return b };

    // lights: warm key, red rim, soft fill
    scene.add(new T.HemisphereLight(0xffffff, 0xe3d6d0, 1.05));
    const key = new T.DirectionalLight(0xfff3ec, 1.25); key.position.set(5, 11, 8); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, {left: -12, right: 12, top: 10, bottom: -6}); key.shadow.bias = -.0004; scene.add(key);
    const rim = new T.PointLight(0xe9b9d2, 1.2, 22); rim.position.set(-6, 4.5, -5); scene.add(rim);
    const amb = new T.PointLight(0xd4cdf0, .9, 18); amb.position.set(7, 3.5, -3); scene.add(amb);

    // room
    const floor = box(30, .2, 22, M(0xebe3db), 0, -.1, 0); floor.castShadow = false;
    const grid = new T.GridHelper(30, 30, 0xe0d6ce, 0xe6ddd5); grid.position.y = .01; scene.add(grid);
    box(30, 9, .3, M(0xf2ece6), 0, 4.4, -8.5).castShadow = false;            // back wall
    box(.3, 9, 22, M(0xeee7e0), -15, 4.4, 0).castShadow = false;             // side wall
    for (let i = 0; i < 5; i++) {                                              // window strip with Austin dusk
      box(3.6, 3.2, .05, M(0xdfe8f0, {emissive: 0xffffff, emissiveIntensity: .16 - i * .015}), -9.6 + i * 4.8, 4.8, -8.33);
      box(.12, 3.4, .1, M(0xd9d0d5), -7.75 + i * 4.8, 4.8, -8.3);
    }
    // the N on the wall
    const sig = M(0x8b4d7b, {emissive: 0x8b4d7b, emissiveIntensity: .25});
    box(.22, 1.4, .1, sig, 9.2, 5.1, -8.28); const k1 = box(.2, .9, .1, sig, 9.62, 5.42, -8.28); k1.rotation.z = -.75; const k2 = box(.2, .9, .1, sig, 9.62, 4.78, -8.28); k2.rotation.z = .75;
    box(3.2, .03, .03, M(0xc99bbb, {emissive: 0xc99bbb, emissiveIntensity: .8}), 9.65, 4.1, -8.28);
    // rug
    box(14, .02, 7.5, M(0xe8d9e1), 0, .01, .6).castShadow = false;
    // ceiling lamps
    for (const x of [-6, 0, 6]) { cyl(.02, .02, 2.6, 4, M(0xcfc5cc), x, 7.7, -1.5); const sh = cyl(.35, .7, .45, 8, M(0xf4efea), x, 6.3, -1.5);
      cyl(.5, .5, .02, 8, M(0xfff6ee, {emissive: 0xe9cfd9, emissiveIntensity: 1.4}), x, 6.07, -1.5); sh.castShadow = false }
    // plants (low-poly pots)
    const plant = (x, z, s = 1) => { cyl(.32 * s, .25 * s, .55 * s, 7, M(0xffffff), x, .27 * s, z);
      for (let i = 0; i < 4; i++) { const l = new T.Mesh(new T.IcosahedronGeometry(.42 * s - i * .05, 0), M([0x6f8a62, 0x86a07a, 0x5d7752][i % 3])); l.position.set(x + Math.sin(i * 2) * .15, (.8 + i * .32) * s, z + Math.cos(i * 2) * .15); l.castShadow = true; scene.add(l) } };
    plant(-13, -6.5, 1.3); plant(13, -6.5, 1.1); plant(-13, 4, 1); plant(12.6, 3.5, 1.2);
    // sofa + coffee bar for life
    box(3.4, .55, 1.1, M(0xdcc9d4), -11, .45, -1.8); box(3.4, .8, .3, M(0xdcc9d4), -11, .95, -2.25); box(1.2, .25, .5, M(0x8b4d7b), -11.6, .85, -1.75);
    box(2.6, 1.1, .8, M(0xe6dbe1), 11.2, .55, -6.6); cyl(.2, .2, .45, 8, M(0xc8bec4, {metalness: .5, roughness: .3}), 10.6, 1.33, -6.6);

    // desks: 2 rows of 4
    const ids = A.map(a => a.id), spots = ids.map((_, i) => ({x: -6.6 + (i % 4) * 4.4, z: i < 4 ? -3.2 : 1.6}));
    const wood = M(0xfbf8f5), leg = M(0xcdc2c9), scr = M(0x2a2229, {emissive: 0xc99bbb, emissiveIntensity: .8});
    spots.forEach(({x, z}, i) => {
      box(2.6, .1, 1.2, wood, x, 1.05, z - .55); for (const dx of [-1.2, 1.2]) box(.08, 1, 1.1, leg, x + dx, .52, z - .55);
      box(1.3, .78, .06, M(0x2b262c), x - .15, 1.62, z - .95); const s = box(1.2, .68, .02, scr, x - .15, 1.62, z - .91); s.castShadow = false;
      box(.1, .3, .1, leg, x - .15, 1.2, z - .97); box(.7, .03, .25, M(0xe2d9de), x - .15, 1.12, z - .45);
      if (!['milo', 'jada', 'nadia', 'dex'].includes(ids[i])) cyl(.06, .05, .14, 7, M(0xffffff), x + .85, 1.17, z - .5);  // mug on desk
      if (!['milo', 'dex'].includes(ids[i])) return;
      const ch = new T.Group(); ch.position.set(x + .9, 0, z - .1); scene.add(ch);  // chair pushed aside (nobody sitting)
      box(.6, .1, .6, M(0xe6dbe1), 0, .62, 0, ch); box(.6, .7, .08, M(0xe6dbe1), 0, 1, -.28, ch); cyl(.04, .04, .55, 6, leg, 0, .32, 0, ch); ch.rotation.y = .5;
    });

    // personal desk stuff, so no two desks look alike
    const FX = [], paper = M(0xf3efeb), ink = M(0x111010);
    function decor(id, x, z) {
      const top = 1.1, mesh = (geo, m, px, py, pz) => { const o = new T.Mesh(geo, m); o.position.set(px, py, pz); o.castShadow = true; scene.add(o); return o };
      const plant = (px, pz, h) => { cyl(.1, .08, .18, 7, M(0xffffff), px, top + .09, pz); mesh(new T.IcosahedronGeometry(h, 0), M(0x7c9870, {flatShading: true}), px, top + .18 + h * .8, pz) };
      const deskPhone = (px, pz) => { box(.26, .06, .2, ink, px, top + .03, pz); const hs = box(.24, .05, .07, M(0x3a3339), px, top + .09, pz - .05); hs.rotation.z = .05;
        const led = box(.03, .015, .03, M(0x330000, {emissive: 0x8b4d7b, emissiveIntensity: 0}), px + .09, top + .065, pz + .06); return led };
      if (id === 'flash') {                                             // two screens + headset: lives on the keyboard
        box(1.0, .62, .06, M(0x2b262c), x + .95, 1.6, z - .85).rotation.y = -.4; const s2 = box(.92, .54, .02, scr, x + .935, 1.6, z - .815); s2.rotation.y = -.4; s2.castShadow = false;
        mesh(new T.TorusGeometry(.1, .022, 6, 14, Math.PI), ink, x + .8, top + .02, z - .35).rotation.x = -Math.PI / 2;
      } else if (id === 'reva') {                                       // notebook, pen, sticky notes on the screen
        box(.3, .02, .4, paper, x + .5, top + .01, z - .3).rotation.y = .3; cyl(.012, .012, .26, 5, M(0x8b4d7b), x + .58, top + .03, z - .3).rotation.z = Math.PI / 2;
        [[0xe9cfd9, -.62, 1.88], [0xc99bbb, -.62, 1.76], [0xe9cfd9, .32, 1.92]].forEach(([c, dx, y]) => box(.1, .1, .01, M(c), x - .15 + dx, y, z - .9));
      } else if (id === 'nadia') {                                      // stack of books + plant
        [[0x6e3a61, .05], [0xe9cfd9, -.1], [0x9d93a0, .15]].forEach(([c, r], k) => box(.36, .07, .26, M(c), x + .55, top + .035 + k * .07, z - .55).rotation.y = r);
        plant(x + 1.0, z - .95, .17);
      } else if (id === 'tess') {                                       // desk calendar + phone
        const cal = new T.Group(); cal.position.set(x + .55, top, z - .35); scene.add(cal);
        for (const sgn of [-1, 1]) { const pnl = box(.26, .2, .01, paper, 0, .09, sgn * .04, cal); pnl.rotation.x = sgn * .35 } box(.27, .05, .02, M(0x8b4d7b), 0, .2, 0, cal);
        deskPhone(x + .95, z - .7);
      } else if (id === 'milo') {                                       // alarm clock + thermos
        const clock = cyl(.1, .1, .07, 10, M(0x8b4d7b), x + .6, top + .11, z - .6); clock.rotation.x = Math.PI / 2; cyl(.08, .08, .075, 10, paper, x + .6, top + .11, z - .6).rotation.x = Math.PI / 2;
        cyl(.06, .06, .3, 8, M(0x9d93a0), x + .95, top + .15, z - .8);
      } else if (id === 'dex') {                                        // paper stacks, tray, archive box under the desk
        [[.5, .2], [.75, .12], [1.0, .26]].forEach(([dx, h]) => box(.26, h, .34, paper, x + dx, top + h / 2, z - .45).rotation.y = (dx - .7) * .3);
        box(.36, .05, .28, M(0xc99bbb), x + .7, top + .025, z - .9); box(.55, .38, .42, M(0xa8b59a), x + .6, .19, z - .6);
      } else if (id === 'jada') {                                       // flowers, a gift, a framed photo
        cyl(.06, .08, .22, 7, M(0xffffff), x + .95, top + .11, z - .75);
        [[0x8b4d7b, 0, .0], [0xe9cfd9, .06, .05], [0xc99bbb, -.06, -.03]].forEach(([c, dx, dz]) => mesh(new T.IcosahedronGeometry(.055, 0), M(c, {flatShading: true}), x + .95 + dx, top + .3, z - .75 + dz));
        box(.22, .18, .22, M(0xc99bbb), x + .55, top + .09, z - .35); box(.23, .03, .05, M(0xe9cfd9), x + .55, top + .19, z - .35); box(.05, .03, .23, M(0xe9cfd9), x + .55, top + .19, z - .35);
        const fr = box(.2, .16, .02, M(0x3a3339), x + .45, top + .1, z - .85); fr.rotation.x = -.2; box(.16, .12, .01, M(0xe9cfd9), x + .45, top + .1, z - .84).rotation.x = -.2;
      } else if (id === 'ray') {                                        // ringing desk phone + headset
        const led = deskPhone(x + .6, z - .4); FX.push(t => { led.material.emissiveIntensity = Math.sin(t * 7) > .2 ? 2.2 : 0 });
        mesh(new T.TorusGeometry(.1, .022, 6, 14, Math.PI), ink, x + 1.0, top + .02, z - .8).rotation.x = -Math.PI / 2;
      }
    }
    spots.forEach(({x, z}, i) => decor(ids[i], x, z));

    // people
    const P = [];
    // office chair (5-star base); the seat tilts back for people leaning back
    const chair = (cx, cz, ry, tilt = 0) => { const c = new T.Group(); c.position.set(cx, 0, cz); c.rotation.y = ry; scene.add(c);
      cyl(.04, .04, .42, 6, leg, 0, .23, 0, c); for (let k = 0; k < 5; k++) { const sp = box(.34, .04, .06, leg, Math.cos(k * 1.257) * .15, .04, Math.sin(k * 1.257) * .15, c); sp.rotation.y = -k * 1.257 }
      const st = new T.Group(); st.position.y = .47; st.rotation.x = tilt; c.add(st);
      box(.6, .08, .6, M(0xe6dbe1), 0, 0, .08, st); box(.6, .72, .08, M(0xe6dbe1), 0, .42, -.24, st);
      const ph = Math.random() * 6; FX.push(t => { c.rotation.y = ry + Math.sin(t * .35 + ph) * .05 }); return c };
    const LEG = (g, hr, kr, hl = hr, kl = kr, spread = 0) => { const L = g.userData.legs; L.r.h.rotation.set(hr, 0, -spread); L.r.k.rotation.x = kr; L.l.h.rotation.set(hl, 0, spread); L.l.k.rotation.x = kl };
    // sit someone on a chair; tilt < 0 = leaning back. Hips stay on the seat, thighs level.
    const seat = (g, cx, cz, ry, tilt = 0) => { const c = chair(cx, cz, ry, tilt); c.add(g); g.rotation.order = 'YXZ';
      g.position.set(0, .55 - .93 * Math.cos(tilt), -.93 * Math.sin(tilt) + .02); g.rotation.x = tilt; const hip = -Math.PI / 2 - tilt; LEG(g, hip, Math.PI / 2); return hip };
    function place(id, g, x, z) {
      if (id === 'flash') seat(g, x - .15, z + .12, Math.PI - .2);                                    // at the keyboard
      else if (id === 'reva') { const h = seat(g, x - 1.0, z + .55, -1.2, -.12); LEG(g, h, Math.PI / 2, h + .18, Math.PI / 2 - .4, .06) }   // swivelled out, writing
      else if (id === 'nadia') { seat(g, x - 1.45, z + .2, Math.PI - .9, -.35); LEG(g, -1.92, 0, -1.86, .08, .03) }  // feet up on the desk, reading
      else if (id === 'tess') seat(g, x - .5, z + .6, Math.PI + .6, -.08);                             // turned to the screen, tablet
      else if (id === 'milo') { scene.add(g); g.rotation.order = 'YXZ'; g.position.set(x + 1.0, 1.2 - .93, z - .3); g.rotation.y = 1.35;  // sitting on the desk corner
        LEG(g, -Math.PI / 2 + .2, Math.PI / 2 - .15, -Math.PI / 2 + .05, Math.PI / 2 + .25, .05) }
      else if (id === 'dex') { scene.add(g); g.position.set(x + 1.65, 0, z + .4); g.rotation.y = -2.35 }  // bringing files to his desk
      else if (id === 'jada') seat(g, x + 1.0, z + .6, Math.PI / 2 - .15, -.05);                       // turned to wave at RAY
      else if (id === 'ray') { const h = seat(g, x - .35, z + .55, Math.PI - 1.0, -.22); LEG(g, h, Math.PI / 2, h + .25, Math.PI / 2 - .55, .1) }  // leaning back on the phone
      else { scene.add(g); g.position.set(x - .9, 0, z + .35) }
    }
    A.forEach((a, i) => { const g = person(T, M, box, cyl, LOOK[a.id] || LOOK.flash, a.gender, ACT[a.id] || 'idle');
      place(a.id, g, spots[i].x, spots[i].z); Object.assign(g.userData, {id: a.id, base: g.rotation.y, y0: g.position.y, ph: i * 1.3, keep: true}); P.push(g);
      scene.updateMatrixWorld(true); const w = new T.Vector3(); g.userData.legs.r.h.getWorldPosition(w);
      const halo = new T.Mesh(new T.RingGeometry(.45, .55, 28), new T.MeshBasicMaterial({color: 0x8b4d7b, transparent: true, opacity: 0})); halo.rotation.x = -Math.PI / 2; halo.position.set(w.x, .03, w.z); scene.add(halo); g.userData.halo = halo });

    // name tags
    const tags = document.getElementById('t-tags');
    tags.innerHTML = A.map(a => `<div class="tag${a.active ? ' on' : ''}" data-t="${a.id}"><b>${esc(a.name)}</b><i>${esc(a.role)}</i></div>`).join('');
    tags.querySelectorAll('.tag').forEach(t => t.onclick = () => focus(t.dataset.t));

    // camera rig
    const HOME = {p: new T.Vector3(0, 5.2, 12.5), t: new T.Vector3(0, 1.5, -1)};
    const cur = {p: HOME.p.clone(), t: HOME.t.clone()}, goal = {p: HOME.p.clone(), t: HOME.t.clone()};
    let yaw = 0, drag = null, hover = null;
    const ray = new T.Raycaster(), mouse = new T.Vector2();
    const pick = e => { const r = cv.getBoundingClientRect(); mouse.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(mouse, cam);
      const h = ray.intersectObjects(P, true)[0]; if (!h) return null; let o = h.object; while (o && !o.userData.id) o = o.parent; return o };
    cv.addEventListener('pointerdown', e => { drag = {x: e.clientX, yaw, moved: false} });
    const up = e => { if (!drag || !cv.isConnected) return; const moved = drag.moved; drag = null; if (moved) return;
      const o = pick(e); if (o) focus(o.userData.id); else if (sel) focus(null) }; addEventListener('pointerup', up);
    cv.addEventListener('pointermove', e => { if (drag) { const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true; if (!sel) yaw = Math.max(-.6, Math.min(.6, drag.yaw - dx * .004)); return }
      const o = pick(e); hover = o ? o.userData.id : null; cv.style.cursor = o ? 'pointer' : 'grab' });

    three = {
      go(id) {
        const g = P.find(x => x.userData.id === id);
        if (!g) { goal.p.copy(HOME.p); goal.t.copy(HOME.t); return }
        const w = new T.Vector3(); g.getWorldPosition(w); const side = innerWidth > 700 ? -1.15 : 0;  // keep the person left of the side panel
        goal.t.set(w.x - side * 1.1, 1.25, w.z); goal.p.set(w.x - side * 1.1 + .3, 3.1, w.z + 3.9);  // high enough to clear the front-row monitors
      },
    };

    const size = () => { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; R.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < 700 ? 50 : 38; cam.updateProjectionMatrix() };
    size(); const ro = new ResizeObserver(size); ro.observe(cv);
    const clk = new T.Clock(), v3 = new T.Vector3();
    (function tick() {
      if (!cv.isConnected) { ro.disconnect(); removeEventListener('pointerup', up); R.dispose(); three = null; return }   // page changed: stop the loop
      requestAnimationFrame(tick);
      const dt = Math.min(.1, clk.getDelta()), t = clk.elapsedTime, k = 1 - Math.pow(.0016, dt);
      // home view drifts slowly; yaw from dragging
      if (!sel) { const r = HOME.p.z, a = yaw + Math.sin(t * .12) * .06; goal.p.set(Math.sin(a) * r, HOME.p.y, Math.cos(a) * r) }
      cur.p.lerp(goal.p, Math.min(1, k * 2.4)); cur.t.lerp(goal.t, Math.min(1, k * 2.4)); cam.position.copy(cur.p); cam.lookAt(cur.t);
      for (const g of P) { const u = g.userData, on = u.id === sel || u.id === hover;
        g.position.y = u.y0 + Math.sin(t * 1.6 + u.ph) * .006; g.rotation.y = u.base + Math.sin(t * .5 + u.ph) * (u.keep ? .03 : .08) + (u.id === sel && !u.keep ? -u.base : 0) * .9;
        u.head.rotation.y = Math.sin(t * .7 + u.ph) * (u.look ? .07 : .18); u.head.rotation.x = (u.look || 0) + Math.sin(t * .9 + u.ph) * .04; if (u.anim) u.anim(t + u.ph);
        u.halo.material.opacity += ((on ? .85 : 0) - u.halo.material.opacity) * .15; u.halo.scale.setScalar(1 + Math.sin(t * 3) * .04) }
      for (const f of FX) f(t);
      R.render(scene, cam);
      // tags follow heads
      const W = cv.clientWidth, H = cv.clientHeight;
      const placed = [];  // keep labels from sitting on top of each other
      tags.querySelectorAll('.tag').forEach(el => { const g = P.find(x => x.userData.id === el.dataset.t); if (!g) return; g.userData.head.getWorldPosition(v3); v3.y += .55; v3.project(cam);
        const px = (v3.x * .5 + .5) * W; let py = (-v3.y * .5 + .5) * H; const tw = el.offsetWidth || 120, th = (el.offsetHeight || 34) + 4;
        for (let k = 0; k < 4; k++) { const hit = placed.find(q => Math.abs(q.x - px) < (q.w + tw) / 2 && Math.abs(q.y - py) < th); if (!hit) break; py = hit.y + th }
        placed.push({x: px, y: py, w: tw});
        el.style.transform = `translate(${px}px,${py}px) translate(-50%,-100%)`; el.style.display = v3.z < 1 ? '' : 'none';
        el.classList.toggle('sel', el.dataset.t === hover) });
    })();
  }

  // a low-poly person, ~1.8 tall, standing like the reference: one hand in a pocket, coffee in the other
  // what each person is doing at their desk (small, looping, job-related)
  const ACT = {flash: 'type', reva: 'write', nadia: 'read', tess: 'tablet', milo: 'coffee', dex: 'files', jada: 'wave', ray: 'phone'};
  function act(T, M, box, cyl, g, r, l, kind, dark) {
    const U = g.userData, set = (arm, ax, az, ex, ez = 0) => { arm.a.rotation.set(ax, 0, az); arm.e.rotation.set(ex, 0, ez) };
    const hold = (arm, ax = -.35, inn = .3, ex = -1.3) => set(arm, ax, -arm.s * inn, ex);
    const board = (w, h, m, y, z, tilt) => { const b = new T.Group(); b.position.set(0, y, z); b.rotation.x = tilt; g.add(b); box(w, .025, h, m, 0, 0, 0, b); return b };
    if (kind === 'type') {                       // at the keyboard
      hold(r, -1.3, .14, -.3); hold(l, -1.3, .14, -.3); U.look = .18;
      U.anim = t => { r.e.rotation.x = -.3 + Math.max(0, Math.sin(t * 15)) * .09; l.e.rotation.x = -.3 + Math.max(0, Math.sin(t * 15 + 1.7)) * .09 };
    } else if (kind === 'write') {               // clipboard + pen
      hold(l, -.35, .32, -1.3); hold(r, -.3, .38, -1.2); U.look = .32;
      const b = board(.3, .4, M(0xfbf8f5), 1.36, .43, .55); box(.26, .01, .34, M(0xf3efeb), 0, .018, .01, b);
      cyl(.012, .012, .16, 5, M(0x8b4d7b), 0, -.02, .06, r.h).rotation.x = .9;
      U.anim = t => { r.a.rotation.z = -.38 + Math.sin(t * 6) * .05; r.e.rotation.x = -1.2 + Math.sin(t * 9) * .05 };
    } else if (kind === 'read') {                // open book
      hold(r, -.35, .3, -1.35); hold(l, -.35, .3, -1.35); U.look = .34;
      const b = new T.Group(); b.position.set(0, 1.4, .44); b.rotation.x = .75; g.add(b);
      for (const s of [-1, 1]) { const c = box(.19, .02, .27, M(0x6e3a61), s * .095, 0, 0, b); c.rotation.z = -s * .22; const pg = box(.17, .012, .25, M(0xf3efeb), s * .09, .02, 0, b); pg.rotation.z = -s * .22 }
      U.anim = t => { b.rotation.x = .75 + Math.sin(t * .8) * .04 };
    } else if (kind === 'tablet') {              // checking the calendar on a tablet
      hold(l, -.38, .3, -1.3); hold(r, -.3, .42, -1.15); U.look = .3;
      const b = board(.26, .36, M(0x111010), 1.37, .43, .6); box(.22, .01, .3, M(0x2a2229, {emissive: 0xc99bbb, emissiveIntensity: .7}), 0, .015, 0, b);
      U.anim = t => { r.e.rotation.x = -1.15 - Math.max(0, Math.sin(t * 3.2)) * .12 };
    } else if (kind === 'coffee') {              // sipping a coffee, other hand in the pocket
      hold(r, -.2, .1, -1.4); set(l, .2, l.s * .3, .35, -l.s * .5);
      const c = new T.Group(); c.position.set(0, -.02, .07); r.h.add(c);
      cyl(.075, .058, .2, 8, M(0xf3ece6), 0, .02, 0, c); cyl(.08, .08, .035, 8, dark, 0, .14, 0, c);
      U.anim = t => { const k = Math.pow(Math.max(0, Math.sin(t * .9)), 6); r.a.rotation.x = -.2 - k * .55; r.e.rotation.x = -1.4 - k * .75; U.look = -k * .15;
        c.rotation.x = -(r.a.rotation.x + r.e.rotation.x) };
    } else if (kind === 'files') {               // carrying a pile of folders
      hold(r, -.3, .36, -1.45); hold(l, -.3, .36, -1.45);
      [[0xc99bbb, .02], [0xf3efeb, -.04], [0xa8b59a, .05], [0xe9cfd9, -.02]].forEach(([c, rot], k) => { const f = box(.38, .045, .28, M(c), 0, 1.36 + k * .05, .36); f.rotation.y = rot; g.add(f) });
    } else if (kind === 'wave') {                // waving, a small gift in the other hand
      set(r, 0, r.s * 2.45, 0); hold(l, -.25, -.05, -1.0);
      box(.14, .14, .14, M(0xc99bbb), 0, -.04, .08, l.h); box(.15, .03, .04, M(0xe9cfd9), 0, .03, .08, l.h);
      U.anim = t => { r.e.rotation.z = Math.sin(t * 6) * .4 - .15; r.a.rotation.z = r.s * 2.45 + Math.sin(t * 6) * .05 };
    } else if (kind === 'phone') {               // on the phone, free hand talking
      set(r, -.25, r.s * .25, -.35, r.s * 2.75); hold(l, -.25, .1, -1.0);
      box(.05, .17, .09, dark, 0, -.02, .02, r.h);
      U.anim = t => { l.a.rotation.x = -.25 + Math.sin(t * 1.4) * .14; l.e.rotation.x = -1.0 + Math.sin(t * 2.1) * .12; U.look = .05 };
    }
  }

  function person(T, M, box, cyl, L, gender, act_) {
    const g = new T.Group(), f = gender === 'f', skin = M(SKIN), skinD = M(SKIN_D), shirt = M(L.shirt), under = M(L.under), pants = M(L.pants), shoe = M(L.shoe), hair = M(L.hair), dark = M(0x111010);
    const sw = f ? .9 : 1;  // slimmer frame
    // shoes + rolled cuffs
    const legJ = s => { const h = new T.Group(); h.position.set(s * .13 * sw, .93, 0); g.add(h); cyl(.1, .092, .46, 7, pants, 0, -.22, 0, h);
      const k = new T.Group(); k.position.y = -.44; h.add(k); cyl(.09, .095, .3, 7, pants, 0, -.14, 0, k); cyl(.105, .1, .14, 7, pants, 0, -.27, 0, k);
      box(.21, .03, .37, M(0xf3efeb), 0, -.36, .04, k); box(.2, .13, .36, shoe, 0, -.425, .04, k); return {h, k} };
    g.userData.legs = {r: legJ(1), l: legJ(-1)};
    box(.46 * sw, .18, .26, pants, 0, .98, 0, g);                                                // hips
    const torso = cyl(.25 * sw, .23 * sw, .6, 6, under, 0, 1.36, 0, g); torso.scale.z = .62;        // under-shirt
    for (const s of [-1, 1]) { const p = box(.2 * sw, .62, .3, shirt, s * .16 * sw, 1.37, -.005, g); p.rotation.z = s * .04 }  // open shirt panels
    box(.5 * sw, .1, .3, shirt, 0, 1.64, -.01, g);                                              // shoulders/collar
    for (const s of [-1, 1]) { const c = box(.12, .04, .12, shirt, s * .1, 1.71, .1, g); c.rotation.y = s * .5 }
    // arms: shoulder -> elbow -> hand, so people can hold and do things
    const arm = s => { const a = new T.Group(); a.position.set(s * .32 * sw, 1.6, 0); g.add(a); cyl(.085, .08, .3, 6, shirt, 0, -.13, 0, a);
      const e = new T.Group(); e.position.y = -.27; a.add(e); cyl(.062, .055, .34, 6, skin, 0, -.17, 0, e);
      const h = new T.Group(); h.position.y = -.39; e.add(h); box(.1, .12, .1, skinD, 0, 0, .01, h);
      a.rotation.set(.1, 0, s * .14); return {a, e, h, s} };
    const r = arm(1), l = arm(-1);
    act(T, M, box, cyl, g, r, l, act_, dark);
    // neck + head
    cyl(.07, .08, .1, 6, skinD, 0, 1.73, 0, g);
    const head = new T.Group(); head.position.set(0, 1.95, 0); head.scale.setScalar(1.22); g.add(head); g.userData.head = head;
    const hd = cyl(.15, .12, .3, 6, skin, 0, 0, 0, head); hd.scale.z = .95;
    box(.04, .06, .05, skinD, 0, -.01, .145, head);                                                    // nose
    for (const s of [-1, 1]) { box(.035, .03, .02, dark, s * .055, .035, .14, head); box(.05, .07, .04, skinD, s * .15, 0, 0, head);  // eyes, ears
      box(.06, .015, .02, M(L.hair), s * .058, .075, .14, head) }                                       // brows
    if (L.glasses) { for (const s of [-1, 1]) { const fr = box(.085, .06, .012, dark, s * .058, .035, .155, head); fr.material = dark } box(.04, .012, .012, dark, 0, .04, .157, head) }
    if (L.beard) { box(.27, .12, .05, hair, 0, -.1, .1, head); for (const s of [-1, 1]) box(.05, .16, .2, hair, s * .13, -.04, .02, head) }
    if (f) {
      box(.31, .1, .3, hair, 0, .15, -.01, head); box(.31, .2, .08, hair, 0, .02, -.13, head);
      for (const s of [-1, 1]) box(.05, .17, .25, hair, s * .155, .04, -.02, head);
      if (L.style === 'long') box(.3, .45, .09, hair, 0, -.18, -.12, head);
      if (L.style === 'bun') { const b = new T.Mesh(new T.IcosahedronGeometry(.085, 0), hair); b.position.set(0, .2, -.12); b.castShadow = true; head.add(b) }
      if (L.style === 'bob') for (const s of [-1, 1]) box(.06, .2, .26, hair, s * .155, -.09, -.02, head);
    } else if (L.cap) { box(.32, .12, .31, M(L.cap), 0, .16, 0, head); box(.26, .025, .16, M(L.cap), 0, .11, .2, head) }
    else { box(.31, .09, .3, hair, 0, .155, -.005, head); box(.31, .14, .06, hair, 0, .07, -.13, head) }
    return g;
  }


  function focus(id) {
    sel = (id && id !== sel) ? id : null;
    if (three) three.go(sel);
    document.querySelectorAll('.agent').forEach(c => c.classList.toggle('sel', c.dataset.id === sel));
  }
  return {start: world, focus};
})();
