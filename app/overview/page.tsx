"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import DashboardLayout from "../dashboard-layout"
import { getPortfolioData } from "@/lib/api/client"
import type { PortfolioData } from "@/lib/api/portfolio" // Keep the type import
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OverviewPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { connected, publicKey } = useWallet()

  const fetchPortfolioData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if the wallet is connected
      if (!connected) {
        throw new Error("Wallet not connected")
      }

      // Validate the address format before making the API call
      const mockAddress = "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"
      const walletAddress = publicKey?.toString() || mockAddress
      const data = await getPortfolioData(walletAddress)
      setPortfolioData(data)
    } catch (error) {
      console.error("Failed to load portfolio data:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolioData()
  }, [connected, publicKey])

  const handleCreatePortfolio = () => {
    router.push("/chat")
    router.refresh()
  }

  return (
    <DashboardLayout title="My Portfolio">
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={fetchPortfolioData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button size="sm" variant="outline" onClick={handleCreatePortfolio}>
                Create Portfolio
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

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
