"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, RefreshCw, MoreHorizontal, Play, Pause, SettingsIcon, MessageSquare, Plus, Trash } from "lucide-react"

interface Server {
  id: string
  name: string
  description: string
  ip: string
  status: "online" | "offline"
  players: number
  maxPlayers: number
  currentMap: string
  lastRestart: string
}

export function AdminServerManagement() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false)
  const [restartReason, setRestartReason] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Form states
  const [serverName, setServerName] = useState("")
  const [serverDescription, setServerDescription] = useState("")
  const [serverIp, setServerIp] = useState("")
  const [serverMaxPlayers, setServerMaxPlayers] = useState("24")
  const [serverCurrentMap, setServerCurrentMap] = useState("")

  const fetchServers = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch this from your database
      // Mock data for demonstration
      setServers([
        {
          id: "dust2",
          name: "WAFG Crazy Deathmatch de_dust2",
          description:
            "Among the best deathmatch servers you and your friends can play on with lots of action and drama every day.",
          ip: "5.135.138.17:27017",
          status: "online",
          players: 16,
          maxPlayers: 24,
          currentMap: "de_dust2",
          lastRestart: "2023-05-28T14:30:00Z",
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
          lastRestart: "2023-05-29T08:15:00Z",
        },
        {
          id: "awp",
          name: "WAFG Crazy AWP Deathmatch",
          description:
            "One of the best and most active AWP servers left in the CSS world with players from all over the world.",
          ip: "5.135.138.17:27019",
          status: "online",
          players: 8,
          maxPlayers: 16,
          currentMap: "awp_map",
          lastRestart: "2023-05-30T10:45:00Z",
        },
        {
          id: "zombie",
          name: "WAFG Zombie Survival",
          description: "An optimized zombie survival server with hundreds of maps and teamwork-focused gameplay.",
          ip: "5.135.138.17:27016",
          status: "online",
          players: 20,
          maxPlayers: 32,
          currentMap: "zm_lila_panic",
          lastRestart: "2023-05-27T22:10:00Z",
        },
      ])
    } catch (error) {
      console.error("Error fetching servers:", error)
      toast({
        title: "Error",
        description: "Failed to load servers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [])

  const filteredServers = servers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.currentMap.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const resetForm = () => {
    setServerName("")
    setServerDescription("")
    setServerIp("")
    setServerMaxPlayers("24")
    setServerCurrentMap("")
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (server: Server) => {
    setSelectedServer(server)
    setServerName(server.name)
    setServerDescription(server.description)
    setServerIp(server.ip)
    setServerMaxPlayers(server.maxPlayers.toString())
    setServerCurrentMap(server.currentMap)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (server: Server) => {
    setSelectedServer(server)
    setIsDeleteDialogOpen(true)
  }

  const handleServerAction = (action: string, server: Server) => {
    switch (action) {
      case "restart":
        setSelectedServer(server)
        setIsRestartDialogOpen(true)
        break
      case "stop":
        toast({
          title: "Server stopped",
          description: `${server.name} has been stopped.`,
        })
        setServers(servers.map((s) => (s.id === server.id ? { ...s, status: "offline", players: 0 } : s)))
        break
      case "start":
        toast({
          title: "Server started",
          description: `${server.name} is now starting up.`,
        })
        setServers(servers.map((s) => (s.id === server.id ? { ...s, status: "online" } : s)))
        break
      case "announce":
        setSelectedServer(server)
        setIsAnnouncementDialogOpen(true)
        break
      case "edit":
        openEditDialog(server)
        break
      case "delete":
        openDeleteDialog(server)
        break
      default:
        break
    }
  }

  const handleRestartServer = () => {
    if (!selectedServer) return

    toast({
      title: "Server restarting",
      description: `${selectedServer.name} is being restarted. Reason: ${restartReason || "Routine maintenance"}`,
    })

    // Update the server status to simulate a restart
    setServers(
      servers.map((s) =>
        s.id === selectedServer.id
          ? { ...s, status: "online", lastRestart: new Date().toISOString(), players: Math.floor(s.players / 2) }
          : s,
      ),
    )

    setIsRestartDialogOpen(false)
    setRestartReason("")
  }

  const handleSendAnnouncement = () => {
    if (!selectedServer || !announcement) return

    toast({
      title: "Announcement sent",
      description: `Message sent to all players on ${selectedServer.name}`,
    })

    setIsAnnouncementDialogOpen(false)
    setAnnouncement("")
  }

  const handleCreateServer = () => {
    try {
      // In a real app, you would insert into your database
      const newServer: Server = {
        id: `server-${Date.now()}`,
        name: serverName,
        description: serverDescription,
        ip: serverIp,
        status: "offline",
        players: 0,
        maxPlayers: Number.parseInt(serverMaxPlayers),
        currentMap: serverCurrentMap,
        lastRestart: new Date().toISOString(),
      }

      setServers([...servers, newServer])
      setIsCreateDialogOpen(false)
      resetForm()

      toast({
        title: "Server created",
        description: "New server has been created successfully",
      })
    } catch (error) {
      console.error("Error creating server:", error)
      toast({
        title: "Error",
        description: "Failed to create server",
        variant: "destructive",
      })
    }
  }

  const handleUpdateServer = () => {
    if (!selectedServer) return

    try {
      // In a real app, you would update your database
      const updatedServer: Server = {
        ...selectedServer,
        name: serverName,
        description: serverDescription,
        ip: serverIp,
        maxPlayers: Number.parseInt(serverMaxPlayers),
        currentMap: serverCurrentMap,
      }

      setServers(servers.map((server) => (server.id === selectedServer.id ? updatedServer : server)))
      setIsEditDialogOpen(false)
      resetForm()

      toast({
        title: "Server updated",
        description: "Server has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating server:", error)
      toast({
        title: "Error",
        description: "Failed to update server",
        variant: "destructive",
      })
    }
  }

  const handleDeleteServer = () => {
    if (!selectedServer) return

    try {
      // In a real app, you would delete from your database
      setServers(servers.filter((server) => server.id !== selectedServer.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Server deleted",
        description: "Server has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting server:", error)
      toast({
        title: "Error",
        description: "Failed to delete server",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search servers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchServers}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Server
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Server</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Current Map</TableHead>
              <TableHead>Last Restart</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading servers...
                </TableCell>
              </TableRow>
            ) : filteredServers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No servers found
                </TableCell>
              </TableRow>
            ) : (
              filteredServers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell>
                    <div className="font-medium">{server.name}</div>
                    <div className="text-sm text-muted-foreground">{server.ip}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={server.status === "online" ? "default" : "secondary"}>
                      {server.status === "online" ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {server.players}/{server.maxPlayers}
                  </TableCell>
                  <TableCell>{server.currentMap}</TableCell>
                  <TableCell>{new Date(server.lastRestart).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {server.status === "online" ? (
                          <DropdownMenuItem onClick={() => handleServerAction("stop", server)}>
                            <Pause className="mr-2 h-4 w-4" />
                            Stop Server
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleServerAction("start", server)}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Server
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleServerAction("restart", server)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Restart Server
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleServerAction("announce", server)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Announcement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleServerAction("edit", server)}>
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          Edit Server
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleServerAction("delete", server)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Server
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Server Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Server</DialogTitle>
            <DialogDescription>Create a new game server for the community</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input
                id="server-name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="e.g., WAFG Deathmatch"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="server-description">Description</Label>
              <Textarea
                id="server-description"
                value={serverDescription}
                onChange={(e) => setServerDescription(e.target.value)}
                placeholder="Brief description of the server"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="server-ip">Server IP</Label>
              <Input
                id="server-ip"
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                placeholder="e.g., 5.135.138.17:27020"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="server-max-players">Max Players</Label>
                <Input
                  id="server-max-players"
                  type="number"
                  value={serverMaxPlayers}
                  onChange={(e) => setServerMaxPlayers(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="server-current-map">Default Map</Label>
                <Input
                  id="server-current-map"
                  value={serverCurrentMap}
                  onChange={(e) => setServerCurrentMap(e.target.value)}
                  placeholder="e.g., de_dust2"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateServer}>Create Server</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Server Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Server</DialogTitle>
            <DialogDescription>Update server configuration</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-server-name">Server Name</Label>
              <Input id="edit-server-name" value={serverName} onChange={(e) => setServerName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-server-description">Description</Label>
              <Textarea
                id="edit-server-description"
                value={serverDescription}
                onChange={(e) => setServerDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-server-ip">Server IP</Label>
              <Input id="edit-server-ip" value={serverIp} onChange={(e) => setServerIp(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-server-max-players">Max Players</Label>
                <Input
                  id="edit-server-max-players"
                  type="number"
                  value={serverMaxPlayers}
                  onChange={(e) => setServerMaxPlayers(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-server-current-map">Current Map</Label>
                <Input
                  id="edit-server-current-map"
                  value={serverCurrentMap}
                  onChange={(e) => setServerCurrentMap(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateServer}>Update Server</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Server Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Server</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this server? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedServer && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium">{selectedServer.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedServer.ip}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteServer}>
              Delete Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restart Server Dialog */}
      <Dialog open={isRestartDialogOpen} onOpenChange={setIsRestartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restart Server</DialogTitle>
            <DialogDescription>
              This will restart {selectedServer?.name}. All players will be disconnected.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="restart-reason">Reason for restart (optional)</Label>
              <Input
                id="restart-reason"
                value={restartReason}
                onChange={(e) => setRestartReason(e.target.value)}
                placeholder="e.g., Map change, Plugin update, etc."
              />
              <p className="text-xs text-muted-foreground">
                This message will be shown to players before the server restarts.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestartDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestartServer}>Restart Server</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Announcement Dialog */}
      <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Server Announcement</DialogTitle>
            <DialogDescription>Send a message to all players currently on {selectedServer?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="announcement">Announcement message</Label>
              <Textarea
                id="announcement"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Type your announcement here..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnnouncementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendAnnouncement} disabled={!announcement}>
              Send Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
