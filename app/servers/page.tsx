import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServerStatusCard } from "@/components/server-status-card"
import { ServerPlayersList } from "@/components/server-players-list"
import { ServerMapRotation } from "@/components/server-map-rotation"

export default function ServersPage() {
  // Mock data for our servers
  const servers = [
    {
      id: "dust2",
      name: "WAFG Crazy Deathmatch de_dust2",
      description:
        "Among the best deathmatch servers you and your friends can play on and you will soon discover that we have put in an extreme amount of time to make this crazy server work in a good way.",
      ip: "5.135.138.17:27017",
      status: "online",
      players: 16,
      maxPlayers: 24,
      currentMap: "de_dust2",
      mapRotation: ["de_dust2"],
      activeUsers: [
        { name: "OldSchoolPlayer", score: 32, time: "1:45:22" },
        { name: "FragMaster2000", score: 28, time: "1:12:05" },
        { name: "HeadshotHero", score: 25, time: "0:55:18" },
        { name: "SniperElite", score: 22, time: "1:30:45" },
        { name: "TacticalTom", score: 18, time: "0:45:30" },
      ],
    },
    {
      id: "italy",
      name: "WAFG Crazy Deathmatch cs_italy",
      description:
        "Experience intense deathmatch gameplay on the classic Italy map with players from around the world.",
      ip: "5.135.138.17:27018",
      status: "online",
      players: 12,
      maxPlayers: 24,
      currentMap: "cs_italy",
      mapRotation: ["cs_italy"],
      activeUsers: [
        { name: "ClassicGamer", score: 24, time: "0:55:12" },
        { name: "RetroFragger", score: 20, time: "1:05:33" },
        { name: "OldSchoolSniper", score: 18, time: "0:45:18" },
        { name: "TacticalPlayer", score: 15, time: "0:30:45" },
      ],
    },
    {
      id: "awp",
      name: "WAFG Crazy AWP Deathmatch",
      description:
        "One of the best and most active AWP servers left in the CSS world. Players from all over the world with a good atmosphere where we create a good server where everyone is welcome.",
      ip: "5.135.138.17:27019",
      status: "online",
      players: 8,
      maxPlayers: 16,
      currentMap: "awp_map",
      mapRotation: ["awp_map", "awp_india", "awp_dust"],
      activeUsers: [
        { name: "WeaponMaster", score: 30, time: "0:35:22" },
        { name: "GunExpert", score: 28, time: "0:42:15" },
        { name: "KnifeFinisher", score: 25, time: "0:25:48" },
      ],
    },
    {
      id: "zombie",
      name: "WAFG Zombie Survival",
      description:
        "An optimized zombie survival server where a lot of time has been spent making the server very good. Here we offer crazy rounds with players from all over the world.",
      ip: "5.135.138.17:27016",
      status: "online",
      players: 20,
      maxPlayers: 32,
      currentMap: "zm_lila_panic",
      mapRotation: ["zm_lila_panic", "zm_toxic_house2", "zm_dust_world", "zm_ice_attack"],
      activeUsers: [
        { name: "ZombieHunter", score: 45, time: "1:15:22" },
        { name: "SurvivorPro", score: 42, time: "1:22:05" },
        { name: "LastManStanding", score: 38, time: "0:55:18" },
        { name: "InfectionSpreader", score: 35, time: "1:10:42" },
        { name: "ZombieSlayer", score: 32, time: "0:48:33" },
        { name: "BrainEater", score: 30, time: "1:05:15" },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">Our Servers</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          WAFG maintains four dedicated Counter-Strike: Source servers for our community. Each server offers a unique
          gameplay experience. Connect directly using the server IPs or join through our Steam group.
        </p>

        <Tabs defaultValue="dust2" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dust2">Dust2 DM</TabsTrigger>
            <TabsTrigger value="italy">Italy DM</TabsTrigger>
            <TabsTrigger value="awp">AWP DM</TabsTrigger>
            <TabsTrigger value="zombie">Zombie</TabsTrigger>
          </TabsList>

          {servers.map((server) => (
            <TabsContent key={server.id} value={server.id} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ServerStatusCard server={server} />
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Info</CardTitle>
                    <CardDescription>How to join our server</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Direct Connect</h3>
                      <div className="bg-muted p-2 rounded-md font-mono text-sm">connect {server.ip}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Copy and paste this command into your CS:Source console
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Server IP</h3>
                      <div className="bg-muted p-2 rounded-md font-mono text-sm">{server.ip}</div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Join via Steam</h3>
                      <p className="text-sm">
                        You can also join through our{" "}
                        <a
                          href="https://steamcommunity.com/groups/wafg"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Steam Group
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <ServerPlayersList players={server.activeUsers} />
                <ServerMapRotation maps={server.mapRotation} currentMap={server.currentMap} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  )
}
