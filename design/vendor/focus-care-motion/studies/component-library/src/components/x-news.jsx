// Explainer set: news and editorial. See EXPLAINER-BRIEF.md.
// Release notes, headline cards, pull quotes, timelines, funding, predictions, an illustrative
// viral clip, monogram logo tiles and document/paper close-ups. Every outlet, company and person
// is fictional. SVG surfaces form from seeds; HTML carriers hold Inter text and native icons.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect, rr } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', MUTE = '#94a3b8', BLUE = '#2d7dff';
const CAT = 'News & editorial';
const FONT = 'Inter, system-ui, sans-serif';
const pill = (bg, fg, extra) => ({ background: bg, color: fg, height: 22, padding: '0 9px', borderRadius: 11, fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: FONT, boxSizing: 'border-box', flex: 'none', ...extra });
const TAGS = { New: ['#e8f1ff', DEEP], Fixed: ['#dcfce7', '#15803d'], Improved: ['#fef3c7', '#a16207'] };
// Opaque HTML card backing, used where cards overlap so lower text never shows through.
const backing = (r = 18, shadow = '0 1px 2px rgba(15,23,42,.06), 0 10px 24px rgba(29,78,216,.10)') => ({ position: 'absolute', inset: 0, borderRadius: r, background: 'linear-gradient(#ffffff, #f9fbfe)', boxShadow: `inset 0 0 0 1px #e2e8f0, ${shadow}` });

// ---------------------------------------------------------------- Changelog scroll
const RELEASES = [
  ['v4.2.0', 'Nov 3, 2026', [['New', 'Shared reading lists for teams'], ['Improved', 'Faster sync on large libraries']]],
  ['v4.1.2', 'Oct 21, 2026', [['Fixed', 'Highlights lost after export'], ['Fixed', 'Sidebar contrast in dark mode']]],
  ['v4.1.0', 'Oct 8, 2026', [['New', 'Inline citations in notes'], ['Improved', 'Search ranks recent items first']]],
  ['v4.0.3', 'Sep 26, 2026', [['Fixed', 'Crash when importing large files'], ['Improved', 'Offline mode reliability']]],
  ['v4.0.0', 'Sep 12, 2026', [['New', 'Redesigned reader view'], ['New', 'Annotations sync across devices']]]
];
const CL = { x: 72, y: 92, w: 332, h: 222, row: 100, top: 6 };
const CL_TOTAL = CL.top + RELEASES.length * CL.row, CL_MAX = CL_TOTAL - CL.h;
const TRK = { y: 100, h: 206 }, THUMB = Math.round(TRK.h * CL.h / CL_TOTAL);
export function ChangelogScroll({ uid = 'changelog-scroll', releases = RELEASES }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Release notes list scrolling to the newest version" svg={<>
      <Surf id="card" x={60} y={24} w={360} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="ib" x={84} y={38} w={38} h={38} r={12} tone="tint" elev={0} seed={[103, 57]} order={1} />
      <Draw id="div" d="M60 88.5 H420" stroke="#eef2f6" width={1} at={.85} />
      <Surf id="hi" x={76} y={CL.y + CL.top} w={324} h={CL.row - 4} r={14} tone="tint" elev={0} seed={[96, CL.y + CL.top + 20]} at={3.0} />
      <Surf id="track" x={409} y={TRK.y} w={5} h={TRK.h} r={2.5} tone="muted" elev={0} seed={[411.5, TRK.y + TRK.h - 10]} at={.85} />
      <Surf id="thumb" x={409} y={TRK.y + TRK.h - THUMB} w={5} h={THUMB} r={2.5} tone="track" elev={0} seed={[411.5, TRK.y + TRK.h - 10]} at={.95} />
    </>}>
      <Layer id="ii" kind="icon" x={84} y={38} w={38} h={38} at={.85} align="center"><Icon name="fileText" size={20} color={DEEP} id="doc" /></Layer>
      <Layer id="t" x={134} y={38} w={220} h={20} at={.72}><Text size={15.5} weight={600}>What's new</Text></Layer>
      <Layer id="s" x={134} y={58} w={240} h={18} at={.78}><Text size={12.5} color={SUB}>Lumen Reader · release notes</Text></Layer>
      <Layer id="cnt" x={300} y={46} w={100} h={22} at={.9} align="right"><span style={pill('#f1f5f9', BODY)} className="tnum">5 releases</span></Layer>
      <Layer id="list" x={CL.x} y={CL.y} w={CL.w} h={CL.h} at={1.0}>
        <div style={{ position: 'relative', width: CL.w, height: CL.h, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 26px), transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 26px), transparent 100%)' }}>
          <div className="cl-list" style={{ position: 'absolute', left: 0, top: CL.top, width: CL.w }}>
            {releases.map(([v, d, items], i) => (
              <div key={v} style={{ height: CL.row, boxSizing: 'border-box', padding: '12px 14px 0 12px', borderTop: i ? '1px solid #f1f5f9' : '1px solid transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: 20, gap: 8 }}>
                  <Text size={14} weight={700} className="tnum">{v}</Text>
                  {i === 0 && <span className="cl-latest" style={pill(BLUE, '#fff', { height: 18, fontSize: 10.5, padding: '0 7px' })}>Latest</span>}
                  <Text size={12} color={SUB} className="tnum" style={{ marginLeft: 'auto' }}>{d}</Text>
                </div>
                {items.map(([tag, txt], k) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 24, marginTop: k ? 4 : 8 }}>
                    <span style={pill(TAGS[tag][0], TAGS[tag][1], { width: 72, height: 22 })}>{tag}</span>
                    <Text size={12.5} color={BODY}>{txt}</Text>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Layer>
    </Frame>
  );
}
ChangelogScroll.motion = c => {
  const ease = 'power3.inOut', at = 1.92, dur = 1.15;
  c.icon('doc', 0, 39, .9, 1.0);
  c.cursor([{ at: 1.45, x: 356, y: 262 }, { at: 1.84, x: 412, y: TRK.y + TRK.h - THUMB / 2, press: true }, { at: at + dur, x: 412, y: TRK.y + THUMB / 2 }, { at: 3.25, x: 300, y: 196 }]);
  c.fromTo('.cl-list', { y: -CL_MAX }, { y: 0, duration: dur, ease }, at);
  c.reshape('thumb', rect(409, TRK.y, 5, THUMB, 2.5), at, dur, ease);
  c.fromTo('[data-surf="thumb"] .body', { fill: '#cbd5e1' }, { fill: BLUE, duration: .2 }, 1.84);
  c.fromTo('[data-surf="thumb"] .body', { fill: BLUE }, { fill: '#cbd5e1', duration: .4 }, 3.3);
  c.fromTo('.cl-latest', { scale: 0 }, { scale: 1, duration: .5, ease: 'back.out(2.4)' }, 3.2);
};
Object.assign(ChangelogScroll, {
  id: 'changelog-scroll', title: 'Changelog scroll', category: CAT, w: W, h: H, focus: { x: 240, y: 170 }, push: 1.06, orbit: .9, exit: [240, 180],
  summary: 'Release notes scroll inside a clipped viewport as the thumb is dragged to the top. The newest version settles in a highlight with a Latest badge.',
  usage: `<ChangelogScroll releases={[['v4.2.0', 'Nov 3, 2026', [['New', 'Shared reading lists for teams']]], ...]} />`, icons: ['fileText']
});

// ---------------------------------------------------------------- Headline cards
// Index 0 sits at the back of the stack; the last card is on top and is the one that comes forward.
const STORIES = [
  ['H', 'Harbor Post', '#c2410c', 'Business', 'Northwind AI raises Series B to grow clinic tools', 'By Priya Raman · 3 min read', '2 h'],
  ['M', 'The Meridian', '#7c3aed', 'Technology', 'Care teams cut paperwork time by a third with shared notes', 'By Theo Lindqvist · 4 min read', '1 h'],
  ['L', 'Daily Ledger', '#0f766e', 'Health', 'State expands funding for community living programs', 'By Marisol Ortega · 5 min read', '3 h']
];
const HC = { x: 110, y: 110, w: 260, h: 168 }, HCX = HC.x + HC.w / 2, HCY = HC.y + HC.h / 2;
// Fanned arrival pose, a lifted beat for the chosen card, then a squared stack with it in front.
const FAN = [{ x: -54, y: 4, rotation: -8 }, { x: -4, y: -10, rotation: 1.5 }, { x: 44, y: 14, rotation: 7 }];
const LIFT = { x: 22, y: -4, rotation: 3, scale: 1.06 };
const SETTLE = [{ x: 0, y: -18, rotation: 0, scale: .9 }, { x: 0, y: -4, rotation: 0, scale: .95 }, { x: 0, y: 12, rotation: 0, scale: 1 }];
export function HeadlineCards({ uid = 'headline-cards', stories = STORIES }) {
  const top = stories.length - 1;
  return (
    <Frame uid={uid} w={W} h={H} label="Three news cards; one comes forward" svg={<>
      {stories.map((_, i) => <Surf key={i} id={`c${i}`} x={HC.x} y={HC.y} w={HC.w} h={HC.h} r={18} tone="white" elev={2} seed={[HCX, HCY + 30]} at={.12 + i * .14} />)}
    </>}>
      <Layer id="hd" x={HC.x} y={34} w={300} h={24} at={.7} className="gap8"><Text size={15.5} weight={600}>Morning briefing</Text><span style={pill('#f1f5f9', BODY)}>3 stories</span></Layer>
      {stories.map(([mono, outlet, col, cat, head, by, ago], i) => (
        <Layer key={i} id={`k${i}`} x={HC.x} y={HC.y} w={HC.w} h={HC.h} at={1.0 + (top - i) * .1} style={{ zIndex: i + 1 }}>
          <div style={{ position: 'relative', width: HC.w, height: HC.h }}>
            <div style={backing(18)} />
            <div style={{ position: 'absolute', left: 18, top: 16, right: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: col, color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>{mono}</span>
              <Text size={13} weight={600}>{outlet}</Text><Text size={12} color={MUTE} className="tnum">{ago}</Text>
              <span style={pill('#f1f5f9', BODY, { marginLeft: 'auto', height: 20, fontSize: 11 })}>{cat}</span>
            </div>
            <div style={{ position: 'absolute', left: 18, top: 54, width: 222 }}><Text size={16.5} weight={600} style={{ whiteSpace: 'normal', lineHeight: 1.3, display: 'block', letterSpacing: '-.012em' }}>{head}</Text></div>
            <div style={{ position: 'absolute', left: 18, bottom: 15 }}><Text size={12} color={SUB}>{by}</Text></div>
          </div>
        </Layer>
      ))}
      <Layer id="rd" x={HC.x} y={HC.y + HC.h + 26} w={HC.w} h={24} at={3.2} align="center" className="gap6" style={{ zIndex: 5 }}><Icon name="bookOpen" size={18} color={DEEP} id="read" /><Text size={12.5} weight={600} color={DEEP}>Now reading · {stories[top][1]}</Text></Layer>
    </Frame>
  );
}
HeadlineCards.motion = c => {
  const sv = { svgOrigin: `${HCX} ${HCY}` }, top = STORIES.length - 1;
  // Surface (SVG) and carrier (HTML) receive identical transforms so shadow and face stay locked.
  const both = (i, from, to, at) => {
    c.fromTo(`[data-surf="c${i}"]`, { ...from, ...sv }, { ...to, ...sv }, at);
    c.fromTo(`[data-layer="k${i}"]`, from, to, at);
  };
  STORIES.forEach((_, i) => {
    const f = { ...FAN[i], scale: 1 }, e = SETTLE[i];
    both(i, { x: 0, y: 26, rotation: 0, scale: 1 }, { ...f, duration: .85, ease: 'back.out(1.3)' }, .3 + i * .1);
    if (i === top) {
      both(i, f, { ...LIFT, duration: .36, ease: 'power3.out' }, 2.2);
      both(i, LIFT, { ...e, duration: .75, ease: 'back.out(1.4)' }, 2.56);
    } else {
      both(i, f, { ...e, duration: .8, ease: 'power3.inOut' }, 2.36 + (top - i) * .06);
    }
  });
  c.cursor([{ at: 1.75, x: 318, y: 300 }, { at: 2.12, x: 372, y: 252, press: true }]);
  c.icon('read', 0, 43, 3.25, 1.0);
  // Lower cards retract first so their text never shows through as the top card retracts.
  for (let i = 0; i < top; i++) c.hide(`k${i}`, c.T.collapse - .12 + i * .03, .22);
};
Object.assign(HeadlineCards, {
  id: 'headline-cards', title: 'Headline cards', category: CAT, w: W, h: H, focus: { x: 240, y: 190 }, push: 1.04, orbit: .85, exit: [240, 196],
  summary: 'Three outlet cards arrive fanned. Picking the top card lifts it, then it straightens in front while the others square up behind it so its headline reads.',
  usage: `<HeadlineCards stories={[['H', 'Harbor Post', '#c2410c', 'Business', 'Northwind AI raises…', 'By Priya Raman · 3 min read', '2 h'], ...]} />`, icons: ['bookOpen']
});

// ---------------------------------------------------------------- Quote card
const QLINES = ['Good care notes are not paperwork.', 'They are how the next shift', 'knows who you are.'];
const qmark = (x, y) => `M${x - 8.5} ${y + 1} C${x - 9} ${y - 12} ${x - 2} ${y - 22} ${x + 9} ${y - 26}`;
export function QuoteCard({ uid = 'quote-card', lines = QLINES, name = 'Dana Okafor', role = 'Director of care, Riverbend Homes', initials = 'DO' }) {
  return (
    <Frame uid={uid} w={W} h={H} label={`Pull quote from ${name}`} svg={<>
      <Surf id="card" x={50} y={28} w={380} h={304} r={24} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="q0" className="qt" d={qmark(92, 92)} stroke={BLUE} width={7} at={1.0} dur={.45} />
      <Draw id="q1" className="qt" d={qmark(122, 92)} stroke={BLUE} width={7} at={1.12} dur={.45} />
      <Pop id="d0" at={1.3}><circle cx={92} cy={92} r={9.5} fill={BLUE} /></Pop>
      <Pop id="d1" at={1.42}><circle cx={122} cy={92} r={9.5} fill={BLUE} /></Pop>
      <Draw id="rule" d="M78 246.5 H402" stroke="#eef2f6" width={1} at={2.75} dur={.5} />
      <Surf id="av" x={78} y={262} w={46} h={46} r={23} tone="tint" elev={1} seed={[101, 285]} at={2.85} />
    </>}>
      <Layer id="tag" x={300} y={62} w={102} h={22} at={.9} align="right"><span style={pill('#f1f5f9', BODY)}>Interview</span></Layer>
      {lines.map((l, i) => (
        <Layer key={i} id={`l${i}`} x={78} y={124 + i * 34} w={330} h={32} at={1.78 + i * .24}>
          <Text size={19.5} weight={600} style={{ letterSpacing: '-.018em' }}>{i === lines.length - 1 ? <span className="q-mark" style={{ backgroundImage: 'linear-gradient(#dbeafe, #dbeafe)', backgroundRepeat: 'no-repeat', backgroundPosition: '0 88%', backgroundSize: '0% 42%', padding: '0 2px', margin: '0 -2px' }}>{l}</span> : l}</Text>
        </Layer>
      ))}
      <Layer id="ai" x={78} y={262} w={46} h={46} at={3.05} align="center"><Text size={15} weight={700} color={DEEP}>{initials}</Text></Layer>
      <Layer id="nm" x={138} y={262} w={260} h={46} at={3.12}><span className="stack"><Text size={15} weight={600}>{name}</Text><Text size={12.5} color={SUB}>{role}</Text></span></Layer>
    </Frame>
  );
}
QuoteCard.motion = c => {
  c.fromTo('.q-mark', { backgroundSize: '0% 42%' }, { backgroundSize: '100% 42%', duration: .6, ease: 'power2.inOut' }, 2.62);
};
Object.assign(QuoteCard, {
  id: 'quote-card', title: 'Quote card', category: CAT, w: W, h: H, focus: { x: 230, y: 175 }, push: 1.08, exit: [240, 180],
  summary: 'Quote marks draw on, the pull quote reveals line by line and its last phrase is marked, then the attribution settles with an initials avatar.',
  usage: `<QuoteCard lines={['Good care notes are not paperwork.', ...]} name="Dana Okafor" role="Director of care, Riverbend Homes" initials="DO" />`, icons: []
});

// ---------------------------------------------------------------- Event timeline
const MILE = [['Pilot', 'Jan 14'], ['12 homes', 'Mar 2'], ['Review', 'Jun 18'], ['Rollout', 'Today'], ['Audit', 'Dec 9']];
const EX = i => 88 + i * 76, EAY = 132, NOW = 3;
export function EventTimeline({ uid = 'event-timeline', milestones = MILE }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Program timeline with a playhead moving to today" svg={<>
      <Surf id="card" x={40} y={26} w={400} h={290} r={22} tone="white" elev={3} seed={[240, 172]} />
      <Draw id="axis" d={`M${EX(0)} ${EAY} H${EX(4)}`} stroke="#e2e8f0" width={3} at={.9} dur={.7} />
      <path className="prog" d={`M${EX(0)} ${EAY} H${EX(NOW)}`} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      {milestones.map((_, i) => <Pop key={i} id={`m${i}`} at={1.05 + i * .09} ease="back.out(3)"><circle className={`md md${i}`} cx={EX(i)} cy={EAY} r={6.5} fill={i === 4 ? '#fff' : '#fff'} stroke={i === 4 ? '#cbd5e1' : '#94a3b8'} strokeWidth="2.5" strokeDasharray={i === 4 ? '3 3' : undefined} /></Pop>)}
      <Draw id="stem" d={`M${EX(NOW)} ${EAY + 12} V178`} stroke="#bfdbfe" width={2} at={2.95} dur={.25} />
      <Surf id="ev" x={EX(NOW) - 62} y={178} w={124} h={32} r={16} tone="tint" elev={1} seed={[EX(NOW), 194]} at={1.4} />
      <Surf id="evi" x={80} y={196} w={40} h={40} r={12} tone="white" elev={1} seed={[100, 216]} at={3.25} />
      <Pop id="ph" at={1.7} origin="50% 100%"><g className="ph">
        <circle className="ph-ring" cx={EX(0)} cy={EAY} r={10} fill="none" stroke={BLUE} strokeWidth="2" opacity="0" />
        <path d={`M${EX(0)} ${EAY - 22} V${EAY - 12}`} stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
        <circle cx={EX(0)} cy={EAY} r={9} fill="#fff" stroke={BLUE} strokeWidth="3" />
        <circle cx={EX(0)} cy={EAY} r={3.5} fill={BLUE} />
      </g></Pop>
    </>}>
      <Layer id="t" x={64} y={42} w={240} h={20} at={.72}><Text size={15.5} weight={600}>Riverbend rollout</Text></Layer>
      <Layer id="s" x={64} y={62} w={240} h={18} at={.78}><Text size={12.5} color={SUB}>Program timeline · 2026</Text></Layer>
      <Layer id="n" x={296} y={46} w={120} h={24} at={.85} align="right"><span style={pill('#f1f5f9', BODY)} className="tnum">5 milestones</span></Layer>
      {milestones.map(([l, d], i) => (
        <React.Fragment key={i}>
          <Layer id={`ml${i}`} x={EX(i) - 38} y={EAY - 44} w={76} h={18} at={1.1 + i * .09} align="center"><Text size={12} weight={600} color={i === 4 ? MUTE : BODY} className={`mlt mlt${i}`}>{l}</Text></Layer>
          <Layer id={`md${i}`} x={EX(i) - 38} y={EAY + 14} w={76} h={18} at={1.14 + i * .09} align="center">{i === NOW ? <span style={pill('#e8f1ff', DEEP, { height: 20, fontSize: 11 })}>{d}</span> : <Text size={11.5} weight={500} color={i === 4 ? MUTE : SUB} className="tnum">{d}</Text>}</Layer>
        </React.Fragment>
      ))}
      <Layer id="evp" x={EX(NOW) - 62} y={178} w={124} h={32} at={1.6} align="center"><Text size={12} weight={600} color={DEEP}>Statewide rollout</Text></Layer>
      <Layer id="evc" kind="icon" x={80} y={196} w={40} h={40} at={3.35} align="center"><Icon name="flag" size={20} color={DEEP} id="flag" /></Layer>
      <Layer id="evt" x={132} y={192} w={270} h={46} at={3.38}><span className="stack"><Text size={15} weight={600}>Statewide rollout begins</Text><Text size={12.5} color={SUB} className="tnum">Nov 4 · 48 homes across 6 regions</Text></span></Layer>
      <Layer id="evx" x={80} y={250} w={320} h={24} at={3.5} className="gap8"><span style={pill('#dcfce7', '#15803d', { gap: 6 })}><span className="live-dot" style={{ width: 6, height: 6, boxShadow: 'none' }} />Live now</span><span style={pill('#ffffff', BODY, { boxShadow: 'inset 0 0 0 1px #e2e8f0' })} className="tnum">44 of 48 homes onboarded</span></Layer>
    </Frame>
  );
}
EventTimeline.motion = c => {
  const at = 1.9, dur = 1.0, ease = 'power2.inOut', E = c.ease(ease), ph = c.q('.ph');
  c.draw('.prog', '0% 0%', '0% 100%', at, dur, ease);
  c.draw('.prog', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  c.after(t => { const p = Math.min(1, Math.max(0, (t - at) / dur)); ph.setAttribute('transform', `translate(${((EX(NOW) - EX(0)) * E(p)).toFixed(3)} 0)`); });
  // Each milestone fills as the playhead passes it.
  for (let i = 0; i <= NOW; i++) {
    const x = (EX(i) - EX(0)) / (EX(NOW) - EX(0)), tp = at + dur * (x < .5 ? Math.sqrt(x / 2) : 1 - Math.sqrt((1 - x) / 2));
    c.fromTo(`.md${i}`, { fill: '#ffffff', stroke: '#94a3b8' }, { fill: BLUE, stroke: BLUE, duration: .15 }, tp);
    c.fromTo(`.mlt${i}`, { color: BODY }, { color: INK, duration: .15 }, tp);
  }
  c.fromTo('.ph-ring', { scale: 1, opacity: .7, transformOrigin: '50% 50%' }, { scale: 2.2, opacity: 0, duration: .8, ease: 'power2.out' }, at + dur);
  c.hide('evp', 2.82, .14);
  c.reshape('ev', rect(64, 178, 352, 110, 18), 2.96, .6, 'back.out(1.15)');
  c.icon('flag', 0, 39, 3.4, 1.0);
};
Object.assign(EventTimeline, {
  id: 'event-timeline', title: 'Event timeline', category: CAT, w: W, h: H, focus: { x: 240, y: 190 }, push: 1.06, orbit: .9, exit: [240, 180],
  summary: 'Dated milestones pop onto a horizontal axis. A playhead travels to Today, filling each milestone it passes, and the current event expands into a card.',
  usage: `<EventTimeline milestones={[['Pilot', 'Jan 14'], ['12 homes', 'Mar 2'], ...]} />`, icons: ['flag']
});

// ---------------------------------------------------------------- Funding counter
const ROUNDS = [['Seed', 6, 30], ['Series A', 34, 62], ['Series B', 214, 104], ['Series C', 1200, 160]];
const FX = i => 64 + i * 88, FW = 86, FB = 306, FT = [1.9, 2.25, 2.6, 2.95];
const money = v => (v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${Math.round(v)}M`);
export function FundingCounter({ uid = 'funding-counter', rounds = ROUNDS }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Total funding counting up to 1.2 billion dollars" svg={<>
      <Surf id="card" x={40} y={24} w={400} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="logo" x={64} y={44} w={36} h={36} r={10} tone="ink" elev={1} seed={[82, 62]} order={1} />
      <Draw id="base" d={`M60 ${FB + .5} H420`} stroke="#e2e8f0" width={1} at={1.0} />
      {rounds.map(([, , h], i) => <Surf key={i} id={`b${i}`} x={FX(i)} y={FB - h} w={FW} h={h} r={10} tone={i === 3 ? 'blue' : 'tint'} elev={0} seed={[FX(i) + FW / 2, FB - 5]} at={FT[i]} />)}
    </>}>
      <Layer id="li" x={64} y={44} w={36} h={36} at={.8} align="center"><Text size={16} weight={700} color="#fff">N</Text></Layer>
      <Layer id="ln" x={112} y={42} w={220} h={40} at={.84}><span className="stack"><Text size={14.5} weight={600}>Northwind AI</Text><Text size={12} color={SUB}>Total funding raised</Text></span></Layer>
      <Layer id="v" x={64} y={92} w={260} h={54} at={.95}><Text size={46} weight={700} className="tnum fund" style={{ letterSpacing: '-.04em' }}>$0M</Text></Layer>
      <Layer id="rc" x={64} y={146} w={220} h={20} at={1.0}><Text size={12.5} color={SUB} className="tnum rcount">No rounds yet</Text></Layer>
      {rounds.map(([r, tot, h], i) => {
        const raised = tot - (i ? rounds[i - 1][1] : 0);
        return (
          <React.Fragment key={i}>
            <Layer id={`c${i}`} x={FX(i)} y={FB - h - 30} w={FW} h={24} at={FT[i] + .3} align="center"><span style={pill(i === 3 ? DEEP : '#ffffff', i === 3 ? '#fff' : BODY, { boxShadow: i === 3 ? '0 4px 10px rgba(29,78,216,.25)' : 'inset 0 0 0 1px #e2e8f0, 0 2px 6px rgba(15,23,42,.06)' })}>{r}</span></Layer>
            <Layer id={`a${i}`} x={FX(i)} y={FB - 26} w={FW} h={20} at={FT[i] + .36} align="center"><Text size={12.5} weight={700} color={i === 3 ? '#fff' : DEEP} className="tnum">{money(raised)}</Text></Layer>
          </React.Fragment>
        );
      })}
    </Frame>
  );
}
FundingCounter.motion = c => {
  const el = c.q('.fund'), E = c.ease('power2.out'), totals = ROUNDS.map(r => r[1]);
  c.after(t => {
    let v = 0;
    FT.forEach((a, i) => { const p = Math.min(1, Math.max(0, (t - a - .1) / .5)); if (t >= a + .1) v = (i ? totals[i - 1] : 0) + (totals[i] - (i ? totals[i - 1] : 0)) * E(p); });
    el.textContent = money(v);
  });
  c.swap('.rcount', ['No rounds yet', 'Seed round', 'Seed and Series A', '3 rounds · last Series B', '4 rounds · Series C closed Nov 2026'], FT.map(a => a + .3));
};
Object.assign(FundingCounter, {
  id: 'funding-counter', title: 'Funding counter', category: CAT, w: W, h: H, focus: { x: 240, y: 200 }, push: 1.06, exit: [240, 180],
  summary: 'Total funding counts up in tabular figures as each round steps the bar higher, from Seed to a Series C that takes the total to $1.2B.',
  usage: `<FundingCounter rounds={[['Seed', 6, 30], ['Series A', 34, 62], ['Series B', 214, 104], ['Series C', 1200, 160]]} />`, icons: []
});

// ---------------------------------------------------------------- Prediction cards
const PRED = [['Policy', 'Most states adopt digital visit logs', 72, 'checkCircle'], ['Workforce', 'Direct care wages rise 8 percent', 58, 'trendingUp'], ['Technology', 'Voice notes outpace typed notes', 86, 'zap']];
const PX = i => 46 + i * 134, PY = 92, PW = 120, PH = 196, FLIP = [1.9, 2.25, 2.6];
export function PredictionCards({ uid = 'prediction-cards', items = PRED }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Three prediction cards flip to reveal confidence" svg={<>
      {items.map((_, i) => <Surf key={i} id={`p${i}`} x={PX(i)} y={PY} w={PW} h={PH} r={18} tone="blue" elev={3} seed={[PX(i) + PW / 2, PY + PH / 2]} at={.15 + i * .1} />)}
      {items.map(([, , v], i) => <React.Fragment key={i}>
        <Draw id={`tr${i}`} d={`M${PX(i) + 14} ${PY + PH - 20} H${PX(i) + PW - 14}`} stroke="#e8edf3" width={5} at={FLIP[i] + .5} dur={.3} />
        <Draw id={`fl${i}`} d={`M${PX(i) + 14} ${PY + PH - 20} H${PX(i) + 14 + (PW - 28) * v / 100}`} stroke={v >= 80 ? '#16a34a' : BLUE} width={5} at={FLIP[i] + .62} dur={.6} />
      </React.Fragment>)}
    </>}>
      <Layer id="t" x={46} y={36} w={260} h={22} at={.7}><Text size={15.5} weight={600}>2027 outlook</Text></Layer>
      <Layer id="s" x={46} y={58} w={300} h={18} at={.76}><Text size={12.5} color={SUB}>Analyst desk · three calls for next year</Text></Layer>
      {items.map(([cat, txt, v, ic], i) => (
        <React.Fragment key={i}>
          <Layer id={`f${i}`} x={PX(i)} y={PY} w={PW} h={PH} at={.95 + i * .08}>
            <div className={`pf pf${i}`} style={{ position: 'relative', width: PW, height: PH }}>
              <div style={{ position: 'absolute', left: 14, top: 14 }}><Text size={12} weight={600} color="rgba(255,255,255,.72)" className="tnum">0{i + 1}</Text></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}><Icon name="help" size={34} color="#fff" id={`h${i}`} /><Text size={12.5} weight={600} color="#fff">{cat}</Text></div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, textAlign: 'center' }}><Text size={11} weight={500} color="rgba(255,255,255,.72)">Sealed prediction</Text></div>
            </div>
          </Layer>
          <Layer id={`r${i}`} x={PX(i)} y={PY} w={PW} h={PH} at={FLIP[i] + .1}>
            <div className={`pb pb${i}`} style={{ position: 'relative', width: PW, height: PH }}>
              <div style={{ position: 'absolute', left: 14, top: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name={ic} size={16} color={v >= 80 ? '#16a34a' : DEEP} id={`ic${i}`} /><Text size={11.5} weight={600} color={SUB}>{cat}</Text></div>
              <div style={{ position: 'absolute', left: 14, top: 44, width: PW - 26 }}><Text size={14} weight={600} style={{ whiteSpace: 'normal', lineHeight: 1.3, display: 'block', letterSpacing: '-.01em' }}>{txt}</Text></div>
              <div style={{ position: 'absolute', left: 14, top: 114 }} className="stack"><Text size={24} weight={700} color={v >= 80 ? '#15803d' : INK} className={`tnum pv${i}`} style={{ letterSpacing: '-.03em' }}>0%</Text><Text size={11.5} weight={500} color={SUB}>confidence</Text></div>
            </div>
          </Layer>
        </React.Fragment>
      ))}
      <Layer id="ft" x={46} y={300} w={388} h={20} at={3.4} className="gap6"><span className="legend"><i style={{ background: '#16a34a' }} />High confidence</span><Text size={12} color={MUTE}>·</Text><Text size={12} color={SUB}>Median of 14 analysts</Text></Layer>
    </Frame>
  );
}
PredictionCards.motion = c => {
  const half = .26, back = .5, Ein = c.ease('power2.in'), Eout = c.ease('back.out(1.6)');
  const U = c.surf('p0').querySelector('.body').getAttribute('fill').match(/url\(#(.*)-blue\)/)[1];
  PRED.forEach(([, , v], i) => {
    const a = FLIP[i], g = c.surf(`p${i}`), cx = PX(i) + PW / 2;
    c.icon(`h${i}`, 0, 9, .95 + i * .08 + .3, .6);
    c.fromTo(`.pf${i}`, { rotationY: 0, transformPerspective: 700 }, { rotationY: 90, transformPerspective: 700, duration: half, ease: 'power2.in' }, a);
    c.fromTo(`.pb${i}`, { rotationY: -90, transformPerspective: 700 }, { rotationY: 0, transformPerspective: 700, duration: back, ease: 'back.out(1.6)' }, a + half);
    // Surface turns with the carriers: its width follows cos(angle), and its face switches to white edge-on.
    c.after(t => {
      let ang = 0;
      if (t >= a && t < a + half) ang = 90 * Ein((t - a) / half);
      else if (t >= a + half) ang = -90 * (1 - Eout(Math.min(1, (t - a - half) / back)));
      const sx = Math.max(.002, Math.abs(Math.cos(ang * Math.PI / 180)));
      g.setAttribute('transform', sx > .9999 ? '' : `translate(${cx} 0) scale(${sx.toFixed(4)} 1) translate(${-cx} 0)`);
      const white = t >= a + half;
      g.querySelector('.body').setAttribute('fill', `url(#${U}-${white ? 'white' : 'blue'})`);
      g.querySelector('.hl').setAttribute('stroke', `url(#${U}-${white ? 'hl' : 'hl-blue'})`);
      g.querySelector('.sh-a').setAttribute('fill', white ? 'rgba(29,78,216,.13)' : 'rgba(45,125,255,.34)');
      g.querySelector('.edge').setAttribute('stroke', white ? '#e2e8f0' : 'rgba(15,23,42,.10)');
    });
    c.count(`.pv${i}`, 0, v, a + .62, .6, x => `${Math.round(x)}%`, 'power2.out');
    c.icon(`ic${i}`, 0, 30, a + .5, .8);
  });
};
Object.assign(PredictionCards, {
  id: 'prediction-cards', title: 'Prediction cards', category: CAT, w: W, h: H, focus: { x: 240, y: 190 }, push: 1.02, orbit: .8, exit: [240, 190],
  summary: 'Three sealed cards flip on their carriers in turn. Each reveals a prediction with a confidence figure that counts up beside a small bar.',
  usage: `<PredictionCards items={[['Policy', 'Most states adopt digital visit logs', 72, 'checkCircle'], ...]} />`, icons: ['help', 'checkCircle', 'trendingUp', 'zap']
});

// ---------------------------------------------------------------- Viral clip
const SCR = { x: 54, y: 32, w: 164, h: 296 };
const fmtN = v => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e4 ? `${Math.round(v / 1e3)}K` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : `${Math.round(v)}`);
const STATS = [['visibility', 2.4e6, 'views'], ['thumbUp', 318e3, 'likes'], ['share', 41.6e3, 'shares']];
const VY = i => 98 + i * 54;
const SPARK = (() => { const p = []; for (let i = 0; i <= 12; i++) { const x = 268 + i * 13, k = i / 12; p.push(`${i ? 'L' : 'M'}${x} ${(300 - 44 * (Math.exp(3.2 * k) - 1) / (Math.exp(3.2) - 1)).toFixed(2)}`); } return p.join(' '); })();
export function ViralClip({ uid = 'viral-clip' }) {
  const L = (x, y) => [SCR.x + x, SCR.y + y];
  return (
    <Frame uid={uid} w={W} h={H} label="Illustrative vertical video with fast rising view, like and share counters" svg={<>
      <defs>
        <clipPath id={`${uid}-scr`}><path d={rr(SCR.x, SCR.y, SCR.w, SCR.h, 20)} /></clipPath>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cb6ff" /><stop offset=".7" stopColor="#d6e8ff" /><stop offset="1" stopColor="#fef3c7" /></linearGradient>
        <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f172a" stopOpacity="0" /><stop offset="1" stopColor="#0f172a" stopOpacity=".55" /></linearGradient>
      </defs>
      <Surf id="phone" x={SCR.x - 6} y={SCR.y - 6} w={SCR.w + 12} h={SCR.h + 12} r={26} tone="ink" elev={3} seed={[136, 180]} />
      <g className="vc-scene" clipPath={`url(#${uid}-scr)`}>
        <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} fill={`url(#${uid}-sky)`} />
        <circle cx={L(130, 0)[0]} cy={L(0, 50)[1]} r={26} fill="#fde68a" opacity=".35" />
        <circle cx={L(130, 0)[0]} cy={L(0, 50)[1]} r={17} fill="#fde68a" />
        <g className="vc-cloud1"><ellipse cx={L(40, 0)[0]} cy={L(0, 66)[1]} rx={22} ry={8} fill="#fff" opacity=".92" /><ellipse cx={L(52, 0)[0]} cy={L(0, 60)[1]} rx={13} ry={9} fill="#fff" opacity=".92" /></g>
        <g className="vc-cloud2"><ellipse cx={L(36, 0)[0]} cy={L(0, 106)[1]} rx={18} ry={6} fill="#fff" opacity=".8" /></g>
        <path d={`M${SCR.x} ${SCR.y + 214} C${SCR.x + 50} ${SCR.y + 206} ${SCR.x + 110} ${SCR.y + 210} ${SCR.x + SCR.w} ${SCR.y + 204} V${SCR.y + SCR.h} H${SCR.x} Z`} fill="#3b82f6" />
        <path d={`M${SCR.x} ${SCR.y + 222} C${SCR.x + 60} ${SCR.y + 216} ${SCR.x + 120} ${SCR.y + 220} ${SCR.x + SCR.w} ${SCR.y + 214}`} fill="none" stroke="#bfdbfe" strokeWidth="1.5" opacity=".7" />
        <path d={`M${SCR.x} ${SCR.y + 250} C${SCR.x + 50} ${SCR.y + 232} ${SCR.x + 120} ${SCR.y + 240} ${SCR.x + SCR.w} ${SCR.y + 236} V${SCR.y + SCR.h} H${SCR.x} Z`} fill="#fcd34d" />
        <path className="vc-string" d="" fill="none" stroke="#0f172a" strokeWidth="1" opacity=".55" />
        <g className="vc-kite">
          <path className="vc-tail" d="" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M0 -22 L15 0 L0 30 L-15 0 Z" fill="#ef4444" />
          <path d="M0 -22 L15 0 L0 30 Z" fill="#dc2626" />
          <path d="M0 -22 V30 M-15 0 H15" stroke="#fff" strokeWidth="1.2" opacity=".75" />
        </g>
        <rect x={SCR.x} y={SCR.y + 196} width={SCR.w} height={100} fill={`url(#${uid}-shade)`} />
      </g>
      <Draw id="ptrack" d={`M${SCR.x + 14} ${SCR.y + 282} H${SCR.x + SCR.w - 14}`} stroke="rgba(255,255,255,.35)" width={3} at={1.2} dur={.4} />
      <path className="vc-prog" d={`M${SCR.x + 14} ${SCR.y + 282} H${SCR.x + SCR.w - 14}`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <Surf id="play" x={110} y={154} w={52} h={52} r={26} tone="glass" elev={2} seed={[136, 180]} at={1.0} />
      <Surf id="panel" x={240} y={26} w={196} h={308} r={22} tone="white" elev={3} seed={[338, 180]} order={1} />
      {STATS.map((_, i) => <Surf key={i} id={`st${i}`} x={260} y={VY(i)} w={40} h={40} r={12} tone="tint" elev={0} seed={[280, VY(i) + 20]} at={1.05 + i * .08} />)}
      <Draw id="spark" d={SPARK} stroke={BLUE} width={2.5} at={2.15} dur={1.6} />
      <Pop id="sdot" at={3.7}><circle cx={424} cy={256} r={4.5} fill="#fff" stroke={BLUE} strokeWidth="2.5" /></Pop>
    </>}>
      <Layer id="tag" x={SCR.x + 10} y={SCR.y + 10} w={90} h={22} at={1.1}><span style={pill('rgba(15,23,42,.62)', '#fff', { height: 20, fontSize: 10.5, padding: '0 8px' })}>Illustrative</span></Layer>
      <Layer id="cap" x={SCR.x + 14} y={SCR.y + 236} w={SCR.w - 24} h={36} at={1.2}><span className="stack"><Text size={12} weight={600} color="#fff">@pebblebaykites</Text><Text size={11} color="rgba(255,255,255,.86)">Kite day at Pebble Bay</Text></span></Layer>
      <Layer id="pp" kind="icon" x={110} y={154} w={52} h={52} at={1.15} align="center"><Icon name="playPause" size={26} color={DEEP} id="pp" /></Layer>
      <Layer id="t" x={260} y={42} w={170} h={20} at={.8}><Text size={15.5} weight={600}>Trending now</Text></Layer>
      <Layer id="s" x={260} y={62} w={170} h={18} at={.86}><Text size={12} color={SUB}>Northside Social · 6 h</Text></Layer>
      {STATS.map(([ic, , lab], i) => (
        <React.Fragment key={i}>
          <Layer id={`si${i}`} kind="icon" x={260} y={VY(i)} w={40} h={40} at={1.2 + i * .08} align="center"><Icon name={ic} size={20} color={DEEP} id={`si${i}`} /></Layer>
          <Layer id={`sv${i}`} x={312} y={VY(i) - 2} w={116} h={44} at={1.25 + i * .08}><span className="stack"><Text size={21} weight={700} className={`tnum vv${i}`} style={{ letterSpacing: '-.025em' }}>0</Text><Text size={11.5} color={SUB}>{lab}</Text></span></Layer>
        </React.Fragment>
      ))}
      <Layer id="sl" x={260} y={306} w={170} h={18} at={1.4} className="gap6"><Text size={11.5} color={SUB}>Views per hour</Text><span className="vc-up" style={pill('#dcfce7', '#15803d', { height: 18, fontSize: 10.5, padding: '0 7px' })}>Viral</span></Layer>
    </Frame>
  );
}
ViralClip.motion = c => {
  const play = 2.1, run = 1.9, Eo = c.ease('power2.out');
  c.rest('pp', 7);
  c.cursor([{ at: 2.0, x: 146, y: 192, press: true }]);
  c.press('play', '[data-layer="pp"]', 2.0, 1);
  c.icon('pp', 7, 0, 2.06, .3);
  c.fromTo('.vc-scene', { opacity: 0 }, { opacity: 1, duration: .5, ease: 'none' }, .75);
  c.fromTo('.vc-scene', { opacity: 1 }, { opacity: 0, duration: .3, ease: 'none' }, c.T.collapse + .05);
  c.draw('.vc-prog', '0% 0%', '0% 58%', play, run, 'power1.out');
  c.draw('.vc-prog', '0% 58%', '0% 0%', c.T.collapse + .02, .3, 'power2.in');
  const kite = c.q('.vc-kite'), tail = c.q('.vc-tail'), str = c.q('.vc-string'), c1 = c.q('.vc-cloud1'), c2 = c.q('.vc-cloud2');
  // The clip "plays" on a clock that eases to rest by the hold, so the frame is still from 4.05 s.
  c.after(t => {
    const u = 2.2 * Eo(Math.min(1, Math.max(0, (t - play) / run)));
    const kx = SCR.x + 122 + 8 * Math.sin(u * 2.4), ky = SCR.y + 112 + 7 * Math.sin(u * 3.3 + .6), rot = 10 + 7 * Math.sin(u * 2.8);
    kite.setAttribute('transform', `translate(${kx.toFixed(2)} ${ky.toFixed(2)}) rotate(${rot.toFixed(2)})`);
    let d = 'M0 30';
    for (let k = 1; k <= 5; k++) d += ` Q${(k % 2 ? 7 : -7) * Math.cos(u * 4 + k)} ${30 + k * 8 - 4} 0 ${30 + k * 8}`;
    tail.setAttribute('d', d);
    const r = rot * Math.PI / 180, bx = kx - 30 * Math.sin(r), by = ky + 30 * Math.cos(r);
    str.setAttribute('d', `M${bx.toFixed(2)} ${by.toFixed(2)} Q${(bx - 30).toFixed(2)} ${(by + 70).toFixed(2)} ${SCR.x + 18} ${SCR.y + SCR.h + 10}`);
    c1.setAttribute('transform', `translate(${(-10 * u).toFixed(2)} 0)`); c2.setAttribute('transform', `translate(${(7 * u).toFixed(2)} 0)`);
  });
  STATS.forEach(([ic, v], i) => {
    c.count(`.vv${i}`, 0, v, play + .1 + i * .08, 1.6, fmtN, 'expo.in');
    if (ic === 'share') c.icon(`si${i}`, 0, 74, play + .3, 1.4);
    if (ic !== 'share') c.rest(`si${i}`, 0);
  });
  c.fromTo('.vc-up', { scale: 0 }, { scale: 1, duration: .45, ease: 'back.out(2.4)' }, 3.7);
};
Object.assign(ViralClip, {
  id: 'viral-clip', title: 'Viral clip', category: CAT, w: W, h: H, focus: { x: 240, y: 180 }, push: 1.04, orbit: .9, exit: [240, 180],
  summary: 'An illustrative vertical clip starts playing from its control while view, like and share counters rocket up beside an exponential views curve.',
  usage: `<ViralClip />  // vector scene, tagged Illustrative`, icons: ['playPause', 'visibility', 'thumbUp', 'share']
});

// ---------------------------------------------------------------- Logo cards
const COS = [['N', 'Northwind AI', 'Clinic software', ['#3f8cff', '#1d4ed8']], ['A', 'Alder Labs', 'Diagnostics', ['#22c55e', '#15803d']], ['Q', 'Quillstack', 'Documents', ['#a78bfa', '#6d28d9']],
  ['B', 'Brightpath', 'Scheduling', ['#fbbf24', '#d97706']], ['K', 'Kestrel Health', 'Home care', ['#2dd4bf', '#0f766e']], ['O', 'Orbitry', 'Payments', ['#fb7185', '#be123c']]];
const LGX = i => 60 + (i % 3) * 124, LGY = i => 92 + Math.floor(i / 3) * 118, LW = 112, LH = 100, SEL = 4;
export function LogoCards({ uid = 'logo-cards', companies = COS }) {
  const sx = LGX(SEL) - 3, sy = LGY(SEL) - 6;
  return (
    <Frame uid={uid} w={W} h={H} label="Grid of fictional company monogram tiles with one selected" svg={<>
      <Surf id="card" x={40} y={24} w={400} h={312} r={22} tone="white" elev={3} seed={[240, 180]} />
      {companies.map((_, i) => <Surf key={i} id={`t${i}`} x={LGX(i)} y={LGY(i)} w={LW} h={LH} r={16} tone={i === SEL ? 'white' : 'muted'} elev={i === SEL ? 1 : 0} seed={[LGX(i) + LW / 2, LGY(i) + LH / 2]} at={.9 + i * .07} />)}
      <Draw id="ring" d={rr(sx - 4, sy - 4, LW + 14, LH + 14, 21)} stroke={BLUE} width={2} at={2.55} dur={.5} />
    </>}>
      <Layer id="t" x={60} y={40} w={240} h={20} at={.72}><Text size={15.5} weight={600}>Portfolio</Text></Layer>
      <Layer id="s" x={60} y={60} w={240} h={18} at={.78}><Text size={12.5} color={SUB}>Aldercrest Capital · 6 companies</Text></Layer>
      <Layer id="n" x={276} y={44} w={144} h={24} at={.85} align="right"><span className="lg-pill" style={pill('#f1f5f9', BODY)}>Pick a company</span></Layer>
      <Layer id="n2" x={276} y={44} w={144} h={24} at={2.62} align="right"><span style={pill('#e8f1ff', DEEP)}>Kestrel Health</span></Layer>
      {companies.map(([m, name, sec, [a, b]], i) => (
        <Layer key={i} id={`l${i}`} x={LGX(i)} y={LGY(i)} w={LW} h={LH} at={1.1 + i * .07} align="center">
          <span className={`lg lg${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(${a}, ${b})`, boxShadow: `0 4px 10px ${b}40, inset 0 1px 0 rgba(255,255,255,.35)`, color: '#fff', fontSize: 19, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, letterSpacing: '-.02em' }}>{m}</span>
            <Text size={13} weight={600} style={{ marginTop: 9 }}>{name}</Text>
            <Text size={11.5} color={SUB}>{sec}</Text>
          </span>
        </Layer>
      ))}
      <Layer id="ok" kind="icon" x={sx + LW - 22} y={sy + 4} w={24} h={24} at={2.62} align="center"><Icon name="checkCircle" size={20} color={BLUE} id="ok" /></Layer>
    </Frame>
  );
}
LogoCards.motion = c => {
  const x = LGX(SEL), y = LGY(SEL);
  c.cursor([{ at: 2.3, x: x + 88, y: y + 84, press: true }]);
  c.press(`t${SEL}`, `[data-layer="l${SEL}"] .lg`, 2.3, .8);
  c.reshape(`t${SEL}`, rect(x - 3, y - 6, LW + 6, LH + 6, 18), 2.42, .5, 'back.out(1.6)');
  c.fromTo(`[data-layer="l${SEL}"]`, { y: 0 }, { y: -4, duration: .5, ease: 'back.out(1.6)' }, 2.42);
  COS.forEach((_, i) => { if (i !== SEL) c.fromTo(`.lg${i}`, { opacity: 1 }, { opacity: .42, duration: .35 }, 2.45 + Math.abs(i - SEL) * .03); });
  c.hide('n', 2.45, .18);
  c.icon('ok', 0, 39, 2.66, .7);
};
Object.assign(LogoCards, {
  id: 'logo-cards', title: 'Logo cards', category: CAT, w: W, h: H, focus: { x: 240, y: 200 }, push: 1.06, exit: [240, 180],
  summary: 'A grid of monogram tiles for fictional companies. Selecting one lifts its tile, rings it and checks it while the rest step back.',
  usage: `<LogoCards companies={[['N', 'Northwind AI', 'Clinic software', ['#3f8cff', '#1d4ed8']], ...]} />`, icons: ['checkCircle']
});

// ---------------------------------------------------------------- Document close-up
const DOC = [
  ['h', '4. Term and termination'],
  ['p', '4.1 This agreement starts on the start'], ['p', 'date and runs for twelve months unless'], ['p', 'it ends earlier under this section.'], ['g'],
  ['c', '4.2 Either party may end this agreement'], ['c', 'with 30 days written notice.'], ['g'],
  ['p', '4.3 Fees for services already delivered'], ['p', 'stay payable after the agreement ends.'], ['p', 'Records return within 14 days.'], ['g'],
  ['h', '5. Confidentiality'],
  ['p', '5.1 Each party keeps the other party’s'], ['p', 'information private and uses it only'], ['p', 'to deliver the services in this agreement.']
];
const DPX = 100, DPW = 280, DLX = 124, DL0 = 104, DLH = 15.5;
const DY = (() => { let y = DL0; return DOC.map(([k]) => { const v = y; y += k === 'g' ? 8 : k === 'h' ? 20 : DLH; return v; }); })();
const CLAUSE = DOC.map((d, i) => (d[0] === 'c' ? i : -1)).filter(i => i >= 0);
const CY0 = DY[CLAUSE[0]], CY1 = DY[CLAUSE[1]] + DLH;
// Lines after the clause reflow down to open room for the inline note; the next section is pushed off the page.
const NOTE = { y: CY1 + 11, h: 50 }, SHIFT = 62, AFTER = DOC.map((d, i) => i).filter(i => i > CLAUSE[1] && DOC[i][0] !== 'g');
const PUSHED = AFTER.filter(i => DY[i] + SHIFT + DLH > 330);
export function DocumentCloseUp({ uid = 'document-close-up' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Contract page; the camera pushes in on a clause that is underlined and annotated" svg={<>
      <Surf id="page" x={DPX} y={22} w={DPW} h={316} r={12} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="hr" d={`M${DLX} 76.5 H${DPX + DPW - 24}`} stroke="#e2e8f0" width={1} at={.9} />
      <Pop id="mk" at={2.2}><circle cx={DLX - 11} cy={CY0 + 7} r={7} fill={BLUE} /></Pop>
      <Surf id="note" x={DLX - 4} y={NOTE.y} w={240} h={NOTE.h} r={12} tone="ink" elev={3} seed={[DLX + 20, NOTE.y + 6]} at={2.6} />
      <Pop id="tri" at={2.95}><path d={`M${DLX + 14} ${NOTE.y + .5} L${DLX + 21} ${NOTE.y - 6} L${DLX + 28} ${NOTE.y + .5} Z`} fill="#1e293b" /></Pop>
    </>}>
      <Layer id="dt" x={DLX} y={38} w={180} h={20} at={.75}><Text size={12.5} weight={700}>Service agreement</Text></Layer>
      <Layer id="ds" x={DLX} y={56} w={180} h={16} at={.8}><Text size={10.5} color={SUB}>Brightwater Homes and Kestrel Health</Text></Layer>
      <Layer id="pg" x={276} y={38} w={80} h={20} at={.85} align="right"><Text size={10.5} color={MUTE} className="tnum">Page 3 of 8</Text></Layer>
      {DOC.map(([k, txt], i) => k === 'g' ? null : (
        <Layer key={i} id={`d${i}`} x={DLX} y={DY[i]} w={236} h={k === 'h' ? 18 : DLH} at={.95 + i * .035}>
          {k === 'h' ? <Text size={11} weight={700}>{txt}</Text>
            : <Text size={10.5} color={k === 'c' ? INK : BODY} weight={k === 'c' ? 500 : 400}>{k === 'c' ? <span className={`dc dc${i}`} style={{ backgroundImage: `linear-gradient(${BLUE}, ${BLUE}), linear-gradient(#e8f1ff, #e8f1ff)`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%, 0 0', backgroundSize: '0% 1.5px, 0% 100%', padding: '1px 1px 2px', margin: '-1px -1px -2px' }}>{txt}</span> : txt}</Text>}
        </Layer>
      ))}
      <Layer id="nm" x={DLX - 18} y={CY0} w={14} h={14} at={2.3} align="center"><Text size={9} weight={700} color="#fff">1</Text></Layer>
      <Layer id="na" x={DLX + 8} y={NOTE.y + 7} w={220} h={36} at={2.9} className="gap10"><Icon name="messageSquare" size={16} color="#93c5fd" id="msg" /><span className="stack"><Text size={11.5} weight={600} color="#fff">Notice is shorter than policy</Text><Text size={10.5} color="#cbd5e1">Ask legal for 60 days · R. Kaur</Text></span></Layer>
    </Frame>
  );
}
DocumentCloseUp.motion = c => {
  PUSHED.forEach((i, k) => c.hide(`d${i}`, 2.42 + k * .03, .2));
  AFTER.filter(i => !PUSHED.includes(i)).forEach((i, k) => c.fromTo(`[data-layer="d${i}"]`, { y: 0 }, { y: SHIFT, duration: .5, ease: 'power3.inOut' }, 2.5));
  CLAUSE.forEach((i, k) => {
    c.fromTo(`.dc${i}`, { backgroundSize: '0% 1.5px, 0% 100%' }, { backgroundSize: '100% 1.5px, 0% 100%', duration: .45, ease: 'power1.inOut' }, 2.05 + k * .42);
    c.fromTo(`.dc${i}`, { backgroundSize: '100% 1.5px, 0% 100%' }, { backgroundSize: '100% 1.5px, 100% 100%', duration: .4, ease: 'power2.out' }, 2.95 + k * .06);
  });
  c.icon('msg', 0, 33, 2.95, .8);
};
Object.assign(DocumentCloseUp, {
  id: 'document-close-up', title: 'Document close-up', category: CAT, w: W, h: H, focus: { x: 236, y: CY0 + 10 }, push: 1.34, orbit: .7, exit: [240, 180],
  summary: 'A contract page with real paragraph lines. The camera pushes in on the notice clause, which is underlined line by line and annotated by a reviewer.',
  usage: `<DocumentCloseUp />`, icons: ['messageSquare']
});

// ---------------------------------------------------------------- Paper scan
const PP = { x: 44, y: 24, w: 204, h: 312 }, PLX = 60;
const ABS = [176, 168, 180, 132];
const FIELDS = [['Title', 'Shared notes reduce handover errors', 2.4, 66, 54], ['Key metric', '38% fewer errors', 2.8, 136, 42], ['Dataset', '2,140 shifts, 6 homes', 2.98, 206, 42]];
const PFY = [80, 150, 208];
const SCAN = { a: 1.9, d: 1.6, y0: 30, y1: 330 };
export function PaperScan({ uid = 'paper-scan' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Research paper scanned with fields extracted to a side panel" svg={<>
      <defs><clipPath id={`${uid}-pc`}><path d={rr(PP.x, PP.y, PP.w, PP.h, 10)} /></clipPath><linearGradient id={`${uid}-scan`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2d7dff" stopOpacity="0" /><stop offset="1" stopColor="#2d7dff" stopOpacity=".16" /></linearGradient></defs>
      <Surf id="paper" x={PP.x} y={PP.y} w={PP.w} h={PP.h} r={10} tone="white" elev={3} seed={[146, 180]} />
      {ABS.map((w, i) => <Draw key={i} id={`ab${i}`} d={`M${PLX} ${136 + i * 11} H${PLX + w}`} stroke="#e2e8f0" width={5} at={1.0 + i * .04} dur={.4} />)}
      {[0, 1, 2].map(i => <Draw key={i} id={`bd${i}`} d={`M${PLX} ${230 + i * 11} H${PLX + [172, 164, 120][i]}`} stroke="#e2e8f0" width={5} at={1.15 + i * .04} dur={.4} />)}
      <Surf id="fig" x={PLX} y={262} w={172} h={58} r={8} tone="muted" elev={0} seed={[146, 290]} at={1.0} />
      {[30, 24, 20, 15, 12, 10].map((h, i) => <Surf key={i} id={`fb${i}`} x={PLX + 14 + i * 20} y={310 - h} w={12} h={h} r={3} tone={i > 2 ? 'blue' : 'track'} elev={0} seed={[PLX + 20 + i * 20, 306]} at={1.2 + i * .05} />)}
      <Draw id="h0" d={rr(PLX - 6, 31, 138, 58, 8)} stroke={BLUE} width={1.5} at={FIELDS[0][2] - .1} dur={.4} />
      <Draw id="h1" d={rr(PLX - 5, 175, 165, 21, 6)} stroke={BLUE} width={1.5} at={FIELDS[1][2] - .1} dur={.4} />
      <Draw id="h2" d={rr(PLX - 5, 200, 152, 21, 6)} stroke={BLUE} width={1.5} at={FIELDS[2][2] - .1} dur={.4} />
      <g clipPath={`url(#${uid}-pc)`}><g className="scan"><rect x={PP.x} y={-40} width={PP.w} height={40} fill={`url(#${uid}-scan)`} /><path d={`M${PP.x + 2} 0 H${PP.x + PP.w - 2}`} stroke={BLUE} strokeWidth="2" strokeLinecap="round" /></g></g>
      <Surf id="panel" x={264} y={24} w={176} h={312} r={22} tone="white" elev={3} seed={[352, 180]} order={1} />
      {FIELDS.map(([, , at, , h], i) => <Surf key={i} id={`f${i}`} x={276} y={PFY[i]} w={152} h={h} r={12} tone="muted" elev={0} seed={[290, PFY[i] + 14]} at={at} />)}
      <Surf id="done" x={276} y={290} w={152} h={30} r={15} tone="greenTint" elev={0} seed={[352, 305]} at={3.4} />
    </>}>
      <Layer id="pt" x={PLX} y={38} w={176} h={44} at={.85}><Text size={12.5} weight={700} style={{ whiteSpace: 'normal', lineHeight: 1.3, display: 'block', width: 172 }}>Shared notes reduce handover errors in community care</Text></Layer>
      <Layer id="pa" x={PLX} y={88} w={176} h={16} at={.9}><Text size={10} color={SUB}>R. Adeyemi, L. Novak, J. Whitfield</Text></Layer>
      <Layer id="ah" x={PLX} y={112} w={176} h={16} at={.95}><Text size={10.5} weight={700}>Abstract</Text></Layer>
      <Layer id="am" x={PLX} y={178} w={176} h={16} at={1.05}><Text size={10} color={INK} weight={500} className="pm">Shared notes cut errors by <b style={{ fontWeight: 700 }}>38%</b>.</Text></Layer>
      <Layer id="ad" x={PLX} y={202} w={176} h={16} at={1.1}><Text size={10} color={INK} weight={500} className="tnum pd">Data: 2,140 shifts in 6 homes.</Text></Layer>
      <Layer id="xt" x={280} y={40} w={150} h={20} at={.8}><Text size={15} weight={600}>Extracted</Text></Layer>
      <Layer id="xs" x={280} y={60} w={150} h={16} at={.86}><Text size={12} color={SUB} className="tnum xs">Scanning page 1</Text></Layer>
      {FIELDS.map(([lab, val, at, , h], i) => (
        <Layer key={i} id={`fv${i}`} x={288} y={PFY[i]} w={136} h={h} at={at + .15}><span className="stack" style={{ gap: 2 }}><Text size={10.5} weight={600} color={SUB}>{lab}</Text><Text size={12.5} weight={600} style={{ whiteSpace: i === 0 ? 'normal' : 'nowrap', lineHeight: 1.25, width: 128, display: 'block' }} className="tnum">{val}</Text></span></Layer>
      ))}
      <Layer id="dn" x={276} y={290} w={152} h={30} at={3.55} align="center" className="gap6"><Icon name="checkmark" size={16} color="#15803d" id="ck" /><Text size={12} weight={600} color="#15803d">3 fields found</Text></Layer>
    </Frame>
  );
}
PaperScan.motion = c => {
  const g = c.q('.scan'), E = c.ease('power1.inOut');
  c.after(t => {
    const p = Math.min(1, Math.max(0, (t - SCAN.a) / SCAN.d)), y = SCAN.y0 + (SCAN.y1 - SCAN.y0) * E(p);
    g.setAttribute('transform', `translate(0 ${y.toFixed(2)})`);
    g.setAttribute('opacity', t < SCAN.a - .15 || t > SCAN.a + SCAN.d + .25 ? '0' : String(Math.min(1, (t - SCAN.a + .15) / .15, (SCAN.a + SCAN.d + .25 - t) / .25).toFixed(3)));
  });
  c.swap('.xs', ['Scanning page 1', 'Page 1 · 3 of 3 fields'], [3.4]);
  c.icon('ck', 0, 44, 3.6, .6);
};
Object.assign(PaperScan, {
  id: 'paper-scan', title: 'Paper scan', category: CAT, w: W, h: H, focus: { x: 240, y: 180 }, push: 1.04, orbit: .9, exit: [240, 180],
  summary: 'A scan line sweeps down a research paper. As it passes the title, the key metric and the dataset, each is boxed and lands as a field in the side panel.',
  usage: `<PaperScan />`, icons: ['checkmark']
});

export const LIST_B = [ChangelogScroll, HeadlineCards, QuoteCard, EventTimeline, FundingCounter, PredictionCards, ViralClip, LogoCards, DocumentCloseUp, PaperScan];
