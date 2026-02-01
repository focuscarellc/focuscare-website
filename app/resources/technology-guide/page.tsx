import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Monitor, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Technology Selection Guide - FOCUS Care",
  description: "A guide to help you select the right technology solutions for your organization's specific needs.",
}

const sections = [
  {
    title: "1. Assess Your Current Technology Landscape",
    content: "Before selecting new technology, conduct a thorough inventory of your existing systems. Understanding what you have — and what's working or not — prevents redundant purchases and integration headaches.",
    checklist: [
      "Catalog all current software, hardware, and cloud services",
      "Identify pain points and workflow bottlenecks",
      "Document current costs (licenses, maintenance, support)",
      "Survey staff satisfaction with existing tools",
      "Map data flows between systems to identify integration gaps",
    ],
  },
  {
    title: "2. Define Your Requirements",
    content: "Clearly defining what you need before evaluating solutions saves time and prevents costly mistakes. Involve frontline staff, administrators, and compliance officers in the requirements gathering process.",
    checklist: [
      "Must support HIPAA compliance and PHI protection",
      "Accessible to staff with varying technical skill levels",
      "Mobile-friendly for field workers and remote staff",
      "Integrates with existing EHR/billing systems",
      "Scales with your organization's growth plans",
      "Meets state-specific reporting requirements",
    ],
  },
  {
    title: "3. Electronic Health Record (EHR) Systems",
    content: "Your EHR is the backbone of your clinical operations. For IDD and behavioral health providers, look for platforms designed specifically for your service model rather than adapting general healthcare EHRs.",
    checklist: [
      "Purpose-built for IDD, behavioral health, or your specific service type",
      "Supports EVV (Electronic Visit Verification) if required",
      "Includes customizable treatment plans and ISP tracking",
      "Offers integrated billing with your state Medicaid systems",
      "Provides robust reporting for outcomes measurement",
      "Mobile app for real-time documentation by direct support professionals",
    ],
  },
  {
    title: "4. Communication & Collaboration Tools",
    content: "Effective communication tools improve care coordination, reduce errors, and support remote teams. Ensure any platform you choose meets HIPAA requirements for handling protected health information.",
    checklist: [
      "HIPAA-compliant messaging (e.g., Microsoft Teams with BAA, TigerConnect)",
      "Video conferencing for telehealth and team meetings",
      "Shared document management with access controls",
      "Staff scheduling and shift management integration",
      "Family/guardian communication portal options",
    ],
  },
  {
    title: "5. Security & Infrastructure",
    content: "Strong security infrastructure protects your clients, your staff, and your organization. Invest in enterprise-grade solutions — consumer tools are insufficient for organizations handling PHI.",
    checklist: [
      "Enterprise endpoint protection (EDR/XDR solutions)",
      "Cloud backup with geo-redundancy and encryption",
      "Managed firewall and network monitoring",
      "Identity and access management (IAM) with MFA",
      "Regular penetration testing and vulnerability assessments",
    ],
  },
  {
    title: "6. Evaluate Vendors Carefully",
    content: "The vendor relationship matters as much as the technology itself. You need partners who understand the unique regulatory and operational landscape of disability and mental health services.",
    checklist: [
      "Request and verify references from similar organizations",
      "Confirm willingness to sign a HIPAA Business Associate Agreement",
      "Evaluate support response times and escalation procedures",
      "Review the vendor's financial stability and product roadmap",
      "Negotiate data portability and exit clauses in contracts",
      "Test thoroughly with a pilot program before full deployment",
    ],
  },
]

export default function TechnologyGuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-20 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-primary hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog & Resources
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <Image src="/images/fc-logo.png" alt="FocusCare LLC" width={180} height={60} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
              Technology Selection Guide
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
            Choosing the Right IT Solutions for Care Providers
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">FOCUS Care LLC • focuscarellc.com</p>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Selecting technology for a disability or mental health service organization is a high-stakes decision.
              The right tools improve care quality, reduce administrative burden, and ensure compliance. The wrong ones
              waste money and frustrate staff. This guide walks you through a structured approach to making smart
              technology investments.
            </p>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-primary dark:text-white mb-3">{section.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{section.content}</p>
                <div className="space-y-3">
                  {section.checklist.map((item) => (
                    <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">Need Expert Guidance?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              FOCUS Care helps organizations navigate technology decisions with confidence. From vendor evaluation to
              implementation planning, we&apos;re with you every step of the way.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Get a Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
