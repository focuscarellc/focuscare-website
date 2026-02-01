import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AccessibilityTools from "@/components/accessibility-tools"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "FOCUS Care - IT Solutions for Disability & Mental Health Providers",
  description:
    "Specialized IT consultancy and managed services for providers supporting individuals with intellectual disabilities, autism, and mental health needs.",
  keywords:
    "IT consultancy for healthcare providers, managed IT services for disability support, healthcare IT solutions, mental health IT services",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <AccessibilityTools />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}