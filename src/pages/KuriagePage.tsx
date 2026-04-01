import { useState } from 'react'
import { Seo } from '../components/Seo'
import type { RepaymentMethod } from '../types/loan'
import { comparePrepayment } from '../calc/loan'
import { formatYen, formatMan, formatMonths } from '../calc/format'
import { ResultHighlight } from '../components/ResultHighlight'
import { ComparisonTable } from '../components/ComparisonTable'
import { ScheduleTable } from '../components/ScheduleTable'
import { BalanceChart, PaymentBreakdownChart } from '../components/LoanChart'

interface FormState {
  readonly principal: string
  readonly rate: string
  readonly years: string
  readonly method: RepaymentMethod
  readonly prepaymentAmount: string
  readonly prepaymentYear: string
}

const defaultForm: FormState = {
  principal: '3000',
  rate: '1.5',
  years: '35',
  method: 'equal_payment',
  prepaymentAmount: '100',
  prepaymentYear: '3',
}

export function KuriagePage() {
  const [form, setForm] = useState(defaultForm)
  const [result, setResult] = useState<ReturnType<
    typeof comparePrepayment
  > | null>(null)

  const update = (field: keyof FormState, value: string) =>
    setForm({ ...form, [field]: value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const principal = parseFloat(form.principal) * 10_000
    const annualRate = parseFloat(form.rate) / 100
    const totalMonths = parseInt(form.years) * 12
    const prepaymentAmount = parseFloat(form.prepaymentAmount) * 10_000
    const monthOffset = parseInt(form.prepaymentYear) * 12

    if (
      isNaN(principal) ||
      isNaN(annualRate) ||
      isNaN(totalMonths) ||
      isNaN(prepaymentAmount) ||
      isNaN(monthOffset) ||
      principal <= 0 ||
      annualRate < 0 ||
      totalMonths <= 0 ||
      prepaymentAmount <= 0 ||
      monthOffset <= 0
    ) {
      return
    }

    const r = comparePrepayment(
      { principal, annualRate, totalMonths, method: form.method },
      prepaymentAmount,
      monthOffset,
    )
    setResult(r)
  }

  return (
    <>
      <Seo
        title="繰上返済シミュレーター"
        description="住宅ローンの繰上返済で利息をいくら減らせるか計算。期間短縮型と返済額軽減型を並べて比較し、返済スケジュールとグラフで確認できます。"
        path="/kuriage"
      />
      <h1 className="section-title">繰上返済シミュレーター</h1>
      <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
        住宅ローンや各種ローンの繰上返済による利息削減額・期間短縮を計算します。
        期間短縮型と返済額軽減型を並べて比較できます。
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              借入額 <span className="form-hint">（万円）</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={form.principal}
              onChange={(e) => update('principal', e.target.value)}
              min="1"
              step="1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              年利 <span className="form-hint">（%）</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={form.rate}
              onChange={(e) => update('rate', e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              返済期間 <span className="form-hint">（年）</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={form.years}
              onChange={(e) => update('years', e.target.value)}
              min="1"
              max="50"
            />
          </div>
          <div className="form-group">
            <label className="form-label">返済方式</label>
            <div className="form-radio-group">
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="method"
                  checked={form.method === 'equal_payment'}
                  onChange={() => update('method', 'equal_payment')}
                />
                元利均等
              </label>
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="method"
                  checked={form.method === 'equal_principal'}
                  onChange={() => update('method', 'equal_principal')}
                />
                元金均等
              </label>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              繰上返済額 <span className="form-hint">（万円）</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={form.prepaymentAmount}
              onChange={(e) => update('prepaymentAmount', e.target.value)}
              min="1"
              step="1"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              繰上返済のタイミング <span className="form-hint">（借入から何年後）</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={form.prepaymentYear}
              onChange={(e) => update('prepaymentYear', e.target.value)}
              min="1"
              step="1"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          計算する
        </button>
      </form>

      {result && (
        <div>
          {/* ハイライト: 削減利息額 */}
          <div className="result-grid">
            <ResultHighlight
              label="期間短縮型の削減利息"
              value={formatMan(result.shortenSavedInterest)}
              unit="万円"
              variant="accent"
            />
            <ResultHighlight
              label="返済額軽減型の削減利息"
              value={formatMan(result.reduceSavedInterest)}
              unit="万円"
              variant="accent"
            />
          </div>

          <div className="result-grid">
            <ResultHighlight
              label="短縮される期間"
              value={formatMonths(result.shortenedMonths)}
            />
            <ResultHighlight
              label="軽減後の月額"
              value={formatYen(result.reducedMonthlyPayment)}
              unit="円"
            />
          </div>

          {/* 比較表 */}
          <div className="card section-gap">
            <h2 className="section-title">比較表</h2>
            <ComparisonTable
              baseline={result.withoutPrepayment}
              shortenPeriod={result.shortenPeriod}
              reducePayment={result.reducePayment}
            />
          </div>

          {/* グラフ */}
          <div className="card section-gap">
            <h2 className="section-title">残高推移</h2>
            <BalanceChart
              schedule={result.withoutPrepayment.schedule}
              scheduleLabel="繰上返済なし"
              compareSchedule={result.shortenPeriod.schedule}
              compareLabel="期間短縮型"
            />
          </div>

          <div className="card section-gap">
            <h2 className="section-title">年間の元金・利息内訳</h2>
            <PaymentBreakdownChart
              schedule={result.withoutPrepayment.schedule}
            />
          </div>

          {/* 返済スケジュール */}
          <div className="card section-gap">
            <ScheduleTable
              schedule={result.withoutPrepayment.schedule}
              label="繰上返済なし・返済スケジュール"
            />
            <ScheduleTable
              schedule={result.shortenPeriod.schedule}
              label="期間短縮型・返済スケジュール"
            />
            <ScheduleTable
              schedule={result.reducePayment.schedule}
              label="返済額軽減型・返済スケジュール"
            />
          </div>
        </div>
      )}
    </>
  )
}
