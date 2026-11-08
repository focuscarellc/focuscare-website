// Native Cloudflare Pages advanced-mode worker. Serves only the packaged, reviewed
// marketing HTML and approved assets; no framework runtime or hydration.
import { handleComplianceKit, type ComplianceKitEnv } from "./compliance-kit"
import release from "../design/generated/release-manifest.json"
import notFoundHtml from "../design/generated/not-found.json"

type Env = ComplianceKitEnv & { ASSETS: { fetch(req: Request | string): Promise<Response> } }
const security = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN" }
const redirects: Record<string, string> = Object.fromEntries((release.redirects as { from: string; to: string }[]).map(r => [r.from, r.to]))
const pages = new Map<string, string>()
for (const p of release.pages as { route: string; path: string }[]) if (p.route !== "/404") pages.set(p.route, p.path)
const staticFiles = new Set(["/robots.txt", "/sitemap.xml", "/favicon.ico", "/favicon.svg", "/favicon-16x16.png", "/favicon-32x32.png", "/favicon-96x96.png", "/apple-touch-icon.png", "/android-chrome-192x192.png", "/android-chrome-512x512.png"])

function finish(res: Response, head: boolean, extra: Record<string, string> = {}) {
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries({ ...security, ...extra })) headers.set(k, v)
  return new Response(head ? null : res.body, { status: res.status, headers })
}
const notFound = (head: boolean) => finish(new Response(notFoundHtml as string, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }), head, { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, follow" })
const redirect = (url: URL, path: string) => finish(new Response(null, { status: 308, headers: { Location: path + url.search } }), false)
function assetRequest(url: URL, req: Request) {
  const headers = new Headers()
  for (const key of ["If-None-Match", "If-Modified-Since"]) {
    const value = req.headers.get(key)
    if (value) headers.set(key, value)
  }
  return new Request(url, { method: "GET", headers })
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url), path = url.pathname, head = req.method === "HEAD"
    if (path.startsWith("/api/")) {
      if (path !== "/api/compliance-kit") return finish(Response.json({ error: "Not found." }, { status: 404, headers: { "Cache-Control": "no-store" } }), head)
      if (req.method !== "POST") return finish(Response.json({ error: "Method not allowed." }, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } }), head)
      return finish(await handleComplianceKit(req, env), false)
    }
    if (req.method !== "GET" && !head) return finish(new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } }), false)
    if (path.startsWith("//") || path.includes("..") || path.includes("%") || path.includes("\\")) return notFound(head)
    if (path === "/redesign" || path.startsWith("/redesign/") || ["/_worker.js", "/_routes.json", "/.build-manifest.json"].includes(path)) return notFound(head)
    // Normalize /index.html and trailing slashes before route lookup, keeping the query string.
    if (/\/index\.html$/.test(path)) return redirect(url, path.replace(/\/index\.html$/, "") || "/")
    if (path.length > 1 && path.endsWith("/")) return redirect(url, path.replace(/\/+$/, "") || "/")
    if (redirects[path]) return redirect(url, redirects[path])
    const file = pages.get(path)
    if (file) {
      // Request the packaged directory, not index.html, so Pages does not redirect internally.
      const res = await env.ASSETS.fetch(assetRequest(new URL("/" + file.replace(/index\.html$/, ""), url), req))
      if (res.status !== 200 && res.status !== 304) return notFound(head)
      return finish(res, head, release.preview ? { "X-Robots-Tag": "noindex, follow" } : {})
    }
    if (path.startsWith("/assets/") || path.startsWith("/licenses/") || staticFiles.has(path)) {
      const res = await env.ASSETS.fetch(assetRequest(url, req))
      if (res.status === 200 || res.status === 304) return finish(res, head)
    }
    return notFound(head)
  },
}
