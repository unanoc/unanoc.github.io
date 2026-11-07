import { useEffect, useRef } from 'react'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/cn'
import type { CountryInfo } from '@/lib/travel'

type Props = {
  countries: CountryInfo[]
  selected?: string
  onSelect: (code: string | undefined) => void
}

export function CountryList({ countries, selected, onSelect }: Props) {
  const { m, plural } = useI18n()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!selected) return
    listRef.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [selected])

  return (
    <ul ref={listRef} className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
      {countries.map((c) => {
        const active = c.code === selected

        return (
          <li key={c.code} className="shrink-0">
            <button
              onClick={() => onSelect(active ? undefined : c.code)}
              aria-pressed={active}
              title={plural(c.trips.length, m.travel.trips)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition',
                active ? 'bg-ink text-bg' : 'bg-elevated text-muted hover:text-ink',
              )}
            >
              <span className="text-sm leading-none">{c.flag}</span>
              {c.name}
              <span className={cn('tabular-nums', active ? 'opacity-60' : 'text-faint')}>{c.trips.length}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
