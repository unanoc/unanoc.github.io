export type ProjectStatus = 'live' | 'building' | 'sold' | 'archived'

export type Project = {
  slug: string
  name: string
  description: string
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

export type SocialKind = 'x' | 'github' | 'youtube' | 'instagram' | 'telegram' | 'email'

export type Social = {
  kind: SocialKind
  href: string
  label: string
}

export type Profile = {
  name: string
  handle: string
  city: string
  country: string
  flag: string
  timezone: string
  soloSince: string
  bio: string
  cta: { label: string; hint: string }
}

export type ClockMood = { from: number; text: string }

export type TimelineEntry = { date: string; title: string; text: string }

export type Post = { title: string; date: string; href: string; reads?: string }

