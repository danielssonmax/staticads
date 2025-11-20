import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export async function getUserPlan(user: User | null): Promise<string> {
  if (!user?.email) {
    console.log("No user or email provided")
    return "free"
  }

  console.log("=== getUserPlan called (read-only) ===")
  console.log("User email:", user.email)
  console.log("User ID:", user.id)

  try {
    console.log("Querying profiles table for email:", user.email)

    const { data: profiles, error } = await supabase.from("profiles").select("*").eq("email", user.email).limit(1)

    console.log("Supabase query result:")
    console.log("- Error:", error)
    console.log("- Data:", profiles)
    console.log("- Data length:", profiles?.length)

    if (error) {
      console.error("Error fetching user plan:", error)
      return "free"
    }

    if (profiles && profiles.length > 0) {
      const profile = profiles[0]
      const plan = profile.plan || "free"
      console.log(`Returning plan for ${user.email}: ${plan}`)
      return plan
    }

    // Do NOT create a profile automatically if not found.
    console.log("No profile found. Returning 'free' without creating a profile.")
    return "free"
  } catch (err) {
    console.error("Unexpected error in getUserPlan:", err)
    return "free"
  }
}

export async function updateUserPlan(email: string, plan: string): Promise<boolean> {
  console.log("=== updateUserPlan called ===")
  console.log("Email:", email)
  console.log("New plan:", plan)

  try {
    const { data, error } = await supabase.from("profiles").upsert({ email, plan }, { onConflict: "email" }).select("*")

    console.log("Update result:")
    console.log("- Error:", error)
    console.log("- Data:", data)

    if (error) {
      console.error("Error updating user plan:", error)
      return false
    }

    console.log("Successfully updated user plan")
    return true
  } catch (err) {
    console.error("Unexpected error updating user plan:", err)
    return false
  }
}

export async function ensureUserProfile(user: User): Promise<string> {
  if (!user?.email) {
    return "free"
  }

  console.log("=== ensureUserProfile (read-only, no creation) ===")
  console.log("User email:", user.email)

  try {
    const { data: existingProfiles, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .limit(1)

    console.log("Existing profile check:")
    console.log("- Error:", fetchError)
    console.log("- Data:", existingProfiles)

    if (fetchError) {
      console.error("Error checking existing profile:", fetchError)
      return "free"
    }

    if (existingProfiles && existingProfiles.length > 0) {
      const plan = existingProfiles[0].plan || "free"
      console.log(`Existing profile found for ${user.email}: ${plan}`)
      return plan
    }

    // Do NOT create a profile automatically if not found.
    console.log("No profile exists; returning 'free' without creating a profile.")
    return "free"
  } catch (err) {
    console.error("Unexpected error ensuring user profile:", err)
    return "free"
  }
}

export async function hasAccessToAdsLibrary(user: User | null): Promise<boolean> {
  console.log("=== hasAccessToAdsLibrary called ===")

  if (!user) {
    console.log("No user provided, access denied")
    return false
  }

  console.log("Checking access for user:", user.email)

  try {
    const plan = await getUserPlan(user)
    console.log(`User ${user.email} has plan: ${plan}`)

    // Only allow access if the user has a "paid" plan
    const hasAccess = plan === "paid"
    console.log(`Access to ads library: ${hasAccess}`)

    return hasAccess
  } catch (error) {
    console.error("Error checking ads library access:", error)
    return false
  }
}

// Helper function to manually check what's in the database
export async function debugProfilesTable(): Promise<void> {
  console.log("=== DEBUG: Checking profiles table ===")

  try {
    const { data, error } = await supabase.from("profiles").select("*").limit(10)

    console.log("All profiles in table:")
    console.log("- Error:", error)
    console.log("- Data:", data)
    console.log("- Count:", data?.length)

    if (data) {
      data.forEach((profile, index) => {
        console.log(`Profile ${index + 1}:`, {
          id: profile.id,
          email: profile.email,
          plan: profile.plan,
          created_at: profile.created_at,
        })
      })
    }
  } catch (err) {
    console.error("Error debugging profiles table:", err)
  }
}
