import type { ReactNode } from 'react'

type SectionProps = {
  title: ReactNode
  meta?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ title, meta, children, className }: SectionProps) {
  return (
    <section className={className}>
      <div className="mb-4 flex items-baseline justify-between text-sm">
        <h2 className="font-medium">{title}</h2>
        {meta && <span className="text-faint">{meta}</span>}
      </div>
      {children}
    </section>
  )
}
