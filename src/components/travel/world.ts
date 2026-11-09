import { useEffect, useState } from 'react'
import type { Feature, FeatureCollection, MultiLineString } from 'geojson'
import { feature, mesh } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import coarseUrl from 'world-atlas/countries-110m.json?url'
import fineUrl from 'world-atlas/countries-50m.json?url'
import { buildLandDots, type LandDots } from './landDots'

export { coarseUrl, fineUrl }

export type World = { countries: Feature[]; borders: MultiLineString; dots: LandDots }

export type Palette = Record<'sea' | 'seaHi' | 'rim' | 'land' | 'dot' | 'border' | 'visited' | 'selected' | 'core' | 'label' | 'halo' | 'grid', string>

const worlds = new Map<string, Promise<World>>()

function toWorld(topology: Topology): World {
  const objects = topology.objects.countries as GeometryCollection
  const countries = (feature(topology, objects) as FeatureCollection).features

  return {
    countries,
    borders: mesh(topology, objects, (a, b) => a !== b),
    dots: buildLandDots(countries),
  }
}

async function fetchTopology(url: string) {
  const res = await fetch(url)

  return (await res.json()) as Topology
}

export function loadWorld(url: string) {
  let world = worlds.get(url)
  if (!world) {
    world = fetchTopology(url).then(toWorld)
    worlds.set(url, world)
  }

  return world
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()

  return {
    sea: v('--globe-sea'),
    seaHi: v('--globe-sea-hi'),
    rim: v('--globe-rim'),
    land: v('--globe-land'),
    dot: v('--globe-dot'),
    border: v('--globe-border'),
    visited: v('--globe-visited'),
    selected: v('--accent'),
    core: v('--globe-core'),
    label: v('--ink'),
    halo: v('--bg'),
    grid: v('--globe-grid'),
  }
}

export function usePalette() {
  const [palette, setPalette] = useState(readPalette)

  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  return palette
}

