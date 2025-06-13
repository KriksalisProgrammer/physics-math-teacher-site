'use client';

import React, { useState } from 'react';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

export const dynamic = 'force-dynamic';

const TestCard = ({ test, onStart }: { test: any; onStart: (id: string) => void }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl">{test.icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
          <p className="text-sm text-gray-500">{test.subject}</p>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        test.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
        test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {test.difficulty === 'easy' ? 'Легкий' :
         test.difficulty === 'medium' ? 'Середній' : 'Складний'}
      </div>
    </div>
    
    <p className="text-gray-600 mb-4">{test.description}</p>
    
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
      <span>⏱️ {test.duration} хв</span>
      <span>❓ {test.questions} питань</span>
      <span>⭐ {test.maxScore} балів</span>
    </div>
    
    <button
      onClick={() => onStart(test.id)}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
    >
      Почати тест
    </button>
  </div>
);

export default function TestsPage() {
  const { dictionary, locale } = useDictionary();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { showSuccess, showInfo } = useNotifications();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for tests
  const tests = [
    {
      id: '1',
      title: 'Основи механіки',
      subject: 'Фізика',
      description: 'Тест на знання основних законів механіки, сил та руху.',
      difficulty: 'easy',
      duration: 15,
      questions: 10,
      maxScore: 100,
      icon: '⚡',
      category: 'physics'
    },
    {
      id: '2',
      title: 'Квантова механіка',
      subject: 'Фізика',
      description: 'Поглиблений тест на розуміння принципів квантової фізики.',
      difficulty: 'hard',
      duration: 30,
      questions: 15,
      maxScore: 150,
      icon: '🔬',
      category: 'physics'
    },
    {
      id: '3',
      title: 'Алгебра та рівняння',
      subject: 'Математика',
      description: 'Тест на вирішення алгебраїчних рівнянь та систем.',
      difficulty: 'medium',
      duration: 20,
      questions: 12,
      maxScore: 120,
      icon: '🧮',
      category: 'math'
    },
    {
      id: '4',
      title: 'Геометрія',
      subject: 'Математика',
      description: 'Завдання на обчислення площ, об\'ємів та геометричних фігур.',
      difficulty: 'medium',
      duration: 25,
      questions: 14,
      maxScore: 140,
      icon: '📐',
      category: 'math'
    }
  ];

  const categories = [
    { id: 'all', name: 'Всі тести', icon: '📚' },
    { id: 'physics', name: 'Фізика', icon: '⚡' },
    { id: 'math', name: 'Математика', icon: '🧮' }
  ];

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const handleStartTest = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    showInfo(
      'Тест розпочато!', 
      `Розпочинаємо тест "${test?.title}". Удачі!`,
      3000
    );
    // Тут буде логіка переходу до тестування
    // router.push(`/${locale}/tests/${testId}`);
  };

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push(`/${locale}/login`);
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🧪 Тести та перевірки знань
              </h1>
              <p className="text-gray-600 text-lg">
                Перевірте свої знання та отримайте миттєвий зворотний зв'язок
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Ваш прогрес</div>
              <div className="text-2xl font-bold text-blue-600">76%</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Пройдено тестів</div>
                <div className="text-2xl font-bold text-blue-600">12</div>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Середній бал</div>
                <div className="text-2xl font-bold text-green-600">87</div>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Часу витрачено</div>
                <div className="text-2xl font-bold text-purple-600">4.2г</div>
              </div>
              <div className="text-3xl">⏱️</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Рівень знань</div>
                <div className="text-2xl font-bold text-orange-600">Добре</div>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} onStart={handleStartTest} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Тестів не знайдено
            </h3>
            <p className="text-gray-600">
              Спробуйте обрати іншу категорію або перевірте пізніше
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
