'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/lib/useDictionary';
import { useSupabase } from '@/hooks/useSupabase';
import Form from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function ProfilePage() {
  const { dictionary, locale } = useDictionary();
  const { profile, session, supabase } = useSupabase();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push(`/${locale}/login`);
      return;
    }

    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setAge(profile.age?.toString() || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [session, profile, locale, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session?.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      let finalAvatarUrl = profile?.avatar_url || '';

      // Upload new avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
        } else {
          throw new Error('Ошибка загрузки аватара');
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          age: age ? parseInt(age) : null,
          avatar_url: finalAvatarUrl
        })
        .eq('id', session?.user.id);

      if (error) throw error;

      setMessage('Профиль успешно обновлен!');
      
      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  if (!session || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Мой профиль
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Avatar Section */}
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Аватар"
                width={120}
                height={120}
                className="rounded-full border-4 border-gray-200 object-cover"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                <span className="text-gray-500 text-sm">Нет фото</span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">Нажмите на иконку камеры, чтобы изменить фото</p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Имя"
            type="text"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Фамилия"
            type="text"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={profile.email}
          disabled
          className="bg-gray-100"
        />

        <Input
          label="Возраст"
          type="number"
          min="5"
          max="100"
          value={age}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
          placeholder="Введите ваш возраст"
        />

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Роль:</strong> {profile.role === 'student' ? 'Ученик' : profile.role === 'teacher' ? 'Учитель' : 'Администратор'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Дата регистрации:</strong> {new Date(profile.created_at).toLocaleDateString('ru-RU')}
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Сохраняем...' : 'Сохранить изменения'}
        </Button>
      </Form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push(`/${locale}/dashboard`)}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Вернуться в личный кабинет
        </button>
      </div>
    </div>
  );
}
