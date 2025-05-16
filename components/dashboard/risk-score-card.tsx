import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RiskScoreCardProps {
  riskScore: number
  riskScoreMax: number
}

export function RiskScoreCard({ riskScore, riskScoreMax }: RiskScoreCardProps) {
  const percentage = (riskScore / riskScoreMax) * 100

  return (
    <Card className="bg-solport-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-solport-textSecondary">포트폴리오 리스크</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          중위험 ({riskScore}/{riskScoreMax})
        </div>
        <Progress value={percentage} className="h-2 mt-2 bg-[#334155]" indicatorClassName="bg-solport-accent" />
        <div className="text-sm text-solport-textSecondary mt-2">목표 위험 내</div>
      </CardContent>
    </Card>
  )
}
