export type City = {
  name: string
  country: string
  lat: number
  lng: number
}

export type Trip<CityId extends string = string> = {
  title?: string
  from: string
  to: string
  cities: CityId[]
  note?: string
}
