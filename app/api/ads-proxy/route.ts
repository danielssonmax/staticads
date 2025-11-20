import { type NextRequest, NextResponse } from "next/server"

const API_URL = "https://app.staticflow.io/api/templates/search/ads"
const XANO_TOKEN =
  "eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.G8wGVQXUtjWLhdkmdMpzPGiU82pD6XZWrzwot7xTXL-1-9Y717q_Ww07Z6x0pd4FYPuDvraU4WSq0_jTzhvwGwXiY98WEph5.JklM09PDIASMhBbeZeXSsg.OWsDCQO234cDS-m0ynwGVQus17G26YCTA_yYQvQt8URESyC4vOpiAXoVJ5S-DsMoe_VJcGndmxjNOWVcQ9Y5Qit_TLOBUqnL5dxTVYbgFja5j6pADUkDpCzdctBY17GdIseqRbwdRp1rtDGTC-ahUV_soXJ45pn8KBhnH0LRgBdp_BLIkX2JhYibnpix2GfX.i-u-5AfjoV85ZQ0ak_sQEL5ajJiPLbqBq2C4LzYnMBs"

export async function POST(request: NextRequest) {
  console.log("=== ADS PROXY ROUTE CALLED ===")

  try {
    const body = await request.json()
    console.log("Request body received:", body)

    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get("pageId") || "1"
    const sort = searchParams.get("sort") || "desc"
    const scope = searchParams.get("scope") || "all"
    const acceptLanguage = request.headers.get("accept-language") || "en-US,en;q=0.9"

    console.log("Query params:", { pageId, sort, scope })

    // Build the external URL with query parameters exactly as in the curl command
    const externalUrl = new URL(API_URL)
    externalUrl.searchParams.set("pageId", pageId)
    externalUrl.searchParams.set("sort", sort)
    externalUrl.searchParams.set("scope", scope)

    console.log("Making request to external API:", externalUrl.toString())
    console.log("Request body being sent:", JSON.stringify(body))

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

    console.log("External API response status:", response.status)
    console.log("External API response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("External API error response:", errorText)
      return NextResponse.json(
        { error: `External API error: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("External API success response:", data)
    console.log("Response data type:", typeof data)
    console.log("Response data keys:", Object.keys(data || {}))

    // Log the nested data structure
    if (data.data) {
      console.log("Nested data keys:", Object.keys(data.data))
      console.log("Nested data structure:", data.data)

      // Check for ads in various possible locations
      if (data.data.ads) {
        console.log("Found ads array with length:", data.data.ads.length)
        console.log("First ad sample:", data.data.ads[0])
      }
      if (data.data.templates) {
        console.log("Found templates array with length:", data.data.templates.length)
      }
      if (data.data.items) {
        console.log("Found items array with length:", data.data.items.length)
      }
    }

    // Also check for ads directly in the response
    if (data.ads) {
      console.log("Found ads array directly with length:", data.ads.length)
      console.log("First ad sample:", data.ads[0])
    }

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Internal proxy error", details: error.message }, { status: 500 })
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
