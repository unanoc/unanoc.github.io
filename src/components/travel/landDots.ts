import { geoEquirectangular, geoPath } from 'd3-geo'
import type { Feature } from 'geojson'

const MASK_W = 720
const MASK_H = 360
const DOT_STEP_DEG = 1.8
const MAX_LAT = 84
const ALPHA_THRESHOLD = 128
const DEG_TO_RAD = Math.PI / 180

export type LandDots = {
  count: number
  lng: Float32Array
  lat: Float32Array
  lngRad: Float32Array
  sinLat: Float32Array
  cosLat: Float32Array
}

function landMask(countries: Feature[]) {
  const canvas = document.createElement('canvas')
  canvas.width = MASK_W
  canvas.height = MASK_H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  const projection = geoEquirectangular()
    .scale(MASK_W / (2 * Math.PI))
    .translate([MASK_W / 2, MASK_H / 2])
  ctx.beginPath()
  geoPath(projection, ctx)({ type: 'FeatureCollection', features: countries })
  ctx.fill()

  return ctx.getImageData(0, 0, MASK_W, MASK_H).data
}

export function buildLandDots(countries: Feature[]): LandDots {
  const mask = landMask(countries)
  const lngs: number[] = []
  const lats: number[] = []
  if (mask) {
    for (let lat = -MAX_LAT; lat <= MAX_LAT; lat += DOT_STEP_DEG) {
      const step = DOT_STEP_DEG / Math.cos(lat * DEG_TO_RAD)
      const y = Math.floor(((90 - lat) / 180) * MASK_H)
      for (let lng = -180 + step / 2; lng < 180; lng += step) {
        const x = Math.floor(((lng + 180) / 360) * MASK_W)
        if (mask[(y * MASK_W + x) * 4 + 3] < ALPHA_THRESHOLD) continue
        lngs.push(lng)
        lats.push(lat)
      }
    }
  }

  return {
    count: lngs.length,
    lng: Float32Array.from(lngs),
    lat: Float32Array.from(lats),
    lngRad: Float32Array.from(lngs, (d) => d * DEG_TO_RAD),
    sinLat: Float32Array.from(lats, (d) => Math.sin(d * DEG_TO_RAD)),
    cosLat: Float32Array.from(lats, (d) => Math.cos(d * DEG_TO_RAD)),
  }
}
