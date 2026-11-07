import type { Localized } from '@/i18n/locales'

export type City = {
  name: Localized
  country: string
  lat: number
  lng: number
}

export type Trip<CityId extends string = string> = {
  from: string
  to: string
  cities: CityId[]
}
