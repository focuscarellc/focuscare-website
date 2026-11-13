// Test a locally served Pages artifact; never submit fixture data to production.
import {readFileSync, writeFileSync, mkdirSync, readdirSync} from 'node:fs';
import {resolve, join, relative, extname} from 'node:path';
import {createHash} from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const source = resolve(process.env.PAGES_SOURCE_DIR || root);
const output = join(source, '.vercel/output/static');
const origin = process.env.TEST_URL || 'http://127.0.0.1:4181';
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname)) {
  throw Error('Pages fixture checks require a loopback origin.');
}
const evidence = resolve(process.env.EVIDENCE_DIR || join(root, 'release-evidence/pages-compatibility'));
mkdirSync(evidence, {recursive: true});
const sha = value => createHash('sha256').update(value).digest('hex');
const report = {createdUTC: new Date().toISOString(), origin, source, checks: [], errors: [], hashes: {}};
const check = (name, pass, details) => {
  report.checks.push({name, pass: !!pass, details});
  if (!pass) console.error('FAIL', name, JSON.stringify(details));
};
function checkSecurity(name, response) {
  const expected = {'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'SAMEORIGIN'};
  const actual = Object.fromEntries(Object.keys(expected).map(key => [key, response.headers.get(key)]));
  check(name + ' security headers', Object.entries(expected).every(([key, value]) => actual[key] === value), actual);
}
const assetTypes = {
  '.js': /^(?:application|text)\/javascript(?:;|$)/,
  '.css': /^text\/css(?:;|$)/,
  '.json': /^application\/json(?:;|$)/,
  '.woff2': /^font\/woff2(?:;|$)/,
  '.webp': /^image\/webp(?:;|$)/,
  '.png': /^image\/png(?:;|$)/,
  '.jpg': /^image\/jpeg(?:;|$)/,
  '.jpeg': /^image\/jpeg(?:;|$)/,
  '.svg': /^image\/svg\+xml(?:;|$)/,
  '.pdf': /^application\/pdf(?:;|$)/,
};
function files(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap(item => {
    const path = join(dir, item.name);
    return item.isDirectory() ? files(path) : [path];
  });
}
for (const file of files(output)) report.hashes[relative(source, file).replaceAll('\\', '/')] = sha(readFileSync(file));
report.sourceHashes = Object.fromEntries(['package.json', 'package-lock.json', 'next.config.js', '.node-version', 'public/_headers', 'scripts/package-design.mjs', 'design/motion-led/build.mjs', 'app/[...path]/route.ts', 'app/api/compliance-kit/route.ts'].map(file => [file, sha(readFileSync(join(source, file)))]));
report.harnessHash = sha(readFileSync(import.meta.filename));

try {
  const manifest = JSON.parse(readFileSync(join(source, 'design/generated/release-manifest.json'), 'utf8'));
  for (const page of manifest.pages) {
    const response = await fetch(origin + page.route, {redirect: 'manual'});
    const body = Buffer.from(await response.arrayBuffer());
    check('clean route ' + page.route, response.status === (page.status || 200) && sha(body) === page.sha256,
      {status: response.status, expectedStatus: page.status || 200, sha256: sha(body), expectedHash: page.sha256});
    checkSecurity('GET ' + page.route, response);
    const head = await fetch(origin + page.route, {method: 'HEAD', redirect: 'manual'});
    check('HEAD ' + page.route, head.status === (page.status || 200) && (await head.arrayBuffer()).byteLength === 0 && /^text\/html(?:;|$)/.test(head.headers.get('content-type') || ''), {status: head.status, contentType: head.headers.get('content-type')});
    checkSecurity('HEAD ' + page.route, head);
    if (page.route === '/') check('indexable home', !/noindex/i.test(response.headers.get('x-robots-tag') || ''), {robotsHeader: response.headers.get('x-robots-tag')});
  }
  for (const file of files(join(output, 'assets'))) {
    const path = '/assets/' + relative(join(output, 'assets'), file).replaceAll('\\', '/');
    const response = await fetch(origin + path);
    const body = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || '';
    check('asset ' + path, response.status === 200 && sha(body) === sha(readFileSync(file)) && !!assetTypes[extname(file)]?.test(contentType), {status: response.status, contentType});
  }
  for (const [from, to] of [['/resources', '/blog'], ['/testimonials', '/case-studies'], ['/get-started', '/contact'], ['/services/index.html', '/services']]) {
    const response = await fetch(origin + from, {redirect: 'manual'});
    check('redirect ' + from, [301, 308].includes(response.status) && new URL(response.headers.get('location'), origin).pathname === to,
      {status: response.status, location: response.headers.get('location')});
  }
  for (const path of ['/missing-pages-check', '/blog/missing-pages-check', '/services/missing-pages-check', '/assets/nope.css', '/404']) {
    const response = await fetch(origin + path);
    const body = await response.text();
    check('branded error ' + path, response.status === 404 && body.includes('Let’s find the right page.') && !body.includes('/_next/') && !body.includes('rel="canonical"') && /noindex/.test(response.headers.get('x-robots-tag') || ''), {status: response.status, robots: response.headers.get('x-robots-tag')});
    checkSecurity('GET error ' + path, response);
    const head = await fetch(origin + path, {method: 'HEAD'});
    check('HEAD error ' + path, head.status === 404 && (await head.arrayBuffer()).byteLength === 0 && head.headers.get('cache-control') === 'no-store' && /noindex/.test(head.headers.get('x-robots-tag') || '') && /^text\/html(?:;|$)/.test(head.headers.get('content-type') || ''), {status: head.status, robots: head.headers.get('x-robots-tag'), cache: head.headers.get('cache-control')});
    checkSecurity('HEAD error ' + path, head);
  }
  for (const path of ['/redesign/index.html', '/_worker.js', '/.build-manifest.json', '/_routes.json', '/assets/%2Fprivate', '//unrelated.invalid/index.html']) {
    const response = await fetch(origin + path, {redirect: 'manual'});
    const body = await response.text();
    check('internal path blocked ' + path, response.status === 404 && body.includes('Let’s find the right page.') && /noindex/.test(response.headers.get('x-robots-tag') || ''), {status: response.status});
    checkSecurity('blocked ' + path, response);
  }
  for (const path of ['/', '/assets/hero.js']) {
    const first = await fetch(origin + path);
    const etag = first.headers.get('etag');
    await first.arrayBuffer();
    const conditional = await fetch(origin + path, {headers: {'If-None-Match': etag || 'missing-etag'}});
    const body = await conditional.arrayBuffer();
    check('conditional cache ' + path, !!etag && conditional.status === 304 && body.byteLength === 0, {etag, status: conditional.status, bytes: body.byteLength});
    checkSecurity('conditional ' + path, conditional);
  }
  const robots = await fetch(origin + '/robots.txt');
  const robotText = await robots.text();
  check('production robots', robots.status === 200 && !/^Disallow:\s*\/\s*$/m.test(robotText) && robotText.includes('https://focuscarellc.com/sitemap.xml'), {body: robotText});
  const sitemap = await fetch(origin + '/sitemap.xml');
  const xml = await sitemap.text();
  check('sitemap', sitemap.status === 200 && xml.includes('https://focuscarellc.com/services/recruitment') && !xml.includes('<loc>https://focuscarellc.com/404</loc>'), {status: sitemap.status});

  const api = (body, headers = {}) => fetch(origin + '/api/compliance-kit', {method: 'POST', headers: {'content-type': 'application/json', ...headers}, body});
  const valid = await api(JSON.stringify({email: 'pages-check@example.invalid', name: 'Fictional build check', marketingConsent: false}));
  const data = await valid.json();
  check('checklist local contract', valid.status === 200 && data.captureStatus === 'not-configured' && data.downloadUrl === 'https://focuscarellc.gumroad.com/l/free-inspection-checklist' && data.message.includes('has not sent an email') && valid.headers.get('cache-control') === 'no-store', {status: valid.status, captureStatus: data.captureStatus, downloadUrl: data.downloadUrl});
  for (const [name, body, headers, status] of [
    ['invalid email', '{"email":"invalid"}', {}, 400],
    ['invalid JSON', '{', {}, 400],
    ['cross-origin request', '{"email":"pages-check@example.invalid"}', {origin: 'https://unrelated.invalid'}, 403],
    ['oversized request', JSON.stringify({email: 'pages-check@example.invalid', note: 'x'.repeat(8300)}), {}, 413],
  ]) {
    const response = await api(body, headers);
    check('checklist ' + name, response.status === status, {status: response.status, expected: status});
    await response.arrayBuffer();
  }
  for (const [path, method, status] of [['/api/compliance-kit', 'GET', 405], ['/api/missing', 'GET', 404], ['/', 'POST', 405]]) {
    const response = await fetch(origin + path, {method});
    check('method contract ' + method + ' ' + path, response.status === status, {status: response.status, allow: response.headers.get('allow')});
    checkSecurity('method ' + method + ' ' + path, response);
    await response.arrayBuffer();
  }
} catch (error) {
  report.errors.push(error.stack);
} finally {
  writeFileSync(join(evidence, 'pages-runtime-checks.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
}
const failures = report.checks.filter(check => !check.pass);
console.log(JSON.stringify({checks: report.checks.length, failures, errors: report.errors}));
if (failures.length || report.errors.length) process.exitCode = 1;
