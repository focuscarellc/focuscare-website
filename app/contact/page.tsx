import { notFound } from "next/navigation"
// Marketing HTML is generated from design/motion-led and served by beforeFiles rewrites.
// A missing generated route must return 404 instead of falling back to obsolete content.
export default function MarketingFallback() { notFound() }
