import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { clockMoods, profile } from '@/config'
import { useNow } from '@/hooks/useNow'
import { EASE_OUT } from '@/lib/motion'
import { soloDayNumber } from '@/lib/solo-duration'
import { Avatar } from '@/components/ui/Avatar'
import { PulseDot } from '@/components/ui/PulseDot'
import { SocialIcons } from '@/components/ui/SocialLinks'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Subscribe } from '@/components/sections/Subscribe'

const CLOCK_TICK_MS = 30_000
const timeFmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: profile.timezone })
const hourFmt = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: profile.timezone })
const sinceFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: profile.timezone })

function moodAt(hour: number) {
  return clockMoods.filter((m) => m.from <= hour).at(-1)?.text ?? ''
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="w-14 shrink-0 text-faint">{label}</dt>
      <dd className="min-w-0 text-muted">{children}</dd>
    </div>
  )
}

export function Profile({ className }: { className?: string }) {
  const now = useNow(CLOCK_TICK_MS)
  const day = soloDayNumber(profile.soloSince, profile.timezone, now)
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

      <dl className="mt-5 space-y-1.5 text-[13px]">
        <Fact label="Соло">
          <span className="text-ink tabular-nums">{day}-й день</span>
          <span className="text-faint"> · с {sinceFmt.format(new Date(profile.soloSince)).replace(' г.', '')}</span>
        </Fact>
        <Fact label="Строю">
          <a href={profile.building.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-ink underline decoration-line underline-offset-4 transition hover:decoration-ink/40">
            {profile.building.name}
            <ArrowUpRight className="size-3.5 text-faint" />
          </a>
        </Fact>
        <Fact label="Сейчас">
          <span className="flex items-baseline gap-2">
            <PulseDot className="shrink-0 -translate-y-0.5" />
            <span>
              <span className="text-ink tabular-nums">{timeFmt.format(now)}</span> в {profile.city} {profile.flag} — {mood}
            </span>
          </span>
        </Fact>
      </dl>

      <SocialIcons className="mt-4 -ml-2" />
      <Subscribe className="mt-6" />
    </motion.aside>
  )
}
