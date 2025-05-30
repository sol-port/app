"use client"

import { useRouter } from "next/navigation"
import { Popup } from "@/components/ui/popup"
import { Button } from "@/components/ui/button"
import { LogOut, Copy, AlertCircle } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { useAppState } from "@/context/app-state-context"

interface SettingsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPopup({ isOpen, onClose }: SettingsPopupProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { connected, publicKey, disconnect } = useWallet()
  const [walletAddress, setWalletAddress] = useState<string>("")
  const { resetConsultation } = useAppState()

  // Update wallet address when connection state changes
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString())
    } else {
      setWalletAddress("")
    }
  }, [connected, publicKey])

  const shortenAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
    }
  }

  const handleDisconnect = async () => {
    try {
      // Clear all session data first
      resetConsultation()

      // Clear all localStorage items related to SolPort
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("solport-")) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key))

      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })

      // Disconnect the wallet using the wallet adapter
      if (disconnect) {
        await disconnect()
      }

      // Close the popup
      onClose()

      // Redirect to chat page
      setTimeout(() => {
        router.push("/chat")
        router.refresh()
      }, 100)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        {connected && walletAddress ? (
          <>
            <div>
              <div className="text-sm font-medium text-solport-textSecondary mb-1">{t("header.walletAddress")}</div>
              <div className="flex items-center justify-between px-3 py-2 bg-[#273344] rounded-md">
                <span className="text-sm">{shortenAddress(walletAddress)}</span>
                <button
                  onClick={copyToClipboard}
                  className="text-solport-textSecondary hover:text-white transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
              onClick={handleDisconnect}
            >
              <LogOut className="h-4 w-4" />
              {t("header.disconnect")}
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-sm text-solport-textSecondary mb-2">{t("header.noWalletConnected")}</p>
            <Button
              className="bg-solport-accent hover:bg-solport-accent2 mt-2"
              onClick={() => {
                onClose()
                setTimeout(() => {
                  router.push("/chat")
                  router.refresh()
                }, 100)
              }}
            >
              {t("header.connectWallet")}
            </Button>
          </div>
        )}
      </div>
    </Popup>
  )
}
