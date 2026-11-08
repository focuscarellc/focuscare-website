// Explainer set: benchmark. See EXPLAINER-BRIEF.md.
// Model comparison visuals: recordings, split runs, prompts, diffs, timers, verdicts and charts.
// Every model, benchmark and company named here is fictional.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect, rr } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', MUTE = '#94a3b8', BLUE = '#2d7dff', CYAN = '#0ea5e9';
const GREEN = '#16a34a', GREEN_D = '#15803d', RED = '#ef4444', RED_D = '#b91c1c', AMBER_D = '#a16207';
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const pill = (bg, fg) => ({ background: bg, color: fg, height: 22, padding: '0 9px', borderRadius: 11, fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', fontFamily: 'Inter, system-ui, sans-serif' });
const mono = (bg, fg, s = 24) => ({ width: s, height: s, borderRadius: s * .3, background: bg, color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: s * .46, fontWeight: 700, flex: 'none', fontFamily: 'Inter, system-ui, sans-serif' });
// Types several lines as one stream with a single caret on the active line.
function typeLines(c, sel, lines, at, cps, caretOff) {
  const els = c.qa(sel), total = lines.reduce((s, l) => s + l.length, 0);
  c.after(t => {
    let n = Math.floor(cl((t - at) * cps, 0, total) + 1e-6), active = -1;
    lines.forEach((l, i) => {
      const k = Math.min(l.length, n); n -= k;
      if (els[i].textContent !== l.slice(0, k)) els[i].textContent = l.slice(0, k);
      if (active < 0 && (k < l.length || i === lines.length - 1)) active = i;
    });
    els.forEach((el, i) => el.classList.toggle('caret', i === active && t >= at - .3 && t < caretOff));
  });
}

// ---------------------------------------------------------------- Screen recording
const ROWS_SR = [['JE', 'Jordan Ellis', '9:30 AM · Med pass', 'tint', DEEP], ['MB', 'Morgan Brooks', '11:00 AM · Lunch support', 'greenTint', GREEN_D], ['RP', 'Riley Patel', '2:15 PM · Outing', 'amberTint', AMBER_D]];
const SRY = i => 136 + i * 42;
export function ScreenRecording({ uid = 'screen-recording' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Screen recording of a visit schedule" svg={<>
      <defs><clipPath id={`${uid}-goclip`}><path d={rr(296, 266, 104, 36, 11)} /></clipPath></defs>
      <Surf id="win" x={64} y={88} w={352} h={230} r={16} tone="white" elev={3} seed={[240, 200]} />
      <Draw id="bar" d="M64 124.5 H416" stroke="#eef2f6" width={1} at={.85} />
      {[0, 1, 2].map(i => <Pop key={i} id={`wd${i}`} at={.9 + i * .04}><circle cx={84 + i * 14} cy={106} r={4.5} fill={['#cbd5e1', '#dbe2ea', '#e5eaf0'][i]} /></Pop>)}
      {ROWS_SR.map(([, , , tone], i) => <Surf key={i} id={`av${i}`} x={84} y={SRY(i) + 3} w={30} h={30} r={15} tone={tone} elev={0} seed={[99, SRY(i) + 18]} at={1.0 + i * .07} />)}
      {[1, 2].map(i => <Draw key={i} id={`sep${i}`} d={`M84 ${SRY(i) - 3.5} H396`} stroke="#f1f5f9" width={1} at={1.0 + i * .05} />)}
      <Surf id="go" x={296} y={266} w={104} h={36} r={11} tone="blue" elev={2} seed={[348, 284]} order={2} />
      <Surf id="ok" x={296} y={266} w={104} h={36} r={11} tone="green" elev={0} seed={[364, 286]} at={2.47} />
      <g clipPath={`url(#${uid}-goclip)`}><circle className="ripple" cx={364} cy={286} r={64} fill="#ffffff" opacity="0" /></g>
      <Draw id="frame" className="recframe" d={rr(52, 76, 376, 254, 22)} stroke={RED} width={2} at={1.45} dur={.85} />
      {[[52, 76, 1, 1], [428, 76, -1, 1], [52, 330, 1, -1], [428, 330, -1, -1]].map(([x, y, sx, sy], i) => (
        <Draw key={i} id={`cn${i}`} className="reccorner" d={`M${x + 22 * sx} ${y - 6 * sy} H${x + 4 * sx} Q${x - 6 * sx} ${y - 6 * sy} ${x - 6 * sx} ${y + 4 * sy} V${y + 22 * sy}`} stroke={RED} width={3} at={2.0 + i * .05} dur={.35} />
      ))}
      <Surf id="rec" x={284} y={30} w={144} h={30} r={15} tone="ink" elev={2} seed={[300, 45]} at={1.3} />
      <Pop id="dot" at={1.62}><circle className="halo" cx={302} cy={45} r={5} fill={RED} opacity=".35" /><circle className="recdot" cx={302} cy={45} r={4.5} fill={RED} /></Pop>
    </>}>
      <Layer id="wt" x={128} y={96} w={200} h={20} at={.9}><Text size={12.5} weight={600} color={BODY}>Visit schedule · Thursday</Text></Layer>
      {ROWS_SR.map(([ini, n, m, , col], i) => (
        <React.Fragment key={n}>
          <Layer id={`ai${i}`} x={84} y={SRY(i) + 3} w={30} h={30} at={1.15 + i * .07} align="center"><Text size={10.5} weight={700} color={col}>{ini}</Text></Layer>
          <Layer id={`rn${i}`} x={126} y={SRY(i)} w={260} h={36} at={1.2 + i * .07}><span className="stack"><Text size={13.5} weight={600}>{n}</Text><Text size={11.5} color={SUB} className="tnum">{m}</Text></span></Layer>
        </React.Fragment>
      ))}
      <Layer id="cap" x={84} y={274} w={180} h={20} at={1.3}><Text size={12} color={SUB}>3 visits today</Text></Layer>
      <Layer id="gt" x={296} y={266} w={104} h={36} at={1.35} align="center"><Text size={13.5} weight={600} color="#fff">Start visit</Text></Layer>
      <Layer id="okt" x={296} y={266} w={104} h={36} at={2.68} align="center" className="gap6"><Icon name="checkmark" size={16} color="#fff" id="ck" /><Text size={13.5} weight={600} color="#fff">Started</Text></Layer>
      <Layer id="rt" x={314} y={30} w={108} h={30} at={1.55} className="gap8"><Text size={11} weight={700} color="#fecaca" className="reclabel" style={{ letterSpacing: '.04em' }}>REC</Text><Text size={12.5} weight={600} color="#fff" className="tnum tc">00:00:00</Text></Layer>
    </Frame>
  );
}
ScreenRecording.motion = c => {
  const tc = c.q('[data-layer="rt"] .tc'), halo = c.q('.halo'), START = 1.6, STOP = 3.7;
  c.after(t => {
    const e = cl(t - START, 0, STOP - START), s = Math.floor(e), f = Math.floor((e - s) * 30 + 1e-6);
    tc.textContent = `00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
    const ph = t > START && t < STOP ? ((t - START) % .8) / .8 : 0;
    halo.setAttribute('r', (5 + ph * 7).toFixed(2)); halo.setAttribute('opacity', (t > START && t < STOP ? .4 * (1 - ph) : 0).toFixed(3));
  });
  c.cursor([{ at: 2.35, x: 364, y: 286, press: true }]);
  c.press('go', '[data-layer="gt"]', 2.35, 1);
  c.fromTo('.ripple', { scale: .1, opacity: 0, svgOrigin: '364 286' }, { scale: .1, opacity: .5, duration: .01, svgOrigin: '364 286' }, 2.39);
  c.fromTo('.ripple', { scale: .1, opacity: .5, svgOrigin: '364 286' }, { scale: 1, opacity: 0, duration: .7, ease: 'power2.out', svgOrigin: '364 286' }, 2.4);
  c.hide('gt', 2.5, .18);
  c.icon('ck', 0, 44, 2.72, .55);
  // Stop: the clip is saved and the recording chrome turns green.
  c.swap('[data-layer="rt"] .reclabel', ['REC', 'Saved'], [STOP]);
  c.fromTo('[data-layer="rt"] .reclabel', { color: '#fecaca' }, { color: '#86efac', duration: .2 }, STOP);
  c.fromTo('.recdot', { fill: RED }, { fill: '#22c55e', duration: .25 }, STOP);
  c.fromTo('.recframe, .reccorner', { stroke: RED }, { stroke: GREEN, duration: .35 }, STOP);
  c.fromTo('[data-pop="dot"]', { scale: 1, svgOrigin: '302 45' }, { scale: 1.35, duration: .12, ease: 'power2.out', svgOrigin: '302 45' }, STOP)
    .fromTo('[data-pop="dot"]', { scale: 1.35, svgOrigin: '302 45' }, { scale: 1, duration: .4, ease: 'back.out(3)', svgOrigin: '302 45' }, STOP + .12);
};
Object.assign(ScreenRecording, {
  id: 'screen-recording', title: 'Screen recording', category: 'Benchmarks', w: W, h: H,
  focus: { x: 258, y: 205 }, push: 1.06, orbit: .9, exit: [240, 200],
  summary: 'A recording frame draws around an app window while a REC pill counts tabular timecode. A click ripples through the button, then the clip is saved.',
  usage: `<ScreenRecording />`, icons: ['checkmark']
});

// ---------------------------------------------------------------- Split screen
const OUT_A = ['Three falls this week,', 'all after 10 PM. Two', 'near the bathroom in', 'room 4. Add a night', 'check at 1 AM.'];
const OUT_B = ['There were three falls', 'reported this week.', 'Most happened late at', 'night, near room 4.', 'Consider night checks.'];
const SA = { at: 1.85, end: 2.85 }, SB = { at: 1.85, end: 3.7 };
export function SplitScreen({ uid = 'split-screen' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Model A and Model B run the same task side by side" svg={<>
      <Surf id="card" x={40} y={26} w={400} h={308} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="pa" x={56} y={92} w={176} h={226} r={14} tone="muted" elev={0} seed={[226, 205]} at={1.15} />
      <Surf id="pb" x={248} y={92} w={176} h={226} r={14} tone="muted" elev={0} seed={[254, 205]} at={1.15} />
      <g className="divider">
        <Draw id="dv0" d="M240 205 V96" stroke="#cbd5e1" width={2} at={.95} dur={.45} />
        <Draw id="dv1" d="M240 205 V314" stroke="#cbd5e1" width={2} at={.95} dur={.45} />
        <Pop id="knob" at={1.0}><rect x={231} y={191} width={18} height={28} rx={9} fill="#fff" stroke="#e2e8f0" /><path d="M237 199 V211 M243 199 V211" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" /></Pop>
      </g>
      <Draw id="ta" d="M72 290 H216" stroke="#e2e8f0" width={4} at={1.3} dur={.4} />
      <Draw id="tb" d="M264 290 H408" stroke="#e2e8f0" width={4} at={1.36} dur={.4} />
      <path className="fa" d="M72 290 H216" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
      <path className="fb" d="M264 290 H408" fill="none" stroke={CYAN} strokeWidth="4" strokeLinecap="round" />
      <Surf id="winA" x={120} y={256} w={100} h={26} r={13} tone="greenTint" elev={0} seed={[207, 269]} at={2.88} />
    </>}>
      <Layer id="t" x={60} y={40} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Same task, two models</Text></Layer>
      <Layer id="s" x={60} y={62} w={300} h={20} at={.76}><Text size={12.5} color={SUB}>Summarize 40 shift notes from Maple House</Text></Layer>
      <Layer id="ha" x={70} y={102} w={120} h={24} at={1.3} className="gap6"><span className="legend"><i style={{ background: BLUE }} /><Text size={12.5} weight={600}>Model A</Text></span></Layer>
      <Layer id="hb" x={262} y={102} w={120} h={24} at={1.36} className="gap6"><span className="legend"><i style={{ background: CYAN }} /><Text size={12.5} weight={600}>Model B</Text></span></Layer>
      <Layer id="oa" x={70} y={134} w={156} h={110} at={1.4}><span className="stack" style={{ gap: 3 }}>{OUT_A.map((_, i) => <Text key={i} size={12.5} color={INK} className="la" style={{ minHeight: 18 }}></Text>)}</span></Layer>
      <Layer id="ob" x={262} y={134} w={156} h={110} at={1.4}><span className="stack" style={{ gap: 3 }}>{OUT_B.map((_, i) => <Text key={i} size={12.5} color={INK} className="lb" style={{ minHeight: 18 }}></Text>)}</span></Layer>
      <Layer id="ma" x={70} y={258} w={146} h={22} at={1.45}><Text size={12} weight={600} color={BODY} className="tnum ca">0.00 s</Text></Layer>
      <Layer id="mb" x={262} y={258} w={146} h={22} at={1.5}><Text size={12} weight={600} color={BODY} className="tnum cb">0.00 s</Text></Layer>
      <Layer id="db" kind="icon" x={388} y={258} w={22} h={22} at={3.73} align="center"><Icon name="checkCircle" size={18} color={MUTE} id="okB" /></Layer>
      <Layer id="wa" x={120} y={256} w={100} h={26} at={3.02} align="center" className="gap6"><Icon name="checkCircle" size={15} color={GREEN} id="okA" /><Text size={11.5} weight={600} color={GREEN_D}>1.9× faster</Text></Layer>
    </Frame>
  );
}
SplitScreen.motion = c => {
  typeLines(c, '[data-layer="oa"] .la', OUT_A, SA.at, OUT_A.join('').length / (SA.end - SA.at), SA.end + .25);
  typeLines(c, '[data-layer="ob"] .lb', OUT_B, SB.at, OUT_B.join('').length / (SB.end - SB.at), SB.end + .25);
  c.draw('.fa', '0% 0%', '0% 100%', SA.at, SA.end - SA.at, 'none');
  c.draw('.fb', '0% 0%', '0% 100%', SB.at, SB.end - SB.at, 'none');
  c.draw('.fa', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  c.draw('.fb', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  const ca = c.q('.ca'), cb = c.q('.cb');
  c.after(t => {
    // Displayed seconds run at 1.6x the stage clock so the race reads as real latency.
    ca.textContent = `${(cl(t - SA.at, 0, SA.end - SA.at) * 1.6).toFixed(2)} s`;
    cb.textContent = `${(cl(t - SB.at, 0, SB.end - SB.at) * 1.6).toFixed(2)} s`;
  });
  c.fromTo('.ca', { color: BODY }, { color: GREEN_D, duration: .2 }, SA.end);
  c.icon('okA', 0, 39, 3.05, .6);
  c.icon('okB', 0, 39, SB.end + .05, .6);
};
Object.assign(SplitScreen, {
  id: 'split-screen', title: 'Split screen', category: 'Benchmarks', w: W, h: H,
  focus: { x: 240, y: 200 }, push: 1.04, orbit: .85, exit: [240, 180],
  summary: 'A divider draws from its handle and the two panes wipe open out of it. Model A and Model B type the same summary at different speeds; the faster pane finishes first.',
  usage: `<SplitScreen />`, icons: ['checkCircle']
});

// ---------------------------------------------------------------- Prompt typing
const PROMPT = ['Summarize this week’s incident reports ', 'for Maple House and flag anything that ', 'needs a follow-up by Friday.'];
const PT = { at: 1.3, end: 2.7, send: 2.95 };
export function PromptTyping({ uid = 'prompt-typing' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="A prompt is typed and sent" svg={<>
      <Surf id="card" x={50} y={34} w={380} h={282} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="model" x={316} y={48} w={96} h={28} r={14} tone="tint" elev={0} seed={[330, 62]} at={.95} />
      <Surf id="box" x={68} y={96} w={344} h={140} r={16} tone="white" elev={1} seed={[240, 166]} order={1} />
      <Draw id="foot" d="M84 192.5 H340" stroke="#f1f5f9" width={1} at={1.1} />
      <Surf id="send" x={356} y={182} w={40} h={40} r={12} tone="blue" elev={2} seed={[376, 202]} order={2} />
      <Surf id="sent" x={68} y={252} w={344} h={44} r={14} tone="greenTint" elev={0} seed={[376, 236]} at={3.08} />
    </>}>
      <Layer id="t" x={70} y={42} w={220} h={22} at={.7}><Text size={15.5} weight={600}>New prompt</Text></Layer>
      <Layer id="s" x={70} y={62} w={220} h={20} at={.76}><Text size={12.5} color={SUB}>Northwind AI · Benchmark run 4</Text></Layer>
      <Layer id="mt" x={316} y={48} w={96} h={28} at={1.05} align="center" className="gap6"><span className="dose" /><Text size={12} weight={600} color={DEEP}>Model A</Text></Layer>
      <Layer id="ph" x={86} y={110} w={300} h={20} at={1.05}><Text size={14} color={MUTE}>Ask anything about your records</Text></Layer>
      <Layer id="pr" x={86} y={108} w={310} h={72}><span className="stack" style={{ gap: 2 }}>{PROMPT.map((_, i) => <Text key={i} size={14} color={INK} className="pl" style={{ minHeight: 21, lineHeight: '21px' }}></Text>)}</span></Layer>
      <Layer id="cn" x={86} y={196} w={250} h={30} at={1.2}><Text size={12} weight={500} color={SUB} className="tnum cnt">0 / 2,000 · 0 tokens</Text></Layer>
      <Layer id="si" kind="icon" x={356} y={182} w={40} h={40} at={1.25} align="center"><Icon name="send" size={19} color="#fff" id="send" /></Layer>
      <Layer id="ok" x={84} y={252} w={320} h={44} at={3.5} className="gap8"><Icon name="checkCircle" size={18} color={GREEN} id="ok" /><Text size={13} weight={600} color={GREEN_D} className="tnum">Sent to Model A · 27 tokens</Text><Text size={12} color={SUB} className="tnum" style={{ marginLeft: 'auto' }}>0.4 s</Text></Layer>
    </Frame>
  );
}
PromptTyping.motion = c => {
  const total = PROMPT.join('').length, cps = total / (PT.end - PT.at);
  c.hide('ph', PT.at - .2, .2);
  // The prompt carrier has no reveal of its own: it is empty until the caret arrives.
  typeLines(c, '[data-layer="pr"] .pl', PROMPT, PT.at, cps, PT.send);
  const cnt = c.q('.cnt');
  c.after(t => { const n = Math.floor(cl((t - PT.at) * cps, 0, total) + 1e-6); cnt.textContent = `${n} / 2,000 · ${Math.round(n / 4)} tokens`; });
  c.cursor([{ at: PT.send - .45, x: 318, y: 262 }, { at: PT.send, x: 378, y: 208, press: true }]);
  c.press('send', '[data-layer="si"]', PT.send, 1);
  c.icon('send', 0, 39, PT.send + .02, .75);
  c.fromTo('[data-layer="pr"] .pl', { color: INK }, { color: BODY, duration: .3 }, PT.send + .1);
  c.icon('ok', 0, 39, 3.55, .6);
};
Object.assign(PromptTyping, {
  id: 'prompt-typing', title: 'Prompt typing', category: 'Benchmarks', w: W, h: H,
  focus: { x: 250, y: 180 }, push: 1.06, exit: [240, 180],
  summary: 'A realistic prompt types into the box behind a caret while the character and token counter ticks. Send presses and a confirmation forms below.',
  usage: `<PromptTyping />`, icons: ['send', 'checkCircle']
});

// ---------------------------------------------------------------- Output comparison
const OC_A = [[['Three', 0], [' falls this week,']], [['all '], ['after 10 PM', 1], ['. Two']], [['near the bathroom in']], [['room 4, '], ['one in hall B.', 2]]];
const OC_B = [[['Two', 0], [' falls this week,']], [['mostly at night', 1], ['. Both']], [['in room 4.']]];
const MARK_AT = [2.0, 2.4, 2.8];
function DiffText({ lines, side, color }) {
  return (
    <span className="stack" style={{ gap: 0 }}>
      {lines.map((segs, i) => (
        <Text key={i} size={13} color={INK} style={{ lineHeight: '22px', isolation: 'isolate' }}>
          {segs.map(([w, m], j) => m == null ? <React.Fragment key={j}>{w}</React.Fragment>
            : <span key={j} style={{ position: 'relative', fontWeight: 600 }}><i className={`mk mk${side}${m}`} style={{ position: 'absolute', left: -2, right: -2, top: 2, bottom: 1, background: color, borderRadius: 4, zIndex: -1, transformOrigin: '0% 50%' }} />{w}</span>)}
        </Text>
      ))}
    </span>
  );
}
export function OutputComparison({ uid = 'output-comparison' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Two model outputs with word-level differences marked" svg={<>
      <Surf id="ca" x={48} y={90} w={186} h={186} r={18} tone="white" elev={3} seed={[141, 183]} />
      <Surf id="cb" x={246} y={90} w={186} h={186} r={18} tone="white" elev={3} seed={[339, 183]} order={1} />
      <Draw id="ha" d="M64 128.5 H218" stroke="#eef2f6" width={1} at={1.0} />
      <Draw id="hb" d="M262 128.5 H416" stroke="#eef2f6" width={1} at={1.05} />
      <Draw id="win" className="winline" d={rr(44, 86, 194, 194, 22)} stroke={GREEN} width={2} at={3.05} dur={.6} />
      <Surf id="va" x={70} y={292} w={142} h={30} r={15} tone="greenTint" elev={0} seed={[141, 278]} at={3.1} />
      <Surf id="vb" x={286} y={292} w={106} h={30} r={15} tone="tint" elev={0} seed={[339, 278]} at={3.22} />
    </>}>
      <Layer id="t" x={48} y={30} w={300} h={22} at={.7}><Text size={15.5} weight={600}>Output comparison</Text></Layer>
      <Layer id="s" x={48} y={52} w={340} h={20} at={.76}><Text size={12.5} color={SUB}>Same prompt · word-level differences</Text></Layer>
      <Layer id="la" x={64} y={98} w={154} h={24} at={1.0}><span className="legend"><i style={{ background: BLUE }} /><Text size={12.5} weight={600}>Model A</Text></span><Text size={11.5} color={MUTE} className="tnum" style={{ marginLeft: 'auto' }}>18 words</Text></Layer>
      <Layer id="lb" x={262} y={98} w={154} h={24} at={1.05}><span className="legend"><i style={{ background: CYAN }} /><Text size={12.5} weight={600}>Model B</Text></span><Text size={11.5} color={MUTE} className="tnum" style={{ marginLeft: 'auto' }}>10 words</Text></Layer>
      <Layer id="xa" x={64} y={136} w={160} h={92} at={1.15} style={{ alignItems: 'flex-start' }}><DiffText lines={OC_A} side="A" color="#bbf7d0" /></Layer>
      <Layer id="xb" x={262} y={136} w={160} h={92} at={1.2} style={{ alignItems: 'flex-start' }}><DiffText lines={OC_B} side="B" color="#fde68a" /></Layer>
      <Layer id="ka" x={64} y={244} w={154} h={20} at={1.3}><Text size={11.5} color={SUB} className="tnum dfa">0 of 3 details</Text></Layer>
      <Layer id="kb" x={262} y={244} w={154} h={20} at={1.35}><Text size={11.5} color={SUB} className="tnum dfb">0 of 3 details</Text></Layer>
      <Layer id="vat" x={70} y={292} w={142} h={30} at={3.3} align="center" className="gap6"><Icon name="checkCircle" size={16} color={GREEN} id="acc" /><Text size={12} weight={600} color={GREEN_D}>More accurate</Text></Layer>
      <Layer id="vbt" x={286} y={292} w={106} h={30} at={3.42} align="center" className="gap6"><Icon name="minimize2" size={15} color={DEEP} id="short" /><Text size={12} weight={600} color={DEEP}>Shorter</Text></Layer>
    </Frame>
  );
}
OutputComparison.motion = c => {
  MARK_AT.forEach((at, i) => {
    c.fromTo(`.mkA${i}`, { scaleX: 0 }, { scaleX: 1, duration: .38, ease: 'power2.inOut' }, at);
    if (i < 2) c.fromTo(`.mkB${i}`, { scaleX: 0 }, { scaleX: 1, duration: .38, ease: 'power2.inOut' }, at + .12);
  });
  c.swap('[data-layer="ka"] .dfa', ['0 of 3 details', '1 of 3 details', '2 of 3 details', '3 of 3 details'], MARK_AT.map(t => t + .2));
  c.swap('[data-layer="kb"] .dfb', ['0 of 3 details', '0 of 3 details', '1 of 3 details', '1 of 3 details'], MARK_AT.map(t => t + .32));
  c.fromTo('[data-layer="ka"] .dfa', { color: SUB }, { color: GREEN_D, duration: .2 }, 3.0);
  c.icon('acc', 0, 39, 3.35, .6);
  c.icon('short', 0, 33, 3.47, .5);
};
Object.assign(OutputComparison, {
  id: 'output-comparison', title: 'Output comparison', category: 'Benchmarks', w: W, h: H,
  focus: { x: 240, y: 190 }, push: 1.04, orbit: .85, exit: [240, 183],
  summary: 'Two answers to the same prompt sit side by side. Highlight marks sweep across the words that differ, then verdict chips settle under each card.',
  usage: `<OutputComparison />`, icons: ['checkCircle', 'minimize2']
});

// ---------------------------------------------------------------- Timer overlay
const TCX = 240, TCY = 146, TR = 66, BUDGET = 4;
const TIMER = { at: 1.5, rate: 2, A: 1.9, B: 3.7 };
const onRing = f => [TCX + TR * Math.sin(f * 2 * Math.PI), TCY - TR * Math.cos(f * 2 * Math.PI)];
const fmtT = v => { const s = Math.floor(v + 1e-6), cc = Math.floor((v - s) * 100 + 1e-6); return `00:${String(s).padStart(2, '0')}.${String(cc).padStart(2, '0')}`; };
const LAPS = [['A', 'Model A', TIMER.A, BLUE, 234], ['B', 'Model B', TIMER.B, CYAN, 272]];
export function TimerOverlay({ uid = 'timer-overlay' }) {
  const ARC = `M${TCX} ${TCY - TR} A${TR} ${TR} 0 1 1 ${TCX - .01} ${TCY - TR}`;
  return (
    <Frame uid={uid} w={W} h={H} label="Stopwatch overlay with lap markers for two models" svg={<>
      <Surf id="card" x={110} y={22} w={260} h={300} r={24} tone="ink" elev={3} seed={[240, 172]} />
      <Draw id="track" d={ARC} stroke="rgba(255,255,255,.1)" width={10} at={.85} dur={.6} />
      <path className="tarc" d={ARC} fill="none" stroke={BLUE} strokeWidth="10" strokeLinecap="round" />
      {[0, 1, 2, 3].map(i => { const [x, y] = onRing(i / 4), [x2, y2] = [TCX + (TR - 15) * Math.sin(i * Math.PI / 2), TCY - (TR - 15) * Math.cos(i * Math.PI / 2)]; return <Draw key={i} id={`tk${i}`} d={`M${x2.toFixed(2)} ${y2.toFixed(2)} L${(x2 + (x - x2) * .35).toFixed(2)} ${(y2 + (y - y2) * .35).toFixed(2)}`} stroke="rgba(255,255,255,.28)" width={1.5} at={1.0 + i * .04} dur={.2} />; })}
      {LAPS.map(([k, , v, col, y], i) => { const [x, yy] = onRing(v / BUDGET), at = TIMER.at + v / TIMER.rate; return (
        <React.Fragment key={k}>
          <circle className={`flash${k}`} cx={x} cy={yy} r={10} fill="none" stroke={col} strokeWidth="2" opacity="0" />
          <Pop id={`mk${k}`} at={at} ease="back.out(3)"><circle cx={x} cy={yy} r={10} fill={col} stroke="#0f172a" strokeWidth="2.5" /></Pop>
          <Pop id={`row${k}`} at={1.15 + i * .08} ease="power3.out"><rect x={130} y={y} width={220} height={32} rx={10} fill="rgba(255,255,255,.06)" /></Pop>
        </React.Fragment>
      ); })}
    </>}>
      <Layer id="hd" x={134} y={34} w={212} h={22} at={.75} className="gap6"><Icon name="watch" size={16} color="#93c5fd" id="watch" /><Text size={12.5} weight={600} color="#e2e8f0">Benchmark timer</Text></Layer>
      <Layer id="tm" x={160} y={124} w={160} h={34} at={.95} align="center"><Text size={26} weight={600} color="#fff" className="tnum tmain" style={{ letterSpacing: '-.02em' }}>00:00.00</Text></Layer>
      <Layer id="bg" x={160} y={156} w={160} h={18} at={1.0} align="center"><Text size={11} weight={500} color={MUTE} className="tnum">of 00:04.00 budget</Text></Layer>
      {LAPS.map(([k, n, v, col, y], i) => { const [x, yy] = onRing(v / BUDGET), at = TIMER.at + v / TIMER.rate; return (
        <React.Fragment key={k}>
          <Layer id={`ml${k}`} x={x - 10} y={yy - 10} w={20} h={20} at={at + .05} align="center"><Text size={10.5} weight={700} color="#fff">{k}</Text></Layer>
          <Layer id={`rl${k}`} x={142} y={y} w={196} h={32} at={1.25 + i * .08} className="gap8"><span style={mono(col, '#fff', 20)}>{k}</span><Text size={12.5} weight={600} color="#cbd5e1">{n}</Text><Text size={12.5} weight={600} color={MUTE} className={`tnum lap${k}`} style={{ marginLeft: 'auto' }}>00:00.00</Text></Layer>
        </React.Fragment>
      ); })}
    </Frame>
  );
}
TimerOverlay.motion = c => {
  const end = TIMER.at + TIMER.B / TIMER.rate, main = c.q('.tmain'), la = c.q('.lapA'), lb = c.q('.lapB');
  c.draw('.tarc', '0% 0%', `0% ${TIMER.B / BUDGET * 100}%`, TIMER.at, end - TIMER.at, 'none');
  c.draw('.tarc', `0% ${TIMER.B / BUDGET * 100}%`, '0% 0%', c.T.collapse + .02, .4, 'power2.in');
  c.after(t => {
    const v = cl(t - TIMER.at, 0, end - TIMER.at) * TIMER.rate;
    main.textContent = fmtT(v); la.textContent = fmtT(Math.min(v, TIMER.A)); lb.textContent = fmtT(Math.min(v, TIMER.B));
  });
  LAPS.forEach(([k, , v]) => {
    const at = TIMER.at + v / TIMER.rate;
    c.fromTo(`.lap${k}`, { color: MUTE }, { color: '#ffffff', duration: .2 }, at);
    c.fromTo(`.flash${k}`, { scale: 1, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: .9, duration: .01 }, at - .01);
    c.fromTo(`.flash${k}`, { scale: 1, opacity: .9, transformOrigin: '50% 50%' }, { scale: 2.4, opacity: 0, duration: .6, ease: 'power2.out' }, at);
    c.press([], `[data-layer="rl${k}"]`, at, 1);
  });
  c.fromTo('.tarc', { stroke: BLUE }, { stroke: CYAN, duration: .3 }, TIMER.at + TIMER.A / TIMER.rate);
  c.icon('watch', 0, 39, TIMER.at - .05, 1.0);
};
Object.assign(TimerOverlay, {
  id: 'timer-overlay', title: 'Timer overlay', category: 'Benchmarks', w: W, h: H,
  focus: { x: 240, y: 170 }, push: 1.08, exit: [240, 172],
  summary: 'A stopwatch overlay counts tabular mm:ss.cc while its ring sweeps. Lap markers A and B land on the ring as each model finishes and freeze their rows.',
  usage: `<TimerOverlay />`, icons: ['watch']
});

// ---------------------------------------------------------------- Winner stamp
const MX0 = 318, MY0 = 186, STAMP = { down: 2.35, lift: 2.62 };
const METRICS = [['Accuracy', '94.2%'], ['Median latency', '1.6 s'], ['Cost per task', '$0.04']];
export function WinnerStamp({ uid = 'winner-stamp' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="A winner stamp pressed onto a benchmark result" svg={<>
      <Surf id="card" x={78} y={34} w={324} h={284} r={22} tone="white" elev={3} seed={[240, 176]} />
      <Surf id="tile" x={102} y={58} w={42} h={42} r={13} tone="blue" elev={1} seed={[123, 79]} order={1} />
      <Draw id="dv" d="M102 120.5 H378" stroke="#eef2f6" width={1} at={.95} />
      {[1, 2].map(i => <Draw key={i} id={`sp${i}`} d={`M102 ${128 + i * 44 - .5} H254`} stroke="#f1f5f9" width={1} at={1.0 + i * .05} />)}
      <Draw id="ft" d="M102 266.5 H378" stroke="#eef2f6" width={1} at={1.1} />
      <g className="mark" transform={`rotate(-12 ${MX0} ${MY0})`}>
        <Draw id="r1" d={`M${MX0} ${MY0 - 52} a52 52 0 1 1 -0.01 0`} stroke={DEEP} width={3.5} at={STAMP.down + .01} dur={.12} />
        <Draw id="r2" d={`M${MX0} ${MY0 - 45} a45 45 0 1 1 -0.01 0`} stroke={DEEP} width={1.2} at={STAMP.down + .03} dur={.12} />
        <Pop id="ink" at={STAMP.down + .02} ease="power4.out"><circle cx={MX0 - 45} cy={MY0} r={2.4} fill={DEEP} /><circle cx={MX0 + 45} cy={MY0} r={2.4} fill={DEEP} /></Pop>
      </g>
    </>}>
      <Layer id="ti" x={102} y={58} w={42} h={42} at={1.0} align="center"><Text size={18} weight={700} color="#fff">A</Text></Layer>
      <Layer id="nm" x={156} y={58} w={220} h={42} at={.85}><span className="stack"><Text size={17} weight={600}>Model A</Text><Text size={12.5} color={SUB}>Northwind AI · CareQA run 12</Text></span></Layer>
      {METRICS.map(([l, v], i) => (
        <Layer key={l} id={`m${i}`} x={102} y={128 + i * 44} w={160} h={44} at={1.05 + i * .06}><span className="stack"><Text size={12} color={SUB}>{l}</Text><Text size={16} weight={600} className="tnum">{v}</Text></span></Layer>
      ))}
      <Layer id="vs" x={102} y={276} w={276} h={30} at={1.3}><Text size={12} color={SUB} className="tnum">Model B: 88.7% · 3.0 s · $0.06</Text></Layer>
      <Layer id="mt" x={MX0 - 45} y={MY0 - 36} w={90} h={72} at={STAMP.down} align="center" style={{ transform: 'rotate(-12deg)', transformOrigin: '50% 50%' }}>
        <span className="stack center" style={{ gap: 1 }}><Icon name="award" size={22} color={DEEP} id="award" /><Text size={19} weight={700} color={DEEP} style={{ letterSpacing: '.01em' }}>Winner</Text><Text size={9.5} weight={600} color={DEEP} style={{ opacity: .8 }}>CareQA · run 12</Text></span>
      </Layer>
      <div className="stamp-tool" style={{ position: 'absolute', left: MX0 - 60, top: MY0 - 96, width: 120, height: 150, opacity: 0, visibility: 'hidden', transformOrigin: '50% 100%' }}>
        <svg width="120" height="150" viewBox="0 0 120 150" style={{ overflow: 'visible', transform: 'rotate(-12deg)', transformOrigin: '60px 96px' }}>
          <ellipse cx="62" cy="146" rx="60" ry="7" fill="rgba(15,23,42,.2)" filter="blur(3px)" />
          <circle cx="60" cy="20" r="18" fill="#1e293b" /><circle cx="55" cy="14" r="6" fill="#ffffff" opacity=".14" />
          <rect x="50" y="34" width="20" height="28" rx="6" fill="#334155" />
          <rect x="2" y="58" width="116" height="66" rx="14" fill="#0f172a" /><rect x="8" y="62" width="104" height="7" rx="3.5" fill="#ffffff" opacity=".1" />
          <rect x="6" y="122" width="108" height="18" rx="5" fill="#1d4ed8" /><rect x="6" y="122" width="108" height="5" rx="2.5" fill="#1e3a8a" opacity=".55" />
        </svg>
      </div>
    </Frame>
  );
}
WinnerStamp.motion = c => {
  const tool = '.stamp-tool', { down, lift } = STAMP;
  c.fromTo(tool, { autoAlpha: 0, y: -90, scale: 1.18 }, { autoAlpha: 1, y: -52, scale: 1.12, duration: .45, ease: 'power2.out' }, 1.7);
  c.fromTo(tool, { y: -52, scale: 1.12 }, { y: 0, scale: 1, duration: .2, ease: 'power3.in' }, down - .2);
  c.fromTo(tool, { scaleY: 1, scaleX: 1 }, { scaleY: .9, scaleX: 1.05, duration: .07, ease: 'power2.out' }, down);
  c.fromTo(tool, { scaleY: .9, scaleX: 1.05 }, { scaleY: 1, scaleX: 1, duration: .25, ease: 'power2.out' }, down + .08);
  c.fromTo(tool, { y: 0 }, { y: -70, duration: .36, ease: 'power2.in' }, lift);
  c.fromTo(tool, { autoAlpha: 1 }, { autoAlpha: 0, duration: .16, ease: 'none' }, lift + .14);
  // The whole card dips under the impact and springs back.
  c.fromTo('.fc-chassis, .fc-overlay', { y: 0 }, { y: 4, duration: .07, ease: 'power2.out' }, down);
  c.fromTo('.fc-chassis, .fc-overlay', { y: 4 }, { y: 0, duration: .6, ease: 'elastic.out(1,0.45)' }, down + .08);
  c.fromTo('.mark', { scale: 1.08, svgOrigin: `${MX0} ${MY0}` }, { scale: 1, svgOrigin: `${MX0} ${MY0}`, duration: .3, ease: 'power3.out' }, down + .01);
  c.fromTo('[data-layer="mt"] .fc-carrier', { scale: 1.08 }, { scale: 1, duration: .3, ease: 'power3.out' }, down + .06);
  c.icon('award', 0, 39, lift + .1, .8);
};
Object.assign(WinnerStamp, {
  id: 'winner-stamp', title: 'Winner stamp', category: 'Benchmarks', w: W, h: H,
  focus: { x: 290, y: 180 }, push: 1.06, exit: [240, 176],
  summary: 'A rubber stamp drops onto the result card, squashes on impact while the card dips, and lifts away to leave a crisp rotated Winner mark.',
  usage: `<WinnerStamp />`, icons: ['award']
});

// ---------------------------------------------------------------- Bar chart
const VB = [['Orion Mini', 'Lumen Labs', 78.4], ['Kestrel Pro', 'Kestrel AI', 91.4], ['Atlas 7B', 'Open weights', 83.9], ['Northwind 2', 'Northwind AI', 86.2]];
const VB_LEAD = 1, VBY = i => 124 + i * 50, VX0 = 180, VW = 180, VX = v => VX0 + VW * v / 100, RACE = 1.8;
const vbDur = v => 1.3 * v / 91.4;
export function VsBars({ uid = 'vs-bars', rows = VB }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Horizontal bars comparing four models" svg={<>
      <Surf id="card" x={40} y={28} w={400} h={304} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="lead" x={52} y={VBY(VB_LEAD) - 24} w={376} h={48} r={14} tone="tint" elev={0} seed={[64, VBY(VB_LEAD)]} at={2.95} />
      {[0, 25, 50, 75, 100].map((v, i) => <Draw key={v} id={`g${i}`} d={`M${VX(v) + .5} 98 V296`} stroke={v ? '#f1f5f9' : '#e2e8f0'} width={1} at={.85 + i * .04} dur={.5} />)}
      {rows.map((r, i) => <Draw key={i} id={`tr${i}`} d={`M${VX0 + 6} ${VBY(i)} H${VX(100) - 6}`} stroke="#eef2f6" width={12} at={1.0 + i * .06} dur={.5} />)}
      {rows.map(([, , v], i) => <path key={i} className={`vb vb${i}`} d={`M${VX0 + 6} ${VBY(i)} H${VX(v) - 6}`} fill="none" stroke={i === VB_LEAD ? BLUE : '#60a5fa'} strokeWidth="12" strokeLinecap="round" />)}
    </>}>
      <Layer id="t" x={64} y={42} w={260} h={22} at={.7}><Text size={15.5} weight={600}>Accuracy on CareQA</Text></Layer>
      <Layer id="s" x={64} y={64} w={300} h={20} at={.76}><Text size={12.5} color={SUB}>500 questions · higher is better</Text></Layer>
      {rows.map(([n, o], i) => (
        <Layer key={n} id={`n${i}`} x={64} y={VBY(i) - 20} w={110} h={40} at={1.0 + i * .06}><span className="stack"><Text size={13.5} weight={600} className={`nm${i}`}>{n}</Text><Text size={11} color={SUB}>{o}</Text></span></Layer>
      ))}
      {rows.map((r, i) => <Layer key={i} id={`v${i}`} x={356} y={VBY(i) - 11} w={42} h={22} at={1.1 + i * .06} align="right"><Text size={13.5} weight={600} color={BODY} className={`tnum val${i}`}>0.0</Text></Layer>)}
      <Layer id="aw" kind="icon" x={401} y={VBY(VB_LEAD) - 11} w={22} h={22} at={3.08} align="center"><Icon name="award" size={18} color={DEEP} id="award" /></Layer>
      <Layer id="ax" x={VX0 - 20} y={300} w={VW + 40} h={18} at={1.0}><span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>{['0', '25', '50', '75', '100'].map(l => <Text key={l} size={10.5} weight={600} color={MUTE} className="tnum" style={{ width: 40, textAlign: 'center' }}>{l}</Text>)}</span></Layer>
    </Frame>
  );
}
VsBars.motion = c => {
  VB.forEach(([, , v], i) => {
    c.draw(`.vb${i}`, '0% 0%', '0% 100%', RACE, vbDur(v), 'power2.out');
    c.draw(`.vb${i}`, '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
    c.count(`.val${i}`, 0, v, RACE, vbDur(v), x => x.toFixed(1), 'power2.out');
    if (i !== VB_LEAD) {
      c.fromTo(`.vb${i}`, { stroke: '#60a5fa' }, { stroke: '#bfdbfe', duration: .35 }, 3.0);
      c.fromTo(`.val${i}`, { color: BODY }, { color: MUTE, duration: .35 }, 3.0);
    }
  });
  c.fromTo(`.val${VB_LEAD}`, { color: BODY }, { color: DEEP, duration: .3 }, RACE + vbDur(91.4) - .05);
  c.fromTo(`.nm${VB_LEAD}`, { color: INK }, { color: DEEP, duration: .3 }, 3.0);
  c.fromTo(`.vb${VB_LEAD}`, { stroke: BLUE }, { stroke: DEEP, duration: .3 }, 3.0);
  c.icon('award', 0, 39, 3.12, .8);
};
Object.assign(VsBars, {
  id: 'vs-bars', title: 'Bar chart', category: 'Benchmarks', w: W, h: H,
  focus: { x: 250, y: 190 }, push: 1.06, orbit: .9, exit: [240, 180],
  summary: 'Four fictional models race their bars to final accuracy scores with tabular counters. The leader deepens, gains a backing and an award while the rest step back.',
  usage: `<VsBars rows={[['Orion Mini','Lumen Labs',78.4], ...]} />`, icons: ['award']
});

// ---------------------------------------------------------------- Leaderboard table
const LB = [['Kestrel Pro', 'K', '#e0e7ff', '#3730a3', '91.4', 0], ['Orion Mini', 'O', '#dcfce7', GREEN_D, '88.2', 2], ['Atlas 7B', 'A', '#fef3c7', AMBER_D, '86.0', 3], ['Northwind 2', 'N', '#dbeafe', DEEP, '84.1', 1]];
const LTR = i => 140 + i * 46, CLIMB = 3, LB_T = { score: 1.85, move: 2.5 };
export function Leaderboard({ uid = 'leaderboard' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Leaderboard where a model climbs from fourth to second" svg={<>
      <Surf id="card" x={40} y={24} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="hd" d="M56 134.5 H424" stroke="#e2e8f0" width={1} at={.85} />
      {[1, 2, 3].map(i => <Draw key={i} id={`sep${i}`} d={`M56 ${LTR(i) - 2.5} H424`} stroke="#f1f5f9" width={1} at={.95 + i * .05} />)}
      <Surf id="hit" x={52} y={LTR(1) + 1} w={376} h={40} r={10} tone="tint" elev={0} seed={[70, LTR(1) + 21]} at={3.25} />
      <Surf id="up" x={340} y={LTR(1) + 9} w={50} h={24} r={12} tone="greenTint" elev={0} seed={[352, LTR(1) + 21]} at={3.1} />
    </>}>
      <Layer id="t" x={64} y={40} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Leaderboard</Text></Layer>
      <Layer id="s" x={64} y={62} w={300} h={20} at={.76}><Text size={12.5} color={SUB} className="tnum lbsub">CareQA · after run 11</Text></Layer>
      <Layer id="h0" x={64} y={100} w={30} h={30} at={.9}><Text size={12} weight={600} color={SUB}>#</Text></Layer>
      <Layer id="h1" x={96} y={100} w={120} h={30} at={.93}><Text size={12} weight={600} color={SUB}>Model</Text></Layer>
      <Layer id="h2" x={256} y={100} w={70} h={30} at={.96}><Text size={12} weight={600} color={SUB}>Score</Text></Layer>
      <Layer id="h3" x={340} y={100} w={76} h={30} at={.99}><Text size={12} weight={600} color={SUB}>Change</Text></Layer>
      {LB.map(([n, k, bg, fg, sc], i) => (
        <Layer key={n} id={`r${i}`} x={64} y={LTR(i)} w={352} h={42} at={1.1 + i * .07}>
          <span className="trow">
            <Text size={13.5} weight={700} color={i === 0 ? DEEP : BODY} className={`tnum rk${i}`} style={{ width: 32 }}>{i + 1}</Text>
            <span style={{ ...mono(bg, fg, 24), marginRight: 10 }}>{k}</span>
            <Text size={14} weight={600} style={{ width: 126 }}>{n}</Text>
            <Text size={14} weight={600} className={`tnum sc${i}`} style={{ width: 40 }}>{sc}</Text>
            <Text size={11.5} weight={600} color={GREEN_D} className={`tnum sd${i}`} style={{ marginLeft: 4 }}></Text>
          </span>
        </Layer>
      ))}
      <Layer id="ch0" x={340} y={LTR(0)} w={76} h={42} at={3.2}><Text size={13} weight={600} color={MUTE}>Held</Text></Layer>
      <Layer id="ch1" x={340} y={LTR(1) + 9} w={50} h={24} at={3.24} align="center" className="gap6" style={{ gap: 2 }}><Icon name="arrowUp" size={17} color={GREEN} id="up" /><Text size={12} weight={700} color={GREEN_D} className="tnum">2</Text></Layer>
      {[2, 3].map(i => <Layer key={i} id={`ch${i}`} x={340} y={LTR(i) + 9} w={50} h={24} at={3.28 + (i - 2) * .05} align="center" className="gap6"><Icon name="arrowDown" size={17} color={MUTE} id={`dn${i}`} /><Text size={12} weight={700} color={MUTE} className="tnum">1</Text></Layer>)}
    </Frame>
  );
}
Leaderboard.motion = c => {
  // A new run lands: the bottom row's score counts up, then the row lifts and climbs.
  const climb = `[data-layer="r${CLIMB}"] .trow`;
  c.fromTo(climb, { backgroundColor: 'rgba(234,242,255,0)' }, { backgroundColor: 'rgba(234,242,255,1)', duration: .2 }, LB_T.score - .1);
  c.count(`.sc${CLIMB}`, 84.1, 89.6, LB_T.score, .5, v => v.toFixed(1), 'power2.out');
  c.swap(`.sd${CLIMB}`, ['', '+5.5'], [LB_T.score + .45]);
  c.fromTo(`.sc${CLIMB}`, { color: INK }, { color: GREEN_D, duration: .2 }, LB_T.score);
  c.fromTo(`.sc${CLIMB}`, { color: GREEN_D }, { color: INK, duration: .3 }, 3.2);
  c.swap('[data-layer="s"] .lbsub', ['CareQA · after run 11', 'CareQA · after run 12'], [LB_T.score]);
  LB.forEach(([, , , , , to], i) => {
    const at = LB_T.move + Math.abs(to - i) * .03, row = `[data-layer="r${i}"]`, back = `${row} .trow`;
    if (to === i) return;
    c.set(row, { zIndex: to < i ? 3 : 1 }, LB_T.move - .01);
    c.fromTo(row, { y: 0 }, { y: (to - i) * 46, duration: .62, ease: 'back.out(1.15)' }, at);
    if (to < i) {
      c.fromTo(back, { backgroundColor: 'rgba(234,242,255,1)', boxShadow: '0 0 0 rgba(29,78,216,0)' }, { backgroundColor: 'rgba(255,255,255,1)', boxShadow: '0 10px 22px rgba(29,78,216,.16)', duration: .12 }, LB_T.move - .08);
      c.fromTo(back, { scale: 1 }, { scale: 1.025, duration: .2, ease: 'power2.out' }, LB_T.move - .05).fromTo(back, { scale: 1.025 }, { scale: 1, duration: .35, ease: 'power2.inOut' }, 3.0);
      c.fromTo(back, { backgroundColor: 'rgba(255,255,255,1)', boxShadow: '0 10px 22px rgba(29,78,216,.16)' }, { backgroundColor: 'rgba(255,255,255,0)', boxShadow: '0 0 0 rgba(29,78,216,0)', duration: .25 }, 3.15);
    } else {
      c.fromTo(back, { backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: 'rgba(255,255,255,1)', duration: .12 }, LB_T.move - .08);
      c.fromTo(back, { backgroundColor: 'rgba(255,255,255,1)' }, { backgroundColor: 'rgba(255,255,255,0)', duration: .2 }, 3.15);
    }
    c.swap(`.rk${i}`, [String(i + 1), String(to + 1)], [LB_T.move + .3]);
  });
  c.fromTo(`.rk${CLIMB}`, { color: BODY }, { color: DEEP, duration: .2 }, LB_T.move + .3);
  // Native arrows: shaft draws over frames 0 to 60, the head over 60 to 120.
  c.icon('up', 0, 125, 3.28, .8);
  c.icon('dn2', 0, 125, 3.32, .8); c.icon('dn3', 0, 125, 3.37, .8);
};
Object.assign(Leaderboard, {
  id: 'leaderboard', title: 'Leaderboard table', category: 'Benchmarks', w: W, h: H,
  focus: { x: 250, y: 200 }, push: 1.0, orbit: .8, exit: [240, 180],
  summary: 'A new run raises one model’s score. Its row lifts on an opaque backing and climbs from fourth to second while the rows it passes slide down, then rank arrows land.',
  usage: `<Leaderboard />`, icons: ['arrowUp', 'arrowDown']
});

// ---------------------------------------------------------------- Result highlight
const RH = ['Across 12 group homes, staff using voice notes', 'cut documentation time by 38%, from 21 to 13', 'minutes per shift. Error rates held steady at', '1.2%, and no visits were missed.'];
const RH_KEY = 'cut documentation time by 38%', RHY = 118, RHL = 26, RH_W = 212;
const RH_T = { at: 2.05, end: 2.7 };
export function ResultHighlight({ uid = 'result-highlight' }) {
  const y = RHY + RHL * 1.5 + .5;
  return (
    <Frame uid={uid} w={W} h={H} label="Results paragraph with the key figure highlighted" svg={<>
      <Surf id="card" x={50} y={36} w={380} h={276} r={22} tone="white" elev={3} seed={[240, 174]} />
      <Surf id="ib" x={74} y={58} w={40} h={40} r={12} tone="tint" elev={0} seed={[94, 78]} order={1} />
      <path className="hlt" d={`M70 ${y + 1.2} C${70 + RH_W * .3} ${y - .8} ${70 + RH_W * .7} ${y + 1.4} ${74 + RH_W} ${y - .4}`} fill="none" stroke="#fde047" strokeOpacity=".72" strokeWidth="21" strokeLinecap="butt" />
      <Draw id="lead" className="leadline" d={`M71 ${y + 10} Q60 ${y + 10} 60 ${y + 22} V${262 - 10} Q60 262 72 262 H78`} stroke="#cbd5e1" width={1.5} at={2.85} dur={.45} />
      <Surf id="call" x={78} y={240} w={232} h={44} r={14} tone="ink" elev={2} seed={[80, 262]} at={3.02} />
    </>}>
      <Layer id="ii" kind="icon" x={74} y={58} w={40} h={40} at={.95} align="center"><Icon name="fileText" size={20} color={DEEP} id="file" /></Layer>
      <Layer id="t" x={126} y={58} w={280} h={40} at={.8}><span className="stack"><Text size={15.5} weight={600}>Pilot results</Text><Text size={12.5} color={SUB}>Voice notes study · 12 group homes</Text></span></Layer>
      <Layer id="p" x={74} y={RHY} w={340} h={RHL * 4} at={1.05} style={{ alignItems: 'flex-start' }}>
        <span className="stack" style={{ gap: 0 }}>{RH.map((l, i) => (
          <Text key={i} size={14} color={BODY} style={{ lineHeight: `${RHL}px` }}>{i === 1 ? <><b className="key" style={{ fontWeight: 600 }}>{RH_KEY}</b>{l.slice(RH_KEY.length)}</> : l}</Text>
        ))}</span>
      </Layer>
      <Layer id="ct" x={92} y={240} w={212} h={44} at={3.4} className="gap8"><Icon name="trendingDown" size={18} color="#4ade80" id="trend" /><span className="stack"><Text size={13.5} weight={600} color="#fff">38% less time on notes</Text><Text size={11.5} color="#cbd5e1" className="tnum">21 to 13 min per shift · p &lt; 0.01</Text></span></Layer>
    </Frame>
  );
}
ResultHighlight.motion = c => {
  c.cursor([{ at: RH_T.at - .14, x: 72, y: RHY + RHL * 1.5 + 6, press: true }, { at: RH_T.end, x: 74 + RH_W, y: RHY + RHL * 1.5 + 6 }]);
  c.draw('.hlt', '0% 0%', '0% 100%', RH_T.at, RH_T.end - RH_T.at, 'power3.inOut');
  c.draw('.hlt', '0% 100%', '100% 100%', c.T.collapse, .28, 'power2.in');
  c.fromTo('.key', { color: BODY }, { color: INK, duration: .3 }, RH_T.at + .2);
  c.icon('file', 0, 39, 1.0, .9);
  c.icon('trend', 0, 39, 3.45, .8);
};
Object.assign(ResultHighlight, {
  id: 'result-highlight', title: 'Result highlight', category: 'Benchmarks', w: W, h: H,
  focus: { x: 215, y: 185 }, push: 1.06, exit: [240, 174],
  summary: 'A results paragraph sits on a card. A wide translucent highlighter sweeps across the key figure with DrawSVG and a callout chip grows from a leader line.',
  usage: `<ResultHighlight />`, icons: ['fileText', 'trendingDown']
});

// ---------------------------------------------------------------- Consistency timer
const RUNS = [2.0, 2.6, 2.3, 2.8, 2.3];
const CX0 = 112, CPX = 76, CXv = v => CX0 + v * CPX, CRY = i => 114 + i * 36, RUN_AT = i => 1.75 + i * .18, RUN_D = .55;
const MEANS = RUNS.map((_, k) => RUNS.slice(0, k + 1).reduce((a, b) => a + b, 0) / (k + 1));
export function ConsistencyTimer({ uid = 'consistency-timer' }) {
  const mx = CXv(MEANS[0]);
  return (
    <Frame uid={uid} w={W} h={H} label="Five run durations with variance band and average" svg={<>
      <Surf id="card" x={40} y={24} w={400} h={308} r={22} tone="white" elev={3} seed={[240, 178]} />
      <Surf id="band" x={CXv(2.0)} y={94} w={CXv(2.8) - CXv(2.0)} h={180} r={8} tone="tint" elev={0} seed={[CXv(2.4), 184]} at={3.05} />
      {[0, 1, 2, 3].map(v => <Draw key={v} id={`g${v}`} d={`M${CXv(v) + .5} 96 V272`} stroke={v ? '#f1f5f9' : '#e2e8f0'} width={1} at={.85 + v * .04} dur={.5} />)}
      {RUNS.map((v, i) => <Draw key={i} id={`tr${i}`} d={`M${CX0 + 5} ${CRY(i)} H${CXv(3) - 5}`} stroke="#eef2f6" width={10} at={1.0 + i * .05} dur={.45} />)}
      {RUNS.map((v, i) => <path key={i} className={`rb rb${i}`} d={`M${CX0 + 5} ${CRY(i)} H${CXv(v) - 5}`} fill="none" stroke={BLUE} strokeWidth="10" strokeLinecap="round" />)}
      <g className="avgg"><path className="avg" d={`M${mx} 92 V276`} fill="none" stroke={DEEP} strokeWidth="2" strokeLinecap="round" /></g>
      <Surf id="badge" x={322} y={42} w={94} h={30} r={15} tone="greenTint" elev={0} seed={[369, 57]} at={3.25} />
    </>}>
      <Layer id="t" x={64} y={40} w={240} h={22} at={.7}><Text size={15.5} weight={600}>Consistency</Text></Layer>
      <Layer id="s" x={64} y={62} w={250} h={20} at={.76}><Text size={12.5} color={SUB}>Model A · 5 runs, same prompt</Text></Layer>
      {RUNS.map((v, i) => (
        <React.Fragment key={i}>
          <Layer id={`l${i}`} x={64} y={CRY(i) - 10} w={44} h={20} at={1.0 + i * .05}><Text size={12} weight={600} color={BODY} className="tnum">Run {i + 1}</Text></Layer>
          <Layer id={`v${i}`} x={352} y={CRY(i) - 10} w={60} h={20} at={1.05 + i * .05} align="right"><Text size={12.5} weight={600} color={MUTE} className={`tnum rv${i}`}>0.0 s</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="ax" x={CX0 - 20} y={280} w={CPX * 3 + 40} h={18} at={1.0}><span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>{['0 s', '1 s', '2 s', '3 s'].map(l => <Text key={l} size={10.5} weight={600} color={MUTE} className="tnum" style={{ width: 40, textAlign: 'center' }}>{l}</Text>)}</span></Layer>
      <Layer id="al" x={mx - 34} y={298} w={68} h={24} at={2.35} align="center"><span className="tnum avgl" style={{ ...pill(DEEP, '#fff'), height: 22 }}>avg 2.0 s</span></Layer>
      <Layer id="bt" x={322} y={42} w={94} h={30} at={3.42} align="center" className="gap6"><Icon name="target" size={16} color={GREEN} id="target" /><Text size={12.5} weight={700} color={GREEN_D} className="tnum">±0.4 s</Text></Layer>
    </Frame>
  );
}
ConsistencyTimer.motion = c => {
  RUNS.forEach((v, i) => {
    c.draw(`.rb${i}`, '0% 0%', '0% 100%', RUN_AT(i), RUN_D, 'power2.out');
    c.draw(`.rb${i}`, '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
    c.count(`.rv${i}`, 0, v, RUN_AT(i), RUN_D, x => `${x.toFixed(1)} s`, 'power2.out');
    c.fromTo(`.rv${i}`, { color: MUTE }, { color: INK, duration: .2 }, RUN_AT(i) + RUN_D);
  });
  const a0 = RUN_AT(0) + RUN_D - .05;
  c.fromTo('.avg', { opacity: 0 }, { opacity: 1, duration: .01 }, a0);
  c.draw('.avg', '50% 50%', '0% 100%', a0, .35, 'power2.out');
  c.draw('.avg', '0% 100%', '50% 50%', c.T.collapse + .05, .3, 'power2.in');
  c.fromTo('.avg', { opacity: 1 }, { opacity: 0, duration: .01 }, c.T.collapse + .35);
  // The average marker steps to the running mean after each run and settles at 2.4 s.
  const g = c.q('.avgg'), lab = c.q('[data-layer="al"]'), txt = c.q('.avgl'), E = c.ease('back.out(1.6)');
  c.after(t => {
    let x = CXv(MEANS[0]), m = MEANS[0];
    for (let k = 1; k < RUNS.length; k++) {
      const at = RUN_AT(k) + RUN_D - .1, p = cl((t - at) / .4);
      if (p > 0) { x = CXv(MEANS[k - 1]) + (CXv(MEANS[k]) - CXv(MEANS[k - 1])) * E(p); m = p >= .5 ? MEANS[k] : MEANS[k - 1]; }
    }
    const dx = (x - CXv(MEANS[0])).toFixed(2);
    g.setAttribute('transform', `translate(${dx} 0)`); lab.style.transform = `translateX(${dx}px)`;
    const s = `avg ${m.toFixed(1)} s`; if (txt.textContent !== s) txt.textContent = s;
  });
  c.icon('target', 0, 35, 3.45, .7);
};
Object.assign(ConsistencyTimer, {
  id: 'consistency-timer', title: 'Consistency timer', category: 'Benchmarks', w: W, h: H,
  focus: { x: 250, y: 190 }, push: 1.06, orbit: .9, exit: [240, 178],
  summary: 'Five runs fill their duration bars in turn while an average marker steps to the running mean and settles. A variance band forms around it and a consistency badge lands.',
  usage: `<ConsistencyTimer />`, icons: ['target']
});

export const LIST_A = [ScreenRecording, SplitScreen, PromptTyping, OutputComparison, TimerOverlay, WinnerStamp, VsBars, Leaderboard, ResultHighlight, ConsistencyTimer];
