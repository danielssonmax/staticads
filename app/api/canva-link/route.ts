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
    console.log("📡 Using Next.js Server Action format with next-action header")

    // StaticFlow uses Server Actions with this specific payload format
    // Payload: ["ads", "template-id"]
    const requestBody = JSON.stringify(["ads", adId])

    console.log("📦 Request body:", requestBody)
    console.log("🔑 Next-Action header: 602f9908c8a9b21ea6903345df82874e4f360bee69")

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "Accept": "text/x-component",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
        "Cookie": `xano-token=${XANO_TOKEN}`,
        "Referer": "https://app.staticflow.io/templates",
        "Origin": "https://app.staticflow.io",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Priority": "u=1, i",
        // CRITICAL: Next.js Server Action headers
        "Next-Action": "602f9908c8a9b21ea6903345df82874e4f360bee69",
        "Next-Router-State-Tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22(dashboard)%22%2C%7B%22children%22%3A%5B%22templates%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
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
    
    console.log("📥 Response preview:", responseText.substring(0, 300))

    // Parse Server Action response format
    // Format: "0:{...}\n1:{...}\n"
    // Line 1 contains the actual data with canvaUrl
    let canvaLink: string | null = null

    try {
      // Split by newlines and find the line with the data
      const lines = responseText.split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        // Remove the line prefix (e.g., "1:")
        const jsonPart = line.replace(/^\d+:/, '')
        
        try {
          const parsed = JSON.parse(jsonPart)
          
          // Look for canvaUrl in the response
          // Format: {"success":true,"data":{"canvaUrl":"..."}}
          if (parsed?.success && parsed?.data?.canvaUrl) {
            canvaLink = parsed.data.canvaUrl
            console.log("✅ Found Canva URL from Server Action response:", canvaLink)
            break
          }
          
          // Fallback: check for other possible field names
          if (parsed?.data?.canvaLink) {
            canvaLink = parsed.data.canvaLink
            console.log("✅ Found Canva link (canvaLink):", canvaLink)
            break
          }
        } catch (lineParseError) {
          // This line might not be JSON, continue to next line
          continue
        }
      }
      
      // If not found in structured format, try regex as fallback
      if (!canvaLink) {
        const canvaLinkMatch = responseText.match(/https:\/\/www\.canva\.com\/design\/[^"'\s]+/)
        if (canvaLinkMatch) {
          canvaLink = canvaLinkMatch[0]
          console.log("✅ Found Canva link via regex:", canvaLink)
        }
      }
    } catch (parseError) {
      console.error("⚠️ Error parsing response:", parseError)
      // Last resort: regex search for Canva URL
      const canvaLinkMatch = responseText.match(/https:\/\/www\.canva\.com\/design\/[^"'\s]+/)
      if (canvaLinkMatch) {
        canvaLink = canvaLinkMatch[0]
        console.log("✅ Found Canva link via regex fallback:", canvaLink)
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
