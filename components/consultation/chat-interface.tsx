"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, RefreshCw, Lightbulb } from "lucide-react"
import { startChatbotSession, sendChatbotMessage } from "@/lib/api/chatbot"
import { useLanguage } from "@/context/language-context"
import { API_CONFIG } from "@/lib/config"

// Base API URL from config
const API_BASE_URL = API_CONFIG.baseUrl

interface Message {
  id: string
  content: string
  example?: string
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
  const [hasPortfolio, setHasPortfolio] = useState<boolean>(false)
  const { t } = useLanguage()
  const [inputFocused, setInputFocused] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // AI response hints based on conversation context
  const [responseHints, setResponseHints] = useState<string[]>([
    "What is your target amount?",
    "How long do you plan to invest?",
    "How much can you contribute monthly?",
    "What is your risk tolerance level? (1-10)",
  ])

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

  // Check if wallet has an existing portfolio
  useEffect(() => {
    const checkPortfolio = async () => {
      if (!walletAddress) return

      try {
        const response = await fetch(`${API_BASE_URL}/checkportfolio/${walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setHasPortfolio(data.has_portfolio)

          // Update hints based on portfolio status
          if (data.has_portfolio) {
            setResponseHints([
              "How would you like to adjust your current portfolio?",
              "Would you like to change your target amount or timeline?",
              "Do you want to adjust your monthly contribution?",
              "Has your risk tolerance changed?",
            ])
          }
        }
      } catch (error) {
        console.error("Error checking portfolio:", error)
      }
    }

    checkPortfolio()
  }, [walletAddress])

  // Start chatbot session on component mount
  useEffect(() => {
    initChatbot()
  }, [walletAddress])

  // Extract examples from the latest AI message
  useEffect(() => {
    const latestMessage = messages[messages.length - 1]
    if (latestMessage && latestMessage.role === "assistant" && latestMessage.example) {
      try {
        // Try to parse the example as JSON if it's a string
        let exampleData: string[] = []
        if (typeof latestMessage.example === "string") {
          try {
            const parsed = JSON.parse(latestMessage.example)
            if (Array.isArray(parsed)) {
              exampleData = parsed
            } else if (typeof parsed === "object") {
              // If it's an object with numbered keys or other format
              exampleData = Object.values(parsed).map((v) => String(v))
            }
          } catch {
            // If it's not valid JSON, split by newlines or commas
            exampleData = latestMessage.example
              .split(/[\n,]/)
              .map((s) => s.trim())
              .filter(Boolean)
          }
        } else if (Array.isArray(latestMessage.example)) {
          exampleData = (latestMessage.example as unknown[]).map(String)
        }

        if (exampleData.length > 0) {
          setResponseHints(exampleData)
        }
      } catch (error) {
        console.error("Error parsing example data:", error)
      }
    }
  }, [messages])

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
          example: response.example,
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
        example: JSON.stringify([
          "I want to save for retirement",
          "I need funds for my child's education",
          "I'm looking to buy a house in 10 years",
          "I want to grow my wealth over time",
        ]),
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
      let responseExample = undefined

      if (response.text) {
        responseText = response.text
        responseExample = response.example
      } else if (response.status === "error") {
        responseText = t("chat.error")
        setSessionError(`Error: ${response.message || "Unknown error"}`)
      } else {
        responseText = JSON.stringify(response)
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        example: responseExample,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])

      // If no examples were provided, generate context-based examples in English
      if (!responseExample) {
        updateResponseHints(input, responseText)
      }
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

  // Update response hints based on conversation context
  const updateResponseHints = (userMessage: string, aiResponse: string) => {
    const userMsgLower = userMessage.toLowerCase()
    const aiMsgLower = aiResponse.toLowerCase()

    if (
      userMsgLower.includes("need") ||
      aiMsgLower.includes("need") ||
      userMsgLower.includes("goal") ||
      aiMsgLower.includes("goal")
    ) {
      setResponseHints([
        "I need $500,000 for retirement",
        "I want to save $200,000 for my child's education",
        "I'm aiming for $300,000 to buy a house",
        "I need $100,000 in 10 years",
      ])
    } else if (
      userMsgLower.includes("period") ||
      aiMsgLower.includes("period") ||
      userMsgLower.includes("year") ||
      aiMsgLower.includes("year") ||
      userMsgLower.includes("time") ||
      aiMsgLower.includes("time")
    ) {
      setResponseHints([
        "I plan to invest for 10 years",
        "I need the funds in 15 years",
        "I'm thinking of a 20-year long-term investment",
        "I want a 5-year short-term investment",
      ])
    } else if (
      userMsgLower.toLowerCase().includes("invest") ||
      aiMsgLower.toLowerCase().includes("invest") ||
      userMsgLower.toLowerCase().includes("contribute") ||
      aiMsgLower.toLowerCase().includes("contribute")
    ) {
      setResponseHints([
        "I can invest 100 SOL monthly",
        "I plan to contribute 50 SOL per month",
        "I can invest up to 200 SOL monthly",
        "I can make a one-time investment of 1000 SOL",
      ])
    } else if (
      userMsgLower.includes("safe") ||
      aiMsgLower.includes("safe") ||
      userMsgLower.includes("risk") ||
      aiMsgLower.includes("risk")
    ) {
      setResponseHints([
        "I can tolerate high risk (8/10)",
        "I prefer moderate risk (5/10)",
        "I prefer safe investments (3/10)",
        "I'm willing to take maximum risk for higher returns (9/10)",
      ])
    }
  }

  /*
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
          example: response.example,
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
          example: JSON.stringify([
            "I want to save for retirement",
            "I need funds for my child's education",
            "I'm looking to buy a house in 10 years",
            "I want to grow my wealth over time",
          ]),
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
        example: JSON.stringify([
          "I want to save for retirement",
          "I need funds for my child's education",
          "I'm looking to buy a house in 10 years",
          "I want to grow my wealth over time",
        ]),
      }
      setMessages([fallbackMessage])
    } finally {
      setIsTyping(false)
      setSessionStarted(true)
    }
  }
  */

  // Add this function to handle input changes with typing detection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    // Set user typing state to true
    setIsUserTyping(true)

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set a timeout to reset the typing state after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false)
    }, 1500)
  }

  // Clean up the timeout on component unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

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

  // Add this function to get a dynamic placeholder based on focus state
  const getInputPlaceholder = () => {
    if (inputFocused && responseHints.length > 0) {
      // When focused, show a random hint from the available hints
      const randomIndex = Math.floor(Math.random() * responseHints.length)
      return `Example: ${responseHints[randomIndex]}`
    }
    return t("chat.placeholder")
  }

  // Render response hints
  const renderResponseHints = () => {
    if (!sessionStarted || messages.length > 2 || isTyping || (!inputFocused && !isUserTyping)) return null

    return (
      <div className="mt-4 p-3 bg-[#1a1e30] rounded-lg transition-all duration-300 ease-out transform translate-y-0 opacity-100">
        <div className="flex items-center text-solport-textSecondary mb-2">
          <Lightbulb className="h-4 w-4 mr-1" />
          <span className="text-sm">{t("chat.suggestedResponses")}</span>
        </div>
        <div className="space-y-2">
          {responseHints.map((hint, index) => (
            <button
              key={index}
              className="block w-full text-left text-sm bg-[#242b42] hover:bg-[#2a324e] p-2 rounded-md transition-colors"
              onClick={() => {
                setInput(hint)
                inputRef.current?.focus()
              }}
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6 flex flex-col h-[500px]">
      <h2 className="text-xl font-bold mb-4">{t("chat.title")}</h2>

      {/* Session Error Banner */}
      {/* {sessionError && (
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
      )} */}

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
              <div className="text-xs opacity-60 mt-2 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
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

      {/* Response Hints */}
      {renderResponseHints()}

      {/* Input Area */}
      <div className="mt-auto">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={getInputPlaceholder()}
              className={`bg-[#273344] border-0 text-white focus-visible:ring-1 focus-visible:ring-solport-accent ${
                isUserTyping && responseHints.length > 0 ? "border-l-4 border-l-solport-accent pl-3" : ""
              }`}
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
        {/* <div className="mt-2 text-center">
          <Button
            onClick={handleResetChatbotSession}
            variant="outline"
            size="sm"
            className="text-xs bg-transparent border-solport-accent text-solport-accent hover:bg-solport-accent hover:text-white"
          >
            {t("chat.resetConversation") || "Reset Conversation"}
          </Button>
        </div> */}

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
