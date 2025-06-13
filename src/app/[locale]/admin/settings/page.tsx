'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export const dynamic = 'force-dynamic';

interface Settings {
  site: {
    title: string;
    description: string;
    logo_url: string;
    contact_email: string;
    phone: string;
    address: string;
  };
  features: {
    registration_enabled: boolean;
    chat_enabled: boolean;
    notifications_enabled: boolean;
    file_uploads_enabled: boolean;
    video_calls_enabled: boolean;
    blog_comments_enabled: boolean;
  };
  limits: {
    max_file_size: number;
    max_users: number;
    max_lessons_per_teacher: number;
    session_timeout: number;
  };
  integrations: {
    google_meet_enabled: boolean;
    zoom_enabled: boolean;
    google_calendar_enabled: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
  };
}

const SettingCard = ({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
    {children}
  </div>
);

const ToggleSwitch = ({ enabled, onChange, label }: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function AdminSettingsPage() {
  const { dictionary: dict, locale } = useDictionary();
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const router = useRouter();
  
  const [settings, setSettings] = useState<Settings>({
    site: {
      title: 'Вчитель фізики та математики',
      description: 'Онлайн платформа для навчання фізики та математики',
      logo_url: '',
      contact_email: 'info@teacher-website.com',
      phone: '+380123456789',
      address: 'Київ, Україна'
    },
    features: {
      registration_enabled: true,
      chat_enabled: true,
      notifications_enabled: true,
      file_uploads_enabled: true,
      video_calls_enabled: true,
      blog_comments_enabled: true
    },
    limits: {
      max_file_size: 10,
      max_users: 1000,
      max_lessons_per_teacher: 50,
      session_timeout: 60
    },
    integrations: {
      google_meet_enabled: true,
      zoom_enabled: false,
      google_calendar_enabled: true,
      email_notifications: true,
      sms_notifications: false
    }
  });
  
  const [activeTab, setActiveTab] = useState('site');
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    if (profile?.role !== 'admin') {
      showError('Помилка доступу', 'У вас немає доступу до цієї сторінки');
      router.push(`/${locale}/dashboard`);
      return;
    }

    loadSettings();
  }, [isAuthenticated, profile, loading, locale, router]);

  const loadSettings = async () => {
    try {
      setLoadingSettings(true);
      // Тут буде реальний API запрос
      // Пока используем моковые данные
      setLoadingSettings(false);
    } catch (error) {
      showError('Помилка завантаження', 'Помилка завантаження налаштувань');
      setLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // Тут буде реальний API запрос для збереження
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      showSuccess('Успіх', 'Налаштування успішно збережено!');
    } catch (error) {
      showError('Помилка збереження', 'Помилка збереження налаштувань');
    } finally {
      setSaving(false);
    }
  };

  const updateSiteSetting = (field: keyof Settings['site'], value: string) => {
    setSettings(prev => ({
      ...prev,
      site: { ...prev.site, [field]: value }
    }));
  };

  const updateFeatureSetting = (field: keyof Settings['features'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: { ...prev.features, [field]: value }
    }));
  };

  const updateLimitSetting = (field: keyof Settings['limits'], value: number) => {
    setSettings(prev => ({
      ...prev,
      limits: { ...prev.limits, [field]: value }
    }));
  };

  const updateIntegrationSetting = (field: keyof Settings['integrations'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      integrations: { ...prev.integrations, [field]: value }
    }));
  };

  if (loading || loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження налаштувань...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'site', name: 'Сайт', icon: '🌐' },
    { id: 'features', name: 'Функції', icon: '⚡' },
    { id: 'limits', name: 'Обмеження', icon: '📊' },
    { id: 'integrations', name: 'Інтеграції', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">⚙️ Налаштування системи</h1>
              <p className="text-gray-600">Конфігурація платформи та інтеграцій</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={saveSettings}
                disabled={saving}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  saving
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {saving ? 'Збереження...' : '💾 Зберегти'}
              </button>
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

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          
          {/* Site Settings */}
          {activeTab === 'site' && (
            <SettingCard
              title="🌐 Налаштування сайту"
              description="Основна інформація про платформу"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Назва сайту</label>
                  <input
                    type="text"
                    value={settings.site.title}
                    onChange={(e) => updateSiteSetting('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Опис</label>
                  <textarea
                    value={settings.site.description}
                    onChange={(e) => updateSiteSetting('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email для зв'язку</label>
                    <input
                      type="email"
                      value={settings.site.contact_email}
                      onChange={(e) => updateSiteSetting('contact_email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={settings.site.phone}
                      onChange={(e) => updateSiteSetting('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Адреса</label>
                  <input
                    type="text"
                    value={settings.site.address}
                    onChange={(e) => updateSiteSetting('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </SettingCard>
          )}

          {/* Features Settings */}
          {activeTab === 'features' && (
            <SettingCard
              title="⚡ Функції платформи"
              description="Увімкнення/вимкнення різних можливостей"
            >
              <div className="space-y-2">
                <ToggleSwitch
                  enabled={settings.features.registration_enabled}
                  onChange={(value) => updateFeatureSetting('registration_enabled', value)}
                  label="Реєстрація нових користувачів"
                />
                <ToggleSwitch
                  enabled={settings.features.chat_enabled}
                  onChange={(value) => updateFeatureSetting('chat_enabled', value)}
                  label="Чат та повідомлення"
                />
                <ToggleSwitch
                  enabled={settings.features.notifications_enabled}
                  onChange={(value) => updateFeatureSetting('notifications_enabled', value)}
                  label="Push-уведомлення"
                />
                <ToggleSwitch
                  enabled={settings.features.file_uploads_enabled}
                  onChange={(value) => updateFeatureSetting('file_uploads_enabled', value)}
                  label="Завантаження файлів"
                />
                <ToggleSwitch
                  enabled={settings.features.video_calls_enabled}
                  onChange={(value) => updateFeatureSetting('video_calls_enabled', value)}
                  label="Відеодзвінки"
                />
                <ToggleSwitch
                  enabled={settings.features.blog_comments_enabled}
                  onChange={(value) => updateFeatureSetting('blog_comments_enabled', value)}
                  label="Коментарі до блогу"
                />
              </div>
            </SettingCard>
          )}

          {/* Limits Settings */}
          {activeTab === 'limits' && (
            <SettingCard
              title="📊 Обмеження системи"
              description="Налаштування лімітів та квот"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Максимальний розмір файлу (МБ)</label>
                  <input
                    type="number"
                    value={settings.limits.max_file_size}
                    onChange={(e) => updateLimitSetting('max_file_size', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Максимальна кількість користувачів</label>
                  <input
                    type="number"
                    value={settings.limits.max_users}
                    onChange={(e) => updateLimitSetting('max_users', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Максимум уроків на викладача</label>
                  <input
                    type="number"
                    value={settings.limits.max_lessons_per_teacher}
                    onChange={(e) => updateLimitSetting('max_lessons_per_teacher', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тайм-аут сесії (хвилини)</label>
                  <input
                    type="number"
                    value={settings.limits.session_timeout}
                    onChange={(e) => updateLimitSetting('session_timeout', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </SettingCard>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <SettingCard
              title="🔗 Інтеграції та сервіси"
              description="Підключення зовнішніх сервісів"
            >
              <div className="space-y-2">
                <ToggleSwitch
                  enabled={settings.integrations.google_meet_enabled}
                  onChange={(value) => updateIntegrationSetting('google_meet_enabled', value)}
                  label="Google Meet"
                />
                <ToggleSwitch
                  enabled={settings.integrations.zoom_enabled}
                  onChange={(value) => updateIntegrationSetting('zoom_enabled', value)}
                  label="Zoom"
                />
                <ToggleSwitch
                  enabled={settings.integrations.google_calendar_enabled}
                  onChange={(value) => updateIntegrationSetting('google_calendar_enabled', value)}
                  label="Google Calendar"
                />
                <ToggleSwitch
                  enabled={settings.integrations.email_notifications}
                  onChange={(value) => updateIntegrationSetting('email_notifications', value)}
                  label="Email уведомлення"
                />
                <ToggleSwitch
                  enabled={settings.integrations.sms_notifications}
                  onChange={(value) => updateIntegrationSetting('sms_notifications', value)}
                  label="SMS уведомлення"
                />
              </div>
            </SettingCard>
          )}
        </div>
      </div>
    </div>
  );
}
