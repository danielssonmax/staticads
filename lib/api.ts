import type { QueryParams, ApiResponse, AdTemplate } from "@/types/api"

/**
 * Map category names to StaticFlow category IDs
 */
const CATEGORY_NAME_TO_ID: Record<string, string> = {
  "Fashion & Accessories": "1",
  "Food": "2",
  "Health & Wellness": "3",
  "Electronics": "4",
  "Pets": "5",
  "Home & Furniture": "6",
  "Skincare": "7",
  "SaaS/Apps": "8",
  "Self care": "9",
  "Sport & outdoor": "10",
  "Finance": "11",
  "Education": "12",
  "Kids & Baby": "13",
}

/**
 * Convert category names to IDs
 * If a value is already an ID (number string), return it as-is
 * If it's a category name, convert it to the corresponding ID
 */
function convertCategoriesToIds(categories: string[]): string[] {
  return categories
    .map(category => {
      // If it's already a number, return as-is
      if (/^\d+$/.test(category)) {
        return category
      }
      // Otherwise, look up the ID from the name
      return CATEGORY_NAME_TO_ID[category] || category
    })
    .filter(id => id) // Remove any undefined/null values
}

/**
 * Fetch ads via the local proxy to the StaticFlow API.
 * Keeps the flexible response parsing to handle multiple shapes.
 */
export async function queryAds(params: QueryParams): Promise<ApiResponse> {
  try {
    // Build the URL with query parameters for our proxy
    const url = new URL("/api/ads-proxy", window.location.origin)
    url.searchParams.set("pageId", params.page_id.toString())

    // Normalize the sort value to lowercase
    const sortValue = (params.external_sorting[0]?.orderBy || "desc").toLowerCase()
    url.searchParams.set("sort", sortValue)
    url.searchParams.set("scope", "all")

    // Convert category names to IDs
    const industryIds = convertCategoriesToIds(params.industry)
    const typeIds = convertCategoriesToIds(params.type)

    // Request body as per the expected proxy format
    const requestBody = {
      industryFilters: industryIds,
      typeFilters: typeIds,
      ratioFilters: params.ratio,
    }

    // Log the final URL and request body
    console.log("[queryAds] POST", url.toString(), "body:", requestBody)
    console.log("[queryAds] Converted industries:", params.industry, "→", industryIds)
    console.log("[queryAds] Converted types:", params.type, "→", typeIds)

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()

    // Handle the StaticFlow API response structure: { code: 'SUCCESS', data: {...} }
    let actualData: any = data
    if (data && data.code === "SUCCESS" && data.data) {
      actualData = data.data
    }

    // Normalize the response to our expected shape
    const ads = actualData.ads || actualData.templates || actualData.items || actualData.results || []
    const totalCount =
      actualData.total || actualData.totalCount || actualData.total_count || actualData.count || ads.length
    const currentPage = actualData.page || actualData.currentPage || actualData.current_page || params.page_id
    const totalPages = actualData.totalPages || actualData.total_pages || actualData.pages || Math.ceil(totalCount / 20)

    return {
      ads: Array.isArray(ads) ? ads : [],
      total_count: totalCount,
      current_page: currentPage,
      total_pages: totalPages,
    }
  } catch (error) {
    console.error("Error in queryAds:", error)
    throw error
  }
}

/**
 * Single method to fetch a Canva link for a given ad by trying multiple possible ID fields.
 * Calls our /api/canva-link proxy for each candidate until one works.
 */
export async function getCanvaLinkForAd(ad: AdTemplate): Promise<string> {
  const candidates = [ad.id, (ad as any).template_id, (ad as any).templateId, (ad as any)._id, (ad as any).id_str]
    .filter((v) => v !== undefined && v !== null)
    .map((v) =>
      String(v)
        .trim()
        .replace(/^"+|"+$/g, ""),
    )
    .filter((v, idx, arr) => v.length > 0 && arr.indexOf(v) === idx)

  if (candidates.length === 0) {
    throw new Error("Unable to retrieve Canva link")
  }

  for (const candidate of candidates) {
    try {
      const url = new URL("/api/canva-link", window.location.origin)
      url.searchParams.set("id", candidate)

      console.log("[getCanvaLinkForAd] GET", url.toString())

      const response = await fetch(url.toString(), {
        method: "GET",
      })

      console.log("[getCanvaLinkForAd] status:", response.status)

      if (!response.ok) {
        continue
      }

      const data = await response.json()
      const direct = data?.canvaLink as string | undefined
      const nested = data?.data?.canvaLink as string | undefined

      if (direct && typeof direct === "string") return direct
      if (nested && typeof nested === "string") return nested
    } catch (err) {
      console.warn("[getCanvaLinkForAd] candidate failed:", candidate, err)
      continue
    }
  }

  throw new Error("Unable to retrieve Canva link")
}
