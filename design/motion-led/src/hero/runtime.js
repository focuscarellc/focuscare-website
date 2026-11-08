// Six-workflow hero runtime. One clock, absolute-time renderAt(seconds), persistent nodes.
// Reused from the pinned Motion library (unchanged): rr/rect/shadowRects/clamp/lerp
// (geometry.js) for the card surface, and buildCamera (motion.js), the closed-form
// damped-spring camera, so any seek is exact. Native useAnimations frames are sought
// explicitly by the optional native chunk (native.js); static WebPs remain the fallback.
import { rr, rect, shadowRects, clamp, lerp } from '../../../vendor/focus-care-motion/studies/component-library/src/geometry.js';
import { buildCamera } from '../../../vendor/focus-care-motion/studies/component-library/src/motion.js';
import { WF, BEAT, CONTACT, SETTLE, SWAP, LOOP, ROWS } from './data.mjs';

const N = WF.length;
// GSAP ease shapes in closed form (power3.inOut, power3.out, power2.in, back.out, elastic.out).
const p3io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const p3o = t => 1 - Math.pow(1 - t, 3);
const p2i = t => t * t;
const backOut = (t, o = 1.7) => (t -= 1, t * t * ((o + 1) * t + o) + 1);
const elasticOut = (t, p = .42) => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI / p)) + 1;
const seg = (t, a, d) => clamp((t - a) / d);
const mod = (a, b) => ((a % b) + b) % b;

function setup(root) {
  const q = s => root.querySelector(s), qa = s => [...root.querySelectorAll(s)];
  const flow = q('.hx-flow'), cam = q('.hx-cam'), clip = q('.hx-clip'), svg = q('.hx-chassis');
  const paths = Object.fromEntries(['sh-a', 'sh-c', 'body', 'hl', 'edge'].map(c => [c, svg.querySelector('.' + c)]));
  const head = q('.hx-rh'), rowsEl = qa('.hx-row'), note = q('.hx-note');
  const cars = [head, ...rowsEl, note].map(el => el.querySelector('.hx-car'));
  const stateChip = q('.hx-state'), wfName = q('.hx-wf'), wfTitle = q('.hx-title'), headImg = q('.hx-ri img'), uaSlot = q('.hx-ua');
  const rowLabel = rowsEl.map(r => r.querySelector('.hx-rl')), rowChip = rowsEl.map(r => r.querySelector('.hx-chip'));
  const noteB = note.querySelector('b'), noteS = note.querySelector('span');
  const lblN = q('.hx-n'), lblName = q('.hx-name'), lblLab = q('.hx-lab'), pauseBtn = q('.hx-pause'), prog = q('.hx-prog i'), pill = q('.hx-pill');
  const assets = root.dataset.assets || './assets/';
  const iconSrc = id => assets + 'service-icons/' + id + '.webp';
  const ovRows = qa('.hx-ov-row'), ovNote = q('.hx-ov-note');

  // Upgrade rail links to buttons (links remain the no-JS navigation).
  const tabs = qa('.hx-tab').map((a, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hx-tab'; b.dataset.i = i; b.innerHTML = a.innerHTML;
    b.setAttribute('aria-label', 'Show ' + WF[i].name + ' workflow');
    a.replaceWith(b); return b;
  });
  const tabNames = tabs.map(b => b.querySelector('.hx-tab-name'));

  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const S = { t: 0, raf: 0, t0: 0, userPaused: false, visible: true, reduced: reduceMQ.matches, ready: false, sel: 0, native: null, last: {} };
  let L = null, camera = null;

  // ---------- layout (read only on setup/resize; never per frame) ----------
  function measure() {
    const narrow = root.clientWidth < 520;
    const avail = clip.clientWidth - (narrow ? 24 : 48);
    const mob = narrow || avail < 380;
    tabNames.forEach(s => { s.style.maxWidth = 'none'; });
    const named = !mob && root.clientWidth >= 480;
    // Batch writes, then reads. Per-tab display toggles forced six complete layouts.
    tabNames.forEach(n => { n.style.display = 'none'; });
    const base = tabs.map(b => b.offsetWidth);
    tabNames.forEach(n => { n.style.display = ''; });
    const labW = tabs.map((b, i) => named ? tabNames[i].scrollWidth : 0);
    const gap = parseFloat(getComputedStyle(q('.hx-rail')).columnGap) || 6;
    L = { mob, named, base, labW, gap, avail, push: mob ? 1.04 : 1.12, cy: mob ? -2 : -5 };
    camera = buildCameraLoop();
    S.last = {};
  }

  // Camera cues authored per beat, laid out over three loops and sampled in the middle loop,
  // so the spring state at the loop seam equals the state one loop later (seamless wrap).
  function buildCameraLoop() {
    const cues = [[0, { rx: 0, ry: 0, rz: 0, s: .965, x: -14, y: 0 }]];
    for (let k = 0; k < N * 3; k++) {
      const b = k * BEAT, w = WF[k % N], dir = (k % 2 ? 1 : -1);
      cues.push([b + .02, { s: 1, x: 0, y: 0, rx: 0, ry: 0, rz: 0 }]);
      cues.push([b + CONTACT - .45, { s: L.push, y: L.cy, x: dir * (L.mob ? 2 : 6), rx: L.mob ? 1.2 : 3, ry: dir * (L.mob ? 1.5 : 4) }]);
      cues.push([b + CONTACT + .06, { rx: L.mob ? -.4 : -1.2, ry: -dir * (L.mob ? .5 : 1.4) }]);
      cues.push([b + SETTLE + .05, { s: (L.push + 1) / 2, y: L.cy * .35, x: 0, rx: 0, ry: 0 }]);
      cues.push([b + SETTLE + .85, { s: L.mob ? 1 : 1.02, y: 0 }]);
      cues.push([b + SWAP, { s: .965, x: L.mob ? -6 : -16, ry: L.mob ? 0 : 2 }]);
      void w;
    }
    const c = buildCamera(cues, { w: 5.6, zeta: .9 });
    return t => c(t + LOOP);
  }

  // ---------- pure timeline evaluation ----------
  function frameState(t) {
    t = mod(t, LOOP);
    const i = Math.floor(t / BEAT) % N, u = t - i * BEAT, nx = (i + 1) % N, pv = (i + N - 1) % N;
    const switched = u >= SWAP + .2; // content swaps at the midpoint of the swap
    const ci = switched ? nx : i;
    const ph = switched ? 'begin' : u < CONTACT ? 'begin' : u < SETTLE ? 'action' : 'settled';
    const phase = u < CONTACT - .45 ? 'begin' : u < SETTLE ? 'action' : u < SWAP ? 'settled' : 'swap';
    // carrier masks: retract [SWAP, SWAP+.2], reveal [-.2, +.35] around the boundary
    const car = k => {
      const d = k * .035;
      if (u >= SWAP) {
        if (!switched) { const p = p2i(seg(u, SWAP + d * .5, .2)); return { clip: p * 100, y: -6 * p }; }
        const p = seg(u, SWAP + .2 + d, .5); return { clip: (1 - p3o(p)) * 100, y: 10 * (1 - backOut(p)) };
      }
      const p = seg(u, -.2 + d, .5); return { clip: (1 - p3o(p)) * 100, y: 10 * (1 - backOut(p)) };
    };
    const rwOf = j => L.mob ? L.avail : Math.min(WF[j].rw, L.avail);
    let rw, rad = 22;
    if (u >= SWAP) { const p = p3io(seg(u, SWAP, .55)); rw = lerp(rwOf(i), rwOf(nx), p); rad = 22 + 8 * Math.sin(Math.PI * clamp((u - SWAP) / .55)); }
    else if (u < .15) { const p = p3io(seg(u + BEAT - SWAP, 0, .55)); rw = lerp(rwOf(pv), rwOf(i), p); rad = 22 + 8 * Math.sin(Math.PI * clamp((u + BEAT - SWAP) / .55)); }
    else rw = rwOf(i);
    const noteP = switched ? 0 : u >= SWAP ? 1 - p3io(seg(u, SWAP + .02, .18)) : p3io(seg(u, SETTLE, .55));
    const wf = WF[ci], st = wf.s[ph];
    const hot = !switched && st.hot != null ? st.hot : (!switched && ph === 'settled' ? WF[i].s.action.hot : -1);
    const hotP = switched ? 0 : clamp(seg(u, CONTACT - .3, .3)) * (1 - seg(u, SETTLE + .9, .5));
    const press = u >= CONTACT && !switched ? (u < CONTACT + .09 ? p3o(seg(u, CONTACT, .09)) : 1 - elasticOut(seg(u, CONTACT + .1, .62))) : 0;
    const chipPress = u >= CONTACT + .05 && !switched ? (u < CONTACT + .14 ? p3o(seg(u, CONTACT + .05, .09)) : 1 - elasticOut(seg(u, CONTACT + .15, .7), .38)) : 0;
    // rail: label opening and pill position interpolate across the swap
    const railP = u >= SWAP ? p3io(seg(u, SWAP, .5)) : 0;
    const iconF = switched ? 0 : seg(u, .15, .95);
    const glow = u >= SWAP ? p3io(seg(u, SWAP, .4)) : 0;
    return { t, i, u, ci, ph, phase, nx, car, rw, rad, noteP, wf, st, hot, hotP, press, chipPress, railP, iconF, glow, prog: u / BEAT };
  }

  const setText = (el, v) => { if (el.textContent !== v) el.textContent = v; };
  const setChip = (el, [text, tone]) => { setText(el, text); const c = 'hx-chip t-' + tone + (el === stateChip ? ' hx-state' : ''); if (el.className !== c) el.className = c; };
  const setD = (el, d) => { if (el.getAttribute('d') !== d) el.setAttribute('d', d); };

  function drawSurface(w, h, r) {
    const key = w.toFixed(2) + ',' + h + ',' + r.toFixed(2);
    if (S.last.surf === key) return; S.last.surf = key;
    const g = rect(0, 0, w, h, r), s = shadowRects(g, 2);
    svg.setAttribute('width', w.toFixed(2)); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w.toFixed(2)} ${h}`);
    setD(paths['sh-a'], rr(s.ambient.x, s.ambient.y, s.ambient.w, s.ambient.h, s.ambient.r));
    setD(paths['sh-c'], rr(s.contact.x, s.contact.y, s.contact.w, s.contact.h, s.contact.r));
    setD(paths.body, rr(0, 0, w, h, r)); setD(paths.edge, rr(0, 0, w, h, r));
    setD(paths.hl, rr(.75, .75, w - 1.5, h - 1.5, Math.max(0, r - .75)));
  }

  function renderRail(i, nx, p) {
    const open = tabs.map((_, k) => k === i ? 1 - p : k === nx ? p : 0);
    let x = 6, px = 6, pw = 0;
    tabs.forEach((b, k) => {
      const lw = L.labW[k] * open[k];
      tabNames[k].style.maxWidth = L.named ? lw.toFixed(1) + 'px' : '0px';
      const w = L.base[k] + lw;
      if (k === i) { px = lerp(px, x, 1); pw = w; }
      if (k === i) { S.pi = { x, w }; }
      if (k === nx) { S.pn = { x, w }; }
      x += w + L.gap;
    });
    const a = S.pi, b = S.pn;
    px = lerp(a.x, b.x, p); pw = lerp(a.w, b.w, p);
    pill.style.transform = `translateX(${(px - 6).toFixed(2)}px)`; pill.style.width = pw.toFixed(2) + 'px';
    const on = p < .5 ? i : nx;
    tabs.forEach((b, k) => { const v = k === on; if (b.classList.contains('on') !== v) { b.classList.toggle('on', v); b.setAttribute('aria-pressed', String(v)); } });
  }

  function renderAt(sec) {
    if (!L) measure();
    const f = frameState(sec); S.t = f.t; S.f = f;
    if (S.reduced) return renderOverview(), f.t;
    const { wf, st } = f;
    // persistent nodes: text and tone change in place
    setChip(stateChip, st.chip);
    st.rows.forEach((r, k) => { setText(rowLabel[k], r[0]); setChip(rowChip[k], [r[1], r[2]]); });
    const nt = (WF[f.ci].s.settled.note);
    setText(noteB, nt[0]); setText(noteS, nt[1]);
    // On a workflow change only: swap header content and re-measure this workflow's card at its own width.
    if (S.last.ci !== f.ci) { setText(wfName, wf.name); setText(wfTitle, wf.title); headImg.src = iconSrc(wf.id); if (S.native) S.native.show(wf.ua); measureCard(f.ci); S.last.ci = f.ci; }
    setText(lblN, (f.ci + 1) + '/' + N); setText(lblName, wf.name); setText(lblLab, st.lab);
    cars.forEach((c, k) => { const m = f.car(k); c.style.clipPath = m.clip > .01 ? `inset(-40% -20% ${m.clip.toFixed(2)}% -20%)` : ''; c.style.transform = m.y ? `translateY(${m.y.toFixed(2)}px)` : ''; });
    rowsEl.forEach((r, k) => {
      const h = k === f.hot ? f.hotP : 0; r.style.setProperty('--hot', h.toFixed(3));
      r.style.transform = k === f.hot && f.press ? `scale(${(1 - .035 * f.press).toFixed(4)},${(1 - .075 * f.press).toFixed(4)})` : '';
    });
    stateChip.style.transform = f.chipPress ? `scale(${(1 - .06 * f.chipPress).toFixed(4)})` : '';
    note.style.maxHeight = (f.noteP * L.noteH).toFixed(2) + 'px';
    flow.style.width = f.rw.toFixed(2) + 'px';
    const h = Math.round(L.baseH + f.noteP * L.noteH);
    drawSurface(f.rw, h, f.rad);
    // camera (closed-form spring from absolute time); labels, rail and pause stay outside it
    const c = camera(f.t);
    cam.style.transform = `translate3d(${c.x.toFixed(3)}px,${c.y.toFixed(3)}px,0) rotateX(${c.rx.toFixed(4)}deg) rotateY(${c.ry.toFixed(4)}deg) rotateZ(${c.rz.toFixed(4)}deg) scale(${c.s.toFixed(5)})`;
    const a = WF[f.i], b = WF[f.nx];
    root.style.setProperty('--gx', lerp(a.gx, b.gx, f.glow).toFixed(2) + '%'); root.style.setProperty('--gy', lerp(a.gy, b.gy, f.glow).toFixed(2) + '%');
    prog.style.transform = `scaleX(${f.prog.toFixed(4)})`;
    renderRail(f.i, f.nx, f.railP);
    if (S.native) S.native.seek(WF[f.ci].ua, f.iconF);
    return f.t;
  }

  function renderOverview() {
    cam.style.transform = ''; flow.style.width = '';
    ovRows.forEach((r, k) => r.classList.toggle('on', k === S.sel));
    const nt = WF[S.sel].s.settled.note; setText(ovNote.querySelector('b'), nt[0]); setText(ovNote.querySelector('span'), nt[1]);
    L && tabNames.forEach((s, k) => { s.style.maxWidth = L.named && k === S.sel ? L.labW[k] + 'px' : '0px'; });
    tabs.forEach((b, k) => { b.classList.toggle('on', k === S.sel); b.setAttribute('aria-pressed', String(k === S.sel)); });
    if (L) { const x = L.base.slice(0, S.sel).reduce((s, w, k) => s + w + L.gap, 6) ; pill.style.transform = `translateX(${(x - 6).toFixed(2)}px)`; pill.style.width = (L.base[S.sel] + (L.named ? L.labW[S.sel] : 0)) + 'px'; }
    setText(lblN, (S.sel + 1) + '/' + N); setText(lblName, WF[S.sel].name); setText(lblLab, WF[S.sel].s.settled.lab);
  }

  // Card height: content height with the note collapsed, plus the note's natural height.
  function measureCard(ci) {
    note.style.maxHeight = '0px'; flow.style.width = (L.mob ? L.avail : Math.min(WF[ci].rw, L.avail)) + 'px';
    L.baseH = flow.offsetHeight; L.noteH = note.scrollHeight;
    S.last.surf = null;
  }
  function relayout() { measure(); root.classList.add('hx-live'); renderAt(S.t); }

  // ---------- one clock ----------
  const canRun = () => S.ready && !S.userPaused && S.visible && !S.reduced;
  function tick(now) { S.raf = 0; if (!canRun()) return; renderAt((now - S.t0) / 1000); S.raf = requestAnimationFrame(tick); }
  function sync() {
    if (canRun()) { if (!S.raf) { S.t0 = performance.now() - S.t * 1000; S.raf = requestAnimationFrame(tick); } }
    else if (S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; }
    root.dataset.playing = S.raf ? 'true' : 'false';
  }
  function setPaused(v) {
    S.userPaused = v;
    if (v && !S.reduced) {
      // A user pause is a reading state. Resolve the displayed workflow to its
      // complete outcome instead of freezing a carrier halfway through a mask.
      const current = S.f ? S.f.ci : Math.floor(S.t / BEAT) % N;
      S.sel = current;
      renderAt(current * BEAT + SETTLE + 1);
    }
    pauseBtn.textContent = v ? 'Resume motion' : 'Pause motion'; sync();
  }
  pauseBtn.addEventListener('click', () => setPaused(!S.userPaused));
  tabs.forEach((b, k) => b.addEventListener('click', () => select(k)));
  function select(k) {
    S.sel = k;
    if (S.reduced) { renderOverview(); return; }
    // paused: show the settled outcome; playing: restart that workflow from its beginning
    const t = k * BEAT + (S.userPaused ? SETTLE + 1 : 0);
    if (S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; }
    renderAt(t); S.t = t; sync();
  }
  const onReduce = () => { S.reduced = reduceMQ.matches; root.classList.toggle('hx-reduced', S.reduced); if (S.reduced) S.sel = S.f ? S.f.ci : S.sel; relayout(); sync(); };
  reduceMQ.addEventListener ? reduceMQ.addEventListener('change', onReduce) : reduceMQ.addListener(onReduce);
  const onVis = () => { S.docHidden = document.hidden; S.visible = !S.docHidden && S.inView !== false; sync(); };
  document.addEventListener('visibilitychange', onVis);
  S.inView = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { for (const e of es) S.inView = e.isIntersecting && e.intersectionRatio > .15; onVis(); }, { threshold: [0, .15, .5] }).observe(root);
  let rq = 0, lastW = 0;
  const ro = new ResizeObserver(() => { const w = root.clientWidth; if (Math.abs(w - lastW) < 1) return; lastW = w; if (rq) cancelAnimationFrame(rq); rq = requestAnimationFrame(() => { rq = 0; relayout(); sync(); }); });

  // ---------- optional native useAnimations chunk ----------
  const connection = navigator.connection;
  const isSaveData = () => !!(connection && connection.saveData);
  function loadNative() {
    if (isSaveData() || S.reduced || window.FocusCareHeroNative) return Promise.resolve(window.FocusCareHeroNative || null);
    return new Promise(res => {
      const s = document.createElement('script'); let done = false;
      const fin = ok => { if (done) return; done = true; clearTimeout(tm); if (!ok) s.remove(); res(ok ? window.FocusCareHeroNative || null : null); };
      const tm = setTimeout(() => fin(false), 8000);
      s.src = assets + 'hero-native.js'; s.async = true; s.onload = () => fin(true); s.onerror = () => fin(false); document.head.append(s);
    });
  }
  const api = {
    duration: LOOP, animationReady: false,
    renderAt(sec) { if (S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; } const t = renderAt(sec); S.t = t; sync(); return t; },
    pause() { setPaused(true); }, resume() { setPaused(false); }, select,
    get state() { const f = S.f || {}; return { t: S.t, index: f.ci, phase: f.phase, playing: !!S.raf, userPaused: S.userPaused, visible: S.visible, reduced: S.reduced, native: !!S.native, saveData: isSaveData(), selected: S.sel }; }
  };
  api.ready = (async () => {
    // Let the complete static page paint and start its font request before geometry reads.
    // fonts.ready can resolve before the font is requested if first layout has not happened.
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]);
    root.classList.toggle('hx-reduced', S.reduced);
    pauseBtn.hidden = false;
    relayout(); ro.observe(root); lastW = root.clientWidth;
    S.ready = true; api.animationReady = true; root.dataset.ready = 'true'; sync();
    // Wait until the first paint and low-priority idle work; content never waits for icons.
    await new Promise(r => { if ('requestIdleCallback' in window) requestIdleCallback(r, {timeout:2500}); else setTimeout(r, 600); });
    const nat = S.visible && !S.reduced ? await loadNative() : null;
    if (nat && S.visible && !S.reduced && !isSaveData()) { try { S.native = nat.mount(uaSlot, root); S.native.show(WF[S.f ? S.f.ci : 0].ua); if (!S.raf) renderAt(S.t); } catch (e) { S.native = null; root.classList.remove('hx-native'); } }
    return api;
  })();
  return api;
}

function boot() {
  const root = document.querySelector('[data-hero]');
  if (!root || root.__hx) return;
  root.__hx = true;
  window.FocusCareHero = setup(root);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
