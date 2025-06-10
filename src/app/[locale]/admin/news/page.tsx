'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ContentForm from '@/components/admin/ContentForm';
import AdminLayout from '@/components/layouts/AdminLayout';
import { SupabaseNews } from '@/types/supabase';

const NewsPage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [news, setNews] = useState<SupabaseNews[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
      } else {
        setNews((data ?? []) as SupabaseNews[]);
      }
    };
    fetchNews();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">{locale === 'uk' ? 'Новини' : 'News'}</h1>
      <ContentForm type="news" />
      <ul className="mt-4">
        {news.map((item: SupabaseNews) => (
          <li key={item.id} className="border-b py-2">
            <a href={`/admin/news/${item.id}`} className="text-blue-600 hover:underline">
              {item.title_uk || item.title_en}
            </a>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default NewsPage;

// Проверьте, что импорты Button, Input, Form идут как default, а не именованные. Исправьте типы onChange для Input, если есть. Исправьте значения пропсов Button/Input, если есть.