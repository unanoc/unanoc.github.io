import { useState, type FormEvent } from 'react'
import { profile } from '@/config'
import { cn } from '@/lib/cn'

export function Subscribe({ className }: { className?: string }) {
  const [done, setDone] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setDone(true)
  }

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@email.com"
          aria-label="Email"
          className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm outline-none placeholder:text-faint focus:border-ink/30"
        />
        <button type="submit" className={cn('h-9 rounded-lg px-4 text-sm font-medium transition active:scale-[0.98]', done ? 'bg-elevated text-muted' : 'bg-ink text-bg hover:opacity-85')}>
          {done ? 'Готово ✓' : profile.cta.label}
        </button>
      </form>
      <p className="mt-2 text-xs text-faint">{profile.cta.hint}</p>
    </div>
  )
}
