import type { Metadata } from "next"
import type { ReactNode } from "react"
// Generated marketing HTML bypasses this shell; it covers framework errors and unknown URLs.
export const metadata: Metadata = {
  metadataBase: new URL("https://focuscarellc.com"), title: "Focus Care | Care-provider workflows",
  description: "Digital forms and workflows for care providers, with staff in control.",
  robots: { index: false, follow: true }, icons: { icon: "/assets/favicon.png" },
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><link rel="stylesheet" href="/assets/site.css" /></head><body>
    <a className="skip" href="#main">Skip to content</a>
    <header className="header shell"><a className="brand" href="/"><img src="/assets/logo-128.webp" width="40" height="40" alt="" /><span>Focus Care</span></a><a className="button" href="/contact">Talk to Focus Care</a></header>
    <main id="main" className="shell">{children}</main>
    <footer className="footer shell"><nav className="footer-links" aria-label="Footer"><a href="/services">Services</a><a href="/blog">Resources</a><a href="/privacy">Privacy</a><a href="/accessibility">Accessibility</a></nav><p>© 2026 Focus Care LLC</p></footer>
  </body></html>
}
