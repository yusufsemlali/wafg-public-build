import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunityMembers } from "@/components/community-members"
import { CommunityEvents } from "@/components/community-events"
import { Discord, Steam } from "@/components/social-icons"
import Link from "next/link"

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">WAFG Community</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          We're more than just a gaming community - we're a family of Counter-Strike: Source enthusiasts who have been
          playing together for years. Join us and become part of our story.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Join Our Discord</CardTitle>
              <CardDescription>Chat with community members</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Discord className="h-12 w-12 mb-4 text-primary" />
              <p className="text-center mb-4">
                Join our Discord server to chat with other members, get server announcements, and participate in voice
                chat during games.
              </p>
              <Button className="w-full" asChild>
                <Link href="https://discord.gg/wafg" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Steam Group</CardTitle>
              <CardDescription>Join our Steam community</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Steam className="h-12 w-12 mb-4 text-primary" />
              <p className="text-center mb-4">
                Our Steam group makes it easy to find and join our servers, get notified about events, and connect with
                other players.
              </p>
              <Button className="w-full" asChild>
                <Link href="https://steamcommunity.com/groups/wafg" target="_blank" rel="noopener noreferrer">
                  Join Steam Group
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Tournaments</CardTitle>
              <CardDescription>Compete with the community</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 mb-4 text-primary"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <p className="text-center mb-4">
                Participate in our monthly tournaments with prizes for the winners. Sign up as a team or join as a solo
                player.
              </p>
              <Button className="w-full" asChild>
                <Link href="/events">View Tournaments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="members">Community Members</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <CommunityMembers />
          </TabsContent>

          <TabsContent value="events">
            <CommunityEvents />
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  )
}
