"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { setCookie, getCookie, removeCookie } from "@/lib/cookies"

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
  const [isConsultationCompleted, setIsConsultationCompletedState] = useState(false)
  const [consultationResult, setConsultationResultState] = useState<any | null>(null)

  // Check cookies for consultation status on initial load
  useEffect(() => {
    const storedStatus = getCookie("isConsultationCompleted")
    const storedResult = getCookie("consultationResult")

    if (storedStatus === "true") {
      setIsConsultationCompletedState(true)
    }

    if (storedResult) {
      try {
        setConsultationResultState(JSON.parse(storedResult))
      } catch (e) {
        console.error("Failed to parse stored consultation result", e)
      }
    }
  }, [])

  // Update cookies when consultation status changes
  useEffect(() => {
    if (isConsultationCompleted) {
      setCookie("isConsultationCompleted", "true")
    } else {
      removeCookie("isConsultationCompleted")
    }

    if (consultationResult) {
      setCookie("consultationResult", JSON.stringify(consultationResult))
    } else {
      removeCookie("consultationResult")
    }
  }, [isConsultationCompleted, consultationResult])

  const setConsultationCompleted = (completed: boolean) => {
    setIsConsultationCompletedState(completed)
  }

  const setConsultationResult = (result: any) => {
    setConsultationResultState(result)
  }

  const resetConsultation = () => {
    setIsConsultationCompletedState(false)
    setConsultationResultState(null)
    removeCookie("isConsultationCompleted")
    removeCookie("consultationResult")
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
