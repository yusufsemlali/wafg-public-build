import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { ImageTransform } from "https://esm.sh/@supabase/image-transform@0.1.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    })

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      })
    }

    // Parse the request body
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }

    // Create a buffer from the file
    const buffer = await file.arrayBuffer()

    // Initialize the image transformer
    const transformer = new ImageTransform()

    // Process the image - resize to 200x200 and convert to webp
    const processedImage = await transformer.transform(new Uint8Array(buffer), {
      resize: {
        width: 200,
        height: 200,
        fit: "cover",
      },
      format: "webp",
      quality: 80,
    })

    // Generate a unique filename
    const fileExt = "webp"
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload the processed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, processedImage, {
        contentType: "image/webp",
        upsert: true,
      })

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      })
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabaseClient.storage.from("avatars").getPublicUrl(filePath)

    // Update the user's metadata with the new avatar URL
    const { error: updateError } = await supabaseClient.auth.updateUser({
      data: { avatar_url: publicUrlData.publicUrl },
    })

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      })
    }

    return new Response(
      JSON.stringify({
        message: "Avatar updated successfully",
        avatarUrl: publicUrlData.publicUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
