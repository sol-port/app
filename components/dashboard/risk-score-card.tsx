"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RiskScoreCardProps {
  riskScore: number
  riskScoreMax: number
}

export function RiskScoreCard({ riskScore, riskScoreMax }: RiskScoreCardProps) {
  const [percentage, setPercentage] = useState(0)
  const targetPercentage = (riskScore / riskScoreMax) * 100

  useEffect(() => {
    // Start with 0 and animate to the target percentage
    setPercentage(0)

    // Use setTimeout to start the animation after component is mounted
    const timer = setTimeout(() => {
      // Animate the progress bar filling up
      const animationDuration = 1000 // 1 second
      const stepTime = 20 // Update every 20ms
      const steps = animationDuration / stepTime
      const stepValue = targetPercentage / steps

      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        setPercentage((prev) => {
          const newValue = prev + stepValue
          if (newValue >= targetPercentage || currentStep >= steps) {
            clearInterval(interval)
            return targetPercentage
          }
          return newValue
        })

        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, stepTime)

      return () => clearInterval(interval)
    }, 300) // Small delay before starting animation

    return () => clearTimeout(timer)
  }, [riskScore, riskScoreMax, targetPercentage])

  return (
    <Card className="bg-solport-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-solport-textSecondary">포트폴리오 리스크</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          중위험 ({riskScore}/{riskScoreMax})
        </div>
        <Progress
          value={percentage}
          className="h-2 mt-2 bg-[#334155]"
          indicatorClassName="bg-solport-accent transition-all duration-1000 ease-out"
        />
        <div className="text-sm text-solport-textSecondary mt-2">목표 위험 내</div>
      </CardContent>
    </Card>
  )
}
