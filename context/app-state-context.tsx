"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter, usePathname } from "next/navigation"

interface AppState {
  isWalletConnected: boolean
  isConsultationCompleted: boolean
  consultationResult: any | null
  setConsultationCompleted: (completed: boolean) => void
  setConsultationResult: (result: any) => void
  resetConsultation: () => void
}

const AppStateContext = createContext<AppState | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { connected, publicKey } = useWallet()
  const [isConsultationCompleted, setIsConsultationCompleted] = useState(false)
  const [consultationResult, setConsultationResult] = useState<any | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check local storage for consultation status on initial load
  useEffect(() => {
    const storedStatus = localStorage.getItem("solport-consultation-completed")
    const storedResult = localStorage.getItem("solport-consultation-result")

    if (storedStatus === "true") {
      setIsConsultationCompleted(true)
    }

    if (storedResult) {
      try {
        setConsultationResult(JSON.parse(storedResult))
      } catch (e) {
        console.error("Failed to parse stored consultation result", e)
      }
    }
  }, [])

  // Update local storage when consultation status changes
  useEffect(() => {
    localStorage.setItem("solport-consultation-completed", isConsultationCompleted.toString())

    if (consultationResult) {
      localStorage.setItem("solport-consultation-result", JSON.stringify(consultationResult))
    }
  }, [isConsultationCompleted, consultationResult])

  // Handle navigation restrictions
  useEffect(() => {
    // Restricted paths that require consultation completion
    const restrictedPaths = ["/overview", "/goals", "/analysis", "/automation", "/calendar"]

    // If trying to access restricted paths without completing consultation
    if (restrictedPaths.some((path) => pathname?.startsWith(path)) && !isConsultationCompleted) {
      router.push("/chat")
      return
    }

    // If trying to access chat after consultation is completed
    if (pathname === "/chat" && isConsultationCompleted) {
      router.push("/overview")
      return
    }
  }, [pathname, isConsultationCompleted, router])

  const setConsultationCompleted = (completed: boolean) => {
    setIsConsultationCompleted(completed)
  }

  const resetConsultation = () => {
    setIsConsultationCompleted(false)
    setConsultationResult(null)
    localStorage.removeItem("solport-consultation-completed")
    localStorage.removeItem("solport-consultation-result")
  }

  return (
    <AppStateContext.Provider
      value={{
        isWalletConnected: connected,
        isConsultationCompleted,
        consultationResult,
        setConsultationCompleted,
        setConsultationResult,
        resetConsultation,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
