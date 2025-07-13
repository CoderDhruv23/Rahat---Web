import Link from "next/link"
import { AlertTriangle, Users, Building, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Coordinating Relief Efforts When It Matters Most
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  RAHAT: Rescue & assistance for Humanitarian Aids & Tracking
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A platform for citizens, NGOs, and Search & Rescue teams to coordinate effectively during disaster
                  relief operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" variant="accent">
                    <Link href="/sos">SOS Emergency</Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link href="/map">View Map</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Disaster Relief"
                  className="rounded-lg object-cover"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How You Can Help</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides tools for everyone to contribute to disaster relief efforts.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Report Missing Persons</h3>
                    <p className="text-muted-foreground">
                      Submit details of missing persons to help search and rescue teams.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Report Infrastructure Damage</h3>
                    <p className="text-muted-foreground">
                      Mark damaged locations on the map to help prioritize repairs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Request Supplies</h3>
                    <p className="text-muted-foreground">
                      Request aid which will be displayed for NGOs to coordinate delivery.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <AlertTriangle className="h-6 w-6 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">SOS Emergency</h3>
                    <p className="text-muted-foreground">
                      Send your live location in case of emergency for immediate assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join the Relief Effort</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're a citizen, NGO, or search and rescue team, your contribution matters.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href="/report-missing">Report Missing Person</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">NGO/S&R Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Disaster Relief Platform. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

