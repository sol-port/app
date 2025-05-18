"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import DashboardLayout from "../dashboard-layout"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/context/language-context"
import { getAssetAnalysis } from "@/lib/api/client"

// Import crypto icons
const BtcIcon = "/btc.svg"
const EthIcon = "/eth.svg"
const SolIcon = "/sol.png"
const UsdtIcon = "/usdt.svg"
const JitoSolIcon = "/jitosol.png"

export default function AnalysisPage() {
  const { connected, publicKey } = useWallet()
  const { t } = useLanguage()
  const [assetData, setAssetData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    async function fetchAssetData() {
      setLoading(true)
      try {
        // Get the wallet address from the wallet adapter
        const mockAddress = "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa"
        const walletAddress = publicKey?.toString() || mockAddress
        const analysisData = await getAssetAnalysis(walletAddress)

        // Transform the API data to match our component's expected format
        const transformedData = analysisData.assets.map((asset: any) => {
          let icon
          switch (asset.name) {
            case "BTC":
              icon = BtcIcon
              break
            case "ETH":
              icon = EthIcon
              break
            case "SOL":
              icon = SolIcon
              break
            case "USDT":
              icon = UsdtIcon
              break
            case "JitoSOL":
              icon = JitoSolIcon
              break
            default:
              icon = SolIcon // Default icon
          }

          return {
            name: asset.name,
            symbol: asset.name,
            icon: icon,
            price: asset.price,
            change24h: asset.change_24h,
            change7d: asset.change_7d,
            holdings: 0, // This data isn't provided by the API
            value: 0, // This data isn't provided by the API
            allocation: 0, // This data isn't provided by the API
            returns: `${asset.change_30d}% (30d)`,
          }
        })

        setAssetData(transformedData)
      } catch (error) {
        console.error("Failed to fetch asset data:", error)
        // Keep the mock data as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchAssetData()
  }, [connected, publicKey])

  // Calculate totals
  const totalValue = assetData.reduce((sum, asset) => sum + asset.value, 0)
  const totalReturn = 24.8
  const averageAPY = 11.2

  return (
    <DashboardLayout title={t("analysis.title")}>
      {/* Asset Category Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <div className="relative">
          <TabsList className="bg-solport-card w-full justify-start overflow-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-solport-accent">
              {t("analysis.allAssets")}
            </TabsTrigger>
            <TabsTrigger value="stablecoins" className="data-[state=active]:bg-solport-accent">
              {t("analysis.stablecoins")}
            </TabsTrigger>
            <TabsTrigger value="lst" className="data-[state=active]:bg-solport-accent">
              {t("analysis.lst")}
            </TabsTrigger>
            <TabsTrigger value="dex" className="data-[state=active]:bg-solport-accent">
              {t("analysis.dexLiquidity")}
            </TabsTrigger>
            <TabsTrigger value="major" className="data-[state=active]:bg-solport-accent">
              {t("analysis.majorAssets")}
            </TabsTrigger>
            <TabsTrigger value="rwa" className="data-[state=active]:bg-solport-accent">
              {t("analysis.rwa")}
            </TabsTrigger>
          </TabsList>

          <div className="absolute right-2 top-1.5">
            <div className="relative">
              <Input placeholder={t("analysis.search")} className="w-64 h-8 bg-[#273344] border-0 pl-9 text-sm" />
              <Search className="absolute left-3 top-1.5 h-4 w-4 text-solport-textSecondary" />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {/* Asset Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-solport-card border-0">
              <CardContent className="p-4">
                <div className="text-solport-textSecondary text-sm">{t("analysis.totalValue")}</div>
                <div className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</div>
                <div className="text-solport-success text-sm mt-1">+3.2% (24h)</div>
              </CardContent>
            </Card>

            <Card className="bg-solport-card border-0">
              <CardContent className="p-4">
                <div className="text-solport-textSecondary text-sm">{t("analysis.totalReturn")}</div>
                <div className="text-2xl font-bold mt-1">+{totalReturn}%</div>
                <div className="text-solport-success text-sm mt-1">+2.1% (7d)</div>
              </CardContent>
            </Card>

            <Card className="bg-solport-card border-0">
              <CardContent className="p-4">
                <div className="text-solport-textSecondary text-sm">{t("analysis.averageAPY")}</div>
                <div className="text-2xl font-bold mt-1">{averageAPY}%</div>
                <div className="text-solport-success text-sm mt-1">+1.5% vs model</div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Table */}
          <Card className="bg-solport-card border-0 mb-6">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#334155]">
                      <th className="text-left p-4 text-solport-textSecondary font-medium">{t("analysis.asset")}</th>
                      <th className="text-right p-4 text-solport-textSecondary font-medium">{t("analysis.price")}</th>
                      <th className="text-right p-4 text-solport-textSecondary font-medium">
                        {t("analysis.change24h")}
                      </th>
                      <th className="text-right p-4 text-solport-textSecondary font-medium">
                        {t("analysis.change7d")}
                      </th>
                      <th className="text-right p-4 text-solport-textSecondary font-medium">
                        {t("analysis.holdings")}
                      </th>
                      <th className="text-right p-4 text-solport-textSecondary font-medium">{t("analysis.value")}</th>
                      <th className="text-right p-4 text-solport-textSecondary font-medium">
                        {t("analysis.allocation")}
                      </th>
                      <th className="text-right p-4 text-solport-textSecondary font-medium">
                        {t("analysis.apyReturn")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <tr key={index} className="border-b border-[#334155]">
                              <td colSpan={8} className="p-4">
                                <div className="h-8 bg-[#273344] rounded animate-pulse"></div>
                              </td>
                            </tr>
                          ))
                      : assetData.map((asset, index) => (
                          <tr key={index} className="border-b border-[#334155] hover:bg-[#1a1e30]">
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 mr-3 rounded-full overflow-hidden">
                                  <OptimizedImage src={asset.icon} alt={asset.symbol} width={32} height={32} />
                                </div>
                                <div>
                                  <div>{asset.name}</div>
                                  <div className="text-solport-textSecondary text-sm">{asset.symbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-right">${asset.price.toLocaleString()}</td>
                            <td className="p-4 text-right">
                              <span className={asset.change24h > 0 ? "text-solport-success" : "text-red-500"}>
                                {asset.change24h > 0 ? "+" : ""}
                                {asset.change24h}%
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <span className={asset.change7d > 0 ? "text-solport-success" : "text-red-500"}>
                                {asset.change7d > 0 ? "+" : ""}
                                {asset.change7d}%
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {asset.holdings.toLocaleString()} {asset.symbol}
                            </td>
                            <td className="p-4 text-right">${asset.value.toLocaleString()}</td>
                            <td className="p-4 text-right">{asset.allocation}%</td>
                            <td className="p-4 text-right">
                              <span className="text-solport-success">{asset.returns}</span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Asset Analysis */}
          <Card className="bg-solport-card border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{t("analysis.detailedAnalysis")}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Solana Analysis */}
                <div className="bg-[#1a1e30] p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 mr-3 rounded-full overflow-hidden">
                      <OptimizedImage src={SolIcon} alt="SOL" width={32} height={32} />
                    </div>
                    <div className="font-medium">Solana (SOL)</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>{t("analysis.priceChange").replace("{percent}", "8.7").replace("{ytdPercent}", "120.3")}</div>
                    <div>{t("analysis.volatility").replace("{percent}", "43.5")}</div>
                  </div>
                </div>

                {/* JitoSOL Analysis */}
                <div className="bg-[#1a1e30] p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 mr-3 rounded-full overflow-hidden">
                      <OptimizedImage src={JitoSolIcon} alt="JitoSOL" width={32} height={32} />
                    </div>
                    <div className="font-medium">JitoSOL</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      {t("analysis.apyDetails")
                        .replace("{percent}", "9.8")
                        .replace("{basePercent}", "8.2")
                        .replace("{mevPercent}", "1.6")}
                    </div>
                    <div>{t("analysis.withdrawalPeriod")}</div>
                  </div>
                </div>

                {/* AI Insight */}
                <div className="bg-[#1a1e30] p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 mr-3 rounded-full bg-solport-accent flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                      </svg>
                    </div>
                    <div className="font-medium">AI Insights</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>{t("analysis.aiInsight").replace("{percent}", "8.2")}</div>
                    <div>Consider adding 5% JitoSOL allocation</div>
                    <div>SOL price expected to rise in next 7 days (82% probability)</div>
                  </div>
                </div>
              </div>

              <div className="text-right mt-4">
                <a href="#" className="text-solport-accent hover:text-solport-accent2 text-sm">
                  {t("analysis.viewMore")}
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
