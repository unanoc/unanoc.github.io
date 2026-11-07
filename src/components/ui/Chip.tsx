import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const BASE = 'inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-muted'

export function Chip({ children, href }: { children: ReactNode; href?: string }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cn(BASE, 'transition hover:border-ink/25 hover:text-ink')}>
        {children}
      </a>
    )
  }

  return <span className={BASE}>{children}</span>
}
