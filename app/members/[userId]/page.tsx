import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface PageProps {
  params: { userId: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient()

  try {
    const { data: profile } = await supabase.from("profiles").select("username").eq("user_id", params.userId).single()

    return {
      title: profile?.username ? `${profile.username} | WAFG` : "Member Profile | WAFG",
      description: `View ${profile?.username || "member"}'s profile and activity in our gaming community.`,
    }
  } catch (error) {
    return {
      title: "Member Profile | WAFG",
      description: "View member profile and activity in our gaming community.",
    }
  }
}

export default async function MemberProfilePage({ params }: PageProps) {
  const supabase = await createClient()

  // Fetch the member profile
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", params.userId).single()

  if (error || !profile) {
    console.error("Error fetching member profile:", error)
    notFound()
  }

  // Get member initials for avatar fallback
  const getMemberInitials = () => {
    if (profile.username) {
      return profile.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return "U"
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      console.error("Invalid date format:", dateString, e)
      return "Unknown date"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <div className="mb-6">
          <Link href="/members" className="text-primary hover:underline">
            ← Back to Members
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Member Profile</CardTitle>
              <CardDescription>Member information and stats</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.username || "Member"} />
                <AvatarFallback className="text-4xl">{getMemberInitials()}</AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-bold">{profile.username || "Unnamed User"}</h2>

              <span
                className={`text-sm px-2 py-0.5 rounded-full mt-2 ${
                  profile.role === "admin"
                    ? "bg-primary/10 text-primary"
                    : profile.role === "moderator"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {profile.role}
              </span>

              <p className="text-sm text-muted-foreground mt-4">Member since {formatDate(profile.member_since)}</p>

              <div className="mt-6 w-full">
                <Button variant="outline" className="w-full">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent activity and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No recent activity to display</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
