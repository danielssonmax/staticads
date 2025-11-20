"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function ClientPage() {
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
              className="h-10 w-auto"
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

      <main className="max-w-3xl mx-auto px-4 py-12">
        <Button variant="outline" className="mb-8 bg-transparent" asChild>
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </Button>

        <article className="bg-white rounded-xl border shadow-sm p-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>June 10, 2023</span>
            <span>•</span>
            <span>Templates</span>
            <span>•</span>
            <span>8 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">15 Best Static Ad Templates That Convert in 2025</h1>

          <div className="h-64 bg-purple-100 rounded-lg flex items-center justify-center mb-8">
            <div className="text-purple-500 font-semibold">Featured Image</div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              In the fast-paced world of digital advertising, static ads continue to be a powerful tool for marketers
              looking to drive conversions. Despite the rise of video content, well-designed static ads can capture
              attention, communicate value, and prompt action—often at a fraction of the cost of video production.
            </p>

            <p>
              In this article, we'll explore the 15 best static ad templates that are driving exceptional results in
              2025. These templates have been selected based on conversion data, design principles, and versatility
              across industries.
            </p>

            <h2>Why Static Ads Still Matter in 2025</h2>

            <p>
              Before diving into the templates, let's address why static ads remain relevant in today's digital
              landscape:
            </p>

            <ul>
              <li>
                <strong>Faster loading times</strong> - Static ads load instantly, reducing bounce rates and improving
                user experience.
              </li>
              <li>
                <strong>Lower production costs</strong> - Creating static ads requires fewer resources than video
                production.
              </li>
              <li>
                <strong>Easier A/B testing</strong> - You can quickly test different versions of static ads to optimize
                performance.
              </li>
              <li>
                <strong>Effective in low-bandwidth environments</strong> - Static ads perform well even when users have
                poor internet connections.
              </li>
              <li>
                <strong>Immediate message delivery</strong> - Your key message is visible immediately, without requiring
                the user to watch a video.
              </li>
            </ul>

            <h2>Top 15 Static Ad Templates for 2025</h2>

            <h3>1. Before & After Transformation</h3>
            <p>
              The before and after template remains one of the most powerful formats for products that deliver visible
              results. This template works exceptionally well for:
            </p>
            <ul>
              <li>Skincare products</li>
              <li>Fitness programs</li>
              <li>Home renovation services</li>
              <li>Cleaning products</li>
              <li>Hair care solutions</li>
            </ul>
            <p>
              <strong>Key design elements:</strong> Clear side-by-side comparison, minimal text, strong visual contrast
              between "before" and "after" states.
            </p>

            <h3>2. Problem-Solution Framework</h3>
            <p>
              This template highlights a common pain point and presents your product as the solution. It's particularly
              effective for:
            </p>
            <ul>
              <li>SaaS products</li>
              <li>Household gadgets</li>
              <li>Health supplements</li>
              <li>Financial services</li>
              <li>Productivity tools</li>
            </ul>
            <p>
              <strong>Key design elements:</strong> Visual representation of the problem, clear solution presentation,
              concise copy that emphasizes benefits.
            </p>

            <h3>3. Social Proof Showcase</h3>
            <p>
              Leveraging testimonials and reviews in your static ads builds trust and credibility. This template works
              well for:
            </p>
            <ul>
              <li>E-commerce products</li>
              <li>Subscription services</li>
              <li>High-consideration purchases</li>
              <li>New brands building credibility</li>
              <li>Service-based businesses</li>
            </ul>
            <p>
              <strong>Key design elements:</strong> Real customer photos, direct quotes, star ratings, verification
              indicators, clean layout that makes testimonials easy to read.
            </p>

            <p>
              The remaining templates in our top 15 list include Feature Highlight, Limited-Time Offer, Data
              Visualization, User-Generated Content, Minimalist Product Showcase, Comparison Chart, Emotional Appeal,
              How-It-Works, Seasonal Theme, Quiz/Interactive Prompt, and Industry-Specific templates.
            </p>

            <h2>How to Choose the Right Template for Your Campaign</h2>

            <p>When selecting a static ad template, consider these factors:</p>

            <ol>
              <li>
                <strong>Campaign objective</strong> - Different templates work better for awareness vs. conversion
                goals.
              </li>
              <li>
                <strong>Target audience</strong> - Consider demographic preferences and pain points.
              </li>
              <li>
                <strong>Platform specifications</strong> - Ensure your template works well on your chosen advertising
                platforms.
              </li>
              <li>
                <strong>Brand consistency</strong> - The template should align with your overall brand identity.
              </li>
              <li>
                <strong>Testing capacity</strong> - Consider how easily you can test variations of the template.
              </li>
            </ol>

            <h2>Conclusion</h2>

            <p>
              The most effective static ad templates in 2023 combine clear value propositions, strong visuals, and
              strategic calls to action. By selecting the right template for your specific product and audience, you can
              create static ads that capture attention and drive conversions in an increasingly competitive digital
              landscape.
            </p>

            <p>
              Remember that even the best templates require customization to truly shine. Use these templates as
              starting points, then adapt them to reflect your unique brand voice and value proposition.
            </p>

            <p>
              Ready to implement these high-converting templates in your campaigns?{" "}
              <Link href="/" className="text-purple-600 hover:underline">
                Explore our complete library
              </Link>{" "}
              of customizable static ad templates designed for maximum conversion.
            </p>
          </div>
        </article>
      </main>
    </div>
  )
}
