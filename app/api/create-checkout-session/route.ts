import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getCurrentDomain } from "@/lib/url-utils"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json()
    const currentDomain = getCurrentDomain(req.headers)

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      locale: "en",
      return_url: `${currentDomain}/return?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price: 'price_1S6Ww7DPWoWpgTDwWWvly8YM',
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
