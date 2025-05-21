import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, User, Tag } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  // Mock data for news articles
  const newsArticles = [
    {
      id: 1,
      title: "New Map Rotation Added",
      excerpt:
        "We've added some classic maps back into the rotation based on community feedback. The rotation now includes de_aztec, de_cbble, and cs_italy.",
      content:
        "Based on the recent community survey, we've decided to bring back some classic maps that many of you have been missing. Starting today, you'll find de_aztec, de_cbble, and cs_italy in our map rotation server. These maps have been carefully configured to provide the authentic CS:Source experience we all love. Let us know what you think about these additions!",
      date: "June 5, 2023",
      author: "OldSchoolPlayer",
      tags: ["Maps", "Server Update"],
    },
    {
      id: 2,
      title: "Community Tournament Results",
      excerpt:
        "Congratulations to Team Nostalgia for winning our monthly tournament! It was a close final match against The Headhunters.",
      content:
        "Our May tournament concluded last weekend with an exciting final between Team Nostalgia and The Headhunters. After three intense maps (de_dust2, de_inferno, and de_nuke), Team Nostalgia emerged victorious with a 2-1 score. Special congratulations to FragMaster2000 for being the MVP with an impressive 78 frags across all three maps. Thanks to everyone who participated and made this event a success!",
      date: "May 28, 2023",
      author: "RetroFragger",
      tags: ["Tournament", "Community Event"],
    },
    {
      id: 3,
      title: "Server Maintenance Complete",
      excerpt: "All servers have been updated with the latest security patches and performance improvements.",
      content:
        "We've completed our scheduled maintenance on all four servers. This update includes the latest security patches, performance optimizations, and some minor bug fixes. You should notice improved stability and slightly better performance, especially during peak hours. If you encounter any issues after this update, please report them in our Discord server.",
      date: "May 20, 2023",
      author: "TacticalTom",
      tags: ["Maintenance", "Server Update"],
    },
    {
      id: 4,
      title: "Zombie Mod Server Enhancements",
      excerpt: "New zombie types, weapons, and maps have been added to our Zombie Mod server.",
      content:
        "The Zombie Mod server has received a major update with new content! We've added three new zombie types (Tank, Hunter, and Witch), five new weapons, and two new maps (zm_castle and zm_subway). These additions should bring fresh excitement to our zombie survival gameplay. Jump in and check out the new features!",
      date: "May 15, 2023",
      author: "ZombieHunter",
      tags: ["Zombie Mod", "Server Update"],
    },
    {
      id: 5,
      title: "June Community Tournament Announced",
      excerpt: "Registration is now open for our June 5v5 tournament. Sign up your team today!",
      content:
        "We're excited to announce our June 5v5 tournament, scheduled for June 15th at 8:00 PM CEST. The format will be single elimination, best-of-three maps for semifinals and finals, and best-of-one for earlier rounds. The winning team will receive special Discord roles and bragging rights until the next tournament. To register, visit the Events section or contact an admin on Discord.",
      date: "May 10, 2023",
      author: "OldSchoolPlayer",
      tags: ["Tournament", "Announcement"],
    },
    {
      id: 6,
      title: "Community Spotlight: ClassicGamer",
      excerpt:
        "This month's community spotlight features ClassicGamer, who has been with us since 2008 and helps moderate our servers.",
      content:
        "For our May community spotlight, we're featuring ClassicGamer, one of our longest-standing members. ClassicGamer joined WAFG in 2008 and has been an active part of our community ever since. They've participated in nearly every tournament, helped moderate our servers, and contributed countless hours to keeping our community friendly and welcoming. In this interview, ClassicGamer shares their favorite CS:Source memories and what keeps them coming back to our servers after all these years.",
      date: "May 5, 2023",
      author: "RetroFragger",
      tags: ["Community Spotlight", "Interview"],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">News & Updates</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Stay updated with the latest happenings in our community, server updates, event announcements, and more.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{article.date}</span>
                  <span className="text-muted-foreground">•</span>
                  <User className="h-3 w-3" />
                  <span>{article.author}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p>{article.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/news/${article.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
