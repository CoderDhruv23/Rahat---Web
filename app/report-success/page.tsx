"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default function ReportSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [reportType, setReportType] = useState<string>("")

  useEffect(() => {
    const type = searchParams.get("type")
    if (type) {
      setReportType(type)
    } else {
      router.push("/")
    }
  }, [searchParams, router])

  const getSuccessMessage = () => {
    switch (reportType) {
      case "missing":
        return {
          title: "Missing Person Report Submitted",
          message:
            "Your missing person report has been successfully submitted. Search and rescue teams have been notified.",
        }
      case "damage":
        return {
          title: "Damage Report Submitted",
          message:
            "Your infrastructure damage report has been successfully submitted. Relief teams will assess the damage.",
        }
      case "supply":
        return {
          title: "Supply Request Submitted",
          message: "Your supply request has been successfully submitted. NGOs will coordinate to fulfill your request.",
        }
      default:
        return {
          title: "Report Submitted",
          message: "Your report has been successfully submitted.",
        }
    }
  }

  const { title, message } = getSuccessMessage()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container flex items-center justify-center py-12">
        <div className="max-w-md w-full p-6 bg-card rounded-lg border shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/map">View Map</Link>
            </Button>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

