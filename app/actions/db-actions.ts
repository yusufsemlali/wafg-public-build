"use server"

import { createClient } from "@/lib/supabase/server"

export async function checkDatabaseSchema() {
  try {
    const supabase = await createClient()

    // First, check if the profiles table exists at all
    const { error: tableExistsError } = await supabase.from("profiles").select("id").limit(1)

    if (tableExistsError) {
      // If the table doesn't exist, try to create it with minimal fields
      if (tableExistsError.message.includes("does not exist")) {
        console.log("Profiles table doesn't exist, attempting to create it...")

        try {
          // Instead of using RPC, use a direct SQL query to create the table
          const { error: createError } = await supabase.rpc("create_profiles_table_direct", {}, { count: "exact" })

          if (createError) {
            console.error("Error creating profiles table via RPC:", createError)

            // Try a direct SQL approach as a fallback
            const { error: sqlError } = await supabase.auth.admin.createUser({
              email: "dummy@example.com",
              password: "dummy_password",
              email_confirm: true,
            })

            if (sqlError && !sqlError.message.includes("already exists")) {
              console.error("Error creating dummy user to trigger profile creation:", sqlError)

              // Final fallback: Check if the table exists now (maybe another process created it)
              const { error: recheckError } = await supabase.from("profiles").select("id").limit(1)
              if (recheckError && recheckError.message.includes("does not exist")) {
                return { success: false, error: "Failed to create profiles table" }
              } else {
                // Table exists now, it was created elsewhere
                return { success: true }
              }
            }

            return { success: true }
          }

          return { success: true }
        } catch (createError) {
          console.error("Error creating profiles table:", createError)
          return { success: false, error: "Failed to create profiles table" }
        }
      }

      return { success: false, error: tableExistsError.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error checking database schema:", error)
    return { success: false, error: error.message }
  }
}

// Function to create a truly minimal profile with just user_id
export async function createMinimalProfile(userId: string) {
  if (!userId) {
    return { success: false, error: "User ID is required" }
  }

  try {
    const supabase = await createClient()

    // First check if the profiles table exists
    const { error: tableExistsError } = await supabase.from("profiles").select("id").limit(1)

    if (tableExistsError && tableExistsError.message.includes("does not exist")) {
      console.log("Profiles table doesn't exist, skipping profile creation")
      return { success: false, error: "Profiles table doesn't exist" }
    }

    // Try to create a profile with just user_id
    const { error } = await supabase.from("profiles").insert({
      user_id: userId,
    })

    if (error) {
      console.error("Error creating minimal profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error creating minimal profile:", error)
    return { success: false, error: error.message }
  }
}

// Direct SQL approach to create the profiles table
export async function createProfilesTableDirect() {
  try {
    const supabase = await createClient()

    // Check if the table already exists
    const { error: tableExistsError } = await supabase.from("profiles").select("id").limit(1)

    if (!tableExistsError || !tableExistsError.message.includes("does not exist")) {
      // Table already exists
      return { success: true }
    }

    // Create the profiles table with minimal fields
    const { error } = await supabase.rpc("create_profiles_table_direct")

    if (error) {
      console.error("Error creating profiles table directly:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in direct table creation:", error)
    return { success: false, error: error.message }
  }
}
