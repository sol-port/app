import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReturnCardProps {
  totalReturn: number
  totalInvestment: number
}

export function ReturnCard({ totalReturn, totalInvestment }: ReturnCardProps) {
  return (
    <Card className="bg-solport-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-solport-textSecondary">운용 목표 달성률</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalReturn}%</div>
        <div className="text-sm text-solport-textSecondary mt-2">목표: ${totalInvestment.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}
