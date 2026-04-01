import { useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { Seo } from '../components/Seo'
import { FormError } from '../components/FormError'
import { RelatedTools } from '../components/RelatedTools'
import { KuriageSeoContent } from '../components/SeoContent'
import { KuriageAffiliate } from '../components/AffiliateSection'
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
  const [principal, setPrincipal] = usePersistedState('multi-principal', '3000')
  const [rate, setRate] = usePersistedState('multi-rate', '1.5')
  const [years, setYears] = usePersistedState('multi-years', '35')
  const [method, setMethod] = usePersistedState<RepaymentMethod>('multi-method', 'equal_payment')
  const [prepayments, setPrepayments] = usePersistedState<readonly PrepaymentInput[]>('multi-prepayments', [
    { id: nextId++, year: '3', amount: '100', type: 'shorten_period' },
    { id: nextId++, year: '7', amount: '200', type: 'shorten_period' },
  ])
  const [result, setResult] = useState<{
    readonly result: ReturnType<typeof simulateLoan>
    readonly withoutPrepayment: ReturnType<typeof simulateLoan>
    readonly savedInterest: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)
    const p = parseFloat(principal) * 10_000
    const r = parseFloat(rate) / 100
    const m = parseInt(years) * 12

    if (isNaN(p) || p <= 0) { setError('借入額を1万円以上で入力してください。'); return }
    if (isNaN(r) || r < 0) { setError('年利を0%以上で入力してください。'); return }
    if (isNaN(m) || m <= 0) { setError('返済期間を1年以上で入力してください。'); return }

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

    if (pps.length === 0) { setError('繰上返済を1件以上設定してください。'); return }

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

      <h1 className="page-title">複数回繰上返済シミュレーション</h1>
      <p className="page-description">
        「3年後に100万、7年後に200万」のように複数回の繰上返済をまとめてシミュレーションできます。
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="form-section-label">ローン情報</p>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">借入額</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                min="1"
              />
              <span className="input-suffix">万円</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">年利</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">返済期間</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                min="1"
                max="50"
              />
              <span className="input-suffix">年</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">返済方式</label>
            <div className="form-radio-group">
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="method"
                  checked={method === 'equal_payment'}
                  onChange={() => setMethod('equal_payment')}
                />
                元利均等
              </label>
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="method"
                  checked={method === 'equal_principal'}
                  onChange={() => setMethod('equal_principal')}
                />
                元金均等
              </label>
            </div>
          </div>
        </div>

        <p className="form-section-label" style={{ marginTop: '0.5rem' }}>繰上返済の設定</p>

        {prepayments.map((pp, i) => (
          <div key={pp.id} className="prepayment-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              {i === 0 && <label className="form-label">何年後</label>}
              <div className="input-wrapper">
                <input
                  type="number"
                  className="form-input"
                  value={pp.year}
                  onChange={(e) => updatePrepayment(pp.id, 'year', e.target.value)}
                  min="1"
                  placeholder="例：3"
                />
                <span className="input-suffix">年後</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              {i === 0 && <label className="form-label">金額</label>}
              <div className="input-wrapper">
                <input
                  type="number"
                  className="form-input"
                  value={pp.amount}
                  onChange={(e) => updatePrepayment(pp.id, 'amount', e.target.value)}
                  min="1"
                  placeholder="例：100"
                />
                <span className="input-suffix">万円</span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              {i === 0 && <label className="form-label">種類</label>}
              <select
                className="form-input"
                value={pp.type}
                onChange={(e) =>
                  updatePrepayment(pp.id, 'type', e.target.value as PrepaymentType)
                }
              >
                <option value="shorten_period">期間短縮型</option>
                <option value="reduce_payment">返済額軽減型</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: i === 0 ? '0' : '0' }}>
              {i === 0 && <div className="form-label" style={{ visibility: 'hidden' }}>削除</div>}
              <button
                type="button"
                className="btn btn-danger-soft"
                onClick={() => removePrepayment(pp.id)}
              >
                削除
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-soft"
          style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}
          onClick={addPrepayment}
        >
          + 繰上返済を追加
        </button>

        <FormError message={error} />

        <div className="form-submit-area">
          <button type="submit" className="btn btn-primary btn-block">
            計算する
          </button>
        </div>
      </form>

      {result && (
        <div>
          <div className="result-banner">
            <div className="result-banner-item">
              <div className="banner-label">削減できる利息</div>
              <div className="banner-value">
                {formatMan(result.savedInterest)}
                <span className="banner-unit">万円</span>
              </div>
            </div>
            <div className="result-banner-divider" />
            <div className="result-banner-item">
              <div className="banner-label">短縮される期間</div>
              <div className="banner-value">
                {formatMonths(result.withoutPrepayment.actualMonths - result.result.actualMonths)}
              </div>
            </div>
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
            <ScheduleTable
              schedule={result.withoutPrepayment.schedule}
              label="繰上返済なし・返済スケジュール"
            />
            <ScheduleTable
              schedule={result.result.schedule}
              label="繰上返済あり・返済スケジュール"
            />
          </div>

          <RelatedTools
            tools={[
              {
                to: '/kuriage',
                label: '繰上返済シミュレーター',
                description: 'まずは1回の繰上返済で効果を確認したい方に',
              },
              {
                to: '/karikae',
                label: '借り換えシミュレーター',
                description: '借り換えとの比較も検討してみませんか？',
              },
            ]}
          />
        </div>
      )}

      {result && <KuriageAffiliate />}

      <KuriageSeoContent />
    </>
  )
}
