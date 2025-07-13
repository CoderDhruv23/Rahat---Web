"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAuthState, getAuthStateSync, logout } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [authState, setAuthState] = useState(getAuthStateSync())
  const pathname = usePathname()

  useEffect(() => {
    const fetchAuthState = async () => {
      const state = await getAuthState()
      setAuthState(state)
    }

    fetchAuthState()
  }, [])

  const handleLogout = async () => {
    await logout()
    setAuthState({ user: null, isAuthenticated: false })
    window.location.href = "/"
  }

  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/report-missing", label: "Report Missing" },
    { href: "/report-damage", label: "Report Damage" },
    { href: "/request-supplies", label: "Request Supplies" },
    { href: "/map", label: "Map" },
  ]

  const authNavItems = [{ href: "/dashboard", label: "Dashboard" }]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-4">
          <AlertTriangle className="h-6 w-6 text-accent" />
          <Link href="/" className="font-bold text-lg">
            Disaster Relief
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground font-medium" : "text-foreground/60",
              )}
            >
              {item.label}
            </Link>
          ))}

          {authState.isAuthenticated &&
            authNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground font-medium" : "text-foreground/60",
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {!authState.isAuthenticated ? (
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <>
              <span className="text-sm text-muted-foreground mr-2">
                {authState.user?.username} ({authState.user?.role.toUpperCase()})
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          <Button asChild variant="accent">
            <Link href="/sos">SOS</Link>
          </Button>
        </div>

        <button className="flex items-center justify-center md:hidden ml-auto" onClick={() => setIsOpen(!isOpen)}>
          <span className="sr-only">Toggle menu</span>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="container md:hidden py-4">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "text-foreground/60 transition-colors hover:text-foreground/80",
                  pathname === item.href && "text-foreground font-medium",
                )}
              >
                {item.label}
              </Link>
            ))}

            {authState.isAuthenticated &&
              authNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "text-foreground/60 transition-colors hover:text-foreground/80",
                    pathname === item.href && "text-foreground font-medium",
                  )}
                >
                  {item.label}
                </Link>
              ))}

            <div className="flex flex-col gap-2 mt-4">
              {!authState.isAuthenticated ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </Button>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    {authState.user?.username} ({authState.user?.role.toUpperCase()})
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout()
                      closeMenu()
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
              <Button asChild variant="accent" className="w-full">
                <Link href="/sos" onClick={closeMenu}>
                  SOS
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

