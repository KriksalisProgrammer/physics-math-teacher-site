import { supabase } from '../../../lib/supabase';
import PostCard from '../../../components/blog/PostCard';
import { getDictionary } from '@/lib/dictionaries';
import { SupabasePost } from '@/types/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | Teacher Website',
  description: 'Latest blog posts about physics and mathematics',
};

// Получение всех постов блога
async function getBlogPosts(): Promise<SupabasePost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  
  return data || [];
}

export default async function BlogPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const posts = await getBlogPosts();
  const { blog, common } = await getDictionary(locale);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-600">{common.latest_posts}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post: SupabasePost) => (
            <PostCard key={post.id} post={post} locale={locale} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 mb-4">{common.no_posts_yet}</p>
            {locale === 'uk' ? (
              <Link href={`/${locale}`} className="text-blue-600 hover:underline">
                Повернутися на головну
              </Link>
            ) : (
              <Link href={`/${locale}`} className="text-blue-600 hover:underline">
                Return to Home
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}