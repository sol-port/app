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
  // Translate status values
  const translateStatus = (status: string) => {
    if (status === "활성화") return "Active"
    if (status === "비활성화 중") return "Inactive"
    if (status === "위험성 증가") return "Increased Risk"
    return status
  }

  // Create a new array with translated status values
  const translatedLstStaking = lstStaking.map((item) => ({
    ...item,
    status: translateStatus(item.status),
  }))

  return (
    <Card className="bg-solport-card border-0">
      <CardHeader>
        <CardTitle className="text-lg font-medium">LST Staking Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {translatedLstStaking.map((item) => (
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
                    <span className="text-solport-textSecondary text-xs">APY (Base):</span>{" "}
                    <span className="text-xs">{item.apyBase}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-solport-textSecondary text-xs">MEV Boost:</span>{" "}
                    <span className="text-xs">{item.mevBoost}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-solport-textSecondary text-xs">Status:</span>{" "}
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
