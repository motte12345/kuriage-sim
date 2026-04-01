import { useState } from 'react'
import { Seo } from '../components/Seo'
import type { RepaymentMethod } from '../types/loan'
import { simulateRefinance } from '../calc/loan'
import { formatYen, formatMan, formatMonths } from '../calc/format'
import { ResultHighlight } from '../components/ResultHighlight'
import { BalanceChart } from '../components/LoanChart'
import { ScheduleTable } from '../components/ScheduleTable'

export function KarikaePage() {
  const [balance, setBalance] = useState('2500')
  const [remainingYears, setRemainingYears] = useState('25')
  const [currentRate, setCurrentRate] = useState('2.0')
  const [newRate, setNewRate] = useState('1.0')
  const [cost, setCost] = useState('50')
  const [method, setMethod] = useState<RepaymentMethod>('equal_payment')
  const [result, setResult] = useState<ReturnType<typeof simulateRefinance> | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const b = parseFloat(balance) * 10_000
    const rm = parseInt(remainingYears) * 12
    const cr = parseFloat(currentRate) / 100
    const nr = parseFloat(newRate) / 100
    const c = parseFloat(cost) * 10_000

    if (isNaN(b) || isNaN(rm) || isNaN(cr) || isNaN(nr) || isNaN(c) || b <= 0 || rm <= 0 || cr < 0 || nr < 0 || c < 0) return

    setResult(simulateRefinance({
      currentBalance: b,
      remainingMonths: rm,
      currentRate: cr,
      newRate: nr,
      refinanceCost: c,
      method,
    }))
  }

  return (
    <>
      <Seo
        title="借り換えシミュレーター"
        description="住宅ローンの借り換えが得か損かを判定。諸費用込みの損益分岐点を計算し、何年で元が取れるか確認できます。"
        path="/karikae"
      />
      <h1 className="section-title">借り換えシミュレーター</h1>
      <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
        借り換え先の金利と諸費用を入力し、借り換えが得かどうかを判定します。諸費用込みの損益分岐点も算出します。
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">現在のローン残高 <span className="form-hint">（万円）</span></label>
            <input type="number" className="form-input" value={balance} onChange={(e) => setBalance(e.target.value)} min="1" />
          </div>
          <div className="form-group">
            <label className="form-label">残りの返済期間 <span className="form-hint">（年）</span></label>
            <input type="number" className="form-input" value={remainingYears} onChange={(e) => setRemainingYears(e.target.value)} min="1" max="50" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">現在の年利 <span className="form-hint">（%）</span></label>
            <input type="number" className="form-input" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} min="0" step="0.01" />
          </div>
          <div className="form-group">
            <label className="form-label">借り換え先の年利 <span className="form-hint">（%）</span></label>
            <input type="number" className="form-input" value={newRate} onChange={(e) => setNewRate(e.target.value)} min="0" step="0.01" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">借り換え諸費用 <span className="form-hint">（万円 / 登記・事務手数料等）</span></label>
            <input type="number" className="form-input" value={cost} onChange={(e) => setCost(e.target.value)} min="0" step="1" />
          </div>
          <div className="form-group">
            <label className="form-label">返済方式</label>
            <div className="form-radio-group">
              <label className="form-radio-label">
                <input type="radio" name="method" checked={method === 'equal_payment'} onChange={() => setMethod('equal_payment')} />
                元利均等
              </label>
              <label className="form-radio-label">
                <input type="radio" name="method" checked={method === 'equal_principal'} onChange={() => setMethod('equal_principal')} />
                元金均等
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">計算する</button>
      </form>

      {result && (
        <div>
          <div className="result-grid">
            <ResultHighlight
              label={result.isWorthIt ? '借り換えで得する金額' : '借り換えで損する金額'}
              value={formatMan(Math.abs(result.netSaving))}
              unit="万円"
              variant={result.isWorthIt ? 'accent' : 'danger'}
            />
            <ResultHighlight
              label="損益分岐点"
              value={result.breakEvenMonth !== null ? formatMonths(result.breakEvenMonth) : '回収不可'}
              variant={result.breakEvenMonth !== null ? 'default' : 'danger'}
            />
          </div>

          <div className="card section-gap">
            <h2 className="section-title">比較</h2>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th></th>
                  <th>借り換え前</th>
                  <th>借り換え後</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>月額返済額</td>
                  <td>{formatYen(result.before.monthlyPayment)}円</td>
                  <td className={result.after.monthlyPayment < result.before.monthlyPayment ? 'best' : ''}>{formatYen(result.after.monthlyPayment)}円</td>
                </tr>
                <tr>
                  <td>総支払額</td>
                  <td>{formatYen(result.before.totalPayment)}円</td>
                  <td>{formatYen(result.after.totalPayment)}円</td>
                </tr>
                <tr>
                  <td>利息総額</td>
                  <td>{formatYen(result.before.totalInterest)}円</td>
                  <td className={result.after.totalInterest < result.before.totalInterest ? 'best' : ''}>{formatYen(result.after.totalInterest)}円</td>
                </tr>
                <tr>
                  <td>借り換え諸費用</td>
                  <td>-</td>
                  <td>{formatYen(parseFloat(cost) * 10_000)}円</td>
                </tr>
                <tr>
                  <td>諸費用込み差額</td>
                  <td>-</td>
                  <td className={result.isWorthIt ? 'best' : ''}>{result.isWorthIt ? '-' : '+'}{formatYen(Math.abs(result.netSaving))}円</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card section-gap">
            <h2 className="section-title">残高推移</h2>
            <BalanceChart
              schedule={result.before.schedule}
              scheduleLabel="借り換え前"
              compareSchedule={result.after.schedule}
              compareLabel="借り換え後"
            />
          </div>

          <div className="card section-gap">
            <ScheduleTable schedule={result.before.schedule} label="借り換え前・返済スケジュール" />
            <ScheduleTable schedule={result.after.schedule} label="借り換え後・返済スケジュール" />
          </div>
        </div>
      )}
    </>
  )
}
