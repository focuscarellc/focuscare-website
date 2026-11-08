import notFoundHtml from "@/design/generated/not-found.json"

export const runtime = "edge"
const headers = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, follow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
}

// Known marketing URLs are served by the exact beforeFiles rewrites. Unmatched
// paths share the generated branded composition and a real 404, without hydration.
export function GET() { return new Response(notFoundHtml, { status: 404, headers }) }
export function HEAD() { return new Response(null, { status: 404, headers }) }
