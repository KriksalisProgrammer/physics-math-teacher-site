# 🔐 Создание администратора Teacher Website

Есть несколько способов создать учетную запись администратора:

## 🚀 Способ 1: Автоматический скрипт (Рекомендуется)

```powershell
cd c:\Web\teacher-website
.\create-admin.ps1
```

Скрипт создаст администратора с данными:
- **Email:** admin@teacherwebsite.com
- **Пароль:** admin123456
- **Роль:** admin

## 🌐 Способ 2: Веб-интерфейс

1. Запустите проект:
   ```bash
   npm run dev
   ```

2. Откройте в браузере:
   ```
   http://localhost:3000/create-admin.html
   ```

3. Заполните форму и нажмите "Создать администратора"

## ⚙️ Способ 3: Через Supabase Dashboard

1. Перейдите в [Supabase Dashboard](https://app.supabase.com)
2. Откройте ваш проект
3. Перейдите в **Authentication > Users**
4. Нажмите **"Add user"**
5. Создайте пользователя с данными:
   - Email: admin@teacherwebsite.com
   - Password: admin123456
   - Confirm: true

6. Перейдите в **Table Editor > profiles**
7. Добавьте запись:
   ```sql
   INSERT INTO profiles (id, email, role, first_name, last_name, bio)
   VALUES (
       'user-id-from-auth',
       'admin@teacherwebsite.com',
       'admin',
       'Админ',
       'Сайта',
       'Администратор сайта Teacher Website'
   );
   ```

## 🔑 Способ 4: SQL запрос

Выполните в SQL Editor в Supabase:

```sql
-- Сначала создайте пользователя через Auth UI, затем:
INSERT INTO profiles (id, email, role, first_name, last_name, bio)
VALUES (
    'your-user-id-here', -- ID из auth.users
    'admin@teacherwebsite.com',
    'admin',
    'Админ',
    'Сайта',
    'Администратор сайта Teacher Website. Управляет контентом, пользователями и всеми аспектами платформы.'
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    first_name = 'Админ',
    last_name = 'Сайта',
    bio = 'Администратор сайта Teacher Website. Управляет контентом, пользователями и всеми аспектами платформы.',
    updated_at = CURRENT_TIMESTAMP;
```

## 🌐 Вход в систему

После создания администратора:

1. Перейдите на: http://localhost:3000/uk/login
2. Введите данные:
   - **Email:** admin@teacherwebsite.com
   - **Пароль:** admin123456
3. После входа перейдите в админ-панель: http://localhost:3000/uk/admin

## 🔧 Устранение неполадок

### Проблема: "User already exists"
- Пользователь уже создан, просто обновите роль в таблице `profiles`

### Проблема: "Permission denied"
- Проверьте, что установлен `SUPABASE_SERVICE_ROLE_KEY` в `.env.local`

### Проблема: "Table 'profiles' doesn't exist"
- Выполните миграции: `npm run db:migrate`
- Или создайте таблицы вручную через схему в `supabase/schema.sql`

## 📝 Примечания

- Пароль по умолчанию `admin123456` - **обязательно смените его** после первого входа
- Роль `admin` дает полные права доступа ко всем функциям
- Для продакшена используйте более сложный пароль
- Можно создать несколько администраторов с разными email

## 🎯 После создания

Администратор сможет:
- ✅ Управлять пользователями
- ✅ Модерировать контент (блог, новости)
- ✅ Управлять заявками на уроки
- ✅ Просматривать аналитику
- ✅ Настраивать систему
