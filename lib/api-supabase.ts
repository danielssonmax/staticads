import type { QueryParams, ApiResponse, AdTemplate } from "@/types/api"

/**
 * Fetch ads from Supabase (cached data from cron job)
 * This is much faster than querying StaticFlow's API directly
 */
export async function queryAdsFromSupabase(params: QueryParams): Promise<ApiResponse> {
  try {
    // Build the URL with query parameters
    const url = new URL("/api/ads", window.location.origin)

    // Add filters
    if (params.industry && params.industry.length > 0) {
      url.searchParams.set("industry", params.industry[0])
    }

    if (params.type && params.type.length > 0) {
      url.searchParams.set("type", params.type[0])
    }

    if (params.ratio && params.ratio.length > 0) {
      url.searchParams.set("ratio", params.ratio[0])
    }

    // Add pagination
    url.searchParams.set("page", params.page_id.toString())
    url.searchParams.set("pageSize", "20")

    console.log("[queryAdsFromSupabase] GET", url.toString())

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()

    // Handle the response structure
    let actualData: any = data
    if (data && data.code === "SUCCESS" && data.data) {
      actualData = data.data
    }

    // Normalize the response
    const ads = actualData.ads || actualData.templates || actualData.items || actualData.results || []
    const totalCount =
      actualData.total || actualData.totalCount || actualData.total_count || actualData.count || ads.length
    const currentPage = actualData.page || actualData.currentPage || actualData.current_page || params.page_id
    const totalPages = Math.ceil(totalCount / 20)

    console.log(`[queryAdsFromSupabase] Received ${ads.length} ads (total: ${totalCount})`)

    return {
      ads,
      total_count: totalCount,
      current_page: currentPage,
      total_pages: totalPages,
    }
  } catch (error: any) {
    console.error("[queryAdsFromSupabase] Error:", error)
    throw error
  }
}

/**
 * Get Canva link for an ad (now directly from Supabase data)
 * Falls back to API call if not found in cached data
 */
export async function getCanvaLinkFromCache(ad: AdTemplate): Promise<string> {
  // Check if canvaUrl is already in the ad data
  if ((ad as any).canvaUrl && typeof (ad as any).canvaUrl === "string") {
    console.log("[getCanvaLinkFromCache] Using cached Canva URL")
    return (ad as any).canvaUrl
  }

  // Fallback to API call
  console.log("[getCanvaLinkFromCache] No cached URL, falling back to API")
  const url = new URL("/api/canva-link", window.location.origin)
  url.searchParams.set("id", String(ad.id))

  const response = await fetch(url.toString(), { method: "GET" })

  if (!response.ok) {
    throw new Error("Unable to retrieve Canva link")
  }

  const data = await response.json()
  const canvaLink = data?.canvaLink || data?.data?.canvaLink

  if (!canvaLink) {
    throw new Error("Unable to retrieve Canva link")
  }

  return canvaLink
}

