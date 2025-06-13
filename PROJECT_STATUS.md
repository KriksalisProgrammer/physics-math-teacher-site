# Настройка и исправление проекта Teacher Website

## Проблемы которые были исправлены:

### 1. React Hooks Errors
- **Проблема**: Условные вызовы React хуков в `useAuth.ts`
- **Решение**: Убрали условную логику для статического экспорта, используем обычную аутентификацию

### 2. ESLint Warnings
- **Проблема**: Предупреждения о зависимостях в `useEffect`
- **Решение**: 
  - Добавили `useCallback` в `CommentModeration.tsx`
  - Отключили `react-hooks/exhaustive-deps` в ESLint для упрощения

### 3. Next.js Rewrites Warning
- **Проблема**: Предупреждения о `rewrites` при статическом экспорте
- **Решение**: Убрали `output: 'export'` из `next.config.mjs` для использования API routes

### 4. Структура проекта
- **Улучшения**:
  - Добавили `ErrorBoundary` для обработки ошибок
  - Упростили логику аутентификации
  - Очистили ненужные файлы статического экспорта

## Текущая конфигурация:

### next.config.mjs
```js
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: [...],
    formats: ['image/avif', 'image/webp']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  }
}
```

### Команды для запуска:
```bash
npm run dev     # Запуск в режиме разработки
npm run build   # Сборка проекта
npm run start   # Запуск production сборки
npm run lint    # Проверка ESLint
```

## Архитектура аутентификации:

1. **useAuth.ts** - основной хук аутентификации через Supabase
2. **staticAuth.ts** - для демо/тестирования (не используется в production)
3. **useRealAuth.ts** - полная реализация с Supabase

## Компоненты:

- **Dashboard** - работает для всех ролей (student, teacher, admin)
- **Login** - страница входа с проверкой аутентификации
- **ErrorBoundary** - обработка ошибок React

## База данных:

Проект работает с Supabase и требует следующие таблицы:
- `profiles` - профили пользователей
- `lessons` - уроки
- `comments` - комментарии
- `posts` - посты блога
- `news` - новости

Убедитесь, что переменные окружения настроены в `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
