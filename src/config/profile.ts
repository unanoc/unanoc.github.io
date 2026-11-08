import type { ClockMood, Profile, Role } from '@/types/content'

export const profile: Profile = {
  name: 'Daniel',
  handle: '@lee_daniil',
  country: { en: 'South Korea', ru: 'South Korea', ko: '대한민국' },
  countryCode: 'KR',
  timezone: 'Asia/Seoul',
  bio: {
    en: 'I dream up and ship apps I use every day.',
    ru: 'Придумываю и выпускаю приложения, которыми сам пользуюсь каждый день.',
    ko: '매일 직접 쓰는 앱을 기획하고 출시합니다.',
  },
}

export const roles: Role[] = [
  {
    title: { en: 'Senior Software Engineer', ru: 'Senior Software Engineer', ko: 'Senior Software Engineer' },
    since: '2019-05-14T09:00:00+09:00',
  },
  {
    title: { en: 'Solo developer', ru: 'Соло-разработчик', ko: '1인 개발자' },
    since: '2026-07-10T02:41:00+09:00',
  },
]

export const clockMoods: ClockMood[] = [
  { from: 0, text: { en: 'night deploy while everyone sleeps', ru: 'ночной деплой, пока все спят', ko: '모두가 잠든 사이 야간 배포' } },
  { from: 6, text: { en: 'coffee and a clean git status', ru: 'кофе и чистый git status', ko: '커피 한 잔과 깨끗한 git status' } },
  { from: 10, text: { en: 'in the flow, building a new feature', ru: 'в потоке, собираю новую фичу', ko: '몰입해서 새 기능 만드는 중' } },
  { from: 13, text: { en: 'lunch, but bugs on my mind', ru: 'обед, но в голове баги', ko: '점심시간, 머릿속엔 버그' } },
  { from: 15, text: { en: 'nudging pixels by 1pt', ru: 'двигаю пиксели на 1pt', ko: '픽셀을 1pt씩 옮기는 중' } },
  { from: 19, text: { en: 'reading App Store reviews', ru: 'читаю отзывы в App Store', ko: 'App Store 리뷰 읽는 중' } },
  { from: 22, text: { en: 'one more commit, then bed', ru: 'ещё один коммит и спать', ko: '커밋 하나만 더 하고 잘게요' } },
]
