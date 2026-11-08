import { useEffect, useState } from 'react'
import { siteApi } from '@/config'

export type ActivityDay = { date: string; count: number; level: number }

export type Activity =
  | { status: 'loading'; days: ActivityDay[] }
  | { status: 'ready'; days: ActivityDay[]; total: number }
  | { status: 'error' }

const PLACEHOLDER_DAYS = 371
const DAY_MS = 86_400_000

function placeholderDays(): ActivityDay[] {
  const start = Date.now() - (PLACEHOLDER_DAYS - 1) * DAY_MS

  return Array.from({ length: PLACEHOLDER_DAYS }, (_, i) => ({
    date: new Date(start + i * DAY_MS).toISOString().slice(0, 10),
    count: 0,
    level: 0,
  }))
}

function parse(body: unknown): Activity | null {
  const b = body as { days?: unknown; totalContributions?: unknown } | null
  if (!b || !Array.isArray(b.days) || typeof b.totalContributions !== 'number') return null
  const days = b.days.filter(
    (d): d is ActivityDay => typeof d?.date === 'string' && typeof d?.count === 'number' && typeof d?.level === 'number',
  )

  return days.length > 0 ? { status: 'ready', days, total: b.totalContributions } : null
}

export function useGithubActivity(): Activity {
  const [activity, setActivity] = useState<Activity>(() => (siteApi.baseUrl ? { status: 'loading', days: placeholderDays() } : { status: 'error' }))

  useEffect(() => {
    if (!siteApi.baseUrl) return
    const ctrl = new AbortController()
    fetch(`${siteApi.baseUrl}/v1/github/activity`, { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((body: unknown) => setActivity(parse(body) ?? { status: 'error' }))
      .catch(() => {
        if (!ctrl.signal.aborted) setActivity({ status: 'error' })
      })

    return () => ctrl.abort()
  }, [])

  return activity
}
