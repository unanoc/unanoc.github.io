import { timeline } from '@/config'
import { Section } from '@/components/ui/Section'

const DAY_PRECISION = 10
const dayFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
const monthFmt = new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' })

function formatDate(date: string) {
  const fmt = date.length >= DAY_PRECISION ? dayFmt : monthFmt

  return fmt.format(new Date(date)).replace(' г.', '')
}

export function Journey() {
  return (
    <Section title="Путь">
      <ul className="space-y-2 text-sm">
        {timeline.map((t) => (
          <li key={t.date + t.title} className="flex gap-4">
            <span className="w-24 shrink-0 text-xs leading-5 text-faint tabular-nums">{formatDate(t.date)}</span>
            <span>
              <span className="font-medium">{t.title}</span>
              <span className="text-muted"> — {t.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
