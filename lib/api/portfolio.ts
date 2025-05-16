// lib/api/portfolio.ts

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

// Function to get asset analysis data
export async function getAssetAnalysis(walletAddress: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock asset analysis data
  return {
    average_apy: 11.2,
    total_profit: 24.8,
    assets: [
      {
        name: "SOL",
        price: 150.25,
        change_24h: 2.5,
        change_7d: 8.3,
        change_30d: 15.7,
        market_cap: 65000000000,
        volume_24h: 2500000000,
      },
      {
        name: "BTC",
        price: 60000.5,
        change_24h: 1.2,
        change_7d: 5.6,
        change_30d: 10.3,
        market_cap: 1200000000000,
        volume_24h: 35000000000,
      },
      {
        name: "ETH",
        price: 3500.75,
        change_24h: 1.8,
        change_7d: 6.2,
        change_30d: 12.5,
        market_cap: 420000000000,
        volume_24h: 18000000000,
      },
      {
        name: "JitoSOL",
        price: 155.3,
        change_24h: 2.7,
        change_7d: 8.5,
        change_30d: 16.2,
        market_cap: 2500000000,
        volume_24h: 150000000,
      },
    ],
    last_updated: new Date().toISOString().split("T")[0],
  }
}

// Function to get automation settings
export async function getAutomationSettings(walletAddress: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock automation settings data
  return {
    automation: [
      {
        title: "자동 리밸런싱",
        enabled: true,
      },
      {
        title: "자동 납입 설정",
        enabled: true,
      },
      {
        title: "목표 기반 전략 조정",
        enabled: true,
      },
    ],
    settings: [
      {
        title: "자동 리밸런싱",
        options: {
          frequency: [
            { value: "monthly", label: "월별", selected: true },
            { value: "yearly", label: "연별", selected: false },
          ],
          threshold: [
            { value: "5", label: "5% 이상", selected: true },
            { value: "10", label: "10% 이상", selected: false },
            { value: "15", label: "15% 이상", selected: false },
          ],
        },
      },
      {
        title: "자동 납입 설정",
        options: {
          amount: { value: 150, unit: "SOL" },
          date: { day: 15, description: "매월 15일" },
        },
      },
      {
        title: "목표기반 전략 조정",
        options: {
          threshold: [
            { value: "80", label: "80% 미만", selected: false },
            { value: "90", label: "90% 미만", selected: true },
          ],
          frequency: [
            { value: "quarterly", label: "분기별", selected: true },
            { value: "yearly", label: "연별", selected: false },
          ],
          adjustment_type: [
            { value: "auto", label: "자동 제안", selected: true },
            { value: "manual", label: "수동 승인", selected: false },
          ],
        },
      },
    ],
    next_contribution_date: "2023-06-15",
    ai_analysis_recommendation: [
      {
        title: "JITOSOL 자동복리 활성화",
        desc: "스테이킹 보상을 자동으로 재투자하여 연간 0.4% 추가 수익 가능",
      },
      {
        title: "DCA(Dollar Cost Averaging) 전략 활성화",
        desc: "시장 변동성에 따라 자동 납입 일정을 최적화하여 평균 진입 가격 개선",
      },
    ],
  }
}

// Function to update automation settings
export async function updateAutomationSettings(walletAddress: string, settingsType: string, settings: any) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would send the settings to the backend
  console.log(`Updating ${settingsType} settings for wallet ${walletAddress}:`, settings)

  // Return success response
  return {
    success: true,
    message: "Settings updated successfully",
    settings: settings,
  }
}
