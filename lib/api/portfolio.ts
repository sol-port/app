export interface PortfolioData {
  totalAssets: number
  dailyChange: number
  totalReturn: number
  totalInvestment: number
  riskScore: number
  riskScoreMax: number
  monthlyIncome: number
  nextPaymentDate: string
  assetAllocation: {
    symbol: string
    percentage: number
    color: string
  }[]
  aiInsights: {
    marketAnalysis: string
    portfolioRecommendation: string
    riskAlert: string
  }
  portfolioSettings: {
    autoRebalancing: boolean
    nextRebalanceDate: string
    goalProgress: boolean
  }
  performanceData: {
    month: string
    value: number
  }[]
  lstStaking: {
    token: string
    apy: number
    apyBase: string
    mevBoost: string
    status: string
  }[]
}

// Mock data for the portfolio
export async function getPortfolioData(): Promise<PortfolioData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    totalAssets: 960000,
    dailyChange: 3.2,
    totalReturn: 32,
    totalInvestment: 3000000,
    riskScore: 5.8,
    riskScoreMax: 10,
    monthlyIncome: 150,
    nextPaymentDate: "2023-06-05",
    assetAllocation: [
      { symbol: "BTC", percentage: 30, color: "#8A63D2" },
      { symbol: "ETH", percentage: 25, color: "#9D7FE0" },
      { symbol: "SOL", percentage: 20, color: "#B29BEE" },
      { symbol: "USDT", percentage: 15, color: "#C7B7F7" },
      { symbol: "JitoSOL", percentage: 10, color: "#DCD3FF" },
    ],
    aiInsights: {
      marketAnalysis: "솔라나 DeFi TVL 8.2% 상승",
      portfolioRecommendation: "JitoSOL 비중 5% 추가 고려",
      riskAlert: "SOL 가격 3% 하락",
    },
    portfolioSettings: {
      autoRebalancing: true,
      nextRebalanceDate: "2023-05-15",
      goalProgress: true,
    },
    performanceData: [
      { month: "1월", value: 30 },
      { month: "2월", value: 25 },
      { month: "3월", value: 35 },
      { month: "4월", value: 40 },
      { month: "5월", value: 45 },
      { month: "6월", value: 55 },
      { month: "7월", value: 65 },
      { month: "8월", value: 60 },
      { month: "9월", value: 70 },
      { month: "10월", value: 75 },
      { month: "11월", value: 80 },
      { month: "12월", value: 85 },
    ],
    lstStaking: [
      {
        token: "JitoSOL",
        apy: 9.8,
        apyBase: "8.2%",
        mevBoost: "3.6%",
        status: "활성화",
      },
      {
        token: "mSOL",
        apy: 0,
        apyBase: "6.5%",
        mevBoost: "0%",
        status: "비활성화 중",
      },
      {
        token: "bSOL",
        apy: 0,
        apyBase: "7.1%",
        mevBoost: "0%",
        status: "위험성 증가",
      },
    ],
  }
}
