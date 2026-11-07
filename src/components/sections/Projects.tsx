import { ArrowUpRight, Plus, Rocket, Users } from 'lucide-react'
import { projects } from '@/config'
import { cn } from '@/lib/cn'
import { useProjectUsers } from '@/lib/project-stats'
import type { Project, ProjectStatus } from '@/types/content'
import { AppStoreButton } from '@/components/ui/AppStoreButton'
import { Section } from '@/components/ui/Section'

const STATUS: Record<ProjectStatus, { label: string; dot: string }> = {
  live: { label: 'активно', dot: 'bg-emerald-500' },
  building: { label: 'в работе', dot: 'bg-amber-500' },
  sold: { label: 'продан', dot: 'bg-sky-500' },
  archived: { label: 'неактивно', dot: 'bg-faint' },
}

const numberFmt = new Intl.NumberFormat('ru-RU')
const sinceFmt = new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' })

function ProjectTile({ p, users }: { p: Project; users: number }) {
  const status = STATUS[p.status]

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
            <span className={cn('size-1.5 rounded-full', status.dot)} />
            {status.label}
          </p>
        </div>
        {p.appStoreUrl && <AppStoreButton href={p.appStoreUrl} />}
      </div>
      <p className="mt-3 text-[13px] leading-snug text-muted">{p.description}</p>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3 text-xs text-faint">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" />
          <span className="font-semibold text-ink tabular-nums">{numberFmt.format(users)}</span>
          юзеров
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Rocket className="size-3.5" />
          запуск {sinceFmt.format(new Date(p.since)).replace(' г.', '')}
        </span>
      </div>
    </article>
  )
}

function NextTile() {
  return (
    <div className="hidden items-center justify-center gap-1.5 rounded-xl border border-dashed border-line text-xs text-faint sm:flex">
      <Plus className="size-3.5" />
      следующий проект
    </div>
  )
}

export function Projects() {
  const users = useProjectUsers(projects)

  return (
    <Section title="Проекты">
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectTile key={p.name} p={p} users={users[p.slug] ?? 0} />
        ))}
        {projects.length % 2 === 1 && <NextTile />}
      </div>
    </Section>
  )
}
