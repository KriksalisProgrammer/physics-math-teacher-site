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
  const router = useRouter();
  const { signIn } = useSupabase();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) throw error;
      
      // Redirect to dashboard on success
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      setError(error.message || dictionary.auth.loginFailed);
    } finally {
      setLoading(false);
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