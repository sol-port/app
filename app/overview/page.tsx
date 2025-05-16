"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "../dashboard-layout"
import { getPortfolioData, type PortfolioData } from "@/lib/api/portfolio"
import { AssetSummaryCard } from "@/components/dashboard/asset-summary-card"
import { ReturnCard } from "@/components/dashboard/return-card"
import { RiskScoreCard } from "@/components/dashboard/risk-score-card"
import { MonthlyIncomeCard } from "@/components/dashboard/monthly-income-card"
import { AssetAllocationCard } from "@/components/dashboard/asset-allocation-card"
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card"
import { PortfolioSettingsCard } from "@/components/dashboard/portfolio-settings-card"
import { PerformanceChartCard } from "@/components/dashboard/performance-chart-card"
import { LstStakingCard } from "@/components/dashboard/lst-staking-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OverviewPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPortfolioData()
        setPortfolioData(data)
      } catch (error) {
        console.error("Failed to load portfolio data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {loading ? (
          <>
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </>
        ) : portfolioData ? (
          <>
            <AssetSummaryCard totalAssets={portfolioData.totalAssets} dailyChange={portfolioData.dailyChange} />
            <ReturnCard totalReturn={portfolioData.totalReturn} totalInvestment={portfolioData.totalInvestment} />
            <RiskScoreCard riskScore={portfolioData.riskScore} riskScoreMax={portfolioData.riskScoreMax} />
            <MonthlyIncomeCard
              monthlyIncome={portfolioData.monthlyIncome}
              nextPaymentDate={portfolioData.nextPaymentDate}
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {loading ? (
          <>
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </>
        ) : portfolioData ? (
          <>
            <AssetAllocationCard assetAllocation={portfolioData.assetAllocation} />
            <AiInsightsCard aiInsights={portfolioData.aiInsights} />
            <PortfolioSettingsCard settings={portfolioData.portfolioSettings} />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </>
        ) : portfolioData ? (
          <>
            <PerformanceChartCard performanceData={portfolioData.performanceData} />
            <LstStakingCard lstStaking={portfolioData.lstStaking} />
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
