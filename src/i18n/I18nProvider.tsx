import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { saveChoice } from './detect'
import { I18nContext, type I18n } from './i18n-context'
import { INTL_LOCALE, type Locale } from './locales'
import { MESSAGES } from './messages'
import { fill, formatPlural } from './plural'

export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = MESSAGES[locale].meta.title
  }, [locale])

  const value = useMemo<I18n>(
    () => ({
      locale,
      intl: INTL_LOCALE[locale],
      m: MESSAGES[locale],
      setLocale: (next) => {
        saveChoice(next)
        setLocaleState(next)
      },
      pick: (localized) => localized[locale],
      plural: (n, forms) => formatPlural(locale, n, forms),
      fill,
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
