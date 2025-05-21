"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"
import { toast } from "@/components/ui/use-toast"
import { Pencil } from "lucide-react"
import { AvatarUpload } from "@/components/avatar-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { updateUserProfile } from "@/app/actions/profile-actions"

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "")
  const [steamId, setSteamId] = useState(user.user_metadata?.steam_id || "")
  const [discordUsername, setDiscordUsername] = useState(user.user_metadata?.discord_username || "")
  const [favoriteServer, setFavoriteServer] = useState(user.user_metadata?.favorite_server || "")
  const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || "")
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    if (user && user.email) return user.email.charAt(0).toUpperCase()
    return "U"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use the server action to update the profile
      const result = await updateUserProfile(user.id, {
        fullName,
        steamId,
        discordUsername,
        favoriteServer,
        avatarUrl,
      })

      if (!result.success) {
        throw new Error(result.error as string)
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Update the client-side user data
      const supabase = createClient()
      await supabase.auth.refreshSession()

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      })
      console.error("Error in profile update:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onAvatarUploaded = (url: string) => {
    setAvatarUrl(url)
    setIsAvatarDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your community profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || undefined} alt="User avatar" />
                <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
              </Avatar>

              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit avatar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Profile Picture</DialogTitle>
                  </DialogHeader>
                  <AvatarUpload userId={user.id} url={avatarUrl} onUpload={onAvatarUploaded} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-center">
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Display Name</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your display name in the community"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="steam-id">Steam ID (optional)</Label>
              <Input
                id="steam-id"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                placeholder="Your Steam ID or profile URL"
              />
              <p className="text-xs text-muted-foreground">This helps other community members find you on Steam</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discord-username">Discord Username (optional)</Label>
              <Input
                id="discord-username"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                placeholder="Your Discord username"
              />
              <p className="text-xs text-muted-foreground">
                This helps other community members find you on our Discord server
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="favorite-server">Favorite Server (optional)</Label>
              <select
                id="favorite-server"
                value={favoriteServer}
                onChange={(e) => setFavoriteServer(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a server</option>
                <option value="dust2">Dust2 24/7</option>
                <option value="rotation">Map Rotation</option>
                <option value="gungame">Gungame</option>
                <option value="zombie">Zombie Mod</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
