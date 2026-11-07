import { createContext } from 'react'
import type { Locale, Localized } from './locales'
import type { Messages } from './messages'
import type { fill, PluralForms } from './plural'

export type I18n = {
  locale: Locale
  intl: string
  m: Messages
  setLocale: (locale: Locale) => void
  pick: (value: Localized) => string
  plural: (n: number, forms: PluralForms) => string
  fill: typeof fill
}

export const I18nContext = createContext<I18n | null>(null)
