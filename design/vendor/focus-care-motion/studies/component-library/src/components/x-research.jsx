// Explainer set: research and costs. See EXPLAINER-BRIEF.md.
// Price tags, receipts, totals, research tabs, citations, filing, an illustrative warehouse
// shot, spilling pages and a fact-check stamp. Surfaces form from seeds; rigid parts move as
// whole groups (translate/rotate) and every pure motion is a function of absolute time.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', MUTE = '#94a3b8', GREEN = '#15803d';
const CAT = 'Research & costs';
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
// Pure eased value between two states over [at, at + dur] (rigid group transforms are composed
// from these in c.after, so translation and rotation stay exact under any seek order).
const tw = (t, at, dur, a, b, E) => a + (b - a) * E(cl((t - at) / dur));
const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' };
const pill = (bg, fg) => ({ background: bg, color: fg, height: 22, padding: '0 9px', borderRadius: 11, fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily: 'Inter, system-ui, sans-serif' });

// ---------------------------------------------------------------- Price tags
const PX = [120, 240, 360], RAIL = 82, TY = 116, TW = 100, TH = 150;
const PLANS = [['Basic', '$19', 'Up to 5 staff'], ['Standard', '$39', 'Up to 25 staff'], ['Plus', '$79', 'Unlimited staff']];
// Damped pendulum impulse: starts at rest with velocity, settles exponentially.
const swing = (t, t0, A, z, w) => (t < t0 ? 0 : A * Math.exp(-z * (t - t0)) * Math.sin(w * (t - t0)));
const tagAngle = (i, t) => swing(t, .9 + i * .09, [6.5, -5.5, 6][i], 2.7, 8.6) + (i === 1 ? swing(t, 2.4, -4.2, 3.1, 9.4) : 0);
export function PriceTags({ uid = 'price-tags' }) {
  const lay = (i, x, y) => ({ transformOrigin: `${PX[i] - x}px ${RAIL - y}px` });
  return (
    <Frame uid={uid} w={W} h={H} label="Three hanging price tags with the best value highlighted" svg={<>
      <Surf id="card" x={40} y={20} w={400} h={310} r={22} tone="white" elev={3} seed={[240, 175]} />
      <Draw id="rail" d={`M66 ${RAIL} H414`} stroke="#cbd5e1" width={2.5} at={.7} dur={.6} />
      {PX.map((x, i) => (
        <g key={i} className={`pt-sw pt-sw${i}`}>
          <Draw id={`str${i}`} d={`M${x} ${RAIL} V${TY + 12}`} stroke="#94a3b8" width={1.5} at={.8 + i * .06} dur={.35} />
          <Surf id={`t${i}`} x={x - TW / 2} y={TY} w={TW} h={TH} r={14} tone="white" elev={2} seed={[x, TY + 16]} at={.45 + i * .1} />
          {i === 1 && <Surf id="t1hi" x={x - 56} y={TY} w={112} h={TH + 10} r={15} tone="blue" elev={0} seed={[x + 18, TY + 128]} at={2.45} />}
          {i === 1 && <Surf id="bv" x={x - 44} y={TY + 128} w={88} h={24} r={12} tone="white" elev={1} seed={[x, TY + 140]} at={2.95} />}
          <Pop id={`hole${i}`} at={1.0 + i * .06}><circle cx={x} cy={TY + 14} r={4.5} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" /></Pop>
        </g>
      ))}
      {PX.map((x, i) => <Pop key={i} id={`pin${i}`} at={.85 + i * .06}><circle cx={x} cy={RAIL} r={4.5} fill="#64748b" /><circle cx={x} cy={RAIL} r={1.6} fill="#fff" /></Pop>)}
    </>}>
      <Layer id="ti" x={64} y={36} w={220} h={24} at={.7}><Text size={15.5} weight={600}>Choose a plan</Text></Layer>
      <Layer id="su" x={236} y={36} w={180} h={24} at={.76} align="right"><Text size={12.5} color={SUB}>Per home · billed monthly</Text></Layer>
      {PLANS.map(([n, p, f], i) => (
        <React.Fragment key={n}>
          <Layer id={`n${i}`} className={`ptl${i}`} style={lay(i, PX[i] - 50, TY + 26)} x={PX[i] - 50} y={TY + 26} w={100} h={20} at={1.05 + i * .08} align="center"><Text size={12.5} weight={600} color={SUB} className={`ptn${i}`}>{n}</Text></Layer>
          <Layer id={`p${i}`} className={`ptl${i}`} style={lay(i, PX[i] - 50, TY + 46)} x={PX[i] - 50} y={TY + 46} w={100} h={38} at={1.1 + i * .08} align="center"><Text size={30} weight={700} className={`tnum ptp${i}`} style={{ letterSpacing: '-.03em' }}>{p}</Text></Layer>
          <Layer id={`m${i}`} className={`ptl${i}`} style={lay(i, PX[i] - 50, TY + 84)} x={PX[i] - 50} y={TY + 84} w={100} h={18} at={1.15 + i * .08} align="center"><Text size={11.5} color={SUB} className={`ptm${i}`}>per month</Text></Layer>
          <Layer id={`f${i}`} className={`ptl${i}`} style={lay(i, PX[i] - 50, TY + 106)} x={PX[i] - 50} y={TY + 106} w={100} h={18} at={1.2 + i * .08} align="center"><Text size={11.5} weight={500} color={BODY} className={`ptf${i}`}>{f}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="bvt" style={lay(1, PX[1] - 44, TY + 128)} x={PX[1] - 44} y={TY + 128} w={88} h={24} at={3.12} align="center" className="ptl1 gap6"><Icon name="star" size={13} color={DEEP} fill id="star" /><Text size={11.5} weight={600} color={DEEP}>Best value</Text></Layer>
      <Layer id="ft" x={64} y={290} w={352} h={22} at={1.3} align="center" className="gap6"><Icon name="tag" size={16} color={SUB} id="tag" /><Text size={12.5} color={SUB}>Annual billing saves two months</Text></Layer>
    </Frame>
  );
}
PriceTags.motion = c => {
  const sw = c.qa('.pt-sw'), ls = [0, 1, 2].map(i => c.qa(`.ptl${i}`));
  c.after(t => {
    for (let i = 0; i < 3; i++) {
      const a = tagAngle(i, t);
      sw[i].setAttribute('transform', `rotate(${a.toFixed(3)} ${PX[i]} ${RAIL})`);
      for (const el of ls[i]) el.style.transform = `rotate(${a.toFixed(3)}deg)`;
    }
  });
  c.cursor([{ at: 2.35, x: 278, y: TY + 136, press: true }]);
  c.press('t1', null, 2.35, .6);
  c.reshape('t1', rect(PX[1] - 56, TY, 112, TH + 10, 15), 2.42, .45, 'back.out(1.3)');
  [['.ptn1', SUB, '#dbeafe'], ['.ptp1', INK, '#ffffff'], ['.ptm1', SUB, '#bfdbfe'], ['.ptf1', BODY, '#ffffff']].forEach(([s, a, b]) => c.fromTo(s, { color: a }, { color: b, duration: .35 }, 2.8));
  c.fromTo('[data-layer="f1"]', { y: 0 }, { y: -4, duration: .4, ease: 'power2.out' }, 2.8);
  c.icon('star', 0, 9, 3.2, .5);
  c.icon('tag', 0, 39, 1.4, 1.0);
};
Object.assign(PriceTags, {
  id: 'price-tags', title: 'Price tags', category: CAT, w: W, h: H, focus: { x: 240, y: 190 }, push: 1.05, orbit: .85, exit: [240, 175],
  summary: 'Three plan tags hang from a rail and settle with a damped swing. Tapping the middle tag nudges it, grows it and fills it blue as the best value.',
  usage: `<PriceTags />`, icons: ['star', 'tag']
});

// ---------------------------------------------------------------- Receipt stack
const RX = 140, RW = 200, RY = 34, RH0 = 74;
const ITEMS = [['Nitrile gloves × 4', '$38.00'], ['Gauze pads', '$12.40'], ['Digital thermometer', '$24.99'], ['Pill organizer', '$9.50']];
const PRINT = [2.3, 2.58, 2.86, 3.14, 3.44];
const RSTEP = [26, 26, 26, 26, 50];
const rBottom = k => RY + RH0 + RSTEP.slice(0, k).reduce((a, b) => a + b, 0);
function torn(x0, x1, y, n = 20) {
  const s = (x1 - x0) / n; let fill = `M${x0} ${y - 10} H${x1} V${y}`, line = `M${x0} ${y - 10} V${y}`;
  for (let k = n - 1; k >= 0; k--) fill += ` L${(x0 + (k + .5) * s).toFixed(2)} ${y + 6} L${(x0 + k * s).toFixed(2)} ${y}`;
  for (let k = 0; k < n; k++) line += ` L${(x0 + (k + .5) * s).toFixed(2)} ${y + 6} L${(x0 + (k + 1) * s).toFixed(2)} ${y}`;
  return { fill: fill + ' Z', line: line + ` V${y - 10}` };
}
function Paper({ x, y, w, h, id, at, seed, edge }) {
  const tr = torn(x, x + w, y + h);
  return <>
    <Surf id={id} x={x} y={y} w={w} h={h} r={6} tone="white" elev={2} seed={seed} at={at} />
    <Pop id={`${id}-edge`} at={at + .55} ease="power2.out"><g className={edge}>
      <path d={tr.fill} transform="translate(0 1.6)" fill="rgba(15,23,42,.07)" />
      <path d={tr.fill} fill="#fbfcfe" />
      <path d={tr.line} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeLinejoin="round" />
    </g></Pop>
  </>;
}
export function ReceiptStack({ uid = 'receipt-stack' }) {
  const bars = (x, y) => [[0, 90], [18, 120], [32, 70], [46, 110], [60, 84], [74, 100]].map(([dy, w], k) => <path key={k} d={`M${x + 18} ${y + 40 + dy * 1.6} H${x + 18 + w}`} stroke="#eef2f6" strokeWidth="6" strokeLinecap="round" />);
  return (
    <Frame uid={uid} w={W} h={H} label="Receipts stack and the top one prints its line items" svg={<>
      <g className="rc-b0"><Paper x={150} y={44} w={180} h={232} id="b0" at={.2} seed={[240, 120]} />
        <Pop id="b0c" at={.9}>{bars(150, 44)}</Pop></g>
      <g className="rc-b1"><Paper x={146} y={40} w={188} h={240} id="b1" at={.45} seed={[240, 120]} />
        <Pop id="b1c" at={1.1}>{bars(146, 40)}</Pop></g>
      <g className="rc-top">
        <Paper x={RX} y={RY} w={RW} h={RH0} id="top" at={1.15} seed={[240, 70]} edge="rc-edge" />
        <Surf id="mono" x={RX + 16} y={RY + 16} w={30} h={30} r={9} tone="tint" elev={0} seed={[RX + 31, RY + 31]} at={1.75} />
        <Pop id="dash0" at={2.05} origin="0% 50%" ease="power2.out"><path d={`M${RX + 16} ${RY + 62.5} H${RX + RW - 16}`} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" /></Pop>
        <Pop id="dash1" at={PRINT[4] + .08} origin="0% 50%" ease="power2.out"><path d={`M${RX + 16} ${rBottom(4) + 4.5} H${RX + RW - 16}`} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" /></Pop>
      </g>
    </>}>
      <Layer id="mi" x={RX + 16} y={RY + 16} w={30} h={30} at={1.9} align="center"><Text size={11} weight={700} color={DEEP}>NM</Text></Layer>
      <Layer id="sn" x={RX + 56} y={RY + 12} w={140} h={38} at={1.95}><span className="stack"><Text size={12.5} weight={600}>Northwind Supply</Text><Text size={11} color={SUB} className="tnum">Oct 14 · 10:42 AM</Text></span></Layer>
      {ITEMS.map(([l, v], k) => (
        <Layer key={l} id={`it${k}`} x={RX + 16} y={rBottom(k) - 6} w={RW - 32} h={24} at={PRINT[k] + .1}><span style={row}><Text size={12} color={BODY}>{l}</Text><Text size={12} weight={600} className="tnum">{v}</Text></span></Layer>
      ))}
      <Layer id="tot" x={RX + 16} y={rBottom(4) + 12} w={RW - 32} h={26} at={PRINT[4] + .16}><span style={row}><Text size={13.5} weight={700}>Total</Text><Text size={15} weight={700} color={DEEP} className="tnum">$84.89</Text></span></Layer>
      <Layer id="ic" kind="icon" x={RX + RW - 40} y={RY + 16} w={26} h={26} at={2.0} align="center"><Icon name="printer" size={18} color={MUTE} id="printer" /></Layer>
    </Frame>
  );
}
ReceiptStack.motion = c => {
  const E = c.ease('back.out(1.15)');
  const rig = [['.rc-b0', .25, [96, -8, 9], [-28, 12, -8.5]], ['.rc-b1', .5, [96, -6, 12], [26, -2, 6.5]], ['.rc-top', 1.15, [92, 0, 7], [0, 0, 0]]].map(([s, at, a, b]) => [c.q(s), at, a, b]);
  c.after(t => rig.forEach(([el, at, a, b]) => {
    const [x, y, r] = a.map((v, k) => tw(t, at, .85, v, b[k], E));
    el.setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${r.toFixed(3)} 240 160)`);
  }));
  let h = RH0;
  PRINT.forEach((at, k) => {
    const h2 = h + RSTEP[k];
    c.reshape('top', rect(RX, RY, RW, h2, 6), at, .24, 'power2.out');
    c.fromTo('.rc-edge', { y: h - RH0 }, { y: h2 - RH0, duration: .24, ease: 'power2.out' }, at);
    h = h2;
  });
  c.icon('printer', 0, 39, 2.3, 1.4);
};
Object.assign(ReceiptStack, {
  id: 'receipt-stack', title: 'Receipt stack', category: CAT, w: W, h: H, focus: { x: 240, y: 180 }, push: 1.06, exit: [240, 160],
  summary: 'Receipts slide in and settle into an offset stack. The top receipt prints its line items row by row, its torn edge riding down to the total.',
  usage: `<ReceiptStack />`, icons: ['printer']
});

// ---------------------------------------------------------------- Total counter
const COSTS = [['users', 'Direct support staff', 3120], ['home', 'Housing and utilities', 1480], ['navigation', 'Transportation', 420], ['package', 'Supplies', 185]];
const CY = i => 86 + i * 44, ADD = [1.05, 2.0, 2.55, 3.1];
const money = v => '$' + Math.round(v).toLocaleString('en-US');
export function TotalCounter({ uid = 'total-counter' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Cost breakdown rows add up to a monthly total" svg={<>
      <Surf id="card" x={60} y={22} w={360} h={318} r={22} tone="white" elev={3} seed={[240, 180]} />
      {[1, 2, 3].map(i => <Pop key={i} id={`slot${i}`} at={.95 + i * .06}><path d={`M88 ${CY(i) + 1} H392 Q403 ${CY(i) + 1} 403 ${CY(i) + 12} V${CY(i) + 26} Q403 ${CY(i) + 37} 392 ${CY(i) + 37} H88 Q77 ${CY(i) + 37} 77 ${CY(i) + 26} V${CY(i) + 12} Q77 ${CY(i) + 1} 88 ${CY(i) + 1} Z`} fill="none" stroke="#e2e8f0" strokeWidth="1.2" strokeDasharray="4 4" /></Pop>)}
      {COSTS.map((_, i) => <Surf key={i} id={`r${i}`} x={76} y={CY(i)} w={328} h={38} r={12} tone="muted" elev={0} seed={[90, CY(i) + 19]} at={ADD[i] - .2} />)}
      {COSTS.map((_, i) => <Surf key={i} id={`ib${i}`} x={84} y={CY(i) + 5} w={28} h={28} r={8} tone="white" elev={1} seed={[98, CY(i) + 19]} at={ADD[i] - .08} />)}
      <Draw id="div" d="M76 266.5 H404" stroke="#e2e8f0" width={1} at={.95} />
    </>}>
      <Layer id="t" x={76} y={36} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Monthly cost of care</Text></Layer>
      <Layer id="s" x={76} y={58} w={240} h={20} at={.76}><Text size={12.5} color={SUB} className="tnum cnt">Maple House · 1 of 4 items</Text></Layer>
      {COSTS.map(([ic, l, v], i) => (
        <React.Fragment key={l}>
          <Layer id={`i${i}`} kind="icon" x={84} y={CY(i) + 5} w={28} h={28} at={ADD[i] + .05} align="center"><Icon name={ic} size={16} color={DEEP} id={`ic${i}`} /></Layer>
          <Layer id={`l${i}`} x={124} y={CY(i)} w={180} h={38} at={ADD[i]}><Text size={13.5} weight={600}>{l}</Text></Layer>
          <Layer id={`v${i}`} x={304} y={CY(i)} w={88} h={38} at={ADD[i] + .06} align="right"><Text size={13.5} weight={600} color={BODY} className="tnum">+{money(v)}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="tl" x={76} y={280} w={160} h={40} at={.9}><span className="stack"><Text size={12.5} weight={600} color={SUB}>Total per month</Text><Text size={11.5} color={MUTE}>Before Medicaid waiver</Text></span></Layer>
      <Layer id="tv" x={236} y={276} w={168} h={46} at={.95} align="right">
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <Text size={32} weight={700} className="tnum tot" style={{ letterSpacing: '-.03em', display: 'inline-block', transformOrigin: '100% 60%' }}>$0</Text>
          <span className="tot-ul" style={{ position: 'absolute', left: 1, right: 1, bottom: -3, height: 3, borderRadius: 2, background: '#2d7dff', transformOrigin: '0% 50%' }} />
        </span>
      </Layer>
    </Frame>
  );
}
TotalCounter.motion = c => {
  const el = c.q('.tot'), E = c.ease('power3.out');
  c.after(t => {
    let v = 0;
    ADD.forEach((at, i) => { const p = E(cl((t - at - .15) / .6)); v += COSTS[i][2] * p; });
    el.textContent = money(v);
  });
  ADD.forEach((at, i) => {
    c.icon(`ic${i}`, 0, i === 1 ? 30 : 39, at + .1, .9);
    if (i) c.fromTo('.tot', { scale: 1 }, { scale: 1.06, duration: .12, ease: 'power2.out' }, at + .15).fromTo('.tot', { scale: 1.06 }, { scale: 1, duration: .5, ease: 'elastic.out(1,0.5)' }, at + .27);
  });
  c.swap('[data-layer="s"] .cnt', ['Maple House · 1 of 4 items', 'Maple House · 2 of 4 items', 'Maple House · 3 of 4 items', 'Maple House · 4 of 4 items'], ADD.slice(1));
  c.fromTo('.tot-ul', { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, 3.55);
  c.fromTo('.tot', { color: INK }, { color: DEEP, duration: .3 }, 3.55);
};
Object.assign(TotalCounter, {
  id: 'total-counter', title: 'Total counter', category: CAT, w: W, h: H, focus: { x: 240, y: 220 }, push: 1.06, exit: [240, 180],
  summary: 'Cost rows add in one by one while a large tabular total counts up with each addition, then settles with a drawn emphasis underline.',
  usage: `<TotalCounter />`, icons: ['users', 'home', 'navigation', 'package']
});

// ---------------------------------------------------------------- Research tabs
const TABX = i => 52 + i * 116, TABW = 110;
const TABS = [['R', 'Ridgeline', 'blue'], ['O', 'Openfield', 'green'], ['H', 'Harbor', 'ink']];
const URL0 = 'openfield.example/respite', URL1 = 'harborpolicy.example/care-costs', TYPE = 2.15;
export function ResearchTabs({ uid = 'research-tabs' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Browser tabs open one by one and the active page forms" svg={<>
      <Surf id="win" x={40} y={28} w={400} h={304} r={18} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="strip" x={46} y={34} w={388} h={44} r={13} tone="muted" elev={0} seed={[240, 56]} order={1} />
      {TABS.map(([, , tone], i) => <Surf key={i} id={`tab${i}`} x={TABX(i)} y={40} w={TABW} h={32} r={9} tone={i === 2 ? 'white' : i === 1 ? 'tint' : 'muted'} elev={i === 2 ? 1 : 0} seed={i === 2 ? [TABX(2) + 16, 56] : [TABX(i) + 16, 56]} at={i === 2 ? 2.05 : .95 + i * .3} />)}
      {TABS.map(([, , tone], i) => <Surf key={i} id={`fav${i}`} x={TABX(i) + 10} y={47} w={18} h={18} r={5} tone={tone} elev={0} seed={[TABX(i) + 19, 56]} at={i === 2 ? 2.3 : 1.1 + i * .3} />)}
      <Surf id="plus" x={TABX(2) + 2} y={40} w={32} h={32} r={9} tone="white" elev={1} seed={[TABX(2) + 18, 56]} at={.98} />
      <Surf id="addr" x={52} y={86} w={290} h={32} r={16} tone="muted" elev={0} seed={[80, 102]} order={2} />
      <Surf id="badge" x={352} y={86} w={76} h={32} r={16} tone="tint" elev={0} seed={[390, 102]} order={3} />
      <Draw id="hr" d="M40 128.5 H440" stroke="#eef2f6" width={1} at={.9} />
      <Pop id="skel" at={1.25} ease="power3.out"><g className="skel">
        <rect x={64} y={146} width={150} height={12} rx={6} fill="#eef2f6" /><rect x={64} y={170} width={220} height={18} rx={9} fill="#eef2f6" />
        {[204, 220, 236].map((y, k) => <rect key={k} x={64} y={y} width={[300, 270, 190][k]} height={8} rx={4} fill="#f3f5f8" />)}
      </g></Pop>
      <Surf id="hfav" x={64} y={142} w={26} h={26} r={7} tone="ink" elev={0} seed={[77, 155]} at={2.35} />
      {[[214, 196], [230, 182], [246, 200], [262, 168], [278, 186], [294, 120]].map(([y, w], k) => <Draw key={k} id={`ln${k}`} d={`M64 ${y} H${64 + w}`} stroke="#e8edf3" width={7} at={2.6 + k * .07} dur={.4} />)}
      <Surf id="chart" x={284} y={142} w={140} h={176} r={14} tone="muted" elev={0} seed={[354, 230]} at={2.45} />
      {[44, 58, 72, 98].map((h, k) => <Surf key={k} id={`bar${k}`} x={300 + k * 30} y={300 - h} w={20} h={h} r={6} tone={k === 3 ? 'blue' : 'tint'} elev={0} seed={[310 + k * 30, 296]} at={2.75 + k * .08} />)}
    </>}>
      {TABS.map(([m, n], i) => (
        <React.Fragment key={m}>
          <Layer id={`fm${i}`} x={TABX(i) + 10} y={47} w={18} h={18} at={i === 2 ? 2.4 : 1.2 + i * .3} align="center"><Text size={10} weight={700} color="#fff">{m}</Text></Layer>
          <Layer id={`tn${i}`} x={TABX(i) + 34} y={40} w={TABW - 40} h={32} at={i === 2 ? 2.42 : 1.22 + i * .3}><Text size={12} weight={i === 2 ? 600 : 500} color={i === 2 ? INK : i === 1 ? DEEP : BODY} className={`tn${i}`}>{n}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="plus" kind="icon" x={TABX(2) + 2} y={40} w={32} h={32} at={1.3} align="center"><Icon name="plusToX" size={18} color={BODY} id="plus" /></Layer>
      <Layer id="lk" kind="icon" x={60} y={86} w={24} h={32} at={1.05} align="center"><Icon name="lock" size={14} color={SUB} id="lock" /></Layer>
      <Layer id="url" x={88} y={86} w={250} h={32} at={1.1}><Text size={12.5} color={BODY} className="url">{URL0}</Text></Layer>
      <Layer id="bt" x={352} y={86} w={76} h={32} at={1.2} align="center"><Text size={12} weight={600} color={DEEP} className="tnum cnt">2 tabs</Text></Layer>
      <Layer id="hf" x={64} y={142} w={26} h={26} at={2.5} align="center"><Text size={12} weight={700} color="#fff">H</Text></Layer>
      <Layer id="hs" x={98} y={142} w={180} h={26} at={2.52}><Text size={12} weight={600} color={SUB}>Harbor Policy Institute</Text></Layer>
      <Layer id="hl" x={64} y={172} w={216} h={28} at={2.58}><Text size={17} weight={600}>Care costs rose 6%</Text></Layer>
      <Layer id="ct" x={300} y={152} w={116} h={36} at={2.7}><span className="stack"><Text size={11} weight={600} color={SUB}>Cost per hour</Text><Text size={15} weight={700} className="tnum">$31.40</Text></span></Layer>
    </Frame>
  );
}
ResearchTabs.motion = c => {
  c.cursor([{ at: 1.95, x: TABX(2) + 24, y: 64, press: true }]);
  c.press('plus', '[data-layer="plus"]', 1.95, 1);
  c.icon('plus', 0, 8, 1.97, .12); c.icon('plus', 8, 0, 2.1, .2);
  c.reshape('plus', rect(TABX(3) + 2, 40, 32, 32, 9), 2.1, .5, 'back.out(1.3)');
  c.fromTo('[data-layer="plus"]', { x: 0 }, { x: 116, duration: .5, ease: 'back.out(1.3)' }, 2.1);
  c.fromTo('[data-surf="tab1"] .body', { fill: '#eef4ff' }, { fill: '#eef2f7', duration: .25 }, 2.12);
  c.fromTo('[data-surf="tab1"] .edge', { stroke: '#cfe0ff' }, { stroke: '#e2e8f0', duration: .25 }, 2.12);
  c.fromTo('.tn1', { color: DEEP }, { color: BODY, duration: .25 }, 2.12);
  c.press('badge', '[data-layer="bt"]', 2.3, .7);
  c.swap('[data-layer="bt"] .cnt', ['2 tabs', '3 tabs'], [2.36]);
  const u = c.q('.url');
  c.after(t => { const k = Math.floor(cl((t - TYPE) * 34 / URL1.length) * URL1.length + 1e-6); u.textContent = t < TYPE ? URL0 : URL1.slice(0, k); u.classList.toggle('caret', t >= TYPE && t < TYPE + URL1.length / 34 + .4); });
  c.icon('lock', 0, 9, 3.2, .3);
  c.fromTo('.skel', { scaleY: 1, opacity: 1, transformOrigin: '50% 0%' }, { scaleY: .2, opacity: 0, duration: .28, ease: 'power2.in' }, 2.12);
};
Object.assign(ResearchTabs, {
  id: 'research-tabs', title: 'Research tabs', category: CAT, w: W, h: H, focus: { x: 240, y: 140 }, push: 1.05, orbit: .85, exit: [240, 180],
  summary: 'Browser tabs with monogram favicons open one by one. A new tab grows out of the plus button, the address types in and the page forms.',
  usage: `<ResearchTabs />`, icons: ['plusToX', 'lock']
});

// ---------------------------------------------------------------- Sources list
const SRC = [['R', 'Ridgeline Journal', 'Peer reviewed · 2025', 'tint', DEEP], ['O', 'Openfield Data', 'Dataset · Q4 2025', 'greenTint', GREEN], ['S', 'State care registry', 'Public records', 'amberTint', '#a16207'], ['C', 'Coastal Providers', 'Survey · 1,200 homes', 'redTint', '#b91c1c']];
const SY = i => 88 + i * 48, VER = [2.0, 2.45, 2.9, 3.35];
export function SourcesList({ uid = 'sources-list' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Citations verified one by one with a confidence summary" svg={<>
      <Surf id="card" x={50} y={22} w={380} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="scan" x={62} y={SY(0) - 2} w={356} h={44} r={12} tone="tint" elev={0} seed={[80, SY(0) + 20]} at={1.3} />
      {SRC.map(([, , , tone], i) => <Surf key={i} id={`m${i}`} x={72} y={SY(i) + 4} w={32} h={32} r={9} tone={tone} elev={0} seed={[88, SY(i) + 20]} at={.95 + i * .07} />)}
      {[1, 2, 3].map(i => <Draw key={i} id={`sep${i}`} d={`M72 ${SY(i) - 4.5} H408`} stroke="#f1f5f9" width={1} at={.9 + i * .05} />)}
      {SRC.map((_, i) => <Pop key={i} id={`pd${i}`} at={1.3 + i * .07}><circle className={`pend${i}`} cx={396} cy={SY(i) + 20} r={7} fill="none" stroke="#cbd5e1" strokeWidth="1.6" strokeDasharray="2.5 3" /></Pop>)}
      <Surf id="sum" x={62} y={284} w={356} h={40} r={12} tone="muted" elev={0} seed={[80, 304]} order={2} />
      <Draw id="trk" d="M186 304 H312" stroke="#e2e8f0" width={6} at={1.2} dur={.5} />
      <path className="conf" d="M186 304 H312" fill="none" stroke="#2d7dff" strokeWidth="6" strokeLinecap="round" />
    </>}>
      <Layer id="t" x={72} y={36} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Sources</Text></Layer>
      <Layer id="s" x={72} y={58} w={340} h={20} at={.76}><Text size={12.5} color={SUB}>Claim · Respite hours fell 12% in 2025</Text></Layer>
      {SRC.map(([m, n, d, , col], i) => (
        <React.Fragment key={m}>
          <Layer id={`mi${i}`} x={72} y={SY(i) + 4} w={32} h={32} at={1.05 + i * .07} align="center"><Text size={13} weight={700} color={col}>{m}</Text></Layer>
          <Layer id={`nm${i}`} x={116} y={SY(i)} w={180} h={40} at={1.1 + i * .07}><span className="stack"><Text size={13.5} weight={600}>{n}</Text><Text size={11.5} color={SUB} className="tnum">{d}</Text></span></Layer>
          <Layer id={`st${i}`} x={300} y={SY(i)} w={78} h={40} at={1.2 + i * .07} align="right"><Text size={12} weight={600} color={MUTE} className={`stt${i}`}>Pending</Text></Layer>
          <Layer id={`ok${i}`} kind="icon" x={384} y={SY(i) + 8} w={24} h={24} at={VER[i] + .08} align="center"><Icon name="checkCircle" size={22} color="#16a34a" id={`ok${i}`} /></Layer>
        </React.Fragment>
      ))}
      <Layer id="cl" x={78} y={284} w={100} h={40} at={1.25}><Text size={12.5} weight={600} color={BODY}>Confidence</Text></Layer>
      <Layer id="cv" x={318} y={284} w={86} h={40} at={1.3} align="right"><Text size={12.5} weight={700} color={MUTE} className="tnum lvl">0 of 4</Text></Layer>
    </Frame>
  );
}
SourcesList.motion = c => {
  const LV = ['1 of 4 · Low', '2 of 4 · Fair', '3 of 4 · Good', '4 of 4 · High'];
  VER.forEach((at, i) => {
    if (i) c.reshape('scan', rect(62, SY(i) - 2, 356, 44, 12), at - .22, .4, 'power3.inOut');
    c.fromTo(`.pend${i}`, { scale: 1, opacity: 1, transformOrigin: '50% 50%' }, { scale: .3, opacity: 0, duration: .18, ease: 'power2.in' }, at);
    c.icon(`ok${i}`, 8, 39, at + .1, .6);
    c.swap(`[data-layer="st${i}"] .stt${i}`, ['Pending', 'Verified'], [at + .05]);
    c.fromTo(`.stt${i}`, { color: MUTE }, { color: GREEN, duration: .2 }, at + .05);
    c.draw('.conf', `0% ${i * 25}%`, `0% ${(i + 1) * 25}%`, at + .1, .45, 'power3.out');
  });
  c.draw('.conf', '0% 100%', '0% 0%', c.T.collapse + .02, .35, 'power2.in');
  c.swap('[data-layer="cv"] .lvl', ['0 of 4', ...LV], VER.map(a => a + .1));
  c.fromTo('.lvl', { color: MUTE }, { color: '#a16207', duration: .2 }, VER[0] + .1).fromTo('.lvl', { color: '#a16207' }, { color: GREEN, duration: .25 }, VER[3] + .1);
  c.fromTo('.conf', { stroke: '#2d7dff' }, { stroke: '#16a34a', duration: .3 }, VER[3] + .2);
  c.reshape('scan', rect(62, 280, 356, 48, 14), 3.7, .45, 'power3.inOut');
};
Object.assign(SourcesList, {
  id: 'sources-list', title: 'Sources list', category: CAT, w: W, h: H, focus: { x: 240, y: 200 }, push: 1.05, exit: [240, 180],
  summary: 'A citation list with monogram favicons. A scan highlight walks down the rows verifying each source with a native check as confidence fills.',
  usage: `<SourcesList />`, icons: ['checkCircle']
});

// ---------------------------------------------------------------- Filing cabinet
const DY = [118, 190, 262], DRW = { x: 104, w: 152, h: 62 }, OPEN = 48;
const FOLD = [['#c7d2fe', '#a5b4fc', 18], ['#fde68a', '#fbbf24', 70], ['#bfdbfe', '#60a5fa', 30], ['#bbf7d0', '#4ade80', 86], ['#fecaca', '#f87171', 44]];
const FTOP = [124, 132, 140, 148, 156], FHIDE = 204, LIFT = { x: 186, up: 90, land: 126 };
function folderD(x, y, w, h, tx) { return `M${x + 6} ${y} H${x + tx} L${x + tx + 4} ${y - 9} H${x + tx + 38} L${x + tx + 42} ${y} H${x + w - 6} Q${x + w} ${y} ${x + w} ${y + 6} V${y + h} H${x} V${y + 6} Q${x} ${y} ${x + 6} ${y} Z`; }
export function FilingCabinet({ uid = 'filing-cabinet' }) {
  const handle = y => <><rect x={152} y={y + 40} width={56} height={10} rx={5} fill="#cbd5e1" /><rect x={156} y={y + 42} width={48} height={3} rx={1.5} fill="#e2e8f0" /></>;
  return (
    <Frame uid={uid} w={W} h={H} label="A filing cabinet drawer slides open and a folder lifts out" svg={<>
      <Draw id="floor" d="M64 334.5 H416" stroke="#e2e8f0" width={1.5} at={.6} dur={.6} />
      <Surf id="body" x={90} y={106} w={180} h={226} r={14} tone="track" elev={3} seed={[180, 220]} />
      <Surf id="hole" x={106} y={120} w={148} h={58} r={8} tone="ink" elev={0} seed={[180, 150]} at={1.0} />
      {FOLD.map(([f, tab, tx], i) => (
        <Pop key={i} id={`fd${i}`} at={1.2}><g className={`fold fold${i}`}>
          {i === 2 && <path d={folderD(113, FHIDE + 3, 136, 46, tx)} fill="rgba(29,78,216,.14)" />}
          <path d={folderD(112, FHIDE, 136, 46, tx)} fill={f} stroke="rgba(15,23,42,.08)" strokeWidth="1" />
          <path d={`M${112 + tx + 4} ${FHIDE - 9} H${112 + tx + 38}`} stroke={tab} strokeWidth="2.5" strokeLinecap="round" />
        </g></Pop>
      ))}
      {[1, 2].map(k => (
        <g key={k}>
          <Surf id={`d${k}`} x={DRW.x} y={DY[k]} w={DRW.w} h={DRW.h} r={10} tone="white" elev={1} seed={[180, DY[k] + 31]} at={.35 + k * .1} />
          <Surf id={`sl${k}`} x={156} y={DY[k] + 12} w={48} h={18} r={5} tone="muted" elev={0} seed={[180, DY[k] + 21]} at={.75 + k * .08} />
          <Pop id={`h${k}`} at={.95 + k * .08}>{handle(DY[k])}</Pop>
        </g>
      ))}
      <g className="drw0">
        <Surf id="d0" x={DRW.x} y={DY[0]} w={DRW.w} h={DRW.h} r={10} tone="white" elev={2} seed={[180, DY[0] + 31]} at={.25} />
        <Surf id="sl0" x={156} y={DY[0] + 12} w={48} h={18} r={5} tone="muted" elev={0} seed={[180, DY[0] + 21]} at={.75} />
        <Pop id="h0" at={.95}>{handle(DY[0])}</Pop>
      </g>
    </>}>
      {['2026', '2025', '2024'].map((y, k) => <Layer key={y} id={`lb${k}`} x={156} y={DY[k] + 12} w={48} h={18} at={1.0 + k * .06} align="center"><Text size={10.5} weight={600} color={BODY} className="tnum">{y}</Text></Layer>)}
      <Layer id="t" x={300} y={28} w={150} h={22} at={.7}><Text size={15.5} weight={600}>Resident records</Text></Layer>
      <Layer id="s" x={300} y={50} w={150} h={20} at={.76}><Text size={12.5} color={SUB}>Cabinet B · Maple House</Text></Layer>
      <Layer id="fi" kind="icon" x={112 + LIFT.x + 10} y={LIFT.land + 10} w={26} h={26} at={3.8} align="center"><Icon name="fileText" size={18} color={DEEP} id="file" /></Layer>
      <Layer id="fn" x={112 + LIFT.x + 40} y={LIFT.land + 4} w={96} h={38} at={3.82}><span className="stack"><Text size={13} weight={600}>Ellis, Jordan</Text><Text size={11} color={BODY}>Care plan 2026</Text></span></Layer>
      <Layer id="cap" x={112 + LIFT.x} y={LIFT.land + 58} w={150} h={22} at={3.9}><span style={pill('#dcfce7', GREEN)}>Checked out 11:04 AM</span></Layer>
    </Frame>
  );
}
FilingCabinet.motion = c => {
  c.cursor([{ at: 1.95, x: 196, y: DY[0] + 48, press: true }, { at: 2.55, x: 196, y: DY[0] + 48 + OPEN }]);
  c.fromTo('.drw0', { y: 0 }, { y: OPEN, duration: .46, ease: 'power3.inOut' }, 2.09);
  c.fromTo('[data-layer="lb0"]', { y: 0 }, { y: OPEN, duration: .46, ease: 'power3.inOut' }, 2.09);
  c.hide('lb1', 2.12, .22);
  FOLD.forEach((_, i) => i !== 2 && c.fromTo(`.fold${i}`, { y: 0 }, { y: FTOP[i] - FHIDE, duration: .5, ease: 'back.out(1.4)' }, 2.55 + i * .06));
  const f2 = c.q('.fold2'), E = n => c.ease(n), bo = E('back.out(1.4)'), p3 = E('power3.out'), p2 = E('power2.inOut'), p2o = E('power2.out'), b2 = E('back.out(2)'), dy = FTOP[2] - FHIDE;
  c.after(t => {
    const y = t < 3.0 ? tw(t, 2.67, .5, 0, dy, bo) : t < 3.48 ? tw(t, 3.0, .48, dy, LIFT.up - FHIDE, p3) : tw(t, 3.48, .45, LIFT.up - FHIDE, LIFT.land - FHIDE, bo), x = tw(t, 3.1, .55, 0, LIFT.x, p2);
    const r = t < 3.4 ? tw(t, 3.05, .3, 0, -4, p2o) : tw(t, 3.4, .5, -4, 0, b2);
    f2.setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${r.toFixed(3)} 180 ${FHIDE + 25})`);
  });
  c.icon('file', 0, 39, 3.85, .9);
};
Object.assign(FilingCabinet, {
  id: 'filing-cabinet', title: 'Filing cabinet', category: CAT, w: W, h: H, focus: { x: 236, y: 180 }, push: 1.04, exit: [180, 220],
  summary: 'The top drawer slides open with real travel, colored folders rise out of it and one labelled resident folder lifts clear to the side.',
  usage: `<FilingCabinet />`, icons: ['fileText']
});

// ---------------------------------------------------------------- Warehouse shot
const OX = 246, OY = 168;
const iso = (x, y, z) => [OX + (x - y) * .866, OY + (x + y) * .5 - z];
const poly = pts => 'M' + pts.map(p => iso(...p).map(v => v.toFixed(2)).join(',')).join(' L') + ' Z';
function cube(cx, cy, z0, hs, hz) {
  const a = cx - hs, b = cx + hs, c = cy - hs, d = cy + hs, z1 = z0 + hz;
  return [poly([[a, c, z1], [b, c, z1], [b, d, z1], [a, d, z1]]), poly([[a, d, z0], [b, d, z0], [b, d, z1], [a, d, z1]]), poly([[b, c, z0], [b, d, z0], [b, d, z1], [b, c, z1]])];
}
const BOX = ['#f6deb0', '#e5bd80', '#cf9f5f'];
const Cube = ({ cx, cy, z0, hs = 9, hz = 16, cls }) => { const [t, l, r] = cube(cx, cy, z0, hs, hz); return <g className={cls}><path d={l} fill={BOX[1]} /><path d={r} fill={BOX[2]} /><path d={t} fill={BOX[0]} /><path d={t} fill="none" stroke="rgba(120,80,30,.25)" strokeWidth=".6" /></g>; };
const BX0 = -128, BL = 236, NB = 5, BSP = BL / NB, PLAY = 2.05, STOP = 3.85;
export function WarehouseShot({ uid = 'warehouse-shot' }) {
  const grid = [];
  // Floor grid lines clipped to the viewport in screen space so the scene's geometry stays bounded.
  const seg = (p, q) => {
    let t0 = 0, t1 = 1; const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [pp, qq] of [[-dx, p[0] - 54], [dx, 426 - p[0]], [-dy, p[1] - 74], [dy, 270 - p[1]]]) {
      if (pp === 0) { if (qq < 0) return null; continue; }
      const r = qq / pp; if (pp < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
    }
    return t0 < t1 ? `M${(p[0] + dx * t0).toFixed(2)},${(p[1] + dy * t0).toFixed(2)} L${(p[0] + dx * t1).toFixed(2)},${(p[1] + dy * t1).toFixed(2)}` : null;
  };
  for (let k = -6; k <= 6; k++) { grid.push(seg(iso(-260, k * 40, 0), iso(260, k * 40, 0))); grid.push(seg(iso(k * 40, -260, 0), iso(k * 40, 260, 0))); }
  const gridD = grid.filter(Boolean);
  const rack = [];
  const RX0 = -30, RX1 = 130, RY0 = -48, RY1 = -28;
  [0, 26, 52].forEach((z, s) => {
    rack.push(<path key={`sh${s}`} d={poly([[RX0, RY0, z + 3], [RX1, RY0, z + 3], [RX1, RY1, z + 3], [RX0, RY1, z + 3]])} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth=".8" />);
    rack.push(<path key={`sf${s}`} d={poly([[RX0, RY1, z], [RX1, RY1, z], [RX1, RY1, z + 3], [RX0, RY1, z + 3]])} fill="#94a3b8" />);
    if (s < 2) [[-14, 0], [12, 1], [52, 0], [78, 1], [112, 0]].forEach(([x, k2], j) => (j + s) % 4 !== 2 && rack.push(<Cube key={`rb${s}${j}`} cx={x} cy={-38} z0={z + 3} hs={k2 ? 8 : 9} hz={k2 ? 14 : 18} />));
  });
  const post = (x, y) => <path d={poly([[x - 1.5, y, 0], [x + 1.5, y, 0], [x + 1.5, y, 70], [x - 1.5, y, 70]])} fill="#64748b" />;
  return (
    <Frame uid={uid} w={W} h={H} label="Illustrative isometric warehouse with a conveyor, not real footage" svg={<>
      <defs><clipPath id={`${uid}-vp`}><rect x={52} y={72} width={376} height={200} rx={12} /></clipPath></defs>
      <Surf id="player" x={40} y={28} w={400} h={304} r={18} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="vp" x={52} y={72} w={376} h={200} r={12} tone="muted" elev={0} seed={[240, 172]} order={1} />
      <Surf id="tag" x={330} y={38} w={98} h={26} r={13} tone="amberTint" elev={0} seed={[379, 51]} at={.9} />
      <g clipPath={`url(#${uid}-vp)`}>
        <Pop id="grid" at={.95} ease="power3.out"><g>{gridD.map((d, i) => <path key={i} d={d} fill="none" stroke="#dde3ea" strokeWidth=".8" />)}</g></Pop>
        <Pop id="rack" at={1.1} ease="back.out(1.4)"><g>{post(RX0, RY0)}{post(RX1, RY0)}{rack}{post(RX0, RY1)}{post(RX1, RY1)}</g></Pop>
        <Pop id="belt" at={1.2} ease="back.out(1.4)"><g>
          <path d={poly([[-142, 40, 0], [122, 40, 0], [122, 40, 12], [-142, 40, 12]])} fill="#64748b" />
          <path d={poly([[122, 16, 0], [122, 40, 0], [122, 40, 12], [122, 16, 12]])} fill="#475569" />
          <path d={poly([[-142, 16, 12], [122, 16, 12], [122, 40, 12], [-142, 40, 12]])} fill="#cbd5e1" />
          <g className="slats">{Array.from({ length: 23 }, (_, k) => <path key={k} className="slat" d={poly([[0, 17, 12], [.01, 17, 12], [0, 39, 12]])} fill="none" stroke="#a7b4c4" strokeWidth="1" />)}</g>
          <path d={poly([[-142, 16, 12], [-116, 16, 12], [-116, 40, 12], [-142, 40, 12]])} fill="#334155" />
          <path d={poly([[96, 16, 12], [122, 16, 12], [122, 40, 12], [96, 40, 12]])} fill="#334155" />
          <path d={poly([[-142, 40, 12], [122, 40, 12], [122, 40, 13.5], [-142, 40, 13.5]])} fill="#2d7dff" />
        </g></Pop>
        <Pop id="boxes" at={1.35}><g>{Array.from({ length: NB }, (_, i) => <g key={i} className="wbox"><path fill={BOX[1]} /><path fill={BOX[2]} /><path fill={BOX[0]} /></g>)}</g></Pop>
        <Pop id="pallet" at={1.25} ease="back.out(1.4)"><g>
          <path d={poly([[-96, 74, 0], [-52, 74, 0], [-52, 118, 0], [-96, 118, 0]])} fill="#cbd5e1" />
          {[[-85, 85, 0], [-63, 85, 0], [-85, 107, 0], [-63, 107, 0], [-85, 85, 18], [-63, 85, 18], [-85, 107, 18]].map(([x, y, z], k) => <Cube key={k} cx={x} cy={y} z0={z + 2} hs={10} hz={18} />)}
        </g></Pop>
      </g>
      <Surf id="cnt" x={318} y={84} w={98} h={48} r={12} tone="white" elev={2} seed={[367, 108]} at={1.4} />
      <Surf id="play" x={56} y={284} w={34} h={34} r={17} tone="blue" elev={2} seed={[73, 301]} order={2} />
      <Draw id="trk" d="M106 301 H344" stroke="#e2e8f0" width={4} at={1.1} dur={.5} />
      <path className="prog" d="M106 301 H344" fill="none" stroke="#2d7dff" strokeWidth="4" strokeLinecap="round" />
    </>}>
      <Layer id="t" x={58} y={38} w={260} h={26} at={.7}><Text size={14.5} weight={600}>Fulfillment line · aisle 4</Text></Layer>
      <Layer id="tg" x={330} y={38} w={98} h={26} at={1.0} align="center"><Text size={11.5} weight={600} color="#a16207">Illustrative</Text></Layer>
      <Layer id="cl" x={330} y={88} w={80} h={16} at={1.5}><Text size={11} weight={600} color={SUB}>Shipped</Text></Layer>
      <Layer id="cv" x={330} y={104} w={80} h={24} at={1.55}><Text size={19} weight={700} className="tnum shipped" style={{ letterSpacing: '-.02em' }}>1,204</Text></Layer>
      <Layer id="pp" kind="icon" x={56} y={284} w={34} h={34} at={1.2} align="center"><Icon name="playPause" size={18} color="#fff" id="pp" /></Layer>
      <Layer id="tm" x={354} y={290} w={70} h={22} at={1.25} align="right"><Text size={12} weight={600} color={SUB} className="tnum tmv">0:00</Text></Layer>
    </Frame>
  );
}
WarehouseShot.motion = c => {
  const E = c.ease('power1.inOut');
  const dist = t => BL * 1.04 * E(cl((t - PLAY) / (STOP - PLAY)));
  const boxes = c.qa('.wbox'), slats = c.qa('.slat'), num = c.q('.shipped'), tm = c.q('.tmv');
  c.after(t => {
    const s = dist(t); let shipped = 0;
    boxes.forEach((g, i) => {
      const p0 = i * BSP + 22, p = p0 + s, x = BX0 + (p % BL);
      shipped += Math.floor(p / BL);
      const k = cl((x - BX0) / 20) * cl((BX0 + BL - x) / 20), hs = 9 * (.35 + .65 * k), hz = 16 * k;
      const [top, l, r] = cube(x, 28, 12 + (1 - k) * -2, hs, Math.max(.01, hz));
      const ps = g.children; ps[0].setAttribute('d', l); ps[1].setAttribute('d', r); ps[2].setAttribute('d', top);
      g.setAttribute('opacity', k < .02 ? '0' : '1');
    });
    slats.forEach((el, k) => { const x = -116 + ((k * 9.6 + s) % 211); el.setAttribute('d', poly([[x, 17, 12], [x + .01, 17, 12], [x, 39, 12]])); });
    num.textContent = (1204 + shipped).toLocaleString('en-US');
    const sec = Math.round(24 * cl((t - PLAY) / (STOP - PLAY)));
    tm.textContent = `0:${String(sec).padStart(2, '0')}`;
  });
  c.cursor([{ at: 1.95, x: 76, y: 306, press: true }]);
  c.press('play', '[data-layer="pp"]', 1.95, 1);
  c.rest('pp', 7);
  c.icon('pp', 7, 0, 1.98, .25);
  c.icon('pp', 0, 7, STOP, .25);
  c.draw('.prog', '0% 0%', '0% 100%', PLAY, STOP - PLAY, 'none');
  c.draw('.prog', '0% 100%', '0% 0%', c.T.collapse + .02, .35, 'power2.in');
  c.press('cnt', '[data-layer="cv"]', 3.0, .5);
};
Object.assign(WarehouseShot, {
  id: 'warehouse-shot', title: 'Warehouse shot', category: CAT, w: W, h: H, focus: { x: 240, y: 180 }, push: 1.05, orbit: .85, exit: [240, 180],
  summary: 'An illustrative isometric warehouse inside a player frame. Pressing play runs boxes along the conveyor while a tabular shipped counter ticks up.',
  usage: `<WarehouseShot />`, icons: ['playPause']
});

// ---------------------------------------------------------------- Spilling pages
const PG = { x: 184, y: 104, w: 112, h: 148 };
const LAND = [[-132, 26, -15], [132, 26, 15], [-88, 12, -8], [88, 12, 8], [-57, 6, 0], [57, 6, 0]];
const STACK = [[-3, 6, -3], [3, 4, 2.5], [-2, 3, -1.5], [2, 2, 1.5], [0, 1, -.6], [0, 0, 0]];
const SPILL = i => 2.42 + (5 - i) * .1;
export function SpillingPages({ uid = 'spilling-pages' }) {
  const lines = (x, y, ws) => ws.map((w, k) => <path key={k} d={`M${x} ${y + k * 11} H${x + w}`} stroke="#e8edf3" strokeWidth="4.5" strokeLinecap="round" />);
  return (
    <Frame uid={uid} w={W} h={H} label="A stack of pages spills into a readable spread" svg={<>
      {LAND.map((_, i) => (
        <g key={i} className={`pg pg${i}`}>
          <Surf id={`p${i}`} x={PG.x} y={PG.y} w={PG.w} h={PG.h} r={8} tone="white" elev={2} seed={[240, 178]} at={.25 + i * .09} />
          <Pop id={`pc${i}`} at={.95 + i * .05}><g>
            {i === 4 ? <>{lines(PG.x + 12, PG.y + 44, [86, 80, 88, 62])}{lines(PG.x + 12, PG.y + 96, [84, 88, 54])}</>
              : i === 5 ? <>{[30, 44, 38, 58].map((h, k) => <rect key={k} x={PG.x + 16 + k * 21} y={PG.y + 112 - h} width={14} height={h} rx={3} fill={k === 3 ? '#2d7dff' : '#bfdbfe'} />)}<path d={`M${PG.x + 12} ${PG.y + 112.5} H${PG.x + 100}`} stroke="#e2e8f0" strokeWidth="1" /></>
                : <>{lines(PG.x + 12, PG.y + 20, [60])}{lines(PG.x + 12, PG.y + 40, [86, 80, 88, 70, 84, 52, 80, 60])}</>}
          </g></Pop>
        </g>
      ))}
      <Pop id="gut" at={3.45}><path className="gutter" d={`M240 ${PG.y + 8} V${PG.y + PG.h - 2}`} stroke="rgba(15,23,42,.10)" strokeWidth="1.2" /></Pop>
    </>}>
      <Layer id="t" x={40} y={30} w={220} h={22} at={.7}><Text size={15.5} weight={600}>Annual cost report</Text></Layer>
      <Layer id="s" x={40} y={52} w={220} h={20} at={.76}><Text size={12.5} color={SUB}>Maple House · 2025</Text></Layer>
      <Layer id="cn" x={300} y={28} w={140} h={46} at={.82} align="right"><span className="stack" style={{ alignItems: 'flex-end' }}><Text size={24} weight={700} className="tnum pages" style={{ letterSpacing: '-.02em' }}>0</Text><Text size={11.5} color={SUB}>pages pulled</Text></span></Layer>
      <Layer id="h4" x={PG.x - 57 + 12} y={PG.y + 6 + 14} w={96} h={20} at={3.45}><Text size={12} weight={600}>Staffing costs</Text></Layer>
      <Layer id="h5" x={PG.x + 57 + 12} y={PG.y + 6 + 14} w={96} h={20} at={3.5}><Text size={12} weight={600}>Turnover rate</Text></Layer>
      <Layer id="n4" x={PG.x - 57 + 12} y={PG.y + 6 + 124} w={40} h={16} at={3.6}><Text size={10.5} weight={600} color={MUTE} className="tnum">14</Text></Layer>
      <Layer id="n5" x={PG.x + 57 + 60} y={PG.y + 6 + 124} w={40} h={16} at={3.62} align="right"><Text size={10.5} weight={600} color={MUTE} className="tnum">15</Text></Layer>
      <Layer id="cap" x={120} y={292} w={240} h={22} at={3.7} align="center" className="gap6"><Icon name="bookOpen" size={16} color={DEEP} id="book" /><Text size={12.5} weight={600} color={BODY}>Spread 14 to 15 · staffing</Text></Layer>
    </Frame>
  );
}
SpillingPages.motion = c => {
  const p3 = c.ease('power3.out'), p2 = c.ease('power2.out'), bk = c.ease('back.out(1.6)'), br = c.ease('back.out(1.8)');
  const pages = LAND.map((_, i) => c.q(`.pg${i}`)), cx = PG.x + PG.w / 2, cy = PG.y + PG.h / 2;
  c.after(t => LAND.forEach(([x1, y1, r1], i) => {
    const [sx, sy, sr] = STACK[i], at = SPILL(i);
    const x = tw(t, at, .8, sx, x1, p3), y = t < at + .28 ? tw(t, at, .28, sy, y1 - 26, p2) : tw(t, at + .28, .52, y1 - 26, y1, bk), r = tw(t, at, .85, sr, r1, br);
    pages[i].setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${r.toFixed(3)} ${cx} ${cy})`);
  }));
  c.cursor([{ at: 2.3, x: 286, y: 236, press: true }]);
  c.press(['p5'], null, 2.3, .5);
  c.count('.pages', 0, 128, 2.45, 1.25, v => String(Math.round(v)), 'power2.out');
  c.icon('book', 0, 43, 3.75, .9);
};
Object.assign(SpillingPages, {
  id: 'spilling-pages', title: 'Spilling pages', category: CAT, w: W, h: H, focus: { x: 240, y: 180 }, push: 1.04, orbit: .8, exit: [240, 178],
  summary: 'A neat stack of report pages spills and fans out with rigid turns while a page counter climbs, landing on a readable two-page spread.',
  usage: `<SpillingPages />`, icons: ['bookOpen']
});

// ---------------------------------------------------------------- Fact-check stamp
const FSRC = [['R', 'Ridgeline Journal', 'tint', DEEP], ['O', 'Openfield Data', 'greenTint', GREEN], ['S', 'State care registry', 'amberTint', '#a16207']];
const FY = i => 214 + i * 38, IMPACT = 2.42, SC = [346, 126];
export function FactCheckStamp({ uid = 'fact-check-stamp' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="A claim card is stamped verified as its sources check out" svg={<>
      <Surf id="card" x={50} y={24} w={380} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="ib" x={70} y={42} w={34} h={34} r={10} tone="tint" elev={0} seed={[87, 59]} order={1} />
      <Surf id="claim" x={70} y={90} w={340} h={78} r={14} tone="muted" elev={0} seed={[90, 129]} order={2} />
      <Draw id="q" d="M82 102 V156" stroke="#2d7dff" width={3} at={1.0} dur={.4} />
      {FSRC.map(([, , tone], i) => <Surf key={i} id={`m${i}`} x={70} y={FY(i) + 3} w={26} h={26} r={8} tone={tone} elev={0} seed={[83, FY(i) + 16]} at={1.1 + i * .07} />)}
      {FSRC.map((_, i) => <Pop key={i} id={`pd${i}`} at={1.35 + i * .07}><circle className={`pend${i}`} cx={398} cy={FY(i) + 16} r={7} fill="none" stroke="#cbd5e1" strokeWidth="1.6" strokeDasharray="2.5 3" /></Pop>)}
      <Pop id="ink" at={0}><circle className="inkring" cx={SC[0]} cy={SC[1]} r={46} fill="none" stroke="#16a34a" strokeWidth="3" opacity="0" /></Pop>
      <Pop id="stamp" at={0}><g className="stamp" opacity="0">
        <rect x={SC[0] - 62} y={SC[1] - 25} width={124} height={50} rx={12} fill="rgba(240,253,244,.92)" stroke="#16a34a" strokeWidth="3" />
        <rect x={SC[0] - 56} y={SC[1] - 19} width={112} height={38} rx={8} fill="none" stroke="#16a34a" strokeWidth="1.2" opacity=".7" />
      </g></Pop>
    </>}>
      <Layer id="ii" kind="icon" x={70} y={42} w={34} h={34} at={.85} align="center"><Icon name="shield" size={18} color={DEEP} id="shield" /></Layer>
      <Layer id="t" x={114} y={38} w={240} h={42} at={.75}><span className="stack"><Text size={15.5} weight={600}>Fact check</Text><Text size={12} color={SUB} className="sub">Checking 3 sources</Text></span></Layer>
      <Layer id="cq" x={94} y={96} w={180} h={66} at={1.05}><span className="stack" style={{ gap: 3 }}><Text size={15} weight={600} style={{ whiteSpace: 'normal', lineHeight: 1.3 }}>Respite care hours fell 12% in 2025.</Text></span></Layer>
      <Layer id="cs" x={70} y={180} w={300} h={22} at={1.1}><Text size={12} weight={600} color={SUB}>Northwind Weekly · Oct 12</Text></Layer>
      {FSRC.map(([m, n, , col], i) => (
        <React.Fragment key={m}>
          <Layer id={`mi${i}`} x={70} y={FY(i) + 3} w={26} h={26} at={1.2 + i * .07} align="center"><Text size={11.5} weight={700} color={col}>{m}</Text></Layer>
          <Layer id={`sn${i}`} x={106} y={FY(i)} w={200} h={32} at={1.25 + i * .07}><Text size={13.5} weight={600}>{n}</Text></Layer>
          <Layer id={`st${i}`} x={290} y={FY(i)} w={90} h={32} at={1.3 + i * .07} align="right"><Text size={12} weight={600} color={MUTE} className={`stt${i}`}>Checking</Text></Layer>
          <Layer id={`ok${i}`} kind="icon" x={386} y={FY(i) + 4} w={24} h={24} at={2.6 + i * .18} align="center"><Icon name="checkCircle" size={22} color="#16a34a" id={`ok${i}`} /></Layer>
        </React.Fragment>
      ))}
      <Layer id="sl" className="stampl gap6" x={SC[0] - 62} y={SC[1] - 25} w={124} h={50} at={2.2} align="center"><Icon name="checkmark" size={18} color="#15803d" id="ck" /><Text size={17} weight={700} color="#15803d" style={{ letterSpacing: '.01em' }}>Verified</Text></Layer>
    </Frame>
  );
}
FactCheckStamp.motion = c => {
  // Drop toward the card (from 1.7x), squash on impact, spring back and settle at -8 deg.
  const g = c.q('.stamp'), L = c.q('.stampl'), ring = c.q('.inkring'), pin = c.ease('power3.in'), el = c.ease('elastic.out(1,0.45)'), lin = c.ease('none');
  c.after(t => {
    const a = t < IMPACT, sx = a ? tw(t, IMPACT - .24, .24, 1.7, 1.08, pin) : tw(t, IMPACT, .6, 1.08, 1, el), sy = a ? tw(t, IMPACT - .24, .24, 1.7, .86, pin) : tw(t, IMPACT, .6, .86, 1, el);
    const r = a ? tw(t, IMPACT - .24, .24, -16, -9, pin) : tw(t, IMPACT, .6, -9, -8, el);
    const o = tw(t, IMPACT - .24, .1, 0, 1, lin) * tw(t, c.T.collapse, .25, 1, 0, lin);
    g.setAttribute('transform', `translate(${SC[0]} ${SC[1]}) rotate(${r.toFixed(3)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-SC[0]} ${-SC[1]})`);
    g.setAttribute('opacity', o.toFixed(3));
    const k = cl((t - IMPACT) / .6), ko = 1 - Math.pow(1 - k, 2);
    ring.setAttribute('r', (32 + 50 * ko).toFixed(2)); ring.setAttribute('opacity', (t < IMPACT ? 0 : .55 * (1 - ko)).toFixed(3));
    L.style.transform = `rotate(${r.toFixed(3)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`; L.style.opacity = o.toFixed(3); L.style.visibility = o < .002 ? 'hidden' : 'visible'; g.setAttribute('visibility', o < .002 ? 'hidden' : 'visible');
  });
  c.fromTo('[data-surf="claim"]', { y: 0 }, { y: 2, duration: .06, ease: 'power2.out' }, IMPACT).fromTo('[data-surf="claim"]', { y: 2 }, { y: 0, duration: .4, ease: 'elastic.out(1,0.5)' }, IMPACT + .06);
  c.icon('ck', 0, 44, IMPACT + .05, .5);
  FSRC.forEach((_, i) => {
    const at = 2.6 + i * .18;
    c.fromTo(`.pend${i}`, { scale: 1, opacity: 1, transformOrigin: '50% 50%' }, { scale: .3, opacity: 0, duration: .16, ease: 'power2.in' }, at - .04);
    c.icon(`ok${i}`, 8, 39, at + .04, .6);
    c.swap(`[data-layer="st${i}"] .stt${i}`, ['Checking', 'Confirms'], [at]);
    c.fromTo(`.stt${i}`, { color: MUTE }, { color: GREEN, duration: .2 }, at);
  });
  c.swap('[data-layer="t"] .sub', ['Checking 3 sources', '3 of 3 sources confirm'], [3.1]);
  c.icon('shield', 0, 33, .95, .9);
};
Object.assign(FactCheckStamp, {
  id: 'fact-check-stamp', title: 'Fact-check stamp', category: CAT, w: W, h: H, focus: { x: 260, y: 160 }, push: 1.04, exit: [240, 180],
  summary: 'A claim card with its sources. A verified stamp presses down with a squash and an ink ring, then each source check resolves in turn.',
  usage: `<FactCheckStamp />`, icons: ['shield', 'checkmark', 'checkCircle']
});

export const LIST_F = [PriceTags, ReceiptStack, TotalCounter, ResearchTabs, SourcesList, FilingCabinet, WarehouseShot, SpillingPages, FactCheckStamp];
