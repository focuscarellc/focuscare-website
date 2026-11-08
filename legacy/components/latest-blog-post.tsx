import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getRecentPosts } from "@/lib/blog"

export default async function LatestBlogPost() {
  const posts = await getRecentPosts(3)

  if (!posts.length) return null

  const [featured, ...rest] = posts

  return (
    <section className="w-full py-12 md:py-24 bg-brand-bg/30 dark:bg-primary/20">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
            Latest from Our Blog
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
            Compliance Insights & Resources
          </h2>
        </div>

        <div className="mx-auto w-full max-w-6xl space-y-6">
          {/* Featured post — large */}
          <Link href={`/blog/${featured.slug}`} className="block w-full group">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1280px) 1152px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-secondary/20 dark:text-secondary">
                    {featured.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{featured.date}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primary dark:text-white leading-snug mb-3">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {featured.excerpt}
                  </p>
                )}
                <div className="flex items-center text-secondary text-sm font-medium">
                  Read Article
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Secondary posts — 2 column grid */}
          {rest.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block w-full group">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1280px) 552px, (min-width: 768px) calc((100vw - 72px) / 2), calc(100vw - 32px)"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-secondary/20 dark:text-secondary">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-primary dark:text-white leading-snug mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-secondary text-sm font-medium">
                        Read Article
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* View all */}
          <div className="text-center pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center text-secondary font-medium hover:underline text-sm"
            >
              View all articles
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
