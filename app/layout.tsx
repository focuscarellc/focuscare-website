import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { PromoBanner } from "@/components/promo-banner"
import Footer from "@/components/footer"
import AccessibilityTools from "@/components/accessibility-tools"
import GoogleAnalytics from "@/components/google-analytics"
import { PostHogProvider } from "@/components/posthog-provider"
import { PostHogPageView } from "@/components/posthog-pageview"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const siteUrl = "https://focuscarellc.com"
const siteTitle = "FOCUS Care - IT Solutions for Disability & Mental Health Providers"
const siteDescription =
  "Specialized IT consultancy and managed services for providers supporting individuals with intellectual disabilities, autism, and mental health needs."
const ogImage = `${siteUrl}/og-image.png`

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords:
    "IT consultancy for healthcare providers, managed IT services for disability support, healthcare IT solutions, mental health IT services",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
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
    images: [`${siteUrl}/twitter-image.png`],
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
        <PostHogProvider>
          <GoogleAnalytics />
          <PostHogPageView />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <PromoBanner />
            <Header />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <AccessibilityTools />
            <Footer />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}