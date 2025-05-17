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
  // Convert Korean month names to English
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const data = months.map((month, index) => ({
    month: months[index],
  }))

  // Map the data to use English month names
  /*
  const translatedData = performanceData.map((item) => {
    // Extract the month number from Korean format (e.g., "1월" -> 1)
    const monthNumber = Number.parseInt(item.month.replace("월", "")) - 1
    return {
      ...item,
      month: months[monthNumber],
    }
  })
  */

  return (
    <Card className="bg-solport-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={true} />
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
            <div className="text-sm text-solport-textSecondary">Total Return</div>
            <div className="text-lg font-bold text-solport-success mt-1">+24.8%</div>
          </div>

          <div className="px-3 py-2 bg-[#273344] rounded-md text-center">
            <div className="text-sm text-solport-textSecondary">Annual Return</div>
            <div className="text-lg font-bold text-solport-success mt-1">+13.2%</div>
          </div>

          <div className="px-3 py-2 bg-[#273344] rounded-md text-center">
            <div className="text-sm text-solport-textSecondary">Target Comparison</div>
            <div className="text-lg font-bold text-solport-success mt-1">Exceeding target by 3.2%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
