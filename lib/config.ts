// API configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://sol-port.xyz/api" || "http://localhost:8000/api",
  maxRetries: 2,
  timeout: 30000, // 30 seconds
}

// Wallet configuration
export const WALLET_CONFIG = {
  defaultAddress: "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa",
  addressRegex: /^[A-Za-z0-9]{32,44}$/,
}

// App configuration
export const APP_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://sol-port.xyz" || "http://localhost:3000",
  languages: ["ko_KR", "en_US"],
  defaultLanguage: "en_US",
  defaultTheme: "light",
}
