'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import Form from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useSupabase } from '@/hooks/useSupabase';

export default function LoginPage() {
  const { dictionary, locale } = useDictionary();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useSupabase();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResendEmail(false);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Проверяем различные типы ошибок и показываем понятные сообщения
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('invalid_credentials')) {
          
          // Проверяем статус email подтверждения
          try {
            const checkResponse = await fetch('/api/auth/check-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            
            if (checkResponse.ok) {
              const statusData = await checkResponse.json();
              if (statusData.status === 'email_not_confirmed') {
                setError('Пожалуйста, подтвердите свой email. Проверьте папку входящих сообщений и папку спам.');
                setShowResendEmail(true);
                return;
              }
            }
          } catch (checkError) {
            // Если проверка не удалась, показываем общее сообщение
          }
          
          setError('Неверный email или пароль. Если вы только что зарегистрировались, убедитесь, что подтвердили email.');
        } else {
          setError(error.message || dictionary.auth.loginFailed);
        }
        return;
      }
      
      // Redirect to dashboard on success
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      setError('Произошла ошибка при входе. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage('Пожалуйста, введите email');
      return;
    }

    setResendLoading(true);
    setResendMessage(null);

    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResendMessage('Письмо с подтверждением отправлено повторно. Проверьте папку входящих сообщений.');
      } else {
        setResendMessage(data.error || 'Ошибка при отправке письма');
      }
    } catch (error) {
      setResendMessage('Ошибка при отправке письма');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {dictionary.auth.login}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showResendEmail && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          <p className="mb-2">Не получили письмо с подтверждением?</p>
          <button 
            type="button"
            onClick={handleResendEmail}
            disabled={resendLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            {resendLoading ? 'Отправляем...' : 'Отправить повторно'}
          </button>
        </div>
      )}

      {resendMessage && (
        <div className={`border px-4 py-3 rounded mb-4 ${
          resendMessage.includes('отправлено') 
            ? 'bg-green-100 border-green-400 text-green-700' 
            : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {resendMessage}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Input
          label={dictionary.auth.email}
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <Input
          label={dictionary.auth.password}
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? dictionary.common.loading : dictionary.auth.login}
        </Button>
      </Form>

      <div className="mt-4 text-center">
        <p>
          {dictionary.auth.noAccount}{' '}
          <Link href={`/${locale}/signup`} className="text-blue-600 hover:underline">
            {dictionary.auth.signUp}
          </Link>
        </p>
      </div>
    </div>
  );
}