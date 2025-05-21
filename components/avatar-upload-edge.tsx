"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Loader2, Upload, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarUploadEdgeProps {
  userId: string
  currentAvatarUrl?: string | null
  onUploadComplete: (url: string) => void
}

export function AvatarUploadEdge({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadEdgeProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    // Create a preview
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  const clearSelection = () => {
    setPreview(currentAvatarUrl || null)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadAvatar = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB")
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed")
      }

      const supabase = createClient()

      // Get the access token for authorization
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("No active session found")
      }

      // Try to use the Edge Function first
      try {
        console.log("Attempting to use Edge Function for avatar upload...")

        // Create a FormData object to send the file
        const formData = new FormData()
        formData.append("file", file)

        // Construct the Edge Function URL
        const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/transform-avatar`
        console.log("Edge Function URL:", edgeFunctionUrl)

        // Call the Edge Function to process and upload the image
        const response = await fetch(edgeFunctionUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("Edge Function error:", errorData)
          throw new Error(errorData.error || `Edge Function returned status ${response.status}`)
        }

        const data = await response.json()

        // Call the callback with the new URL
        onUploadComplete(data.avatarUrl)

        toast({
          title: "Upload successful",
          description: "Your avatar has been updated using Edge Function.",
        })

        return // Exit early if Edge Function worked
      } catch (edgeError) {
        console.warn("Edge Function failed, falling back to direct storage upload:", edgeError)
        // Continue to fallback method
      }

      // Fallback: Direct upload to Storage if Edge Function fails
      console.log("Using fallback direct storage upload...")

      // Create a unique file path
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage.from("avatars").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)

      if (!publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL")
      }

      // Update the user's metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrlData.publicUrl },
      })

      if (updateError) {
        console.error("Error updating user metadata:", updateError)
        // Continue anyway, as we still have the URL
      }

      // Call the callback with the new URL
      onUploadComplete(publicUrlData.publicUrl)

      toast({
        title: "Upload successful",
        description: "Your avatar has been updated using direct upload.",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload.",
        variant: "destructive",
      })
      console.error("Error uploading avatar:", error)
    } finally {
      setUploading(false)
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    return userId.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-border">
          {preview ? (
            <Image
              src={preview || "/placeholder.svg"}
              alt="Avatar preview"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          ) : (
            <Avatar className="w-full h-full">
              <AvatarImage src={currentAvatarUrl || undefined} alt="User avatar" />
              <AvatarFallback className="text-4xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
          )}
        </div>
        {preview && preview !== currentAvatarUrl && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-0 right-0 rounded-full"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="avatar-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max. 5MB)</p>
            </div>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              ref={fileInputRef}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={clearSelection} disabled={!file || uploading}>
            Cancel
          </Button>
          <Button onClick={uploadAvatar} disabled={!file || uploading || preview === currentAvatarUrl}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload Avatar"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
