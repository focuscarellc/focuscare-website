// Build-time markup for the RIGHT hero art. The left copy (headline, CTA, service links)
// stays owned by the root build. Initial markup is the complete Recruitment state, readable
// without JS; rail items are real service links until the runtime upgrades them to buttons.
import { readFileSync } from 'node:fs';
import { WF } from './data.mjs';
import { SERVICE_WF } from './service-data.mjs';

// The pinned geometry module sits under a CommonJS package scope, so it is evaluated
// unchanged as an ES module from its own source text (vendor files are never edited).
const GEO_URL = new URL('../../../vendor/focus-care-motion/studies/component-library/src/geometry.js', import.meta.url);
const { rr, rect, shadowRects } = await import('data:text/javascript,' + encodeURIComponent(readFileSync(GEO_URL, 'utf8')));

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const chip = ([text, tone], cls = '') => `<span class="hx-chip t-${tone}${cls}">${esc(text)}</span>`;

// Surf structure from primitives.jsx (ambient + contact shadow, body, highlight, edge),
// tone "white", elevation 2. The runtime rewrites these paths with rr() every geometry change.
function chassis(w = 400, h = 286, r = 22) {
  const g = rect(0, 0, w, h, r), s = shadowRects(g, 2);
  return `<svg class="hx-chassis" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false"><defs><filter id="hx-blur-a" x="-160" y="-160" width="${w + 320}" height="${h + 320}" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="11"/></filter><filter id="hx-blur-c" x="-160" y="-160" width="${w + 320}" height="${h + 320}" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="1.4"/></filter><linearGradient id="hx-white" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f9fbfe"/></linearGradient><linearGradient id="hx-hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>`
    + `<path class="sh-a" d="${rr(s.ambient.x, s.ambient.y, s.ambient.w, s.ambient.h, s.ambient.r)}" fill="rgba(29,78,216,.13)" filter="url(#hx-blur-a)"/>`
    + `<path class="sh-c" d="${rr(s.contact.x, s.contact.y, s.contact.w, s.contact.h, s.contact.r)}" fill="rgba(15,23,42,.13)" filter="url(#hx-blur-c)"/>`
    + `<path class="body" d="${rr(0, 0, w, h, r)}" fill="url(#hx-white)"/>`
    + `<path class="hl" d="${rr(.75, .75, w - 1.5, h - 1.5, r - .75)}" fill="none" stroke="url(#hx-hl)" stroke-width="1.5"/>`
    + `<path class="edge" d="${rr(0, 0, w, h, r)}" fill="none" stroke="#dbe6f8" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
}

export function renderHeroArt(assetBase = './assets/', linkFor = id => `services/${id}/index.html`, workflowId = '') {
  const icon = id => `${assetBase}service-icons/${id}.webp`;
  const single = !!workflowId;
  const w = single ? SERVICE_WF.find(w => w.id === workflowId) : WF[0];
  if (!w) throw Error('Unknown service workflow: ' + workflowId);
  const st = single ? w.s.settled : w.s.begin, last = w.s.settled.note;
  const flow = `<div class="hx-card hx-flow" style="--rw:${w.rw}px">${chassis(w.rw)}`
    + `<div class="hx-rh"><div class="hx-car"><span class="hx-ri"><img src="${icon(w.id)}" width="30" height="30" alt="" decoding="async"><span class="hx-ua" aria-hidden="true"></span></span><span class="hx-rt"><b class="hx-wf">${esc(w.name)}</b><span class="hx-title">${esc(w.title)}</span></span>${chip(st.chip, ' hx-state')}</div></div>`
    + `<div class="hx-rows">${st.rows.map(r => `<div class="hx-row"><div class="hx-car"><span class="hx-rl">${esc(r[0])}</span>${chip([r[1], r[2]])}</div></div>`).join('')}</div>`
    + `<div class="hx-note" style="max-height:${single ? 'none' : '0px'}"><div class="hx-car"><b>${esc(last[0])}</b><span>${esc(last[1])}</span></div></div></div>`;
  const overview = single ? flow.replace('hx-flow', 'hx-ov').replace(chassis(w.rw), '') : `<div class="hx-card hx-ov"><p class="hx-ov-h">Six workflows, one outcome each</p><ul class="hx-ov-list">${WF.map((x, i) => `<li class="hx-ov-row${i === 0 ? ' on' : ''}"><img src="${icon(x.id)}" width="20" height="20" alt="" decoding="async"><b>${esc(x.name)}</b><span>${esc(x.s.settled.lab)}</span></li>`).join('')}</ul><div class="hx-ov-note"><b>${esc(last[0])}</b><span>${esc(last[1])}</span></div></div>`;
  const rail = WF.map((x, i) => `<a class="hx-tab${i === 0 ? ' on' : ''}" href="${esc(linkFor(x.id))}" data-i="${i}"${i === 0 ? ' aria-current="true"' : ''}><img src="${icon(x.id)}" width="22" height="22" alt=""><span class="hx-tab-name">${esc(x.name)}</span></a>`).join('');
  return `<section class="hx${single ? ' hx-single' : ''}" data-hero${single ? ` data-workflow="${esc(workflowId)}"` : ''} data-assets="${esc(assetBase)}" aria-label="${single ? esc(w.name) + ' workflow' : 'Six Focus Care workflows'}" style="--gx:${w.gx}%;--gy:${w.gy}%">`
    + `<div class="hx-top"><p class="hx-label"><span class="hx-n">${single ? '' : '1/6'}</span> <b class="hx-name">${esc(w.name)}</b> <span class="hx-lab">${esc(st.lab)}</span></p><button type="button" class="hx-pause" hidden>Pause motion</button></div>`
    + `<div class="hx-clip"><div class="hx-cam">${flow}${overview}</div></div>`
    + (single ? '' : `<nav class="hx-rail" aria-label="Choose a workflow"><span class="hx-pill" aria-hidden="true"></span>${rail}</nav>`)
    + `<div class="hx-prog" aria-hidden="true"><i></i></div></section>`;
}
