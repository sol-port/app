// Base API URL - this should be configurable based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1/8000';

/**
 * Start a new chatbot session for a wallet address
 * This function will handle the "Session already exists" error by resetting the session first
 */
export async function startChatbotSession(walletAddress: string) {
  try {
    // Check if we have a session in localStorage
    const hasExistingSession = localStorage.getItem(`solport-chatbot-session-${walletAddress}`)

    // If we have an existing session, try to reset it first
    if (hasExistingSession) {
      try {
        // Attempt to reset the session - this endpoint would need to be implemented on the backend
        await fetch(`${API_BASE_URL}/chatbot/reset/${walletAddress}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        // Remove the session marker from localStorage
        localStorage.removeItem(`solport-chatbot-session-${walletAddress}`)
      } catch (resetError) {
        console.warn("Failed to reset existing session, will try to create a new one anyway:", resetError)
      }
    }

    // Now try to start a new session
    const response = await fetch(`${API_BASE_URL}/chatbot/start/${walletAddress}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // If we get a 409 Conflict (session already exists), try one more approach
      if (response.status === 409) {
        // Try with a unique session ID based on timestamp
        const uniqueSessionId = `${walletAddress}-${Date.now()}`
        const retryResponse = await fetch(`${API_BASE_URL}/chatbot/start/${uniqueSessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (retryResponse.ok) {
          // Store the unique session ID for future reference
          localStorage.setItem(`solport-chatbot-session-${walletAddress}`, uniqueSessionId)
          return await retryResponse.json()
        }
      }

      throw new Error(`Failed to start chatbot session: ${await response.text()}`)
    }

    // Mark that we have a session for this wallet
    localStorage.setItem(`solport-chatbot-session-${walletAddress}`, "true")
    return await response.json()
  } catch (error) {
    console.error("Error starting chatbot session:", error)

    // Return a fallback welcome message
    return {
      text: "Hello, I'm Solly, SolPort's AI asset manager.\n\nI'll help you achieve your cryptocurrency investment goals.\n\nThrough a simple conversation, I'll create a customized portfolio for you.\n\nWhat financial goals would you like to achieve with cryptocurrency investment?",
    }
  }
}

/**
 * Send a message to the chatbot for a wallet address
 */
export async function sendChatbotMessage(walletAddress: string, message: string) {
  try {
    // Get the session ID - might be a unique one if we had to create one
    const sessionId = localStorage.getItem(`solport-chatbot-session-${walletAddress}`) || walletAddress

    const response = await fetch(`${API_BASE_URL}/chatbot/run/${sessionId === "true" ? walletAddress : sessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send message: ${await response.text()}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending message to chatbot:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
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

    // Try to reset on the server if possible
    try {
      await fetch(`${API_BASE_URL}/chatbot/reset/${walletAddress}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (resetError) {
      console.warn("Failed to reset session on server:", resetError)
    }

    // Start a new session
    return await startChatbotSession(walletAddress)
  } catch (error) {
    console.error("Error resetting chatbot session:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function checkPortfolio(walletAddress: string): Promise<ChatbotResponse> {
  try {
    const response = await fetch(`${API_URL}/checkportfolio/${walletAddress}`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error starting chatbot session:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}