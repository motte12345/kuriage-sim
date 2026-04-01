import { useState } from 'react'
import { Seo } from '../components/Seo'
import type { RepaymentMethod, Prepayment, PrepaymentType } from '../types/loan'
import { simulateMultiplePrepayments, simulateLoan } from '../calc/loan'
import { formatYen, formatMan, formatMonths } from '../calc/format'
import { ResultHighlight } from '../components/ResultHighlight'
import { ScheduleTable } from '../components/ScheduleTable'
import { BalanceChart, PaymentBreakdownChart } from '../components/LoanChart'

interface PrepaymentInput {
  readonly id: number
  readonly year: string
  readonly amount: string
  readonly type: PrepaymentType
}

let nextId = 1

export function KuriageMultiPage() {
  const [principal, setPrincipal] = useState('3000')
  const [rate, setRate] = useState('1.5')
  const [years, setYears] = useState('35')
  const [method, setMethod] = useState<RepaymentMethod>('equal_payment')
  const [prepayments, setPrepayments] = useState<readonly PrepaymentInput[]>([
    { id: nextId++, year: '3', amount: '100', type: 'shorten_period' },
    { id: nextId++, year: '7', amount: '200', type: 'shorten_period' },
  ])
  const [result, setResult] = useState<{
    readonly result: ReturnType<typeof simulateLoan>
    readonly withoutPrepayment: ReturnType<typeof simulateLoan>
    readonly savedInterest: number
  } | null>(null)

  const addPrepayment = () =>
    setPrepayments([
      ...prepayments,
      { id: nextId++, year: '', amount: '', type: 'shorten_period' },
    ])

  const removePrepayment = (id: number) =>
    setPrepayments(prepayments.filter((p) => p.id !== id))

  const updatePrepayment = (
    id: number,
    field: keyof Omit<PrepaymentInput, 'id'>,
    value: string,
  ) =>
    setPrepayments(
      prepayments.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseFloat(principal) * 10_000
    const r = parseFloat(rate) / 100
    const m = parseInt(years) * 12

    if (isNaN(p) || isNaN(r) || isNaN(m) || p <= 0 || r < 0 || m <= 0) return

    const pps: Prepayment[] = prepayments
      .filter((pp) => pp.year && pp.amount)
      .map((pp) => ({
        monthOffset: parseInt(pp.year) * 12,
        amount: parseFloat(pp.amount) * 10_000,
        type: pp.type,
      }))
      .filter(
        (pp) =>
          !isNaN(pp.monthOffset) &&
          !isNaN(pp.amount) &&
          pp.monthOffset > 0 &&
          pp.amount > 0,
      )

    if (pps.length === 0) return

    const res = simulateMultiplePrepayments(
      { principal: p, annualRate: r, totalMonths: m, method },
      pps,
    )
    setResult(res)
  }

  return (
    <>
      <Seo
        title="複数回繰上返済シミュレーション"
        description="複数回の繰上返済をまとめてシミュレーション。3年後に100万、7年後に200万など、計画的な繰上返済の効果を確認できます。"
        path="/kuriage-multi"
      />
      <h1 className="section-title">複数回繰上返済シミュレーション</h1>
      <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
        「3年後に100万、7年後に200万」のように複数回の繰上返済をまとめてシミュレーションできます。
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">借入額 <span className="form-hint">（万円）</span></label>
            <input type="number" className="form-input" value={principal} onChange={(e) => setPrincipal(e.target.value)} min="1" />
          </div>
          <div className="form-group">
            <label className="form-label">年利 <span className="form-hint">（%）</span></label>
            <input type="number" className="form-input" value={rate} onChange={(e) => setRate(e.target.value)} min="0" step="0.01" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">返済期間 <span className="form-hint">（年）</span></label>
            <input type="number" className="form-input" value={years} onChange={(e) => setYears(e.target.value)} min="1" max="50" />
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

        <div style={{ marginBottom: '1rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>繰上返済の設定</label>
          {prepayments.map((pp, i) => (
            <div key={pp.id} className="form-row" style={{ marginBottom: '0.5rem', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                {i === 0 && <label className="form-label form-hint">何年後</label>}
                <input type="number" className="form-input" value={pp.year} onChange={(e) => updatePrepayment(pp.id, 'year', e.target.value)} min="1" placeholder="年" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                {i === 0 && <label className="form-label form-hint">金額（万円）</label>}
                <input type="number" className="form-input" value={pp.amount} onChange={(e) => updatePrepayment(pp.id, 'amount', e.target.value)} min="1" placeholder="万円" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                {i === 0 && <label className="form-label form-hint">種類</label>}
                <select className="form-input" value={pp.type} onChange={(e) => updatePrepayment(pp.id, 'type', e.target.value as PrepaymentType)}>
                  <option value="shorten_period">期間短縮型</option>
                  <option value="reduce_payment">返済額軽減型</option>
                </select>
              </div>
              <div style={{ marginBottom: 0 }}>
                <button type="button" className="btn" style={{ padding: '0.5rem', background: 'var(--color-danger-light)', color: 'var(--color-danger)' }} onClick={() => removePrepayment(pp.id)}>
                  削除
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn" style={{ marginTop: '0.5rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }} onClick={addPrepayment}>
            + 繰上返済を追加
          </button>
        </div>

        <button type="submit" className="btn btn-primary btn-block">計算する</button>
      </form>

      {result && (
        <div>
          <div className="result-grid">
            <ResultHighlight
              label="削減できる利息"
              value={formatMan(result.savedInterest)}
              unit="万円"
              variant="accent"
            />
            <ResultHighlight
              label="短縮される期間"
              value={formatMonths(result.withoutPrepayment.actualMonths - result.result.actualMonths)}
            />
          </div>

          <div className="result-grid">
            <ResultHighlight
              label="繰上返済なしの利息総額"
              value={formatYen(result.withoutPrepayment.totalInterest)}
              unit="円"
            />
            <ResultHighlight
              label="繰上返済ありの利息総額"
              value={formatYen(result.result.totalInterest)}
              unit="円"
              variant="accent"
            />
          </div>

          <div className="card section-gap">
            <h2 className="section-title">残高推移</h2>
            <BalanceChart
              schedule={result.withoutPrepayment.schedule}
              scheduleLabel="繰上返済なし"
              compareSchedule={result.result.schedule}
              compareLabel="繰上返済あり"
            />
          </div>

          <div className="card section-gap">
            <h2 className="section-title">年間の元金・利息内訳</h2>
            <PaymentBreakdownChart schedule={result.result.schedule} />
          </div>

          <div className="card section-gap">
            <ScheduleTable schedule={result.withoutPrepayment.schedule} label="繰上返済なし・返済スケジュール" />
            <ScheduleTable schedule={result.result.schedule} label="繰上返済あり・返済スケジュール" />
          </div>
        </div>
      )}
    </>
  )
}
