"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { MapComponent } from "@/components/map-component"
import { Button } from "@/components/ui/button"
import {
  getMissingPersons,
  getDamageReports,
  getSupplyRequests,
  getSOSAlerts,
  type MissingPerson,
  type DamageReport,
  type SupplyRequest,
  type SOSAlert,
} from "@/lib/data"

export default function MapPage() {
  const [markers, setMarkers] = useState<
    Array<{
      id: string
      position: { lat: number; lng: number }
      title: string
      type: "missing" | "damage" | "supply" | "sos"
    }>
  >([])

  const [filters, setFilters] = useState({
    missing: true,
    damage: true,
    supply: true,
    sos: true,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMarkers()
  }, [filters])

  const loadMarkers = async () => {
    setLoading(true)
    const newMarkers = []

    try {
      if (filters.missing) {
        const missingPersons = await getMissingPersons()
        missingPersons.forEach((person: MissingPerson) => {
          if (person.status === "missing") {
            newMarkers.push({
              id: `missing-${person.id}`,
              position: person.location,
              title: `Missing: ${person.name}`,
              type: "missing",
            })
          }
        })
      }

      if (filters.damage) {
        const damageReports = await getDamageReports()
        damageReports.forEach((report: DamageReport) => {
          newMarkers.push({
            id: `damage-${report.id}`,
            position: report.location,
            title: `Damage: ${report.type} (${report.severity})`,
            type: "damage",
          })
        })
      }

      if (filters.supply) {
        const supplyRequests = await getSupplyRequests()
        supplyRequests.forEach((request: SupplyRequest) => {
          if (request.status === "pending") {
            newMarkers.push({
              id: `supply-${request.id}`,
              position: request.location,
              title: `Supply Request: ${request.type} (${request.urgency})`,
              type: "supply",
            })
          }
        })
      }

      if (filters.sos) {
        const sosAlerts = await getSOSAlerts()
        sosAlerts.forEach((alert: SOSAlert) => {
          if (alert.status === "active") {
            newMarkers.push({
              id: `sos-${alert.id}`,
              position: alert.location,
              title: `SOS: ${alert.name}`,
              type: "sos",
            })
          }
        })
      }

      setMarkers(newMarkers)
    } catch (error) {
      console.error("Error loading map data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-4">Disaster Relief Map</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={filters.missing ? "default" : "outline"}
            onClick={() => toggleFilter("missing")}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Missing Persons
          </Button>

          <Button
            variant={filters.damage ? "default" : "outline"}
            onClick={() => toggleFilter("damage")}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            Damage Reports
          </Button>

          <Button
            variant={filters.supply ? "default" : "outline"}
            onClick={() => toggleFilter("supply")}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Supply Requests
          </Button>

          <Button
            variant={filters.sos ? "accent" : "outline"}
            onClick={() => toggleFilter("sos")}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            SOS Alerts
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center" style={{ height: "70vh" }}>
              <p>Loading map data...</p>
            </div>
          ) : (
            <MapComponent markers={markers} height="70vh" />
          )}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This map shows all reported incidents. Click on a marker to see more details. Use the filters above to
            show/hide different types of reports.
          </p>
        </div>
      </main>
    </div>
  )
}

