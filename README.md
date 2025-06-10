# 🎓 Physics & Mathematics Teacher Website

Современный многоязычный (украинский/английский) адаптивный сайт для преподавания физики и математики с красивым дизайном и интерактивными возможностями.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## ✨ Особенности

### 🎨 Современный дизайн
- **Градиентные фоны** и плавные анимации
- **Mobile-first** адаптивный подход
- **Glassmorphism** эффекты
- **Интерактивные карточки** с hover-эффектами
- **Фиксированная навигация** с backdrop blur

### 🌍 Мультиязычность
- Поддержка украинского и английского языков
- Переключатель языков в навигации
- Локализованный контент для всех страниц
- RTL support готовность

### 🔐 Аутентификация и роли
- Supabase Auth интеграция
- Роли пользователей: студент/учитель/админ
- Защищенные маршруты
- Персональные профили

### 📚 Основной функционал
- **Блог** с комментариями и рейтингами
- **Новости** с приоритизацией
- **Уроки** с Google Meet/Zoom интеграцией
- **Админ-панель** для управления контентом
- **Dashboard** для студентов и учителей

## 🛠️ Технологии

### Frontend
- **Next.js 14** - React фреймворк с App Router
- **React 18** - Библиотека для UI
- **TypeScript** - Типизация
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Анимации

### Backend
- **Supabase** - База данных и аутентификация
- **PostgreSQL** - Реляционная база данных
- **Row Level Security (RLS)** - Безопасность данных

### Деплой
- **Vercel** - Хостинг и CI/CD
- **GitHub** - Контроль версий

## Project Structure

The project is organized as follows:

```
teacher-website
├── .env.local.example         # Template for environment variables
├── .eslintrc.json             # ESLint configuration
├── .gitignore                  # Git ignore file
├── .prettierrc                # Prettier configuration
├── next.config.js             # Next.js configuration
├── package.json                # NPM configuration
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── middleware.ts              # Middleware functions
├── public                     # Public assets
│   ├── locales                # Localization files
│   ├── favicon.ico            # Favicon
├── src                        # Source code
│   ├── app                    # Application routes and components
│   ├── components             # Reusable components
│   ├── hooks                  # Custom hooks
│   ├── lib                    # Utility functions
│   ├── types                  # TypeScript types
│   └── utils                  # Utility functions
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/teacher-website.git
   cd teacher-website
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file based on `.env.local.example`
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_JITSI_DOMAIN=your_jitsi_domain_here
   NEXT_PUBLIC_JITSI_ROOM_NAME=your_jitsi_room_name_here
   NEXT_PUBLIC_JITSI_API_KEY=your_jitsi_api_key_here
   NEXT_PUBLIC_JITSI_API_SECRET=your_jitsi_api_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_DEFAULT_LANGUAGE=uk
   NEXT_PUBLIC_SUPPORTED_LANGUAGES=uk,en
   ```

4. Initialize Supabase with the schema
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in the SQL editor

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app/[locale]/*` - App Router routes with locale parameter
- `src/components/*` - React components
  - `admin/*` - Admin panel components
  - `blog/*` - Blog-related components
  - `common/*` - Shared components like Header, Footer
  - `jitsi/*` - Video conferencing components
  - `ui/*` - UI components (Button, Card, etc.)
- `src/hooks/*` - Custom React hooks
- `src/lib/*` - Utility libraries
- `src/types/*` - TypeScript type definitions
- `src/utils/*` - Helper functions
- `public/locales/*` - Translation dictionaries

## Multilingual Support

The website supports Ukrainian (uk) and English (en) languages. The language is determined by the URL path (e.g., `/uk/blog` or `/en/blog`).

To add content in both languages:
1. Use the admin panel to create posts, news, or lessons
2. Fill in both Ukrainian and English fields
3. Content will automatically be displayed in the user's selected language

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

## 🔒 Security

**Important:** Never commit your `.env.local` file to version control. It contains sensitive API keys and credentials.

- The `.env.local.example` file shows the required environment variables structure
- Always use environment variables for sensitive data
- In production, set environment variables through your hosting platform (Vercel, etc.)
- Review and rotate API keys regularly

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Jitsi Meet](https://jitsi.org/jitsi-meet/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)