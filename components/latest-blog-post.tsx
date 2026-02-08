import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getLatestPost } from "@/lib/blog"

export default async function LatestBlogPost() {
  const post = await getLatestPost()
  
  if (!post) return null
  
  return (
    <section className="w-full py-12 md:py-24 bg-brand-bg/30 dark:bg-primary/20">
      <div className="container px-4 md:px-6">
        {/* Header - matches "Our Services" styling */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
              Latest from Our Blog
            </div>
          </div>
        </div>
        
        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <Link href={`/blog/${post.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-row items-center">
                {/* Image - Square aspect ratio */}
                <div className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-secondary/20 dark:text-secondary">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                  </div>
                  
                  <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-primary dark:text-white leading-snug mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center text-secondary text-sm font-medium">
                    Read Article
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  )
}
