import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { email, plan } = await req.json()

    if (!email || !plan) {
      return NextResponse.json({ error: "Email and plan are required" }, { status: 400 })
    }

    console.log(`Updating plan for ${email} to ${plan}`)

    const { data, error } = await supabase.from("profiles").upsert({ email, plan }, { onConflict: "email" }).select()

    if (error) {
      console.error("Error updating user plan:", error)
      return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 })
    }

    console.log("Successfully updated user plan:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in update-user-plan API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
