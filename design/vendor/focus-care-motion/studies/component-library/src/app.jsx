// Gallery, film and single-component views for the Focus Care component library.
// Render contract: window.animationReady (Promise) and window.renderAt(seconds).
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { LIBRARY, CORE, EXPLAINER, CATEGORIES, byId } from './registry.js';
import { createMotion, setIconData, T } from './motion.js';
import ICONS from '../assets/useanimations.json';
import { clamp } from './geometry.js';

setIconData(ICONS);
const params = new URLSearchParams(location.search);
const RENDER = params.has('render');
const MODE = params.get('film') != null || (window.__FC_DEFAULT_MODE__ === 'film' && !params.get('only')) ? 'film' : params.get('only') ? 'only' : 'gallery';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FPS = 60;
const SOURCES = window.__FC_SOURCES__ || {};
const EXPORTS = window.__FC_EXPORTS__ || {};
document.documentElement.classList.toggle('render', RENDER);
document.documentElement.dataset.mode = MODE;

export function Stage({ entry, dense = true }) {
  const C = entry;
  return (
    <div className="fc-stage" data-entry={entry.id}>
      <div className="fc-camera"><div className={`fc-dense${dense ? '' : ' off'}`}><C uid={`u-${entry.id}`} /></div></div>
    </div>
  );
}

const fmt = t => `${t.toFixed(2)}s`;

// ------------------------------------------------------------------ gallery card
function Card({ entry, register, cameraOn }) {
  const host = useRef(null), fit = useRef(null);
  const [open, setOpen] = useState(false), [tab, setTab] = useState('react'), [copied, setCopied] = useState(false);
  const [time, setTime] = useState(0), [playing, setPlaying] = useState(!reduced && !RENDER);
  const api = useRef(null);
  useEffect(() => {
    const m = createMotion(host.current, entry, { camera: !reduced });
    api.current = { m, t: reduced ? T.hold + .4 : 0, playing: !reduced && !RENDER, visible: true, set: v => { api.current.t = v; m.renderAt(v); setTime(v); } };
    register(entry.id, api.current, setPlaying);
    m.ready.then(() => api.current.set(api.current.t));
    const io = new IntersectionObserver(([e]) => { api.current.visible = e.isIntersecting; }, { rootMargin: '120px' });
    io.observe(host.current);
    const ro = new ResizeObserver(() => { const w = fit.current.clientWidth; host.current.style.transform = `scale(${w / 480})`; fit.current.style.height = `${360 * w / 480}px`; });
    ro.observe(fit.current);
    return () => { io.disconnect(); ro.disconnect(); };
  }, []);
  useEffect(() => { api.current && api.current.m.setCamera(cameraOn); api.current && api.current.set(api.current.t); }, [cameraOn]);
  const toggle = () => { const a = api.current; a.playing = !a.playing; setPlaying(a.playing); };
  const step = d => { const a = api.current; a.playing = false; setPlaying(false); a.set(clamp(a.t + d, 0, a.m.duration)); };
  const code = { react: SOURCES[entry.id] || entry.usage, html: EXPORTS[entry.id]?.html || 'Run the exporter to generate the HTML snapshot.', svg: EXPORTS[entry.id]?.svg || 'Run the exporter to generate the SVG.' }[tab];
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); } };
  return (
    <article className="card" id={entry.id} aria-labelledby={`${entry.id}-name`}>
      <div className="card-stage" ref={fit}><div className="card-host" ref={host}><Stage entry={entry} dense={false} /></div></div>
      <div className="card-body">
        <div className="card-head"><h2 id={`${entry.id}-name`}>{entry.title}</h2><span className="tag">{entry.category}</span></div>
        <p>{entry.summary}</p>
        <div className="controls" role="group" aria-label={`${entry.title} playback`}>
          <button className="primary" onClick={toggle} aria-pressed={playing}>{playing ? 'Pause' : 'Play'}</button>
          <button onClick={() => step(-1 / FPS)} aria-label="Back one frame">−1f</button>
          <button onClick={() => step(1 / FPS)} aria-label="Forward one frame">+1f</button>
          <input type="range" min="0" max={T.end} step={1 / FPS} value={time} aria-label={`${entry.title} time`}
                 onChange={e => { const a = api.current; a.playing = false; setPlaying(false); a.set(+e.target.value); }} />
          <span className="time">{fmt(time)}</span>
          <button onClick={() => setOpen(o => !o)} aria-expanded={open}>{open ? 'Hide code' : 'Code'}</button>
        </div>
        {open && (
          <div className="code">
            <div className="tabs" role="tablist">
              {['react', 'html', 'svg'].map(k => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{k === 'react' ? 'React' : k.toUpperCase()}</button>)}
              <button className="copy" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre tabIndex={0}><code>{code}</code></pre>
          </div>
        )}
      </div>
    </article>
  );
}

function Gallery() {
  const cards = useRef(new Map());
  const [filter, setFilter] = useState('All');
  const [cameraOn, setCameraOn] = useState(!reduced);
  const register = useCallback((id, api, setPlaying) => cards.current.set(id, { api, setPlaying }), []);
  useEffect(() => {
    let last = null, raf;
    const tick = now => {
      const dt = last == null ? 0 : Math.min(.05, (now - last) / 1000); last = now;
      if (!RENDER) for (const { api } of cards.current.values()) if (api.playing && api.visible) api.set((api.t + dt) % api.m.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.renderAt = s => { for (const { api } of cards.current.values()) api.set(s % api.m.duration); return s; };
    window.__fcCards = cards.current;
    window.animationReadyResolve(Promise.all([...cards.current.values()].map(c => c.api.m.ready)));
    return () => cancelAnimationFrame(raf);
  }, []);
  const all = on => { for (const { api, setPlaying } of cards.current.values()) { api.playing = on; setPlaying(on); } };
  const shown = LIBRARY.filter(c => filter === 'All' || c.category === filter);
  return (
    <div className="gallery">
      <header className="top">
        <div className="brand"><img src={window.__FC_LOGO__} alt="" width="36" height="36" /><span>Focus Care</span></div>
        <h1>Component library</h1>
        <p className="lede">{LIBRARY.length} tactile HTML, React and SVG components. Every surface forms from a seed with GSAP MorphSVG and DrawSVG, labels and native useAnimations icons ride independent carriers, and a damped camera orbits each one for depth.</p>
        <div className="toolbar" role="toolbar" aria-label="Library controls">
          <div className="chips" role="group" aria-label="Filter by category">
            {['All', ...CATEGORIES].map(c => <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>)}
          </div>
          <div className="global">
            <button onClick={() => all(true)}>Play all</button>
            <button onClick={() => all(false)}>Pause all</button>
            <button aria-pressed={cameraOn} onClick={() => setCameraOn(v => !v)}>{cameraOn ? 'Camera orbit on' : 'Camera orbit off'}</button>
            <a className="btn" href="?film=1">Film view</a>
          </div>
        </div>
        {reduced && <p className="note">Reduced motion is on: cards start paused on their resolved state. Play remains available.</p>}
      </header>
      <main className="grid">{LIBRARY.map(e => <div key={e.id} hidden={!shown.includes(e)}><Card entry={e} register={register} cameraOn={cameraOn} /></div>)}</main>
      <footer className="foot">Icons: useAnimations (MIT), native Lottie data sought frame by frame. Type: Inter. Illustrative interfaces, not product screenshots.</footer>
    </div>
  );
}

// ------------------------------------------------------------------ film (1080×1920 tour)
export const SEG = T.end;
function Film({ list }) {
  const hosts = useRef([]), motions = useRef([]);
  const [ui, setUi] = useState({ i: 0, t: 0, playing: !reduced && !RENDER });
  const clock = useRef({ t: 0, playing: !reduced && !RENDER });
  const total = list.length * SEG;
  const title = useRef(null);
  const render = useCallback(s => {
    s = clamp(s, 0, total - 1e-6);
    const i = Math.min(list.length - 1, Math.floor(s / SEG)), lt = s - i * SEG;
    hosts.current.forEach((h, j) => { h.style.visibility = j === i ? 'visible' : 'hidden'; });
    motions.current[i] && motions.current[i].renderAt(lt);
    // Title masks: reveal after the surface starts forming, retract before collapse.
    const p = clamp((lt - .25) / .55), r = clamp((lt - (T.collapse - .05)) / .4);
    const e = x => 1 - Math.pow(1 - x, 3);
    const show = e(p) * (1 - e(r));
    title.current.style.clipPath = `inset(-10% -5% ${(1 - show) * 100}% -5%)`;
    title.current.style.transform = `translateY(${(1 - e(p)) * 26 - e(r) * 14}px)`;
    clock.current.t = s;
    flushSync(() => setUi(u => ({ ...u, i, t: s })));
    return s;
  }, [list.length]);
  useEffect(() => {
    motions.current = hosts.current.map((h, i) => createMotion(h, list[i]));
    window.renderAt = render;
    let last = null, raf;
    const tick = now => { const dt = last == null ? 0 : Math.min(.05, (now - last) / 1000); last = now; if (clock.current.playing && !RENDER) render((clock.current.t + dt) % total); raf = requestAnimationFrame(tick); };
    window.animationReadyResolve(Promise.all(motions.current.map(m => m.ready)).then(() => render(reduced ? T.hold + .4 : 0)));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const entry = list[ui.i];
  const set = v => { clock.current.playing = false; setUi(u => ({ ...u, playing: false })); render(v); };
  return (
    <div className="film-wrap">
      <div className="film" id="film">
        <div className="film-grid" />
        <header className="film-head"><img src={window.__FC_LOGO__} alt="Focus Care" width="64" height="64" /><span>Focus Care</span><em>Component library</em></header>
        <div className="film-title" ref={title}>
          <div className="eyebrow tnum">{entry.category} · {String(ui.i + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</div>
          <h1>{entry.title}</h1>
          <p>{entry.summary}</p>
        </div>
        <div className="film-stage">
          {list.map((e, i) => <div key={e.id} className="film-host" ref={el => (hosts.current[i] = el)}><Stage entry={e} /></div>)}
        </div>
        <footer className="film-foot"><span>Icons: useAnimations</span><span>Illustrative interface</span></footer>
      </div>
      <div className="film-controls" role="group" aria-label="Film playback">
        <button className="primary" onClick={() => { clock.current.playing = !clock.current.playing; setUi(u => ({ ...u, playing: clock.current.playing })); }}>{clock.current.playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => set(clamp(ui.t - 1 / FPS, 0, total))} aria-label="Back one frame">−1f</button>
        <button onClick={() => set(clamp(ui.t + 1 / FPS, 0, total))} aria-label="Forward one frame">+1f</button>
        <input type="range" min="0" max={total} step={1 / FPS} value={ui.t} onChange={e => set(+e.target.value)} aria-label="Film time" />
        <span className="time">{fmt(ui.t)}</span>
        <select value={ui.i} onChange={e => set(+e.target.value * SEG)} aria-label="Jump to component">{list.map((e, i) => <option key={e.id} value={i}>{e.title}</option>)}</select>
        <a className="btn" href="?">Gallery</a>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ single (export / capture)
function Only({ entry }) {
  const host = useRef(null);
  useEffect(() => {
    const m = createMotion(host.current, entry, { camera: params.get('camera') !== '0' });
    window.renderAt = s => m.renderAt(s);
    window.__fcMotion = m;
    window.animationReadyResolve(m.ready.then(() => m.renderAt(+(params.get('t') ?? T.hold + .4))));
  }, []);
  return <div className="only" ref={host}><Stage entry={entry} dense={params.get('dense') !== '0'} /></div>;
}

let resolveReady;
window.animationReady = new Promise(r => (resolveReady = r));
// Provisional render contract so capture tools can find renderAt immediately after load;
// each view replaces it with the real seek before animationReady resolves.
window.renderAt = s => s;
window.animationReadyResolve = p => p.then(() => resolveReady());

async function boot() {
  await document.fonts.ready;
  await Promise.all(['400', '500', '600', '700'].map(w => document.fonts.load(`${w} 16px Inter`)));
  const root = createRoot(document.getElementById('root'));
  if (MODE === 'film') {
    const raw = params.get('film') || window.__FC_FILM_SET__ || 'core';
    const sets = { core: CORE, '1': CORE, explainer: EXPLAINER, all: LIBRARY };
    root.render(<Film list={sets[raw] || raw.split(',').map(byId).filter(Boolean)} />);
  } else if (MODE === 'only') root.render(<Only entry={byId(params.get('only'))} />);
  else {
    root.render(<Gallery />);
  }
}
boot();
export { LIBRARY, T };
