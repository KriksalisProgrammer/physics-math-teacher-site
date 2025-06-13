'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import Button from './Button';

interface ApplicationFormProps {
  dictionary: any;
  onSubmit?: (data: any) => void;
  className?: string;
}

interface FormData {
  subject: string;
  lesson_type: string;
  preferred_date: string;
  preferred_time: string;
  duration: string;
  message: string;
  contact_method: 'email' | 'phone' | 'telegram';
  phone?: string;
  telegram?: string;
}

const ApplicationForm = ({ dictionary, onSubmit, className }: ApplicationFormProps) => {  const [formData, setFormData] = useState<FormData>({
    subject: '',
    lesson_type: '',
    preferred_date: '',
    preferred_time: '',
    duration: '60',
    message: '',
    contact_method: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitStatus('success');        setFormData({
          subject: '',
          lesson_type: '',
          preferred_date: '',
          preferred_time: '',
          duration: '60',
          message: '',
          contact_method: 'email'
        });
        onSubmit?.(formData);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  if (submitStatus === 'success') {
    return (
      <div className={cn('relative bg-white/80 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl p-10 overflow-hidden', className)}>
        {/* Success Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/50 to-purple-50/50 rounded-3xl"></div>
        
        {/* Floating Success Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 text-center">
          <div className="inline-block p-6 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full shadow-2xl mb-8 animate-bounce">
            <div className="bg-white rounded-full p-6">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-5xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {dictionary.applications?.success_title || 'Заявка отправлена!'}
          </h3>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            {dictionary.applications?.success_message || 'Мы свяжемся с вами в ближайшее время для подтверждения урока.'}
          </p>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="relative py-4 px-8 text-lg font-bold text-white bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{dictionary.applications?.submit_another || 'Подать еще одну заявку'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={cn('relative bg-white/80 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl p-10 overflow-hidden', className)}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-3xl"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-xl mb-6 transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-2xl p-4">
              <svg className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {dictionary.applications?.title || 'Подать заявку на урок'}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {dictionary.applications?.subtitle || 'Заполните форму, и мы организуем для вас идеальный урок'}
          </p>
        </div>        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                {dictionary.applications?.subject || 'Предмет'}
              </label>
              <div className="relative">
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-300 shadow-lg hover:shadow-xl"
                >
                  <option value="">{dictionary.applications?.select_subject || 'Оберіть предмет'}</option>
                  <option value="physics">{dictionary.applications?.physics || 'Фізика'}</option>
                  <option value="mathematics">{dictionary.applications?.mathematics || 'Математика'}</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                {dictionary.applications?.lesson_type || 'Тип урока'}
              </label>
              <div className="relative">
                <select
                  value={formData.lesson_type}
                  onChange={(e) => handleInputChange('lesson_type', e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-300 shadow-lg hover:shadow-xl"
                >
                  <option value="">{dictionary.applications?.select_type || 'Оберіть тип'}</option>
                  <option value="individual">{dictionary.applications?.individual || 'Індивідуальний урок'}</option>
                  <option value="group">{dictionary.applications?.group || 'Груповий урок'}</option>
                  <option value="consultation">{dictionary.applications?.consultation || 'Консультація'}</option>
                  <option value="preparation">{dictionary.applications?.preparation || 'Підготовка до екзаменів'}</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                {dictionary.applications?.preferred_date || 'Бажана дата'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.preferred_date}
                  onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-green-300 shadow-lg hover:shadow-xl"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                {dictionary.applications?.preferred_time || 'Бажаний час'}
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.preferred_time}
                  onChange={(e) => handleInputChange('preferred_time', e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-pink-300 shadow-lg hover:shadow-xl"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {dictionary.applications?.duration || 'Тривалість (хв)'}
              </label>
              <div className="relative">
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-indigo-300 shadow-lg hover:shadow-xl"
                >
                  <option value="30">{dictionary.applications?.duration_30 || '30 хвилин'}</option>
                  <option value="60">{dictionary.applications?.duration_60 || '60 хвилин'}</option>
                  <option value="90">{dictionary.applications?.duration_90 || '90 хвилин'}</option>
                  <option value="120">{dictionary.applications?.duration_120 || '120 хвилин'}</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>          <div className="group">
            <label className="block text-lg font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors">
              {dictionary.applications?.contact_method || 'Спосіб зв\'язку'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['email', 'phone', 'telegram'] as const).map((method) => (
                <label key={method} className="group/radio relative cursor-pointer">
                  <input
                    type="radio"
                    name="contact_method"
                    value={method}
                    checked={formData.contact_method === method}
                    onChange={(e) => handleInputChange('contact_method', e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`
                    p-4 rounded-2xl border-2 transition-all duration-300 text-center font-semibold
                    ${formData.contact_method === method 
                      ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-lg scale-105' 
                      : 'border-gray-200 bg-white/80 text-gray-600 hover:border-teal-300 hover:shadow-md hover:scale-102'
                    }
                  `}>
                    <div className="flex flex-col items-center space-y-2">
                      {method === 'email' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {method === 'phone' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )}
                      {method === 'telegram' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className="text-sm capitalize">{method}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>          {formData.contact_method === 'phone' && (
            <div className="group animate-fadeIn">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                {dictionary.applications?.phone || 'Номер телефону'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+380..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-300 shadow-lg hover:shadow-xl"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {formData.contact_method === 'telegram' && (
            <div className="group animate-fadeIn">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                {dictionary.applications?.telegram || 'Telegram користувач'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.telegram || ''}
                  onChange={(e) => handleInputChange('telegram', e.target.value)}
                  placeholder="@username"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-300 shadow-lg hover:shadow-xl"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}          <div className="group">
            <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
              {dictionary.applications?.message || 'Додаткові побажання'}
            </label>
            <div className="relative">
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={5}
                placeholder={dictionary.applications?.message_placeholder || 'Розкажіть про свої цілі та побажання до уроку...'}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-orange-300 shadow-lg hover:shadow-xl resize-none"
              />
              <div className="absolute right-4 top-4 pointer-events-none">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>          {submitStatus === 'error' && (
            <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-6 shadow-lg animate-shake">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-800 text-lg font-semibold">
                  {dictionary.applications?.error || 'Сталася помилка при відправці заявки. Спробуйте ще раз.'}
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Submit Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full py-6 px-8 text-xl font-black text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Button Content */}
              <div className="relative flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{dictionary.applications?.submitting || 'Відправляємо...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>{dictionary.applications?.submit || 'Подати заявку'}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
