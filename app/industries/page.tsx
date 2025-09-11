import Link from "next/link"
import { ArrowRight, CheckCircle, Brain, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageWithShadow from "@/components/image-with-shadow"

export const metadata = {
  title: "Industries We Serve - FOCUS Care",
  description:
    "Learn about the specialized IT solutions we provide for disability services, autism support, and mental health providers.",
}

export default function IndustriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Industries We Serve
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                Specialized IT Solutions for Care Providers
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                We understand the unique challenges faced by organizations supporting individuals with intellectual
                disabilities, autism, and mental health needs.
              </p>
            </div>
            <div className="mx-auto lg:ml-auto">
              <ImageWithShadow
                src="/placeholder.svg?height=550&width=550"
                alt="Healthcare professionals using technology"
                width={550}
                height={550}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intellectual Disability Services */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mx-auto order-last lg:order-first">
              <ImageWithShadow
                src="/placeholder.svg?height=400&width=600"
                alt="Intellectual disability support services"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Intellectual Disability Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Supporting Providers of Intellectual Disability Services
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Organizations supporting individuals with intellectual disabilities face unique challenges in managing
                client information, coordinating care, and ensuring compliance with regulations.
              </p>
              <h3 className="text-xl font-bold text-primary dark:text-white">Common Challenges:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Managing complex client data and care plans</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Ensuring compliance with changing regulations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Coordinating care across multiple providers and settings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Secure sharing of sensitive client information</span>
                </li>
              </ul>
              <h3 className="text-xl font-bold text-primary dark:text-white">Our Solutions:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We provide tailored IT solutions that streamline administrative processes, ensure compliance, and
                enhance care coordination, allowing your staff to focus on providing quality care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Autism Support Services */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Autism Support Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Empowering Autism Support Providers
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Organizations supporting individuals with autism require specialized tools to track progress, manage
                behavior plans, and coordinate multidisciplinary care teams.
              </p>
              <h3 className="text-xl font-bold text-primary dark:text-white">Common Challenges:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Tracking individual progress across multiple domains</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Managing and analyzing behavior data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Coordinating care across therapists, educators, and medical providers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Ensuring consistent implementation of support strategies</span>
                </li>
              </ul>
              <h3 className="text-xl font-bold text-primary dark:text-white">Our Solutions:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We develop and implement IT systems that facilitate data collection and analysis, enhance communication
                between care team members, and provide secure access to critical information.
              </p>
            </div>
            <div className="mx-auto">
              <ImageWithShadow
                src="/placeholder.svg?height=400&width=600"
                alt="Autism support services"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mental Health Services */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mx-auto order-last lg:order-first">
              <ImageWithShadow
                src="/placeholder.svg?height=400&width=600"
                alt="Mental health services"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Mental Health Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Supporting Mental Health Providers
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Mental health service providers need secure, efficient systems to manage client records, track outcomes,
                and ensure compliance with strict privacy regulations.
              </p>
              <h3 className="text-xl font-bold text-primary dark:text-white">Common Challenges:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Ensuring the highest levels of data security and privacy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Managing complex scheduling and billing processes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Tracking treatment outcomes and progress</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  <span>Facilitating secure communication between providers and clients</span>
                </li>
              </ul>
              <h3 className="text-xl font-bold text-primary dark:text-white">Our Solutions:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We implement secure, compliant IT systems that streamline administrative processes, enhance clinical
                documentation, and provide robust data protection measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Cards */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Our Industry Expertise
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                We bring specialized knowledge and experience to each sector we serve.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-7 w-7 text-secondary" />
                  Intellectual Disability Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We understand the unique needs of organizations supporting individuals with intellectual disabilities
                  and provide tailored IT solutions to enhance care delivery.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-7 w-7 text-secondary" />
                  Autism Support Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Our solutions help autism support providers track progress, manage behavior plans, and coordinate
                  multidisciplinary care teams effectively.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-7 w-7 text-secondary" />
                  Mental Health Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We implement secure, compliant IT systems that streamline administrative processes and enhance
                  clinical documentation for mental health providers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your IT Infrastructure?
              </h2>
              <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact us today to discuss how FOCUS Care can help your organization leverage technology to improve
                care delivery.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/contact">
                <Button
                  variant="secondary"
                  className="w-full min-[400px]:w-auto bg-secondary text-primary hover:bg-secondary/90"
                >
                  Contact Us Today
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

