import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyPayment } from '../types/loan'

interface LoanChartProps {
  readonly schedule: readonly MonthlyPayment[]
  readonly scheduleLabel?: string
  readonly compareSchedule?: readonly MonthlyPayment[]
  readonly compareLabel?: string
}

function toYearlyData(schedule: readonly MonthlyPayment[]) {
  const yearly: {
    year: number
    balance: number
    principalSum: number
    interestSum: number
  }[] = []

  let principalSum = 0
  let interestSum = 0

  for (const m of schedule) {
    principalSum += m.principalPart + m.prepaymentAmount
    interestSum += m.interestPart

    if (m.month % 12 === 0 || m.month === schedule.length) {
      yearly.push({
        year: Math.ceil(m.month / 12),
        balance: m.remainingBalance,
        principalSum: Math.round(principalSum),
        interestSum: Math.round(interestSum),
      })
      principalSum = 0
      interestSum = 0
    }
  }

  return yearly
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTooltip = (v: any) =>
  typeof v === 'number' ? `${v.toLocaleString()}円` : String(v ?? '')

const formatAxis = (v: number) => {
  if (v >= 10_000_000) return `${(v / 10_000_000).toFixed(0)}千万`
  if (v >= 10_000) return `${(v / 10_000).toFixed(0)}万`
  return v.toString()
}

export function BalanceChart({
  schedule,
  scheduleLabel = '残高',
  compareSchedule,
  compareLabel = '比較',
}: LoanChartProps) {
  const data = toYearlyData(schedule)

  if (compareSchedule) {
    const compareData = toYearlyData(compareSchedule)
    const maxLen = Math.max(data.length, compareData.length)
    const merged = Array.from({ length: maxLen }, (_, i) => ({
      year: i + 1,
      [scheduleLabel]: data[i]?.balance ?? 0,
      [compareLabel]: compareData[i]?.balance ?? 0,
    }))

    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" unit="年" />
            <YAxis tickFormatter={formatAxis} />
            <Tooltip
              formatter={formatTooltip}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={scheduleLabel}
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={compareLabel}
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" unit="年" />
          <YAxis tickFormatter={formatAxis} />
          <Tooltip
            formatter={formatTooltip}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="残高"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PaymentBreakdownChart({
  schedule,
}: {
  readonly schedule: readonly MonthlyPayment[]
}) {
  const data = toYearlyData(schedule)

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" unit="年" />
          <YAxis tickFormatter={formatAxis} />
          <Tooltip
            formatter={formatTooltip}
          />
          <Legend />
          <Bar dataKey="principalSum" name="元金" stackId="a" fill="#2563eb" />
          <Bar dataKey="interestSum" name="利息" stackId="a" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
