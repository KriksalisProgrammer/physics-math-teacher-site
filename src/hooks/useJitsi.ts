// filepath: c:\Web\teacher-website\src\hooks\useJitsi.ts
'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

/**
 * Hook for managing Jitsi-related operations
 */
export function useJitsi() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Generate a unique room name for Jitsi meetings
   */
  const generateRoomName = useCallback(() => {
    // Generate a unique ID for the room
    return `teacher-portal-${nanoid(10)}`;
  }, []);
  
  /**
   * Create a new lesson with a Jitsi meeting room
   */
  const createLessonWithRoom = useCallback(async (lessonData: {
    title_uk: string;
    title_en: string;
    description_uk?: string;
    description_en?: string;
    content_uk?: string;
    content_en?: string;
    author_id: string;
  }) => {
    setIsCreating(true);
    setError(null);
    
    try {      // Generate room name
      const roomName = generateRoomName();
      const roomLink = `https://meet.jit.si/${roomName}`;
      
      // Insert into database
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          ...lessonData,
          meeting_link: roomLink
        })
        .select();
        
      if (error) throw error;
      
      setIsCreating(false);
      return { data, error: null };
    } catch (err: any) {
      setError(err.message);
      setIsCreating(false);
      return { data: null, error: err.message };
    }
  }, [generateRoomName]);

  /**
   * Update an existing lesson with a new room
   */
  const updateLessonRoom = useCallback(async (lessonId: string) => {
    setIsCreating(true);
    setError(null);
    
    try {      // Generate room name
      const roomName = generateRoomName();
      const roomLink = `https://meet.jit.si/${roomName}`;
      
      // Update the lesson
      const { data, error } = await supabase
        .from('lessons')
        .update({
          meeting_link: roomLink
        })
        .eq('id', lessonId)
        .select();
        
      if (error) throw error;
      
      setIsCreating(false);
      return { data, error: null };
    } catch (err: any) {
      setError(err.message);
      setIsCreating(false);
      return { data: null, error: err.message };
    }
  }, [generateRoomName]);

  return {
    isCreating,
    error,
    generateRoomName,
    createLessonWithRoom,
    updateLessonRoom
  };
}

export default useJitsi;
