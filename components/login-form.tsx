"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create a new Supabase client for this request
      const supabase = createClient()

      // Check if Supabase client is properly initialized
      if (!supabase || !supabase.auth) {
        throw new Error("Supabase client not properly initialized")
      }

      // Validate inputs
      if (!email.trim()) throw new Error("Email is required")
      if (!password.trim()) throw new Error("Password is required")

      // Attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // Handle authentication errors
      if (signInError) {
        console.error("Authentication error:", signInError)

        // Provide more specific error messages based on the error code
        if (signInError.message === "Invalid login credentials") {
          throw new Error("Invalid email or password")
        } else {
          throw signInError
        }
      }

      // Check if we got a session back
      if (!data || !data.session) {
        throw new Error("Authentication failed - no session returned")
      }

      // Success - redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-500" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
