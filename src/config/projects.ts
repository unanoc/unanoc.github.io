import trexpLogo from '@/assets/images/projects/trexp.webp'
import type { Project } from '@/types/content'

export const projects: Project[] = [
  {
    slug: 'trexp',
    name: 'Trexp',
    description: {
      en: 'All your money under control: accounts, crypto, investments, income, expenses and recurring payments — with beautiful stats.',
      ru: 'Все деньги под контролем: счета, крипта, инвестиции, доходы, расходы и регулярные платежи — с красивой статистикой.',
      ko: '모든 돈을 한눈에: 계좌, 크립토, 투자, 수입과 지출, 정기 결제까지 — 보기 좋은 통계와 함께.',
    },
    url: 'https://trexp.app/?ref=unanoc',
    appStoreUrl: 'https://trexp.app/u',
    logo: trexpLogo,
    status: 'live',
    since: '2026-07-10',
    users: 554,
  },
]
