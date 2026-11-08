import { siGithub, siInstagram, siTelegram, siX, siYoutube } from 'simple-icons'
import type { SocialKind } from '@/types/content'

const PATHS: Record<SocialKind, string> = {
  x: siX.path,
  github: siGithub.path,
  youtube: siYoutube.path,
  instagram: siInstagram.path,
  telegram: siTelegram.path,
}

export function BrandIcon({ kind, className = 'size-3.5' }: { kind: SocialKind; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={PATHS[kind]} />
    </svg>
  )
}
