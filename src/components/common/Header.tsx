'use client';

import Link from 'next/link';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useDictionary } from '@/lib/useDictionary';

function Header() {
  const { dictionary, locale } = useDictionary();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { href: `/${locale}`, label: dictionary.navigation?.home || 'Головна' },
    { href: `/${locale}/lessons`, label: dictionary.navigation?.lessons || 'Уроки' },
    { href: `/${locale}/applications`, label: dictionary.applications?.title || 'Подати заявку', highlight: true },
    { href: `/${locale}/blog`, label: dictionary.navigation?.blog || 'Блог' },
    { href: `/${locale}/news`, label: dictionary.navigation?.news || 'Новини' },
    { href: `/${locale}/dashboard`, label: dictionary.common?.dashboard || 'Кабінет' }
  ];

  return (
    <header className="backdrop-blur-lg bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Enhanced Design */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-lg">TW</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {dictionary.common?.site_title || 'Teacher Website'}
              </span>
              <p className="text-sm text-gray-600 font-medium">Physics & Math</p>
            </div>
          </Link>

          {/* Desktop Navigation with Enhanced Design */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  item.highlight
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-2xl'
                    : 'text-gray-700 hover:text-blue-600 backdrop-blur-sm bg-white/50 hover:bg-white/80 border border-white/30 hover:border-blue-200 shadow-lg hover:shadow-xl'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <span className="relative z-10">{item.label}</span>
                {item.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                )}
                {!item.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side with Enhanced Design */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher currentLocale={locale} />
            
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                href={`/${locale}/login`}
                className="group relative px-6 py-3 rounded-2xl text-sm font-semibold text-gray-700 backdrop-blur-sm bg-white/50 border border-white/30 hover:bg-white/80 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {dictionary.auth?.login || 'Увійти'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
              </Link>
              <Link
                href={`/${locale}/signup`}
                className="group relative px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {dictionary.auth?.signUp || 'Реєстрація'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
              </Link>
            </div>
            
            {/* Mobile menu button with Enhanced Design */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative p-3 text-gray-600 hover:text-gray-900 backdrop-blur-sm bg-white/50 hover:bg-white/80 border border-white/30 hover:border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.highlight
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Auth Links */}
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-200">
              <Link
                href={`/${locale}/login`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {dictionary.auth?.login || 'Увійти'}
              </Link>
              <Link
                href={`/${locale}/signup`}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                {dictionary.auth?.signUp || 'Реєстрація'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
