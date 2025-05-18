"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import DashboardLayout from "../dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/context/language-context"
import { getTargetInfo } from "@/lib/api/client"

export default function GoalsPage() {
  const { connected, publicKey } = useWallet()
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [simulationData, setSimulationData] = useState<any[]>([])

  const [targetData, setTargetData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTargetInfo() {
      setLoading(true)
      try {
        // Get the wallet address from the wallet adapter
        const mockAddress = "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"
        const walletAddress = publicKey?.toString() || mockAddress
        const data = await getTargetInfo(walletAddress)
        setTargetData(data)
      } catch (error) {
        console.error("Failed to fetch target info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTargetInfo()
  }, [])

  // Use fetched data or fallback to mock data
  const currentAssets = targetData?.total_asset_value || 960000
  const targetAssets = targetData?.goal_amount || 3000000
  const goalPeriod = targetData?.goal_date
    ? new Date(targetData.goal_date).getFullYear() - new Date().getFullYear()
    : 15
  const targetYear = targetData?.goal_date ? new Date(targetData.goal_date).getFullYear() : 2040
  const monthlyContribution = targetData?.periodic_contributions || 150
  const successProbability = targetData?.success_probability || 92
  const fundedRatio =
    targetData?.total_asset_value && targetData?.goal_amount
      ? Math.round((targetData.total_asset_value / targetData.goal_amount) * 100)
      : 108
  const riskLevel = "Medium Risk"
  const riskScore = targetData?.expected_volatility || 5.8

  // Generate simulation data
  useEffect(() => {
    const generateData = () => {
      const years = Array.from({ length: goalPeriod + 1 }, (_, i) => i)

      // Expected path
      const expectedPath = years.map((year) => {
        const growthFactor = 1 + year * 0.15
        return {
          year: year === 0 ? "Current" : `Year ${year}`,
          expected: Math.round(currentAssets * growthFactor),
          optimistic: Math.round(currentAssets * growthFactor * 1.2),
          pessimistic: Math.round(currentAssets * growthFactor * 0.8),
        }
      })

      setSimulationData(expectedPath)
    }

    generateData()
  }, [connected, publicKey, currentAssets])

  // Animate progress bar
  useEffect(() => {
    const targetProgress = (currentAssets / targetAssets) * 100

    const timer = setTimeout(() => {
      setProgress(targetProgress)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentAssets, targetAssets])

  return (
    <DashboardLayout title={t("goals.title")}>
      {/* Goal Progress Overview */}
      <Card className="bg-solport-card border-0 mb-6">
        <CardContent className="p-6">
          <Progress
            value={progress}
            className="h-4 mb-4 bg-[#334155]"
            /* indicatorClassName="bg-solport-accent transition-all duration-1000 ease-out" */
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-solport-textSecondary">
                {t("goals.currentAssets").replace("{amount}", currentAssets.toLocaleString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("goals.targetAssets").replace("{amount}", targetAssets.toLocaleString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("goals.goalPeriod")
                  .replace("{years}", goalPeriod.toString())
                  .replace("{targetYear}", targetYear.toString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("goals.monthlyContribution").replace("{amount}", monthlyContribution.toString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("goals.successProbability").replace("{percent}", successProbability.toString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("goals.fundedRatio").replace("{percent}", fundedRatio.toString())}
              </div>
            </div>
            <div>
              <div className="text-solport-textSecondary">
                {t("goals.riskLevel").replace("{level}", riskLevel).replace("{score}", riskScore.toString())}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" className="bg-[#273344] hover:bg-[#334155] text-white border-0">
              {t("goals.modify")}
            </Button>
            <Button className="bg-solport-accent hover:bg-solport-accent2">{t("goals.add")}</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Simulation Chart */}
        <Card className="bg-solport-card border-0 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">{t("goals.simulation")}</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderColor: "#334155",
                      color: "white",
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="expected"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name={t("goals.expectedPath")}
                  />
                  <Line
                    type="monotone"
                    dataKey="optimistic"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={t("goals.optimisticScenario")}
                  />
                  <Line
                    type="monotone"
                    dataKey="pessimistic"
                    stroke="#EF4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={t("goals.pessimisticScenario")}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#8B5CF6] mr-2"></div>
                  <span className="text-sm">{t("goals.expectedPath")}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#10B981] mr-2"></div>
                  <span className="text-sm">{t("goals.optimisticScenario")}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#EF4444] mr-2"></div>
                  <span className="text-sm">{t("goals.pessimisticScenario")}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#1a1e30] p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">{t("goals.simulationSettings")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-solport-textSecondary mb-1">{t("goals.monthlyContributionSetting")}</div>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="50"
                      max="300"
                      defaultValue="150"
                      className="w-full h-2 bg-[#334155] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-2 text-sm">150 SOL</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-solport-textSecondary mb-1">{t("goals.goalPeriodSetting")}</div>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      defaultValue="15"
                      className="w-full h-2 bg-[#334155] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-2 text-sm">15 years</span>
                  </div>
                </div>
              </div>
              <Button className="mt-3 bg-solport-accent hover:bg-solport-accent2">{t("goals.runSimulation")}</Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations and Other Goals */}
        <div className="space-y-6">
          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{t("goals.aiRecommendations")}</h3>

              <div className="space-y-4">
                <div className="bg-[#1a1e30] p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-solport-purple-400 flex items-center justify-center mr-3 text-white">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">{t("goals.increaseContribution").replace("{amount}", "170")}</h4>
                      <p className="text-sm text-solport-textSecondary mt-1">
                        {t("goals.contributionImpact").replace("{ratio}", "115").replace("{probability}", "97")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1e30] p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-solport-purple-400 flex items-center justify-center mr-3 text-white">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">{t("goals.extendPeriod").replace("{years}", "17")}</h4>
                      <p className="text-sm text-solport-textSecondary mt-1">
                        {t("goals.periodImpact").replace("{ratio}", "112").replace("{probability}", "95")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{t("goals.otherGoals")}</h3>

              <div className="space-y-4">
                <div className="bg-[#1a1e30] p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-solport-purple-400 flex items-center justify-center mr-3 text-white">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">{t("goals.educationFund")}</h4>
                      <p className="text-sm text-solport-textSecondary mt-1">
                        {t("goals.educationImpact").replace("{ratio}", "65").replace("{probability}", "58")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1e30] p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-solport-purple-400 flex items-center justify-center mr-3 text-white">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">{t("goals.homeDownPayment")}</h4>
                      <p className="text-sm text-solport-textSecondary mt-1">
                        {t("goals.homeImpact").replace("{ratio}", "42").replace("{probability}", "35")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
