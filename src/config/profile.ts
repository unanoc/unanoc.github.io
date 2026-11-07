import type { ClockMood, Profile } from '@/types/content'

export const profile: Profile = {
  name: 'Daniel',
  handle: '@lee_daniil',
  city: 'Seoul',
  flag: '🇰🇷',
  timezone: 'Asia/Seoul',
  soloSince: '2026-07-10T02:41:00+09:00',
  building: { name: 'Trexp', url: 'https://trexp.app/?ref=unanoc' },
  bio: 'Сам пишу код, рисую дизайн и выпускаю приложения, которыми пользуюсь каждый день.',
  cta: { label: 'Подписаться', hint: 'Пишу раз в неделю. Без спама.' },
}

export const clockMoods: ClockMood[] = [
  { from: 0, text: 'сплю. или дебажу' },
  { from: 6, text: 'кофе и план на день' },
  { from: 10, text: 'пишу код' },
  { from: 13, text: 'обед, но в голове баги' },
  { from: 15, text: 'пишу код' },
  { from: 19, text: 'полирую пиксели' },
  { from: 22, text: 'последний коммит дня' },
]
