import type { Messages } from '@/i18n/messages'
import type { Locale } from '@/i18n/locales'
import { dateFormat } from '@/i18n/intl'
import { formatPlural } from '@/i18n/plural'

const DAY_MS = 86_400_000
const MONTHS_IN_YEAR = 12

type CalendarDay = { y: number; m: number; d: number }

function calendarDay(date: Date, timeZone: string): CalendarDay {
  const [y, m, d] = dateFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(date)
    .split('-')
    .map(Number)

  return { y, m, d }
}

function dayNumber(from: CalendarDay, to: CalendarDay) {
  return Math.round((Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / DAY_MS) + 1
}

function wholeMonths(from: CalendarDay, to: CalendarDay) {
  return (to.y - from.y) * MONTHS_IN_YEAR + (to.m - from.m) - (to.d < from.d ? 1 : 0)
}

export function formatTenure(since: string, timeZone: string, locale: Locale, words: Messages['tenure'], now = new Date()) {
  const from = calendarDay(new Date(since), timeZone)
  const to = calendarDay(now, timeZone)
  const months = wholeMonths(from, to)
  if (months < MONTHS_IN_YEAR) return formatPlural(locale, dayNumber(from, to), words.days)

  const years = formatPlural(locale, Math.floor(months / MONTHS_IN_YEAR), words.years)
  const rest = months % MONTHS_IN_YEAR

  return rest > 0 ? `${years} ${formatPlural(locale, rest, words.months)}` : years
}
