import { numberFormat, pluralRules } from './intl'
import { INTL_LOCALE, type Locale } from './locales'

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

export function formatPlural(locale: Locale, n: number, forms: PluralForms) {
  const intl = INTL_LOCALE[locale]
  const template = forms[pluralRules(intl).select(n)] ?? forms.other

  return template.replace('{n}', numberFormat(intl).format(n))
}

export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
