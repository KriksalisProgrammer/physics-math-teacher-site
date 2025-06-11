import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Пытаемся войти с заведомо неверным паролем для получения информации о пользователе
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'invalid_password_check_123'
    });

    if (error) {
      // Если ошибка "Invalid login credentials", проверяем статус пользователя
      if (error.message.includes('Invalid login credentials')) {
        // Пытаемся зарегистрировать пользователя с тем же email
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'temp_check_password'
        });

        if (signUpError && signUpError.message.includes('already registered')) {
          return NextResponse.json({
            status: 'email_not_confirmed',
            message: 'Пожалуйста, подтвердите свой email. Проверьте папку входящих сообщений и папку спам.'
          });
        }
        
        if (signUpData.user && !signUpData.user.email_confirmed_at) {
          return NextResponse.json({
            status: 'email_not_confirmed', 
            message: 'Пожалуйста, подтвердите свой email. Проверьте папку входящих сообщений и папку спам.'
          });
        }
      }
    }

    return NextResponse.json({
      status: 'unknown',
      message: 'Неверный email или пароль'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
