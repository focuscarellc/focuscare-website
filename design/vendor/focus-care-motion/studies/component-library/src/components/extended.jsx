// Library extension: table, stepper, team picker, signature sign-off, chat, empty state,
// accordion and medication record. Same rules as the original 24: SVG surfaces form from seeds,
// HTML carriers hold Inter labels and native useAnimations icons, motion seeks from absolute time.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', MUTE = '#94a3b8';
function smooth(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}
const pill = (bg, fg) => ({ background: bg, color: fg, height: 22, padding: '0 9px', borderRadius: 11, fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily: 'Inter, system-ui, sans-serif' });

// ---------------------------------------------------------------- Data table with sort
const RES = [['Avery Brooks', '14B', '2:10 PM', 'Visited', 1], ['Jordan Ellis', '12A', '9:30 AM', 'Visited', 3], ['Morgan Lee', '08C', '11:45 AM', 'Due', 2], ['Riley Patel', '03A', '4:05 PM', 'On site', 0]];
const TR = i => 140 + i * 46;
export function DataTable({ uid = 'table', rows = RES }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Resident table sorted by last visit" svg={<>
      <Surf id="card" x={40} y={24} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="sort" x={286} y={100} w={136} h={30} r={9} tone="muted" elev={0} seed={[354, 115]} at={1.4} />
      <Draw id="hd" d="M56 134.5 H424" stroke="#e2e8f0" width={1} at={.85} />
      {[1, 2, 3].map(i => <Draw key={i} id={`sep${i}`} d={`M56 ${TR(i) - 2.5} H424`} stroke="#f1f5f9" width={1} at={.95 + i * .05} />)}
      <Surf id="hit" x={52} y={TR(0) + 1} w={376} h={40} r={10} tone="tint" elev={0} seed={[70, TR(0) + 21]} at={3.25} />
    </>}>
      <Layer id="t" x={64} y={40} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Residents</Text></Layer>
      <Layer id="s" x={64} y={62} w={300} h={20} at={.76}><Text size={12.5} color={SUB} className="tnum sorted">Maple House · sorted by name</Text></Layer>
      <Layer id="h0" x={64} y={100} w={140} h={30} at={.9}><Text size={12} weight={600} color={SUB}>Name</Text></Layer>
      <Layer id="h1" x={204} y={100} w={70} h={30} at={.94}><Text size={12} weight={600} color={SUB}>Room</Text></Layer>
      <Layer id="h2" x={296} y={100} w={120} h={30} at={.98} className="gap6"><Text size={12} weight={600} color={SUB} className="sorthead">Last visit</Text><Icon name="chevronDown" size={16} color={SUB} id="chev" /></Layer>
      {rows.map(([n, room, last, st], i) => (
        <Layer key={n} id={`r${i}`} x={64} y={TR(i)} w={356} h={42} at={1.1 + i * .07}>
          <span className="trow"><Text size={14} weight={600} style={{ width: 140 }}>{n}</Text><Text size={13} color={BODY} className="tnum" style={{ width: 92 }}>{room}</Text><Text size={13} color={INK} className="tnum" style={{ width: 70 }}>{last}</Text>
            <span style={st === 'Due' ? pill('#fef3c7', '#a16207') : st === 'On site' ? pill('#dcfce7', '#15803d') : pill('#f1f5f9', '#475569')}>{st}</span></span>
        </Layer>
      ))}
    </Frame>
  );
}
DataTable.motion = c => {
  c.cursor([{ at: 2.3, x: 368, y: 122, press: true }]);
  c.press('sort', '[data-layer="h2"]', 2.3, .8);
  c.icon('chev', 0, 33, 2.32, .55);
  c.fromTo('.sorthead', { color: SUB }, { color: DEEP, duration: .2 }, 2.35);
  c.fromTo('[data-icon="chev"]', { color: SUB }, { color: DEEP, duration: .2 }, 2.35);
  // Moving rows get an opaque, lifted backing for the duration of the move; the row moving up
  // rides on top (like a drag reorder) so crossing rows never overlay their text.
  RES.forEach(([, , , , to], i) => {
    const at = 2.5 + Math.abs(to - i) * .03, row = `[data-layer="r${i}"]`, back = `${row} .trow`;
    c.set(row, { zIndex: to < i ? 3 : to === i ? 2 : 1 }, 2.49);
    c.fromTo(row, { y: 0 }, { y: (to - i) * 46, duration: .62, ease: 'back.out(1.15)' }, at);
    c.fromTo(back, { backgroundColor: 'rgba(255,255,255,0)', boxShadow: '0 0 0 rgba(29,78,216,0)' }, { backgroundColor: 'rgba(255,255,255,1)', boxShadow: to < i ? '0 10px 22px rgba(29,78,216,.16)' : '0 0 0 rgba(29,78,216,0)', duration: .12 }, 2.42);
    c.fromTo(back, { backgroundColor: 'rgba(255,255,255,1)' }, { backgroundColor: 'rgba(255,255,255,0)', boxShadow: '0 0 0 rgba(29,78,216,0)', duration: .2 }, 3.15);
    if (to < i) c.fromTo(back, { scale: 1 }, { scale: 1.025, duration: .2, ease: 'power2.out' }, 2.45).fromTo(back, { scale: 1.025 }, { scale: 1, duration: .35, ease: 'power2.inOut' }, 3.0);
  });
  c.swap('[data-layer="s"] .sorted', ['Maple House · sorted by name', 'Maple House · most recent visit first'], [2.55]);
};
Object.assign(DataTable, {
  id: 'table', title: 'Data table', category: 'Data display', w: W, h: H, focus: { x: 250, y: 180 }, push: 1.0, orbit: .8, exit: [240, 180],
  summary: 'Resident rows with status pills. Sorting by last visit lifts the header and slides every row to its new position instead of redrawing.',
  usage: `<DataTable rows={[['Avery Brooks','14B','2:10 PM','Visited',1], ...]} />`, icons: ['chevronDown']
});

// ---------------------------------------------------------------- Onboarding stepper
const NX = i => 84 + i * 104, NY = 130;
const STEPS = ['Profile', 'Training', 'Credentials', 'Review'];
export function Stepper({ uid = 'stepper' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Onboarding stepper" svg={<>
      <Surf id="card" x={40} y={30} w={400} h={300} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="track" d={`M${NX(0)} ${NY} H${NX(3)}`} stroke="#e2e8f0" width={3} at={.8} dur={.6} />
      <Draw id="p0" d={`M${NX(0)} ${NY} H${NX(1)}`} stroke="#2d7dff" width={3} at={1.15} dur={.4} />
      <path className="p1" d={`M${NX(1)} ${NY} H${NX(2)}`} fill="none" stroke="#2d7dff" strokeWidth="3" strokeLinecap="round" />
      <Surf id="n0" x={NX(0) - 16} y={NY - 16} w={32} h={32} r={16} tone="blue" elev={2} seed={[NX(0), NY]} at={.95} />
      <Surf id="n1" x={NX(1) - 16} y={NY - 16} w={32} h={32} r={16} tone="white" elev={2} seed={[NX(1), NY]} at={1.05} />
      <Surf id="n2" x={NX(2) - 16} y={NY - 16} w={32} h={32} r={16} tone="muted" elev={0} seed={[NX(2), NY]} at={1.15} />
      <Surf id="n3" x={NX(3) - 16} y={NY - 16} w={32} h={32} r={16} tone="muted" elev={0} seed={[NX(3), NY]} at={1.25} />
      <Draw id="ring1" className="ring1" d={`M${NX(1)} ${NY - 21} a21 21 0 1 1 -0.01 0`} stroke="#93c5fd" width={2} at={1.4} dur={.5} />
      <Surf id="n1done" x={NX(1) - 16} y={NY - 16} w={32} h={32} r={16} tone="blue" elev={0} seed={[NX(1), NY]} at={2.5} />
      <path className="ring2" d={`M${NX(2)} ${NY - 21} a21 21 0 1 1 -0.01 0`} fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
      <Surf id="panel" x={64} y={192} w={352} h={112} r={16} tone="muted" elev={0} seed={[240, 248]} order={2} />
      <Surf id="pb" x={80} y={208} w={40} h={40} r={12} tone="white" elev={1} seed={[100, 228]} at={1.3} />
      <Surf id="next" x={300} y={252} w={100} h={38} r={11} tone="blue" elev={3} seed={[350, 271]} at={1.35} />
    </>}>
      <Layer id="t" x={64} y={46} w={300} h={22} at={.7}><Text size={15.5} weight={600}>New staff onboarding</Text></Layer>
      <Layer id="s" x={64} y={68} w={300} h={20} at={.76}><Text size={12.5} color={SUB} className="tnum stepsub">Avery Kim · step 2 of 4</Text></Layer>
      <Layer id="c0" kind="icon" x={NX(0) - 16} y={NY - 16} w={32} h={32} at={1.1} align="center"><Icon name="checkmark" size={18} color="#fff" id="ck0" /></Layer>
      <Layer id="k1" x={NX(1) - 16} y={NY - 16} w={32} h={32} at={1.2} align="center"><Text size={13} weight={700} color={DEEP}>2</Text></Layer>
      <Layer id="c1" kind="icon" x={NX(1) - 16} y={NY - 16} w={32} h={32} at={2.62} align="center"><Icon name="checkmark" size={18} color="#fff" id="ck1" /></Layer>
      <Layer id="k2" x={NX(2) - 16} y={NY - 16} w={32} h={32} at={1.3} align="center"><Text size={13} weight={700} color={MUTE} className="k2">3</Text></Layer>
      <Layer id="k3" x={NX(3) - 16} y={NY - 16} w={32} h={32} at={1.35} align="center"><Text size={13} weight={700} color={MUTE}>4</Text></Layer>
      {STEPS.map((l, i) => <Layer key={l} id={`l${i}`} x={NX(i) - 50} y={NY + 24} w={100} h={20} at={1.0 + i * .06} align="center"><Text size={12} weight={600} color={i < 2 ? INK : SUB} className={`sl${i}`}>{l}</Text></Layer>)}
      <Layer id="pi" kind="icon" x={80} y={208} w={40} h={40} at={1.45} align="center"><Icon name="fileText" size={20} color={DEEP} id="pfile" /></Layer>
      <Layer id="pa" x={132} y={206} w={260} h={44} at={1.5}><span className="stack"><Text size={14} weight={600}>Training modules</Text><Text size={12.5} color={SUB}>3 of 3 complete · 2 h 40 min</Text></span></Layer>
      <Layer id="pb2" x={132} y={206} w={260} h={44} at={2.95}><span className="stack"><Text size={14} weight={600}>Credentials</Text><Text size={12.5} color={SUB}>Upload CPR card and DSP license</Text></span></Layer>
      <Layer id="nx" x={300} y={252} w={100} h={38} at={1.5} align="center"><Text size={14} weight={600} color="#fff">Continue</Text></Layer>
    </Frame>
  );
}
Stepper.motion = c => {
  c.rest('ck0', 44);
  c.icon('ck0', 0, 44, 1.15, .6);
  c.cursor([{ at: 2.35, x: 368, y: 276, press: true }]);
  c.press('next', '[data-layer="nx"]', 2.35, 1);
  c.hide('k1', 2.48, .18);
  c.icon('ck1', 0, 44, 2.66, .55);
  c.draw('.p1', '0% 0%', '0% 100%', 2.6, .45, 'power2.inOut');
  c.draw('.p1', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  c.draw('.ring2', '0% 0%', '0% 100%', 3.0, .5, 'power2.out');
  c.draw('.ring2', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  c.fromTo('.ring1', { opacity: 1 }, { opacity: 0, duration: .25 }, 2.55);
  c.fromTo('.k2', { color: MUTE }, { color: DEEP, duration: .25 }, 3.0).fromTo('.sl2', { color: SUB }, { color: INK, duration: .25 }, 3.0);
  c.hide('pa', 2.5, .2);
  c.icon('pfile', 0, 39, 2.95, .9);
  c.swap('[data-layer="s"] .stepsub', ['Avery Kim · step 2 of 4', 'Avery Kim · step 3 of 4'], [2.9]);
};
Object.assign(Stepper, {
  id: 'stepper', title: 'Onboarding stepper', category: 'Navigation', w: W, h: H, focus: { x: 240, y: 190 }, push: 1.06, exit: [240, 180],
  summary: 'A four-step wizard. Continuing fills the current node, draws the connector to the next step and swaps the task panel in place.',
  usage: `<Stepper />`, icons: ['checkmark', 'fileText']
});

// ---------------------------------------------------------------- Shift team picker
const TEAM = [['JP', 'Jordan P.', 'tint'], ['SR', 'Sam R.', 'greenTint'], ['LC', 'Lee C.', 'amberTint'], ['MO', 'Morgan O.', 'redTint']];
const AX = i => 104 + i * 92, AY = 222;
export function TeamPicker({ uid = 'assign' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Assign shift team" svg={<>
      <Surf id="card" x={50} y={26} w={380} h={310} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="field" x={70} y={96} w={340} h={56} r={14} tone="white" elev={1} seed={[240, 124]} order={1} />
      <Surf id="c0" x={82} y={108} w={100} h={32} r={16} tone="tint" elev={0} seed={[96, 124]} at={1.2} />
      <Surf id="c1" x={190} y={108} w={92} h={32} r={16} tone="greenTint" elev={0} seed={[AX(1), AY]} at={2.48} />
      {TEAM.map(([, , tone], i) => <Surf key={i} id={`a${i}`} x={AX(i) - 26} y={AY - 26} w={52} h={52} r={26} tone={tone} elev={1} seed={[AX(i), AY]} at={1.05 + i * .07} />)}
      <Draw id="sel" className="sel" d={`M${AX(1)} ${AY - 32} a32 32 0 1 1 -0.01 0`} stroke="#16a34a" width={2.5} at={2.42} dur={.45} />
      <Surf id="notify" x={70} y={284} w={340} h={38} r={12} tone="blue" elev={2} seed={[240, 303]} order={2} />
    </>}>
      <Layer id="t" x={70} y={44} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Assign shift team</Text></Layer>
      <Layer id="s" x={70} y={66} w={200} h={20} at={.76}><Text size={12.5} color={SUB}>Thursday · Day shift</Text></Layer>
      <Layer id="n" x={290} y={66} w={120} h={20} at={.8} align="right"><Text size={12.5} weight={600} color={DEEP} className="tnum cnt">1 assigned</Text></Layer>
      <Layer id="ct0" x={82} y={108} w={100} h={32} at={1.35} align="center" className="gap6"><Icon name="userCheck" size={15} color={DEEP} id="uc0" /><Text size={12.5} weight={600} color={DEEP}>Avery K.</Text></Layer>
      <Layer id="ct1" x={190} y={108} w={92} h={32} at={2.75} align="center"><Text size={12.5} weight={600} color="#15803d">Sam R.</Text></Layer>
      <Layer id="sg" x={70} y={164} w={200} h={20} at={.95}><Text size={12} weight={600} color={SUB}>Suggested · available Thursday</Text></Layer>
      {TEAM.map(([ini, name], i) => (
        <React.Fragment key={ini}>
          <Layer id={`ai${i}`} x={AX(i) - 26} y={AY - 26} w={52} h={52} at={1.2 + i * .07} align="center"><Text size={14} weight={700} color="#334155">{ini}</Text></Layer>
          <Layer id={`an${i}`} x={AX(i) - 46} y={AY + 32} w={92} h={18} at={1.25 + i * .07} align="center"><Text size={12} weight={500} color={BODY}>{name}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="ok" kind="icon" x={AX(1) + 10} y={AY - 34} w={22} h={22} at={2.6} align="center"><Icon name="checkCircle" size={20} color="#16a34a" id="ok" /></Layer>
      <Layer id="nt" x={70} y={284} w={340} h={38} at={1.3} align="center" className="gap8"><Icon name="send" size={17} color="#fff" id="send" /><Text size={14} weight={600} color="#fff">Notify team</Text></Layer>
    </Frame>
  );
}
TeamPicker.motion = c => {
  c.cursor([{ at: 2.35, x: AX(1) + 8, y: AY + 10, press: true }]);
  c.press('a1', '[data-layer="ai1"]', 2.35, 1);
  c.icon('ok', 8, 39, 2.62, .6);
  c.icon('uc0', 0, 39, 1.35, .9);
  c.swap('[data-layer="n"] .cnt', ['1 assigned', '2 assigned'], [2.75]);
};
Object.assign(TeamPicker, {
  id: 'assign', title: 'Shift team picker', category: 'Inputs', w: W, h: H, focus: { x: 240, y: 180 }, push: 1.06, exit: [240, 180],
  summary: 'Choosing a suggested teammate rings their avatar and grows a new chip out of it into the assigned field.',
  usage: `<TeamPicker />`, icons: ['userCheck', 'checkCircle', 'send']
});

// ---------------------------------------------------------------- Signature sign-off
const SIG = smooth([[104, 190], [114, 150], [122, 128], [126, 150], [124, 186], [116, 198], [108, 190], [118, 178], [138, 170], [150, 160], [152, 176], [146, 186], [160, 182], [170, 162], [176, 140], [178, 168], [180, 186], [192, 170], [198, 150], [200, 172], [204, 186], [214, 176], [222, 168], [228, 180], [240, 176], [252, 164], [262, 172], [276, 168], [300, 158], [330, 150]]);
export function SignaturePad({ uid = 'signature' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Visit sign-off signature" svg={<>
      <Surf id="card" x={50} y={24} w={380} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="pad" x={74} y={92} w={332} h={128} r={16} tone="muted" elev={0} seed={[240, 156]} order={1} />
      <Draw id="base" d="M98 196.5 H382" stroke="#cbd5e1" width={1.2} at={1.0} />
      <path className="sig" d={SIG} fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="pen" cx="104" cy="190" r="5" fill="#2d7dff" opacity="0" />
      <Surf id="clear" x={74} y={238} w={160} h={44} r={13} tone="white" elev={1} seed={[154, 260]} order={2} />
      <Surf id="confirm" x={246} y={238} w={160} h={44} r={13} tone="blue" elev={3} seed={[326, 260]} order={3} />
      <Surf id="done" x={246} y={238} w={160} h={44} r={13} tone="green" elev={0} seed={[330, 262]} at={3.5} />
    </>}>
      <Layer id="t" x={74} y={40} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Visit sign-off</Text></Layer>
      <Layer id="s" x={74} y={62} w={300} h={20} at={.76}><Text size={12.5} color={SUB}>Jordan Ellis · 9:30 to 11:00 AM</Text></Layer>
      <Layer id="ph" x={88} y={100} w={200} h={20} at={1.05}><Text size={12} weight={500} color={MUTE}>Sign above the line</Text></Layer>
      <Layer id="cl" x={74} y={238} w={160} h={44} at={1.2} align="center"><Text size={14} weight={600}>Clear</Text></Layer>
      <Layer id="cf" x={246} y={238} w={160} h={44} at={1.25} align="center"><Text size={14} weight={600} color="#fff">Confirm visit</Text></Layer>
      <Layer id="dn" x={246} y={238} w={160} h={44} at={3.78} align="center" className="gap6"><Icon name="checkmark" size={18} color="#fff" id="ck" /><Text size={14} weight={600} color="#fff">Verified</Text></Layer>
      <Layer id="ts" x={74} y={294} w={332} h={20} at={3.9}><Text size={12} weight={500} color="#15803d" className="tnum">Signed 11:02 AM · GPS matched Maple House</Text></Layer>
    </Frame>
  );
}
SignaturePad.motion = c => {
  const sig = c.q('.sig'), pen = c.q('.pen'), L = sig.getTotalLength(), E = c.ease('power1.inOut');
  c.hide('ph', 1.72, .2);
  c.draw('.sig', '0% 0%', '0% 100%', 1.8, 1.25, 'power1.inOut');
  c.draw('.sig', '0% 100%', '100% 100%', c.T.collapse + .05, .4, 'power2.in');
  c.after(t => {
    const p = Math.min(1, Math.max(0, (t - 1.8) / 1.25)), pt = sig.getPointAtLength(L * E(p));
    pen.setAttribute('cx', pt.x.toFixed(2)); pen.setAttribute('cy', pt.y.toFixed(2));
    pen.setAttribute('opacity', t > 1.72 && t < 3.15 ? '1' : '0');
  });
  c.cursor([{ at: 3.42, x: 340, y: 266, press: true }]);
  c.press('confirm', '[data-layer="cf"]', 3.42, 1);
  c.hide('cf', 3.55, .2);
  c.icon('ck', 0, 44, 3.82, .6);
};
Object.assign(SignaturePad, {
  id: 'signature', title: 'Signature sign-off', category: 'Inputs', w: W, h: H, focus: { x: 240, y: 170 }, push: 1.06, exit: [240, 180],
  summary: 'An EVV visit signature drawn stroke by stroke with DrawSVG, followed by a confirm that grows a verified state from the click point.',
  usage: `<SignaturePad />`, icons: ['checkmark']
});

// ---------------------------------------------------------------- Care team chat
const MY = [96, 152, 208];
export function ChatThread({ uid = 'chat' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Care team chat" svg={<>
      <Surf id="card" x={50} y={20} w={380} h={312} r={22} tone="white" elev={3} seed={[240, 176]} />
      <Surf id="av" x={70} y={34} w={36} h={36} r={18} tone="tint" elev={0} seed={[88, 52]} order={1} />
      <Draw id="div" d="M50 82.5 H430" stroke="#eef2f6" width={1} at={.8} />
      <Surf id="m0" x={70} y={MY[0]} w={240} h={46} r={16} tone="muted" elev={0} seed={[86, MY[0] + 23]} at={1.0} />
      <Surf id="m1" x={170} y={MY[1]} w={240} h={46} r={16} tone="blue" elev={1} seed={[394, MY[1] + 23]} at={1.3} />
      <Surf id="m2" x={70} y={MY[2]} w={66} h={36} r={18} tone="muted" elev={0} seed={[86, MY[2] + 18]} at={1.95} />
      <g className="dots">{[0, 1, 2].map(i => <Pop key={i} id={`d${i}`} at={2.2 + i * .05}><circle className={`dot dot${i}`} cx={88 + i * 15} cy={MY[2] + 18} r={3.8} fill="#94a3b8" /></Pop>)}</g>
      <Surf id="comp" x={62} y={276} w={356} h={44} r={22} tone="white" elev={1} seed={[240, 298]} order={2} />
      <Surf id="sendb" x={380} y={282} w={32} h={32} r={16} tone="blue" elev={1} seed={[396, 298]} order={3} />
    </>}>
      <Layer id="ai" x={70} y={34} w={36} h={36} at={.75} align="center"><Text size={12} weight={700} color={DEEP}>MH</Text></Layer>
      <Layer id="hn" x={116} y={34} w={240} h={36} at={.8}><span className="stack"><Text size={14.5} weight={600}>Maple House team</Text><span className="row6"><span className="live-dot" /><Text size={12} color={SUB}>4 members online</Text></span></span></Layer>
      <Layer id="t0" x={84} y={MY[0]} w={220} h={46} at={1.15}><span className="stack"><Text size={11} weight={600} color={SUB}>Sam R. · 9:41 AM</Text><Text size={13.5}>Morning meds done for Jordan.</Text></span></Layer>
      <Layer id="t1" x={184} y={MY[1]} w={220} h={46} at={1.45}><span className="stack"><Text size={11} weight={600} color="#dbeafe">You · 9:42 AM</Text><Text size={13.5} color="#fff">Thanks. Can you log his BP too?</Text></span></Layer>
      <Layer id="t2" x={84} y={MY[2]} w={240} h={46} at={3.05}><span className="stack"><Text size={11} weight={600} color={SUB}>Sam R. · 9:44 AM</Text><Text size={13.5} className="tnum">Logged: 118 over 76, all good.</Text></span></Layer>
      <Layer id="cp" x={82} y={276} w={280} h={44} at={1.2}><Text size={13.5} color={MUTE}>Message the team</Text></Layer>
      <Layer id="si" kind="icon" x={380} y={282} w={32} h={32} at={1.3} align="center"><Icon name="send" size={16} color="#fff" id="send" /></Layer>
    </Frame>
  );
}
ChatThread.motion = c => {
  [0, 1, 2].forEach(i => {
    for (const k of [0, 1]) c.fromTo(`.dot${i}`, { y: 0 }, { y: -5, duration: .16, ease: 'power2.out' }, 2.35 + k * .4 + i * .1).fromTo(`.dot${i}`, { y: -5 }, { y: 0, duration: .2, ease: 'power2.in' }, 2.51 + k * .4 + i * .1);
  });
  c.fromTo('.dots', { opacity: 1 }, { opacity: 0, duration: .15 }, 2.86);
  c.reshape('m2', rect(70, MY[2], 250, 46, 16), 2.9, .5, 'back.out(1.25)');
  c.icon('send', 0, 39, 1.3, 1.0);
};
Object.assign(ChatThread, {
  id: 'chat', title: 'Care team chat', category: 'Feedback', w: W, h: H, focus: { x: 220, y: 200 }, push: 1.06, exit: [240, 176],
  summary: 'Messages form from their sender side. A typing indicator bounces, then its bubble stretches into the reply instead of being replaced.',
  usage: `<ChatThread />`, icons: ['send']
});

// ---------------------------------------------------------------- Empty state
export function EmptyState({ uid = 'empty' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="No open incidents" svg={<>
      <Surf id="card" x={60} y={24} w={360} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Pop id="halo" at={.9} ease="power3.out"><circle cx={240} cy={112} r={62} fill="none" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" /></Pop>
      <Surf id="badge" x={196} y={68} w={88} h={88} r={44} tone="tint" elev={1} seed={[240, 112]} order={1} />
      {[[168, 74, '#93c5fd'], [318, 92, '#86efac'], [176, 158, '#fcd34d'], [306, 150, '#93c5fd']].map(([x, y, f], i) => <Pop key={i} id={`o${i}`} at={1.2 + i * .08}><circle cx={x} cy={y} r={4} fill={f} /></Pop>)}
      <Surf id="log" x={170} y={238} w={140} h={44} r={13} tone="white" elev={2} seed={[240, 260]} order={2} />
      <Surf id="draft" x={128} y={292} w={224} h={30} r={15} tone="tint" elev={0} seed={[240, 282]} at={2.62} />
    </>}>
      <Layer id="bi" kind="icon" x={196} y={68} w={88} h={88} at={1.0} align="center"><Icon name="shield" size={44} color={DEEP} id="shield" /></Layer>
      <Layer id="t" x={80} y={168} w={320} h={26} at={1.1} align="center"><Text size={17} weight={600}>No open incidents</Text></Layer>
      <Layer id="b" x={100} y={194} w={280} h={36} at={1.18} align="center"><Text size={13} color={SUB} className="tnum streak">0 days incident-free at Maple House</Text></Layer>
      <Layer id="lt" x={170} y={238} w={140} h={44} at={1.3} align="center" className="gap6"><Icon name="plusToX" size={18} color={DEEP} id="plus" /><Text size={14} weight={600}>Log incident</Text></Layer>
      <Layer id="dt" x={128} y={292} w={224} h={30} at={2.85} align="center"><Text size={12} weight={600} color={DEEP} className="tnum">Draft INC-0219 started · 11:04 AM</Text></Layer>
    </Frame>
  );
}
EmptyState.motion = c => {
  c.icon('shield', 0, 33, 1.1, .9);
  c.count('[data-layer="b"] .streak', 0, 42, 1.3, 1.0, v => `${Math.round(v)} days incident-free at Maple House`);
  c.cursor([{ at: 2.35, x: 280, y: 266, press: true }]);
  c.press('log', '[data-layer="lt"]', 2.35, 1);
  c.icon('plus', 0, 29, 2.4, .35);
  c.icon('plus', 29, 0, 3.0, .35);
};
Object.assign(EmptyState, {
  id: 'empty', title: 'Empty state', category: 'Feedback', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.06, exit: [240, 180],
  summary: 'A calm zero state with a native shield, a counting streak and an action that grows a draft confirmation out of the button.',
  usage: `<EmptyState />`, icons: ['shield', 'plusToX']
});

// ---------------------------------------------------------------- Accordion
const SEC = [['Daily routines', '4 items'], ['Medication', '2 doses'], ['Behavior support', '3 strategies']];
const SY0 = [84, 140, 196], SH = 48, EXP = 122, SHIFT = EXP - SH;
export function Accordion({ uid = 'accordion' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Care plan accordion" svg={<>
      <Surf id="card" x={60} y={22} w={360} h={250} r={22} tone="white" elev={3} seed={[240, 150]} />
      {SEC.map((_, i) => <Surf key={i} id={`s${i}`} x={76} y={SY0[i]} w={328} h={SH} r={14} tone={i === 1 ? 'white' : 'muted'} elev={i === 1 ? 1 : 0} seed={[100, SY0[i] + 24]} at={.95 + i * .1} />)}
    </>}>
      <Layer id="t" x={76} y={36} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Care plan</Text></Layer>
      <Layer id="st" x={76} y={58} w={300} h={20} at={.76}><Text size={12.5} color={SUB}>Jordan Ellis · reviewed Oct 28</Text></Layer>
      {SEC.map(([l, n], i) => (
        <Layer key={l} id={`h${i}`} x={92} y={SY0[i]} w={300} h={SH} at={1.1 + i * .08} className="acc-head">
          <span className="trow"><Text size={14} weight={600} style={{ width: 170 }}>{l}</Text><Text size={12} weight={500} color={SUB} style={{ width: 96, textAlign: 'right' }}>{n}</Text><span className="chev" style={{ marginLeft: 8 }}><Icon name="chevronDown" size={18} color={i === 1 ? DEEP : SUB} id={`ch${i}`} /></span></span>
        </Layer>
      ))}
      <Layer id="d0" x={92} y={SY0[1] + 48} w={300} h={30} at={2.75} className="gap8"><span className="dose" /><Text size={13} className="tnum">8:00 AM · Metformin 500 mg with breakfast</Text></Layer>
      <Layer id="d1" x={92} y={SY0[1] + 80} w={300} h={30} at={2.83} className="gap8"><span className="dose" /><Text size={13} className="tnum">8:00 PM · Lisinopril 10 mg</Text></Layer>
    </Frame>
  );
}
Accordion.motion = c => {
  c.cursor([{ at: 2.35, x: 330, y: SY0[1] + 28, press: true }]);
  c.press('s1', '[data-layer="h1"]', 2.35, .7);
  c.reshape('s1', rect(76, SY0[1], 328, EXP, 14), 2.45, .55, 'back.out(1.1)');
  c.reshape('s2', rect(76, SY0[2] + SHIFT, 328, SH, 14), 2.45, .55, 'back.out(1.1)');
  c.reshape('card', rect(60, 22, 360, 250 + SHIFT, 22), 2.45, .55, 'back.out(1.1)');
  c.fromTo('[data-layer="h2"]', { y: 0 }, { y: SHIFT, duration: .55, ease: 'back.out(1.1)' }, 2.45);
  c.fromTo('[data-layer="h1"] .chev', { rotation: 0 }, { rotation: 180, duration: .45, ease: 'back.out(1.6)' }, 2.45);
  c.icon('ch1', 0, 33, 2.4, .5);
};
Object.assign(Accordion, {
  id: 'accordion', title: 'Accordion', category: 'Navigation', w: W, h: H, focus: { x: 240, y: 190 }, push: 1.06, exit: [240, 150],
  summary: 'Care plan sections. Opening Medication grows its surface, pushes the next section and the card down, and turns the chevron carrier.',
  usage: `<Accordion />`, icons: ['chevronDown']
});

// ---------------------------------------------------------------- Medication record (MAR)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], TIMES = ['8 AM', '12 PM', '8 PM'];
const MX = d => 168 + d * 56, MYY = r => 140 + r * 54;
const STATE = [['g', 'g', 'g', 'd', 'u'], ['g', 'l', 'd', 'u', 'u'], ['g', 'g', 'u', 'u', 'u']];
const FILL = { g: '#16a34a', l: '#f59e0b' };
export function MedRecord({ uid = 'mar' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Medication administration record" svg={<>
      <Surf id="card" x={30} y={24} w={420} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="today" x={MX(2) - 24} y={98} w={48} h={190} r={14} tone="tint" elev={0} seed={[MX(2), 110]} at={1.0} />
      {STATE.flatMap((row, r) => row.map((s, d) => s === 'g' || s === 'l'
        ? <Pop key={`${r}${d}`} id={`c${r}${d}`} at={1.2 + (r * 5 + d) * .03}><circle cx={MX(d)} cy={MYY(r)} r={10} fill={FILL[s]} /></Pop>
        : s === 'd' ? <Draw key={`${r}${d}`} id={`c${r}${d}`} d={`M${MX(d)} ${MYY(r) - 10} a10 10 0 1 1 -0.01 0`} stroke="#2d7dff" width={2} at={1.2 + (r * 5 + d) * .03} dur={.4} />
          : <Pop key={`${r}${d}`} id={`c${r}${d}`} at={1.2 + (r * 5 + d) * .03}><circle cx={MX(d)} cy={MYY(r)} r={9.25} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" /></Pop>))}
      <Surf id="given" x={MX(2) - 11} y={MYY(1) - 11} w={22} h={22} r={11} tone="green" elev={1} seed={[MX(2), MYY(1)]} at={2.45} />
      <Surf id="tip" x={MX(2) + 24} y={MYY(1) - 23} w={126} h={46} r={11} tone="ink" elev={2} seed={[MX(2) + 18, MYY(1)]} at={2.75} />
      <Pop id="tri" at={3.05}><path d={`M${MX(2) + 24.5} ${MYY(1) - 6} L${MX(2) + 18} ${MYY(1)} L${MX(2) + 24.5} ${MYY(1) + 6} Z`} fill="#0f172a" /></Pop>
    </>}>
      <Layer id="t" x={54} y={36} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Medication record</Text></Layer>
      <Layer id="s" x={54} y={58} w={300} h={20} at={.76}><Text size={12.5} color={SUB}>Jordan Ellis · Metformin 500 mg</Text></Layer>
      {DAYS.map((d, i) => <Layer key={d} id={`dy${i}`} x={MX(i) - 24} y={102} w={48} h={18} at={.9 + i * .04} align="center"><Text size={11.5} weight={600} color={i === 2 ? DEEP : SUB}>{d}</Text></Layer>)}
      {TIMES.map((tm, r) => <Layer key={tm} id={`tm${r}`} x={54} y={MYY(r) - 10} w={70} h={20} at={.95 + r * .05}><Text size={12} weight={600} color={BODY} className="tnum">{tm}</Text></Layer>)}
      <Layer id="ck" kind="icon" x={MX(2) - 11} y={MYY(1) - 11} w={22} h={22} at={2.6} align="center"><Icon name="checkmark" size={16} color="#fff" id="ck" /></Layer>
      <Layer id="tt" x={MX(2) + 24} y={MYY(1) - 23} w={126} h={46} at={3.05} align="center"><span className="stack center"><Text size={12.5} weight={600} color="#fff" className="tnum">Given 12:04 PM</Text><Text size={11} color="#cbd5e1">Avery K. witnessed</Text></span></Layer>
      <Layer id="lg" x={54} y={300} w={380} h={20} at={1.4} className="gap12"><span className="legend"><i style={{ background: '#16a34a' }} />Given</span><span className="legend"><i style={{ background: '#f59e0b' }} />Late</span><span className="legend"><i style={{ background: 'transparent', boxShadow: 'inset 0 0 0 1.5px #2d7dff' }} />Due now</span><span className="legend"><i style={{ background: '#f8fafc', boxShadow: 'inset 0 0 0 1.5px #e2e8f0' }} />Upcoming</span></Layer>
    </Frame>
  );
}
MedRecord.motion = c => {
  c.cursor([{ at: 2.35, x: MX(2) + 6, y: MYY(1) + 8, press: true }]);
  c.icon('ck', 0, 44, 2.62, .55);
};
Object.assign(MedRecord, {
  id: 'mar', title: 'Medication record', category: 'Data display', w: W, h: H, focus: { x: 240, y: 190 }, push: 1.02, orbit: .8, exit: [240, 180],
  summary: 'A weekly administration grid with today highlighted. Recording a due dose fills it from the center and raises a witnessed tooltip.',
  usage: `<MedRecord />`, icons: ['checkmark']
});
