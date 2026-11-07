import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useI18n } from '@/i18n/useI18n'
import { IconButton } from './IconButton'

export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme()
  const { m } = useI18n()

  return (
    <IconButton onClick={toggle} aria-label={m.ui.toggleTheme} className={className}>
      {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </IconButton>
  )
}
