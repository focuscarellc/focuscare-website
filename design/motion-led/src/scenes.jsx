// Six service scenes plus contact/empty-state frames, authored directly with the pinned
// Focus Care Motion primitives (Frame, Surf, Layer, Icon, Text, Draw, Pop) and geometry.
// Each scene renders two geometries: wide (440 world units) and narrow (252) so text stays
// at its authored size on phones instead of shrinking a film frame. `final` renders the
// readable hold state for static HTML; the motion chunk mounts the initial state and seeks.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Draw, Pop } from '../../vendor/focus-care-motion/studies/component-library/src/primitives.jsx';
import { rect } from '../../vendor/focus-care-motion/studies/component-library/src/geometry.js';

const INK = '#0f172a', BODY = '#475569', SUB = '#526175', DEEP = '#1d4ed8', GREEN = '#15803d', AMBER = '#a16207', RED = '#b91c1c';
export const H = 332, P = 18;
export const widthOf = n => (n ? 252 : 440);
const PILL = { greenTint: GREEN, amberTint: AMBER, redTint: RED, tint: DEEP };

function head(W, n, title, sub, right) {
  return [
    <Layer key="h1" id="h1" x={P} y={16} w={W - 2 * P - 70} h={24} at={.7}><Text size={n ? 14 : 15.5} weight={650}>{title}</Text></Layer>,
    <Layer key="h2" id="h2" x={P} y={40} w={W - 2 * P - 70} h={18} at={.78}><Text size={12} weight={500} color={SUB}>{sub}</Text></Layer>,
    <Layer key="tag" id="tag" x={W - P - 76} y={16} w={76} h={24} at={.74} align="right">{right || <Text size={11} weight={650} color={SUB}>SAMPLE</Text>}</Layer>
  ];
}
const card = W => <Surf key="card" id="card" x={4} y={4} w={W - 8} h={H - 12} r={18} tone="white" elev={3} order={0} />;
const pillG = (W, y, pw) => rect(W - P - pw - 8, y + 8, pw, 24, 12);
const pill = (id, g, tone, at) => <Surf key={id} id={id} x={g.x} y={g.y} w={g.w} h={g.h} r={12} tone={tone} elev={0} seed={[g.x + g.w / 2, g.y + 12]} at={at} />;
const pillText = (id, g, tone, text, at) => <Layer key={id} id={id} x={g.x} y={g.y} w={g.w} h={g.h} at={at} align="center"><Text size={12} weight={650} color={PILL[tone]}>{text}</Text></Layer>;
const row = (id, W, y, h = 40, order) => <Surf key={id} id={id} x={P} y={y} w={W - 2 * P} h={h} r={10} tone="white" elev={1} order={order} />;

// ---------------------------------------------------------------- Recruitment
const STAGES = ['New', 'Screen', 'Interview', 'Offer'];
export const selG = (n, i) => { const widths=n?[36,54,66,52]:[99,99,99,99]; return rect(P+4+widths.slice(0,i).reduce((a,b)=>a+b,0),74,widths[i],32,9); };
export function Recruitment({ n, final, uid }) {
  const W = widthOf(n), cur = final ? 2 : 1, s = selG(n, cur), sw = (W - 2 * P - 8) / 4;
  const fields = [['Owner', 'R. Diaz'], ['Interview', final ? '14 Nov, 10:00' : 'Not scheduled'], ['Next action', final ? 'Check references' : 'Review notes']];
  return (
    <Frame uid={uid} w={W} h={H} label={`Illustrative recruitment record: candidate Maya R. ${final ? 'moved to the interview stage, interview 14 November, next action check references' : 'at the screen stage'}`} svg={<>
      {card(W)}
      <Surf id="track" x={P} y={70} w={W - 2 * P} h={40} r={12} tone="muted" elev={0} order={1} />
      <Surf id="sel" x={s.x} y={s.y} w={s.w} h={s.h} r={9} tone="blue" elev={2} order={2} />
      {fields.map((f, i) => row('row' + i, W, 126 + i * 46, 40, 3 + i))}
      <Surf id="btn" x={P} y={272} w={W - 2 * P} h={40} r={11} tone="blue" elev={2} order={6} />
    </>}>
      {head(W, n, n ? 'Maya R.' : 'Maya R. · Applicant', 'Support worker role')}
      {STAGES.map((st, i) => <Layer key={st} id={'st' + i} x={selG(n,i).x} y={74} w={selG(n,i).w} h={32} at={.9 + i * .05} align="center"><Text size={n ? 12 : 13} weight={600} color={i === cur ? '#fff' : BODY}>{st}</Text></Layer>)}
      {fields.flatMap((f, i) => [
        <Layer key={'l' + i} id={'lab' + i} x={P + 12} y={126 + i * 46} w={92} h={40} at={1.1 + i * .06}><Text size={12} weight={500} color={SUB}>{f[0]}</Text></Layer>,
        <Layer key={'v' + i} id={'val' + i} x={P + (n ? 84 : 104)} y={126 + i * 46} w={W - 2 * P - (n ? 96 : 116)} h={40} at={1.14 + i * .06} align="right"><Text size={13} weight={600} className="tnum">{f[1]}</Text></Layer>
      ])}
      <Layer id="btnl" x={P} y={272} w={W - 2 * P} h={40} at={1.3} align="center" className="gap8"><Icon name="checkmark" size={20} color="#fff" id="chk" /><Text size={14} weight={600} color="#fff">{final?'Moved to interview':'Move to interview'}</Text></Layer>
    </Frame>
  );
}
const recruitmentMotion = n => c => {
  const { T } = c, W = widthOf(n);
  c.cursor([{ at: T.click, x: W / 2 + 46, y: 292, press: true }]);
  c.press('btn', '[data-layer="btnl"]', T.click, 1);
  c.swap(c.q('[data-layer="btnl"] .fc-text'), ['Move to interview','Moved to interview'], [T.result+.4]);
  c.reshape('sel', selG(n, 2), T.result, .55, 'power3.inOut');
  c.fromTo(c.qa('[data-layer="st1"] .fc-text'), { color: '#ffffff' }, { color: BODY, duration: .3, ease: 'none' }, T.result + .08);
  c.fromTo(c.qa('[data-layer="st2"] .fc-text'), { color: BODY }, { color: '#ffffff', duration: .3, ease: 'none' }, T.result + .22);
  c.icon('chk', 0, 44, 3.05, .7);
  c.swap(c.q('[data-layer="val1"] .fc-text'), ['Not scheduled', '14 Nov, 10:00'], [T.result + .4]);
  c.swap(c.q('[data-layer="val2"] .fc-text'), ['Review notes', 'Check references'], [T.result + .55]);
  for (const [k, at] of [['val1', T.result + .4], ['val2', T.result + .55]]) c.fromTo(c.qa(`[data-layer="${k}"] .fc-carrier`), { y: 10 }, { y: 0, duration: .5, ease: 'back.out(1.7)' }, at);
};

// ---------------------------------------------------------------- Training
const arc = (cx, cy, r, a, b) => { const p = f => [cx + r * Math.sin(f * 2 * Math.PI), cy - r * Math.cos(f * 2 * Math.PI)].map(v => v.toFixed(2)); const [x0, y0] = p(a), [x1, y1] = p(b); return `M${x0},${y0} A${r},${r} 0 ${b - a > .5 ? 1 : 0} 1 ${x1},${y1}`; };
export function Training({ n, final, uid }) {
  const W = widthOf(n), cx = P + 40, cy = 112, r = 30;
  const rows = [[n?'First aid':'First-aid certificate','greenTint','Received',78],[n?'Medication':'Medication certificate','greenTint','Received',78],[n?'Role training':'Role training certificate','redTint','Missing',66],[n?'Safeguarding':'Safeguarding certificate','redTint','Missing',66]];
  const ys = [154,194,242,282], hs = [32,40,32,32];
  const pg = (i,pw) => rect(W-P-pw-8, ys[i]+(hs[i]-24)/2, pw,24,12);
  return (
    <Frame uid={uid} w={W} h={H} label={`Illustrative training record for J. Okafor: ${final ? '3 of 4' : '2 of 4'} files received, medication certificate on file, renewal due 22 November; safeguarding file missing, role training certificate ${final ? 'added for review' : 'missing'}`} svg={<>
      {card(W)}
      <Draw id="ring-track" d={`M${cx},${cy - r} a${r},${r} 0 1 1 -0.01,0`} stroke="#e2e8f0" width={8} at={.6} dur={.6} />
      <Draw id="ring-a" d={arc(cx, cy, r, 0, .5)} stroke="#2d7dff" width={8} at={1.0} dur={.7} />
      <Draw id="ring-b" d={arc(cx, cy, r, .5, .75)} stroke="#2d7dff" width={8} at={final ? .1 : 3.0} dur={.5} opacity={final ? 1 : undefined} />
      {rows.map((x, i) => row('row' + i, W, ys[i], hs[i], 1 + i))}
      {rows.map((x, i) => pill('p' + i, pg(i, x[3]), x[1], 1.2 + i * .08))}
      {pill('p2b', pg(2,n?112:122), 'tint', 2.75)}
    </>}>
      {head(W, n, n ? 'J. Okafor' : 'J. Okafor · Training', '4 required files')}
      <Layer id="ringn" x={cx - 28} y={cy - 12} w={56} h={24} at={1.05} align="center"><Text size={15} weight={650} className="tnum">{final ? '3/4' : '2/4'}</Text></Layer>
      <Layer id="sum1" x={cx + 50} y={92} w={W - cx - 50 - P} h={22} at={1.1}><Text size={n ? 14 : 15} weight={650} className="tnum">{final ? '3 of 4 received' : '2 of 4 received'}</Text></Layer>
      <Layer id="sum2" x={cx + 50} y={114} w={W - cx - 50 - P} h={20} at={1.16}><Text size={12} weight={500} color={SUB}>{final?'1 awaiting review':'1 renewal due'}</Text></Layer>
      {rows.flatMap((x, i) => [
        <Layer key={'l' + i} id={'lab' + i} x={P + 12} y={ys[i]} w={n&&i===2?82:W - 2 * P - 120} h={hs[i]} at={1.2 + i * .06} className={i===1?"stack":""}><Text size={13} weight={550}>{x[0]}</Text>{i===1&&<Text size={12} weight={550} color={AMBER}>Renewal 22 Nov</Text>}</Layer>,
        (i !== 2 || !final) && pillText('pt' + i, pg(i, x[3]), x[1], x[2], 1.3 + i * .06)
      ])}
      {pillText('pt2b', pg(2,n?112:122), 'tint', 'Awaiting review', 2.9)}
    </Frame>
  );
}
const trainingMotion = n => c => {
  const { T } = c, W = widthOf(n), g = rect(W-P-66-8,246,66,24,12);
  c.cursor([{ at: T.click, x: g.x + 40, y: g.y + 12, press: true }]);
  c.press('p2', null, T.click, 1);
  c.hide('pt2', T.release);
  c.count(c.q('[data-layer="ringn"] .fc-text'), 2, 3, 3.0, .5, v => `${Math.round(v)}/4`);
  c.swap(c.q('[data-layer="sum1"] .fc-text'), ['2 of 4 received', '3 of 4 received'], [3.2]);
  c.swap(c.q('[data-layer="sum2"] .fc-text'), ['1 renewal due','1 awaiting review'], [3.2]);
};

// ---------------------------------------------------------------- Payroll
export function Payroll({ n, final, uid }) {
  const W = widthOf(n), rows = [['A. Brooks', '38.5 h', 'greenTint', 'Reviewed', 78], ['D. Kim', '31.0 h', final ? 'greenTint' : 'amberTint', final ? 'Corrected' : 'Missing clock-out', 112], ['S. Ortiz', '36.0 h', 'amberTint', 'Late in', 66]];
  const typed = n ? '6 Nov out 17:30' : '6 Nov clock-out 17:30';
  return (
    <Frame uid={uid} w={W} h={H} label={`Illustrative payroll period sheet, 1 to 15 November: ${final ? '1 open correction; D. Kim clock-out corrected for staff review' : '2 open corrections'}`} svg={<>
      {card(W)}
      {rows.map((x, i) => row('row' + i, W, 70 + i * 46, 40, 1 + i))}
      {rows.map((x, i) => pill('p' + i, pillG(W, 70 + i * 46, x[4]), i === 1 ? 'amberTint' : x[2], 1.2 + i * .08))}
      {pill('p1b', pillG(W, 116, 112), 'greenTint', 3.55)}
      <Surf id="input" x={P} y={222} w={W - 2 * P} h={40} r={10} tone="white" elev={1} order={5} />
      <Draw id="focus" d={`M${P + 10},${261} H${W - P - 10}`} stroke="#2d7dff" width={2} at={1.75} dur={.4} />
      <Surf id="btn" x={P} y={272} w={W - 2 * P} h={40} r={11} tone="blue" elev={2} order={6} />
    </>}>
      {head(W, n, n ? '1 to 15 Nov' : 'Pay period 1 to 15 Nov', n ? '3 staff' : '3 staff · time records', <span className="stack" style={{ alignItems: 'flex-end' }}><Text size={18} weight={650} color={DEEP} className="tnum">{final ? '1' : '2'}</Text></span>)}
      <Layer id="cnt" x={W - P - (n ? 70 : 120)} y={40} w={n ? 70 : 120} h={18} at={.8} align="right"><Text size={12} weight={500} color={SUB}>{n ? 'open' : 'open corrections'}</Text></Layer>
      {rows.flatMap((x, i) => [
        <Layer key={'l' + i} id={'lab' + i} x={P + 12} y={70 + i * 46} w={n?82:170} h={40} at={1.1 + i * .06} className={n?"stack":"gap8"}><Text size={13} weight={600}>{x[0]}</Text><Text size={12} weight={500} color={SUB} className="tnum">{x[1]}</Text></Layer>,
        (i !== 1 || !final) && pillText('pt' + i, pillG(W, 70 + i * 46, x[4]), i === 1 ? 'amberTint' : x[2], i === 1 ? 'Missing clock-out' : x[3], 1.3 + i * .06)
      ])}
      {pillText('pt1b', pillG(W, 116, 112), 'greenTint', 'Corrected', 3.65)}
      <Layer id="ilab" x={P} y={204} w={W - 2 * P} h={16} at={1.4}><Text size={12} weight={600} color={SUB}>Time correction for D. Kim</Text></Layer>
      {!final && <Layer id="ph" x={P + 12} y={222} w={W - 2 * P - 24} h={40} at={1.45}><Text size={13} weight={500} color={SUB}>Add date and time</Text></Layer>}
      <Layer id="typed" x={P + 12} y={222} w={W - 2 * P - 24} h={40} at={1.5}><Text size={13} weight={600} className="tnum typed">{final ? typed : ''}</Text></Layer>
      <Layer id="btnl" x={P} y={272} w={W - 2 * P} h={40} at={1.5} align="center" className="gap8"><Icon name="clock" size={18} color="#fff" id="clk" /><Text size={14} weight={600} color="#fff">{final ? (n?'Saved for review':'Correction saved for review') : 'Save correction'}</Text></Layer>
    </Frame>
  );
}
const payrollMotion = n => c => {
  const W = widthOf(n), typed = n ? '6 Nov out 17:30' : '6 Nov clock-out 17:30';
  c.cursor([{ at: 1.7, x: P + 60, y: 242, press: true }, { at: 3.3, x: W / 2 + 40, y: 292, press: true }]);
  c.hide('ph', 1.78, .2);
  c.typing(c.q('[data-layer="typed"] .fc-text'), typed, 1.95, 16);
  c.press('btn', '[data-layer="btnl"]', 3.3, 1);
  c.icon('clk', 0, 40, 3.2, .8);
  c.swap(c.q('[data-layer="btnl"] .fc-text'), ['Save correction', n?'Saved for review':'Correction saved for review'], [3.5]);
  c.hide('pt1', 3.42, .2);
  c.count(c.q('[data-layer="tag"] .fc-text'), 2, 1, 3.6, .4);
};

// ---------------------------------------------------------------- Operations
export function Operations({ n, final, uid }) {
  const W = widthOf(n), lx = P + 16, rows = [['08:00', 'Med A, 1 tablet', 'greenTint', 'Given · LM'], ['12:00', 'Med B, 1 capsule', 'greenTint', 'Given · LM'], ['18:00', 'Med A, 1 tablet', final ? 'greenTint' : 'tint', final ? 'Given · TR' : 'Due']];
  const pw = 86, note = n ? 'Taken with dinner' : 'Taken with dinner, no concerns';
  return (
    <Frame uid={uid} w={W} h={H} label={`Illustrative daily medication log, 12 November: ${final ? 'all three scheduled entries recorded by staff, ready for shift lead review' : 'evening entry due'}`} svg={<>
      {card(W)}
      <Draw id="spine" d={`M${lx},${86} V${200}`} stroke="#dbe2ea" width={2} at={.9} dur={.6} />
      {rows.map((x, i) => <Pop key={i} id={'dot' + i} at={1.1 + i * .1}><circle cx={lx} cy={90 + i * 52} r={5} fill={x[2] === 'greenTint' && (i < 2 || final) ? '#16a34a' : '#2d7dff'} /></Pop>)}
      {rows.map((x, i) => <Surf key={'r' + i} id={'row' + i} x={lx + 16} y={70 + i * 52} w={W - lx - 16 - P} h={42} r={10} tone="white" elev={1} order={1 + i} />)}
      {rows.map((x, i) => pill('p' + i, pillG(W, 71 + i * 52, pw), i === 2 ? 'tint' : x[2], 1.25 + i * .08))}
      {pill('p2b', pillG(W, 175, pw), 'greenTint', 2.7)}
      <Surf id="note" x={P} y={232} w={W - 2 * P} h={40} r={10} tone="muted" elev={0} order={5} />
    </>}>
      {head(W, n, n ? 'Med log · 12 Nov' : 'Daily medication log · 12 Nov', n?'Sample resident':'Sample resident · day shift')}
      {rows.flatMap((x, i) => [
        <Layer key={'t' + i} id={'time' + i} x={lx + 28} y={70 + i * 52} w={50} h={n?20:42} at={1.15 + i * .06}><Text size={12.5} weight={650} className="tnum">{x[0]}</Text></Layer>,
        <Layer key={'m' + i} id={'med' + i} x={n?lx+28:lx+76} y={(n?90:70) + i * 52} w={n?70:W-lx-76-P-pw-14} h={n?20:42} at={1.2 + i * .06}><Text size={12.5} weight={500} color={BODY}>{n ? x[1].split(',')[0] : x[1]}</Text></Layer>,
        (i < 2 || !final) && pillText('pt' + i, pillG(W, 71 + i * 52, pw), i === 2 ? 'tint' : x[2], i === 2 ? 'Due' : x[3], 1.3 + i * .06)
      ])}
      {pillText('pt2b', pillG(W, 175, pw), 'greenTint', 'Given · TR', 2.85)}
      <Layer id="nlab" x={P} y={214} w={W - 2 * P} h={16} at={1.4}><Text size={12} weight={600} color={SUB}>Staff note, 18:00 entry</Text></Layer>
      <Layer id="typed" x={P + 12} y={232} w={W - 2 * P - 24} h={40} at={1.45} className="gap8"><Icon name="edit" size={16} color={DEEP} id="pen" /><Text size={13} weight={550} className="typed">{final ? note : ''}</Text></Layer>
      <Layer id="rev" x={P} y={282} w={W - 2 * P} h={30} at={1.5} className="gap8"><Icon name="checkCircle" size={18} color={final ? GREEN : SUB} id="ok" /><Text size={12.5} weight={600} color={final ? GREEN : SUB}>{final ? 'Ready for shift lead review' : 'Shift lead review after 18:00'}</Text></Layer>
    </Frame>
  );
}
const operationsMotion = n => c => {
  const { T } = c, W = widthOf(n), g = pillG(W, 175, 86), note = n ? 'Taken with dinner' : 'Taken with dinner, no concerns';
  c.cursor([{ at: T.click, x: g.x + 40, y: g.y + 12, press: true }]);
  c.press('p2', null, T.click, 1);
  c.hide('pt2', T.release);
  c.fromTo(c.qa('[data-pop="dot2"] circle'), { fill: '#2d7dff' }, { fill: '#16a34a', duration: .3, ease: 'none' }, 2.75);
  c.icon('pen', 0, 30, 2.95, .6);
  c.typing(c.q('[data-layer="typed"] .typed'), note, 3.0, 22);
  c.swap(c.q('[data-layer="rev"] .fc-text'), ['Shift lead review after 18:00', 'Ready for shift lead review'], [4.45]);
  c.fromTo(c.qa('[data-layer="rev"] .fc-text, [data-layer="rev"] .fc-ua'), { color: SUB }, { color: GREEN, duration: .3, ease: 'none' }, 4.45);
  c.icon('ok', 0, 50, 4.45, .7);
};

// ---------------------------------------------------------------- Billing
export function Billing({ n, final, uid }) {
  const W = widthOf(n), rows = [['F-1041', '$286.00'], ['F-1042', '$412.50'], ['F-1043', '$198.75']];
  const r2h = final ? 88 : 40, r3y = final ? 210 : 162, typed = 'Auth no. PA-58210';
  return (
    <Frame uid={uid} w={W} h={H} label={`Illustrative claim review, week of 11 November: ${final ? 'claim F-1042 corrected with authorization number, 0 exceptions open' : 'claim F-1042 missing authorization number, 1 exception open'}`} svg={<>
      {card(W)}
      {row('row0', W, 70, 40, 1)}
      <Surf id="row1" x={P} y={116} w={W - 2 * P} h={r2h} r={10} tone="white" elev={1} order={2} />
      <Surf id="row2" x={P} y={r3y} w={W - 2 * P} h={40} r={10} tone="white" elev={1} order={3} />
      {pill('p0', pillG(W, 70, 66), 'greenTint', 1.2)}
      {pill('p1', pillG(W, 116, 92), 'redTint', 1.28)}
      {pill('p1b', pillG(W, 116, 92), 'greenTint', 3.55)}
      <Surf id="p2" x={pillG(W, 162, 66).x} y={r3y + 8} w={66} h={24} r={12} tone="greenTint" elev={0} at={1.36} />
      <Surf id="field" x={P + 12} y={156} w={W - 2 * P - 24} h={36} r={9} tone="muted" elev={0} at={2.85} />
    </>}>
      {head(W, n, n ? 'Claim review' : 'Claim review · week of 11 Nov', n ? 'Sample claims' : 'Sample claims before submission', <Text size={18} weight={650} color={final ? GREEN : RED} className="tnum">{final ? '0' : '1'}</Text>)}
      <Layer id="cnt" x={W - P - (n ? 70 : 120)} y={40} w={n ? 70 : 120} h={18} at={.8} align="right"><Text size={12} weight={500} color={SUB}>{n ? 'open' : 'open exceptions'}</Text></Layer>
      {rows.map((x, i) => <Layer key={i} id={'lab' + i} data-row={i} x={P + 12} y={i === 2 ? r3y : 70 + i * 46} w={n?98:200} h={40} at={1.1 + i * .06} className={n?"stack":"gap8"}><Text size={13} weight={650} className="tnum">{x[0]}</Text><Text size={12} weight={500} color={SUB} className="tnum">{x[1]}</Text></Layer>)}
      {pillText('pt0', pillG(W, 70, 66), 'greenTint', 'Ready', 1.3)}
      {!final && pillText('pt1', pillG(W, 116, 92), 'redTint', 'Missing auth', 1.36)}
      {pillText('pt1b', pillG(W, 116, 92), 'greenTint', 'Corrected', 3.65)}
      <Layer id="pt2" x={pillG(W, 162, 66).x} y={r3y + 8} w={66} h={24} at={1.42} align="center"><Text size={12} weight={650} color={GREEN}>Ready</Text></Layer>
      <Layer id="typed" x={P + 24} y={156} w={W - 2 * P - 48} h={36} at={3.0}><Text size={13} weight={600} className="tnum typed">{final ? typed : ''}</Text></Layer>
      <Layer id="foot" x={P} y={268} w={W - 2 * P} h={40} at={1.5} className="gap8"><Icon name="checkmark" size={18} color={DEEP} id="foot-i" /><Text size={12.5} weight={600} color={BODY}>{n ? 'Staff authorize submission' : 'Staff verify and authorize submission'}</Text></Layer>
    </Frame>
  );
}
const billingMotion = n => c => {
  const { T } = c, W = widthOf(n), g = pillG(W, 116, 92);
  c.cursor([{ at: T.click, x: g.x + 44, y: g.y + 12, press: true }]);
  c.press('p1', null, T.click, 1);
  c.reshape('row1', rect(P, 116, W - 2 * P, 88, 10), T.release + .08, .55, 'power3.inOut');
  c.reshape('row2', rect(P, 210, W - 2 * P, 40, 10), T.release + .12, .55, 'power3.inOut');
  c.reshape('p2', rect(g.x + 26, 218, 66, 24, 12), T.release + .14, .55, 'power3.inOut');
  c.fromTo(c.qa('[data-layer="lab2"], [data-layer="pt2"]'), { y: 0 }, { y: 48, duration: .55, ease: 'power3.inOut' }, T.release + .14);
  c.typing(c.q('[data-layer="typed"] .typed'), 'Auth no. PA-58210', 3.05, 22);
  c.hide('pt1', 3.45, .2);
  c.count(c.q('[data-layer="tag"] .fc-text'), 1, 0, 3.7, .3);
  c.fromTo(c.qa('[data-layer="tag"] .fc-text'), { color: RED }, { color: GREEN, duration: .3, ease: 'none' }, 3.7);
};

// ---------------------------------------------------------------- Compliance
export function Compliance({ n, final, uid }) {
  const W = widthOf(n), rows = [[n ? "Driver's license" : "Driver's license", 'greenTint', 'On file', 66], ['CPR record', 'amberTint', 'Due 30 Nov', 84], ['TB test result', 'redTint', 'Missing', 66]];
  const b = final ? rect(P, 212, W - 2 * P, 100, 12) : rect(P, 212, W - 2 * P, 40, 11);
  return (
    <Frame uid={uid} w={W} h={H} label={`Illustrative staff record for A. Patel: license on file, CPR certification due 30 November, TB test result missing${final ? '; follow-up assigned to K. Lin, HR, due 18 November' : ''}`} svg={<>
      {card(W)}
      {rows.map((x, i) => row('row' + i, W, 64 + i * 46, 40, 1 + i))}
      {rows.map((x, i) => pill('p' + i, pillG(W, 64 + i * 46, x[3]), x[1], 1.2 + i * .08))}
      <Surf id="btn" x={b.x} y={b.y} w={b.w} h={b.h} r={b.r} tone={final ? 'tint' : 'white'} elev={2} order={5} />
      <Surf id="fu" x={P} y={212} w={W - 2 * P} h={100} r={12} tone="tint" elev={0} at={2.75} edge={false} />
    </>}>
      {head(W, n, n ? 'A. Patel' : 'A. Patel · Staff record', 'Licensing records', <Text size={12} weight={650} color={AMBER}>2 open</Text>)}
      {rows.flatMap((x, i) => [
        <Layer key={'l' + i} id={'lab' + i} x={P + 12} y={64 + i * 46} w={W - 2 * P - 120} h={40} at={1.1 + i * .06}><Text size={13} weight={550}>{x[0]}</Text></Layer>,
        pillText('pt' + i, pillG(W, 64 + i * 46, x[3]), x[1], x[2], 1.3 + i * .06)
      ])}
      {!final && <Layer id="btnl" x={P} y={212} w={W - 2 * P} h={40} at={1.5} align="center" className="gap8"><Icon name="plusToX" size={18} color={DEEP} id="plus" /><Text size={14} weight={600} color={DEEP}>Add follow-up</Text></Layer>}
      <Layer id="fu1" x={P + 16} y={224} w={W - 2 * P - 32} h={22} at={3.0} className="gap8"><Icon name="calendar" size={18} color={DEEP} id="cal" /><Text size={13.5} weight={650}>{n?'TB test follow-up':'Follow-up: TB test result'}</Text></Layer>
      <Layer id="fu2" x={P + 16} y={252} w={W - 2 * P - 32} h={20} at={3.12}><Text size={12.5} weight={500} color={BODY}>Owner: K. Lin, HR</Text></Layer>
      <Layer id="fu3" x={P + 16} y={276} w={W - 2 * P - 32} h={20} at={3.24}><Text size={12.5} weight={600} color={DEEP} className="tnum">Due 18 Nov</Text></Layer>
    </Frame>
  );
}
const complianceMotion = n => c => {
  const { T } = c, W = widthOf(n);
  c.cursor([{ at: T.click, x: W / 2 + 30, y: 232, press: true }]);
  c.icon('plus', 0, 20, T.click - .2, .4);
  c.press('btn', '[data-layer="btnl"]', T.click, 1);
  c.hide('btnl', T.release + .04);
  c.reshape('btn', rect(P, 212, W - 2 * P, 100, 12), T.release + .1, .6, 'back.out(1.2)');
  c.icon('cal', 0, 40, 3.05, .8);
};

// ---------------------------------------------------------------- Contact draft feedback
export const DH = 188;
export function Draft({ n, uid }) {
  const W = n ? 252 : 380;
  return (
    <Frame uid={uid} w={W} h={DH} label="Email draft prepared on this page, not sent" svg={<>
      <Surf id="card" x={4} y={4} w={W - 8} h={DH - 12} r={16} tone="white" elev={3} order={0} />
      <Surf id="badge" x={P} y={20} w={40} h={40} r={12} tone="tint" elev={0} at={.4} />
      <Surf id="line1" x={P} y={76} w={W - 2 * P} h={34} r={9} tone="muted" elev={0} order={2} />
      <Surf id="line2" x={P} y={116} w={W - 2 * P} h={34} r={9} tone="muted" elev={0} order={3} />
    </>}>
      <Layer id="ic" kind="icon" x={P} y={20} w={40} h={40} at={.6} align="center"><Icon name="mail" size={22} color={DEEP} id="mail" /></Layer>
      <Layer id="t1" x={P + 52} y={20} w={W - 2 * P - 52} h={22} at={.7}><Text size={14} weight={650}>Draft ready to review</Text></Layer>
      <Layer id="t2" x={P + 52} y={42} w={W - 2 * P - 52} h={18} at={.78}><Text size={12} weight={500} color={SUB}>Not sent yet</Text></Layer>
      <Layer id="to" x={P + 12} y={76} w={W - 2 * P - 24} h={34} at={.9}><Text size={12.5} weight={550} color={BODY}>To: info@focuscarellc.com</Text></Layer>
      <Layer id="sub" x={P + 12} y={116} w={W - 2 * P - 24} h={34} at={1.0}><Text size={12.5} weight={550} color={BODY} className="draft-subject">Subject: Focus Care workflow</Text></Layer>
    </Frame>
  );
}
const draftMotion = () => c => { c.icon('mail', 0, 40, .9, .9); };

// ---------------------------------------------------------------- Resource empty state (static frame)
export function Empty({ uid }) {
  const W = 252, h = 132;
  return (
    <Frame uid={uid} w={W} h={h} label="No matching articles" svg={<>
      <Surf id="a" x={30} y={14} w={W - 60} h={34} r={10} tone="white" elev={2} />
      <Surf id="b" x={44} y={58} w={W - 88} h={26} r={8} tone="muted" elev={0} />
      <Surf id="c" x={58} y={92} w={W - 116} h={22} r={8} tone="muted" elev={0} />
    </>}>
      <Layer id="q" x={72} y={14} w={W - 110} h={34}><Text size={12.5} weight={550} color={SUB}>No matches yet</Text></Layer>
    </Frame>
  );
}

// ---------------------------------------------------------------- registry used by build + chunk
export const SCENES = [
  { id: 'recruitment', Component: Recruitment, motion: recruitmentMotion, duration: 4.9, icons: ['checkmark'] },
  { id: 'training', Component: Training, motion: trainingMotion, duration: 4.6, icons: [] },
  { id: 'payroll', Component: Payroll, motion: payrollMotion, duration: 4.9, icons: ['clock'] },
  { id: 'operations', Component: Operations, motion: operationsMotion, duration: 5.4, icons: ['edit', 'checkCircle'] },
  { id: 'billing', Component: Billing, motion: billingMotion, duration: 4.9, icons: ['checkmark'] },
  { id: 'compliance', Component: Compliance, motion: complianceMotion, duration: 4.7, icons: ['plusToX', 'calendar'] },
  { id: 'draft', Component: Draft, motion: draftMotion, duration: 2.2, icons: ['mail'], h: DH, width: n => (n ? 252 : 380) }
];
