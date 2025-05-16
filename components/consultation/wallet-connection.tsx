"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Check } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface WalletConnectionProps {
  onComplete: () => void
}

export function WalletConnection({ onComplete }: WalletConnectionProps) {
  const { connected, publicKey } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const { t } = useLanguage()

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Reset consultation session when wallet connection component mounts
  useEffect(() => {
    // Clear consultation completion status if user is back at wallet connection stage
    localStorage.removeItem("solport-consultation-completed")
    localStorage.removeItem("solport-consultation-result")

    // In a real app, you might want to disconnect the wallet here as well
    // if it's already connected and the user is starting over
  }, [])

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{t("wallet.title")}</h2>
      <p className="text-solport-textSecondary mb-6">{t("wallet.description")}</p>

      <div className="mb-6">
        <p className="text-sm mb-4">{t("wallet.subtitle")}</p>

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

      <div className="flex justify-center">
        {connected ? (
          <Button
            className="bg-solport-accent hover:bg-solport-accent2 text-white px-6 py-2 rounded-md flex items-center"
            onClick={onComplete}
          >
            <Check className="mr-2 h-4 w-4" />
            {publicKey ? formatWalletAddress(publicKey.toString()) : t("wallet.connected")}
          </Button>
        ) : (
          <WalletMultiButton className="bg-solport-accent hover:bg-solport-accent2 text-white px-6 py-2 rounded-md" />
        )}
      </div>
    </div>
  )
}
