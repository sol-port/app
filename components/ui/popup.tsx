"use client"

import type * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Popup({ isOpen, onClose, children, className }: PopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className={cn("z-50 mt-16 mr-4 w-64 rounded-lg border-0 bg-solport-card p-4 shadow-lg", className)}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Options</div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[#273344] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
