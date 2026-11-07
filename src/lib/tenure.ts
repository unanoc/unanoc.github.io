import { plural } from '@/lib/travel'

const DAY_MS = 86_400_000
const MONTHS_IN_YEAR = 12

type CalendarDay = { y: number; m: number; d: number }

function calendarDay(date: Date, timeZone: string): CalendarDay {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
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

export function formatTenure(since: string, timeZone: string, now = new Date()) {
  const from = calendarDay(new Date(since), timeZone)
  const to = calendarDay(now, timeZone)
  const months = wholeMonths(from, to)
  if (months < MONTHS_IN_YEAR) return plural(dayNumber(from, to), 'день', 'дня', 'дней')

  const years = Math.floor(months / MONTHS_IN_YEAR)
  const rest = months % MONTHS_IN_YEAR
  const yearsText = plural(years, 'год', 'года', 'лет')

  return rest > 0 ? `${yearsText} ${rest} мес` : yearsText
}
