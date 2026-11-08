import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cities, type CityId } from '@/config'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/cn'
import { formatRange, type TripView } from '@/lib/travel'
import { Flag } from '@/components/ui/Flag'

type Props = {
  trips: TripView[]
  country?: string
  city?: CityId
  collapsible?: boolean
}

const COLLAPSED_COUNT = 6

function TripRow({ trip, country, city }: { trip: TripView; country?: string; city?: CityId }) {
  const { locale, m, pick, plural } = useI18n()
  const stops = trip.cities.filter((id) => !country || cities[id].country === country)
  const dimmed = Boolean(city) && !trip.cities.includes(city!)

  return (
    <li className={cn('flex items-start gap-3 py-2 transition-opacity', dimmed && 'opacity-35')}>
      <span className="flex shrink-0 gap-0.5 pt-1 text-sm">
        {trip.countries.map((code) => (
          <Flag key={code} code={code} />
        ))}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-snug text-ink">
          {stops.map((id, i) => (
            <span key={id}>
              {i > 0 && <span className="text-faint"> · </span>}
              <span className={cn(id === city && 'font-semibold text-accent')}>{pick(cities[id].name)}</span>
            </span>
          ))}
        </p>
        <p className="text-[11px] text-faint">{formatRange(trip.from, trip.to, locale)}</p>
      </div>
      <span className="shrink-0 pt-0.5 text-[11px] text-faint tabular-nums">{plural(trip.days, m.travel.daysShort)}</span>
    </li>
  )
}

export function TravelDetails({ trips, country, city, collapsible }: Props) {
  const { m, fill } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const canCollapse = collapsible && trips.length > COLLAPSED_COUNT
  const shown = canCollapse && !expanded ? trips.slice(0, COLLAPSED_COUNT) : trips
  const byYear = new Map<string, TripView[]>()
  for (const t of shown) byYear.set(t.from.slice(0, 4), [...(byYear.get(t.from.slice(0, 4)) ?? []), t])

  return (
    <div className="space-y-3">
      {[...byYear].map(([year, list]) => (
        <div key={year}>
          <p className="text-[11px] font-semibold text-faint tabular-nums">{year}</p>
          <ul className="divide-y divide-line">
            {list.map((t) => (
              <TripRow key={t.id} trip={t} country={country} city={city} />
            ))}
          </ul>
        </div>
      ))}
      {canCollapse && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full bg-elevated px-3 py-1 text-xs font-medium text-muted transition hover:text-ink"
        >
          {expanded ? m.travel.showLess : fill(m.travel.showAll, { n: String(trips.length) })}
          <ChevronDown className={cn('size-3.5 transition', expanded && 'rotate-180')} />
        </button>
      )}
    </div>
  )
}
