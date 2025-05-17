import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

interface AssetSummaryCardProps {
  totalAssets: number
  dailyChange: number
}

export function AssetSummaryCard({ totalAssets, dailyChange }: AssetSummaryCardProps) {
  const isPositive = dailyChange >= 0

  return (
    <Card className="bg-solport-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-solport-textSecondary">Total Asset Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${totalAssets.toLocaleString()}</div>
        <div className={`flex items-center mt-2 ${isPositive ? "text-solport-success" : "text-red-500"}`}>
          {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          <span>
            {isPositive ? "+" : ""}
            {dailyChange}% (24h)
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
