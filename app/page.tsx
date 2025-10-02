import Link from "next/link"
import { ArrowRight, Calendar, Settings, Headset, ShieldCheck, BarChart3, Shield, Users, Server, DollarSignIcon, BadgeDollarSignIcon, AwardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TestimonialCard from "@/components/testimonial-card"
import ImageWithShadow from "@/components/image-with-shadow"
import FilloutConsultation from "./contact/fillout-consultation"

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
              Simplifying systems so you can focus on the care that matters most.
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
              Focus Care helps healthcare and human service providers streamline compliance, technology, and workflows — saving time, money, and ensuring quality care.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                
                  <Button className="w-full min-[400px]:w-auto">
                  <FilloutConsultation/>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                
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
                Services Tailored to Your Needs
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
                    <a href="/services/digital-transformation" className="hover:underline">
                      Digital Transformation
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                  We help you modernize your systems, streamline workflows, and improve efficiency — so you can focus on what matters most.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5 text-secondary" />
                    <a href="/services/managed-it-services" className="hover:underline">
                      Accounting & HR Management 
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    With custom solutions tailored to your unique needs, we help you streamline your accounting and HR processes.
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
                  ODP & HIPAA-aligned compliance support, risk assessments, incident management, and audit-ready documentation workflows.
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
                Why Choose Focus Care?  
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Rest assured, we've got you covered.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-4 h-8 w-8 text-secondary mt-0.5" />
                  Specialized Knowledge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  With regulatory stipulations changing frequently, we stay ahead of the curve to keep you compliant and secure.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgeDollarSignIcon className="mr-4 h-8 w-8 text-secondary mt-0.5" />
                  Saving You Time and Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Our custom payroll and billing solutions are focused on ensuring you receive every penny you deserve.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AwardIcon className="mr-4 h-8 w-8 text-secondary mt-0.5" />
                  Deep Industry Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  We understand the nature of this field, with over 15 years of expertise in the industry.
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
              quote="I always receive more than expected with Focus Care. I will absolutely recommend them to anyone looking for a professional experience."
              author="Al Iqama LLC"
              role="Founder & CEO"
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

