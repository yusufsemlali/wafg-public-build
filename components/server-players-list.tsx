import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Player {
  name: string
  score: number
  time: string
}

interface ServerPlayersListProps {
  players: Player[]
}

export function ServerPlayersList({ players }: ServerPlayersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Players</CardTitle>
        <CardDescription>Players currently on the server</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell className="text-right">{player.score}</TableCell>
                  <TableCell className="text-right">{player.time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  No players currently online
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
