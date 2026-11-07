import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { socials } from '@/config'
import { cn } from '@/lib/cn'
import { useGithubActivity, type ActivityDay } from '@/lib/github-activity'
import { useI18n } from '@/i18n/useI18n'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Section } from '@/components/ui/Section'

const LEVELS = ['bg-elevated', 'bg-emerald-500/25', 'bg-emerald-500/50', 'bg-emerald-500/75', 'bg-emerald-500']
const TIP_EDGE = 72
const githubUrl = socials.find((s) => s.kind === 'github')?.href

type Tip = { day: ActivityDay; x: number; y: number; pinned: boolean }

function Title() {
  const label = (
    <span className="inline-flex items-center gap-1.5">
      <BrandIcon kind="github" />
      GitHub Activity
    </span>
  )
  if (!githubUrl) return label

  return (
    <a href={githubUrl} target="_blank" rel="noreferrer" className="transition hover:opacity-70">
      {label}
    </a>
  )
}

export function Activity() {
  const { intl, m, plural } = useI18n()
  const dayFmt = new Intl.DateTimeFormat(intl, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  const contributions = (n: number) => (n === 0 ? m.activity.none : plural(n, m.activity.perDay))
  const { days, total } = useGithubActivity()
  const wrapRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const leading = days.length > 0 ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0
  const weeks = Math.ceil((leading + days.length) / 7)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [days])

  useEffect(() => {
    if (!tip?.pinned) return
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return
      if (e.target instanceof Node && e.type === 'pointerdown' && (e.target as Element).closest?.('[data-day]')) return
      setTip(null)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)

    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [tip?.pinned])

  function show(day: ActivityDay, e: MouseEvent<HTMLButtonElement>, pinned: boolean) {
    const wrap = wrapRef.current?.getBoundingClientRect()
    const cell = e.currentTarget.getBoundingClientRect()
    if (!wrap) return
    const x = Math.min(wrap.width - TIP_EDGE, Math.max(TIP_EDGE, cell.left + cell.width / 2 - wrap.left))
    setTip({ day, pinned, x, y: cell.top - wrap.top })
  }

  return (
    <Section title={<Title />} meta={plural(total, m.activity.perYear)}>
      <div ref={wrapRef} className="relative">
        <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none]" onScroll={() => setTip(null)}>
          <div className="grid min-w-[520px] grid-flow-col grid-rows-7 gap-[2px]" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
            {Array.from({ length: leading }, (_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {days.map((d) => (
              <button
                key={d.date}
                data-day
                aria-label={`${contributions(d.count)}, ${dayFmt.format(new Date(`${d.date}T00:00:00Z`))}`}
                onClick={(e) => (tip?.pinned && tip.day.date === d.date ? setTip(null) : show(d, e, true))}
                onMouseEnter={(e) => !tip?.pinned && show(d, e, false)}
                onMouseLeave={() => !tip?.pinned && setTip(null)}
                className={cn(
                  'aspect-square w-full rounded-[2px] transition-shadow',
                  LEVELS[Math.min(4, Math.max(0, d.level))],
                  tip?.day.date === d.date && 'ring-1 ring-ink ring-offset-1 ring-offset-bg',
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {tip && (
            <motion.div
              key={tip.day.date}
              role="tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full pb-2"
              style={{ left: tip.x, top: tip.y }}
            >
              <div className="rounded-lg bg-ink px-2.5 py-1.5 text-center text-xs whitespace-nowrap text-bg shadow-lg">
                <p className="font-semibold">{contributions(tip.day.count)}</p>
                <p className="opacity-70">{dayFmt.format(new Date(`${tip.day.date}T00:00:00Z`)).replace(' г.', '')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}
