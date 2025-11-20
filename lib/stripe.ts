import "server-only"
import Stripe from "stripe"

// Allow building without STRIPE_SECRET_KEY set (will fail at runtime if used)
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-02-24.acacia",
})

