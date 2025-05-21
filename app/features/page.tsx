import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Features</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover all the powerful tools and features that make our platform stand out.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
              {/* Feature 1 */}
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <h3 className="text-2xl font-bold">Seamless Integration</h3>
                <p className="text-muted-foreground">
                  Connect with your favorite tools and services without any hassle. Our platform integrates with over
                  100 popular services.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <h3 className="text-2xl font-bold">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights with our powerful analytics dashboard. Track performance, monitor trends, and
                  make data-driven decisions.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <h3 className="text-2xl font-bold">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Your data is protected with industry-leading security measures. We use end-to-end encryption and
                  regular security audits.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <h3 className="text-2xl font-bold">Collaborative Workspace</h3>
                <p className="text-muted-foreground">
                  Work together with your team in real-time. Share documents, assign tasks, and communicate efficiently.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <h3 className="text-2xl font-bold">Automated Workflows</h3>
                <p className="text-muted-foreground">
                  Save time with automated workflows. Set up triggers and actions to automate repetitive tasks.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="flex flex-col space-y-3 rounded-lg border p-6">
                <h3 className="text-2xl font-bold">Mobile Access</h3>
                <p className="text-muted-foreground">
                  Access your workspace from anywhere with our mobile app. Stay productive on the go.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
