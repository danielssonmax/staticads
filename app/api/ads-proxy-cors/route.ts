import { type NextRequest, NextResponse } from "next/server"

// Alternative CORS proxy approach - forwards requests exactly as received
const API_URL = process.env.STATICFLOW_API_URL || "https://app.staticflow.io/api/templates/search/ads"
const XANO_TOKEN = process.env.XANO_TOKEN || ""

export async function POST(request: NextRequest) {
  try {
    if (!XANO_TOKEN) {
      console.error("❌ XANO_TOKEN is not set")
      return NextResponse.json(
        { error: "Server configuration error: XANO_TOKEN not set" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { searchParams } = new URL(request.url)

    // Build target URL with all query params
    const targetUrl = new URL(API_URL)
    searchParams.forEach((value, key) => {
      if (key !== 'path') {  // Exclude internal routing params
        targetUrl.searchParams.set(key, value)
      }
    })

    console.log("🔀 CORS Proxy forwarding to:", targetUrl.toString())

    // Forward the request with minimal modifications
    const response = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
        "Cookie": `xano-token=${XANO_TOKEN}`,
        "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0",
        "Referer": "https://app.staticflow.io/",
        "Origin": "https://app.staticflow.io",
      },
      body: JSON.stringify(body),
    })

    console.log("📥 CORS Proxy response:", response.status, response.statusText)

    // Get response data
    const responseData = await response.text()
    
    // Try to parse as JSON
    let jsonData
    try {
      jsonData = JSON.parse(responseData)
    } catch {
      // If not JSON, return the text
      return new NextResponse(responseData, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": response.headers.get("content-type") || "text/plain",
        },
      })
    }

    // Return JSON with CORS headers
    return NextResponse.json(jsonData, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    })
  } catch (error: any) {
    console.error("❌ CORS Proxy error:", error)
    return NextResponse.json(
      { error: "Proxy error", details: error.message },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!XANO_TOKEN) {
      return NextResponse.json({ error: "XANO_TOKEN not set" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    
    // Build target URL
    const targetUrl = new URL(API_URL)
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value)
    })

    console.log("🔀 CORS Proxy GET:", targetUrl.toString())

    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json, */*",
        "Cookie": `xano-token=${XANO_TOKEN}`,
        "Referer": "https://app.staticflow.io/",
      },
    })

    const responseData = await response.text()
    
    try {
      const jsonData = JSON.parse(responseData)
      return NextResponse.json(jsonData, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      })
    } catch {
      return new NextResponse(responseData, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": response.headers.get("content-type") || "text/plain",
        },
      })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  })
}

