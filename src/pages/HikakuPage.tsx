import { useState } from 'react'
import { Seo } from '../components/Seo'
import type { RepaymentMethod } from '../types/loan'
import { simulateLoan } from '../calc/loan'
import type { LoanSimulationResult } from '../types/loan'
import { formatYen, formatMonths } from '../calc/format'
import { BalanceChart } from '../components/LoanChart'
import { ScheduleTable } from '../components/ScheduleTable'

interface LoanInput {
  readonly label: string
  readonly principal: string
  readonly rate: string
  readonly years: string
  readonly method: RepaymentMethod
}

const defaultA: LoanInput = {
  label: 'ローンA',
  principal: '3000',
  rate: '1.5',
  years: '35',
  method: 'equal_payment',
}

const defaultB: LoanInput = {
  label: 'ローンB',
  principal: '3000',
  rate: '1.0',
  years: '35',
  method: 'equal_payment',
}

function LoanForm({
  loan,
  onChange,
}: {
  readonly loan: LoanInput
  readonly onChange: (field: keyof LoanInput, value: string) => void
}) {
  return (
    <div>
      <div className="form-group">
        <label className="form-label">借入額 <span className="form-hint">（万円）</span></label>
        <input type="number" className="form-input" value={loan.principal} onChange={(e) => onChange('principal', e.target.value)} min="1" />
      </div>
      <div className="form-group">
        <label className="form-label">年利 <span className="form-hint">（%）</span></label>
        <input type="number" className="form-input" value={loan.rate} onChange={(e) => onChange('rate', e.target.value)} min="0" step="0.01" />
      </div>
      <div className="form-group">
        <label className="form-label">返済期間 <span className="form-hint">（年）</span></label>
        <input type="number" className="form-input" value={loan.years} onChange={(e) => onChange('years', e.target.value)} min="1" max="50" />
      </div>
      <div className="form-group">
        <label className="form-label">返済方式</label>
        <div className="form-radio-group">
          <label className="form-radio-label">
            <input type="radio" checked={loan.method === 'equal_payment'} onChange={() => onChange('method', 'equal_payment')} />
            元利均等
          </label>
          <label className="form-radio-label">
            <input type="radio" checked={loan.method === 'equal_principal'} onChange={() => onChange('method', 'equal_principal')} />
            元金均等
          </label>
        </div>
      </div>
    </div>
  )
}

export function HikakuPage() {
  const [loanA, setLoanA] = useState(defaultA)
  const [loanB, setLoanB] = useState(defaultB)
  const [result, setResult] = useState<{ a: LoanSimulationResult; b: LoanSimulationResult } | null>(null)

  const updateA = (field: keyof LoanInput, value: string) => setLoanA({ ...loanA, [field]: value })
  const updateB = (field: keyof LoanInput, value: string) => setLoanB({ ...loanB, [field]: value })

  const calc = (loan: LoanInput) =>
    simulateLoan({
      principal: parseFloat(loan.principal) * 10_000,
      annualRate: parseFloat(loan.rate) / 100,
      totalMonths: parseInt(loan.years) * 12,
      method: loan.method,
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setResult({ a: calc(loanA), b: calc(loanB) })
    } catch {
      // validation error
    }
  }

  return (
    <>
      <Seo
        title="ローン比較ツール"
        description="2つのローン条件を横並びで比較。月額返済額・総支払額・利息総額の違いを一目で確認。固定金利vs変動金利の検討にも。"
        path="/hikaku"
      />
      <h1 className="section-title">ローン比較ツール</h1>
      <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
        2つのローン条件を並べて比較します。固定金利 vs 変動金利（想定金利）の検討にも使えます。
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div className="result-grid">
          <div className="card">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>ローンA</h2>
            <LoanForm loan={loanA} onChange={updateA} />
          </div>
          <div className="card">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>ローンB</h2>
            <LoanForm loan={loanB} onChange={updateB} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block">比較する</button>
      </form>

      {result && (
        <div>
          <div className="card">
            <h2 className="section-title">比較結果</h2>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ローンA</th>
                  <th>ローンB</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>月額返済額</td>
                  <td className={result.a.monthlyPayment <= result.b.monthlyPayment ? 'best' : ''}>{formatYen(result.a.monthlyPayment)}円</td>
                  <td className={result.b.monthlyPayment <= result.a.monthlyPayment ? 'best' : ''}>{formatYen(result.b.monthlyPayment)}円</td>
                </tr>
                <tr>
                  <td>返済期間</td>
                  <td>{formatMonths(result.a.actualMonths)}</td>
                  <td>{formatMonths(result.b.actualMonths)}</td>
                </tr>
                <tr>
                  <td>総支払額</td>
                  <td className={result.a.totalPayment <= result.b.totalPayment ? 'best' : ''}>{formatYen(result.a.totalPayment)}円</td>
                  <td className={result.b.totalPayment <= result.a.totalPayment ? 'best' : ''}>{formatYen(result.b.totalPayment)}円</td>
                </tr>
                <tr>
                  <td>利息総額</td>
                  <td className={result.a.totalInterest <= result.b.totalInterest ? 'best' : ''}>{formatYen(result.a.totalInterest)}円</td>
                  <td className={result.b.totalInterest <= result.a.totalInterest ? 'best' : ''}>{formatYen(result.b.totalInterest)}円</td>
                </tr>
                <tr>
                  <td>利息の差額</td>
                  <td colSpan={2} style={{ textAlign: 'center', fontWeight: 700 }}>
                    {formatYen(Math.abs(result.a.totalInterest - result.b.totalInterest))}円
                    {result.a.totalInterest !== result.b.totalInterest && (
                      <>（{result.a.totalInterest < result.b.totalInterest ? 'ローンA' : 'ローンB'}が有利）</>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card section-gap">
            <h2 className="section-title">残高推移</h2>
            <BalanceChart
              schedule={result.a.schedule}
              scheduleLabel="ローンA"
              compareSchedule={result.b.schedule}
              compareLabel="ローンB"
            />
          </div>

          <div className="card section-gap">
            <ScheduleTable schedule={result.a.schedule} label="ローンA・返済スケジュール" />
            <ScheduleTable schedule={result.b.schedule} label="ローンB・返済スケジュール" />
          </div>
        </div>
      )}
    </>
  )
}
