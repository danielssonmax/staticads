import { type NextRequest, NextResponse } from "next/server"
import { getAdTemplates } from "@/lib/supabase/ads"

/**
 * GET /api/ads
 * 
 * Fetch ads from Supabase (cached from cron job)
 * 
 * Query params:
 * - industry: string (filter by industry)
 * - type: string (filter by type)
 * - ratio: string (filter by ratio)
 * - page: number (page number, default: 1)
 * - pageSize: number (items per page, default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters
    const industry = searchParams.get("industry")
    const type = searchParams.get("type")
    const ratio = searchParams.get("ratio")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10)

    // Build filters
    const filters = {
      industry: industry ? [industry] : undefined,
      type: type ? [type] : undefined,
      ratio: ratio ? [ratio] : undefined,
      page,
      pageSize,
    }

    console.log("📊 Fetching ads from Supabase with filters:", filters)

    const result = await getAdTemplates(filters)

    console.log(`✅ Found ${result.ads.length} ads (total: ${result.total})`)

    // Transform Supabase format to match existing API response format
    const transformedAds = result.ads.map((ad) => ({
      id: ad.id,
      title: ad.title,
      name: ad.title, // alias
      description: ad.description,
      url: ad.image_url,
      visual: {
        url: ad.image_url,
      },
      image: ad.image_url,
      thumbnail: ad.thumbnail_url,
      preview_url: ad.thumbnail_url,
      canvaUrl: ad.canva_url, // Include Canva URL directly
      industry: ad.industry?.[0] || null,
      type: ad.type,
      ratio: ad.ratio,
      format: ad.format,
      tags: ad.tags,
    }))

    return NextResponse.json(
      {
        code: "SUCCESS",
        data: {
          ads: transformedAds,
          templates: transformedAds, // alias
          items: transformedAds, // alias
          total: result.total,
          totalCount: result.total,
          total_count: result.total,
          count: result.total,
          page: result.page,
          currentPage: result.page,
          current_page: result.page,
          pageSize: result.pageSize,
          perPage: result.pageSize,
          per_page: result.pageSize,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes
        },
      }
    )
  } catch (error: any) {
    console.error("❌ Error fetching ads from Supabase:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch ads",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

