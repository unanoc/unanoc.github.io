import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { cities, type CityId } from '@/config'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/cn'
import { buildTravel } from '@/lib/travel'
import { CountryList } from '@/components/travel/CountryList'
import { focusOnCities, focusOnCity } from '@/components/travel/focus'
import { Globe, type GlobeFlag, type GlobeMarker } from '@/components/travel/Globe'
import { TravelDetails } from '@/components/travel/TravelDetails'
import { Flag } from '@/components/ui/Flag'
import { Section } from '@/components/ui/Section'

export function Travel() {
  const { locale, m, pick, plural } = useI18n()
  const summary = useMemo(() => buildTravel(locale), [locale])
  const [countryCode, setCountryCode] = useState<string>()
  const [cityId, setCityId] = useState<CityId>()

  const country = summary.countries.find((c) => c.code === countryCode)
  const visited = useMemo(() => new Set(summary.countries.map((c) => c.numericId)), [summary])
  const trips = country ? country.trips : summary.trips

  const focus = useMemo(() => {
    if (cityId) return focusOnCity(cities[cityId])

    return country ? focusOnCities(country.cities.map((c) => c.city)) : null
  }, [country, cityId])

  const markers: GlobeMarker[] = useMemo(
    () =>
      summary.countries.flatMap((c) =>
        c.cities.map((s) => ({
          id: s.id,
          lat: s.city.lat,
          lng: s.city.lng,
          label: pick(s.city.name),
          active: c.code === countryCode && (!cityId || cityId === s.id),
        })),
      ),
    [summary, countryCode, cityId, pick],
  )

  const flags: GlobeFlag[] = useMemo(
    () =>
      summary.countries.map((c) => ({
        code: c.code,
        numericId: c.numericId,
        lat: c.cities.reduce((sum, s) => sum + s.city.lat, 0) / c.cities.length,
        lng: c.cities.reduce((sum, s) => sum + s.city.lng, 0) / c.cities.length,
      })),
    [summary],
  )

  function selectCountry(code: string | undefined) {
    setCityId(undefined)
    setCountryCode(code)
  }

  function selectByNumericId(numericId: string) {
    const hit = summary.countries.find((c) => c.numericId === numericId)
    if (hit) selectCountry(hit.code === countryCode ? undefined : hit.code)
  }

  const facts = [
    plural(summary.countries.length, m.travel.countries),
    plural(summary.cityCount, m.travel.cities),
    plural(summary.trips.length, m.travel.trips),
    plural(summary.totalDays, m.travel.daysOnRoad),
  ]

  return (
    <Section title={m.travel.title} wrapMeta meta={<span className="text-xs">{facts.join(' · ')}</span>}>

      <div className="grid gap-4 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-10">
        <div className="md:sticky md:top-6 md:self-start">
          <div className="mx-auto w-full max-w-[300px] md:max-w-[380px]">
            <Globe label={m.travel.globe} visited={visited} selected={country?.numericId} focus={focus} markers={markers} flags={flags} onCountryClick={selectByNumericId} />
          </div>
        </div>

        <div className="min-w-0">
          <CountryList countries={summary.countries} selected={countryCode} onSelect={selectCountry} />

          <AnimatePresence initial={false}>
            {country && (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-elevated px-3 py-2">
                  <Flag code={country.code} className="text-2xl" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{country.name}</p>
                    <p className="text-xs text-faint">
                      {plural(country.trips.length, m.travel.trips)} · {plural(country.days, m.travel.days)} · {plural(country.cities.length, m.travel.cities)}
                    </p>
                  </div>
                </div>
                <div className="-mx-5 flex gap-1 overflow-x-auto px-5 pt-2.5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
                  {country.cities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCityId(cityId === c.id ? undefined : c.id)}
                      aria-pressed={cityId === c.id}
                      className={cn(
                        'shrink-0 rounded-md px-2 py-0.5 text-xs whitespace-nowrap transition',
                        cityId === c.id ? 'bg-accent text-accent-ink' : 'text-muted hover:bg-elevated hover:text-ink',
                      )}
                    >
                      {pick(c.city.name)}
                      {c.visits > 1 && <span className="ml-1 opacity-60 tabular-nums">×{c.visits}</span>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4">
            <TravelDetails key={countryCode ?? 'all'} trips={trips} country={countryCode} city={cityId} collapsible={!country} />
          </div>
        </div>
      </div>
    </Section>
  )
}
