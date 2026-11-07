export const LOCALES = ['en', 'ru', 'ko'] as const

export type Locale = (typeof LOCALES)[number]

export type Localized = Record<Locale, string>

export const DEFAULT_LOCALE: Locale = 'en'

export const INTL_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  ko: 'ko-KR',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
