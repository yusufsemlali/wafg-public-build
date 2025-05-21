import { createClient } from "@/lib/supabase/server"

export async function initializeStorage() {
  try {
    const supabase = await createClient()

    // Instead of trying to create the bucket (which requires admin privileges),
    // we'll just check if we can access it and assume it exists

    // Try to get the bucket details - this will tell us if it exists and is accessible
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("avatars")

    if (bucketError) {
      console.log("Note: Avatars bucket may need to be created in the Supabase dashboard")
      console.log("This is a one-time setup step that requires admin access")

      // We'll continue anyway - the bucket might exist but we just don't have permission to check it
      // or it might need to be created manually in the Supabase dashboard
    }

    return true
  } catch (error) {
    console.error("Error initializing storage:", error)
    // Return true anyway to allow the application to continue
    // The avatar upload functionality will handle its own errors if the bucket isn't available
    return true
  }
}
