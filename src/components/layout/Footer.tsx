import { profile } from '@/config'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-line pt-6 text-xs text-faint">
      <span>
        © {YEAR} {profile.name}
      </span>
      <span>Сделано вручную в Сеуле</span>
    </footer>
  )
}
