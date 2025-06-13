'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface MobileAuthButtonsProps {
  isAuthenticated: boolean;
  loading: boolean;
  locale: string;
  dictionary: any;
  onClose: () => void;
}

const MobileAuthButtons = ({ isAuthenticated, loading, locale, dictionary, onClose }: MobileAuthButtonsProps) => {
  // Усиленная проверка - не показываем кнопки если:
  // 1. Идет загрузка
  // 2. Пользователь авторизован
  // 3. Если isAuthenticated undefined (еще не определено)
  if (loading || isAuthenticated || isAuthenticated === undefined) {
    return null;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col space-y-2">
        <Link
          href={`/${locale}/login`}
          onClick={onClose}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
        >
          <span className="text-lg">🔑</span>
          <span>{dictionary.auth?.login || 'Увійти'}</span>
        </Link>
        <Link
          href={`/${locale}/signup`}
          onClick={onClose}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          <span className="text-lg">✨</span>
          <span>{dictionary.auth?.signUp || 'Реєстрація'}</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileAuthButtons;
