"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useAppState } from "@/context/app-state-context"

export function SetupComplete() {
  const router = useRouter()
  const { t } = useLanguage()
  const { setConsultationCompleted } = useAppState()

  const handleGoToDashboard = () => {
    // Ensure consultation is marked as completed
    setConsultationCompleted(true)

    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      router.push("/overview")
    }, 100)
  }

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6 text-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-xl font-bold mb-2">{t("setup.completeTitle")}</h2>
      <p className="text-solport-textSecondary mb-6">{t("setup.completeDesc")}</p>

      <Button
        className="bg-solport-accent hover:bg-solport-accent2 text-white px-6 py-2 rounded-md"
        onClick={handleGoToDashboard}
      >
        {t("setup.goToDashboard")}
      </Button>
    </div>
  )
}
