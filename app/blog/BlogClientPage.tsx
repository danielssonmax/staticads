"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const blogPosts = [
  {
    slug: "best-static-ad-templates-2025",
    title: "15 Best Static Ad Templates That Convert in 2025",
    description:
      "Discover the top-performing static ad templates that are driving conversions across multiple industries in 2025.",
    date: "June 10, 2023",
    category: "Templates",
    readTime: "8 min read",
  },
  {
    slug: "how-to-find-static-ad-templates",
    title: "How to Find High-Converting Static Ad Templates (Complete Guide)",
    description:
      "A step-by-step guide to finding and selecting the best static ad templates for your specific business needs.",
    date: "May 25, 2023",
    category: "Guides",
    readTime: "12 min read",
  },
  {
    slug: "static-vs-video-ads",
    title: "Static vs. Video Ads: When to Use Each Format for Maximum ROI",
    description:
      "An in-depth comparison of static and video ads, with data-backed insights on when each format delivers the best results.",
    date: "April 18, 2023",
    category: "Strategy",
    readTime: "10 min read",
  },
  {
    slug: "static-ad-templates-by-industry",
    title: "Static Ad Templates by Industry: Finding the Perfect Match",
    description: "Explore industry-specific static ad templates that address unique audience needs and pain points.",
    date: "March 30, 2023",
    category: "Templates",
    readTime: "9 min read",
  },
]

export default function BlogClientPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 min-h-screen">
      <header className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/images/staticads-logo.png"
              alt="staticads logo"
              width={180}
              height={60}
              className="h-[40px] w-auto"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/dashboard/ads-library">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await signOut()
                  } catch (error) {
                    console.error("Error signing out:", error)
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]" asChild>
                <Link href="/signup">Try for free</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Static Ad Templates{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert tips, guides, and best practices for creating high-converting static ads
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <div className="text-purple-500 font-semibold">Featured Image</div>
                </div>
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <Button variant="outline" className="text-purple-600 border-purple-600 bg-transparent" asChild>
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                    Read more <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
