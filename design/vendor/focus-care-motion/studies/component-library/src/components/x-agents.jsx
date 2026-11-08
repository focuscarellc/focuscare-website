// Explainer set: agents. See EXPLAINER-BRIEF.md.
// App and agent explainers: app demo, phone mockup, loops, agent cards and logs, org charts,
// plugs, workflow and data-flow graphs, and prompt steering. Fictional names only.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect, rr, clamp } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', MUTE = '#94a3b8', BLUE = '#2d7dff';
const GREEN = '#16a34a', GREEN_D = '#15803d';
const FONT = 'Inter, system-ui, sans-serif';
const pill = (bg, fg, extra) => ({ background: bg, color: fg, height: 22, padding: '0 9px', borderRadius: 11, fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', fontFamily: FONT, ...extra });
const Av = ({ t, bg, fg, s = 22, ring }) => (
  <span style={{ width: s, height: s, borderRadius: s / 2, background: bg, color: fg, fontSize: Math.round(s * .42), fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontFamily: FONT, boxShadow: ring ? '0 0 0 2px #fff' : undefined }}>{t}</span>
);
// Last frame of each native useAnimations asset used for a full play-through (frame count - 1).
const UA_END = { clipboard: 33, zap: 33, refreshCcw: 39, bookOpen: 43, edit2: 35, userCheck: 39, layers: 39, code: 33, globe: 39, fileText: 39, terminal: 39, shield: 33, mail: 19, filter: 59, smartphone: 39, database: 39, wifi: 39, navigation: 39 };
// lottie-web promotes every icon <svg> to its own compositor layer (translate3d). Under the 3D
// camera that layer keeps a raster scale from whichever frame was painted before, so the same
// time could render with 1-LSB differences after out-of-order seeks. Flattening the icons into
// the carrier layer makes every seek paint identically.
const flatIcons = c => c.after(() => { for (const s of c.qa('.fc-ua svg')) if (s.style.transform !== 'none') s.style.transform = 'none'; });
const Dot = ({ c = BLUE, s = 6 }) => <span style={{ width: s, height: s, borderRadius: s / 2, background: c, flex: 'none', display: 'inline-block' }} />;

// ---------------------------------------------------------------- App demo
const AD_ROWS = [['Morning med pass', 'AK', '#dbeafe', DEEP], ['Update care plan', 'SR', '#dcfce7', GREEN_D], ['Book dentist visit', 'LC', '#fef3c7', '#a16207']];
const ADY = i => 124 + i * 42, AD_STEP = 42;
const AD_SIDE = [['inbox', 'Inbox'], ['list', 'Tasks'], ['users', 'Team'], ['settings', 'Settings']];
const AdRow = ({ name, ini, bg, fg, fresh }) => (
  <span style={{ display: 'flex', alignItems: 'center', width: 228, gap: 10 }}>
    <span style={{ width: 14, height: 14, borderRadius: 7, boxShadow: `inset 0 0 0 1.5px ${fresh ? '#93c5fd' : '#cbd5e1'}`, flex: 'none' }} />
    <Text size={13} weight={600} style={{ flex: 1 }}>{name}</Text>
    {fresh && <span style={pill('#dbeafe', DEEP, { height: 20, fontSize: 11, padding: '0 8px' })}>New</span>}
    <Av t={ini} bg={bg} fg={fg} />
  </span>
);
export function AppDemo({ uid = 'app-demo' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Task app: creating a new task" svg={<>
      <Surf id="win" x={40} y={24} w={400} h={312} r={20} tone="white" elev={3} seed={[240, 180]} />
      {[0, 1, 2].map(i => <Pop key={i} id={`wd${i}`} at={.78 + i * .04}><circle cx={60 + i * 14} cy={42} r={4} fill="#e2e8f0" /></Pop>)}
      <Draw id="hdr" d="M40 60.5 H440" stroke="#eef2f6" width={1} at={.8} />
      <Surf id="side" x={52} y={72} w={104} h={252} r={14} tone="muted" elev={0} seed={[104, 120]} order={1} />
      <Surf id="act" x={58} y={112} w={92} h={30} r={9} tone="white" elev={1} seed={[72, 127]} at={1.0} />
      <Surf id="btn" x={330} y={78} w={94} h={32} r={10} tone="blue" elev={2} seed={[377, 94]} order={2} />
      {AD_ROWS.map((_, i) => <Surf key={i} id={`r${i}`} x={172} y={ADY(i)} w={252} h={34} r={11} tone="white" elev={1} seed={[192, ADY(i) + 17]} at={1.05 + i * .08} />)}
      <Surf id="nr" x={172} y={ADY(0)} w={252} h={34} r={11} tone="tint" elev={1} seed={[377, 94]} at={2.42} />
      <Surf id="toast" x={232} y={288} w={192} h={36} r={18} tone="ink" elev={3} seed={[328, 306]} at={2.9} />
    </>}>
      <Layer id="ttl" x={140} y={33} w={200} h={18} at={.8} align="center"><Text size={12} weight={600} color={SUB}>Northwind Tasks</Text></Layer>
      {AD_SIDE.map(([ic, l], i) => (
        <Layer key={l} id={`sd${i}`} x={68} y={112 + (i - 1) * 34} w={82} h={30} at={.95 + i * .05} className="gap8">
          <Icon name={ic} size={16} color={i === 1 ? DEEP : SUB} id={`si${i}`} /><Text size={12.5} weight={i === 1 ? 600 : 500} color={i === 1 ? INK : BODY}>{l}</Text>
        </Layer>
      ))}
      <Layer id="h" x={172} y={74} w={150} h={22} at={.85}><Text size={15.5} weight={600}>Today</Text></Layer>
      <Layer id="sub" x={172} y={96} w={150} h={18} at={.9}><Text size={12} color={SUB} className="tnum cnt">3 open tasks</Text></Layer>
      <Layer id="bt" x={330} y={78} w={94} h={32} at={1.1} align="center" className="gap6"><Icon name="plusCircle" size={15} color="#fff" id="plus" /><Text size={12.5} weight={600} color="#fff">New task</Text></Layer>
      {AD_ROWS.map(([n, ini, bg, fg], i) => <Layer key={n} id={`rl${i}`} x={184} y={ADY(i)} w={232} h={34} at={1.2 + i * .07}><AdRow name={n} ini={ini} bg={bg} fg={fg} /></Layer>)}
      <Layer id="nl" x={184} y={ADY(0)} w={232} h={34} at={2.95}><AdRow name="Call pharmacy for refill" ini="JP" bg="#e0e7ff" fg="#4338ca" fresh /></Layer>
      <Layer id="tl" x={246} y={288} w={170} h={36} at={3.2} className="gap8">
        <Icon name="checkCircle" size={17} color="#4ade80" id="ok" /><Text size={12.5} weight={600} color="#fff" style={{ flex: 1 }}>Task created</Text><Text size={12} weight={600} color="#93c5fd">Undo</Text>
      </Layer>
    </Frame>
  );
}
AppDemo.motion = c => {
  flatIcons(c);
  c.cursor([{ at: 1.75, x: 300, y: 196 }, { at: 2.3, x: 384, y: 104, press: true }, { at: 2.85, x: 352, y: 50 }]);
  c.press('btn', '[data-layer="bt"]', 2.3, 1);
  c.icon('plus', 0, 33, 2.3, .5);
  AD_ROWS.forEach((_, i) => {
    c.reshape(`r${i}`, rect(172, ADY(i) + AD_STEP, 252, 34, 11), 2.42 + i * .03, .55, 'back.out(1.2)');
    c.fromTo(`[data-layer="rl${i}"]`, { y: 0 }, { y: AD_STEP, duration: .55, ease: 'back.out(1.2)' }, 2.42 + i * .03);
  });
  c.swap('[data-layer="sub"] .cnt', ['3 open tasks', '4 open tasks'], [2.95]);
  c.icon('ok', 0, 39, 3.3, .6);
};
Object.assign(AppDemo, {
  id: 'app-demo', title: 'App demo', category: 'Agents & apps', w: W, h: H, focus: { x: 252, y: 172 }, push: 1.04, orbit: .8, exit: [240, 180],
  summary: 'An app window with a sidebar and task list. Clicking New task grows a row out of the button, pushes the list down and raises a confirming toast.',
  usage: `<AppDemo />`, icons: ['inbox', 'list', 'users', 'settings', 'plusCircle', 'checkCircle']
});

// ---------------------------------------------------------------- Phone mockup
const PS = { x: 167, y: 21, w: 146, h: 318, r: 28 };
export function PhoneMockup({ uid = 'phone-mockup' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Phone app opening a sheet and a notification" svg={<>
      <defs><clipPath id={`${uid}-scr`}><path d={rr(PS.x, PS.y, PS.w, PS.h, PS.r)} /></clipPath></defs>
      <Pop id="keys" at={.9}><rect x={157} y={92} width={4} height={28} rx={2} fill="#334155" /><rect x={157} y={128} width={4} height={28} rx={2} fill="#334155" /><rect x={319} y={112} width={4} height={44} rx={2} fill="#334155" /></Pop>
      <Surf id="body" x={160} y={14} w={160} h={332} r={35} tone="ink" elev={3} seed={[240, 180]} />
      <Surf id="scr" x={PS.x} y={PS.y} w={PS.w} h={PS.h} r={PS.r} tone="white" elev={0} seed={[240, 180]} order={1} />
      <Surf id="notch" x={214} y={29} w={52} h={16} r={8} tone="ink" elev={0} seed={[240, 37]} at={.95} />
      <Surf id="c0" x={177} y={104} w={126} h={54} r={14} tone="tint" elev={0} seed={[190, 131]} at={1.05} />
      <Surf id="c1" x={177} y={166} w={126} h={54} r={14} tone="muted" elev={0} seed={[190, 193]} at={1.12} />
      <Surf id="btn" x={177} y={290} w={126} h={36} r={12} tone="blue" elev={2} seed={[240, 308]} at={1.2} />
      <g clipPath={`url(#${uid}-scr)`}>
        <g className="pm-sheet" transform="translate(0 92)">
          <Pop id="shsh"><path d={rr(171, 243, 138, 60, 24)} fill="rgba(15,23,42,.16)" filter={`url(#${uid}-blur-a)`} /></Pop>
          <Surf id="sheet" x={PS.x} y={249} w={PS.w} h={90} r={24} tone="white" elev={1} seed={[240, 294]} at={1.0} />
          <Pop id="grab" at={1.0}><rect x={226} y={256} width={28} height={4} rx={2} fill="#cbd5e1" /></Pop>
        </g>
        <g className="pm-ban" transform="translate(0 -80)">
          <g className="pm-bsh" opacity="0"><path d={rr(181, 64, 118, 42, 16)} fill="rgba(29,78,216,.16)" filter={`url(#${uid}-blur-a)`} /><path d={rr(173.5, 53.5, 133, 48, 16)} fill="rgba(15,23,42,.12)" filter={`url(#${uid}-blur-c)`} /></g>
          <Surf id="ban" x={173} y={52} w={134} h={48} r={16} tone="white" elev={0} seed={[240, 76]} at={1.0} />
          <Surf id="bant" x={181} y={63} w={26} h={26} r={8} tone="blue" elev={0} seed={[194, 76]} at={1.05} />
        </g>
      </g>
    </>}>
      <Layer id="tm" x={182} y={27} w={40} h={18} at={1.0}><Text size={11.5} weight={600} className="tnum">9:41</Text></Layer>
      <Layer id="sb" x={262} y={27} w={40} h={18} at={1.0} align="right" className="gap6">
        <Icon name="wifi" size={13} color={INK} id="wifi" />
        <span style={{ width: 18, height: 9, borderRadius: 3, boxShadow: `inset 0 0 0 1.4px ${INK}`, padding: 2, boxSizing: 'border-box', display: 'inline-flex' }}><span style={{ width: '70%', background: INK, borderRadius: 1 }} /></span>
      </Layer>
      <Layer id="h1" x={181} y={56} w={120} h={26} at={1.05}><Text size={18} weight={700} style={{ letterSpacing: '-.02em' }}>Shifts</Text></Layer>
      <Layer id="h2" x={181} y={80} w={120} h={16} at={1.1}><Text size={11} color={SUB}>Thursday, Nov 6</Text></Layer>
      <Layer id="c0t" x={189} y={104} w={110} h={54} at={1.2}><span className="stack"><Text size={12.5} weight={600} color={DEEP}>Day shift</Text><Text size={11} color={BODY}>7 AM to 3 PM · you</Text></span></Layer>
      <Layer id="c1t" x={189} y={166} w={110} h={54} at={1.26}><span className="stack"><Text size={12.5} weight={600}>Evening shift</Text><Text size={11} color={BODY}>3 PM to 11 PM · Lee C.</Text></span></Layer>
      <Layer id="team" x={181} y={232} w={120} h={46} at={1.32}>
        <span className="stack" style={{ gap: 6 }}><Text size={11} weight={500} color={SUB}>On shift today</Text>
          <span style={{ display: 'flex', gap: 4 }}>{[['AK', '#dbeafe', DEEP], ['SR', '#dcfce7', GREEN_D], ['LC', '#fef3c7', '#a16207'], ['JP', '#e0e7ff', '#4338ca']].map(([t, b, f]) => <Av key={t} t={t} bg={b} fg={f} s={22} />)}</span>
        </span>
      </Layer>
      <Layer id="bt" x={177} y={290} w={126} h={36} at={1.36} align="center"><Text size={13} weight={600} color="#fff">Request swap</Text></Layer>
      <Layer id="s1" x={181} y={264} w={124} h={20} at={2.74}><Text size={13} weight={600}>Swap request sent</Text></Layer>
      <Layer id="s2" x={181} y={285} w={124} h={18} at={2.8} className="gap6"><Icon name="checkCircle" size={14} color={GREEN} id="sok" /><Text size={11} color={SUB}>Thu · Day shift</Text></Layer>
      <Layer id="s3" x={181} y={306} w={124} h={24} at={2.86} className="gap8">
        <span style={{ display: 'flex', gap: 4 }}><Av t="SR" bg="#dcfce7" fg={GREEN_D} /><Av t="LC" bg="#fef3c7" fg="#a16207" /></span><Text size={11} color={SUB}>2 notified</Text>
      </Layer>
      <Layer id="bi" kind="icon" x={181} y={63} w={26} h={26} at={3.3} align="center"><Icon name="notification" size={15} color="#fff" id="bell" /></Layer>
      <Layer id="bx" x={214} y={55} w={90} h={42} at={3.32}><span className="stack"><Text size={11.5} weight={600}>Sam R. accepted</Text><Text size={10.5} color={SUB}>Thu day shift swap</Text></span></Layer>
    </Frame>
  );
}
PhoneMockup.motion = c => {
  flatIcons(c);
  c.cursor([{ at: 2.2, x: 262, y: 314, press: true }]);
  c.press('btn', '[data-layer="bt"]', 2.2, 1);
  c.fromTo('.pm-sheet', { y: 92 }, { y: 0, duration: .5, ease: 'back.out(1.15)' }, 2.32);
  c.hide('team', 2.26, .18); c.hide('bt', 2.38, .18);
  c.icon('sok', 0, 39, 2.95, .6);
  c.fromTo('.pm-ban', { y: -80 }, { y: 0, duration: .55, ease: 'back.out(1.3)' }, 3.05);
  c.fromTo('.pm-bsh', { opacity: 0 }, { opacity: 1, duration: .3 }, 3.1).fromTo('.pm-bsh', { opacity: 1 }, { opacity: 0, duration: .2 }, c.T.collapse);
  c.hide('h1', 3.08, .18); c.hide('h2', 3.06, .18);
  c.icon('bell', 0, 7, 3.45, .2); c.icon('bell', 7, 0, 3.66, .25);
};
Object.assign(PhoneMockup, {
  id: 'phone-mockup', title: 'Phone mockup', category: 'Agents & apps', w: W, h: H, focus: { x: 240, y: 180 }, push: 1.06, orbit: 1, exit: [240, 180],
  summary: 'A rigid phone frame with notch and status bar. Tapping Request swap slides a sheet up from the bottom edge, then a notification banner drops in.',
  usage: `<PhoneMockup />`, icons: ['wifi', 'checkCircle', 'notification']
});

// ---------------------------------------------------------------- Loop diagram
const LP = [[240, 100], [336, 196], [240, 292], [144, 196]];
const LN = [['Plan', 'clipboard'], ['Act', 'zap'], ['Observe', 'visibility'], ['Reflect', 'refreshCcw']];
const LARC = 'M240 100 A96 96 0 1 1 239.99 100';
const LT = i => 2.0 + i * .45;
const chev = th => { const a = th * Math.PI / 180, x = 240 + 96 * Math.sin(a), y = 196 - 96 * Math.cos(a); return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${th})`; };
export function LoopDiagram({ uid = 'loop-diagram' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Agent loop: plan, act, observe, reflect" svg={<>
      <Surf id="card" x={40} y={16} w={400} h={328} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="ring" d={LARC} stroke="#e2e8f0" width={3} at={.9} dur={.9} />
      <path className="lp-prog" d={LARC} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      {[45, 135, 225, 315].map((th, i) => <Pop key={th} id={`ch${i}`} at={1.5 + i * .05}><path className={`lp-ch${i}`} d="M-3 -5.5 L2.5 0 L-3 5.5" transform={chev(th)} fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></Pop>)}
      <g className="lp-tok" opacity="0"><circle r="12" fill={BLUE} opacity=".16" /><circle r="6" fill={BLUE} stroke="#fff" strokeWidth="2.5" /></g>
      {LP.map(([x, y], i) => <Surf key={i} id={`n${i}`} x={x - 52} y={y - 18} w={104} h={36} r={18} tone="white" elev={2} seed={[x, y]} at={1.0 + i * .08} />)}
      {LP.map(([x, y], i) => <Surf key={i} id={`l${i}`} x={x - 52} y={y - 18} w={104} h={36} r={18} tone="blue" elev={0} seed={[x, y]} at={LT(i) - .04} />)}
    </>}>
      <Layer id="t" x={60} y={30} w={200} h={22} at={.7}><Text size={15.5} weight={600}>Agent loop</Text></Layer>
      <Layer id="s" x={60} y={52} w={220} h={18} at={.76}><Text size={12.5} color={SUB}>Each pass refines the plan</Text></Layer>
      {LP.map(([x, y], i) => (
        <Layer key={i} id={`ln${i}`} x={x - 52} y={y - 18} w={104} h={36} at={1.2 + i * .08} align="center" className="gap6">
          <Icon name={LN[i][1]} size={16} color={DEEP} id={`lpi${i}`} /><Text size={13} weight={600} className={`lpn${i}`}>{LN[i][0]}</Text>
        </Layer>
      ))}
      <Layer id="ct" x={180} y={156} w={120} h={80} at={1.4} align="center">
        <span className="stack center"><Text size={11.5} weight={500} color={SUB}>Iteration</Text><Text size={30} weight={700} className="tnum lp-it" style={{ letterSpacing: '-.03em', lineHeight: 1.1 }}>1</Text><Text size={12} weight={600} color={DEEP} className="lp-st">Ready</Text></span>
      </Layer>
    </Frame>
  );
}
LoopDiagram.motion = c => {
  flatIcons(c);
  const arc = c.q('.lp-prog'), tok = c.q('.lp-tok'), L = arc.getTotalLength();
  c.draw(arc, '0% 0%', '0% 100%', 2.0, 1.8, 'none');
  c.draw(arc, '0% 100%', '100% 100%', c.T.collapse + .05, .4, 'power2.in');
  c.after(t => {
    const p = clamp((t - 2.0) / 1.8), pt = arc.getPointAtLength(L * p);
    tok.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`);
    tok.setAttribute('opacity', t > 1.92 && t < c.T.collapse ? '1' : '0');
  });
  LN.forEach((_, i) => {
    const at = LT(i) + .06;
    c.fromTo(`.lpn${i}`, { color: INK }, { color: '#ffffff', duration: .2 }, at);
    if (i !== 3) c.fromTo(`[data-icon="lpi${i}"]`, { color: DEEP }, { color: '#ffffff', duration: .2 }, at);
    if (i < 2) c.icon(`lpi${i}`, 0, UA_END[LN[i][1]], at, .7);
    c.fromTo(`.lp-ch${i}`, { stroke: '#94a3b8' }, { stroke: BLUE, duration: .15 }, 2.0 + (45 + i * 90) / 360 * 1.8 - .02);
  });
  c.press(['n0', 'l0'], '[data-layer="ln0"]', 3.8, .8);
  c.swap('.lp-it', ['1', '2'], [3.82]);
  c.swap('.lp-st', ['Ready', 'Planning', 'Acting', 'Observing', 'Reflecting', 'Planning'], [2.0, 2.45, 2.9, 3.35, 3.8]);
};
Object.assign(LoopDiagram, {
  id: 'loop-diagram', title: 'Loop diagram', category: 'Agents & apps', w: W, h: H, focus: { x: 240, y: 196 }, push: 1.06, orbit: .9, exit: [240, 180],
  summary: 'A circular plan, act, observe, reflect loop. The ring draws, then a token follows the path and lights each node as it passes, starting iteration two.',
  usage: `<LoopDiagram />`, icons: ['clipboard', 'zap', 'visibility', 'refreshCcw']
});

// ---------------------------------------------------------------- Agent cards
const AC = [['Researcher', 'Finds sources', 'bookOpen'], ['Writer', 'Drafts update', 'edit2'], ['Reviewer', 'Checks tone', 'userCheck']];
const ACX = i => 48 + i * 134, ACY = 102;
const ACS = i => 1.9 + i * .62, ACD = i => ACS(i) + .72;
export function AgentCards({ uid = 'agent-cards' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Three agents moving from idle to done" svg={<>
      {AC.map((_, i) => <Surf key={i} id={`k${i}`} x={ACX(i)} y={ACY} w={116} h={204} r={18} tone="white" elev={3} seed={[ACX(i) + 58, ACY + 102]} order={i} />)}
      <Surf id="cp0" x={330} y={50} w={102} h={24} r={12} tone="tint" elev={0} seed={[344, 62]} at={.8} />
      <Surf id="cp1" x={330} y={50} w={102} h={24} r={12} tone="greenTint" elev={0} seed={[344, 62]} at={ACD(2) - .04} />
      {AC.map((_, i) => <path key={i} className={`ac-ol${i}`} d={rr(ACX(i) - 3.5, ACY - 3.5, 123, 211, 21)} fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />)}
      {AC.map((_, i) => <Surf key={i} id={`av${i}`} x={ACX(i) + 14} y={ACY + 16} w={40} h={40} r={12} tone="tint" elev={0} seed={[ACX(i) + 34, ACY + 36]} at={1.0 + i * .08} />)}
      {AC.map((_, i) => <Surf key={i} id={`tr${i}`} x={ACX(i) + 14} y={ACY + 178} w={88} h={6} r={3} tone="track" elev={0} seed={[ACX(i) + 18, ACY + 181]} at={1.15 + i * .08} />)}
      {AC.map((_, i) => ['muted', 'tint', 'greenTint'].map((tone, k) => <Surf key={`${i}${k}`} id={`ps${i}${k}`} x={ACX(i) + 14} y={ACY + 114} w={84} h={24} r={12} tone={tone} elev={0} seed={[ACX(i) + 26, ACY + 126]} at={[1.15 + i * .08, ACS(i) - .04, ACD(i) - .04][k]} />))}
      {AC.map((_, i) => <path key={i} className={`ac-bar${i}`} d={`M${ACX(i) + 17} ${ACY + 181} H${ACX(i) + 99}`} fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" />)}
      {AC.map((_, i) => <Surf key={i} id={`bd${i}`} x={ACX(i) + 80} y={ACY + 20} w={22} h={22} r={11} tone="green" elev={1} seed={[ACX(i) + 91, ACY + 31]} at={ACD(i) - .02} />)}
    </>}>
      <Layer id="t" x={48} y={42} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Agent run</Text></Layer>
      <Layer id="s" x={48} y={64} w={260} h={18} at={.76}><Text size={12.5} color={SUB}>Family update for Jordan Ellis</Text></Layer>
      <Layer id="cnt" x={330} y={50} w={102} h={24} at={.95} align="center"><span className="ac-cp" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: DEEP, whiteSpace: 'nowrap' }}><span className="tnum ac-cnt">0 of 3 done</span></span></Layer>
      {AC.map(([n, r, ic], i) => (
        <React.Fragment key={n}>
          <Layer id={`ai${i}`} kind="icon" x={ACX(i) + 14} y={ACY + 16} w={40} h={40} at={1.15 + i * .08} align="center"><Icon name={ic} size={20} color={DEEP} id={`aic${i}`} /></Layer>
          <Layer id={`ck${i}`} kind="icon" x={ACX(i) + 80} y={ACY + 20} w={22} h={22} at={ACD(i) + .1} align="center"><Icon name="checkmark" size={14} color="#fff" id={`ack${i}`} /></Layer>
          <Layer id={`nm${i}`} x={ACX(i) + 14} y={ACY + 64} w={96} h={20} at={1.2 + i * .08}><Text size={14} weight={600}>{n}</Text></Layer>
          <Layer id={`ro${i}`} x={ACX(i) + 14} y={ACY + 84} w={96} h={18} at={1.25 + i * .08}><Text size={12} color={SUB}>{r}</Text></Layer>
          <Layer id={`pl${i}`} x={ACX(i) + 14} y={ACY + 114} w={84} h={24} at={1.3 + i * .08} align="center"><span className={`ac-pill${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: BODY, whiteSpace: 'nowrap' }}><Dot c="currentColor" /><span className={`ac-pt${i}`}>Idle</span></span></Layer>
          <Layer id={`pg${i}`} x={ACX(i) + 14} y={ACY + 152} w={88} h={18} at={1.35 + i * .08}>
            <span style={{ display: 'flex', justifyContent: 'space-between', width: 88 }}><Text size={11.5} color={SUB}>Progress</Text><Text size={11.5} weight={600} className={`tnum ac-pc${i}`}>0%</Text></span>
          </Layer>
        </React.Fragment>
      ))}
      {[0, 1].map(i => <Layer key={i} id={`ar${i}`} kind="icon" x={ACX(i) + 116} y={ACY + 93} w={18} h={18} at={1.4 + i * .05} align="center"><Icon name="arrowRight" size={14} color={MUTE} id={`arr${i}`} /></Layer>)}
    </Frame>
  );
}
AgentCards.motion = c => {
  flatIcons(c);
  AC.forEach((_, i) => {
    const s = ACS(i), d = ACD(i);
    c.draw(`.ac-ol${i}`, '0% 0%', '0% 100%', s - .05, .45, 'power2.out');
    c.draw(`.ac-ol${i}`, '0% 100%', '100% 100%', d + .05, .35, 'power2.in');
    c.draw(`.ac-bar${i}`, '0% 0%', '0% 100%', s, d - s, 'power1.inOut');
    c.draw(`.ac-bar${i}`, '0% 100%', '100% 100%', c.T.collapse + .02, .3, 'power2.in');
    c.fromTo(`.ac-bar${i}`, { stroke: BLUE }, { stroke: GREEN, duration: .25 }, d);
    c.swap(`.ac-pt${i}`, ['Idle', 'Working', 'Done'], [s, d]);
    c.fromTo(`.ac-pill${i}`, { color: BODY }, { color: DEEP, duration: .2 }, s);
    c.fromTo(`.ac-pill${i}`, { color: DEEP }, { color: GREEN_D, duration: .2 }, d);
    c.count(`.ac-pc${i}`, 0, 100, s, d - s, v => `${Math.round(v)}%`, 'power1.inOut');
    c.icon(`aic${i}`, 0, UA_END[AC[i][2]], s, .8);
    c.icon(`ack${i}`, 0, 44, d + .14, .5);
    if (i < 2) { c.fromTo(`[data-icon="arr${i}"]`, { color: MUTE }, { color: DEEP, duration: .2 }, d); c.icon(`arr${i}`, 0, 35, d, .6); }
  });
  c.swap('.ac-cnt', ['0 of 3 done', '1 of 3 done', '2 of 3 done', '3 of 3 done'], AC.map((_, i) => ACD(i)));
  c.fromTo('.ac-cp', { color: DEEP }, { color: GREEN_D, duration: .25 }, ACD(2));
};
Object.assign(AgentCards, {
  id: 'agent-cards', title: 'Agent cards', category: 'Agents & apps', w: W, h: H, focus: { x: 240, y: 190 }, push: 1.04, orbit: .8, exit: [240, 190],
  summary: 'Researcher, Writer and Reviewer cards hand work along. Each one outlines while working, fills its progress bar and settles on a green Done badge.',
  usage: `<AgentCards />`, icons: ['bookOpen', 'edit2', 'userCheck', 'checkmark', 'arrowRight']
});

// ---------------------------------------------------------------- Agent chatlog
const CL_ROW = (label, value, strong) => (
  <span style={{ display: 'flex', alignItems: 'center' }}><Text size={11.5} weight={600} color={SUB} style={{ width: 72 }}>{label}</Text><Text size={12} weight={strong ? 600 : 500} color={strong ? INK : BODY}>{value}</Text></span>
);
export function AgentChatlog({ uid = 'agent-chatlog' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Agent log with expanding tool calls" svg={<>
      <Surf id="card" x={40} y={14} w={400} h={328} r={22} tone="white" elev={3} seed={[240, 178]} />
      <Surf id="av" x={58} y={28} w={34} h={34} r={17} tone="tint" elev={0} seed={[75, 45]} order={1} />
      <Surf id="mdp" x={358} y={33} w={64} h={24} r={12} tone="muted" elev={0} seed={[372, 45]} at={.8} />
      <Draw id="div" d="M40 74.5 H440" stroke="#eef2f6" width={1} at={.8} />
      <Draw id="rail" d="M70 96 V314" stroke="#e8edf3" width={2} at={1.0} dur={.7} />
      <Pop id="d0" at={1.0}><circle cx={70} cy={101} r={4.5} fill="#cbd5e1" stroke="#fff" strokeWidth="2" /></Pop>
      <Pop id="d1" at={1.1}><circle cx={70} cy={137} r={4.5} fill={BLUE} stroke="#fff" strokeWidth="2" /></Pop>
      <Pop id="d2" at={2.05}><circle cx={70} cy={223} r={4.5} fill={BLUE} stroke="#fff" strokeWidth="2" /></Pop>
      <Pop id="d3" at={3.1}><circle cx={70} cy={311} r={4.5} fill={GREEN} stroke="#fff" strokeWidth="2" /></Pop>
      <Surf id="u0" x={88} y={86} w={250} h={30} r={15} tone="muted" elev={0} seed={[100, 101]} at={1.0} />
      <Surf id="t1" x={88} y={122} w={152} h={30} r={10} tone="tint" elev={0} seed={[100, 137]} at={1.1} />
      <Surf id="t2" x={88} y={208} w={176} h={30} r={10} tone="tint" elev={0} seed={[100, 223]} at={2.05} />
      <Surf id="ans" x={88} y={294} w={336} h={34} r={12} tone="greenTint" elev={0} seed={[100, 311]} at={3.1} />
    </>}>
      <Layer id="ai" kind="icon" x={58} y={28} w={34} h={34} at={.85} align="center"><Icon name="cpu" size={18} color={DEEP} id="cpu" /></Layer>
      <Layer id="hn" x={102} y={26} w={220} h={20} at={.8}><Text size={14.5} weight={600}>Northwind agent</Text></Layer>
      <Layer id="hs" x={102} y={45} w={220} h={18} at={.86} className="gap6"><span className="live-dot" /><Text size={12} color={SUB} className="cl-st">Running · step 1 of 4</Text></Layer>
      <Layer id="md" x={358} y={33} w={64} h={24} at={.95} align="center"><Text size={11.5} weight={600} color={BODY}>Model A</Text></Layer>
      <Layer id="u0t" x={100} y={86} w={236} h={30} at={1.1} className="gap6"><Icon name="user" size={14} color={SUB} id="usr" /><Text size={12.5}>Find cover for Thursday's day shift</Text></Layer>
      <Layer id="h1" x={98} y={122} w={140} h={30} at={1.25} className="gap8"><Icon name="terminal" size={15} color={DEEP} id="tm1" /><Text size={12.5} weight={600} color={DEEP}>search_shifts</Text></Layer>
      <Layer id="sp1" kind="icon" x={214} y={129} w={16} h={16} at={1.3} align="center"><Icon name="loading3" size={15} color={DEEP} id="sp1" /></Layer>
      <Layer id="ok1" kind="icon" x={214} y={129} w={16} h={16} at={2.48} align="center"><Icon name="checkCircle" size={15} color={GREEN} id="ok1" /></Layer>
      <Layer id="a1" x={98} y={156} w={316} h={18} at={2.22}>{CL_ROW('Arguments', 'week 45, site Maple House')}</Layer>
      <Layer id="r1" x={98} y={176} w={316} h={18} at={2.42}>{CL_ROW('Result', '6 open shifts found', true)}</Layer>
      <Layer id="h2" x={98} y={208} w={160} h={30} at={2.2} className="gap8"><Icon name="terminal" size={15} color={DEEP} id="tm2" /><Text size={12.5} weight={600} color={DEEP}>check_availability</Text></Layer>
      <Layer id="sp2" kind="icon" x={240} y={215} w={16} h={16} at={2.25} align="center"><Icon name="loading3" size={15} color={DEEP} id="sp2" /></Layer>
      <Layer id="ok2" kind="icon" x={240} y={215} w={16} h={16} at={3.33} align="center"><Icon name="checkCircle" size={15} color={GREEN} id="ok2" /></Layer>
      <Layer id="a2" x={98} y={242} w={316} h={18} at={3.12}>{CL_ROW('Arguments', '6 shifts, Sam R. and Lee C.')}</Layer>
      <Layer id="r2" x={98} y={262} w={316} h={18} at={3.3}>{CL_ROW('Result', 'Sam R. is free Thursday', true)}</Layer>
      <Layer id="at" x={100} y={294} w={316} h={34} at={3.32} className="gap8"><Icon name="checkCircle" size={15} color={GREEN} id="okA" /><Text size={12.5} weight={600} color={GREEN_D}>Answer</Text><Text size={12.5}>Sam R. can cover Thursday's day shift.</Text></Layer>
    </Frame>
  );
}
AgentChatlog.motion = c => {
  flatIcons(c);
  c.reshape('t1', rect(88, 122, 336, 76, 12), 1.98, .5, 'back.out(1.1)');
  c.reshape('t2', rect(88, 208, 336, 76, 12), 2.92, .5, 'back.out(1.1)');
  for (let k = 0; 1.3 + k * .55 < 2.45; k++) c.icon('sp1', 0, 47, 1.3 + k * .55, .55);
  for (let k = 0; 2.25 + k * .55 < 3.3; k++) c.icon('sp2', 0, 47, 2.25 + k * .55, .55);
  c.hide('sp1', 2.4, .14); c.hide('sp2', 3.26, .14);
  c.icon('ok1', 0, 39, 2.52, .6); c.icon('ok2', 0, 39, 3.37, .6); c.icon('okA', 0, 39, 3.4, .6);
  c.icon('cpu', 0, 39, 1.0, .9);
  c.swap('.cl-st', ['Running · step 1 of 4', 'Running · step 2 of 4', 'Running · step 3 of 4', 'Done · 4 steps'], [1.98, 2.92, 3.32]);
};
Object.assign(AgentChatlog, {
  id: 'agent-chatlog', title: 'Agent chatlog', category: 'Agents & apps', w: W, h: H, focus: { x: 250, y: 200 }, push: 1.05, orbit: .85, exit: [240, 178],
  summary: 'A step log for an agent run. Each tool-call chip spins, then grows open to show its arguments and result, and the run ends on a green answer row.',
  usage: `<AgentChatlog />`, icons: ['cpu', 'user', 'terminal', 'loading3', 'checkCircle']
});

// ---------------------------------------------------------------- Org chart
const OL2 = [[140, 'Planner', 'layers'], [340, 'Builder', 'code']];
const OL3 = [[92, 'Search', 'globe', 0], [192, 'Reader', 'fileText', 0], [288, 'Coder', 'terminal', 1], [388, 'Tester', 'shield', 1]];
const elbow = (x0, y0, x1, y1) => { const m = (y0 + y1) / 2, s = Math.sign(x1 - x0), r = 8; return `M${x0} ${y0} V${m - r} Q${x0} ${m} ${x0 + s * r} ${m} H${x1 - s * r} Q${x1} ${m} ${x1} ${m + r} V${y1}`; };
const OC = [...OL2.map(([x]) => elbow(240, 106, x, 156)), ...OL3.map(([x, , , p]) => elbow(OL2[p][0], 196, x, 248))];
const OCT = k => (k < 2 ? 2.05 : 2.62), OCD = k => (k < 2 ? .38 : .36);
export function OrgChart({ uid = 'org-chart' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Agent org chart delegating to sub-agents" svg={<>
      <Surf id="card" x={36} y={16} w={408} h={312} r={22} tone="white" elev={3} seed={[240, 172]} />
      <Surf id="cp0" x={318} y={28} w={106} h={24} r={12} tone="muted" elev={0} seed={[332, 40]} at={.8} />
      <Surf id="cp1" x={318} y={28} w={106} h={24} r={12} tone="greenTint" elev={0} seed={[332, 40]} at={3.0} />
      {OC.map((d, k) => <Draw key={k} id={`cb${k}`} d={d} stroke="#cbd5e1" width={2} at={k < 2 ? 1.12 : 1.42 + (k - 2) * .04} dur={.42} />)}
      {OC.map((d, k) => <path key={k} className={`oc-a${k}`} d={d} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />)}
      {OC.map((_, k) => <circle key={k} className={`oc-p${k}`} r="4.5" fill={BLUE} stroke="#fff" strokeWidth="2" opacity="0" />)}
      <Surf id="lead" x={164} y={64} w={152} h={42} r={14} tone="blue" elev={3} seed={[240, 85]} order={1} />
      {OL2.map(([x], i) => <Surf key={i} id={`m${i}`} x={x - 64} y={156} w={128} h={40} r={13} tone="white" elev={2} seed={[x, 176]} at={1.0 + i * .06} />)}
      {OL2.map(([x], i) => <Surf key={i} id={`mb${i}`} x={x - 64} y={156} w={128} h={40} r={13} tone="blue" elev={0} seed={[x, 156]} at={2.4} />)}
      {OL3.map(([x], i) => <Surf key={i} id={`w${i}`} x={x - 42} y={248} w={84} h={36} r={12} tone="white" elev={2} seed={[x, 266]} at={1.25 + i * .05} />)}
      {OL3.map(([x], i) => <Surf key={i} id={`wb${i}`} x={x - 42} y={248} w={84} h={36} r={12} tone="tint" elev={0} seed={[x, 248]} at={2.95 + i * .02} />)}
    </>}>
      <Layer id="t" x={56} y={28} w={200} h={22} at={.7}><Text size={15.5} weight={600}>Agent team</Text></Layer>
      <Layer id="cnt" x={318} y={28} w={106} h={24} at={.95} align="center"><span className="oc-cp" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: BODY, whiteSpace: 'nowrap' }}><span className="tnum oc-cnt">0 of 4 active</span></span></Layer>
      <Layer id="ll" x={164} y={64} w={152} h={42} at={1.0} align="center" className="gap8"><Icon name="target" size={17} color="#fff" id="lead" /><Text size={14} weight={600} color="#fff">Lead agent</Text></Layer>
      {OL2.map(([x, n, ic], i) => <Layer key={n} id={`ml${i}`} x={x - 64} y={156} w={128} h={40} at={1.15 + i * .06} align="center" className="gap8"><Icon name={ic} size={16} color={DEEP} id={`mi${i}`} /><Text size={13.5} weight={600} className={`ocm${i}`}>{n}</Text></Layer>)}
      {OL3.map(([x, n, ic], i) => <Layer key={n} id={`wl${i}`} x={x - 42} y={248} w={84} h={36} at={1.4 + i * .05} align="center" className="gap6"><Icon name={ic} size={14} color={SUB} id={`wi${i}`} /><Text size={12.5} weight={600} color={BODY} className={`ocw${i}`}>{n}</Text></Layer>)}
      {OL3.map(([x], i) => <Layer key={i} id={`st${i}`} x={x - 42} y={292} w={84} h={18} at={3.08 + i * .04} align="center" className="gap6"><span className="live-dot" style={{ width: 6, height: 6 }} /><Text size={11} weight={600} color={GREEN_D}>Running</Text></Layer>)}
    </Frame>
  );
}
OrgChart.motion = c => {
  flatIcons(c);
  c.press('lead', '[data-layer="ll"]', 1.92, .8);
  c.icon('lead', 0, 35, 1.92, .7);
  const E = c.ease('power1.inOut');
  OC.forEach((_, k) => {
    const s = OCT(k), d = OCD(k), path = c.q(`.oc-a${k}`), dot = c.q(`.oc-p${k}`), L = path.getTotalLength();
    c.draw(path, '0% 0%', '0% 100%', s, d, 'power1.inOut');
    c.draw(path, '0% 100%', '100% 100%', c.T.collapse + .05, .4, 'power2.in');
    c.after(t => {
      const pt = path.getPointAtLength(L * E(clamp((t - s) / d)));
      dot.setAttribute('cx', pt.x.toFixed(2)); dot.setAttribute('cy', pt.y.toFixed(2));
      dot.setAttribute('opacity', t >= s && t < s + d + .04 ? '1' : '0');
    });
  });
  OL2.forEach((_, i) => {
    c.fromTo(`.ocm${i}`, { color: INK }, { color: '#ffffff', duration: .2 }, 2.5);
    c.fromTo(`[data-icon="mi${i}"]`, { color: DEEP }, { color: '#ffffff', duration: .2 }, 2.5);
    c.icon(`mi${i}`, 0, UA_END[OL2[i][2]], 2.5, .7);
  });
  OL3.forEach((_, i) => {
    c.fromTo(`.ocw${i}`, { color: BODY }, { color: DEEP, duration: .2 }, 3.02);
    c.fromTo(`[data-icon="wi${i}"]`, { color: SUB }, { color: DEEP, duration: .2 }, 3.02);
    c.icon(`wi${i}`, 0, UA_END[OL3[i][2]], 3.02, .7);
  });
  c.swap('.oc-cnt', ['0 of 4 active', '2 of 4 active', '4 of 4 active'], [3.04, 3.14]);
  c.fromTo('.oc-cp', { color: BODY }, { color: GREEN_D, duration: .25 }, 3.04);
};
Object.assign(OrgChart, {
  id: 'org-chart', title: 'Org chart', category: 'Agents & apps', w: W, h: H, focus: { x: 240, y: 190 }, push: 1.04, orbit: .8, exit: [240, 172],
  summary: 'A lead agent, two managers and four sub-agents. Connectors draw top-down, then a pulse runs from the lead through each branch and lights every role it reaches.',
  usage: `<OrgChart />`, icons: ['target', 'layers', 'code', 'globe', 'fileText', 'terminal', 'shield']
});

// ---------------------------------------------------------------- Plug animation
const PL0 = -100;
export function PlugAnimation({ uid = 'plug-animation' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Plug sliding into a socket and connecting" svg={<>
      <defs>
        <clipPath id={`${uid}-pc`}><rect x="0" y="0" width="290" height="360" /></clipPath>
        <clipPath id={`${uid}-card`}><path d={rr(40, 24, 400, 312, 22)} /></clipPath>
        <linearGradient id={`${uid}-prong`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2e8f0" /><stop offset=".5" stopColor="#cbd5e1" /><stop offset="1" stopColor="#94a3b8" /></linearGradient>
      </defs>
      <Surf id="card" x={40} y={24} w={400} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <path className="pl-glow" d={rr(279.5, 109.5, 125, 141, 27)} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity=".9" />
      <Surf id="sock" x={286} y={116} w={112} h={128} r={22} tone="white" elev={3} seed={[342, 180]} order={1} />
      <Surf id="face" x={306} y={140} w={72} h={84} r={16} tone="muted" elev={0} seed={[342, 182]} at={1.0} />
      <Pop id="slots" at={1.05}><rect x={284} y={157} width={9} height={16} rx={2.5} fill="#1e293b" /><rect x={284} y={187} width={9} height={16} rx={2.5} fill="#1e293b" /></Pop>
      <Pop id="ledb" at={1.1}><circle cx={342} cy={128} r={3.5} fill="#cbd5e1" /></Pop>
      <circle className="pl-ledg" cx={342} cy={128} r={9} fill="#22c55e" opacity="0" />
      <circle className="pl-led" cx={342} cy={128} r={3.5} fill="#22c55e" opacity="0" />
      <g clipPath={`url(#${uid}-card)`}><path className="pl-cable" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="butt" /></g>
      <g clipPath={`url(#${uid}-pc)`}>
        <Pop id="prongs" at={1.3}><g className="pl-move" transform={`translate(${PL0} 0)`}>
          <rect x={279} y={160} width={43} height={10} rx={2.5} fill={`url(#${uid}-prong)`} stroke="#94a3b8" strokeWidth=".8" />
          <rect x={279} y={190} width={43} height={10} rx={2.5} fill={`url(#${uid}-prong)`} stroke="#94a3b8" strokeWidth=".8" />
        </g></Pop>
      </g>
      <Pop id="plug" at={1.3}><g className="pl-move" transform={`translate(${PL0} 0)`}>
        <path d={rr(198, 206, 82, 12, 6)} fill="rgba(15,23,42,.22)" filter={`url(#${uid}-blur-g)`} />
        <path d={rr(174, 166, 24, 28, 6)} fill="#334155" />
        <path d={rr(194, 146, 88, 68, 13)} fill={`url(#${uid}-ink)`} />
        <path d={rr(194.75, 146.75, 86.5, 66.5, 12.25)} fill="none" stroke={`url(#${uid}-hl-blue)`} strokeWidth="1.5" />
        {[212, 221, 230].map(x => <path key={x} d={`M${x} 162 V198`} stroke="rgba(255,255,255,.13)" strokeWidth="2.5" strokeLinecap="round" />)}
        <circle cx={262} cy={180} r={4} fill="#475569" />
      </g></Pop>
      <Surf id="sp0" x={316} y={40} w={104} h={26} r={13} tone="muted" elev={0} seed={[330, 53]} at={.8} />
      <Surf id="sp1" x={316} y={40} w={104} h={26} r={13} tone="greenTint" elev={0} seed={[330, 53]} at={2.66} />
      <Surf id="cp" x={272} y={262} w={140} h={32} r={16} tone="greenTint" elev={0} seed={[342, 250]} at={2.72} />
    </>}>
      <Layer id="t" x={60} y={40} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Connect a tool</Text></Layer>
      <Layer id="s" x={60} y={62} w={240} h={18} at={.76}><Text size={12.5} color={SUB}>acme/agent-kit · local server</Text></Layer>
      <Layer id="st" x={316} y={40} w={104} h={26} at={.95} align="center"><span className="pl-sp" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: BODY, whiteSpace: 'nowrap' }}><Dot c="currentColor" /><span className="tnum pl-stt">Offline</span></span></Layer>
      <Layer id="pw" kind="icon" x={306} y={140} w={72} h={84} at={1.2} align="center"><Icon name="power" size={30} color={MUTE} id="pow" /></Layer>
      <Layer id="cpt" x={272} y={262} w={140} h={32} at={2.92} align="center" className="gap6"><Icon name="checkCircle" size={16} color={GREEN} id="ok" /><Text size={13} weight={600} color={GREEN_D}>Connected</Text></Layer>
    </Frame>
  );
}
PlugAnimation.motion = c => {
  flatIcons(c);
  const E1 = c.ease('power2.inOut'), E2 = c.ease('power2.in'), E3 = c.ease('power2.out');
  const X = t => t < 2.0 ? PL0 : t < 2.4 ? PL0 + (-38 - PL0) * E1((t - 2.0) / .4) : t < 2.58 ? -38 + 41 * E2((t - 2.4) / .18) : 3 - 3 * E3(clamp((t - 2.58) / .34));
  const moves = c.qa('.pl-move'), cable = c.q('.pl-cable'), led = c.q('.pl-led'), ledg = c.q('.pl-ledg');
  c.after(t => {
    const x = X(t);
    moves.forEach(m => m.setAttribute('transform', `translate(${x.toFixed(2)} 0)`));
    cable.setAttribute('d', `M30 294 C110 294 ${(112 + x * .5).toFixed(2)} 180 ${(176 + x).toFixed(2)} 180`);
    const L = cable.getTotalLength(), p = t < c.T.collapse ? E1(clamp((t - 1.1) / .5)) : 1 - E1(clamp((t - c.T.collapse - .05) / .4));
    cable.setAttribute('stroke-dasharray', `${(L * p).toFixed(2)} ${(L + 2).toFixed(2)}`);
    const on = t >= 2.62 && t < c.T.collapse + .1 ? 1 : 0;
    led.setAttribute('opacity', on); ledg.setAttribute('opacity', (on * (.22 + .1 * clamp((t - 2.62) / .2))).toFixed(3));
  });
  c.draw('.pl-glow', '0% 0%', '0% 100%', 2.62, .5, 'power2.out');
  c.draw('.pl-glow', '0% 100%', '100% 100%', c.T.collapse + .02, .3, 'power2.in');
  c.fromTo('[data-icon="pow"]', { color: MUTE }, { color: GREEN, duration: .25 }, 2.64);
  c.icon('pow', 0, 33, 2.64, .6);
  c.icon('ok', 0, 39, 3.0, .6);
  c.swap('.pl-stt', ['Offline', '12 tools ready'], [2.7]);
  c.fromTo('.pl-sp', { color: BODY }, { color: GREEN_D, duration: .25 }, 2.7);
  c.press('sock', null, 2.6, .35);
};
Object.assign(PlugAnimation, {
  id: 'plug-animation', title: 'Plug animation', category: 'Agents & apps', w: W, h: H, focus: { x: 258, y: 186 }, push: 1.06, orbit: .85, exit: [240, 180],
  summary: 'A rigid plug travels into its socket, its prongs disappearing into the slots, overshoots slightly and seats. The socket lights up and a Connected pill forms.',
  usage: `<PlugAnimation />`, icons: ['power', 'checkCircle']
});

// ---------------------------------------------------------------- Workflow map
const WN = [[52, 172, 104, 48, 'mail', 'Trigger', 'New report'], [188, 172, 96, 48, 'filter', 'Classify', 'Urgent?'], [324, 108, 104, 44, 'notification', 'Page lead', 'On-call'], [324, 240, 104, 44, 'archive', 'Log only', 'Digest']];
const WP = ['M156 196 H188', 'M284 196 C306 196 302 130 324 130', 'M284 196 C306 196 302 262 324 262'];
const WLIT = [2.04, 2.38, 2.97];
export function WorkflowMap({ uid = 'workflow-map' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Workflow graph running down the urgent branch" svg={<>
      <Surf id="card" x={40} y={20} w={400} h={320} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="run" x={336} y={36} w={88} h={32} r={10} tone="blue" elev={2} seed={[380, 52]} order={1} />
      {WP.map((d, k) => <Draw key={k} id={`p${k}`} d={d} stroke="#cbd5e1" width={2} at={1.15 + k * .1} dur={.4} />)}
      {[0, 1].map(k => <path key={k} className={`wf-a${k}`} d={WP[k]} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />)}
      {[0, 1].map(k => <circle key={k} className={`wf-d${k}`} r="4.5" fill={BLUE} stroke="#fff" strokeWidth="2" opacity="0" />)}
      {WN.map(([x, y, w, h], i) => <Surf key={i} id={`n${i}`} x={x} y={y} w={w} h={h} r={14} tone="white" elev={2} seed={[x + w / 2, y + h / 2]} at={.95 + i * .07} />)}
      {[0, 1, 2].map(i => { const [x, y, w, h] = WN[i]; return <Surf key={i} id={`b${i}`} x={x} y={y} w={w} h={h} r={14} tone="blue" elev={0} seed={[x, y + h / 2]} at={WLIT[i]} />; })}
      <Surf id="ft" x={56} y={298} w={368} h={30} r={10} tone="muted" elev={0} seed={[80, 313]} order={2} />
    </>}>
      <Layer id="t" x={60} y={34} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Incident workflow</Text></Layer>
      <Layer id="s" x={60} y={56} w={240} h={18} at={.76}><Text size={12.5} color={SUB}>Runs on every new report</Text></Layer>
      <Layer id="rb" x={336} y={36} w={88} h={32} at={1.0} align="center" className="gap6"><Icon name="zap" size={14} color="#fff" id="zap" /><Text size={12.5} weight={600} color="#fff">Test run</Text></Layer>
      {WN.map(([x, y, w, h, ic, a, b], i) => (
        <Layer key={i} id={`nl${i}`} x={x + 12} y={y} w={w - 16} h={h} at={1.15 + i * .07} className="gap8">
          <Icon name={ic} size={16} color={DEEP} id={`wi${i}`} /><span className="stack"><Text size={12.5} weight={600} className={`wt${i}`}>{a}</Text><Text size={11} color={SUB} className={`ws${i}`}>{b}</Text></span>
        </Layer>
      ))}
      <Layer id="yes" x={290} y={106} w={32} h={16} at={1.45}><Text size={11} weight={600} color={SUB} className="wf-y">Yes</Text></Layer>
      <Layer id="no" x={290} y={270} w={32} h={16} at={1.5}><Text size={11} weight={600} color={SUB}>No</Text></Layer>
      <Layer id="fc" kind="icon" x={66} y={304} w={18} h={18} at={1.2} align="center"><Icon name="clock" size={15} color={SUB} id="clk" /></Layer>
      <Layer id="fk" kind="icon" x={66} y={304} w={18} h={18} at={3.32} align="center"><Icon name="checkCircle" size={15} color={GREEN} id="fok" /></Layer>
      <Layer id="ftx" x={92} y={298} w={320} h={30} at={1.25}><Text size={12} weight={500} color={BODY} className="tnum wf-ft">Waiting for a test run</Text></Layer>
    </Frame>
  );
}
WorkflowMap.motion = c => {
  flatIcons(c);
  c.cursor([{ at: 1.45, x: 300, y: 130 }, { at: 1.95, x: 392, y: 62, press: true }, { at: 2.5, x: 310, y: 98 }]);
  c.press('run', '[data-layer="rb"]', 1.95, 1);
  c.icon('zap', 0, 33, 1.95, .6);
  const E = c.ease('power1.inOut'), S = [2.15, 2.62], D = [.24, .36];
  [0, 1].forEach(k => {
    const path = c.q(`.wf-a${k}`), dot = c.q(`.wf-d${k}`), L = path.getTotalLength();
    c.draw(path, '0% 0%', '0% 100%', S[k], D[k], 'power1.inOut');
    c.draw(path, '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
    c.after(t => {
      const pt = path.getPointAtLength(L * E(clamp((t - S[k]) / D[k])));
      dot.setAttribute('cx', pt.x.toFixed(2)); dot.setAttribute('cy', pt.y.toFixed(2));
      dot.setAttribute('opacity', t >= S[k] - .02 && t < S[k] + D[k] + .04 ? '1' : '0');
    });
  });
  [0, 1, 2].forEach(i => {
    const at = WLIT[i] + .1;
    c.fromTo(`.wt${i}`, { color: INK }, { color: '#ffffff', duration: .2 }, at);
    c.fromTo(`.ws${i}`, { color: SUB }, { color: '#dbeafe', duration: .2 }, at);
    c.fromTo(`[data-icon="wi${i}"]`, { color: DEEP }, { color: '#ffffff', duration: .2 }, at);
    if (i === 2) { c.icon('wi2', 0, 7, at + .05, .2); c.icon('wi2', 7, 0, at + .26, .25); } else c.icon(`wi${i}`, 0, UA_END[WN[i][4]], at, .7);
  });
  c.swap('.ws1', ['Urgent?', 'Urgent'], [2.56]);
  c.fromTo('.wf-y', { color: SUB }, { color: DEEP, duration: .2 }, 2.6);
  c.fromTo(['[data-draw="p2"]', '[data-surf="n3"]'].flatMap(s => c.qa(s)), { opacity: 1 }, { opacity: .42, duration: .35 }, 2.62);
  c.fromTo(c.qa('[data-layer="nl3"] .fc-carrier, [data-layer="no"] .fc-carrier'), { opacity: 1 }, { opacity: .42, duration: .35 }, 2.62);
  c.hide('fc', 3.22, .16);
  c.icon('fok', 0, 39, 3.36, .6);
  c.swap('.wf-ft', ['Waiting for a test run', 'Run #128 · on-call lead paged in 1.2 s'], [3.3]);
};
Object.assign(WorkflowMap, {
  id: 'workflow-map', title: 'Workflow map', category: 'Agents & apps', w: W, h: H, focus: { x: 250, y: 190 }, push: 1.05, orbit: .85, exit: [240, 180],
  summary: 'A trigger, a classify step and a yes or no branch. A test run sends a dot along the active path, lights each node it reaches and dims the branch not taken.',
  usage: `<WorkflowMap />`, icons: ['zap', 'mail', 'filter', 'notification', 'archive', 'clock', 'checkCircle']
});

// ---------------------------------------------------------------- Data-flow diagram
const DS = [['smartphone', 'Visit app', 312], ['database', 'EHR export', 86], ['wifi', 'Sensors', 1240]];
const DSY = i => 68 + i * 80, DPY = [140, 176, 212];
const DO = [['layout', 'Dashboard', 18240, 100], ['notification', 'Alerts', 3, 196]];
const DOY = [150, 202];
const DF = [...DS.map((_, i) => `M146 ${DSY(i) + 28} C172 ${DSY(i) + 28} 172 ${DPY[i]} 198 ${DPY[i]}`), ...DO.map(([, , , y], i) => `M282 ${DOY[i]} C309 ${DOY[i]} 309 ${y + 30} 336 ${y + 30}`)];
const fmtN = v => Math.round(v).toLocaleString('en-US');
export function DataFlowDiagram({ uid = 'data-flow-diagram' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Data flowing from sources through a process to outputs" svg={<>
      {DF.map((d, k) => <Draw key={k} id={`f${k}`} d={d} stroke="#dbe4f0" width={2.5} at={1.15 + k * .06} dur={.45} />)}
      {DF.map((d, k) => <path key={k} className="df-flow" d={d} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 10" opacity="0" />)}
      {DS.map((_, i) => <Surf key={i} id={`s${i}`} x={32} y={DSY(i)} w={114} h={56} r={14} tone="white" elev={2} seed={[90, DSY(i) + 28]} at={.9 + i * .07} />)}
      <Surf id="proc" x={198} y={92} w={84} h={168} r={18} tone="white" elev={3} seed={[240, 176]} at={.95} />
      {DO.map(([, , , y], i) => <Surf key={i} id={`o${i}`} x={336} y={y} w={108} h={60} r={14} tone="white" elev={2} seed={[390, y + 30]} at={1.0 + i * .07} />)}
    </>}>
      {[['Sources', 32, 114], ['Process', 198, 84], ['Outputs', 336, 108]].map(([l, x, w], i) => <Layer key={l} id={`hd${i}`} x={x} y={36} w={w} h={18} at={.7 + i * .05} align="center"><Text size={12} weight={600} color={SUB}>{l}</Text></Layer>)}
      {DS.map(([ic, n], i) => (
        <Layer key={n} id={`sl${i}`} x={44} y={DSY(i)} w={100} h={56} at={1.1 + i * .07} className="gap8">
          <Icon name={ic} size={16} color={DEEP} id={`si${i}`} /><span className="stack"><Text size={12.5} weight={600}>{n}</Text><Text size={11} color={SUB} className={`tnum df-r${i}`}>0/min</Text></span>
        </Layer>
      ))}
      <Layer id="pl" x={198} y={92} w={84} h={168} at={1.15} align="center">
        <span className="stack center" style={{ gap: 4 }}><Icon name="cpu" size={26} color={DEEP} id="cpu" /><Text size={13} weight={600}>Normalize</Text><Text size={12} weight={600} color={DEEP} className="tnum df-p">0/s</Text></span>
      </Layer>
      {DO.map(([ic, n, , y], i) => (
        <Layer key={n} id={`ol${i}`} x={348} y={y} w={94} h={60} at={1.2 + i * .07} className="gap8">
          <Icon name={ic} size={16} color={DEEP} id={`oi${i}`} /><span className="stack"><Text size={11} color={SUB}>{n}</Text><Text size={15} weight={700} className={`tnum df-o${i}`} style={{ letterSpacing: '-.01em' }}>0</Text></span>
        </Layer>
      ))}
      <Layer id="ft" x={140} y={304} w={200} h={20} at={1.3} align="center" className="gap6"><span className="live-dot" /><Text size={12} color={SUB}>Live · 3 sources streaming</Text></Layer>
    </Frame>
  );
}
DataFlowDiagram.motion = c => {
  flatIcons(c);
  const flows = c.qa('.df-flow'), C = c.T.collapse;
  const off = t => { const v = 34; if (t < 1.95) return 0; if (t < 3.5) return v * (t - 1.95); const u = Math.min(t, 4.05) - 3.5; return v * 1.55 + v * (u - u * u / 1.1); };
  c.after(t => {
    const o = t < 1.95 ? 0 : t < 2.2 ? (t - 1.95) / .25 : t < C ? 1 : Math.max(0, 1 - (t - C) / .25);
    flows.forEach(f => { f.setAttribute('opacity', o.toFixed(3)); f.setAttribute('stroke-dashoffset', (-off(t)).toFixed(2)); });
  });
  c.press('proc', '[data-layer="pl"]', 1.95, .6);
  c.icon('cpu', 0, 39, 1.95, .9);
  DS.forEach(([, , r], i) => { c.count(`.df-r${i}`, 0, r, 1.95 + i * .06, .9, v => `${fmtN(v)}/min`); c.icon(`si${i}`, 0, UA_END[DS[i][0]], 1.95 + i * .06, .8); });
  c.count('.df-p', 0, 486, 2.15, 1.2, v => `${fmtN(v)}/s`);
  c.count('.df-o0', 0, DO[0][2], 2.3, 1.6, fmtN, 'power2.out');
  c.count('.df-o1', 0, DO[1][2], 2.5, 1.2, fmtN, 'power1.inOut');
  c.icon('oi1', 0, 7, 3.55, .2); c.icon('oi1', 7, 0, 3.76, .25);
};
Object.assign(DataFlowDiagram, {
  id: 'data-flow-diagram', title: 'Data-flow diagram', category: 'Agents & apps', w: W, h: H, focus: { x: 240, y: 176 }, push: 1.04, orbit: .8, exit: [240, 176],
  summary: 'Sources, a process and outputs joined by curved paths. Dash segments flow along every path while source rates, throughput and output totals count up live.',
  usage: `<DataFlowDiagram />`, icons: ['smartphone', 'database', 'wifi', 'cpu', 'layout', 'notification']
});

// ---------------------------------------------------------------- Steering prompt
const SP_TXT = 'Use 3 bullets and flag meds first.';
const SP_B = [['Calm morning, ate most of breakfast'], ['Wants to call his sister after lunch']];
export function SteeringPrompt({ uid = 'steering-prompt' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Prompt steering reshaping the output" svg={<>
      <Surf id="card" x={40} y={16} w={400} h={328} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="mdp" x={358} y={30} w={64} h={24} r={12} tone="muted" elev={0} seed={[372, 42]} at={.7} />
      <Surf id="ed" x={56} y={60} w={368} h={96} r={14} tone="muted" elev={0} seed={[240, 108]} order={1} />
      <Surf id="st" x={64} y={114} w={352} h={34} r={10} tone="tint" elev={0} seed={[78, 131]} at={1.72} />
      <Surf id="ap" x={336} y={166} w={88} h={30} r={9} tone="blue" elev={2} seed={[380, 181]} order={2} />
      <Surf id="out" x={56} y={208} w={368} h={122} r={16} tone="white" elev={2} seed={[240, 270]} order={3} />
      <Surf id="op0" x={290} y={214} w={120} h={24} r={12} tone="muted" elev={0} seed={[304, 226]} at={1.05} />
      <Surf id="op1" x={290} y={214} w={120} h={24} r={12} tone="greenTint" elev={0} seed={[304, 226]} at={3.14} />
      <Surf id="para" x={70} y={242} w={340} h={74} r={10} tone="tint" elev={0} seed={[240, 279]} at={1.15} />
      {SP_B.map((_, i) => <Pop key={i} id={`bd${i}`} at={3.42 + i * .1}><circle cx={84} cy={281 + i * 24} r={3} fill={BLUE} /></Pop>)}
    </>}>
      <Layer id="t" x={60} y={30} w={200} h={22} at={.7}><Text size={15.5} weight={600}>Prompt</Text></Layer>
      <Layer id="md" x={358} y={30} w={64} h={24} at={.9} align="center"><Text size={11.5} weight={600} color={BODY}>Model A</Text></Layer>
      <Layer id="l1" x={70} y={68} w={340} h={18} at={1.0}><Text size={12.5} color={BODY}>You are a shift handoff assistant for Maple House.</Text></Layer>
      <Layer id="l2" x={70} y={88} w={340} h={18} at={1.05}><Text size={12.5} color={BODY}>Summarize the note for the incoming staff.</Text></Layer>
      <Layer id="si" kind="icon" x={72} y={123} w={16} h={16} at={1.86} align="center"><Icon name="navigation" size={14} color={DEEP} id="nav" /></Layer>
      <Layer id="sl" x={96} y={114} w={312} h={34} at={1.86}><Text size={12.5} weight={600} color={DEEP} className="sp-ty"></Text></Layer>
      <Layer id="cnt" x={60} y={170} w={240} h={22} at={1.1}><Text size={12} color={SUB} className="sp-cnt">No steering yet</Text></Layer>
      <Layer id="apl" x={336} y={166} w={88} h={30} at={1.2} align="center" className="gap6"><Text size={12.5} weight={600} color="#fff">Apply</Text><Icon name="arrowRight" size={14} color="#fff" id="arw" /></Layer>
      <Layer id="oh" x={72} y={216} w={200} h={20} at={1.1}><Text size={12} weight={600} color={SUB}>Output preview</Text></Layer>
      <Layer id="op" x={290} y={214} w={120} h={24} at={1.2} align="center"><span className="sp-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: BODY, whiteSpace: 'nowrap' }}><span className="tnum sp-pt">Before · 41 words</span></span></Layer>
      <Layer id="pt" x={82} y={246} w={318} h={66} at={1.3}>
        <Text size={12.5} color={BODY} style={{ whiteSpace: 'normal', lineHeight: 1.45, width: 318 }}>Jordan had a calm morning and ate most of his breakfast. His 2 PM Lisinopril moved to 4 PM per Dr. Ruiz. He wants to call his sister after lunch.</Text>
      </Layer>
      <Layer id="b0" x={78} y={242} w={330} h={26} at={3.32} className="gap8"><span style={pill('#fee2e2', '#b91c1c', { height: 20, fontSize: 11 })}>Meds</span><Text size={12.5} weight={600}>Lisinopril moved from 2 PM to 4 PM</Text></Layer>
      {SP_B.map(([l], i) => <Layer key={i} id={`b${i + 1}`} x={94} y={270 + i * 24} w={316} h={22} at={3.42 + i * .1}><Text size={12.5} color={BODY}>{l}</Text></Layer>)}
    </Frame>
  );
}
SteeringPrompt.motion = c => {
  flatIcons(c);
  c.typing('.sp-ty', SP_TXT, 1.95, 38);
  c.icon('nav', 0, UA_END.navigation, 1.9, .8);
  c.swap('.sp-cnt', ['No steering yet', '1 steering instruction'], [2.0]);
  c.cursor([{ at: 2.5, x: 320, y: 250 }, { at: 3.0, x: 392, y: 188, press: true }, { at: 3.45, x: 344, y: 160 }]);
  c.press('ap', '[data-layer="apl"]', 3.0, 1);
  c.icon('arw', 0, 35, 3.0, .5);
  c.hide('pt', 3.1, .2);
  c.reshape('para', rect(70, 242, 340, 26, 8), 3.14, .5, 'back.out(1.15)');
  c.swap('.sp-pt', ['Before · 41 words', 'After · 16 words'], [3.18]);
  c.fromTo('.sp-pill', { color: BODY }, { color: GREEN_D, duration: .25 }, 3.18);
};
Object.assign(SteeringPrompt, {
  id: 'steering-prompt', title: 'Steering prompt', category: 'Agents & apps', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.05, orbit: .85, exit: [240, 180],
  summary: 'A steering line is typed into the prompt editor. Applying it collapses the paragraph preview into a flagged meds row followed by short bullets.',
  usage: `<SteeringPrompt />`, icons: ['navigation', 'arrowRight']
});

export const LIST_D = [AppDemo, PhoneMockup, LoopDiagram, AgentCards, AgentChatlog, OrgChart, PlugAnimation, WorkflowMap, DataFlowDiagram, SteeringPrompt];
