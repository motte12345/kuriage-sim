import type {
  LoanCondition,
  LoanSimulationResult,
  MonthlyPayment,
  Prepayment,
  PrepaymentComparisonResult,
  RefinanceCondition,
  RefinanceResult,
} from '../types/loan'

/**
 * 元利均等返済の月額を計算
 */
export function calcEqualPaymentMonthly(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (monthlyRate === 0) return principal / months
  const r = monthlyRate
  const n = months
  return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
}

/**
 * ローンの返済スケジュールを生成（繰上返済なし）
 */
export function simulateLoan(condition: LoanCondition): LoanSimulationResult {
  return simulateLoanWithPrepayments(condition, [])
}

/**
 * 繰上返済付きの返済スケジュールを生成
 */
export function simulateLoanWithPrepayments(
  condition: LoanCondition,
  prepayments: readonly Prepayment[],
): LoanSimulationResult {
  const { principal, annualRate, totalMonths, method } = condition
  const monthlyRate = annualRate / 12

  // 繰上返済をmonthOffsetでソート（immutable）
  const sortedPrepayments = [...prepayments].sort(
    (a, b) => a.monthOffset - b.monthOffset,
  )

  const schedule: MonthlyPayment[] = []
  let balance = principal
  let currentMonthlyPayment =
    method === 'equal_payment'
      ? calcEqualPaymentMonthly(principal, monthlyRate, totalMonths)
      : 0 // 元金均等は毎月計算
  let equalPrincipalPart =
    method === 'equal_principal' ? principal / totalMonths : 0

  for (let month = 1; month <= totalMonths && balance > 0.5; month++) {
    // 利息計算
    const interestPart = balance * monthlyRate

    // 元金部分の計算
    let principalPart: number
    let payment: number

    if (method === 'equal_payment') {
      // 最終月は残高+利息で精算
      if (currentMonthlyPayment > balance + interestPart) {
        principalPart = balance
        payment = balance + interestPart
      } else {
        payment = currentMonthlyPayment
        principalPart = payment - interestPart
      }
    } else {
      // 元金均等
      principalPart = Math.min(equalPrincipalPart, balance)
      payment = principalPart + interestPart
    }

    balance = balance - principalPart

    // 繰上返済チェック
    let prepaymentAmount = 0
    for (const pp of sortedPrepayments) {
      if (pp.monthOffset === month && balance > 0.5) {
        const actualPrepayment = Math.min(pp.amount, balance)
        balance = balance - actualPrepayment
        prepaymentAmount += actualPrepayment

        // 繰上返済後のスケジュール再計算
        if (balance > 0.5) {
          if (pp.type === 'shorten_period') {
            // 期間短縮型: 月額据え置き、期間が自然に縮む（残高が0になった時点でループ終了）
            // 元金均等も同様: 元金部分据え置きで残高が早く0になる
          } else {
            // 返済額軽減型: 残期間据え置き、月額を再計算
            const monthsLeft = totalMonths - month
            if (method === 'equal_payment') {
              currentMonthlyPayment = calcEqualPaymentMonthly(
                balance,
                monthlyRate,
                monthsLeft,
              )
            } else {
              equalPrincipalPart = balance / monthsLeft
            }
          }
        }
      }
    }

    // 残高が微小になったら0に
    if (balance < 0.5) balance = 0

    schedule.push({
      month,
      payment,
      principalPart,
      interestPart,
      remainingBalance: Math.round(balance),
      prepaymentAmount,
    })

    if (balance === 0) break
  }

  const totalPayment =
    schedule.reduce((sum, m) => sum + m.payment + m.prepaymentAmount, 0)
  const totalInterest = schedule.reduce((sum, m) => sum + m.interestPart, 0)

  return {
    schedule,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    actualMonths: schedule.length,
    monthlyPayment: Math.round(
      method === 'equal_payment'
        ? currentMonthlyPayment
        : schedule[0]?.payment ?? 0,
    ),
  }
}

/**
 * 繰上返済の期間短縮型 vs 返済額軽減型を比較
 */
export function comparePrepayment(
  condition: LoanCondition,
  prepaymentAmount: number,
  monthOffset: number,
): PrepaymentComparisonResult {
  const withoutPrepayment = simulateLoan(condition)

  const shortenPrepayment: Prepayment = {
    monthOffset,
    amount: prepaymentAmount,
    type: 'shorten_period',
  }
  const reducePrepayment: Prepayment = {
    monthOffset,
    amount: prepaymentAmount,
    type: 'reduce_payment',
  }

  const shortenPeriod = simulateLoanWithPrepayments(condition, [
    shortenPrepayment,
  ])
  const reducePayment = simulateLoanWithPrepayments(condition, [
    reducePrepayment,
  ])

  return {
    withoutPrepayment,
    shortenPeriod,
    reducePayment,
    shortenSavedInterest:
      withoutPrepayment.totalInterest - shortenPeriod.totalInterest,
    reduceSavedInterest:
      withoutPrepayment.totalInterest - reducePayment.totalInterest,
    shortenedMonths:
      withoutPrepayment.actualMonths - shortenPeriod.actualMonths,
    reducedMonthlyPayment: reducePayment.monthlyPayment,
  }
}

/**
 * 複数回繰上返済シミュレーション
 */
export function simulateMultiplePrepayments(
  condition: LoanCondition,
  prepayments: readonly Prepayment[],
): {
  readonly result: LoanSimulationResult
  readonly withoutPrepayment: LoanSimulationResult
  readonly savedInterest: number
} {
  const withoutPrepayment = simulateLoan(condition)
  const result = simulateLoanWithPrepayments(condition, prepayments)
  return {
    result,
    withoutPrepayment,
    savedInterest: withoutPrepayment.totalInterest - result.totalInterest,
  }
}

/**
 * 借り換えシミュレーション
 */
export function simulateRefinance(
  condition: RefinanceCondition,
): RefinanceResult {
  const {
    currentBalance,
    remainingMonths,
    currentRate,
    newRate,
    refinanceCost,
    method,
  } = condition

  const before = simulateLoan({
    principal: currentBalance,
    annualRate: currentRate,
    totalMonths: remainingMonths,
    method,
  })

  const after = simulateLoan({
    principal: currentBalance,
    annualRate: newRate,
    totalMonths: remainingMonths,
    method,
  })

  const netSaving = before.totalPayment - after.totalPayment - refinanceCost

  // 損益分岐月数: 毎月の差額で諸費用を回収するのに何ヶ月かかるか
  let breakEvenMonth: number | null = null
  let cumulativeSaving = -refinanceCost
  for (let i = 0; i < before.schedule.length && i < after.schedule.length; i++) {
    const monthlySaving =
      before.schedule[i].payment - after.schedule[i].payment
    cumulativeSaving += monthlySaving
    if (cumulativeSaving > 0 && breakEvenMonth === null) {
      breakEvenMonth = i + 1
    }
  }

  return {
    before,
    after,
    netSaving: Math.round(netSaving),
    breakEvenMonth,
    isWorthIt: netSaving > 0,
  }
}
