import { NextResponse } from "next/server"

// Diagnostic tool to find the correct StaticFlow API endpoint
// DELETE THIS FILE AFTER DEBUGGING!

const XANO_TOKEN = process.env.XANO_TOKEN || ""
const BASE_URL = "https://app.staticflow.io"

// Possible endpoint variations to test
const ENDPOINTS_TO_TEST = [
  "/api/templates/search/ads",
  "/api/templates/search",
  "/api/templates/ads",
  "/api/templates",
  "/api/ads",
  "/api/ads/search",
  "/api/search/ads",
  "/api/v1/templates/search/ads",
  "/api/v2/templates/search/ads",
]

export async function GET() {
  if (!XANO_TOKEN) {
    return NextResponse.json({ error: "XANO_TOKEN not set" }, { status: 500 })
  }

  const results = []

  for (const endpoint of ENDPOINTS_TO_TEST) {
    const url = `${BASE_URL}${endpoint}?pageId=1&sort=desc&scope=all`
    
    try {
      console.log(`Testing: ${url}`)
      
      // Try GET
      const getResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, */*",
          Cookie: `xano-token=${XANO_TOKEN}`,
          "User-Agent": "Mozilla/5.0",
        },
      })

      const isJson = getResponse.headers.get("content-type")?.includes("application/json")
      const responseText = await getResponse.text()
      const isHtml = responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")

      results.push({
        endpoint,
        method: "GET",
        status: getResponse.status,
        statusText: getResponse.statusText,
        contentType: getResponse.headers.get("content-type"),
        isJson,
        isHtml,
        success: getResponse.ok && isJson,
        preview: isJson ? responseText.substring(0, 200) : isHtml ? "HTML page returned" : responseText.substring(0, 100),
      })

      // If GET worked, try POST too
      if (getResponse.ok && isJson) {
        const postResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, */*",
            Cookie: `xano-token=${XANO_TOKEN}`,
          },
          body: JSON.stringify({
            industryFilters: [],
            typeFilters: [],
            ratioFilters: [],
          }),
        })

        const postText = await postResponse.text()
        const postIsJson = postResponse.headers.get("content-type")?.includes("application/json")

        results.push({
          endpoint,
          method: "POST",
          status: postResponse.status,
          statusText: postResponse.statusText,
          contentType: postResponse.headers.get("content-type"),
          isJson: postIsJson,
          success: postResponse.ok && postIsJson,
          preview: postIsJson ? postText.substring(0, 200) : "Non-JSON response",
        })
      }
    } catch (error: any) {
      results.push({
        endpoint,
        method: "GET",
        error: error.message,
      })
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Find working endpoints
  const workingEndpoints = results.filter(r => r.success)

  return NextResponse.json({
    tokenSet: true,
    tokenPreview: XANO_TOKEN.substring(0, 15) + "...",
    workingEndpoints: workingEndpoints.length > 0 ? workingEndpoints : "None found",
    allResults: results,
    recommendation: workingEndpoints.length > 0 
      ? `Use: ${workingEndpoints[0].endpoint} with ${workingEndpoints[0].method} method`
      : "No working endpoint found. Check if XANO_TOKEN is valid or contact StaticFlow support.",
  })
}

