'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AuthButtonsProps {
  isAuthenticated: boolean;
  loading: boolean;
  locale: string;
  dictionary: any;
}

const AuthButtons = ({ isAuthenticated, loading, locale, dictionary }: AuthButtonsProps) => {
  // Усиленная проверка - не показываем кнопки если:
  // 1. Идет загрузка
  // 2. Пользователь авторизован
  // 3. Если isAuthenticated undefined (еще не определено)
  if (loading || isAuthenticated || isAuthenticated === undefined) {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center space-x-3 animate-fade-in-up">
      <Link
        href={`/${locale}/login`}
        className="group relative px-6 py-3 rounded-2xl text-sm font-semibold text-gray-700 backdrop-blur-sm bg-white/50 border border-white/30 hover:bg-white/80 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-lift hover-glow"
      >
        <span className="relative z-10 flex items-center">
          <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          {dictionary.auth?.login || 'Увійти'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
      </Link>
      <Link
        href={`/${locale}/signup`}
        className="group relative px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-lift animate-gradient-shift"
      >
        <span className="relative z-10 flex items-center">
          <svg className="w-4 h-4 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {dictionary.auth?.signUp || 'Реєстрація'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
      </Link>
    </div>
  );
};

export default AuthButtons;
