"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Loader2, Upload, X } from "lucide-react"

interface AvatarUploadProps {
  userId: string
  url?: string | null
  onUpload: (url: string) => void
}

export function AvatarUpload({ userId, url, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(url || null)
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
    setPreview(url || null)
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

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB")
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed")
      }

      // Create a unique file path
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`

      // Try multiple paths to ensure upload works with different RLS policies
      const paths = [`public/${fileName}`, `profiles/${userId}/${fileName}`]

      // Initialize Supabase client
      const supabase = createClient()
      let uploadSuccess = false
      let publicUrl = ""

      // Try each path until one works
      for (const filePath of paths) {
        try {
          console.log(`Attempting to upload to ${filePath}...`)
          const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          })

          if (uploadError) {
            console.warn(`Upload error to ${filePath}:`, uploadError)
            continue // Try next path
          }

          // Get the public URL
          const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)

          if (!publicUrlData.publicUrl) {
            console.warn(`Failed to get public URL for ${filePath}`)
            continue // Try next path
          }

          publicUrl = publicUrlData.publicUrl
          uploadSuccess = true
          break // Exit loop on success
        } catch (pathError) {
          console.warn(`Error with path ${filePath}:`, pathError)
          // Continue to next path
        }
      }

      if (!uploadSuccess) {
        throw new Error("Failed to upload avatar to any storage location")
      }

      // Update user metadata with the avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      })

      if (updateError) {
        console.error("Error updating user metadata:", updateError)
        // Continue anyway since we have the URL
      }

      // Call the callback with the new URL
      onUpload(publicUrl)

      toast({
        title: "Upload successful",
        description: "Your avatar has been updated.",
      })
    } catch (error: any) {
      let errorMessage = error.message || "An error occurred during upload."

      // Provide more helpful error messages for common issues
      if (errorMessage.includes("row-level security policy")) {
        errorMessage = "Permission denied. The storage bucket may need configuration. Please contact support."
      }

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Error uploading avatar:", error)
    } finally {
      setUploading(false)
    }
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
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        {preview && preview !== url && (
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
              <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max. 2MB)</p>
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
          <Button onClick={uploadAvatar} disabled={!file || uploading || preview === url}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
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
