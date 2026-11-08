// HyperFrames composition: a depth fly-through. Six Focus Care components wait at increasing
// depth; a closed-form spring camera dollies forward and yaws past each one as it forms, plays its
// interaction and holds. HyperFrames seeks window.__timelines.main; a proxy tween's modifier forwards
// every seek to the absolute-time renderAt below (modifiers run even when seeks suppress callbacks).
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { byId } from './registry.js';
import { createMotion, setIconData, buildCamera, gsap } from './motion.js';
import ICONS from '../assets/useanimations.json';
import logo from '../assets/logo-256.png';

setIconData(ICONS);
const IDS = ['search', 'date', 'clockin', 'line', 'dialog', 'staff'];
const STEP = 3.6, DEPTH = 1500, P = 1800, SCALE = 2.25, D = IDS.length * STEP + 1.0;
const SIDE = i => (i % 2 ? 1 : -1), LAT = 230;

// Camera stations: arrive at each component, hold, then dolly on. Spring keeps velocity across cues.
// Channels reuse the library camera solver: y carries dolly depth, x lateral track, rx tilt, ry yaw.
const cues = [[0, { rx: 9, ry: 0, x: 0, y: -900 }]];
IDS.forEach((_, i) => {
  cues.push([i * STEP + .05, { y: i * DEPTH, x: SIDE(i) * LAT, ry: SIDE(i) * -8, rx: 4 }]);
  cues.push([i * STEP + 1.6, { ry: 0, rx: 0 }]);
});
const camera = buildCamera(cues, { w: 4.2, zeta: .92 });

function Scene() {
  return (
    <div id="fc-hf" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(128,128,128,.11) 1px,transparent 1px),linear-gradient(90deg,rgba(128,128,128,.11) 1px,transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(70% 55% at 50% 60%,#000 35%,transparent 100%)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '61%', width: 1100, height: 900, transform: 'translate(-50%,-50%)', background: 'radial-gradient(closest-side,rgba(45,125,255,.11),rgba(45,125,255,0))' }} />
      <div style={{ position: 'absolute', left: 96, top: 110, display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 600, color: '#0f172a' }}>
        <img src={logo} width="64" height="64" alt="Focus Care" /><span>Focus Care</span>
        <em style={{ fontStyle: 'normal', fontWeight: 500, color: '#64748b', marginLeft: 10, paddingLeft: 20, borderLeft: '2px solid #e2e8f0' }}>Depth fly-through · HyperFrames</em>
      </div>
      <div id="fc-hf-title" style={{ position: 'absolute', left: 96, right: 96, top: 270, color: '#0f172a' }}>
        <div className="eb" style={{ fontSize: 26, fontWeight: 600, color: '#1d4ed8', fontVariantNumeric: 'tabular-nums' }} />
        <h1 className="tt" style={{ fontSize: 96, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1.02, margin: '18px 0 0' }} />
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1160, perspective: P, perspectiveOrigin: '50% 30%' }}>
        <div id="fc-hf-world" style={{ transformStyle: 'preserve-3d' }}>
          {IDS.map((id, i) => {
            const C = byId(id);
            return (
              <div key={id} className="hf-item" style={{ position: 'absolute', left: -240 * SCALE, top: -180 * SCALE, transform: `translate3d(${SIDE(i) * LAT}px,0,${-i * DEPTH}px)` }}>
                <div className="hf-host" style={{ width: 480, height: 360, transform: `scale(${SCALE})`, transformOrigin: '0 0' }}>
                  <div className="fc-stage" data-entry={id}><div className="fc-camera"><div className="fc-dense"><C uid={`hf-${id}`} /></div></div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 96, right: 96, bottom: 110, display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#94a3b8', fontWeight: 500 }}><span>Icons: useAnimations</span><span>Illustrative interface</span></div>
    </div>
  );
}

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = x => 1 - Math.pow(1 - x, 3);
// HyperFrames' lottie adapter re-seeks every registered animation to composition time after each
// seek, which would override the explicit native frame segments set by motion.js. Our engine owns
// those frames, so hide its instances from that discovery.
if (window.lottie) window.lottie.getRegisteredAnimations = () => [];
async function boot() {
  const mount = document.getElementById('fc-hf-mount');
  const root = createRoot(mount);
  flushSync(() => root.render(<Scene />));
  await document.fonts.ready;
  const items = [...document.querySelectorAll('.hf-item')];
  const motions = items.map((el, i) => createMotion(el.querySelector('.hf-host'), byId(IDS[i]), { camera: false }));
  await Promise.all(motions.map(m => m.ready));
  const world = document.getElementById('fc-hf-world'), title = document.getElementById('fc-hf-title');
  const eb = title.querySelector('.eb'), tt = title.querySelector('.tt');
  function renderAt(t) {
    const c = camera(t);
    world.style.transform = `rotateX(${(-c.rx).toFixed(4)}deg) rotateY(${c.ry.toFixed(4)}deg) translate3d(${(-c.x).toFixed(3)}px,0,${c.y.toFixed(3)}px)`;
    items.forEach((el, i) => {
      const local = t - i * STEP + .6;
      motions[i].renderAt(clamp(local, 0, motions[i].duration));
      // Atmospheric depth: far items recede into the canvas; passed items fade as they cross the lens.
      const dz = c.y - i * DEPTH;
      const far = clamp(1 - (-dz - DEPTH * 1.1) / (DEPTH * 1.2)), near = clamp(1 - dz / 260);
      el.style.opacity = (far * near).toFixed(4);
      el.style.visibility = far * near < .002 ? 'hidden' : 'visible';
    });
    const i = clamp(Math.floor((t + .3) / STEP), 0, IDS.length - 1), lt = t + .3 - i * STEP, e = byId(IDS[i]);
    const inP = ease(clamp((lt - .25) / .5)), outP = i === IDS.length - 1 ? 0 : ease(clamp((lt - (STEP - .4)) / .35));
    eb.textContent = `${e.category} · ${String(i + 1).padStart(2, '0')} / ${String(IDS.length).padStart(2, '0')}`; tt.textContent = e.title;
    title.style.clipPath = `inset(-10% -5% ${(1 - inP * (1 - outP)) * 100}% -5%)`;
    title.style.transform = `translateY(${(1 - inP) * 26 - outP * 14}px)`;
  }
  const proxy = { t: 0 };
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(proxy, { t: 0 }, { t: D, duration: D, ease: 'none', modifiers: { t: v => { renderAt(+v); return v; } } }, 0);
  renderAt(0);
  window.renderAt = s => { tl.seek(s); return s; };
  window.__timelines = window.__timelines || {};
  window.__timelines.main = tl;
}
window.__FC_HF_DURATION__ = D;
boot().catch(e => { console.error("hyperframes boot failed", e); throw e; });
