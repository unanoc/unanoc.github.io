import type { ProjectStatus } from '@/types/content'
import type { Locale } from './locales'
import type { PluralForms } from './plural'

export type Messages = {
  meta: { title: string; description: string }
  ui: { toggleTheme: string; wave: string; language: string }
  profile: { since: string }
  tenure: { days: PluralForms; years: PluralForms; months: PluralForms }
  projects: { title: string; status: Record<ProjectStatus, string>; users: string; launched: string; next: string }
  activity: { perYear: PluralForms; perDay: PluralForms; none: string }
  travel: {
    title: string
    countries: PluralForms
    cities: PluralForms
    trips: PluralForms
    daysOnRoad: PluralForms
    days: PluralForms
    daysShort: PluralForms
    hint: string
    allTrips: string
    wholeWorld: string
    citiesLabel: string
    tripsLabel: string
    globe: string
  }
}

const en: Messages = {
  meta: { title: 'Daniel — solo developer', description: 'I dream up and ship apps I use every day.' },
  ui: { toggleTheme: 'Toggle theme', wave: 'Wave', language: 'Language' },
  profile: { since: 'since {date}' },
  tenure: {
    days: { one: '{n} day', other: '{n} days' },
    years: { one: '{n} yr', other: '{n} yrs' },
    months: { one: '{n} mo', other: '{n} mos' },
  },
  projects: {
    title: 'Projects',
    status: { live: 'active', building: 'in progress', sold: 'sold', archived: 'inactive' },
    users: 'users',
    launched: 'launched {date}',
    next: 'next project',
  },
  activity: {
    perYear: { one: '{n} contribution in the last year', other: '{n} contributions in the last year' },
    perDay: { one: '{n} contribution', other: '{n} contributions' },
    none: 'No contributions',
  },
  travel: {
    title: 'Travel',
    countries: { one: '{n} country', other: '{n} countries' },
    cities: { one: '{n} city', other: '{n} cities' },
    trips: { one: '{n} trip', other: '{n} trips' },
    daysOnRoad: { one: '{n} day on the road', other: '{n} days on the road' },
    days: { one: '{n} day', other: '{n} days' },
    daysShort: { other: '{n}d' },
    hint: 'drag the globe · tap a country',
    allTrips: 'All trips',
    wholeWorld: 'whole world',
    citiesLabel: 'Cities',
    tripsLabel: 'Trips',
    globe: 'Globe with visited countries',
  },
}

const ru: Messages = {
  meta: {
    title: 'Daniel — соло-разработчик',
    description: 'Придумываю и выпускаю приложения, которыми сам пользуюсь каждый день.',
  },
  ui: { toggleTheme: 'Сменить тему', wave: 'Помахать', language: 'Язык' },
  profile: { since: 'с {date}' },
  tenure: {
    days: { one: '{n} день', few: '{n} дня', many: '{n} дней', other: '{n} дня' },
    years: { one: '{n} год', few: '{n} года', many: '{n} лет', other: '{n} года' },
    months: { other: '{n} мес' },
  },
  projects: {
    title: 'Проекты',
    status: { live: 'активно', building: 'в работе', sold: 'продан', archived: 'неактивно' },
    users: 'юзеров',
    launched: 'запуск {date}',
    next: 'следующий проект',
  },
  activity: {
    perYear: {
      one: '{n} контрибуция за год',
      few: '{n} контрибуции за год',
      many: '{n} контрибуций за год',
      other: '{n} контрибуции за год',
    },
    perDay: { one: '{n} контрибуция', few: '{n} контрибуции', many: '{n} контрибуций', other: '{n} контрибуции' },
    none: 'Нет контрибуций',
  },
  travel: {
    title: 'Путешествия',
    countries: { one: '{n} страна', few: '{n} страны', many: '{n} стран', other: '{n} страны' },
    cities: { one: '{n} город', few: '{n} города', many: '{n} городов', other: '{n} города' },
    trips: { one: '{n} поездка', few: '{n} поездки', many: '{n} поездок', other: '{n} поездки' },
    daysOnRoad: {
      one: '{n} день в дороге',
      few: '{n} дня в дороге',
      many: '{n} дней в дороге',
      other: '{n} дня в дороге',
    },
    days: { one: '{n} день', few: '{n} дня', many: '{n} дней', other: '{n} дня' },
    daysShort: { other: '{n} дн' },
    hint: 'крути глобус · нажми на страну',
    allTrips: 'Все поездки',
    wholeWorld: 'весь мир',
    citiesLabel: 'Города',
    tripsLabel: 'Поездки',
    globe: 'Глобус с посещёнными странами',
  },
}

const ko: Messages = {
  meta: { title: 'Daniel — 1인 개발자', description: '매일 직접 쓰는 앱을 기획하고 출시합니다.' },
  ui: { toggleTheme: '테마 변경', wave: '손 흔들기', language: '언어' },
  profile: { since: '{date}부터' },
  tenure: {
    days: { other: '{n}일' },
    years: { other: '{n}년' },
    months: { other: '{n}개월' },
  },
  projects: {
    title: '프로젝트',
    status: { live: '운영 중', building: '개발 중', sold: '매각', archived: '중단' },
    users: '사용자',
    launched: '{date} 출시',
    next: '다음 프로젝트',
  },
  activity: {
    perYear: { other: '지난 1년간 {n}회 기여' },
    perDay: { other: '{n}회 기여' },
    none: '기여 없음',
  },
  travel: {
    title: '여행',
    countries: { other: '{n}개국' },
    cities: { other: '도시 {n}곳' },
    trips: { other: '여행 {n}회' },
    daysOnRoad: { other: '여행한 날 {n}일' },
    days: { other: '{n}일' },
    daysShort: { other: '{n}일' },
    hint: '지구본을 돌리고 나라를 눌러보세요',
    allTrips: '전체 여행',
    wholeWorld: '전체 보기',
    citiesLabel: '도시',
    tripsLabel: '여행',
    globe: '방문한 나라가 표시된 지구본',
  },
}

export const MESSAGES: Record<Locale, Messages> = { en, ru, ko }
