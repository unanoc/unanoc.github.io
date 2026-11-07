import type { City, Trip } from '@/types/travel'

export const cities = {
  jeju: { name: { en: 'Jeju', ru: 'Чеджу', ko: '제주' }, country: 'KR', lat: 33.4996, lng: 126.5312 },
  incheon: { name: { en: 'Incheon', ru: 'Инчхон', ko: '인천' }, country: 'KR', lat: 37.4563, lng: 126.7052 },
  yongin: { name: { en: 'Yongin', ru: 'Ёнъин', ko: '용인' }, country: 'KR', lat: 37.2411, lng: 127.1776 },
  fukuoka: { name: { en: 'Fukuoka', ru: 'Фукуока', ko: '후쿠오카' }, country: 'JP', lat: 33.5902, lng: 130.4017 },
  kitakyushu: { name: { en: 'Kitakyushu', ru: 'Китакюсю', ko: '기타큐슈' }, country: 'JP', lat: 33.8834, lng: 130.8752 },
  hiroshima: { name: { en: 'Hiroshima', ru: 'Хиросима', ko: '히로시마' }, country: 'JP', lat: 34.3853, lng: 132.4553 },
  miyajima: { name: { en: 'Miyajima', ru: 'Миядзима', ko: '미야지마' }, country: 'JP', lat: 34.2959, lng: 132.3199 },
  osaka: { name: { en: 'Osaka', ru: 'Осака', ko: '오사카' }, country: 'JP', lat: 34.6937, lng: 135.5023 },
  kyoto: { name: { en: 'Kyoto', ru: 'Киото', ko: '교토' }, country: 'JP', lat: 35.0116, lng: 135.7681 },
  tokyo: { name: { en: 'Tokyo', ru: 'Токио', ko: '도쿄' }, country: 'JP', lat: 35.6762, lng: 139.6503 },
  fujiyoshida: { name: { en: 'Fujiyoshida', ru: 'Фудзиёсида', ko: '후지요시다' }, country: 'JP', lat: 35.4876, lng: 138.8077 },
  kawaguchiko: { name: { en: 'Kawaguchiko', ru: 'Кавагутико', ko: '가와구치코' }, country: 'JP', lat: 35.5171, lng: 138.7516 },
  bangkok: { name: { en: 'Bangkok', ru: 'Бангкок', ko: '방콕' }, country: 'TH', lat: 13.7563, lng: 100.5018 },
  phuquoc: { name: { en: 'Phu Quoc', ru: 'Фукуок', ko: '푸꾸옥' }, country: 'VN', lat: 10.2899, lng: 103.984 },
  cebu: { name: { en: 'Cebu', ru: 'Себу', ko: '세부' }, country: 'PH', lat: 10.3157, lng: 123.8854 },
  bohol: { name: { en: 'Bohol', ru: 'Бохол', ko: '보홀' }, country: 'PH', lat: 9.6417, lng: 123.8545 },
  singapore: { name: { en: 'Singapore', ru: 'Сингапур', ko: '싱가포르' }, country: 'SG', lat: 1.3521, lng: 103.8198 },
} satisfies Record<string, City>

export type CityId = keyof typeof cities

export const trips: Trip<CityId>[] = [
  { from: '2026-09-25', to: '2026-09-30', cities: ['osaka', 'kyoto', 'tokyo'] },
  { from: '2026-07-29', to: '2026-08-05', cities: ['bangkok'] },
  { from: '2026-07-20', to: '2026-07-28', cities: ['singapore'] },
  { from: '2026-07-13', to: '2026-07-17', cities: ['jeju'] },
  { from: '2026-03-28', to: '2026-04-08', cities: ['phuquoc'] },
  { from: '2026-03-09', to: '2026-03-15', cities: ['incheon'] },
  { from: '2025-10-05', to: '2025-10-16', cities: ['bangkok'] },
  { from: '2025-07-17', to: '2025-07-21', cities: ['singapore'] },
  { from: '2025-04-14', to: '2025-04-20', cities: ['tokyo'] },
  { from: '2025-01-02', to: '2025-01-08', cities: ['cebu', 'bohol'] },
  { from: '2024-12-01', to: '2024-12-11', cities: ['phuquoc'] },
  { from: '2024-08-25', to: '2024-08-31', cities: ['bangkok'] },
  { from: '2024-08-06', to: '2024-08-08', cities: ['yongin'] },
  {
    from: '2024-04-16',
    to: '2024-05-01',
    cities: ['fukuoka', 'kitakyushu', 'hiroshima', 'miyajima', 'kyoto', 'osaka', 'tokyo', 'fujiyoshida', 'kawaguchiko'],
  },
  { from: '2024-03-23', to: '2024-03-27', cities: ['jeju'] },
]
