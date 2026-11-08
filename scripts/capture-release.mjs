import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {LOOP} from '../design/motion-led/src/hero/data.mjs';

const root = resolve(import.meta.dirname, '..');
const out = join(root, 'release-evidence');
const url = process.env.TEST_URL || 'http://127.0.0.1:4180';
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const report = { createdUTC: new Date().toISOString(), browser: null, source: {}, captures: {}, axe: [], checks: [], errors: [], limits: 'Chromium desktop host with emulated viewports. Video is real-time playback, not a dropped-frame or physical-device measurement.' };
for (const file of ['design/motion-led/src/hero/runtime.js', 'design/motion-led/src/hero/hero.css', 'design/motion-led/src/hero/native.js', 'design/motion-led/src/service-cards.css', 'public/assets/hero.js', 'public/assets/hero.css', 'public/assets/service-cards.css', 'public/redesign/index.html']) report.source[file] = hash(join(root, file));
mkdirSync(join(out, 'clips/raw'), { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
report.browser = browser.version();
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, recordVideo: { dir: join(out, 'clips/raw'), size: { width, height: 900 } } });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => window.FocusCareHero?.animationReady);
    await page.evaluate(() => { window.captureSeen = []; window.captureTimer = setInterval(() => { const i = FocusCareHero.state.index; if (!captureSeen.includes(i)) captureSeen.push(i); }, 100); });
    await page.waitForTimeout((LOOP+1.4)*1000);
    const end = await page.evaluate(() => { clearInterval(captureTimer); return { ...FocusCareHero.state, visited: captureSeen }; });
    report.checks.push({ name: 'autoplay visits six workflows ' + width, pass: end.playing && end.visited.length === 6, details: end });
    await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
    for (let i = 0; i < 6; i++) {
      await page.locator('.hx-tab').nth(i).click();
      await page.locator('.hx').screenshot({ path: join(out, `hero-outcome-${i + 1}-${width}.png`) });
      report.captures[`hero-outcome-${i + 1}-${width}.png`] = hash(join(out, `hero-outcome-${i + 1}-${width}.png`));
    }
    await context.close();
    const clip = join(out, `clips/hero-live-${width}.webm`);
    await page.video().saveAs(clip);
    report.captures[`clips/hero-live-${width}.webm`] = hash(clip);
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  for (const route of ['/services', '/services/training', '/contact', '/about', '/blog', '/compliance-kit', '/case-studies']) {
    await page.goto(url + route);
    await page.addScriptTag({ path: join(root, 'node_modules/axe-core/axe.min.js') });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
    report.axe.push({ route, violations });
  }
  await page.goto(url + '/404');
  await page.screenshot({ path: join(out, 'not-found-390.png'), fullPage: true });
  report.captures['not-found-390.png'] = hash(join(out, 'not-found-390.png'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 728]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.waitForFunction(() => window.FocusCareHero?.animationReady);
    await page.locator('.hx').screenshot({ path: join(out, `hero-reduced-${width}.png`) });
    report.captures[`hero-reduced-${width}.png`] = hash(join(out, `hero-reduced-${width}.png`));
  }
  await context.close();
} finally {
  await browser.close();
  writeFileSync(join(out, 'current-captures.json'), JSON.stringify(report, null, 2), 'utf8');
}
const failures = report.checks.filter(c => !c.pass);
console.log(JSON.stringify({ checks: report.checks, axe: report.axe, errors: report.errors, captures: Object.keys(report.captures).length }));
if (failures.length || report.axe.some(a => a.violations.length) || report.errors.length) process.exitCode = 1;
