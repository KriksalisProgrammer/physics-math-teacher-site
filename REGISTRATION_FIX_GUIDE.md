# 🔧 Исправление проблемы с регистрацией профилей

## Проблема
После обновления формы регистрации профили пользователей не создаются автоматически.

## Причины
1. Функция триггера `handle_new_user` не обрабатывает новые поля (возраст)
2. Возможные проблемы с RLS политиками
3. Несоответствие в формате метаданных пользователя

## Решение

### 1. Обновите функцию триггера в Supabase SQL Editor

Выполните обновленный скрипт `fix-auth.sql`:

```sql
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Only admins can create profiles" ON profiles;

-- Create a new policy that allows profile creation during auth
CREATE POLICY "Profiles can be created by auth trigger or admins" 
    ON profiles FOR INSERT 
    WITH CHECK (
        auth.uid() = id 
        OR 
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Обновленная функция с поддержкой возраста и обработкой ошибок
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name, age)
  VALUES (
    NEW.id,
    NEW.email,
    'student',
    COALESCE(
      NEW.raw_user_meta_data->>'first_name', 
      NEW.raw_user_meta_data->>'firstName',
      NEW.user_metadata->>'first_name',
      NEW.user_metadata->>'firstName',
      ''
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'last_name', 
      NEW.raw_user_meta_data->>'lastName',
      NEW.user_metadata->>'last_name',
      NEW.user_metadata->>'lastName',
      ''
    ),
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL AND NEW.raw_user_meta_data->>'age' != ''
      THEN (NEW.raw_user_meta_data->>'age')::integer 
      WHEN NEW.user_metadata->>'age' IS NOT NULL AND NEW.user_metadata->>'age' != ''
      THEN (NEW.user_metadata->>'age')::integer
      ELSE NULL 
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пересоздать триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Добавьте поле возраста в таблицу profiles (если еще не добавлено)

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 5 AND age <= 100);
```

### 3. Проверьте регистрацию

1. Зарегистрируйте нового пользователя через форму: http://localhost:3000/uk/signup
2. Проверьте создание профиля: http://localhost:3000/check-profiles.html
3. Введите email нового пользователя и нажмите "Проверить профиль"

### 4. Создайте бакет для аватаров в Supabase Storage

1. Перейдите в Supabase Dashboard → Storage
2. Создайте новый бакет с именем `avatars`
3. Сделайте его публичным
4. Или выполните SQL:

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
```

### 5. Добавьте политики для Storage

```sql
-- Политики для бакета avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar" ON storage.objects
  FOR UPDATE TO authenticated USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can delete their own avatar" ON storage.objects
  FOR DELETE TO authenticated USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Тестирование

### Полный цикл тестирования:

1. **Регистрация**: http://localhost:3000/uk/signup
   - Заполните все поля включая имя, фамилию и возраст
   - Нажмите "Зарегистрироваться"

2. **Проверка профиля**: http://localhost:3000/check-profiles.html
   - Введите email нового пользователя
   - Убедитесь что профиль создан с правильными данными

3. **Вход в систему**: http://localhost:3000/uk/login
   - Войдите с учетными данными нового пользователя

4. **Редактирование профиля**: http://localhost:3000/uk/profile
   - Обновите данные профиля
   - Загрузите аватар

## Что было исправлено

✅ Добавлено поле возраста в форму регистрации
✅ Обновлена функция триггера для обработки возраста
✅ Добавлена обработка ошибок в триггере
✅ Поддержка разных форматов метаданных
✅ Создана страница профиля для редактирования
✅ Добавлена поддержка загрузки аватаров
✅ Создан инструмент для проверки профилей

## Очистка после тестирования

После успешного тестирования удалите временные файлы:
- `src/app/api/auth/check-profile/route.ts`
- `public/check-profiles.html`
