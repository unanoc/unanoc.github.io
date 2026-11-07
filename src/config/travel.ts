import type { City, Trip } from '@/types/travel'

export const cities = {
  seoul: { name: 'Сеул', country: 'KR', lat: 37.5665, lng: 126.978 },
  busan: { name: 'Пусан', country: 'KR', lat: 35.1796, lng: 129.0756 },
  jeju: { name: 'Чеджу', country: 'KR', lat: 33.4996, lng: 126.5312 },
  tokyo: { name: 'Токио', country: 'JP', lat: 35.6762, lng: 139.6503 },
  kyoto: { name: 'Киото', country: 'JP', lat: 35.0116, lng: 135.7681 },
  osaka: { name: 'Осака', country: 'JP', lat: 34.6937, lng: 135.5023 },
  bangkok: { name: 'Бангкок', country: 'TH', lat: 13.7563, lng: 100.5018 },
  chiangmai: { name: 'Чиангмай', country: 'TH', lat: 18.7883, lng: 98.9853 },
  bali: { name: 'Бали', country: 'ID', lat: -8.6705, lng: 115.2126 },
  danang: { name: 'Дананг', country: 'VN', lat: 16.0544, lng: 108.2022 },
  istanbul: { name: 'Стамбул', country: 'TR', lat: 41.0082, lng: 28.9784 },
  tbilisi: { name: 'Тбилиси', country: 'GE', lat: 41.7151, lng: 44.8271 },
  lisbon: { name: 'Лиссабон', country: 'PT', lat: 38.7223, lng: -9.1393 },
  porto: { name: 'Порту', country: 'PT', lat: 41.1579, lng: -8.6291 },
  barcelona: { name: 'Барселона', country: 'ES', lat: 41.3874, lng: 2.1686 },
  dubai: { name: 'Дубай', country: 'AE', lat: 25.2048, lng: 55.2708 },
} satisfies Record<string, City>

export type CityId = keyof typeof cities

export const homeCity: CityId = 'seoul'

export const trips: Trip<CityId>[] = [
  { title: 'Япония осенью', from: '2026-10-02', to: '2026-10-11', cities: ['tokyo', 'kyoto', 'osaka'] },
  { from: '2026-08-14', to: '2026-08-17', cities: ['jeju'] },
  { title: 'Зимовка в Азии', from: '2026-01-10', to: '2026-02-08', cities: ['bangkok', 'chiangmai', 'bali'] },
  { from: '2025-11-20', to: '2025-11-24', cities: ['busan'] },
  { title: 'Токио на неделю', from: '2025-09-05', to: '2025-09-12', cities: ['tokyo'] },
  { from: '2025-06-01', to: '2025-06-09', cities: ['danang'] },
  { title: 'Европа', from: '2025-04-03', to: '2025-04-20', cities: ['istanbul', 'lisbon', 'porto', 'barcelona'] },
  { from: '2024-12-27', to: '2025-01-04', cities: ['dubai'] },
  { from: '2024-10-12', to: '2024-10-19', cities: ['tbilisi'] },
]
