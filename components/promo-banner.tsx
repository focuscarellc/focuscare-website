'use client'

import Link from 'next/link'
import { X, Download } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const dismissed = localStorage.getItem('promo-banner-dismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('promo-banner-dismissed', 'true')
  }

  // Don't render on server to avoid hydration mismatch
  if (!isHydrated || !isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-brand-teal to-teal-600 text-white">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 text-sm md:text-base">
          <Download className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            <span className="hidden sm:inline">Free Download: </span>
            6400 Self-Inspection Checklist
          </span>
          <Link
            href="https://focuscarellc.gumroad.com/l/free-inspection-checklist"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 transition-colors"
          >
            Get it Free →
          </Link>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
