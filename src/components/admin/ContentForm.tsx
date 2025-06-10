'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../../hooks/useSupabase';
import { useDictionary } from '../../lib/useDictionary';
import Button from '../ui/Button';
import { SupabasePost, SupabaseNews, SupabaseLesson } from '../../types/supabase';
import { ContentFormData, ContentType } from '../../types/forms';

type ContentFormProps = {
  type: ContentType;
  initialContent?: Partial<SupabasePost | SupabaseNews | SupabaseLesson>;
  onSubmit?: (content: ContentFormData) => void | Promise<void>;
};

const ContentForm: React.FC<ContentFormProps> = ({ 
  type = 'post',
  initialContent,
  onSubmit
}) => {
  const { dictionary } = useDictionary();
  const router = useRouter();
  const { profile, session } = useSupabase();
  const { supabase } = require('../../lib/supabase');
  
  const [formData, setFormData] = useState<ContentFormData>({
    title_uk: initialContent?.title_uk || '',
    title_en: initialContent?.title_en || '',
    content_uk: initialContent?.content_uk || null,
    content_en: initialContent?.content_en || null,
    description_uk: (initialContent as SupabaseLesson)?.description_uk || null,
    description_en: (initialContent as SupabaseLesson)?.description_en || null,
    meeting_link: (initialContent as SupabaseLesson)?.meeting_link || null,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine the table name based on content type
      const tableName = type === 'post' ? 'posts' : type === 'news' ? 'news' : 'lessons';
      
      // Prepare data based on content type
      const contentData = {
        title_uk: formData.title_uk,
        title_en: formData.title_en,
        content_uk: formData.content_uk,
        content_en: formData.content_en,
        ...(type === 'lesson' && {
          description_uk: formData.description_uk,
          description_en: formData.description_en,
          meeting_link: formData.meeting_link
        })
      };
      
      // If we're updating existing content
      if (initialContent?.id) {
        const { data, error } = await supabase
          .from(tableName)
          .update(contentData)
          .eq('id', initialContent.id)
          .select();
          
        if (error) throw error;
        
        if (onSubmit) onSubmit(data?.[0]);
      } else {
        // Creating new content
        const { data, error } = await supabase
          .from(tableName)
          .insert([contentData])
          .select();
          
        if (error) throw error;
        
        if (onSubmit) onSubmit(data?.[0]);
        
        // Reset form if not redirecting
        if (!onSubmit) {
          setFormData({
            title_uk: '',
            title_en: '',
            content_uk: null,
            content_en: null,
            description_uk: null,
            description_en: null,
            meeting_link: null,
          });
        }
      }
      
      // Redirect after success if no custom onSubmit handler
      if (!onSubmit) {
        // Extract locale from pathname
        const pathParts = window.location.pathname.split('/');
        const locale = pathParts[1] || 'uk'; // Default to Ukrainian if not found
        router.push(`/${locale}/admin/${type}s`);
      }
    } catch (error: any) {
      setError(error.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Language Tabs */}
        <div className="border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                type="button"
                className={`inline-block p-4 border-b-2 border-indigo-500 text-indigo-600`}
              >
                {dictionary.admin?.languages?.ukrainian || 'Ukrainian'}
              </button>
            </li>
          </ul>
        </div>

        {/* Ukrainian Language Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="title_uk" className="block text-sm font-medium text-gray-700">
              {dictionary.admin?.form?.title || 'Title'}
            </label>
            <input
              type="text"
              id="title_uk"
              name="title_uk"
              value={formData.title_uk}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {type === 'lesson' && (
            <div>
              <label htmlFor="description_uk" className="block text-sm font-medium text-gray-700">
                {dictionary.admin?.form?.description || 'Description'}
              </label>
              <textarea
                id="description_uk"
                name="description_uk"
                value={formData.description_uk || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="content_uk" className="block text-sm font-medium text-gray-700">
              {dictionary.admin?.form?.content || 'Content'}
            </label>
            <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 overflow-hidden">
              <div className="bg-gray-100 px-3 py-1 border-b flex items-center">
                <span className="text-xs font-medium text-gray-600 mr-4">Markdown</span>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Preview
                </button>
              </div>
              <textarea
                id="content_uk"
                name="content_uk"
                value={formData.content_uk || ''}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {type === 'lesson' && (
            <div>
              <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700">
                {dictionary.admin?.form?.meetingLink || 'Meeting Link'}
              </label>
              <input
                type="url"
                id="meeting_link"
                name="meeting_link"
                value={formData.meeting_link || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Language Tabs */}
        <div className="border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                type="button"
                className={`inline-block p-4 border-b-2 border-indigo-500 text-indigo-600`}
              >
                {dictionary.admin?.languages?.english || 'English'}
              </button>
            </li>
          </ul>
        </div>

        {/* English Language Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="title_en" className="block text-sm font-medium text-gray-700">
              {dictionary.admin?.form?.title || 'Title'}
            </label>
            <input
              type="text"
              id="title_en"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {type === 'lesson' && (
            <div>
              <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">
                {dictionary.admin?.form?.description || 'Description'}
              </label>
              <textarea
                id="description_en"
                name="description_en"
                value={formData.description_en || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="content_en" className="block text-sm font-medium text-gray-700">
              {dictionary.admin?.form?.content || 'Content'}
            </label>
            <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 overflow-hidden">
              <div className="bg-gray-100 px-3 py-1 border-b flex items-center">
                <span className="text-xs font-medium text-gray-600 mr-4">Markdown</span>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Preview
                </button>
              </div>
              <textarea
                id="content_en"
                name="content_en"
                value={formData.content_en || ''}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {type === 'lesson' && (
            <div>
              <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700">
                {dictionary.admin?.form?.meetingLink || 'Meeting Link'}
              </label>
              <input
                type="url"
                id="meeting_link"
                name="meeting_link"
                value={formData.meeting_link || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {dictionary.admin?.form?.cancel || 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? dictionary.admin?.form?.saving || 'Saving...' : dictionary.admin?.form?.save || 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;