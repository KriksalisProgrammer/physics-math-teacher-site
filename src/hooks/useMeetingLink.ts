'use client';

import { useState } from 'react';
import { isValidUrl } from '@/utils/validation';
import { supabase } from '@/lib/supabase';

export function useMeetingLink() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Валидация ссылки на встречу
  const validateMeetingLink = (meetingLink: string): boolean => {
    if (!meetingLink.trim()) {
      return true; // Пустая ссылка разрешена
    }
    
    if (!isValidUrl(meetingLink)) {
      setValidationError('Пожалуйста, введите корректную ссылку');
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  // Сохранение ссылки на встречу для урока
  const saveMeetingLink = async (lessonId: string, meetingLink: string): Promise<boolean> => {
    if (!validateMeetingLink(meetingLink)) {
      return false;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ meeting_link: meetingLink })
        .eq('id', lessonId);
        
      if (error) {
        console.error('Error saving meeting link:', error);
        setValidationError('Ошибка при сохранении ссылки');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving meeting link:', error);
      setValidationError('Ошибка при сохранении ссылки');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    validateMeetingLink,
    saveMeetingLink,
    validationError,
    isSaving
  };
}
