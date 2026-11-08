// Explainer set: dev. See EXPLAINER-BRIEF.md.
// Developer-facing scenes (docs, repositories, terminals, diffs, builds, installs, skills, tools).
// Every org, repo and package is fictional ("northwind/agent-kit"); no hosting-site trade dress.
// Inter only, including code and terminal text. Functional icons are native useAnimations.
import React from 'react';
import { Frame, Surf, Layer, Icon, Text, Pop, Draw } from '../primitives.jsx';
import { rect } from '../geometry.js';

const W = 480, H = 360;
const INK = '#0f172a', SUB = '#64748b', BODY = '#475569', DEEP = '#1d4ed8', MUTE = '#94a3b8', BLUE = '#2d7dff';
const GREEN = '#16a34a', GREEN_D = '#15803d', RED = '#ef4444', RED_D = '#b91c1c', AMBER = '#f59e0b', AMBER_D = '#a16207';
const FONT = 'Inter, system-ui, sans-serif';
const clamp01 = v => Math.max(0, Math.min(1, v));
function smooth(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}
const chip = (bg, fg, h = 22) => ({ background: bg, color: fg, height: h, padding: '0 9px', borderRadius: h / 2, fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily: FONT, flex: 'none' });
// Code is set in Inter (no monospace anywhere in the library).
const CODE = { fontSize: 12.5, fontWeight: 500, letterSpacing: 0, whiteSpace: 'pre' };

// ---------------------------------------------------------------- Docs page
const NAV = ['Overview', 'Quickstart', 'Install', 'Configuration', 'API reference'];
const NVY = i => 116 + i * 30;
export function DocsPage({ uid = 'docs-page' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Docs page with a copyable install command" svg={<>
      <Surf id="card" x={40} y={26} w={400} h={308} r={20} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="logo" x={58} y={42} w={26} h={26} r={8} tone="blue" elev={1} seed={[71, 55]} order={1} />
      <Surf id="srch" x={300} y={42} w={122} h={26} r={13} tone="muted" elev={0} seed={[314, 55]} order={2} />
      <Draw id="hd" d="M40 82.5 H440" stroke="#eef2f6" width={1} at={.8} />
      <Draw id="vd" d="M158.5 83 V334" stroke="#eef2f6" width={1} at={.86} />
      <Surf id="nav" x={50} y={NVY(0)} w={100} h={26} r={8} tone="tint" elev={0} seed={[62, NVY(0) + 13]} at={1.0} />
      <Surf id="code" x={174} y={198} w={250} h={72} r={12} tone="ink" elev={2} seed={[190, 234]} at={2.05} />
      <Draw id="cdv" d="M174 228.5 H424" stroke="rgba(255,255,255,.09)" width={1} at={2.5} dur={.4} />
      <Surf id="copy" x={358} y={204} w={58} h={20} r={6} tone="glass" elev={0} seed={[387, 214]} at={2.3} edge={false} />
      <Surf id="ok" x={344} y={204} w={72} h={20} r={6} tone="green" elev={0} seed={[404, 214]} at={3.12} />
    </>}>
      <Layer id="lg" x={58} y={42} w={26} h={26} at={.75} align="center"><Text size={10} weight={700} color="#fff">NW</Text></Layer>
      <Layer id="bt" x={92} y={42} w={190} h={26} at={.78}><Text size={14} weight={600}>Northwind docs</Text></Layer>
      <Layer id="se" x={312} y={42} w={104} h={26} at={.84} className="gap6"><Icon name="searchToX" size={14} color={MUTE} id="find" /><Text size={12} color={MUTE}>Search docs</Text></Layer>
      <Layer id="ng" x={60} y={94} w={90} h={18} at={.9}><Text size={11} weight={600} color={MUTE}>Guides</Text></Layer>
      {NAV.map((n, i) => <Layer key={n} id={`n${i}`} x={60} y={NVY(i)} w={92} h={26} at={.95 + i * .05}><Text size={12.5} weight={i === 0 ? 600 : 500} color={i === 0 ? DEEP : BODY} className={`nv${i}`}>{n}</Text></Layer>)}
      <Layer id="bc" x={174} y={94} w={240} h={18} at={1.0}><Text size={11.5} weight={500} color={MUTE} className="crumb">Guides / Overview</Text></Layer>
      <Layer id="ot" x={174} y={114} w={250} h={28} at={1.05}><Text size={18} weight={700} style={{ letterSpacing: '-.02em' }}>Agent kit</Text></Layer>
      <Layer id="op" x={174} y={146} w={250} h={44} at={1.1}><Text size={12.5} color={BODY} style={{ whiteSpace: 'normal', lineHeight: 1.5 }}>Typed building blocks for tools, retries and traces. Start with the install guide.</Text></Layer>
      <Layer id="it" x={174} y={114} w={250} h={28} at={2.1}><Text size={18} weight={700} style={{ letterSpacing: '-.02em' }}>Install the SDK</Text></Layer>
      <Layer id="ip" x={174} y={146} w={250} h={44} at={2.16}><Text size={12.5} color={BODY} style={{ whiteSpace: 'normal', lineHeight: 1.5 }}>Add the kit to any Node 18 project. Typed, with zero runtime dependencies.</Text></Layer>
      <Layer id="ch" x={188} y={204} w={140} h={20} at={2.4}><Text size={11.5} weight={600} color={MUTE}>Terminal</Text></Layer>
      <Layer id="cp" x={358} y={204} w={58} h={20} at={2.45} align="center" className="gap6"><Icon name="copy" size={13} color={INK} id="copy" /><Text size={11.5} weight={600}>Copy</Text></Layer>
      <Layer id="cl" x={188} y={236} w={230} h={26} at={2.5}><Text style={CODE} color="#e2e8f0"><span style={{ color: '#64748b' }}>$ </span>npm install <span style={{ color: '#93c5fd' }}>@northwind/agent-kit</span></Text></Layer>
      <Layer id="ck" x={344} y={204} w={72} h={20} at={3.28} align="center" className="gap6"><Icon name="checkmark" size={14} color="#fff" id="ckd" /><Text size={11.5} weight={600} color="#fff">Copied</Text></Layer>
      <Layer id="nx" x={174} y={286} w={250} h={24} at={2.6} className="gap6"><Text size={12.5} weight={600} color={DEEP}>Next: Configure your agent</Text><Icon name="arrowRight" size={15} color={DEEP} id="next" /></Layer>
    </Frame>
  );
}
DocsPage.motion = c => {
  c.cursor([{ at: 1.85, x: 118, y: NVY(2) + 20, press: true }, { at: 2.95, x: 412, y: 222, press: true }, { at: 3.4, x: 352, y: 262 }]);
  c.reshape('nav', rect(50, NVY(2), 100, 26, 8), 1.9, .5, 'back.out(1.3)');
  c.fromTo('.nv0', { color: DEEP, fontWeight: 600 }, { color: BODY, fontWeight: 500, duration: .2 }, 1.92);
  c.fromTo('.nv2', { color: BODY, fontWeight: 500 }, { color: DEEP, fontWeight: 600, duration: .2 }, 2.0);
  c.hide('ot', 1.95, .2); c.hide('op', 1.98, .2);
  c.swap('[data-layer="bc"] .crumb', ['Guides / Overview', 'Guides / Install'], [2.05]);
  c.press('copy', '[data-layer="cp"]', 2.95, 1);
  c.icon('copy', 0, 4, 2.97, .2);
  c.hide('cp', 3.06, .16);
  c.icon('ckd', 0, 44, 3.3, .55);
  c.icon('next', 0, 35, 2.65, .7);
};
Object.assign(DocsPage, {
  id: 'docs-page', title: 'Docs page', category: 'Developer', w: W, h: H, focus: { x: 252, y: 200 }, push: 1.04, orbit: .8, exit: [240, 180],
  summary: 'A docs layout with sidebar nav and a code block. Choosing Install slides the active nav pill and swaps the article; pressing copy grows a Copied confirmation from the button.',
  usage: `<DocsPage />`, icons: ['searchToX', 'copy', 'checkmark', 'arrowRight']
});

// ---------------------------------------------------------------- Repo page
const FILES = [['folder', '.github', 'Add release workflow', '3d'], ['folder', 'src', 'Add retry policy', '2h'], ['folder', 'examples', 'Streaming demo', '1w'], ['fileText', 'README.md', 'Update install steps', '2h']];
const FRY = i => 214 + i * 28;
const TOPICS = [['agents', 58], ['typescript', 78], ['tooling', 60]];
export function RepoPage({ uid = 'repo-page' }) {
  let tx = 60;
  const topics = TOPICS.map(([l, w]) => { const x = tx; tx += w + 6; return [l, w, x]; });
  return (
    <Frame uid={uid} w={W} h={H} label="Repository page for northwind/agent-kit" svg={<>
      <Surf id="card" x={40} y={22} w={400} h={316} r={20} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="tile" x={60} y={40} w={28} h={28} r={8} tone="blue" elev={1} seed={[74, 54]} order={1} />
      {topics.map(([l, w, x], i) => <Surf key={l} id={`tp${i}`} x={x} y={100} w={w} h={24} r={12} tone="tint" elev={0} seed={[x + 12, 112]} at={1.0 + i * .06} />)}
      <Surf id="star" x={262} y={40} w={82} h={28} r={9} tone="white" elev={1} seed={[303, 54]} at={.95} />
      <Surf id="starOn" x={262} y={40} w={82} h={28} r={9} tone="amberTint" elev={0} seed={[334, 62]} at={2.72} />
      <Surf id="fork" x={350} y={40} w={72} h={28} r={9} tone="white" elev={1} seed={[386, 54]} at={1.02} />
      <Draw id="tabsep" d="M40 164.5 H440" stroke="#eef2f6" width={1} at={1.1} />
      <Draw id="tabind" d="M60 163 H96" stroke={BLUE} width={2.5} at={1.3} dur={.35} />
      <Surf id="list" x={56} y={176} w={368} h={148} r={12} tone="white" elev={0} seed={[240, 190]} at={1.3} />
      <Surf id="head" x={61} y={180} w={358} h={27} r={8} tone="muted" elev={0} seed={[80, 193]} at={1.4} edge={false} />
      <Surf id="av" x={68} y={183} w={20} h={20} r={10} tone="tint" elev={0} seed={[78, 193]} at={1.5} />
      {FILES.map((_, i) => i > 0 && <Draw key={i} id={`fs${i}`} d={`M57 ${FRY(i) - .5} H423`} stroke="#f1f5f9" width={1} at={1.85 + i * .14} dur={.4} />)}
    </>}>
      <Layer id="tl" x={60} y={40} w={28} h={28} at={.75} align="center"><Text size={10.5} weight={700} color="#fff">NW</Text></Layer>
      <Layer id="nm" x={98} y={40} w={160} h={28} at={.8} className="gap6"><Text size={14.5} weight={500} color={SUB}>northwind /</Text><Text size={14.5} weight={700}>agent-kit</Text></Layer>
      <Layer id="ds" x={60} y={72} w={360} h={20} at={.86} className="gap8"><Text size={12.5} color={BODY}>Typed toolkit for building reliable agents.</Text><span style={{ ...chip('#fff', SUB, 18), boxShadow: 'inset 0 0 0 1px #e2e8f0', fontSize: 10.5, padding: '0 7px' }}>Public</span></Layer>
      {topics.map(([l, w, x], i) => <Layer key={l} id={`tt${i}`} x={x} y={100} w={w} h={24} at={1.12 + i * .06} align="center"><Text size={11.5} weight={600} color={DEEP}>{l}</Text></Layer>)}
      <Layer id="sb" x={262} y={40} w={82} h={28} at={1.1} align="center" className="gap6"><Icon name="star" fill size={15} color={SUB} id="star" /><Text size={12} weight={600} className="stl">Star</Text><Text size={12} weight={600} color={BODY} className="tnum stc">2,184</Text></Layer>
      <Layer id="fb" x={350} y={40} w={72} h={28} at={1.16} align="center" className="gap6"><Icon name="gitBranch" size={15} color={SUB} id="fork" /><Text size={12} weight={600}>Fork</Text><Text size={12} weight={600} color={BODY} className="tnum">312</Text></Layer>
      <Layer id="tabs" x={60} y={134} w={364} h={26} at={1.2} className="gap6">
        <Text size={13} weight={600} style={{ marginRight: 12 }}>Code</Text>
        <Text size={13} weight={500} color={SUB}>Issues</Text><span style={{ ...chip('#f1f5f9', BODY, 18), padding: '0 6px', fontSize: 10.5, marginRight: 12 }}>12</span>
        <Text size={13} weight={500} color={SUB}>Pull requests</Text><span style={{ ...chip('#f1f5f9', BODY, 18), padding: '0 6px', fontSize: 10.5, marginRight: 12 }}>4</span>
        <Text size={13} weight={500} color={SUB}>Actions</Text>
      </Layer>
      <Layer id="cm" x={96} y={176} w={316} h={34} at={1.6} className="gap8"><Text size={12.5} weight={600}>ava</Text><Text size={12.5} color={BODY} style={{ flex: 1 }}>Add retry policy</Text><Text size={11.5} color={MUTE} className="tnum">a1f3c9e · 2h ago</Text></Layer>
      <Layer id="avi" x={68} y={183} w={20} h={20} at={1.6} align="center"><Text size={9} weight={700} color={DEEP}>A</Text></Layer>
      {FILES.map(([ic, n, m, t], i) => (
        <Layer key={n} id={`f${i}`} x={68} y={FRY(i)} w={344} h={28} at={1.75 + i * .14} className="gap8">
          <Icon name={ic} size={16} color={ic === 'folder' ? BLUE : SUB} id={`fi${i}`} />
          <Text size={13} weight={600} style={{ width: 106 }}>{n}</Text>
          <Text size={12} color={SUB} style={{ flex: 1 }}>{m}</Text>
          <Text size={11.5} color={MUTE} className="tnum">{t}</Text>
        </Layer>
      ))}
    </Frame>
  );
}
RepoPage.motion = c => {
  c.cursor([{ at: 2.62, x: 340, y: 65, press: true }, { at: 2.98, x: 372, y: 92 }]);
  c.press('star', '[data-layer="sb"]', 2.62, 1);
  c.icon('star', 0, 9, 2.66, .32);
  c.fromTo('[data-icon="star"]', { color: SUB }, { color: AMBER, duration: .2 }, 2.66);
  c.fromTo('[data-layer="sb"] .stl', { color: INK }, { color: AMBER_D, duration: .2 }, 2.75);
  c.fromTo('[data-layer="sb"] .stc', { color: BODY }, { color: AMBER_D, duration: .2 }, 2.75);
  c.swap('[data-layer="sb"] .stc', ['2,184', '2,185'], [2.82]);
  c.fromTo('[data-layer="sb"] .stc', { y: 0 }, { y: -3, duration: .1, ease: 'power2.out' }, 2.82).fromTo('[data-layer="sb"] .stc', { y: -3 }, { y: 0, duration: .45, ease: 'back.out(3)' }, 2.92);
  FILES.forEach(([ic], i) => ic === 'folder' && c.icon(`fi${i}`, 0, 7, 1.8 + i * .14, .3));
};
Object.assign(RepoPage, {
  id: 'repo-page', title: 'Repo page', category: 'Developer', w: W, h: H, focus: { x: 252, y: 175 }, push: 1.03, orbit: .8, exit: [240, 180],
  summary: 'A repository header with topics, tabs and a file list that forms row by row. Starring fills the native star and ticks the tabular count.',
  usage: `<RepoPage />`, icons: ['star', 'gitBranch', 'folder', 'fileText']
});

// ---------------------------------------------------------------- Star counter
const STARS = [11.62, 11.66, 11.70, 11.75, 11.79, 11.85, 11.89, 11.95, 12.01, 12.07, 12.14, 12.2, 12.27, 12.33, 12.4];
const SX = i => 86 + i * (308 / 14), SY = v => 280 - (v - 11.55) / .95 * 72;
const SPK = STARS.map((v, i) => [SX(i), SY(v)]);
const TAIL0 = SPK[14], TAIL1 = [SX(14), SY(12.5)];
const area = end => `${smooth(SPK.slice(0, 14))} L${end[0]},${end[1]} L${end[0]},280 L${SX(0)},280 Z`;
export function StarCounter({ uid = 'star-counter' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Star counter rising from 12.4k to 12.5k" svg={<>
      <Surf id="card" x={60} y={40} w={360} h={276} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="tile" x={84} y={62} w={34} h={34} r={10} tone="blue" elev={1} seed={[101, 79]} order={1} />
      <Surf id="delta" x={322} y={66} w={74} h={26} r={13} tone="greenTint" elev={0} seed={[334, 79]} at={1.2} />
      <Surf id="btn" x={84} y={116} w={124} h={48} r={14} tone="white" elev={2} seed={[146, 140]} order={2} />
      <Surf id="btnOn" x={84} y={116} w={124} h={48} r={14} tone="amberTint" elev={0} seed={[190, 152]} at={2.46} />
      <g className="sarea"><path className="sarea-p" d={area(TAIL0)} fill={`url(#${uid}-area)`} /></g>
      <Draw id="base" d="M86 280.5 H394" stroke="#eef2f6" width={1} at={1.0} />
      <Draw id="spk" d={smooth(SPK.slice(0, 14))} stroke={BLUE} width={2.5} at={1.15} dur={.95} />
      <Pop id="tail" at={2.05} origin="0% 100%"><path className="stail" d={`M${SPK[13][0]},${SPK[13][1]} L${TAIL0[0]},${TAIL0[1]}`} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" /></Pop>
      <Pop id="dot" at={2.1}><circle className="sdot" cx={TAIL0[0]} cy={TAIL0[1]} r={5} fill="#fff" stroke={BLUE} strokeWidth="2.5" /></Pop>
      <Pop id="halo" at={2.7} ease="power2.out"><circle className="shalo" cx={TAIL1[0]} cy={TAIL1[1]} r={5} fill="none" stroke={AMBER} strokeWidth="2" /></Pop>
    </>}>
      <Layer id="tl" x={84} y={62} w={34} h={34} at={.75} align="center"><Text size={11} weight={700} color="#fff">NW</Text></Layer>
      <Layer id="nm" x={128} y={60} w={190} h={40} at={.8}><span className="stack"><Text size={14.5} weight={600}>northwind/agent-kit</Text><Text size={12} color={SUB}>Stars · last 14 days</Text></span></Layer>
      <Layer id="dl" x={322} y={66} w={74} h={26} at={1.35} align="center" className="gap6"><Icon name="trendingUp" size={15} color={GREEN} id="trend" /><Text size={12} weight={600} color={GREEN_D} className="tnum">+6.8%</Text></Layer>
      <Layer id="sb" x={84} y={116} w={124} h={48} at={1.0} align="center" className="gap8"><Icon name="star" fill size={20} color={SUB} id="star" /><Text size={15} weight={600} className="stl">Star</Text></Layer>
      <Layer id="ct" x={226} y={110} w={176} h={50} at={1.05}>
        <span style={{ display: 'inline-flex', alignItems: 'flex-start', height: 46 }}>
          <Text size={40} weight={700} className="tnum" style={{ letterSpacing: '-.035em', lineHeight: '46px' }}>12.</Text>
          <span style={{ display: 'inline-block', height: 46, overflow: 'hidden' }}><span className="roll" style={{ display: 'flex', flexDirection: 'column' }}>{['4', '5', '6'].map(d => <Text key={d} size={40} weight={700} className="tnum" style={{ letterSpacing: '-.035em', lineHeight: '46px', height: 46, display: 'block' }}>{d}</Text>)}</span></span>
          <Text size={40} weight={700} style={{ letterSpacing: '-.035em', lineHeight: '46px', marginLeft: 1 }}>k</Text>
        </span>
      </Layer>
      <Layer id="cs" x={228} y={158} w={176} h={18} at={1.1}><Text size={12} color={SUB} className="gaz">stargazers</Text></Layer>
      <Layer id="ax" x={74} y={286} w={332} h={18} at={1.2}><span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Text size={10.5} weight={600} color={MUTE}>Oct 22</Text><Text size={10.5} weight={600} color={MUTE}>Oct 29</Text><Text size={10.5} weight={600} color={DEEP}>Today</Text></span></Layer>
    </Frame>
  );
}
StarCounter.motion = c => {
  c.cursor([{ at: 2.35, x: 196, y: 156, press: true }]);
  c.press('btn', '[data-layer="sb"]', 2.35, 1);
  c.icon('star', 0, 9, 2.4, .32);
  c.fromTo('[data-icon="star"]', { color: SUB }, { color: AMBER, duration: .2 }, 2.4);
  c.fromTo('[data-layer="sb"] .stl', { color: INK }, { color: AMBER_D, duration: .2 }, 2.5);
  c.swap('[data-layer="sb"] .stl', ['Star', 'Starred'], [2.52]);
  c.fromTo('.roll', { y: 0 }, { y: -46, duration: .62, ease: 'back.out(1.5)' }, 2.6);
  c.swap('[data-layer="cs"] .gaz', ['stargazers', 'stargazers · you starred'], [2.75]);
  c.icon('trend', 0, 39, 1.4, .9);
  const E = 'back.out(1.6)';
  c.morph('.stail', `M${SPK[13][0]},${SPK[13][1]} L${TAIL0[0]},${TAIL0[1]}`, `M${SPK[13][0]},${SPK[13][1]} L${TAIL1[0]},${TAIL1[1]}`, 2.7, .55, E);
  c.morph('.sarea-p', area(TAIL0), area(TAIL1), 2.7, .55, E);
  c.fromTo('.sdot', { attr: { cy: TAIL0[1] } }, { attr: { cy: TAIL1[1] }, duration: .55, ease: E }, 2.7);
  c.fromTo('.sdot', { attr: { stroke: BLUE } }, { attr: { stroke: AMBER }, duration: .2 }, 2.7);
  c.fromTo('.shalo', { scale: 1, opacity: .8, transformOrigin: '50% 50%' }, { scale: 3, opacity: 0, duration: .8, ease: 'power2.out' }, 2.95);
  c.fromTo('.sarea', { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .9, ease: 'power3.out' }, 1.5);
  c.fromTo('.sarea', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: 0, duration: .35, ease: 'power2.in' }, c.T.collapse);
};
Object.assign(StarCounter, {
  id: 'star-counter', title: 'Star counter', category: 'Developer', w: W, h: H, focus: { x: 240, y: 160 }, push: 1.08, exit: [240, 180],
  summary: 'Pressing Star fills the native star and rolls the tabular count from 12.4k to 12.5k while the sparkline tail ticks up.',
  usage: `<StarCounter />`, icons: ['star', 'trendingUp']
});

// ---------------------------------------------------------------- README scroll
// Content blocks are absolutely positioned so the scroll target is exact (no layout reads).
const RD_SCROLL = 222, RD_VIEW = 232, RD_TOTAL = 500;
const THUMB_H = Math.round(RD_VIEW / RD_TOTAL * 224), THUMB_T = Math.round(RD_SCROLL / (RD_TOTAL - RD_VIEW) * (224 - THUMB_H));
const badge = (k, v, bg) => <span style={{ display: 'inline-flex', height: 20, borderRadius: 6, overflow: 'hidden', fontSize: 10.5, fontWeight: 600, fontFamily: FONT, whiteSpace: 'nowrap' }}><span style={{ background: '#475569', color: '#fff', padding: '0 7px', display: 'flex', alignItems: 'center' }}>{k}</span><span style={{ background: bg, color: '#fff', padding: '0 7px', display: 'flex', alignItems: 'center' }}>{v}</span></span>;
const abs = (top, h, extra) => ({ position: 'absolute', left: 0, right: 0, top, height: h, display: 'flex', alignItems: 'center', ...extra });
export function ReadmeScroll({ uid = 'readme-scroll' }) {
  const H2 = { fontSize: 15, fontWeight: 700, color: INK, letterSpacing: '-.01em' };
  const P = { fontSize: 12.5, color: BODY, whiteSpace: 'normal', lineHeight: 1.5 };
  const codeBox = (top, lines) => <span style={{ ...abs(top, 14 + lines.length * 20), background: '#0f172a', borderRadius: 9, padding: '0 12px', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', right: 6 }}>{lines.map((l, i) => <Text key={i} style={CODE} color="#e2e8f0">{l}</Text>)}</span>;
  return (
    <Frame uid={uid} w={W} h={H} label="README scrolling to the install section" svg={<>
      <Surf id="card" x={56} y={22} w={368} h={316} r={20} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="hd" d="M56 72.5 H424" stroke="#eef2f6" width={1} at={.8} />
      <Pop id="track" at={1.0}><rect x={404} y={88} width={5} height={224} rx={2.5} fill="#f1f5f9" /></Pop>
      <Pop id="thumb" at={1.1}><rect className="thumb" x={403} y={88} width={7} height={THUMB_H} rx={3.5} fill="#cbd5e1" /></Pop>
    </>}>
      <Layer id="hi" kind="icon" x={74} y={34} w={26} h={30} at={.75} align="center"><Icon name="bookOpen" size={20} color={DEEP} id="book" /></Layer>
      <Layer id="ht" x={106} y={34} w={140} h={30} at={.8}><Text size={14} weight={600}>README.md</Text></Layer>
      <Layer id="hr" x={250} y={34} w={156} h={30} at={.85} align="right"><Text size={12} color={MUTE}>northwind/agent-kit</Text></Layer>
      <Layer id="vp" x={76} y={84} w={318} h={RD_VIEW} at={.9}>
        <div style={{ position: 'relative', width: 318, height: RD_VIEW, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(transparent 0, #000 12px, #000 calc(100% - 16px), transparent 100%)', maskImage: 'linear-gradient(transparent 0, #000 12px, #000 calc(100% - 16px), transparent 100%)' }}>
          <div className="rd" style={{ position: 'absolute', left: 0, top: 0, width: 318, height: RD_TOTAL }}>
            <span className="rd-band" style={{ position: 'absolute', left: 0, right: 2, top: 232, height: 112, background: '#eff6ff', borderRadius: 10, boxShadow: 'inset 0 0 0 1px #cfe0ff' }} />
            <span className="rd-bar" style={{ position: 'absolute', left: 0, top: 244, width: 3, height: 88, background: BLUE, borderRadius: 2 }} />
            <span style={abs(12, 32)}><Text size={22} weight={700} style={{ letterSpacing: '-.025em' }}>agent-kit</Text></span>
            <span style={{ ...abs(50, 22), gap: 6 }}>{badge('build', 'passing', '#16a34a')}{badge('npm', 'v2.4.0', '#2d7dff')}{badge('license', 'MIT', '#0ea5e9')}</span>
            <span style={abs(80, 40)}><Text style={P}>Typed building blocks for reliable agents: tools, retries and traces in one small package.</Text></span>
            <span style={abs(130, 26)}><Text style={H2}>Features</Text></span>
            {['Typed tool calls with schema checks', 'Retries with exponential backoff', 'Trace every step to a local file'].map((l, i) => <span key={l} style={{ ...abs(158 + i * 21, 21), gap: 8 }}><span style={{ width: 5, height: 5, borderRadius: 3, background: MUTE, flex: 'none' }} /><Text style={{ ...P, whiteSpace: 'nowrap' }}>{l}</Text></span>)}
            <span style={{ ...abs(240, 26), gap: 6, left: 12 }}><Icon name="hash" size={15} color={BLUE} id="hash" /><Text style={H2} className="rd-h">Install</Text></span>
            <span style={{ ...abs(266, 22), left: 12 }}><Text style={P}>Requires Node 18 or later.</Text></span>
            <span style={{ position: 'absolute', left: 12, right: 12, top: 294 }}>{codeBox(0, ['npm install @northwind/agent-kit'])}</span>
            <span style={abs(356, 26)}><Text style={H2}>Usage</Text></span>
            {codeBox(386, ["import { Agent } from '@northwind/agent-kit'", "const agent = new Agent({ tools })"])}
            <span style={abs(450, 40)}><Text style={P}>See the docs for streaming, tracing and custom tools.</Text></span>
          </div>
        </div>
      </Layer>
    </Frame>
  );
}
ReadmeScroll.motion = c => {
  const E = 'power3.inOut';
  c.cursor([{ at: 1.3, x: 352, y: 150 }, { at: 1.8, x: 407, y: 88 + THUMB_H / 2, press: true }, { at: 3.05, x: 407, y: 88 + THUMB_T + THUMB_H / 2 }, { at: 3.45, x: 352, y: 262 }]);
  c.fromTo('.rd', { y: 0 }, { y: -RD_SCROLL, duration: 1.1, ease: E }, 1.95);
  c.fromTo('.thumb', { y: 0 }, { y: THUMB_T, duration: 1.1, ease: E }, 1.95);
  c.fromTo('.thumb', { fill: '#cbd5e1' }, { fill: '#94a3b8', duration: .15 }, 1.82).fromTo('.thumb', { fill: '#94a3b8' }, { fill: '#cbd5e1', duration: .3 }, 3.2);
  c.fromTo('.rd-band', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .55, ease: 'power3.out' }, 3.1);
  c.fromTo('.rd-bar', { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: .45, ease: 'power3.out' }, 3.05);
  c.fromTo('.rd-h', { color: INK }, { color: DEEP, duration: .25 }, 3.15);
  c.icon('hash', 0, 33, 3.15, .7);
  c.icon('book', 0, 43, .8, 1.0);
};
Object.assign(ReadmeScroll, {
  id: 'readme-scroll', title: 'README scroll', category: 'Developer', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.06, exit: [240, 180],
  summary: 'README content with badges, headings and code scrolls inside a clipped viewport as the thumb is dragged, then the Install section is highlighted.',
  usage: `<ReadmeScroll />`, icons: ['bookOpen', 'hash']
});

// ---------------------------------------------------------------- Terminal recording
const TL = [120, 142, 164, 186, 208, 234, 262, 290];
const OUT = [['ESM', 'dist/index.js', '38.2 KB'], ['CJS', 'dist/index.cjs', '39.0 KB'], ['DTS', 'dist/index.d.ts', '12.4 KB']];
export function TerminalRecording({ uid = 'terminal-recording' }) {
  const L = { fontSize: 12.5, fontWeight: 500, whiteSpace: 'pre', letterSpacing: 0 };
  return (
    <Frame uid={uid} w={W} h={H} label="Terminal recording of a build" svg={<>
      <Surf id="term" x={48} y={32} w={384} h={296} r={16} tone="ink" elev={3} seed={[240, 180]} />
      {['#ef4444', '#f59e0b', '#22c55e'].map((f, i) => <Pop key={f} id={`w${i}`} at={.8 + i * .05}><circle cx={70 + i * 17} cy={54} r={5} fill={f} opacity=".9" /></Pop>)}
      <Draw id="tb" d="M48 76.5 H432" stroke="rgba(255,255,255,.08)" width={1} at={.85} />
      <Pop id="rec" at={.95}><circle className="recdot" cx={358} cy={54} r={4} fill="#ef4444" /></Pop>
      <Draw id="ptrack" d={`M150 ${TL[5] + 11} H346`} stroke="rgba(255,255,255,.12)" width={6} at={2.78} dur={.25} />
      <path className="pbar" d={`M150 ${TL[5] + 11} H346`} fill="none" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />
    </>}>
      <Layer id="tt" x={150} y={44} w={180} h={20} at={.85} align="center"><Text size={12} weight={600} color="#94a3b8">agent-kit · zsh</Text></Layer>
      <Layer id="rt" x={366} y={44} w={52} h={20} at={1.0}><Text size={11.5} weight={600} color="#fca5a5" className="tnum rec">0:00</Text></Layer>
      <Layer id="l0" x={66} y={90} w={350} h={22} at={1.0}><Text style={L} color="#67e8f9">~/agent-kit</Text><Text style={L} color="#64748b"> $ </Text><Text style={L} color="#f8fafc" className="cmd" /></Layer>
      <Layer id="l1" x={66} y={TL[0] - 2} w={350} h={22} at={2.12}><Text style={L} color="#94a3b8">&gt; agent-kit@2.4.0 build</Text></Layer>
      <Layer id="l2" x={66} y={TL[1] - 2} w={350} h={22} at={2.24}><Text style={L} color="#94a3b8">&gt; tsup src/index.ts --dts</Text></Layer>
      {OUT.map(([k, f, s], i) => <Layer key={k} id={`o${i}`} x={66} y={TL[2 + i] - 2} w={350} h={22} at={2.38 + i * .12}><Text style={{ ...L, width: 44, fontWeight: 700 }} color="#93c5fd">{k}</Text><Text style={{ ...L, width: 176 }} color="#e2e8f0">{f}</Text><Text style={L} color="#94a3b8" className="tnum">{s}</Text></Layer>)}
      <Layer id="pl" x={66} y={TL[5]} w={80} h={22} at={2.76}><Text style={L} color="#e2e8f0">Bundling</Text></Layer>
      <Layer id="pp" x={354} y={TL[5]} w={60} h={22} at={2.8} align="right"><Text style={L} color="#e2e8f0" className="tnum pct">0%</Text></Layer>
      <Layer id="ok" x={66} y={TL[6]} w={350} h={24} at={3.5} className="gap8"><Icon name="checkCircle" size={17} color="#4ade80" id="ok" /><Text style={{ ...L, fontWeight: 600 }} color="#4ade80">Build succeeded in 3.42s</Text></Layer>
      <Layer id="l8" x={66} y={TL[7]} w={350} h={22} at={3.7}><Text style={L} color="#67e8f9">~/agent-kit</Text><Text style={L} color="#64748b"> $ </Text><span className="tcaret" style={{ display: 'inline-block', width: 7, height: 15, background: '#e2e8f0', borderRadius: 1 }} /></Layer>
    </Frame>
  );
}
TerminalRecording.motion = c => {
  c.typing('[data-layer="l0"] .cmd', 'npm run build', 1.2, 15);
  c.draw('.pbar', '0% 0%', '0% 100%', 2.85, .6, 'power1.inOut');
  c.draw('.pbar', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  c.fromTo('.pbar', { opacity: 1 }, { opacity: 0, duration: .1 }, c.T.collapse + .32);
  c.fromTo('.pbar', { stroke: '#60a5fa' }, { stroke: '#4ade80', duration: .2 }, 3.45);
  const pct = c.q('[data-layer="pp"] .pct'), rec = c.q('[data-layer="rt"] .rec'), caret = c.q('.tcaret'), dot = c.q('.recdot'), E = c.ease('power1.inOut');
  c.after(t => {
    pct.textContent = `${Math.round(100 * E(clamp01((t - 2.85) / .6)))}%`;
    const s = Math.floor(Math.max(0, Math.min(t, 4.05) - 1.0) * 1.4);
    rec.textContent = `0:${String(s).padStart(2, '0')}`;
    caret.style.opacity = t >= 3.95 || Math.floor((t - 3.7) * 4) % 2 === 0 ? '1' : '0';
    dot.setAttribute('opacity', t < 4.05 && Math.floor(t * 1.6) % 2 ? '.35' : '1');
  });
  c.icon('ok', 0, 39, 3.55, .7);
};
Object.assign(TerminalRecording, {
  id: 'terminal-recording', title: 'Terminal recording', category: 'Developer', w: W, h: H, focus: { x: 240, y: 200 }, push: 1.06, exit: [240, 180],
  summary: 'A recorded terminal types a build command, streams its output, fills a progress line and lands on a green success line.',
  usage: `<TerminalRecording />`, icons: ['checkCircle']
});


// ---------------------------------------------------------------- Code diff
const DIFF = [
  ['c', 1, 1, 'export async function retry(fn, max = 3) {'],
  ['d', 2, '', '  for (let i = 0; i < max; i++) {'],
  ['d', 3, '', '    try { return await fn() } catch {}'],
  ['a', '', 2, '  for (let n = 1; n <= max; n++) {'],
  ['a', '', 3, '    try { return await fn() }'],
  ['a', '', 4, '    catch { await sleep(250 * 2 ** n) }'],
  ['c', 4, 5, '  }'],
  ['a', '', 6, "  log.warn('retry', { max })"],
  ['c', 5, 7, "  throw new Error('Retries exhausted')"],
  ['c', 6, 8, '}']
];
const DY = i => 94 + i * 22;
const DEL_T = { 1: 1.85, 2: 1.98 }, INS_T = { 3: 2.22, 4: 2.38, 5: 2.54, 7: 2.78 };
export function CodeDiff({ uid = 'code-diff' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Code diff with four additions and two removals" svg={<>
      <Surf id="card" x={40} y={26} w={400} h={308} r={20} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="badge" x={60} y={42} w={32} h={32} r={10} tone="tint" elev={0} seed={[76, 58]} order={1} />
      <Draw id="hd" d="M40 86.5 H440" stroke="#eef2f6" width={1} at={.8} />
      <Draw id="gut" d="M116.5 87 V334" stroke="#f1f5f9" width={1} at={.9} />
      {DIFF.map(([k], i) => k !== 'c' && <Surf key={i} id={`band${i}`} x={50} y={DY(i)} w={380} h={22} r={5} tone={k === 'd' ? 'redTint' : 'greenTint'} elev={0} seed={[240, DY(i) + 11]} at={k === 'd' ? DEL_T[i] : INS_T[i]} />)}
    </>}>
      <Layer id="bi" kind="icon" x={60} y={42} w={32} h={32} at={.8} align="center"><Icon name="fileText" size={17} color={DEEP} id="file" /></Layer>
      <Layer id="ft" x={102} y={40} w={180} h={36} at={.84}><span className="stack"><Text size={14} weight={600}>src/retry.ts</Text><Text size={11.5} color={SUB}>northwind/agent-kit · PR #128</Text></span></Layer>
      <Layer id="ct" x={290} y={44} w={134} h={28} at={.9} align="right" className="gap8">
        <Text size={13} weight={700} color={GREEN_D} className="tnum plus">+0</Text><Text size={13} weight={700} color={RED_D} className="tnum minus">−0</Text>
        <span style={{ display: 'inline-flex', gap: 2 }}>{[0, 1, 2, 3, 4].map(k => <i key={k} className={`sq sq${k}`} style={{ width: 8, height: 8, borderRadius: 2, background: '#e2e8f0', display: 'block' }} />)}</span>
      </Layer>
      {DIFF.map(([k, o, n, code], i) => {
        const fg = k === 'd' ? RED_D : k === 'a' ? GREEN_D : MUTE;
        return (
          <Layer key={i} id={`d${i}`} x={52} y={DY(i)} w={376} h={22} at={k === 'a' ? INS_T[i] + .08 : 1.0 + i * .045} className={`drow drow${i}`}>
            <Text size={11.5} weight={500} color={fg} className="tnum" style={{ width: 24, textAlign: 'right' }}>{o}</Text>
            <Text size={11.5} weight={500} color={fg} className="tnum" style={{ width: 24, textAlign: 'right', marginRight: 14 }}>{n}</Text>
            <Text size={12.5} weight={700} color={k === 'c' ? 'transparent' : fg} className={`mk mk${i}`} style={{ width: 14 }}>{k === 'd' ? '−' : k === 'a' ? '+' : ''}</Text>
            <Text style={{ ...CODE, paddingLeft: (code.length - code.trimStart().length) * 7 }} color={k === 'c' ? BODY : INK}>{code.trimStart()}</Text>
          </Layer>
        );
      })}
    </Frame>
  );
}
CodeDiff.motion = c => {
  Object.entries(DEL_T).forEach(([i, t]) => c.fromTo(`.mk${i}`, { color: 'rgba(185,28,28,0)' }, { color: RED_D, duration: .2 }, t + .1));
  const rows = c.qa('.drow'), plus = c.q('.plus'), minus = c.q('.minus'), sq = c.qa('.sq'), E = c.ease('power3.out');
  const ins = Object.entries(INS_T).map(([i, t]) => [+i, t]);
  c.after(t => {
    rows.forEach((el, j) => {
      let off = 0; for (const [i, tk] of ins) if (i < j) off -= 22 * (1 - E(clamp01((t - tk) / .34)));
      el.style.transform = `translateY(${off.toFixed(3)}px)`;
    });
    const p = ins.filter(([, tk]) => t >= tk + .12).length, m = Object.values(DEL_T).filter(tk => t >= tk + .12).length;
    plus.textContent = `+${p}`; minus.textContent = `−${m}`;
    const lit = [p >= 1, p >= 3, p >= 4, m >= 1, m >= 2];
    sq.forEach((el, k) => { el.style.background = lit[k] ? (k < 3 ? GREEN : RED) : '#e2e8f0'; });
  });
  c.icon('file', 0, 39, .9, 1.0);
};
Object.assign(CodeDiff, {
  id: 'code-diff', title: 'Code diff', category: 'Developer', w: W, h: H, focus: { x: 240, y: 190 }, push: 1.05, orbit: .85, exit: [240, 180],
  summary: 'A unified diff with line numbers. Removed lines gain red bands, then added lines insert one by one on green bands while the +/− counters tick.',
  usage: `<CodeDiff />`, icons: ['fileText']
});

// ---------------------------------------------------------------- Build time-lapse
const STAGES = [['Install', 'package', 18], ['Lint', 'penTool', 9], ['Test', 'target', 72], ['Build', 'layers', 41], ['Deploy', 'uploadCloud', 27]];
const BTOT = STAGES.reduce((a, s) => a + s[2], 0);
const BWIN = STAGES.map(s => .16 + .62 * s[2] / BTOT);
const BST = BWIN.reduce((a, w) => [...a, a[a.length - 1] + w], [1.8]);
const BNX = i => 84 + i * 78, BNY = 140;
const fmtDur = s => s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`;
const fmtClock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const BAR0 = 62, BAR1 = 418, BARY = 222;
const BSEG = (() => { let x = BAR0; return STAGES.map(s => { const w = (BAR1 - BAR0) * s[2] / BTOT; const seg = [x + 1.5, x + w - 1.5]; x += w; return seg; }); })();
export function BuildTimelapse({ uid = 'build-timelapse' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Build pipeline time-lapse" svg={<>
      <Surf id="card" x={40} y={28} w={400} h={304} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="clock" x={300} y={44} w={118} h={40} r={12} tone="muted" elev={0} seed={[320, 64]} order={1} />
      <Draw id="track" d={`M${BNX(0)} ${BNY} H${BNX(4)}`} stroke="#e2e8f0" width={3} at={.9} dur={.6} />
      <path className="prog" d={`M${BNX(0)} ${BNY} H${BNX(4)}`} fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      {STAGES.map((_, i) => <Surf key={i} id={`n${i}`} x={BNX(i) - 17} y={BNY - 17} w={34} h={34} r={17} tone="white" elev={1} seed={[BNX(i), BNY]} at={1.0 + i * .07} />)}
      {STAGES.map((_, i) => <Surf key={i} id={`ok${i}`} x={BNX(i) - 17} y={BNY - 17} w={34} h={34} r={17} tone="green" elev={0} seed={[BNX(i), BNY]} at={BST[i + 1] - .06} />)}
      <path className="spin" d={`M${BNX(0)} ${BNY - 22} A22 22 0 0 1 ${BNX(0) + 22} ${BNY}`} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" opacity="0" />
      <Draw id="bar" d={`M${BAR0 + 3} ${BARY} H${BAR1 - 3}`} stroke="#eef2f6" width={8} at={1.1} dur={.5} />
      {BSEG.map(([a, b], i) => <path key={i} className={`seg seg${i}`} d={`M${a + 3} ${BARY} H${b - 3}`} fill="none" stroke={i === 2 ? BLUE : '#60a5fa'} strokeWidth="8" strokeLinecap="round" />)}
      <Surf id="pass" x={310} y={262} w={108} h={34} r={17} tone="greenTint" elev={0} seed={[324, 279]} at={BST[5] + .05} />
    </>}>
      <Layer id="t" x={62} y={42} w={220} h={44} at={.72}><span className="stack"><Text size={15.5} weight={600}>Build #482</Text><Text size={12} color={SUB}>main · a1f3c9e · 20x time-lapse</Text></span></Layer>
      <Layer id="ck" x={300} y={44} w={118} h={40} at={.9} align="center" className="gap8"><Icon name="clock" size={18} color={DEEP} id="clock" /><Text size={18} weight={700} className="tnum clk" style={{ width: 44 }}>0:00</Text></Layer>
      {STAGES.map(([l, ic], i) => (
        <React.Fragment key={l}>
          <Layer id={`si${i}`} kind="icon" x={BNX(i) - 17} y={BNY - 17} w={34} h={34} at={1.15 + i * .07} align="center"><Icon name={ic} size={16} color={SUB} id={`si${i}`} /></Layer>
          <Layer id={`sc${i}`} kind="icon" x={BNX(i) - 17} y={BNY - 17} w={34} h={34} at={BST[i + 1] + .08} align="center"><Icon name="checkmark" size={18} color="#fff" id={`sc${i}`} /></Layer>
          <Layer id={`sl${i}`} x={BNX(i) - 38} y={BNY + 24} w={76} h={18} at={1.2 + i * .07} align="center"><Text size={12.5} weight={600} color={BODY} className={`sl${i}`}>{l}</Text></Layer>
          <Layer id={`sd${i}`} x={BNX(i) - 38} y={BNY + 42} w={76} h={16} at={BST[i + 1] + .04} align="center"><Text size={11.5} weight={500} color={SUB} className="tnum">{fmtDur(STAGES[i][2])}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="tl" x={62} y={240} w={200} h={18} at={1.2}><Text size={12} weight={600} color={SUB}>Total build time</Text></Layer>
      <Layer id="tv" x={62} y={258} w={200} h={42} at={1.25}><Text size={32} weight={700} className="tnum tot" style={{ letterSpacing: '-.03em', display: 'inline-block', transformOrigin: '0% 70%' }}>0:00</Text></Layer>
      <Layer id="pt" x={310} y={262} w={108} h={34} at={BST[5] + .25} align="center" className="gap6"><Icon name="checkCircle" size={17} color={GREEN} id="pass" /><Text size={13} weight={600} color={GREEN_D}>Passed</Text></Layer>
    </Frame>
  );
}
BuildTimelapse.motion = c => {
  const pct = i => (BNX(i) - BNX(0)) / (BNX(4) - BNX(0)) * 100;
  for (let i = 1; i < 5; i++) c.draw('.prog', `0% ${pct(i - 1)}%`, `0% ${pct(i)}%`, BST[i], BWIN[i] * .9, 'power1.inOut');
  c.draw('.prog', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  c.fromTo('.prog', { opacity: 1 }, { opacity: 0, duration: .1 }, c.T.collapse + .32);
  BSEG.forEach((_, i) => {
    c.draw(`.seg${i}`, '0% 0%', '0% 100%', BST[i], BWIN[i], 'none');
    c.fromTo(`.seg${i}`, { stroke: i === 2 ? BLUE : '#60a5fa' }, { stroke: GREEN, duration: .2 }, BST[i + 1] - .02);
    c.draw(`.seg${i}`, '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
    c.fromTo(`.seg${i}`, { opacity: 1 }, { opacity: 0, duration: .1 }, c.T.collapse + .32);
  });
  STAGES.forEach((_, i) => {
    c.hide(`si${i}`, BST[i + 1] - .04, .14);
    c.icon(`sc${i}`, 0, 44, BST[i + 1] + .1, .45);
    c.fromTo(`[data-icon="si${i}"]`, { color: SUB }, { color: BLUE, duration: .12 }, BST[i]);
    c.fromTo(`.sl${i}`, { color: BODY }, { color: INK, duration: .15 }, BST[i]);
  });
  c.icon('clock', 0, 39, BST[0], (BST[5] - BST[0]) / 2).icon('clock', 0, 39, (BST[0] + BST[5]) / 2, (BST[5] - BST[0]) / 2);
  c.icon('pass', 0, 39, BST[5] + .3, .7);
  const spin = c.q('.spin'), clk = c.q('.clk'), tot = c.q('.tot');
  const elapsed = t => STAGES.reduce((a, s, i) => a + s[2] * clamp01((t - BST[i]) / BWIN[i]), 0);
  c.after(t => {
    const e = elapsed(t), txt = fmtClock(e);
    clk.textContent = txt; tot.textContent = txt;
    let i = 0; while (i < 4 && t >= BST[i + 1]) i++;
    const run = t >= BST[0] - .05 && t < BST[5] - .04;
    spin.setAttribute('opacity', run ? '1' : '0');
    spin.setAttribute('transform', `translate(${BNX(i) - BNX(0)} 0) rotate(${(t * 520).toFixed(2)} ${BNX(0)} ${BNY})`);
  });
  c.fromTo('.tot', { scale: 1 }, { scale: 1.07, duration: .12, ease: 'power2.out' }, BST[5]).fromTo('.tot', { scale: 1.07 }, { scale: 1, duration: .6, ease: 'elastic.out(1,0.45)' }, BST[5] + .12);
  c.fromTo('.tot', { color: INK }, { color: GREEN_D, duration: .2 }, BST[5]);
};
Object.assign(BuildTimelapse, {
  id: 'build-timelapse', title: 'Build time-lapse', category: 'Developer', w: W, h: H, focus: { x: 240, y: 170 }, push: 1.05, exit: [240, 180],
  summary: 'Install, Lint, Test, Build and Deploy complete in fast sequence with native checkmarks while a time-lapse clock runs and the total settles at 2:47.',
  usage: `<BuildTimelapse />`, icons: ['clock', 'package', 'penTool', 'target', 'layers', 'uploadCloud', 'checkmark', 'checkCircle']
});

// ---------------------------------------------------------------- Install moment
const TRY = i => 112 + i * 30;
const TREE = [['folder', 'my-app', 72, 0], ['folder', 'node_modules', 92, 0], ['package', 'agent-kit', 112, 1], ['folder', 'src', 92, 1], ['fileText', 'package.json', 92, 1]];
const DROP = 2.72;
export function InstallMoment({ uid = 'install-moment' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Installing agent-kit into a project" svg={<>
      <Surf id="card" x={40} y={22} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="term" x={58} y={40} w={364} h={42} r={12} tone="ink" elev={1} seed={[80, 61]} order={1} />
      <Surf id="tree" x={58} y={98} w={214} h={168} r={14} tone="muted" elev={0} seed={[80, 120]} order={2} />
      <Draw id="g1" d={`M82 ${TRY(0) + 24} V${TRY(1) + 14} H88`} stroke="#cbd5e1" width={1.5} at={1.1} dur={.3} />
      <path className="g2" d={`M102 ${TRY(1) + 24} V${TRY(2) + 14} H108`} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <Surf id="row" x={104} y={TRY(2) + 1} w={160} h={26} r={8} tone="tint" elev={0} seed={[116, TRY(2) + 14]} at={DROP + .36} />
      <Surf id="pkg" x={318} y={104} w={72} h={72} r={18} tone="tint" elev={2} seed={[200, 61]} at={1.6} />
      <Surf id="dep" x={288} y={104} w={134} h={72} r={14} tone="greenTint" elev={0} seed={[300, 140]} at={DROP + .5} />
      <Surf id="toast" x={58} y={280} w={364} h={44} r={14} tone="ink" elev={3} seed={[240, 302]} at={DROP + .42} />
    </>}>
      <Layer id="cmd" x={74} y={40} w={200} h={42} at={.8}><Text style={CODE} color="#64748b">$ </Text><Text style={CODE} color="#f8fafc" className="cmd" /></Layer>
      <Layer id="st" x={250} y={40} w={158} h={42} at={2.15} align="right"><Text size={11.5} weight={500} color="#94a3b8" className="tnum">added 1 package · 1.4s</Text></Layer>
      {TREE.map(([ic, n, x], i) => i !== 2 && (
        <Layer key={n} id={`r${i}`} x={x} y={TRY(i)} w={180} h={28} at={1.0 + i * .06} className={`gap8 trw trw${i}`}><Icon name={ic} size={16} color={ic === 'folder' ? BLUE : SUB} id={`ti${i}`} /><Text size={13} weight={i ? 500 : 600} color={i ? BODY : INK}>{n}</Text></Layer>
      ))}
      <Layer id="nl" x={136} y={TRY(2)} w={128} h={28} at={DROP + .55} className="gap6"><Text size={13} weight={600} color={DEEP}>agent-kit</Text><Text size={11.5} color={MUTE} className="tnum">2.4.0</Text></Layer>
      <Layer id="pk" kind="icon" x={318} y={104} w={72} h={72} at={1.85} align="center"><Icon name="package" size={34} color={DEEP} id="pkg" /></Layer>
      <Layer id="pl" x={288} y={182} w={132} h={40} at={1.95} align="center"><span className="stack center"><Text size={13} weight={600}>agent-kit</Text><Text size={11.5} color={SUB} className="tnum">v2.4.0 · 48 kB</Text></span></Layer>
      <Layer id="dh" x={302} y={114} w={116} h={20} at={DROP + .7} className="gap6"><Icon name="fileText" size={14} color={GREEN_D} id="pj" /><Text size={11.5} weight={600} color={GREEN_D}>package.json</Text></Layer>
      <Layer id="dl" x={302} y={140} w={116} h={26} at={DROP + .78}><Text style={{ ...CODE, fontSize: 12.5, fontWeight: 600 }} color={GREEN_D}>+ agent-kit ^2.4.0</Text></Layer>
      <Layer id="vu" x={290} y={190} w={130} h={20} at={DROP + .85} className="gap6"><Icon name="shield" size={15} color={GREEN} id="sh" /><Text size={12} weight={500} color={BODY}>0 vulnerabilities</Text></Layer>
      <Layer id="tt" x={74} y={280} w={340} h={44} at={DROP + .62} className="gap8"><Icon name="checkCircle" size={18} color="#4ade80" id="ok" /><Text size={13.5} weight={600} color="#fff" style={{ flex: 1 }}>Installed agent-kit 2.4.0</Text><Text size={12} color="#94a3b8" className="tnum">13 packages audited</Text></Layer>
    </Frame>
  );
}
InstallMoment.motion = c => {
  c.typing('[data-layer="cmd"] .cmd', 'npm i agent-kit', .85, 22);
  const E = 'power3.inOut', X = 119 - 354, Y = TRY(2) + 14 - 140;
  c.hide('pl', DROP - .12, .2);
  c.reshape('pkg', rect(108, TRY(2) + 3, 22, 22, 6), DROP, .5, E);
  c.fromTo('[data-layer="pk"]', { x: 0, y: 0, scale: 1 }, { x: X, y: Y, scale: .46, duration: .5, ease: E }, DROP);
  c.fromTo('[data-layer="pk"] .fc-ua', { color: DEEP }, { color: DEEP, duration: .01 }, DROP);
  c.press('pkg', null, DROP + .5, .6);
  c.icon('pkg', 0, 39, 1.95, .8);
  c.fromTo('.trw3, .trw4', { y: -30 }, { y: 0, duration: .4, ease: 'back.out(1.3)' }, DROP + .16);
  c.draw('.g2', '0% 0%', '0% 100%', DROP + .4, .3, 'power2.out');
  c.draw('.g2', '0% 100%', '100% 100%', c.T.collapse + .05, .3, 'power2.in');
  c.fromTo('.g2', { opacity: 1 }, { opacity: 0, duration: .1 }, c.T.collapse + .3);
  c.icon('ok', 0, 39, DROP + .7, .7);
  c.icon('sh', 0, 33, DROP + .9, .7);
};
Object.assign(InstallMoment, {
  id: 'install-moment', title: 'Install moment', category: 'Developer', w: W, h: H, focus: { x: 220, y: 190 }, push: 1.04, exit: [240, 180],
  summary: 'An install command runs, a native package box forms and drops into node_modules as the tree makes room, then an Installed toast forms.',
  usage: `<InstallMoment />`, icons: ['package', 'folder', 'fileText', 'shield', 'checkCircle']
});

// ---------------------------------------------------------------- Skill folder
const SKY = i => 102 + i * 34, SKC = i => SKY(i) + 14;
const SKILL = [['folder', 'release-notes', 0], ['fileText', 'SKILL.md', 1], ['folder', 'scripts', 1], ['code', 'collect.ts', 2], ['folder', 'references', 1], ['fileText', 'voice.md', 2]];
const SKT = i => 1.98 + (i - 1) * .11;
const SKX = d => d === 1 ? 108 : 134;
const PREVIEW = [['---', MUTE], [<><b style={{ color: DEEP, fontWeight: 600 }}>name:</b> release-notes</>, INK], [<><b style={{ color: DEEP, fontWeight: 600 }}>description:</b> Drafts</>, INK], ['release notes from', INK], ['merged pull requests.', INK], ['---', MUTE], [<b style={{ fontWeight: 700 }}># Release notes</b>, INK], ['1. Collect merged PRs', BODY], ['2. Group by label', BODY]];
export function SkillFolder({ uid = 'skill-folder' }) {
  const elbow = (x, y0, cy, x1) => `M${x} ${y0} V${cy - 6} Q${x} ${cy} ${x + 6} ${cy} H${x1}`;
  return (
    <Frame uid={uid} w={W} h={H} label="Skill folder opening to show SKILL.md" svg={<>
      <Surf id="card" x={40} y={22} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Draw id="hd" d="M40 88.5 H440" stroke="#eef2f6" width={1} at={.8} />
      <Surf id="root" x={76} y={SKY(0)} w={28} h={28} r={8} tone="tint" elev={1} seed={[90, SKC(0)]} at={.95} />
      {SKILL.map(([, , d], i) => i > 0 && <Draw key={i} id={`e${i}`} d={d === 1 ? elbow(90, SKY(0) + 30, SKC(i), 104) : elbow(116, SKY(i - 1) + 24, SKC(i), 130)} stroke="#cbd5e1" width={1.5} at={SKT(i) - .06} dur={.32} />)}
      <Surf id="sel" x={100} y={SKY(1)} w={136} h={28} r={8} tone="tint" elev={0} seed={[110, SKC(1)]} at={2.95} />
      <Surf id="pv" x={252} y={102} w={172} h={218} r={14} tone="muted" elev={0} seed={[236, SKC(1)]} at={3.02} />
      <Draw id="pvd" d="M252 140.5 H424" stroke="#e2e8f0" width={1} at={3.3} dur={.3} />
    </>}>
      <Layer id="t" x={62} y={38} w={260} h={44} at={.72}><span className="stack"><Text size={15.5} weight={600}>Skills</Text><Text size={12} color={SUB} className="tnum">~/.agents/skills · 5 files</Text></span></Layer>
      <Layer id="cv" x={56} y={SKY(0)} w={18} h={28} at={.95} align="center"><span className="chev"><Icon name="chevronRight" size={14} color={SUB} id="chev" /></span></Layer>
      <Layer id="ri" kind="icon" x={76} y={SKY(0)} w={28} h={28} at={1.05} align="center"><Icon name="folder" size={16} color={DEEP} id="root" /></Layer>
      <Layer id="rl" x={112} y={SKY(0)} w={130} h={28} at={1.1}><Text size={13.5} weight={600}>release-notes</Text></Layer>
      {SKILL.map(([ic, n, d], i) => i > 0 && (
        <React.Fragment key={n}>
          <Layer id={`ic${i}`} kind="icon" x={SKX(d) - 2} y={SKY(i)} w={20} h={28} at={SKT(i)} align="center"><Icon name={ic} size={16} color={ic === 'folder' ? BLUE : SUB} id={`ic${i}`} /></Layer>
          <Layer id={`lb${i}`} x={SKX(d) + 24} y={SKY(i)} w={120} h={28} at={SKT(i) + .04}><Text size={13} weight={i === 1 ? 600 : 500} color={i === 1 ? INK : BODY} className={`lb${i}`}>{n}{ic === 'folder' ? '/' : ''}</Text></Layer>
        </React.Fragment>
      ))}
      <Layer id="ph" x={266} y={110} w={150} h={24} at={3.26} className="gap6"><Icon name="fileText" size={15} color={DEEP} id="pvi" /><Text size={12.5} weight={600}>SKILL.md</Text></Layer>
      {PREVIEW.map(([l, col], i) => <Layer key={i} id={`pv${i}`} x={266} y={148 + i * 18.5} w={152} h={18} at={3.3 + i * .035}><Text size={11.5} weight={500} color={col}>{l}</Text></Layer>)}
    </Frame>
  );
}
SkillFolder.motion = c => {
  c.cursor([{ at: 1.82, x: 100, y: SKC(0) + 10, press: true }, { at: 2.88, x: 226, y: SKC(1) + 9, press: true }]);
  c.press('root', '[data-layer="ri"]', 1.82, 1);
  c.icon('root', 0, 7, 1.86, .3);
  c.fromTo('[data-layer="cv"] .chev', { rotation: 0 }, { rotation: 90, duration: .4, ease: 'back.out(1.8)' }, 1.86);
  SKILL.forEach(([ic], i) => i > 0 && ic === 'folder' && c.icon(`ic${i}`, 0, 7, SKT(i) + .1, .3));
  c.press('sel', '[data-layer="lb1"]', 3.0, .6);
  c.fromTo('.lb1', { color: INK }, { color: DEEP, duration: .2 }, 2.95);
  c.icon('ic1', 0, 39, 2.95, .9);
  c.fromTo('[data-icon="ic1"]', { color: SUB }, { color: DEEP, duration: .2 }, 2.95);
};
Object.assign(SkillFolder, {
  id: 'skill-folder', title: 'Skill folder', category: 'Developer', w: W, h: H, focus: { x: 220, y: 190 }, push: 1.05, exit: [240, 180],
  summary: 'A skill folder opens and its tree draws branch by branch as SKILL.md, scripts and references pop in. Selecting SKILL.md grows a preview of its frontmatter.',
  usage: `<SkillFolder />`, icons: ['folder', 'chevronRight', 'fileText', 'code']
});

// ---------------------------------------------------------------- Tool icons
const TOOLS = [['terminal', 'Terminal'], ['code', 'Code'], ['database', 'Database'], ['globe', 'Web'], ['folder', 'Files'], ['searchToX', 'Search'], ['calendar', 'Calendar'], ['mail', 'Mail']];
const TTX = k => 54 + (k % 4) * 100, TTY = k => 92 + Math.floor(k / 4) * 104;
const ORDER = [0, 1, 2, 3, 7, 6];
const TSTEP = ORDER.map((_, i) => 1.75 + i * .28);
const STATUS = ['Running tests in terminal', 'Editing src/retry.ts', 'Querying the reviews table', 'Searching the web', 'Drafting the team email', 'Booking a review slot', 'Done · 6 tool calls in 41s'];
const TRAIL = `M90 128 H390 V232 H290`;
const TLEN = [0, 100, 200, 300, 404, 504];
export function ToolIcons({ uid = 'tool-icons' }) {
  return (
    <Frame uid={uid} w={W} h={H} label="Agent tool calls lighting up in order" svg={<>
      <Surf id="card" x={40} y={22} w={400} h={316} r={22} tone="white" elev={3} seed={[240, 180]} />
      <Surf id="live" x={330} y={44} w={88} h={26} r={13} tone="tint" elev={0} seed={[342, 57]} order={1} />
      <path className="trail" d={TRAIL} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g className="head" opacity="0"><circle r="10" fill={BLUE} opacity=".18" /><circle r="4.5" fill={BLUE} stroke="#fff" strokeWidth="1.5" /></g>
      {TOOLS.map((_, k) => <Surf key={k} id={`t${k}`} x={TTX(k)} y={TTY(k)} w={72} h={72} r={18} tone="white" elev={2} seed={[TTX(k) + 36, TTY(k) + 36]} at={.95 + k * .05} />)}
      {ORDER.map((k, i) => <Surf key={k} id={`on${k}`} x={TTX(k)} y={TTY(k)} w={72} h={72} r={18} tone="blue" elev={0} seed={[TTX(k) + 36, TTY(k) + 36]} at={TSTEP[i] - .02} />)}
      {ORDER.map((k, i) => <Surf key={k} id={`b${k}`} x={TTX(k) + 58} y={TTY(k) - 8} w={22} h={22} r={11} tone="ink" elev={1} seed={[TTX(k) + 69, TTY(k) + 3]} at={TSTEP[i] + .1} />)}
    </>}>
      <Layer id="tt" x={62} y={38} w={260} h={44} at={.72}><span className="stack"><Text size={15.5} weight={600}>Agent run</Text><Text size={12} color={SUB}>Task 128 · reschedule the code review</Text></span></Layer>
      <Layer id="lv" x={330} y={44} w={88} h={26} at={.9} align="center" className="gap6"><span className="live-dot" /><Text size={12} weight={600} color={DEEP} className="tnum calls">0 calls</Text></Layer>
      {TOOLS.map(([ic, l], k) => (
        <React.Fragment key={k}>
          <Layer id={`ti${k}`} kind="icon" x={TTX(k)} y={TTY(k) + 10} w={72} h={32} at={1.1 + k * .05} align="center" className={`tic tic${k}`}><Icon name={ic} size={24} color={DEEP} id={`ti${k}`} /></Layer>
          <Layer id={`tl${k}`} x={TTX(k)} y={TTY(k) + 44} w={72} h={18} at={1.15 + k * .05} align="center" className={`tlb tlb${k}`}><Text size={11.5} weight={600} color={BODY} className={`tl${k}`}>{l}</Text></Layer>
        </React.Fragment>
      ))}
      {ORDER.map((k, i) => <Layer key={k} id={`bn${k}`} x={TTX(k) + 58} y={TTY(k) - 8} w={22} h={22} at={TSTEP[i] + .24} align="center"><Text size={11} weight={700} color="#fff" className="tnum">{i + 1}</Text></Layer>)}
      <Layer id="ft" x={62} y={286} w={356} h={30} at={1.3} className="gap8"><Icon name="zap" size={16} color={DEEP} id="zap" /><Text size={13} weight={500} color={BODY} className="status">Planning tool calls</Text></Layer>
    </Frame>
  );
}
ToolIcons.motion = c => {
  const trail = c.q('.trail'), head = c.q('.head'), L = trail.getTotalLength(), E = c.ease('power2.inOut');
  for (let i = 1; i < ORDER.length; i++) c.draw('.trail', `0% ${TLEN[i - 1] / 5.04}%`, `0% ${TLEN[i] / 5.04}%`, TSTEP[i - 1] + .04, TSTEP[i] - TSTEP[i - 1] - .04, 'power2.inOut');
  c.draw('.trail', '0% 0%', '0% 0%', 0, .01, 'none');
  c.draw('.trail', '0% 100%', '100% 100%', c.T.collapse + .05, .35, 'power2.in');
  c.fromTo('.trail', { opacity: 1 }, { opacity: 0, duration: .1 }, c.T.collapse + .32);
  c.after(t => {
    let len = 0;
    for (let i = 1; i < ORDER.length; i++) len = t < TSTEP[i - 1] + .04 ? len : TLEN[i - 1] + (TLEN[i] - TLEN[i - 1]) * E(clamp01((t - TSTEP[i - 1] - .04) / (TSTEP[i] - TSTEP[i - 1] - .04)));
    const p = trail.getPointAtLength(len / 504 * L);
    head.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);
    head.setAttribute('opacity', t >= TSTEP[0] && t < TSTEP[5] + .3 ? '1' : '0');
  });
  ORDER.forEach((k, i) => {
    const at = TSTEP[i];
    c.fromTo(`[data-icon="ti${k}"]`, { color: DEEP }, { color: '#ffffff', duration: .2 }, at + .12);
    c.fromTo(`.tl${k}`, { color: BODY }, { color: '#dbeafe', duration: .2 }, at + .12);
    c.icon(`ti${k}`, 0, k === 7 ? 19 : k === 6 ? 7 : 33, at + .14, .55);
  });
  [4, 5].forEach(k => c.fromTo(`.tic${k} .fc-carrier, .tlb${k} .fc-carrier`, { opacity: 1 }, { opacity: .42, duration: .4 }, TSTEP[0]));
  c.swap('[data-layer="ft"] .status', ['Planning tool calls', ...STATUS], [TSTEP[0], ...TSTEP.slice(1), TSTEP[5] + .45]);
  c.swap('[data-layer="lv"] .calls', ['0 calls', '1 call', '2 calls', '3 calls', '4 calls', '5 calls', '6 calls'], TSTEP.map(t => t + .1));
  c.icon('zap', 0, 33, TSTEP[5] + .45, .6);
};
Object.assign(ToolIcons, {
  id: 'tool-icons', title: 'Tool icons', category: 'Developer', w: W, h: H, focus: { x: 240, y: 180 }, push: 1.05, exit: [240, 180],
  summary: 'A grid of native tool icons. Tiles light up in the order an agent calls them while a trail draws between them and numbered badges record the sequence.',
  usage: `<ToolIcons />`, icons: ['terminal', 'code', 'database', 'globe', 'folder', 'searchToX', 'calendar', 'mail', 'zap']
});

export const LIST_C = [DocsPage, RepoPage, StarCounter, ReadmeScroll, TerminalRecording, CodeDiff, BuildTimelapse, InstallMoment, SkillFolder, ToolIcons];
