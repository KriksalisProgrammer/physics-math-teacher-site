'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export const dynamic = 'force-dynamic';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'special';
  category: 'learning' | 'teaching' | 'community' | 'special';
  points: number;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  requirement?: string;
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'special': return 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚';
      case 'teaching': return '🎓';
      case 'community': return '👥';
      case 'special': return '⭐';
      default: return '🏆';
    }
  };

  return (
    <div className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      achievement.unlocked 
        ? 'bg-white border-green-200 shadow-lg' 
        : 'bg-gray-50 border-gray-200 opacity-75'
    }`}>
      
      {/* Unlock Status Badge */}
      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
        achievement.unlocked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
      }`}>
        {achievement.unlocked ? '✓' : '🔒'}
      </div>

      {/* Main Content */}
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">{achievement.icon}</div>
        <h3 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
          {achievement.title}
        </h3>
        <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {achievement.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(achievement.type)}`}>
          {achievement.type.toUpperCase()}
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm">{getCategoryIcon(achievement.category)}</span>
          <span className={`text-sm font-medium ${achievement.unlocked ? 'text-blue-600' : 'text-gray-400'}`}>
            {achievement.points} балів
          </span>
        </div>
      </div>

      {/* Progress Bar (if not unlocked) */}
      {!achievement.unlocked && achievement.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Прогрес</span>
            <span>{achievement.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${achievement.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Unlock Date or Requirement */}
      {achievement.unlocked && achievement.unlocked_at ? (
        <div className="text-xs text-green-600 text-center">
          Отримано: {new Date(achievement.unlocked_at).toLocaleDateString('uk-UA')}
        </div>
      ) : achievement.requirement ? (
        <div className="text-xs text-gray-500 text-center">
          {achievement.requirement}
        </div>
      ) : null}
    </div>
  );
};

export default function AchievementsPage() {
  const { dictionary: dict, locale } = useDictionary();
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { showError } = useNotifications();
  const router = useRouter();
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    loadAchievements();
  }, [isAuthenticated, loading, locale, router]);

  const loadAchievements = async () => {
    try {
      setLoadingAchievements(true);
      
      // Моковые данные достижений
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'Перший урок',
          description: 'Завершіть свій перший урок',
          icon: '🎯',
          type: 'bronze',
          category: 'learning',
          points: 10,
          unlocked: true,
          unlocked_at: '2024-11-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Студент тижня',
          description: 'Завершіть 5 уроків за тиждень',
          icon: '📚',
          type: 'silver',
          category: 'learning',
          points: 50,
          unlocked: true,
          unlocked_at: '2024-11-20T14:22:00Z'
        },
        {
          id: '3',
          title: 'Фізик-початківець',
          description: 'Завершіть 10 уроків з фізики',
          icon: '⚡',
          type: 'gold',
          category: 'learning',
          points: 100,
          unlocked: false,
          progress: 60,
          requirement: 'Завершіть 4 більше уроків з фізики'
        },
        {
          id: '4',
          title: 'Математичний геній',
          description: 'Набрайте 95%+ в 5 тестах з математики',
          icon: '🧮',
          type: 'platinum',
          category: 'learning',
          points: 200,
          unlocked: false,
          progress: 20,
          requirement: 'Набрайте високі бали в тестах'
        },
        {
          id: '5',
          title: 'Активний учасник',
          description: 'Залиште 50 коментарів',
          icon: '💬',
          type: 'silver',
          category: 'community',
          points: 75,
          unlocked: false,
          progress: 34,
          requirement: 'Залиште ще 33 коментарі'
        },
        {
          id: '6',
          title: 'Ментор',
          description: 'Допоможіть 10 студентам',
          icon: '🤝',
          type: 'gold',
          category: 'teaching',
          points: 150,
          unlocked: false,
          progress: 0,
          requirement: 'Доступно тільки для викладачів'
        },
        {
          id: '7',
          title: 'Перший рік',
          description: 'Використовуйте платформу протягом року',
          icon: '🎂',
          type: 'special',
          category: 'special',
          points: 365,
          unlocked: false,
          progress: 85,
          requirement: 'Ще 2 місяці до річниці'
        },
        {
          id: '8',
          title: 'Рання пташка',
          description: 'Завершіть урок до 8:00 ранку',
          icon: '🌅',
          type: 'bronze',
          category: 'special',
          points: 25,
          unlocked: true,
          unlocked_at: '2024-12-01T07:45:00Z'
        }
      ];
      
      setAchievements(mockAchievements);
      setFilteredAchievements(mockAchievements);    } catch (error) {
      showError('Помилка', 'Не вдалося завантажити досягнення');
    } finally {
      setLoadingAchievements(false);
    }
  };

  useEffect(() => {
    let filtered = achievements;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(a => a.type === selectedType);
    }

    if (showUnlockedOnly) {
      filtered = filtered.filter(a => a.unlocked);
    }

    setFilteredAchievements(filtered);
  }, [achievements, selectedCategory, selectedType, showUnlockedOnly]);

  if (loading || loadingAchievements) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження досягнень...</p>
        </div>
      </div>
    );
  }

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const completionRate = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Мої досягнення</h1>
              <p className="text-gray-600">Відстежуйте свій прогрес та отримуйте нагороди</p>
            </div>
            <Link 
              href={`/${locale}/dashboard`}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span>←</span>
              <span>Назад до панелі</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Всього досягнень</p>
                <p className="text-3xl font-bold text-gray-900">{unlockedAchievements}/{totalAchievements}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Загальні бали</p>
                <p className="text-3xl font-bold text-blue-600">{totalPoints}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Завершено</p>
                <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Рейтинг</p>
                <p className="text-3xl font-bold text-purple-600">
                  {totalPoints >= 500 ? 'Експерт' :
                   totalPoints >= 200 ? 'Просунутий' :
                   totalPoints >= 50 ? 'Активний' : 'Новачок'}
                </p>
              </div>
              <div className="text-4xl">
                {totalPoints >= 500 ? '👑' :
                 totalPoints >= 200 ? '🥇' :
                 totalPoints >= 50 ? '🥈' : '🥉'}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Категорія</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Всі категорії</option>
                <option value="learning">📚 Навчання</option>
                <option value="teaching">🎓 Викладання</option>
                <option value="community">👥 Спільнота</option>
                <option value="special">⭐ Спеціальні</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Всі типи</option>
                <option value="bronze">🥉 Бронзові</option>
                <option value="silver">🥈 Срібні</option>
                <option value="gold">🥇 Золоті</option>
                <option value="platinum">💎 Платинові</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnlockedOnly}
                  onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Тільки отримані</span>
              </label>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setShowUnlockedOnly(false);
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Скинути фільтри
              </button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Загальний прогрес</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Завершено: {unlockedAchievements} з {totalAchievements}</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Досягнень не знайдено</h3>
            <p className="text-gray-600">Спробуйте змінити параметри фільтрації</p>
          </div>
        )}
      </div>
    </div>
  );
}
