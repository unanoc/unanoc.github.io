import { siAppstore } from 'simple-icons'

export function AppStoreButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg bg-ink px-2.5 text-xs font-semibold text-bg transition hover:-translate-y-px hover:shadow-md active:translate-y-0"
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
        <path d={siAppstore.path} />
      </svg>
      App Store
    </a>
  )
}
