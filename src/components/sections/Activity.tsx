import { AnimatePresence, motion } from 'motion/react'
import { memo, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { socials } from '@/config'
import { dateFormat, stripYearSuffix } from '@/i18n/intl'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/cn'
import { useGithubActivity, type ActivityDay } from '@/lib/github-activity'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { Section } from '@/components/ui/Section'

const LEVELS = ['bg-elevated', 'bg-emerald-500/25', 'bg-emerald-500/50', 'bg-emerald-500/75', 'bg-emerald-500']
const TIP_EDGE = 72
const githubUrl = socials.find((s) => s.kind === 'github')?.href

type Tip = { day: ActivityDay; x: number; y: number; pinned: boolean }

type Cell = ActivityDay & { label: string; dateText: string; countText: string }

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

type GridProps = {
  cells: Cell[]
  leading: number
  activeDate?: string
  interactive: boolean
  onShow: (cell: Cell, e: MouseEvent<HTMLButtonElement>, pinned: boolean) => void
  onHide: () => void
}

const Grid = memo(function Grid({ cells, leading, activeDate, interactive, onShow, onHide }: GridProps) {
  const weeks = Math.ceil((leading + cells.length) / 7)

  return (
    <div className="grid min-w-[520px] grid-flow-col grid-rows-7 gap-[2px]" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
      {Array.from({ length: leading }, (_, i) => (
        <span key={`pad-${i}`} />
      ))}
      {cells.map((c) => (
        <button
          key={c.date}
          type="button"
          tabIndex={-1}
          data-day
          disabled={!interactive}
          aria-label={c.label}
          onClick={(e) => onShow(c, e, true)}
          onMouseEnter={(e) => onShow(c, e, false)}
          onMouseLeave={onHide}
          className={cn(
            'aspect-square w-full rounded-[2px] transition-shadow',
            LEVELS[Math.min(4, Math.max(0, c.level))],
            !interactive && 'animate-pulse',
            activeDate === c.date && 'ring-1 ring-ink ring-offset-1 ring-offset-bg',
          )}
        />
      ))}
    </div>
  )
})

export function Activity() {
  const { intl, m, plural } = useI18n()
  const activity = useGithubActivity()
  const wrapRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef(false)
  const [tip, setTip] = useState<Tip | null>(null)
  const days = useMemo(() => (activity.status === 'error' ? [] : activity.days), [activity])

  const cells = useMemo<Cell[]>(() => {
    const fmt = dateFormat(intl, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

    return days.map((d) => {
      const dateText = stripYearSuffix(fmt.format(new Date(`${d.date}T00:00:00Z`)))
      const countText = d.count === 0 ? m.activity.none : plural(d.count, m.activity.perDay)

      return { ...d, dateText, countText, label: `${countText}, ${dateText}` }
    })
  }, [days, intl, m, plural])

  const leading = days.length > 0 ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [cells])

  useEffect(() => {
    if (!tip?.pinned) return
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return
      if (e.type === 'pointerdown' && (e.target as Element | null)?.closest?.('[data-day]')) return
      pinnedRef.current = false
      setTip(null)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)

    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [tip?.pinned])

  const onShow = useCallback((cell: Cell, e: MouseEvent<HTMLButtonElement>, pinned: boolean) => {
      if (!pinned && pinnedRef.current) return
      const wrap = wrapRef.current?.getBoundingClientRect()
      if (!wrap) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.min(wrap.width - TIP_EDGE, Math.max(TIP_EDGE, rect.left + rect.width / 2 - wrap.left))
      setTip((prev) => {
        if (pinned && prev?.pinned && prev.day.date === cell.date) {
          pinnedRef.current = false

          return null
        }
        pinnedRef.current = pinned

        return { day: cell, pinned, x, y: rect.top - wrap.top }
      })
  }, [])

  const onHide = useCallback(() => {
    if (!pinnedRef.current) setTip(null)
  }, [])

  if (activity.status === 'error') return null

  const tipCell = tip ? cells.find((c) => c.date === tip.day.date) : undefined

  return (
    <Section title={<Title />} meta={activity.status === 'ready' ? plural(activity.total, m.activity.perYear) : undefined}>
      <div ref={wrapRef} className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto [scrollbar-width:none]"
          onScroll={() => {
            pinnedRef.current = false
            setTip(null)
          }}
        >
          <Grid cells={cells} leading={leading} activeDate={tip?.day.date} interactive={activity.status === 'ready'} onShow={onShow} onHide={onHide} />
        </div>

        <AnimatePresence>
          {tip && tipCell && (
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
                <p className="font-semibold">{tipCell.countText}</p>
                <p className="opacity-70">{tipCell.dateText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}
