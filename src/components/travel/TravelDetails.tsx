import { ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cities, type CityId } from '@/config'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'
import { useI18n } from '@/i18n/useI18n'
import type { Localized } from '@/i18n/locales'
import { flagOf, formatRange, type CountryInfo, type TravelSummary, type TripView } from '@/lib/travel'

type Props = {
  summary: TravelSummary
  country?: CountryInfo
  city?: CityId
  onSelectCountry: (code: string | undefined) => void
  onSelectCity: (id: CityId | undefined) => void
}

function route(trip: TripView, pick: (value: Localized) => string, only?: string) {
  const stops = trip.cities.filter((id) => !only || cities[id].country === only).map((id) => pick(cities[id].name))

  return stops.join(' → ')
}

function TripRow({ trip, country, highlight, onClick }: { trip: TripView; country?: string; highlight?: boolean; onClick?: () => void }) {
  const { locale, m, pick, plural } = useI18n()
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      onClick={onClick}
      className={cn('-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-lg px-2 py-1.5 text-left transition', onClick && 'hover:bg-elevated', highlight && 'bg-elevated')}
    >
      <span className="min-w-6 shrink-0 pt-px text-sm leading-5 whitespace-nowrap">{trip.countries.map(flagOf).join('')}</span>
      <span className="min-w-0 flex-1">
        <span className="block line-clamp-2 text-[13px] text-ink">{route(trip, pick, country)}</span>
        <span className="block truncate text-xs text-faint">{formatRange(trip.from, trip.to, locale)}</span>
      </span>
      <span className="shrink-0 pt-px text-xs text-faint tabular-nums">{plural(trip.days, m.travel.daysShort)}</span>
    </Tag>
  )
}

function Overview({ summary, onSelectCountry }: Pick<Props, 'summary' | 'onSelectCountry'>) {
  const { m } = useI18n()
  const byYear = new Map<string, TripView[]>()
  for (const t of summary.trips) byYear.set(t.from.slice(0, 4), [...(byYear.get(t.from.slice(0, 4)) ?? []), t])

  return (
    <div>
      <p className="mb-3 text-xs text-faint">{m.travel.allTrips}</p>
      <div className="space-y-4">
        {[...byYear].map(([year, list]) => (
          <div key={year}>
            <p className="mb-1 text-xs font-medium text-muted tabular-nums">{year}</p>
            {list.map((t) => (
              <TripRow key={t.id} trip={t} onClick={() => onSelectCountry(t.countries[0])} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function CountryView({ country, city, onSelectCountry, onSelectCity }: Required<Pick<Props, 'country'>> & Omit<Props, 'summary' | 'country'>) {
  const { m, pick, plural } = useI18n()
  const facts = [plural(country.trips.length, m.travel.trips), plural(country.days, m.travel.days)]

  return (
    <div>
      <button onClick={() => onSelectCountry(undefined)} className="mb-3 inline-flex items-center gap-1 text-xs text-faint transition hover:text-ink">
        <ArrowLeft className="size-3.5" /> {m.travel.wholeWorld}
      </button>
      <div className="flex items-center gap-3">
        <span className="text-4xl leading-none">{country.flag}</span>
        <div>
          <p className="text-lg font-semibold tracking-tight">{country.name}</p>
          <p className="text-xs text-faint">{facts.join(' · ')}</p>
        </div>
      </div>

      <p className="mt-5 mb-2 text-xs text-faint">{m.travel.citiesLabel}</p>
      <div className="flex flex-wrap gap-1.5">
        {country.cities.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCity(city === c.id ? undefined : c.id)}
            aria-pressed={city === c.id}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[13px] transition',
              city === c.id ? 'bg-ink text-bg' : 'bg-elevated text-muted hover:text-ink',
            )}
          >
            {pick(c.city.name)}
            {c.visits > 1 && <span className="text-[11px] opacity-60 tabular-nums">×{c.visits}</span>}
          </button>
        ))}
      </div>

      {country.trips.length > 0 && (
        <>
          <p className="mt-5 mb-1 text-xs text-faint">{m.travel.tripsLabel}</p>
          {country.trips.map((t) => (
            <TripRow key={t.id} trip={t} country={country.code} highlight={Boolean(city && t.cities.includes(city))} />
          ))}
        </>
      )}
    </div>
  )
}

export function TravelDetails(props: Props) {
  const key = props.country?.code ?? 'world'

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        {props.country ? <CountryView {...props} country={props.country} /> : <Overview summary={props.summary} onSelectCountry={props.onSelectCountry} />}
      </motion.div>
    </AnimatePresence>
  )
}
