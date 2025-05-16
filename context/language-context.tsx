"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { en_US } from "@/translations/en_US"
import { ko_KR } from "@/translations/ko_KR"

// Define available languages
export type LanguageCode = "en_US" | "ko_KR"

// Define the context type
interface LanguageContextType {
  language: LanguageCode
  setLanguage: (code: LanguageCode) => void
  t: (key: string) => string
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language provider component with Suspense
function LanguageProviderContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get language from URL query parameter or default to English
  const langParam = searchParams.get("lang") as LanguageCode
  const [language, setLanguageState] = useState<LanguageCode>(langParam || "en_US")

  // Update language when URL parameter changes
  useEffect(() => {
    if (langParam && langParam !== language) {
      setLanguageState(langParam)
    }
  }, [langParam, language])

  // Function to set language and update URL
  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code)

    // Update URL with new language parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", code)

    // Replace the URL with the new parameters
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Translation function
  const t = (key: string): string => {
    const translations = language === "ko_KR" ? ko_KR : en_US
    return translations[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Wrapper component with Suspense
export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LanguageProviderContent>{children}</LanguageProviderContent>
    </Suspense>
  )
}

// Hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
