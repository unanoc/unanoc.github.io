import { cn } from '@/lib/cn'

export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative flex size-1.5', className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
    </span>
  )
}
