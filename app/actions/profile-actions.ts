"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function ensureUserProfile(userId: string, email: string, fullName?: string, avatarUrl?: string) {
  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    const supabase = await createClient()

    // Check if the profiles table exists
    const { error: tableExistsError } = await supabase.from("profiles").select("id").limit(1)

    if (tableExistsError && tableExistsError.message.includes("does not exist")) {
      console.log("Profiles table doesn't exist, skipping profile creation")
      return { success: false, error: "Profiles table doesn't exist" }
    }

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking for existing profile:", checkError)
      throw checkError
    }

    // If profile doesn't exist, create it
    if (!existingProfile) {
      console.log("Profile doesn't exist for user, creating one...")

      // First, let's discover what columns actually exist in the profiles table
      // We'll do this by examining the error message from a failed query
      const { error: introspectionError } = await supabase
        .from("profiles")
        .select("id, user_id, username, avatar_url, role, created_at, updated_at, member_since")
        .limit(1)

      // Parse the error message to determine which columns don't exist
      const nonExistentColumns = new Set<string>()
      if (introspectionError) {
        const errorMsg = introspectionError.message
        console.log("Introspection error:", errorMsg)

        // Extract column names from error messages like "column profiles.avatar_url does not exist"
        const regex = /column\s+profiles\.(\w+)\s+does not exist/g
        let match
        while ((match = regex.exec(errorMsg)) !== null) {
          nonExistentColumns.add(match[1])
        }

        console.log("Detected non-existent columns:", Array.from(nonExistentColumns))
      }

      // Create a profile object with only the columns that exist
      const profileData: Record<string, any> = {
        user_id: userId,
      }

      // Only add these fields if they don't appear in our non-existent columns list
      if (!nonExistentColumns.has("username")) {
        profileData.username = fullName || email
      }

      if (!nonExistentColumns.has("avatar_url") && avatarUrl) {
        profileData.avatar_url = avatarUrl
      }

      if (!nonExistentColumns.has("role")) {
        profileData.role = "member"
      }

      console.log("Creating profile with data:", profileData)

      // Insert the profile with only the columns that exist
      const { error: insertError } = await supabase.from("profiles").insert(profileData)

      if (insertError) {
        console.error("Error creating profile:", insertError)
        throw insertError
      }

      console.log("Profile created successfully")
    }

    return { success: true }
  } catch (error) {
    console.error("Error ensuring user profile:", error)
    return { success: false, error }
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    fullName?: string
    steamId?: string
    discordUsername?: string
    favoriteServer?: string
    avatarUrl?: string
  },
) {
  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    const supabase = await createClient()

    // Check if the profiles table exists before trying to ensure the profile
    const { error: tableExistsError } = await supabase.from("profiles").select("id").limit(1)

    if (!tableExistsError || !tableExistsError.message.includes("does not exist")) {
      // Only try to ensure the profile if the table exists
      await ensureUserProfile(userId, data.fullName || "User", data.fullName, data.avatarUrl)
    }

    // Update user metadata via auth API
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.fullName,
        steam_id: data.steamId,
        discord_username: data.discordUsername,
        favorite_server: data.favoriteServer,
        avatar_url: data.avatarUrl,
      },
    })

    if (error) {
      console.error("Error updating user:", error.message)
      throw error
    }

    // Only try to update the profile if the table exists
    if (!tableExistsError || !tableExistsError.message.includes("does not exist")) {
      // For the profile table update, we'll first check which columns exist
      const { error: introspectionError } = await supabase
        .from("profiles")
        .select("id, user_id, username, avatar_url")
        .limit(1)

      // Parse the error message to determine which columns don't exist
      const nonExistentColumns = new Set<string>()
      if (introspectionError) {
        const errorMsg = introspectionError.message
        console.log("Introspection error:", errorMsg)

        // Extract column names from error messages
        const regex = /column\s+profiles\.(\w+)\s+does not exist/g
        let match
        while ((match = regex.exec(errorMsg)) !== null) {
          nonExistentColumns.add(match[1])
        }

        console.log("Detected non-existent columns:", Array.from(nonExistentColumns))
      }

      // Create an update object with only the columns that exist
      const updateData: Record<string, any> = {}

      if (!nonExistentColumns.has("username") && data.fullName) {
        updateData.username = data.fullName
      }

      if (!nonExistentColumns.has("avatar_url") && data.avatarUrl) {
        updateData.avatar_url = data.avatarUrl
      }

      // Only attempt to update if we have fields to update
      if (Object.keys(updateData).length > 0) {
        const { error: profileError } = await supabase.from("profiles").update(updateData).eq("user_id", userId)

        if (profileError) {
          console.warn("Error updating profile table:", profileError.message)
          // Continue anyway since the user metadata was updated
        }
      }
    }

    // Revalidate the profile page to reflect changes
    revalidatePath("/profile")
    revalidatePath("/members")

    return { success: true }
  } catch (error: any) {
    console.error("Error in profile update:", error)
    return { success: false, error: error.message || "There was an error updating your profile" }
  }
}
