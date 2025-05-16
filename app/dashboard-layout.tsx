"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AiConsultationButton } from "@/components/ai-consultation-button"
import { useAppState } from "@/context/app-state-context"

export default function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  const { isConsultationCompleted } = useAppState()

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
