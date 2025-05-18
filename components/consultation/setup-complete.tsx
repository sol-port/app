"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, ExternalLink } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useAppState } from "@/context/app-state-context"

interface SetupCompleteProps {
  portfolioId: string
  walletAddress: string
  onComplete: () => void
}

export function SetupComplete({ portfolioId, walletAddress, onComplete }: SetupCompleteProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { setConsultationCompleted } = useAppState()

  // Generate Solscan URL for the wallet address
  const solscanUrl = `https://solscan.io/account/${walletAddress}`

  const handleGoToDashboard = () => {
    onComplete()
  }

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6 text-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-xl font-bold mb-2">{t("setup.title")}</h2>
      <p className="text-solport-textSecondary mb-6">
        {t("setup.description")}
      </p>

      <div className="bg-[#1a1e30] rounded-lg p-4 mb-6 inline-block">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <div className="text-left">
              <div className="font-medium">{`${t("setup.transaction")} #${portfolioId}`}</div>
              <div className="text-sm text-solport-textSecondary">{t("setup.explorer")}</div>
            </div>
          </div>
          <a
            href={solscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 text-solport-accent hover:text-solport-accent2 flex items-center"
          >
            <span className="mr-1">{t("setup.view")}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="space-y-4 mb-6 text-left">
        <h3 className="font-medium">{t("setup.explorer")}</h3>
        <div className="flex items-start">
          <span className="w-2 h-2 rounded-full bg-solport-purple-400 mt-1.5 mr-2"></span>
          <span>{t("setup.feature1")}</span>
        </div>
        <div className="flex items-start">
          <span className="w-2 h-2 rounded-full bg-solport-purple-400 mt-1.5 mr-2"></span>
          <span>{t("setup.feature2")}</span>
        </div>
        <div className="flex items-start">
          <span className="w-2 h-2 rounded-full bg-solport-purple-400 mt-1.5 mr-2"></span>
          <span>{t("setup.feature3")}</span>
        </div>
        <div className="flex items-start">
          <span className="w-2 h-2 rounded-full bg-solport-purple-400 mt-1.5 mr-2"></span>
          <span>{t("setup.feature4")}</span>
        </div>
      </div>

      <Button
        className="bg-solport-accent hover:bg-solport-accent2 text-white px-6 py-2 rounded-md"
        onClick={handleGoToDashboard}
      >
        {t("setup.dashboard")}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {/* New motivational call to action */}
      <p className="mt-4 text-sm text-solport-accent font-medium">
        {t("setup.motivation")}
      </p>
    </div>
  )
}
