'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/layouts/AdminLayout';
import { SupabasePost } from '@/types/supabase';

const PostsPage = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'uk';
  const [posts, setPosts] = useState<SupabasePost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts((data ?? []) as SupabasePost[]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">{locale === 'uk' ? 'Пости' : 'Posts'}</h1>
      <div className="mb-4">
        <button
          onClick={() => router.push(`/${locale}/admin/posts/create`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          {locale === 'uk' ? 'Створити новий' : 'Create new'}
        </button>
      </div>
      <ul className="mt-4 bg-white shadow rounded divide-y">
        {posts.map((post: SupabasePost) => (
          <li key={post.id} className="p-3 hover:bg-gray-50">
            <a
              onClick={() => router.push(`/${locale}/admin/posts/${post.id}`)}
              className="text-blue-600 hover:underline cursor-pointer flex justify-between items-center"
            >
              <span>{locale === 'uk' ? post.title_uk : post.title_en}</span>
              <span className="text-sm text-gray-500">
                {new Date(post.created_at || '').toLocaleDateString()}
              </span>
            </a>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="p-4 text-gray-500 italic">
            {locale === 'uk' ? 'Пости не знайдені' : 'No posts found'}
          </li>
        )}
      </ul>
    </AdminLayout>
  );
};

export default PostsPage;