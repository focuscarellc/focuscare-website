import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', BODY = '#475569', SUB = '#64748b', BLUE = '#2d7dff', DEEP = '#1d4ed8';

// ---------------------------------------------------------------- Button
export function Button({ uid = 'button', label = 'Submit timesheet', done = 'Submitted', secondary = 'Save draft', ghost = 'Cancel' }) {
  return (
    <Frame uid={uid} w={W} h={H} label={`${label} button group`} svg={<>
      <Surf id="primary" x={110} y={118} w={260} h={64} r={18} tone="blue" elev={3} seed={[240, 150]} order={0} />
      <Surf id="secondary" x={110} y={198} w={124} h={48} r={14} tone="white" elev={1} seed={[172, 222]} order={1} />
      <Surf id="ghost" x={246} y={198} w={124} h={48} r={14} tone="muted" elev={0} seed={[308, 222]} order={2} />
    </>}>
      <Layer id="eyebrow" x={110} y={78} w={260} h={24} at={.7} align="center"><Text size={13} weight={600} color={SUB}>Timesheet · Week 44</Text></Layer>
      <Layer id="a" x={110} y={118} w={260} h={64} at={.85} align="center" className="gap10">
        <Text size={17} weight={600} color="#fff">{label}</Text><Icon name="arrowRight" size={22} color="#fff" id="arrow" />
      </Layer>
      <Layer id="spin" kind="icon" x={210} y={118} w={60} h={64} at={2.76} align="center"><Icon name="loading" size={30} color="#fff" id="spin" /></Layer>
      <Layer id="b" x={140} y={118} w={200} h={64} at={3.28} align="center" className="gap8">
        <Icon name="checkmark" size={24} color="#fff" id="check" /><Text size={17} weight={600} color="#fff">{done}</Text>
      </Layer>
      <Layer id="sec" x={110} y={198} w={124} h={48} at={1.0} align="center"><Text size={14} weight={600} color={INK}>{secondary}</Text></Layer>
      <Layer id="gho" x={246} y={198} w={124} h={48} at={1.05} align="center"><Text size={14} weight={600} color={BODY}>{ghost}</Text></Layer>
    </Frame>
  );
}
Button.motion = c => {
  const { T } = c;
  c.cursor([{ at: T.click, x: 300, y: 156, press: true }]);
  c.icon('arrow', 0, 35, T.click - .35, .6);
  c.press('primary', '[data-layer="a"]', T.click, 1.1);
  c.hide('a', T.release + .08);
  c.reshape('primary', rect(208, 118, 64, 64, 32), T.release + .1, .5, 'power3.inOut');
  c.icon('spin', 30, 120, 2.76, .48);
  c.hide('spin', 3.22, .18);
  c.reshape('primary', rect(140, 118, 200, 64, 32), 3.2, .55, 'back.out(1.3)');
  c.icon('check', 0, 44, 3.34, .7);
};
Object.assign(Button, {
  id: 'button', title: 'Button', category: 'Actions', w: W, h: H, focus: { x: 240, y: 150 }, exit: [240, 150],
  summary: 'Primary, secondary and ghost actions. The primary press compresses, springs back and morphs through loading into a confirmed state.',
  usage: `<Button label="Submit timesheet" done="Submitted" secondary="Save draft" ghost="Cancel" />`,
  icons: ['arrowRight', 'loading', 'checkmark']
});

// ---------------------------------------------------------------- Icon toolbar
const SLOT = i => 115 + i * 66;
export function Toolbar({ uid = 'toolbar', tip = 'Copied to notes' }) {
  const icons = [['edit', 'Edit'], ['copy', 'Duplicate'], ['trash2', 'Delete'], ['moreHorizontal', 'More']];
  return (
    <Frame uid={uid} w={W} h={H} label="Note actions toolbar" svg={<>
      <Surf id="bar" x={100} y={170} w={280} h={60} r={20} tone="white" elev={3} seed={[240, 200]} />
      <Surf id="hover" x={SLOT(0)} y={178} w={52} h={44} r={13} tone="muted" elev={0} seed={[SLOT(0) + 26, 200]} at={1.4} />
      <Surf id="tip" x={146} y={104} w={136} h={38} r={11} tone="ink" elev={2} seed={[214, 160]} at={2.6} />
      <Pop id="tip-arrow" at={2.9}><path d="M207 141 L214 149 L221 141 Z" fill="#0f172a" /></Pop>
    </>}>
      {icons.map(([n, l], i) => (
        <Layer key={n} id={`i${i}`} kind="icon" x={SLOT(i)} y={178} w={52} h={44} at={.7 + i * .07} align="center">
          <Icon name={n} size={24} color={i === 2 ? '#b91c1c' : '#334155'} id={n} />
          <span className="sr-only">{l}</span>
        </Layer>
      ))}
      <Layer id="tiptext" x={146} y={104} w={136} h={38} at={2.95} align="center"><Text size={13} weight={600} color="#fff">{tip}</Text></Layer>
      <Layer id="cap" x={100} y={250} w={280} h={24} at={1.0} align="center"><Text size={13} weight={500} color={SUB}>Shift note · 8:42 AM</Text></Layer>
    </Frame>
  );
}
Toolbar.motion = c => {
  c.cursor([{ at: 1.6, x: SLOT(0) + 34, y: 210 }, { at: 2.5, x: SLOT(1) + 34, y: 210, press: true }]);
  c.icon('edit', 0, 59, 1.55, 1.1);
  // Hover pill stretches across both slots, then contracts onto the next one.
  c.reshape('hover', rect(SLOT(0), 178, 118, 44, 13), 2.28, .18, 'power2.in');
  c.reshape('hover', rect(SLOT(1), 178, 52, 44, 13), 2.46, .32, 'back.out(1.6)');
  c.press('hover', '[data-layer="i1"]', 2.5, 1.2);
  c.icon('copy', 0, 4, 2.52, .2);
};
Object.assign(Toolbar, {
  id: 'toolbar', title: 'Icon toolbar', category: 'Actions', w: W, h: H, focus: { x: 220, y: 175 }, exit: [240, 200],
  summary: 'Compact icon actions with a stretching hover surface and a tooltip that forms out of the pressed slot.',
  usage: `<Toolbar tip="Copied to notes" />`, icons: ['edit', 'copy', 'trash2', 'moreHorizontal']
});

// ---------------------------------------------------------------- Clock-in (EVV)
export function ClockIn({ uid = 'clockin', site = 'Maple House', shift = 'Shift 7:00 AM – 3:00 PM' }) {
  return (
    <Frame uid={uid} w={W} h={H} label={`Clock in at ${site}`} svg={<>
      <Surf id="card" x={70} y={62} w={340} h={236} r={24} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="badge" x={94} y={86} w={48} h={48} r={15} tone="tint" elev={0} seed={[118, 110]} order={1} />
      <Surf id="geo" x={94} y={152} w={150} h={30} r={15} tone="greenTint" elev={0} seed={[109, 167]} at={1.05} />
      <Pop id="geodot" at={1.3}><circle cx={110} cy={167} r={4} fill="#16a34a" /></Pop>
      <Surf id="cta" x={94} y={214} w={292} h={56} r={16} tone="blue" elev={3} seed={[240, 242]} order={2} />
      <Pop id="live" at={2.7}><circle cx={110} cy={242} r={5} fill="#16a34a" /><circle className="pulse" cx={110} cy={242} r={5} fill="none" stroke="#16a34a" strokeWidth="2" /></Pop>
    </>}>
      <Layer id="ic" kind="icon" x={94} y={86} w={48} h={48} at={.8} align="center"><Icon name="clock" size={26} color={DEEP} id="clock" /></Layer>
      <Layer id="t1" x={156} y={88} w={230} h={24} at={.85}><Text size={17} weight={600}>{site}</Text></Layer>
      <Layer id="t2" x={156} y={112} w={230} h={20} at={.92}><Text size={13} color={SUB}>{shift}</Text></Layer>
      <Layer id="geot" x={118} y={152} w={126} h={30} at={1.2}><Text size={12.5} weight={600} color="#15803d">Inside geofence</Text></Layer>
      <Layer id="cin" x={94} y={214} w={292} h={56} at={1.1} align="center" className="gap10"><Icon name="logIn" size={22} color="#fff" id="login" /><Text size={16} weight={600} color="#fff">Clock in</Text></Layer>
      <Layer id="timer" x={126} y={214} w={150} h={56} at={2.78}>
        <span className="stack"><Text size={11.5} weight={600} color={SUB}>On shift</Text><Text size={20} weight={700} className="tnum">00:00:00</Text></span>
      </Layer>
      <Layer id="cout" x={276} y={214} w={110} h={56} at={2.9} align="center"><Text size={14} weight={600} color="#fff">Clock out</Text></Layer>
    </Frame>
  );
}
ClockIn.motion = c => {
  const { T } = c;
  c.cursor([{ at: T.click, x: 252, y: 246, press: true }]);
  c.press('cta', '[data-layer="cin"]', T.click, 1.1);
  c.icon('login', 0, 33, T.click - .1, .6);
  c.icon('clock', 0, 39, T.click + .1, 1.3);
  c.hide('cin', T.release + .05);
  c.reshape('cta', rect(276, 214, 110, 56, 16), T.release + .1, .6, 'back.out(1.25)');
  const el = c.q('[data-layer="timer"] .tnum');
  c.after(t => { const s = Math.max(0, Math.floor((t - 2.7) * 1)); el.textContent = `00:00:${String(Math.min(s, 59)).padStart(2, '0')}`; });
};
Object.assign(ClockIn, {
  id: 'clockin', title: 'EVV clock-in', category: 'Actions', w: W, h: H, focus: { x: 240, y: 236 }, exit: [240, 180],
  summary: 'Electronic visit verification card. The call to action contracts into a clock-out control while a live shift timer takes its place.',
  usage: `<ClockIn site="Maple House" shift="Shift 7:00 AM – 3:00 PM" />`, icons: ['clock', 'logIn']
});
