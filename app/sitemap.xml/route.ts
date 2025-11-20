import { NextResponse } from "next/server"
import { getCanonicalUrl, getCurrentDomain } from "@/lib/url-utils"
import { headers } from "next/headers"

export async function GET(): Promise<NextResponse> {
  const headersList = await headers()
  const currentDomain = getCurrentDomain(headersList)

  // Define the sitemap entries
  const sitemapEntries = [
    {
      url: currentDomain,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: getCanonicalUrl("blog", currentDomain),
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("partners", currentDomain),
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("blog/best-static-ad-templates-2025", currentDomain),
      lastModified: new Date("2023-06-10").toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("blog/how-to-find-static-ad-templates", currentDomain),
      lastModified: new Date("2023-05-25").toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("blog/static-vs-video-ads", currentDomain),
      lastModified: new Date("2023-04-18").toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("blog/static-ad-templates-by-industry", currentDomain),
      lastModified: new Date("2023-03-30").toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("dashboard/ads-library", currentDomain),
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: getCanonicalUrl("library", currentDomain),
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // Generate XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  return new NextResponse(xmlContent, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
