"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Settings, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsPopup } from "@/components/settings-popup"
import { LanguagePopup } from "@/components/language-popup"
import { useLanguage } from "@/context/language-context"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppState } from "@/context/app-state-context"

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const pathname = usePathname()
  const { t, currentLanguage } = useLanguage()
  const { connected, publicKey } = useWallet()
  const { isConsultationCompleted } = useAppState()

  // Only show header on certain pages
  const shouldShowHeader = !pathname?.includes("/chat") && pathname !== "/"

  if (!shouldShowHeader) return null

  return (
    <header className="bg-[#161a2c] border-b border-[#273344] py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/overview" className="flex items-center">
            <Image src="/SolPort.svg" alt="SolPort Logo" width={120} height={32} />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/calendar">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLanguageOpen(true)}
            className="flex items-center justify-center"
          >
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-xs">{currentLanguage === "ko_KR" ? "KR" : "EN"}</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <SettingsPopup isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <LanguagePopup isOpen={isLanguageOpen} onClose={() => setIsLanguageOpen(false)} />
    </header>
  )
}
