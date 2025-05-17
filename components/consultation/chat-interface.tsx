"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Lightbulb } from "lucide-react"
import { startChatbotSession, sendChatbotMessage } from "@/lib/api/chatbot"
import { useLanguage } from "@/context/language-context"
import { API_CONFIG } from "@/lib/config"
import { useAppState } from "@/context/app-state-context"
import { useRouter } from "next/navigation"

// Base API URL from config
const API_BASE_URL = API_CONFIG.baseUrl

interface Message {
  id: string
  content: string
  example?: string
  role: "user" | "assistant"
  timestamp: Date
  isPortfolioPreview?: boolean
  portfolioData?: any
  exampleAnswers?: string[]
  questionIndex?: number
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
  const [errorMode, setErrorMode] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [mockPortfolio, setMockPortfolio] = useState<any>(null)
  const { setConsultationCompleted, setConsultationResult } = useAppState()
  const router = useRouter()

  // AI response hints based on conversation context
  const [responseHints, setResponseHints] = useState<string[]>([
    "I want to save for retirement",
    "I need funds for my child's education",
    "I'm looking to buy a house in 10 years",
    "I want to grow my wealth over time",
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock questions and example answers for fallback mode
  const mockQuestions = [
    {
      question: "What are your primary financial goals for investing in cryptocurrency?",
      exampleAnswers: [
        "I want to save for retirement",
        "I'm looking to grow my wealth over time",
        "I need to fund my child's education",
        "I want to buy a house in the next 5-10 years",
      ],
    },
    {
      question: "How much are you planning to invest initially, and can you make regular contributions?",
      exampleAnswers: [
        "I can invest 1000 SOL initially and 100 SOL monthly",
        "I have 5000 SOL for initial investment and can add 200 SOL monthly",
        "I want to start with 2000 SOL and contribute 150 SOL per month",
        "I have 3000 SOL to invest now but can't make regular contributions",
      ],
    },
    {
      question: "What's your risk tolerance on a scale from 1-10, where 10 is highest risk?",
      exampleAnswers: [
        "I'm conservative, around 3-4",
        "I'm moderate, about 5-6",
        "I'm aggressive, around 7-8",
        "I can tolerate high risk, 9-10",
      ],
    },
    {
      question: "What's your investment time horizon? How long do you plan to hold these investments?",
      exampleAnswers: [
        "Short-term, 1-3 years",
        "Medium-term, 3-7 years",
        "Long-term, 7-15 years",
        "Very long-term, 15+ years",
      ],
    },
    {
      question: "Do you have any specific cryptocurrencies you're interested in including in your portfolio?",
      exampleAnswers: [
        "I'm interested in SOL, BTC, and ETH",
        "I prefer stablecoins and lower-risk assets",
        "I want exposure to SOL and other Solana ecosystem tokens",
        "I'm open to your recommendations",
      ],
    },
  ]

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
              "I want to adjust my portfolio",
              "I want to add more assets",
              "I want to change my risk profile",
              "I want to withdraw some funds",
            ])
          }
        }
      } catch (error) {
        console.error("Error checking portfolio:", error)
        // Don't activate error mode here, just log the error
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

  // For testing the error mode - only in development
  const simulateErrorMode = () => {
    if (process.env.NODE_ENV === "development") {
      activateErrorMode()
    }
  }

  const activateErrorMode = () => {
    setErrorMode(true)
    setCurrentQuestionIndex(0)

    // If we don't have any messages yet, add a welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Hello, I'm Solly, SolPort's AI asset manager.\n\nI'll help you achieve your cryptocurrency investment goals.\n\nThrough a simple conversation, I'll create a customized portfolio for you.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }

    // Add a transition message
    const transitionMessage: Message = {
      id: Date.now().toString(),
      content:
        "To create the best portfolio for you, I'd like to understand more about your investment goals and preferences.",
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, transitionMessage])

    // After a short delay, ask the first mock question
    setTimeout(() => {
      askMockQuestion(0)
    }, 1000)
  }

  const askMockQuestion = (index: number) => {
    if (index >= mockQuestions.length) {
      // If we've gone through all questions, show the portfolio
      showMockPortfolio()
      return
    }

    const question = mockQuestions[index]

    const questionMessage: Message = {
      id: Date.now().toString(),
      content: question.question,
      role: "assistant",
      timestamp: new Date(),
      exampleAnswers: question.exampleAnswers,
      questionIndex: index,
    }

    setMessages((prev) => [...prev, questionMessage])
    setCurrentQuestionIndex(index)
  }

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
        activateErrorMode()
      }
      setSessionStarted(true)
    } catch (error) {
      console.error("Failed to start chatbot session:", error)
      activateErrorMode()
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

    // If in error mode, handle the mock conversation flow
    if (errorMode) {
      await handleMockResponse(input)
      return
    }

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
        // Activate error mode but don't show an error message
        activateErrorMode()
        return
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

      // Activate error mode but don't show an error message
      activateErrorMode()
    } finally {
      setIsTyping(false)
    }
  }

  // Handle mock responses in error mode
  const handleMockResponse = async (userInput: string) => {
    // Wait for a realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Move to the next question or show portfolio
    const nextQuestionIndex = currentQuestionIndex + 1

    if (nextQuestionIndex >= mockQuestions.length) {
      // If we've gone through all questions, show the portfolio
      showMockPortfolio()
    } else {
      // Otherwise, ask the next question
      askMockQuestion(nextQuestionIndex)
    }

    setIsTyping(false)
  }

  // Generate and show a mock portfolio
  const showMockPortfolio = async () => {
    // First, show a message that we're generating the portfolio
    const processingMessage: Message = {
      id: Date.now().toString(),
      content:
        "Thank you for providing all the information. I'm now designing your personalized portfolio based on your goals and preferences...",
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, processingMessage])

    // Wait for a realistic delay to simulate portfolio generation
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Generate a mock portfolio
    const portfolio = generateMockPortfolio()
    setMockPortfolio(portfolio)

    // Show a message with the portfolio preview
    const portfolioMessage: Message = {
      id: Date.now().toString(),
      content: "I've created a personalized portfolio for you. Here's a preview of your recommended asset allocation:",
      role: "assistant",
      timestamp: new Date(),
      isPortfolioPreview: true,
      portfolioData: portfolio,
    }

    setMessages((prev) => [...prev, portfolioMessage])

    // Wait a moment before showing the final message
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show a final message asking if they want to proceed
    const finalMessage: Message = {
      id: Date.now().toString(),
      content:
        "Would you like to proceed with this portfolio? Type 'yes' to confirm or ask any questions you have about the allocation.",
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, finalMessage])
  }

  // Handle when user confirms the portfolio
  const handlePortfolioConfirmation = async () => {
    // Show confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      content:
        "Great! Your portfolio has been created. I'm taking you to the overview page now where you can see all the details.",
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, confirmationMessage])

    // Store the mock result in local storage for persistence across pages
    if (typeof window !== "undefined" && mockPortfolio) {
      localStorage.setItem("solport-mock-portfolio", JSON.stringify(mockPortfolio))
      localStorage.setItem("solport-mock-consultation-completed", "true")
    }

    // Update global state with mock consultation result
    setConsultationCompleted(true)
    setConsultationResult(mockPortfolio)

    // Wait a moment before redirecting
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to overview page
    router.push("/overview")
  }

  // Generate a realistic mock portfolio
  const generateMockPortfolio = () => {
    // Current date for realistic timestamps
    const currentDate = new Date()
    const futureDate = new Date()
    futureDate.setFullYear(currentDate.getFullYear() + 15)

    return {
      type: "result",
      saved_to_db: true,
      timestamp: currentDate.toISOString(),
      model_input: {
        initial_investment: 5000,
        periodic_contributions_amount: 150,
        periodic_contributions_frequency: "monthly",
        goal_date: futureDate.toISOString().split("T")[0],
        goal_amount: 100000,
        risk_tolerance: 7,
        investment_purpose: "long_term_growth",
      },
      model_output: {
        portfolio_id: `MOCK${Math.floor(Math.random() * 10000)}`,
        weights: {
          BTC: 0.25,
          ETH: 0.25,
          SOL: 0.3,
          USDT: 0.1,
          JitoSOL: 0.1,
        },
        expected_return: 0.145,
        expected_volatility: 0.22,
        success_probability: 0.87,
        creation_date: currentDate.toISOString(),
        last_rebalance: currentDate.toISOString(),
        portfolio_name: "Balanced Growth Portfolio",
      },
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

  // Handle example answer selection
  const handleExampleAnswerSelect = (answer: string) => {
    setInput(answer)
    // Auto-submit after a short delay to simulate typing
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

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
        goal_date: "2040-05-16",
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

  // Render example answers for mock questions
  const renderExampleAnswers = (answers: string[]) => {
    return (
      <div className="mt-3 space-y-2">
        {answers.map((answer, index) => (
          <button
            key={index}
            className="block w-full text-left text-sm bg-[#242b42] hover:bg-[#2a324e] p-2 rounded-md transition-colors"
            onClick={() => handleExampleAnswerSelect(answer)}
          >
            {answer}
          </button>
        ))}
      </div>
    )
  }

  // Render portfolio preview within a message
  const renderPortfolioPreview = (portfolioData: any) => {
    if (!portfolioData) return null

    const { model_output } = portfolioData
    const weights = model_output.weights

    return (
      <div className="mt-3 bg-[#1e2538] p-4 rounded-lg">
        <h3 className="font-medium text-lg mb-2">{model_output.portfolio_name}</h3>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Expected Return:</span>
            <span className="font-medium text-green-400">{(model_output.expected_return * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Risk Level:</span>
            <span className="font-medium">{(model_output.expected_volatility * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Success Probability:</span>
            <span className="font-medium text-blue-400">{(model_output.success_probability * 100).toFixed(0)}%</span>
          </div>
        </div>

        <h4 className="text-sm font-medium mb-2">Asset Allocation:</h4>
        <div className="space-y-2">
          {Object.entries(weights).map(([asset, weight]) => (
            <div key={asset} className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-solport-accent mr-2"></div>
              <div className="flex-1 text-sm">{asset}</div>
              <div className="text-sm font-medium">{(Number(weight) * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Check if the user is confirming the portfolio
  useEffect(() => {
    // If we have a mock portfolio and the user's last message contains "yes", confirm the portfolio
    const lastMessage = messages[messages.length - 1]
    if (
      mockPortfolio &&
      lastMessage &&
      lastMessage.role === "user" &&
      lastMessage.content.toLowerCase().includes("yes")
    ) {
      handlePortfolioConfirmation()
    }
  }, [messages, mockPortfolio])

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6 flex flex-col h-[500px]">
      <h2 className="text-xl font-bold mb-4">{t("chat.title")}</h2>

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

              {/* Example answers for mock questions */}
              {message.role === "assistant" && message.exampleAnswers && renderExampleAnswers(message.exampleAnswers)}

              {/* Portfolio preview if this message has one */}
              {message.isPortfolioPreview && message.portfolioData && renderPortfolioPreview(message.portfolioData)}

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

        {/* For demo purposes only - this would be removed in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 flex justify-center space-x-2">
            <Button onClick={simulateConsultationComplete} className="bg-gray-600 hover:bg-gray-700 text-xs" size="sm">
              Demo: Complete Consultation
            </Button>
            <Button onClick={simulateErrorMode} className="bg-amber-600 hover:bg-amber-700 text-xs" size="sm">
              Debug: Simulate Error Mode
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
