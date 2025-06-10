'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/hooks/useSupabase';
import ContentForm from '@/components/admin/ContentForm';

const CreateNewsPage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const [loading, setLoading] = useState(false);
  const { profile } = useSupabase();

  const handleSubmit = async (data: any) => {
    if (!profile?.id) {
      alert('Вы должны быть авторизованы для создания новости');
      return;
    }

    setLoading(true);
    const { title_uk, title_en, content_uk, content_en } = data;

    const { error } = await supabase
      .from('news')
      .insert({ 
        title_uk, 
        title_en, 
        content_uk, 
        content_en,
        author_id: profile.id,
        created_at: new Date().toISOString() 
      });

    if (error) {
      console.error('Error creating news:', error);
      alert('Ошибка при создании новости');
    } else {
      alert('Новость успешно создана');
      router.push(`/${locale}/admin/news`);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Создать новость</h1>
      <ContentForm type="news" onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateNewsPage;