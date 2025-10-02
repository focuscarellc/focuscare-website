import Link from "next/link"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
// import ContactForm from "./contact-form"
// import { FilloutStandardEmbed } from "@fillout/react";
import FilloutForm from "./fillout-form";
import FilloutConsultation from "./fillout-consultation";

export const metadata = {
  title: "Contact Us - FOCUS Care",
  description: "Get in touch with FOCUS Care to discuss your organization's needs and how we can help.",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Get In Touch
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                Contact Us
              </h1>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                We're here to help. Reach out to discuss how FOCUS Care can support your organization's IT needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container px-4 md:px-6 ">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 ">
            {/* Contact Form - client component wrapper */}
            <FilloutForm />

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-md dark:bg-slate-800">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-secondary/30">
                      <Phone className="h-5 w-5 text-primary dark:text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary dark:text-white">Phone</h3>
                      <p className="text-gray-700 dark:text-gray-300">+1 (202) 455-0325</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-secondary/30">
                      <Mail className="h-5 w-5 text-primary dark:text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary dark:text-white">Email</h3>
                      <p className="text-gray-700 dark:text-gray-300">info@focuscarellc.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-secondary/30">
                      <MapPin className="h-5 w-5 text-primary dark:text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary dark:text-white">Address</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                      239 4th Ave Suite 1401 
                        <br />
                        Unit #7549
                        <br />
                        Pittsburgh, PA 15222
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md dark:bg-slate-800">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Office Hours</h2>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-3">
                    <span className="font-medium text-primary dark:text-white">Monday - Friday</span>
                    <span className="text-gray-700 dark:text-gray-300">6:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="font-medium text-primary dark:text-white">Saturday</span>
                    <span className="text-gray-700 dark:text-gray-300">6:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-primary dark:text-white">Sunday</span>
                    <span className="text-gray-700 dark:text-gray-300">6:00 AM - 2:00 PM</span>
                  </div>
                </div>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  24/7 technical support available for clients with managed service agreements.
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md dark:bg-slate-800">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Schedule a Consultation</h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Interested in learning more about our services? Schedule a free 30-minute consultation with one of our
                  experts.
                </p>
                
                <FilloutConsultation />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-brand-bg/50 dark:bg-primary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Find answers to common questions about our services.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 py-12">
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-slate-800">
              <h3 className="text-xl font-bold mb-3 text-primary dark:text-white">What industries do you serve?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We specialize in providing IT solutions for organizations that support individuals with intellectual
                disabilities, autism, and mental health needs. This includes disability service providers, autism
                support organizations, and mental health clinics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-slate-800">
              <h3 className="text-xl font-bold mb-3 text-primary dark:text-white">Do you offer ongoing support?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, we offer comprehensive managed IT services that include ongoing support, monitoring, and
                maintenance. We also provide staff training and regular system updates to ensure your technology
                continues to meet your needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-slate-800">
              <h3 className="text-xl font-bold mb-3 text-primary dark:text-white">
                How do you ensure data security and compliance?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We implement robust security measures and follow industry best practices to protect sensitive client
                data. Our solutions are designed to comply with relevant regulations, including HIPAA and other privacy
                laws. We conduct regular security assessments and updates to address emerging threats.
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact us today to discuss how FOCUS Care can help your organization leverage technology to improve
                care delivery.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <button className="bg-primary rounded-lg p-2.5 font-semibold text-white w-full"></button>
              <FilloutConsultation/>
              <button/>
            
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

