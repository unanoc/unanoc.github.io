import { motion } from 'motion/react'
import { clockMoods, profile, roles } from '@/config'
import { useNow } from '@/hooks/useNow'
import { EASE_OUT } from '@/lib/motion'
import { formatTenure } from '@/lib/tenure'
import type { Role } from '@/types/content'
import { Avatar } from '@/components/ui/Avatar'
import { PulseDot } from '@/components/ui/PulseDot'
import { SocialIcons } from '@/components/ui/SocialLinks'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const CLOCK_TICK_MS = 30_000
const timeFmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: profile.timezone })
const hourFmt = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: profile.timezone })
const sinceFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: profile.timezone })

function moodAt(hour: number) {
  return clockMoods.filter((m) => m.from <= hour).at(-1)?.text ?? ''
}

function RoleRow({ role, now }: { role: Role; now: Date }) {
  const active = !role.until
  const since = sinceFmt.format(new Date(role.since)).replace(' г.', '')
  const tenure = formatTenure(role.since, profile.timezone, role.until ? new Date(role.until) : now)

  return (
    <li className="flex items-start justify-between gap-3 px-3.5 py-3">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[13px] font-medium whitespace-nowrap text-ink">
          <span className={active ? 'size-1.5 shrink-0 rounded-full bg-emerald-500' : 'size-1.5 shrink-0 rounded-full bg-faint'} />
          {role.title}
        </p>
        <p className="mt-0.5 pl-3.5 text-xs text-faint">
          {role.note ? `${role.note} · ` : ''}с {since}
        </p>
      </div>
      <p className="shrink-0 text-sm font-semibold text-ink tabular-nums">{tenure}</p>
    </li>
  )
}

export function Profile({ className }: { className?: string }) {
  const now = useNow(CLOCK_TICK_MS)
  const mood = moodAt(Number(hourFmt.format(now)))

  return (
    <motion.aside className={className} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
      <div className="flex items-center gap-4">
        <Avatar alt={profile.name} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-sm text-faint">{profile.handle}</p>
        </div>
        <ThemeToggle className="self-start" />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">{profile.bio}</p>

      <ul className="mt-5 divide-y divide-line rounded-xl border border-line">
        {roles.map((role) => (
          <RoleRow key={role.title} role={role} now={now} />
        ))}
      </ul>

      <div className="mt-4 flex items-start gap-2.5 text-sm">
        <span className="text-lg leading-5">{profile.flag}</span>
        <div>
          <p className="text-ink">
            {profile.city}, {profile.country}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-faint">
            <PulseDot />
            <span className="text-muted tabular-nums">{timeFmt.format(now)}</span> — {mood}
          </p>
        </div>
      </div>

      <SocialIcons className="mt-4 -ml-2" />
    </motion.aside>
  )
}
