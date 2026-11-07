import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@/styles/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { initAnalytics } from '@/lib/analytics'

void initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
