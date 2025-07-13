"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapComponent } from "@/components/map-component"
import { addSupplyRequest } from "@/lib/data"

export default function RequestSuppliesPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    type: "food",
    quantity: "",
    urgency: "medium" as "low" | "medium" | "high",
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

    if (!formData.type.trim()) newErrors.type = "Supply type is required"
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required"
    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0)
      newErrors.quantity = "Quantity must be a positive number"
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
      addSupplyRequest({
        type: formData.type,
        quantity: Number(formData.quantity),
        urgency: formData.urgency,
        description: formData.description,
        contactInfo: formData.contactInfo,
        location: formData.location,
      })

      // Redirect to success page or map
      router.push("/report-success?type=supply")
    } catch (error) {
      console.error("Error submitting request:", error)
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
          <h1 className="text-3xl font-bold mb-6">Request Supplies</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">
                    Supply Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="medicine">Medicine</option>
                    <option value="clothing">Clothing</option>
                    <option value="shelter">Shelter</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.type && <p className="text-destructive text-sm mt-1">{errors.type}</p>}
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                    Quantity Needed *
                  </label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={errors.quantity ? "border-destructive" : ""}
                  />
                  {errors.quantity && <p className="text-destructive text-sm mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium mb-1">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="low">Low - Needed within days</option>
                    <option value="medium">Medium - Needed within 24 hours</option>
                    <option value="high">High - Needed immediately</option>
                  </select>
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
                    Additional Details
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Provide any additional details about your request..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Location *</label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click on the map to select where supplies should be delivered
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
                              title: "Delivery Location",
                              type: "supply",
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
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

