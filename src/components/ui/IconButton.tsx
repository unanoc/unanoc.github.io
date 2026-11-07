import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function IconButton({ className, ...rest }: ComponentProps<'button'>) {
  return <button className={cn('grid size-8 place-items-center rounded-md text-faint transition hover:bg-elevated hover:text-ink', className)} {...rest} />
}
