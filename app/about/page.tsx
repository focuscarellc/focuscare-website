import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageWithShadow from "@/components/image-with-shadow"

export const metadata = {
  title: "About Us - FOCUS Care",
  description:
    "Learn about FOCUS Care's mission, values, and team expertise in providing IT solutions for disability and mental health service providers.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Our Story
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                About FOCUS Care
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                We're dedicated to empowering disability and mental health service providers with technology solutions
                that enhance care delivery and operational efficiency.
              </p>
            </div>
            <div className="mx-auto lg:ml-auto">
              <ImageWithShadow
                src="/placeholder.svg?height=550&width=550"
                alt="FOCUS Care team members collaborating"
                width={550}
                height={550}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 order-last lg:order-first">
              <ImageWithShadow
                src="/placeholder.svg?height=400&width=600"
                alt="FOCUS Care mission visualization"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Empowering Care Through Technology
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                At FOCUS Care, our mission is to provide specialized IT solutions that enable disability and mental
                health service providers to focus on what matters most: delivering exceptional care to the individuals
                they support.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                We believe that technology should enhance human connection, not replace it. Our solutions are designed
                to streamline administrative processes, ensure compliance, and provide secure access to critical
                information, allowing care providers to spend more time with clients and less time managing technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Our Values
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                What Drives Us
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Our core values guide everything we do at FOCUS Care.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary" />
                  Empathy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We understand the unique challenges faced by disability and mental health service providers and design
                  solutions with their specific needs in mind.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary" />
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We are committed to delivering the highest quality IT solutions and support, ensuring our clients can
                  rely on their technology infrastructure.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary" />
                  Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We continuously explore new technologies and approaches to help our clients enhance their service
                  delivery and operational efficiency.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We prioritize the protection of sensitive client data and ensure all our solutions meet the highest
                  security standards.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We work closely with our clients to understand their unique needs and develop tailored solutions that
                  address their specific challenges.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-secondary" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We believe technology should be accessible to all and design our solutions with inclusivity in mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Our Team
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Meet Our Experts
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Our team brings together expertise in IT, healthcare, and disability services.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Team Member 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-slate-800">
              <div className="mb-4">
                <ImageWithShadow
                  src="/placeholder.svg?height=200&width=200"
                  alt="Jane Smith - Founder & CEO"
                  width={200}
                  height={200}
                  className="rounded-full object-cover mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-primary dark:text-white">Jane Smith</h3>
              <p className="text-secondary font-medium mb-4">Founder & CEO</p>
              <p className="text-gray-700 dark:text-gray-300">
                With over 15 years of experience in healthcare IT, Jane founded FOCUS Care to address the unique
                technology needs of disability service providers.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-slate-800">
              <div className="mb-4">
                <ImageWithShadow
                  src="/placeholder.svg?height=200&width=200"
                  alt="David Johnson - CTO"
                  width={200}
                  height={200}
                  className="rounded-full object-cover mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-primary dark:text-white">David Johnson</h3>
              <p className="text-secondary font-medium mb-4">Chief Technology Officer</p>
              <p className="text-gray-700 dark:text-gray-300">
                David brings extensive experience in developing secure, compliant IT systems for healthcare
                organizations.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center dark:bg-slate-800">
              <div className="mb-4">
                <ImageWithShadow
                  src="/placeholder.svg?height=200&width=200"
                  alt="Maria Rodriguez - Client Success Manager"
                  width={200}
                  height={200}
                  className="rounded-full object-cover mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-primary dark:text-white">Maria Rodriguez</h3>
              <p className="text-secondary font-medium mb-4">Client Success Manager</p>
              <p className="text-gray-700 dark:text-gray-300">
                With a background in disability services, Maria ensures our solutions truly meet the needs of the
                organizations we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Work With Us?</h2>
              <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact our team today to discuss how FOCUS Care can support your organization's IT needs.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/contact">
                <Button variant="secondary" className="w-full min-[400px]:w-auto">
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

