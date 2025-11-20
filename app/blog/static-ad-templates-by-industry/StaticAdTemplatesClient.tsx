"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function StaticAdTemplatesClient() {
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
              <Button variant="ghost" asChild>
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
              <Button variant="ghost" asChild>
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
            <span>March 30, 2023</span>
            <span>•</span>
            <span>Templates</span>
            <span>•</span>
            <span>9 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Static Ad Templates by Industry: Finding the Perfect Match
          </h1>

          <div className="h-64 bg-purple-100 rounded-lg flex items-center justify-center mb-8">
            <div className="text-purple-500 font-semibold">Featured Image</div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              When it comes to digital advertising, one size definitely does not fit all. Different industries have
              unique audience expectations, pain points, and visual languages. Using industry-specific static ad
              templates can significantly improve your conversion rates by addressing these unique factors.
            </p>

            <p>
              In this comprehensive guide, we'll explore the most effective static ad templates for various industries,
              highlighting what makes them work and how to adapt them for maximum impact.
            </p>

            <h2>Why Industry-Specific Templates Matter</h2>

            <p>
              Before diving into specific industries, let's understand why specialized templates outperform generic
              ones:
            </p>

            <ul>
              <li>
                <strong>Audience expectations</strong> - Each industry has established visual conventions that audiences
                recognize and trust.
              </li>
              <li>
                <strong>Problem-solution alignment</strong> - Industry-specific templates can better highlight how your
                product solves industry-specific problems.
              </li>
              <li>
                <strong>Competitive differentiation</strong> - Standing out in your specific industry requires
                understanding the visual landscape of your competitors.
              </li>
              <li>
                <strong>Conversion optimization</strong> - Templates designed for your industry often incorporate
                conversion elements that have proven effective for similar products or services.
              </li>
            </ul>

            <h2>E-Commerce & Retail</h2>

            <p>
              The e-commerce sector relies heavily on visual appeal and creating desire for products. The most effective
              templates include:
            </p>

            <h3>Product Showcase Templates</h3>
            <p>These templates highlight product features with clean backgrounds and multiple angles.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>High-quality product photography</li>
              <li>Price prominently displayed</li>
              <li>Clear "Shop Now" or "Buy Now" CTAs</li>
              <li>Optional customer rating display</li>
            </ul>

            <h3>Limited-Time Offer Templates</h3>
            <p>These create urgency and drive immediate action.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Countdown timers or deadline indicators</li>
              <li>Discount percentages or amounts saved</li>
              <li>Before/after pricing</li>
              <li>Urgent CTAs like "Shop Before It's Gone"</li>
            </ul>

            <h3>Collection/Category Templates</h3>
            <p>These showcase multiple products from a collection or category.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Grid layout of multiple products</li>
              <li>Collection name or theme</li>
              <li>Seasonal or trend-based messaging</li>
              <li>"Explore Collection" CTAs</li>
            </ul>

            <h2>SaaS & Technology</h2>

            <p>Software and technology companies need to communicate complex value propositions quickly and clearly.</p>

            <h3>UI Showcase Templates</h3>
            <p>These templates highlight the software interface and user experience.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Clean screenshots of the platform/software</li>
              <li>Callouts highlighting key features</li>
              <li>Device mockups (desktop, mobile, tablet)</li>
              <li>"Try Free" or "Get Started" CTAs</li>
            </ul>

            <h3>Problem-Solution Templates</h3>
            <p>These templates illustrate the problem your software solves and how it improves workflows.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Before/after comparisons</li>
              <li>Process simplification visuals</li>
              <li>Time or resource savings highlighted</li>
              <li>"Solve Your [Problem]" CTAs</li>
            </ul>

            <h3>Feature Highlight Templates</h3>
            <p>These focus on specific features and their benefits.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Feature icon or visual</li>
              <li>Benefit-focused headline</li>
              <li>Brief explanation of how it works</li>
              <li>"Learn More" or "See in Action" CTAs</li>
            </ul>

            <h2>Health & Wellness</h2>

            <p>The health and wellness industry requires a balance of credibility, aspiration, and empathy.</p>

            <h3>Transformation Templates</h3>
            <p>These showcase results and improvements.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Before/after imagery</li>
              <li>Testimonial quotes</li>
              <li>Time frame indicators</li>
              <li>"Start Your Journey" CTAs</li>
            </ul>

            <h3>Expert Endorsement Templates</h3>
            <p>These build credibility through professional recommendations.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Professional photos of experts</li>
              <li>Credentials clearly displayed</li>
              <li>Quote or endorsement</li>
              <li>"Discover Why Experts Choose" CTAs</li>
            </ul>

            <h3>Ingredient/Component Highlight Templates</h3>
            <p>These focus on what makes the product effective.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Visual breakdown of key ingredients</li>
              <li>Benefits of each component</li>
              <li>Natural/clean/scientific messaging as appropriate</li>
              <li>"See What's Inside" CTAs</li>
            </ul>

            <h2>Finance & Insurance</h2>

            <p>Financial services require templates that convey trust, security, and clear value.</p>

            <h3>Calculator/Savings Templates</h3>
            <p>These illustrate potential savings or growth.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Visual graphs or charts</li>
              <li>Dollar amounts or percentages</li>
              <li>Comparison to competitors</li>
              <li>"Calculate Your Savings" CTAs</li>
            </ul>

            <h3>Security/Trust Templates</h3>
            <p>These emphasize safety and reliability.</p>
            <p>
              <strong>Key elements:</strong>
            </p>
            <ul>
              <li>Security icons or symbols</li>
              <li>Trust badges and certifications</li>
              <li>Years in business or customer count</li>
              <li>"Secure Your Future" CTAs</li>
            </ul>

            <h2>Adapting Templates to Your Specific Needs</h2>

            <p>Even industry-specific templates require customization:</p>

            <ol>
              <li>
                <strong>Incorporate your unique value proposition</strong> - What makes your offering different from
                competitors in your industry?
              </li>
              <li>
                <strong>Align with your brand guidelines</strong> - Maintain consistent colors, fonts, and tone of
                voice.
              </li>
              <li>
                <strong>Consider your specific audience segment</strong> - Different demographics within your industry
                may respond to different visual styles.
              </li>
              <li>
                <strong>Test variations</strong> - Create multiple versions to identify what resonates best with your
                audience.
              </li>
            </ol>

            <h2>Conclusion</h2>

            <p>
              Selecting the right industry-specific template is a crucial first step in creating high-converting static
              ads. By understanding the unique requirements and expectations of your industry, you can create ads that
              speak directly to your audience's needs and pain points.
            </p>

            <p>
              Remember that the most effective templates balance industry best practices with your brand's unique
              identity. Don't be afraid to innovate within the established conventions of your industry to stand out
              from competitors.
            </p>

            <p>
              Ready to explore industry-specific templates for your business?{" "}
              <Link href="/" className="text-purple-600 hover:underline">
                Browse our collection
              </Link>{" "}
              of over 1900 templates categorized by industry, use case, and format.
            </p>
          </div>
        </article>
      </main>
    </div>
  )
}
