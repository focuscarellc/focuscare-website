// buildHero({outDir}): writes hero.js (core runtime), hero-native.js (optional native icon
// chunk), hero.css and the six static service-icon WebPs. Paths resolve from import.meta.url.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import * as esbuild from 'esbuild';
import { WF } from './data.mjs';

const here = dirname(fileURLToPath(import.meta.url)), ml = resolve(here, '../..'), up = resolve(ml, '..');
const LIB = join(up, 'vendor/focus-care-motion/studies/component-library');
const sha = b => createHash('sha256').update(b).digest('hex');

// motion.js is imported only for buildCamera (pure). Its GSAP plugin registration and Lottie
// import are replaced by inert stubs in the core bundle so the timeline engine is not shipped.
const coreStubs = { name: 'hero-core-stubs', setup(b) {
  b.onResolve({ filter: /^gsap(\/MorphSVGPlugin|\/DrawSVGPlugin)?$/ }, a => ({ path: a.path, namespace: 'hx-stub' }));
  b.onResolve({ filter: /^lottie-web\/build\/player\/lottie_svg$/ }, a => ({ path: a.path, namespace: 'hx-stub' }));
  b.onLoad({ filter: /.*/, namespace: 'hx-stub' }, a => ({ contents: a.path === 'gsap' ? 'export const gsap={registerPlugin(){}};' : a.path.startsWith('gsap/') ? `export const ${a.path.slice(5)}={};` : 'export default {};', loader: 'js' }));
} };

export async function buildHero({ outDir }) {
  if (!outDir) throw Error('buildHero requires outDir');
  outDir = resolve(outDir); mkdirSync(join(outDir, 'service-icons'), { recursive: true });
  const uaRaw = readFileSync(join(LIB, 'assets/useanimations.json')), UA = JSON.parse(uaRaw);
  const subset = Object.fromEntries(WF.map(w => { if (!UA[w.ua]) throw Error('Missing native icon ' + w.ua); return [w.ua, UA[w.ua]]; }));
  const nativeIcons = { name: 'hero-native-icons', setup(b) {
    b.onResolve({ filter: /^hero-native-icons$/ }, () => ({ path: 'icons', namespace: 'hx-icons' }));
    b.onLoad({ filter: /.*/, namespace: 'hx-icons' }, () => ({ contents: JSON.stringify(subset), loader: 'json' }));
  } };
  const common = { bundle: true, format: 'iife', minify: true, target: 'es2019', nodePaths: [join(ml, 'node_modules')], legalComments: 'eof', logLevel: 'error', define: { 'process.env.NODE_ENV': '"production"' }, metafile: true };
  const core = await esbuild.build({ ...common, plugins: [coreStubs], entryPoints: [join(here, 'runtime.js')], outfile: join(outDir, 'hero.js') });
  const nat = await esbuild.build({ ...common, plugins: [nativeIcons], entryPoints: [join(here, 'native.js')], outfile: join(outDir, 'hero-native.js') });
  if (Object.keys(core.metafile.inputs).some(p => /node_modules[\\/](gsap|lottie-web)/.test(p))) throw Error('Core hero bundle must not include GSAP/Lottie');
  writeFileSync(join(outDir, 'hero.css'), readFileSync(join(here, 'hero.css')));
  const manifest = JSON.parse(readFileSync(join(ml, 'assets/service-icons/manifest.json')));
  if (manifest.sourceSHA256 !== sha(uaRaw)) throw Error('Static service icons do not match the pinned useAnimations asset');
  for (const w of WF) copyFileSync(join(ml, 'assets/service-icons', w.id + '.webp'), join(outDir, 'service-icons', w.id + '.webp'));
  const files = ['hero.js', 'hero-native.js', 'hero.css', ...WF.map(w => 'service-icons/' + w.id + '.webp')];
  const report = { uaSourceSHA256: sha(uaRaw), nativeSubset: Object.keys(subset), files: Object.fromEntries(files.map(f => { const b = readFileSync(join(outDir, f)); return [f, { bytes: b.length, sha256: sha(b) }]; })) };
  writeFileSync(join(outDir, 'hero-build.json'), JSON.stringify(report, null, 1));
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outDir = process.argv[2] || join(ml, 'build/hero-output');
  console.log(JSON.stringify(await buildHero({ outDir }), null, 1));
}
