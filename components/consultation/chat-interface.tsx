'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Lightbulb } from 'lucide-react';
import { startChatbotSession, sendChatbotMessage } from '@/lib/api/chatbot';
import { useLanguage } from '@/context/language-context';
import { API_CONFIG } from '@/lib/config';

// Base API URL from config
const API_BASE_URL = API_CONFIG.baseUrl;

interface Message {
  id: string;
  content: string;
  example?: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  walletAddress: string;
  onConsultationComplete: (result: any) => void;
}

export function ChatInterface({
  walletAddress,
  onConsultationComplete,
}: ChatInterfaceProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [responseExam, setResponseExam] = useState<string>();
  const [responseHints, setResponseHints] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [errorMode, setErrorMode] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState<boolean>(false);
  const [mockPortfolio, setMockPortfolio] = useState<any>(null);
  const [mockQuestionIndex, setMockQuestionIndex] = useState(0);
  const router = useRouter();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock questions and example answers for fallback mode
  const mockQuestions = [
    {
      text: `Hello, I'm Solly, SolPort's AI asset manager.\n
          I'll help you achieve your cryptocurrency investment goals.\n
          Through a simple conversation, I'll create a customized portfolio for you.\n
          What financial goals would you like to achieve with cryptocurrency investment?`,
      example: [
        'I want to save for retirement',
        `I'm looking to grow my wealth over time`,
        `I need to fund my child's education`,
        'I want to buy a house in the next 5-10 years',
      ],
    },
    {
      text: 'How much are you planning to invest initially, and can you make regular contributions?',
      example: [
        'I can invest 1000 SOL initially and 100 SOL monthly',
        'I have 5000 SOL for initial investment and can add 200 SOL monthly',
        'I want to start with 2000 SOL and contribute 150 SOL per month',
        `I have 3000 SOL to invest now but can't make regular contributions`,
      ],
    },
    {
      text: `What's your risk tolerance on a scale from 1-10, where 10 is highest risk?`,
      example: [
        `I'm conservative, around 3-4`,
        `I'm moderate, about 5-6`,
        `I'm aggressive, around 7-8`,
        'I can tolerate high risk, 9-10',
      ],
    },
    {
      text: `What's your investment time horizon? How long do you plan to hold these investments?`,
      example: [
        'Short-term, 1-3 years',
        'Medium-term, 3-7 years',
        'Long-term, 7-15 years',
        'Very long-term, 15+ years',
      ],
    },
    {
      text: `Do you have any specific cryptocurrencies you're interested in including in your portfolio?`,
      example: [
        `I'm interested in SOL, BTC, and ETH`,
        'I prefer stablecoins and lower-risk assets',
        'I want exposure to SOL and other Solana ecosystem tokens',
        `I'm open to your recommendations`,
      ],
    },
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if wallet has an existing portfolio
  useEffect(() => {
    const checkPortfolio = async () => {
      if (!walletAddress) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/checkportfolio/${walletAddress}`
        );
        if (response.ok) {
          const data = await response.json();
          setHasPortfolio(data.has_portfolio);
        }
      } catch (error) {
        console.error('Error checking portfolio:', error);
        // Don't activate error mode here, just log the error
      }
    };

    checkPortfolio();
  }, [walletAddress]);

  // Start chatbot session on component mount
  useEffect(() => {
    initChatbot();
  }, [walletAddress]);

  // Extract examples from the latest AI message
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (
      latestMessage &&
      latestMessage.role === 'assistant' &&
      latestMessage.example
    ) {
      try {
        // Try to parse the example as JSON if it's a string
        let exampleData: string[] = [];
        if (typeof latestMessage.example === 'string') {
          try {
            const parsed = JSON.parse(latestMessage.example);
            if (Array.isArray(parsed)) {
              exampleData = parsed;
            } else if (typeof parsed === 'object') {
              // If it's an object with numbered keys or other format
              exampleData = Object.values(parsed).map((v) => String(v));
            }
          } catch {
            // If it's not valid JSON, split by newlines or commas
            exampleData = latestMessage.example
              .split(/[\n]/)
              .map((s) => s.trim())
              .filter(Boolean);
          }
        } else if (Array.isArray(latestMessage.example)) {
          exampleData = (latestMessage.example as String[]).map(String);
        }

        if (exampleData.length == 1) {
          setResponseExam(exampleData[0]);
          fallbackResponseHints(latestMessage.content);
        } else if (exampleData.length >= 2) {
          setResponseHints(exampleData);
        }
      } catch (error) {
        console.error('Error parsing example data:', error);
      }
    }
  }, [messages]);

  // For testing the error mode - only in development
  const simulateErrorMode = () => {
    activateErrorMode();
  };

  const activateErrorMode = () => {
    setErrorMode(true);

    // If we don't have any messages yet, add a welcome message
    if (messages.length === 0) {
      askMockQuestion(0);
    }
  };

  const askMockQuestion = (index: number) => {
    const question = mockQuestions[index];

    const questionMessage: Message = {
      id: Date.now().toString(),
      content: question.text,
      example: question.example.join('\n'),
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, questionMessage]);
    setMockQuestionIndex(index);
  };

  const initChatbot = async () => {
    if (!walletAddress) {
      setSessionError('Wallet address is required to start a chat session');
      return;
    }

    setIsTyping(true);
    setSessionError(null);

    try {
      const response = await startChatbotSession(walletAddress);

      if (response.text) {
        const aiResponse: Message = {
          id: Date.now().toString(),
          content: response.text,
          example: response.example,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages([aiResponse]);

        // Update hints based on portfolio status
        if (hasPortfolio) {
          setResponseHints([
            'I want to adjust my portfolio',
            'I want to add more assets',
            'I want to change my risk profile',
            'I want to withdraw some funds',
          ]);
        }
      } else if (response.status === 'error') {
        console.error('Error starting chatbot session:', response.message);
        activateErrorMode();
      }
      setSessionStarted(true);
    } catch (error) {
      console.error('Failed to start chatbot session:', error);
      activateErrorMode();
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // If in error mode, handle the mock conversation flow
    if (errorMode) {
      await handleMockResponse(input);
      return;
    }

    try {
      const response = await sendChatbotMessage(walletAddress, input);

      // Check if this is a result message indicating consultation completion
      if (response.type === 'result' && response.saved_to_db === true) {
        onConsultationComplete(response);
        return;
      }

      let responseText = '';
      let responseExample = undefined;

      if (response.text) {
        responseText = response.text;
        responseExample = response.example;
      } else if (response.status === 'error') {
        // Activate error mode but don't show an error message
        activateErrorMode();
        return;
      } else {
        responseText = JSON.stringify(response);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        example: responseExample,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Activate error mode but don't show an error message
      activateErrorMode();
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Handle mock responses in error mode
  const handleMockResponse = async (userInput: string) => {
    // Wait for a realistic delay (2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Move to the next question or show portfolio
    const nextMockQuestionIndex = mockQuestionIndex + 1;

    if (nextMockQuestionIndex >= mockQuestions.length) {
      // If we've gone through all questions, show the portfolio
      setMockPortfolio(generateMockPortfolio());
      localStorage.setItem(
        'solport-mock-portfolio',
        JSON.stringify(mockPortfolio)
      );
      localStorage.setItem('solport-mock-consultation-completed', 'true');
      onConsultationComplete(mockPortfolio);
      return;
    } else {
      // Otherwise, ask the next question
      askMockQuestion(nextMockQuestionIndex);
    }

    setIsTyping(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Generate a realistic mock portfolio
  const generateMockPortfolio = () => {
    // Current date for realistic timestamps
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(currentDate.getFullYear() + 15);

    return {
      type: 'result',
      saved_to_db: true,
      timestamp: currentDate.toISOString(),
      model_input: {
        initial_investment: 5000,
        periodic_contributions_amount: 150,
        periodic_contributions_frequency: 'monthly',
        goal_date: futureDate.toISOString().split('T')[0],
        goal_amount: 100000,
        risk_tolerance: 7,
        investment_purpose: 'long_term_growth',
      },
      model_output: {
        portfolio_id: '42E...8d9B',
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
        creation_date: currentDate.toISOString(),
        last_rebalance: currentDate.toISOString(),
        portfolio_name: 'Balanced Growth Portfolio',
      },
    };
  };

  // Fallback response hints based on conversation context
  const fallbackResponseHints = (aiResponse: string) => {
    // Convert the input string to lowercase
    const aiResponseLower = aiResponse.toLowerCase();

    // Define keywords and their weights for each question category
    const keywordWeights: { [key: string]: { [key: string]: number } } = {
      0: { init: 1, goal: 1 },
      1: { period: 1, contrib: 1, monthly: 1, quarterly: 1, yearly: 1 },
      2: { risk: 1, tolerance: 1, scale: 1 },
      3: { long: 1, hold: 1 },
      4: { specific: 1, includ: 1 },
    };

    // Initialize scores for each question category
    const scores: { [key: string]: number } = {};

    // Calculate scores based on keyword occurrences and weights
    for (const question in keywordWeights) {
      scores[question] = 0;
      for (const keyword in keywordWeights[question]) {
        const regex = new RegExp(keyword, 'g');
        const matches = aiResponseLower.match(regex);
        if (matches) {
          scores[question] +=
            matches.length * keywordWeights[question][keyword];
        }
      }
    }

    // Find the question category with the highest score
    const maxScoreQuestion = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    // Set response hints based on the highest-scoring question
    setResponseHints(mockQuestions[Number(maxScoreQuestion)].example);
  };

  // Add this function to handle input changes with typing detection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Set user typing state to true
    setIsUserTyping(true);

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to reset the typing state after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1500);
  };

  // Clean up the timeout on component unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Add this function to get a dynamic placeholder based on focus state
  const getInputPlaceholder = () => {
    if (responseExam) {
      return `Example: ${responseExam}`;
    }
    if (responseHints.length > 0) {
      // Show a random hint from the available hints
      const randomIndex = Math.floor(Math.random() * responseHints.length);
      return `Example: ${responseHints[randomIndex]}`;
    }
    return t('chat.placeholder');
  };

  // Render response hints
  const renderResponseHints = () => {
    return null; // Placeholder for response hints rendering

    if (!sessionStarted || isTyping || !inputFocused) {
      return null;
    }

    return (
      <div className="mt-4 p-3 bg-[#1a1e30] rounded-lg transition-all duration-300 ease-out transform translate-y-0 opacity-100">
        <div className="flex items-center text-solport-textSecondary mb-2">
          <Lightbulb className="h-4 w-4 mr-1" />
          <span className="text-sm">{t('chat.suggestedResponses')}</span>
        </div>
        <div className="space-y-2">
          {responseHints.map((hint, index) => (
            <button
              key={index}
              className="block w-full text-left text-sm text-solport-textSecondary bg-[#242b42] hover:bg-[#2a324e] p-2 rounded-md transition-colors"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                setInput(hint);
                inputRef.current?.focus();
              }}
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render portfolio preview within a message
  /*
  const renderPortfolioPreview = (portfolioData: any) => {
    if (!portfolioData) return null;

    const { model_output } = portfolioData;
    const weights = model_output.weights;

    return (
      <div className="mt-3 bg-[#1e2538] p-4 rounded-lg">
        <h3 className="font-medium text-lg mb-2">
          {model_output.portfolio_name}
        </h3>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Expected Return:</span>
            <span className="font-medium text-green-400">
              {(model_output.expected_return * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Risk Level:</span>
            <span className="font-medium">
              {(model_output.expected_volatility * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Success Probability:</span>
            <span className="font-medium text-blue-400">
              {(model_output.success_probability * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <h4 className="text-sm font-medium mb-2">Asset Allocation:</h4>
        <div className="space-y-2">
          {Object.entries(weights).map(([asset, weight]) => (
            <div key={asset} className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-solport-accent mr-2"></div>
              <div className="flex-1 text-sm">{asset}</div>
              <div className="text-sm font-medium">
                {(Number(weight) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  */

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6 flex flex-col h-[500px]">
      <h2 className="text-xl font-bold mb-4">{t('chat.title')}</h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-solport-accent flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'assistant'
                  ? 'bg-[#273344] text-white'
                  : 'bg-solport-accent text-white'
              }`}
            >
              <div className="whitespace-pre-line">{message.content}</div>

              {/* Portfolio preview if this message has one */}
              {/* {message.isPortfolioPreview &&
                message.portfolioData &&
                renderPortfolioPreview(message.portfolioData)} */}

              <div className="text-xs opacity-60 mt-2 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            {message.role === 'user' && (
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
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Response Hints */}
      {inputFocused && renderResponseHints()}

      {/* Input Area */}
      <div className="mt-auto">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={getInputPlaceholder()}
              className={`bg-[#273344] border-0 text-white focus-visible:ring-1 focus-visible:ring-solport-accent ${
                isUserTyping && responseExam
                  ? 'border-l-4 border-l-solport-accent pl-3'
                  : ''
              }`}
              disabled={!sessionStarted || isTyping}
            />
          </div>
          <Button
            className="bg-solport-accent hover:bg-solport-accent2"
            onClick={handleSendMessage}
            disabled={!input.trim() || !sessionStarted || isTyping}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-solport-textSecondary text-center">
          {t('chat.disclaimer')}
        </div>

        {/* For demo purposes only - this would be removed in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 flex justify-center space-x-2">
            <Button
              className="bg-gray-600 hover:bg-gray-700 text-xs"
              size="sm"
              onClick={simulateErrorMode}
            >
              Debug: Simulate Error Mode
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
