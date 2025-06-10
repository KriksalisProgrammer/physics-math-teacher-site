// This file contains TypeScript types related to Supabase.

export type Role = 'student' | 'teacher' | 'admin';

export type SupabaseProfile = {
  id: string;
  email: string;
  role: Role;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type SupabasePost = {
  id: string;
  title_uk: string;
  title_en: string;
  content_uk: string;
  content_en: string;
  created_at: string;
  updated_at: string;
  author_id: string;
};

export type SupabaseComment = {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  rating?: number;
  is_approved: boolean;
};

export type SupabaseNews = {
  id: string;
  title_uk: string;
  title_en: string;
  content_uk: string;
  content_en: string;
  created_at: string;
  updated_at: string;
  author_id: string;
};

export type SupabaseLesson = {
  id: string;
  title_uk: string;
  title_en: string;
  description_uk?: string;
  description_en?: string;
  content_uk?: string;
  content_en?: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
};