import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialCard from "@/components/testimonial-card"

export const metadata = {
  title: "Testimonials - Focus Care",
  description:
    "Read what our clients say about Focus Care's IT solutions for disability and mental health service providers.",
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
              quote="The team delivered a custom software solution that took us from 90% paperwork to dust collecting on our filing cabinets. This was essential for the growth of the company. I will absolutely recommend them to any provider in our shoes."
              author="Community Thriving LLC"
              role=""
            />
            <TestimonialCard
              quote="I always receive more than expected with Focus Care. I will absolutely recommend them to anyone looking for a professional experience."
              author="Al Iqama LLC"
              role=""
            />
            <TestimonialCard
              quote="We've been loyal to Jovanie and his agency since the beginning. Best investment I could've made for our organization."
              author="The L.I.F.E. Group, LLC"
              role=""
            />
            <TestimonialCard
              quote="Highly recommend, easy to work with. Looking forward to more business together."
              author="The Salvation Army"
              role=""
            />
            <TestimonialCard
              quote="Focus Care allowed our team to step away from outdated documentation templates we've been using for over a decade."
              author="Behavior Supports S&T"
              role=""
            />
            <TestimonialCard
              quote="Jovanie and his team got us up and running with Therap's eMAR module in under 3 days. Staff training was seamless once setup."
              author="K.E.L.S LLC"
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
                How Focus Care helped a disability service provider improve their service delivery and operational
                efficiency.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl py-12">
            <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800">
              <h3 className="mb-4 text-2xl font-bold text-primary dark:text-white">Our Client</h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                An ODP waiver provider in Pennsylvania, Our Client offers Community Participation Support (CPS),
                In-Home & Community Supports (IHCS), and Community Living services to 40 individuals across Montgomery,
                Delaware, and Philadelphia Counties. Operating within the ODP 6100 and EVV regulatory framework,
                they initially faced manual operations, scattered records, and high compliance risk.
              </p>
              <h4 className="mb-2 text-xl font-bold text-primary dark:text-white">The Challenge</h4>
              <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li><b>No organized system</b> for progress notes, staff files, or service documentation.</li>
                <li><b>Manual tracking</b> of service codes and retro billing information.</li>
                <li><b>Unstructured and inconsistent</b> progress notes and staff data.</li>
                <li><b>EVV-required services</b> not connected to <b>Sandata</b>.</li>
                <li><b>Underutilized AxisCare</b> with incomplete individual/service setups.</li>
                <li><b>Billing issues</b> leading to delays and <b>denials</b>.</li>
                <li><b>Lack of Google Workspace</b> and structured <b>digital infrastructure</b>.</li>
              </ul>
              <h4 className="mb-2 text-xl font-bold text-primary dark:text-white">The Solution</h4>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Focus Care implemented a comprehensive IT solution tailored to Our Client's needs:
              </p>
              <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li><b>Billing Issue Resolution:</b> Identified and corrected inconsistencies, fixed prior errors, and implemented a structured billing workflow tied to AxisCare + Sandata.</li>
                <li><b>AxisCare System Overhaul:</b> Entered all individuals, service codes, staff data, and previous shifts; standardized progress note and service entry workflows.</li>
                <li><b>Google Workspace Implementation:</b> Created a full digital business suite, centralizing all documentation and developing structured Drive folders.</li>
                <li><b>EVV Integration (Sandata Aggregator):</b> Connected all EVV-required services, automated verification for IHCS, and removed manual time validation.</li>
              </ul>
              <h4 className="mb-2 text-xl font-bold text-primary dark:text-white">The Results</h4>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Since implementing Focus Care's solutions, Our Client achieved:
              </p>
              <ul className="mb-6 list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li><b>Historic billing issues fully resolved:</b> Accurate, EVV-compliant billing established.</li>
                <li><b>Significant reduction in manual effort:</b> Documentation consistency improved across all service lines.</li>
                <li><b>Enhanced compliance and audit readiness:</b> Digital organization now fully supports regulatory requirements.</li>
                <li><b>Increased operational efficiency:</b> Streamlined workflows leading to better staff productivity and focus on client care.</li>
                <li><b>Positioned for stable growth:</b> Modernized infrastructure provides a solid foundation for future expansion.</li>
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
                Contact us today to discuss how Focus Care can help your organization leverage technology to improve
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

