import { getLocalStorage } from "./utils"
import { auth, db } from "./firebase"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

// Default users remain for reference, but we'll use Firebase Auth
const DEFAULT_USERS = [
  { id: "1", username: "ngo1", password: "ngo1pass", role: "ngo", email: "ngo1@example.com" },
  { id: "2", username: "ngo2", password: "ngo2pass", role: "ngo", email: "ngo2@example.com" },
  { id: "3", username: "sar1", password: "sar1pass", role: "sar", email: "sar1@example.com" },
  { id: "4", username: "sar2", password: "sar2pass", role: "sar", email: "sar2@example.com" },
]

export type CustomUser = {
  id: string
  username: string
  role: "ngo" | "sar"
  email: string
}

export type AuthState = {
  user: CustomUser | null
  isAuthenticated: boolean
}

// Initialize Firebase Auth
export function initializeUsers() {
  // We'll keep this function for compatibility, but it doesn't need to do anything
  // User creation would be done through Firebase console or a registration page
}

// Login function using Firebase
export async function login(email: string, password: string): Promise<AuthState> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Get user's role from Firestore (user profile)
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

    if (userDoc.exists()) {
      const userData = userDoc.data() as { username: string; role: "ngo" | "sar" }

      const customUser: CustomUser = {
        id: firebaseUser.uid,
        username: userData.username,
        role: userData.role,
        email: firebaseUser.email || "",
      }

      return { user: customUser, isAuthenticated: true }
    }

    return { user: null, isAuthenticated: false }
  } catch (error) {
    console.error("Error during login:", error)
    return { user: null, isAuthenticated: false }
  }
}

// Logout function
export async function logout(): Promise<AuthState> {
  try {
    await signOut(auth)
    return { user: null, isAuthenticated: false }
  } catch (error) {
    console.error("Error during logout:", error)
    return { user: null, isAuthenticated: false }
  }
}

// Get current auth state
export async function getAuthState(): Promise<AuthState> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe()

      if (firebaseUser) {
        try {
          // Get user's role from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data() as { username: string; role: "ngo" | "sar" }

            const customUser: CustomUser = {
              id: firebaseUser.uid,
              username: userData.username,
              role: userData.role,
              email: firebaseUser.email || "",
            }

            resolve({ user: customUser, isAuthenticated: true })
          } else {
            resolve({ user: null, isAuthenticated: false })
          }
        } catch (error) {
          console.error("Error getting user data:", error)
          resolve({ user: null, isAuthenticated: false })
        }
      } else {
        resolve({ user: null, isAuthenticated: false })
      }
    })
  })
}

// For backward compatibility and initial testing
export function getAuthStateSync(): AuthState {
  // This function returns immediately (needed for components that can't use async)
  // It's less accurate but necessary for some components
  const firebaseUser = auth.currentUser

  if (firebaseUser) {
    // Use cached user info if available
    const cachedUser = getLocalStorage("firebaseUser")
    if (cachedUser && cachedUser.id === firebaseUser.uid) {
      return { user: cachedUser, isAuthenticated: true }
    }

    // Return basic info if no cached data
    return {
      user: {
        id: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        role: "ngo", // Default role, will be updated when async data arrives
        email: firebaseUser.email || "",
      },
      isAuthenticated: true,
    }
  }

  return { user: null, isAuthenticated: false }
}

