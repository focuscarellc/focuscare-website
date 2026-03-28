import Link from "next/link"
import { ArrowLeft, CheckCircle, FileText, Download, Shield, Clock, Users } from "lucide-react"
import { ComplianceKitForm } from "@/components/compliance-kit-form"

export const metadata = {
  title: "Free 6400 Compliance Starter Kit - FOCUS Care",
  description: "Download our free compliance toolkit for Pennsylvania residential habilitation providers. Includes self-inspection checklists, training trackers, incident reporting SOPs, and more.",
  keywords: ["6400 compliance", "Pennsylvania IDD", "residential habilitation", "ODP compliance", "self-inspection checklist"],
  openGraph: {
    title: "Free 6400 Compliance Starter Kit - FOCUS Care",
    description: "Download our free compliance toolkit for Pennsylvania residential habilitation providers. Includes self-inspection checklists, training trackers, incident reporting SOPs, and more.",
    images: ["/og/compliance-kit-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 6400 Compliance Starter Kit - FOCUS Care",
    description: "Download our free compliance toolkit for Pennsylvania residential habilitation providers. Includes self-inspection checklists, training trackers, incident reporting SOPs, and more.",
    images: ["/og/compliance-kit-og.png"],
  },
}

const resources = [
  {
    title: "Self-Inspection Checklist",
    description: "Comprehensive 55 PA Code §6400 audit checklist with all regulatory requirements.",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    title: "Top 20 Common Citations Guide",
    description: "Learn the most frequent licensing violations and how to avoid them.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Annual Training Tracker",
    description: "Track staff certifications, training hours, and renewal dates.",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Staff Onboarding Checklist",
    description: "Day 1 to Day 180 onboarding guide for DSPs with all compliance requirements.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Incident Reporting SOP",
    description: "Standard operating procedure for EIM reporting and investigations.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Quick Reference Card",
    description: "Print-ready card with key phone numbers, timelines, and emergency procedures.",
    icon: <Download className="h-5 w-5" />,
  },
]

const benefits = [
  "Save 10+ hours on compliance documentation",
  "Reduce citation risk at your next inspection",
  "Train new staff faster with ready-made checklists",
  "Stay audit-ready year-round",
]

export default function ComplianceKitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-sm text-primary hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Download className="h-4 w-4" /> Free Download
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-4">
                6400 Compliance Starter Kit
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Everything Pennsylvania residential habilitation providers need to stay compliant with 55 PA Code Chapter 6400. 
                <strong className="text-foreground"> 6 ready-to-use documents</strong> — free, no strings attached.
              </p>
              
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Form */}
            <div className="bg-card border rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-primary mb-2">Get Your Free Kit</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your email and we&apos;ll send the download link instantly.
              </p>
              <ComplianceKitForm />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4">
            What&apos;s Included
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            6 professionally designed documents to streamline your compliance workflow
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.title} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {resource.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{resource.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Built by Compliance Experts
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            FOCUS Care has over 15 years of experience helping Pennsylvania IDD and behavioral health providers 
            navigate ODP regulations. These documents are the same tools we use with our consulting clients.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              <span>HIPAA Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span>ODP Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" />
              <span>Print-Ready PDFs</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need Hands-On Compliance Help?</h2>
          <p className="mb-6 opacity-90">
            Our team can audit your operations, train your staff, and build custom compliance systems.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-white/90 transition-colors"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
