'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ContentForm from '@/components/admin/ContentForm';
import { BlogPost } from '@/types/blog';
import { ContentFormData } from '@/types/forms';

const EditPostPage = () => {
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

  const handleUpdate = async (updatedData: ContentFormData) => {
    const { error } = await supabase
      .from('posts')
      .update({
        title_uk: updatedData.title_uk,
        title_en: updatedData.title_en,
        content_uk: updatedData.content_uk || undefined,
        content_en: updatedData.content_en || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
    } else {
      router.push(`/${locale}/admin/posts`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Post</h1>
      {post && (
        <ContentForm
          type="post"
          initialContent={post}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default EditPostPage;