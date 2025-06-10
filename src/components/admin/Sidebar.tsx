'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDictionary } from '../../lib/useDictionary';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: (active: boolean) => JSX.Element;
}

const Sidebar: React.FC = () => {
  const { dictionary, locale } = useDictionary();
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname.includes(path);
  };
  
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: dictionary.admin?.sidebar?.dashboard || 'Dashboard',
      href: `/${locale}/admin`,
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'posts',
      label: dictionary.admin?.sidebar?.posts || 'Posts',
      href: `/${locale}/admin/posts`,
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'news',
      label: dictionary.admin?.sidebar?.news || 'News',
      href: `/${locale}/admin/news`,
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'lessons',
      label: dictionary.admin?.sidebar?.lessons || 'Lessons',
      href: `/${locale}/admin/lessons`,
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'comments',
      label: dictionary.admin?.sidebar?.comments || 'Comments',
      href: `/${locale}/admin/comments`,
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
  ];

  return (
    <div className="h-full bg-gray-900 w-64 flex flex-col">
      <div className="flex items-center h-16 px-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">{dictionary.admin?.adminPanel || 'Admin Panel'}</h2>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link 
                key={item.id} 
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="mr-3">{item.icon(active)}</div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <Link
          href={`/${locale}/`}
          className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
        >
          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {dictionary.admin?.backToSite || 'Back to Site'}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;