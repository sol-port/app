"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"
import { getAutomationSettings } from "@/lib/api/client"
import { useAppState } from "@/context/app-state-context"

export default function AutomationPage() {
  const { t } = useLanguage()
  const [autoRebalancing, setAutoRebalancing] = useState(true)
  const [autoContribution, setAutoContribution] = useState(true)
  const [goalStrategy, setGoalStrategy] = useState(true)
  const [loading, setLoading] = useState(true)
  const [automationData, setAutomationData] = useState<any>(null)
  const { walletAddress } = useAppState()

  useEffect(() => {
    async function fetchAutomationSettings() {
      setLoading(true)
      try {
        // Use the wallet address from context if available, otherwise use a default
        const address = walletAddress || "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"
        const data = await getAutomationSettings(address)
        setAutomationData(data)

        // Update state based on fetched data
        if (data.automation && Array.isArray(data.automation)) {
          const rebalancing = data.automation.find((item: any) => item.title === "Auto Rebalancing")
          const contribution = data.automation.find((item: any) => item.title === "Auto Contribution")
          const goalStrategy = data.automation.find((item: any) => item.title === "Goal-based Strategy Adjustment")

          if (rebalancing) setAutoRebalancing(rebalancing.enabled)
          if (contribution) setAutoContribution(contribution.enabled)
          if (goalStrategy) setGoalStrategy(goalStrategy.enabled)
        }
      } catch (error) {
        console.error("Failed to fetch automation settings:", error)
        // The API client will handle fallbacks
      } finally {
        setLoading(false)
      }
    }

    fetchAutomationSettings()
  }, [walletAddress])

  // Get next contribution date from automation data
  const nextContribution = automationData?.next_contribution_date
    ? new Date(automationData.next_contribution_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Jun 5"

  return (
    <DashboardLayout title={t("automationSettings.title")}>
      {/* Automation Status Overview */}
      <Card className="bg-solport-card border-0 mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.activeAutomations").replace("{count}", "3")}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.rebalancingStatus").replace("{status}", autoRebalancing ? "Active" : "Inactive")}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.contributionStatus").replace(
                  "{status}",
                  autoContribution ? "Active" : "Inactive",
                )}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("automationSettings.goalStrategyStatus").replace("{status}", goalStrategy ? "Active" : "Inactive")}
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
                      <SelectItem value="yearly">Yearly</SelectItem>
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
                      <SelectItem value="10percent">10% or more</SelectItem>
                      <SelectItem value="15percent">15% or more</SelectItem>
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
                      <SelectValue placeholder="Monthly on the 5th" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="day1">Monthly on the 1st</SelectItem>
                      <SelectItem value="day5">Monthly on the 5th</SelectItem>
                      <SelectItem value="day15">Monthly on the 15th</SelectItem>
                      <SelectItem value="day25">Monthly on the 25th</SelectItem>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.strategyFrequency")}
                  </div>
                  <Select defaultValue="quarterly">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder={t("automationSettings.quarterly")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="monthly">{t("automationSettings.monthly")}</SelectItem>
                      <SelectItem value="quarterly">{t("automationSettings.quarterly")}</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-solport-textSecondary mb-2">
                    {t("automationSettings.adjustmentThreshold")}
                  </div>
                  <Select defaultValue="10percent">
                    <SelectTrigger className="bg-[#273344] border-0 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="10% or more" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1e30] border-[#334155]">
                      <SelectItem value="5percent">{t("automationSettings.threshold5")}</SelectItem>
                      <SelectItem value="10percent">10% or more</SelectItem>
                      <SelectItem value="15percent">15% or more</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6 space-y-6">
          {/* Advanced Settings */}
          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("automationSettings.advancedSettings")}</h3>
                {/* Placeholder for advanced settings */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6 space-y-6">
          {/* Logs */}
          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("automationSettings.logs")}</h3>
                {/* Placeholder for logs */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
