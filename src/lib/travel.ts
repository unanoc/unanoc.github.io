import countries from 'i18n-iso-countries'
import { cities, trips, undatedVisits, type CityId } from '@/config'
import { regionNames } from '@/i18n/intl'
import { INTL_LOCALE, type Locale } from '@/i18n/locales'
import type { City } from '@/types/travel'

const NAME_OVERRIDES: Partial<Record<Locale, Record<string, string>>> = {
  ru: { KR: 'Южная Корея', US: 'США', GB: 'Великобритания', AE: 'ОАЭ' },
}

export type CityStop = {
  id: CityId
  city: City
}

export type CountryInfo = {
  code: string
  numericId: string
  name: string
  cities: CityStop[]
}

export type TravelSummary = {
  countries: CountryInfo[]
  cityCount: number
}

type Tally = { visits: number; last: string }

function countryName(code: string, locale: Locale) {
  return NAME_OVERRIDES[locale]?.[code] ?? regionNames(INTL_LOCALE[locale]).of(code) ?? code
}

function tally<K>(map: Map<K, Tally>, key: K, from: string) {
  const prev = map.get(key)
  map.set(key, { visits: (prev?.visits ?? 0) + 1, last: prev && prev.last > from ? prev.last : from })
}

function byTally<K>(map: Map<K, Tally>) {
  return (a: K, b: K) => map.get(b)!.visits - map.get(a)!.visits || map.get(b)!.last.localeCompare(map.get(a)!.last)
}

export function buildTravel(locale: Locale): TravelSummary {
  const countryTally = new Map<string, Tally>()
  const cityTally = new Map<CityId, Tally>()
  for (const trip of trips) {
    for (const code of new Set(trip.cities.map((id) => cities[id].country))) tally(countryTally, code, trip.from)
    for (const id of new Set(trip.cities)) tally(cityTally, id, trip.from)
  }
  for (const id of undatedVisits) {
    if (!cityTally.has(id)) tally(countryTally, cities[id].country, '')
    tally(cityTally, id, '')
  }
  const cityIds = [...cityTally.keys()].sort(byTally(cityTally))

  const countryInfos = [...countryTally.keys()].sort(byTally(countryTally)).map((code) => ({
    code,
    numericId: countries.alpha2ToNumeric(code) ?? '',
    name: countryName(code, locale),
    cities: cityIds.filter((id) => cities[id].country === code).map((id) => ({ id, city: cities[id] })),
  }))

  return { countries: countryInfos, cityCount: cityIds.length }
}
