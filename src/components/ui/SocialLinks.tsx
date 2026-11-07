import { socials } from '@/config'
import { cn } from '@/lib/cn'
import { BrandIcon } from './BrandIcon'

export function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-0.5', className)}>
      {socials.map((s) => (
        <a key={s.kind} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid size-8 place-items-center rounded-md text-faint transition hover:bg-elevated hover:text-ink">
          <BrandIcon kind={s.kind} />
        </a>
      ))}
    </div>
  )
}
