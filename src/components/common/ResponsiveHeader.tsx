'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/lib/useDictionary';
import { useSupabase } from '@/hooks/useSupabase';
import LanguageSwitcher from './LanguageSwitcher';

const ResponsiveHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { dictionary, locale } = useDictionary();
  const { session, profile, signOut } = useSupabase();
  const pathname = usePathname();

  const common = dictionary.common || {};
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = `/${locale}`;
  };

  const isActive = (path: string) => {
    return pathname?.startsWith(`/${locale}${path}`);
  };

  const navItems = [
    { id: 'home', label: common.home || 'Home', href: `/${locale}` },
    { id: 'blog', label: common.blog || 'Blog', href: `/${locale}/blog` },
    { id: 'news', label: common.news || 'News', href: `/${locale}/news` },
    { id: 'lessons', label: common.lessons || 'Lessons', href: `/${locale}/lessons` },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={`/${locale}`} className="text-2xl font-bold text-indigo-600">
                {common.site_title || 'Physics & Math'}
              </Link>
            </div>
            
            {/* Desktop navigation links - hidden on mobile */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-6 sm:items-center">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive(item.href.replace(`/${locale}`, ''))
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
            {/* Right side navigation items */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSwitcher currentLocale={locale} />
                {/* Auth links - visible on desktop */}
            <div className="hidden sm:flex sm:items-center sm:space-x-2">
              {session?.user ? (
                <>
                  <Link 
                    href={`/${locale}/dashboard`}
                    className={`px-3 py-2 text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {common.dashboard || 'Dashboard'}
                  </Link>
                  
                  {(profile?.role === 'admin' || profile?.role === 'teacher') && (
                    <Link
                      href={`/${locale}/admin`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                    >
                      {common.admin || 'Admin'}
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-md text-sm"
                  >
                    {common.logout || 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    {common.login || 'Login'}
                  </Link>
                  
                  <Link
                    href={`/${locale}/signup`}
                    className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-sm"
                  >
                    {common.signup || 'Sign Up'}
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
                data-testid="mobile-menu-button"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  /* Icon when menu is open */
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" data-testid="mobile-menu-close">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden" data-testid="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMenu}
                className={`block px-3 py-2 text-base font-medium ${
                  isActive(item.href.replace(`/${locale}`, ''))
                    ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                }`}
                data-testid={`mobile-nav-${item.id}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
            {/* Mobile auth links */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {session?.user ? (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={closeMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  {common.dashboard || 'Dashboard'}
                </Link>
                
                {(profile?.role === 'admin' || profile?.role === 'teacher') && (
                  <Link
                    href={`/${locale}/admin`}
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    {common.admin || 'Admin'}
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-700 hover:bg-red-50"
                >
                  {common.logout || 'Logout'}
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/login`}
                  onClick={closeMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  {common.login || 'Login'}
                </Link>
                
                <Link
                  href={`/${locale}/signup`}
                  onClick={closeMenu}
                  className="block px-3 py-2 text-base font-medium text-indigo-600 bg-indigo-50"
                >
                  {common.signup || 'Sign Up'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default ResponsiveHeader;
