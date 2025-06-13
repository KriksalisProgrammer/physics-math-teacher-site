'use client';

import { useDictionary } from '@/lib/useDictionary';
import ApplicationForm from '@/components/ui/ApplicationForm';

export default function ApplicationsPage() {
  const { dictionary } = useDictionary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-2xl p-6">
                <svg className="w-16 h-16 mx-auto text-gradient bg-gradient-to-r from-blue-500 to-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
              {dictionary.applications?.page_title || 'Подача заявки на навчання'}
            </h1>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              {dictionary.applications?.page_description || 'Почніть свій шлях до знань уже сьогодні. Наші викладачі допоможуть вам досягти ваших цілей.'}
            </p>
          </div>          {/* Enhanced Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {dictionary.applications?.feature_1_title || 'Персоналізоване навчання'}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {dictionary.applications?.feature_1_desc || 'Програма адаптується під ваші потреби та темп навчання'}
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                {dictionary.applications?.feature_2_title || 'Досвідчені викладачі'}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {dictionary.applications?.feature_2_desc || 'Команда професіоналів з багаторічним досвідом викладання'}
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                {dictionary.applications?.feature_3_title || 'Швидкий результат'}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {dictionary.applications?.feature_3_desc || 'Помітні покращення вже після перших занять'}
              </p>            </div>
          </div>

          <ApplicationForm dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}
