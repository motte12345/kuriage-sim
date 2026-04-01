/** 円をカンマ区切りで表示 */
export function formatYen(yen: number): string {
  return Math.round(yen).toLocaleString('ja-JP')
}

/** 円を万円表示（小数1桁） */
export function formatMan(yen: number): string {
  const man = yen / 10_000
  return man % 1 === 0 ? man.toLocaleString('ja-JP') : man.toLocaleString('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

/** 月数を「○年○ヶ月」に変換 */
export function formatMonths(months: number): string {
  const years = Math.floor(months / 12)
  const remaining = months % 12
  if (years === 0) return `${remaining}ヶ月`
  if (remaining === 0) return `${years}年`
  return `${years}年${remaining}ヶ月`
}
