import { useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { Seo } from '../components/Seo'
import { FormError } from '../components/FormError'
import { RelatedTools } from '../components/RelatedTools'
import { KuriageSeoContent } from '../components/SeoContent'
import { KuriageAffiliate } from '../components/AffiliateSection'
import type { RepaymentMethod } from '../types/loan'
import { comparePrepayment } from '../calc/loan'
import { formatYen, formatMan, formatMonths } from '../calc/format'
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
  const [form, setForm] = usePersistedState('kuriage-form', defaultForm)
  const [result, setResult] = useState<ReturnType<
    typeof comparePrepayment
  > | null>(null)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof FormState, value: string) =>
    setForm({ ...form, [field]: value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const principal = parseFloat(form.principal) * 10_000
    const annualRate = parseFloat(form.rate) / 100
    const totalMonths = parseInt(form.years) * 12
    const prepaymentAmount = parseFloat(form.prepaymentAmount) * 10_000
    const monthOffset = parseInt(form.prepaymentYear) * 12

    if (isNaN(principal) || principal <= 0) {
      setError('借入額を1万円以上で入力してください。')
      return
    }
    if (isNaN(annualRate) || annualRate < 0) {
      setError('年利を0%以上で入力してください。')
      return
    }
    if (isNaN(totalMonths) || totalMonths <= 0) {
      setError('返済期間を1年以上で入力してください。')
      return
    }
    if (isNaN(prepaymentAmount) || prepaymentAmount <= 0) {
      setError('繰上返済額を1万円以上で入力してください。')
      return
    }
    if (isNaN(monthOffset) || monthOffset <= 0) {
      setError('繰上返済のタイミングを1年後以降で入力してください。')
      return
    }
    if (monthOffset >= totalMonths) {
      setError(`繰上返済のタイミングは返済期間（${form.years}年）より短い年数を入力してください。`)
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
        title="繰上返済の利息削減シミュレーション"
        description="住宅ローンの繰上返済で利息をいくら減らせるか計算。期間短縮型と返済額軽減型を並べて比較し、返済スケジュールとグラフで確認できます。"
        path="/kuriage"
      />

      <h1 className="page-title">繰上返済シミュレーター</h1>
      <p className="page-description">
        住宅ローンの繰上返済による利息削減額・期間短縮を計算します。
        期間短縮型と返済額軽減型を並べて比較できます。
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
                value={form.principal}
                onChange={(e) => update('principal', e.target.value)}
                min="1"
                step="1"
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
                value={form.rate}
                onChange={(e) => update('rate', e.target.value)}
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
                value={form.years}
                onChange={(e) => update('years', e.target.value)}
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

        <p className="form-section-label" style={{ marginTop: '0.5rem' }}>繰上返済の設定</p>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">繰上返済額</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={form.prepaymentAmount}
                onChange={(e) => update('prepaymentAmount', e.target.value)}
                min="1"
                step="1"
              />
              <span className="input-suffix">万円</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">繰上返済のタイミング <span className="form-hint">（借入から）</span></label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={form.prepaymentYear}
                onChange={(e) => update('prepaymentYear', e.target.value)}
                min="1"
                step="1"
              />
              <span className="input-suffix">年後</span>
            </div>
          </div>
        </div>

        <FormError message={error} />

        <div className="form-submit-area">
          <button type="submit" className="btn btn-primary btn-block">
            計算する
          </button>
        </div>
      </form>

      {result && (
        <div>
          {/* Top banner - most impactful numbers */}
          <div className="result-banner">
            <div className="result-banner-item">
              <div className="banner-label">期間短縮型の削減利息</div>
              <div className="banner-value">
                {formatMan(result.shortenSavedInterest)}
                <span className="banner-unit">万円</span>
              </div>
            </div>
            <div className="result-banner-divider" />
            <div className="result-banner-item">
              <div className="banner-label">短縮される期間</div>
              <div className="banner-value">
                {formatMonths(result.shortenedMonths)}
              </div>
            </div>
            <div className="result-banner-divider" />
            <div className="result-banner-item">
              <div className="banner-label">返済額軽減型の削減利息</div>
              <div className="banner-value">
                {formatMan(result.reduceSavedInterest)}
                <span className="banner-unit">万円</span>
              </div>
            </div>
            <div className="result-banner-divider" />
            <div className="result-banner-item">
              <div className="banner-label">軽減後の月額返済</div>
              <div className="banner-value">
                {formatYen(result.reducedMonthlyPayment)}
                <span className="banner-unit">円</span>
              </div>
            </div>
          </div>

          {/* 比較表 */}
          <div className="card section-gap">
            <h2 className="section-title">3パターン比較</h2>
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
          <RelatedTools
            tools={[
              {
                to: '/kuriage-multi',
                label: '複数回繰上返済シミュレーション',
                description: '複数回の繰上返済を計画している方はこちら',
              },
              {
                to: '/karikae',
                label: '借り換えシミュレーター',
                description: '借り換えと繰上返済、どちらが得か比較したい方に',
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
