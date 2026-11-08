# Read receipt (honest depth)

Root: `C:/Users/jovan/.codex/work/focuscare-live-20261106`.

## Fully read (and used)
| Input | sha256 | Use |
|---|---|---|
| `coordinator/HERO-IMPLEMENTATION.md` | (assignment) | contract |
| `vendor/.../component-library/src/geometry.js` | 393f342f6ce12a7611d640c6960dd7aaab9d5b2d662df437455777140a5b45a5 | imported: `rr`, `rect`, `shadowRects`, `clamp`, `lerp` |
| `vendor/.../component-library/src/motion.js` | ccef4ca4395d900320cd47bba806ee56e4f47901667d86c13321693f7dd1c9b6 | imported: `buildCamera` (and through it `spring`); techniques adapted: carrier masks, `press`, native frame seeking |
| `vendor/.../component-library/src/primitives.jsx` | c62fa409dac2a0d0290de938cfa86e111e6fb21750766089d2ca846bb238ca78 | Surf part stack, filters and gradients reproduced in the chassis markup |
| `vendor/.../component-library/assets/useanimations.json` | 5bb3f03ace5a1138107819a38bb68e3edbebcf29249679ac20a6d2221cf518bc | 6 objects copied verbatim into `hero-native.js` (only object names/op checked, not the full gallery) |
| `motion-led/src/content.mjs` | — | service names and boundaries (hero copy follows the approved board records) |
| `motion-led/src/scene-runtime.js`, `scene-controls.js` | — | existing loader/lifecycle patterns (intent token, IO, visibility); not reused verbatim |
| `motion-led/build.mjs` (read only) | — | integration points, lottie_light redirect precedent, manifest check |
| `motion-led/assets/service-icons/manifest.json` | — | native names, sourceSHA256 match (asserted at build) |
| `reference/template-reviewed.html` (style + data + markup sections) | cf80bd432d70d1f5276f26456fb795a723eb53466b82c7445bc1900cba573a92 | visual reference and record copy; its controller was not copied |

## Partially read / skimmed (stated plainly)
- `motion-led/src/site.base.css` and `motion-led.css`: grep only for tokens and hero rules.
- `C:/Users/jovan/.codex/skills/focus-care-motion/SKILL.md`: grep for brand, native assets, camera and deterministic rules (Inter, useAnimations via lottie 5.13.0 with explicit seeks, closed-form camera, persistent morph geometry).
- `emil-design-eng`, `impeccable` and `ui-ux-pro-max` SKILL.md: grep only. No targeted ui-ux-pro-max search query was run.

## Not read (blocker-free omissions, listed for the council)
- `motion-led/src/scenes.jsx`, `service-cards.css`, `reference/board-reviewed.html` and `reference/reviewed-live-390.png`.
- The 12 WebP files: only the 6 static ones are copied by byte; the manifest hashes were not re-verified individually.

## Licenses / notices
- `vendor/focus-care-motion/licenses/` holds `README.md`, `Inter-OFL.txt`, `react-useanimations-MIT.txt` and `embedded-MIT-notices.txt`. These are preserved and unchanged. useAnimations JSON is MIT (react-useanimations).
- lottie-web 5.13.0 is MIT (lottie_light.js sha256 96b0710aa725b09ecab886afad23deb073b65436eabcfde225e0b3781567222b).
- GSAP is not shipped by the hero (stubbed).
- esbuild `legalComments: 'eof'` retains any license comments in the bundles.

## Owned output fingerprints (final run)
- `src/hero/render.mjs`: ea6f74a1962f257a4c160b4f9cbaab0e321667598b7f58800a79e15c34b72df5
- `src/hero/runtime.js`: 8bbc6be50e88c4790abe000e404776399e561af39db9d2ee5e2bce4ffbceaace
- `src/hero/data.mjs`: a15139dd21b41a91b9c9d4e75cf41fb8a16167058fe223f5b5e43ccea5076198
- `src/hero/native.js`: 8b07724857180d72edb8c5f3982cac4ebdae1df857715d603301135078598e91
- `src/hero/hero.css`: f09036af319dfe6f769261f34e9e3a8a28f9b248d50c49051fb5cb84b5990489
- `src/hero/build.mjs`: d586dd7a9d2d81c421913381d76a5df5c5bf2374464086fdfc9c4683e47b0024
- `tools/hero/check.mjs`: b79f60d11ad61e7ecbae295a7c183d158fa580a8fc0a194c2605f07658458515
- `build/hero-output/hero.js`: 9e09bb0cab2e62b17c4eb50cbbf651df80a0594f349a31a0534bd162c9cbabda (16,007 B)
- `build/hero-output/hero-native.js`: 33e610d58b0d2a8f1e80a474428b36224bc81ac98c08c90409dc5ea8bd8d9054 (184,231 B)
