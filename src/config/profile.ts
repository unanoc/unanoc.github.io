import type { ClockMood, Profile, Role } from '@/types/content'

export const profile: Profile = {
  name: 'Daniel',
  handle: '@lee_daniil',
  city: 'Seoul',
  country: 'South Korea',
  flag: '🇰🇷',
  timezone: 'Asia/Seoul',
  bio: 'Придумываю и выпускаю приложения, которыми сам пользуюсь каждый день.',
  cta: { label: 'Подписаться', hint: 'Пишу раз в неделю. Без спама.' },
}

export const roles: Role[] = [
  { title: 'Senior Software Engineer', since: '2019-05-14T09:00:00+09:00' },
  { title: 'Соло-разработчик', since: '2026-07-10T02:41:00+09:00' },
]

export const clockMoods: ClockMood[] = [
  { from: 0, text: 'ночной деплой, пока все спят' },
  { from: 6, text: 'кофе и чистый git status' },
  { from: 10, text: 'в потоке, собираю новую фичу' },
  { from: 13, text: 'обед, но в голове баги' },
  { from: 15, text: 'двигаю пиксели на 1pt' },
  { from: 19, text: 'читаю отзывы в App Store' },
  { from: 22, text: 'ещё один коммит и спать' },
]
