import { cn } from '@/lib/cn'
import type { CountryInfo } from '@/lib/travel'

type Props = {
  countries: CountryInfo[]
  selected?: string
  onSelect: (code: string | undefined) => void
}

function Badge({ c }: { c: CountryInfo }) {
  return <span className="text-[11px] text-faint tabular-nums">×{c.trips.length}</span>
}

export function CountryList({ countries, selected, onSelect }: Props) {
  return (
    <ul className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
      {countries.map((c) => {
        const active = c.code === selected

        return (
          <li key={c.code} className="shrink-0">
            <button
              onClick={() => onSelect(active ? undefined : c.code)}
              aria-pressed={active}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[13px] whitespace-nowrap transition lg:border-transparent',
                active ? 'border-ink/20 bg-elevated text-ink' : 'border-line text-muted hover:bg-elevated hover:text-ink',
              )}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span className="flex-1">{c.name}</span>
              <Badge c={c} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
