import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { AppStateProvider } from "@/context/app-state-context"
import { LanguageProvider } from "@/context/language-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolPort - Solana Portfolio Manager",
  description: "A Solana-based portfolio application for managing and monitoring your crypto assets",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <AppStateProvider>
              <LanguageProvider>{children}</LanguageProvider>
            </AppStateProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
