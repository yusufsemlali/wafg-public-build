"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SetAdminScript() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const makeUserAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()

      // First, check if the user exists in the auth system
      try {
        console.log("Checking if user exists in auth system")
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error accessing current user:", userError.message)
          throw new Error(`Authentication error: ${userError.message}`)
        }

        if (!userData?.user) {
          throw new Error("You must be logged in to perform this action.")
        }

        // Check if the target user exists in the profiles table
        console.log("Checking if target user exists in profiles table")
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", "tiznit.sos@gmail.com")
          .single()

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // No rows returned - user doesn't exist in profiles
            throw new Error(
              "User with email tiznit.sos@gmail.com not found in profiles table. The user must sign up first.",
            )
          }
          throw new Error(`Error checking user profile: ${profileError.message}`)
        }

        if (!profileData) {
          throw new Error("User with email tiznit.sos@gmail.com not found. The user must sign up first.")
        }

        console.log("Found user profile:", profileData)

        // Update the profiles table to set the user as admin
        console.log("Updating user role to admin")
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin" })
          .eq("id", profileData.id)

        if (updateError) {
          throw new Error(`Error updating user: ${updateError.message}`)
        }

        setResult("Success! User tiznit.sos@gmail.com is now an admin.")
        toast({
          title: "Admin status granted",
          description: "User tiznit.sos@gmail.com is now an admin",
        })
      } catch (authError) {
        console.error("Auth error:", authError)
        throw authError
      }
    } catch (error: any) {
      console.error("Error:", error)
      setResult(`Error: ${error.message}`)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Set Admin Status</CardTitle>
        <CardDescription>Make tiznit.sos@gmail.com an admin user</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will grant admin privileges to the user with email tiznit.sos@gmail.com. Only run this once. The user
          must already have an account in the system.
        </p>
        {result && (
          <div
            className={`p-3 rounded-md ${result.includes("Error") ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-500"}`}
          >
            {result}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={makeUserAdmin} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Make Admin"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
