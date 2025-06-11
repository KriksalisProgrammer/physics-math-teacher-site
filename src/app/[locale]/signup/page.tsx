'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import Form from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useSupabase } from '@/hooks/useSupabase';

function SignupPage() {
  const { dictionary, locale } = useDictionary();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { signUp } = useSupabase();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError('Пожалуйста, введите имя и фамилию');
      setLoading(false);
      return;
    }

    if (age && (parseInt(age) < 5 || parseInt(age) > 100)) {
      setError('Возраст должен быть от 5 до 100 лет');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError(dictionary.auth.passwordsDoNotMatch);
      setLoading(false);
      return;
    }

    try {
      const metadata: any = {
        first_name: firstName.trim(),
        last_name: lastName.trim()
      };
      
      if (age) {
        metadata.age = parseInt(age);
      }

      const { data, error } = await signUp(email, password, metadata);
      
      if (error) throw error;
      
      // Show success message
      setMessage(dictionary.auth.verifyEmail);
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 5000);
    } catch (error: any) {
      setError(error.message || dictionary.auth.signUpFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {dictionary.auth.signUp}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Имя"
            type="text"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Фамилия"
            type="text"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            required
          />
        </div>
        <Input
          label={dictionary.auth.email}
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Возраст (необязательно)"
          type="number"
          min="5"
          max="100"
          value={age}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
          placeholder="Введите ваш возраст"
        />
        <Input
          label={dictionary.auth.password}
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <Input
          label={dictionary.auth.confirmPassword}
          type="password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? dictionary.common.loading : dictionary.auth.signUp}
        </Button>
      </Form>

      <div className="mt-4 text-center">
        <p>
          {dictionary.auth.alreadyHaveAccount}{' '}
          <Link href={`/${locale}/login`} className="text-blue-600 hover:underline">
            {dictionary.auth.login}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;