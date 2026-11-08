'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import posthog from 'posthog-js'

function PostHogPageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthog.capture('$pageview', { '$current_url': url })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageViewTracker />
    </Suspense>
  )
}
