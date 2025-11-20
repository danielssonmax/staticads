import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { userId, email, name } = await req.json()

    const { error } = await supabase.from("users").insert([{ id: userId, email, name, subscribed: false }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}
