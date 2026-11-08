// Optional native icon chunk: verbatim useAnimations JSON (six selected objects) played by
// lottie-web 5.13.0 (light SVG player) with explicit integer frame seeking, as in motion.js.
// Loaded after first render; never needed for content (static WebPs stay as fallback).
import lottie from 'lottie-web/build/player/lottie_light';
import ICONS from 'hero-native-icons';

window.FocusCareHeroNative = {
  mount(slot, root) {
    const players = {};
    let cur = null;
    function ensure(name) {
      if (players[name]) return players[name];
      const data = ICONS[name];
      const el = document.createElement('span'); el.className = 'hx-ua-p'; el.dataset.ua = name; el.hidden = true; slot.append(el);
      const p = lottie.loadAnimation({ container: el, renderer: 'svg', loop: false, autoplay: false, animationData: JSON.parse(JSON.stringify(data)), rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false } });
      p.setSubframe(false);
      const item = players[name] = { el, p, frames: data.op - data.ip, f: -1, ready: false };
      const ready = () => {
        item.ready = true;
        if (item.f >= 0) p.goToAndStop(item.f, true);
        if (cur === name) { el.hidden = false; root.classList.add('hx-native'); }
      };
      p.addEventListener('DOMLoaded', ready);
      p.addEventListener('data_failed', () => { if (cur === name) root.classList.remove('hx-native'); });
      if (p.isLoaded) ready();
      return item;
    }
    return {
      show(name) {
        if (cur === name) return;
        cur = name; root.classList.remove('hx-native');
        const item = ensure(name);
        for (const k in players) players[k].el.hidden = k !== name || !players[k].ready;
        if (item.ready) root.classList.add('hx-native');
      },
      seek(name, prog) {
        const o = players[name]; if (!o) return;
        const f = Math.floor(Math.max(0, Math.min(1, prog)) * (o.frames - 1) + 1e-6);
        if (f !== o.f) { o.p.goToAndStop(f, true); o.f = f; }
      }
    };
  }
};
