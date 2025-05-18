"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { useAppState } from "@/context/app-state-context"

export function AiConsultationButton() {
  const router = useRouter()
  const { isConsultationCompleted } = useAppState()

  if (isConsultationCompleted) {
    return null
  }

  return (
    <Button
      onClick={() => router.push("/chat")}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-solport-accent hover:bg-solport-accent2 shadow-lg flex items-center justify-center p-0 z-10"
    >
      <Bot className="h-6 w-6" />
      <span className="sr-only">AI Consultation</span>
    </Button>
  )
}
