// Shared vector geometry. Every surface is a rounded rectangle written with the same
// command structure (M H C V C H C V C Z), so MorphSVG keeps a stable point
// correspondence when a surface grows from its seed, changes size or collapses.
const K = 0.5522847498;
const n = v => Math.round(v * 100) / 100;

export function rr(x, y, w, h, r = 0) {
  w = Math.max(w, 0.01); h = Math.max(h, 0.01);
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const k = K * r;
  return [
    `M${n(x + r)},${n(y)}`, `H${n(x + w - r)}`,
    `C${n(x + w - r + k)},${n(y)} ${n(x + w)},${n(y + r - k)} ${n(x + w)},${n(y + r)}`,
    `V${n(y + h - r)}`,
    `C${n(x + w)},${n(y + h - r + k)} ${n(x + w - r + k)},${n(y + h)} ${n(x + w - r)},${n(y + h)}`,
    `H${n(x + r)}`,
    `C${n(x + r - k)},${n(y + h)} ${n(x)},${n(y + h - r + k)} ${n(x)},${n(y + h - r)}`,
    `V${n(y + r)}`,
    `C${n(x)},${n(y + r - k)} ${n(x + r - k)},${n(y)} ${n(x + r)},${n(y)}`, 'Z'
  ].join(' ');
}

// A seed is the compact pill a surface forms from and collapses back into.
export const seedRect = (cx, cy, s = 10) => ({ x: cx - s / 2, y: cy - s / 2, w: s, h: s, r: s / 2 });
export const rect = (x, y, w, h, r) => ({ x, y, w, h, r });
export const pathOf = g => rr(g.x, g.y, g.w, g.h, g.r);

// Shadow geometry derived from the surface so shadows form, resize and collapse with it.
export function shadowRects(g, elev = 2) {
  const e = Math.max(0, elev);
  return {
    contact: rect(g.x + 0.5, g.y + 1 + e * 0.35, g.w - 1, g.h, g.r),
    ambient: rect(g.x + Math.min(10, g.w * 0.08), g.y + 4 + e * 3, g.w - Math.min(20, g.w * 0.16), g.h - Math.min(4, g.h * 0.1), g.r)
  };
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
