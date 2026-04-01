interface ResultHighlightProps {
  readonly label: string
  readonly value: string
  readonly unit?: string
  readonly variant?: 'default' | 'accent' | 'danger'
}

export function ResultHighlight({
  label,
  value,
  unit,
  variant = 'default',
}: ResultHighlightProps) {
  const className = [
    'result-highlight',
    variant === 'accent' && 'result-highlight-accent',
    variant === 'danger' && 'result-highlight-danger',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <div className="label">{label}</div>
      <div className="value">
        {value}
        {unit && <span className="unit"> {unit}</span>}
      </div>
    </div>
  )
}
