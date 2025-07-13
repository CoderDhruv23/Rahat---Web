import { Navbar } from "@/components/navbar"
import { SOSButton } from "@/components/sos-button"

export default function SOSPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl py-12">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Emergency SOS</h1>
          <div className="w-full max-w-md">
            <SOSButton />
          </div>
        </div>
      </main>
    </div>
  )
}

