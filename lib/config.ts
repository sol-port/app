// API configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1/8000';
  maxRetries: 2,
  timeout: 10000, // 10 seconds
}

// Wallet configuration
export const WALLET_CONFIG = {
  // Default wallet address for testing/development
  defaultAddress: "5Uj9vWwTGYTGYvs8XgXUhsgmKNtCk8hbVnrQ9ExKJJQa",
  // Regex for validating Solana wallet addresses
  addressRegex: /^[A-Za-z0-9]{32,44}$/,
}

// App configuration
export const APP_CONFIG = {
  // Default language
  defaultLanguage: "ko_KR",
  // Available languages
  languages: ["ko_KR", "en_US"],
  // Default theme
  defaultTheme: "light",
}
