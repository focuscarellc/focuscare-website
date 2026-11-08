import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect, rr } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', MUTE = '#94a3b8', DEEP = '#1d4ed8';

// ---------------------------------------------------------------- Search field
const ROWS = [['JE', 'Jordan Ellis', 'Resident · Maple House'], ['JP', 'Jordan Price', 'DSP · Level II'], ['JR', 'Jordana Reyes', 'Nurse · On call']];
export function SearchField({ uid = 'search', query = 'Jordan', placeholder = 'Search residents, staff, notes', results = ROWS }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Search with results" svg={<>
      <Draw id="ring" d={rr(66, 56, 348, 64, 20)} stroke="rgba(45,125,255,.30)" width={3.5} at={1.55} dur={.45} />
      <Surf id="field" x={70} y={60} w={340} h={56} r={16} tone="white" elev={3} seed={[240, 88]} />
      <Surf id="panel" x={70} y={128} w={340} h={184} r={18} tone="white" elev={3} seed={[240, 118]} at={2.1} />
      <Surf id="hit" x={80} y={138} w={320} h={52} r={12} tone="tint" elev={0} seed={[112, 164]} at={2.25} />
      {results.map((_, i) => <Surf key={i} id={`av${i}`} x={94} y={146 + i * 56} w={36} h={36} r={18} tone="tint" elev={0} seed={[112, 164 + i * 56]} at={2.28 + i * .08} />)}
    </>}>
      <Layer id="si" kind="icon" x={82} y={60} w={32} h={56} at={.75} align="center"><Icon name="searchToX" size={22} color="#334155" id="search" /></Layer>
      <Layer id="ph" x={122} y={60} w={270} h={56} at={.85}><Text size={15} color={MUTE}>{placeholder}</Text></Layer>
      <Layer id="q" x={122} y={60} w={270} h={56} at={1.6}><Text size={15} weight={500} className="typed"> </Text></Layer>
      {results.map(([ini, name, meta], i) => (
        <React.Fragment key={i}>
          <Layer id={`ini${i}`} x={94} y={146 + i * 56} w={36} h={36} at={2.4 + i * .08} align="center"><Text size={12} weight={700} color={DEEP}>{ini}</Text></Layer>
          <Layer id={`row${i}`} x={142} y={140 + i * 56} w={240} h={48} at={2.42 + i * .08}>
            <span className="stack"><Text size={15} weight={600}>{name}</Text><Text size={12.5} color={SUB}>{meta}</Text></span>
          </Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
SearchField.motion = c => {
  c.cursor([{ at: 1.5, x: 210, y: 96, press: true }, { at: 3.4, x: 318, y: 226, press: true }]);
  c.hide('ph', 1.62, .2);
  c.typing(c.q('[data-layer="q"] .fc-text'), ROWS[0][1].split(' ')[0], 1.72, 11);
  c.icon('search', 0, 29, 2.05, .4);
  c.reshape('hit', rect(80, 194, 320, 52, 12), 3.12, .45, 'back.out(1.3)');
  c.press('hit', '[data-layer="row1"]', 3.4, .8);
};
Object.assign(SearchField, {
  id: 'search', title: 'Search field', category: 'Inputs', w: W, h: H, focus: { x: 240, y: 170 }, exit: [240, 88],
  summary: 'Focus ring draws on, the query types in, and the results panel grows out of the field while the native search icon turns into clear.',
  usage: `<SearchField query="Jordan" placeholder="Search residents, staff, notes" />`, icons: ['searchToX']
});

// ---------------------------------------------------------------- Text input with validation
export function EmailInput({ uid = 'email', label = 'Work email', value = 'avery@maplehouse.org' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Email input with validation" svg={<>
      <Draw id="ring" className="ring" d={rr(66, 108, 348, 64, 18)} stroke="rgba(45,125,255,.30)" width={3.5} at={1.55} dur={.45} />
      <Surf id="field" x={70} y={112} w={340} h={56} r={14} tone="white" elev={2} seed={[240, 140]} />
      <Surf id="cta" x={70} y={234} w={340} h={54} r={15} tone="blue" elev={3} seed={[240, 261]} order={1} />
    </>}>
      <Layer id="lab" x={70} y={82} w={220} h={22} at={.75}><Text size={13.5} weight={600} color="#334155">{label}</Text></Layer>
      <Layer id="mi" kind="icon" x={82} y={112} w={32} h={56} at={.8} align="center"><Icon name="mail" size={22} color="#334155" id="mail" /></Layer>
      <Layer id="ph" x={122} y={112} w={240} h={56} at={.9}><Text size={15} color={MUTE}>name@agency.org</Text></Layer>
      <Layer id="v" x={122} y={112} w={240} h={56} at={1.6}><Text size={15} weight={500}> </Text></Layer>
      <Layer id="ok" kind="icon" x={366} y={112} w={32} h={56} at={2.95} align="center"><Icon name="checkCircle" size={24} color="#16a34a" id="ok" /></Layer>
      <Layer id="h1" x={70} y={176} w={340} h={22} at={1.0}><Text size={13} color={SUB}>We send shift reminders to this address.</Text></Layer>
      <Layer id="h2" x={70} y={176} w={340} h={22} at={3.08}><Text size={13} weight={600} color="#15803d">Verified for your agency workspace</Text></Layer>
      <Layer id="go" x={70} y={234} w={340} h={54} at={1.1} align="center" className="gap8"><Text size={16} weight={600} color="#fff">Continue</Text><Icon name="arrowRight" size={20} color="#fff" id="arrow" /></Layer>
    </Frame>
  );
}
EmailInput.motion = c => {
  c.cursor([{ at: 1.5, x: 236, y: 144, press: true }, { at: 3.6, x: 262, y: 264, press: true }]);
  c.hide('ph', 1.62, .2);
  c.typing(c.q('[data-layer="v"] .fc-text'), 'avery@maplehouse.org', 1.74, 18);
  c.icon('mail', 0, 19, 1.55, .5);
  c.icon('ok', 8, 39, 3.0, .6);
  c.fromTo('.ring', { stroke: 'rgba(45,125,255,.30)' }, { stroke: 'rgba(22,163,74,.28)', duration: .4 }, 2.95);
  c.hide('h1', 2.92, .2);
  c.press('cta', '[data-layer="go"]', 3.6, 1);
  c.icon('arrow', 0, 35, 3.6, .6);
};
Object.assign(EmailInput, {
  id: 'email', title: 'Validated input', category: 'Inputs', w: W, h: H, focus: { x: 240, y: 160 }, exit: [240, 140],
  summary: 'Labelled text input with a drawn focus ring, typed value and a native check that confirms validation before the primary action.',
  usage: `<EmailInput label="Work email" value="avery@maplehouse.org" />`, icons: ['mail', 'checkCircle', 'arrowRight']
});

// ---------------------------------------------------------------- Toggle switch
function SwitchRow({ y, icon, title, sub, i }) {
  return (<>
    <Layer id={`ic${i}`} kind="icon" x={74} y={y + 22} w={40} h={40} at={.8 + i * .1} align="center"><Icon name={icon} size={22} color={DEEP} id={icon} /></Layer>
    <Layer id={`tx${i}`} x={128} y={y + 18} w={210} h={48} at={.85 + i * .1}><span className="stack"><Text size={15} weight={600}>{title}</Text><Text size={13} color={SUB}>{sub}</Text></span></Layer>
  </>);
}
export function Toggle({ uid = 'toggle' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Settings with switches" svg={<>
      <Surf id="card" x={50} y={96} w={380} h={168} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="b0" x={74} y={118} w={40} h={40} r={12} tone="tint" elev={0} seed={[94, 138]} order={1} />
      <Surf id="b1" x={74} y={202} w={40} h={40} r={12} tone="tint" elev={0} seed={[94, 222]} order={2} />
      <Draw id="div" d="M74 180.5 H406" stroke="#eef2f6" width={1} at={.7} />
      <Surf id="track0" x={350} y={122} w={56} h={32} r={16} tone="track" elev={0} seed={[378, 138]} order={2} />
      <Surf id="on0" x={350} y={122} w={56} h={32} r={16} tone="blue" elev={0} seed={[366, 138]} at={2.42} />
      <Surf id="knob0" x={353} y={125} w={26} h={26} r={13} tone="white" elev={2} seed={[366, 138]} order={3} />
      <Surf id="track1" x={350} y={206} w={56} h={32} r={16} tone="blue" elev={0} seed={[378, 222]} order={3} />
      <Surf id="knob1" x={377} y={209} w={26} h={26} r={13} tone="white" elev={2} seed={[390, 222]} order={4} />
    </>}>
      <SwitchRow y={96} i={0} icon="shield" title="Two-step sign-in" sub="Required for EVV edits" />
      <SwitchRow y={180} i={1} icon="notification" title="Visit reminders" sub="15 minutes before each shift" />
      <span className="sr-only" role="switch" aria-checked="true">Two-step sign-in</span>
    </Frame>
  );
}
Toggle.motion = c => {
  c.cursor([{ at: 2.35, x: 368, y: 144, press: true }]);
  c.reshape('knob0', rect(353, 125, 36, 26, 13), 2.4, .14, 'power2.out');
  c.reshape('knob0', rect(377, 125, 26, 26, 13), 2.54, .42, 'back.out(1.7)');
  c.icon('shield', 0, 33, 2.55, .9);
};
Object.assign(Toggle, {
  id: 'toggle', title: 'Toggle switch', category: 'Inputs', w: W, h: H, focus: { x: 262, y: 150 }, push: 1.1, exit: [240, 180],
  summary: 'Settings rows with switches. The knob stretches toward its destination and the blue fill grows out of its starting point.',
  usage: `<Toggle />  // role="switch" aria-checked`, icons: ['shield', 'notification']
});

// ---------------------------------------------------------------- Checklist
const TASKS = [['Medication pass', '8:00 AM · Avery K.'], ['Shift note', 'Due 3:00 PM'], ['Incident review', 'Optional · 2 open']];
export function Checklist({ uid = 'checklist', tasks = TASKS }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Shift task checklist" svg={<>
      <Surf id="card" x={70} y={46} w={340} h={268} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="r0" x={84} y={110} w={312} h={50} r={12} tone="tint" elev={0} seed={[110, 135]} at={2.2} />
      <Surf id="r1" x={84} y={166} w={312} h={50} r={12} tone="tint" elev={0} seed={[110, 191]} at={3.0} />
      <Surf id="track" x={94} y={284} w={292} h={6} r={3} tone="track" elev={0} seed={[97, 287]} order={1} />
      <Surf id="fill" x={94} y={284} w={8} h={6} r={3} tone="blue" elev={0} seed={[97, 287]} order={2} />
    </>}>
      <Layer id="h" x={94} y={64} w={200} h={28} at={.75}><Text size={16} weight={600}>Shift tasks</Text></Layer>
      <Layer id="n" x={276} y={64} w={110} h={28} at={.8} align="right"><Text size={13} weight={600} color={SUB} className="tnum">0 of 3 done</Text></Layer>
      {tasks.map(([t, m], i) => (
        <React.Fragment key={i}>
          <Layer id={`cb${i}`} kind="icon" x={94} y={110 + i * 56} w={32} h={50} at={1.0 + i * .08} align="center"><Icon name="checkBox" size={26} color={DEEP} id={`cb${i}`} /></Layer>
          <Layer id={`t${i}`} x={136} y={110 + i * 56} w={250} h={50} at={1.05 + i * .08}><span className="stack"><Text size={15} weight={600} className="title">{t}</Text><Text size={12.5} color={SUB}>{m}</Text></span></Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
Checklist.motion = c => {
  c.cursor([{ at: 2.15, x: 112, y: 138, press: true }, { at: 2.95, x: 112, y: 194, press: true }]);
  c.icon('cb0', 0, 29, 2.17, .4); c.icon('cb1', 0, 29, 2.97, .4);
  c.press('r0', '[data-layer="t0"]', 2.24, .6);
  c.reshape('fill', rect(94, 284, 97, 6, 3), 2.25, .6, 'power3.out');
  c.reshape('fill', rect(94, 284, 195, 6, 3), 3.05, .6, 'power3.out');
  c.fromTo('[data-layer="t0"] .title', { color: INK }, { color: '#475569', duration: .3 }, 2.3);
  c.fromTo('[data-layer="t1"] .title', { color: INK }, { color: '#475569', duration: .3 }, 3.1);
  c.swap('[data-layer="n"] .fc-text', ['0 of 3 done', '1 of 3 done', '2 of 3 done'], [2.25, 3.05]);
};
Object.assign(Checklist, {
  id: 'checklist', title: 'Checklist', category: 'Inputs', w: W, h: H, focus: { x: 228, y: 170 }, exit: [240, 180],
  summary: 'Task rows with native checkboxes. Each check grows a tinted row from the box and advances a progress fill.',
  usage: `<Checklist tasks={[['Medication pass','8:00 AM · Avery K.'], ...]} />`, icons: ['checkBox']
});

// ---------------------------------------------------------------- Radio cards
const SHIFTS = [['sun', 'Day', '7a – 3p', '12 open'], ['sunset', 'Evening', '3p – 11p', '8 open'], ['moon', 'Overnight', '11p – 7a', '5 open']];
const CX = i => 45 + i * 130;
export function RadioCards({ uid = 'radio', options = SHIFTS }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Shift preference radio cards" svg={<>
      {options.map((_, i) => <Surf key={i} id={`c${i}`} x={CX(i)} y={118} w={120} h={160} r={18} tone="white" elev={2} seed={[CX(i) + 60, 198]} order={i} />)}
      {options.map((_, i) => <Surf key={i} id={`b${i}`} x={CX(i) + 16} y={134} w={40} h={40} r={12} tone="tint" elev={0} seed={[CX(i) + 36, 154]} order={3 + i} />)}
      <Draw id="sel" className="sel" d={rr(CX(0) - 3, 115, 126, 166, 21)} stroke="#2d7dff" width={2} at={1.35} dur={.5} />
    </>}>
      <Layer id="h" x={45} y={62} w={360} h={24} at={.7}><Text size={16} weight={600}>Preferred shift</Text></Layer>
      <Layer id="s" x={45} y={86} w={360} h={20} at={.78}><Text size={13} color={SUB}>Applies to next week's schedule</Text></Layer>
      {options.map(([ic, t, time, open], i) => (
        <React.Fragment key={i}>
          <Layer id={`i${i}`} kind="icon" x={CX(i) + 16} y={134} w={40} h={40} at={.95 + i * .08} align="center"><Icon name={ic} size={22} color={DEEP} id={ic} /></Layer>
          <Layer id={`r${i}`} kind="icon" x={CX(i) + 82} y={134} w={28} h={28} at={1.0 + i * .08} align="center"><Icon name="radioButton" size={24} color={i === 0 ? DEEP : '#94a3b8'} id={`rb${i}`} /></Layer>
          <Layer id={`t${i}`} x={CX(i) + 16} y={192} w={100} h={72} at={1.05 + i * .08}>
            <span className="stack"><Text size={16} weight={600}>{t}</Text><Text size={13} color={SUB} className="tnum">{time}</Text><Text size={12} weight={600} color={DEEP} style={{ marginTop: 6 }}>{open}</Text></span>
          </Layer>
        </React.Fragment>
      ))}
    </Frame>
  );
}
RadioCards.motion = c => {
  c.cursor([{ at: 2.35, x: 272, y: 254, press: true }]);
  c.rest('rb0', 29);
  c.icon('rb0', 29, 0, 2.45, .25);
  c.icon('rb1', 0, 29, 2.55, .45);
  c.fromTo('[data-icon="rb1"]', { color: '#94a3b8' }, { color: DEEP, duration: .2 }, 2.5);
  c.fromTo('[data-icon="rb0"]', { color: DEEP }, { color: '#94a3b8', duration: .2 }, 2.45);
  c.morph('.sel', rr(CX(0) - 3, 115, 126, 166, 21), rr(CX(0) - 3, 115, 256, 166, 21), 2.42, .16, 'power2.in');
  c.morph('.sel', rr(CX(0) - 3, 115, 256, 166, 21), rr(CX(1) - 3, 115, 126, 166, 21), 2.58, .42, 'back.out(1.5)');
  c.press('c1', '[data-layer="t1"]', 2.35, .7);
  c.icon('sunset', 0, 33, 2.55, .9);
};
Object.assign(RadioCards, {
  id: 'radio', title: 'Radio cards', category: 'Inputs', w: W, h: H, focus: { x: 220, y: 198 }, push: 1.1, exit: [240, 198],
  summary: 'Option cards with native radio icons. The selection outline stretches across to the new card instead of jumping.',
  usage: `<RadioCards options={[['sun','Day','7a – 3p','12 open'], ...]} />`, icons: ['sun', 'sunset', 'moon', 'radioButton']
});

// ---------------------------------------------------------------- Segmented control
const SEG = ['Day', 'Week', 'Month'];
const SX = i => 74 + i * 112;
export function Segmented({ uid = 'segmented', options = SEG }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Schedule view segmented control" svg={<>
      <Surf id="track" x={70} y={128} w={340} h={52} r={16} tone="muted" elev={0} seed={[240, 154]} />
      <Surf id="thumb" x={SX(0)} y={132} w={108} h={44} r={12} tone="white" elev={2} seed={[128, 154]} order={2} />
      <Surf id="note" x={70} y={198} w={340} h={52} r={16} tone="white" elev={2} seed={[240, 224]} order={3} />
    </>}>
      <Layer id="h" x={70} y={92} w={200} h={24} at={.7}><Text size={16} weight={600}>Schedule view</Text></Layer>
      <Layer id="m" x={250} y={92} w={160} h={24} at={.76} align="right"><Text size={13} color={SUB}>Week of Nov 2</Text></Layer>
      {options.map((o, i) => <Layer key={o} id={`o${i}`} x={SX(i)} y={132} w={108} h={44} at={.9 + i * .06} align="center"><Text size={14.5} weight={600} color={i === 0 ? INK : SUB} className={`seg${i}`}>{o}</Text></Layer>)}
      <Layer id="ci" kind="icon" x={86} y={198} w={30} h={52} at={1.1} align="center"><Icon name="calendar" size={22} color={DEEP} id="calendar" /></Layer>
      <Layer id="cap" x={124} y={198} w={270} h={52} at={1.15}><Text size={14} weight={500} color="#334155" className="tnum">Monday · 6 shifts scheduled</Text></Layer>
    </Frame>
  );
}
Segmented.motion = c => {
  c.cursor([{ at: 2.3, x: 268, y: 166, press: true }, { at: 3.2, x: 380, y: 166, press: true }]);
  c.reshape('thumb', rect(SX(0), 132, 220, 44, 12), 2.33, .16, 'power2.in');
  c.reshape('thumb', rect(SX(1), 132, 108, 44, 12), 2.49, .4, 'back.out(1.5)');
  c.reshape('thumb', rect(SX(1), 132, 220, 44, 12), 3.23, .16, 'power2.in');
  c.reshape('thumb', rect(SX(2), 132, 108, 44, 12), 3.39, .4, 'back.out(1.5)');
  c.fromTo('.seg0', { color: INK }, { color: SUB, duration: .2 }, 2.4).fromTo('.seg1', { color: SUB }, { color: INK, duration: .2 }, 2.45);
  c.fromTo('.seg1', { color: INK }, { color: SUB, duration: .2 }, 3.3).fromTo('.seg2', { color: SUB }, { color: INK, duration: .2 }, 3.35);
  c.swap('[data-layer="cap"] .fc-text', ['Monday · 6 shifts scheduled', '7 days · 42 shifts scheduled', 'November · 168 shifts scheduled'], [2.5, 3.4]);
  c.press('note', '[data-layer="cap"]', 2.5, .5); c.press('note', null, 3.4, .5);
  c.icon('calendar', 0, 7, 2.5, .25); c.icon('calendar', 0, 7, 3.4, .25);
};
Object.assign(Segmented, {
  id: 'segmented', title: 'Segmented control', category: 'Inputs', w: W, h: H, focus: { x: 260, y: 170 }, exit: [240, 154],
  summary: 'A raised thumb that stretches toward the next segment and contracts onto it, with a summary card that confirms the change.',
  usage: `<Segmented options={['Day','Week','Month']} />`, icons: ['calendar']
});

// ---------------------------------------------------------------- Slider
const VX = v => 80 + (v - 1) / 24 * 320;
export function Slider({ uid = 'slider', from = 5, to = 12 }) {
  const x0 = VX(from);
  return (
    <Frame uid={uid} w={W} h={H} label="Visit radius slider" svg={<>
      <Surf id="card" x={56} y={72} w={368} h={216} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="track" x={80} y={208} w={320} h={8} r={4} tone="track" elev={0} seed={[84, 212]} order={1} />
      <Surf id="fill" x={80} y={208} w={x0 - 80} h={8} r={4} tone="blue" elev={0} seed={[84, 212]} order={2} />
      <Surf id="thumb" x={x0 - 14} y={198} w={28} h={28} r={14} tone="white" elev={3} seed={[x0, 212]} order={3} />
      <Surf id="tip" x={x0 - 32} y={150} w={64} h={34} r={10} tone="ink" elev={2} seed={[x0, 196]} at={1.2} />
      <g className="tip-arrow"><Pop id="tri" at={1.55}><path d={`M${x0 - 6} 183.5 L${x0} 190 L${x0 + 6} 183.5 Z`} fill="#0f172a" /></Pop></g>
    </>}>
      <Layer id="h" x={80} y={92} w={240} h={24} at={.75}><Text size={16} weight={600}>Visit radius</Text></Layer>
      <Layer id="s" x={80} y={116} w={330} h={20} at={.82}><Text size={13} color={SUB}>Staff inside this distance get open-shift alerts.</Text></Layer>
      <Layer id="tv" x={x0 - 32} y={150} w={64} h={34} at={1.5} align="center"><Text size={13.5} weight={700} color="#fff" className="tnum">{from} mi</Text></Layer>
      <Layer id="l0" x={80} y={230} w={80} h={20} at={1.0}><Text size={12} weight={500} color={SUB} className="tnum">1 mi</Text></Layer>
      <Layer id="l1" x={320} y={230} w={80} h={20} at={1.05} align="right"><Text size={12} weight={500} color={SUB} className="tnum">25 mi</Text></Layer>
    </Frame>
  );
}
Slider.motion = c => {
  const x0 = VX(5), x1 = VX(12), dx = x1 - x0, ease = 'power2.inOut';
  c.cursor([{ at: 2.05, x: x0 + 2, y: 214, press: true }, { at: 3.2, x: x1 + 2, y: 214 }]);
  c.press('thumb', null, 2.05, .7);
  c.reshape('thumb', rect(x1 - 14, 198, 28, 28, 14), 2.2, 1.0, ease);
  c.reshape('fill', rect(80, 208, x1 - 80, 8, 4), 2.2, 1.0, ease);
  c.reshape('tip', rect(x1 - 32, 150, 64, 34, 10), 2.26, 1.0, ease);
  c.fromTo('[data-layer="tv"]', { x: 0 }, { x: dx, duration: 1.0, ease }, 2.26);
  c.fromTo('.tip-arrow', { x: 0 }, { x: dx, duration: 1.0, ease }, 2.26);
  c.count('[data-layer="tv"] .fc-text', 5, 12, 2.2, 1.0, v => `${Math.round(v)} mi`, ease);
};
Object.assign(Slider, {
  id: 'slider', title: 'Slider', category: 'Inputs', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.12, exit: [240, 180],
  summary: 'Drag a raised thumb along the track. The fill, value tooltip and tabular readout follow with a slight delay.',
  usage: `<Slider from={5} to={12} />`, icons: []
});

// ---------------------------------------------------------------- Date picker (November 2026)
const COL = c => 82 + c * 45 + 22.5, ROW = r => 104 + r * 36 + 18;
const pos = d => { const i = d + 5; return [COL(i % 7), ROW(Math.floor(i / 7))]; };
export function DatePicker({ uid = 'date' }) {
  const [x9, y9] = pos(9), [x3, y3] = pos(3);
  return (
    <Frame uid={uid} w={W} h={H} label="Date range picker, November 2026" svg={<>
      <Surf id="card" x={60} y={18} w={360} h={326} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="today" d={`M${x3} ${y3 - 16} a16 16 0 1 1 -0.01 0`} stroke="#93c5fd" width={1.5} at={1.4} dur={.5} />
      <Surf id="pick" x={x9 - 17} y={y9 - 17} w={34} h={34} r={17} tone="blue" elev={2} seed={[x9, y9]} at={2.42} />
    </>}>
      <Layer id="ci" kind="icon" x={80} y={34} w={30} h={34} at={.75} align="center"><Icon name="calendar" size={22} color={DEEP} id="calendar" /></Layer>
      <Layer id="m" x={116} y={34} w={200} h={34} at={.8}><Text size={16} weight={600}>November 2026</Text></Layer>
      <Layer id="pv" kind="icon" x={330} y={34} w={30} h={34} at={.85} align="center"><Icon name="chevronLeft" size={20} color={SUB} id="prev" /></Layer>
      <Layer id="nx" kind="icon" x={366} y={34} w={30} h={34} at={.9} align="center"><Icon name="chevronRight" size={20} color={SUB} id="next" /></Layer>
      <Layer id="wd" x={82} y={78} w={315} h={20} at={.95}><span className="cal-row">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <Text key={i} size={11.5} weight={600} color={MUTE}>{d}</Text>)}</span></Layer>
      <Layer id="dates" x={60} y={100} w={360} h={224} at={1.05}>
        <span className="cal-dates">{Array.from({ length: 30 }, (_, k) => { const d = k + 1, [x, y] = pos(d); return <Text key={d} size={14} weight={d === 3 ? 700 : 500} className={`tnum d d${d}`} color={(d + 5) % 7 >= 5 ? SUB : INK} style={{ left: x - 60, top: y - 100 }}>{d}</Text>; })}</span>
      </Layer>
    </Frame>
  );
}
DatePicker.motion = c => {
  const [x9, y9] = pos(9), [x13] = pos(13);
  c.cursor([{ at: 2.38, x: x9 + 6, y: y9 + 8, press: true }, { at: 3.46, x: x13 + 6, y: y9 + 8, press: true }]);
  c.reshape('pick', rect(x9 - 17, y9 - 17, x13 - x9 + 34, 34, 17), 3.5, .55, 'back.out(1.15)');
  c.icon('calendar', 0, 7, 2.42, .25);
  const els = Object.fromEntries([9, 10, 11, 12, 13].map(d => [d, c.q(`.d${d}`)]));
  const base = {}; for (const d in els) base[d] = els[d].style.color;
  const E = c.ease('back.out(1.15)');
  c.after(t => {
    const right = x9 + 17 + (x13 - x9) * E(Math.max(0, Math.min(1, (t - 3.5) / .55)));
    for (const d in els) {
      const xd = pos(+d)[0]; const p = t < 3.5 ? (t >= 2.5 && +d === 9 ? 1 : 0) : (right >= xd + 9 ? 1 : 0);
      const on = p && t < c.T.collapse + .1;
      els[d].style.color = on ? '#ffffff' : base[d]; els[d].style.fontWeight = on ? 600 : 500;
    }
  });
};
Object.assign(DatePicker, {
  id: 'date', title: 'Date range picker', category: 'Inputs', w: W, h: H, focus: { x: 210, y: 190 }, push: 1.08, exit: [240, 180],
  summary: 'November 2026 calendar with today marked. The first pick forms a circle; the second stretches it into a range pill.',
  usage: `<DatePicker />`, icons: ['calendar', 'chevronLeft', 'chevronRight']
});
