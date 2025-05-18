"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletConnection } from "@/components/consultation/wallet-connection"
import { ChatInterface } from "@/components/consultation/chat-interface"
import { PortfolioConfirmation } from "@/components/consultation/portfolio-confirmation"
import { AutomationSettings } from "@/components/consultation/automation-settings"
import { SetupComplete } from "@/components/consultation/setup-complete"
import { useAppState } from "@/context/app-state-context"
import { useLanguage } from "@/context/language-context"

// Define the consultation steps
const STEPS = {
  WALLET_CONNECTION: 0,
  CHAT: 1,
  PORTFOLIO_CONFIRMATION: 2,
  AUTOMATION_SETTINGS: 3,
  SETUP_COMPLETE: 4,
}

export default function HomeChat() {
  const { publicKey, connected } = useWallet()
  const [currentStep, setCurrentStep] = useState(STEPS.WALLET_CONNECTION)
  const [consultationResult, setConsultationResult] = useState<any>(null)
  const { setConsultationCompleted, setConsultationResult: setGlobalResult } = useAppState()
  const router = useRouter()
  const { t } = useLanguage()

  // Handle wallet connection state
  useEffect(() => {
    handleWalletConnect()
  }, [connected, currentStep])

  // Handle wallet connection
  const handleWalletConnect = () => {
    if (connected && currentStep === STEPS.WALLET_CONNECTION) {
      setCurrentStep(STEPS.CHAT)
    }
    if (!connected && currentStep !== STEPS.WALLET_CONNECTION) {
      setCurrentStep(STEPS.WALLET_CONNECTION)
    }
  }

  // Handle consultation completion
  const handleConsultationComplete = (result: any) => {
    setConsultationResult(result)
    setCurrentStep(STEPS.PORTFOLIO_CONFIRMATION)
  }

  // Handle portfolio confirmation
  const handlePortfolioConfirm = () => {
    setCurrentStep(STEPS.AUTOMATION_SETTINGS)
  }

  // Handle retry
  const handleRetry = () => {
    console.log("Restart consultation clicked - functionality not yet available")
  }

  // Handle automation settings completion
  const handleAutomationComplete = () => {
    setCurrentStep(STEPS.SETUP_COMPLETE)
  }

  // Handle setup completion
  const handleSetupComplete = () => {
    // Update global state
    setGlobalResult(consultationResult)

    // Ensure consultation is marked as completed
    setConsultationCompleted(true)

    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      router.push("/overview")
      router.refresh()
    }, 100)
  }

  // Get wallet address
  const walletAddress = publicKey?.toString() || ""

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.WALLET_CONNECTION:
        return <WalletConnection onComplete={handleWalletConnect} />

      case STEPS.CHAT:
        return <ChatInterface walletAddress={walletAddress} onConsultationComplete={handleConsultationComplete} />

      case STEPS.PORTFOLIO_CONFIRMATION:
        return (
          <PortfolioConfirmation
            result={consultationResult}
            walletAddress={walletAddress}
            onConfirm={handlePortfolioConfirm}
            onRetry={handleRetry}
          />
        )

      case STEPS.AUTOMATION_SETTINGS:
        return (
          <AutomationSettings
            portfolioResult={consultationResult}
            walletAddress={walletAddress}
            onComplete={handleAutomationComplete}
          />
        )

      case STEPS.SETUP_COMPLETE:
        return (
          <SetupComplete
            portfolioId={consultationResult?.model_output?.portfolio_id || "42E...8d9B"}
            walletAddress={walletAddress}
            onComplete={handleSetupComplete}
          />
        )

      default:
        return <WalletConnection onComplete={() => setCurrentStep(STEPS.CHAT)} />
    }
  }

  // Calculate progress percentage correctly
  const calculateProgressWidth = () => {
    if (currentStep === 0) return "5%"
    const totalSteps = 4
    const stepPercentage = 90 / (totalSteps - 1)
    const stepIndex = Math.min(currentStep, totalSteps - 1)
    return `${(stepPercentage * stepIndex) + 5}%`
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps with improved alignment */}
      <div className="mb-6">
        {/* Step circles and labels */}
        <div className="flex items-center justify-between relative mb-2">
          {/* Step 1: Wallet Connection */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= STEPS.WALLET_CONNECTION ? "bg-solport-accent" : "bg-[#334155]"
              }`}
            >
              {currentStep > STEPS.WALLET_CONNECTION ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-white text-sm">1</span>
              )}
            </div>
            <span className="text-xs mt-1 text-solport-textSecondary">{t("wallet.title")}</span>
          </div>

          {/* Step 2: Chat */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= STEPS.CHAT ? "bg-solport-accent" : "bg-[#334155]"
              }`}
            >
              {currentStep > STEPS.CHAT ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-white text-sm">2</span>
              )}
            </div>
            <span className="text-xs mt-1 text-solport-textSecondary">{t("chat.title")}</span>
          </div>

          {/* Step 3: Portfolio */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= STEPS.PORTFOLIO_CONFIRMATION ? "bg-solport-accent" : "bg-[#334155]"
              }`}
            >
              {currentStep > STEPS.PORTFOLIO_CONFIRMATION ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-white text-sm">3</span>
              )}
            </div>
            <span className="text-xs mt-1 text-solport-textSecondary">{t("sidebar.portfolio")}</span>
          </div>

          {/* Step 4: Automation */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= STEPS.AUTOMATION_SETTINGS ? "bg-solport-accent" : "bg-[#334155]"
              }`}
            >
              {currentStep > STEPS.AUTOMATION_SETTINGS ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-white text-sm">4</span>
              )}
            </div>
            <span className="text-xs mt-1 text-solport-textSecondary">{t("sidebar.automation")}</span>
          </div>

          {/* Background line connecting all steps */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#334155] -z-0"></div>
        </div>

        {/* Progress bar - positioned directly beneath the step indicators */}
        <div className="relative h-1 mt-4">
          {/* Background track */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#334155] rounded-full"></div>

          {/* Progress indicator - width calculated based on current step */}
          <div
            className="absolute top-0 left-0 h-1 bg-solport-accent rounded-full transition-all duration-500 ease-in-out"
            style={{ width: calculateProgressWidth() }}
          ></div>
        </div>
      </div>

      {/* Current Step Content */}
      {renderStep()}
    </div>
  )
}
