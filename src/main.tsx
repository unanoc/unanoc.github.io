import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@/styles/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { I18nProvider } from '@/i18n/I18nProvider'
import { resolveInitialLocale } from '@/i18n/detect'
import { initAnalytics } from '@/lib/analytics'

void initAnalytics()

void resolveInitialLocale().then((locale) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <I18nProvider initialLocale={locale}>
        <App />
      </I18nProvider>
    </StrictMode>,
  )
})
