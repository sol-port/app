"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Settings, Languages } from "lucide-react"
import { LanguagePopup } from "@/components/language-popup"
import { SettingsPopup } from "@/components/settings-popup"

export function Header() {
  const [network, setNetwork] = useState("Solana")
  const [languageCode, setLanguageCode] = useState("ko")
  const [languagePopupOpen, setLanguagePopupOpen] = useState(false)
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false)

  // Mock wallet address - in a real app, this would come from your wallet connection
  const walletAddress = "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"

  const getLanguageName = (code: string) => {
    switch (code) {
      case "ko":
        return "한국어"
      case "en":
        return "English"
      case "ja":
        return "日本語"
      default:
        return "한국어"
    }
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
              <Image src="/SolanaSmall.png" alt="Solana" width={20} height={20} className="mr-2" />
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
          onSelectLanguage={setLanguageCode}
          currentLanguage={languageCode}
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

        <SettingsPopup
          isOpen={settingsPopupOpen}
          onClose={() => setSettingsPopupOpen(false)}
          walletAddress={walletAddress}
        />
      </div>
    </header>
  )
}
