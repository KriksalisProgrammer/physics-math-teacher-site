import { supabase } from '@/lib/supabase';
import { getDictionary } from '@/lib/dictionaries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { renderMarkdown } from '@/utils/markdown';

// Динамическая генерация метаданных
export async function generateMetadata({ 
  params: { id, locale } 
}: { 
  params: { id: string, locale: string } 
}) {
  const newsItem = await getNewsItem(id);
  if (!newsItem) return { title: 'News Not Found' };
  
  const title = locale === 'uk' ? newsItem.title_uk : newsItem.title_en;
  return {
    title: `${title} | News`,
    description: (locale === 'uk' ? newsItem.content_uk : newsItem.content_en).substring(0, 160),
  };
}

// Получение данных новости по ID
async function getNewsItem(id: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*, profiles(first_name, last_name)')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching news:', error);
    return null;
  }
  
  return data;
}

export default async function NewsPage({
  params: { id, locale }
}: {
  params: { id: string, locale: string }
}) {
  const newsItem = await getNewsItem(id);
  const { common } = await getDictionary(locale);
  
  if (!newsItem) {
    notFound();
  }
  
  // Выбор языковой версии контента
  const title = locale === 'uk' ? newsItem.title_uk : newsItem.title_en;
  const content = locale === 'uk' ? newsItem.content_uk : newsItem.content_en;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        href={`/${locale}/news`}
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← {locale === 'uk' ? 'Назад до новин' : 'Back to news'}
      </Link>
      
      <article className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        
        <div className="text-gray-600 mb-8">
          <time dateTime={newsItem.created_at}>{formatDate(newsItem.created_at, locale)}</time>
          {newsItem.profiles && (
            <span> {common.by} {newsItem.profiles.first_name} {newsItem.profiles.last_name}</span>
          )}
        </div>
        
        <div className="mb-8">
          {renderMarkdown(content)}
        </div>
      </article>
    </div>
  );
}