import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { flagUrl } from '@/lib/flags'

export function Flag({ code, className }: { code: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    flagUrl(code).then((url) => alive && setSrc(url))

    return () => {
      alive = false
    }
  }, [code])

  return (
    <span aria-hidden className={cn('inline-block aspect-[3/2] h-[0.85em] shrink-0 overflow-hidden rounded-[2px] bg-elevated align-[-0.1em] ring-1 ring-black/10', className)}>
      {src && <img src={src} alt="" className="block size-full object-cover" />}
    </span>
  )
}
