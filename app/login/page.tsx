"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login, initializeUsers, getAuthState } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize users in Firebase
    initializeUsers()

    // Check if user is already logged in
    const checkAuth = async () => {
      const authState = await getAuthState()
      if (authState.isAuthenticated) {
        router.push("/dashboard")
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false)
      return
    }

    try {
      const authState = await login(email, password)

      if (authState.isAuthenticated) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Error during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container flex items-center justify-center py-12">
        <div className="w-full max-w-md p-6 bg-card rounded-lg border shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">NGO & S&R Team Login</h1>
            <p className="text-muted-foreground mt-2">Login to access your dashboard and manage relief efforts</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
            <p>For demo purposes, use:</p>
            <p className="mt-1">
              NGO: <code>ngo1@example.com</code> / <code>ngo1pass</code>
            </p>
            <p>
              S&R: <code>sar1@example.com</code> / <code>sar1pass</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

