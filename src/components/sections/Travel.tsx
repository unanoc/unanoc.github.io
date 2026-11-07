import { useMemo, useState } from 'react'
import { cities, homeCity, type CityId } from '@/config'
import { buildTravel, plural } from '@/lib/travel'
import { CountryList } from '@/components/travel/CountryList'
import { focusOnCities, focusOnCity } from '@/components/travel/focus'
import { Globe, type GlobeMarker } from '@/components/travel/Globe'
import { TravelDetails } from '@/components/travel/TravelDetails'

export function Travel() {
  const summary = useMemo(() => buildTravel(), [])
  const [countryCode, setCountryCode] = useState<string>()
  const [cityId, setCityId] = useState<CityId>()

  const country = summary.countries.find((c) => c.code === countryCode)
  const visited = useMemo(() => new Set(summary.countries.map((c) => c.numericId)), [summary])

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
          label: s.city.name,
          home: s.id === homeCity,
          active: c.code === countryCode && (!cityId || cityId === s.id),
        })),
      ),
    [summary, countryCode, cityId],
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
    plural(summary.countries.length, 'страна', 'страны', 'стран'),
    plural(summary.cityCount, 'город', 'города', 'городов'),
    plural(summary.trips.length, 'поездка', 'поездки', 'поездок'),
    `${plural(summary.totalDays, 'день', 'дня', 'дней')} в дороге`,
  ]

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-sm font-medium">Путешествия</h2>
        <p className="text-xs text-faint">{facts.join(' · ')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[190px_minmax(0,1fr)_300px] lg:gap-8">
        <div className="order-2 min-w-0 lg:order-1">
          <CountryList countries={summary.countries} selected={countryCode} onSelect={selectCountry} />
        </div>
        <div className="order-1 mx-auto w-full max-w-[460px] min-w-0 lg:order-2">
          <Globe visited={visited} selected={country?.numericId} focus={focus} markers={markers} onCountryClick={selectByNumericId} />
          <p className="mt-2 text-center text-[11px] text-faint">крути глобус · нажми на страну</p>
        </div>
        <div className="order-3 min-w-0">
          <TravelDetails summary={summary} country={country} city={cityId} onSelectCountry={selectCountry} onSelectCity={setCityId} />
        </div>
      </div>
    </section>
  )
}
