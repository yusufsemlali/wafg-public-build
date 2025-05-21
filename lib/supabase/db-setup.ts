import { checkDatabaseSchema, createProfilesTableDirect } from "@/app/actions/db-actions"

export async function setupDatabase() {
  try {
    // Try the standard approach first
    const result = await checkDatabaseSchema()

    if (!result.success) {
      console.warn("Standard database schema check failed, trying direct approach")

      // Try the direct approach as a fallback
      const directResult = await createProfilesTableDirect()

      if (!directResult.success) {
        console.warn("Direct table creation failed:", directResult.error)
        // Return true anyway to allow the application to continue
        // The app will work with just user metadata
        return true
      }
    }

    return true
  } catch (error) {
    console.error("Error setting up database:", error)
    // Return true anyway to allow the application to continue
    return true
  }
}
