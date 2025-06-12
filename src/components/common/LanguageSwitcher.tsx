"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Remove the locale part from the pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(uk|en)/, '') || '/';
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Mapping of language codes to their names
  const languages = {
    uk: 'Українська',
    en: 'English',
  };
  
  // Function to get flag emoji for locale
  const getFlag = (locale: string) => {
    const flags = {
      uk: '🇺🇦',
      en: '🇺🇸'
    };
    return flags[locale as keyof typeof flags] || '🌐';
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-2 py-1 text-sm transition-colors"
        data-testid="language-switcher"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="text-xs font-medium">{currentLocale.toUpperCase()}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {Object.entries(languages).map(([locale, name]) => (
            <Link
              key={locale}
              href={`/${locale}${pathnameWithoutLocale}`}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                currentLocale === locale
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              data-testid={`language-option-${locale}`}
            >
              <span>{getFlag(locale)}</span>
              <span>{name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;