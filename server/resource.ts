// Two purpose-limited emails: the requested PDF and one owner notification.
// No list/contact creation, marketing subscription, or automatic follow-up.
import { type ContactEnv, internalEmails, encoder, response, iso, hex, hash, signingKey, tokenFor, validateToken } from './contact'
import pdf from './inspection-checklist.generated.json'
export const resourceSources = new Set(['/resources/inspection-readiness-checklist', '/blog/5-things-inspectors-look-for', '/services/compliance', '/services/training'])
const noticeVersion = 'checklist-and-one-followup-v1'
type Delivery = { request_id: string; kind: 'checklist' | 'owner'; delivery_attempts: number }
type ResourceRequest = { id: string; created_at: string; email: string; organisation: string; source_path: string; is_test: number; is_internal: number; resource_key: string; pdf_sha256: string }
const unavailable = () => response({ error: 'We could not confirm your checklist request. Please try again or email jovanie@focuscarellc.com.' }, 503)
export async function handleResource(req: Request, env: ContactEnv, ctx?: { waitUntil(p: Promise<unknown>): void }) {
  if (!env.CONTACT_DB || !env.CONTACT_FORM_SECRET || !env.RESEND_API_KEY) return unavailable()
  const url = new URL(req.url)
  if (!['focuscarellc.com', 'www.focuscarellc.com', '127.0.0.1', 'localhost'].includes(url.hostname)) return response({ error: 'Use the checklist form at focuscarellc.com.' }, 403)
  // Domain-separate from contact tokens, so one type cannot replay the other.
  const secret = env.CONTACT_FORM_SECRET + '|resource-request-v1'
  if (req.method === 'GET') return response({ token: await tokenFor(url.origin, secret), minimumWaitMs: 3000 })
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'GET, POST', 'Cache-Control': 'no-store' } })
  if (req.headers.get('Origin') !== url.origin || req.headers.get('Sec-Fetch-Site') === 'cross-site') return response({ error: 'Please submit from this website.' }, 403)
  if (!(req.headers.get('Content-Type') || '').startsWith('application/json')) return response({ error: 'Invalid request.' }, 415)
  let body: Record<string, unknown>
  try {
    const reader = req.body?.getReader(), decoder = new TextDecoder()
    let bytes = 0, text = ''
    if (reader) for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > 4096) { await reader.cancel(); return response({ error: 'Request too large.' }, 413) }
      text += decoder.decode(value, { stream: true })
    }
    body = JSON.parse(text + decoder.decode())
  } catch { return response({ error: 'Invalid request.' }, 400) }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return response({ error: 'Invalid request.' }, 400)
  if (body.website) return response({ error: 'Please email us to request the checklist.' }, 400)
  const field = (key: string) => typeof body[key] === 'string' ? (body[key] as string).trim() : ''
  const email = field('email').toLowerCase(), organisation = field('organisation'), source = field('source')
  if (email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\u0000-\u001f\u007f]/.test(email)) return response({ error: 'Enter a valid work email.', field: 'email' }, 400)
  if (organisation.length > 120 || /[\u0000-\u001f\u007f]/.test(organisation)) return response({ error: 'Keep the organisation name under 120 characters.', field: 'organisation' }, 400)
  if (!resourceSources.has(source) || field('noticeVersion') !== noticeVersion) return response({ error: 'Please reload the checklist form.' }, 400)
  const token = await validateToken(field('token'), url.origin, secret)
  if (!token || token.age < 0 || token.age > 86400000) return response({ error: 'The form has expired. Please try again.', refreshToken: true }, 400)
  if (token.age < 3000) return response({ error: 'Please wait a moment, then request the checklist again.' }, 429)
  const db = env.CONTACT_DB, payloadHash = await hash(JSON.stringify({ email, organisation, source, noticeVersion }))
  try {
    const existing = await db.prepare('SELECT id, payload_hash FROM resource_requests WHERE id = ?').bind(token.id).first<{ id: string; payload_hash: string }>()
    if (existing) {
      if (existing.payload_hash !== payloadHash) return response({ error: 'Start a new request to change saved details.', refreshToken: true }, 409)
      return response({ success: true })
    }
    const now = iso(), hourAgo = iso(Date.now() - 3600000), dayStart = now.slice(0, 10) + 'T00:00:00.000Z'
    const ip = req.headers.get('CF-Connecting-IP') || 'unknown'
    const requestKey = hex(await crypto.subtle.sign('HMAC', await signingKey(env.CONTACT_FORM_SECRET), encoder.encode(`rate|${now.slice(0, 10)}|${ip}`)))
    const isTest = /test[-+_. ]*(ignore|capture)|\+test/i.test(email) || /^test\b/i.test(organisation)
    const isInternal = email.endsWith('@focuscarellc.com') || internalEmails.has(email)
    // One PDF/owner notice per normalized email and resource version. All writes
    // share a transaction, so acceptance cannot leave an incomplete email outbox.
    await db.batch([
      db.prepare(`INSERT INTO resource_requests
        (id,created_at,email,organisation,source_path,resource_key,pdf_sha256,notice_version,payload_hash,request_key,is_test,is_internal)
        SELECT ?,?,?,?,?,?,?,?,?,?,?,?
        WHERE (SELECT count(*) FROM resource_requests WHERE request_key = ? AND created_at >= ?) < 5
        AND (SELECT count(*) FROM resource_requests WHERE created_at >= ?) < 80
        ON CONFLICT DO NOTHING`).bind(token.id,now,email,organisation,source,pdf.resourceKey,pdf.sha256,noticeVersion,payloadHash,requestKey,Number(isTest),Number(isInternal),requestKey,hourAgo,dayStart),
      ...['checklist','owner'].map(kind => db.prepare(`INSERT INTO resource_deliveries(request_id,kind,next_attempt_at)
        SELECT id,?,created_at FROM resource_requests WHERE id = ? ON CONFLICT DO NOTHING`).bind(kind,token.id)),
    ])
    const saved = await db.prepare('SELECT id, payload_hash FROM resource_requests WHERE id = ?').bind(token.id).first<{id: string; payload_hash: string}>()
    if (!saved) {
      // Same-email retries must not disclose the old receipt or send again.
      const duplicate = await db.prepare('SELECT id FROM resource_requests WHERE email = ? AND resource_key = ?').bind(email,pdf.resourceKey).first()
      if (duplicate) return response({ success: true })
      return response({ error: 'We cannot accept another request right now. Your entries are still here. Please email us.' }, 429)
    }
    if (saved.payload_hash !== payloadHash) return response({ error: 'Start a new request to change saved details.', refreshToken: true }, 409)
    const delivery = deliverResourceRequest(env, token.id).catch(() => { console.error(JSON.stringify({event:'resource_delivery_unavailable'})) })
    if (ctx) ctx.waitUntil(delivery); else await delivery
    // Match the repeat-address response exactly; do not expose membership or
    // an old receipt to someone who knows only another person's email address.
    return response({ success: true })
  } catch {
    console.error(JSON.stringify({ event: 'resource_storage_unavailable' }))
    return unavailable()
  }
}

async function deliverResourceEmail(env: ContactEnv, id: string, kind: 'checklist' | 'owner') {
  if (!env.CONTACT_DB || !env.RESEND_API_KEY) return
  const db = env.CONTACT_DB, now = iso()
  const job = await db.prepare(`UPDATE resource_deliveries SET delivery_status='sending', delivery_attempts=delivery_attempts+1, lease_until=?
    WHERE request_id=? AND kind=? AND delivery_status IN ('pending','sending')
    AND (lease_until IS NULL OR lease_until < ?) AND next_attempt_at <= ? AND delivery_attempts < 12
    AND EXISTS(SELECT 1 FROM resource_requests WHERE id=? AND created_at > ?)
    RETURNING request_id,kind,delivery_attempts`).bind(iso(Date.now()+120000),id,kind,now,now,id,iso(Date.now()-23*3600000)).first<Delivery>()
  if (!job) return
  const row = await db.prepare('SELECT * FROM resource_requests WHERE id=?').bind(id).first<ResourceRequest>()
  if (!row) return
  let emailId='',code='network',permanent=false
  try {
    if (row.resource_key !== pdf.resourceKey || row.pdf_sha256 !== pdf.sha256) {
      await db.prepare("UPDATE resource_deliveries SET delivery_status='failed',lease_until=NULL,last_error_code='resource_version_mismatch' WHERE request_id=? AND kind=?").bind(id,kind).run()
      return
    }
    const marked = row.is_test ? '[TEST - ignore] ' : ''
    const owner = kind === 'owner'
    const res = await fetch('https://api.resend.com/emails', {
      method:'POST',signal:AbortSignal.timeout(8000),
      headers:{ Authorization:`Bearer ${env.RESEND_API_KEY}`, 'Content-Type':'application/json', 'Idempotency-Key':`focuscare-resource/${row.id}/${kind}` },
      body:JSON.stringify({
        from:'Focus Care <enquiries@mail.focuscarellc.com>', to:[owner?'jovanie@focuscarellc.com':row.email], reply_to:'jovanie@focuscarellc.com',
        subject:marked+(owner?`Focus Care resource request [${row.id}]`:'Your Focus Care inspection-readiness checklist'),
        text:owner
          ? `New inspection-readiness resource request\n\nReference: ${row.id}\nReceived: ${row.created_at}\nEmail: ${row.email}\nOrganisation: ${row.organisation || 'Not provided'}\nSource: https://focuscarellc.com${row.source_path}\n\nNotice accepted: requested checklist plus one follow-up from Jovanie, nothing else. No list or waitlist subscription.\nOwner action: confirm that the checklist was delivered before following up. Review for spam/opt-out, then send at most ONE personal follow-up. Do not add to a list. No automatic follow-up is scheduled.\nInternal/test: ${row.is_internal || row.is_test ? 'yes, exclude from counts and do not follow up' : 'no'}\n`
          : `Your inspection-readiness checklist is attached as a two-page PDF.\n\nUse it to organize the evidence you can find and record items for follow-up. Tools support your oversight; they do not guarantee compliance. The provider makes the final decisions.\n\nYou requested this checklist and one follow-up from Jovanie, nothing else. You have not been added to any list or waitlist. If you do not want the follow-up, reply and say so.\n\nJovanie Rosario\nFocus Care LLC\n239 4th Ave, Suite 1401, Unit #7549\nPittsburgh, PA 15222\nhttps://focuscarellc.com/resources/inspection-readiness-checklist\nReference: ${row.id}\n`,
        ...(!owner?{attachments:[{filename:pdf.filename,content:pdf.content,content_type:'application/pdf'}]}:{}),
        tags:[{name:'category',value:owner?'resource-owner':'resource-checklist'},{name:'request_id',value:row.id}],
      }),
    })
    code=`http_${res.status}`
    if (res.ok) { const data=await res.json() as {id?:string}; if(typeof data.id==='string'&&/^[a-f0-9-]{36}$/i.test(data.id))emailId=data.id }
    permanent=res.status>=400&&res.status<500&&![408,409,429].includes(res.status)
  } catch { /* Never log recipients, secrets, PDF bodies or provider diagnostics. */ }
  if (emailId) await db.prepare("UPDATE resource_deliveries SET delivery_status='sent', email_id=?, lease_until=NULL, last_error_code=NULL WHERE request_id=? AND kind=?").bind(emailId,id,kind).run()
  else {
    const failed=permanent||job.delivery_attempts>=12
    await db.prepare('UPDATE resource_deliveries SET delivery_status=?,lease_until=NULL,next_attempt_at=?,last_error_code=? WHERE request_id=? AND kind=?')
      .bind(failed?'failed':'pending',iso(Date.now()+Math.min(3600000,300000*2**(job.delivery_attempts-1))),code,id,kind).run()
    console.error(JSON.stringify({event:failed?'resource_delivery_needs_review':'resource_delivery_retry',kind,code}))
  }
}
export async function deliverResourceRequest(env: ContactEnv, id: string) {
  await deliverResourceEmail(env,id,'checklist')
  await new Promise(resolve=>setTimeout(resolve,600))
  await deliverResourceEmail(env,id,'owner')
}
export async function retryResourceRequests(env: ContactEnv) {
  if (!env.CONTACT_DB) return
  const db=env.CONTACT_DB,now=iso()
  await db.prepare(`UPDATE resource_deliveries SET delivery_status='failed',last_error_code='retry_window_expired'
    WHERE delivery_status IN ('pending','sending') AND (delivery_attempts>=12 OR request_id IN (SELECT id FROM resource_requests WHERE created_at<=?))
    AND (lease_until IS NULL OR lease_until<?)`).bind(iso(Date.now()-23*3600000),now).run()
  const jobs=await db.prepare(`SELECT request_id,kind FROM resource_deliveries WHERE delivery_status IN ('pending','sending')
    AND next_attempt_at<=? AND (lease_until IS NULL OR lease_until<?) ORDER BY next_attempt_at LIMIT 10`).bind(now,now).all<Delivery>()
  for (const job of jobs.results) {
    try { await deliverResourceEmail(env,job.request_id,job.kind) } catch { console.error(JSON.stringify({event:'resource_retry_unavailable'})) }
    await new Promise(resolve=>setTimeout(resolve,600))
  }
}
