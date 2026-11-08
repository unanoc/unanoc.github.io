const cache = new Map<string, unknown>()

function memo<T>(key: string, create: () => T): T {
  if (!cache.has(key)) cache.set(key, create())

  return cache.get(key) as T
}

export function dateFormat(locale: string, options: Intl.DateTimeFormatOptions) {
  return memo(`date|${locale}|${JSON.stringify(options)}`, () => new Intl.DateTimeFormat(locale, options))
}

export function pluralRules(locale: string) {
  return memo(`plural|${locale}`, () => new Intl.PluralRules(locale))
}

export function numberFormat(locale: string) {
  return memo(`number|${locale}`, () => new Intl.NumberFormat(locale))
}

export function regionNames(locale: string) {
  return memo(`region|${locale}`, () => new Intl.DisplayNames(locale, { type: 'region' }))
}

export function stripYearSuffix(text: string) {
  return text.replace(' г.', '')
}
