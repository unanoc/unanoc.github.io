import { numberFormat } from '@/i18n/intl'
import type { PluralForms } from '@/i18n/plural'
import { useI18n } from '@/i18n/useI18n'

export function TravelStat({ n, forms }: { n: number; forms: PluralForms }) {
  const { intl, plural } = useI18n()
  const num = numberFormat(intl).format(n)
  const [before, after] = plural(n, forms).split(num)

  return (
    <p className="flex items-baseline gap-1.5 text-sm text-muted">
      {before && <span>{before.trim()}</span>}
      <span className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{num}</span>
      {after && <span>{after.trim()}</span>}
    </p>
  )
}
