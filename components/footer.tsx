import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"
import { XIcon } from "./x-icon"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background" role="contentinfo">
      <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/fc-logo.png"
                alt="FOCUS Care Logo"
                width={170}
                height={85}
                className="w-auto h-[85px]"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Specialized IT solutions for disability and mental health service providers.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/focuscarellc"
                className="text-muted-foreground hover:text-secondary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="https://www.instagram.com/focuscarellc"
                className="text-muted-foreground hover:text-secondary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/focuscarellc"
                className="text-muted-foreground hover:text-secondary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="mailto:info@focuscarellc.com"
                className="text-muted-foreground hover:text-secondary"
                aria-label="Email us"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="https://x.com/focuscarellc"
                className="text-muted-foreground hover:text-secondary"
                aria-label="X (formerly Twitter)"
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary dark:text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-secondary">
                  IT Consultancy
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-secondary">
                  Managed IT Services
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-secondary">
                  Compliance & Security
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-secondary">
                  Staff Training & Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary dark:text-white">Industries</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/industries" className="text-muted-foreground hover:text-secondary">
                  Intellectual Disability Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-muted-foreground hover:text-secondary">
                  Autism Support Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-muted-foreground hover:text-secondary">
                  Mental Health Services
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary dark:text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-secondary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-muted-foreground hover:text-secondary">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-secondary">
                  Blog & Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-secondary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FOCUS Care LLC. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-secondary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-secondary">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-secondary">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

