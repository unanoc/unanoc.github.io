import type { Localized } from '@/i18n/locales'

export type ProjectStatus = 'live' | 'building' | 'sold' | 'archived'

export type Project = {
  slug: string
  name: string
  description: Localized
  url: string
  appStoreUrl?: string
  logo: string
  status: ProjectStatus
  since: string
  users?: number
}

export type PublicProjectStats = {
  project: string
  metrics: { users?: number } & Record<string, number | undefined>
  updatedAt: string
}

export type SocialKind = 'x' | 'github' | 'youtube' | 'instagram' | 'telegram'

export type Social = {
  kind: SocialKind
  href: string
  label: string
}

export type Profile = {
  name: string
  handle: string
  country: Localized
  countryCode: string
  timezone: string
  bio: Localized
}

export type Role = {
  title: Localized
  note?: Localized
  since: string
  until?: string
}

export type ClockMood = { from: number; text: Localized }

