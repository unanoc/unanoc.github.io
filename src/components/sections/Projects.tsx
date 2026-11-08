import { ArrowUpRight, Plus, Rocket, Users } from 'lucide-react'
import { projects } from '@/config'
import { dateFormat, numberFormat, stripYearSuffix } from '@/i18n/intl'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/cn'
import { useProjectUsers } from '@/lib/project-stats'
import type { Project, ProjectStatus } from '@/types/content'
import { AppStoreButton } from '@/components/ui/AppStoreButton'
import { Section } from '@/components/ui/Section'

const STATUS_DOT: Record<ProjectStatus, string> = {
  live: 'bg-emerald-500',
  building: 'bg-amber-500',
  sold: 'bg-sky-500',
  archived: 'bg-faint',
}

function ProjectTile({ p, users }: { p: Project; users: number }) {
  const { intl, m, pick, fill } = useI18n()
  const launched = stripYearSuffix(dateFormat(intl, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(p.since)))

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_6px_24px_-12px_rgb(0_0_0/0.25)]">
      <div className="flex items-center gap-3">
        <img src={p.logo} alt="" width={36} height={36} className="size-9 shrink-0 rounded-[9px] ring-1 ring-line" />
        <div className="min-w-0 flex-1">
          <a href={p.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-0.5 text-sm font-semibold tracking-tight">
            {p.name}
            <ArrowUpRight className="size-3.5 text-faint transition group-hover:text-ink" />
          </a>
          <p className="flex items-center gap-1 text-[11px] text-faint">
            <span className={cn('size-1.5 rounded-full', STATUS_DOT[p.status])} />
            {m.projects.status[p.status]}
          </p>
        </div>
        {p.appStoreUrl && <AppStoreButton href={p.appStoreUrl} />}
      </div>
      <p className="mt-3 text-[13px] leading-snug text-muted">{pick(p.description)}</p>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3 text-xs text-faint">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" />
          <span className="font-semibold text-ink tabular-nums">{numberFormat(intl).format(users)}</span>
          {m.projects.users}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Rocket className="size-3.5" />
          {fill(m.projects.launched, { date: launched })}
        </span>
      </div>
    </article>
  )
}

function NextTile() {
  const { m } = useI18n()

  return (
    <div className="hidden items-center justify-center gap-1.5 rounded-xl border border-dashed border-line text-xs text-faint sm:flex">
      <Plus className="size-3.5" />
      {m.projects.next}
    </div>
  )
}

export function Projects() {
  const { m } = useI18n()
  const users = useProjectUsers(projects)

  return (
    <Section title={m.projects.title}>
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectTile key={p.name} p={p} users={users[p.slug] ?? 0} />
        ))}
        {projects.length % 2 === 1 && <NextTile />}
      </div>
    </Section>
  )
}
