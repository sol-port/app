import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MonthlyIncomeCardProps {
  monthlyIncome: number
  nextPaymentDate: string
}

export function MonthlyIncomeCard({ monthlyIncome, nextPaymentDate }: MonthlyIncomeCardProps) {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  return (
    <Card className="bg-solport-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-solport-textSecondary">월별 납입액</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{monthlyIncome} SOL</div>
        <div className="text-sm text-solport-textSecondary mt-2">다음 납입일: {formatDate(nextPaymentDate)}</div>
      </CardContent>
    </Card>
  )
}
