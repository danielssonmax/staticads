import { NextResponse } from "next/server"

// This endpoint helps verify environment variables are set correctly
// Remove this file after debugging!
export async function GET() {
  const checks = {
    XANO_TOKEN: process.env.XANO_TOKEN ? "✅ Set (" + process.env.XANO_TOKEN.substring(0, 20) + "...)" : "❌ Not set",
    STATICFLOW_API_URL: process.env.STATICFLOW_API_URL || "Using default",
    CANVA_LINK_API_URL: process.env.CANVA_LINK_API_URL || "Using default",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set",
  }

  return NextResponse.json({
    message: "Environment Variables Status",
    checks,
    note: "Remove this endpoint after debugging!"
  })
}

