// Explainer set: hardware and footage. See EXPLAINER-BRIEF.md.
// Settings and analytics screens, extreme close-ups, product reveals and illustrative footage.
// Same rules as the library: SVG surfaces form from seeds, HTML carriers hold Inter labels and
// native useAnimations icons, and every scene is a pure function of absolute time.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect, rr } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', BLUE = '#2d7dff', MUTE = '#94a3b8';
const GREEN = '#16a34a', GREEN_D = '#15803d', AMBER = '#f59e0b', AMBER_D = '#a16207', CYAN = '#0ea5e9';
const CAT = 'Hardware & footage';
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const f2 = v => v.toFixed(2);
// Smooth path through points (Catmull-Rom converted to cubic Béziers).
function smooth(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}
// Seeded PRNG (module scope, deterministic).
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// Piecewise counter: segs = [[at, dur, from, to, ease]], pure in t.
function counter(c, sel, segs, fmt) {
  const el = c.q(sel), E = segs.map(s => c.ease(s[4] || 'power3.out'));
  c.after(t => { let v = segs[0][2]; segs.forEach(([at, dur, a, b], i) => { if (t >= at) v = a + (b - a) * E[i](cl((t - at) / dur)); }); const s = fmt(v); if (el.textContent !== s) el.textContent = s; });
}
const comma = v => Math.round(v).toLocaleString('en-US');
// Iris reveal for scene groups clipped by a rounded rect (opens after its screen forms, closes at collapse).
function iris(c, sel, g, open = 1.0, close = 5.5) {
  const r = c.q(sel), E = c.ease('power3.inOut'), cx = g.x + g.w / 2, cy = g.y + g.h / 2;
  c.after(t => {
    const p = E(cl((t - open) / .6)) * (1 - E(cl((t - close) / .32)));
    const w = Math.max(.01, g.w * p), h = Math.max(.01, g.h * (.25 + .75 * p) * (p > 0 ? 1 : 0));
    r.setAttribute('x', f2(cx - w / 2)); r.setAttribute('y', f2(cy - h / 2)); r.setAttribute('width', f2(w)); r.setAttribute('height', f2(h));
    r.setAttribute('rx', f2(Math.min(g.r, w / 2, h / 2)));
  });
}

// ---------------------------------------------------------------- Settings screen
const G1 = 112, G2 = 202, RH = 56, DROP = 56;
const OPTS = ['Email', 'Text message', 'Push only'];
export function SettingsScreen({ uid = 'settings-screen' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Notification settings: the reminder channel changes to text message and a phone row appears" svg={<>
      <Surf id="card" x={50} y={22} w={380} h={270} r={22} tone="white" elev={3} seed={[240, 160]} />
      <Surf id="saved" x={338} y={40} w={72} h={26} r={13} tone="greenTint" elev={0} seed={[352, 53]} at={3.42} />
      <Surf id="g1" x={66} y={G1} w={348} h={RH} r={14} tone="white" elev={1} seed={[240, G1 + 28]} order={1} />
      <Surf id="t1" x={80} y={G1 + 12} w={32} h={32} r={10} tone="tint" elev={0} seed={[96, G1 + 28]} order={2} />
      <Surf id="sel" x={274} y={G1 + 13} w={128} h={30} r={9} tone="muted" elev={0} seed={[338, G1 + 28]} order={3} />
      <Draw id="div" d={`M80 ${G1 + RH + .5} H400`} stroke="#eef2f6" width={1} at={3.3} dur={.45} />
      <Surf id="t2" x={80} y={G1 + RH + 12} w={32} h={32} r={10} tone="tint" elev={0} seed={[96, G1 + RH + 28]} at={3.34} />
      <Surf id="g2" x={66} y={G2} w={348} h={RH} r={14} tone="white" elev={1} seed={[240, G2 + 28]} order={4} />
      <Surf id="t3" x={80} y={G2 + 12} w={32} h={32} r={10} tone="tint" elev={0} seed={[96, G2 + 28]} order={5} />
      <Surf id="trk" x={358} y={G2 + 15} w={42} h={26} r={13} tone="blue" elev={0} seed={[386, G2 + 28]} order={5} />
      <Surf id="knob" x={377} y={G2 + 18} w={20} h={20} r={10} tone="white" elev={2} seed={[387, G2 + 28]} order={6} />
      <Surf id="menu" x={274} y={160} w={140} h={106} r={12} tone="white" elev={3} seed={[338, 158]} at={2.04} />
      <rect className="hov" x={280} y={197} width={128} height={30} rx={8} fill="#eaf2ff" opacity="0" />
    </>}>
      <Layer id="t" x={74} y={38} w={250} h={22} at={.7}><Text size={15.5} weight={600}>Notification settings</Text></Layer>
      <Layer id="s" x={74} y={60} w={250} h={20} at={.76}><Text size={12.5} color={SUB}>Maple House · applies to all staff</Text></Layer>
      <Layer id="sv" x={338} y={40} w={72} h={26} at={3.56} align="center" className="gap6"><Icon name="checkmark" size={14} color={GREEN} id="svck" /><Text size={12} weight={600} color={GREEN_D}>Saved</Text></Layer>
      <Layer id="h1" x={70} y={88} w={200} h={20} at={.85}><Text size={12} weight={600} color={SUB}>Shift alerts</Text></Layer>
      <Layer id="i1" kind="icon" x={80} y={G1 + 12} w={32} h={32} at={1.05} align="center"><Icon name="notification" size={18} color={DEEP} id="bell" /></Layer>
      <Layer id="r1" x={124} y={G1} w={146} h={RH} at={1.0}><span className="stack"><Text size={13.5} weight={600}>Reminder channel</Text><Text size={12} color={SUB}>Sent before each shift</Text></span></Layer>
      <Layer id="sv1" x={286} y={G1 + 13} w={92} h={30} at={1.12}><Text size={13} weight={600} className="selv">Email</Text></Layer>
      <Layer id="chv" kind="icon" x={376} y={G1 + 13} w={20} h={30} at={1.18} align="center"><Icon name="chevronDown" size={16} color={SUB} id="chev" /></Layer>
      <Layer id="i2" kind="icon" x={80} y={G1 + RH + 12} w={32} h={32} at={3.48} align="center"><Icon name="smartphone" size={18} color={DEEP} id="phone" /></Layer>
      <Layer id="r2" x={124} y={G1 + RH} w={170} h={RH} at={3.42}><span className="stack"><Text size={13.5} weight={600}>Text to</Text><Text size={12} color={SUB} className="tnum">(555) 014 2290</Text></span></Layer>
      <Layer id="e2" x={330} y={G1 + RH} w={70} h={RH} at={3.5} align="right"><Text size={12.5} weight={600} color={DEEP}>Edit</Text></Layer>
      <Layer id="h2" x={70} y={178} w={200} h={20} at={.9}><Text size={12} weight={600} color={SUB}>Privacy</Text></Layer>
      <Layer id="i3" kind="icon" x={80} y={G2 + 12} w={32} h={32} at={1.15} align="center"><Icon name="mapPin" size={18} color={DEEP} id="pin" /></Layer>
      <Layer id="r3" x={124} y={G2} w={180} h={RH} at={1.1}><span className="stack"><Text size={13.5} weight={600}>Share location</Text><Text size={12} color={SUB}>Only while clocked in</Text></span></Layer>
      {OPTS.map((o, i) => <Layer key={o} id={`o${i}`} x={290} y={166 + i * 31} w={112} h={30} at={2.32 + i * .05}><Text size={13} weight={i === 0 ? 600 : 500} color={i === 0 ? DEEP : INK} className={`opt${i}`}>{o}</Text></Layer>)}
    </Frame>
  );
}
SettingsScreen.motion = c => {
    c.cursor([{ at: 2.0, x: 352, y: G1 + 34, press: true }, { at: 2.86, x: 396, y: 219, press: true }]);
  c.press('sel', '[data-layer="sv1"]', 2.0, .7);
  c.icon('chev', 0, 16, 2.02, .32);
  c.fromTo('.hov', { opacity: 0 }, { opacity: 1, duration: .18 }, 2.6);
  c.fromTo('.opt1', { color: INK }, { color: DEEP, duration: .18 }, 2.6);
  c.press('menu', '[data-layer="o1"]', 2.86, .45);
  OPTS.forEach((_, i) => c.hide(`o${i}`, 2.98 + i * .02, .18));
  c.fromTo('.hov', { opacity: 1 }, { opacity: 0, duration: .14 }, 2.98);
  c.reshape('menu', rect(274, G1 + 13, 128, 30, 9), 3.1, .36, 'power3.inOut');
  c.icon('chev', 16, 33, 3.1, .32);
  c.swap('.selv', ['Email', 'Text message'], [3.22]);
  const E = 'back.out(1.1)';
  c.reshape('card', rect(50, 22, 380, 270 + DROP, 22), 3.12, .5, E);
  c.reshape('g1', rect(66, G1, 348, RH * 2, 14), 3.12, .5, E);
  c.reshape('g2', rect(66, G2 + DROP, 348, RH, 14), 3.12, .5, E);
  c.reshape('t3', rect(80, G2 + DROP + 12, 32, 32, 10), 3.12, .5, E);
  c.reshape('trk', rect(358, G2 + DROP + 15, 42, 26, 13), 3.12, .5, E);
  c.reshape('knob', rect(377, G2 + DROP + 18, 20, 20, 10), 3.12, .5, E);
  c.fromTo('[data-layer="h2"], [data-layer="i3"], [data-layer="r3"]', { y: 0 }, { y: DROP, duration: .5, ease: E }, 3.12);
  c.icon('phone', 0, 39, 3.5, .9);
  c.icon('svck', 0, 44, 3.62, .5);
};
Object.assign(SettingsScreen, {
  id: 'settings-screen', title: 'Settings screen', category: CAT, w: W, h: H, focus: { x: 262, y: 180 }, push: 1.04, orbit: .8, exit: [240, 180],
  summary: 'Grouped settings. Choosing a new reminder channel folds the menu back into its select, grows a dependent phone row that pushes the next group down, and confirms with a saved chip.',
  usage: `<SettingsScreen />`, icons: ['notification', 'chevronDown', 'smartphone', 'mapPin', 'checkmark']
});

// ---------------------------------------------------------------- Toggle close-up
const KX0 = 194, KX1 = 286, KY = 200, KR = 44;
export function ToggleCloseup({ uid = 'toggle-closeup' }) {
  const trk = rr(144, 150, 192, 100, 50);
  return (
    <Frame uid={uid} w={W} h={H} label="Extreme close-up of a large toggle switching on" svg={<>
      <defs>
        <clipPath id={`${uid}-tclip`}><path d={trk} /></clipPath>
        <radialGradient id={`${uid}-kbody`} cx=".38" cy=".3" r=".78"><stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#f8fafc" /><stop offset=".86" stopColor="#e2e8f0" /><stop offset="1" stopColor="#cbd5e1" /></radialGradient>
        <linearGradient id={`${uid}-krim`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#0f172a" stopOpacity=".2" /></linearGradient>
        <linearGradient id={`${uid}-kring`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f172a" stopOpacity=".08" /><stop offset="1" stopColor="#ffffff" stopOpacity=".95" /></linearGradient>
        <radialGradient id={`${uid}-kspec`}><stop offset="0" stopColor="#ffffff" stopOpacity=".98" /><stop offset=".6" stopColor="#ffffff" stopOpacity=".45" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${uid}-bez`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f172a" stopOpacity=".16" /><stop offset=".5" stopColor="#0f172a" stopOpacity="0" /><stop offset="1" stopColor="#ffffff" stopOpacity=".9" /></linearGradient>
      </defs>
      <Surf id="card" x={104} y={64} w={272} h={232} r={28} tone="white" elev={3} seed={[240, 190]} />
      <Surf id="pOff" x={300} y={84} w={52} h={26} r={13} tone="muted" elev={0} seed={[326, 97]} order={2} />
      <Surf id="pOn" x={300} y={84} w={52} h={26} r={13} tone="tint" elev={0} seed={[326, 97]} at={2.62} />
      <Surf id="bez" x={136} y={142} w={208} h={116} r={58} tone="muted" elev={1} seed={[240, 200]} order={1} />
      <Surf id="trk" x={144} y={150} w={192} h={100} r={50} tone="track" elev={0} seed={[240, 200]} order={2} />
      <Surf id="on" x={144} y={150} w={192} h={100} r={50} tone="blue" elev={0} seed={[KX0, KY]} at={2.44} />
      <g className="bevel" opacity="0">
        <path d={rr(136.5, 142.5, 207, 115, 57.5)} fill="none" stroke={`url(#${uid}-bez)`} strokeWidth="1.5" />
        <g clipPath={`url(#${uid}-tclip)`}>
          <path d={trk} fill="none" stroke="rgba(15,23,42,.30)" strokeWidth="10" transform="translate(0 4)" filter={`url(#${uid}-blur-c)`} />
          <path d={trk} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="3" transform="translate(0 -2.5)" />
        </g>
      </g>
      <circle className="rip rip1" cx={KX1} cy={KY} r={KR} fill="none" stroke="#bfdbfe" strokeWidth="3" opacity="0" />
      <circle className="rip rip2" cx={KX1} cy={KY} r={KR} fill="none" stroke="#bfdbfe" strokeWidth="2" opacity="0" />
      <Pop id="knob" at={1.15}>
        <g className="knob"><g className="ksq">
          <ellipse cx={KX0 + 2} cy={KY + 14} rx={38} ry={32} fill="rgba(15,23,42,.32)" filter={`url(#${uid}-blur-g)`} />
          <ellipse cx={KX0} cy={KY + 3} rx={KR - 1} ry={KR - 1} fill="rgba(15,23,42,.16)" filter={`url(#${uid}-blur-c)`} />
          <circle cx={KX0} cy={KY} r={KR} fill={`url(#${uid}-kbody)`} />
          <circle cx={KX0} cy={KY} r={KR - .75} fill="none" stroke={`url(#${uid}-krim)`} strokeWidth="1.5" />
          <circle cx={KX0} cy={KY} r={31} fill="none" stroke={`url(#${uid}-kring)`} strokeWidth="1.5" />
          <ellipse className="spec" cx={KX0 - 14} cy={KY - 21} rx={19} ry={10} transform={`rotate(-28 ${KX0 - 14} ${KY - 21})`} fill={`url(#${uid}-kspec)`} />
        </g></g>
      </Pop>
    </>}>
      <Layer id="t" x={128} y={82} w={170} h={22} at={.75}><Text size={15.5} weight={600}>Night checks</Text></Layer>
      <Layer id="s" x={128} y={104} w={170} h={20} at={.8}><Text size={12.5} color={SUB}>Room 14B · every 2 hours</Text></Layer>
      <Layer id="off" x={300} y={84} w={52} h={26} at={1.0} align="center"><Text size={12} weight={600} color={SUB}>Off</Text></Layer>
      <Layer id="onl" x={300} y={84} w={52} h={26} at={2.76} align="center"><Text size={12} weight={600} color={DEEP}>On</Text></Layer>
      <Layer id="ck" kind="icon" x={KX1 - 18} y={KY - 18} w={36} h={36} at={2.8} align="center"><Icon name="checkmark" size={30} color={DEEP} id="ck" /></Layer>
      <Layer id="ft" x={128} y={262} w={224} h={20} at={1.2} align="center"><Text size={12} color={SUB} className="tnum nfoot">Next check 12:00 AM</Text></Layer>
    </Frame>
  );
}
ToggleCloseup.motion = c => {
  const o = `${KX0} ${KY}`;
  c.fromTo('.bevel', { opacity: 0 }, { opacity: 1, duration: .45 }, .95).fromTo('.bevel', { opacity: 1 }, { opacity: 0, duration: .2 }, c.T.collapse);
  c.cursor([{ at: 2.3, x: KX0 + 16, y: KY + 24, press: true }]);
  c.fromTo('.ksq', { scaleX: 1, scaleY: 1, svgOrigin: o }, { scaleX: .95, scaleY: 1.04, svgOrigin: o, duration: .08, ease: 'power2.out' }, 2.3)
    .fromTo('.ksq', { scaleX: .95, scaleY: 1.04, svgOrigin: o }, { scaleX: 1.2, scaleY: .87, svgOrigin: o, duration: .17, ease: 'power2.out' }, 2.38)
    .fromTo('.ksq', { scaleX: 1.2, scaleY: .87, svgOrigin: o }, { scaleX: .88, scaleY: 1.08, svgOrigin: o, duration: .17, ease: 'power2.in' }, 2.55)
    .fromTo('.ksq', { scaleX: .88, scaleY: 1.08, svgOrigin: o }, { scaleX: 1, scaleY: 1, svgOrigin: o, duration: .7, ease: 'elastic.out(1,0.42)' }, 2.72);
  c.fromTo('.knob', { x: 0 }, { x: KX1 - KX0, duration: .34, ease: 'power2.inOut' }, 2.38);
  c.fromTo('.spec', { x: 0 }, { x: -5, duration: .34, ease: 'power2.inOut' }, 2.38);
  c.fromTo('.rip', { opacity: 0 }, { opacity: 0, duration: .01 }, 0);
  c.fromTo('.rip1', { scale: 1, opacity: .9, svgOrigin: `${KX1} ${KY}` }, { scale: 1.75, opacity: 0, duration: .85, ease: 'power2.out' }, 2.72);
  c.fromTo('.rip2', { scale: 1, opacity: .7, svgOrigin: `${KX1} ${KY}` }, { scale: 1.75, opacity: 0, duration: .85, ease: 'power2.out' }, 2.9);
  c.hide('off', 2.56, .18);
  c.icon('ck', 0, 44, 2.84, .6);
  c.swap('.nfoot', ['Next check 12:00 AM', 'On · next check 12:00 AM'], [2.8]);
};
Object.assign(ToggleCloseup, {
  id: 'toggle-closeup', title: 'Toggle close-up', category: CAT, w: W, h: H, focus: { x: 240, y: 196 }, push: 1.55, exit: [240, 190],
  summary: 'An extreme close-up of one machined toggle. The camera pushes in hard, the knob squashes and stretches across the bevelled track and a ripple marks the new state.',
  usage: `<ToggleCloseup />`, icons: ['checkmark']
});

// ---------------------------------------------------------------- Detail zoom
const DX = i => 72 + i * 14, DY = v => 286 - (v - 50) * 1.55;
const BPM = (() => { const r = mulberry32(714); return Array.from({ length: 25 }, (_, i) => i === 16 ? 128 : i === 15 ? 71 : i === 17 ? 75 : 61 + Math.sin(i * .7) * 2.4 + (r() - .5) * 3.2); })();
const PEAK = [DX(16), DY(128)], LENS = { x0: 150, y0: 258, x1: 310, y1: 168, r: 54, k: 2.4 };
function HeartChart({ uid, live }) {
  const line = smooth(BPM.map((v, i) => [DX(i), DY(v)]));
  const grid = [60, 90, 120].map(v => `M72 ${DY(v) + .5} H408`);
  return (<>
    {live ? grid.map((d, i) => <Draw key={i} id={`g${i}`} d={d} stroke="#eef2f6" width={1} at={.8 + i * .05} />) : grid.map((d, i) => <path key={i} d={d} stroke="#eef2f6" strokeWidth="1" fill="none" />)}
    {live ? <Draw id="base" d="M72 286.5 H408" stroke="#e2e8f0" width={1} at={.8} /> : <path d="M72 286.5 H408" stroke="#e2e8f0" strokeWidth="1" />}
    <g className={live ? 'ticks' : ''}>{BPM.map((_, i) => <path key={i} d={`M${DX(i)} 287 V${i % 4 ? 289.5 : 291}`} stroke="#cbd5e1" strokeWidth=".8" />)}</g>
    {live ? <Draw id="hr" d={line} stroke={BLUE} width={2} at={.95} dur={.85} /> : <path d={line} fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
    {(live ? [<Pop key="m" id="mk" at={1.6}><circle cx={PEAK[0]} cy={PEAK[1]} r={2.6} fill="#fff" stroke={BLUE} strokeWidth="1.4" /></Pop>] : [<circle key="m" cx={PEAK[0]} cy={PEAK[1]} r={2.6} fill="#fff" stroke={BLUE} strokeWidth="1.4" />])}
    <g className={live ? 'tiny' : ''} fontFamily="Inter, system-ui, sans-serif" fontSize="5.6" fill={INK}>
      <text x={PEAK[0] + 5} y={PEAK[1] + 1} fontWeight="700">128 bpm</text>
      <text x={PEAK[0] + 5} y={PEAK[1] + 7.6} fill={SUB} fontWeight="500">2:14 AM</text>
    </g>
  </>);
}
export function DetailZoom({ uid = 'detail-zoom' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="A magnifier loupe travels over a heart rate chart and reads a tiny overnight spike" svg={<>
      <defs>
        <clipPath id={`${uid}-lens`}><circle className="lclip" cx={LENS.x0} cy={LENS.y0} r={0} /></clipPath>
        <linearGradient id={`${uid}-handle`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#334155" /><stop offset=".5" stopColor="#1e293b" /><stop offset="1" stopColor="#0f172a" /></linearGradient>
        <radialGradient id={`${uid}-lensglass`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#ffffff" stopOpacity=".0" /><stop offset=".8" stopColor="#dbeafe" stopOpacity=".12" /><stop offset="1" stopColor="#93c5fd" stopOpacity=".28" /></radialGradient>
      </defs>
      <Surf id="card" x={40} y={22} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <HeartChart uid={uid} live />
      <g className="lensg" opacity="0">
        <circle className="lsh" cx={0} cy={6} r={LENS.r + 2} fill="rgba(15,23,42,.28)" filter={`url(#${uid}-blur-g)`} />
        <g className="lhandle"><rect x={LENS.r - 2} y={-8} width={58} height={16} rx={8} fill={`url(#${uid}-handle)`} transform="rotate(42)" /><rect x={LENS.r - 6} y={-10} width={12} height={20} rx={4} fill="#64748b" transform="rotate(42)" /></g>
      </g>
      <g clipPath={`url(#${uid}-lens)`}>
        <rect x={40} y={22} width={400} height={316} fill="#ffffff" />
        <g className="mag"><HeartChart uid={uid} live={false} /></g>
      </g>
      <g className="lensg2" opacity="0">
        <circle cx={0} cy={0} r={LENS.r} fill={`url(#${uid}-lensglass)`} />
        <circle cx={0} cy={0} r={LENS.r + 3} fill="none" stroke="#ffffff" strokeWidth="6" />
        <circle cx={0} cy={0} r={LENS.r + 6.25} fill="none" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx={0} cy={0} r={LENS.r - .25} fill="none" stroke="rgba(15,23,42,.18)" strokeWidth="1" />
        <path d={`M${-LENS.r * .62} ${-LENS.r * .5} A${LENS.r * .8} ${LENS.r * .8} 0 0 1 ${-LENS.r * .05} ${-LENS.r * .78}`} fill="none" stroke="#ffffff" strokeOpacity=".8" strokeWidth="3" strokeLinecap="round" />
      </g>
      <Surf id="tip" x={66} y={112} w={186} h={50} r={12} tone="ink" elev={2} seed={[250, 137]} at={3.02} />
      <Pop id="tri" at={3.28} origin="0% 50%"><path d="M251.5 130 L258.5 137 L251.5 144 Z" fill="#0f172a" /></Pop>
    </>}>
      <Layer id="t" x={64} y={38} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Overnight heart rate</Text></Layer>
      <Layer id="s" x={64} y={60} w={240} h={20} at={.76}><Text size={12.5} color={SUB}>Jordan Ellis · wearable · Oct 30</Text></Layer>
      <Layer id="rest" x={296} y={40} w={120} h={20} at={.82} align="right"><Text size={12.5} weight={600} color={BODY} className="tnum">Resting 62 bpm</Text></Layer>
      {[60, 90, 120].map((v, i) => <Layer key={v} id={`y${i}`} x={44} y={DY(v) - 8} w={24} h={16} at={.85 + i * .04} align="right"><Text size={10.5} weight={600} color={MUTE} className="tnum">{v}</Text></Layer>)}
      {[['10 PM', 0], ['12 AM', 8], ['2 AM', 16], ['4 AM', 24]].map(([l, i], k) => <Layer key={l} id={`x${k}`} x={DX(i) - (k === 3 ? 60 : k ? 30 : 0)} y={294} w={60} h={18} at={1.0 + k * .04} align={k === 3 ? 'right' : k ? 'center' : 'left'}><Text size={10.5} weight={600} color={MUTE} className="tnum">{l}</Text></Layer>)}
      <Layer id="ti" kind="icon" x={78} y={124} w={26} h={26} at={3.3} align="center"><Icon name="alertTriangle" size={18} color={AMBER} id="warn" /></Layer>
      <Layer id="tt" x={112} y={112} w={136} h={50} at={3.32}><span className="stack"><Text size={13} weight={600} color="#fff" className="tnum">Spike at 2:14 AM</Text><Text size={11.5} color="#cbd5e1">Flagged for nurse review</Text></span></Layer>
    </Frame>
  );
}
DetailZoom.motion = c => {
  const clip = c.q('.lclip'), mag = c.q('.mag'), g1 = c.q('.lensg'), g2 = c.q('.lensg2');
  const Ein = c.ease('back.out(1.5)'), Eout = c.ease('power2.in'), Em = c.ease('power2.inOut');
  c.after(t => {
    const s = Ein(cl((t - 1.82) / .45)) * (1 - Eout(cl((t - 5.56) / .26)));
    const p = Em(cl((t - 2.05) / 1.05));
    const x = lerp(LENS.x0, LENS.x1, p), y = lerp(LENS.y0, LENS.y1, p) - 26 * Math.sin(Math.PI * p);
    clip.setAttribute('cx', f2(x)); clip.setAttribute('cy', f2(y)); clip.setAttribute('r', f2(Math.max(.01, LENS.r * s)));
    mag.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) scale(${LENS.k}) translate(${f2(-x)} ${f2(-y)})`);
    const tr = `translate(${f2(x)} ${f2(y)}) scale(${Math.max(.001, s).toFixed(4)})`;
    g1.setAttribute('transform', tr); g2.setAttribute('transform', tr);
    const op = s > .001 ? '1' : '0'; g1.setAttribute('opacity', op); g2.setAttribute('opacity', op);
  });
  c.fromTo('.tiny', { opacity: 0 }, { opacity: 1, duration: .3 }, 1.6).fromTo('.tiny', { opacity: 1 }, { opacity: 0, duration: .2 }, c.T.collapse);
  c.fromTo('.ticks', { opacity: 0 }, { opacity: 1, duration: .4 }, 1.0).fromTo('.ticks', { opacity: 1 }, { opacity: 0, duration: .2 }, c.T.collapse);
  c.icon('warn', 0, 29, 3.34, .8);
};
Object.assign(DetailZoom, {
  id: 'detail-zoom', title: 'Detail zoom', category: CAT, w: W, h: H, focus: { x: 252, y: 190 }, push: 1.04, orbit: .8, exit: [240, 180],
  summary: 'A loupe glides across a heart rate chart, magnifying a clipped and scaled copy of the content until a tiny overnight spike becomes readable, then a callout names it.',
  usage: `<DetailZoom />`, icons: ['alertTriangle']
});

// ---------------------------------------------------------------- Analytics graph
const AX = i => 64 + i * 32, AY = v => 290 - v * 100;
const D7 = [.30, .42, .37, .50, .45, .57, .51, .60, .55, .66, .62, .70], D30 = [.22, .36, .50, .44, .62, .55, .74, .67, .82, .76, .90, .96];
const aLine = d => smooth(d.map((v, i) => [AX(i), AY(v)]));
const aArea = d => `${aLine(d)} L${AX(11)},290 L${AX(0)},290 Z`;
const TILES = [['Visits', 412, 1846, '+4% vs prior', '+9% vs prior'], ['On time', 94.2, 96.1, '+0.6 pts', '+1.4 pts'], ['Avg length', 52, 48, '−2 min', '−5 min']];
const TX = i => 64 + i * 120;
const XL7 = ['Oct 29', 'Oct 31', 'Nov 2', 'Nov 4'], XL30 = ['Oct 6', 'Oct 16', 'Oct 26', 'Nov 4'];
export function AnalyticsGraph({ uid = 'analytics-graph' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Visit analytics switching from 7 days to 30 days" svg={<>
      <defs><clipPath id={`${uid}-wipe`}><rect className="wipe" x={56} y={150} width={0} height={150} /></clipPath></defs>
      <Surf id="card" x={40} y={22} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="rng" x={334} y={40} w={86} h={30} r={10} tone="muted" elev={0} seed={[377, 55]} order={1} />
      <Surf id="thumb" x={337} y={43} w={40} h={24} r={8} tone="white" elev={1} seed={[357, 55]} order={2} />
      {TILES.map((_, i) => <Surf key={i} id={`m${i}`} x={TX(i)} y={86} w={112} h={70} r={14} tone="muted" elev={0} seed={[TX(i) + 56, 121]} order={2 + i} />)}
      {[0, 1, 2].map(i => <Draw key={i} id={`g${i}`} d={`M64 ${AY(.4 * (i + 1)) + .5} H416`} stroke="#f1f5f9" width={1} at={.9 + i * .05} />)}
      <Draw id="base" d="M64 290.5 H416" stroke="#e2e8f0" width={1} at={.85} />
      <g clipPath={`url(#${uid}-wipe)`}>
        <path className="aarea" d={aArea(D7)} fill={`url(#${uid}-area)`} />
        <path className="aline" d={aLine(D7)} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <Pop id="end" at={1.85}><circle className="ehalo" cx={AX(11)} cy={AY(D7[11])} r={9} fill="rgba(45,125,255,.16)" /><circle className="edot" cx={AX(11)} cy={AY(D7[11])} r={4.5} fill="#fff" stroke={BLUE} strokeWidth="2.5" /></Pop>
    </>}>
      <Layer id="t" x={64} y={40} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Visit analytics</Text></Layer>
      <Layer id="s" x={64} y={62} w={240} h={20} at={.76}><Text size={12.5} color={SUB} className="rsub">Maple House · last 7 days</Text></Layer>
      <Layer id="r7" x={337} y={43} w={40} h={24} at={1.0} align="center"><Text size={12} weight={600} color={INK} className="l7">7D</Text></Layer>
      <Layer id="r30" x={377} y={43} w={40} h={24} at={1.04} align="center"><Text size={12} weight={600} color={SUB} className="l30">30D</Text></Layer>
      {TILES.map(([l, , , d], i) => (
        <React.Fragment key={l}>
          <Layer id={`ml${i}`} x={TX(i) + 13} y={94} w={96} h={16} at={1.0 + i * .05}><Text size={11.5} weight={600} color={SUB}>{l}</Text></Layer>
          <Layer id={`mv${i}`} x={TX(i) + 13} y={110} w={96} h={28} at={1.05 + i * .05}><Text size={21} weight={700} className={`tnum mv${i}`} style={{ letterSpacing: '-.02em' }}>0</Text></Layer>
          <Layer id={`md${i}`} x={TX(i) + 13} y={136} w={96} h={16} at={1.1 + i * .05}><Text size={11.5} weight={600} color={i === 2 ? DEEP : GREEN_D} className={`tnum md${i}`}>{d}</Text></Layer>
        </React.Fragment>
      ))}
      {XL7.map((l, k) => <Layer key={k} id={`x${k}`} x={k === 0 ? 64 : k === 3 ? 336 : 64 + k * 117.3 - 40} y={296} w={80} h={18} at={1.0 + k * .04} align={k === 3 ? 'right' : k ? 'center' : 'left'}><Text size={11} weight={600} color={MUTE} className={`tnum xl${k}`}>{l}</Text></Layer>)}
    </Frame>
  );
}
AnalyticsGraph.motion = c => {
  const wipe = c.q('.wipe'), Ew = c.ease('power2.inOut');
  c.after(t => { const p = Ew(cl((t - 1.0) / .95)) * (1 - Ew(cl((t - 5.56) / .32))); wipe.setAttribute('width', f2(368 * p)); });
  c.cursor([{ at: 1.95, x: 318, y: 120 }, { at: 2.35, x: 404, y: 64, press: true }]);
  c.press('rng', '[data-layer="r30"]', 2.35, .6);
  c.reshape('thumb', rect(377, 43, 40, 24, 8), 2.42, .42, 'back.out(1.4)');
  c.fromTo('.l7', { color: INK }, { color: SUB, duration: .2 }, 2.45).fromTo('.l30', { color: SUB }, { color: INK, duration: .2 }, 2.45);
  const M = 2.48, MD = .85, ME = 'power3.inOut', E = c.ease(ME);
  c.morph('.aline', aLine(D7), aLine(D30), M, MD, ME);
  c.morph('.aarea', aArea(D7), aArea(D30), M, MD, ME);
  const dot = c.q('.edot'), halo = c.q('.ehalo');
  c.after(t => { const y = f2(lerp(AY(D7[11]), AY(D30[11]), E(cl((t - M) / MD)))); dot.setAttribute('cy', y); halo.setAttribute('cy', y); });
  const fmts = [comma, v => `${v.toFixed(1)}%`, v => `${Math.round(v)} min`];
  TILES.forEach(([, a, b], i) => counter(c, `.mv${i}`, [[1.0, .9, 0, a], [M, MD + .1, a, b, ME]], fmts[i]));
  TILES.forEach(([, , , d0, d1], i) => c.swap(`.md${i}`, [d0, d1], [M + .3]));
  XL7.forEach((_, k) => c.swap(`.xl${k}`, [XL7[k], XL30[k]], [M + .2]));
  c.swap('.rsub', ['Maple House · last 7 days', 'Maple House · last 30 days'], [M + .1]);
};
Object.assign(AnalyticsGraph, {
  id: 'analytics-graph', title: 'Analytics graph', category: CAT, w: W, h: H, focus: { x: 248, y: 180 }, push: 1.02, orbit: .7, exit: [240, 180],
  summary: 'Metric cards over an area chart. Switching the range from 7D to 30D slides the thumb, reshapes the curve and area in place and counts every metric to its new value.',
  usage: `<AnalyticsGraph />`, icons: []
});

// ---------------------------------------------------------------- Retention graph
const RX = i => 92 + i * 38, RY = v => 116 + (100 - v) / 80 * 160;
const BAND_HI = [100, 91, 85, 81, 78, 76, 74, 73, 72], BAND_LO = [100, 85, 77, 71, 67, 64, 62, 61, 60];
const COH = [['Jan cohort', GREEN, [100, 94, 89, 86, 84, 83, 82, 81, 80]], ['Apr cohort', BLUE, [100, 89, 81, 76, 72, 70, 68, 67, 66]], ['Jul cohort', AMBER, [100, 86, 64, 58, 55, 53, 52, 51, 50]]];
const rPts = d => d.map((v, i) => [RX(i), RY(v)]);
export function RetentionGraph({ uid = 'retention-graph' }) {
  const hi = smooth(rPts(BAND_HI)), lo = smooth(rPts(BAND_LO).reverse());
  const band = `${hi} L${lo.slice(1)} Z`;
  return (
    <Frame uid={uid} w={W} h={H} label="Cohort retention curves from week 0 to week 8 against a benchmark band" svg={<>
      <defs><clipPath id={`${uid}-wipe`}><rect className="wipe" x={84} y={100} width={0} height={190} /></clipPath></defs>
      <Surf id="card" x={40} y={22} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      {[100, 80, 60, 40, 20].map((v, i) => <Draw key={v} id={`g${i}`} d={`M92 ${RY(v) + .5} H396`} stroke={v === 20 ? '#e2e8f0' : '#f1f5f9'} width={1} at={.85 + i * .05} />)}
      <g clipPath={`url(#${uid}-wipe)`}>
        <path d={band} fill="rgba(45,125,255,.09)" />
        <path d={hi} fill="none" stroke="#bfdbfe" strokeWidth="1.2" />
        <path d={smooth(rPts(BAND_LO))} fill="none" stroke="#bfdbfe" strokeWidth="1.2" />
      </g>
      {COH.map(([, col, d], i) => <path key={i} className={`coh coh${i}`} d={smooth(rPts(d))} fill="none" stroke={col} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />)}
      {COH.map(([, col], i) => <circle key={i} className={`pen pen${i}`} cx={RX(0)} cy={RY(100)} r={4.5} fill="#fff" stroke={col} strokeWidth="2.5" opacity="0" />)}
      <Draw id="lead" d={`M${RX(2)} ${RY(64) + 8} V249 H196`} stroke={MUTE} width={1.2} at={3.12} dur={.35} />
      <Pop id="ring" at={3.06}><circle cx={RX(2)} cy={RY(64)} r={7} fill="rgba(245,158,11,.16)" stroke={AMBER} strokeWidth="1.6" /></Pop>
      <Surf id="tip" x={196} y={224} w={196} h={50} r={12} tone="ink" elev={2} seed={[198, 249]} at={3.24} />
    </>}>
      <Layer id="t" x={64} y={38} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Staff retention by cohort</Text></Layer>
      <Layer id="s" x={64} y={60} w={260} h={20} at={.76}><Text size={12.5} color={SUB}>Share of new hires still active</Text></Layer>
      <Layer id="lg" x={64} y={84} w={360} h={20} at={.9} className="gap12">{COH.map(([l, col]) => <span key={l} className="legend"><i style={{ background: col }} />{l}</span>)}<span className="legend"><i style={{ background: 'rgba(45,125,255,.16)', boxShadow: 'inset 0 0 0 1px #bfdbfe', width: 14, borderRadius: 3 }} />Benchmark</span></Layer>
      {[100, 80, 60, 40, 20].map((v, i) => <Layer key={v} id={`y${i}`} x={46} y={RY(v) - 8} w={38} h={16} at={.9 + i * .04} align="right"><Text size={10.5} weight={600} color={MUTE} className="tnum">{v}%</Text></Layer>)}
      {Array.from({ length: 9 }, (_, i) => <Layer key={i} id={`w${i}`} x={RX(i) - 16} y={284} w={32} h={16} at={1.0 + i * .03} align="center"><Text size={10.5} weight={600} color={i === 2 ? AMBER_D : MUTE} className="tnum">{`W${i}`}</Text></Layer>)}
      <Layer id="xt" x={92} y={304} w={304} h={18} at={1.3} align="center"><Text size={11} color={SUB}>Weeks since hire</Text></Layer>
      {COH.map(([, col, d], i) => <Layer key={i} id={`e${i}`} x={RX(8) + 7} y={RY(d[8]) - 8} w={34} h={16} at={2.85 + i * .2}><Text size={11} weight={700} color={col} className="tnum">{d[8]}%</Text></Layer>)}
      <Layer id="ti" kind="icon" x={206} y={236} w={26} h={26} at={3.42} align="center"><Icon name="trendingDown" size={18} color="#fbbf24" id="down" /></Layer>
      <Layer id="tt" x={238} y={224} w={150} h={50} at={3.44}><span className="stack"><Text size={13} weight={600} color="#fff">Drop-off at week 2</Text><Text size={11.5} color="#cbd5e1" className="tnum">Jul cohort lost 22 pts</Text></span></Layer>
    </Frame>
  );
}
RetentionGraph.motion = c => {
  const wipe = c.q('.wipe'), Ew = c.ease('power2.inOut');
  c.after(t => { const p = Ew(cl((t - 1.1) / .8)) * (1 - Ew(cl((t - 5.56) / .3))); wipe.setAttribute('width', f2(320 * p)); });
  COH.forEach((_, i) => {
    const at = 1.75 + i * .2, dur = 1.0, path = c.q(`.coh${i}`), pen = c.q(`.pen${i}`), L = path.getTotalLength(), E = c.ease('power1.inOut');
    c.draw(`.coh${i}`, '0% 0%', '0% 100%', at, dur, 'power1.inOut');
    c.draw(`.coh${i}`, '0% 100%', '100% 100%', c.T.collapse + .05, .4, 'power2.in');
    c.after(t => {
      const pt = path.getPointAtLength(L * E(cl((t - at) / dur)));
      pen.setAttribute('cx', f2(pt.x)); pen.setAttribute('cy', f2(pt.y));
      pen.setAttribute('opacity', t >= at - .05 && t < c.T.collapse + .05 ? '1' : '0');
    });
  });
  c.icon('down', 0, 39, 3.46, .9);
};
Object.assign(RetentionGraph, {
  id: 'retention-graph', title: 'Retention graph', category: CAT, w: W, h: H, focus: { x: 250, y: 200 }, push: 1.06, orbit: .85, exit: [240, 180],
  summary: 'A benchmark band wipes in, then three cohort curves draw from week 0 to week 8 behind riding markers, and a leader line calls out the week 2 drop-off.',
  usage: `<RetentionGraph />`, icons: ['trendingDown']
});

// ---------------------------------------------------------------- Product silhouette
const CASE = rr(188, 134, 104, 120, 30), SCREEN = rr(196, 142, 88, 104, 23);
const BAND_T = 'M206,138 L211,74 Q240,66 269,74 L274,138 Z', BAND_B = 'M206,250 L211,314 Q240,322 269,314 L274,250 Z';
const CROWN = rr(290, 168, 10, 28, 3.5), BTN = rr(290, 206, 7, 20, 3);
const SPECS = [
  ['Sapphire glass', '1.9 in, always on', 'M200 152 L172 118 H64', 64, 98, 'left'],
  ['Fall detection', 'Alerts staff in 3 s', 'M189 226 L170 250 H64', 64, 230, 'left'],
  ['Haptic crown', 'Press to check in', 'M300 182 L322 150 H416', 316, 130, 'right'],
  ['Soft-touch band', 'Hypoallergenic', 'M268 292 L294 266 H416', 316, 246, 'right']
];
export function ProductSilhouette({ uid = 'product-silhouette' }) {
  const parts = <><path d={BAND_T} /><path d={BAND_B} /><path d={CASE} /><path d={CROWN} /><path d={BTN} /></>;
  return (
    <Frame uid={uid} w={W} h={H} label="A wearable silhouette revealed by a light sweep with spec callouts" svg={<>
      <defs>
        <clipPath id={`${uid}-dev`}>{parts}</clipPath>
        <clipPath id={`${uid}-lit`}><rect className="xglit" x={150} y={50} width={0} height={290} /></clipPath>
        <radialGradient id={`${uid}-spot`}><stop offset="0" stopColor="#2d7dff" stopOpacity=".34" /><stop offset=".55" stopColor="#1d4ed8" stopOpacity=".1" /><stop offset="1" stopColor="#1d4ed8" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f1f5f9" /><stop offset=".35" stopColor="#cbd5e1" /><stop offset=".7" stopColor="#64748b" /><stop offset="1" stopColor="#334155" /></linearGradient>
        <linearGradient id={`${uid}-strap`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#475569" /><stop offset=".45" stopColor="#334155" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
        <linearGradient id={`${uid}-glassf`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1e293b" /><stop offset=".5" stopColor="#0b1220" /><stop offset="1" stopColor="#020617" /></linearGradient>
        <linearGradient id={`${uid}-sweep`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity="0" /><stop offset=".5" stopColor="#ffffff" stopOpacity=".85" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
      </defs>
      <Surf id="card" x={40} y={20} w={400} h={320} r={24} tone="ink" elev={3} seed={[240, 190]} />
      <circle className="xgspot" cx={240} cy={194} r={150} fill={`url(#${uid}-spot)`} opacity="0" />
      <ellipse className="xgspot" cx={240} cy={326} rx={70} ry={6} fill="rgba(2,6,23,.6)" filter={`url(#${uid}-blur-c)`} opacity="0" />
      <g className="xgsil" opacity="0" fill="#1b2638">{parts}</g>
      <g clipPath={`url(#${uid}-lit)`}>
        <path d={BAND_T} fill={`url(#${uid}-strap)`} /><path d={BAND_B} fill={`url(#${uid}-strap)`} />
        <path d={CROWN} fill={`url(#${uid}-metal)`} /><path d={BTN} fill={`url(#${uid}-metal)`} />
        <path d={CASE} fill={`url(#${uid}-metal)`} />
        <path d={SCREEN} fill={`url(#${uid}-glassf)`} />
        <path d="M204 150 L236 150 L206 196 Z" fill="#ffffff" opacity=".06" />
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M222 ${86 + i * 10} H258`} stroke="rgba(255,255,255,.08)" strokeWidth="1.2" strokeLinecap="round" />)}
      </g>
      <Draw id="rim" d={CASE} stroke="#64748b" width={1.2} at={1.0} dur={.8} />
      <Draw id="rimt" d={BAND_T} stroke="#475569" width={1} at={1.1} dur={.7} />
      <Draw id="rimb" d={BAND_B} stroke="#475569" width={1} at={1.1} dur={.7} />
      <g clipPath={`url(#${uid}-dev)`}><rect className="xgsweep" x={0} y={40} width={64} height={300} fill={`url(#${uid}-sweep)`} transform="skewX(-18)" opacity="0" /></g>
      {SPECS.map(([, , d], i) => <Draw key={i} id={`l${i}`} d={d} stroke="#94a3b8" width={1.2} at={2.62 + i * .14} dur={.45} />)}
      {SPECS.map(([, , d], i) => { const m = /M(\d+) (\d+)/.exec(d); return <Pop key={i} id={`p${i}`} at={2.58 + i * .14}><circle cx={+m[1]} cy={+m[2]} r={6} fill="rgba(45,125,255,.25)" /><circle cx={+m[1]} cy={+m[2]} r={3} fill="#fff" /></Pop>; })}
    </>}>
      <Layer id="t" x={64} y={36} w={240} h={22} at={.75}><Text size={15.5} weight={600} color="#fff">Northwind Pulse</Text></Layer>
      <Layer id="s" x={64} y={58} w={240} h={20} at={.8}><Text size={12.5} color={MUTE}>Concept silhouette</Text></Layer>
      <Layer id="tm" x={196} y={170} w={88} h={30} at={2.62} align="center"><Text size={22} weight={600} color="#fff" className="tnum" style={{ letterSpacing: '-.02em' }}>10:42</Text></Layer>
      <Layer id="hr" x={196} y={198} w={88} h={18} at={2.7} align="center"><Text size={11.5} weight={600} color="#7dd3fc" className="tnum">72 bpm</Text></Layer>
      {SPECS.map(([a, b, , x, y, al], i) => (
        <React.Fragment key={a}>
          <Layer id={`a${i}`} x={x} y={y} w={100} h={18} at={2.95 + i * .14} align={al}><Text size={12.5} weight={600} color="#fff">{a}</Text></Layer>
          <Layer id={`b${i}`} x={x} y={y + 24} w={100} h={16} at={3.0 + i * .14} align={al}><Text size={11} color={MUTE}>{b}</Text></Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
ProductSilhouette.motion = c => {
  const C = c.T.collapse;
  c.fromTo('.xgspot', { opacity: 0 }, { opacity: 1, duration: .7 }, .9).fromTo('.xgspot', { opacity: 1 }, { opacity: 0, duration: .3 }, C);
  c.fromTo('.xgsil', { opacity: 0 }, { opacity: 1, duration: .5 }, 1.1).fromTo('.xgsil', { opacity: 1 }, { opacity: 0, duration: .25 }, C + .05);
  const lit = c.q('.xglit'), sw = c.q('.xgsweep'), E = c.ease('power2.inOut'), Eo = c.ease('power2.in');
  c.after(t => {
    const p = E(cl((t - 1.8) / .85)), x = lerp(120, 380, p);
    sw.setAttribute('x', f2(x - 32 + 0.325 * 190)); sw.setAttribute('opacity', p > 0 && p < 1 ? '1' : '0');
    const off = Eo(cl((t - C) / .3));
    lit.setAttribute('width', f2(Math.max(0, (x - 150) * (1 - off))));
  });
};
Object.assign(ProductSilhouette, {
  id: 'product-silhouette', title: 'Product silhouette', category: CAT, w: W, h: H, focus: { x: 240, y: 190 }, push: 1.08, exit: [240, 190],
  summary: 'A dark wearable silhouette is lit by a light band sweeping across its clipped shape, the screen wakes and four spec callouts draw out to the edges.',
  usage: `<ProductSilhouette />`, icons: []
});

// ---------------------------------------------------------------- Spec cards
const SC = [['Battery', 'Typical use', 'zap', 120, 'h', 0, '+24 h vs Gen 1'], ['Weight', 'With band', 'package', 38, 'g', 0, '12 g lighter'], ['Chip', 'Dual core', 'cpu', 2.4, 'GHz', 1, '2x faster sensing'], ['Display', 'Always-on OLED', 'watch', 410, 'ppi', 0, 'Readable in sun']];
const SCX = i => (i % 2 ? 248 : 52), SCY = i => (i < 2 ? 88 : 214), FLIP = i => 1.8 + i * .2;
export function SpecCards({ uid = 'spec-cards' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Four spec cards flip in with counting values" svg={<>
      {SC.map((_, i) => <Surf key={i} id={`c${i}`} x={SCX(i)} y={SCY(i)} w={180} h={114} r={18} tone="white" elev={2} seed={[SCX(i) + 90, SCY(i) + 57]} at={.4 + i * .1} />)}
      {SC.map((_, i) => <Surf key={i} id={`b${i}`} x={SCX(i) + 16} y={SCY(i) + 16} w={36} h={36} r={11} tone="tint" elev={0} seed={[SCX(i) + 34, SCY(i) + 34]} at={.85 + i * .1} />)}
    </>}>
      <Layer id="t" x={54} y={30} w={240} h={24} at={.7}><Text size={17} weight={600}>Northwind Pulse</Text></Layer>
      <Layer id="s" x={54} y={54} w={240} h={20} at={.76}><Text size={12.5} color={SUB}>Technical specifications</Text></Layer>
      <Layer id="g" x={300} y={42} w={128} h={20} at={.82} align="right"><Text size={12.5} weight={600} color={BODY}>Gen 2 · 2026</Text></Layer>
      {SC.map(([l, sub, ic, , unit, , foot], i) => (
        <React.Fragment key={l}>
          <Layer id={`i${i}`} kind="icon" x={SCX(i) + 16} y={SCY(i) + 16} w={36} h={36} at={1.0 + i * .1} align="center"><Icon name={ic} size={20} color={DEEP} id={`ic${i}`} /></Layer>
          <Layer id={`l${i}`} x={SCX(i) + 62} y={SCY(i) + 15} w={110} h={38} at={FLIP(i)} className="xgflip"><span className="stack"><Text size={13} weight={600}>{l}</Text><Text size={11.5} color={SUB}>{sub}</Text></span></Layer>
          <Layer id={`v${i}`} x={SCX(i) + 16} y={SCY(i) + 58} w={156} h={34} at={FLIP(i) + .05} className="xgflip"><span className="baseline"><Text size={28} weight={700} className={`tnum xgv${i}`} style={{ letterSpacing: '-.03em' }}>0</Text><Text size={13} weight={600} color={SUB}>{unit}</Text></span></Layer>
          <Layer id={`f${i}`} x={SCX(i) + 16} y={SCY(i) + 90} w={156} h={16} at={FLIP(i) + .1} className="xgflip"><Text size={11.5} weight={600} color={GREEN_D}>{foot}</Text></Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
SpecCards.motion = c => {
  SC.forEach(([, , , v, , dec], i) => {
    const at = FLIP(i);
    ['l', 'v', 'f'].forEach((k, j) => c.fromTo(`[data-layer="${k}${i}"] .fc-carrier`, { rotationX: -92, transformPerspective: 420, transformOrigin: '50% 0%' }, { rotationX: 0, duration: .7, ease: 'back.out(1.5)' }, at + j * .05));
    c.press(`c${i}`, null, at + .32, .35);
    counter(c, `.xgv${i}`, [[at + .05, 1.1, 0, v, 'power3.out']], x => x.toFixed(dec));
    c.icon(`ic${i}`, 0, 39, at - .05, .9);
  });
};
Object.assign(SpecCards, {
  id: 'spec-cards', title: 'Spec cards', category: CAT, w: W, h: H, focus: { x: 240, y: 200 }, push: 1.06, exit: [240, 200],
  summary: 'Four spec cards form in a grid. Each card flips its labels in on their carriers while the value counts up in tabular figures.',
  usage: `<SpecCards />`, icons: ['zap', 'package', 'cpu', 'watch']
});

// ---------------------------------------------------------------- Player chrome (shared by footage)
const VIEW = rect(56, 36, 368, 232, 14);
function playerSvg(uid, scene, opts = {}) {
  return <>
    <defs><clipPath id={`${uid}-view`}><rect className="xgiris" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} rx={VIEW.r} /></clipPath></defs>
    <Surf id="card" x={40} y={20} w={400} h={320} r={22} tone="white" elev={3} seed={[240, 180]} />
    <Surf id="view" x={VIEW.x} y={VIEW.y} w={VIEW.w} h={VIEW.h} r={VIEW.r} tone="ink" elev={0} seed={[240, 152]} order={1} />
    <g clipPath={`url(#${uid}-view)`}>{scene}</g>
    <Surf id="tag" x={68} y={48} w={86} h={22} r={11} tone="glass" elev={0} seed={[80, 59]} at={1.15} />
    {opts.bar !== false && <>
      <Surf id="play" x={58} y={284} w={36} h={36} r={18} tone="muted" elev={0} seed={[76, 302]} order={2} />
      <Surf id="trk" x={106} y={300} w={218} h={4} r={2} tone="track" elev={0} seed={[110, 302]} order={3} />
      <path className="xgprog" d="M108 302 H108" stroke={BLUE} strokeWidth="4" strokeLinecap="round" opacity="0" />
      <circle className="xghead" cx={108} cy={302} r={6} fill="#fff" stroke="#cbd5e1" strokeWidth="1" opacity="0" />
    </>}
  </>;
}
function playerLayers(right, tc) {
  return <>
    <Layer id="tg" x={68} y={48} w={86} h={22} at={1.3} align="center"><Text size={11.5} weight={600} color={INK}>Illustrative</Text></Layer>
    {right && <Layer id="cam" x={250} y={48} w={162} h={22} at={1.35} align="right"><Text size={11.5} weight={600} color="rgba(255,255,255,.72)" className="tnum">{right}</Text></Layer>}
    {tc && <Layer id="pp" kind="icon" x={58} y={284} w={36} h={36} at={1.1} align="center"><Icon name="playPause" size={18} color={INK} id="pp" /></Layer>}
    {tc && <Layer id="tc" x={330} y={284} w={92} h={36} at={1.15} align="right"><Text size={13} weight={600} color={INK} className="tnum xgtc">{tc}</Text></Layer>}
  </>;
}
// Progress bar + playhead from a fraction function (pure in t).
function progress(c, frac) {
  const pr = c.q('.xgprog'), hd = c.q('.xghead');
  c.after(t => {
    const x = 108 + 214 * cl(frac(t)), on = t > 1.3 && t < c.T.collapse ? '1' : '0';
    pr.setAttribute('d', `M108 302 H${f2(x)}`); hd.setAttribute('cx', f2(x)); pr.setAttribute('opacity', on); hd.setAttribute('opacity', on);
  });
}
const tcFmt = s => { const m = Math.floor(s / 60), ss = Math.floor(s % 60), ff = Math.floor((s % 1) * 30 + 1e-6); return `00:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(ff).padStart(2, '0')}`; };

// ---------------------------------------------------------------- Robot footage
const SH = [220, 188], L1 = 72, L2 = 64, deg = r => r * 180 / Math.PI;
function ik(x, y) {
  const dx = x - SH[0], dy = y - SH[1], d = Math.min(Math.hypot(dx, dy), L1 + L2 - .01);
  const c2 = cl((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1); let best = null;
  for (const sg of [1, -1]) { const a2 = sg * Math.acos(c2), a1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2)), ey = SH[1] + L1 * Math.sin(a1); if (!best || ey < best.ey) best = { a1: deg(a1), a2: deg(a2), ey }; }
  return [best.a1, best.a2];
}
const RK = (() => {
  const R = [262, 112], AL = [120, 128], G = [120, 156], LI = [120, 116], AR = [315, 116], P = [315, 156], RT = [315, 126];
  const keys = [[0, R], [1.9, R], [2.38, AL], [2.6, G], [2.8, G], [3.02, LI], [3.44, AR], [3.64, P], [3.84, P], [4.02, RT]];
  let prev = null;
  return keys.map(([t, p]) => { let [a1, a2] = ik(p[0], p[1]); if (prev) { while (a1 - prev[0] > 180) a1 -= 360; while (a1 - prev[0] < -180) a1 += 360; } prev = [a1, a2]; return [t, a1, a2]; });
})();
function robotPose(t, E) {
  let k = RK.length - 1;
  for (let i = 0; i < RK.length - 1; i++) if (t < RK[i + 1][0]) { k = i; break; }
  if (k === RK.length - 1) return [RK[k][1], RK[k][2]];
  const [t0, a, b] = RK[k], [t1, c2, d] = RK[k + 1], p = E(cl((t - t0) / (t1 - t0)));
  return [lerp(a, c2, p), lerp(b, d, p)];
}
function Table({ x, w }) {
  return <g><rect x={x + 8} y={204} width={6} height={22} fill="#1e293b" /><rect x={x + w - 14} y={204} width={6} height={22} fill="#1e293b" />
    <rect x={x} y={196} width={w} height={9} rx={2} fill="#64748b" /><rect x={x} y={196} width={w} height={2.5} rx={1.2} fill="#94a3b8" /></g>;
}
export function RobotFootage({ uid = 'robot-footage' }) {
  const scene = <>
    <rect x={56} y={36} width={368} height={232} fill={`url(#${uid}-wall)`} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${80 + i * 46} 36 V214`} stroke="rgba(255,255,255,.035)" strokeWidth="1.5" />)}
    <rect x={56} y={214} width={368} height={56} fill={`url(#${uid}-floor)`} />
    {[-3, -2, -1, 0, 1, 2, 3].map(i => <path key={i} d={`M${240 + i * 60} 214 L${240 + i * 120} 270`} stroke="rgba(255,255,255,.05)" strokeWidth="1" />)}
    <path d="M56 214.5 H424" stroke="rgba(255,255,255,.12)" />
    <path d="M60 258 H420" stroke="#f59e0b" strokeOpacity=".45" strokeWidth="3" strokeDasharray="12 9" />
    <Table x={72} w={98} /><Table x={268} w={96} />
    {[84, 100, 116, 132, 148].map(x => <circle key={x} cx={x} cy={200.5} r={2.2} fill="#475569" />)}
    <ellipse className="xgbsh" cx={120} cy={197} rx={20} ry={3} fill="rgba(2,6,23,.55)" filter={`url(#${uid}-blur-c)`} />
    <ellipse cx={220} cy={227} rx={34} ry={6} fill="rgba(2,6,23,.6)" filter={`url(#${uid}-blur-c)`} />
    <path d={rr(202, 196, 36, 31, 6)} fill={`url(#${uid}-ped)`} />
    <path d={rr(196, 190, 48, 10, 5)} fill="#475569" />
    <g className="xgbox"><path d={rr(-17, 0, 34, 28, 3)} fill={`url(#${uid}-crate)`} /><rect x={-3} y={0} width={6} height={28} fill="#f3d9b1" opacity=".55" /><rect x={-13} y={15} width={10} height={7} rx={1} fill="#fff" opacity=".85" /></g>
    <g className="xgj1">
      <path d={rr(-11, -11, L1 + 22, 22, 11)} fill={`url(#${uid}-link)`} />
      <path d={rr(12, -2.5, L1 - 24, 5, 2.5)} fill={BLUE} />
      <g className="xgj2">
        <path d={rr(-9, -9, L2 + 18, 18, 9)} fill={`url(#${uid}-link)`} />
        <g className="xgj3">
          <path d={rr(2, -30, 9, 60, 3)} fill="#334155" />
          <path className="xgf1" d={rr(10, -3, 16, 6, 2)} fill="#94a3b8" />
          <path className="xgf2" d={rr(10, -3, 16, 6, 2)} fill="#94a3b8" />
          <circle r={8} fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        </g>
        <circle r={11} fill="#1e293b" stroke="#64748b" strokeWidth="1.5" /><circle r={4} fill={BLUE} />
      </g>
      <circle r={13} fill="#1e293b" stroke="#64748b" strokeWidth="1.5" /><circle r={5} fill="#94a3b8" />
    </g>
  </>;
  return (
    <Frame uid={uid} w={W} h={H} label="Illustrative footage of a robot arm picking up a box and placing it" svg={<>
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e293b" /><stop offset="1" stopColor="#111a2e" /></linearGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#334155" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
        <linearGradient id={`${uid}-link`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8fafc" /><stop offset=".55" stopColor="#cbd5e1" /><stop offset="1" stopColor="#94a3b8" /></linearGradient>
        <linearGradient id={`${uid}-ped`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#64748b" /><stop offset=".4" stopColor="#94a3b8" /><stop offset="1" stopColor="#334155" /></linearGradient>
        <linearGradient id={`${uid}-crate`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e0b07a" /><stop offset="1" stopColor="#b9834f" /></linearGradient>
      </defs>
      {playerSvg(uid, scene)}
    </>}>
      {playerLayers('CAM 2 · Packing cell B', '00:00:14:00')}
    </Frame>
  );
}
RobotFootage.motion = c => {
  iris(c, '.xgiris', VIEW, .95);
  const j1 = c.q('.xgj1'), j2 = c.q('.xgj2'), j3 = c.q('.xgj3'), f1 = c.q('.xgf1'), f2e = c.q('.xgf2'), box = c.q('.xgbox'), bsh = c.q('.xgbsh'), tc = c.q('.xgtc');
  const E = c.ease('power2.inOut'), PLAY = 1.88, STOP = 4.02;
  c.after(t => {
    const [a1, a2] = robotPose(t, E), a3 = 90 - a1 - a2;
    j1.setAttribute('transform', `translate(${SH[0]} ${SH[1]}) rotate(${a1.toFixed(3)})`);
    j2.setAttribute('transform', `translate(${L1} 0) rotate(${a2.toFixed(3)})`);
    j3.setAttribute('transform', `translate(${L2} 0) rotate(${a3.toFixed(3)})`);
    const g = t < 2.62 ? 0 : t < 3.66 ? E(cl((t - 2.62) / .14)) : 1 - E(cl((t - 3.66) / .12)), sp = lerp(26, 20, g);
    f1.setAttribute('transform', `translate(0 ${f2(-sp)})`); f2e.setAttribute('transform', `translate(0 ${f2(sp)})`);
    const r1 = a1 * Math.PI / 180, r12 = (a1 + a2) * Math.PI / 180;
    const wx = SH[0] + L1 * Math.cos(r1) + L2 * Math.cos(r12), wy = SH[1] + L1 * Math.sin(r1) + L2 * Math.sin(r12);
    const [bx, by] = t < 2.8 ? [120, 168] : t < 3.76 ? [wx, wy + 12] : [315, 168];
    box.setAttribute('transform', `translate(${f2(bx)} ${f2(by)})`);
    const surf = bx < 174 || bx > 264 ? 196 : 226, hgt = surf - (by + 28);
    bsh.setAttribute('cx', f2(bx)); bsh.setAttribute('cy', f2(surf + 1)); bsh.setAttribute('opacity', f2(cl(1 - hgt / 70) * (hgt > 40 && surf === 226 ? .5 : 1)));
    const s = 14 + cl(t - PLAY, 0, STOP - PLAY);
    const txt = tcFmt(s); if (tc.textContent !== txt) tc.textContent = txt;
  });
  progress(c, t => (14 + cl(t - PLAY, 0, STOP - PLAY)) / 26);
  c.rest('pp', 7);
  c.cursor([{ at: 1.8, x: 80, y: 306, press: true }]);
  c.press('play', '[data-layer="pp"]', 1.8, .8);
  c.icon('pp', 7, 0, 1.84, .14);
  c.icon('pp', 0, 7, STOP, .14);
};
Object.assign(RobotFootage, {
  id: 'robot-footage', title: 'Robot footage', category: CAT, w: W, h: H, focus: { x: 236, y: 170 }, push: 1.04, orbit: .85, exit: [240, 180],
  summary: 'An illustrative player: a jointed robot arm rotates about real pivots to pick a crate off a conveyor and set it on a table while the timecode runs, then playback pauses.',
  usage: `<RobotFootage />`, icons: ['playPause']
});

// ---------------------------------------------------------------- Slow motion
// Scene time s(t): 1x from 1.0, eases to 0.25x after the speed change, eases to a stop at 3.9.
function sceneTime(t) {
  if (t < 1.0) return 0;
  if (t < 2.12) return t - 1.0;
  const s1 = 1.12;
  if (t < 2.42) { const u = t - 2.12; return s1 + u - .75 * u * u / (2 * .3); }
  const s2 = s1 + .3 - .75 * .3 / 2;
  if (t < 3.7) return s2 + .25 * (t - 2.42);
  const s3 = s2 + .25 * 1.28, u = Math.min(t, 3.9) - 3.7;
  return s3 + .25 * u - .25 * u * u / (2 * .2);
}
const SI = 1.4, TC = .08, FLOOR = 236, BR = 15;
function ball(s) {
  const dt = s - SI;
  if (dt < 0) return { x: 260 + 190 * dt, y: FLOOR - BR + 260 * dt + 150 * dt * dt, sx: 1, sy: 1 };
  if (dt < TC) { const k = Math.sin(Math.PI * dt / TC), sy = 1 - .4 * k; return { x: 260 + 40 * dt, y: FLOOR - BR * sy, sx: 1 + .3 * k, sy }; }
  const u = dt - TC; return { x: 260 + 40 * TC + 160 * u, y: FLOOR - BR - 300 * u + 150 * u * u, sx: 1, sy: 1 };
}
const DUST = (() => { const r = mulberry32(42); return Array.from({ length: 7 }, (_, i) => [(i - 3) * 38 + (r() - .5) * 20, -60 - r() * 70, 1.4 + r() * 1.6]); })();
function BallArt({ uid, cls, op }) {
  return <g className={cls} opacity={op}>
    <circle r={BR} fill={`url(#${uid}-ball)`} />
    <path d={`M${-BR + 3} -4 C-4 -10 4 10 ${BR - 3} 4`} fill="none" stroke="#fff7d6" strokeWidth="1.6" strokeOpacity=".75" />
    <ellipse cx={-5} cy={-6} rx={5} ry={3} fill="#fff" opacity=".45" transform="rotate(-30 -5 -6)" />
  </g>;
}
export function SlowMotion({ uid = 'slow-motion' }) {
  const scene = <>
    <rect x={56} y={36} width={368} height={232} fill={`url(#${uid}-wall)`} />
    {Array.from({ length: 17 }, (_, i) => <path key={i} d={`M${72 + i * 21} 92 V${i % 4 ? 100 : 106}`} stroke="rgba(255,255,255,.22)" strokeWidth="1.2" />)}
    <path d="M72 92.5 H408" stroke="rgba(255,255,255,.22)" />
    <rect x={56} y={FLOOR} width={368} height={36} fill={`url(#${uid}-floor)`} />
    <path d={`M56 ${FLOOR + .5} H424`} stroke="rgba(255,255,255,.2)" />
    <path d={`M120 ${FLOOR + 20} H400`} stroke="rgba(255,255,255,.18)" strokeWidth="2" />
    <ellipse className="xgring" cx={262} cy={FLOOR} rx={15} ry={3} fill="none" stroke="#fde68a" strokeWidth="1.5" opacity="0" />
    {DUST.map((_, i) => <circle key={i} className={`xgd xgd${i}`} r={1.8} fill="#e2e8f0" opacity="0" />)}
    <ellipse className="xgsh" cx={260} cy={FLOOR + 1} rx={14} ry={3} fill="rgba(2,6,23,.6)" filter={`url(#${uid}-blur-c)`} />
    {[5, 4, 3, 2, 1].map(k => <BallArt key={k} uid={uid} cls={`xgghost xgg${k}`} op="0" />)}
    <BallArt uid={uid} cls="xgball" op="1" />
  </>;
  return (
    <Frame uid={uid} w={W} h={H} label="Illustrative slow motion of a ball impact at quarter speed" svg={<>
      <defs>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e293b" /><stop offset="1" stopColor="#0f172a" /></linearGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#334155" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
        <radialGradient id={`${uid}-ball`} cx=".35" cy=".32" r=".75"><stop offset="0" stopColor="#fde68a" /><stop offset=".55" stopColor="#f59e0b" /><stop offset="1" stopColor="#b45309" /></radialGradient>
      </defs>
      {playerSvg(uid, scene)}
      <Surf id="spd" x={370} y={48} w={42} h={22} r={11} tone="glass" elev={0} seed={[391, 59]} at={1.2} />
    </>}>
      {playerLayers(null, '00:00:02:00')}
      <Layer id="fps" x={250} y={48} w={76} h={22} at={1.4} align="right"><Text size={11.5} weight={600} color="rgba(255,255,255,.72)" className="tnum">240 fps</Text></Layer>
      <Layer id="x1" x={370} y={48} w={42} h={22} at={1.35} align="center"><Text size={11.5} weight={700} color={INK} className="tnum">1x</Text></Layer>
      <Layer id="x4" x={334} y={48} w={78} h={22} at={2.3} align="center" className="gap6"><Icon name="clock" size={13} color={AMBER_D} id="clk" /><Text size={11.5} weight={700} color={AMBER_D} className="tnum">0.25x</Text></Layer>
    </Frame>
  );
}
SlowMotion.motion = c => {
  iris(c, '.xgiris', VIEW, .95);
  const b = c.q('.xgball'), sh = c.q('.xgsh'), ring = c.q('.xgring'), tc = c.q('.xgtc');
  const gh = [1, 2, 3, 4, 5].map(k => c.q(`.xgg${k}`)), dust = DUST.map((_, i) => c.q(`.xgd${i}`));
  const place = (el, o) => el.setAttribute('transform', `translate(${f2(o.x)} ${f2(o.y)}) scale(${o.sx.toFixed(4)} ${o.sy.toFixed(4)})`);
  c.after(t => {
    const s = sceneTime(t), o = ball(s);
    place(b, o);
    const h = FLOOR - (o.y + BR * o.sy);
    sh.setAttribute('cx', f2(o.x)); sh.setAttribute('rx', f2(14 * (1 - cl(h / 260)) + 2)); sh.setAttribute('opacity', f2(cl(1 - h / 200)));
    const trail = cl((t - 2.18) / .3) * (t < c.T.collapse ? 1 : 0);
    gh.forEach((el, i) => { const k = i + 1, q = ball(s - k * .06); place(el, q); el.setAttribute('opacity', f2(trail * (.4 - k * .065))); });
    const dt = s - SI, pr = cl(dt / .45);
    ring.setAttribute('rx', f2(15 + 70 * pr)); ring.setAttribute('ry', f2(3 + 7 * pr)); ring.setAttribute('opacity', dt > 0 && t < c.T.collapse ? f2(.8 * (1 - pr)) : '0');
    dust.forEach((el, i) => { const [vx, vy, rr2] = DUST[i], u = Math.max(0, dt - .02); el.setAttribute('cx', f2(262 + vx * u)); el.setAttribute('cy', f2(FLOOR - 2 + vy * u + 260 * u * u)); el.setAttribute('r', f2(rr2)); el.setAttribute('opacity', dt > .02 && t < c.T.collapse ? f2(.85 * (1 - cl(u / .3))) : '0'); });
    const txt = tcFmt(2 + s); if (tc.textContent !== txt) tc.textContent = txt;
  });
  progress(c, t => (2 + sceneTime(t)) / 6);
  c.cursor([{ at: 1.7, x: 320, y: 140 }, { at: 2.1, x: 398, y: 66, press: true }]);
  c.press('spd', '[data-layer="x1"]', 2.1, .7);
  c.hide('x1', 2.18, .16);
  c.reshape('spd', rect(334, 48, 78, 22, 11), 2.2, .42, 'back.out(1.5)');
  c.fromTo('[data-surf="spd"] .body', { fill: '#ffffff' }, { fill: '#fef3c7', duration: .3 }, 2.22);
  c.icon('clk', 0, 39, 2.34, 1.4);
  c.icon('pp', 0, 7, 3.86, .14);
};
Object.assign(SlowMotion, {
  id: 'slow-motion', title: 'Slow motion', category: CAT, w: W, h: H, focus: { x: 252, y: 160 }, push: 1.03, orbit: .8, exit: [240, 180],
  summary: 'An illustrative ball impact. Switching to 0.25x slows the scene clock and timecode, motion trails appear, and the ball squashes on the floor before playback pauses mid-rebound.',
  usage: `<SlowMotion />`, icons: ['playPause', 'clock']
});

// ---------------------------------------------------------------- Simulation footage
const SV = rect(54, 32, 372, 214, 14), HZ = -26, PK = 276;
const proj = (u, v) => { const z = 1 + 1.6 * v; return [240 + (u - .5) * 520 / z, HZ + PK / z, z]; };
function catmull(pts, n = 16) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  out.push(pts[pts.length - 1]); return out;
}
const AGENTS = [[BLUE, [[.16, .08], [.24, .34], [.17, .62], [.22, .92]]], [CYAN, [[.44, .06], [.31, .3], [.35, .64], [.43, .93]]], [GREEN, [[.64, .06], [.67, .32], [.63, .62], [.63, .92]]], [AMBER, [[.84, .1], [.8, .4], [.87, .66], [.83, .94]]]];
const APATH = AGENTS.map(([, pts]) => catmull(pts).map(([u, v]) => proj(u, v)));
const apD = i => 'M' + APATH[i].map(p => `${f2(p[0])},${f2(p[1])}`).join(' L');
const SSTAT = [['Episodes', 1284, 1412, comma, '+128 this run'], ['Mean reward', .62, .91, v => v.toFixed(2), '+0.29'], ['Success rate', 74, 92, v => `${Math.round(v)}%`, '+18 pts']];
export function SimulationFootage({ uid = 'simulation-footage' }) {
  const vLines = Array.from({ length: 11 }, (_, i) => { const a = proj(-.6, i / 10), b = proj(1.6, i / 10); return `M${f2(a[0])} ${f2(a[1])} H${f2(b[0])}`; });
  const uLines = Array.from({ length: 23 }, (_, i) => { const u = -.6 + i * .1, a = proj(u, 0), b = proj(u, 1); return `M${f2(a[0])} ${f2(a[1])} L${f2(b[0])} ${f2(b[1])}`; });
  const quad = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => proj(u, v)).map(p => `${f2(p[0])},${f2(p[1])}`).join(' ');
  const scene = <>
    <rect x={SV.x} y={SV.y} width={SV.w} height={SV.h} fill={`url(#${uid}-sky)`} />
    <polygon points={quad(-.6, 1.6, 0, 1)} fill={`url(#${uid}-ground)`} />
    {uLines.map((d, i) => <path key={i} d={d} stroke="rgba(148,163,184,.16)" strokeWidth="1" />)}
    {vLines.map((d, i) => <path key={i} d={d} stroke={i === 10 ? 'rgba(125,211,252,.45)' : 'rgba(148,163,184,.16)'} strokeWidth="1" />)}
    <polygon points={quad(.44, .58, .36, .54)} fill="rgba(239,68,68,.16)" stroke="rgba(248,113,113,.5)" strokeWidth="1" />
    <polygon points={quad(-.02, .08, .5, .7)} fill="rgba(239,68,68,.16)" stroke="rgba(248,113,113,.5)" strokeWidth="1" />
    {AGENTS.map(([col], i) => <path key={i} className={`xgplan xgplan${i}`} d={apD(i)} fill="none" stroke={col} strokeOpacity=".28" strokeWidth="1.5" strokeLinecap="round" />)}
    {AGENTS.map(([col], i) => <path key={i} className={`xgtrail xgtr${i}`} d={apD(i)} fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />)}
    {AGENTS.map(([col], i) => { const e = APATH[i][APATH[i].length - 1], r = 3 + 7 / e[2]; return <ellipse key={i} className={`xggoal xggoal${i}`} cx={e[0]} cy={e[1]} rx={r * 1.9} ry={r * .9} fill={col} fillOpacity="0" stroke={col} strokeWidth="1.3" opacity="0" />; })}
    {AGENTS.map(([col], i) => <g key={i} className={`xgag xgag${i}`} opacity="0"><ellipse className="xgash" rx={8} ry={2.5} fill="rgba(2,6,23,.6)" /><circle className="xgab" r={6} fill={col} stroke="#fff" strokeWidth="1.5" /></g>)}
  </>;
  return (
    <Frame uid={uid} w={W} h={H} label="Illustrative simulation of agents crossing a perspective grid with training stats" svg={<>
      <defs>
        <clipPath id={`${uid}-view`}><rect className="xgiris" x={SV.x} y={SV.y} width={SV.w} height={SV.h} rx={SV.r} /></clipPath>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#020617" /><stop offset=".3" stopColor="#0f172a" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
        <linearGradient id={`${uid}-ground`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#1e293b" /><stop offset="1" stopColor="#0b1324" /></linearGradient>
      </defs>
      <Surf id="card" x={40} y={18} w={400} h={322} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="view" x={SV.x} y={SV.y} w={SV.w} h={SV.h} r={SV.r} tone="ink" elev={0} seed={[240, 139]} order={1} />
      <g clipPath={`url(#${uid}-view)`}>{scene}</g>
      <Surf id="tag" x={66} y={44} w={86} h={22} r={11} tone="glass" elev={0} seed={[78, 55]} at={1.15} />
      {SSTAT.map((_, i) => <Surf key={i} id={`st${i}`} x={54 + i * 126} y={256} w={120} h={70} r={14} tone="muted" elev={0} seed={[114 + i * 126, 291]} order={2 + i} />)}
    </>}>
      <Layer id="tg" x={66} y={44} w={86} h={22} at={1.3} align="center"><Text size={11.5} weight={600} color={INK}>Illustrative</Text></Layer>
      <Layer id="st" x={250} y={44} w={164} h={22} at={1.35} align="right" className="gap6"><span className="live-dot xglive" /><Text size={11.5} weight={600} color="rgba(255,255,255,.78)" className="tnum xgstep">Step 48,120</Text></Layer>
      {SSTAT.map(([l, a, , fmt, d], i) => (
        <React.Fragment key={l}>
          <Layer id={`sl${i}`} x={68 + i * 126} y={264} w={100} h={16} at={1.0 + i * .05}><Text size={11.5} weight={600} color={SUB}>{l}</Text></Layer>
          <Layer id={`sv${i}`} x={68 + i * 126} y={280} w={100} h={26} at={1.05 + i * .05}><Text size={19} weight={700} className={`tnum xgsv${i}`} style={{ letterSpacing: '-.02em' }}>{fmt(a)}</Text></Layer>
          <Layer id={`sd${i}`} x={68 + i * 126} y={305} w={100} h={16} at={3.85 + i * .06}><Text size={11.5} weight={600} color={GREEN_D} className="tnum">{d}</Text></Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
SimulationFootage.motion = c => {
  iris(c, '.xgiris', SV, .95);
  c.fromTo('.xgplan', { opacity: 0 }, { opacity: 1, duration: .5 }, 1.4).fromTo('.xgplan', { opacity: 1 }, { opacity: 0, duration: .2 }, c.T.collapse);
  c.fromTo('.xggoal', { opacity: 0 }, { opacity: 1, duration: .4 }, 1.5).fromTo('.xggoal', { opacity: 1 }, { opacity: 0, duration: .2 }, c.T.collapse);
  const E = c.ease('power1.inOut');
  AGENTS.forEach((_, i) => {
    const at = 1.8 + i * .1, dur = 1.85 - i * .08, path = c.q(`.xgtr${i}`), L = path.getTotalLength(), g = c.q(`.xgag${i}`), goal = c.q(`.xggoal${i}`);
    c.draw(`.xgtr${i}`, '0% 0%', '0% 100%', at, dur, 'power1.inOut');
    c.draw(`.xgtr${i}`, '0% 100%', '100% 100%', c.T.collapse, .3, 'power2.in');
    const sh = g.querySelector('.xgash'), bd = g.querySelector('.xgab');
    c.after(t => {
      const p = E(cl((t - at) / dur)), pt = path.getPointAtLength(L * p), z = PK / Math.max(1, pt.y - HZ), r = 3 + 7 / z;
      g.setAttribute('transform', `translate(${f2(pt.x)} ${f2(pt.y)})`);
      bd.setAttribute('r', f2(r)); bd.setAttribute('cy', f2(-r)); sh.setAttribute('rx', f2(r * 1.3)); sh.setAttribute('ry', f2(r * .4));
      g.setAttribute('opacity', t > 1.55 && t < c.T.collapse + .1 ? f2(cl((t - 1.55) / .25)) : '0');
      goal.setAttribute('fill-opacity', p >= 1 ? '.35' : '0');
    });
  });
  SSTAT.forEach(([, a, b, fmt], i) => counter(c, `.xgsv${i}`, [[1.8, 2.0, a, b, 'power1.inOut']], fmt));
  counter(c, '.xgstep', [[1.8, 2.0, 48120, 52480, 'power1.inOut']], v => `Step ${comma(v)}`);
  const live = c.q('.xglive');
  c.after(t => { live.style.background = t >= 3.8 ? '#94a3b8' : '#16a34a'; live.style.boxShadow = t >= 3.8 ? '0 0 0 3px rgba(148,163,184,.2)' : '0 0 0 3px rgba(22,163,74,.22)'; });
};
Object.assign(SimulationFootage, {
  id: 'simulation-footage', title: 'Simulation footage', category: CAT, w: W, h: H, focus: { x: 240, y: 170 }, push: 1.05, exit: [240, 180],
  summary: 'An illustrative simulation: deterministic agents trace planned paths across a perspective grid floor to their goals while episodes, reward and success rate count up.',
  usage: `<SimulationFootage />`, icons: []
});

export const LIST_G = [SettingsScreen, ToggleCloseup, DetailZoom, AnalyticsGraph, RetentionGraph, ProductSilhouette, SpecCards, RobotFootage, SlowMotion, SimulationFootage];
