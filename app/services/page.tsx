import Link from "next/link"
import { ArrowRight, CheckCircle, BarChart3, Shield, Server, Laptop, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ImageWithShadow from "@/components/image-with-shadow"

export const metadata = {
  title: "Services - FOCUS Care",
  description:
    "Explore our specialized IT consultancy and managed services for disability and mental health service providers.",
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Our Services
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                Specialized IT Solutions for Care Providers
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                We provide tailored IT consultancy and managed services designed specifically for organizations
                supporting individuals with intellectual disabilities, autism, and mental health needs.
              </p>
            </div>
            <div className="mx-auto lg:ml-auto">
              <ImageWithShadow
                src="/placeholder.svg?height=550&width=550"
                alt="IT professionals working with healthcare providers"
                width={550}
                height={550}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* IT Consultancy Services */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                IT Consultancy
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Strategic IT Planning & Implementation
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Our consultancy services help you develop and implement IT strategies that align with your
                organization's mission and goals.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-secondary" />
                  IT Strategy Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We work with you to develop comprehensive IT strategies that support your organization's mission,
                  enhance service delivery, and improve operational efficiency.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-secondary" />
                  Compliance Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our experts ensure your IT systems meet all regulatory requirements, including data protection,
                  privacy, and industry-specific regulations.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Laptop className="mr-2 h-5 w-5 text-secondary" />
                  Technology Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We help you select the right software, hardware, and systems that meet your specific needs and
                  integrate seamlessly with your existing infrastructure.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Managed IT Services */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Managed IT Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Comprehensive IT Management & Support
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Our managed IT services provide ongoing support and maintenance to ensure your systems run smoothly and
                securely.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5 text-secondary" />
                  Infrastructure Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We manage and maintain your IT infrastructure, including servers, networks, and cloud services,
                  ensuring optimal performance and reliability.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-secondary" />
                  Security & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Our proactive security monitoring and management services protect your systems and sensitive client
                  data from threats.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-secondary" />
                  24/7 Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Our responsive support team is available around the clock to address any technical issues and minimize
                  disruption to your services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Staff Training & Support */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Staff Training & Support
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Empowering Your Team
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We provide comprehensive training and support to ensure your staff can effectively use technology in
                their day-to-day work.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary mt-0.5" />
                  <span>Customized training programs tailored to your staff's needs and skill levels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary mt-0.5" />
                  <span>Ongoing support and guidance for new and existing systems</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary mt-0.5" />
                  <span>Documentation and resources for self-guided learning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary mt-0.5" />
                  <span>Regular updates and refresher training as systems evolve</span>
                </li>
              </ul>
            </div>
            <div className="mx-auto order-first lg:order-last">
              <ImageWithShadow
                src="/placeholder.svg?height=400&width=600"
                alt="Staff training session"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Our Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                How We Work With You
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Our collaborative approach ensures we deliver solutions that truly meet your needs.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <div className="grid gap-8 md:grid-cols-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary dark:bg-secondary/30 dark:text-secondary">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-primary dark:text-white">Assessment</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    We begin by understanding your organization's unique needs, challenges, and goals.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary dark:bg-secondary/30 dark:text-secondary">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-primary dark:text-white">Planning</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    We develop a tailored strategy and implementation plan based on our assessment.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary dark:bg-secondary/30 dark:text-secondary">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-primary dark:text-white">Implementation</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    We execute the plan with minimal disruption to your operations.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary dark:bg-secondary/30 dark:text-secondary">
                  <span className="text-xl font-bold">4</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-primary dark:text-white">Ongoing Support</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    We provide continuous support, monitoring, and optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact us today to schedule a free consultation and learn how FOCUS Care can support your organization.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/contact">
                <Button
                  variant="secondary"
                  className="w-full min-[400px]:w-auto bg-secondary text-primary hover:bg-secondary/90"
                >
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

