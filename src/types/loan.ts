/** 返済方式 */
export type RepaymentMethod = 'equal_payment' | 'equal_principal'

/** 繰上返済の種類 */
export type PrepaymentType = 'shorten_period' | 'reduce_payment'

/** ローン基本条件 */
export interface LoanCondition {
  /** 借入額（円） */
  readonly principal: number
  /** 年利（小数。例: 0.015 = 1.5%） */
  readonly annualRate: number
  /** 返済期間（月数） */
  readonly totalMonths: number
  /** 返済方式 */
  readonly method: RepaymentMethod
}

/** 繰上返済1回分 */
export interface Prepayment {
  /** 借入開始からの経過月数 */
  readonly monthOffset: number
  /** 繰上返済額（円） */
  readonly amount: number
  /** 繰上返済の種類 */
  readonly type: PrepaymentType
}

/** 月別返済明細 */
export interface MonthlyPayment {
  /** 何ヶ月目（1始まり） */
  readonly month: number
  /** 月額返済額 */
  readonly payment: number
  /** うち元金 */
  readonly principalPart: number
  /** うち利息 */
  readonly interestPart: number
  /** 返済後の残高 */
  readonly remainingBalance: number
  /** 繰上返済額（該当月に繰上返済があれば） */
  readonly prepaymentAmount: number
}

/** 返済シミュレーション結果 */
export interface LoanSimulationResult {
  /** 月別返済スケジュール */
  readonly schedule: readonly MonthlyPayment[]
  /** 総支払額 */
  readonly totalPayment: number
  /** 利息総額 */
  readonly totalInterest: number
  /** 実際の返済月数 */
  readonly actualMonths: number
  /** 月額返済額（元利均等の場合は固定、元金均等は初月） */
  readonly monthlyPayment: number
}

/** 繰上返済比較結果 */
export interface PrepaymentComparisonResult {
  /** 繰上返済なし */
  readonly withoutPrepayment: LoanSimulationResult
  /** 期間短縮型 */
  readonly shortenPeriod: LoanSimulationResult
  /** 返済額軽減型 */
  readonly reducePayment: LoanSimulationResult
  /** 期間短縮型の削減利息 */
  readonly shortenSavedInterest: number
  /** 返済額軽減型の削減利息 */
  readonly reduceSavedInterest: number
  /** 期間短縮型の短縮月数 */
  readonly shortenedMonths: number
  /** 返済額軽減型の軽減後月額 */
  readonly reducedMonthlyPayment: number
}

/** 借り換え条件 */
export interface RefinanceCondition {
  /** 現在のローン残高（円） */
  readonly currentBalance: number
  /** 残期間（月数） */
  readonly remainingMonths: number
  /** 現在の年利 */
  readonly currentRate: number
  /** 借り換え先の年利 */
  readonly newRate: number
  /** 借り換え諸費用（円） */
  readonly refinanceCost: number
  /** 返済方式 */
  readonly method: RepaymentMethod
}

/** 借り換えシミュレーション結果 */
export interface RefinanceResult {
  /** 借り換え前 */
  readonly before: LoanSimulationResult
  /** 借り換え後 */
  readonly after: LoanSimulationResult
  /** 諸費用込みの総支払差額（正なら借り換えが得） */
  readonly netSaving: number
  /** 損益分岐月数（何ヶ月で元が取れるか。取れない場合はnull） */
  readonly breakEvenMonth: number | null
  /** 借り換えが得かどうか */
  readonly isWorthIt: boolean
}
