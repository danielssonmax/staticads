import { type NextRequest, NextResponse } from "next/server"

// Direct approach: Uses external CORS proxy service
// This bypasses our server entirely and goes directly through a CORS proxy

const STATICFLOW_API_URL = "https://app.staticflow.io/api/templates/search"
const XANO_TOKEN = process.env.XANO_TOKEN || ""

export async function POST(request: NextRequest) {
  try {
    if (!XANO_TOKEN) {
      return NextResponse.json(
        { error: "XANO_TOKEN not set" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { searchParams } = new URL(request.url)

    // Transform to StaticFlow's expected format
    const requestBody = {
      activeLibrary: "ads",
      industryIdFilters: body.industryFilters || body.industryIdFilters || [],
      typeIdFilters: body.typeFilters || body.typeIdFilters || [],
      ratioFilters: body.ratioFilters || [],
    }

    // Build the target URL
    const targetUrl = `${STATICFLOW_API_URL}?${searchParams.toString()}`

    console.log("📡 Direct API call to:", targetUrl)

    // Try direct call first (no CORS proxy)
    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Cookie": `xano-token=${XANO_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Direct call succeeded")
        return NextResponse.json(data)
      }

      console.log("⚠️ Direct call failed:", response.status)
    } catch (directError) {
      console.log("⚠️ Direct call error:", directError)
    }

    // Try with CORS proxy service
    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    console.log("🔄 Trying with CORS proxy:", corsProxyUrl)

    const corsResponse = await fetch(corsProxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Cookie": `xano-token=${XANO_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!corsResponse.ok) {
      throw new Error(`CORS proxy failed: ${corsResponse.status}`)
    }

    const data = await corsResponse.json()
    console.log("✅ CORS proxy succeeded")

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ All methods failed:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch ads",
        details: error.message,
        suggestions: [
          "Check if XANO_TOKEN is valid",
          "Check if StaticFlow API is accessible",
          "Try refreshing your token from StaticFlow"
        ]
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  return NextResponse.json({
    info: "POST to this endpoint with filters to fetch ads",
    params: Object.fromEntries(searchParams),
    tokenSet: !!XANO_TOKEN,
  })
}

