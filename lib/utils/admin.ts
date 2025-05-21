import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) {
    console.log("isAdmin: No user provided")
    return false
  }

  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("isAdmin: Not in browser environment")
      return false
    }

    console.log("isAdmin: Checking admin status for user", user.id)
    const supabase = createClient()

    // Query the profiles table to check if the user has admin role
    const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (error) {
      console.error("isAdmin: Error checking admin status:", error)
      return false
    }

    const isUserAdmin = data?.role === "admin"
    console.log("isAdmin: User admin status:", isUserAdmin)
    return isUserAdmin
  } catch (error) {
    console.error("isAdmin: Unexpected error checking admin status:", error)
    return false
  }
}
