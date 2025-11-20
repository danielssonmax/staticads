import { NextResponse } from "next/server"

// Test endpoint to diagnose StaticFlow API issues
// DELETE THIS FILE AFTER DEBUGGING!

const API_URL = "https://app.staticflow.io/api/templates/search/ads"
const XANO_TOKEN = process.env.XANO_TOKEN || ""

export async function GET() {
  const results: any = {
    tokenSet: !!XANO_TOKEN,
    tokenPreview: XANO_TOKEN ? XANO_TOKEN.substring(0, 20) + "..." : "Not set",
    tests: []
  }

  if (!XANO_TOKEN) {
    return NextResponse.json({
      error: "XANO_TOKEN not set in environment variables",
      ...results
    })
  }

  // Test 1: GET request
  try {
    const getUrl = `${API_URL}?pageId=1&sort=desc&scope=all`
    console.log("Testing GET:", getUrl)
    
    const getResponse = await fetch(getUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Cookie: `xano-token=${XANO_TOKEN}`,
        Referer: "https://app.staticflow.io/templates",
        Origin: "https://app.staticflow.io",
      },
    })

    results.tests.push({
      method: "GET",
      url: getUrl,
      status: getResponse.status,
      statusText: getResponse.statusText,
      headers: Object.fromEntries(getResponse.headers.entries()),
      bodyPreview: await getResponse.text().then(t => t.substring(0, 200))
    })
  } catch (error: any) {
    results.tests.push({
      method: "GET",
      error: error.message
    })
  }

  // Test 2: POST request
  try {
    const postUrl = `${API_URL}?pageId=1&sort=desc&scope=all`
    console.log("Testing POST:", postUrl)
    
    const postResponse = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Cookie: `xano-token=${XANO_TOKEN}`,
        Referer: "https://app.staticflow.io/templates",
        Origin: "https://app.staticflow.io",
      },
      body: JSON.stringify({
        industryFilters: [],
        typeFilters: [],
        ratioFilters: []
      }),
    })

    results.tests.push({
      method: "POST",
      url: postUrl,
      status: postResponse.status,
      statusText: postResponse.statusText,
      headers: Object.fromEntries(postResponse.headers.entries()),
      bodyPreview: await postResponse.text().then(t => t.substring(0, 200))
    })
  } catch (error: any) {
    results.tests.push({
      method: "POST",
      error: error.message
    })
  }

  return NextResponse.json(results, { status: 200 })
}

