import { describe, it, expect } from 'vitest'
import {
  calcEqualPaymentMonthly,
  simulateLoan,
  simulateLoanWithPrepayments,
  comparePrepayment,
  simulateMultiplePrepayments,
  simulateRefinance,
} from './loan'
import type { LoanCondition, Prepayment } from '../types/loan'

describe('calcEqualPaymentMonthly', () => {
  it('3000万円 年利1.5% 35年で月額91,855円付近になる', () => {
    const monthly = calcEqualPaymentMonthly(30_000_000, 0.015 / 12, 35 * 12)
    // 一般的な住宅ローン計算機の結果と照合
    expect(monthly).toBeCloseTo(91_855, -1) // 10円単位で一致
  })

  it('金利0%の場合は単純な割り算', () => {
    const monthly = calcEqualPaymentMonthly(12_000_000, 0, 120)
    expect(monthly).toBe(100_000)
  })

  it('1000万円 年利2% 10年', () => {
    const monthly = calcEqualPaymentMonthly(10_000_000, 0.02 / 12, 120)
    expect(monthly).toBeCloseTo(92_013, -1)
  })
})

describe('simulateLoan - 元利均等', () => {
  const condition: LoanCondition = {
    principal: 30_000_000,
    annualRate: 0.015,
    totalMonths: 420, // 35年
    method: 'equal_payment',
  }

  it('総支払額 > 借入額（利息が発生する）', () => {
    const result = simulateLoan(condition)
    expect(result.totalPayment).toBeGreaterThan(30_000_000)
  })

  it('利息総額が妥当な範囲（8,579,007円付近）', () => {
    const result = simulateLoan(condition)
    // 3000万 1.5% 35年の利息総額は約858万円
    expect(result.totalInterest).toBeGreaterThan(8_000_000)
    expect(result.totalInterest).toBeLessThan(9_000_000)
  })

  it('スケジュールの最終月の残高が0', () => {
    const result = simulateLoan(condition)
    const lastMonth = result.schedule[result.schedule.length - 1]
    expect(lastMonth.remainingBalance).toBe(0)
  })

  it('返済月数が420ヶ月', () => {
    const result = simulateLoan(condition)
    expect(result.actualMonths).toBe(420)
  })

  it('毎月の返済額がほぼ一定（元利均等）', () => {
    const result = simulateLoan(condition)
    const firstPayment = result.schedule[0].payment
    // 最終月以外はほぼ同額
    for (let i = 0; i < result.schedule.length - 1; i++) {
      expect(result.schedule[i].payment).toBeCloseTo(firstPayment, 0)
    }
  })

  it('利息は減少し元金は増加する（元利均等の特性）', () => {
    const result = simulateLoan(condition)
    const first = result.schedule[0]
    const mid = result.schedule[Math.floor(result.schedule.length / 2)]
    expect(first.interestPart).toBeGreaterThan(mid.interestPart)
    expect(first.principalPart).toBeLessThan(mid.principalPart)
  })
})

describe('simulateLoan - 元金均等', () => {
  const condition: LoanCondition = {
    principal: 30_000_000,
    annualRate: 0.015,
    totalMonths: 420,
    method: 'equal_principal',
  }

  it('元金部分が毎月一定', () => {
    const result = simulateLoan(condition)
    const expectedPrincipal = 30_000_000 / 420
    for (const m of result.schedule) {
      expect(m.principalPart).toBeCloseTo(expectedPrincipal, 0)
    }
  })

  it('月額が毎月減少する', () => {
    const result = simulateLoan(condition)
    for (let i = 1; i < result.schedule.length; i++) {
      expect(result.schedule[i].payment).toBeLessThanOrEqual(
        result.schedule[i - 1].payment + 1, // 丸め誤差許容
      )
    }
  })

  it('元金均等の方が元利均等より利息総額が少ない', () => {
    const equalPayment = simulateLoan({
      ...condition,
      method: 'equal_payment',
    })
    const equalPrincipal = simulateLoan(condition)
    expect(equalPrincipal.totalInterest).toBeLessThan(
      equalPayment.totalInterest,
    )
  })

  it('最終月の残高が0', () => {
    const result = simulateLoan(condition)
    const lastMonth = result.schedule[result.schedule.length - 1]
    expect(lastMonth.remainingBalance).toBe(0)
  })
})

describe('繰上返済 - 期間短縮型', () => {
  const condition: LoanCondition = {
    principal: 30_000_000,
    annualRate: 0.015,
    totalMonths: 420,
    method: 'equal_payment',
  }

  it('100万円繰上返済で期間が短縮される', () => {
    const prepayment: Prepayment = {
      monthOffset: 36, // 3年後
      amount: 1_000_000,
      type: 'shorten_period',
    }
    const result = simulateLoanWithPrepayments(condition, [prepayment])
    const baseline = simulateLoan(condition)
    expect(result.actualMonths).toBeLessThan(baseline.actualMonths)
  })

  it('利息が削減される', () => {
    const prepayment: Prepayment = {
      monthOffset: 36,
      amount: 1_000_000,
      type: 'shorten_period',
    }
    const result = simulateLoanWithPrepayments(condition, [prepayment])
    const baseline = simulateLoan(condition)
    expect(result.totalInterest).toBeLessThan(baseline.totalInterest)
  })

  it('繰上返済が大きいほど効果が大きい', () => {
    const small = simulateLoanWithPrepayments(condition, [
      { monthOffset: 36, amount: 500_000, type: 'shorten_period' },
    ])
    const large = simulateLoanWithPrepayments(condition, [
      { monthOffset: 36, amount: 2_000_000, type: 'shorten_period' },
    ])
    expect(large.totalInterest).toBeLessThan(small.totalInterest)
    expect(large.actualMonths).toBeLessThan(small.actualMonths)
  })

  it('早い時期の繰上返済の方が利息削減効果が大きい', () => {
    const early = simulateLoanWithPrepayments(condition, [
      { monthOffset: 12, amount: 1_000_000, type: 'shorten_period' },
    ])
    const late = simulateLoanWithPrepayments(condition, [
      { monthOffset: 240, amount: 1_000_000, type: 'shorten_period' },
    ])
    expect(early.totalInterest).toBeLessThan(late.totalInterest)
  })
})

describe('繰上返済 - 返済額軽減型', () => {
  const condition: LoanCondition = {
    principal: 30_000_000,
    annualRate: 0.015,
    totalMonths: 420,
    method: 'equal_payment',
  }

  it('期間は変わらず月額が下がる', () => {
    const prepayment: Prepayment = {
      monthOffset: 36,
      amount: 1_000_000,
      type: 'reduce_payment',
    }
    const result = simulateLoanWithPrepayments(condition, [prepayment])
    const baseline = simulateLoan(condition)

    // 期間はほぼ同じ（±1月の丸め誤差）
    expect(Math.abs(result.actualMonths - baseline.actualMonths)).toBeLessThanOrEqual(1)
    // 月額が下がる
    expect(result.monthlyPayment).toBeLessThan(baseline.monthlyPayment)
  })
})

describe('comparePrepayment', () => {
  const condition: LoanCondition = {
    principal: 30_000_000,
    annualRate: 0.015,
    totalMonths: 420,
    method: 'equal_payment',
  }

  it('期間短縮型の方が利息削減効果が大きい', () => {
    const result = comparePrepayment(condition, 1_000_000, 36)
    expect(result.shortenSavedInterest).toBeGreaterThan(
      result.reduceSavedInterest,
    )
  })

  it('短縮月数と軽減後月額が正の値', () => {
    const result = comparePrepayment(condition, 1_000_000, 36)
    expect(result.shortenedMonths).toBeGreaterThan(0)
    expect(result.reducedMonthlyPayment).toBeGreaterThan(0)
    expect(result.reducedMonthlyPayment).toBeLessThan(
      result.withoutPrepayment.monthlyPayment,
    )
  })
})

describe('simulateMultiplePrepayments', () => {
  const condition: LoanCondition = {
    principal: 30_000_000,
    annualRate: 0.015,
    totalMonths: 420,
    method: 'equal_payment',
  }

  it('複数回の繰上返済で利息がさらに削減される', () => {
    const single = simulateLoanWithPrepayments(condition, [
      { monthOffset: 36, amount: 1_000_000, type: 'shorten_period' },
    ])
    const multiple = simulateMultiplePrepayments(condition, [
      { monthOffset: 36, amount: 1_000_000, type: 'shorten_period' },
      { monthOffset: 84, amount: 2_000_000, type: 'shorten_period' },
    ])
    expect(multiple.result.totalInterest).toBeLessThan(single.totalInterest)
    expect(multiple.savedInterest).toBeGreaterThan(0)
  })
})

describe('simulateRefinance', () => {
  it('金利が下がれば借り換えが得', () => {
    const result = simulateRefinance({
      currentBalance: 25_000_000,
      remainingMonths: 300,
      currentRate: 0.02,
      newRate: 0.01,
      refinanceCost: 500_000,
      method: 'equal_payment',
    })
    expect(result.isWorthIt).toBe(true)
    expect(result.netSaving).toBeGreaterThan(0)
    expect(result.breakEvenMonth).not.toBeNull()
    expect(result.breakEvenMonth!).toBeGreaterThan(0)
  })

  it('金利差が小さく諸費用が高いと損', () => {
    const result = simulateRefinance({
      currentBalance: 10_000_000,
      remainingMonths: 60, // 残り5年
      currentRate: 0.015,
      newRate: 0.014,
      refinanceCost: 500_000,
      method: 'equal_payment',
    })
    expect(result.isWorthIt).toBe(false)
    expect(result.netSaving).toBeLessThan(0)
  })

  it('借り換え後の月額が下がる', () => {
    const result = simulateRefinance({
      currentBalance: 25_000_000,
      remainingMonths: 300,
      currentRate: 0.02,
      newRate: 0.01,
      refinanceCost: 500_000,
      method: 'equal_payment',
    })
    expect(result.after.monthlyPayment).toBeLessThan(
      result.before.monthlyPayment,
    )
  })
})

describe('エッジケース', () => {
  it('繰上返済額がローン残高を超える場合、残高までで打ち切り', () => {
    const condition: LoanCondition = {
      principal: 1_000_000,
      annualRate: 0.02,
      totalMonths: 12,
      method: 'equal_payment',
    }
    const result = simulateLoanWithPrepayments(condition, [
      { monthOffset: 6, amount: 10_000_000, type: 'shorten_period' },
    ])
    expect(result.totalPayment).toBeGreaterThan(0)
    expect(
      result.schedule[result.schedule.length - 1].remainingBalance,
    ).toBe(0)
  })

  it('金利0%でも正しく計算できる', () => {
    const condition: LoanCondition = {
      principal: 12_000_000,
      annualRate: 0,
      totalMonths: 120,
      method: 'equal_payment',
    }
    const result = simulateLoan(condition)
    expect(result.totalInterest).toBe(0)
    expect(result.totalPayment).toBe(12_000_000)
    expect(result.monthlyPayment).toBe(100_000)
  })

  it('元金均等でも繰上返済（期間短縮型）が正しく動く', () => {
    const condition: LoanCondition = {
      principal: 30_000_000,
      annualRate: 0.015,
      totalMonths: 420,
      method: 'equal_principal',
    }
    const baseline = simulateLoan(condition)
    const result = simulateLoanWithPrepayments(condition, [
      { monthOffset: 36, amount: 1_000_000, type: 'shorten_period' },
    ])
    expect(result.actualMonths).toBeLessThan(baseline.actualMonths)
    expect(result.totalInterest).toBeLessThan(baseline.totalInterest)
  })

  it('元金均等でも繰上返済（返済額軽減型）が正しく動く', () => {
    const condition: LoanCondition = {
      principal: 30_000_000,
      annualRate: 0.015,
      totalMonths: 420,
      method: 'equal_principal',
    }
    const baseline = simulateLoan(condition)
    const result = simulateLoanWithPrepayments(condition, [
      { monthOffset: 36, amount: 1_000_000, type: 'reduce_payment' },
    ])
    expect(result.totalInterest).toBeLessThan(baseline.totalInterest)
  })
})
