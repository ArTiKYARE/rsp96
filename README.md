# ООО «РемСтройПроект» — новый сайт

Современный сайт компании РСП, переписанный с WordPress на **Next.js 15 + React + TypeScript + Tailwind CSS + shadcn/ui**.

## Стек

- **Next.js 15** (App Router, SSG)
- **React 19 + TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** (base-ui)
- **Framer Motion** — анимации
- **next-themes** — тёмная/светлая тема
- **React Hook Form + Zod** — валидация форм

## Страницы

- Главная (`/`)
- О компании (`/about-us/`)
- Услуги (`/services/`)
- Карточки услуг (`/services/zimnik/`, `/services/people/`, `/services/inert/`, `/services/loading/`)
- Портфолио (`/history/`)
- Вакансии (`/vacancies/`)
- Документы (`/docs/`)
- Контакты (`/contacts/`)
- Политика конфиденциальности (`/privacy-policy/`)
- Согласие на обработку данных (`/consent/`)
- Использование cookie (`/cookie/`)

## Запуск

```bash
# Установка зависимостей
npm install

# Режим разработки
npm run dev

# Сборка production
npm run build

# Просмотр production-сборки
npx serve dist
```

## Структура

- `app/` — страницы Next.js
- `components/ui/` — компоненты shadcn/ui
- `components/sections/` — секции страниц
- `components/layout/` — Header, Footer, CookieBanner
- `lib/data.ts` — контент сайта
- `public/images/` — изображения

## Контакты

- Телефон: +7 343 304-05-06
- Email: rsp@rsp96.ru
