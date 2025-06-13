'use client';

import { useState } from 'react';
import Link from 'next/link';
import AvatarUpload from '@/components/ui/AvatarUpload';
import { useNotifications } from '@/hooks/useNotifications';

interface ProfileMenuProps {
  profile: any;
  locale: string;
  onSignOut: () => void;
  onAvatarUpdate: (file: File) => Promise<void>;
}

const ProfileMenu = ({ profile, locale, onSignOut, onAvatarUpdate }: ProfileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showInfo } = useNotifications();

  // Если профиль еще не загрузился, показываем заглушку
  if (!profile) {
    return (
      <div className="flex items-center space-x-3 px-3 py-2 rounded-2xl backdrop-blur-sm bg-white/50 border border-white/30 shadow-lg">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-sm">?</span>
        </div>
        <span className="text-gray-600 text-sm">Завантаження...</span>
      </div>
    );
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { icon: '👑', label: 'Адміністратор', color: 'text-red-600' };
      case 'teacher':
        return { icon: '🎓', label: 'Викладач', color: 'text-blue-600' };
      case 'student':
      default:
        return { icon: '📚', label: 'Студент', color: 'text-green-600' };
    }
  };

  const roleInfo = getRoleInfo(profile.role);
  const userName = profile.first_name || profile.email?.split('@')[0] || 'Користувач';

  const handleNotificationsClick = () => {
    setIsMenuOpen(false);
    showInfo('Сповіщення', 'У вас 3 нових сповіщення', 3000);
  };

  return (
    <div className="relative">      {/* Profile Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-2xl backdrop-blur-sm bg-white/50 border border-white/30 hover:bg-white/80 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-lift hover-glow"
      >
        {/* Avatar */}
        <AvatarUpload
          currentAvatar={profile.avatar_url}
          onAvatarChange={onAvatarUpdate}
          size="small"
          userName={userName}
        />
        
        {/* User Info */}
        <div className="text-left hidden md:block">
          <div className="text-sm font-semibold text-gray-800">
            {userName}
          </div>
          <div className={`text-xs ${roleInfo.color} flex items-center`}>
            <span className="mr-1">{roleInfo.icon}</span>
            {roleInfo.label}
          </div>
        </div>
        
        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
                <AvatarUpload
                  currentAvatar={profile.avatar_url}
                  onAvatarChange={onAvatarUpdate}
                  size="large"
                  userName={userName}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {profile.first_name && profile.last_name 
                      ? `${profile.first_name} ${profile.last_name}` 
                      : userName}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                  <div className={`inline-flex items-center text-sm ${roleInfo.color} font-medium mt-1`}>
                    <span className="mr-1">{roleInfo.icon}</span>
                    {roleInfo.label}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <Link 
                  href={`/${locale}/profile`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Мій профіль</div>
                    <div className="text-sm text-gray-500">Налаштування та особисті дані</div>
                  </div>
                </Link>

                <Link 
                  href={`/${locale}/dashboard`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Дашборд</div>
                    <div className="text-sm text-gray-500">Огляд активності та статистика</div>
                  </div>
                </Link>

                <button 
                  onClick={handleNotificationsClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-yellow-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors relative">
                    <span className="text-lg">🔔</span>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      3
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Сповіщення</div>
                    <div className="text-sm text-gray-500">3 нових повідомлення</div>
                  </div>
                </button>

                <Link 
                  href={`/${locale}/calendar`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-lg">📅</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Календар</div>
                    <div className="text-sm text-gray-500">Розклад занять та події</div>
                  </div>
                </Link>

                <Link 
                  href={`/${locale}/chat`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <span className="text-lg">💬</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Повідомлення</div>
                    <div className="text-sm text-gray-500">Чат з викладачами</div>
                  </div>
                </Link>

                {/* Admin Panel для admin/teacher */}
                {(profile.role === 'admin' || profile.role === 'teacher') && (
                  <Link 
                    href={`/${locale}/admin`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <span className="text-lg">⚙️</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Адмін-панель</div>
                      <div className="text-sm text-gray-500">Управління системою</div>
                    </div>
                  </Link>
                )}

                {/* Divider */}
                <hr className="my-4" />

                {/* Settings */}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <span className="text-lg">⚙️</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Налаштування</div>
                    <div className="text-sm text-gray-500">Загальні налаштування</div>
                  </div>
                </button>

                {/* Sign Out */}
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <span className="text-lg">🚪</span>
                  </div>
                  <div>
                    <div className="font-medium text-red-600">Вийти</div>
                    <div className="text-sm text-gray-500">Завершити сеанс</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
