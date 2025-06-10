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
  
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1"
        data-testid="language-switcher"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span data-testid="language-display">{languages[currentLocale as keyof typeof languages]}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-switcher"
        >
          {Object.entries(languages).map(([code, name]) => (
            <Link
              key={code}
              href={`/${code}${pathnameWithoutLocale}`}
              className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                code === currentLocale ? 'font-bold bg-gray-50' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
              data-testid={`lang-option-${code}`}
              role="menuitem"
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;