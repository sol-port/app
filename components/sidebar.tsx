"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    name: "대시보드",
    href: "/overview",
  },
  {
    name: "목표 관리",
    href: "/goals",
  },
  {
    name: "자산 분석",
    href: "/analysis",
  },
  {
    name: "자동화 설정",
    href: "/automation",
  },
  {
    name: "일정 센터",
    href: "/calendar",
  },
  {
    name: "AI 어시스턴트",
    href: "/ai-assistant",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-56 h-full bg-solport-card border-r border-[#334155] border-0 flex flex-col">
      <div className="p-4">
        <Link href="/overview" className="flex items-center space-x-2">
          <Image src="/SolPort.svg" alt="SolPort Logo" width={100} height={24} />
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-3 rounded-md transition-colors",
              pathname === item.href
                ? "bg-[#273344] text-white"
                : "text-solport-textSecondary hover:bg-[#273344] hover:text-white",
            )}
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
