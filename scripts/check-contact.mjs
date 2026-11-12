// Runs in workerd with a local D1 database. All outbound traffic is blocked except
// mocked Resend responses. No fixture can reach a real mailbox or production DB.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { createHmac, randomUUID } from 'node:crypto';
import { build } from 'esbuild';
const root = resolve(import.meta.dirname, '..');
const { Miniflare, convertV4MiniflareOptions } = createRequire(import.meta.url)(process.env.MINIFLARE_MODULE || 'miniflare');
const evidence = resolve(process.env.EVIDENCE_DIR || join(root, 'release-evidence/contact'));
mkdirSync(evidence, { recursive: true });
const secret = 'local-contact-fixture-signing-key';
const checks = [];
const check = (name, pass) => { checks.push({ name, pass: !!pass }); if (!pass) throw Error(name); };
const token = (age = 5000, origin = 'https://focuscarellc.com') => {
  const body = `${Date.now() - age}.${randomUUID()}`;
  return body + '.' + createHmac('sha256', secret).update(origin + '|' + body).digest('hex');
};
const output = await build({ stdin: { contents: `import {handleContact,retryEnquiries} from './server/contact.ts';
export default {async fetch(req,env){
 if(new URL(req.url).pathname==='/__retry'){await retryEnquiries(env);return new Response('ok')}
 const pending=[];const res=await handleContact(req,env,{waitUntil:p=>pending.push(p)});await Promise.allSettled(pending);return res;
}}`, resolveDir: root }, bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022' });
let providerStatus = 200, sends = [];
const outboundService = async request => {
  if (request.url !== 'https://api.resend.com/emails' || request.method !== 'POST') throw Error('Unexpected outbound request blocked');
  sends.push({ key: request.headers.get('Idempotency-Key'), body: await request.json() });
  return new Response(providerStatus === 200 ? JSON.stringify({ id: randomUUID() }) : '{}', { status: providerStatus, headers: { 'Content-Type': 'application/json' } });
};
const options = { modules: true, script: output.outputFiles[0].text, compatibilityDate: '2026-11-12', compatibilityFlags: ['nodejs_compat'],
  d1Databases: ['CONTACT_DB'], bindings: { RESEND_API_KEY: 'local-fixture-no-real-key', CONTACT_FORM_SECRET: secret }, outboundService, cf: false };
const mf = new Miniflare(convertV4MiniflareOptions ? convertV4MiniflareOptions(options) : options);
const db = await mf.getD1Database('CONTACT_DB');
const schema = readFileSync(join(root, 'server/contact-schema.sql'), 'utf8');
// D1 exec accepts one statement per line; schema formatting is intentionally multi-line.
await db.batch(schema.split(';').map(x => x.trim()).filter(Boolean).map(sql => db.prepare(sql)));
const count = async () => (await db.prepare('SELECT count(*) AS n FROM contact_enquiries').first()).n;
const post = async (data, headers = {}, host = 'focuscarellc.com') => {
  const res = await mf.dispatchFetch(`https://${host}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: `https://${host}`, 'CF-Connecting-IP': '192.0.2.1', ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data) });
  return { status: res.status, data: await res.json() };
};
const entry = (extra = {}) => ({ name: 'TEST - ignore', email: 'jovanie@focuscarellc.com', service: 'billing', message: 'Local fixture only.', token: token(), ...extra });
try {
  const challenge = await mf.dispatchFetch('https://focuscarellc.com/api/contact');
  check('challenge is uncached and signed', challenge.status === 200 && challenge.headers.get('cache-control') === 'no-store' && (await challenge.json()).token.split('.').length === 3);
  for (const [name, data, headers, expected] of [
    ['malformed JSON', '{', {}, 400], ['array body', [], {}, 400],
    ['invalid email', entry({ email: 'invalid' }), {}, 400], ['header injection', entry({ email: 'a@example.com\r\nBcc:b@example.com' }), {}, 400],
    ['oversized name', entry({ name: 'x'.repeat(101) }), {}, 400], ['oversized message', entry({ message: 'x'.repeat(1201) }), {}, 400],
    ['unknown service', entry({ service: 'invented' }), {}, 400], ['honeypot', entry({ website: 'spam' }), {}, 400],
    ['too fast', entry({ token: token(0) }), {}, 429], ['expired', entry({ token: token(86401000) }), {}, 400],
    ['forged token', entry({ token: token() + '0' }), {}, 400], ['cross-origin', entry(), { Origin: 'https://unrelated.invalid' }, 403],
    ['missing origin', entry(), { Origin: '' }, 403], ['wrong content type', entry(), { 'Content-Type': 'text/plain' }, 415],
    ['oversized request', entry({ message: 'x'.repeat(9000) }), {}, 413],
  ]) { check(name, (await post(data, headers)).status === expected); }
  check('rejections create no records or email', await count() === 0 && sends.length === 0);
  check('preview cannot write production', (await post(entry(), {}, 'review.pages.dev')).status === 403);
  const valid = entry();
  const saved = await post(valid, { Cookie: 'focuscare.analytics-consent.v1=denied', DNT: '1', 'Sec-GPC': '1' });
  check('cookie-declined enquiry is saved', saved.status === 201 && saved.data.success && await count() === 1);
  let row = await db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').bind(saved.data.receipt).first();
  check('test and internal flags are durable', row.is_test === 1 && row.is_internal === 1);
  check('delivery accepted and provider id saved', row.delivery_status === 'sent' && !!row.email_id && sends.length === 1);
  check('fixed recipient and visitor reply-to', sends[0].body.to[0] === 'jovanie@focuscarellc.com' && sends[0].body.reply_to === valid.email);
  check('retry same request does not duplicate', (await post(valid)).status === 200 && await count() === 1 && sends.length === 1);
  check('reused token with changed payload rejected', (await post({ ...valid, message: 'changed' })).status === 409);
  const race = entry({ email: 'local-race@example.invalid' });
  const results = await Promise.all(Array.from({ length: 8 }, () => post(race)));
  check('concurrent retries share one enquiry', results.every(x => [200, 201].includes(x.status)) && await count() === 2 && sends.length === 2);
  providerStatus = 503;
  const queued = await post(entry({ email: 'local-outage@example.invalid' }));
  row = await db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').bind(queued.data.receipt).first();
  check('provider outage preserves accepted enquiry', queued.status === 201 && row.delivery_status === 'pending' && row.delivery_attempts === 1);
  const originalKey = sends.at(-1).key;
  await db.prepare("UPDATE contact_enquiries SET next_attempt_at = '2000-01-01T00:00:00.000Z' WHERE id = ?").bind(row.id).run();
  providerStatus = 200;
  await mf.dispatchFetch('https://focuscarellc.com/__retry');
  row = await db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').bind(row.id).first();
  check('scheduled retry recovers pending email', row.delivery_status === 'sent' && row.delivery_attempts === 2);
  check('email retry uses stable idempotency key', sends.at(-1).key === originalKey);
  providerStatus = 401;
  const failed = await post(entry({ email: 'local-permanent@example.invalid' }));
  row = await db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').bind(failed.data.receipt).first();
  check('permanent delivery error remains reviewable', failed.status === 201 && row.delivery_status === 'failed' && row.last_error_code === 'http_401');
  providerStatus = 200;
  const fifth = await post(entry({ email: 'local-fifth@example.invalid' }));
  const limited = await post(entry({ email: 'local-sixth@example.invalid' }));
  check('atomic per-network rate limit', fifth.status === 201 && limited.status === 429 && await count() === 5);
  await db.prepare("UPDATE contact_enquiries SET delivery_status = 'pending', created_at = '2000-01-01T00:00:00.000Z', lease_until = NULL WHERE id = ?").bind(failed.data.receipt).run();
  const before = sends.length;
  await mf.dispatchFetch('https://focuscarellc.com/__retry');
  row = await db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').bind(failed.data.receipt).first();
  check('expired idempotency window needs review, no resend', row.delivery_status === 'failed' && row.last_error_code === 'retry_window_expired' && sends.length === before);
  await db.prepare('DROP TABLE contact_enquiries').run();
  const broken = await post(entry());
  check('storage failure never claims success', broken.status === 503 && !broken.data.success);
} catch (error) { checks.push({ name: 'runtime failure', pass: false, error: error.stack }); }
finally {
  await mf.dispose();
  const report = { atUTC: new Date().toISOString(), runtime: 'workerd / local D1 / outbound mock only', checks, failures: checks.filter(x => !x.pass) };
  writeFileSync(join(evidence, 'contact-runtime-checks.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
  if (report.failures.length) process.exitCode = 1;
}
