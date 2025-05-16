"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronRight } from "lucide-react"
import { getAutomationSettings, updateAutomationSettings } from "@/lib/api/portfolio"
import { useLanguage } from "@/context/language-context"

interface AutomationSettingsProps {
  walletAddress: string
  portfolioResult: any
  onComplete: () => void
}

export function AutomationSettings({ walletAddress, portfolioResult, onComplete }: AutomationSettingsProps) {
  const [selectedLevel, setSelectedLevel] = useState<"basic" | "standard" | "advanced">("standard")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [automationData, setAutomationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  // Fetch automation settings
  useEffect(() => {
    async function fetchAutomationSettings() {
      if (walletAddress) {
        setLoading(true)
        try {
          const data = await getAutomationSettings(walletAddress)
          setAutomationData(data)
        } catch (error) {
          console.error("Failed to fetch automation settings:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAutomationSettings()
  }, [walletAddress])

  // Get auto payment date from automation settings
  const getAutoPaymentDate = () => {
    if (automationData?.settings && automationData.settings.length > 0) {
      for (const setting of automationData.settings) {
        if (setting.title === t("automationSettings.autoContribution") && setting.options?.date?.day) {
          return setting.options.date.day
        }
      }
    }
    return 5 // Default value
  }

  // Get auto payment amount from automation settings or portfolio result
  const getAutoPaymentAmount = () => {
    if (automationData?.settings && automationData.settings.length > 0) {
      for (const setting of automationData.settings) {
        if (setting.title === t("automationSettings.autoContribution") && setting.options?.amount?.value) {
          return setting.options.amount.value
        }
      }
    }
    return portfolioResult?.model_input?.periodic_contributions_amount || 150
  }

  const automationLevels = [
    {
      id: "basic",
      title: t("automation.basic"),
      features: [t("automation.basic.feature1"), t("automation.basic.feature2"), t("automation.basic.feature3")],
    },
    {
      id: "standard",
      title: t("automation.standard"),
      features: [
        t("automation.standard.feature1"),
        t("automation.standard.feature2"),
        t("automation.standard.feature3"),
      ],
    },
    {
      id: "advanced",
      title: t("automation.advanced"),
      features: [
        t("automation.advanced.feature1"),
        t("automation.advanced.feature2"),
        t("automation.advanced.feature3"),
      ],
    },
  ]

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, you would send this to your backend
      const settings = {
        automation_level: selectedLevel,
        portfolio_id: portfolioResult?.model_output?.portfolio_id,
      }

      // Try to update automation settings
      try {
        await updateAutomationSettings(walletAddress, "automation_level", settings)
      } catch (error) {
        console.error("Failed to update automation settings:", error)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onComplete()
    } catch (error) {
      console.error("Failed to set automation level:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get wallet balance - in a real app, this would come from the blockchain
  const walletBalance = 6200 // Mock value

  // Get payment date
  const paymentDay = getAutoPaymentDate()

  // Get payment amount
  const paymentAmount = getAutoPaymentAmount()

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{t("automation.title")}</h2>
      <p className="text-solport-textSecondary mb-6">{t("automation.description")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {automationLevels.map((level) => (
          <div
            key={level.id}
            className={`bg-[#1a1e30] rounded-lg p-4 cursor-pointer transition-all ${
              selectedLevel === level.id ? "ring-2 ring-solport-accent" : ""
            }`}
            onClick={() => setSelectedLevel(level.id as "basic" | "standard" | "advanced")}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{level.title}</h3>
              <div
                className={`w-5 h-5 rounded-full ${
                  selectedLevel === level.id ? "bg-solport-accent text-white" : "border border-solport-textSecondary"
                } flex items-center justify-center`}
              >
                {selectedLevel === level.id && <Check className="h-3 w-3" />}
              </div>
            </div>
            <ul className="space-y-2">
              {level.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="w-2 h-2 rounded-full bg-solport-purple-400 mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className={selectedLevel === level.id ? "text-white" : "text-solport-textSecondary"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1e30] rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <h3 className="font-medium">{t("automation.wallet")}</h3>
          <span className="ml-auto text-sm text-solport-textSecondary">
            {t("automation.balance").replace("{balance}", walletBalance.toLocaleString())}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-[#242b42] rounded-lg p-3">
            <div className="text-sm text-solport-textSecondary mb-1">{t("automation.date")}</div>
            <div className="font-medium">{t("automation.monthly").replace("{day}", String(paymentDay))}</div>
          </div>
          <div className="bg-[#242b42] rounded-lg p-3">
            <div className="text-sm text-solport-textSecondary mb-1">{t("automation.account")}</div>
            <div className="font-medium">
              {t("automation.initial").replace(
                "{amount}",
                String(portfolioResult?.model_input?.initial_investment || 5000),
              )}
              <br />
              {t("automation.monthly.payment")
                .replace("{amount}", String(paymentAmount))
                .replace("{day}", String(paymentDay))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-solport-accent hover:bg-solport-accent2" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>{t("automation.processing")}</>
          ) : (
            <>
              {t("automation.complete")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Add default export that re-exports the named export
export default AutomationSettings
