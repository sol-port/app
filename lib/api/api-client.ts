import { API_CONFIG } from "@/lib/config"

// Base API URL from config
const API_BASE_URL = API_CONFIG.baseUrl || "http://localhost:8000"

// Maximum number of retries for API requests
const MAX_RETRIES = API_CONFIG.maxRetries || 2

// Timeout for API requests in milliseconds
const API_TIMEOUT = API_CONFIG.timeout || 20000

/**
 * Generic API request function with error handling, retries, and fallbacks
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback: T,
  retries = 0,
): Promise<T> {
  try {
    console.log(`Fetching from: ${API_BASE_URL}${endpoint}`)

    // Add timeout to fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

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
        console.warn(`Resource not found: ${endpoint}, using mock data`)
        return mockFallback
      }

      // If we get a 401 or 403, there's an authentication/authorization issue
      if (response.status === 401 || response.status === 403) {
        console.warn("Authentication error, using mock data")
        return mockFallback
      }

      // For server errors, we can retry
      if (response.status >= 500 && retries < MAX_RETRIES) {
        console.log(`Retrying request to ${endpoint} (attempt ${retries + 1} of ${MAX_RETRIES})`)
        return apiRequest(endpoint, options, mockFallback, retries + 1)
      }

      console.warn(`API error: ${response.status}, using mock data`)
      return mockFallback
    }

    return await response.json()
  } catch (error) {
    // Handle abort errors (timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error(`Request timeout: ${endpoint}`)
      console.warn("Request timeout, using mock data")
      return mockFallback
    }

    console.error(`API request failed: ${endpoint}`, error)

    // Retry on network errors
    if (error instanceof TypeError && error.message.includes("fetch") && retries < MAX_RETRIES) {
      console.log(`Network error, retrying request to ${endpoint} (attempt ${retries + 1} of ${MAX_RETRIES})`)
      // Add exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
      return apiRequest(endpoint, options, mockFallback, retries + 1)
    }

    console.warn("API request failed, using mock data")
    return mockFallback
  }
}

/**
 * Validate wallet address format
 */
export function validateWalletAddress(address: string): boolean {
  const addressRegex = /^[A-Za-z0-9]{32,44}$/
  return addressRegex.test(address)
}
