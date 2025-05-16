"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AiConsultationButton } from "@/components/ai-consultation-button"
import { useAppState } from "@/context/app-state-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  const { isConsultationCompleted, walletAddress } = useAppState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate a short loading period to prevent flickering
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-solport-background text-solport-text">
        <Skeleton className="w-64 h-full" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Skeleton className="h-16 w-full" />
          <main className="flex-1 overflow-auto p-4">
            {title && <Skeleton className="h-8 w-48 mb-4" />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <Skeleton className="h-80 rounded-lg" />
              <Skeleton className="h-80 rounded-lg" />
              <Skeleton className="h-80 rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-solport-background text-solport-text">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
          {children}
        </main>
        {!isConsultationCompleted && <AiConsultationButton />}
      </div>
    </div>
  )
}
