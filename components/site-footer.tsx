import Link from "next/link"
import { Discord, Steam } from "@/components/social-icons"

export function SiteFooter() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">WAFG Community</h3>
          <p className="text-sm text-muted-foreground">Keeping CS:Source alive since 2005</p>
          <div className="flex space-x-4 mt-2">
            <Link href="https://discord.gg/wafg" target="_blank" rel="noopener noreferrer">
              <Discord className="h-5 w-5" />
              <span className="sr-only">Discord</span>
            </Link>
            <Link href="https://steamcommunity.com/groups/wafg" target="_blank" rel="noopener noreferrer">
              <Steam className="h-5 w-5" />
              <span className="sr-only">Steam Group</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Community</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/servers" className="text-sm text-muted-foreground hover:text-foreground">
                Our Servers
              </Link>
              <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground">
                News
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
                Events
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">
                Guides
              </Link>
              <Link href="/downloads" className="text-sm text-muted-foreground hover:text-foreground">
                Downloads
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WAFG Community. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
