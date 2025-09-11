import Link from "next/link"
import { ArrowRight, Calendar, Settings, Headset, ShieldCheck, BarChart3, Shield, Users, Server } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TestimonialCard from "@/components/testimonial-card"
import ImageWithShadow from "@/components/image-with-shadow"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Specialized IT Solutions
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-primary dark:text-white">
                IT Solutions for Disability & Mental Health Providers
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                FOCUS Care provides tailored IT consultancy and managed services for organizations supporting
                individuals with intellectual disabilities, autism, and mental health needs.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/contact">
                  <Button className="w-full min-[400px]:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="secondary" className="w-full min-[400px]:w-auto">
                    Explore Our Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <ImageWithShadow
                src="/images/hero/care-illustration.png"
                alt="Caring professionals working together"
                width={550}
                height={550}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Our Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary dark:text-white">
                Specialized IT Solutions
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                We understand the unique challenges faced by providers in the disability and mental health sectors.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-secondary" />
                    IT Consultancy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Strategic IT planning and implementation tailored to the specific needs of disability and mental
                    health service providers.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5 text-secondary" />
                    Managed IT Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive IT management, monitoring, and support to ensure your systems run smoothly and
                    securely.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-secondary" />
                    Compliance & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Ensuring your IT infrastructure meets all regulatory requirements while protecting sensitive client
                    data.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-secondary" />
                    Staff Training & Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Empowering your team with the knowledge and skills to effectively use technology in care delivery.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex justify-center">
            <Link href="/services">
              <Button variant="secondary" className="w-full min-[400px]:w-auto">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                Why Choose FOCUS Care
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                We bring specialized expertise to support organizations that make a difference.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  Specialized Knowledge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Deep understanding of the unique IT challenges faced by disability and mental health service
                  providers.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  Compliance Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Ensuring your systems meet all regulatory requirements while maintaining the highest security
                  standards.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headset className="mr-2 h-6 w-6 text-secondary mt-0.5" />
                  Dedicated Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Responsive, understanding support team that appreciates the critical nature of your services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Client Success
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                What Our Clients Say
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Hear from organizations we've helped transform their IT infrastructure.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
            <TestimonialCard
              quote="FOCUS Care transformed our IT systems, allowing our staff to focus more on client care and less on technology issues."
              author="Disability Service Provider"
              role=""
            />
            <TestimonialCard
              quote="Their understanding of the unique challenges we face as mental health providers made all the difference. Highly recommended."
              author="Mental Health Organization"
              role=""
            />
          </div>
          <div className="flex justify-center">
            <Link href="/testimonials">
              <Button variant="secondary" className="w-full min-[400px]:w-auto">
                Read More Testimonials
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your IT Infrastructure?
              </h2>
              <p className="max-w-[600px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact us today to discuss how FOCUS Care can help your organization leverage technology to improve
                care delivery.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/contact">
                  <Button variant="secondary" className="w-full min-[400px]:w-auto">
                    Contact Us Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <ul className="grid gap-3">
                <li className="flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-secondary" />
                  <span>Free initial consultation</span>
                </li>
                <li className="flex items-center">
                  <Settings className="mr-2 h-6 w-6 text-secondary" />
                  <span>Tailored solutions for your specific needs</span>
                </li>
                <li className="flex items-center">
                  <Headset className="mr-2 h-6 w-6 text-secondary" />
                  <span>Ongoing support and training</span>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="mr-2 h-6 w-6 text-secondary" />
                  <span>Compliance and security expertise</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

