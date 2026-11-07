import trexpLogo from '@/assets/images/projects/trexp.webp'
import type { Project } from '@/types/content'

export const projects: Project[] = [
  {
    slug: 'trexp',
    name: 'Trexp',
    description: 'Все деньги под контролем: счета, крипта, инвестиции, доходы, расходы и регулярные платежи — с красивой статистикой.',
    url: 'https://trexp.app/?ref=unanoc',
    appStoreUrl: 'https://trexp.app/u',
    logo: trexpLogo,
    status: 'live',
    since: '2026-07-10',
    users: 554,
  },
]
