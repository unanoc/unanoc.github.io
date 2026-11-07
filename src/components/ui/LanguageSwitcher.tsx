import { useI18n } from '@/i18n/useI18n'
import { LOCALES } from '@/i18n/locales'
import { cn } from '@/lib/cn'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, m } = useI18n()

  return (
    <div role="group" aria-label={m.ui.language} className={cn('flex items-center rounded-md text-[11px] font-medium', className)}>
      {LOCALES.map((code) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          aria-pressed={code === locale}
          lang={code}
          className={cn(
            'rounded px-1.5 py-1 tracking-wide uppercase transition',
            code === locale ? 'text-ink' : 'text-faint hover:text-muted',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
