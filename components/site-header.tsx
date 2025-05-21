"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, MessageSquare, Shield, Users } from "lucide-react"

export function SiteHeader() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Create a flag to track if the component is mounted
    let isMounted = true

    const checkUser = async () => {
      try {
        setLoading(true)

        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          if (isMounted) {
            setLoading(false)
            setAuthChecked(true)
          }
          return
        }

        const supabase = createClient()

        // Use getSession instead of getUser for more reliable session checking
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error fetching session:", sessionError.message)
          if (isMounted) {
            setUser(null)
            setIsAdmin(false)
            setAuthChecked(true)
          }
          return
        }

        // If we have a session and user, set the user state
        if (sessionData?.session?.user) {
          if (isMounted) {
            setUser(sessionData.session.user)
          }

          try {
            // Check if user is admin from profiles table
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("user_id", sessionData.session.user.id)
              .single()

            // Only update admin status if component is still mounted
            if (isMounted) {
              setIsAdmin(!profileError && profileData?.role === "admin")
            }
          } catch (profileCheckError) {
            console.error("Error checking admin status:", profileCheckError)
            if (isMounted) {
              setIsAdmin(false)
            }
          }
        } else {
          if (isMounted) {
            setUser(null)
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error("Unexpected error in checkUser:", error)
        if (isMounted) {
          setUser(null)
          setIsAdmin(false)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setAuthChecked(true)
        }
      }
    }

    checkUser()

    // Set up auth state change listener
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log("Auth state changed:", event)

        if (session?.user) {
          // Always set the user when session exists
          if (isMounted) {
            setUser(session.user)
          }

          try {
            // Check if user is admin from profiles table
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("user_id", session.user.id)
              .single()

            // Only update admin status if component is still mounted
            if (isMounted) {
              setIsAdmin(!profileError && profileData?.role === "admin")
            }
          } catch (profileCheckError) {
            console.error("Error checking admin status:", profileCheckError)
            if (isMounted) {
              setIsAdmin(false)
            }
          }
        } else {
          if (isMounted) {
            setUser(null)
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
        if (isMounted) {
          setUser(null)
          setIsAdmin(false)
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error signing out:", error.message)
      }

      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Unexpected error during logout:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    if (user && user.email) return user.email.charAt(0).toUpperCase()
    return "U"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">WAFG</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/servers" className="text-sm font-medium transition-colors hover:text-primary">
              Our Servers
            </Link>
            <Link href="/news" className="text-sm font-medium transition-colors hover:text-primary">
              News
            </Link>
            <Link href="/community" className="text-sm font-medium transition-colors hover:text-primary">
              Community
            </Link>
            <Link href="/members" className="text-sm font-medium transition-colors hover:text-primary">
              Members
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {authChecked && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || ""}
                          alt={user.user_metadata?.full_name || user.email || "User"}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.user_metadata?.role || "Community Member"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/messages")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/members")}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Members</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>

                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button>Join Us</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
