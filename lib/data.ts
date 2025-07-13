import { db } from "./firebase"
import { collection, addDoc, updateDoc, doc, getDocs, Timestamp, type DocumentReference } from "firebase/firestore"

export type MissingPerson = {
  id: string
  name: string
  age: number
  gender: string
  lastSeen: string
  description: string
  contactInfo: string
  location: {
    lat: number
    lng: number
  }
  status: "missing" | "found"
  reportedAt: string
  docRef?: DocumentReference
}

export type DamageReport = {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  description: string
  location: {
    lat: number
    lng: number
  }
  reportedAt: string
  docRef?: DocumentReference
}

export type SupplyRequest = {
  id: string
  type: string
  quantity: number
  urgency: "low" | "medium" | "high"
  description: string
  contactInfo: string
  location: {
    lat: number
    lng: number
  }
  status: "pending" | "fulfilled"
  reportedAt: string
  docRef?: DocumentReference
}

export type SOSAlert = {
  id: string
  name: string
  contactInfo: string
  description: string
  location: {
    lat: number
    lng: number
  }
  status: "active" | "resolved"
  reportedAt: string
  docRef?: DocumentReference
}

// Initialize data in Firebase
export function initializeData() {
  // This function remains for compatibility but doesn't need to do anything
  // Firebase collections are created automatically when documents are added
}

// Missing Persons
export async function getMissingPersons(): Promise<MissingPerson[]> {
  try {
    const missingPersonsRef = collection(db, "missingPersons")
    const snapshot = await getDocs(missingPersonsRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        reportedAt: data.reportedAt?.toDate().toISOString() || new Date().toISOString(),
        docRef: doc.ref,
      } as MissingPerson
    })
  } catch (error) {
    console.error("Error getting missing persons:", error)
    return []
  }
}

export async function addMissingPerson(person: Omit<MissingPerson, "id" | "status" | "reportedAt">) {
  try {
    const docRef = await addDoc(collection(db, "missingPersons"), {
      ...person,
      status: "missing",
      reportedAt: Timestamp.now(),
    })

    const newPerson = {
      ...person,
      id: docRef.id,
      status: "missing" as const,
      reportedAt: new Date().toISOString(),
      docRef,
    }

    return newPerson
  } catch (error) {
    console.error("Error adding missing person:", error)
    throw error
  }
}

export async function updateMissingPerson(id: string, updates: Partial<MissingPerson>) {
  try {
    const docRef = doc(db, "missingPersons", id)
    await updateDoc(docRef, updates)
  } catch (error) {
    console.error("Error updating missing person:", error)
    throw error
  }
}

// Damage Reports
export async function getDamageReports(): Promise<DamageReport[]> {
  try {
    const damageReportsRef = collection(db, "damageReports")
    const snapshot = await getDocs(damageReportsRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        reportedAt: data.reportedAt?.toDate().toISOString() || new Date().toISOString(),
        docRef: doc.ref,
      } as DamageReport
    })
  } catch (error) {
    console.error("Error getting damage reports:", error)
    return []
  }
}

export async function addDamageReport(report: Omit<DamageReport, "id" | "reportedAt">) {
  try {
    const docRef = await addDoc(collection(db, "damageReports"), {
      ...report,
      reportedAt: Timestamp.now(),
    })

    const newReport = {
      ...report,
      id: docRef.id,
      reportedAt: new Date().toISOString(),
      docRef,
    }

    return newReport
  } catch (error) {
    console.error("Error adding damage report:", error)
    throw error
  }
}

// Supply Requests
export async function getSupplyRequests(): Promise<SupplyRequest[]> {
  try {
    const supplyRequestsRef = collection(db, "supplyRequests")
    const snapshot = await getDocs(supplyRequestsRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        reportedAt: data.reportedAt?.toDate().toISOString() || new Date().toISOString(),
        docRef: doc.ref,
      } as SupplyRequest
    })
  } catch (error) {
    console.error("Error getting supply requests:", error)
    return []
  }
}

export async function addSupplyRequest(request: Omit<SupplyRequest, "id" | "status" | "reportedAt">) {
  try {
    const docRef = await addDoc(collection(db, "supplyRequests"), {
      ...request,
      status: "pending",
      reportedAt: Timestamp.now(),
    })

    const newRequest = {
      ...request,
      id: docRef.id,
      status: "pending" as const,
      reportedAt: new Date().toISOString(),
      docRef,
    }

    return newRequest
  } catch (error) {
    console.error("Error adding supply request:", error)
    throw error
  }
}

export async function updateSupplyRequest(id: string, updates: Partial<SupplyRequest>) {
  try {
    const docRef = doc(db, "supplyRequests", id)
    await updateDoc(docRef, updates)
  } catch (error) {
    console.error("Error updating supply request:", error)
    throw error
  }
}

// SOS Alerts
export async function getSOSAlerts(): Promise<SOSAlert[]> {
  try {
    const sosAlertsRef = collection(db, "sosAlerts")
    const snapshot = await getDocs(sosAlertsRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        reportedAt: data.reportedAt?.toDate().toISOString() || new Date().toISOString(),
        docRef: doc.ref,
      } as SOSAlert
    })
  } catch (error) {
    console.error("Error getting SOS alerts:", error)
    return []
  }
}

export async function addSOSAlert(alert: Omit<SOSAlert, "id" | "status" | "reportedAt">) {
  try {
    const docRef = await addDoc(collection(db, "sosAlerts"), {
      ...alert,
      status: "active",
      reportedAt: Timestamp.now(),
    })

    const newAlert = {
      ...alert,
      id: docRef.id,
      status: "active" as const,
      reportedAt: new Date().toISOString(),
      docRef,
    }

    return newAlert
  } catch (error) {
    console.error("Error adding SOS alert:", error)
    throw error
  }
}

export async function updateSOSAlert(id: string, updates: Partial<SOSAlert>) {
  try {
    const docRef = doc(db, "sosAlerts", id)
    await updateDoc(docRef, updates)
  } catch (error) {
    console.error("Error updating SOS alert:", error)
    throw error
  }
}

