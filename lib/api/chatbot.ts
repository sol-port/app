import {
  startChatbotSession as apiStartChatbotSession,
  sendChatbotMessage as apiSendChatbotMessage,
} from "@/lib/api/client"

interface ChatbotResponse {
  text?: string
  status?: string
  message?: string
  code?: number
  type?: string
  [key: string]: any
}

export async function startChatbotSession(walletAddress: string): Promise<ChatbotResponse> {
  return apiStartChatbotSession(walletAddress)
}

export async function sendChatbotMessage(walletAddress: string, message: string): Promise<ChatbotResponse> {
  return apiSendChatbotMessage(walletAddress, message)
}
