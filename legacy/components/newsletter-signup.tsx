"use client"

import { useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"

interface NewsletterSignupProps {
  variant?: "card" | "inline"
  heading?: string
  subheading?: string
}

export function NewsletterSignup({
  variant = "card",
  heading = "Subscribe to Our Newsletter",
  subheading = "Get the latest updates delivered to your inbox.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      // Newsletter signup API endpoint
      const res = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 text-green-600 bg-green-50 border border-green-200 rounded-xl p-6">
        <CheckCircle className="w-6 h-6 shrink-0" />
        <div>
          <p className="font-semibold">You&apos;re subscribed!</p>
          <p className="text-sm text-green-700">Check your inbox for a confirmation email.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={variant === "card" ? "bg-white rounded-xl border border-border p-8 shadow-sm" : ""}>
      {heading && <h3 className="text-xl font-semibold text-primary mb-2">{heading}</h3>}
      {subheading && <p className="text-muted-foreground text-sm mb-6">{subheading}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        No spam, ever. Unsubscribe at any time.
      </p>
    </div>
  )
}
