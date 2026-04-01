import type { LoanSimulationResult } from '../types/loan'
import { formatYen, formatMonths } from '../calc/format'

interface ComparisonTableProps {
  readonly baseline: LoanSimulationResult
  readonly shortenPeriod: LoanSimulationResult
  readonly reducePayment: LoanSimulationResult
}

export function ComparisonTable({
  baseline,
  shortenPeriod,
  reducePayment,
}: ComparisonTableProps) {
  const rows = [
    {
      label: '月額返済額',
      base: `${formatYen(baseline.monthlyPayment)}円`,
      shorten: `${formatYen(shortenPeriod.monthlyPayment)}円`,
      reduce: `${formatYen(reducePayment.monthlyPayment)}円`,
      shortenBest: false,
      reduceBest: reducePayment.monthlyPayment < baseline.monthlyPayment,
    },
    {
      label: '返済期間',
      base: formatMonths(baseline.actualMonths),
      shorten: formatMonths(shortenPeriod.actualMonths),
      reduce: formatMonths(reducePayment.actualMonths),
      shortenBest: shortenPeriod.actualMonths < baseline.actualMonths,
      reduceBest: false,
    },
    {
      label: '総支払額',
      base: `${formatYen(baseline.totalPayment)}円`,
      shorten: `${formatYen(shortenPeriod.totalPayment)}円`,
      reduce: `${formatYen(reducePayment.totalPayment)}円`,
      shortenBest:
        shortenPeriod.totalPayment <= reducePayment.totalPayment,
      reduceBest:
        reducePayment.totalPayment < shortenPeriod.totalPayment,
    },
    {
      label: '利息総額',
      base: `${formatYen(baseline.totalInterest)}円`,
      shorten: `${formatYen(shortenPeriod.totalInterest)}円`,
      reduce: `${formatYen(reducePayment.totalInterest)}円`,
      shortenBest:
        shortenPeriod.totalInterest <= reducePayment.totalInterest,
      reduceBest:
        reducePayment.totalInterest < shortenPeriod.totalInterest,
    },
    {
      label: '削減利息額',
      base: '-',
      shorten: `${formatYen(baseline.totalInterest - shortenPeriod.totalInterest)}円`,
      reduce: `${formatYen(baseline.totalInterest - reducePayment.totalInterest)}円`,
      shortenBest:
        baseline.totalInterest - shortenPeriod.totalInterest >=
        baseline.totalInterest - reducePayment.totalInterest,
      reduceBest:
        baseline.totalInterest - reducePayment.totalInterest >
        baseline.totalInterest - shortenPeriod.totalInterest,
    },
  ]

  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th></th>
          <th>繰上返済なし</th>
          <th>期間短縮型</th>
          <th>返済額軽減型</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td>{row.label}</td>
            <td>{row.base}</td>
            <td className={row.shortenBest ? 'best' : ''}>
              {row.shorten}
            </td>
            <td className={row.reduceBest ? 'best' : ''}>
              {row.reduce}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
