"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import DashboardLayout from "../dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"
import { getAutomationSettings, updateAutomationSettings } from "@/lib/api/client"

export default function AutomationPage() {
  const { connected, publicKey } = useWallet()
  const { t } = useLanguage()
  const [autoRebalancing, setAutoRebalancing] = useState(true)
  const [autoContribution, setAutoContribution] = useState(true)
  const [goalStrategy, setGoalStrategy] = useState(true)

  const [loading, setLoading] = useState(true)
  const [automationData, setAutomationData] = useState<any>(null)

  useEffect(() => {
    async function fetchAutomationSettings() {
      setLoading(true)
      try {
        // Get the wallet address from the wallet adapter
        const mockAddress = "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"
        const walletAddress = publicKey?.toString() || mockAddress
        const data = await getAutomationSettings(walletAddress)
        setAutomationData(data)

        // Update state based on fetched data
        if (data.automation && Array.isArray(data.automation)) {
          const rebalancing = data.automation.find((item: any) => item.title === "자동 리밸런싱")
          const contribution = data.automation.find((item: any) => item.title === "자동 납입 설정")
          const goalStrategy = data.automation.find((item: any) => item.title === "목표 기반 전략 조정")

          if (rebalancing) setAutoRebalancing(rebalancing.enabled)
          if (contribution) setAutoContribution(contribution.enabled)
          if (goalStrategy) setGoalStrategy(goalStrategy.enabled)
        }
      } catch (error) {
        console.error("Failed to fetch automation settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAutomationSettings()
  }, [connected, publicKey])

  // Mock data
  const activeAutomations = 3
  const nextContribution = "6월 5일"

  return (
    <DashboardLayout title={t("automationSettings.title")}>
      {/* Automation Status Overview */}
      <Card className="bg-solport-card border-0 mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.activeAutomations").replace("{count}", activeAutomations.toString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.rebalancingStatus").replace("{status}", autoRebalancing ? "활성화" : "비활성화")}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.contributionStatus").replace(
                  "{status}",
                  autoContribution ? "활성화" : "비활성화",
                )}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.goalStrategyStatus").replace("{status}", goalStrategy ? "활성화" : "비활성화")}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.nextContribution").replace("{date}", nextContribution)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="basic" className="mb-6">
        <TabsList className="bg-solport-card w-full justify-start">
          <TabsTrigger value="basic" className="data-[state=active]:bg-solport-accent">
            {t("automationSettings.basicSettings")}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-solport-accent">
            {t("automationSettings.advancedSettings")}
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-solport-accent">
            {t("automationSettings.logs")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 space-y-6">
          {/* Auto Rebalancing */}
          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("automationSettings.autoRebalancing")}</h3>
                <Switch
                  checked={autoRebalancing}
                  onCheckedChange={setAutoRebalancing}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.rebalancingFrequency")}
                  </div>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder={t("automationSettings.monthly")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="monthly">{t("automationSettings.monthly")}</SelectItem>
                      <SelectItem value="quarterly">{t("automationSettings.quarterly")}</SelectItem>
                      <SelectItem value="yearly">{t("automationSettings.yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.thresholdTrigger")}
                  </div>
                  <Select defaultValue="5percent">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder={t("automationSettings.threshold5")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="5percent">{t("automationSettings.threshold5")}</SelectItem>
                      <SelectItem value="10percent">Above 10%</SelectItem>
                      <SelectItem value="15percent">Above 15%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto Contribution */}
          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("automationSettings.autoContribution")}</h3>
                <Switch
                  checked={autoContribution}
                  onCheckedChange={setAutoContribution}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.contributionAmount")}
                  </div>
                  <Select defaultValue="150sol">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="150 SOL" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="100sol">100 SOL</SelectItem>
                      <SelectItem value="150sol">150 SOL</SelectItem>
                      <SelectItem value="200sol">200 SOL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.contributionDate")}
                  </div>
                  <Select defaultValue="day5">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder={t("automationSettings.day5")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="day1">1st of month</SelectItem>
                      <SelectItem value="day5">5th of month</SelectItem>
                      <SelectItem value="day15">15th of month</SelectItem>
                      <SelectItem value="day25">25th of month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal-based Strategy Adjustment */}
          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("automationSettings.goalStrategy")}</h3>
                <Switch
                  checked={goalStrategy}
                  onCheckedChange={setGoalStrategy}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.fundedRatioThreshold")}
                  </div>
                  <Select defaultValue="80percent">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder={t("automationSettings.threshold80")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="70percent">Below 70%</SelectItem>
                      <SelectItem value="80percent">Below 80%</SelectItem>
                      <SelectItem value="90percent">Below 90%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.adjustmentFrequency")}
                  </div>
                  <Select defaultValue="quarterly">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder={t("automationSettings.quarterly")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="monthly">{t("automationSettings.monthly")}</SelectItem>
                      <SelectItem value="quarterly">{t("automationSettings.quarterly")}</SelectItem>
                      <SelectItem value="yearly">{t("automationSettings.yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.adjustmentType")}
                  </div>
                  <Select defaultValue="auto">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder={t("automationSettings.autoSuggestion")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="auto">Auto Suggestion (Manual Approval)</SelectItem>
                      <SelectItem value="manual">Manual Approval</SelectItem>
                      <SelectItem value="full">Fully Automated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-xs text-solport-textSecondary mt-4">{t("automationSettings.note")}</p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              className="bg-solport-accent hover:bg-solport-accent2"
              onClick={async () => {
                try {
                  // Get the wallet address from the wallet adapter
                  const mockAddress = "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"
                  const walletAddress = publicKey?.toString() || mockAddress

                  // Update rebalancing settings
                  await updateAutomationSettings(walletAddress, "rebalancing", {
                    enabled: autoRebalancing,
                    // Add other settings as needed
                  })

                  // Update auto contribution settings
                  await updateAutomationSettings(walletAddress, "auto_payment", {
                    enabled: autoContribution,
                    // Add other settings as needed
                  })

                  // Update goal strategy settings
                  await updateAutomationSettings(walletAddress, "goal_based", {
                    enabled: goalStrategy,
                    // Add other settings as needed
                  })

                  // Show success message or notification
                  alert(t("automationSettings.saveSettings") + " - Success!")
                } catch (error) {
                  console.error("Failed to save settings:", error)
                  // Show error message
                  alert("Failed to save settings. Please try again.")
                }
              }}
            >
              {t("automationSettings.saveSettings")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Automation Recommendations */}
      <Card className="bg-solport-card border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{t("automationSettings.aiRecommendations")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a1e30] p-4 rounded-lg flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-solport-purple-400 flex items-center justify-center mr-3 text-white shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01" />
                    <path d="M17 7h.01" />
                    <path d="M7 17h.01" />
                    <path d="M17 17h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">{t("automationSettings.jitosolCompounding")}</h4>
                  <p className="text-sm text-solport-textSecondary mt-1">
                    {t("automationSettings.jitosolDescription")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-transparent border-solport-accent text-solport-accent hover:bg-solport-accent hover:text-white ml-2 shrink-0"
              >
                {t("automationSettings.apply")}
              </Button>
            </div>

            <div className="bg-[#1a1e30] p-4 rounded-lg flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-solport-purple-400 flex items-center justify-center mr-3 text-white shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01" />
                    <path d="M17 7h.01" />
                    <path d="M7 17h.01" />
                    <path d="M17 17h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">{t("automationSettings.dcaStrategy")}</h4>
                  <p className="text-sm text-solport-textSecondary mt-1">{t("automationSettings.dcaDescription")}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-transparent border-solport-accent text-solport-accent hover:bg-solport-accent hover:text-white ml-2 shrink-0"
              >
                {t("automationSettings.apply")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
