import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { IconButton } from './IconButton'

export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme()

  return (
    <IconButton onClick={toggle} aria-label="Сменить тему" className={className}>
      {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </IconButton>
  )
}
