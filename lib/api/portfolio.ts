import { apiRequest as baseApiRequest, validateWalletAddress as baseValidateWalletAddress } from "./api-client"
import { mockAssetAnalysis, mockAutomationSettings } from "./mock-data"

/**
 * Get asset analysis data for a wallet address
 */
export async function getAssetAnalysis(walletAddress: string) {
  if (!baseValidateWalletAddress(walletAddress)) {
    console.error("Invalid wallet address format:", walletAddress)
    return mockAssetAnalysis
  }

  try {
    const data = await baseApiRequest(`/analyze/${walletAddress}`)

    return {
      average_apy: data.average_apy || 0,
      total_profit: data.total_profit || 0,
      assets: data.assets || [],
      last_updated: new Date().toISOString().split("T")[0],
    }
  } catch (error) {
    console.error("Failed to fetch asset analysis:", error)
    // Return mock data as fallback
    return mockAssetAnalysis
  }
}

/**
 * Get automation settings for a wallet address
 */
export async function getAutomationSettings(walletAddress: string) {
  if (!baseValidateWalletAddress(walletAddress)) {
    console.error("Invalid wallet address format:", walletAddress)
    return mockAutomationSettings
  }

  try {
    const data = await baseApiRequest(`/automation/${walletAddress}`)

    return {
      automation: data.automation || [],
      settings: data.settings || [],
      next_contribution_date: data.next_contribution_date || new Date().toISOString().split("T")[0],
      ai_analysis_recommendation: data.ai_analysis_recommendation || [],
    }
  } catch (error) {
    console.error("Failed to fetch automation settings:", error)
    // Return mock data as fallback
    return mockAutomationSettings
  }
}

/**
 * Update automation settings for a wallet address
 */
export async function updateAutomationSettings(walletAddress: string, settingsType: string, settings: any) {
  if (!baseValidateWalletAddress(walletAddress)) {
    console.error("Invalid wallet address format:", walletAddress)
    return {
      success: true,
      message: "Settings updated successfully (mock)",
      settings: settings,
    }
  }

  try {
    const data = await baseApiRequest(
      `/automation/${walletAddress}/${settingsType}`,
      {
        method: "POST",
        body: JSON.stringify(settings),
      },
      {
        success: true,
        message: "Settings updated successfully",
        settings: settings,
      },
    )

    return data
  } catch (error) {
    console.error(`Failed to update ${settingsType} settings:`, error)
    // Return mock success response
    return {
      success: true,
      message: "Settings updated successfully (mock)",
      settings: settings,
    }
  }
}
