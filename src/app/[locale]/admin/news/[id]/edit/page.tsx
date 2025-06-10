'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ContentForm from '@/components/admin/ContentForm';
import { Database } from '@/types/database.types';
import { ContentFormData } from '@/types/forms';

type News = Database['public']['Tables']['news']['Row'];

const EditNewsPage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching news item:', error);
        } else {
          setNewsItem(data);
        }
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  const handleUpdate = async (formData: ContentFormData) => {
    const { error } = await supabase
      .from('news')
      .update({
        title_uk: formData.title_uk,
        title_en: formData.title_en,
        content_uk: formData.content_uk || undefined,
        content_en: formData.content_en || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating news item:', error);
    } else {
      router.push(`/${locale}/admin/news`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit News</h1>
      {newsItem && (
        <ContentForm
          type="news"
          initialContent={newsItem}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default EditNewsPage;