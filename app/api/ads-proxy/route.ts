import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.STATICFLOW_API_URL || "https://app.staticflow.io/api/templates/search/ads"
const XANO_TOKEN = process.env.XANO_TOKEN || ""

if (!XANO_TOKEN) {
  console.warn("XANO_TOKEN is not set in environment variables")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get("pageId") || "1"
    const sort = searchParams.get("sort") || "desc"
    const scope = searchParams.get("scope") || "all"
    const acceptLanguage = request.headers.get("accept-language") || "en-US,en;q=0.9"

    const externalUrl = new URL(API_URL)
    externalUrl.searchParams.set("pageId", pageId)
    externalUrl.searchParams.set("sort", sort)
    externalUrl.searchParams.set("scope", scope)

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
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `External API error: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    const data = await response.json()

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
