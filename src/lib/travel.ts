import countries from 'i18n-iso-countries'
import { cities, trips, type CityId } from '@/config'
import { dateFormat, regionNames, stripYearSuffix } from '@/i18n/intl'
import { INTL_LOCALE, type Locale } from '@/i18n/locales'
import type { City, Trip } from '@/types/travel'

const DAY_MS = 86_400_000
const NAME_OVERRIDES: Partial<Record<Locale, Record<string, string>>> = {
  ru: { KR: 'Южная Корея', US: 'США', GB: 'Великобритания', AE: 'ОАЭ' },
}

export type TripView = Trip<CityId> & {
  id: string
  days: number
  countries: string[]
}

export type CityStat = {
  id: CityId
  city: City
  visits: number
}

export type CountryInfo = {
  code: string
  numericId: string
  name: string
  cities: CityStat[]
  trips: TripView[]
  days: number
}

export type TravelSummary = {
  countries: CountryInfo[]
  trips: TripView[]
  cityCount: number
  totalDays: number
}

export function countryName(code: string, locale: Locale) {
  return NAME_OVERRIDES[locale]?.[code] ?? regionNames(INTL_LOCALE[locale]).of(code) ?? code
}

function tripDays(trip: Trip) {
  return Math.round((Date.parse(trip.to) - Date.parse(trip.from)) / DAY_MS) + 1
}

function buildTrips(): TripView[] {
  return trips
    .map((t) => ({
      ...t,
      id: `${t.from}-${t.cities.join('-')}`,
      days: tripDays(t),
      countries: [...new Set(t.cities.map((c) => cities[c].country))],
    }))
    .sort((a, b) => b.from.localeCompare(a.from))
}

function buildCountries(tripViews: TripView[], locale: Locale): CountryInfo[] {
  const codes = new Set<string>(tripViews.flatMap((t) => t.countries))

  return [...codes]
    .map((code) => {
      const countryTrips = tripViews.filter((t) => t.countries.includes(code))
      const cityIds = (Object.keys(cities) as CityId[]).filter((id) => cities[id].country === code)
      const cityStats = cityIds
        .map((id) => ({
          id,
          city: cities[id],
          visits: countryTrips.filter((t) => t.cities.includes(id)).length,
        }))
        .filter((c) => c.visits > 0)
        .sort((a, b) => b.visits - a.visits)

      return {
        code,
        numericId: countries.alpha2ToNumeric(code) ?? '',
        name: countryName(code, locale),
        cities: cityStats,
        trips: countryTrips,
        days: countryTrips.reduce((sum, t) => sum + t.days, 0),
      }
    })
    .sort((a, b) => b.trips.length - a.trips.length || a.name.localeCompare(b.name, INTL_LOCALE[locale]))
}

export function buildTravel(locale: Locale): TravelSummary {
  const tripViews = buildTrips()
  const countryInfos = buildCountries(tripViews, locale)

  return {
    countries: countryInfos,
    trips: tripViews,
    cityCount: countryInfos.reduce((sum, c) => sum + c.cities.length, 0),
    totalDays: tripViews.reduce((sum, t) => sum + t.days, 0),
  }
}

export function formatRange(from: string, to: string, locale: Locale) {
  const fmt = dateFormat(INTL_LOCALE[locale], { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

  return stripYearSuffix(fmt.formatRange(new Date(`${from}T00:00:00Z`), new Date(`${to}T00:00:00Z`)))
}
