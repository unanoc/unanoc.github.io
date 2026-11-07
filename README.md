# unanoc.github.io

Личный сайт https://unanoc.github.io: одна страница, React 19 + Vite + Tailwind v4 + motion.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + сборка в dist/
npm run lint
```

## Где что менять

Весь контент — в `src/config/`, по файлу на тему:

| Файл | Что внутри |
|------|------------|
| `profile.ts` | имя, ник, био, город, часовой пояс, дата старта соло, что строю, фразы для часов |
| `socials.ts` | ссылки на соцсети |
| `stats.ts` | цифры под шапкой |
| `projects.ts` | проекты и их статусы |
| `writing.ts` | посты / рассылка |
| `timeline.ts` | вехи пути |
| `places.ts` | города |

Типы для всего этого — `src/types/content.ts`.

## Структура

```
media/originals/        исходники фото (не в сборке)
public/                 фавиконки, og-картинка — отдаются как есть
src/
  assets/images/        картинки, импортируемые в код
  config/               контент сайта
  types/                типы контента
  components/
    layout/             Header, Footer
    sections/           секции страницы
    ui/                 мелкие переиспользуемые компоненты
  hooks/                useNow, useTheme
  lib/                  утилиты (cn, solo-duration, …)
  styles/globals.css    тема, цвета, шрифты
  App.tsx               порядок секций
  main.tsx              точка входа
```

## Деплой

Пуш в `main` → GitHub Actions (`.github/workflows/deploy.yml`) собирает сайт и выкладывает `dist/` на GitHub Pages.
В настройках репозитория: Settings → Pages → Source = **GitHub Actions**.

Данные с бэкенда — `cmd/api` из workshop, адрес в `src/config/site-api.ts`:
статистика всех проектов `GET /v1/projects/stats`, GitHub-активность `GET /v1/github/activity`.
