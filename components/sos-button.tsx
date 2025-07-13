"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addSOSAlert } from "@/lib/data"

export function SOSButton() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendSOS = async () => {
    setSending(true)
    setError(null)

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          try {
            // Create SOS alert in Firebase
            await addSOSAlert({
              name: "Emergency SOS",
              contactInfo: "Emergency Contact",
              description: "Emergency SOS signal sent from mobile device",
              location,
            })

            setSending(false)
            setSent(true)

            // Reset after 5 seconds
            setTimeout(() => {
              setSent(false)
            }, 5000)
          } catch (error) {
            console.error("Error sending SOS alert:", error)
            setError("Failed to send SOS alert. Please try again.")
            setSending(false)
          }
        },
        (err) => {
          setSending(false)
          setError("Unable to retrieve your location. Please enable location services.")
          console.error("Error getting location:", err)
        },
      )
    } else {
      setSending(false)
      setError("Geolocation is not supported by your browser.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="h-16 w-16 text-accent mb-4" />
      <h2 className="text-2xl font-bold mb-2">Emergency SOS</h2>
      <p className="text-muted-foreground mb-6">
        Press the button below to send an emergency SOS signal with your current location.
      </p>

      {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 max-w-md">{error}</div>}

      {sent ? (
        <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 max-w-md">
          SOS signal sent successfully! Emergency services have been notified.
        </div>
      ) : (
        <Button
          variant="accent"
          size="lg"
          className="w-full max-w-md h-16 text-lg font-bold"
          onClick={sendSOS}
          disabled={sending}
        >
          {sending ? "Sending SOS..." : "SEND SOS"}
        </Button>
      )}

      <p className="text-sm text-muted-foreground mt-4 max-w-md">
        Only use this button in case of a real emergency. Your location will be shared with emergency services.
      </p>
    </div>
  )
}

