import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Shield } from "lucide-react"

export const metadata = {
  title: "IT Security Checklist - FOCUS Care",
  description: "A comprehensive checklist to assess and improve your organization's IT security posture.",
}

const sections = [
  {
    title: "1. Access Control & Authentication",
    items: [
      "Implement multi-factor authentication (MFA) for all staff accounts",
      "Enforce strong password policies (minimum 12 characters, complexity requirements)",
      "Review and audit user access permissions quarterly",
      "Disable accounts immediately upon staff departure",
      "Use role-based access control (RBAC) for all systems",
      "Maintain a current inventory of all user accounts and access levels",
    ],
  },
  {
    title: "2. Network Security",
    items: [
      "Deploy and maintain enterprise-grade firewalls",
      "Segment networks to isolate sensitive data (e.g., client records)",
      "Use encrypted Wi-Fi (WPA3) with separate guest networks",
      "Monitor network traffic for anomalies and intrusion attempts",
      "Conduct regular vulnerability scans (at least quarterly)",
      "Keep all network devices firmware up to date",
    ],
  },
  {
    title: "3. Data Protection & HIPAA Compliance",
    items: [
      "Encrypt all protected health information (PHI) at rest and in transit",
      "Implement automatic screen locks after 5 minutes of inactivity",
      "Maintain Business Associate Agreements (BAAs) with all IT vendors",
      "Conduct annual HIPAA risk assessments",
      "Establish and test data backup and disaster recovery procedures",
      "Document all data flows — know where PHI is stored and transmitted",
    ],
  },
  {
    title: "4. Endpoint Security",
    items: [
      "Install and maintain endpoint detection and response (EDR) software",
      "Enable automatic operating system and application updates",
      "Encrypt all laptops, tablets, and mobile devices",
      "Implement mobile device management (MDM) for staff devices",
      "Disable USB ports on workstations handling sensitive data",
      "Maintain an up-to-date hardware and software inventory",
    ],
  },
  {
    title: "5. Email & Communication Security",
    items: [
      "Deploy email filtering and anti-phishing solutions",
      "Enable DMARC, DKIM, and SPF for your email domain",
      "Train staff to recognize phishing and social engineering attempts",
      "Use encrypted messaging platforms for sharing client information",
      "Establish policies for acceptable use of personal devices",
    ],
  },
  {
    title: "6. Incident Response & Business Continuity",
    items: [
      "Develop and maintain a written incident response plan",
      "Designate an incident response team with clear roles",
      "Conduct tabletop exercises at least annually",
      "Establish breach notification procedures per HIPAA requirements",
      "Test backup restoration procedures quarterly",
      "Maintain offline copies of critical documentation",
    ],
  },
  {
    title: "7. Staff Training & Awareness",
    items: [
      "Conduct security awareness training for all staff upon hire",
      "Provide annual refresher training on current threats",
      "Run simulated phishing campaigns to test awareness",
      "Post security reminders in common areas and digital signage",
      "Establish a clear process for reporting security concerns",
    ],
  },
]

export default function SecurityChecklistPage() {
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
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
              IT Security Checklist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
            For Disability & Mental Health Service Providers
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">FOCUS Care LLC • focuscarellc.com</p>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Use this checklist to evaluate your organization&apos;s IT security posture. Each item represents a best
              practice that helps protect your clients&apos; data, maintain regulatory compliance, and reduce the risk of
              costly breaches. Review regularly and address any gaps promptly.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-primary dark:text-white mb-4">{section.title}</h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
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
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">Need Help Implementing These?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              FOCUS Care specializes in helping disability and mental health service providers strengthen their IT
              security. Contact us for a free consultation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
