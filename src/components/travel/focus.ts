import { geoCentroid, geoDistance } from 'd3-geo'
import type { City } from '@/types/travel'
import type { GlobeFocus } from './Globe'

const RAD_TO_DEG = 180 / Math.PI
const MIN_COUNTRY_ZOOM = 1
const FIT_MARGIN = 0.85
const DEG_TO_RAD = Math.PI / 180
const MAX_COUNTRY_ZOOM = 8
const CITY_ZOOM = 9
const SPREAD_TO_ZOOM = 34
const SPREAD_PADDING_DEG = 4

export function focusOnCities(list: City[]): GlobeFocus | null {
  if (list.length === 0) return null
  const points = list.map((c) => [c.lng, c.lat] as [number, number])
  const [lng, lat] = points.length === 1 ? points[0] : geoCentroid({ type: 'MultiPoint', coordinates: points })
  const spread = Math.max(...points.map((p) => geoDistance(p, [lng, lat]) * RAD_TO_DEG))
  const reach = Math.min(spread + SPREAD_PADDING_DEG, 89)
  const fit = FIT_MARGIN / Math.sin(reach * DEG_TO_RAD)
  const zoom = Math.min(MAX_COUNTRY_ZOOM, fit, Math.max(MIN_COUNTRY_ZOOM, SPREAD_TO_ZOOM / reach))

  return { lng, lat, zoom }
}

export function focusOnCity(city: City): GlobeFocus {
  return { lng: city.lng, lat: city.lat, zoom: CITY_ZOOM }
}
