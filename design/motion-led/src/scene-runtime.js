// Optional motion chunk. Loaded on intent by site.js; never needed for content.
// Uses the pinned library engine (createMotion: seed forming, MorphSVG reshapes, DrawSVG,
// masked carriers, explicit native useAnimations seeking) on build-time initial markup.
import { createMotion, setIconData } from '../../vendor/focus-care-motion/studies/component-library/src/motion.js';
import { SCENES, widthOf, H } from './scenes.jsx';
import ICONS from '../build/ua-subset.json';


setIconData(ICONS);

function mount(container, id, variant, opts = {}) {
  const def = SCENES.find(s => s.id === id);
  if (!def) throw new Error('Unknown scene ' + id);
  const n = variant === 'narrow';
  container.innerHTML = window.FocusCareSceneMarkup[`${id}-${variant}`];
  container.classList.add('scene-live');
  const w = def.width ? def.width(n) : widthOf(n), h = def.h || H;
  const entry = { id, w, h, duration: def.duration, motion: def.motion(n), orbit: opts.depth === false ? 0 : .22, push: 1.06 };
  if (opts.prepare) opts.prepare(container);
  const m = createMotion(container, entry, { camera: opts.depth !== false });
  return m;
}
window.FocusCareScenes = { mount, version: '1' };
window.dispatchEvent(new Event('focuscare-scenes'));
