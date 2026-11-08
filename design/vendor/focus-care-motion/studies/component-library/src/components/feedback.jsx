import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8';

// ---------------------------------------------------------------- Toast notification
export function Toast({ uid = 'toast', title = 'Shift note saved', body = 'Synced to the Maple House care record' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Toast notification" svg={<>
      <Surf id="note" x={70} y={226} w={340} h={80} r={18} tone="white" elev={2} seed={[240, 266]} />
      <Surf id="nb" x={88} y={246} w={40} h={40} r={12} tone="tint" elev={0} seed={[108, 266]} order={1} />
      <Surf id="save" x={170} y={156} w={140} h={48} r={14} tone="blue" elev={3} seed={[240, 180]} order={2} />
      <Surf id="toast" x={186} y={60} w={108} h={36} r={18} tone="ink" elev={3} seed={[240, 152]} at={1.72} />
      <Surf id="bell" x={78} y={58} w={40} h={40} r={20} tone="blue" elev={0} seed={[98, 78]} at={3.0} />
      <Draw id="count" d="M88 113.5 H392" stroke="rgba(255,255,255,.28)" width={2} at={3.25} dur={.3} />
    </>}>
      <Layer id="ni" kind="icon" x={88} y={246} w={40} h={40} at={.8} align="center"><Icon name="fileText" size={20} color={DEEP} id="file" /></Layer>
      <Layer id="nt" x={140} y={238} w={260} h={56} at={.85}><span className="stack"><Text size={14} weight={600}>Morning routine</Text><Text size={13} color={SUB}>Avery took morning meds at 8:05 AM.</Text></span></Layer>
      <Layer id="sv" x={170} y={156} w={140} h={48} at={1.0} align="center"><Text size={15} weight={600} color="#fff">Save note</Text></Layer>
      <Layer id="bi" kind="icon" x={78} y={58} w={40} h={40} at={3.08} align="center"><Icon name="notification" size={20} color="#fff" id="bell" /></Layer>
      <Layer id="tt" x={130} y={56} w={220} h={56} at={3.12}><span className="stack"><Text size={15} weight={600} color="#fff">{title}</Text><Text size={12.5} color="#cbd5e1">{body}</Text></span></Layer>
      <Layer id="un" x={350} y={56} w={56} h={56} at={3.2} align="right"><Text size={13} weight={600} color="#93c5fd">Undo</Text></Layer>
    </Frame>
  );
}
Toast.motion = c => {
  c.cursor([{ at: 1.6, x: 262, y: 186, press: true }]);
  c.press('save', '[data-layer="sv"]', 1.6, 1.1);
  c.reshape('toast', rect(60, 40, 360, 84, 22), 2.8, .55, 'back.out(1.25)');
  c.icon('bell', 0, 7, 3.2, .22); c.icon('bell', 7, 0, 3.42, .25);
  c.draw('[data-draw="count"]', '0% 100%', '100% 100%', 3.6, 1.9, 'none');
};
Object.assign(Toast, {
  id: 'toast', title: 'Toast notification', category: 'Feedback', w: W, h: H, focus: { x: 240, y: 170 }, push: 1.06, exit: [240, 82],
  summary: 'Saving grows a compact island out of the button that expands into a toast, rings its native bell and counts down to dismiss.',
  usage: `<Toast title="Shift note saved" body="Synced to the Maple House care record" />`, icons: ['notification', 'fileText']
});

// ---------------------------------------------------------------- Progress ring
const ARC = 'M240 100 A60 60 0 1 1 239.99 100';
export function ProgressRing({ uid = 'ring', from = 72, to = 86 }) {
  return (
    <Frame uid={uid} w={W} h={H} label={`Survey readiness ${to} percent`} svg={<>
      <Surf id="card" x={80} y={20} w={320} h={320} r={24} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="track" d={ARC} stroke="#e8edf3" width={12} at={.75} dur={.6} />
      <path className="arc" d={ARC} fill="none" stroke="#2d7dff" strokeWidth="12" strokeLinecap="round" />
      <Surf id="ok" x={104} y={236} w={128} h={30} r={15} tone="greenTint" elev={0} seed={[120, 251]} at={1.2} />
      <Surf id="due" x={242} y={236} w={134} h={30} r={15} tone="amberTint" elev={0} seed={[258, 251]} at={1.28} />
      <Surf id="run" x={160} y={282} w={160} h={42} r={13} tone="white" elev={2} seed={[240, 303]} order={1} />
    </>}>
      <Layer id="t" x={104} y={36} w={260} h={22} at={.7}><Text size={15} weight={600}>Survey readiness</Text></Layer>
      <Layer id="s" x={104} y={56} w={260} h={20} at={.76}><Text size={12.5} color={SUB}>Maple House · Q4 audit</Text></Layer>
      <Layer id="n" x={180} y={138} w={120} h={38} at={1.0} align="center"><Text size={30} weight={700} className="tnum" style={{ letterSpacing: '-.03em' }}>0%</Text></Layer>
      <Layer id="c" x={180} y={174} w={120} h={18} at={1.05} align="center"><Text size={12} weight={500} color={SUB}>ready</Text></Layer>
      <Layer id="okt" x={104} y={236} w={128} h={30} at={1.4} align="center"><Text size={12} weight={600} color="#15803d">18 complete</Text></Layer>
      <Layer id="duet" x={242} y={236} w={134} h={30} at={1.45} align="center"><Text size={12} weight={600} color="#a16207" className="tnum">3 due this week</Text></Layer>
      <Layer id="rt" x={160} y={282} w={160} h={42} at={1.1} align="center" className="gap8"><Icon name="refreshCcw" size={18} color={DEEP} id="refresh" /><Text size={14} weight={600}>Run check</Text></Layer>
    </Frame>
  );
}
ProgressRing.motion = c => {
  c.draw('.arc', '0% 0%', '0% 72%', 1.0, 1.0, 'power3.out');
  c.draw('.arc', '0% 72%', '0% 86%', 2.5, .8, 'power3.inOut');
  c.draw('.arc', '0% 86%', '0% 0%', c.T.collapse + .02, .4, 'power2.in');
  const n = c.q('[data-layer="n"] .fc-text'), E1 = c.ease('power3.out'), E2 = c.ease('power3.inOut');
  c.after(t => { const v = t < 2.5 ? 72 * E1(Math.min(1, Math.max(0, (t - 1.0) / 1.0))) : 72 + 14 * E2(Math.min(1, (t - 2.5) / .8)); n.textContent = `${Math.round(v)}%`; });
  c.cursor([{ at: 2.35, x: 262, y: 308, press: true }]);
  c.press('run', '[data-layer="rt"]', 2.35, 1);
  c.icon('refresh', 0, 33, 2.4, .9);
  c.swap('[data-layer="duet"] .fc-text', ['3 due this week', '2 due this week'], [3.2]);
  c.press('due', '[data-layer="duet"]', 3.2, .7);
};
Object.assign(ProgressRing, {
  id: 'ring', title: 'Progress ring', category: 'Feedback', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.08, exit: [240, 180],
  summary: 'Readiness ring drawn with DrawSVG and a tabular counter. Running the check advances the arc and settles the due chip.',
  usage: `<ProgressRing from={72} to={86} />`, icons: ['refreshCcw']
});

// ---------------------------------------------------------------- File upload
const BAR = 'M146 246 H344';
export function Upload({ uid = 'upload', file = 'Ellis care plan.pdf' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="File upload" svg={<>
      <Surf id="card" x={60} y={28} w={360} h={304} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="zone" x={84} y={52} w={312} h={124} r={16} tone="tint" elev={0} seed={[240, 114]} order={1} edge={false} />
      <Pop id="dash" at={.9} ease="power3.out"><path d="M100 52.75 H380 A15.25 15.25 0 0 1 395.25 68 V160 A15.25 15.25 0 0 1 380 175.25 H100 A15.25 15.25 0 0 1 84.75 160 V68 A15.25 15.25 0 0 1 100 52.75 Z" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 6" /></Pop>
      <Surf id="file" x={84} y={194} w={312} h={70} r={14} tone="white" elev={2} seed={[240, 150]} at={2.15} />
      <Surf id="fb" x={98} y={211} w={36} h={36} r={10} tone="tint" elev={0} seed={[116, 229]} at={2.3} />
      <Draw id="ft" d={BAR} stroke="#e2e8f0" width={4} at={2.5} dur={.3} />
      <path className="bar" d={BAR} fill="none" stroke="#2d7dff" strokeWidth="4" strokeLinecap="round" />
    </>}>
      <Layer id="ui" kind="icon" x={220} y={66} w={40} h={40} at={.95} align="center"><Icon name="uploadCloud" size={34} color={DEEP} id="cloud" /></Layer>
      <Layer id="ut" x={84} y={110} w={312} h={22} at={1.0} align="center"><Text size={14.5} weight={600}>Drop care plans here</Text></Layer>
      <Layer id="us" x={84} y={132} w={312} h={20} at={1.05} align="center"><Text size={12.5} color={SUB}>PDF or DOCX up to 20 MB · <b className="link">Browse</b></Text></Layer>
      <Layer id="fi" kind="icon" x={98} y={211} w={36} h={36} at={2.4} align="center"><Icon name="fileText" size={20} color={DEEP} id="file" /></Layer>
      <Layer id="fn" x={146} y={202} w={210} h={22} at={2.42}><Text size={14} weight={600}>{file}</Text></Layer>
      <Layer id="fm" x={146} y={222} w={210} h={18} at={2.46}><Text size={12} color={SUB} className="tnum">2.4 MB · Uploading 0%</Text></Layer>
      <Layer id="ok" kind="icon" x={350} y={212} w={34} h={34} at={3.55} align="center"><Icon name="checkCircle" size={26} color="#16a34a" id="ok" /></Layer>
      <Layer id="foot" x={84} y={284} w={312} h={20} at={1.15} align="center"><Text size={12} color={SUB}>Files are encrypted and stored with the resident record.</Text></Layer>
    </Frame>
  );
}
Upload.motion = c => {
  c.cursor([{ at: 1.95, x: 306, y: 146, press: true }]);
  c.press('zone', '[data-layer="us"]', 1.95, .5);
  c.icon('cloud', 0, 39, 2.0, 1.3);
  c.draw('.bar', '0% 0%', '0% 100%', 2.62, .95, 'power1.inOut');
  c.draw('.bar', '0% 100%', '100% 100%', c.T.collapse + .05, .4, 'power2.in');
  const m = c.q('[data-layer="fm"] .fc-text'), E = c.ease('power1.inOut');
  c.after(t => { const p = Math.min(1, Math.max(0, (t - 2.62) / .95)); m.textContent = p < 1 ? `2.4 MB · Uploading ${Math.round(100 * E(p))}%` : '2.4 MB · Uploaded just now'; });
  c.icon('ok', 8, 39, 3.6, .6);
};
Object.assign(Upload, {
  id: 'upload', title: 'File upload', category: 'Feedback', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.08, exit: [240, 180],
  summary: 'Dashed drop zone with a native upload icon. The file row drops out of the zone, progress draws on and a native check confirms.',
  usage: `<Upload file="Ellis care plan.pdf" />`, icons: ['uploadCloud', 'fileText', 'checkCircle']
});

// ---------------------------------------------------------------- Confirm dialog
export function Dialog({ uid = 'dialog' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Discard note confirmation" svg={<>
      <Surf id="trig" x={170} y={290} w={140} h={44} r={13} tone="white" elev={2} seed={[240, 312]} />
      <Surf id="dlg" x={70} y={34} w={340} h={224} r={22} tone="white" elev={4} seed={[240, 290]} at={1.9} />
      <Surf id="badge" x={94} y={58} w={44} h={44} r={14} tone="redTint" elev={0} seed={[116, 80]} at={2.2} />
      <Surf id="keep" x={94} y={198} w={140} h={42} r={12} tone="white" elev={1} seed={[164, 219]} at={2.32} />
      <Surf id="del" x={246} y={198} w={140} h={42} r={12} tone="red" elev={2} seed={[316, 219]} at={2.38} />
    </>}>
      <Layer id="tg" x={170} y={290} w={140} h={44} at={.8} align="center" className="gap8"><Icon name="trash2" size={18} color="#b91c1c" id="trash" /><Text size={14} weight={600} color="#b91c1c">Discard note</Text></Layer>
      <Layer id="ai" kind="icon" x={94} y={58} w={44} h={44} at={2.4} align="center"><Icon name="alertCircle" size={24} color="#dc2626" id="alert" /></Layer>
      <Layer id="dt" x={94} y={112} w={300} h={26} at={2.42}><Text size={17} weight={600}>Discard this note?</Text></Layer>
      <Layer id="db" x={94} y={138} w={292} h={44} at={2.48}><Text size={13} color={SUB} style={{ whiteSpace: 'normal', lineHeight: 1.45 }}>Your shift note for Maple House has not been saved. This cannot be undone.</Text></Layer>
      <Layer id="kt" x={94} y={198} w={140} h={42} at={2.55} align="center"><Text size={14} weight={600}>Keep editing</Text></Layer>
      <Layer id="xt" x={246} y={198} w={140} h={42} at={2.6} align="center"><Text size={14} weight={600} color="#fff">Discard</Text></Layer>
      <Layer id="done" x={130} y={122} w={220} h={48} at={3.9} align="center" className="gap8"><Icon name="trash2" size={18} color="#fff" id="trash-done" /><Text size={14} weight={600} color="#fff">Note discarded</Text></Layer>
    </Frame>
  );
}
Dialog.motion = c => {
  c.cursor([{ at: 1.75, x: 252, y: 316, press: true }, { at: 3.3, x: 328, y: 224, press: true }]);
  c.press('trig', '[data-layer="tg"]', 1.75, 1);
  c.icon('trash', 0, 4, 1.78, .15);
  c.icon('alert', 0, 44, 2.5, 1.2);
  c.press('del', '[data-layer="xt"]', 3.3, 1);
  ['ai', 'dt', 'db', 'kt', 'xt'].forEach((id, i) => c.hide(id, 3.42 + i * .02, .2));
  ['badge', 'keep', 'del'].forEach((id, i) => c.reshape(id, rect(239, 145, 2, 2, 1), 3.48 + i * .03, .38, 'power3.in'));
  c.reshape('dlg', rect(130, 122, 220, 48, 24), 3.5, .55, 'back.out(1.2)');
  c.fromTo('[data-surf="dlg"] .body', { fill: '#ffffff' }, { fill: '#0f172a', duration: .4 }, 3.55);
  c.icon('trash-done', 0, 4, 3.95, .15);
};
Object.assign(Dialog, {
  id: 'dialog', title: 'Confirm dialog', category: 'Feedback', w: W, h: H, focus: { x: 240, y: 170 }, push: 1.06, exit: [240, 146],
  summary: 'A destructive confirmation that grows out of its trigger, then condenses into a compact confirmation once the choice is made.',
  usage: `<Dialog />  // role="alertdialog"`, icons: ['trash2', 'alertCircle']
});

// ---------------------------------------------------------------- Status badges
const STAFF = [['AK', 'Avery Kim', 'Active', 'greenTint', '#15803d', '#16a34a', 76], ['JP', 'Jordan Price', 'Pending review', 'amberTint', '#a16207', '#f59e0b', 132], ['SR', 'Sam Rivera', 'Training overdue', 'redTint', '#b91c1c', '#ef4444', 140], ['LC', 'Lee Chen', 'Synced', 'tint', DEEP, '#2d7dff', 78]];
const BY = i => 106 + i * 52;
export function StatusBadges({ uid = 'status', staff = STAFF }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Staff compliance status" svg={<>
      <Surf id="card" x={60} y={30} w={360} h={300} r={22} tone="white" elev={3} seed={[240, 180]} />
      {staff.map((s, i) => <Surf key={i} id={`a${i}`} x={84} y={BY(i) + 6} w={34} h={34} r={17} tone="tint" elev={0} seed={[101, BY(i) + 23]} at={1.0 + i * .07} />)}
      {staff.map(([, , , tone, , , w], i) => <Surf key={i} id={`p${i}`} x={396 - w} y={BY(i) + 10} w={w} h={26} r={13} tone={tone} elev={0} seed={[396 - w + 14, BY(i) + 23]} at={1.2 + i * .08} />)}
      <Surf id="ok" x={396 - 96} y={BY(1) + 10} w={96} h={26} r={13} tone="greenTint" elev={0} seed={[396 - 132 + 14, BY(1) + 23]} at={2.48} />
      {staff.map(([, , , , , dot, w], i) => <Pop key={i} id={`d${i}`} at={1.4 + i * .08}><circle className={`dot${i}`} cx={396 - w + 14} cy={BY(i) + 23} r={3.5} fill={dot} /></Pop>)}
      <Pop id="dok" at={2.62}><circle cx={396 - 96 + 14} cy={BY(1) + 23} r={3.5} fill="#16a34a" /></Pop>
      {[1, 2, 3].map(i => <Draw key={i} id={`sep${i}`} d={`M84 ${BY(i) - 3.5} H396`} stroke="#f1f5f9" width={1} at={.9 + i * .05} />)}
    </>}>
      <Layer id="t" x={84} y={46} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Staff compliance</Text></Layer>
      <Layer id="s" x={84} y={68} w={260} h={20} at={.76}><Text size={12.5} color={SUB}>4 staff · updated 2 min ago</Text></Layer>
      {staff.map(([ini, name, label, , color, , w], i) => (
        <React.Fragment key={name}>
          <Layer id={`ai${i}`} x={84} y={BY(i) + 6} w={34} h={34} at={1.1 + i * .07} align="center"><Text size={11.5} weight={700} color={DEEP}>{ini}</Text></Layer>
          <Layer id={`n${i}`} x={130} y={BY(i)} w={150} h={46} at={1.12 + i * .07}><Text size={14} weight={600}>{name}</Text></Layer>
          <Layer id={`l${i}`} x={396 - w + 24} y={BY(i) + 10} w={w - 30} h={26} at={1.35 + i * .08}><Text size={12} weight={600} color={color}>{label}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="appr" x={396 - 96 + 24} y={BY(1) + 10} w={66} h={26} at={2.7}><Text size={12} weight={600} color="#15803d">Approved</Text></Layer>
    </Frame>
  );
}
StatusBadges.motion = c => {
  c.cursor([{ at: 2.35, x: 372, y: BY(1) + 28, press: true }]);
  c.press('p1', '[data-layer="l1"]', 2.35, .8);
  c.hide('l1', 2.45, .2);
  c.reshape('p1', rect(396 - 96, BY(1) + 10, 96, 26, 13), 2.5, .45, 'back.out(1.3)');
  c.fromTo('[data-pop="d1"]', { scale: 1 }, { scale: 0, duration: .2 }, 2.48);
};
Object.assign(StatusBadges, {
  id: 'status', title: 'Status badges', category: 'Feedback', w: W, h: H, focus: { x: 252, y: 160 }, push: 1.06, orbit: .85, exit: [240, 180],
  summary: 'Semantic status pills with dots. Approving a pending review reshapes the pill and grows the success state out of its dot.',
  usage: `<StatusBadges staff={[['AK','Avery Kim','Active','greenTint','#15803d','#16a34a',76], ...]} />`, icons: []
});
