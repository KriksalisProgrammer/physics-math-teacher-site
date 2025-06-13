'use client';

import { useDictionary } from '@/lib/useDictionary';
import Link from 'next/link';

export default function GuestDashboard() {
  const { dictionary, locale } = useDictionary();
  const common = dictionary.common;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {common.welcome_to_dashboard || "Ласкаво просимо до особистого кабінету"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {common.dashboard_description || "Увійдіть в систему, щоб отримати доступ до ваших курсів, завдань та прогресу навчання"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/login`}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center justify-center">
                🔑 {common.login || "Увійти"}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            
            <Link
              href={`/${locale}/signup`}
              className="group relative px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-2xl font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center">
                ✨ {common.signup || "Зареєструватися"}
              </span>
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Персональні уроки</h3>
            <p className="text-gray-600">Доступ до індивідуальних уроків та матеріалів, адаптованих під ваш рівень</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Відстеження прогресу</h3>
            <p className="text-gray-600">Детальна статистика ваших досягнень та рекомендації для покращення</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Інтерактивні тести</h3>
            <p className="text-gray-600">Захоплюючі тести та завдання для закріплення знань</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Календар занять</h3>
            <p className="text-gray-600">Зручне планування та нагадування про заплановані уроки</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Спілкування з викладачами</h3>
            <p className="text-gray-600">Прямий зв'язок з вашими викладачами для отримання допомоги</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Досягнення</h3>
            <p className="text-gray-600">Система нагород та сертифікатів за ваші успіхи в навчанні</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {common.ready_to_start || "Готові розпочати навчання?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {common.join_thousands || "Приєднуйтесь до тисяч студентів, які вже досягли успіху"}
          </p>
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            🚀 {common.start_learning || "Почати навчання"}
          </Link>
        </div>
      </div>
    </div>
  );
}
