'use client';

import { useDictionary } from '@/lib/useDictionary';
import ApplicationForm from '@/components/ui/ApplicationForm';

export default function ApplicationsPage() {
  const { dictionary } = useDictionary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {dictionary.applications?.page_title || 'Подача заявки на навчання'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {dictionary.applications?.page_description || 'Почніть свій шлях до знань уже сьогодні. Наші викладачі допоможуть вам досягти ваших цілей.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {dictionary.applications?.feature_1_title || 'Персоналізоване навчання'}
              </h3>
              <p className="text-gray-600 text-sm">
                {dictionary.applications?.feature_1_desc || 'Програма адаптується під ваші потреби та темп навчання'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {dictionary.applications?.feature_2_title || 'Досвідчені викладачі'}
              </h3>
              <p className="text-gray-600 text-sm">
                {dictionary.applications?.feature_2_desc || 'Команда професіоналів з багаторічним досвідом викладання'}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {dictionary.applications?.feature_3_title || 'Швидкий результат'}
              </h3>
              <p className="text-gray-600 text-sm">
                {dictionary.applications?.feature_3_desc || 'Помітні покращення вже після перших занять'}
              </p>
            </div>
          </div>

          <ApplicationForm dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}
