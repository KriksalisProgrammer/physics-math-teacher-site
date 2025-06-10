import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/dictionaries';
import { formatDate } from '@/utils/formatDate';
import MeetingLink from '@/components/lessons/MeetingLink';
import { Database } from '@/types/database.types';
import { renderMarkdown } from '@/utils/markdown';

// Generate metadata
export async function generateMetadata({ 
  params: { locale, id } 
}: {
  params: { locale: string, id: string }
}): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  const cookieStore = cookies();
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  // Fetch the lesson
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();
    
  if (!lesson) {
    return {
      title: 'Lesson not found'
    };
  }

  return {
    title: locale === 'uk' ? lesson.title_uk : lesson.title_en,
    description: locale === 'uk' ? lesson.description_uk : lesson.description_en
  };
}

// Main Lesson Page component
export default async function LessonPage({ 
  params: { locale, id } 
}: {
  params: { locale: string, id: string }
}) {
  const dictionary = await getDictionary(locale);
  const cookieStore = cookies();
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  // Fetch the lesson
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();
  
  // Return 404 if lesson not found
  if (error || !lesson) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={`/${locale}/lessons`}
          className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
        >
          <span>←</span>
          <span>{dictionary.common.back_to_home}</span>
        </Link>
      </div>
      
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">
            {locale === 'uk' ? lesson.title_uk : lesson.title_en}
          </h1>
          
          <div className="text-sm text-gray-500 mb-6">
            {formatDate(lesson.created_at, locale)}
          </div>
          
          {(locale === 'uk' ? lesson.description_uk : lesson.description_en) && (
            <div className="mb-6 text-lg font-medium text-gray-700">
              {locale === 'uk' ? lesson.description_uk : lesson.description_en}
            </div>
          )}
          
          <MeetingLink 
            meetingLink={lesson.meeting_link}
            title={locale === 'uk' ? lesson.title_uk : lesson.title_en}
          />
           {(locale === 'uk' ? lesson.content_uk : lesson.content_en) && (
            <div className="prose max-w-none mt-6">
              {renderMarkdown(locale === 'uk' ? lesson.content_uk || '' : lesson.content_en || '')}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}