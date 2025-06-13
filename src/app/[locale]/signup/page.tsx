'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import Form from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

function SignupPage() {
  const { dictionary, locale } = useDictionary();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(`/${locale}/dashboard`);
    }
  }, [isAuthenticated, authLoading, router, locale]);

  const validateForm = () => {
    // Name validation
    if (!firstName.trim() || !lastName.trim()) {
      setError(dictionary.auth.enterNameSurname);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(dictionary.auth.invalidEmail);
      return false;
    }

    // Age validation (optional)
    if (age && (parseInt(age) < 5 || parseInt(age) > 100)) {
      setError(dictionary.auth.ageRange);
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError(dictionary.auth.passwordTooShort);
      return false;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError(dictionary.auth.passwordsDoNotMatch);
      return false;
    }

    // Terms acceptance
    if (!acceptTerms) {
      setError('Необходимо принять условия использования');
      return false;
    }

    return true;
  };  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Use Supabase directly for registration with metadata
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            age: age ? parseInt(age) : null
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        
        // Улучшенная обработка различных типов ошибок
        if (error.message?.includes('User already registered')) {
          throw new Error('Користувач з таким email вже зареєстрований');
        } else if (error.message?.includes('Password should be at least')) {
          throw new Error('Пароль повинен містити щонайменше 6 символів');
        } else if (error.message?.includes('Invalid email')) {
          throw new Error('Невірний формат електронної пошти');
        } else if (error.message?.includes('Signup is disabled')) {
          throw new Error('Реєстрація тимчасово недоступна');
        } else if (error.message?.includes('Email rate limit exceeded')) {
          throw new Error('Занадто багато спроб. Спробуйте пізніше');
        } else {
          throw error;
        }
      }
      
      if (data.user && !data.session) {
        // Email confirmation required
        setMessage(dictionary.auth?.verifyEmail || 'Перевірте свою електронну пошту для підтвердження реєстрації');
      } else if (data.session) {
        // Auto-login successful
        setMessage('Реєстрація успішна! Перенаправляємо в особистий кабінет...');
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg = error.message || dictionary.auth?.signUpFailed || 'Помилка реєстрації';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Слабый', 'Средний', 'Хороший', 'Отличный'];

  return (    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-25 animate-ping"></div>
        
        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-lg w-full space-y-8">        {/* Header with Enhanced Design */}
        <div className="text-center">
          <div className="relative w-28 h-28 mx-auto mb-8">
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-20 animate-spin" style={{animationDuration: '3s'}}></div>
            
            {/* Main Icon Container */}
            <div className="relative w-24 h-24 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-12">
              <div className="relative">
                <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {/* Sparkle effect */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
            {dictionary.auth.signUp}
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Присоединяйтесь к нашему образовательному сообществу
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>

        {/* Signup Form */}
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

          {message && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700 font-medium">{message}</span>
              </div>
            </div>
          )}

          <Form onSubmit={handleSubmit} className="space-y-6">            {/* Name Fields with Beautiful Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <Input
                  label={dictionary.auth.firstName}
                  type="text"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-4 pl-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm group-hover:shadow-md"
                  placeholder="Имя"
                />
                <div className="absolute left-4 top-14 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <Input
                  label={dictionary.auth.lastName}
                  type="text"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-4 pl-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm group-hover:shadow-md"
                  placeholder="Фамилия"
                />
                <div className="absolute left-4 top-14 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>            {/* Email Input with Enhanced Design */}
            <div className="relative group">
              <Input
                label={dictionary.auth.email}
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 pl-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm group-hover:shadow-md"
                placeholder="your@email.com"
              />              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Email validation indicator */}
              {email && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              )}
            </div>            {/* Age Input (Optional) with Beautiful Design */}
            <div className="relative group">
              <Input
                label={dictionary.auth.ageOptional}
                type="number"
                value={age}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                min="5"
                max="100"
                className="w-full px-4 py-4 pl-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm group-hover:shadow-md"
                placeholder="18"
              />              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              {/* Age validation indicator */}
              {age && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {parseInt(age) >= 5 && parseInt(age) <= 100 ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              )}
            </div>            {/* Password Input with Enhanced Security */}
            <div className="relative group">
              <Input
                label={dictionary.auth.password}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 pl-12 pr-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm group-hover:shadow-md"
                placeholder="••••••••"
              />
              <div className="absolute left-4 top-14 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 transform hover:scale-110"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Надежность пароля:</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength <= 1 ? 'text-red-600' :
                      passwordStrength <= 2 ? 'text-orange-600' :
                      passwordStrength <= 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {strengthLabels[passwordStrength - 1] || 'Слабый'}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 w-full rounded-full transition-colors duration-300 ${
                          level <= passwordStrength 
                            ? strengthColors[passwordStrength - 1] || 'bg-gray-200'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>            {/* Confirm Password Input with Enhanced Validation */}
            <div className="relative group">
              <Input
                label={dictionary.auth.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-4 pl-12 pr-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm group-hover:shadow-md"
                placeholder="••••••••"
              />
              <div className="absolute left-4 top-14 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 transform hover:scale-110"
              >
                {showConfirmPassword ? (
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
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center">
                  {password === confirmPassword ? (
                    <div className="flex items-center text-green-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Пароли совпадают</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm">Пароли не совпадают</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  Я принимаю{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                    условия использования
                  </Link>
                  {' '}и{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                    политику конфиденциальности
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {dictionary.common.loading}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {dictionary.auth.signUp}
                  </>
                )}
              </span>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              )}
            </Button>
          </Form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {dictionary.auth.alreadyHaveAccount}{' '}
              <Link 
                href={`/${locale}/login`} 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
              >
                {dictionary.auth.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;