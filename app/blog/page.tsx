import Link from "next/link"
import ImageWithShadow from "@/components/image-with-shadow"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllPosts, BlogPost } from "@/lib/blog"

export const metadata = {
  title: "Blog & Resources - FOCUS Care",
  description:
    "Informative content about IT best practices, compliance, security, and tech advancements for healthcare providers.",
}

function ArticleCard({ post, showFooter = true }: { post: BlogPost; showFooter?: boolean }) {
  return (
    <Card className="bg-white dark:bg-slate-800 overflow-hidden">
      <CardHeader className="p-0">
        <ImageWithShadow
          src={post.image}
          alt={post.title}
          width={400}
          height={200}
          className="aspect-video w-full rounded-t-lg object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-2 inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
          {post.category}
        </div>
        <CardTitle className="mb-2 text-xl text-primary dark:text-white">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>{post.excerpt}</CardDescription>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">{post.date}</div>
      </CardContent>
      {showFooter && (
        <CardFooter className="px-6 pb-6 pt-0">
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm text-primary font-medium hover:underline"
          >
            Read More <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

export default async function BlogPage() {
  const allPosts = await getAllPosts()
  
  // Featured = top 3 most recent
  const featuredPosts = allPosts.slice(0, 3)
  // Recent = remaining posts
  const recentPosts = allPosts.slice(3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-gradient-light dark:bg-gradient-dark">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-primary dark:text-secondary">
                Knowledge Center
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary dark:text-white">
                Blog & Resources
              </h1>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Stay informed with the latest insights, best practices, and industry updates for disability and mental
                health service providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Featured Articles
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Our most popular and informative content for care providers.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentPosts.length > 0 && (
        <section className="w-full py-8 md:py-12 lg:py-16 bg-brand-bg/50 dark:bg-primary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                  Recent Articles
                </h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                  Stay up-to-date with our latest insights and industry news.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} showFooter={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary dark:text-white">
                Resources
              </h2>
              <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                Helpful guides, whitepapers, and tools for disability and mental health service providers.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Resource 1 */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary dark:bg-secondary/30 dark:text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>
                <CardTitle className="mb-2 text-xl text-primary dark:text-white">IT Security Checklist</CardTitle>
                <CardDescription>
                  A comprehensive checklist to help you assess and improve your organization's IT security posture.
                </CardDescription>
                <div className="mt-4">
                  <Link
                    href="/resources/security-checklist"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Download PDF <ArrowRight className="ml-1 inline h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Resource 2 */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary dark:bg-secondary/30 dark:text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <CardTitle className="mb-2 text-xl text-primary dark:text-white">Technology Selection Guide</CardTitle>
                <CardDescription>
                  A guide to help you select the right technology solutions for your organization's specific needs.
                </CardDescription>
                <div className="mt-4">
                  <Link href="/resources/technology-guide" className="text-sm text-primary font-medium hover:underline">
                    Download PDF <ArrowRight className="ml-1 inline h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Resource 3 */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-primary dark:bg-secondary/30 dark:text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <CardTitle className="mb-2 text-xl text-primary dark:text-white">Staff Training Toolkit</CardTitle>
                <CardDescription>
                  Resources to help you train your staff on using technology effectively in care delivery.
                </CardDescription>
                <div className="mt-4">
                  <Link href="/resources/training-toolkit" className="text-sm text-primary font-medium hover:underline">
                    Access Toolkit <ArrowRight className="ml-1 inline h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Stay Informed</h2>
              <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe to our newsletter to receive the latest insights, resources, and industry updates.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:border-secondary dark:focus:ring-secondary"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full sm:w-auto bg-secondary text-primary hover:bg-secondary/90"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-secondary">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
