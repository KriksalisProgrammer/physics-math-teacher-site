'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/hooks/useSupabase';
import ContentForm from '@/components/admin/ContentForm';

const CreatePostPage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useSupabase();

  const handleSubmit = async (data: any) => {
    if (!profile?.id) {
      setError("Вы должны быть авторизованы для создания поста");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { title_uk, title_en, content_uk, content_en } = data;

      const { error } = await supabase
        .from('posts')
        .insert({ 
          title_uk, 
          title_en, 
          content_uk, 
          content_en, 
          author_id: profile.id,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        setError(error.message || String(error));
      } else {
        router.push(`/${locale}/admin/posts`);
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при создании поста');
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Создать новую публикацию</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ContentForm 
        type="post"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreatePostPage;