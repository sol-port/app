import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware runs on every request
export function middleware(request: NextRequest) {
  // Current URL path
  const path = request.nextUrl.pathname

  // Redirect all /chat requests to the root path - simple redirect with no prevention logic
  if (path.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Get state information from cookies
  const isWalletConnected = request.cookies.get("isWalletConnected")?.value === "true"
  const isConsultationCompleted = request.cookies.get("isConsultationCompleted")?.value === "true"

  // Protected page access control - simplified
  if (path !== "/" && !path.startsWith("/api") && !path.startsWith("/_next")) {
    // If wallet is not connected, redirect to home
    if (!isWalletConnected) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // If consultation is not completed, redirect to home
    if (!isConsultationCompleted) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// Specify paths where middleware should run
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png).*)"],
}
