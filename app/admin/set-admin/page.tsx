"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import SetAdminScript from "@/scripts/set-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function SetAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Create a flag to track if the component is mounted
    let isMounted = true

    async function checkAuth() {
      try {
        console.log("Starting auth check for set-admin page")

        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          console.log("Not in browser environment, skipping auth check")
          if (isMounted) setLoading(false)
          return
        }

        const supabase = createClient()

        // Simple auth check without Promise.race
        console.log("Fetching user data")
        const { data, error: authError } = await supabase.auth.getUser()

        // Check if component is still mounted before updating state
        if (!isMounted) return

        if (authError) {
          console.error("Auth error:", authError.message)
          setError("Authentication error. Please log in first.")
          setLoading(false)
          return
        }

        if (!data?.user) {
          console.log("No user found")
          setError("You must be logged in to access this page.")
          setLoading(false)
          return
        }

        console.log("User authenticated, checking admin status")
        setUser(data.user)

        // Direct database query to check admin status
        console.log("Querying profiles table")
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        // Check if component is still mounted before updating state
        if (!isMounted) return

        if (profileError) {
          console.error("Profile query error:", profileError)
          setError("Error checking permissions. Please try again.")
          setLoading(false)
          return
        }

        console.log("Profile data:", profileData)

        if (profileData?.role === "admin") {
          console.log("User is admin, granting access")
          setAuthorized(true)
        } else {
          console.log("User is not admin, access denied")
          setError("You don't have permission to access this page.")
        }
      } catch (err) {
        // Check if component is still mounted before updating state
        if (!isMounted) return

        console.error("Unexpected error in auth check:", err)
        setError("An unexpected error occurred. Please try again.")
      } finally {
        // Check if component is still mounted before updating state
        if (isMounted) {
          console.log("Auth check completed, setting loading to false")
          setLoading(false)
        }
      }
    }

    checkAuth()

    // Cleanup function to set the mounted flag to false when the component unmounts
    return () => {
      isMounted = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Checking permissions...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You cannot access this page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => router.push("/")} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (authorized) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <h1 className="text-3xl font-bold mb-6">Admin Tools</h1>
          <SetAdminScript />
        </main>
        <SiteFooter />
      </div>
    )
  }

  // Fallback UI in case none of the conditions are met
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>We couldn't determine your access level</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
