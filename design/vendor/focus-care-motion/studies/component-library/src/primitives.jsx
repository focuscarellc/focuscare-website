// Focus Care component primitives. Geometry is authored in world units (px at 1x).
// SVG carries the surfaces (chassis, tracks, fills, shadows) so GSAP can form them
// from a seed with MorphSVG/DrawSVG. HTML layers carry Inter labels and native
// useAnimations icons on independent carriers above the chassis.
import React, { createContext, useContext } from 'react';
import { rr, rect, shadowRects } from './geometry.js';

const Uid = createContext('fc');
export const useUid = () => useContext(Uid);

export const TONES = ['white', 'blue', 'muted', 'track', 'tint', 'ink', 'green', 'greenTint', 'amberTint', 'redTint', 'glass'];

function Defs({ uid, w, h }) {
  const fr = { x: -160, y: -160, width: w + 320, height: h + 320, filterUnits: 'userSpaceOnUse' };
  return (
    <defs>
      <filter id={`${uid}-blur-a`} {...fr}><feGaussianBlur stdDeviation="11" /></filter>
      <filter id={`${uid}-blur-c`} {...fr}><feGaussianBlur stdDeviation="1.4" /></filter>
      <filter id={`${uid}-blur-g`} {...fr}><feGaussianBlur stdDeviation="6" /></filter>
      <linearGradient id={`${uid}-white`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#f9fbfe" /></linearGradient>
      <linearGradient id={`${uid}-blue`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f8cff" /><stop offset=".55" stopColor="#2d7dff" /><stop offset="1" stopColor="#2470ee" /></linearGradient>
      <linearGradient id={`${uid}-ink`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e293b" /><stop offset="1" stopColor="#0f172a" /></linearGradient>
      <linearGradient id={`${uid}-green`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1fb457" /><stop offset="1" stopColor="#16a34a" /></linearGradient>
      <linearGradient id={`${uid}-red`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f05252" /><stop offset="1" stopColor="#dc2626" /></linearGradient>
      <linearGradient id={`${uid}-muted`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef2f7" /><stop offset="1" stopColor="#f4f7fa" /></linearGradient>
      <linearGradient id={`${uid}-track`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dbe2ea" /><stop offset="1" stopColor="#e5eaf0" /></linearGradient>
      <linearGradient id={`${uid}-tint`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2f7ff" /><stop offset="1" stopColor="#eaf2ff" /></linearGradient>
      <linearGradient id={`${uid}-greenTint`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ecfdf3" /><stop offset="1" stopColor="#dcfce7" /></linearGradient>
      <linearGradient id={`${uid}-amberTint`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffbeb" /><stop offset="1" stopColor="#fef3c7" /></linearGradient>
      <linearGradient id={`${uid}-redTint`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff5f5" /><stop offset="1" stopColor="#fee2e2" /></linearGradient>
      <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".96" /><stop offset="1" stopColor="#f8fafc" stopOpacity=".94" /></linearGradient>
      <linearGradient id={`${uid}-hl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".95" /><stop offset=".35" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
      <linearGradient id={`${uid}-hl-blue`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity=".38" /><stop offset=".4" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
      <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2d7dff" stopOpacity=".22" /><stop offset="1" stopColor="#2d7dff" stopOpacity="0" /></linearGradient>
    </defs>
  );
}

// World-sized component frame: SVG chassis + HTML overlay share one coordinate system.
export function Frame({ uid, w, h, children, svg, label }) {
  return (
    <Uid.Provider value={uid}>
      <div className="fc-frame" style={{ width: w, height: h }} role="img" aria-label={label}>
        <svg className="fc-chassis" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          <Defs uid={uid} w={w} h={h} />
          {svg}
        </svg>
        <div className="fc-overlay">{children}</div>
        <Cursor />
      </div>
    </Uid.Provider>
  );
}

const DARK = new Set(['blue', 'ink', 'green', 'red']);
// A surface: ambient + contact shadow, body, top highlight, hairline edge and the forming trace.
export function Surf({ id, x, y, w, h, r = 12, tone = 'white', elev = 2, seed, at, order = 0, edge = true }) {
  const uid = useUid();
  const g = rect(x, y, w, h, r);
  const s = shadowRects(g, elev);
  const ambient = tone === 'blue' ? 'rgba(45,125,255,.34)' : tone === 'green' ? 'rgba(22,163,74,.28)' : tone === 'red' ? 'rgba(220,38,38,.26)' : tone === 'ink' ? 'rgba(15,23,42,.28)' : 'rgba(29,78,216,.13)';
  return (
    <g className={`fc-surf tone-${tone}`} data-surf={id} data-g={[x, y, w, h, r].join(',')} data-elev={elev}
       data-seed={seed ? seed.join(',') : undefined} data-at={at} data-order={order}>
      {elev > 0 && <path className="sh-a" d={rr(s.ambient.x, s.ambient.y, s.ambient.w, s.ambient.h, s.ambient.r)} fill={ambient} filter={`url(#${uid}-blur-a)`} />}
      {elev > 0 && <path className="sh-c" d={rr(s.contact.x, s.contact.y, s.contact.w, s.contact.h, s.contact.r)} fill="rgba(15,23,42,.13)" filter={`url(#${uid}-blur-c)`} />}
      <path className="body" d={rr(x, y, w, h, r)} fill={`url(#${uid}-${tone})`} />
      {elev > 0 && <path className="hl" d={rr(x + .75, y + .75, w - 1.5, h - 1.5, Math.max(0, r - .75))} fill="none" stroke={`url(#${uid}-${DARK.has(tone) ? 'hl-blue' : 'hl'})`} strokeWidth="1.5" />}
      {edge && <path className="edge" d={rr(x, y, w, h, r)} fill="none" stroke={DARK.has(tone) ? 'rgba(15,23,42,.10)' : tone === 'tint' ? '#cfe0ff' : tone === 'greenTint' ? '#bbf7d0' : tone === 'amberTint' ? '#fde68a' : tone === 'redTint' ? '#fecaca' : '#e2e8f0'} strokeWidth="1" vectorEffect="non-scaling-stroke" />}
      <path className="trace" d={rr(x, y, w, h, r)} fill="none" stroke="#2d7dff" strokeWidth="1.5" strokeLinecap="round" opacity="0" />
    </g>
  );
}

// A stroked vector that is drawn on with DrawSVG (lines, rings, sparklines, strikes).
export function Draw({ d, stroke = '#2d7dff', width = 2, at, dur, id, cap = 'round', dash, opacity, fill = 'none', className = '' }) {
  return <path className={`fc-draw ${className}`} data-draw={id || ''} data-at={at} data-dur={dur} d={d} fill={fill} stroke={stroke}
    strokeWidth={width} strokeLinecap={cap} strokeLinejoin="round" strokeDasharray={dash} opacity={opacity} />;
}

// A small vector element that pops into place (dots, knobs, markers).
export function Pop({ children, at, id, origin, ease }) {
  return <g className="fc-pop" data-pop={id || ''} data-at={at} data-origin={origin} data-ease={ease}>{children}</g>;
}

// HTML carrier positioned in world units. The outer layer masks; the inner carrier moves.
export function Layer({ x, y, w, h, at, kind = 'label', id, children, align = 'left', className = '', style }) {
  return (
    <div className={`fc-layer ${className}`} data-layer={id || ''} data-kind={kind} data-at={at}
         style={{ left: x, top: y, width: w, height: h, justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', ...style }}>
      <div className="fc-carrier">{children}</div>
    </div>
  );
}

// Native useAnimations icon. Frames are sought explicitly by the motion engine.
export function Icon({ name, size = 22, color = '#1d4ed8', fill = false, id, className = '' }) {
  return <span className={`fc-ua ${fill ? 'fc-ua-fill' : ''} ${className}`} data-ua={name} data-icon={id || name}
    style={{ width: size, height: size, color }} aria-hidden="true" />;
}

export const Text = ({ children, size = 15, weight = 500, color = '#0f172a', className = '', style, ...rest }) => (
  <span className={`fc-text ${className}`} style={{ fontSize: size, fontWeight: weight, color, ...style }} {...rest}>{children}</span>
);

// Interaction cursor: authored geometry (not an icon-library asset).
export function Cursor() {
  return (
    <div className="fc-cursor" aria-hidden="true">
      <svg width="26" height="30" viewBox="0 0 26 30">
        <path d="M3.2 2.4 L3.2 22.6 L8.4 17.9 L12.1 26.2 L16 24.5 L12.4 16.4 L19.6 16.4 Z" fill="rgba(15,23,42,.18)" transform="translate(1.2 1.6)" filter="blur(1.2px)" />
        <path d="M3.2 2.4 L3.2 22.6 L8.4 17.9 L12.1 26.2 L16 24.5 L12.4 16.4 L19.6 16.4 Z" fill="#0f172a" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="fc-cursor-ring" />
    </div>
  );
}
