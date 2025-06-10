import { supabase } from '../../../lib/supabase';
import { getDictionary } from '@/lib/dictionaries';
import { SupabaseNews } from '@/types/supabase';
import NewsCard from '../../../components/news/NewsCard';
import Link from 'next/link';

export const metadata = {
  title: 'News | Teacher Website',
  description: 'Latest news about physics and mathematics',
};

async function getNews(): Promise<SupabaseNews[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }
  
  return data || [];
}

export default async function NewsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const news = await getNews();
  const { common } = await getDictionary(locale);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{common.news}</h1>
        <p className="text-gray-600">{common.latest_news}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.length > 0 ? (
          news.map((item: SupabaseNews) => (
            <NewsCard key={item.id} news={item} locale={locale} />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500 mb-4">{common.no_news_yet}</p>
            <Link href={`/${locale}`} className="text-blue-600 hover:underline">
              {common.back_to_home}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}