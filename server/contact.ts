// Operational enquiry records are independent of optional website analytics.
// Do not log request bodies, email addresses, messages, credentials or vendor bodies.
import type { ContactBindings } from './contact-bindings.generated'
export type ContactEnv = Partial<ContactBindings>

type Enquiry = {
  id: string; created_at: string; name: string; email: string; service: string; message: string
  payload_hash: string; delivery_status: string; delivery_attempts: number
  is_test: number; is_internal: number
}
const services = new Set(['', 'recruitment', 'training', 'payroll', 'operations', 'billing', 'compliance'])
export const internalEmails = new Set(['jovanie3@gmail.com', 'focuscarellc.com@gmail.com'])
export const encoder = new TextEncoder()
export const response = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
export const iso = (ms = Date.now()) => new Date(ms).toISOString()
export const hex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('')
export const hash = async (text: string) => hex(await crypto.subtle.digest('SHA-256', encoder.encode(text)))
export async function signingKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}
export async function tokenFor(origin: string, secret: string) {
  const value = `${Date.now()}.${crypto.randomUUID()}`
  const sig = await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(`${origin}|${value}`))
  return `${value}.${hex(sig)}`
}
export async function validateToken(token: string, origin: string, secret: string) {
  const match = /^(\d{13})\.([a-f0-9-]{36})\.([a-f0-9]{64})$/.exec(token)
  if (!match) return null
  const signature = Uint8Array.from(match[3].match(/../g)!, byte => parseInt(byte, 16))
  if (!await crypto.subtle.verify('HMAC', await signingKey(secret), signature, encoder.encode(`${origin}|${match[1]}.${match[2]}`))) return null
  const age = Date.now() - Number(match[1])
  return { id: match[2], age }
}

export async function handleContact(req: Request, env: ContactEnv, ctx?: { waitUntil(p: Promise<unknown>): void }) {
  if (!env.CONTACT_DB || !env.CONTACT_FORM_SECRET || !env.RESEND_API_KEY) return response({ error: 'The form is unavailable. Please email or call us. Your entries have not been sent.' }, 503)
  const url = new URL(req.url)
  // Preview builds cannot write production enquiries, even if a binding is copied by mistake.
  if (!['focuscarellc.com', 'www.focuscarellc.com', '127.0.0.1', 'localhost'].includes(url.hostname)) return response({ error: 'Please use the form at focuscarellc.com/contact.' }, 403)
  if (req.method === 'GET') return response({ token: await tokenFor(url.origin, env.CONTACT_FORM_SECRET), minimumWaitMs: 3000 })
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'GET, POST', 'Cache-Control': 'no-store' } })
  if (req.headers.get('Origin') !== url.origin || req.headers.get('Sec-Fetch-Site') === 'cross-site') return response({ error: 'Please submit from this website.' }, 403)
  if (!(req.headers.get('Content-Type') || '').startsWith('application/json')) return response({ error: 'Invalid request.' }, 415)
  let body: Record<string, unknown>
  try {
    let bytes = 0, text = ''
    const reader = req.body?.getReader(), decoder = new TextDecoder()
    if (reader) for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > 8192) { await reader.cancel(); return response({ error: 'Please shorten your message.' }, 413) }
      text += decoder.decode(value, { stream: true })
    }
    body = JSON.parse(text + decoder.decode())
  } catch { return response({ error: 'Invalid request.' }, 400) }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return response({ error: 'Invalid request.' }, 400)
  // A filled honeypot must never get a success receipt or become a lead.
  if (body.website) return response({ error: 'Please email or call us to enquire.' }, 400)
  const field = (key: string) => typeof body[key] === 'string' ? (body[key] as string).trim() : ''
  const name = field('name'), email = field('email').toLowerCase(), service = field('service'), message = field('message')
  if (!name || name.length > 100 || /[\r\n\u0000]/.test(name)) return response({ error: 'Enter your name (up to 100 characters).', field: 'name' }, 400)
  if (email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\u0000-\u001f\u007f]/.test(email)) return response({ error: 'Enter a valid email address.', field: 'email' }, 400)
  if (!services.has(service) || message.length > 1200 || message.includes('\u0000')) return response({ error: 'Check the workflow and shorten your message to 1,200 characters.' }, 400)
  const token = await validateToken(field('token'), url.origin, env.CONTACT_FORM_SECRET)
  if (!token || token.age < 0 || token.age > 86400000) return response({ error: 'The form has expired. Please try again.', refreshToken: true }, 400)
  if (token.age < 3000) return response({ error: 'Please wait a moment, then send your enquiry again.' }, 429)
  const db = env.CONTACT_DB
  const payloadHash = await hash(JSON.stringify({ name, email, service, message }))
  try {
    const existing = await db.prepare('SELECT id, payload_hash FROM contact_enquiries WHERE id = ?').bind(token.id).first<{ id: string; payload_hash: string }>()
    if (existing) {
      if (existing.payload_hash !== payloadHash) return response({ error: 'Start a new enquiry to change a saved message.', refreshToken: true }, 409)
      return response({ success: true, receipt: existing.id })
    }
    const now = iso(), hourAgo = iso(Date.now() - 3600000), dayStart = iso().slice(0, 10) + 'T00:00:00.000Z'
    // Rotate the operational rate-limit key daily; never store the visitor's IP.
    const ip = req.headers.get('CF-Connecting-IP') || 'unknown'
    const requestKey = hex(await crypto.subtle.sign('HMAC', await signingKey(env.CONTACT_FORM_SECRET), encoder.encode(`rate|${now.slice(0, 10)}|${ip}`)))
    const isTest = /^test\b/i.test(name) || /test[-+_. ]*(ignore|capture)|\+test/i.test(email)
    const isInternal = email.endsWith('@focuscarellc.com') || internalEmails.has(email)
    // Limits are checked in the INSERT itself, atomically with the write.
    await db.prepare(`INSERT INTO contact_enquiries
      (id, created_at, name, email, service, message, payload_hash, request_key, is_test, is_internal, next_attempt_at)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      WHERE (SELECT count(*) FROM contact_enquiries WHERE request_key = ? AND created_at >= ?) < 5
      AND (SELECT count(*) FROM contact_enquiries WHERE created_at >= ?) < 80
      ON CONFLICT(id) DO NOTHING`).bind(token.id, now, name, email, service, message, payloadHash, requestKey, Number(isTest), Number(isInternal), now, requestKey, hourAgo, dayStart).run()
    const saved = await db.prepare('SELECT id, payload_hash FROM contact_enquiries WHERE id = ?').bind(token.id).first<{ id: string; payload_hash: string }>()
    if (!saved) return response({ error: 'We cannot accept another enquiry right now. Please email or call us. Your entries are still here.' }, 429)
    if (saved.payload_hash !== payloadHash) return response({ error: 'Start a new enquiry to change a saved message.', refreshToken: true }, 409)
    // The durable write is the acceptance boundary. Email errors cannot lose an enquiry.
    if (ctx) ctx.waitUntil(deliverEnquiry(env, token.id).catch(() => {}))
    else await deliverEnquiry(env, token.id).catch(() => {})
    return response({ success: true, receipt: token.id }, 201)
  } catch {
    console.error(JSON.stringify({ event: 'contact_storage_unavailable' }))
    return response({ error: 'We could not confirm your enquiry. Your entries are still here. Please try again, email or call us.' }, 503)
  }
}

export async function deliverEnquiry(env: ContactEnv, id: string): Promise<void> {
  if (!env.CONTACT_DB || !env.RESEND_API_KEY) return
  const db = env.CONTACT_DB, now = iso()
  // One lease per enquiry across request and cron workers. Stable provider key on every retry.
  const row = await db.prepare(`UPDATE contact_enquiries SET delivery_status = 'sending',
    delivery_attempts = delivery_attempts + 1, lease_until = ?
    WHERE id = ? AND delivery_status IN ('pending','sending')
    AND (lease_until IS NULL OR lease_until < ?) AND next_attempt_at <= ?
    AND delivery_attempts < 12 AND created_at > ? RETURNING *`)
    .bind(iso(Date.now() + 120000), id, now, now, iso(Date.now() - 23 * 3600000)).first<Enquiry>()
  if (!row) return
  let emailId = '', code = 'network', permanent = false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(8000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `focuscare-enquiry/${row.id}` },
      body: JSON.stringify({ from: 'Focus Care <enquiries@mail.focuscarellc.com>', to: ['jovanie@focuscarellc.com'], reply_to: row.email,
        subject: `${row.is_test ? '[TEST - ignore] ' : ''}Focus Care website enquiry [${row.id}]`,
        text: `New Focus Care services enquiry\n\nReference: ${row.id}\nReceived: ${row.created_at}\nName: ${row.name}\nEmail: ${row.email}\nWorkflow: ${row.service || 'Help choosing'}\n\n${row.message}\n\nSource: https://focuscarellc.com/contact\nInternal/test: ${row.is_internal || row.is_test ? 'yes, exclude from lead counts' : 'no'}\n`,
        tags: [{ name: 'category', value: 'services-enquiry' }, { name: 'enquiry_id', value: row.id }] })
    })
    code = `http_${res.status}`
    if (res.ok) {
      const data = await res.json() as { id?: string }
      if (typeof data.id === 'string' && /^[a-f0-9-]{36}$/i.test(data.id)) emailId = data.id
    }
    permanent = res.status >= 400 && res.status < 500 && ![408, 409, 429].includes(res.status)
  } catch { /* Bounded retry via the durable outbox; never log vendor/visitor data. */ }
  if (emailId) {
    await db.prepare("UPDATE contact_enquiries SET delivery_status = 'sent', email_id = ?, lease_until = NULL, last_error_code = NULL WHERE id = ?").bind(emailId, id).run()
  } else {
    const failed = permanent || row.delivery_attempts >= 12
    await db.prepare('UPDATE contact_enquiries SET delivery_status = ?, lease_until = NULL, next_attempt_at = ?, last_error_code = ? WHERE id = ?')
      .bind(failed ? 'failed' : 'pending', iso(Date.now() + Math.min(3600000, 300000 * 2 ** (row.delivery_attempts - 1))), code, id).run()
    console.error(JSON.stringify({ event: failed ? 'contact_delivery_needs_review' : 'contact_delivery_retry', code }))
  }
}

export async function retryEnquiries(env: ContactEnv): Promise<void> {
  if (!env.CONTACT_DB) return
  const db = env.CONTACT_DB, now = iso()
  // Stop before the provider's 24-hour idempotency window expires; never blindly duplicate mail.
  await db.prepare("UPDATE contact_enquiries SET delivery_status = 'failed', last_error_code = 'retry_window_expired' WHERE delivery_status IN ('pending','sending') AND (created_at <= ? OR delivery_attempts >= 12) AND (lease_until IS NULL OR lease_until < ?)")
    .bind(iso(Date.now() - 23 * 3600000), now).run()
  const rows = await db.prepare("SELECT id FROM contact_enquiries WHERE delivery_status IN ('pending','sending') AND next_attempt_at <= ? AND (lease_until IS NULL OR lease_until < ?) ORDER BY created_at LIMIT 10").bind(now, now).all<{ id: string }>()
  for (const row of rows.results) {
    try { await deliverEnquiry(env, row.id) } catch { console.error(JSON.stringify({ event: 'contact_retry_unavailable' })) }
    await new Promise(resolve => setTimeout(resolve, 600))
  }
}
