import { INTL_LOCALE, type Locale } from './locales'

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

export function formatPlural(locale: Locale, n: number, forms: PluralForms) {
  const rule = new Intl.PluralRules(INTL_LOCALE[locale]).select(n)

  return (forms[rule] ?? forms.other).replace('{n}', n.toLocaleString(INTL_LOCALE[locale]))
}

export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
