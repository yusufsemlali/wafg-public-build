"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock data for community members
const communityMembers = [
  {
    id: 1,
    name: "OldSchoolPlayer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Admin",
    joinDate: "Member since 2005",
  },
  {
    id: 2,
    name: "FragMaster2000",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Moderator",
    joinDate: "Member since 2007",
  },
  {
    id: 3,
    name: "HeadshotHero",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Member",
    joinDate: "Member since 2010",
  },
  {
    id: 4,
    name: "SniperElite",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Member",
    joinDate: "Member since 2012",
  },
  {
    id: 5,
    name: "TacticalTom",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Member",
    joinDate: "Member since 2015",
  },
  {
    id: 6,
    name: "ClassicGamer",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Member",
    joinDate: "Member since 2008",
  },
  {
    id: 7,
    name: "RetroFragger",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Moderator",
    joinDate: "Member since 2006",
  },
  {
    id: 8,
    name: "ZombieHunter",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Member",
    joinDate: "Member since 2011",
  },
]

export function CommunityMembers() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = communityMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get member initials for avatar fallback
  const getMemberInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search members..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{getMemberInitials(member.name)}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium">{member.name}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  member.role === "Admin"
                    ? "bg-primary/10 text-primary"
                    : member.role === "Moderator"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {member.role}
              </span>
              <p className="text-xs text-muted-foreground mt-1">{member.joinDate}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No members found matching your search.</p>
        </div>
      )}
    </div>
  )
}
