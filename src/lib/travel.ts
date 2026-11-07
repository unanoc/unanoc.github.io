import countries from 'i18n-iso-countries'
import { cities, trips, type CityId } from '@/config'
import type { City, Trip } from '@/types/travel'

const DAY_MS = 86_400_000
const NAME_OVERRIDES: Record<string, string> = {
  KR: 'Южная Корея',
  US: 'США',
  GB: 'Великобритания',
  AE: 'ОАЭ',
}
const regionNames = new Intl.DisplayNames('ru', { type: 'region' })

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
  flag: string
  cities: CityStat[]
  trips: TripView[]
  days: number
}

export type TravelSummary = {
  countries: CountryInfo[]
  trips: TripView[]
  cityCount: number
  totalDays: number
  firstTrip?: string
}

export function flagOf(code: string) {
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)))
}

export function countryName(code: string) {
  return NAME_OVERRIDES[code] ?? regionNames.of(code) ?? code
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

function buildCountries(tripViews: TripView[]): CountryInfo[] {
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
        name: countryName(code),
        flag: flagOf(code),
        cities: cityStats,
        trips: countryTrips,
        days: countryTrips.reduce((sum, t) => sum + t.days, 0),
      }
    })
    .sort((a, b) => b.trips.length - a.trips.length || a.name.localeCompare(b.name, 'ru'))
}

export function buildTravel(): TravelSummary {
  const tripViews = buildTrips()
  const countryInfos = buildCountries(tripViews)

  return {
    countries: countryInfos,
    trips: tripViews,
    cityCount: countryInfos.reduce((sum, c) => sum + c.cities.length, 0),
    totalDays: tripViews.reduce((sum, t) => sum + t.days, 0),
    firstTrip: tripViews.at(-1)?.from,
  }
}

const rangeDay = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const rangeFull = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })

export function formatRange(from: string, to: string) {
  const a = new Date(from)
  const b = new Date(to)
  const strip = (s: string) => s.replace(' г.', '')
  if (a.getFullYear() !== b.getFullYear()) return `${strip(rangeFull.format(a))} – ${strip(rangeFull.format(b))}`

  return `${rangeDay.format(a)} – ${strip(rangeFull.format(b))}`
}

export function plural(n: number, one: string, few: string, many: string) {
  const rule = new Intl.PluralRules('ru-RU').select(n)

  return `${n.toLocaleString('ru-RU')} ${rule === 'one' ? one : rule === 'few' ? few : many}`
}
