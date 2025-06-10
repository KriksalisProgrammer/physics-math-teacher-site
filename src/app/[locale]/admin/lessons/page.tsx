'use client';

import { useEffect, useState } from 'react';
import { useDictionary } from '@/lib/useDictionary';
import { supabase } from '@/lib/supabase';
import ContentForm from '@/components/admin/ContentForm';
import AdminLayout from '@/components/layouts/AdminLayout';
import { SupabaseLesson } from '@/types/supabase';

const LessonsPage = () => {
  const { dictionary, locale } = useDictionary();
  const [lessons, setLessons] = useState<SupabaseLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching lessons:', error);
      } else {
        setLessons((data ?? []) as SupabaseLesson[]);
      }
      setLoading(false);
    };
    fetchLessons();
  }, []);

  if (loading) {
    return <div>{dictionary.common.loading}</div>;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">{locale === 'uk' ? 'Уроки' : 'Lessons'}</h1>
      <ContentForm type="lesson" />
      <ul className="mt-4">
        {lessons.map((lesson: SupabaseLesson) => (
          <li key={lesson.id} className="border-b py-2">
            <a href={`/admin/lessons/${lesson.id}`} className="text-blue-600 hover:underline">
              {lesson.title_uk || lesson.title_en}
            </a>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default LessonsPage;

// Проверьте, что импорты Button, Input, Form идут как default, а не именованные. Исправьте типы onChange для Input, если есть. Исправьте значения пропсов Button/Input, если есть.