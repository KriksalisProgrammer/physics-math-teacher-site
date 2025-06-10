'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lesson } from '@/types/lessons';
import { useDictionary } from '@/lib/useDictionary';

const LessonPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { dictionary } = useDictionary();

  useEffect(() => {
    const fetchLesson = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching lesson:', error);
        } else {
          setLesson(data);
        }
      }
    };

    fetchLesson();
  }, [id]);

  if (!lesson) {
    return <div>{dictionary.common?.loading || 'Loading...'}</div>;
  }

  const title = lesson.title_uk || lesson.title_en;
  const content = lesson.content_uk || lesson.content_en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {content && (
          <div className="prose max-w-none mb-6">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
        
        {lesson.meeting_link && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {dictionary.lessons?.meeting_link || 'Meeting Link'}:
            </h3>
            <a 
              href={lesson.meeting_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {lesson.meeting_link}
            </a>
          </div>
        )}
        
        <div className="text-sm text-gray-500 border-t pt-4">
          <p>
            {dictionary.common?.created_at || 'Created'}: {new Date(lesson.created_at).toLocaleDateString()}
          </p>
          {lesson.profiles && (
            <p>
              {dictionary.common?.author || 'Author'}: {lesson.profiles.first_name} {lesson.profiles.last_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;