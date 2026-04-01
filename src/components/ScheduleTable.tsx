import type { MonthlyPayment } from '../types/loan'
import { formatYen } from '../calc/format'

interface ScheduleTableProps {
  readonly schedule: readonly MonthlyPayment[]
  readonly label?: string
}

export function ScheduleTable({
  schedule,
  label = '返済スケジュール',
}: ScheduleTableProps) {
  return (
    <details className="collapsible">
      <summary>{label}（全{schedule.length}ヶ月）</summary>
      <div className="collapsible-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>月</th>
              <th>返済額</th>
              <th>元金</th>
              <th>利息</th>
              <th>繰上返済</th>
              <th>残高</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((m) => (
              <tr key={m.month}>
                <td>{m.month}</td>
                <td>{formatYen(m.payment)}円</td>
                <td>{formatYen(m.principalPart)}円</td>
                <td>{formatYen(m.interestPart)}円</td>
                <td>
                  {m.prepaymentAmount > 0
                    ? `${formatYen(m.prepaymentAmount)}円`
                    : '-'}
                </td>
                <td>{formatYen(m.remainingBalance)}円</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
