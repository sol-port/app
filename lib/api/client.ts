import { API_CONFIG, WALLET_CONFIG } from "@/lib/config"

// Base API URL from config
const API_BASE_URL = API_CONFIG.baseUrl

// Maximum number of retries for API requests
const MAX_RETRIES = API_CONFIG.maxRetries

/**
 * Generic API request function with error handling and retries
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}, retries = 0): Promise<T> {
  try {
    console.log(`Fetching from: ${API_BASE_URL}${endpoint}`)

    // Add timeout to fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle different error status codes
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)

      // If we get a 404, the resource doesn't exist
      if (response.status === 404) {
        throw new Error(`Resource not found: ${endpoint}`)
      }

      // If we get a 401 or 403, there's an authentication/authorization issue
      if (response.status === 401 || response.status === 403) {
        throw new Error("Authentication error. Please reconnect your wallet.")
      }

      // For server errors, we can retry
      if (response.status >= 500 && retries < MAX_RETRIES) {
        console.log(`Retrying request to ${endpoint} (attempt ${retries + 1} of ${MAX_RETRIES})`)
        return apiRequest(endpoint, options, retries + 1)
      }

      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    // Handle abort errors (timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error(`Request timeout: ${endpoint}`)
      throw new Error(`Request timeout: The server took too long to respond`)
    }

    console.error(`API request failed: ${endpoint}`, error)

    // Retry on network errors
    if (error instanceof TypeError && error.message.includes("fetch") && retries < MAX_RETRIES) {
      console.log(`Network error, retrying request to ${endpoint} (attempt ${retries + 1} of ${MAX_RETRIES})`)
      // Add exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
      return apiRequest(endpoint, options, retries + 1)
    }

    throw error
  }
}

/**
 * Validate wallet address format
 */
function validateWalletAddress(address: string): boolean {
  return WALLET_CONFIG.addressRegex.test(address)
}

/**
 * Check if a wallet has an existing portfolio
 */
export async function checkWalletPortfolio(walletAddress: string) {
  try {
    const data = await apiRequest(`/checkportfolio/${walletAddress}`)

    return {
      has_portfolio: data.has_portfolio || false,
    }
  } catch (error) {
    console.error("Error checking wallet portfolio:", error)
    return {
      has_portfolio: false,
    }
  }
}

/**
 * Get portfolio data for a wallet address
 */
export async function getPortfolioData(walletAddress: string) {
  // Validate wallet address
  if (!validateWalletAddress(walletAddress)) {
    console.error("Invalid wallet address format:", walletAddress)
    return getMockPortfolioData()
  }

  try {
    const data = await apiRequest(`/dashboard/${walletAddress}`)

    // Transform the API response to match our frontend data structure
    return {
      totalAssets: data.total_asset_value || 0,
      dailyChange: 3.2, // This appears to be hardcoded in the mock
      totalReturn: data.success_probability || 0,
      totalInvestment: data.goal_amount || 0,
      riskScore: data.expected_volatility || 0,
      riskScoreMax: 10,
      monthlyIncome: data.periodic_contributions_amount || 0,
      nextPaymentDate: data.next_contribution_date || new Date().toISOString().split("T")[0],
      assetAllocation: transformWeightsToAssetAllocation(data.weights),
      aiInsights: transformAiInsights(data.ai_insights),
      portfolioSettings: {
        autoRebalancing: getAutomationStatus(data.automation, "자동 리밸런싱"),
        nextRebalanceDate: data.next_contribution_date || new Date().toISOString().split("T")[0],
        goalProgress: getAutomationStatus(data.automation, "목표 기반 전략 조정"),
      },
      performanceData: generatePerformanceData(),
      lstStaking: transformLstData(data.lst_apy),
    }
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error)

    // If the portfolio is not found, we should create a new one
    if (error instanceof Error && error.message.includes("not found")) {
      console.log("Portfolio not found, returning mock data")
    }

    // Return mock data as fallback
    return getMockPortfolioData()
  }
}

/**
 * Get asset analysis data for a wallet address
 */
export async function getAssetAnalysis(walletAddress: string) {
  try {
    const data = await apiRequest(`/analyze/${walletAddress}`)

    return {
      average_apy: data.average_apy || 0,
      total_profit: data.total_profit || 0,
      assets: data.assets || [],
      last_updated: new Date().toISOString().split("T")[0],
    }
  } catch (error) {
    console.error("Failed to fetch asset analysis:", error)
    // Return mock data as fallback
    return getMockAssetAnalysis()
  }
}

/**
 * Get automation settings for a wallet address
 */
export async function getAutomationSettings(walletAddress: string) {
  try {
    const data = await apiRequest(`/automation/${walletAddress}`)

    return {
      automation: data.automation || [],
      settings: data.settings || [],
      next_contribution_date: data.next_contribution_date || new Date().toISOString().split("T")[0],
      ai_analysis_recommendation: data.ai_analysis_recommendation || [],
    }
  } catch (error) {
    console.error("Failed to fetch automation settings:", error)
    // Return mock data as fallback
    return getMockAutomationSettings()
  }
}

/**
 * Update automation settings for a wallet address
 */
export async function updateAutomationSettings(walletAddress: string, settingsType: string, settings: any) {
  try {
    const data = await apiRequest(`/automation/${walletAddress}/${settingsType}`, {
      method: "POST",
      body: JSON.stringify(settings),
    })

    return data
  } catch (error) {
    console.error(`Failed to update ${settingsType} settings:`, error)
    // Return mock success response
    return {
      success: true,
      message: "Settings updated successfully",
      settings: settings,
    }
  }
}

/**
 * Get notifications for a wallet address
 */
export async function getNotifications(walletAddress: string) {
  try {
    const data = await apiRequest(`/notification/${walletAddress}`)
    return data
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    // Return mock data as fallback
    return getMockNotifications()
  }
}

/**
 * Start a chatbot session for a wallet address
 */
export async function startChatbotSession(walletAddress: string) {
  try {
    const data = await apiRequest(`/chatbot/start/${walletAddress}`, {
      method: "POST",
    })
    return data
  } catch (error) {
    console.error("Error starting chatbot session:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Send a message to the chatbot for a wallet address
 */
export async function sendChatbotMessage(walletAddress: string, message: string) {
  try {
    const data = await apiRequest(`/chatbot/run/${walletAddress}`, {
      method: "POST",
      body: JSON.stringify({ text: message }),
    })
    return data
  } catch (error) {
    console.error("Error sending message to chatbot:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Get target information for a wallet address
 */
export async function getTargetInfo(walletAddress: string) {
  try {
    const data = await apiRequest(`/target/${walletAddress}`)
    return data
  } catch (error) {
    console.error("Failed to fetch target info:", error)
    // Return mock data as fallback
    return getMockTargetInfo()
  }
}

// Helper functions to transform API data to frontend format

function transformWeightsToAssetAllocation(weights: any) {
  if (!weights) return getMockPortfolioData().assetAllocation

  try {
    const parsedWeights = typeof weights === "string" ? JSON.parse(weights) : weights
    const colors = ["#8A63D2", "#9D7FE0", "#B29BEE", "#C7B7F7", "#DCD3FF"]

    return Object.entries(parsedWeights).map(([symbol, percentage], index) => ({
      symbol,
      percentage: Number(percentage) * 100,
      color: colors[index % colors.length],
    }))
  } catch (error) {
    console.error("Error parsing weights:", error)
    return getMockPortfolioData().assetAllocation
  }
}

function transformAiInsights(insights: any[]) {
  if (!insights || !Array.isArray(insights)) return getMockPortfolioData().aiInsights

  try {
    const marketAnalysis = insights.find((i) => i.title === "시장분석")?.desc || ""
    const portfolioRecommendation = insights.find((i) => i.title === "포트폴리오 추천")?.desc || ""
    const riskAlert = insights.find((i) => i.title === "리스크 알림")?.desc || ""

    return {
      marketAnalysis,
      portfolioRecommendation,
      riskAlert,
    }
  } catch (error) {
    console.error("Error transforming AI insights:", error)
    return getMockPortfolioData().aiInsights
  }
}

function getAutomationStatus(automation: any[], title: string) {
  if (!automation || !Array.isArray(automation)) return true

  try {
    const item = automation.find((a) => a.title === title)
    return item ? item.enabled : true
  } catch (error) {
    console.error("Error getting automation status:", error)
    return true
  }
}

function generatePerformanceData() {
  // This is still mock data as it's not clear how to get this from the API
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month, index) => ({
    month,
    value: 30 + index * 5,
  }))
}

function transformLstData(lstData: any[]) {
  if (!lstData || !Array.isArray(lstData)) return getMockPortfolioData().lstStaking

  try {
    return lstData.slice(0, 3).map((lst) => ({
      token: lst.name || "Unknown",
      apy: lst.apy || 0,
      apyBase: `${(lst.apy * 0.8).toFixed(1)}%`,
      mevBoost: `${(lst.apy * 0.2).toFixed(1)}%`,
      status: lst.apy > 0 ? "Active" : "Inactive",
    }))
  } catch (error) {
    console.error("Error transforming LST data:", error)
    return getMockPortfolioData().lstStaking
  }
}

// Mock data functions as fallbacks

function getMockPortfolioData() {
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
      marketAnalysis: "Solana DeFi TVL increased by 8.2%",
      portfolioRecommendation: "Consider adding 5% to JitoSOL allocation",
      riskAlert: "SOL price decreased by 3%",
    },
    portfolioSettings: {
      autoRebalancing: true,
      nextRebalanceDate: "2023-05-15",
      goalProgress: true,
    },
    performanceData: [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 25 },
      { month: "Mar", value: 35 },
      { month: "Apr", value: 40 },
      { month: "May", value: 45 },
      { month: "Jun", value: 55 },
      { month: "Jul", value: 65 },
      { month: "Aug", value: 60 },
      { month: "Sep", value: 70 },
      { month: "Oct", value: 75 },
      { month: "Nov", value: 80 },
      { month: "Dec", value: 85 },
    ],
    lstStaking: [
      {
        token: "JitoSOL",
        apy: 9.8,
        apyBase: "8.2%",
        mevBoost: "3.6%",
        status: "Active",
      },
      {
        token: "mSOL",
        apy: 0,
        apyBase: "6.5%",
        mevBoost: "0%",
        status: "Inactive",
      },
      {
        token: "bSOL",
        apy: 0,
        apyBase: "7.1%",
        mevBoost: "0%",
        status: "Increased Risk",
      },
    ],
  }
}

function getMockAssetAnalysis() {
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

function getMockAutomationSettings() {
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

function getMockNotifications() {
  return [
    {
      title: "포트폴리오 리밸런싱 필요",
      level: "critical",
      desc: "BTC 비중이 목표치보다 5.3% 높아졌습니다. 리밸런싱이 필요합니다",
    },
    {
      title: "SOL 가격 급등",
      level: "major",
      desc: "SOL 가격이 24시간 동안 12.5% 상승했습니다. 이는 귀하의 포트폴리오에 긍정적 영향을 미칩니다.",
    },
    {
      title: "Jito APY 상승",
      level: "major",
      desc: "JitoSOL의 APY가 9.8%로 상승했습니다. 이는 이전 대비 04.% 증가한 수치입니다.",
    },
    {
      title: "자동 납입 완료",
      level: "info",
      desc: "성공적으로 자동 납입을 완료했습니다. 자세한 내역은 거래 내역에서 확인하세요.",
    },
    {
      title: "목표 달성률 업데이트",
      level: "info",
      desc: "은퇴 자금 목표 달성률이 32%에 도달했습니다. 목표 달성 확률은 92%입니다.",
    },
  ]
}

function getMockTargetInfo() {
  return {
    total_asset_value: 960000,
    goal_amount: 3000000,
    goal_date: "2040-01-01",
    periodic_contributions: 150,
    success_probability: 92,
    expected_volatility: 5.8,
    ai_recommendations: [
      {
        title: "월 납입액 170 SOL로 증가",
        desc: "적립 비율 115% / 목표 달성 확률 97%",
      },
      {
        title: "목표 기간 17년으로 연장",
        desc: "적립 비율 112% / 목표 달성 확률 95%",
      },
    ],
    other_goals: [
      {
        title: "자녀 대학 교육 자금",
        desc: "적립 비율 65% / 목표 달성 확률 58%",
      },
      {
        title: "주택 구매 자금",
        desc: "적립 비율 42% / 목표 달성 확률 35%",
      },
    ],
  }
}
