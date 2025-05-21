"use client"

import { useMemberSearch, type Profile } from "@/hooks/use-member-search"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useCallback } from "react"

export function MemberSearch() {
  const { searchQuery, setSearchQuery, members, loading, error, tableExists, fetchRecentMembers } = useMemberSearch()

  // Get member initials for avatar fallback
  const getMemberInitials = useCallback((profile: Profile) => {
    if (profile.username) {
      return profile.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return "U"
  }, [])

  // Format date to readable format - with fallback if member_since doesn't exist
  const formatDate = useCallback((profile: Profile) => {
    try {
      // First try member_since
      if (profile.member_since) {
        return new Date(profile.member_since).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      }

      // Then try created_at
      if (profile.created_at) {
        return new Date(profile.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      }

      // Fallback
      return "Member"
    } catch (e) {
      console.error("Invalid date format:", e)
      return "Member"
    }
  }, [])

  // If the profiles table doesn't exist, show a message
  if (!tableExists) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Members Directory Not Available</h2>
        <p className="text-muted-foreground mb-4">
          The members directory is not available at this time. This could be because the database is still being set up.
        </p>
        <p className="text-sm text-muted-foreground">
          Please try again later or contact an administrator if this issue persists.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => fetchRecentMembers()}
          title="Refresh"
          aria-label="Refresh member list"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="animate-pulse flex flex-col items-center w-full">
                  <div className="h-16 w-16 bg-muted rounded-full mb-2"></div>
                  <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                  <div className="h-3 w-16 bg-muted rounded mb-2"></div>
                  <div className="h-3 w-20 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No members found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term" : "No members in the community yet"}
            </p>
          </div>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src={member.avatar_url || undefined} alt={member.username || "Member"} />
                  <AvatarFallback>{getMemberInitials(member)}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium">{member.username || "Unnamed User"}</h3>
                {member.role && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      member.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : member.role === "moderator"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {member.role}
                  </span>
                )}
                <p className="text-xs text-muted-foreground mt-1">{formatDate(member)}</p>
                <Link href={`/members/${member.user_id}`} className="mt-2 text-xs text-primary hover:underline">
                  View Profile
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
