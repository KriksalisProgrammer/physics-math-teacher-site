'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types/blog';
import AdminLayout from '@/components/layouts/AdminLayout';

const PostPage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const id = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
        } else {
          setPost(data);
        }
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">
        {locale === 'uk' ? post.title_uk : post.title_en}
      </h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Содержание:</h2>
          <div className="prose" dangerouslySetInnerHTML={{ 
            __html: locale === 'uk' ? post.content_uk || '' : post.content_en || '' 
          }} />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => router.push(`/${locale}/admin/posts/${id}/edit`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Редактировать
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PostPage;