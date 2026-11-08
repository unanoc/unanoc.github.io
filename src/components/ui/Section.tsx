import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionProps = {
  title: ReactNode
  meta?: ReactNode
  wrapMeta?: boolean
  children: ReactNode
  className?: string
}

export function Section({ title, meta, wrapMeta, children, className }: SectionProps) {
  return (
    <section className={className}>
      <div className={cn('mb-4 flex items-baseline justify-between text-sm', wrapMeta && 'flex-wrap gap-x-6 gap-y-1')}>
        <h2 className="font-medium">{title}</h2>
        {meta && <span className="text-faint">{meta}</span>}
      </div>
      {children}
    </section>
  )
}
