import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/utils/formatDate';
import { Database } from '@/types/database.types';
import { getDictionary } from '@/lib/dictionaries';

// Generate metadata
export async function generateMetadata({ 
  params: { locale } 
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.lessons?.title || dictionary.common.lessons,
    description: dictionary.lessons?.description || ''
  };
}

// Main Lessons Page component
export default async function LessonsPage({ 
  params: { locale } 
}: {
  params: { locale: string }
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
  
  // Fetch all lessons
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching lessons:', error);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{dictionary.lessons?.title || dictionary.common.lessons}</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{dictionary.common.error_fetching}</p>
        </div>
      )}
      
      {lessons?.length === 0 && (
        <p className="text-center text-gray-500 py-8">{dictionary.lessons?.no_lessons || 'No lessons available'}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons && lessons.map((lesson: Database['public']['Tables']['lessons']['Row']) => (
          <Card
            key={lesson.id}
            className="flex flex-col h-full transition-transform transform hover:scale-[1.02]"
            title={locale === 'uk' ? lesson.title_uk : lesson.title_en}
          >
            <div className="flex-grow">
              <p className="text-sm text-gray-500 mb-2">
                {formatDate(lesson.created_at, locale)}
              </p>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {locale === 'uk' ? lesson.description_uk : lesson.description_en}
              </p>
            </div>
            <div className="mt-auto">
              <Link 
                href={`/${locale}/lessons/${lesson.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors w-full text-center"
              >
                {dictionary.common.read_more}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}