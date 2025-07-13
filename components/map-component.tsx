"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"

interface MapProps {
  markers?: Array<{
    id: string
    position: { lat: number; lng: number }
    title: string
    type: "missing" | "damage" | "supply" | "sos"
  }>
  center?: { lat: number; lng: number }
  zoom?: number
  onClick?: (location: { lat: number; lng: number }) => void
  height?: string
}

declare global {
  interface Window {
    google: any
  }
}

export function MapComponent({
  markers = [],
  center = { lat: 40.7128, lng: -74.006 },
  zoom = 12,
  onClick,
  height = "500px",
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDu-IUnEZ-qVRSVMM3PpoNnLxPjglY3IKA&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setLoading(false)
      }
      document.head.appendChild(script)
    }

    // Check if Google Maps is already loaded
    if (!window.google) {
      loadGoogleMaps()
    } else {
      setLoading(false)
    }

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.log("Unable to retrieve your location")
        },
      )
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!loading && mapRef.current && !map) {
      const initialCenter = userLocation || center
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      })

      if (onClick) {
        newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onClick({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            })
          }
        })
      }

      setMap(newMap)
    }
  }, [loading, mapRef, map, center, zoom, onClick, userLocation])

  // Update map center if user location changes
  useEffect(() => {
    if (map && userLocation) {
      map.setCenter(userLocation)
    }
  }, [map, userLocation])

  // Add markers to map
  useEffect(() => {
    if (map) {
      // Clear existing markers
      map.data.forEach((feature) => {
        map.data.remove(feature)
      })

      // Add new markers
      markers.forEach((marker) => {
        const markerObj = new window.google.maps.Marker({
          position: marker.position,
          map,
          title: marker.title,
          icon: getMarkerIcon(marker.type),
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${marker.title}</strong></div>`,
        })

        markerObj.addListener("click", () => {
          infoWindow.open(map, markerObj)
        })
      })
    }
  }, [map, markers])

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "missing":
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      case "damage":
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      case "supply":
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      case "sos":
        return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
      default:
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading map...</span>
      </div>
    )
  }

  return <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg border" />
}

