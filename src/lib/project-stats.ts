import { useEffect, useState } from 'react'
import { siteApi } from '@/config'
import type { Project, PublicProjectStats } from '@/types/content'

function usersBySlug(body: unknown) {
  const list = (body as { projects?: Partial<PublicProjectStats>[] } | null)?.projects
  if (!Array.isArray(list)) return {}

  return Object.fromEntries(
    list.flatMap((p) => (typeof p.project === 'string' && typeof p.metrics?.users === 'number' ? [[p.project, p.metrics.users]] : [])),
  )
}

export function useProjectUsers(projects: Project[]) {
  const [users, setUsers] = useState<Record<string, number>>(() => Object.fromEntries(projects.map((p) => [p.slug, p.users ?? 0])))

  useEffect(() => {
    if (!siteApi.baseUrl) return
    const ctrl = new AbortController()
    fetch(`${siteApi.baseUrl}/v1/projects/stats`, { signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((body: unknown) => {
        const live = usersBySlug(body)
        setUsers((prev) => ({ ...prev, ...live }))
      })
      .catch(() => undefined)

    return () => ctrl.abort()
  }, [projects])

  return users
}
