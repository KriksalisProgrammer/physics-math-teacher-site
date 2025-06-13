'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import GuestDashboard from '@/components/dashboard/GuestDashboard';

export const dynamic = 'force-dynamic';

// Компонент статистической карточки
const StatCard = ({ icon, title, value, description, trend = null }: {
  icon: string;
  title: string;
  value: string | number;
  description: string;
  trend?: { value: number; isPositive: boolean } | null;
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="absolute -right-2 -top-2 opacity-10">
      <div className="text-6xl">{icon}</div>
    </div>
    <div className="relative">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↗️' : '↘️'}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </div>
  </div>
);

// Компонент быстрых действий
const QuickActionCard = ({ icon, title, description, href }: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) => (
  <Link 
    href={href}
    className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-100 p-6 shadow-lg transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1"
  >
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
      <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
        →
      </div>
    </div>
  </Link>
);

// Компонент недавней активности
const ActivityItem = ({ icon, title, time, description }: {
  icon: string;
  title: string;
  time: string;
  description?: string;
}) => (
  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className="text-sm text-gray-500">{time}</span>
      </div>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
  </div>
);

export default function DashboardPage() {
  const { dictionary: dict, locale } = useDictionary();
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { showSuccess, showInfo } = useNotifications();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Доброго ранку');
    else if (hour < 17) setGreeting('Добрий день');
    else setGreeting('Добрий вечір');
  }, []);

  // Показываем загрузку пока проверяется авторизация
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }
  // Если пользователь не авторизован - показываем гостевую версию
  if (!isAuthenticated) {
    return <GuestDashboard />;
  }
  // Если авторизован - показываем полный dashboard
  const role = profile?.role || 'student';
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const userName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : firstName || profile?.email?.split('@')[0] || 'Користувач';

  // Получаем данные в зависимости от роли
  const getRoleContent = () => {
    switch (role) {
      case 'admin':
        return {
          stats: [
            { icon: '👥', title: 'Всього користувачів', value: '1,247', description: 'Активних учасників', trend: { value: 12, isPositive: true } },
            { icon: '📚', title: 'Уроків створено', value: '324', description: 'За цей місяць', trend: { value: 8, isPositive: true } },
            { icon: '💬', title: 'Повідомлень', value: '2,156', description: 'Нових запитань', trend: { value: 15, isPositive: true } },
            { icon: '📊', title: 'Конверсія', value: '94.2%', description: 'Успішність навчання', trend: { value: 2, isPositive: true } }
          ],
          quickActions: [
            { icon: '👥', title: 'Керування користувачами', description: 'Додати, редагувати або видалити користувачів', href: `/${locale}/admin/users` },
            { icon: '📝', title: 'Створити урок', description: 'Додати новий навчальний матеріал', href: `/${locale}/admin/lessons/create` },
            { icon: '📊', title: 'Аналітика', description: 'Переглянути статистику та звіти', href: `/${locale}/admin/analytics` },
            { icon: '⚙️', title: 'Налаштування', description: 'Конфігурація сайту та системи', href: `/${locale}/admin/settings` },
            { icon: '💬', title: 'Модерація коментарів', description: 'Перевірити та затвердити коментарі', href: `/${locale}/admin/comments` },
            { icon: '📰', title: 'Керування новинами', description: 'Додати або редагувати новини', href: `/${locale}/admin/news` }
          ]
        };
      
      case 'teacher':
        return {
          stats: [
            { icon: '👨‍🎓', title: 'Моїх студентів', value: '156', description: 'Активних учнів', trend: { value: 5, isPositive: true } },
            { icon: '📚', title: 'Уроків проведено', value: '43', description: 'За цей місяць', trend: { value: 12, isPositive: true } },
            { icon: '✅', title: 'Завдань перевірено', value: '89', description: 'Очікує перевірки: 12', trend: null },
            { icon: '⭐', title: 'Середній рейтинг', value: '4.8', description: 'Оцінка від студентів', trend: { value: 3, isPositive: true } }
          ],
          quickActions: [
            { icon: '📝', title: 'Створити урок', description: 'Додати новий навчальний матеріал', href: `/${locale}/lessons/create` },
            { icon: '📋', title: 'Мої уроки', description: 'Переглянути та редагувати уроки', href: `/${locale}/my-lessons` },
            { icon: '✅', title: 'Перевірити завдання', description: 'Нові роботи на перевірку', href: `/${locale}/homework/check` },
            { icon: '📊', title: 'Успішність студентів', description: 'Аналітика прогресу учнів', href: `/${locale}/students/progress` },
            { icon: '📅', title: 'Розклад занять', description: 'Планувати та керувати розкладом', href: `/${locale}/schedule` },
            { icon: '💬', title: 'Чат з учнями', description: 'Відповіді на запитання', href: `/${locale}/chat` }
          ]
        };
      
      default: // student
        return {
          stats: [
            { icon: '📚', title: 'Уроків пройдено', value: '27', description: 'З 45 доступних', trend: { value: 15, isPositive: true } },
            { icon: '🏆', title: 'Балів зароблено', value: '2,340', description: 'За всі завдання', trend: { value: 8, isPositive: true } },
            { icon: '📝', title: 'Завдань виконано', value: '34', description: 'Очікує перевірки: 3', trend: null },
            { icon: '⭐', title: 'Середній бал', value: '4.6', description: 'Твоя успішність', trend: { value: 5, isPositive: true } }
          ],
          quickActions: [
            { icon: '📚', title: 'Продовжити навчання', description: 'Перейти до наступного уроку', href: `/${locale}/lessons/continue` },
            { icon: '📝', title: 'Домашні завдання', description: 'Переглянути активні завдання', href: `/${locale}/homework` },
            { icon: '🧪', title: 'Пройти тест', description: 'Доступні тести для перевірки знань', href: `/${locale}/tests` },
            { icon: '📊', title: 'Мій прогрес', description: 'Детальна статистика навчання', href: `/${locale}/progress` },
            { icon: '📅', title: 'Розклад', description: 'Заплановані заняття та події', href: `/${locale}/calendar` },
            { icon: '💬', title: 'Запитати викладача', description: 'Отримати допомогу', href: `/${locale}/chat` }
          ]
        };
    }
  };

  const { stats, quickActions } = getRoleContent();

  const recentActivities = [
    { icon: '📚', title: 'Завершено урок "Квантова механіка"', time: '2 години тому', description: 'Отримано 95 балів' },
    { icon: '✅', title: 'Здано домашнє завдання', time: '5 годин тому', description: 'Фізика: Закони Ньютона' },
    { icon: '🎯', title: 'Досягнення розблоковано', time: '1 день тому', description: 'Перша сотня балів!' },
    { icon: '💬', title: 'Нове повідомлення від викладача', time: '2 дні тому', description: 'Відгук на ваше завдання' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute -right-20 -top-20 opacity-10">
              <div className="text-9xl">🎓</div>
            </div>
            <div className="relative">
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {userName}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {role === 'admin' ? 'Керуйте платформою та слідкуйте за прогресом' :
                 role === 'teacher' ? 'Готові навчати та надихати студентів?' :
                 'Готові продовжити навчання та досягти нових висот?'}
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                  <span className="text-sm">Роль:</span>
                  <span className="font-semibold">
                    {role === 'admin' ? '👑 Адміністратор' :
                     role === 'teacher' ? '🎓 Викладач' :
                     '📚 Студент'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Швидкі дії</h2>
                <div className="text-sm text-gray-500">Оберіть дію для початку</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} {...action} />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Недавня активність</h2>
                <Link href={`/${locale}/activity`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Переглянути все
                </Link>
              </div>
              <div className="space-y-1">
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Calendar Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              📅 Сьогодні у розкладі
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Фізика: Механіка</div>
                  <div className="text-xs text-gray-500">14:00 - 15:30</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-sm">Математика: Алгебра</div>
                  <div className="text-xs text-gray-500">16:00 - 17:30</div>
                </div>
              </div>
            </div>
            <Link 
              href={`/${locale}/calendar`}
              className="mt-4 w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors block"
            >
              Переглянути весь розклад
            </Link>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              🏆 Досягнення
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl">🥇</div>
                <div>
                  <div className="font-medium text-sm">Перша сотня</div>
                  <div className="text-xs text-gray-500">Зароблено 100+ балів</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl">📚</div>
                <div>
                  <div className="font-medium text-sm">Книголюб</div>
                  <div className="text-xs text-gray-500">Пройдено 25+ уроків</div>
                </div>
              </div>
            </div>
            <Link 
              href={`/${locale}/achievements`}
              className="mt-4 w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors block"
            >
              Всі досягнення
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              📈 Швидка статистика
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Прогрес навчання</span>
                  <span className="text-sm font-semibold">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Виконання завдань</span>
                  <span className="text-sm font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Активність</span>
                  <span className="text-sm font-semibold">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>            </div>
          </div>
        </div>
      </div>
    </main>
  );
}