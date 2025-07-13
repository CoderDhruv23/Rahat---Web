"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapComponent } from "@/components/map-component"
import { addMissingPerson } from "@/lib/data"

export default function ReportMissingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
    lastSeen: "",
    description: "",
    contactInfo: "",
    location: { lat: 40.7128, lng: -74.006 },
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [locationSelected, setLocationSelected] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFormData((prev) => ({ ...prev, location }))
    setLocationSelected(true)

    if (errors.location) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.location
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.age.trim()) newErrors.age = "Age is required"
    if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) newErrors.age = "Age must be a positive number"
    if (!formData.lastSeen.trim()) newErrors.lastSeen = "Last seen date/time is required"
    if (!formData.contactInfo.trim()) newErrors.contactInfo = "Contact information is required"
    if (!locationSelected) newErrors.location = "Please select a location on the map"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      addMissingPerson({
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        lastSeen: formData.lastSeen,
        description: formData.description,
        contactInfo: formData.contactInfo,
        location: formData.location,
      })

      // Redirect to success page or map
      router.push("/report-success?type=missing")
    } catch (error) {
      console.error("Error submitting report:", error)
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Report a Missing Person</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium mb-1">
                      Age *
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      className={errors.age ? "border-destructive" : ""}
                    />
                    {errors.age && <p className="text-destructive text-sm mt-1">{errors.age}</p>}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="lastSeen" className="block text-sm font-medium mb-1">
                    Last Seen (Date/Time) *
                  </label>
                  <Input
                    id="lastSeen"
                    name="lastSeen"
                    type="datetime-local"
                    value={formData.lastSeen}
                    onChange={handleChange}
                    className={errors.lastSeen ? "border-destructive" : ""}
                  />
                  {errors.lastSeen && <p className="text-destructive text-sm mt-1">{errors.lastSeen}</p>}
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block text-sm font-medium mb-1">
                    Your Contact Information *
                  </label>
                  <Input
                    id="contactInfo"
                    name="contactInfo"
                    placeholder="Phone number or email"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className={errors.contactInfo ? "border-destructive" : ""}
                  />
                  {errors.contactInfo && <p className="text-destructive text-sm mt-1">{errors.contactInfo}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description (Appearance, Clothing, etc.)
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Last Known Location *</label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click on the map to select the last known location
                  </p>
                  <MapComponent
                    height="300px"
                    onClick={handleLocationSelect}
                    markers={
                      locationSelected
                        ? [
                            {
                              id: "selected-location",
                              position: formData.location,
                              title: "Last Known Location",
                              type: "missing",
                            },
                          ]
                        : []
                    }
                  />
                  {errors.location && <p className="text-destructive text-sm mt-1">{errors.location}</p>}
                </div>

                {locationSelected && (
                  <div className="bg-primary/10 p-3 rounded-md">
                    <p className="text-sm font-medium">Selected Location:</p>
                    <p className="text-sm text-muted-foreground">
                      Latitude: {formData.location.lat.toFixed(6)}, Longitude: {formData.location.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {errors.submit && <div className="bg-destructive/10 text-destructive p-3 rounded-md">{errors.submit}</div>}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

