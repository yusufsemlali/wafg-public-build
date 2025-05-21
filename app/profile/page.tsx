import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProfileForm } from "@/components/profile-form"
import { ensureUserProfile } from "@/app/actions/profile-actions"
import { checkDatabaseSchema, createMinimalProfile, createProfilesTableDirect } from "@/app/actions/db-actions"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Profile | WAFG",
  description: "Update your profile information and settings.",
}

export default async function ProfilePage() {
  const supabase = await createClient()

  try {
    // Try to check and create the database schema if needed
    try {
      const schemaCheck = await checkDatabaseSchema()
      if (!schemaCheck.success) {
        console.warn("Database schema check failed:", schemaCheck.error)

        // Try the direct approach as a fallback
        const directResult = await createProfilesTableDirect()
        if (!directResult.success) {
          console.warn("Direct table creation failed:", directResult.error)
          // Continue anyway, we'll just use user metadata
        }
      }
    } catch (schemaError) {
      console.error("Error in schema setup:", schemaError)
      // Continue anyway, we'll just use user metadata
    }

    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Auth error:", error.message)
      redirect("/auth/login")
    }

    if (!data?.user) {
      console.log("No user found")
      redirect("/auth/login")
    }

    // Try to ensure the user has a profile
    try {
      // First, check if the profiles table exists at all
      const { error: tableExistsError } = await supabase.from("profiles").select("id").limit(1)

      if (tableExistsError && tableExistsError.message.includes("does not exist")) {
        console.log("Profiles table doesn't exist, skipping profile creation")
        // If the table doesn't exist, we'll just skip profile creation
        // The user can still use the app with just their auth data
      } else {
        // Table exists, try to create/ensure profile
        const profileResult = await ensureUserProfile(
          data.user.id,
          data.user.email || "",
          data.user.user_metadata?.full_name,
          data.user.user_metadata?.avatar_url,
        )

        if (!profileResult.success) {
          console.warn("Failed to ensure user profile with standard method:", profileResult.error)

          // Fallback to creating a truly minimal profile with just user_id
          const minimalProfileResult = await createMinimalProfile(data.user.id)

          if (!minimalProfileResult.success) {
            console.warn("Failed to create minimal profile:", minimalProfileResult.error)
            // Continue anyway, as the profile form will still work with user metadata
          }
        }
      }
    } catch (profileError) {
      console.error("Error in profile creation:", profileError)
      // Continue anyway, as the profile form will still work with user metadata
    }

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>

          <div className="max-w-2xl mx-auto">
            <ProfileForm user={data.user} />
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    redirect("/auth/login")
  }
}
