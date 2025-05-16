import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AiInsightsCardProps {
  aiInsights: {
    marketAnalysis: string
    portfolioRecommendation: string
    riskAlert: string
  }
}

export function AiInsightsCard({ aiInsights }: AiInsightsCardProps) {
  return (
    <Card className="bg-solport-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-medium">AI 인사이트</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="px-3 py-2 bg-[#273344] rounded-md">
            <span className="text-solport-textSecondary">시장 분석:</span>
            <br />
            <span className="text-sm">{aiInsights.marketAnalysis}</span>
          </div>
        </div>

        <div>
          <div className="px-3 py-2 bg-[#273344] rounded-md">
            <span className="text-solport-textSecondary">포트폴리오 추천:</span>
            <br />
            <span className="text-sm">{aiInsights.portfolioRecommendation}</span>
          </div>
        </div>

        <div>
          <div className="px-3 py-2 bg-[#273344] rounded-md">
            <span className="text-solport-textSecondary">리스크 알림:</span>
            <br />
            <span className="text-sm">{aiInsights.riskAlert}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
