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

    // Отправляем повторное письмо с подтверждением
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      return NextResponse.json({ 
        error: 'Не удалось отправить письмо. Возможно, email уже подтвержден или не существует.'
      }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Письмо с подтверждением отправлено повторно'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
