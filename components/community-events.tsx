import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin } from "lucide-react"
import Link from "next/link"

// Mock data for community events
const upcomingEvents = [
  {
    id: 1,
    title: "Monthly 5v5 Tournament",
    description: "Our regular monthly tournament with prizes for the winning team.",
    date: "June 15, 2023",
    time: "8:00 PM CEST",
    location: "Competitive Server",
    participants: "8 teams registered",
    registrationOpen: true,
  },
  {
    id: 2,
    title: "Zombie Survival Night",
    description: "How long can you survive against the zombie horde? Join us for a special zombie event.",
    date: "June 22, 2023",
    time: "9:00 PM CEST",
    location: "Zombie Mod Server",
    participants: "Open to all",
    registrationOpen: true,
  },
  {
    id: 3,
    title: "Old School Maps Marathon",
    description: "Playing through all the classic CS maps in one session. Nostalgia guaranteed!",
    date: "July 1, 2023",
    time: "7:00 PM CEST",
    location: "Rotation Server",
    participants: "Open to all",
    registrationOpen: true,
  },
  {
    id: 4,
    title: "Community Meeting",
    description: "Monthly community meeting to discuss server updates, upcoming events, and community feedback.",
    date: "July 5, 2023",
    time: "8:30 PM CEST",
    location: "Discord Voice Channel",
    participants: "All members welcome",
    registrationOpen: false,
  },
]

export function CommunityEvents() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {upcomingEvents.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{event.date}</p>
                <p className="text-xs text-muted-foreground">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <p className="text-sm">{event.location}</p>
            </div>
            <div className="flex items-start">
              <Users className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <p className="text-sm">{event.participants}</p>
            </div>
          </CardContent>
          <CardFooter>
            {event.registrationOpen ? (
              <Button className="w-full" asChild>
                <Link href={`/events/${event.id}`}>Register</Link>
              </Button>
            ) : (
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
