"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, RefreshCw } from "lucide-react"
import { startChatbotSession, sendChatbotMessage, resetChatbotSession } from "@/lib/api/chatbot"
import { useLanguage } from "@/context/language-context"
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatInterfaceProps {
  walletAddress: string
  onConsultationComplete: (result: any) => void
}

export function ChatInterface({ walletAddress, onConsultationComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const { t } = useLanguage()
  const router = useRouter()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Start chatbot session on component mount
  useEffect(() => {
    initChatbot()
  }, [walletAddress])

  const initChatbot = async () => {
    if (!walletAddress) {
      setSessionError("Wallet address is required to start a chat session")
      return
    }

    setIsTyping(true)
    setSessionError(null)

    try {
      const response = await startChatbotSession(walletAddress)

      if (response.text) {
        const aiResponse: Message = {
          id: Date.now().toString(),
          content: response.text,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages([aiResponse])
      } else if (response.status === "error") {
        console.error("Error starting chatbot session:", response.message)
        setSessionError(`Failed to start chat: ${response.message}`)

        // Add a fallback message
        const fallbackMessage: Message = {
          id: "welcome",
          content:
            "Hello, I'm Solly, SolPort's AI asset manager.\n\nI'll help you achieve your cryptocurrency investment goals.\n\nThrough a simple conversation, I'll create a customized portfolio for you.\n\nWhat financial goals would you like to achieve with cryptocurrency investment?",
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages([fallbackMessage])
      }
      setSessionStarted(true)
    } catch (error) {
      console.error("Failed to start chatbot session:", error)
      setSessionError("Failed to connect to chat service. Please try again later.")

      // Add a fallback message
      const fallbackMessage: Message = {
        id: "welcome",
        content:
          "Hello, I'm Solly, SolPort's AI asset manager.\n\nI'll help you achieve your cryptocurrency investment goals.\n\nThrough a simple conversation, I'll create a customized portfolio for you.\n\nWhat financial goals would you like to achieve with cryptocurrency investment?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([fallbackMessage])
      setSessionStarted(true)
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await sendChatbotMessage(walletAddress, input)

      // Check if this is a result message indicating consultation completion
      if (response.type === "result" && response.saved_to_db === true) {
        onConsultationComplete(response)
        return
      }

      let responseText = ""
      if (response.text) {
        responseText = response.text
      } else if (response.status === "error") {
        responseText = t("chat.error")
        setSessionError(`Error: ${response.message || "Unknown error"}`)
      } else {
        responseText = JSON.stringify(response)
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error sending message:", error)
      setSessionError("Failed to send message. Please try again.")

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: t("chat.error"),
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleResetChatbotSession = async () => {
    setMessages([])
    setIsTyping(true)
    setSessionError(null)
    setSessionStarted(false)

    try {
      const response = await resetChatbotSession(walletAddress)

      if (response.text) {
        const aiResponse: Message = {
          id: Date.now().toString(),
          content: response.text,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages([aiResponse])
      } else if (response.status === "error") {
        console.error("Error resetting chatbot session:", response.message)
        setSessionError(`Failed to reset chat: ${response.message}`)

        // Add a fallback message
        const fallbackMessage: Message = {
          id: "welcome",
          content:
            "Hello, I'm Solly, SolPort's AI asset manager.\n\nI'll help you achieve your cryptocurrency investment goals.\n\nThrough a simple conversation, I'll create a customized portfolio for you.\n\nWhat financial goals would you like to achieve with cryptocurrency investment?",
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages([fallbackMessage])
      }
    } catch (error) {
      console.error("Failed to reset chatbot session:", error)
      setSessionError("Failed to reset chat. Please try again later.")

      // Add a fallback message
      const fallbackMessage: Message = {
        id: "welcome",
        content:
          "Hello, I'm Solly, SolPort's AI asset manager.\n\nI'll help you achieve your cryptocurrency investment goals.\n\nThrough a simple conversation, I'll create a customized portfolio for you.\n\nWhat financial goals would you like to achieve with cryptocurrency investment?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([fallbackMessage])
    } finally {
      setIsTyping(false)
      setSessionStarted(true)
    }
  }

  // For demo purposes, let's add a function to simulate consultation completion
  const simulateConsultationComplete = () => {
    // This is just for testing - in a real app, this would come from the API
    const mockResult = {
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

    onConsultationComplete(mockResult)
  }

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6 flex flex-col h-[500px]">
      <h2 className="text-xl font-bold mb-4">{t("chat.title")}</h2>

      {/* Session Error Banner */}
      {sessionError && (
        <div className="bg-red-900/30 border border-red-500 text-red-100 px-4 py-2 rounded-md mb-4 flex items-center justify-between">
          <span>{sessionError}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetChatbotSession}
            className="text-red-100 hover:text-white hover:bg-red-800/30"
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
            {message.role === "assistant" && (
              <div className="w-10 h-10 rounded-full bg-solport-accent flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "assistant" ? "bg-[#273344] text-white" : "bg-solport-accent text-white"
              }`}
            >
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
            {message.role === "user" && (
              <div className="w-10 h-10 rounded-full bg-[#273344] flex items-center justify-center ml-3">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-10 h-10 rounded-full bg-solport-accent flex items-center justify-center mr-3">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-[#273344] rounded-lg p-4 flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-auto">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t("chat.placeholder")}
              className="bg-[#273344] border-0 text-white focus-visible:ring-1 focus-visible:ring-solport-accent"
              disabled={!sessionStarted || isTyping}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-solport-accent hover:bg-solport-accent2"
            disabled={!input.trim() || !sessionStarted || isTyping}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-solport-textSecondary text-center">{t("chat.disclaimer")}</div>
        <div className="mt-2 text-center">
          <Button
            onClick={handleResetChatbotSession}
            variant="outline"
            size="sm"
            className="text-xs bg-transparent border-solport-accent text-solport-accent hover:bg-solport-accent hover:text-white"
          >
            Reset Conversation
          </Button>
        </div>

        {/* For demo purposes only - this would be removed in production */}
        <div className="mt-4 text-center">
          <Button onClick={simulateConsultationComplete} className="bg-gray-600 hover:bg-gray-700 text-xs" size="sm">
            Demo: Complete Consultation
          </Button>
        </div>
      </div>
    </div>
  )
}
