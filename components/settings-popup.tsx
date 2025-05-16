"use client"

import { useRouter } from "next/navigation"
import { Popup } from "@/components/ui/popup"
import { Button } from "@/components/ui/button"
import { LogOut, Copy } from "lucide-react"

interface SettingsPopupProps {
  isOpen: boolean
  onClose: () => void
  walletAddress?: string
}

export function SettingsPopup({ isOpen, onClose, walletAddress = "" }: SettingsPopupProps) {
  const router = useRouter()

  const shortenAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
    }
  }

  const handleDisconnect = () => {
    // In a real app, you would clear tokens, disconnect wallet, etc.
    console.log("Disconnecting wallet")
    // Simulate logout and redirect
    setTimeout(() => {
      router.push("/")
    }, 500)
    onClose()
  }

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-solport-textSecondary mb-1">Wallet Address</div>
          <div className="flex items-center justify-between px-3 py-2 bg-[#273344] rounded-md">
            <span className="text-sm">{shortenAddress(walletAddress)}</span>
            <button onClick={copyToClipboard} className="text-solport-textSecondary hover:text-white transition-colors">
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
          Disconnect
        </Button>
      </div>
    </Popup>
  )
}
