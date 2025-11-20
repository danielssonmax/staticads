import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { userId, email, name } = await req.json()
    const supabase = await createClient()

    const { error } = await supabase.from("users").insert([{ id: userId, email, name, subscribed: false }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}
