import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Server, Play, Pause, BarChart, SettingsIcon, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
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

    // Mock server data - in a real app, this would come from your database
    const servers = [
      {
        id: "srv-1",
        name: "Dust2 24/7",
        type: "Casual",
        status: "online",
        region: "EU West",
        players: "12/24",
        ip: "45.123.45.67:27015",
      },
      {
        id: "srv-2",
        name: "Competitive Mirage",
        type: "Competitive",
        status: "offline",
        region: "US East",
        players: "0/10",
        ip: "67.231.12.88:27015",
      },
    ]

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Servers</h1>
            <Link href="/servers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Server
              </Button>
            </Link>
          </div>

          {servers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {servers.map((server) => (
                <Card key={server.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{server.name}</CardTitle>
                      <Badge variant={server.status === "online" ? "default" : "secondary"}>
                        {server.status === "online" ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {server.type} • {server.region}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Players:</span>
                        <span>{server.players}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IP:</span>
                        <span className="font-mono">{server.ip}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 p-2">
                    <div className="flex gap-1">
                      {server.status === "online" ? (
                        <Button size="sm" variant="ghost">
                          <Pause className="h-4 w-4 mr-1" />
                          Stop
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <BarChart className="h-4 w-4 mr-1" />
                        Stats
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost">
                      <SettingsIcon className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No Servers Found</h3>
              <p className="mb-6 text-muted-foreground">
                You don't have any game servers yet. Deploy your first server to get started.
              </p>
              <Link href="/servers/new">
                <Button>Deploy New Server</Button>
              </Link>
            </Card>
          )}

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Server Usage</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23%</div>
                  <p className="text-xs text-muted-foreground">Average across all servers</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.8 GB</div>
                  <p className="text-xs text-muted-foreground">Total memory used</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Currently playing on your servers</p>
                </CardContent>
              </Card>
            </div>
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
