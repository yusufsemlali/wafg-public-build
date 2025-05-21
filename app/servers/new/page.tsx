import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NewServerForm } from "@/components/new-server-form"

export default async function NewServerPage() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Auth error:", error.message)
      redirect("/auth/login")
    }

    if (!data?.user) {
      console.log("No user found")
      redirect("/auth/login")
    }

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <h1 className="text-3xl font-bold mb-6">Deploy New Server</h1>

          <div className="max-w-3xl mx-auto">
            <NewServerForm user={data.user} />
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    redirect("/auth/login")
  }
}
