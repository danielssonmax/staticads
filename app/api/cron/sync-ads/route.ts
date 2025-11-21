import { type NextRequest, NextResponse } from "next/server"
import { upsertAdTemplates, logCronJob, updateCronJobLog } from "@/lib/supabase/ads"
import type { AdTemplate } from "@/types/api"

const STATICFLOW_API_URL = "https://app.staticflow.io/templates"
const XANO_TOKEN = process.env.XANO_TOKEN || ""
const CRON_SECRET = process.env.CRON_SECRET || ""
const TOTAL_PAGES = 40

/**
 * Fetch ads from a specific page
 */
async function fetchAdsPage(pageId: number): Promise<AdTemplate[]> {
  try {
    console.log(`📄 Fetching page ${pageId}...`)

    // Using Server Action format as per the working implementation
    const requestBody = JSON.stringify(["ads", { page: pageId }])

    const response = await fetch(STATICFLOW_API_URL, {
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
        // Note: For fetching ads list, we might need a different action ID
        // You may need to check the network tab for the correct action ID for listing ads
      },
      body: requestBody,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseText = await response.text()

    // Parse the Server Action response
    // This is a simplified parser - you might need to adjust based on actual response format
    const lines = responseText.split("\n").filter((line) => line.trim())

    for (const line of lines) {
      const jsonPart = line.replace(/^\d+:/, "")

      try {
        const parsed = JSON.parse(jsonPart)

        // Look for ads array in various possible locations
        if (parsed?.data?.ads) {
          return parsed.data.ads as AdTemplate[]
        }
        if (parsed?.ads) {
          return parsed.ads as AdTemplate[]
        }
        if (parsed?.data?.templates) {
          return parsed.data.templates as AdTemplate[]
        }
        if (Array.isArray(parsed?.data)) {
          return parsed.data as AdTemplate[]
        }
      } catch {
        continue
      }
    }

    console.warn(`⚠️ No ads found in response for page ${pageId}`)
    return []
  } catch (error: any) {
    console.error(`❌ Error fetching page ${pageId}:`, error.message)
    throw error
  }
}

/**
 * Fetch Canva URL for a specific ad
 */
async function fetchCanvaUrl(adId: string): Promise<string | null> {
  try {
    const requestBody = JSON.stringify(["ads", adId])

    const response = await fetch(STATICFLOW_API_URL, {
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
        "Next-Action": "602f9908c8a9b21ea6903345df82874e4f360bee69",
        "Next-Router-State-Tree":
          "%5B%22%22%2C%7B%22children%22%3A%5B%22(dashboard)%22%2C%7B%22children%22%3A%5B%22templates%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
      },
      body: requestBody,
    })

    if (!response.ok) {
      return null
    }

    const responseText = await response.text()
    const lines = responseText.split("\n").filter((line) => line.trim())

    for (const line of lines) {
      const jsonPart = line.replace(/^\d+:/, "")

      try {
        const parsed = JSON.parse(jsonPart)

        if (parsed?.success && parsed?.data?.canvaUrl) {
          return parsed.data.canvaUrl
        }
      } catch {
        continue
      }
    }

    return null
  } catch (error) {
    console.error(`❌ Error fetching Canva URL for ad ${adId}:`, error)
    return null
  }
}

/**
 * Cron job handler
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  // Verify cron secret for security
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    console.error("❌ Unauthorized cron job request")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify required environment variables
  if (!XANO_TOKEN) {
    console.error("❌ XANO_TOKEN is not set")
    return NextResponse.json({ error: "XANO_TOKEN not configured" }, { status: 500 })
  }

  console.log("🚀 Starting ad sync cron job...")

  // Create initial log
  const log = await logCronJob({
    job_name: "sync-ads",
    status: "started",
    started_at: new Date().toISOString(),
  })

  const logId = log?.id

  let totalAdsProcessed = 0
  let totalPagesProcessed = 0
  let errorsCount = 0
  const errorDetails: any[] = []

  try {
    // Fetch all pages
    for (let pageId = 1; pageId <= TOTAL_PAGES; pageId++) {
      try {
        console.log(`\n📄 Processing page ${pageId}/${TOTAL_PAGES}...`)

        const ads = await fetchAdsPage(pageId)

        if (ads.length === 0) {
          console.log(`⚠️ No ads found on page ${pageId}, stopping pagination`)
          break
        }

        console.log(`✅ Fetched ${ads.length} ads from page ${pageId}`)

        // Fetch Canva URLs for all ads on this page (with rate limiting)
        const canvaUrls = new Map<string, string>()

        for (let i = 0; i < ads.length; i++) {
          const ad = ads[i]
          const adId = String(ad.id)
          console.log(`  🔗 Fetching Canva URL for ad ${i + 1}/${ads.length} (ID: ${adId})...`)

          try {
            const canvaUrl = await fetchCanvaUrl(adId)
            if (canvaUrl) {
              canvaUrls.set(adId, canvaUrl)
              console.log(`  ✅ Got Canva URL`)
            } else {
              console.log(`  ⚠️ No Canva URL found`)
            }
          } catch (error: any) {
            console.error(`  ❌ Failed to fetch Canva URL:`, error.message)
            errorsCount++
            errorDetails.push({
              type: "canva_url_fetch_error",
              adId: adId,
              error: error.message,
            })
          }

          // Rate limiting: wait 500ms between requests
          if (i < ads.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }

        // Store ads in Supabase
        console.log(`💾 Storing ${ads.length} ads in Supabase...`)
        await upsertAdTemplates(ads, canvaUrls)
        console.log(`✅ Stored ${ads.length} ads`)

        totalAdsProcessed += ads.length
        totalPagesProcessed++

        // Rate limiting between pages
        if (pageId < TOTAL_PAGES) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch (error: any) {
        console.error(`❌ Error processing page ${pageId}:`, error.message)
        errorsCount++
        errorDetails.push({
          type: "page_fetch_error",
          pageId,
          error: error.message,
        })
      }
    }

    // Update log with completion status
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000)

    if (logId) {
      await updateCronJobLog(logId, {
        status: errorsCount > 0 ? "completed" : "completed",
        total_ads_processed: totalAdsProcessed,
        total_pages_processed: totalPagesProcessed,
        errors_count: errorsCount,
        error_details: errorDetails.length > 0 ? errorDetails : null,
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
      })
    }

    console.log(`\n🎉 Cron job completed!`)
    console.log(`  📊 Total ads processed: ${totalAdsProcessed}`)
    console.log(`  📄 Total pages processed: ${totalPagesProcessed}`)
    console.log(`  ⚠️ Errors: ${errorsCount}`)
    console.log(`  ⏱️ Duration: ${durationSeconds}s`)

    return NextResponse.json({
      success: true,
      totalAdsProcessed,
      totalPagesProcessed,
      errorsCount,
      durationSeconds,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    })
  } catch (error: any) {
    console.error("❌ Fatal error in cron job:", error)

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000)

    if (logId) {
      await updateCronJobLog(logId, {
        status: "failed",
        total_ads_processed: totalAdsProcessed,
        total_pages_processed: totalPagesProcessed,
        errors_count: errorsCount + 1,
        error_details: [...errorDetails, { type: "fatal_error", error: error.message }],
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        totalAdsProcessed,
        totalPagesProcessed,
        errorsCount: errorsCount + 1,
      },
      { status: 500 }
    )
  }
}

