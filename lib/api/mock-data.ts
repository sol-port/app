/**
 * This file contains all mock data for the application in English.
 * It serves as a centralized repository for mock data that can be used
 * as fallbacks when real API calls fail.
 */

// Portfolio mock data
export const mockPortfolioData = {
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
    portfolioRecommendation: "Consider adding 5% more JitoSOL",
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
      status: "Risk Increased",
    },
  ],
}

// Asset analysis mock data
export const mockAssetAnalysis = {
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

// Automation settings mock data
export const mockAutomationSettings = {
  automation: [
    {
      title: "Auto Rebalancing",
      enabled: true,
    },
    {
      title: "Auto Contribution",
      enabled: true,
    },
    {
      title: "Goal-based Strategy Adjustment",
      enabled: true,
    },
  ],
  settings: [
    {
      title: "Auto Rebalancing",
      options: {
        frequency: [
          { value: "monthly", label: "Monthly", selected: true },
          { value: "yearly", label: "Yearly", selected: false },
        ],
        threshold: [
          { value: "5", label: "5% or more", selected: true },
          { value: "10", label: "10% or more", selected: false },
          { value: "15", label: "15% or more", selected: false },
        ],
      },
    },
    {
      title: "Auto Contribution",
      options: {
        amount: { value: 150, unit: "SOL" },
        date: { day: 15, description: "Monthly on the 15th" },
      },
    },
    {
      title: "Goal-based Strategy Adjustment",
      options: {
        threshold: [
          { value: "80", label: "Below 80%", selected: false },
          { value: "90", label: "Below 90%", selected: true },
        ],
        frequency: [
          { value: "quarterly", label: "Quarterly", selected: true },
          { value: "yearly", label: "Yearly", selected: false },
        ],
        adjustment_type: [
          { value: "auto", label: "Auto Suggestion", selected: true },
          { value: "manual", label: "Manual Approval", selected: false },
        ],
      },
    },
  ],
  next_contribution_date: "2023-06-15",
  ai_analysis_recommendation: [
    {
      title: "Enable JitoSOL Auto Compounding",
      desc: "Automatically reinvest staking rewards for an additional 0.4% annual return",
    },
    {
      title: "Activate DCA (Dollar Cost Averaging) Strategy",
      desc: "Optimize automatic contribution schedule based on market volatility to improve average entry price",
    },
  ],
}

// Notifications mock data
export const mockNotifications = [
  {
    title: "Portfolio Rebalancing Alert",
    level: "critical",
    desc: "BTC allocation has increased by 5.3% above target. Rebalancing is recommended.",
  },
  {
    title: "SOL Price Surge",
    level: "major",
    desc: "SOL price has increased by 12.5% in 24 hours. This has a positive impact on your portfolio.",
  },
  {
    title: "Jito APY Increase",
    level: "major",
    desc: "JitoSOL's APY has increased to 9.8%. This is 0.4% higher than before.",
  },
  {
    title: "Auto Contribution Complete",
    level: "info",
    desc: "Auto contribution has been completed successfully. Check your transaction history for details.",
  },
  {
    title: "Goal Progress Update",
    level: "info",
    desc: "Your retirement fund goal progress has reached 32%. The probability of achieving your goal is 92%.",
  },
]

// Target info mock data
export const mockTargetInfo = {
  total_asset_value: 960000,
  goal_amount: 3000000,
  goal_date: "2040-01-01",
  periodic_contributions: 150,
  success_probability: 92,
  expected_volatility: 5.8,
  ai_recommendations: [
    {
      title: "Increase monthly contribution to 170 SOL",
      desc: "Funded Ratio: 115% / Goal Achievement Probability: 97%",
    },
    {
      title: "Extend goal period to 17 years",
      desc: "Funded Ratio: 112% / Goal Achievement Probability: 95%",
    },
  ],
  other_goals: [
    {
      title: "Child's College Education Fund",
      desc: "Funded Ratio: 65% / Goal Achievement Probability: 58%",
    },
    {
      title: "Home Purchase Fund",
      desc: "Funded Ratio: 42% / Goal Achievement Probability: 35%",
    },
  ],
}

// Chatbot mock data
export const mockChatbotWelcomeMessage = {
  text: "Hello, I'm Solly, SolPort's AI asset manager.\n\nI'll help you achieve your cryptocurrency investment goals.\n\nThrough a simple conversation, I'll create a customized portfolio for you.\n\nWhat financial goals would you like to achieve with cryptocurrency investment?",
  example: [
    "I want to save for retirement",
    "I need funds for my child's education",
    "I'm looking to buy a house in 10 years",
    "I want to grow my wealth over time",
  ],
}

// Chatbot response examples based on context
export const mockChatbotExamples = {
  goal: [
    "I need $500,000 for retirement",
    "I want to save $200,000 for my child's education",
    "I'm aiming for $300,000 to buy a house",
    "I need $100,000 in 10 years",
  ],
  period: [
    "I plan to invest for 10 years",
    "I need the funds in 15 years",
    "I'm thinking of a 20-year long-term investment",
    "I want a 5-year short-term investment",
  ],
  monthly: [
    "I can invest 100 SOL monthly",
    "I plan to contribute 50 SOL per month",
    "I can invest up to 200 SOL monthly",
    "I can make a one-time investment of 1000 SOL",
  ],
  risk: [
    "I can tolerate high risk (8/10)",
    "I prefer moderate risk (5/10)",
    "I prefer safe investments (3/10)",
    "I'm willing to take maximum risk for higher returns (9/10)",
  ],
}

// Mock consultation result
export const mockConsultationResult = {
  type: "result",
  saved_to_db: true,
  model_input: {
    initial_investment: 5000,
    periodic_contributions_amount: 150,
    periodic_contributions_frequency: "monthly",
    goal_date: "2040-01-01",
    goal_amount: 100000,
    risk_tolerance: 7,
  },
  model_output: {
    portfolio_id: "42E...8d9B",
    weights: {
      BTC: 0.3,
      ETH: 0.25,
      SOL: 0.2,
      USDT: 0.15,
      JitoSOL: 0.1,
    },
    expected_return: 0.112,
    expected_volatility: 0.185,
    success_probability: 0.92,
  },
}
