import type { PostHog } from 'posthog-js'
import { analytics } from '@/config'

export const SITE_EVENTS = {
  linkClicked: 'site_link_clicked',
} as const

function isProductionHost() {
  return analytics.productionHosts.includes(location.hostname)
}

function trackOutboundClicks(posthog: PostHog) {
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href]')
      if (!(link instanceof HTMLAnchorElement)) return
      const url = new URL(link.href, location.href)
      if (url.host === location.host || !url.protocol.startsWith('http')) return
      posthog.capture(
        SITE_EVENTS.linkClicked,
        {
          destination: url.host,
          href: url.href,
          campaign: url.searchParams.get('ref') ?? url.searchParams.get('ct') ?? undefined,
          label: link.getAttribute('aria-label') ?? link.textContent?.trim().slice(0, 60),
        },
        { transport: 'sendBeacon' },
      )
    },
    { capture: true },
  )
}

export async function initAnalytics() {
  if (!isProductionHost()) return
  const { default: posthog } = await import('posthog-js')
  posthog.init(analytics.posthogKey, {
    api_host: analytics.posthogHost,
    defaults: '2026-08-30',
    person_profiles: 'never',
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
  })
  posthog.register({ site: analytics.site })
  trackOutboundClicks(posthog)
}
