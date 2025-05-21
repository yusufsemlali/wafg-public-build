"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

interface NewServerFormProps {
  user: User
}

export function NewServerForm({ user }: NewServerFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverName, setServerName] = useState("")
  const [serverType, setServerType] = useState("casual")
  const [region, setRegion] = useState("eu-west")
  const [map, setMap] = useState("de_dust2")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would create the server in your database
      // For demo purposes, we'll just show a success message

      toast({
        title: "Server deployment started",
        description: "Your new server is being deployed. This may take a few minutes.",
      })

      // Simulate server creation delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error deploying your server.",
        variant: "destructive",
      })
      console.error("Error creating server:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Configuration</CardTitle>
        <CardDescription>Configure your new Counter-Strike server</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input
                id="server-name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="My Awesome Server"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Server Type</Label>
              <RadioGroup value={serverType} onValueChange={setServerType} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="casual" id="casual" className="peer sr-only" />
                  <Label
                    htmlFor="casual"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-semibold">Casual</span>
                    <span className="text-xs text-muted-foreground">12 players</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="competitive" id="competitive" className="peer sr-only" />
                  <Label
                    htmlFor="competitive"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-semibold">Competitive</span>
                    <span className="text-xs text-muted-foreground">10 players</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="community" id="community" className="peer sr-only" />
                  <Label
                    htmlFor="community"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm font-semibold">Community</span>
                    <span className="text-xs text-muted-foreground">32 players</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eu-west">Europe West</SelectItem>
                  <SelectItem value="eu-east">Europe East</SelectItem>
                  <SelectItem value="us-east">US East</SelectItem>
                  <SelectItem value="us-west">US West</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="map">Starting Map</Label>
              <Select value={map} onValueChange={setMap}>
                <SelectTrigger id="map">
                  <SelectValue placeholder="Select map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de_dust2">Dust II</SelectItem>
                  <SelectItem value="de_mirage">Mirage</SelectItem>
                  <SelectItem value="de_inferno">Inferno</SelectItem>
                  <SelectItem value="de_nuke">Nuke</SelectItem>
                  <SelectItem value="de_overpass">Overpass</SelectItem>
                  <SelectItem value="de_vertigo">Vertigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Deploying Server..." : "Deploy Server"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t bg-muted/50 p-4 text-sm text-muted-foreground">
        <p>Your server will be ready in a few minutes after deployment.</p>
        <p>You will be charged according to your plan and server usage.</p>
      </CardFooter>
    </Card>
  )
}
