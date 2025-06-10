import { supabase } from '@/lib/supabase';
import { getDictionary } from '@/lib/dictionaries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { renderMarkdown } from '@/utils/markdown';
import { SupabaseComment } from '@/types/supabase';
import CommentSection from '@/components/blog/CommentSection';

// Динамическая генерация метаданных
export async function generateMetadata({ 
  params: { id, locale } 
}: { 
  params: { id: string, locale: string } 
}) {
  const post = await getPost(id);
  if (!post) return { title: 'Post Not Found' };
  
  const title = locale === 'uk' ? post.title_uk : post.title_en;
  return {
    title: `${title} | Blog`,
    description: (locale === 'uk' ? post.content_uk : post.content_en).substring(0, 160),
  };
}

// Получение данных поста по ID
async function getPost(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(first_name, last_name)')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  
  return data;
}

// Получение комментариев к посту
async function getComments(postId: string): Promise<Array<SupabaseComment & { profiles?: { first_name?: string, last_name?: string, email?: string } }>> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(first_name, last_name)')
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  // Transform null values to undefined to match TypeScript expectations
  const transformedData = data?.map(comment => ({
    ...comment,
    rating: comment.rating ?? undefined,
    profiles: comment.profiles ? {
      first_name: comment.profiles.first_name ?? undefined,
      last_name: comment.profiles.last_name ?? undefined,
    } : undefined
  })) || [];
  
  return transformedData;
}

export default async function BlogPostPage({
  params: { id, locale }
}: {
  params: { id: string, locale: string }
}) {
  const post = await getPost(id);
  const comments = await getComments(id);
  const { blog, common } = await getDictionary(locale);
  
  if (!post) {
    notFound();
  }
  
  // Format comments for the CommentList component
  const formattedComments = comments.map((comment: SupabaseComment & { profiles?: { first_name?: string, last_name?: string, email?: string } }) => ({
    ...comment,
    author_name: comment.profiles?.first_name 
      ? `${comment.profiles.first_name} ${comment.profiles.last_name || ''}`
      : undefined,
    author_email: comment.profiles?.email
  }));
  
  // Select language version of content
  const title = locale === 'uk' ? post.title_uk : post.title_en;
  const content = locale === 'uk' ? post.content_uk : post.content_en;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        href={`/${locale}/blog`}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {blog.back_to_blog}
      </Link>
      
      <article className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        
        <div className="flex items-center text-gray-600 mb-8">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={post.created_at} className="mr-4">{formatDate(post.created_at, locale)}</time>
          
          {post.profiles && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{post.profiles.first_name} {post.profiles.last_name}</span>
            </div>
          )}
        </div>
        
        <div className="prose prose-lg max-w-none">
          {renderMarkdown(content)}
        </div>
      </article>
      
      <CommentSection 
        postId={id} 
        comments={formattedComments} 
        dictionary={{ blog }}
      />
    </div>
  );
}