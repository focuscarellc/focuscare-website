// Deterministic forming engine for the Focus Care component library.
// - One paused GSAP timeline per component, sought absolutely (renderAt).
// - Surfaces form from a seed: DrawSVG traces the outline while MorphSVG grows
//   the body, highlight, edge and shadows from the seed pill (no crossfades).
// - HTML label/icon carriers reveal through masks with delayed follow-through.
// - Native useAnimations Lottie frames are sought explicitly, independently of carriers.
// - The camera is a closed-form damped spring evaluated from absolute time.
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import lottie from 'lottie-web/build/player/lottie_svg';
import { rr, rect, shadowRects, seedRect, clamp } from './geometry.js';

gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);
export { gsap };

// Named timing anchors (seconds). Interactions sit between approach and hold.
export const T = { form: 0, reveal: 0.95, approach: 1.75, click: 2.35, release: 2.47, result: 2.85, hold: 4.05, collapse: 5.6, end: 6.4 };

let ICON_DATA = null;
export const setIconData = d => { ICON_DATA = d; };

// x'' + 2ζωx' + ω²(x − target) = 0, evaluated in closed form so seeking is exact.
export function spring(x, v, target, dt, w = 5.6, zeta = 0.9) {
  const y = x - target;
  if (dt <= 0) return { x, v };
  if (zeta >= 1) { const b = v + w * y, e = Math.exp(-w * dt); return { x: target + (y + b * dt) * e, v: (v - w * b * dt) * e }; }
  const wd = w * Math.sqrt(1 - zeta * zeta), b = (v + zeta * w * y) / wd, e = Math.exp(-zeta * w * dt), c = Math.cos(wd * dt), q = Math.sin(wd * dt);
  return { x: target + e * (y * c + b * q), v: e * ((-zeta * w * y + b * wd) * c + (-zeta * w * b - y * wd) * q) };
}

export function buildCamera(cues, opts = {}) {
  const keys = ['rx', 'ry', 'rz', 's', 'x', 'y'];
  const sorted = cues.slice().sort((a, b) => a[0] - b[0]);
  const initial = { rx: 0, ry: 0, rz: 0, s: 1, x: 0, y: 0, ...sorted[0][1] };
  const channels = {};
  for (const k of keys) {
    let x = initial[k], v = 0, target = x, last = 0; const ev = [{ time: 0, x, v, target }];
    for (const [time, props] of sorted) {
      if (!(k in props) || time === 0) continue;
      ({ x, v } = spring(x, v, target, time - last, opts.w, opts.zeta)); target = props[k]; last = time; ev.push({ time, x, v, target });
    }
    channels[k] = ev;
  }
  return t => {
    const out = {};
    for (const k of keys) { let e = channels[k][0]; for (const q of channels[k]) { if (q.time <= t) e = q; else break; } out[k] = spring(e.x, e.v, e.target, t - e.time, opts.w, opts.zeta).x; }
    return out;
  };
}

export function defaultCues(entry) {
  const f = entry.focus || { x: entry.w / 2, y: entry.h / 2 };
  const dx = (entry.w / 2 - f.x), dy = (entry.h / 2 - f.y);
  const push = entry.push ?? 1.2;
  const o = entry.orbit ?? 1;
  return [
    [0, { rx: 16 * o, ry: 20 * o, rz: -1.5 * o, s: 0.84, x: 0, y: 14 }],
    [0.12, { rx: 12 * o, ry: -16 * o, rz: 0, s: 0.95, x: 0, y: 6 }],
    [T.reveal + 0.15, { rx: 4 * o, ry: -6 * o, s: 1, y: 0 }],
    [T.approach - 0.1, { rx: 3 * o, ry: -5 * o, s: push, x: dx * push * 0.45, y: dy * push * 0.6 }],
    [T.click + 0.06, { rx: -1.5 * o, ry: 4 * o }],
    [T.result + 0.25, { rx: 0, ry: 0, s: (push + 1) / 2, x: dx * 0.3, y: dy * 0.3 }],
    [T.hold, { rx: 0, ry: 0, rz: 0, s: 1, x: 0, y: 0 }],
    [T.collapse + 0.15, { rx: 16 * o, ry: 20 * o, rz: -1.5 * o, s: 0.84, y: 14 }]
  ];
}

const parseG = s => { const [x, y, w, h, r] = s.split(',').map(Number); return rect(x, y, w, h, r); };
function partsFor(g, elev) {
  const s = shadowRects(g, elev);
  const d = rr(g.x, g.y, g.w, g.h, g.r);
  return { body: d, edge: d, trace: d, hl: rr(g.x + .75, g.y + .75, Math.max(.01, g.w - 1.5), Math.max(.01, g.h - 1.5), Math.max(0, g.r - .75)), 'sh-a': rr(s.ambient.x, s.ambient.y, s.ambient.w, s.ambient.h, s.ambient.r), 'sh-c': rr(s.contact.x, s.contact.y, s.contact.w, s.contact.h, s.contact.r) };
}

export function createMotion(root, entry, options = {}) {
  const frame = root.querySelector('.fc-frame');
  const tl = gsap.timeline({ paused: true, defaults: { immediateRender: false, lazy: false } });
  const after = [];
  const icons = [];
  const players = [];
  const state = new Map();
  const hidden = new Set();
  const D = entry.duration || T.end;
  const q = s => root.querySelector(s), qa = s => [...root.querySelectorAll(s)];
  // The first tween of each element/property renders its from-state immediately so that
  // any seek before its start shows that state (GSAP otherwise reverts to the DOM value).
  const seen = new WeakMap(), META = new Set(['duration', 'ease', 'delay', 'svgOrigin', 'transformOrigin', 'immediateRender', 'lazy']);
  const chain = { fromTo: (...a) => F(...a) };
  function F(targets, from, to, at) {
    const keys = Object.keys(to).filter(k => !META.has(k)).map(k => (k.startsWith('scale') ? 'scale' : k === 'autoAlpha' ? 'opacity' : k));
    let first = false;
    for (const el of gsap.utils.toArray(targets)) {
      let s = seen.get(el); if (!s) { s = new Set(); seen.set(el, s); }
      for (const k of keys) if (!s.has(k)) { s.add(k); first = true; }
    }
    tl.fromTo(targets, from, { ...to, immediateRender: first }, at);
    return chain;
  }
  const center = entry.seed || [entry.w / 2, entry.h / 2];
  tl.addLabel('form', T.form).addLabel('reveal', T.reveal).addLabel('approach', T.approach).addLabel('click', T.click)
    .addLabel('release', T.release).addLabel('result', T.result).addLabel('hold', T.hold).addLabel('collapse', T.collapse).addLabel('end', D);

  // ---------- native icons ----------
  const ready = [];
  qa('[data-ua]').forEach(el => {
    const data = ICON_DATA && ICON_DATA[el.dataset.ua];
    if (!data) throw new Error(`Missing native useAnimations data: ${el.dataset.ua}`);
    const p = lottie.loadAnimation({ container: el, renderer: 'svg', loop: false, autoplay: false, animationData: JSON.parse(JSON.stringify(data)), rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false } });
    p.setSubframe(false);
    players.push({ el, p, frames: data.op - data.ip, segs: [], rest: 0 });
    ready.push(new Promise(r => (p.isLoaded ? r() : p.addEventListener('DOMLoaded', r))));
  });
  const playerFor = sel => players.filter(o => o.el.matches(sel) || o.el.dataset.icon === sel);

  // ---------- helpers exposed to component motion ----------
  const ctx = {
    tl, T, D, q, qa, entry, root,
    g: id => state.get(id).g,
    ease: e => gsap.parseEase(e),
    surf: id => q(`[data-surf="${id}"]`),
    // Reshape a persistent surface (all parts morph together; no substitution).
    reshape(id, g2, at, dur = 0.5, ease = 'power3.inOut') {
      const st = state.get(id); if (!st) throw new Error('No surface ' + id);
      if (at < st.formEnd - 1e-6) console.error(`reshape(${id}) at ${at}s overlaps its forming tween (ends ${st.formEnd.toFixed(2)}s)`);
      const a = partsFor(st.g, st.elev), b = partsFor(g2, st.elev);
      for (const [cls, el] of Object.entries(st.parts)) if (el && cls !== 'trace') F(el, { morphSVG: a[cls] }, { morphSVG: b[cls], duration: dur, ease }, at);
      st.g = g2; return ctx;
    },
    morph(el, fromD, toD, at, dur = 0.5, ease = 'power3.inOut') { el = typeof el === 'string' ? q(el) : el; F(el, { morphSVG: fromD }, { morphSVG: toD, duration: dur, ease }, at); return ctx; },
    draw(el, from, to, at, dur = 0.6, ease = 'power2.inOut') { el = typeof el === 'string' ? q(el) : el; F(el, { drawSVG: from }, { drawSVG: to, duration: dur, ease }, at); return ctx; },
    fromTo(sel, from, to, at) { const t = typeof sel === 'string' ? qa(sel) : sel; F(t, from, to, at); return ctx; },
    set(sel, props, at) { const t = typeof sel === 'string' ? qa(sel) : sel; tl.set(t, props, at); return ctx; },
    // Native icon segment: frame interpolates from→to over [at, at+dur].
    icon(sel, from, to, at, dur) { for (const o of playerFor(sel)) o.segs.push({ at, dur: Math.max(dur, 1e-3), from, to }); return ctx; },
    rest(sel, frame) { for (const o of playerFor(sel)) o.rest = frame; return ctx; },
    // Retract a carrier mid-interaction (mask up, slight lift). It stays hidden.
    hide(id, at, dur = .26) {
      const el = q(`[data-layer="${id}"]`); hidden.add(el);
      F(el, { clipPath: 'inset(-40% -20% -40% -20%)' }, { clipPath: 'inset(-40% -20% 140% -20%)', duration: dur, ease: 'power2.in' }, at);
      F(el.firstElementChild, { y: 0 }, { y: -6, duration: dur, ease: 'power2.in' }, at);
      return ctx;
    },
    after(fn) { after.push(fn); return ctx; },
    typing(el, text, at, cps = 14, caret = true) {
      el = typeof el === 'string' ? q(el) : el; const n = text.length;
      after.push(t => { const k = clamp((t - at) * cps / n) * n; el.textContent = text.slice(0, Math.floor(k + 1e-6)); el.classList.toggle('caret', caret && t >= at - .4 && t < at + n / cps + .6 && t < T.collapse); });
      return ctx;
    },
    count(el, from, to, at, dur, fmt = v => String(Math.round(v)), ease = 'power3.out') {
      el = typeof el === 'string' ? q(el) : el; const E = gsap.parseEase(ease);
      after.push(t => { const p = clamp((t - at) / dur); el.textContent = fmt(from + (to - from) * E(p)); });
      return ctx;
    },
    swap(el, values, times) { el = typeof el === 'string' ? q(el) : el; after.push(t => { let v = values[0]; times.forEach((tt, i) => { if (t >= tt) v = values[i + 1]; }); if (el.textContent !== v) el.textContent = v; }); return ctx; },
    // Tactile press: surface compresses, carriers follow a beat later and spring back.
    press(ids, carriers, at, depth = 1) {
      const groups = [].concat(ids).map(id => q(`[data-surf="${id}"]`)).filter(Boolean);
      groups.forEach(g => {
        const st = state.get(g.dataset.surf).g; const o = `${st.x + st.w / 2} ${st.y + st.h / 2}`;
        F(g, { scaleX: 1, scaleY: 1, svgOrigin: o }, { scaleX: 1 - .035 * depth, scaleY: 1 - .075 * depth, svgOrigin: o, duration: .09, ease: 'power2.out' }, at)
          .fromTo(g, { scaleX: 1 - .035 * depth, scaleY: 1 - .075 * depth, svgOrigin: o }, { scaleX: 1, scaleY: 1, svgOrigin: o, duration: .62, ease: 'elastic.out(1,0.42)' }, at + .1);
        const sh = g.querySelector('.sh-a'); if (sh) F(sh, { opacity: 1 }, { opacity: .45, duration: .09 }, at).fromTo(sh, { opacity: .45 }, { opacity: 1, duration: .5 }, at + .1);
      });
      const c = carriers ? qa(carriers) : [];
      if (c.length) F(c, { y: 0, scale: 1 }, { y: 1.5 * depth, scale: 1 - .03 * depth, duration: .1, ease: 'power2.out' }, at + .03)
        .fromTo(c, { y: 1.5 * depth, scale: 1 - .03 * depth }, { y: 0, scale: 1, duration: .7, ease: 'elastic.out(1,0.38)' }, at + .15);
      return ctx;
    },
    // Cursor path in world coordinates: [{at, x, y, press?}].
    cursor(points) {
      const cur = q('.fc-cursor'); if (!cur) return ctx;
      const first = points[0];
      F(cur, { x: first.x + 70, y: first.y + 90, autoAlpha: 0 }, { x: first.x, y: first.y, autoAlpha: 1, duration: .55, ease: 'power3.out' }, first.at - .55);
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        F(cur, { x: a.x, y: a.y }, { x: b.x, y: b.y, duration: b.at - a.at - (a.press ? .14 : 0), ease: 'power3.inOut' }, a.at + (a.press ? .14 : 0));
      }
      points.filter(p => p.press).forEach(p => {
        const svg = cur.querySelector('svg'), ring = cur.querySelector('.fc-cursor-ring');
        F(svg, { scale: 1 }, { scale: .86, duration: .07, ease: 'power2.out' }, p.at).fromTo(svg, { scale: .86 }, { scale: 1, duration: .35, ease: 'back.out(2)' }, p.at + .08)
          .fromTo(ring, { scale: .2, opacity: .55 }, { scale: 1.6, opacity: 0, duration: .5, ease: 'power2.out' }, p.at + .02);
      });
      const last = points[points.length - 1];
      F(cur, { x: last.x, y: last.y, autoAlpha: 1 }, { x: last.x + 46, y: last.y + 64, autoAlpha: 0, duration: .5, ease: 'power2.in' }, last.at + .55);
      return ctx;
    }
  };

  // ---------- surfaces: form from seed ----------
  const surfs = qa('[data-surf]');
  surfs.forEach((g, i) => {
    const geo = parseG(g.dataset.g), elev = +g.dataset.elev;
    const parts = {}; ['sh-a', 'sh-c', 'body', 'hl', 'edge', 'trace'].forEach(c => { parts[c] = g.querySelector(':scope > .' + c); });
    const sd = g.dataset.seed ? g.dataset.seed.split(',').map(Number) : center;
    const S = seedRect(sd[0], sd[1], Math.min(10, geo.h, geo.w));
    const at = g.dataset.at != null ? +g.dataset.at : T.form + (+g.dataset.order || i) * 0.11;
    const from = partsFor(S, elev), to = partsFor(geo, elev);
    state.set(g.dataset.surf, { g: geo, g0: geo, elev, parts, formEnd: at + (elev > 0 ? 1.06 : .86) });
    if (parts.trace) {
      F(parts.trace, { morphSVG: from.trace }, { morphSVG: to.trace, duration: .62, ease: 'power3.inOut' }, at)
        .fromTo(parts.trace, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: .55, ease: 'power2.inOut' }, at)
        .fromTo(parts.trace, { opacity: 0 }, { opacity: 1, duration: .04, ease: 'none' }, at)
        .fromTo(parts.trace, { opacity: 1 }, { opacity: 0, duration: .3, ease: 'power1.out' }, at + .62);
    }
    for (const c of ['body', 'hl', 'edge', 'sh-a', 'sh-c']) {
      const el = parts[c]; if (!el) continue;
      const delay = c.startsWith('sh') ? .34 : .14;
      F(el, { morphSVG: from[c] }, { morphSVG: to[c], duration: .72, ease: c.startsWith('sh') ? 'power3.out' : 'back.out(1.12)' }, at + delay);
      F(el, { opacity: 0 }, { opacity: 1, duration: c.startsWith('sh') ? .6 : c === 'hl' ? .3 : .12, ease: 'none' }, at + delay + (c === 'hl' ? .4 : 0));
    }
  });

  // ---------- drawn vectors and pops ----------
  qa('[data-draw]').forEach((el, i) => {
    const at = el.dataset.at != null ? +el.dataset.at : T.reveal + i * .05, dur = el.dataset.dur != null ? +el.dataset.dur : .7;
    F(el, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: dur, ease: 'power2.inOut' }, at);
    F(el, { drawSVG: '0% 100%' }, { drawSVG: '100% 100%', duration: .4, ease: 'power2.in' }, T.collapse + .05);
  });
  qa('[data-pop]').forEach((el, i) => {
    const at = el.dataset.at != null ? +el.dataset.at : T.reveal + i * .05;
    F(el, { scale: 0, transformOrigin: el.dataset.origin || '50% 50%' }, { scale: 1, duration: .5, ease: el.dataset.ease || 'back.out(2.2)' }, at);
    F(el, { scale: 1 }, { scale: 0, duration: .25, ease: 'power2.in' }, T.collapse + .08);
  });

  // ---------- carriers: masked reveal with follow-through ----------
  const layers = qa('.fc-layer');
  layers.forEach((el, i) => {
    const inner = el.firstElementChild;
    const at = el.dataset.at != null ? +el.dataset.at : T.reveal + i * 0.05;
    const icon = el.dataset.kind === 'icon';
    F(el, { clipPath: 'inset(-40% -20% 140% -20%)' }, { clipPath: 'inset(-40% -20% -40% -20%)', duration: .5, ease: 'power3.out' }, at);
    F(inner, icon ? { y: 8, scale: .7 } : { y: 12 }, icon ? { y: 0, scale: 1, duration: .75, ease: 'back.out(2)' } : { y: 0, duration: .8, ease: 'back.out(1.7)' }, at + .05);
  });

  // ---------- component interaction ----------
  if (entry.motion) entry.motion(ctx);

  // ---------- carriers retract before the surfaces collapse ----------
  layers.forEach((el, i) => {
    if (hidden.has(el)) return;
    const out = T.collapse + (layers.length - i) * 0.015;
    F(el, { clipPath: 'inset(-40% -20% -40% -20%)' }, { clipPath: 'inset(-40% -20% 140% -20%)', duration: .3, ease: 'power2.in' }, out);
    F(el.firstElementChild, { y: 0 }, { y: -8, duration: .3, ease: 'power2.in' }, out);
  });

  // ---------- collapse back to the seed ----------
  const exit = entry.exit || center;
  const order = [...state.entries()].reverse();
  const step = Math.min(.04, .2 / Math.max(1, order.length - 1));
  order.forEach(([id, st], i) => {
    const at = T.collapse + .1 + i * step;
    const S = seedRect(exit[0], exit[1], 10);
    const a = partsFor(st.g, st.elev), b = partsFor(S, st.elev);
    for (const [c, el] of Object.entries(st.parts)) {
      if (!el || c === 'trace') continue;
      F(el, { morphSVG: a[c] }, { morphSVG: b[c], duration: .46, ease: 'power3.inOut' }, at);
      F(el, { opacity: 1 }, { opacity: 0, duration: c.startsWith('sh') ? .25 : .08, ease: 'none' }, c.startsWith('sh') || c === 'hl' ? at : at + .4);
    }
  });
  tl.set({}, {}, D);

  // Prime every tween in order so absolute seeks never depend on history.
  tl.progress(1, true).progress(0, true);

  const camera = buildCamera(entry.cues ? entry.cues(defaultCues(entry), T) : defaultCues(entry), entry.spring);
  const cam = root.querySelector('.fc-camera');
  let cameraOn = options.camera !== false;

  let lastT = 0;
  function renderAt(t) {
    t = clamp(t, 0, D); lastT = t;
    // Canonical history: always arrive at t forward from 0, so every frame is reached the same way.
    tl.time(0, true); tl.time(t, true);
    for (const o of players) {
      let f = o.rest;
      for (const s of o.segs) { if (t >= s.at) f = s.from + (s.to - s.from) * clamp((t - s.at) / s.dur); }
      f = clamp(f, 0, o.frames - 1);
      o.p.goToAndStop(Math.floor(f + 1e-6), true);
    }
    for (const fn of after) fn(t);
    if (cam) {
      const c = cameraOn ? camera(t) : { rx: 0, ry: 0, rz: 0, s: 1, x: 0, y: 0 };
      cam.style.transform = `translate3d(${c.x.toFixed(3)}px,${c.y.toFixed(3)}px,0) rotateX(${c.rx.toFixed(4)}deg) rotateY(${c.ry.toFixed(4)}deg) rotateZ(${c.rz.toFixed(4)}deg) scale(${c.s.toFixed(5)})`;
    }
    return t;
  }
  return {
    duration: D, timeline: tl, renderAt, camera,
    setCamera(on) { cameraOn = on; },
    ready: Promise.all(ready).then(() => { renderAt(lastT); })
  };
}
