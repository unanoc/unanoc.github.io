import { geoContains, geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath, type GeoPermissibleObjects } from 'd3-geo'
import type { Feature, FeatureCollection, MultiLineString } from 'geojson'
import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { feature, mesh } from 'topojson-client'
import { cn } from '@/lib/cn'
import type { GeometryCollection, Topology } from 'topojson-specification'
import coarseUrl from 'world-atlas/countries-110m.json?url'
import fineUrl from 'world-atlas/countries-50m.json?url'

export type GlobeMarker = {
  id: string
  lat: number
  lng: number
  label: string
  home?: boolean
  active?: boolean
}

export type GlobeFocus = { lat: number; lng: number; zoom: number }

type GlobeProps = {
  visited: Set<string>
  selected?: string
  focus: GlobeFocus | null
  markers: GlobeMarker[]
  onCountryClick: (numericId: string) => void
}

type World = { countries: Feature[]; borders: MultiLineString }

type Palette = Record<'sea' | 'land' | 'border' | 'visited' | 'selected' | 'marker' | 'home' | 'label' | 'halo' | 'grid', string>

const DETAIL_ZOOM = 2.2
const AUTO_SPIN_DEG_PER_MS = 0.006
const DRAG_DEG_PER_PX = 0.3
const CLICK_SLOP_PX = 4
const SPIN_RESUME_MS = 4000
const FLY_SECONDS = 1.1
const IDLE_TILT = 18
const LABEL_HEIGHT = 13
const LABEL_SPOTS: [number, number, 'left' | 'right'][] = [
  [8, 0, 'left'],
  [-8, 0, 'right'],
  [8, 12, 'left'],
  [8, -12, 'left'],
]
const SPHERE: GeoPermissibleObjects = { type: 'Sphere' }
const GRATICULE = geoGraticule10()

function toWorld(topology: Topology): World {
  const objects = topology.objects.countries as GeometryCollection

  return {
    countries: (feature(topology, objects) as FeatureCollection).features,
    borders: mesh(topology, objects, (a, b) => a !== b),
  }
}

async function fetchTopology(url: string) {
  const res = await fetch(url)

  return (await res.json()) as Topology
}

async function loadWorlds() {
  const [coarse, fine] = await Promise.all([fetchTopology(coarseUrl), fetchTopology(fineUrl)])

  return { coarse: toWorld(coarse), fine: toWorld(fine) }
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()

  return {
    sea: v('--globe-sea'),
    land: v('--globe-land'),
    border: v('--globe-border'),
    visited: v('--globe-visited'),
    selected: v('--accent'),
    marker: v('--ink'),
    home: v('--accent'),
    label: v('--ink'),
    halo: v('--bg'),
    grid: v('--line'),
  }
}

function usePalette() {
  const [palette, setPalette] = useState(readPalette)

  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  return palette
}

export function Globe({ visited, selected, focus, markers, onCountryClick }: GlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [worlds, setWorlds] = useState<{ coarse: World; fine: World } | null>(null)
  const [size, setSize] = useState(0)
  const [hovering, setHovering] = useState(false)
  const palette = usePalette()
  const reduceMotion = useReducedMotion()

  const view = useRef({ lng: markers.find((m) => m.home)?.lng ?? 0, lat: IDLE_TILT, zoom: 1 })
  const spinPausedUntil = useRef(0)
  const flight = useRef<{ stop: () => void } | null>(null)
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const visible = useRef(true)
  const props = useRef({ visited, selected, markers, palette, focus })

  useEffect(() => {
    props.current = { visited, selected, markers, palette, focus }
  }, [visited, selected, markers, palette, focus])

  useEffect(() => {
    let alive = true
    loadWorlds().then((w) => alive && setWorlds(w))

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize(Math.floor(entry.contentRect.width)))
    ro.observe(el)
    const io = new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting))
    io.observe(el)

    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    flight.current?.stop()
    const from = { ...view.current }
    const to = focus ?? { lng: from.lng, lat: IDLE_TILT, zoom: 1 }
    const path = geoInterpolate([from.lng, from.lat], [to.lng, to.lat])
    const logFrom = Math.log(from.zoom)
    const logTo = Math.log(to.zoom)
    flight.current = animate(0, 1, {
      duration: reduceMotion ? 0 : FLY_SECONDS,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) => {
        const [lng, lat] = path(t)
        view.current = { lng, lat, zoom: Math.exp(logFrom + (logTo - logFrom) * t) }
      },
    })
    if (focus) spinPausedUntil.current = Number.POSITIVE_INFINITY
    else spinPausedUntil.current = 0

    return () => flight.current?.stop()
  }, [focus, reduceMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !worlds || size === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const projection = geoOrthographic().translate([size / 2, size / 2]).precision(0.3)
    const path = geoPath(projection, ctx)
    const baseScale = size / 2 - 2
    const loop = { raf: 0, last: performance.now() }

    const frame = (now: number) => {
      loop.raf = requestAnimationFrame(frame)
      const dt = now - loop.last
      loop.last = now
      if (!visible.current) return
      const { visited: vis, selected: sel, markers: mks, palette: pal, focus: foc } = props.current
      const v = view.current
      if (!reduceMotion && !foc && !drag.current && now > spinPausedUntil.current) v.lng += AUTO_SPIN_DEG_PER_MS * dt

      projection.scale(baseScale * v.zoom).rotate([-v.lng, -v.lat])
      const world = v.zoom >= DETAIL_ZOOM ? worlds.fine : worlds.coarse
      ctx.clearRect(0, 0, size, size)

      ctx.beginPath()
      path(SPHERE)
      ctx.fillStyle = pal.sea
      ctx.fill()

      ctx.beginPath()
      path(GRATICULE)
      ctx.strokeStyle = pal.grid
      ctx.lineWidth = 0.5
      ctx.stroke()

      for (const f of world.countries) {
        const id = String(f.id)
        ctx.beginPath()
        path(f)
        ctx.fillStyle = id === sel ? pal.selected : vis.has(id) ? pal.visited : pal.land
        ctx.fill()
      }

      ctx.beginPath()
      path(world.borders)
      ctx.strokeStyle = pal.border
      ctx.lineWidth = 0.6
      ctx.stroke()

      const center: [number, number] = [v.lng, v.lat]
      const showLabels = v.zoom >= DETAIL_ZOOM
      ctx.font = '500 11px "Geist Variable", system-ui, sans-serif'
      ctx.textBaseline = 'middle'
      const placed: { x: number; y: number; w: number }[] = []
      for (const m of mks) {
        if (geoDistance([m.lng, m.lat], center) > Math.PI / 2 - 0.05) continue
        const p = projection([m.lng, m.lat])
        if (!p) continue
        const [x, y] = p
        if (m.home) {
          const pulse = reduceMotion ? 0.5 : (now % 2000) / 2000
          ctx.beginPath()
          ctx.arc(x, y, 3 + pulse * 9, 0, Math.PI * 2)
          ctx.strokeStyle = pal.home
          ctx.globalAlpha = 1 - pulse
          ctx.lineWidth = 1.5
          ctx.stroke()
          ctx.globalAlpha = 1
        }
        ctx.beginPath()
        ctx.arc(x, y, m.active ? 4 : 2.5, 0, Math.PI * 2)
        ctx.fillStyle = m.home ? pal.home : pal.marker
        ctx.fill()
        ctx.strokeStyle = pal.halo
        ctx.lineWidth = 1.5
        ctx.stroke()
        if (showLabels && m.active) {
          const w = ctx.measureText(m.label).width
          const spot = LABEL_SPOTS.map(([dx, dy, align]) => ({ x: align === 'left' ? x + dx : x + dx - w, y: y + dy }))
            .find((r) => !placed.some((o) => r.x < o.x + o.w && r.x + w > o.x && Math.abs(r.y - o.y) < LABEL_HEIGHT))
          if (spot) {
            placed.push({ x: spot.x, y: spot.y, w })
            ctx.lineWidth = 3
            ctx.strokeStyle = pal.halo
            ctx.strokeText(m.label, spot.x, spot.y)
            ctx.fillStyle = pal.label
            ctx.fillText(m.label, spot.x, spot.y)
          }
        }
      }

      ctx.beginPath()
      path(SPHERE)
      ctx.strokeStyle = pal.grid
      ctx.lineWidth = 1
      ctx.stroke()
    }
    loop.raf = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(loop.raf)
  }, [worlds, size, reduceMotion])

  function countryAt(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas || !worlds) return undefined
    const rect = canvas.getBoundingClientRect()
    const v = view.current
    const projection = geoOrthographic()
      .translate([size / 2, size / 2])
      .scale((size / 2 - 2) * v.zoom)
      .rotate([-v.lng, -v.lat])
    const point = projection.invert?.([clientX - rect.left, clientY - rect.top])
    if (!point || geoDistance(point, [v.lng, v.lat]) > Math.PI / 2) return undefined

    return worlds.coarse.countries.find((f) => geoContains(f, point))
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, moved: false }
    flight.current?.stop()
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d) {
      const hit = countryAt(e.clientX, e.clientY)
      setHovering(Boolean(hit && visited.has(String(hit.id))))

      return
    }
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > CLICK_SLOP_PX) d.moved = true
    const v = view.current
    const k = DRAG_DEG_PER_PX / v.zoom
    view.current = { ...v, lng: v.lng - dx * k, lat: Math.max(-80, Math.min(80, v.lat + dy * k)) }
    d.x = e.clientX
    d.y = e.clientY
  }

  function onPointerUp(e: React.PointerEvent) {
    const d = drag.current
    drag.current = null
    if (d?.moved) {
      if (!props.current.focus) spinPausedUntil.current = performance.now() + SPIN_RESUME_MS

      return
    }
    const hit = countryAt(e.clientX, e.clientY)
    if (hit && visited.has(String(hit.id))) onCountryClick(String(hit.id))
  }

  return (
    <div ref={wrapRef} className="relative aspect-square w-full">
      {!worlds && <div className="absolute inset-[2px] animate-pulse rounded-full bg-elevated" />}
      <canvas
        ref={canvasRef}
        className={cn('absolute inset-0 size-full touch-none rounded-full', hovering ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => setHovering(false)}
        aria-label="Глобус с посещёнными странами"
        role="img"
      />
    </div>
  )
}

