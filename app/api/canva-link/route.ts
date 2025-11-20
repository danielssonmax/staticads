import { type NextRequest, NextResponse } from "next/server"

// StaticFlow uses Next.js Server Actions for Canva link retrieval
// The endpoint is /templates (not /api/templates/canva-link)
const API_URL = "https://app.staticflow.io/templates"
const XANO_TOKEN = process.env.XANO_TOKEN || ""

export async function GET(request: NextRequest) {
  try {
    // Verify XANO_TOKEN is available
    if (!XANO_TOKEN) {
      console.error("❌ XANO_TOKEN is not set in environment variables")
      return NextResponse.json(
        { error: "Server configuration error: XANO_TOKEN not set" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const rawId = searchParams.get("id") || ""
    const adId = rawId.replace(/^"+|"+$/g, "").trim()

    if (!adId) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 })
    }

    console.log("🔗 Fetching Canva link for ad:", adId)
    console.log("📡 Using Server Action format")

    // StaticFlow uses Server Actions with this specific payload format
    // Payload: ["ads", "template-id"]
    const requestBody = JSON.stringify(["ads", adId])

    console.log("📦 Request body:", requestBody)

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "Accept": "text/x-component",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "Cookie": `xano-token=${XANO_TOKEN}`,
        "Referer": "https://app.staticflow.io/templates",
        "Origin": "https://app.staticflow.io",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
      },
      body: requestBody,
    })

    console.log("📥 Canva link response:", response.status, response.statusText)
    console.log("📥 Content-Type:", response.headers.get("content-type"))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Canva link API error:", response.status, errorText.substring(0, 200))
      
      return NextResponse.json({ 
        error: "External API error", 
        status: response.status, 
        details: errorText.substring(0, 500),
      }, { status: response.status })
    }

    // Response is in Server Action format (React Server Component)
    const responseText = await response.text()
    
    console.log("📥 Response preview:", responseText.substring(0, 200))

    // Try to parse the response
    // Server Actions return a special format, we need to extract the Canva link
    let canvaLink: string | null = null

    try {
      // The response might be JSON or RSC format
      // Look for Canva link patterns in the response
      const canvaLinkMatch = responseText.match(/https:\/\/www\.canva\.com\/design\/[^"'\s]+/)
      if (canvaLinkMatch) {
        canvaLink = canvaLinkMatch[0]
        console.log("✅ Found Canva link:", canvaLink)
      } else {
        // Try parsing as JSON
        const jsonData = JSON.parse(responseText)
        canvaLink = 
          jsonData?.canvaLink || 
          jsonData?.canva_link || 
          jsonData?.data?.canvaLink || 
          jsonData?.data?.canva_link ||
          null
      }
    } catch (parseError) {
      console.error("⚠️ Could not parse response, searching for Canva URL pattern")
      // Last resort: regex search for Canva URL
      const canvaLinkMatch = responseText.match(/https:\/\/www\.canva\.com\/design\/[^"'\s]+/)
      if (canvaLinkMatch) {
        canvaLink = canvaLinkMatch[0]
      }
    }

    if (!canvaLink) {
      console.error("❌ Canva link not found in response")
      return NextResponse.json({ 
        error: "Canva link not found in response",
        responsePreview: responseText.substring(0, 500)
      }, { status: 404 })
    }

    return NextResponse.json(
      { canvaLink },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  } catch (error: any) {
    console.error("❌ Internal error:", error)
    return NextResponse.json({ 
      error: "Internal proxy error", 
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: "Use GET for /api/canva-link?id=TEMPLATE_ID" }, { status: 405 })
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
