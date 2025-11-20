import { NextResponse } from "next/server"
import { getCurrentDomain } from "@/lib/url-utils"
import { headers } from "next/headers"

export async function GET(): Promise<NextResponse> {
  const headersList = await headers()
  const currentDomain = getCurrentDomain(headersList)

  // Create robots.txt content as a string
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

# Sitemap for current domain
Sitemap: ${currentDomain}/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
