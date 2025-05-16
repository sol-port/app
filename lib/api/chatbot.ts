// API client for the chatbot service

interface ChatbotResponse {
  text?: string
  status?: string
  message?: string
  code?: number
  type?: string
  [key: string]: any
}

export async function startChatbotSession(walletAddress: string): Promise<ChatbotResponse> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/chatbot/start/${walletAddress}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

export async function sendChatbotMessage(walletAddress: string, message: string): Promise<ChatbotResponse> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/chatbot/run/${walletAddress}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
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
