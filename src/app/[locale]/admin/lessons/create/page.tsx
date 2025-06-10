'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/hooks/useSupabase';
import { useDictionary } from '@/lib/useDictionary';

const CreateLessonPage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const { dictionary } = useDictionary();
  const { profile } = useSupabase();
  
  const [title_uk, setTitleUk] = useState('');
  const [title_en, setTitleEn] = useState('');
  const [description_uk, setDescriptionUk] = useState('');
  const [description_en, setDescriptionEn] = useState('');
  const [meeting_link, setMeetingLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!profile?.id) {
      setError('Вы должны быть авторизованы для создания урока');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('lessons')
        .insert({ 
          title_uk, 
          title_en, 
          description_uk, 
          description_en,
          meeting_link,
          author_id: profile.id
        });
        
      if (supabaseError) throw supabaseError;
      
      // Перенаправление на страницу со списком уроков
      router.push(`/${locale}/admin/lessons`);
    } catch (err: any) {
      setError(err?.message || 'Произошла ошибка при создании урока');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Создать урок</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="mb-4">
          <label htmlFor="title_uk" className="block mb-2 font-medium">
            Название урока (UK)
          </label>
          <input
            id="title_uk"
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={title_uk}
            onChange={(e) => setTitleUk(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="title_en" className="block mb-2 font-medium">
            Название урока (EN)
          </label>
          <input
            id="title_en"
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={title_en}
            onChange={(e) => setTitleEn(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description_uk" className="block mb-2 font-medium">
            Описание урока (UK)
          </label>
          <textarea
            id="description_uk"
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            value={description_uk}
            onChange={(e) => setDescriptionUk(e.target.value)}
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description_en" className="block mb-2 font-medium">
            Описание урока (EN)
          </label>
          <textarea
            id="description_en"
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            value={description_en}
            onChange={(e) => setDescriptionEn(e.target.value)}
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="meeting_link" className="block mb-2 font-medium">
            Ссылка на видео-занятие (Google Meet/Zoom)
          </label>
          <input
            id="meeting_link"
            type="url"
            className="w-full border border-gray-300 rounded p-2"
            value={meeting_link}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Создать'}
        </button>
      </form>
    </div>
  );
};

export default CreateLessonPage;