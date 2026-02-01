import Link from "next/link"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg space-y-6">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[10rem] font-bold leading-none text-primary/10 dark:text-white/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-secondary animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-primary dark:text-white">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We couldn&apos;t find the page you&apos;re looking for. It may have been moved, removed, or the URL might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="secondary" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Our Services
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <p className="text-sm text-gray-500 dark:text-gray-500 pt-4">
          Need help? <Link href="/contact" className="text-primary dark:text-secondary hover:underline font-medium">Contact us</Link> and we&apos;ll point you in the right direction.
        </p>
      </div>
    </div>
  )
}
