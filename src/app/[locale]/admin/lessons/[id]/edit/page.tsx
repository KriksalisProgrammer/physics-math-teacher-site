'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDictionary } from '@/lib/useDictionary';
import { supabase } from '@/lib/supabase';
import ContentForm from '@/components/admin/ContentForm';
import type { ContentFormData, DatabaseContentTypes } from '@/types/forms';
import type { Database } from '@/types/database.types';

type LessonType = Database['public']['Tables']['lessons']['Row'];

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const { dictionary, locale } = useDictionary();
  const id = params?.id as string;
  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('lessons')
          .select('*, profiles(first_name, last_name)')
          .eq('id', id)
          .single();

        if (error) {
          setError(dictionary.common.error_fetching || 'Error fetching lesson');
        } else {
          setLesson(data);
        }
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id, dictionary.common.error_fetching]);

  const handleUpdate = async (formData: ContentFormData) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      router.refresh();
      router.push('/admin/lessons');
    } catch (error) {
      console.error('Error:', error);
      setError(dictionary.common.error_updating || 'Error updating lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">{dictionary.common.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">{dictionary.common.not_found}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {dictionary.admin?.form?.edit_lesson || 'Edit Lesson'}
      </h1>
      <ContentForm
        type="lesson"
        initialContent={{
          ...lesson,
          description_uk: lesson.description_uk ?? undefined,
          description_en: lesson.description_en ?? undefined,
          content_uk: lesson.content_uk ?? undefined,
          content_en: lesson.content_en ?? undefined,
          meeting_link: lesson.meeting_link ?? undefined
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
}