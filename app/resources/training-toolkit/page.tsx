import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, GraduationCap, CheckCircle, Users, BookOpen, Clock } from "lucide-react"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata = {
  title: "Staff Training Toolkit - FOCUS Care",
  description: "Resources to help you train your staff on using technology effectively in care delivery.",
}

const modules = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Module 1: Technology Basics for Care Staff",
    duration: "45 minutes",
    topics: [
      "Navigating your organization's core software systems",
      "Proper login procedures and password management",
      "Using mobile devices securely in the field",
      "Basic troubleshooting: when to try fixes vs. when to call IT",
      "Keyboard shortcuts and time-saving tips",
    ],
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Module 2: Electronic Documentation Best Practices",
    duration: "60 minutes",
    topics: [
      "Real-time documentation vs. end-of-shift notes — why it matters",
      "Writing clear, objective, and compliant progress notes",
      "Using EHR templates effectively without copy-paste errors",
      "Documenting incidents and critical events properly",
      "Tips for voice-to-text and mobile documentation in the field",
    ],
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Module 3: HIPAA & Data Security Awareness",
    duration: "60 minutes",
    topics: [
      "What is PHI and why protecting it matters",
      "Common security mistakes in care settings (and how to avoid them)",
      "Recognizing phishing emails and social engineering attacks",
      "Proper procedures for sharing client information",
      "What to do if you suspect a data breach",
      "Physical security: locking screens, securing devices, shredding documents",
    ],
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Module 4: Communication & Collaboration Tools",
    duration: "45 minutes",
    topics: [
      "Using HIPAA-compliant messaging platforms correctly",
      "Video conferencing etiquette for telehealth sessions",
      "Shared calendar and scheduling tool best practices",
      "When to use email vs. chat vs. phone vs. in-person",
      "Collaborating on shared documents without version confusion",
    ],
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Module 5: Electronic Visit Verification (EVV)",
    duration: "30 minutes",
    topics: [
      "Understanding EVV requirements and why they exist",
      "Step-by-step guide to clocking in and out correctly",
      "Handling common EVV issues (GPS problems, missed punches)",
      "Correcting errors and working with supervisors on exceptions",
    ],
  },
]

const tips = [
  {
    title: "Start with Why",
    description: "Explain how technology helps clients get better care before teaching how to use it. Staff who understand the purpose are more engaged learners.",
  },
  {
    title: "Hands-On Practice",
    description: "Use sandbox environments and practice scenarios. Adults learn by doing, not by watching PowerPoints.",
  },
  {
    title: "Peer Champions",
    description: "Identify tech-savvy staff to serve as floor-level support. Peer learning is often more effective than formal training.",
  },
  {
    title: "Short & Frequent",
    description: "30-minute focused sessions beat 4-hour marathon trainings. Schedule regular micro-learning opportunities.",
  },
  {
    title: "Multilingual Materials",
    description: "If your workforce includes non-native English speakers, provide training materials in their primary languages.",
  },
  {
    title: "Measure & Iterate",
    description: "Track help desk tickets and common errors post-training. Use the data to refine your training program.",
  },
]

export default function TrainingToolkitPage() {
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
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
              Staff Training Toolkit
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
            Technology Training Resources for Care Professionals
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">FOCUS Care LLC • focuscarellc.com</p>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Technology is only as effective as the people using it. This toolkit provides a structured training
              curriculum for direct support professionals, case managers, and administrative staff in disability and
              mental health service organizations. Adapt these modules to your organization&apos;s specific systems and workflows.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Training Modules</h2>
          <div className="space-y-8 mb-16">
            {modules.map((mod) => (
              <div key={mod.title} className="border rounded-lg p-6 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-primary dark:text-secondary">{mod.icon}</div>
                  <h3 className="text-lg font-bold text-primary dark:text-white">{mod.title}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Estimated Duration: {mod.duration}
                </p>
                <div className="space-y-2">
                  {mod.topics.map((topic) => (
                    <div key={topic} className="flex items-start gap-3 p-2">
                      <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Training Best Practices</h2>
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {tips.map((tip) => (
              <Card key={tip.title}>
                <CardContent className="p-6">
                  <CardTitle className="text-lg text-primary dark:text-white mb-2">{tip.title}</CardTitle>
                  <CardDescription>{tip.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">Custom Training Programs</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              FOCUS Care develops customized training programs tailored to your specific systems, workflows, and staff
              needs. From onboarding new hires to rolling out new technology, we help your team build confidence and
              competence.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Discuss Your Training Needs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
