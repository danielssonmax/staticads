import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.CANVA_LINK_API_URL || "https://app.staticflow.io/api/templates/canva-link"
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

    const externalUrl = new URL(API_URL)
    externalUrl.searchParams.set("id", adId)
    externalUrl.searchParams.set("library", "ads")

    console.log("🔗 Fetching Canva link for ad:", adId)
    console.log("📡 URL:", externalUrl.toString())

    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Cookie: `xano-token=${XANO_TOKEN}`,
        Referer: "https://app.staticflow.io/",
        Origin: "https://app.staticflow.io",
      },
    })

    console.log("📥 Canva link response:", response.status, response.statusText)

    if (!response.ok) {
      let errorBody: any = null
      try {
        errorBody = await response.json()
      } catch {
        const text = await response.text()
        errorBody = { raw: text }
      }
      console.error("❌ Canva link API error:", response.status, errorBody)
      
      const status = response.status === 400 ? 400 : 502
      return NextResponse.json({ 
        error: "External API error", 
        status: response.status, 
        details: errorBody,
        url: externalUrl.toString()
      }, { status })
    }

    const data = await response.json()

    const canvaLink: string | undefined =
      data?.data?.canvaLink || data?.data?.canva_link || data?.canvaLink || data?.canva_link

    if (!canvaLink) {
      return NextResponse.json({ error: "Canva link not found" }, { status: 404 })
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
    return NextResponse.json({ error: "Internal proxy error", details: error.message }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: "Use GET for /api/canva-link" }, { status: 405 })
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
