# Six-workflow hero: implementation handoff (sub-agent, 2026-11-05 22:35–22:50 UTC)

Status: implementation and focused lab checks complete. Not council-reviewed, not production-approved. Nothing was deployed, installed, committed or written outside the four owned folders.

## Owned files
| File | Role |
|---|---|
| `src/hero/data.mjs` | The only data source (6 workflows × begin/action/settled, timing constants). It feeds the static HTML, the reduced-motion overview and the runtime. |
| `src/hero/render.mjs` | `renderHeroArt(assetBase='./assets/', linkFor=id=>'services/'+id+'/index.html')` returns the RIGHT hero art HTML only. |
| `src/hero/runtime.js` | Core runtime, bundled to `hero.js` (IIFE). |
| `src/hero/native.js` | Optional native-icon chunk, bundled to `hero-native.js` (lottie_light 5.13.0 + 6 verbatim useAnimations objects). |
| `src/hero/hero.css` | Hero styles, copied to `hero.css`. |
| `src/hero/build.mjs` | `async buildHero({outDir})`. Also runnable: `node src/hero/build.mjs [outDir]`. |
| `tools/hero/check.mjs` | Focused Playwright/axe harness. It builds into `build/hero-output` and writes evidence to `evidence/hero`. |
| `evidence/hero/*` | Captures, QA videos, `check-report.json`. |

## Integration steps (for root)
1. In root `build.mjs`: `import {renderHeroArt} from './src/hero/render.mjs'; import {buildHero} from './src/hero/build.mjs';`
2. In `home(r)`, replace `${scene(byId('compliance'),'Compliance example')}` with `${renderHeroArt(base+'/assets/', id=>href(r,'/services/'+id))}`. For `/` the base is `.`. Keep the left `.hero-copy` unchanged. The dashboard mount stays as is.
3. After the dist assets folder exists: `await buildHero({outDir: join(dist,'assets')})`. This writes `hero.js`, `hero-native.js`, `hero.css`, `hero-build.json` and `service-icons/<id>.webp`. The six WebPs are the same bytes as the existing card icons, so the overwrite is identical.
4. On `/` only, add `<link rel="stylesheet" href="assets/hero.css">` and `<script src="assets/hero.js" defer></script>`. `hero.js` loads `hero-native.js` itself, relative to `data-assets`.
5. The grid column is `minmax(0,486px)` in `motion-led.css`. The stage max-width is 540px and it fills its column, so consider widening the column to 540px to match the approved board. This is a root CSS decision and I did not change it.
6. Remove the old hero scene usage if it is no longer needed. Root decides; I touched no existing sources.

## Runtime contract
- Boot: on DOMContentLoaded it finds `[data-hero]`. It waits for `document.fonts.ready` (capped at 1.5 s), measures, then autostarts. There is no Play button.
- `window.FocusCareHero`:
  - `ready` (Promise) and `animationReady` (bool).
  - `duration` is 37.2 s (6 beats × 6.2 s), including a 2.8 s fully revealed outcome hold.
  - `renderAt(s)` is a deterministic seek. It stops the rAF and keeps the user pause intent.
  - `pause()`, `resume()` and `select(i)`.
  - `state` returns `{t,index,phase,playing,userPaused,visible,reduced,native,saveData,selected}`.
- One rAF clock runs only when ready, not user-paused, visible (IntersectionObserver >15% and `!document.hidden`) and not reduced-motion. Otherwise there is no rAF and no timers. The only timers are the font cap and the 8 s native-chunk load timeout.
- Persistent nodes: one card, one SVG chassis, one header, 3 rows and 1 note for the whole loop. Text and tone classes change in place. Rail links are replaced once by buttons at boot; without JS they stay service links.
- Beat (s): begin 0 → camera push from 0.9 → contact/press 1.35 (row ring, row press, chip press) → settle 2.45 (note reveal, camera widens) → reading hold → swap 5.8 (carriers retract, card reshapes width/radius, rail pill slides, content swaps at 6.0, carriers reveal into the next beat).
- Loop seam: the camera cues are laid out over three loops and sampled in the middle one, so the spring state at t=37.2 equals the state at t=0.
- Reduced motion, at load or changed later: the CSS media query plus `.hx-reduced` show a six-outcome overview card. There is no camera, no autoplay and no pause control. Rail selection highlights that outcome and shows its note.
- Save-Data, a native chunk failure or a timeout: static native WebPs stay. Content is identical.

## APIs actually reused (read, not hashed)
- `geometry.js`: `rr` (the M H C V C H C V C Z rounded-rect command structure), `rect`, `shadowRects`, `clamp`, `lerp`. The chassis is the `Surf` part stack from `primitives.jsx` (sh-a, sh-c, body, hl, edge; tone white; elev 2; same blur filters and gradients). It is re-pathed from `rr()` when geometry changes, so reshape keeps a stable point structure without substitution.
- `motion.js`: `buildCamera(cues,{w,zeta})`, the closed-form damped spring, imported and called unchanged. The same `translate3d/rotateX/rotateY/rotateZ/scale` camera transform string is used. Its GSAP/Lottie imports are stubbed only in the core bundle (`build.mjs` coreStubs), so GSAP is not shipped. The build asserts this.
- Engine techniques adapted: carrier mask reveal/retract `clipPath: inset(-40% -20% X% -20%)` with y follow-through, the `press()` compress/elastic-return shape (scaleX −3.5%, scaleY −7.5%, `elastic.out(1,.42)`), and native frame seeking `goToAndStop(floor(f), true)` with `setSubframe(false)`. These are closed-form functions of absolute time for the 37.2 s loop.
- I deliberately did not use `createMotion`. Its seed-forming and collapse-to-seed contract (labels `form…end`) does not fit a persistent six-state loop, and it would ship GSAP MorphSVG/DrawSVG.
- useAnimations: `user`, `folder`, `clock`, `clipboard`, `fileText` and `shield`, verbatim from the pinned JSON (sha256 `5bb3f03a…518bc`, also checked against `manifest.json`).

## Test evidence (Chromium via the pr-validation Playwright; lab only; file:// page)
- Build: `hero.js` 16,007 B (6,421 B gz). `hero-native.js` 184,231 B (50,875 B gz; lottie_light accounts for almost all of it). `hero.css` 7,614 B (2,443 B gz). Six WebPs, 4,288 B in total.
- Widths 320/390/600/728/1024/1040/1440 at start/action/settled/seam, plus after resize:
  - no horizontal overflow
  - card and rail inside the stage
  - no text under 12px
  - `renderAt(11.37)` gives identical camera/path/text/pill output when reached from t=20.1 and from t=2
  - resize keeps the workflow
- Lifecycle:
  - autoplay advances
  - focus on a rail button is unchanged across auto-advance
  - Pause stops rAF
  - keyboard Enter on the rail selects while paused
  - offscreen stops; returning while user-paused stays paused
  - offscreen while playing stops, then resumes on return
  - tab hidden (simulated by overriding `document.hidden` and dispatching `visibilitychange`) stops and resumes
- Reduced motion at load (390) and after load (1440): overview shown, not playing, camera transform cleared.
- Blocked `hero-native.js`: native=false, static image visible, still playing. Save-Data (`navigator.connection.saveData` emulated): native chunk not requested.
- No-JS: Recruitment content readable; 6 rail links present.
- axe (wcag2a/aa) on `.hx`: 0 violations.
- Console: 3 messages, all harness artifacts. axe's XHR to a file:// stylesheet is blocked by CORS. Two ERR_FAILED come from the intentionally aborted `hero-native.js` route and that same XHR.
- QA video: `evidence/hero/qa-seam-desk.mp4` and `qa-seam-mob.mp4` are 6 s at 30 fps, sampled with `renderAt` from 26.4 s across the 6→1 seam and the Recruitment beat. Contact sheets are `qa-*-contact.png`. Stills are `w*-{start,action,settled,seam}.png`, `w390-reduced.png`, `w1440-reduced-after-load.png` and `w390-nojs.png`. The videos come from the run just before the final aria-only Pause change, which has no visual effect.

## Remaining issues (exact)
1. Not measured: dropped frames during real-time playback, long tasks, CPU, LCP/CLS, or a throttled phone. During the 0.55 s swap, card width and rail label `max-width` change per frame. That is layout work, and card height is measured once per workflow change. Profile before production.
2. Mid-swap, for about 0.2 s, the card surface is visible with all carriers retracted (the empty shell in the contact sheet). This is intentional continuity, but the council should judge whether it reads as a blink.
3. The live hidden-tab case was simulated, not a real tab switch. No real device or Safari/Firefox runs.
4. No dark-mode variant (the site appears light-only). Contrast was checked by axe in light only.
5. The rail shows only icons below 520px stage width. The active workflow name is in the stage label (`1/6 Recruitment …`) and in each button's `aria-label`.
6. GSAP is listed in the vendor `motion.js` import but is not shipped (stubbed). If root bundles `motion.js` elsewhere, that is unaffected.
7. `hero-native.js` (~51 KB gz) is fetched after first render on every non-Save-Data visit. Root may prefer to load it on idle or skip it.
