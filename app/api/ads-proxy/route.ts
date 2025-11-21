import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.STATICFLOW_API_URL || "https://app.staticflow.io/api/templates/search"
const XANO_TOKEN = process.env.XANO_TOKEN || ""

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
 * Convert category names to IDs (fallback conversion if frontend didn't do it)
 */
function convertCategoriesToIds(categories: string[]): string[] {
  if (!Array.isArray(categories)) return []
  
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

export async function POST(request: NextRequest) {
  try {
    // Verify XANO_TOKEN is available
    if (!XANO_TOKEN) {
      console.error("❌ XANO_TOKEN is not set in environment variables")
      return NextResponse.json(
        { error: "Server configuration error: XANO_TOKEN not set" },
        { status: 500 }
      )
    }

    console.log("✅ XANO_TOKEN is set:", XANO_TOKEN.substring(0, 20) + "..." + XANO_TOKEN.slice(-10))

    const body = await request.json()

    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get("pageId") || "1"
    const sort = searchParams.get("sort") || "desc"
    const scope = searchParams.get("scope") || "all"
    const acceptLanguage = request.headers.get("accept-language") || "en-US,en;q=0.9"

    // Build URL with query params
    const externalUrl = new URL(API_URL)
    externalUrl.searchParams.set("pageId", pageId)
    externalUrl.searchParams.set("sort", sort)
    externalUrl.searchParams.set("scope", scope)

    // Get the filters and convert any category names to IDs
    const industryFilters = body.industryFilters || body.industryIdFilters || []
    const typeFilters = body.typeFilters || body.typeIdFilters || []
    
    // Convert category names to IDs (fallback if frontend didn't do it)
    const industryIds = convertCategoriesToIds(industryFilters)
    const typeIds = convertCategoriesToIds(typeFilters)
    
    // Transform the request body to match StaticFlow's expected format
    const requestBody = {
      activeLibrary: "ads",
      industryIdFilters: industryIds,
      typeIdFilters: typeIds,
      ratioFilters: body.ratioFilters || [],
    }

    console.log("📡 Fetching from:", externalUrl.toString())
    console.log("📦 Using POST method with filters in body")
    console.log("🔄 Converted industryFilters:", industryFilters, "→", industryIds)
    console.log("🔄 Converted typeFilters:", typeFilters, "→", typeIds)
    console.log("📦 Request body:", JSON.stringify(requestBody, null, 2))

    // Use POST method (confirmed working from network tab)
    const response = await fetch(externalUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Accept-Language": acceptLanguage,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Cookie: `xano-token=${XANO_TOKEN}`,
        Referer: "https://app.staticflow.io/templates",
        Origin: "https://app.staticflow.io",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("📥 Response status:", response.status, response.statusText)
    console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ External API error:", response.status, errorText)
      
      return NextResponse.json(
        { 
          error: `External API error: ${response.status} - ${response.statusText}`,
          details: errorText,
          url: externalUrl.toString(),
          method: "POST"
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("✅ Successfully fetched ads data")

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error: any) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Internal proxy error", details: error?.message }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
