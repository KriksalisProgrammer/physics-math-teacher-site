import Link from 'next/link';
import { formatDate } from '../../utils/formatDate';
import { SupabasePost } from '../../types/supabase';

interface PostCardProps {
  post: SupabasePost;
  locale: string;
}

function PostCard({ post, locale }: PostCardProps) {
  // Get title and content based on locale
  const title = locale === 'uk' ? post.title_uk : post.title_en;
  const content = locale === 'uk' ? post.content_uk : post.content_en;
  
  // Create a short excerpt from content
  const excerpt = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;

  return (
    <article className="group bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
      {/* Image with overlay */}
      <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            {locale === 'uk' ? '📚 Блог' : '📚 Blog'}
          </span>
        </div>
        
        {/* Reading time estimate */}
        <div className="absolute top-4 right-4">
          <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            {Math.ceil(content.length / 1000)} {locale === 'uk' ? 'хв' : 'min'}
          </span>
        </div>
        
        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></div>
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.created_at, locale)}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
          {excerpt}
        </p>
        
        <Link 
          href={`/${locale}/blog/${post.id}`}
          className="group/link inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 self-start"
        >
          <span>{locale === 'uk' ? 'Читати повністю' : 'Read full article'}</span>
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 group-hover/link:bg-blue-200 rounded-full transition-all duration-300 group-hover/link:translate-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link>
      </div>
    </article>
  );
}

export default PostCard;