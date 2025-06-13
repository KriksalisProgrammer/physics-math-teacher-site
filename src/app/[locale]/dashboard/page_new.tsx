'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import { useSupabase } from '@/hooks/useSupabase';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import { formatDate } from '@/utils/formatDate';
import { Database } from '@/types/database.types';

type Lesson = Database['public']['Tables']['lessons']['Row'];

export default function DashboardPage() {
  const { dictionary, locale } = useDictionary();
  const { profile, loading } = useSupabase();
  const router = useRouter();
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    upcomingLessons: 0,
    activeSessions: 0
  });
  
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      setLoadingLessons(true);
      try {
        // Fetch upcoming lessons
        const lessonsResponse = await fetch(`/api/lessons/upcoming?locale=${locale}`);
        const lessonsData = await lessonsResponse.json();
        
        if (lessonsData.data) {
          setUpcomingLessons(lessonsData.data);
        }

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();
        
        if (statsData.data) {
          setStats(statsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoadingLessons(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [locale, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">{dictionary.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-25 animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section with Glassmorphism */}
            <div className="text-center mb-16">
              <div className="backdrop-blur-sm bg-white/20 rounded-3xl p-12 shadow-2xl border border-white/30">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                  {dictionary.dashboard?.welcome_guest || 'Ласкаво просимо до особистого кабінету'}
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                  {dictionary.dashboard?.guest_description || 
                    'Щоб отримати доступ до всіх функцій платформи, вам потрібно зареєструватися або увійти в систему.'}
                </p>
                
                {/* Action Buttons with Modern Design */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href={`/${locale}/signup`}>
                    <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                      <span className="relative z-10 flex items-center">
                        <svg className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        {dictionary.auth?.signUp || 'Зареєструватися'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </Button>
                  </Link>
                  <Link href={`/${locale}/login`}>
                    <Button variant="secondary" className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all duration-300 hover:scale-105">
                      <span className="flex items-center">
                        <svg className="w-6 h-6 mr-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        {dictionary.auth?.login || 'Увійти'}
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group backdrop-blur-sm bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dictionary.common?.apply || 'Подати заявку'}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {dictionary.dashboard?.application_description || 
                    'Не маєте акаунту? Ви все одно можете подати заявку на урок.'}
                </p>
                <Link href={`/${locale}/applications`}>
                  <Button className="group/btn w-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white py-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {dictionary.common?.apply || 'Подати заявку'}
                    </span>
                  </Button>
                </Link>
              </div>

              <div className="group backdrop-blur-sm bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-teal-400 to-blue-400 rounded-2xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{dictionary.common?.blog || 'Блог'}</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {dictionary.dashboard?.blog_guest_description || 
                    'Читайте статті та поради від наших викладачів безкоштовно.'}
                </p>
                <Link href={`/${locale}/blog`}>
                  <Button variant="secondary" className="group/btn w-full bg-white/80 backdrop-blur-sm border-2 border-teal-200 text-teal-700 hover:bg-teal-50 py-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {dictionary.common?.read_blog || 'Читати блог'}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (stats.activeSessions > 0) {
      return <Badge variant="success" className="ml-2">Онлайн • {stats.activeSessions} сессий</Badge>;
    }
    return <Badge variant="default" className="ml-2">Офлайн</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-cyan-200 rounded-full opacity-15 animate-pulse"></div>
      </div>

      {/* Header with Glassmorphism */}
      <div className="relative z-10 backdrop-blur-sm bg-white/20 border-b border-white/30 shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center leading-tight">
                {dictionary.dashboard?.welcome || `Добро пожаловать, ${profile.first_name || profile.email}!`}
                {getStatusBadge()}
              </h1>
              <p className="text-xl text-gray-700 mt-2 font-medium">
                {dictionary.dashboard?.subtitle || 'Управляйте своим обучением в одном месте'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/${locale}/applications`}>
                <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {dictionary.dashboard?.new_application || 'Подать заявку'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Button>
              </Link>
              {isTeacher && (
                <Link href={`/${locale}/admin`}>
                  <Button variant="secondary" className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all duration-300 hover:scale-105">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {dictionary.common.admin}
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Stats Cards with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group transform transition-all duration-300 hover:scale-105">
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.totalLessons}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{dictionary.dashboard?.total_lessons || "Всего уроков"}</h3>
              <p className="text-sm text-gray-600">Общее количество уроков</p>
            </div>
          </div>
          
          <div className="group transform transition-all duration-300 hover:scale-105">
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats.completedLessons}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{dictionary.dashboard?.completed_lessons || "Завершено"}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">{stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}% от общего</span>
                <div className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <span className="text-xs font-medium">+12%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group transform transition-all duration-300 hover:scale-105">
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {stats.upcomingLessons}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{dictionary.dashboard?.upcoming_lessons || "Предстоящие"}</h3>
              <p className="text-sm text-gray-600">Запланированы на эту неделю</p>
            </div>
          </div>
          
          <div className="group transform transition-all duration-300 hover:scale-105">
            <div className={`backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 ${stats.activeSessions > 0 ? 'ring-2 ring-green-300 bg-green-50/80' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${stats.activeSessions > 0 ? 'from-green-500 to-green-600' : 'from-purple-500 to-pink-600'} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className={`text-4xl font-black bg-gradient-to-r ${stats.activeSessions > 0 ? 'from-green-600 to-green-700' : 'from-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
                  {stats.activeSessions}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{dictionary.dashboard?.active_sessions || "Активные сессии"}</h3>
              <div className="flex items-center">
                {stats.activeSessions > 0 ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">Сейчас в эфире</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">Нет активных сессий</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Glassmorphism */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="group backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transform transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform duration-300">
                    <span className="text-3xl font-black text-white">
                      {(profile.first_name?.[0] || profile.email[0]).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse">
                    <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                  {profile.first_name ? `${profile.first_name} ${profile.last_name}` : profile.email}
                </h3>
                <div className="inline-flex">
                  <Badge variant="info" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 rounded-2xl capitalize">
                    {profile.role}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      {dictionary.auth.email}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{profile.email}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0v1h6V7m-6 0h6m-6 8h6m-6 4h6M3 19a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10z" />
                      </svg>
                      {dictionary.dashboard?.member_since || 'Участник с'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDate(profile.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <Link href={`/${locale}/profile`}>
                  <Button variant="secondary" className="w-full group relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all duration-300 hover:scale-105">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {dictionary.dashboard?.editProfile || "Редактировать профиль"}
                    </span>
                  </Button>
                </Link>
                <Link href={`/${locale}/lessons`}>
                  <Button className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105">
                    <span className="relative z-10 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {dictionary.common.lessons}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Lessons and Activities */}
          <div className="xl:col-span-2 space-y-8">
            {/* Upcoming Lessons */}
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {dictionary.dashboard?.upcomingLessons || "Предстоящие уроки"}
                </h3>
                <Link href={`/${locale}/lessons`} className="group flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-300">
                  <span className="mr-2">{dictionary.common.view_all}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {loadingLessons ? (
                <div className="flex justify-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : upcomingLessons.length > 0 ? (
                <div className="space-y-6">
                  {upcomingLessons.slice(0, 3).map((lesson, index) => (
                    <div key={lesson.id} className="group relative bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover:shadow-xl transform transition-all duration-300 hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg ${
                              index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                              index === 1 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                              'bg-gradient-to-r from-green-500 to-green-600'
                            }`}>
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-1">
                                {locale === 'uk' ? lesson.title_uk : lesson.title_en}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {locale === 'uk' ? lesson.description_uk : lesson.description_en}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{formatDate(lesson.created_at)}</span>
                          </div>
                        </div>
                        {lesson.meeting_link && (
                          <div className="ml-6">
                            <Link href={`/${locale}/lessons/${lesson.id}`}>
                              <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105">
                                <span className="relative z-10 flex items-center">
                                  <svg className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  {dictionary.lessons?.joinLesson || "Присоединиться"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    {dictionary.dashboard?.no_upcoming_lessons || "Нет предстоящих уроков"}
                  </h4>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-md mx-auto">
                    {dictionary.dashboard?.schedule_lesson || "Запланируйте свой первый урок"}
                  </p>
                  <Link href={`/${locale}/applications`}>
                    <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105">
                      <span className="relative z-10 flex items-center">
                        <svg className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {dictionary.dashboard?.schedule_now || "Запланировать сейчас"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group backdrop-blur-lg bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-3xl p-8 border border-white/50 shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">{dictionary.common.blog}</h3>
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {dictionary.dashboard?.blog_description || "Читайте статьи и советы от наших преподавателей"}
                </p>
                <Link href={`/${locale}/blog`}>
                  <Button variant="secondary" className="w-full group/btn relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all duration-300 hover:scale-105">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {dictionary.common.view_all}
                    </span>
                  </Button>
                </Link>
              </div>
              
              <div className="group backdrop-blur-lg bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-3xl p-8 border border-white/50 shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">{dictionary.common.news}</h3>
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {dictionary.dashboard?.news_description || "Следите за новостями и обновлениями"}
                </p>
                <Link href={`/${locale}/news`}>
                  <Button variant="secondary" className="w-full group/btn relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 py-4 rounded-2xl text-lg font-semibold shadow-xl transform transition-all duration-300 hover:scale-105">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {dictionary.common.view_all}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
