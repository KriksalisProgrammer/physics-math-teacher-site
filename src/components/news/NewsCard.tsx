import Link from 'next/link';
import { formatDate } from '../../utils/formatDate';
import { SupabaseNews } from '../../types/supabase';

interface NewsCardProps {
  news: SupabaseNews;
  locale: string;
}

function NewsCard({ news, locale }: NewsCardProps) {
  // Get title and content based on locale
  const title = locale === 'uk' ? news.title_uk : news.title_en;
  const content = locale === 'uk' ? news.content_uk : news.content_en;
  
  // Create a short excerpt from content
  const excerpt = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;

  // Determine urgency color based on news age
  const newsDate = new Date(news.created_at);
  const daysSinceCreated = Math.floor((Date.now() - newsDate.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysSinceCreated <= 3;
  const isRecent = daysSinceCreated <= 7;

  return (
    <article className="group bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100">
      {/* Header with gradient and badge */}
      <div className="relative h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
        
        {/* Urgency badge */}
        <div className="absolute top-3 left-4">
          {isUrgent && (
            <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse shadow-lg">
              🔥 {locale === 'uk' ? 'НОВЕ' : 'NEW'}
            </span>
          )}
          {!isUrgent && isRecent && (
            <span className="bg-orange-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              ⭐ {locale === 'uk' ? 'СВІЖЕ' : 'FRESH'}
            </span>
          )}
          {!isRecent && (
            <span className="bg-green-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              📰 {locale === 'uk' ? 'НОВИНИ' : 'NEWS'}
            </span>
          )}
        </div>
        
        {/* Date badge */}
        <div className="absolute top-3 right-4">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            {formatDate(news.created_at, locale)}
          </span>
        </div>
        
        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-2 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        {/* CTA Button */}
        <Link 
          href={`/${locale}/news/${news.id}`}
          className="group/button inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>{locale === 'uk' ? 'Детальніше' : 'Read more'}</span>
          <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full transition-all duration-300 group-hover/button:translate-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        
        {/* Additional info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1">
              ⏰ {locale === 'uk' ? 'Опубліковано' : 'Published'} {daysSinceCreated === 0 ? (locale === 'uk' ? 'сьогодні' : 'today') : `${daysSinceCreated} ${locale === 'uk' ? 'днів тому' : 'days ago'}`}
            </span>
            <span className="flex items-center gap-1">
              📝 {Math.ceil(content.length / 1000)} {locale === 'uk' ? 'хв читання' : 'min read'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;