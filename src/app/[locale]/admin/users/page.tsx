'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export const dynamic = 'force-dynamic';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
  created_at: string;
  last_sign_in?: string;
  is_active: boolean;
}

const UserCard = ({ user, onRoleChange, onToggleStatus }: {
  user: User;
  onRoleChange: (userId: string, newRole: string) => void;
  onToggleStatus: (userId: string) => void;
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'teacher': return '🎓';
      default: return '📚';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                (user.first_name?.[0] || user.email[0]).toUpperCase()
              )}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.email.split('@')[0]
              }
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500">
              Зареєстрований: {new Date(user.created_at).toLocaleDateString('uk-UA')}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${user.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
          {user.is_active ? '✅ Активний' : '❌ Неактивний'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
          {getRoleIcon(user.role)} {user.role === 'admin' ? 'Адміністратор' : user.role === 'teacher' ? 'Викладач' : 'Студент'}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={user.role}
            onChange={(e) => onRoleChange(user.id, e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="student">Студент</option>
            <option value="teacher">Викладач</option>
            <option value="admin">Адміністратор</option>
          </select>
          
          <button
            onClick={() => onToggleStatus(user.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              user.is_active 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {user.is_active ? 'Деактивувати' : 'Активувати'}
          </button>
        </div>
      </div>

      {user.last_sign_in && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Останній вхід: {new Date(user.last_sign_in).toLocaleString('uk-UA')}
          </p>
        </div>
      )}
    </div>
  );
};

export default function AdminUsersPage() {
  const { dictionary: dict, locale } = useDictionary();
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { showSuccess, showError, showInfo } = useNotifications();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(true);

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

    loadUsers();
  }, [isAuthenticated, profile, loading, locale, router]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      // Тут буде реальний API запрос
      // Пока используем моковые данные
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'student1@example.com',
          first_name: 'Іван',
          last_name: 'Петренко',
          role: 'student',
          created_at: '2024-01-15T10:00:00Z',
          last_sign_in: '2024-12-15T14:30:00Z',
          is_active: true
        },
        {
          id: '2',
          email: 'teacher1@example.com',
          first_name: 'Марія',
          last_name: 'Коваленко',
          role: 'teacher',
          created_at: '2024-02-20T12:00:00Z',
          last_sign_in: '2024-12-14T16:45:00Z',
          is_active: true
        },
        {
          id: '3',
          email: 'admin@example.com',
          first_name: 'Олександр',
          last_name: 'Сидоренко',
          role: 'admin',
          created_at: '2024-01-01T09:00:00Z',
          last_sign_in: '2024-12-15T08:20:00Z',
          is_active: true
        },
        {
          id: '4',
          email: 'inactive@example.com',
          first_name: 'Петро',
          last_name: 'Іваненко',
          role: 'student',
          created_at: '2024-03-10T11:30:00Z',
          is_active: false
        }
      ];
        setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      showError('Помилка завантаження', 'Помилка завантаження користувачів');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => 
        filterStatus === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterStatus]);
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Тут буде реальний API запрос
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ));
      showSuccess('Успіх', `Роль користувача оновлено на "${newRole}"`);
    } catch (error) {
      showError('Помилка', 'Помилка оновлення ролі користувача');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      // Тут буде реальний API запрос
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !user.is_active } : user
      ));
      const user = users.find(u => u.id === userId);
      showSuccess('Успіх', `Користувач ${user?.is_active ? 'деактивований' : 'активований'}`);
    } catch (error) {
      showError('Помилка', 'Помилка зміни статусу користувача');
    }
  };

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження користувачів...</p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const teacherCount = users.filter(u => u.role === 'teacher').length;
  const studentCount = users.filter(u => u.role === 'student').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Керування користувачами</h1>
              <p className="text-gray-600">Управління ролями та статусом користувачів платформи</p>
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Всього користувачів</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Активних</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Викладачів</p>
                <p className="text-3xl font-bold text-blue-600">{teacherCount}</p>
              </div>
              <div className="text-4xl">🎓</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Студентів</p>
                <p className="text-3xl font-bold text-purple-600">{studentCount}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пошук</label>
              <input
                type="text"
                placeholder="Пошук за ім'ям або email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Роль</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Всі ролі</option>
                <option value="admin">Адміністратори</option>
                <option value="teacher">Викладачі</option>
                <option value="student">Студенти</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Всі статуси</option>
                <option value="active">Активні</option>
                <option value="inactive">Неактивні</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('all');
                  setFilterStatus('all');
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Скинути фільтри
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onRoleChange={handleRoleChange}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Користувачів не знайдено</h3>
            <p className="text-gray-600">Спробуйте змінити параметри пошуку або фільтри</p>
          </div>
        )}
      </div>
    </div>
  );
}
