import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialCard from "@/components/testimonial-card"

export const metadata = {
  title: "Testimonials - FOCUS Care",
  description:
    "Read what our clients say about FOCUS Care's IT solutions for disability and mental health service providers.",
}

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Client Success
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                What Our Clients Say
              </h1>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Hear from organizations we've helped transform their IT infrastructure and improve their service
                delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <TestimonialCard
              quote="FOCUS Care transformed our IT systems, allowing our staff to focus more on client care and less on technology issues. Their understanding of our unique needs as a disability service provider made all the difference."
              author="Disability Service Provider"
              role=""
            />
            <TestimonialCard
              quote="Their understanding of the unique challenges we face as mental health providers made all the difference. Highly recommended for any organization in the healthcare sector."
              author="Mental Health Organization"
              role=""
            />
            <TestimonialCard
              quote="The team at FOCUS Care helped us implement a secure, compliant system that has streamlined our operations and improved our service delivery. Their ongoing support has been invaluable."
              author="Autism Support Organization"
              role=""
            />
            <TestimonialCard
              quote="We were struggling with outdated systems that couldn't keep up with our growing organization. FOCUS Care provided a tailored solution that has transformed how we operate."
              author="Community Mental Health Center"
              role=""
            />
            <TestimonialCard
              quote="The security and compliance expertise that FOCUS Care brings to the table is exceptional. They understand the regulatory landscape and ensure our systems meet all requirements."
              author="Integrated Care Service"
              role=""
            />
            <TestimonialCard
              quote="Our staff training sessions with FOCUS Care were excellent. They made complex technology accessible to our team, improving adoption and efficiency across the organization."
              author="Supportive Living Network"
              role=""
            />
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Featured Case Study
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Transforming Care Delivery
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                How FOCUS Care helped a disability service provider improve their service delivery and operational
                efficiency.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl py-12">
            <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800">
              <h3 className="mb-4 text-2xl font-bold text-primary dark:text-white">Disability Service Provider</h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                A leading provider of support services for individuals with intellectual disabilities, serving over 200
                clients across multiple locations.
              </p>
              <h4 className="mb-2 text-xl font-bold text-primary dark:text-white">The Challenge</h4>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                The organization was struggling with outdated systems that couldn't keep up with their growing needs.
                Staff were spending too much time on administrative tasks, and there were concerns about data security
                and compliance.
              </p>
              <h4 className="mb-2 text-xl font-bold text-primary dark:text-white">The Solution</h4>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                FOCUS Care implemented a comprehensive IT solution that included:
              </p>
              <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li>A secure, cloud-based client management system</li>
                <li>Integrated scheduling and billing processes</li>
                <li>Mobile access for staff working in the field</li>
                <li>Comprehensive staff training and ongoing support</li>
              </ul>
              <h4 className="mb-2 text-xl font-bold text-primary dark:text-white">The Results</h4>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Since implementing the new system, the organization has seen:
              </p>
              <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li>30% reduction in administrative time</li>
                <li>Improved data accuracy and reporting capabilities</li>
                <li>Enhanced compliance with regulatory requirements</li>
                <li>Increased staff satisfaction and retention</li>
              </ul>
              <div className="mt-8 text-right">
                <Link href="/contact">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Read Full Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Join Our Success Stories?
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

