import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LstStakingCardProps {
  lstStaking: {
    token: string
    apy: number
    apyBase: string
    mevBoost: string
    status: string
  }[]
}

export function LstStakingCard({ lstStaking }: LstStakingCardProps) {
  return (
    <Card className="bg-solport-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-medium">LST 스테이킹 수익</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lstStaking.map((item) => (
            <Card key={item.token} className="bg-[#273344] border-0">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base text-center">{item.token}</CardTitle>
              </CardHeader>
              <CardContent className="py-3 px-4">
                <div
                  className={`text-2xl font-bold text-center ${
                    item.apy > 0 ? "text-solport-success" : "text-solport-textSecondary"
                  }`}
                >
                  {item.apy}%
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-center">
                    <span className="text-solport-textSecondary text-xs">APY (기본):</span>{" "}
                    <span className="text-xs">{item.apyBase}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-solport-textSecondary text-xs">MEV 부스트:</span>{" "}
                    <span className="text-xs">{item.mevBoost}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-solport-textSecondary text-xs">상태:</span>{" "}
                    <span className="text-xs">{item.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
