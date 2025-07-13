"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { MapComponent } from "@/components/map-component"
import { getAuthState } from "@/lib/auth"
import {
  getMissingPersons,
  getDamageReports,
  getSupplyRequests,
  getSOSAlerts,
  updateMissingPerson,
  updateSupplyRequest,
  updateSOSAlert,
  type MissingPerson,
  type DamageReport,
  type SupplyRequest,
  type SOSAlert,
} from "@/lib/data"
import { formatDate } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const [authState, setAuthState] = useState({ user: null, isAuthenticated: false })
  const [activeTab, setActiveTab] = useState("overview")

  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([])
  const [damageReports, setDamageReports] = useState<DamageReport[]>([])
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>([])
  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([])

  const [mapMarkers, setMapMarkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const auth = await getAuthState()
      setAuthState(auth)

      if (!auth.isAuthenticated) {
        router.push("/login")
        return
      }

      // Load data after authentication
      setLoading(true)
      await loadData()
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const loadData = async () => {
    try {
      const [missingData, damageData, supplyData, sosData] = await Promise.all([
        getMissingPersons(),
        getDamageReports(),
        getSupplyRequests(),
        getSOSAlerts(),
      ])

      setMissingPersons(missingData)
      setDamageReports(damageData)
      setSupplyRequests(supplyData)
      setSOSAlerts(sosData)

      // Update map markers
      updateMapMarkers(missingData, damageData, supplyData, sosData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const updateMapMarkers = (
    missing: MissingPerson[] = missingPersons,
    damage: DamageReport[] = damageReports,
    supply: SupplyRequest[] = supplyRequests,
    sos: SOSAlert[] = sosAlerts,
  ) => {
    const markers = []

    // Add missing persons to map
    missing.forEach((person) => {
      if (person.status === "missing") {
        markers.push({
          id: `missing-${person.id}`,
          position: person.location,
          title: `Missing: ${person.name}`,
          type: "missing",
        })
      }
    })

    // Add damage reports to map
    damage.forEach((report) => {
      markers.push({
        id: `damage-${report.id}`,
        position: report.location,
        title: `Damage: ${report.type} (${report.severity})`,
        type: "damage",
      })
    })

    // Add supply requests to map
    supply.forEach((request) => {
      if (request.status === "pending") {
        markers.push({
          id: `supply-${request.id}`,
          position: request.location,
          title: `Supply Request: ${request.type} (${request.urgency})`,
          type: "supply",
        })
      }
    })

    // Add SOS alerts to map
    sos.forEach((alert) => {
      if (alert.status === "active") {
        markers.push({
          id: `sos-${alert.id}`,
          position: alert.location,
          title: `SOS: ${alert.name}`,
          type: "sos",
        })
      }
    })

    setMapMarkers(markers)
  }

  const markPersonAsFound = async (id: string) => {
    try {
      await updateMissingPerson(id, { status: "found" })
      await loadData()
    } catch (error) {
      console.error("Error marking person as found:", error)
    }
  }

  const markSupplyAsFulfilled = async (id: string) => {
    try {
      await updateSupplyRequest(id, { status: "fulfilled" })
      await loadData()
    } catch (error) {
      console.error("Error marking supply as fulfilled:", error)
    }
  }

  const markSOSAsResolved = async (id: string) => {
    try {
      await updateSOSAlert(id, { status: "resolved" })
      await loadData()
    } catch (error) {
      console.error("Error marking SOS as resolved:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-6 flex items-center justify-center">
          <p>Loading dashboard data...</p>
        </main>
      </div>
    )
  }

  if (!authState.isAuthenticated || !authState.user) {
    return null // Will redirect to login
  }

  const isNGO = authState.user.role === "ngo"
  const isSAR = authState.user.role === "sar"

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {authState.user.username} ({authState.user.role.toUpperCase()})
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
              Overview
            </Button>

            {isSAR && (
              <>
                <Button
                  variant={activeTab === "missing" ? "default" : "outline"}
                  onClick={() => setActiveTab("missing")}
                >
                  Missing Persons
                </Button>
                <Button variant={activeTab === "damage" ? "default" : "outline"} onClick={() => setActiveTab("damage")}>
                  Damage Reports
                </Button>
                <Button variant={activeTab === "sos" ? "accent" : "outline"} onClick={() => setActiveTab("sos")}>
                  SOS Alerts
                </Button>
              </>
            )}

            {isNGO && (
              <Button
                variant={activeTab === "supplies" ? "default" : "outline"}
                onClick={() => setActiveTab("supplies")}
              >
                Supply Requests
              </Button>
            )}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium">Missing Persons</h3>
                <p className="text-3xl font-bold mt-2">{missingPersons.filter((p) => p.status === "missing").length}</p>
                <p className="text-muted-foreground text-sm mt-1">Active reports</p>
              </div>

              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium">Damage Reports</h3>
                <p className="text-3xl font-bold mt-2">{damageReports.length}</p>
                <p className="text-muted-foreground text-sm mt-1">Total reports</p>
              </div>

              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium">Supply Requests</h3>
                <p className="text-3xl font-bold mt-2">{supplyRequests.filter((r) => r.status === "pending").length}</p>
                <p className="text-muted-foreground text-sm mt-1">Pending requests</p>
              </div>

              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium">SOS Alerts</h3>
                <p className="text-3xl font-bold mt-2 text-accent">
                  {sosAlerts.filter((a) => a.status === "active").length}
                </p>
                <p className="text-muted-foreground text-sm mt-1">Active alerts</p>
              </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Disaster Relief Map</h2>
              </div>
              <MapComponent markers={mapMarkers} height="500px" />
            </div>
          </div>
        )}

        {/* Missing Persons Tab */}
        {activeTab === "missing" && isSAR && (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Missing Persons</h2>
            </div>
            <div className="p-4">
              {missingPersons.filter((p) => p.status === "missing").length === 0 ? (
                <p className="text-muted-foreground">No missing persons reported.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Age/Gender</th>
                        <th className="text-left p-2">Last Seen</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-left p-2">Reported</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {missingPersons
                        .filter((person) => person.status === "missing")
                        .map((person) => (
                          <tr key={person.id} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{person.name}</td>
                            <td className="p-2">
                              {person.age} / {person.gender}
                            </td>
                            <td className="p-2">{person.lastSeen}</td>
                            <td className="p-2">{person.contactInfo}</td>
                            <td className="p-2">{formatDate(new Date(person.reportedAt))}</td>
                            <td className="p-2">
                              <Button variant="outline" size="sm" onClick={() => markPersonAsFound(person.id)}>
                                Mark as Found
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Damage Reports Tab */}
        {activeTab === "damage" && isSAR && (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Damage Reports</h2>
            </div>
            <div className="p-4">
              {damageReports.length === 0 ? (
                <p className="text-muted-foreground">No damage reports submitted.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Severity</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Reported</th>
                      </tr>
                    </thead>
                    <tbody>
                      {damageReports.map((report) => (
                        <tr key={report.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium capitalize">{report.type}</td>
                          <td className="p-2 capitalize">{report.severity}</td>
                          <td className="p-2">{report.description.substring(0, 50)}...</td>
                          <td className="p-2">
                            {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                          </td>
                          <td className="p-2">{formatDate(new Date(report.reportedAt))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Supply Requests Tab */}
        {activeTab === "supplies" && isNGO && (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Supply Requests</h2>
            </div>
            <div className="p-4">
              {supplyRequests.filter((r) => r.status === "pending").length === 0 ? (
                <p className="text-muted-foreground">No pending supply requests.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Urgency</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-left p-2">Requested</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplyRequests
                        .filter((request) => request.status === "pending")
                        .map((request) => (
                          <tr key={request.id} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium capitalize">{request.type}</td>
                            <td className="p-2">{request.quantity}</td>
                            <td className="p-2 capitalize">{request.urgency}</td>
                            <td className="p-2">{request.contactInfo}</td>
                            <td className="p-2">{formatDate(new Date(request.reportedAt))}</td>
                            <td className="p-2">
                              <Button variant="outline" size="sm" onClick={() => markSupplyAsFulfilled(request.id)}>
                                Mark as Fulfilled
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SOS Alerts Tab */}
        {activeTab === "sos" && isSAR && (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">SOS Alerts</h2>
            </div>
            <div className="p-4">
              {sosAlerts.filter((a) => a.status === "active").length === 0 ? (
                <p className="text-muted-foreground">No active SOS alerts.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Reported</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sosAlerts
                        .filter((alert) => alert.status === "active")
                        .map((alert) => (
                          <tr key={alert.id} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{alert.name}</td>
                            <td className="p-2">{alert.contactInfo}</td>
                            <td className="p-2">{alert.description}</td>
                            <td className="p-2">
                              {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                            </td>
                            <td className="p-2">{formatDate(new Date(alert.reportedAt))}</td>
                            <td className="p-2">
                              <Button variant="accent" size="sm" onClick={() => markSOSAsResolved(alert.id)}>
                                Mark as Resolved
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

