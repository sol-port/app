"use client"

import { useState, Suspense } from "react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Settings, Languages } from "lucide-react"
import { LanguagePopup } from "@/components/language-popup"
import { SettingsPopup } from "@/components/settings-popup"
import { useLanguage } from "@/context/language-context"

function HeaderContent() {
  const [network, setNetwork] = useState("Solana")
  const [languagePopupOpen, setLanguagePopupOpen] = useState(false)
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageSelect = (code: string) => {
    if (code === "ko") {
      setLanguage("ko_KR")
    } else if (code === "en") {
      setLanguage("en_US")
    }
    // Add more language mappings as needed
  }

  // Map language code to display format
  const getLanguageCode = () => {
    if (language === "ko_KR") return "ko"
    if (language === "en_US") return "en"
    return "en" // Default
  }

  return (
    <header className="h-16 border-0 flex items-center justify-between px-6 bg-solport-card">
      <div className="flex items-center">{/* Removed SolPort logo from header as it's in the sidebar */}</div>

      <div className="flex items-center space-x-4">
        {/* Solana Network Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-solport-accent rounded-full px-4 py-2 border-0 flex items-center"
            >
              <OptimizedImage src="/SolanaSmall.png" alt="Solana" width={20} height={20} className="mr-2" />
              {network}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-solport-card border-0">
            <DropdownMenuItem onClick={() => setNetwork("Solana")} className="text-solport-text hover:bg-[#273344]">
              Solana
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNetwork("Devnet")} className="text-solport-text hover:bg-[#273344]">
              Devnet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNetwork("Testnet")} className="text-solport-text hover:bg-[#273344]">
              Testnet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Selection - Icon Only */}
        <Button
          variant="ghost"
          size="icon"
          className="text-solport-textSecondary hover:text-white hover:bg-[#273344]"
          onClick={() => setLanguagePopupOpen(true)}
        >
          <Languages className="h-5 w-5" />
        </Button>

        <LanguagePopup
          isOpen={languagePopupOpen}
          onClose={() => setLanguagePopupOpen(false)}
          onSelectLanguage={handleLanguageSelect}
          currentLanguage={getLanguageCode()}
        />

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-solport-textSecondary hover:text-white hover:bg-[#273344]"
          onClick={() => setSettingsPopupOpen(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>

        <SettingsPopup isOpen={settingsPopupOpen} onClose={() => setSettingsPopupOpen(false)} />
      </div>
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={<div className="h-16 bg-solport-card animate-pulse"></div>}>
      <HeaderContent />
    </Suspense>
  )
}
