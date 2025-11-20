import { type NextRequest, NextResponse } from "next/server"

const API_URL = "https://app.staticflow.io/api/templates/canva-link"
// Use the SAME token as ads-proxy to avoid INVALID_INPUTS
const XANO_TOKEN =
  "eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.hviQn2ofKt9LHyvUnsywXtCDy96lhxvHm3s50URyhnMsXW6Qcu2u_zYS-dJgw0cE_blFnGW8eiGrBnVBISPMB1X2U-99AbeN.4qZOnogGHP9jeY9X52gcgQ.QHxA3SxB_4zxhPBJ86GXefkAI28QI9E96PYJpaAxbn9D5V-sy45MLaM_ZUVnWwkJsNM9nEM2pwir2BOfyclh9VqP8N6--uwN889UV4xSQNK2Q--fEIjlSThx61AtT1DGc6u-UqObOt_HaTRmi1t0M02QLIGGODABRLwCFVxEWSb1aCAusm4Hw8dZMhfoCkfu.Hf0dtYfzCHCCKFqSPeomyzi6XnbB0T5C43LASd1Cv5Q"

export async function GET(request: NextRequest) {
  console.log("[/api/canva-link] method:", request.method, "url:", request.url)

  try {
    const { searchParams } = new URL(request.url)
    const rawId = searchParams.get("id") || ""
    const adId = rawId.replace(/^"+|"+$/g, "").trim()

    if (!adId) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 })
    }

    const externalUrl = new URL(API_URL)
    externalUrl.searchParams.set("id", adId)
    // Match the working request shape seen in DevTools
    externalUrl.searchParams.set("library", "ads")
    console.log("[/api/canva-link] forwarding to:", externalUrl.toString())

    const response = await fetch(externalUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Cookie: `_fbp=fb.1.1747050500308.757790787824084108; _ga=GA1.1.546148977.1747050500; FPID=FPID2.2.FV3LAjgNh5apNf0OXWPmR8zojdhPnkgsbqV1NABBAgc%3D.1747050500; _gtmeec=e30%3D; reg_attempt=email; FPLC=V8fX2oSA8ZvnaP6tDfrH0foBukoAvXQVXdVaoPBUSdd317yZ8147grg5e3vJJo1waE82qNt%2FgbEHcVze5uBluljl7a%2F7WMspNKYUDmr2DfBFDy%2B047JA8BbsnrkU1g%3D%3D; _ga_DBBSJ3T5MY=GS2.1.s1754774393$o12$g0$t1754774393$j60$l0$h110999189; FPGSID=1.1754774393.1754774393.G-DBBSJ3T5MY.bqMXU8trKUm7rGrAUcEyYg; xano-token=${XANO_TOKEN}; ph_phc_xKV3rcgIPYc2bErEIFcJFUp80InTbA4Lzp8eblntDF2_posthog=%7B%22distinct_id%22%3A%220197ab67-8c4e-7139-a01b-b5c5ed0ec01b%22%2C%22%24sesid%22%3A%5B1754775317761%2C%22019890b4-724a-7def-a4f8-b5996b66a343%22%2C1754774401610%5D%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22https%3A%2F%2Faccounts.google.com%2F%22%2C%22u%22%3A%22https%3A%2F%2Fapp.staticflow.io%2Ftemplates%22%7D%7D`,
        Referer: "https://app.staticflow.io/",
        Origin: "https://app.staticflow.io",
      },
    })

    if (!response.ok) {
      let errorBody: any = null
      try {
        errorBody = await response.json()
      } catch {
        const text = await response.text()
        errorBody = { raw: text }
      }
      const status = response.status === 400 ? 400 : 502
      return NextResponse.json({ error: "External API error", status: response.status, details: errorBody }, { status })
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

export async function POST(request: NextRequest) {
  console.log("[/api/canva-link] received POST. This endpoint requires GET.", request.url)
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
