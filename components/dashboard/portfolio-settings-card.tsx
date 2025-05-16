import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface PortfolioSettingsCardProps {
  settings: {
    autoRebalancing: boolean
    nextRebalanceDate: string
    goalProgress: boolean
  }
}

export function PortfolioSettingsCard({ settings }: PortfolioSettingsCardProps) {
  return (
    <Card className="bg-solport-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-medium">자동화 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="px-3 py-2 bg-[#273344] rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-solport-success mr-3"></div>
              <span>자동 리밸런싱</span>
            </div>
            <div className="text-sm">
              {settings.autoRebalancing ? (
                <span className="text-solport-success flex items-center">
                  활성화 <Check className="ml-1 h-4 w-4" />
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  비활성화 <X className="ml-1 h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-3 py-2 bg-[#273344] rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-solport-success mr-3"></div>
              <span>자동 납입 설정</span>
            </div>
            <div className="text-sm">매월 5일</div>
          </div>
        </div>

        <div className="px-3 py-2 bg-[#273344] rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-solport-success mr-3"></div>
              <span>목표 가변 전략 조정</span>
            </div>
            <div className="text-sm">
              {settings.goalProgress ? (
                <span className="text-solport-success flex items-center">
                  활성화 <Check className="ml-1 h-4 w-4" />
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  비활성화 <X className="ml-1 h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
