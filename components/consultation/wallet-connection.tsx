"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { API_CONFIG } from "@/lib/config"

// Base API URL from config
const API_BASE_URL = API_CONFIG.baseUrl

interface WalletConnectionProps {
  onComplete: () => void
}

export function WalletConnection({ onComplete }: WalletConnectionProps) {
  const { connected, publicKey } = useWallet()
  const [hasExistingPortfolio, setHasExistingPortfolio] = useState(false)
  const [isCheckingPortfolio, setIsCheckingPortfolio] = useState(false)
  const { t } = useLanguage()

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Check if wallet has an existing portfolio
  useEffect(() => {
    const checkExistingPortfolio = async () => {
      if (!connected || !publicKey) return

      setIsCheckingPortfolio(true)
      try {
        const response = await fetch(`${API_BASE_URL}/checkportfolio/${publicKey.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setHasExistingPortfolio(data.has_portfolio)
        } else {
          console.error("Failed to check portfolio status:", await response.text())
          setHasExistingPortfolio(false)
        }
      } catch (error) {
        console.error("Error checking portfolio:", error)
        setHasExistingPortfolio(false)
      } finally {
        setIsCheckingPortfolio(false)
      }
    }

    if (connected && publicKey) {
      checkExistingPortfolio()
    }
  }, [connected, publicKey])

  // Reset consultation session when wallet connection component mounts
  useEffect(() => {
    // Clear consultation completion status if user is back at wallet connection stage
    localStorage.removeItem("solport-consultation-completed")
    localStorage.removeItem("solport-consultation-result")
  }, [])

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{t("wallet.title")}</h2>
      <p className="text-solport-textSecondary mb-6">{t("wallet.description")}</p>

      <div className="mb-6">
        <p className="text-sm mb-4">
          {t("wallet.subtitle1")}
          <br />
          {t("wallet.subtitle2")}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-solport-purple-400 mr-2"></span>
            <span>{t("wallet.feature1")}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-solport-purple-400 mr-2"></span>
            <span>{t("wallet.feature2")}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-solport-purple-400 mr-2"></span>
            <span>{t("wallet.feature3")}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-solport-purple-400 mr-2"></span>
            <span>{t("wallet.feature4")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {connected ? (
          <>
            {isCheckingPortfolio ? (
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>{t("wallet.checking")}</span>
              </div>
            ) : hasExistingPortfolio ? (
              <div className="text-center mb-4 p-3 bg-green-900/20 border border-green-700/30 rounded-md">
                <p className="text-green-400 font-medium mb-1">{t("wallet.existingPortfolio")}</p>
                <p className="text-sm text-solport-textSecondary">{t("wallet.continueWithExisting")}</p>
              </div>
            ) : null}

            <Button
              className="bg-solport-accent hover:bg-solport-accent2 text-white px-6 py-2 rounded-md flex items-center"
              onClick={onComplete}
            >
              <Check className="mr-2 h-4 w-4" />
              {publicKey ? formatWalletAddress(publicKey.toString()) : t("wallet.connected")}
            </Button>
          </>
        ) : (
          <WalletMultiButton className="bg-solport-accent hover:bg-solport-accent2 text-white px-6 py-2 rounded-md" />
        )}
      </div>
    </div>
  )
}
