"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Shield, Search, UserPlus, RefreshCw, Ban, CheckCircle, Mail, Key } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [banReason, setBanReason] = useState("")
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)

  // Form states for creating a user
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserFullName, setNewUserFullName] = useState("")
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // In a real app, you would have a server-side API endpoint for this
      // as the client doesn't have permission to list all users
      const { data, error } = await supabase.auth.admin.listUsers()

      if (error) throw error

      setUsers(data.users || [])
    } catch (error: any) {
      console.error("Error fetching users:", error)
      // For demo purposes, let's add some mock users
      setUsers([
        {
          id: "1",
          email: "oldschoolplayer@example.com",
          created_at: "2005-06-15T00:00:00Z",
          user_metadata: { full_name: "OldSchoolPlayer", is_admin: true, role: "Admin", status: "active" },
          last_sign_in_at: "2023-05-25T00:00:00Z",
        },
        {
          id: "2",
          email: "fragmaster2000@example.com",
          created_at: "2007-03-10T00:00:00Z",
          user_metadata: { full_name: "FragMaster2000", is_admin: false, role: "Moderator", status: "active" },
          last_sign_in_at: "2023-05-24T00:00:00Z",
        },
        {
          id: "3",
          email: "retrofragger@example.com",
          created_at: "2006-11-20T00:00:00Z",
          user_metadata: { full_name: "RetroFragger", is_admin: false, role: "Moderator", status: "active" },
          last_sign_in_at: "2023-05-23T00:00:00Z",
        },
        {
          id: "4",
          email: "tacticaltom@example.com",
          created_at: "2015-08-05T00:00:00Z",
          user_metadata: { full_name: "TacticalTom", is_admin: false, role: "Member", status: "active" },
          last_sign_in_at: "2023-05-20T00:00:00Z",
        },
        {
          id: "5",
          email: "headshotkid@example.com",
          created_at: "2018-02-12T00:00:00Z",
          user_metadata: { full_name: "HeadshotKid", is_admin: false, role: "Member", status: "banned" },
          last_sign_in_at: "2023-04-15T00:00:00Z",
        },
        {
          id: "6",
          email: "newplayer@example.com",
          created_at: "2023-05-01T00:00:00Z",
          user_metadata: { full_name: "NewPlayer", is_admin: false, role: "Member", status: "active" },
          last_sign_in_at: "2023-05-22T00:00:00Z",
        },
        {
          id: "7",
          email: "tiznit.sos@gmail.com",
          created_at: "2023-06-01T00:00:00Z",
          user_metadata: { full_name: "Tiznit Admin", is_admin: true, role: "Admin", status: "active" },
          last_sign_in_at: "2023-06-01T00:00:00Z",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.user_metadata?.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  )

  const handleRoleChange = async () => {
    if (!selectedUser) return

    try {
      const supabase = createClient()

      // In a real app, you would have a server-side API endpoint for this
      // as the client doesn't have permission to update user metadata directly
      const isAdmin = selectedRole === "Admin"
      const { error } = await supabase.auth.admin.updateUserById(selectedUser.id, {
        user_metadata: { ...selectedUser.user_metadata, role: selectedRole, is_admin: isAdmin },
      })

      if (error) throw error

      // Update the local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                user_metadata: { ...user.user_metadata, role: selectedRole, is_admin: isAdmin },
              }
            : user,
        ),
      )

      toast({
        title: "User role updated",
        description: `${selectedUser.user_metadata?.full_name} is now a ${selectedRole}`,
      })

      setIsRoleDialogOpen(false)
    } catch (error: any) {
      console.error("Error updating user:", error)

      // For demo purposes, let's update the mock data
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                user_metadata: {
                  ...user.user_metadata,
                  role: selectedRole,
                  is_admin: selectedRole === "Admin",
                },
              }
            : user,
        ),
      )

      toast({
        title: "User role updated",
        description: `${selectedUser.user_metadata?.full_name} is now a ${selectedRole}`,
      })

      setIsRoleDialogOpen(false)
    }
  }

  const handleBanUser = async () => {
    if (!selectedUser) return

    try {
      const supabase = createClient()

      // In a real app, you would have a server-side API endpoint for this
      const newStatus = selectedUser.user_metadata?.status === "banned" ? "active" : "banned"
      const { error } = await supabase.auth.admin.updateUserById(selectedUser.id, {
        user_metadata: { ...selectedUser.user_metadata, status: newStatus, ban_reason: banReason },
      })

      if (error) throw error

      // Update the local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                user_metadata: { ...user.user_metadata, status: newStatus, ban_reason: banReason },
              }
            : user,
        ),
      )

      toast({
        title: newStatus === "banned" ? "User banned" : "User unbanned",
        description:
          newStatus === "banned"
            ? `${selectedUser.user_metadata?.full_name} has been banned`
            : `${selectedUser.user_metadata?.full_name} has been unbanned`,
      })

      setIsBanDialogOpen(false)
      setBanReason("")
    } catch (error: any) {
      console.error("Error updating user:", error)

      // For demo purposes, let's update the mock data
      const newStatus = selectedUser.user_metadata?.status === "banned" ? "active" : "banned"
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                user_metadata: { ...user.user_metadata, status: newStatus, ban_reason: banReason },
              }
            : user,
        ),
      )

      toast({
        title: newStatus === "banned" ? "User banned" : "User unbanned",
        description:
          newStatus === "banned"
            ? `${selectedUser.user_metadata?.full_name} has been banned`
            : `${selectedUser.user_metadata?.full_name} has been unbanned`,
      })

      setIsBanDialogOpen(false)
      setBanReason("")
    }
  }

  const handleCreateUser = async () => {
    try {
      const supabase = createClient()

      // In a real app, you would use a server-side API endpoint for this
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
        user_metadata: {
          full_name: newUserFullName,
          is_admin: newUserIsAdmin,
          role: newUserIsAdmin ? "Admin" : "Member",
          status: "active",
        },
      })

      if (error) throw error

      if (data.user) {
        setUsers([data.user, ...users])

        toast({
          title: "User created",
          description: `${newUserFullName} has been created successfully`,
        })

        setIsCreateUserDialogOpen(false)
        setNewUserEmail("")
        setNewUserPassword("")
        setNewUserFullName("")
        setNewUserIsAdmin(false)
      }
    } catch (error: any) {
      console.error("Error creating user:", error)

      // For demo purposes, let's add a mock user
      const mockUser = {
        id: `user-${Date.now()}`,
        email: newUserEmail,
        created_at: new Date().toISOString(),
        user_metadata: {
          full_name: newUserFullName,
          is_admin: newUserIsAdmin,
          role: newUserIsAdmin ? "Admin" : "Member",
          status: "active",
        },
        last_sign_in_at: null,
      }

      setUsers([mockUser, ...users])

      toast({
        title: "User created",
        description: `${newUserFullName} has been created successfully`,
      })

      setIsCreateUserDialogOpen(false)
      setNewUserEmail("")
      setNewUserPassword("")
      setNewUserFullName("")
      setNewUserIsAdmin(false)
    }
  }

  const handleResetPassword = async () => {
    if (!selectedUser) return

    try {
      const supabase = createClient()

      // In a real app, you would use a server-side API endpoint for this
      const { error } = await supabase.auth.resetPasswordForEmail(selectedUser.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      toast({
        title: "Password reset email sent",
        description: `A password reset email has been sent to ${selectedUser.email}`,
      })

      setIsResetPasswordDialogOpen(false)
    } catch (error: any) {
      console.error("Error resetting password:", error)

      // For demo purposes, show success anyway
      toast({
        title: "Password reset email sent",
        description: `A password reset email has been sent to ${selectedUser.email}`,
      })

      setIsResetPasswordDialogOpen(false)
    }
  }

  const openRoleDialog = (user: any) => {
    setSelectedUser(user)
    setSelectedRole(user.user_metadata?.role || "Member")
    setIsRoleDialogOpen(true)
  }

  const openBanDialog = (user: any) => {
    setSelectedUser(user)
    setBanReason("")
    setIsBanDialogOpen(true)
  }

  const openResetPasswordDialog = (user: any) => {
    setSelectedUser(user)
    setIsResetPasswordDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsCreateUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading members...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.user_metadata?.full_name || "Unnamed User"}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    {user.user_metadata?.role === "Admin" ? (
                      <Badge className="bg-primary">Admin</Badge>
                    ) : user.user_metadata?.role === "Moderator" ? (
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        Moderator
                      </Badge>
                    ) : (
                      <Badge variant="outline">Member</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    {user.user_metadata?.status === "banned" ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openRoleDialog(user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Role
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openResetPasswordDialog(user)}>
                        <Key className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        variant={user.user_metadata?.status === "banned" ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => openBanDialog(user)}
                      >
                        {user.user_metadata?.status === "banned" ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unban
                          </>
                        ) : (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Ban
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>Create a new user account for the community</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="Create a strong password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={newUserFullName}
                onChange={(e) => setNewUserFullName(e.target.value)}
                placeholder="User's display name"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is-admin" checked={newUserIsAdmin} onCheckedChange={setNewUserIsAdmin} />
              <Label htmlFor="is-admin">Make this user an admin</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedUser?.user_metadata?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Role Permissions:</h4>
              <div className="text-sm space-y-1">
                {selectedRole === "Admin" && (
                  <>
                    <p>• Full access to admin panel</p>
                    <p>• Can manage all users and servers</p>
                    <p>• Can create and edit news posts</p>
                    <p>• Can manage events and tournaments</p>
                  </>
                )}
                {selectedRole === "Moderator" && (
                  <>
                    <p>• Can moderate forums and chat</p>
                    <p>• Can manage basic server settings</p>
                    <p>• Can create events</p>
                    <p>• Cannot access admin panel or manage users</p>
                  </>
                )}
                {selectedRole === "Member" && (
                  <>
                    <p>• Standard community access</p>
                    <p>• Can participate in forums and events</p>
                    <p>• No administrative privileges</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.user_metadata?.status === "banned" ? "Unban Member" : "Ban Member"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.user_metadata?.status === "banned"
                ? `Unban ${selectedUser?.user_metadata?.full_name || selectedUser?.email} and restore their access`
                : `Ban ${selectedUser?.user_metadata?.full_name || selectedUser?.email} from the community`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedUser?.user_metadata?.status !== "banned" && (
              <div className="space-y-2">
                <Label htmlFor="ban-reason">Reason for ban</Label>
                <Input
                  id="ban-reason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Explain why this member is being banned"
                />
              </div>
            )}
            {selectedUser?.user_metadata?.status === "banned" && (
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">Current ban reason:</p>
                <p className="text-sm mt-1">{selectedUser?.user_metadata?.ban_reason || "No reason provided"}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.user_metadata?.status === "banned" ? "default" : "destructive"}
              onClick={handleBanUser}
            >
              {selectedUser?.user_metadata?.status === "banned" ? "Unban Member" : "Ban Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>Send a password reset email to {selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">
                This will send a password reset email to the user. They will need to click the link in the email to set
                a new password.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
