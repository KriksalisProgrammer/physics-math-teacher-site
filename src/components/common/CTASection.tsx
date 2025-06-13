'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import useAuth from '@/hooks/useAuth';

interface CTASectionProps {
  locale: string;
  dictionary: any;
}

const CTASection = ({ locale, dictionary }: CTASectionProps) => {
  const { ref, isVisible } = useScrollAnimation();
  const { isAuthenticated, loading } = useAuth();

  // Не показываем CTA для авторизованных пользователей
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-white/20 rounded-lg mb-4 max-w-2xl mx-auto"></div>
            <div className="h-8 bg-white/20 rounded-lg mb-8 max-w-lg mx-auto"></div>
            <div className="flex justify-center gap-4">
              <div className="h-12 w-32 bg-white/20 rounded-lg"></div>
              <div className="h-12 w-32 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isAuthenticated) {
    return (
      <section 
        ref={ref}
        className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-gradient-shift">
              {dictionary.continue_learning || "Продовжуйте навчання!"}
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              {dictionary.achieve_more || "Досягайте нових висот у вивченні фізики та математики"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={`/${locale}/dashboard`}
                className="group relative px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-bounce-in"
              >
                <span className="relative z-10 flex items-center">
                  🎯 {dictionary.go_to_dashboard || "Перейти до кабінету"}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <Link
                href={`/${locale}/lessons`}
                className="group relative px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 animate-bounce-in"
                style={{animationDelay: '0.2s'}}
              >
                <span className="relative z-10 flex items-center">
                  📚 {dictionary.browse_lessons || "Переглянути уроки"}
                </span>
              </Link>
            </div>
            
            {/* Trust indicators for authenticated users */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎓</span>
                <span className="font-semibold">Ваш прогрес</span>
                <span className="text-sm">продовжується!</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📈</span>
                <span className="font-semibold">Нові</span>
                <span className="text-sm">досягнення чекають</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏆</span>
                <span className="font-semibold">Успіх</span>
                <span className="text-sm">у ваших руках</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-gradient-shift">
            {dictionary.ready_to_start || "Готові розпочати навчання?"}
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
            {dictionary.join_thousands || "Приєднуйтесь до тисяч студентів, які вже досягли успіху"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${locale}/signup`}
              className="group relative px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-bounce-in"
            >
              <span className="relative z-10 flex items-center">
                🚀 {dictionary.start_learning || "Почати навчання"}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            
            <Link
              href={`/${locale}/lessons`}
              className="group relative px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 animate-bounce-in"
              style={{animationDelay: '0.2s'}}
            >
              <span className="relative z-10 flex items-center">
                📚 {dictionary.browse_lessons || "Переглянути уроки"}
              </span>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="font-semibold">4.9/5</span>
              <span className="text-sm">(1,200+ відгуків)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span className="font-semibold">95%</span>
              <span className="text-sm">успішності</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👨‍🎓</span>
              <span className="font-semibold">1,250+</span>
              <span className="text-sm">активних студентів</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
