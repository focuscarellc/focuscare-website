import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AccessibilityTools from "@/components/accessibility-tools"
import GoogleAnalytics from "@/components/google-analytics"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const siteUrl = "https://focuscarellc.com"
const siteTitle = "FOCUS Care - IT Solutions for Disability & Mental Health Providers"
const siteDescription =
  "Specialized IT consultancy and managed services for providers supporting individuals with intellectual disabilities, autism, and mental health needs."
const ogImage = `${siteUrl}/images/fc-logo.png`

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords:
    "IT consultancy for healthcare providers, managed IT services for disability support, healthcare IT solutions, mental health IT services",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "FOCUS Care",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "FOCUS Care - IT Solutions for Disability & Mental Health Providers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <GoogleAnalytics />
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