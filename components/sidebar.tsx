"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppState } from "@/context/app-state-context"
import { useLanguage } from "@/context/language-context"
import { Suspense } from "react"

function SidebarContent() {
  const pathname = usePathname()
  const { isConsultationCompleted } = useAppState()
  const { t } = useLanguage()

  // Define sidebar items based on consultation status
  const sidebarItems = [
    {
      name: t("sidebar.aiConsultation"),
      href: "/chat",
      disabled: isConsultationCompleted,
    },
    {
      name: t("sidebar.portfolio"),
      href: "/overview",
      disabled: !isConsultationCompleted,
    },
    {
      name: t("sidebar.goals"),
      href: "/goals",
      disabled: !isConsultationCompleted,
    },
    {
      name: t("sidebar.analysis"),
      href: "/analysis",
      disabled: !isConsultationCompleted,
    },
    {
      name: t("sidebar.automation"),
      href: "/automation",
      disabled: !isConsultationCompleted,
    },
    {
      name: t("sidebar.calendar"),
      href: "/calendar",
      disabled: !isConsultationCompleted,
    },
    {
      name: t("sidebar.notifications"),
      href: "/calendar",
      disabled: !isConsultationCompleted,
    },
  ]

  return (
    <div className="w-56 h-full bg-solport-card border-r border-[#334155] border-0 flex flex-col">
      <div className="p-4">
        <Link href={isConsultationCompleted ? "/overview" : "/chat"} className="flex items-center space-x-2">
          <Image src="/SolPort.svg" alt="SolPort Logo" width={100} height={24} />
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href + item.name}
            href={item.disabled ? "#" : item.href}
            className={cn(
              "flex items-center px-3 py-3 rounded-md transition-colors",
              pathname === item.href
                ? "bg-[#273344] text-white"
                : "text-solport-textSecondary hover:bg-[#273344] hover:text-white",
              item.disabled && "opacity-50 pointer-events-none cursor-not-allowed",
            )}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault()
              }
            }}
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function Sidebar() {
  return (
    <Suspense fallback={<div className="w-56 h-full bg-solport-card animate-pulse"></div>}>
      <SidebarContent />
    </Suspense>
  )
}
