import { Check, Globe } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { LOCALE_NAMES, LOCALES } from '@/i18n/locales'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/cn'
import { IconButton } from './IconButton'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, m } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return
      if (e.type === 'pointerdown' && rootRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)

    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <IconButton onClick={() => setOpen((v) => !v)} aria-label={m.ui.language} aria-haspopup="menu" aria-expanded={open}>
        <Globe className="size-3.5" />
      </IconButton>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            aria-label={m.ui.language}
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full right-0 z-20 mt-1 min-w-36 origin-top-right rounded-lg border border-line bg-surface p-1 shadow-lg"
          >
            {LOCALES.map((code) => (
              <li key={code} role="none">
                <button
                  role="menuitemradio"
                  aria-checked={code === locale}
                  lang={code}
                  onClick={() => {
                    setLocale(code)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-[13px] transition hover:bg-elevated',
                    code === locale ? 'text-ink' : 'text-muted',
                  )}
                >
                  {LOCALE_NAMES[code]}
                  {code === locale && <Check className="size-3.5" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
