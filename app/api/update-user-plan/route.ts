import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { email, plan } = await req.json()

    if (!email || !plan) {
      return NextResponse.json({ error: "Email and plan are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.from("profiles").upsert({ email, plan }, { onConflict: "email" }).select()

    if (error) {
      console.error("Error updating user plan:", error)
      return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in update-user-plan API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
