import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ServerMapRotationProps {
  maps: string[]
  currentMap: string
}

export function ServerMapRotation({ maps, currentMap }: ServerMapRotationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Rotation</CardTitle>
        <CardDescription>Maps available on this server</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {maps.map((map) => (
            <Badge key={map} variant={map === currentMap ? "default" : "outline"}>
              {map}
              {map === currentMap && " (Current)"}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
