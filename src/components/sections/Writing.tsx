import { writing, writingIndexUrl } from '@/config'
import { Section } from '@/components/ui/Section'

const dateFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

export function Writing() {
  return (
    <Section title="Тексты" meta={<a href={writingIndexUrl} className="hover:text-ink">все →</a>}>
      <ul>
        {writing.map((w) => (
          <li key={w.title}>
            <a href={w.href} className="-mx-2 flex items-baseline gap-4 rounded-lg px-2 py-1.5 text-sm transition hover:bg-elevated">
              <span className="w-14 shrink-0 text-xs text-faint tabular-nums">{dateFmt.format(new Date(w.date))}</span>
              <span className="flex-1 truncate">{w.title}</span>
              {w.reads && <span className="hidden text-xs text-faint tabular-nums sm:inline">{w.reads}</span>}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
