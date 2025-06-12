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
      <div className={cn('bg-white rounded-2xl border border-gray-200 shadow-lg p-8', className)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {dictionary.applications?.success_title || 'Заявка отправлена!'}
          </h3>
          <p className="text-gray-600 mb-6">
            {dictionary.applications?.success_message || 'Мы свяжемся с вами в ближайшее время для подтверждения урока.'}
          </p>
          <Button onClick={() => setSubmitStatus('idle')} className="w-full">
            {dictionary.applications?.submit_another || 'Подать еще одну заявку'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl border border-gray-200 shadow-lg p-8', className)}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {dictionary.applications?.title || 'Подать заявку на урок'}
        </h2>
        <p className="text-gray-600">
          {dictionary.applications?.subtitle || 'Заполните форму, и мы организуем для вас идеальный урок'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dictionary.applications?.subject || 'Предмет'}
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{dictionary.applications?.select_subject || 'Оберіть предмет'}</option>
              <option value="mathematics">{dictionary.applications?.mathematics || 'Математика'}</option>
              <option value="physics">{dictionary.applications?.physics || 'Фізика'}</option>
              <option value="chemistry">{dictionary.applications?.chemistry || 'Хімія'}</option>
              <option value="english">{dictionary.applications?.english || 'Англійська мова'}</option>
              <option value="ukrainian">{dictionary.applications?.ukrainian || 'Українська мова'}</option>
              <option value="programming">{dictionary.applications?.programming || 'Програмування'}</option>
            </select>
          </div>

          <div>            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dictionary.applications?.lesson_type || 'Тип урока'}
            </label>
            <select
              value={formData.lesson_type}
              onChange={(e) => handleInputChange('lesson_type', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{dictionary.applications?.select_type || 'Оберіть тип'}</option>
              <option value="individual">{dictionary.applications?.individual || 'Індивідуальний урок'}</option>
              <option value="group">{dictionary.applications?.group || 'Груповий урок'}</option>
              <option value="consultation">{dictionary.applications?.consultation || 'Консультація'}</option>
              <option value="preparation">{dictionary.applications?.preparation || 'Підготовка до екзаменів'}</option>
            </select>
          </div>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dictionary.applications?.preferred_date || 'Бажана дата'}
            </label>
            <input
              type="date"
              value={formData.preferred_date}
              onChange={(e) => handleInputChange('preferred_date', e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dictionary.applications?.preferred_time || 'Бажаний час'}
            </label>
            <input
              type="time"
              value={formData.preferred_time}
              onChange={(e) => handleInputChange('preferred_time', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dictionary.applications?.duration || 'Тривалість (хв)'}
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">{dictionary.applications?.duration_30 || '30 хвилин'}</option>
              <option value="60">{dictionary.applications?.duration_60 || '60 хвилин'}</option>
              <option value="90">{dictionary.applications?.duration_90 || '90 хвилин'}</option>
              <option value="120">{dictionary.applications?.duration_120 || '120 хвилин'}</option>
            </select>
          </div>
        </div>

        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            {dictionary.applications?.contact_method || 'Спосіб зв\'язку'}
          </label>
          <div className="flex space-x-4">
            {['email', 'phone', 'telegram'].map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="radio"
                  name="contact_method"
                  value={method}
                  checked={formData.contact_method === method}
                  onChange={(e) => handleInputChange('contact_method', e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 capitalize">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.contact_method === 'phone' && (
          <div>            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dictionary.applications?.phone || 'Номер телефону'}
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+380..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {formData.contact_method === 'telegram' && (
          <div>            <label className="block text-sm font-medium text-gray-700 mb-2">
              {dictionary.applications?.telegram || 'Telegram користувач'}
            </label>
            <input
              type="text"
              value={formData.telegram || ''}
              onChange={(e) => handleInputChange('telegram', e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            {dictionary.applications?.message || 'Додаткові побажання'}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={4}
            placeholder={dictionary.applications?.message_placeholder || 'Розкажіть про свої цілі та побажання до уроку...'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">            <p className="text-red-800 text-sm">
              {dictionary.applications?.error || 'Сталася помилка при відправці заявки. Спробуйте ще раз.'}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 text-lg font-semibold"        >
          {isSubmitting
            ? (dictionary.applications?.submitting || 'Відправляємо...')
            : (dictionary.applications?.submit || 'Подати заявку')
          }
        </Button>
      </form>
    </div>
  );
};

export default ApplicationForm;
