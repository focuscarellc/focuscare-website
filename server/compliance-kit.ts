// Framework-independent checklist handler shared by the Next route and the Pages worker.
// A downloadable link is not email delivery. Preserve the existing integration contract.
export type ComplianceKitEnv = { LEAD_WEBHOOK_URL?: string; MAILJET_API_KEY?: string; MAILJET_SECRET_KEY?: string }
const downloadUrl = "https://focuscarellc.gumroad.com/l/free-inspection-checklist"
const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...headers } })

export async function handleComplianceKit(req: Request, env: ComplianceKitEnv = {}): Promise<Response> {
  const origin = req.headers.get("origin")
  let sameHost = false
  try { sameHost = !!origin && new URL(origin).host === req.headers.get("host") } catch {}
  if (origin && !sameHost && !["https://focuscarellc.com", "https://www.focuscarellc.com"].includes(origin)) return json({ error: "This request must start on the Focus Care website." }, 403)
  if (Number(req.headers.get("content-length")) > 8192) return json({ error: "Request too large." }, 413)
  let body: Record<string, unknown>
  try {
    const reader = req.body?.getReader(), decoder = new TextDecoder()
    let bytes = 0, text = ""
    if (reader) for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > 8192) { await reader.cancel(); return json({ error: "Request too large." }, 413) }
      text += decoder.decode(value, { stream: true })
    }
    body = JSON.parse(text + decoder.decode())
  } catch { return json({ error: "Invalid request." }, 400) }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid request." }, 400)
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Valid email is required." }, 400)
  const field = (v: unknown) => typeof v === "string" ? v.trim().slice(0, 160) : ""
  const lead = { email, name: field(body.name), company: field(body.company), timestamp: new Date().toISOString(), source: "compliance-kit-download", marketingConsent: body.marketingConsent === true }
  const jobs: Promise<boolean>[] = []
  const send = async (url: string, init: RequestInit) => { try { return (await fetch(url, { ...init, signal: AbortSignal.timeout(6000) })).ok } catch { return false } }
  if (env.LEAD_WEBHOOK_URL) jobs.push(send(env.LEAD_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }))
  if (env.MAILJET_API_KEY && env.MAILJET_SECRET_KEY) jobs.push(send("https://api.mailjet.com/v3/REST/contact", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Basic ${btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`)}` },
    body: JSON.stringify({ Email: lead.email, Name: lead.name, IsExcludedFromCampaigns: !lead.marketingConsent }),
  }))
  const results = await Promise.all(jobs)
  const captureStatus = !results.length ? "not-configured" : results.every(Boolean) ? "recorded" : "incomplete"
  // Never log lead fields, credentials, upstream responses, or a false email-success claim.
  return json({ success: true, message: "Open the checklist using the download link. This website has not sent an email.", downloadUrl, captureStatus }, 200, { "Cache-Control": "no-store" })
}
