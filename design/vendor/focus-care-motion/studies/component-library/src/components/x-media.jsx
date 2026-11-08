// Explainer set: media and audio. See EXPLAINER-BRIEF.md.
// Same rules as the core library: SVG surfaces form from seeds, HTML carriers hold Inter
// labels and native useAnimations icons, and every motion is a pure function of absolute time.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', MUTE = '#94a3b8', BLUE = '#2d7dff';
const CAT = 'Media & audio';
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
// Bars retract outside-in so they never trail past a collapsing card.
const outIn = (i, n, span = .12) => span * (1 - Math.abs(i - (n - 1) / 2) / ((n - 1) / 2));
// Seeded PRNG (mulberry32) so every waveform is identical on every render.
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Deterministic speech-like envelope: syllable bumps from sines, texture from the seeded PRNG.
function wave(n, seed, k = 1) {
  const r = mulberry32(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = i / (n - 1);
    const word = Math.pow(Math.abs(Math.sin(x * Math.PI * 3.1 * k + .6)), .7);
    const gap = cl(Math.abs(Math.sin(x * Math.PI * 7.4 * k + 1.3)) * 1.8);
    const env = word * (.45 + .55 * gap) * (.6 + .4 * Math.sin(x * Math.PI));
    return cl(.1 + env * (.45 + .55 * r()), .08, 1);
  });
}
const avatar = (bg, fg) => ({ width: 30, height: 30, borderRadius: 15, background: bg, color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flex: 'none', fontFamily: 'Inter, system-ui, sans-serif' });
const pill = (bg, fg) => ({ background: bg, color: fg, height: 22, padding: '0 9px', borderRadius: 11, fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', fontFamily: 'Inter, system-ui, sans-serif' });
const dot = c => ({ width: 7, height: 7, borderRadius: 4, background: c, display: 'block', flex: 'none' });

// ---------------------------------------------------------------- Inbox recording
const IX = 66, IW = 348, IH = 46, IY = i => 92 + i * 52;
const MAIL = [
  ['SR', 'Sam Rivera', 'Shift swap for Thursday', '9:41 AM', true, '#eaf2ff', DEEP],
  ['PD', 'Pharmacy desk', 'Refill ready for Jordan E.', '9:12 AM', false, '#fef3c7', '#a16207'],
  ['LC', 'Lee Chen', 'Updated care plan notes', '8:55 AM', false, '#dcfce7', '#15803d']
];
const NEWMAIL = ['MO', 'Dr. Morgan Ortiz', 'Lab results are available', 'Now', true, '#ede9fe', '#6d28d9'];
// Rows sit in a fixed clip box; a swipe slides the inner content, never the measured carrier.
const MailRow = ({ m }) => (
  <span style={{ display: 'block', overflow: 'hidden', width: '100%', height: IH }}><span className="swipe" style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', height: IH }}>
    <span style={avatar(m[5], m[6])}>{m[0]}</span>
    <span className="stack" style={{ flex: 1, minWidth: 0 }}><Text size={13.5} weight={m[4] ? 700 : 600}>{m[1]}</Text><Text size={12} color={m[4] ? BODY : SUB}>{m[2]}</Text></span>
    <span className="stack" style={{ alignItems: 'flex-end', gap: 6 }}><Text size={11.5} weight={600} color={m[4] ? DEEP : MUTE} className="tnum">{m[3]}</Text><span style={dot(m[4] ? BLUE : 'transparent')} /></span>
  </span></span>
);
export function InboxRecording({ uid = 'inbox-recording' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Inbox receiving a new message and archiving another" svg={<>
      <Surf id="card" x={50} y={22} w={380} h={236} r={22} tone="white" elev={3} seed={[240, 140]} />
      <Surf id="tile" x={66} y={38} w={36} h={36} r={11} tone="tint" elev={0} seed={[84, 56]} order={1} />
      <Surf id="cnt" x={318} y={43} w={96} h={26} r={13} tone="blue" elev={1} seed={[366, 56]} at={.9} />
      <Surf id="arc" x={300} y={IY(2)} w={114} h={IH} r={13} tone="green" elev={0} seed={[400, IY(2) + 23]} at={2.75} />
      {MAIL.map((m, i) => <Surf key={i} id={`o${i}`} x={IX} y={IY(i)} w={IW} h={IH} r={13} tone={m[4] ? 'tint' : 'white'} elev={1} seed={[IX + 24, IY(i) + 23]} at={1.0 + i * .09} />)}
      <Surf id="nw" x={IX} y={IY(0)} w={IW} h={IH} r={13} tone="tint" elev={1} seed={[IX + 24, IY(0) + 23]} at={2.05} />
    </>}>
      <Layer id="ti" kind="icon" x={66} y={38} w={36} h={36} at={.8} align="center"><Icon name="inbox" size={20} color={DEEP} id="inbox" /></Layer>
      <Layer id="t" x={114} y={36} w={200} h={20} at={.75}><Text size={15.5} weight={600}>Inbox</Text></Layer>
      <Layer id="s" x={114} y={56} w={200} h={20} at={.8}><Text size={12.5} color={SUB} className="sub">Maple House care team</Text></Layer>
      <Layer id="ct" x={318} y={43} w={96} h={26} at={1.05} align="center" className="gap6"><Icon name="mail" size={15} color="#fff" id="mail" /><Text size={12} weight={600} color="#fff" className="tnum cnum">2 unread</Text></Layer>
      <Layer id="at" x={300} y={IY(2)} w={114} h={IH} at={3.22} align="center" className="gap6"><Icon name="archive" size={17} color="#fff" id="archive" /><Text size={12.5} weight={600} color="#fff">Archive</Text></Layer>
      {MAIL.map((m, i) => <Layer key={i} id={`r${i}`} x={IX + 10} y={IY(i)} w={IW - 22} h={IH} at={1.15 + i * .09}><MailRow m={m} /></Layer>)}
      <Layer id="rn" x={IX + 10} y={IY(0)} w={IW - 22} h={IH} at={2.45}><MailRow m={NEWMAIL} /></Layer>
    </Frame>
  );
}
InboxRecording.motion = c => {
  const D = 52, sh = 'back.out(1.15)';
  c.icon('inbox', 0, 33, .9, .9);
  // A new message arrives: the card grows, older rows push down, the new row forms at the top.
  c.reshape('card', rect(50, 22, 380, 236 + D, 22), 1.9, .55, sh);
  [0, 1, 2].forEach(i => {
    c.fromTo(`[data-surf="o${i}"]`, { y: 0 }, { y: D, duration: .55, ease: sh }, 1.9 + i * .03);
    c.fromTo(`[data-layer="r${i}"]`, { y: 0 }, { y: D, duration: .55, ease: sh }, 1.9 + i * .03);
  });
  c.press('cnt', '[data-layer="ct"]', 2.3, .8);
  c.icon('mail', 0, 19, 2.3, .7);
  c.swap('[data-layer="ct"] .cnum', ['2 unread', '3 unread'], [2.36]);
  // Swipe the read pharmacy row left to reveal archive, then collapse it and close the gap.
  c.cursor([{ at: 2.9, x: 304, y: IY(2) + 30, press: true }, { at: 3.4, x: 184, y: IY(2) + 30 }, { at: 3.55, x: 240, y: 286 }]);
  const SW = 'power3.inOut';
  c.reshape('o1', rect(IX, IY(1), IW - 126, IH, 13), 3.04, .36, SW);
  c.fromTo('[data-layer="r1"] .swipe', { x: 0 }, { x: -126, duration: .36, ease: SW }, 3.04);
  c.icon('archive', 0, 4, 3.3, .3);
  const o1 = `${IX + (IW - 126) / 2} ${IY(1) + IH / 2}`, ar = `${300 + 57} ${IY(2) + IH / 2}`;
  c.hide('r1', 3.44, .16); c.hide('at', 3.44, .16);
  c.fromTo('[data-surf="o1"]', { scaleY: 1, svgOrigin: o1 }, { scaleY: 0, svgOrigin: o1, duration: .22, ease: 'power2.in' }, 3.5);
  c.fromTo('[data-surf="arc"]', { scaleY: 1, svgOrigin: ar }, { scaleY: 0, svgOrigin: ar, duration: .22, ease: 'power2.in' }, 3.5);
  c.fromTo('[data-surf="o2"]', { y: D }, { y: 0, duration: .45, ease: sh }, 3.6);
  c.fromTo('[data-layer="r2"]', { y: D }, { y: 0, duration: .45, ease: sh }, 3.6);
  c.reshape('card', rect(50, 22, 380, 236, 22), 3.6, .45, sh);
  c.swap('[data-layer="s"] .sub', ['Maple House care team', 'Maple House · 1 archived'], [3.7]);
};
Object.assign(InboxRecording, {
  id: 'inbox-recording', title: 'Inbox recording', category: CAT, w: W, h: H, focus: { x: 240, y: 170 }, push: 1.06, exit: [240, 140],
  summary: 'A new message forms at the top while older rows push down and the unread counter ticks up. A read row is swiped to archive, collapses and the gap closes.',
  usage: `<InboxRecording />`, icons: ['inbox', 'mail', 'archive']
});

// ---------------------------------------------------------------- Calendar view
const KX = c => 104 + c * 80, KY0 = 112, KR = 40, KDAYS = ['Mon 3', 'Tue 4', 'Wed 5', 'Thu 6'], KHRS = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM'];
const KTONE = { tint: [DEEP, '#3b82f6'], greenTint: ['#15803d', '#16a34a'], amberTint: ['#a16207', '#b45309'] };
const EVTS = [[0, 0, 1.5, 'Team huddle', '9:00', 'tint'], [1, 1, 1, 'Med review', '10:00', 'greenTint'], [2, 0, 1, 'Intake call', '9:00', 'amberTint'], [3, 2, 1.5, 'Family visit', '11:00', 'tint'], [0, 3, 1, 'Training', '12:00', 'amberTint']];
const ev = (c, r, d) => rect(KX(c) + 4, KY0 + r * KR + 3, 72, d * KR - 6, 8);
const KT = ev(2, 3, 1), KC = rect(316, 44, 108, 30, 9);
export function CalendarView({ uid = 'calendar-view' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Week calendar with a visit dragged into an open slot" svg={<>
      <Surf id="card" x={40} y={24} w={400} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="tile" x={56} y={40} w={36} h={36} r={11} tone="tint" elev={0} seed={[74, 58]} order={1} />
      <Surf id="today" x={KX(2)} y={84} w={80} h={236} r={12} tone="tint" elev={0} seed={[KX(2) + 40, 96]} at={.9} edge={false} />
      {[0, 1, 2, 3, 4, 5].map(r => <Draw key={r} id={`h${r}`} d={`M${KX(0)} ${KY0 + r * KR + .5} H${KX(4)}`} stroke={r ? '#eef2f6' : '#e2e8f0'} width={1} at={.85 + r * .04} />)}
      {[1, 2, 3].map(c => <Draw key={c} id={`v${c}`} d={`M${KX(c) + .5} ${KY0} V${KY0 + 5 * KR}`} stroke="#eef2f6" width={1} at={.95 + c * .04} />)}
      {EVTS.map(([c, r, d, , , tone], i) => { const g = ev(c, r, d); return <Surf key={i} id={`e${i}`} x={g.x} y={g.y} w={g.w} h={g.h} r={8} tone={tone} elev={0} seed={[g.x + 12, g.y + 10]} at={1.15 + i * .08} />; })}
      <g className="ghost" opacity="0"><rect x={KT.x + .75} y={KT.y + .75} width={KT.w - 1.5} height={KT.h - 1.5} rx={8} fill="rgba(45,125,255,.06)" stroke={BLUE} strokeWidth="1.5" strokeDasharray="4 4" /></g>
      <Surf id="nv" x={KC.x} y={KC.y} w={KC.w} h={KC.h} r={9} tone="blue" elev={3} seed={[KC.x + 54, KC.y + 15]} at={1.0} />
    </>}>
      <Layer id="ti" kind="icon" x={56} y={40} w={36} h={36} at={.8} align="center"><Icon name="calendar" size={20} color={DEEP} id="calendar" /></Layer>
      <Layer id="t" x={104} y={38} w={200} h={20} at={.75}><Text size={15.5} weight={600}>Week of Nov 3</Text></Layer>
      <Layer id="s" x={104} y={58} w={200} h={20} at={.8}><Text size={12.5} color={SUB} className="tnum sub">Maple House · 5 visits</Text></Layer>
      {KDAYS.map((d, i) => <Layer key={d} id={`d${i}`} x={KX(i)} y={88} w={80} h={20} at={.9 + i * .04} align="center"><Text size={11.5} weight={600} color={i === 2 ? DEEP : SUB}>{d}</Text></Layer>)}
      {KHRS.map((h, r) => <Layer key={h} id={`k${r}`} x={44} y={KY0 + r * KR - 8} w={52} h={16} at={.95 + r * .04} align="right"><Text size={10.5} weight={600} color={MUTE} className="tnum">{h}</Text></Layer>)}
      {EVTS.map(([c, r, d, name, time, tone], i) => { const g = ev(c, r, d); return (
        <Layer key={i} id={`et${i}`} x={g.x + 8} y={g.y + 1} w={g.w - 12} h={Math.min(g.h, 34) - 2} at={1.35 + i * .08}>
          <span className="stack" style={{ gap: 0 }}><Text size={11.5} weight={600} color={KTONE[tone][0]}>{name}</Text><Text size={10.5} weight={500} color={KTONE[tone][1]} className="tnum">{time}</Text></span>
        </Layer>); })}
      <Layer id="nl" x={KC.x} y={KC.y} w={KC.w} h={KC.h} at={1.5} align="center"><Text size={12} weight={600} color="#fff">Home visit · 1 h</Text></Layer>
      <Layer id="sl" x={KT.x + 8} y={KT.y + 1} w={KT.w - 12} h={KT.h - 2} at={3.12}>
        <span className="stack" style={{ gap: 0 }}><Text size={11.5} weight={600} color="#fff">Home visit</Text><Text size={10.5} weight={500} color="#dbeafe" className="tnum">12:00</Text></span>
      </Layer>
    </Frame>
  );
}
CalendarView.motion = c => {
  c.icon('calendar', 0, 7, .9, .5);
  const dx = (KT.x + KT.w / 2) - (KC.x + KC.w / 2), dy = (KT.y + KT.h / 2) - (KC.y + KC.h / 2), E = 'power3.inOut';
  c.cursor([{ at: 1.7, x: 372, y: 118 }, { at: 2.0, x: 404, y: 66, press: true }, { at: 2.85, x: 404 + dx, y: 66 + dy }]);
  c.press('nv', '[data-layer="nl"] .fc-carrier', 2.0, .6);
  c.reshape('nv', rect(KC.x + dx, KC.y + dy, KC.w, KC.h, 9), 2.14, .71, E);
  c.fromTo('[data-layer="nl"]', { x: 0, y: 0 }, { x: dx, y: dy, duration: .71, ease: E }, 2.14);
  c.fromTo('.ghost', { opacity: 0 }, { opacity: 1, duration: .25 }, 2.4);
  c.fromTo('.ghost', { opacity: 1 }, { opacity: 0, duration: .2 }, 2.9);
  // Snap: the dragged chip settles into the slot geometry with a small overshoot.
  c.reshape('nv', rect(KT.x, KT.y, KT.w, KT.h, 8), 2.9, .45, 'back.out(1.8)');
  c.hide('nl', 2.8, .14);
  c.swap('[data-layer="s"] .sub', ['Maple House · 5 visits', 'Maple House · 6 visits'], [3.1]);
  c.icon('calendar', 0, 7, 3.05, .5);
};
Object.assign(CalendarView, {
  id: 'calendar-view', title: 'Calendar view', category: CAT, w: W, h: H, focus: { x: 250, y: 200 }, push: 1.04, orbit: .85, exit: [240, 180],
  summary: 'A week grid draws on and event blocks form in their slots. A new visit chip is dragged into an open slot and snaps to its geometry.',
  usage: `<CalendarView />`, icons: ['calendar']
});

// ---------------------------------------------------------------- Clock overlay
const OC = [168, 180], OR = 100;
const polar = (a, r) => [OC[0] + r * Math.sin(a * Math.PI / 180), OC[1] - r * Math.cos(a * Math.PI / 180)];
const arcD = (a0, a1, r) => { const [x0, y0] = polar(a0, r), [x1, y1] = polar(a1, r); return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
const TICKS = Array.from({ length: 60 }, (_, i) => { const big = i % 5 === 0, [x0, y0] = polar(i * 6, big ? 78 : 84), [x1, y1] = polar(i * 6, 90); return { big, d: `M${x0.toFixed(2)} ${y0.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)}` }; });
const SPAN = 110, M0 = 8 * 60 + 50, OT0 = 2.0, OT1 = 3.7;
export function ClockOverlay({ uid = 'clock-overlay' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Clock overlay advancing from 8:50 to 10:40" svg={<>
      <Surf id="card" x={44} y={44} w={392} h={272} r={24} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="dial" x={OC[0] - OR} y={OC[1] - OR} w={OR * 2} h={OR * 2} r={OR} tone="muted" elev={0} seed={OC} order={1} />
      <Draw id="ticks" d={TICKS.filter(t => !t.big).map(t => t.d).join(' ')} stroke="#cbd5e1" width={1.2} at={1.0} dur={.8} />
      <Draw id="hticks" d={TICKS.filter(t => t.big).map(t => t.d).join(' ')} stroke={BODY} width={2.4} at={1.05} dur={.8} />
      <path className="elapsed" d={arcD(M0 / 2, M0 / 2 + SPAN / 2, OR + 7)} fill="none" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
      <Pop id="hands" at={1.25} origin="50% 50%">
        <g className="hand-h"><path d={`M${OC[0]} ${OC[1] + 12} V${OC[1] - 52}`} stroke={INK} strokeWidth="6" strokeLinecap="round" /></g>
        <g className="hand-m"><path d={`M${OC[0]} ${OC[1] + 16} V${OC[1] - 78}`} stroke={BLUE} strokeWidth="3.5" strokeLinecap="round" /></g>
        <circle cx={OC[0]} cy={OC[1]} r="6.5" fill="#fff" stroke={INK} strokeWidth="3" />
      </Pop>
      <Surf id="track" x={296} y={268} w={116} h={6} r={3} tone="track" elev={0} seed={[302, 271]} at={1.02} />
      <Surf id="fill" x={296} y={268} w={6} h={6} r={3} tone="blue" elev={0} seed={[299, 271]} at={1.08} />
    </>}>
      {[['12', 0], ['3', 90], ['6', 180], ['9', 270]].map(([n, a]) => { const [x, y] = polar(a, 62); return <Layer key={n} id={`n${n}`} x={x - 14} y={y - 10} w={28} h={20} at={1.1} align="center"><Text size={13} weight={600} color={BODY} className="tnum">{n}</Text></Layer>; })}
      <Layer id="lb" x={296} y={68} w={120} h={24} at={.85} className="gap6"><Icon name="clock" size={17} color={DEEP} id="clock" /><Text size={12.5} weight={600} color={SUB}>Shift clock</Text></Layer>
      <Layer id="rd" x={296} y={96} w={128} h={50} at={.95}><span className="baseline"><Text size={34} weight={700} className="tnum rdv" style={{ letterSpacing: '-.035em' }}>8:50</Text><Text size={13} weight={600} color={SUB}>AM</Text></span></Layer>
      <Layer id="el" x={296} y={160} w={124} h={42} at={1.05}><span className="stack"><Text size={12} weight={500} color={SUB}>Elapsed</Text><Text size={18} weight={600} className="tnum elv">0 h 00 m</Text></span></Layer>
      <Layer id="vs" x={296} y={214} w={124} h={42} at={1.12}><span className="stack"><Text size={12} weight={500} color={SUB}>Current visit</Text><Text size={13.5} weight={600}>Jordan Ellis</Text></span></Layer>
      <Layer id="pc" x={296} y={278} w={124} h={18} at={1.3}><Text size={11} weight={500} color={SUB} className="tnum pcv">0% of 8 h shift</Text></Layer>
    </Frame>
  );
}
ClockOverlay.motion = c => {
  const E = c.ease('power2.inOut'), hh = c.q('.hand-h'), hm = c.q('.hand-m');
  const rd = c.q('.rdv'), elv = c.q('.elv'), pcv = c.q('.pcv');
  c.icon('clock', 0, 39, .95, 1.0);
  c.icon('clock', 0, 39, OT0, OT1 - OT0);
  c.draw('.elapsed', '0% 0%', '0% 100%', OT0, OT1 - OT0, 'power2.inOut');
  c.draw('.elapsed', '0% 100%', '100% 100%', c.T.collapse + .02, .35, 'power2.in');
  c.reshape('fill', rect(296, 268, 6 + 110 * SPAN / 480, 6, 3), OT0, OT1 - OT0, 'power2.inOut');
  c.after(t => {
    const m = SPAN * E(cl((t - OT0) / (OT1 - OT0)));
    // Rigid rotations about the dial centre: minute hand 6 deg/min, hour hand 0.5 deg/min.
    const a = M0 + m;
    hm.setAttribute('transform', `rotate(${(a * 6).toFixed(3)} ${OC[0]} ${OC[1]})`);
    hh.setAttribute('transform', `rotate(${(a * .5 - 360).toFixed(3)} ${OC[0]} ${OC[1]})`);
    const k = Math.floor(m + 1e-6), now = M0 + k;
    rd.textContent = `${Math.floor(now / 60)}:${String(now % 60).padStart(2, '0')}`;
    elv.textContent = `${Math.floor(k / 60)} h ${String(k % 60).padStart(2, '0')} m`;
    pcv.textContent = `${Math.round(k / 480 * 100)}% of 8 h shift`;
  });
};
Object.assign(ClockOverlay, {
  id: 'clock-overlay', title: 'Clock overlay', category: CAT, w: W, h: H, focus: { x: 220, y: 180 }, push: 1.06, exit: [240, 180],
  summary: 'An analog dial whose hands sweep as rigid rotations about the centre while an elapsed arc draws on and a tabular readout tracks the time.',
  usage: `<ClockOverlay />`, icons: ['clock']
});

// ---------------------------------------------------------------- Waveform animation
const WN = 56, WX = i => 74 + i * (332 / (WN - 1)), WC = 194, WA = wave(WN, 11), WP0 = 2.12, WP1 = 3.72, WEND = .75;
const wfmt = s => `0:${String(Math.floor(s + 1e-6)).padStart(2, '0')}`;
export function WaveformAnimation({ uid = 'waveform-animation' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Audio waveform playing back to 0:18" svg={<>
      <Surf id="card" x={50} y={56} w={380} h={252} r={22} tone="white" elev={3} seed={[240, 182]} />
      <Surf id="play" x={70} y={76} w={44} h={44} r={22} tone="blue" elev={2} seed={[92, 98]} order={1} />
      <Draw id="base" d={`M74 ${WC + .5} H406`} stroke="#eef2f6" width={1} at={.9} />
      <g className="bars">{WA.map((a, i) => <rect key={i} className={`wb wb${i}`} x={(WX(i) - 1.7).toFixed(2)} y={(WC - a * 46).toFixed(2)} width="3.4" height={(a * 92).toFixed(2)} rx="1.7" fill="#cbd5e1" />)}</g>
      <Pop id="ph" at={1.9} origin="50% 0%"><g className="phg"><path d={`M74 144 V246`} stroke={DEEP} strokeWidth="2" strokeLinecap="round" /><circle cx="74" cy="142" r="5.5" fill="#fff" stroke={DEEP} strokeWidth="2.5" /></g></Pop>
    </>}>
      <Layer id="pi" kind="icon" x={70} y={76} w={44} h={44} at={1.0} align="center"><Icon name="playPause" size={20} color="#fff" id="play" /></Layer>
      <Layer id="t" x={128} y={76} w={200} h={22} at={.75}><Text size={15.5} weight={600}>Care note recording</Text></Layer>
      <Layer id="s" x={128} y={98} w={200} h={20} at={.8}><Text size={12.5} color={SUB}>Avery K. · today 9:41 AM</Text></Layer>
      <Layer id="tm" x={306} y={84} w={104} h={24} at={.9} align="right"><Text size={13} weight={600} className="tnum"><span className="tcur">0:00</span><span style={{ color: MUTE }}> / 0:24</span></Text></Layer>
      <Layer id="a0" x={66} y={262} w={60} h={18} at={1.1}><Text size={11} weight={600} color={MUTE} className="tnum">0:00</Text></Layer>
      <Layer id="a1" x={354} y={262} w={56} h={18} at={1.15} align="right"><Text size={11} weight={600} color={MUTE} className="tnum">0:24</Text></Layer>
      <Layer id="mic" x={150} y={258} w={180} h={26} at={1.2} align="center" className="gap6"><Icon name="microphone" size={15} color={SUB} id="mic" /><Text size={11.5} weight={500} color={SUB}>Voice note · 48 kHz</Text></Layer>
    </Frame>
  );
}
WaveformAnimation.motion = c => {
  const bars = c.qa('.wb'), phg = c.q('.phg'), cur = c.q('.tcur');
  bars.forEach((b, i) => {
    c.fromTo(b, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: .5, ease: 'back.out(2)' }, .95 + i * .012);
    c.fromTo(b, { scaleY: 1, transformOrigin: '50% 50%' }, { scaleY: 0, duration: .24, ease: 'power2.in' }, c.T.collapse - .04 + outIn(i, WN));
  });
  c.rest('play', 7);
  c.cursor([{ at: 1.95, x: 96, y: 104, press: true }]);
  c.press('play', '[data-layer="pi"] .fc-carrier', 1.95, 1);
  c.icon('play', 7, 0, 2.0, .25);
  c.icon('play', 0, 7, WP1, .25);
  const X1 = 332 * WEND;
  c.after(t => {
    const p = cl((t - WP0) / (WP1 - WP0)), x = X1 * p;
    phg.setAttribute('transform', `translate(${x.toFixed(3)} 0)`);
    bars.forEach((b, i) => b.setAttribute('fill', WX(i) <= 74 + x + .5 && t >= WP0 ? BLUE : '#cbd5e1'));
    cur.textContent = wfmt(24 * WEND * p);
  });
};
Object.assign(WaveformAnimation, {
  id: 'waveform-animation', title: 'Waveform animation', category: CAT, w: W, h: H, focus: { x: 240, y: 190 }, push: 1.06, exit: [240, 182],
  summary: 'Deterministic waveform bars grow in from the centre line. Pressing play sweeps a playhead that turns played bars blue beside a tabular time readout.',
  usage: `<WaveformAnimation />`, icons: ['playPause', 'microphone']
});

// ---------------------------------------------------------------- Voice comparison
const VN = 30, VX = i => 234 + i * (172 / (VN - 1)), VRY = k => 86 + k * 84, VA = [wave(VN, 7, 1.1), wave(VN, 7, 1.1).map((a, i) => cl(a * (.9 + .2 * Math.sin(i * 1.7)), .1, 1))];
const VPLAY = [[1.8, 2.5], [2.62, 3.32]], VCOL = [BLUE, '#0ea5e9'], VSC = 94;
export function VoiceComparison({ uid = 'voice-comparison' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Original and generated voice tracks with a 94 percent similarity score" svg={<>
      <Surf id="card" x={40} y={20} w={400} h={320} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="tile" x={384} y={36} w={36} h={36} r={11} tone="tint" elev={0} seed={[402, 54]} order={1} />
      {[0, 1].map(k => <Surf key={k} id={`row${k}`} x={56} y={VRY(k)} w={368} h={72} r={16} tone="muted" elev={0} seed={[80, VRY(k) + 36]} at={.95 + k * .12} />)}
      {[0, 1].map(k => <Surf key={k} id={`pb${k}`} x={70} y={VRY(k) + 18} w={36} h={36} r={18} tone="white" elev={1} seed={[88, VRY(k) + 36]} at={1.1 + k * .12} />)}
      {[0, 1].map(k => <g key={k} className={`vbars vb${k}`}>{VA[k].map((a, i) => <rect key={i} className={`vw${k}`} x={(VX(i) - 1.6).toFixed(2)} y={(VRY(k) + 36 - a * 22).toFixed(2)} width="3.2" height={(a * 44).toFixed(2)} rx="1.6" fill="#cbd5e1" />)}</g>)}
      {[0, 1].map(k => <Pop key={k} id={`vph${k}`} at={VPLAY[k][0] - .2} origin="50% 50%"><path className={`vph${k}`} d={`M${VX(0)} ${VRY(k) + 10} V${VRY(k) + 62}`} stroke={k ? '#0284c7' : DEEP} strokeWidth="2" strokeLinecap="round" /></Pop>)}
      <Surf id="panel" x={56} y={258} w={368} h={66} r={16} tone="white" elev={1} seed={[240, 290]} order={2} />
      <Surf id="track" x={72} y={302} w={236} h={8} r={4} tone="track" elev={0} seed={[76, 306]} at={1.15} />
      <Surf id="fill" x={72} y={302} w={8} h={8} r={4} tone="blue" elev={0} seed={[76, 306]} at={1.2} />
    </>}>
      <Layer id="t" x={60} y={36} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Voice comparison</Text></Layer>
      <Layer id="s" x={60} y={58} w={260} h={20} at={.76}><Text size={12.5} color={SUB}>Northwind AI · sample 03</Text></Layer>
      <Layer id="hi" kind="icon" x={384} y={36} w={36} h={36} at={.85} align="center"><Icon name="headphones" size={19} color={DEEP} id="hp" /></Layer>
      {[0, 1].map(k => <Layer key={k} id={`pi${k}`} kind="icon" x={70} y={VRY(k) + 18} w={36} h={36} at={1.25 + k * .12} align="center"><Icon name="playPause" size={16} color={k ? '#0284c7' : DEEP} id={`pp${k}`} /></Layer>)}
      {[['Original', 'Recorded · 0:06'], ['Generated', 'Model A · 0:06']].map(([a, b], k) => <Layer key={k} id={`vl${k}`} x={118} y={VRY(k) + 14} w={108} h={44} at={1.2 + k * .12}><span className="stack"><span className="legend" style={{ fontSize: 13.5, fontWeight: 600, color: INK }}><i style={{ background: VCOL[k] }} />{a}</span><Text size={11.5} color={SUB} className="tnum">{b}</Text></span></Layer>)}
      <Layer id="sl" x={72} y={268} w={220} h={22} at={1.3} className="gap6"><Text size={12.5} weight={600} color={SUB}>Similarity score</Text></Layer>
      <Layer id="ok" kind="icon" x={322} y={276} w={24} h={24} at={3.3} align="center"><Icon name="checkCircle" size={20} color="#16a34a" id="ok" /></Layer>
      <Layer id="sc" x={348} y={268} w={64} h={42} at={1.35} align="right"><Text size={28} weight={700} className="tnum scv" style={{ letterSpacing: '-.03em' }}>0%</Text></Layer>
    </Frame>
  );
}
VoiceComparison.motion = c => {
  [0, 1].forEach(k => {
    const bars = c.qa(`.vw${k}`);
    bars.forEach((b, i) => {
      c.fromTo(b, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: .5, ease: 'back.out(2)' }, 1.15 + k * .12 + i * .012);
      c.fromTo(b, { scaleY: 1, transformOrigin: '50% 50%' }, { scaleY: 0, duration: .24, ease: 'power2.in' }, c.T.collapse - .04 + outIn(i, VN));
    });
    c.rest(`pp${k}`, 7);
    c.icon(`pp${k}`, 7, 0, VPLAY[k][0], .22);
    c.icon(`pp${k}`, 0, 7, VPLAY[k][1], .22);
  });
  c.icon('hp', 0, 39, .9, 1.0);
  c.cursor([{ at: 1.72, x: 92, y: VRY(0) + 42, press: true }]);
  c.press('pb0', '[data-layer="pi0"] .fc-carrier', 1.72, 1);
  const B = [c.qa('.vw0'), c.qa('.vw1')], PH = [c.q('.vph0'), c.q('.vph1')], sc = c.q('.scv'), SE = c.ease('power3.out');
  c.reshape('fill', rect(72, 302, 236 * VSC / 100, 8, 4), 3.22, .6, 'power3.out');
  c.icon('ok', 0, 39, 3.35, .65);
  c.after(t => {
    [0, 1].forEach(k => {
      const [a, b] = VPLAY[k], p = cl((t - a) / (b - a)), x = VX(0) + (VX(VN - 1) - VX(0)) * p;
      PH[k].setAttribute('transform', `translate(${(x - VX(0)).toFixed(3)} 0)`);
      B[k].forEach((r, i) => r.setAttribute('fill', t >= a && VX(i) <= x + .5 ? VCOL[k] : '#cbd5e1'));
    });
    sc.textContent = `${Math.round(VSC * SE(cl((t - 3.22) / .6)))}%`;
  });
};
Object.assign(VoiceComparison, {
  id: 'voice-comparison', title: 'Voice comparison', category: CAT, w: W, h: H, focus: { x: 240, y: 200 }, push: 1.05, exit: [240, 180],
  summary: 'Original and generated voice tracks play in turn, each playhead colouring its waveform, then a similarity score counts up beside its meter.',
  usage: `<VoiceComparison />`, icons: ['playPause', 'headphones', 'checkCircle']
});

// ---------------------------------------------------------------- Generated clip
const GP = rect(66, 176, 348, 148, 14), PROMPT = 'A sunrise over a quiet garden path', GT0 = 2.38, GT1 = 3.08, GR = 3.08;
export function GeneratedClip({ uid = 'generated-clip' }) {
  const { x, y, w, h } = GP;
  return (
    <Frame uid={uid} w={W} h={H} label="Prompt generating an illustrative clip" svg={<>
      <Surf id="card" x={50} y={16} w={380} h={326} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="tile" x={66} y={32} w={36} h={36} r={11} tone="tint" elev={0} seed={[84, 50]} order={1} />
      <Surf id="field" x={66} y={82} w={348} h={44} r={12} tone="muted" elev={0} seed={[90, 104]} order={2} />
      <Surf id="go" x={330} y={88} w={78} h={32} r={9} tone="blue" elev={2} seed={[369, 104]} at={1.05} />
      <Surf id="track" x={66} y={156} w={348} h={6} r={3} tone="track" elev={0} seed={[70, 159]} at={1.0} />
      <Surf id="fill" x={66} y={156} w={6} h={6} r={3} tone="blue" elev={0} seed={[69, 159]} at={1.05} />
      <Surf id="player" x={x} y={y} w={w} h={h} r={14} tone="ink" elev={2} seed={[240, 250]} at={1.15} />
      <clipPath id={`${uid}-scene`}><rect className="wipe" x={x} y={y} width="0" height={h} rx="14" /></clipPath>
      <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfdbfe" /><stop offset=".62" stopColor="#fde7c7" /><stop offset="1" stopColor="#fcd9a8" /></linearGradient>
      <g className="scene" clipPath={`url(#${uid}-scene)`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-sky)`} />
        <circle className="sun" cx={300} cy={262} r={22} fill="#fbbf24" />
        <circle className="sun-halo" cx={300} cy={262} r={34} fill="#fde68a" opacity=".45" />
        <path d={`M${x} 270 C120 246 170 250 220 262 S320 240 ${x + w} 256 V${y + h} H${x} Z`} fill="#86c79a" />
        <path d={`M${x} 292 C130 276 210 280 260 290 S360 280 ${x + w} 286 V${y + h} H${x} Z`} fill="#4fa36b" />
        <path d={`M200 ${y + h} C214 300 232 292 244 288 L252 288 C246 296 240 306 238 ${y + h} Z`} fill="#f5e6c8" />
        <g><rect x="112" y="250" width="44" height="30" rx="2" fill="#f8fafc" /><path d="M106 252 L134 230 L162 252 Z" fill="#ef7c5b" /><rect x="128" y="262" width="12" height="18" rx="1.5" fill="#94a3b8" /><rect x="116" y="258" width="8" height="8" rx="1" fill="#93c5fd" /><rect x="144" y="258" width="8" height="8" rx="1" fill="#93c5fd" /></g>
        <g fill="#2f7d4f"><circle cx="352" cy="262" r="13" /><circle cx="372" cy="268" r="10" /><rect x="350.5" y="270" width="3" height="16" fill="#7c5a3a" /><rect x="370.5" y="274" width="3" height="12" fill="#7c5a3a" /></g>
      </g>
    </>}>
      <Layer id="ti" kind="icon" x={66} y={32} w={36} h={36} at={.8} align="center"><Icon name="film" size={19} color={DEEP} id="film" /></Layer>
      <Layer id="t" x={114} y={30} w={240} h={22} at={.72}><Text size={15.5} weight={600}>Generate clip</Text></Layer>
      <Layer id="s" x={114} y={50} w={240} h={20} at={.78}><Text size={12.5} color={SUB}>Northwind AI · video model</Text></Layer>
      <Layer id="pr" x={80} y={82} w={244} h={44} at={.9}><Text size={13.5} weight={500} className="prompt"> </Text></Layer>
      <Layer id="gl" x={330} y={88} w={78} h={32} at={1.2} align="center" className="gap6"><Icon name="zap" size={15} color="#fff" id="zap" /><Text size={13} weight={600} color="#fff">Create</Text></Layer>
      <Layer id="pl" x={66} y={134} w={200} h={20} at={1.1} className="gap6"><Text size={12.5} weight={600} color={SUB} className="gst">Waiting for prompt</Text></Layer>
      <Layer id="pp" x={314} y={134} w={100} h={20} at={1.15} align="right"><Text size={12.5} weight={600} className="tnum gpc">0%</Text></Layer>
      <Layer id="ph" x={x} y={y + 54} w={w} h={40} at={1.4} align="center" className="gap8"><Icon name="image" size={18} color="#64748b" id="img" /><Text size={12.5} weight={500} color={MUTE}>Preview appears here</Text></Layer>
      <Layer id="tag" x={x + 12} y={y + 12} w={100} h={24} at={3.32}><span style={{ ...pill('rgba(15,23,42,.72)', '#fff'), height: 24, fontSize: 11.5 }}><span style={dot('#fbbf24')} />Illustrative</span></Layer>
      <Layer id="dur" x={x + w - 112} y={y + h - 36} w={100} h={24} at={3.4} align="right"><span style={{ ...pill('rgba(15,23,42,.72)', '#fff'), height: 24, fontSize: 11.5 }} className="tnum">0:06 · 1080p</span></Layer>
    </Frame>
  );
}
GeneratedClip.motion = c => {
  c.icon('film', 0, 35, .9, 1.0);
  c.typing('.prompt', PROMPT, .95, 30);
  c.cursor([{ at: 1.9, x: 360, y: 214 }, { at: 2.22, x: 403, y: 115, press: true }, { at: 2.6, x: 250, y: 292 }]);
  c.press('go', '[data-layer="gl"] .fc-carrier', 2.22, 1);
  c.icon('zap', 0, 33, 2.26, .8);
  c.swap('.gst', ['Waiting for prompt', 'Generating clip', 'Clip ready'], [2.32, GT1]);
  c.fromTo('.gst', { color: SUB }, { color: '#15803d', duration: .2 }, GT1);
  c.reshape('fill', rect(66, 156, 348, 6, 3), GT0, GT1 - GT0, 'power1.inOut');
  c.count('.gpc', 0, 100, GT0, GT1 - GT0, v => `${Math.round(v)}%`, 'power1.inOut');
  c.hide('ph', GR - .1, .2);
  c.fromTo('.wipe', { attr: { width: 0 } }, { attr: { width: GP.w }, duration: .6, ease: 'power3.inOut' }, GR);
  c.fromTo('.wipe', { attr: { width: GP.w } }, { attr: { width: 0 }, duration: .24, ease: 'power2.in' }, c.T.collapse);
  // The generated scene settles: the sun rises a little as the clip begins.
  c.fromTo('.sun, .sun-halo', { y: 14 }, { y: 0, duration: .9, ease: 'power2.out' }, GR);
};
Object.assign(GeneratedClip, {
  id: 'generated-clip', title: 'Generated clip', category: CAT, w: W, h: H, focus: { x: 240, y: 200 }, push: 1.05, exit: [240, 180],
  summary: 'A prompt types in and Create fills a progress bar, then an illustrative vector scene wipes into the player frame with its tag and duration.',
  usage: `<GeneratedClip />`, icons: ['film', 'zap', 'image']
});

// ---------------------------------------------------------------- Editing timeline
const TX = sec => 132 + sec * 24.25, TLY = k => 138 + k * 50, TPH0 = 2.95, TPH1 = 3.85, TPHS = 8.8;
const TRACKS = [['video', 'Video'], ['music', 'Audio'], ['type', 'Captions']];
const tclip = (k, a, b) => rect(TX(a) + 1, TLY(k) + 5, TX(b) - TX(a) - 2, 32, 8);
const TV1 = tclip(0, 4, 9), TV1from = tclip(0, 5.6, 10.6);
const TAUD = (() => { const a = wave(70, 23, 1.6); return a.map((v, i) => { const x = TX(3) + i * ((TX(10) - TX(3) - 8) / 69); return `M${x.toFixed(2)} ${(TLY(1) + 21 - v * 11).toFixed(2)} V${(TLY(1) + 21 + v * 11).toFixed(2)}`; }).join(' '); })();
const tc = sec => { const f = Math.floor(sec * 30 + 1e-6); return `00:00:${String(Math.floor(f / 30)).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`; };
export function EditingTimeline({ uid = 'editing-timeline' }) {
  const v0 = tclip(0, 0, 4), a0 = tclip(1, 0, 10), c0 = tclip(2, .2, 3.6), c1 = tclip(2, 4.2, 8.4);
  return (
    <Frame uid={uid} w={W} h={H} label="Editing timeline with a clip snapping into place and a scrubbing playhead" svg={<>
      <Surf id="card" x={40} y={46} w={400} h={256} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="tile" x={56} y={62} w={36} h={36} r={11} tone="tint" elev={0} seed={[74, 80]} order={1} />
      <Surf id="tc" x={316} y={66} w={108} h={28} r={9} tone="ink" elev={1} seed={[370, 80]} at={.9} />
      <Draw id="ticks" d={Array.from({ length: 13 }, (_, i) => `M${TX(i) + .5} ${i % 2 ? 128 : 124} V132`).join(' ')} stroke="#cbd5e1" width={1} at={.9} dur={.7} />
      {TRACKS.map((_, k) => <Surf key={k} id={`lane${k}`} x={TX(0) - 4} y={TLY(k)} w={TX(12) - TX(0) + 8} h={42} r={10} tone="muted" elev={0} seed={[TX(0) + 10, TLY(k) + 21]} at={.95 + k * .08} />)}
      <Surf id="v0" x={v0.x} y={v0.y} w={v0.w} h={v0.h} r={8} tone="blue" elev={1} seed={[v0.x + 12, v0.y + 16]} at={1.15} />
      <Surf id="a0" x={a0.x} y={a0.y} w={a0.w} h={a0.h} r={8} tone="green" elev={1} seed={[a0.x + 12, a0.y + 16]} at={1.25} />
      <Draw id="aw" d={TAUD} stroke="rgba(255,255,255,.55)" width={1.6} at={1.6} dur={.8} />
      <Surf id="c0" x={c0.x} y={c0.y} w={c0.w} h={c0.h} r={8} tone="amberTint" elev={0} seed={[c0.x + 12, c0.y + 16]} at={1.35} />
      <Surf id="v1" x={TV1from.x} y={TV1from.y} w={TV1from.w} h={TV1from.h} r={8} tone="blue" elev={3} seed={[TV1from.x + 60, TV1from.y + 16]} at={1.0} />
      <g className="snapline" opacity="0"><path d={`M${TX(4)} 132 V${TLY(2) + 42}`} stroke={BLUE} strokeWidth="1.5" strokeDasharray="3 3" /></g>
      <Surf id="c1" x={c1.x} y={c1.y} w={c1.w} h={c1.h} r={8} tone="amberTint" elev={0} seed={[c1.x + 10, c1.y + 16]} at={2.78} />
      <Pop id="ph" at={1.5} origin="50% 0%"><g className="tph"><path d={`M${TX(0)} 130 V${TLY(2) + 46}`} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /><path d={`M${TX(0) - 5.5} 120 H${TX(0) + 5.5} V126 L${TX(0)} 131.5 L${TX(0) - 5.5} 126 Z`} fill="#ef4444" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></g></Pop>
    </>}>
      <Layer id="ti" kind="icon" x={56} y={62} w={36} h={36} at={.8} align="center"><Icon name="scissors" size={19} color={DEEP} id="scissors" /></Layer>
      <Layer id="t" x={104} y={60} w={200} h={22} at={.72}><Text size={15.5} weight={600}>Visit recap edit</Text></Layer>
      <Layer id="s" x={104} y={80} w={200} h={20} at={.78}><Text size={12.5} color={SUB} className="tnum">3 tracks · 30 fps</Text></Layer>
      <Layer id="tcv" x={316} y={66} w={108} h={28} at={1.05} align="center"><Text size={12.5} weight={600} color="#fff" className="tnum tcode">00:00:00:00</Text></Layer>
      {[0, 2, 4, 6, 8, 10, 12].map(sec => <Layer key={sec} id={`rl${sec}`} x={TX(sec) - 15} y={104} w={30} h={14} at={.95 + sec * .01} align="center"><Text size={10} weight={600} color={MUTE} className="tnum">{sec}s</Text></Layer>)}
      {TRACKS.map(([ic, l], k) => <Layer key={k} id={`tl${k}`} x={52} y={TLY(k)} w={76} h={42} at={1.0 + k * .08} className="gap6"><Icon name={ic} size={15} color={SUB} id={`tk${k}`} /><Text size={12} weight={600} color={BODY}>{l}</Text></Layer>)}
      <Layer id="v0l" x={v0.x + 10} y={v0.y} w={v0.w - 16} h={32} at={1.35}><Text size={11.5} weight={600} color="#fff">Intake</Text></Layer>
      <Layer id="a0l" x={a0.x + 10} y={a0.y} w={70} h={32} at={1.45}><Text size={11.5} weight={600} color="#fff">Narration</Text></Layer>
      <Layer id="c0l" x={c0.x + 8} y={c0.y} w={c0.w - 12} h={32} at={1.5}><Text size={11} weight={600} color="#a16207">Hi, I am Avery</Text></Layer>
      <Layer id="v1l" x={TV1from.x + 10} y={TV1from.y} w={TV1from.w - 16} h={32} at={1.3}><Text size={11.5} weight={600} color="#fff">Garden walk</Text></Layer>
      <Layer id="c1l" x={c1.x + 8} y={c1.y} w={c1.w - 12} h={32} at={3.0}><Text size={11} weight={600} color="#a16207">Our morning walk</Text></Layer>
    </Frame>
  );
}
EditingTimeline.motion = c => {
  c.icon('scissors', 0, 35, .85, 1.0);
  const dx = TV1.x - TV1from.x, E = 'power3.inOut';
  c.cursor([{ at: 1.95, x: TV1from.x + TV1from.w - 14, y: TV1from.y + 26, press: true }, { at: 2.55, x: TV1from.x + TV1from.w - 14 + dx - 10, y: TV1from.y + 26 }]);
  c.press('v1', '[data-layer="v1l"] .fc-carrier', 1.95, .5);
  // Drag left past the edit point, then the clip snaps to it with a short overshoot.
  c.reshape('v1', rect(TV1.x - 10, TV1.y, TV1.w, TV1.h, 8), 2.09, .46, E);
  // The label rides on layout position (not a composited transform) so every seek rasterizes it identically.
  const L0 = TV1from.x + 10;
  c.fromTo('[data-layer="v1l"]', { left: L0 }, { left: L0 + dx - 10, duration: .46, ease: E }, 2.09);
  c.reshape('v1', TV1, 2.58, .32, 'back.out(2.2)');
  c.fromTo('[data-layer="v1l"]', { left: L0 + dx - 10 }, { left: L0 + dx, duration: .32, ease: 'back.out(2.2)' }, 2.58);
  c.fromTo('.snapline', { opacity: 0 }, { opacity: 1, duration: .12 }, 2.5);
  c.fromTo('.snapline', { opacity: 1 }, { opacity: 0, duration: .3 }, 2.95);
  const ph = c.q('.tph'), code = c.q('.tcode'), PE = c.ease('power2.inOut');
  c.after(t => {
    const sec = TPHS * PE(cl((t - TPH0) / (TPH1 - TPH0)));
    ph.setAttribute('transform', `translate(${(sec * 24.25).toFixed(3)} 0)`);
    code.textContent = tc(sec);
  });
};
Object.assign(EditingTimeline, {
  id: 'editing-timeline', title: 'Editing timeline', category: CAT, w: W, h: H, focus: { x: 250, y: 190 }, push: 1.05, orbit: .85, exit: [240, 180],
  summary: 'Video, audio and caption tracks form with their clips. A clip is dragged to an edit point and snaps, then the playhead scrubs with a tabular timecode.',
  usage: `<EditingTimeline />`, icons: ['scissors', 'video', 'music', 'type']
});

// ---------------------------------------------------------------- Canvas layers
const CC = [162, 206], CLAY = [['link', 'Button'], ['type', 'Headline'], ['image', 'Photo'], ['layout', 'Frame']];
const COFF = [70, 23, -23, -70], CPR = i => 86 + i * 40, CE0 = 2.08, CE1 = 2.72, CR0 = 3.36, CR1 = 3.96;
const plate = <rect x={CC[0] - 76} y={CC[1] - 58} width="152" height="116" rx="10" />;
export function CanvasLayers({ uid = 'canvas-layers' }) {
  const [x, y] = CC;
  return (
    <Frame uid={uid} w={W} h={H} label="Design canvas layers exploding into a 3D stack and restacking" svg={<>
      <Surf id="canvas" x={34} y={30} w={256} h={300} r={22} tone="white" elev={3} seed={[166, 180]} />
      <Surf id="panel" x={300} y={30} w={136} h={300} r={20} tone="white" elev={2} seed={[368, 180]} order={1} />
      <Surf id="hl" x={308} y={CPR(0)} w={120} h={34} r={9} tone="tint" elev={0} seed={[322, CPR(0) + 17]} at={1.25} />
      <Surf id="btn" x={308} y={284} w={120} h={32} r={10} tone="blue" elev={2} seed={[368, 300]} at={1.1} />
      <linearGradient id={`${uid}-photo`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfdbfe" /><stop offset="1" stopColor="#dbeafe" /></linearGradient>
      <Pop id="art" at={1.0} origin="50% 50%">
        <g className="cl cl0"><rect x={x - 76} y={y - 58} width="152" height="116" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="1" /><rect className="pl" opacity="0" x={x - 76} y={y - 58} width="152" height="116" rx="10" fill="none" stroke="rgba(45,125,255,.55)" strokeWidth="1" /></g>
        <g className="cl cl1"><g className="pl" opacity="0" fill="rgba(248,251,255,.42)" stroke="rgba(45,125,255,.55)" strokeWidth="1">{plate}</g><rect x={x - 66} y={y - 48} width="132" height="52" rx="7" fill={`url(#${uid}-photo)`} /><circle cx={x + 38} cy={y - 30} r="8" fill="#fbbf24" /><path d={`M${x - 66} ${y - 6} L${x - 34} ${y - 30} L${x - 10} ${y - 14} L${x + 12} ${y - 26} L${x + 66} ${y - 2} V${y - 3} Q${x + 66} ${y + 4} ${x + 59} ${y + 4} H${x - 59} Q${x - 66} ${y + 4} ${x - 66} ${y - 3} Z`} fill="#60a5fa" /></g>
        <g className="cl cl2"><g className="pl" opacity="0" fill="rgba(248,251,255,.42)" stroke="rgba(45,125,255,.55)" strokeWidth="1">{plate}</g><rect x={x - 66} y={y + 12} width="92" height="8" rx="4" fill="#334155" /><rect x={x - 66} y={y + 26} width="62" height="6" rx="3" fill="#cbd5e1" /><rect x={x - 66} y={y + 38} width="44" height="6" rx="3" fill="#cbd5e1" /></g>
        <g className="cl cl3"><g className="pl" opacity="0" fill="rgba(248,251,255,.42)" stroke="rgba(45,125,255,.55)" strokeWidth="1">{plate}</g><rect x={x + 16} y={y + 30} width="50" height="18" rx="9" fill={BLUE} /><rect x={x + 27} y={y + 37.5} width="28" height="3" rx="1.5" fill="#fff" /></g>
      </Pop>
    </>}>
      <Layer id="t" x={54} y={46} w={200} h={22} at={.72}><Text size={15.5} weight={600}>Canvas</Text></Layer>
      <Layer id="s" x={54} y={66} w={220} h={20} at={.78}><Text size={12.5} color={SUB}>Home visit card · 100%</Text></Layer>
      <Layer id="pt" x={314} y={46} w={116} h={24} at={.85} className="gap6"><Icon name="layers" size={17} color={DEEP} id="layers" /><Text size={13.5} weight={600}>Layers</Text></Layer>
      {CLAY.map(([ic, l], i) => <Layer key={l} id={`lr${i}`} x={318} y={CPR(i)} w={104} h={34} at={1.1 + i * .06} className="gap8"><Icon name={ic} size={16} color={i ? SUB : DEEP} id={`li${i}`} /><Text size={12.5} weight={600} color={i ? BODY : DEEP} className={`ln ln${i}`}>{l}</Text></Layer>)}
      <Layer id="pf" x={314} y={252} w={116} h={18} at={1.3}><Text size={11} weight={500} color={MUTE} className="tnum">4 layers · 1 artboard</Text></Layer>
      <Layer id="bl" x={308} y={284} w={120} h={32} at={1.25} align="center"><Text size={12.5} weight={600} color="#fff" className="bt">Explode view</Text></Layer>
    </Frame>
  );
}
CanvasLayers.motion = c => {
  c.icon('layers', 0, 39, .9, 1.0);
  c.cursor([{ at: 1.62, x: 302, y: 262 }, { at: 1.95, x: 404, y: 306, press: true }, { at: 3.3, x: 396, y: 308, press: true }]);
  c.press('btn', '[data-layer="bl"] .fc-carrier', 1.95, .8);
  c.press('btn', '[data-layer="bl"] .fc-carrier', 3.3, .8);
  c.swap('.bt', ['Explode view', 'Restack', 'Explode view'], [2.02, 3.38]);
  // Panel focus walks the stack from top to bottom while the layers are apart.
  [1, 2, 3].forEach(i => c.reshape('hl', rect(308, CPR(i), 120, 34, 9), 2.52 + (i - 1) * .24, .26, 'power3.inOut'));
  c.reshape('hl', rect(308, CPR(0), 120, 34, 9), 3.36, .5, 'power3.inOut');
  const HT = [2.66, 2.9, 3.14, 3.5];
  const L = [0, 1, 2, 3].map(k => c.q(`.cl${k}`)), P = c.qa('.pl'), N = c.qa('.ln'), EI = c.ease('power3.inOut');
  const hi = t => { let h = 0; if (t >= HT[0] && t < HT[3]) h = t >= HT[2] ? 3 : t >= HT[1] ? 2 : 1; return h; };
  c.after(t => {
    const p = t < CR0 ? EI(cl((t - CE0) / (CE1 - CE0))) : 1 - EI(cl((t - CR0) / (CR1 - CR0)));
    // Each layer group is its own carrier: lift, then an isometric projection about the artboard centre.
    L.forEach((g, k) => g.setAttribute('transform', `translate(${CC[0]} ${(CC[1] + COFF[k] * p).toFixed(3)}) scale(1 ${(1 - .58 * p).toFixed(4)}) rotate(${(-42 * p).toFixed(3)}) translate(${-CC[0]} ${-CC[1]})`));
    const h = hi(t);
    P.forEach((e, k) => { e.setAttribute('opacity', p.toFixed(3)); const on = h && k === 3 - h; e.setAttribute('stroke', on ? BLUE : 'rgba(45,125,255,.55)'); e.setAttribute('stroke-width', on ? '2' : '1'); });
    N.forEach((e, i) => { e.style.color = i === h ? DEEP : BODY; });
  });
  CLAY.forEach((_, i) => i && c.icon(`li${i}`, 0, 30, 2.52 + (i - 1) * .24, .5));
};
Object.assign(CanvasLayers, {
  id: 'canvas-layers', title: 'Canvas layers', category: CAT, w: W, h: H, focus: { x: 236, y: 190 }, push: 1.03, orbit: .8, exit: [240, 180],
  summary: 'A design artboard separates into an exploded isometric stack, one carrier per layer, while the layers panel walks the stack, then everything restacks.',
  usage: `<CanvasLayers />`, icons: ['layers', 'link', 'type', 'image', 'layout']
});

// ---------------------------------------------------------------- Sound placement
const SBX = k => 82 + k * 45, SLY = 156, SLH = 108, SN = 64, SXW = i => 64 + i * (352 / (SN - 1)), SWA = wave(SN, 41, 1.3);
const CUES = [[1, 'Whoosh', BLUE, '#eaf2ff', DEEP, 2.0], [3, 'Click', '#f59e0b', '#fef3c7', '#a16207', 2.45], [6, 'Chime', '#16a34a', '#dcfce7', '#15803d', 2.9]];
const SOFF = 13, SDROP = 54;
export function SoundPlacement({ uid = 'sound-placement' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Sound effect markers dropping onto beat lines" svg={<>
      <Surf id="card" x={40} y={46} w={400} h={270} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="tile" x={56} y={62} w={36} h={36} r={11} tone="tint" elev={0} seed={[74, 80]} order={1} />
      <Surf id="cnt" x={346} y={67} w={78} h={26} r={13} tone="tint" elev={0} seed={[385, 80]} at={.95} />
      <Surf id="lane" x={56} y={SLY} w={368} h={SLH} r={14} tone="muted" elev={0} seed={[240, SLY + 54]} order={2} />
      <g className="beats">{Array.from({ length: 8 }, (_, k) => <path key={k} className={`beat beat${k}`} d={`M${SBX(k) + .5} ${SLY + 8} V${SLY + SLH - 8}`} stroke={k % 4 ? '#cbd5e1' : '#94a3b8'} strokeWidth="1.2" strokeDasharray="3 4" />)}</g>
      {CUES.map(([k, , col], i) => <rect key={i} className={`band band${i}`} x={SBX(k) - 10} y={SLY + 6} width="20" height={SLH - 12} rx="7" fill={col} opacity="0" />)}
      <g>{SWA.map((a, i) => <rect key={i} className="sw" x={(SXW(i) - 1.5).toFixed(2)} y={(SLY + 56 - a * 36).toFixed(2)} width="3" height={(a * 72).toFixed(2)} rx="1.5" fill="#a9b8cc" />)}</g>
      {CUES.map(([k, , col], i) => <Pop key={i} id={`pin${i}`} at={CUES[i][5]} origin="50% 100%"><g className={`pin pin${i}`}><path d={`M${SBX(k) + SOFF} ${SLY - 10} V${SLY + SLH - 6}`} stroke={col} strokeWidth="2" strokeLinecap="round" /><circle cx={SBX(k) + SOFF} cy={SLY - 10} r="6" fill="#fff" stroke={col} strokeWidth="3" /><circle cx={SBX(k) + SOFF} cy={SLY + SLH - 6} r="3" fill={col} /></g></Pop>)}
    </>}>
      <Layer id="ti" kind="icon" x={56} y={62} w={36} h={36} at={.8} align="center"><Icon name="music" size={19} color={DEEP} id="music" /></Layer>
      <Layer id="t" x={104} y={60} w={200} h={22} at={.72}><Text size={15.5} weight={600}>Sound placement</Text></Layer>
      <Layer id="s" x={104} y={80} w={200} h={20} at={.78}><Text size={12.5} color={SUB} className="tnum">Garden walk · 96 BPM</Text></Layer>
      <Layer id="ct" x={346} y={67} w={78} h={26} at={1.1} align="center"><Text size={12} weight={600} color={DEEP} className="tnum cues">0 cues</Text></Layer>
      <Layer id="bn" x={SBX(0) - 20} y={SLY + SLH + 6} w={SBX(7) - SBX(0) + 40} h={16} at={1.2}><span style={{ position: 'relative', display: 'block', width: '100%', height: 16 }}>{Array.from({ length: 8 }, (_, k) => <Text key={k} size={10.5} weight={600} color={k % 4 ? MUTE : BODY} className="tnum" style={{ position: 'absolute', left: SBX(k) - SBX(0) + 20, top: 0, transform: 'translateX(-50%)' }}>{`${Math.floor(k / 4) + 1}.${k % 4 + 1}`}</Text>)}</span></Layer>
      {CUES.map(([k, l, col, bg, fg, at], i) => <Layer key={i} id={`cl${i}`} x={SBX(k) + SOFF - 40} y={SLY - 46} w={80} h={24} at={at + .22} align="center"><span style={{ ...pill(bg, fg), height: 24, boxShadow: '0 4px 10px rgba(29,78,216,.10)' }}><span style={dot(col)} />{l}</span></Layer>)}
    </Frame>
  );
}
SoundPlacement.motion = c => {
  c.icon('music', 0, 39, .9, 1.0);
  c.qa('.sw').forEach((b, i) => {
    c.fromTo(b, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: .5, ease: 'back.out(2)' }, 1.05 + i * .01);
    c.fromTo(b, { scaleY: 1, transformOrigin: '50% 50%' }, { scaleY: 0, duration: .24, ease: 'power2.in' }, c.T.collapse - .04 + outIn(i, SN));
  });
  c.fromTo('.beats', { opacity: 0 }, { opacity: 1, duration: .5 }, 1.0);
  c.fromTo('.beats', { opacity: 1 }, { opacity: 0, duration: .3 }, c.T.collapse);
  const beats = c.qa('.beat');
  CUES.forEach(([, , , , , at], i) => {
    // Drop onto the lane slightly late, then snap left onto the beat line.
    c.fromTo(`.pin${i}`, { y: -SDROP }, { y: 0, duration: .42, ease: 'bounce.out' }, at);
    c.fromTo(`.pin${i}`, { x: 0 }, { x: -SOFF, duration: .26, ease: 'back.out(2.4)' }, at + .46);
    c.fromTo(`[data-layer="cl${i}"]`, { x: 0 }, { x: -SOFF, duration: .26, ease: 'back.out(2.4)' }, at + .46);
  });
  c.swap('.cues', ['0 cues', '1 cue', '2 cues', '3 cues'], CUES.map(q => q[5] + .5));
  const bands = c.qa('.band');
  c.after(t => CUES.forEach((q, i) => bands[i].setAttribute('opacity', (.13 * cl((t - q[5] - .5) / .25) * (1 - cl((t - c.T.collapse) / .25))).toFixed(3))));
  c.after(t => beats.forEach((b, k) => {
    const q = CUES.find(e => e[0] === k), on = q && t >= q[5] + .5 && t < c.T.collapse;
    b.setAttribute('stroke', on ? q[2] : k % 4 ? '#cbd5e1' : '#94a3b8');
    b.setAttribute('stroke-dasharray', on ? 'none' : '3 4');
  }));
};
Object.assign(SoundPlacement, {
  id: 'sound-placement', title: 'Sound placement', category: CAT, w: W, h: H, focus: { x: 240, y: 190 }, push: 1.05, exit: [240, 180],
  summary: 'Sound effect pins drop onto a waveform track a touch late, then snap onto their beat lines, which light up as each cue is counted.',
  usage: `<SoundPlacement />`, icons: ['music']
});

export const LIST_E = [InboxRecording, CalendarView, ClockOverlay, WaveformAnimation, VoiceComparison, GeneratedClip, EditingTimeline, CanvasLayers, SoundPlacement];
