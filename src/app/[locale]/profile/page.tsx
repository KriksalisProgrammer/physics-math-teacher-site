'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/lib/useDictionary';
import { useSupabase } from '@/hooks/useSupabase';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ProfilePage() {
  const { dictionary, locale } = useDictionary();
  const { profile, loading, updateProfile } = useSupabase();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);  const [formData, setFormData] = useState({
    first_name: '',
    last_name: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || ''
      });
    }
  }, [profile]);

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
    router.push(`/${locale}/login`);
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {dictionary.profile?.title || 'Профиль'}
            </h1>
            <p className="text-gray-600">
              {dictionary.profile?.personalInfo || 'Керуйте своєю особистою інформацією'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          {(profile.first_name?.[0] || profile.email[0]).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {profile.first_name ? `${profile.first_name} ${profile.last_name}` : profile.email}
                  </h2>
                  <Badge variant="info" className="mb-4 capitalize">
                    {profile.role}
                  </Badge>

                  <div className="space-y-3 text-sm">                    <div className="flex justify-between">
                      <span className="text-gray-600">{dictionary.auth?.email}</span>
                      <span className="font-medium">{profile.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{dictionary.profile?.registrationDate}</span>
                      <span className="font-medium">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {dictionary.common?.actions || 'Дії'}
                </h3>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m2-2V9a2 2 0 00-2-2m0 0V5a2 2 0 10-4 0v2m4 0H9" />
                    </svg>
                    {dictionary.profile?.changePassword || 'Змінити пароль'}
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V3h5v14z" />
                    </svg>
                    {dictionary.common?.download || 'Завантажити дані'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {dictionary.profile?.personalInfo || 'Особиста інформація'}
                  </h3>
                  <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={saving}
                    className={isEditing ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {dictionary.common?.saving || 'Збереження...'}
                      </>
                    ) : isEditing ? (
                      dictionary.common?.save || 'Зберегти'
                    ) : (
                      dictionary.common?.edit || 'Редагувати'
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary.profile?.firstName || "Ім'я"}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-3">{profile.first_name || '—'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary.profile?.lastName || 'Прізвище'}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-3">{profile.last_name || '—'}</p>
                    )}
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dictionary.auth?.email}
                    </label>
                    <p className="text-gray-900 py-3">{profile.email}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="secondary"
                      className="flex-1"
                    >
                      {dictionary.common?.cancel || 'Скасувати'}
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {dictionary.common?.saving || 'Збереження...'}
                        </>
                      ) : (
                        dictionary.common?.save || 'Зберегти'
                      )}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Account Settings */}
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {dictionary.profile?.accountSettings || 'Налаштування акаунту'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {dictionary.profile?.emailNotifications || 'Email сповіщення'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Отримувати сповіщення про уроки та новини
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {dictionary.profile?.marketingEmails || 'Маркетингові листи'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Отримувати пропозиції та акції
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
