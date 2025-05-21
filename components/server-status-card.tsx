import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ServerStatusCardProps {
  server: {
    name: string
    description: string
    status: string
    players: number
    maxPlayers: number
    currentMap: string
  }
}

export function ServerStatusCard({ server }: ServerStatusCardProps) {
  const playerPercentage = (server.players / server.maxPlayers) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>{server.name}</CardTitle>
        <CardDescription>{server.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <span className="flex items-center">
            <span
              className={`h-2 w-2 rounded-full mr-2 ${server.status === "online" ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            {server.status === "online" ? "Online" : "Offline"}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Players:</span>
            <span>
              {server.players}/{server.maxPlayers}
            </span>
          </div>
          <Progress value={playerPercentage} className="h-2" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Map:</span>
          <span>{server.currentMap}</span>
        </div>
      </CardContent>
    </Card>
  )
}
