"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PerformanceChartCardProps {
  performanceData: {
    month: string
    value: number
  }[]
}

export function PerformanceChartCard({ performanceData }: PerformanceChartCardProps) {
  return (
    <Card className="bg-solport-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-medium">포트폴리오 성과</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  borderColor: "#334155",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="px-3 py-2 bg-[#273344] rounded-md text-center">
            <div className="text-sm text-solport-textSecondary">총 수익률</div>
            <div className="text-lg font-bold text-solport-success mt-1">+24.8%</div>
          </div>

          <div className="px-3 py-2 bg-[#273344] rounded-md text-center">
            <div className="text-sm text-solport-textSecondary">연간 수익률</div>
            <div className="text-lg font-bold text-solport-success mt-1">+13.2%</div>
          </div>

          <div className="px-3 py-2 bg-[#273344] rounded-md text-center">
            <div className="text-sm text-solport-textSecondary">목표 대비 지표</div>
            <div className="text-lg font-bold text-solport-success mt-1">목표 초과 3.2%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
