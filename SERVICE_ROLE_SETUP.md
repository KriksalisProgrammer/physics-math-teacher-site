# 🚨 ВАЖНО: Добавьте Service Role Key

Для работы инструмента создания профилей нужно добавить Service Role Key в файл `.env.local`:

## 1. Найдите Service Role Key

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в Settings → API
4. Найдите раздел "Project API keys"
5. Скопируйте ключ **service_role** (НЕ anon!)

## 2. Добавьте в .env.local

Откройте файл `.env.local` в корне проекта и добавьте:

```env
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key_здесь
```

## 3. Перезапустите сервер

```bash
# Остановите сервер (Ctrl+C)
# Затем запустите заново:
npm run dev
```

## 4. Используйте инструмент

Откройте: http://localhost:3000/create-profiles.html

## ⚠️ БЕЗОПАСНОСТЬ

Service Role Key имеет полные права администратора!
- НЕ коммитьте его в Git
- НЕ делитесь им с другими
- Используйте только для разработки
- Удалите после исправления проблемы

## Альтернативное решение без Service Role Key

Если не хотите использовать Service Role Key, выполните SQL напрямую в Supabase:

```sql
-- Создать профили для всех пользователей без профилей
INSERT INTO profiles (id, email, role, first_name, last_name, age)
SELECT 
    au.id,
    au.email,
    'student' as role,
    COALESCE(au.raw_user_meta_data->>'first_name', au.user_metadata->>'first_name', '') as first_name,
    COALESCE(au.raw_user_meta_data->>'last_name', au.user_metadata->>'last_name', '') as last_name,
    CASE 
        WHEN au.raw_user_meta_data->>'age' IS NOT NULL AND au.raw_user_meta_data->>'age' != ''
        THEN (au.raw_user_meta_data->>'age')::integer 
        WHEN au.user_metadata->>'age' IS NOT NULL AND au.user_metadata->>'age' != ''
        THEN (au.user_metadata->>'age')::integer
        ELSE NULL 
    END as age
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;
```
