const DAY_MS = 86_400_000

function calendarDate(date: Date, timeZone: string) {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date).split('-').map(Number)

  return Date.UTC(y, m - 1, d)
}

export function soloDayNumber(since: string, timeZone: string, now = new Date()) {
  return Math.round((calendarDate(now, timeZone) - calendarDate(new Date(since), timeZone)) / DAY_MS) + 1
}
