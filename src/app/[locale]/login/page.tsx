'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import { useNotifications } from '@/hooks/useNotifications';
import Form from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useAuth from '@/hooks/useAuth';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const { dictionary, locale } = useDictionary();
  const { showSuccess, showError } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();  const { signIn, isAuthenticated, loading: authLoading } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(`/${locale}/dashboard`);
    }
  }, [isAuthenticated, authLoading, router, locale]);
  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50">
          <LoadingSpinner size="large" color="blue" message="Перевірка автентифікації..." />
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!email || !password) {
      const errorMsg = dictionary.auth?.requiredField || 'Заповніть всі поля';
      setError(errorMsg);
      showError('Помилка валідації', errorMsg);
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = 'Невірний формат електронної пошти';
      setError(errorMsg);
      showError('Помилка валідації', errorMsg);
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      showSuccess(
        'Успішний вхід!', 
        'Ласкаво просимо до системи!',
        2000
      );
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 500);
      
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMsg = 'Помилка входу';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMsg = 'Невірний email або пароль';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMsg = 'Підтвердіть свою електронну пошту';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      showError('Помилка входу', errorMsg, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {dictionary.auth.login}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {dictionary.common.welcome_title || 'Добро пожаловать назад!'}
          </p>
        </div>

        {/* Login Form */}
        <div className="backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          <Form onSubmit={handleSubmit} className="space-y-6">            {/* Email Input */}
            <div className="relative">
              <Input
                label={dictionary.auth.email}
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 pr-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                placeholder="your@email.com"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>            {/* Password Input */}
            <div className="relative">
              <Input
                label={dictionary.auth.password}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href={`/${locale}/forgot-password`} 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
              >
                {dictionary.auth.forgotPassword}
              </Link>
            </div>

            {/* Submit Button */}            <Button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-3">Вхід...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {dictionary.auth?.login || 'Увійти'}
                  </>
                )}
              </span>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
              )}
            </Button>
          </Form>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">или</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-gray-50/70 transition-all duration-300 hover:scale-105"
                onClick={() => {/* TODO: Implement Google OAuth */}}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                variant="secondary"
                className="w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-gray-50/70 transition-all duration-300 hover:scale-105"
                onClick={() => {/* TODO: Implement Facebook OAuth */}}
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {dictionary.auth.noAccount}{' '}
              <Link 
                href={`/${locale}/signup`} 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
              >
                {dictionary.auth.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}