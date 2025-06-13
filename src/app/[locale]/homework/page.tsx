'use client';

import React, { useState } from 'react';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

export const dynamic = 'force-dynamic';

const HomeworkCard = ({ homework, onAction }: { homework: any; onAction: (id: string, action: string) => void }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          homework.status === 'pending' ? 'bg-yellow-100' :
          homework.status === 'submitted' ? 'bg-blue-100' :
          homework.status === 'graded' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <span className="text-xl">
            {homework.status === 'pending' ? '📝' :
             homework.status === 'submitted' ? '📤' :
             homework.status === 'graded' ? '✅' : '❌'}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{homework.title}</h3>
          <p className="text-sm text-gray-500">{homework.subject}</p>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        homework.priority === 'high' ? 'bg-red-100 text-red-700' :
        homework.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-green-100 text-green-700'
      }`}>
        {homework.priority === 'high' ? 'Високий' :
         homework.priority === 'medium' ? 'Середній' : 'Низький'}
      </div>
    </div>
    
    <p className="text-gray-600 mb-4">{homework.description}</p>
    
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
      <span>📅 Дедлайн: {homework.deadline}</span>
      <span>⏱️ Оцінено: {homework.estimatedTime}г</span>
      {homework.grade && <span>🎯 Оцінка: {homework.grade}/100</span>}
    </div>
    
    <div className="flex space-x-2">
      {homework.status === 'pending' && (
        <button
          onClick={() => onAction(homework.id, 'start')}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          Почати
        </button>
      )}
      
      {homework.status === 'submitted' && (
        <div className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold text-center">
          На перевірці
        </div>
      )}
      
      {homework.status === 'graded' && (
        <button
          onClick={() => onAction(homework.id, 'view')}
          className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg font-semibold hover:bg-green-200 transition-colors"
        >
          Переглянути
        </button>
      )}
      
      <button
        onClick={() => onAction(homework.id, 'details')}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Деталі
      </button>
    </div>
  </div>
);

export default function HomeworkPage() {
  const { dictionary, locale } = useDictionary();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { showSuccess, showInfo } = useNotifications();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data for homework
  const homework = [
    {
      id: '1',
      title: 'Рішення задач з механіки',
      subject: 'Фізика',
      description: 'Розв\'язати 5 задач на тему "Закони Ньютона" та оформити детальні рішення.',
      status: 'pending',
      priority: 'high',
      deadline: '25.12.2024',
      estimatedTime: 2,
      maxScore: 100
    },
    {
      id: '2',
      title: 'Лабораторна робота: Коливання',
      subject: 'Фізика',
      description: 'Виконати віртуальну лабораторну роботу та написати звіт.',
      status: 'submitted',
      priority: 'medium',
      deadline: '20.12.2024',
      estimatedTime: 3,
      maxScore: 80
    },
    {
      id: '3',
      title: 'Квадратні рівняння',
      subject: 'Математика',
      description: 'Розв\'язати систему квадратних рівнянь різними методами.',
      status: 'graded',
      priority: 'medium',
      deadline: '15.12.2024',
      estimatedTime: 1.5,
      maxScore: 90,
      grade: 87
    },
    {
      id: '4',
      title: 'Геометричні побудови',
      subject: 'Математика',
      description: 'Виконати побудови складних геометричних фігур за допомогою циркуля та лінійки.',
      status: 'graded',
      priority: 'low',
      deadline: '10.12.2024',
      estimatedTime: 2,
      maxScore: 70,
      grade: 92
    }
  ];

  const statusOptions = [
    { id: 'all', name: 'Всі завдання', icon: '📚', count: homework.length },
    { id: 'pending', name: 'До виконання', icon: '📝', count: homework.filter(h => h.status === 'pending').length },
    { id: 'submitted', name: 'На перевірці', icon: '📤', count: homework.filter(h => h.status === 'submitted').length },
    { id: 'graded', name: 'Оцінені', icon: '✅', count: homework.filter(h => h.status === 'graded').length }
  ];

  const filteredHomework = selectedStatus === 'all' 
    ? homework 
    : homework.filter(h => h.status === selectedStatus);

  const handleAction = (homeworkId: string, action: string) => {
    const hw = homework.find(h => h.id === homeworkId);
    
    switch (action) {
      case 'start':
        showInfo('Завдання розпочато', `Розпочинаємо роботу над "${hw?.title}"`);
        break;
      case 'view':
        showInfo('Перегляд оцінки', `Оцінка за "${hw?.title}": ${hw?.grade}/100`);
        break;
      case 'details':
        showInfo('Деталі завдання', `Відкриваємо деталі для "${hw?.title}"`);
        break;
    }
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
                📝 Домашні завдання
              </h1>
              <p className="text-gray-600 text-lg">
                Керуйте своїми завданнями та слідкуйте за прогресом
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Виконано цього тижня</div>
              <div className="text-2xl font-bold text-green-600">3/5</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Всього завдань</div>
                <div className="text-2xl font-bold text-blue-600">{homework.length}</div>
              </div>
              <div className="text-3xl">📚</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Середня оцінка</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(homework.filter(h => h.grade).reduce((acc, h) => acc + h.grade!, 0) / homework.filter(h => h.grade).length)}
                </div>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Очікує дедлайн</div>
                <div className="text-2xl font-bold text-orange-600">
                  {homework.filter(h => h.status === 'pending').length}
                </div>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">На перевірці</div>
                <div className="text-2xl font-bold text-purple-600">
                  {homework.filter(h => h.status === 'submitted').length}
                </div>
              </div>
              <div className="text-3xl">📤</div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedStatus === status.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <span className="text-lg">{status.icon}</span>
                <span>{status.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedStatus === status.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {status.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Homework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredHomework.map((hw) => (
            <HomeworkCard key={hw.id} homework={hw} onAction={handleAction} />
          ))}
        </div>

        {/* Empty State */}
        {filteredHomework.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Завдань не знайдено
            </h3>
            <p className="text-gray-600">
              В обраній категорії немає завдань. Спробуйте обрати іншу категорію.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
