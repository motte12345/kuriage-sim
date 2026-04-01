import { useState } from 'react'
import { usePersistedState } from '../hooks/usePersistedState'
import { Seo } from '../components/Seo'
import { FormError } from '../components/FormError'
import { RelatedTools } from '../components/RelatedTools'
import { KarikaeSeoContent } from '../components/SeoContent'
import { KarikaeAffiliate } from '../components/AffiliateSection'
import type { RepaymentMethod } from '../types/loan'
import { simulateRefinance } from '../calc/loan'
import { formatYen, formatMan, formatMonths } from '../calc/format'
import { ResultHighlight } from '../components/ResultHighlight'
import { BalanceChart } from '../components/LoanChart'
import { ScheduleTable } from '../components/ScheduleTable'

export function KarikaePage() {
  const [balance, setBalance] = usePersistedState('karikae-balance', '2500')
  const [remainingYears, setRemainingYears] = usePersistedState('karikae-years', '25')
  const [currentRate, setCurrentRate] = usePersistedState('karikae-current-rate', '2.0')
  const [newRate, setNewRate] = usePersistedState('karikae-new-rate', '1.0')
  const [cost, setCost] = usePersistedState('karikae-cost', '50')
  const [method, setMethod] = usePersistedState<RepaymentMethod>('karikae-method', 'equal_payment')
  const [result, setResult] = useState<ReturnType<typeof simulateRefinance> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const b = parseFloat(balance) * 10_000
    const rm = parseInt(remainingYears) * 12
    const cr = parseFloat(currentRate) / 100
    const nr = parseFloat(newRate) / 100
    const c = parseFloat(cost) * 10_000

    if (isNaN(b) || b <= 0) { setError('ローン残高を1万円以上で入力してください。'); return }
    if (isNaN(rm) || rm <= 0) { setError('残りの返済期間を1年以上で入力してください。'); return }
    if (isNaN(cr) || cr < 0) { setError('現在の年利を0%以上で入力してください。'); return }
    if (isNaN(nr) || nr < 0) { setError('借り換え先の年利を0%以上で入力してください。'); return }
    if (isNaN(c) || c < 0) { setError('借り換え諸費用を0万円以上で入力してください。'); return }

    setResult(
      simulateRefinance({
        currentBalance: b,
        remainingMonths: rm,
        currentRate: cr,
        newRate: nr,
        refinanceCost: c,
        method,
      }),
    )
  }

  return (
    <>
      <Seo
        title="借り換えシミュレーター"
        description="住宅ローンの借り換えが得か損かを判定。諸費用込みの損益分岐点を計算し、何年で元が取れるか確認できます。"
        path="/karikae"
      />

      <h1 className="page-title">借り換えシミュレーター</h1>
      <p className="page-description">
        借り換え先の金利と諸費用を入力し、借り換えが得かどうかを判定します。諸費用込みの損益分岐点も算出します。
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="form-section-label">現在のローン</p>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">現在のローン残高</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                min="1"
              />
              <span className="input-suffix">万円</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">残りの返済期間</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={remainingYears}
                onChange={(e) => setRemainingYears(e.target.value)}
                min="1"
                max="50"
              />
              <span className="input-suffix">年</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">現在の年利</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={currentRate}
                onChange={(e) => setCurrentRate(e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="input-suffix">%</span>
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

        <p className="form-section-label" style={{ marginTop: '0.5rem' }}>借り換え先</p>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">借り換え先の年利</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                min="0"
                step="0.01"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              借り換え諸費用 <span className="form-hint">（登記・事務手数料等）</span>
            </label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                min="0"
                step="1"
              />
              <span className="input-suffix">万円</span>
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
          <div className="result-banner"
            style={
              result.isWorthIt
                ? {}
                : { background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)' }
            }
          >
            <div className="result-banner-item">
              <div className="banner-label">
                {result.isWorthIt ? '借り換えで得する金額' : '借り換えで損する金額'}
              </div>
              <div className="banner-value">
                {formatMan(Math.abs(result.netSaving))}
                <span className="banner-unit">万円</span>
              </div>
            </div>
            <div className="result-banner-divider" />
            <div className="result-banner-item">
              <div className="banner-label">損益分岐点</div>
              <div className="banner-value">
                {result.breakEvenMonth !== null
                  ? formatMonths(result.breakEvenMonth)
                  : '回収不可'}
              </div>
            </div>
          </div>

          <div className="result-grid">
            <ResultHighlight
              label="月額削減額"
              value={formatYen(result.before.monthlyPayment - result.after.monthlyPayment)}
              unit="円"
              variant={result.after.monthlyPayment < result.before.monthlyPayment ? 'accent' : 'default'}
            />
            <ResultHighlight
              label="利息の差額（借り換え前後）"
              value={formatYen(Math.abs(result.before.totalInterest - result.after.totalInterest))}
              unit="円"
              variant="accent"
            />
          </div>

          <div className="card section-gap">
            <h2 className="section-title">借り換え前後の比較</h2>
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
                  <td className={result.after.monthlyPayment < result.before.monthlyPayment ? 'best' : ''}>
                    {formatYen(result.after.monthlyPayment)}円
                  </td>
                </tr>
                <tr>
                  <td>総支払額</td>
                  <td>{formatYen(result.before.totalPayment)}円</td>
                  <td>{formatYen(result.after.totalPayment)}円</td>
                </tr>
                <tr>
                  <td>利息総額</td>
                  <td>{formatYen(result.before.totalInterest)}円</td>
                  <td className={result.after.totalInterest < result.before.totalInterest ? 'best' : ''}>
                    {formatYen(result.after.totalInterest)}円
                  </td>
                </tr>
                <tr>
                  <td>借り換え諸費用</td>
                  <td>-</td>
                  <td>{formatYen(parseFloat(cost) * 10_000)}円</td>
                </tr>
                <tr>
                  <td>諸費用込み差額</td>
                  <td>-</td>
                  <td className={result.isWorthIt ? 'best' : ''}>
                    {result.isWorthIt ? '-' : '+'}
                    {formatYen(Math.abs(result.netSaving))}円
                  </td>
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

          <RelatedTools
            tools={[
              {
                to: '/kuriage',
                label: '繰上返済シミュレーター',
                description: '借り換えせずに繰上返済で利息を減らしたい方に',
              },
              {
                to: '/hikaku',
                label: 'ローン比較ツール',
                description: '2つのローン条件を横並びで比較したい方に',
              },
            ]}
          />
        </div>
      )}

      {result && <KarikaeAffiliate />}

      <KarikaeSeoContent />
    </>
  )
}
