import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', CYAN = '#0ea5e9';
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
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
// Sample y for a given x on a rendered path (deterministic, used for chart markers).
function sampler(path) {
  const L = path.getTotalLength(), pts = [];
  for (let i = 0; i <= 400; i++) { const p = path.getPointAtLength(L * i / 400); pts.push([p.x, p.y]); }
  return x => { let a = pts[0], b = pts[pts.length - 1]; for (let i = 1; i < pts.length; i++) if (pts[i][0] >= x) { a = pts[i - 1]; b = pts[i]; break; } const t = b[0] === a[0] ? 0 : (x - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * t; };
}

// ---------------------------------------------------------------- KPI card with sparkline
const HOURS = [5.5, 6, 4.5, 7.5, 6.5, 4, 4.5];
const KX = i => 94 + i * 48.67, KY = v => 268 - v / 8 * 76;
export function KpiCard({ uid = 'kpi', label = 'Hours this week', values = HOURS }) {
  const pts = values.map((v, i) => [KX(i), KY(v)]);
  const line = smooth(pts);
  return (
    <Frame uid={uid} w={W} h={H} label={`${label}: 38.5 hours`} svg={<>
      <Surf id="card" x={70} y={46} w={340} h={268} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="delta" x={300} y={70} w={86} h={28} r={14} tone="greenTint" elev={0} seed={[314, 84]} at={1.25} />
      <g className="area"><path d={`${line} L${KX(6)},268 L${KX(0)},268 Z`} fill={`url(#${uid}-area)`} /></g>
      <Draw id="base" d="M94 268.5 H386" stroke="#eef2f6" width={1} at={1.0} />
      <Draw id="line" d={line} stroke="#2d7dff" width={2.5} at={1.15} dur={1.0} />
      <Draw id="guide" d={`M${KX(3)} ${KY(7.5) + 6} V268`} stroke="#cbd5e1" width={1} at={2.42} dur={.3} />
      <Pop id="mark" at={2.4}><circle cx={KX(3)} cy={KY(7.5)} r={5.5} fill="#fff" stroke="#2d7dff" strokeWidth="2.5" /></Pop>
      <Surf id="tip" x={KX(3) - 46} y={KY(7.5) - 46} w={92} h={30} r={9} tone="ink" elev={2} seed={[KX(3), KY(7.5) - 10]} at={2.38} />
    </>}>
      <Layer id="l" x={94} y={66} w={200} h={22} at={.75}><Text size={13.5} weight={600} color={SUB}>{label}</Text></Layer>
      <Layer id="v" x={94} y={90} w={220} h={56} at={.82} className="gap6"><span className="baseline"><Text size={44} weight={700} className="tnum" style={{ letterSpacing: '-.035em' }}>0.0</Text><Text size={16} weight={500} color={SUB}>hrs</Text></span></Layer>
      <Layer id="d" x={300} y={70} w={86} h={28} at={1.4} align="center" className="gap6"><Icon name="trendingUp" size={16} color="#16a34a" id="trend" /><Text size={12.5} weight={600} color="#15803d" className="tnum">+6.2%</Text></Layer>
      <Layer id="days" x={94 - 24} y={274} w={292 + 48} h={20} at={1.1}><span className="days">{DAYS.map((d, i) => <Text key={i} size={11} weight={600} color={i === 3 ? DEEP : '#94a3b8'}>{d}</Text>)}</span></Layer>
      <Layer id="tt" x={KX(3) - 46} y={KY(7.5) - 46} w={92} h={30} at={2.5} align="center"><Text size={12.5} weight={600} color="#fff" className="tnum">Thu · 7.5 h</Text></Layer>
    </Frame>
  );
}
KpiCard.motion = c => {
  c.count('[data-layer="v"] .tnum', 0, 38.5, .9, 1.3, v => v.toFixed(1));
  c.fromTo('.area', { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .9, ease: 'power3.out' }, 1.5);
  c.fromTo('.area', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: 0, duration: .35, ease: 'power2.in' }, c.T.collapse);
  c.icon('trend', 10, 39, 1.45, .9);
  c.cursor([{ at: 2.3, x: KX(3) + 10, y: KY(7.5) + 22 }]);
};
Object.assign(KpiCard, {
  id: 'kpi', title: 'KPI card', category: 'Data display', w: W, h: H, focus: { x: 240, y: 190 }, push: 1.1, exit: [240, 180],
  summary: 'A tabular metric that counts up beside a native trend icon, with a sparkline drawn on and an area that rises from the baseline.',
  usage: `<KpiCard label="Hours this week" values={[5.5, 6, 4.5, 7.5, 6.5, 4, 4.5]} />`, icons: ['trendingUp']
});

// ---------------------------------------------------------------- Bar chart
const VISITS = [18, 24, 21, 30, 27, 12, 9];
const BX = i => 76 + i * 50, BH = v => v * 5, BASE = 286;
export function BarChart({ uid = 'bars', values = VISITS }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Visits completed this week" svg={<>
      <Surf id="card" x={40} y={26} w={400} h={308} r={22} tone="white" elev={3} seed={[240, 180]} />
      {[0, 1, 2].map(i => <Draw key={i} id={`g${i}`} d={`M64 ${BASE - i * 50 + .5} H416`} stroke={i ? '#f1f5f9' : '#e2e8f0'} width={1} at={.8 + i * .06} />)}
      {values.map((v, i) => <Surf key={i} id={`bar${i}`} x={BX(i)} y={BASE - BH(v)} w={32} h={BH(v)} r={8} tone="blue" elev={0} seed={[BX(i) + 16, BASE - 4]} at={1.0 + i * .07} />)}
      <Surf id="tip" x={BX(3) - 26} y={BASE - BH(30) - 44} w={84} h={32} r={9} tone="ink" elev={2} seed={[BX(3) + 16, BASE - BH(30) - 8]} at={2.4} />
    </>}>
      <Layer id="t" x={64} y={44} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Visits completed</Text></Layer>
      <Layer id="s" x={64} y={66} w={260} h={20} at={.76}><Text size={12.5} color={SUB} className="tnum">This week · 141 total</Text></Layer>
      {values.map((v, i) => i !== 3 && <Layer key={i} id={`v${i}`} x={BX(i) - 8} y={BASE - BH(v) - 22} w={48} h={18} at={1.75 + i * .05} align="center"><Text size={11.5} weight={600} color={BODY} className="tnum">{v}</Text></Layer>)}
      <Layer id="days" x={BX(0) - 9} y={BASE + 8} w={350} h={18} at={1.1}><span className="days days50">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => <Text key={i} size={11} weight={600} color={i === 3 ? DEEP : '#94a3b8'}>{d}</Text>)}</span></Layer>
      <Layer id="tt" x={BX(3) - 26} y={BASE - BH(30) - 44} w={84} h={32} at={2.52} align="center"><Text size={12.5} weight={600} color="#fff" className="tnum">30 visits</Text></Layer>
    </Frame>
  );
}
BarChart.motion = c => {
  c.cursor([{ at: 2.3, x: BX(3) + 22, y: BASE - 60 }]);
  [0, 1, 2, 4, 5, 6].forEach(i => c.fromTo(`[data-surf="bar${i}"]`, { opacity: 1 }, { opacity: .38, duration: .3 }, 2.36));
  [0, 1, 2, 4, 5, 6].forEach(i => c.fromTo(`[data-surf="bar${i}"]`, { opacity: .38 }, { opacity: 1, duration: .3 }, c.T.collapse - .1));
  c.reshape('bar3', rect(BX(3) - 3, BASE - BH(30) - 4, 38, BH(30) + 4, 9), 2.36, .45, 'back.out(1.6)');
};
Object.assign(BarChart, {
  id: 'bars', title: 'Bar chart', category: 'Data display', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.08, exit: [240, 180],
  summary: 'Each bar grows out of the baseline in sequence. Hovering lifts the focused bar while the rest step back behind a tooltip.',
  usage: `<BarChart values={[18, 24, 21, 30, 27, 12, 9]} />`, icons: []
});

// ---------------------------------------------------------------- Line chart with crosshair
const A = [92, 94, 91, 96, 95, 97, 98], B = [88, 90, 93, 89, 92, 94, 93];
const LX = i => 76 + i * 54.67, LY = v => 286 - (v - 80) / 20 * 160;
const WEEKS = ['Wk 40', 'Wk 41', 'Wk 42', 'Wk 43', 'Wk 44', 'Wk 45', 'Wk 46'];
export function LineChart({ uid = 'line' }) {
  const la = smooth(A.map((v, i) => [LX(i), LY(v)])), lb = smooth(B.map((v, i) => [LX(i), LY(v)]));
  return (
    <Frame uid={uid} w={W} h={H} label="Medication adherence by week" svg={<>
      <Surf id="card" x={40} y={26} w={400} h={308} r={22} tone="white" elev={3} seed={[240, 180]} />
      {[0, 1, 2, 3].map(i => <Draw key={i} id={`g${i}`} d={`M64 ${LY(80 + i * 5) + .5} H416`} stroke={i ? '#f1f5f9' : '#e2e8f0'} width={1} at={.8 + i * .05} />)}
      <g className="area"><path d={`${la} L${LX(6)},${LY(80)} L${LX(0)},${LY(80)} Z`} fill={`url(#${uid}-area)`} /></g>
      <Draw id="b" className="lb" d={lb} stroke={CYAN} width={2.5} at={1.2} dur={1.0} />
      <Draw id="a" className="la" d={la} stroke="#2d7dff" width={2.5} at={1.05} dur={1.0} />
      <g className="xh"><Draw id="xl" d={`M${LX(2)} 138 V286`} stroke="#94a3b8" width={1} at={2.05} dur={.3} />
        <Pop id="ma" at={2.15}><circle className="ma" cx={LX(2)} cy={LY(A[2])} r={5} fill="#fff" stroke="#2d7dff" strokeWidth="2.5" /></Pop>
        <Pop id="mb" at={2.2}><circle className="mb" cx={LX(2)} cy={LY(B[2])} r={5} fill="#fff" stroke={CYAN} strokeWidth="2.5" /></Pop></g>
      <Surf id="tip" x={LX(2) - 64} y={90} w={128} h={46} r={10} tone="ink" elev={2} seed={[LX(2), 136]} at={1.25} />
    </>}>
      <Layer id="t" x={64} y={40} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Medication adherence</Text></Layer>
      <Layer id="lg" x={64} y={62} w={240} h={20} at={.78} className="gap12"><span className="legend"><i style={{ background: '#2d7dff' }} />Maple House</span><span className="legend"><i style={{ background: CYAN }} />Cedar Court</span></Layer>
      <Layer id="tt" x={LX(2) - 64} y={90} w={128} h={46} at={1.6} align="center"><span className="stack center"><Text size={11} weight={600} color="#94a3b8" className="wk tnum">{WEEKS[2]}</Text><Text size={13.5} weight={700} color="#fff" className="vals tnum">{A[2]}% · {B[2]}%</Text></span></Layer>
      <Layer id="ax" x={LX(0) - 22} y={292} w={LX(6) - LX(0) + 44} h={18} at={1.0}><span className="days days55">{WEEKS.map(w => <Text key={w} size={10.5} weight={600} color="#94a3b8" className="tnum">{w}</Text>)}</span></Layer>
    </Frame>
  );
}
LineChart.motion = c => {
  const ease = 'power2.inOut', dx = LX(5) - LX(2);
  c.fromTo('.area', { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .9, ease: 'power3.out' }, 1.6);
  c.fromTo('.area', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: 0, duration: .35, ease: 'power2.in' }, c.T.collapse);
  c.cursor([{ at: 2.35, x: LX(2) + 8, y: 250 }, { at: 3.45, x: LX(5) + 8, y: 250 }]);
  const xh = c.q('.xh'), ma = c.q('.ma'), mb = c.q('.mb'), wk = c.q('.wk'), vals = c.q('.vals');
  const sa = sampler(c.q('.la')), sb = sampler(c.q('.lb')), E = c.ease(ease);
  c.reshape('tip', rect(LX(5) - 64, 90, 128, 46, 10), 2.45, 1.0, ease);
  c.fromTo('[data-layer="tt"]', { x: 0 }, { x: dx, duration: 1.0, ease }, 2.45);
  c.after(t => {
    const x = LX(2) + dx * E(Math.min(1, Math.max(0, (t - 2.4) / 1.0)));
    xh.setAttribute('transform', `translate(${(x - LX(2)).toFixed(3)} 0)`);
    ma.setAttribute('cy', sa(x).toFixed(3)); mb.setAttribute('cy', sb(x).toFixed(3));
    const i = Math.round((x - LX(0)) / 54.67); wk.textContent = WEEKS[i]; vals.textContent = `${A[i]}% · ${B[i]}%`;
  });
};
Object.assign(LineChart, {
  id: 'line', title: 'Line chart', category: 'Data display', w: W, h: H, focus: { x: 250, y: 190 }, push: 1.08, exit: [240, 180],
  summary: 'Two smooth series draw on over a rising area. A crosshair glides between weeks with markers riding each curve and a tooltip in tow.',
  usage: `<LineChart />`, icons: []
});

// ---------------------------------------------------------------- Activity timeline
const EVENTS = [['logIn', 'Avery clocked in', '7:02 AM · Inside geofence'], ['fileText', 'Morning note added', '8:42 AM · 2 attachments'], ['userCheck', 'Medication pass verified', '9:05 AM · Jordan P.'], ['send', 'Report sent to supervisor', 'Just now']];
const EY = i => 98 + i * 58;
export function Timeline({ uid = 'timeline', events = EVENTS }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Activity timeline" svg={<>
      <Surf id="card" x={60} y={18} w={360} h={324} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="rail" d={`M104 ${EY(0) + 16} V${EY(3) + 16}`} stroke="#e2e8f0" width={2} at={.9} dur={.9} />
      {events.map((_, i) => <Surf key={i} id={`n${i}`} x={86} y={EY(i)} w={36} h={36} r={18} tone={i === 3 ? 'blue' : 'tint'} elev={i === 3 ? 2 : 0} seed={[104, EY(i) + 18]} at={i === 3 ? 2.35 : 1.0 + i * .14} />)}
      <Pop id="pulse" at={2.6} ease="power2.out"><circle className="pulse-ring" cx={104} cy={EY(3) + 18} r={18} fill="none" stroke="#2d7dff" strokeWidth="2" /></Pop>
    </>}>
      <Layer id="t" x={84} y={34} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Today at Maple House</Text></Layer>
      <Layer id="s" x={84} y={56} w={260} h={20} at={.76} className="gap6"><span className="live-dot" /><Text size={12.5} color={SUB}>Live activity · 4 events</Text></Layer>
      {events.map(([ic, t, m], i) => (
        <React.Fragment key={t}>
          <Layer id={`i${i}`} kind="icon" x={86} y={EY(i)} w={36} h={36} at={i === 3 ? 2.55 : 1.15 + i * .14} align="center"><Icon name={ic} size={18} color={i === 3 ? '#fff' : DEEP} id={ic} /></Layer>
          <Layer id={`x${i}`} x={136} y={EY(i) - 4} w={260} h={44} at={i === 3 ? 2.62 : 1.2 + i * .14}><span className="stack"><Text size={14} weight={600}>{t}</Text><Text size={12} color={SUB}>{m}</Text></span></Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
Timeline.motion = c => {
  c.icon('logIn', 0, 33, 1.2, .8); c.icon('userCheck', 0, 39, 1.5, .9);
  c.icon('send', 0, 39, 2.6, 1.1);
  c.fromTo('.pulse-ring', { scale: 1, opacity: .7, transformOrigin: '50% 50%' }, { scale: 1.9, opacity: 0, duration: .9, ease: 'power2.out' }, 2.6);
  c.fromTo('.pulse-ring', { scale: 1, opacity: .7, transformOrigin: '50% 50%' }, { scale: 1.9, opacity: 0, duration: .9, ease: 'power2.out' }, 3.5);
};
Object.assign(Timeline, {
  id: 'timeline', title: 'Activity timeline', category: 'Data display', w: W, h: H, focus: { x: 230, y: 215 }, push: 1.06, exit: [240, 180],
  summary: 'The rail draws down as events form in sequence. A live event arrives with a pulse while its native send icon plays.',
  usage: `<Timeline events={[['logIn','Avery clocked in','7:02 AM · Inside geofence'], ...]} />`, icons: ['logIn', 'fileText', 'userCheck', 'send']
});

// ---------------------------------------------------------------- Staff profile card
const CHIPS = [['CPR', 52], ['Med pass', 84], ['Behavior support', 132]];
const TEAM = [['JP', 'tint'], ['SR', 'greenTint'], ['LC', 'amberTint'], ['MO', 'redTint']];
export function StaffCard({ uid = 'staff', name = 'Avery Kim', role = 'DSP · Level II · Maple House' }) {
  let cx = 94;
  const chips = CHIPS.map(([l, w]) => { const x = cx; cx += w + 8; return [l, w, x]; });
  return (
    <Frame uid={uid} w={W} h={H} label={`${name} staff card`} svg={<>
      <Surf id="card" x={70} y={24} w={340} h={312} r={24} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="av" x={94} y={48} w={64} h={64} r={32} tone="tint" elev={1} seed={[126, 80]} order={1} />
      <Pop id="on" at={1.3}><circle cx={150} cy={104} r={8} fill="#fff" /><circle cx={150} cy={104} r={5} fill="#16a34a" /></Pop>
      {chips.map(([l, w, x], i) => <Surf key={l} id={`c${i}`} x={x} y={130} w={w} h={28} r={14} tone="tint" elev={0} seed={[x + 12, 144]} at={1.05 + i * .07} />)}
      <Draw id="div" d="M94 176.5 H386" stroke="#eef2f6" width={1} at={1.0} />
      {TEAM.map(([, tone], i) => <Surf key={i} id={`t${i}`} x={94 + i * 24} y={210} w={32} h={32} r={16} tone={tone} elev={1} seed={[110 + i * 24, 226]} at={1.25 + i * .06} />)}
      <Surf id="more" x={94 + 4 * 24 + 4} y={212} w={36} h={28} r={14} tone="muted" elev={0} seed={[212, 226]} at={1.5} />
      <Surf id="cta" x={94} y={266} w={292} h={48} r={14} tone="blue" elev={3} seed={[240, 290]} order={2} />
      <Surf id="ok" x={94} y={266} w={292} h={48} r={14} tone="green" elev={0} seed={[262, 290]} at={2.45} />
    </>}>
      <Layer id="ini" x={94} y={48} w={64} h={64} at={.85} align="center"><Text size={22} weight={700} color={DEEP}>AK</Text></Layer>
      <Layer id="nm" x={174} y={56} w={220} h={26} at={.85}><Text size={18} weight={600}>{name}</Text></Layer>
      <Layer id="rl" x={174} y={82} w={220} h={20} at={.9}><Text size={13} color={SUB}>{role}</Text></Layer>
      {chips.map(([l, w, x], i) => <Layer key={l} id={`ct${i}`} x={x} y={130} w={w} h={28} at={1.2 + i * .07} align="center"><Text size={12} weight={600} color={DEEP}>{l}</Text></Layer>)}
      <Layer id="tl" x={94} y={184} w={200} h={20} at={1.15}><Text size={12.5} weight={600} color={SUB}>Thursday shift team</Text></Layer>
      {TEAM.map(([ini], i) => <Layer key={ini} id={`ti${i}`} x={94 + i * 24} y={210} w={32} h={32} at={1.35 + i * .06} align="center"><Text size={10.5} weight={700} color="#334155">{ini}</Text></Layer>)}
      <Layer id="mt" x={94 + 4 * 24 + 4} y={212} w={36} h={28} at={1.6} align="center"><Text size={11} weight={700} color={BODY} className="tnum">+3</Text></Layer>
      <Layer id="go" x={94} y={266} w={292} h={48} at={1.1} align="center" className="gap8"><Icon name="userPlus" size={20} color="#fff" id="userPlus" /><Text size={15} weight={600} color="#fff">Assign to Thursday</Text></Layer>
      <Layer id="done" x={94} y={266} w={292} h={48} at={2.85} align="center" className="gap8"><Icon name="userCheck" size={20} color="#fff" id="userCheck" /><Text size={15} weight={600} color="#fff">Assigned · Thu 7a – 3p</Text></Layer>
    </Frame>
  );
}
StaffCard.motion = c => {
  c.cursor([{ at: 2.35, x: 366, y: 298, press: true }]);
  c.press('cta', '[data-layer="go"]', 2.35, 1);
  c.icon('userPlus', 0, 7, 2.38, .25);
  c.hide('go', 2.5, .2);
  c.icon('userCheck', 0, 39, 2.95, .9);
};
Object.assign(StaffCard, {
  id: 'staff', title: 'Staff card', category: 'Data display', w: W, h: H, focus: { x: 240, y: 230 }, push: 1.08, exit: [240, 180],
  summary: 'Profile with initials avatar, certifications and an overlapping team stack. Assigning grows a success surface out of the click point.',
  usage: `<StaffCard name="Avery Kim" role="DSP · Level II · Maple House" />`, icons: ['userPlus', 'userCheck']
});
