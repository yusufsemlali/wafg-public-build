import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  try {
    // Make sure we have the environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    // Create and return the browser client
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey)

    // Verify the client has the auth property
    if (!client || !client.auth) {
      console.error("Supabase client created but auth is not available")
      throw new Error("Supabase client initialization failed")
    }

    return client
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a dummy client that won't throw errors when methods are called
    // This prevents the app from crashing when the client can't be created
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => {
          console.error("Attempted to sign in with dummy client")
          return {
            data: null,
            error: { message: "Authentication service unavailable" },
          }
        },
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    } as any
  }
}
