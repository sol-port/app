import { apiRequest } from "./api-client"
import { mockChatbotWelcomeMessage, mockChatbotExamples } from "./mock-data"

/**
 * Start a new chatbot session for a wallet address
 */
export async function startChatbotSession(walletAddress: string) {
  try {
    // Check if we have a session in localStorage
    const hasExistingSession = localStorage.getItem(`solport-chatbot-session-${walletAddress}`)

    // If we have an existing session, clear it from localStorage
    if (hasExistingSession) {
      localStorage.removeItem(`solport-chatbot-session-${walletAddress}`)
    }

    // Start a new session
    const response = await apiRequest(
      `/chatbot/start/${walletAddress}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      mockChatbotWelcomeMessage,
    )

    // Mark that we have a session for this wallet
    localStorage.setItem(`solport-chatbot-session-${walletAddress}`, "true")

    // Add default examples if not provided
    if (!response.example) {
      response.example = [
        "What is your target amount?",
        "How long do you plan to invest?",
        "How much can you contribute monthly?",
        "What is your risk tolerance level? (1-10)",
      ]
    }

    return response
  } catch (error) {
    console.error("Error starting chatbot session:", error)
    return mockChatbotWelcomeMessage
  }
}

/**
 * Send a message to the chatbot for a wallet address
 */
export async function sendChatbotMessage(walletAddress: string, message: string) {
  try {
    // Get the session ID - might be a unique one if we had to create one
    const sessionId = localStorage.getItem(`solport-chatbot-session-${walletAddress}`) || walletAddress

    const response = await apiRequest(
      `/chatbot/run/${sessionId === "true" ? walletAddress : sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      },
      {
        text: "I understand your question. Let me help you with that.",
        example: getContextBasedExamples(message),
      },
    )

    // Process the response to ensure it has the expected format
    if (response.text && !response.example) {
      response.example = getContextBasedExamples(message, response.text)
    }

    return response
  } catch (error) {
    console.error("Error sending message to chatbot:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      text: "I'm sorry, I encountered an error processing your request. Please try again.",
      example: getContextBasedExamples(message),
    }
  }
}

/**
 * Reset the chatbot session for a wallet address
 */
export async function resetChatbotSession(walletAddress: string) {
  try {
    // Remove the session marker from localStorage
    localStorage.removeItem(`solport-chatbot-session-${walletAddress}`)

    // Start a new session (which effectively resets the conversation)
    return await startChatbotSession(walletAddress)
  } catch (error) {
    console.error("Error resetting chatbot session:", error)
    return mockChatbotWelcomeMessage
  }
}

/**
 * Check if a wallet has an existing portfolio
 */
export async function checkWalletPortfolio(walletAddress: string) {
  try {
    return apiRequest(
      `/checkportfolio/${walletAddress}`,
      {},
      {
        has_portfolio: false,
      },
    )
  } catch (error) {
    console.error("Error checking wallet portfolio:", error)
    return {
      has_portfolio: false,
    }
  }
}

/**
 * Get context-based examples based on the message content
 */
function getContextBasedExamples(message: string, responseText?: string): string[] {
  const messageLower = message.toLowerCase()
  const responseLower = responseText ? responseText.toLowerCase() : ""

  if (
    messageLower.includes("goal") ||
    messageLower.includes("target") ||
    responseLower.includes("goal") ||
    responseLower.includes("target")
  ) {
    return mockChatbotExamples.goal
  } else if (
    messageLower.includes("period") ||
    messageLower.includes("time") ||
    messageLower.includes("years") ||
    responseLower.includes("period") ||
    responseLower.includes("time") ||
    responseLower.includes("years")
  ) {
    return mockChatbotExamples.period
  } else if (
    messageLower.includes("monthly") ||
    messageLower.includes("contribution") ||
    messageLower.includes("invest") ||
    responseLower.includes("monthly") ||
    responseLower.includes("contribution") ||
    responseLower.includes("invest")
  ) {
    return mockChatbotExamples.monthly
  } else if (
    messageLower.includes("risk") ||
    messageLower.includes("tolerance") ||
    responseLower.includes("risk") ||
    responseLower.includes("tolerance")
  ) {
    return mockChatbotExamples.risk
  }

  // Default examples
  return [
    "What is your target amount?",
    "How long do you plan to invest?",
    "How much can you contribute monthly?",
    "What is your risk tolerance level? (1-10)",
  ]
}
