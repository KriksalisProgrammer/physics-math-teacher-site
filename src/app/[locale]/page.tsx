import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import PostCard from '@/components/blog/PostCard';
import NewsCard from '@/components/news/NewsCard';
import Stats from '@/components/common/Stats';
import Features from '@/components/common/Features';
import CTASection from '@/components/common/CTASection';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Get the latest posts and news from Supabase
async function getLatestContent() {
  // Get latest 3 posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);
  
  // Get latest 3 news
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);
    
  return { posts, news };
}

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const { common } = await getDictionary(locale);
  const { posts, news } = await getLatestContent();
  
  return (    <div className="min-h-screen">
      {/* Hero Section with Enhanced Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent animate-fade-in-up animate-gradient-shift">
              {common.welcome_title}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {common.welcome_message}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <Link 
                href={`/${locale}/blog`}
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  📚 {common.read_blog}
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link 
                href={`/${locale}/lessons`}
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  🎓 {common.explore_lessons}
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-fade-in-up">
              {common.our_achievements || "Наші досягнення"}
            </h2>
            <p className="text-blue-200 text-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {common.achievements_desc || "Цифри, які говорять самі за себе"}
            </p>
          </div>
          <Stats dictionary={common} />
        </div>
      </section>

      {/* Features Section with Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent animate-fade-in-up">
              {common.why_choose_our_lessons || "Чому обирають наші уроки"}
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {common.modern_approach_description || "Сучасний підхід до навчання з використанням найновіших технологій"}
            </p>
          </div>
          
          <Features dictionary={common} />
        </div>
      </section>

      {/* Legacy Features (keeping for fallback) */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              {common.why_choose_our_lessons}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {common.modern_approach_description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{common.interactive_experiments}</h3>
              <p className="text-gray-600 leading-relaxed">
                {common.virtual_labs_description}
              </p>
            </div>
            
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{common.personalized_approach}</h3>
              <p className="text-gray-600 leading-relaxed">
                {common.individual_tasks_description}
              </p>
            </div>
            
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{common.exam_preparation}</h3>
              <p className="text-gray-600 leading-relaxed">
                {common.specialized_courses_description}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Posts Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{common.latest_posts}</h2>
              <p className="text-gray-600 text-lg">Останні статті та поради від вашого вчителя</p>
            </div>
            <Link 
              href={`/${locale}/blog`} 
              className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              {common.view_all}
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                locale={locale} 
              />
            ))}
            
            {!posts?.length && (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-gray-500 text-xl">
                  {common.no_posts_yet}
                </p>
                <p className="text-gray-400 mt-2">
                  Скоро тут з'являться цікаві статті!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Latest News Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{common.latest_news}</h2>
              <p className="text-gray-600 text-lg">Важливі новини та оголошення</p>
            </div>
            <Link 
              href={`/${locale}/news`} 
              className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              {common.view_all}
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news?.map((newsItem) => (
              <NewsCard 
                key={newsItem.id} 
                news={newsItem}
                locale={locale}
              />
            ))}
            
            {!news?.length && (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📰</span>
                </div>
                <p className="text-gray-500 text-xl">
                  {common.no_news_yet}
                </p>
                <p className="text-gray-400 mt-2">
                  Стежте за оновленнями!
                </p>
              </div>
            )}
          </div>
        </div>      </section>

      {/* Enhanced CTA Section */}
      <CTASection locale={locale} dictionary={common} />
    </div>
  );
}