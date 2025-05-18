"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/context/app-state-context"
import DashboardLayout from "./dashboard-layout"
import HomeChat from "@/components/home-chat"
import { Suspense } from "react"

export default function HomePage() {
  const router = useRouter()
  const { isWalletConnected, isConsultationCompleted } = useAppState()

  // Simple redirect logic without prevention mechanisms
  useEffect(() => {
    // Only redirect if wallet is connected and consultation is completed
    if (isWalletConnected && isConsultationCompleted) {
      router.push("/overview")
      router.refresh()
    }
  }, [router, isWalletConnected, isConsultationCompleted])

  // Render the HomeChat component directly without conditional loading states
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeChat />
      </Suspense>
    </DashboardLayout>
  )
}
