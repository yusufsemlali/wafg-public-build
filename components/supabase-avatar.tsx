"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar } from "@supabase/ui"

interface SupabaseAvatarProps {
  uid: string
  url?: string
  size?: number
  onUpload?: (url: string) => void
}

export function SupabaseAvatar({ uid, url, size = 150, onUpload }: SupabaseAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (url) setAvatarUrl(url)
  }, [url])

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${uid}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      setAvatarUrl(data.publicUrl)

      if (onUpload) {
        onUpload(data.publicUrl)
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
      alert("Error uploading avatar!")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {avatarUrl ? (
        <Avatar size={size} src={avatarUrl} alt="Avatar" className="avatar image" />
      ) : (
        <Avatar size={size} initials={uid.substring(0, 2).toUpperCase()} alt="Avatar" className="avatar no-image" />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
