# 🚀 ПРОСТОЕ СОЗДАНИЕ АДМИНИСТРАТОРА

## Способ 1: Через SQL (РЕКОМЕНДУЕТСЯ)

1. Откройте **Supabase Dashboard**
2. Перейдите в **SQL Editor**
3. Скопируйте и выполните весь файл `super-simple-reset.sql`
4. После выполнения войдите с данными:
   - **Email:** `admin@test.com`
   - **Password:** `password123`

## Способ 2: Через Supabase Dashboard

1. Откройте **Supabase Dashboard**
2. **Authentication** → **Users** → **"Add user"**
3. Создайте пользователя:
   - Email: `admin@test.com`
   - Password: `password123`
   - ✅ Auto Confirm User
4. Скопируйте UUID пользователя
5. В **SQL Editor** выполните:
```sql
INSERT INTO profiles (id, email, role) 
VALUES ('ВСТАВЬТЕ_UUID', 'admin@test.com', 'admin');
```

## Способ 3: Через Node.js

1. Найдите в **Supabase Dashboard** → **Settings** → **API**:
   - `URL` (скопируйте)
   - `service_role key` (скопируйте)

2. Отредактируйте файл `create-admin-new.js`:
   - Замените `supabaseUrl` на ваш URL
   - Замените `supabaseServiceKey` на ваш service_role key

3. Выполните:
```bash
cd c:\Web\teacher-website
npm install @supabase/supabase-js
node create-admin-new.js
```

## Данные для входа:
- **Email:** `admin@test.com`
- **Password:** `password123`

## Проверка:
После создания администратора перейдите на:
- http://localhost:3000/uk/login
- Войдите с указанными данными
- Должна открыться админ-панель
