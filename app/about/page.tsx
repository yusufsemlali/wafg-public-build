import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutPage() {
  // Mock data for team members
  const teamMembers = [
    {
      name: "OldSchoolPlayer",
      role: "Founder & Admin",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Playing CS since 1.6 and founded WAFG in 2005 to keep the community alive.",
    },
    {
      name: "FragMaster2000",
      role: "Server Admin",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Responsible for server maintenance and technical infrastructure.",
    },
    {
      name: "RetroFragger",
      role: "Community Manager",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Organizes events and manages our Discord and Steam communities.",
    },
    {
      name: "TacticalTom",
      role: "Moderator",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Ensures our servers remain friendly and welcoming for all players.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">About WAFG</h1>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <div className="prose max-w-none dark:prose-invert">
              <p>
                WAFG (We Are For Gaming) was founded in 2005 by a group of friends who shared a passion for
                Counter-Strike: Source. What started as a single server for friends has grown into a tight-knit
                community of dedicated players who continue to enjoy CS:Source even as newer games have come and gone.
              </p>
              <p>
                Our mission has always been simple: keep the spirit of Counter-Strike: Source alive and provide a
                welcoming environment for both veterans and newcomers. We believe that CS:Source represents a golden era
                of tactical FPS gaming, with We believe that CS:Source represents a golden era of tactical FPS gaming,
                with its perfect balance of skill, strategy, and teamwork that newer games haven't quite captured in the
                same way.
              </p>
              <p>
                Over the years, our community has evolved, but our core values remain the same: friendship, fair play,
                and a shared love for the game. Many of our members have been with us for over a decade, creating
                lasting friendships that extend beyond the virtual world.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Servers</h2>
            <div className="prose max-w-none dark:prose-invert">
              <p>
                WAFG maintains four dedicated Counter-Strike: Source servers, each offering a different gameplay
                experience:
              </p>
              <ul>
                <li>
                  <strong>Dust2 24/7</strong> - The classic map that never gets old, always available for quick matches.
                </li>
                <li>
                  <strong>Map Rotation</strong> - A carefully curated selection of classic CS:Source maps, rotating
                  regularly.
                </li>
                <li>
                  <strong>Gungame</strong> - Progress through all weapons to win, a fun alternative to standard
                  gameplay.
                </li>
                <li>
                  <strong>Zombie Mod</strong> - Survive against zombie hordes in this popular modification.
                </li>
              </ul>
              <p>
                All our servers are maintained by dedicated admins who ensure they run smoothly and remain free from
                cheaters and toxic behavior. We regularly update our server configurations based on community feedback.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Meet the Team</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Whether you're a veteran CS:Source player looking for a new home or a newcomer interested in
                experiencing this classic game, we welcome you to join our community. Here's how you can get involved:
              </p>
              <ul>
                <li>Create an account on our website to stay updated with news and events</li>
                <li>Join our Discord server to chat with other members</li>
                <li>Connect to our game servers and start playing</li>
                <li>Participate in our monthly tournaments and special events</li>
              </ul>
              <p>
                We pride ourselves on maintaining a friendly, respectful, and inclusive environment. Our community
                guidelines are simple: be respectful, play fair, and have fun.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
