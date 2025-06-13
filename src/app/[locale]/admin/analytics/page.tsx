'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export const dynamic = 'force-dynamic';

const StatCard = ({ icon, title, value, description, trend }: {
  icon: string;
  title: string;
  value: string | number;
  description: string;
  trend: { value: number; isPositive: boolean };
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className="text-4xl">{icon}</div>
      <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
        trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        <span>{trend.isPositive ? '↗️' : '↘️'}</span>
        <span>{Math.abs(trend.value)}%</span>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  </div>
);

const ChartCard = ({ title, data }: {
  title: string;
  data: { label: string; value: number; color: string }[];
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
            <span className="text-gray-700">{item.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminAnalyticsPage() {
  const { dictionary: dict, locale } = useDictionary();
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { showError } = useNotifications();
  const router = useRouter();
  
  const [selectedPeriod, setSelectedPeriod] = useState('7d'); // 7d, 30d, 90d, 1y
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }    if (profile?.role !== 'admin') {
      showError('Помилка доступу', 'У вас немає доступу до цієї сторінки');
      router.push(`/${locale}/dashboard`);
      return;
    }

    loadAnalytics();
  }, [isAuthenticated, profile, loading, locale, router, selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoadingData(true);
      
      // Моковые данные для демонстрации
      const mockData = {
        stats: [
          { icon: '👥', title: 'Всього користувачів', value: '1,247', description: 'Зареєстровано за весь час', trend: { value: 12, isPositive: true } },
          { icon: '📈', title: 'Активних користувачів', value: '892', description: 'За останні 30 днів', trend: { value: 8, isPositive: true } },
          { icon: '📚', title: 'Уроків пройдено', value: '3,456', description: 'За обраний період', trend: { value: 15, isPositive: true } },
          { icon: '✅', title: 'Завдань виконано', value: '8,923', description: 'Успішно завершено', trend: { value: 23, isPositive: true } },
          { icon: '⭐', title: 'Середній рейтинг', value: '4.8', description: 'Оцінка платформи', trend: { value: 2, isPositive: true } },
          { icon: '💬', title: 'Повідомлень', value: '12,456', description: 'В чатах та коментарях', trend: { value: 18, isPositive: true } }
        ],
        usersByRole: [
          { label: 'Студенти', value: 1089, color: 'bg-blue-500' },
          { label: 'Викладачі', value: 156, color: 'bg-green-500' },
          { label: 'Адміністратори', value: 2, color: 'bg-purple-500' }
        ],
        lessonsBySubject: [
          { label: 'Фізика', value: 234, color: 'bg-indigo-500' },
          { label: 'Математика', value: 189, color: 'bg-pink-500' },
          { label: 'Загальні', value: 67, color: 'bg-yellow-500' }
        ],
        activityByDay: [
          { label: 'Понеділок', value: 145, color: 'bg-red-500' },
          { label: 'Вівторок', value: 189, color: 'bg-orange-500' },
          { label: 'Середа', value: 234, color: 'bg-yellow-500' },
          { label: 'Четвер', value: 198, color: 'bg-green-500' },
          { label: "П'ятниця", value: 167, color: 'bg-blue-500' },
          { label: 'Субота', value: 89, color: 'bg-indigo-500' },
          { label: 'Неділя', value: 56, color: 'bg-purple-500' }
        ],
        recentActivity: [
          { user: 'Іван Петренко', action: 'Завершив урок "Механіка"', time: '5 хв тому', type: 'lesson' },
          { user: 'Марія Коваленко', action: 'Створила новий тест', time: '12 хв тому', type: 'test' },
          { user: 'Олександр Сидоренко', action: 'Залишив коментар', time: '25 хв тому', type: 'comment' },
          { user: 'Катерина Іванова', action: 'Зареєструвалась на платформі', time: '1 год тому', type: 'registration' }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      showError('Помилка завантаження', 'Помилка завантаження аналітики');
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження аналітики...</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'test': return '📝';
      case 'comment': return '💬';
      case 'registration': return '👋';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Аналітика та звіти</h1>
              <p className="text-gray-600">Детальна статистика використання платформи</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Останні 7 днів</option>
                <option value="30d">Останні 30 днів</option>
                <option value="90d">Останні 90 днів</option>
                <option value="1y">Останній рік</option>
              </select>
              <Link 
                href={`/${locale}/dashboard`}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>Назад</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {analyticsData?.stats.map((stat: any, index: number) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Users by Role */}
          <ChartCard
            title="👥 Користувачі за ролями"
            data={analyticsData?.usersByRole || []}
          />

          {/* Lessons by Subject */}
          <ChartCard
            title="📚 Уроки за предметами"
            data={analyticsData?.lessonsBySubject || []}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Activity by Day */}
          <div className="lg:col-span-2">
            <ChartCard
              title="📈 Активність за днями тижня"
              data={analyticsData?.activityByDay || []}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🕒 Остання активність</h3>
            <div className="space-y-4">
              {analyticsData?.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href={`/${locale}/admin/activity`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Переглянути всю активність →
              </Link>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">📄 Експорт звітів</h3>
              <p className="text-gray-600">Завантайте детальні звіти для аналізу</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors font-medium">
                📊 Excel звіт
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-medium">
                📄 PDF звіт
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors font-medium">
                📈 CSV дані
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
