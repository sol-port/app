"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface AssetAllocationCardProps {
  assetAllocation: {
    symbol: string
    percentage: number
    color: string
  }[]
}

export function AssetAllocationCard({ assetAllocation }: AssetAllocationCardProps) {
  const data = assetAllocation.map((asset) => ({
    name: asset.symbol,
    value: asset.percentage,
    color: asset.color,
  }))

  return (
    <Card className="bg-solport-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-3/5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={0} // Remove gaps between slices
                dataKey="value"
                strokeWidth={0} // Remove stroke to ensure no gaps
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-2/5 mt-4 md:mt-0 space-y-2">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div className="w-4 h-4 mr-2" style={{ backgroundColor: entry.color }}></div>
              <span className="text-solport-text">
                {entry.name} ({entry.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
