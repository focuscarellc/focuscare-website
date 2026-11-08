import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';
import logo from '../../assets/logo-256.png';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8';

// ---------------------------------------------------------------- Tabs
const TABS = [['Overview', 74, 104], ['Notes', 186, 76], ['Billing', 270, 76]];
const IND = i => rect(TABS[i][1] + 10, 106, TABS[i][2] - 20, 3, 1.5);
const OV = [['Residents', '12'], ['Open tasks', '4'], ['Next visit', '9:30 AM']];
const NOTES = [['Morning routine completed', '8:42 AM · Avery K.'], ['Medication pass verified', '8:05 AM · Jordan P.'], ['Family call scheduled', 'Yesterday · Sam R.']];
export function Tabs({ uid = 'tabs' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Resident tabs" svg={<>
      <Surf id="card" x={50} y={46} w={380} h={274} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="div" d="M50 109.5 H430" stroke="#eef2f6" width={1} at={.75} />
      <Surf id="ind" {...IND(0)} tone="blue" elev={0} seed={[126, 107.5]} at={1.0} />
      {[0, 1, 2].map(i => <Surf key={i} id={`r${i}`} x={66} y={124 + i * 46} w={348} h={40} r={12} tone="muted" elev={0} seed={[90, 144 + i * 46]} at={1.0 + i * .08} />)}
      {[0, 1, 2].map(i => <Surf key={i} id={`b${i}`} x={76} y={132 + i * 56} w={34} h={34} r={10} tone="white" elev={1} seed={[93, 149 + i * 56]} at={2.62 + i * .07} />)}
    </>}>
      {TABS.map(([t, x, w], i) => <Layer key={t} id={`tab${i}`} x={x} y={62} w={w} h={40} at={.8 + i * .06} align="center"><Text size={14.5} weight={600} color={i === 0 ? INK : SUB} className={`tab${i}`}>{t}</Text></Layer>)}
      {OV.map(([l, v], i) => (
        <React.Fragment key={l}>
          <Layer id={`ol${i}`} x={84} y={124 + i * 46} w={180} h={40} at={1.2 + i * .07}><Text size={14} color={BODY}>{l}</Text></Layer>
          <Layer id={`ov${i}`} x={276} y={124 + i * 46} w={122} h={40} at={1.25 + i * .07} align="right"><Text size={14.5} weight={600} className="tnum">{v}</Text></Layer>
        </React.Fragment>
      ))}
      {NOTES.map(([t, m], i) => (
        <React.Fragment key={t}>
          <Layer id={`ni${i}`} kind="icon" x={76} y={132 + i * 56} w={34} h={34} at={2.75 + i * .07} align="center"><Icon name="fileText" size={18} color={DEEP} id={`ft${i}`} /></Layer>
          <Layer id={`nt${i}`} x={122} y={126 + i * 56} w={280} h={46} at={2.8 + i * .07}><span className="stack"><Text size={14} weight={600}>{t}</Text><Text size={12} color={SUB}>{m}</Text></span></Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
Tabs.motion = c => {
  c.cursor([{ at: 2.35, x: 236, y: 92, press: true }]);
  c.reshape('ind', rect(IND(0).x, 106, IND(1).x + IND(1).w - IND(0).x, 3, 1.5), 2.38, .16, 'power2.in');
  c.reshape('ind', IND(1), 2.54, .4, 'back.out(1.6)');
  c.fromTo('.tab0', { color: INK }, { color: SUB, duration: .2 }, 2.42).fromTo('.tab1', { color: SUB }, { color: INK, duration: .2 }, 2.45);
  ['ol0', 'ov0', 'ol1', 'ov1', 'ol2', 'ov2'].forEach((id, i) => c.hide(id, 2.4 + i * .02, .2));
  [0, 1, 2].forEach(i => c.reshape(`r${i}`, rect(66, 124 + i * 56, 348, 50, 14), 2.46 + i * .05, .5, 'back.out(1.2)'));
  [0, 1, 2].forEach(i => c.icon(`ft${i}`, 0, 39, 2.85 + i * .08, .9));
};
Object.assign(Tabs, {
  id: 'tabs', title: 'Tabs', category: 'Navigation', w: W, h: H, focus: { x: 236, y: 150 }, push: 1.1, exit: [240, 180],
  summary: 'The indicator stretches to the next tab while the content rows reshape in place from summary values into notes.',
  usage: `<Tabs />`, icons: ['fileText']
});

// ---------------------------------------------------------------- Sidebar navigation
const NAV = [['home', 'Home'], ['calendar', 'Schedule'], ['users', 'Residents'], ['fileText', 'Documents'], ['settings', 'Settings']];
const NY = i => 82 + i * 46;
export function Sidebar({ uid = 'sidebar', items = NAV }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Sidebar navigation" svg={<>
      <Surf id="panel" x={120} y={16} w={240} h={328} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="act" x={132} y={NY(0)} w={216} h={42} r={12} tone="tint" elev={0} seed={[152, NY(0) + 21]} at={1.0} />
      <Surf id="count" x={314} y={NY(3) + 11} w={24} h={20} r={10} tone="blue" elev={0} seed={[326, NY(3) + 21]} at={1.35} />
    </>}>
      <Layer id="brand" x={140} y={30} w={200} h={36} at={.7} className="gap10"><img src={logo} alt="Focus Care" width="28" height="28" style={{ display: 'block' }} /><Text size={15.5} weight={600}>Focus Care</Text></Layer>
      {items.map(([ic, l], i) => (
        <React.Fragment key={l}>
          <Layer id={`i${i}`} kind="icon" x={142} y={NY(i)} w={28} h={42} at={.85 + i * .06} align="center"><Icon name={ic} size={20} color={i === 0 ? DEEP : BODY} id={ic} /></Layer>
          <Layer id={`l${i}`} x={180} y={NY(i)} w={130} h={42} at={.9 + i * .06}><Text size={14.5} weight={i === 0 ? 600 : 500} color={i === 0 ? DEEP : '#334155'} className={`nav${i}`}>{l}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="cnt" x={314} y={NY(3) + 11} w={24} h={20} at={1.5} align="center"><Text size={11} weight={700} color="#fff" className="tnum">3</Text></Layer>
    </Frame>
  );
}
Sidebar.motion = c => {
  c.cursor([{ at: 2.35, x: 262, y: NY(1) + 25, press: true }]);
  c.reshape('act', rect(132, NY(0), 216, NY(1) + 42 - NY(0), 12), 2.38, .16, 'power2.in');
  c.reshape('act', rect(132, NY(1), 216, 42, 12), 2.54, .42, 'back.out(1.5)');
  c.fromTo('.nav0', { color: DEEP }, { color: '#334155', duration: .2 }, 2.42).fromTo('.nav1', { color: '#334155' }, { color: DEEP, duration: .2 }, 2.45);
  c.fromTo('[data-icon="home"]', { color: DEEP }, { color: BODY, duration: .2 }, 2.42).fromTo('[data-icon="calendar"]', { color: BODY }, { color: DEEP, duration: .2 }, 2.45);
  c.icon('home', 0, 30, 1.0, .6);
  c.icon('calendar', 0, 7, 2.5, .3);
  c.press('act', '[data-layer="l1"]', 2.56, .6);
};
Object.assign(Sidebar, {
  id: 'sidebar', title: 'Sidebar navigation', category: 'Navigation', w: W, h: H, focus: { x: 240, y: 150 }, push: 1.12, exit: [240, 180],
  summary: 'Workspace navigation with the Focus Care mark. The active surface stretches from Home to Schedule and settles with a soft press.',
  usage: `<Sidebar items={[['home','Home'], ['calendar','Schedule'], ...]} />`, icons: ['home', 'calendar', 'users', 'fileText', 'settings']
});

// ---------------------------------------------------------------- Command palette
const CMDS = [['logIn', 'Clock in to Maple House', 'EVV'], ['clock', 'View clock history', 'H'], ['edit', 'Add a shift note', 'N']];
const CY = i => 128 + i * 52;
export function CommandPalette({ uid = 'command', query = 'clock' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Command palette" svg={<>
      <Surf id="panel" x={40} y={30} w={400} h={300} r={20} tone="glass" elev={4} seed={[240, 180]} />
      <Draw id="div" d="M40 90.5 H440" stroke="#eef2f6" width={1} at={.8} />
      <Surf id="esc" x={392} y={48} w={36} h={24} r={7} tone="muted" elev={0} seed={[410, 60]} order={1} />
      <Surf id="hit" x={52} y={CY(0)} w={376} h={46} r={12} tone="tint" elev={0} seed={[76, CY(0) + 23]} at={1.75} />
      {CMDS.map((_, i) => <Surf key={i} id={`b${i}`} x={62} y={CY(i) + 7} w={32} h={32} r={9} tone="white" elev={1} seed={[78, CY(i) + 23]} at={1.55 + i * .07} />)}
      <Surf id="kd" x={60} y={296} w={24} h={22} r={6} tone="white" elev={1} seed={[72, 307]} at={1.1} />
      <Surf id="ke" x={170} y={296} w={24} h={22} r={6} tone="white" elev={1} seed={[182, 307]} at={1.15} />
    </>}>
      <Layer id="ci" kind="icon" x={56} y={30} w={30} h={60} at={.7} align="center"><Icon name="command" size={20} color="#334155" id="command" /></Layer>
      <Layer id="ph" x={96} y={30} w={280} h={60} at={.8}><Text size={16} color="#94a3b8">Type a command or search</Text></Layer>
      <Layer id="q" x={96} y={30} w={280} h={60} at={1.2}><Text size={16} weight={500}> </Text></Layer>
      <Layer id="esct" x={392} y={48} w={36} h={24} at={.95} align="center"><Text size={11} weight={600} color={SUB}>esc</Text></Layer>
      <Layer id="sec" x={60} y={100} w={240} h={22} at={1.45}><Text size={12} weight={600} color={SUB}>Suggested actions</Text></Layer>
      {CMDS.map(([ic, l, k], i) => (
        <React.Fragment key={l}>
          <Layer id={`ri${i}`} kind="icon" x={62} y={CY(i) + 7} w={32} h={32} at={1.65 + i * .07} align="center"><Icon name={ic} size={18} color={DEEP} id={ic} /></Layer>
          <Layer id={`rl${i}`} x={106} y={CY(i)} w={260} h={46} at={1.68 + i * .07}><Text size={14.5} weight={500} color={INK}>{l}</Text></Layer>
          <Layer id={`rk${i}`} x={366} y={CY(i)} w={52} h={46} at={1.72 + i * .07} align="right"><Text size={12} weight={600} color={SUB}>{k}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="kdt" x={60} y={296} w={24} h={22} at={1.25} align="center"><Text size={12} weight={600} color="#334155">↓</Text></Layer>
      <Layer id="kdl" x={92} y={296} w={70} h={22} at={1.3}><Text size={12} color={SUB}>Navigate</Text></Layer>
      <Layer id="ket" x={170} y={296} w={24} h={22} at={1.3} align="center"><Text size={12} weight={600} color="#334155">↵</Text></Layer>
      <Layer id="kel" x={202} y={296} w={70} h={22} at={1.35}><Text size={12} color={SUB}>Run</Text></Layer>
    </Frame>
  );
}
CommandPalette.motion = c => {
  c.hide('ph', 1.18, .18);
  c.typing(c.q('[data-layer="q"] .fc-text'), 'clock', 1.3, 10);
  c.icon('command', 0, 35, .8, 1.0);
  c.press('kd', '[data-layer="kdt"]', 2.75, 1.2);
  c.reshape('hit', rect(52, CY(1), 376, 46, 12), 2.78, .42, 'back.out(1.4)');
  c.press('ke', '[data-layer="ket"]', 3.35, 1.2);
  c.press('hit', '[data-layer="rl1"]', 3.4, .8);
  c.icon('clock', 0, 39, 3.4, 1.2);
};
Object.assign(CommandPalette, {
  id: 'command', title: 'Command palette', category: 'Navigation', w: W, h: H, focus: { x: 240, y: 170 }, push: 1.05, exit: [240, 180],
  summary: 'Keyboard-first palette. The query types in, results form in sequence, and the highlight follows arrow and return keycaps.',
  usage: `<CommandPalette query="clock" />`, icons: ['command', 'logIn', 'clock', 'edit']
});
