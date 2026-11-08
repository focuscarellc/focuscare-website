import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export default function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <QuoteIcon className="h-8 w-8 text-secondary mb-4" aria-hidden="true" />
        <blockquote>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{quote}</p>
          <footer>
            <cite className="font-semibold text-primary dark:text-white">{author}</cite>
            {role && <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>}
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  )
}

