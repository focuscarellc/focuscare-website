import { NewsletterSignup } from "@/components/newsletter-signup"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Newsletter | FOCUS Care",
  description:
    "Subscribe to get free ODP compliance tips, 6400/6100 regulation updates, and inspection prep guides for PA disability service providers.",
  openGraph: {
    title: "Newsletter | FOCUS Care",
    description:
      "Subscribe to get free ODP compliance tips, 6400/6100 regulation updates, and inspection prep guides for PA disability service providers.",
    images: ["/og/web-icons-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsletter | FOCUS Care",
    description:
      "Subscribe to get free ODP compliance tips, 6400/6100 regulation updates, and inspection prep guides for PA disability service providers.",
    images: ["/og/web-icons-twitter.png"],
  },
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 px-4 bg-primary text-primary-foreground text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Free Resource
          </p>
          <h1 className="text-4xl font-bold mb-4">
            The Compliance Insider
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Practical guidance for Pennsylvania disability service providers. ODP regulation breakdowns,
            inspection checklists, DSP training tips, and EVV best practices — straight to your inbox.
          </p>
        </div>
      </section>

      {/* Signup Card */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <NewsletterSignup
            variant="card"
            heading="Join 500+ PA Providers"
            subheading="Get weekly compliance tips that actually help you pass inspections, avoid citations, and serve your individuals better."
          />
        </div>
      </section>

      {/* What You Get */}
      <section className="py-12 px-4 bg-muted/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-primary mb-8">What You&apos;ll Get</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: "📋",
                title: "Regulation Breakdowns",
                desc: "Plain-English explanations of §6400, §6100, and §6500 requirements — no legal jargon.",
              },
              {
                icon: "🔍",
                title: "Inspection Prep",
                desc: "Checklists, common citation areas, and what ODP surveyors actually look for.",
              },
              {
                icon: "⚡",
                title: "Efficiency Tips",
                desc: "Tech tools, workflows, and automations to reduce paperwork and focus on care.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-border">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
