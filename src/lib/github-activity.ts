import { useEffect, useState } from 'react'
import { siteApi } from '@/config'
import { seededRandom } from '@/lib/seeded-random'

export type ActivityDay = { date: string; count: number; level: number }

export type Activity = {
  days: ActivityDay[]
  total: number
  live: boolean
}

const SAMPLE_DAYS = 364
const SAMPLE_SEED = 42
const DAY_MS = 86_400_000

function sampleActivity(): Activity {
  const rand = seededRandom(SAMPLE_SEED)
  const start = Date.now() - (SAMPLE_DAYS - 1) * DAY_MS
  const days = Array.from({ length: SAMPLE_DAYS }, (_, i) => {
    const r = rand() + Math.sin(i / 30) * 0.15
    const level = r < 0.25 ? 0 : r < 0.5 ? 1 : r < 0.7 ? 2 : r < 0.88 ? 3 : 4

    return { date: new Date(start + i * DAY_MS).toISOString().slice(0, 10), count: level * 3, level }
  })

  return { days, total: days.reduce((sum, d) => sum + d.count, 0), live: false }
}

function parse(body: unknown): Activity | undefined {
  const b = body as { days?: unknown; totalContributions?: unknown } | null
  if (!b || !Array.isArray(b.days) || typeof b.totalContributions !== 'number') return undefined
  const days = b.days.filter(
    (d): d is ActivityDay => typeof d?.date === 'string' && typeof d?.count === 'number' && typeof d?.level === 'number',
  )

  return days.length > 0 ? { days, total: b.totalContributions, live: true } : undefined
}

export function useGithubActivity() {
  const [activity, setActivity] = useState(sampleActivity)

  useEffect(() => {
    if (!siteApi.baseUrl) return
    const ctrl = new AbortController()
    fetch(`${siteApi.baseUrl}/v1/github/activity`, { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((body: unknown) => {
        const live = parse(body)
        if (live) setActivity(live)
      })
      .catch(() => undefined)

    return () => ctrl.abort()
  }, [])

  return activity
}
