import { countryLocales } from '@/config/i18n'
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales'

const CHOICE_KEY = 'lang'
const AUTO_KEY = 'lang-auto'
const TRACE_URL = '/cdn-cgi/trace'
const TRACE_TIMEOUT_MS = 1200
const COUNTRY_LINE = /^loc=([A-Z]{2})$/m

function read(key: string): Locale | null {
  try {
    const value = localStorage.getItem(key)

    return isLocale(value) ? value : null
  } catch {
    return null
  }
}

function write(key: string, locale: Locale) {
  try {
    localStorage.setItem(key, locale)
  } catch {
    return
  }
}

async function detectCountry(): Promise<string | null> {
  try {
    const res = await fetch(TRACE_URL, { signal: AbortSignal.timeout(TRACE_TIMEOUT_MS), cache: 'no-store' })
    if (!res.ok) return null

    return COUNTRY_LINE.exec(await res.text())?.[1] ?? null
  } catch {
    return null
  }
}

async function detectLocale(): Promise<Locale | null> {
  const country = await detectCountry()
  if (!country) return null
  const locale = countryLocales[country] ?? DEFAULT_LOCALE
  write(AUTO_KEY, locale)

  return locale
}

export function saveChoice(locale: Locale) {
  write(CHOICE_KEY, locale)
}

export async function resolveInitialLocale(): Promise<Locale> {
  const choice = read(CHOICE_KEY)
  if (choice) return choice

  const cached = read(AUTO_KEY)
  if (cached) {
    void detectLocale()

    return cached
  }

  return (await detectLocale()) ?? DEFAULT_LOCALE
}
