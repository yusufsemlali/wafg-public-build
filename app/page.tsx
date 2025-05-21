import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Users, Clock, Newspaper, Server, Heart, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function Home() {
  // Mock data for latest news
  const latestNews = [
    {
      id: 1,
      title: "New Map Rotation Added",
      excerpt: "We've added some classic maps back into the rotation based on community feedback.",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "Community Tournament Results",
      excerpt: "Congratulations to Team Nostalgia for winning our monthly tournament!",
      date: "1 week ago",
    },
    {
      id: 3,
      title: "Server Maintenance Complete",
      excerpt: "All servers have been updated with the latest security patches.",
      date: "2 weeks ago",
    },
  ]

  // Server data
  const servers = [
    {
      name: "WAFG Crazy Deathmatch de_dust2",
      description:
        "Among the best deathmatch servers you and your friends can play on with lots of action and drama every day.",
      ip: "5.135.138.17:27017",
      image: "/images/dust2-server.png",
      alt: "Dust2 Deathmatch Server",
    },
    {
      name: "WAFG Crazy Deathmatch cs_italy",
      description:
        "Experience intense deathmatch gameplay on the classic Italy map with players from around the world.",
      ip: "5.135.138.17:27018",
      image: "/images/italy-server.png",
      alt: "Italy Deathmatch Server",
    },
    {
      name: "WAFG Crazy AWP Deathmatch",
      description:
        "One of the best and most active AWP servers left in the CSS world with players from all over the world.",
      ip: "5.135.138.17:27019",
      image: "/images/awp-server.png",
      alt: "AWP Deathmatch Server",
    },
    {
      name: "WAFG Zombie Survival",
      description: "An optimized zombie survival server with hundreds of maps and teamwork-focused gameplay.",
      ip: "5.135.138.17:27016",
      image: "/images/zombie-server.png",
      alt: "Zombie Survival Server",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted relative"
          style={{
            backgroundImage: "url('/images/hero-background-small.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              
              <div className="space-x-4 pt-10">
                <Link href="/servers">
                  <Button size="lg">Our Servers</Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div> 
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to <span className="text-primary">WAFG</span> Community
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  WAFG Game Community with players from all over the world
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/servers">
                  <Button size="lg">Our Servers</Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Community Values Section */}
        <section className="w-full py-12 md:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Community Values</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  WAFG is all about love and respect
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Love and Respect</h3>
                <p className="mt-2 text-muted-foreground">
                  Our community is built on mutual respect and a shared passion for gaming.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">High Performance</h3>
                <p className="mt-2 text-muted-foreground">
                  High quality servers with high performance and 100 tickrate for the best gaming experience.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dedicated Admins</h3>
                <p className="mt-2 text-muted-foreground">
                  Experienced and dedicated team of admins available 24/7. All admins are players too!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Game Servers Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Game Servers</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  The best gaming experience you and your friends can have
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {servers.map((server, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={server.image || "/placeholder.svg"}
                      alt={server.alt}
                      width={350}
                      height={200}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{server.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center text-sm font-mono bg-muted px-2 py-1 rounded mt-2">
                        <Server className="h-4 w-4 mr-2" />
                        {server.ip}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{server.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/servers">
                <Button size="lg">View Detailed Server Info</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Latest News</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Stay updated with the latest happenings in our community
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {latestNews.map((news) => (
                <Card key={news.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{news.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {news.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">{news.excerpt}</CardContent>
                  <div className="p-4 pt-0">
                    <Link href={`/news/${news.id}`}>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/news">
                <Button variant="outline">View All News</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join Our Community</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  We're more than just servers - we're a family of CS:Source enthusiasts
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Active Community</h3>
                <p className="mt-2 text-muted-foreground">
                  Join over 500 active players who share your passion for Counter-Strike: Source.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dedicated Servers</h3>
                <p className="mt-2 text-muted-foreground">
                  Our servers are maintained by passionate admins who ensure the best gaming experience.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Regular Events</h3>
                <p className="mt-2 text-muted-foreground">
                  Participate in our monthly tournaments, special game modes, and community meetups.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link href="/auth/sign-up">
                <Button size="lg">Join Our Community</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
