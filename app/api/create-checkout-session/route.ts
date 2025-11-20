import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getCurrentDomain } from "@/lib/url-utils"

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json()
    const currentDomain = getCurrentDomain(req.headers)

    // Use provided priceId or fall back to default from env
    const stripePriceId = priceId || process.env.STRIPE_PRICE_ID || 'price_1S6Ww7DPWoWpgTDwWWvly8YM'

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      locale: "en",
      return_url: `${currentDomain}/return?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
    })

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
