'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { useDictionary } from '@/lib/useDictionary';

type News = Database['public']['Tables']['news']['Row'];

const NewsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { dictionary, locale } = useDictionary();
  const id = params?.id as string;
  const [newsItem, setNewsItem] = useState<News | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching news:', error);
        } else {
          setNewsItem(data);
        }
      }
    };

    fetchNews();
  }, [id]);

  if (!newsItem) {
    return <div>{dictionary.common?.loading || 'Loading...'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{newsItem.title_uk || newsItem.title_en}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="prose max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: newsItem.content_uk || newsItem.content_en || '' }} />
        </div>
        <div className="text-sm text-gray-500 border-t pt-4">
          <p>{dictionary.common?.created_at || 'Published on'}: {new Date(newsItem.created_at).toLocaleDateString()}</p>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => router.push(`/${locale}/admin/news/${id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {dictionary.admin?.form?.edit || 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;