import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MemberSearch } from "@/components/member-search"
import { createClient } from "@/lib/supabase/server"
import { ensureUserProfile } from "@/app/actions/profile-actions"
import { checkDatabaseSchema, createMinimalProfile } from "@/app/actions/db-actions"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community Members | WAFG",
  description: "Browse and connect with members of our gaming community.",
}

export default async function MembersPage() {
  // Check database schema first - but don't block rendering if it fails
  try {
    await checkDatabaseSchema()
  } catch (error) {
    console.error("Error checking database schema:", error)
    // Continue anyway
  }

  // Check if the current user has a profile
  const supabase = await createClient()

  try {
    const { data } = await supabase.auth.getUser()

    if (data?.user) {
      try {
        // First, check if the profiles table exists at all
        const { error: tableExistsError } = await supabase.from("profiles").select("id").limit(1)

        if (tableExistsError && tableExistsError.message.includes("does not exist")) {
          console.log("Profiles table doesn't exist, skipping profile creation")
          // If the table doesn't exist, we'll just skip profile creation
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

            // Fallback to creating a truly minimal profile
            await createMinimalProfile(data.user.id)
          }
        }
      } catch (profileError) {
        console.error("Error in profile creation:", profileError)
        // Continue anyway, as this is not critical for viewing the members page
      }
    }
  } catch (error) {
    console.error("Error ensuring user profile:", error)
    // Continue anyway, as this is not critical for viewing the members page
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">Community Members</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Connect with other members of our community. Search by name or email to find specific members.
        </p>

        <MemberSearch />
      </main>
      <SiteFooter />
    </div>
  )
}
