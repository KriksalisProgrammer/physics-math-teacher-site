import type { Database } from './database.types';

type DatabaseTables = Database['public']['Tables']
type TableRow<T extends keyof DatabaseTables> = DatabaseTables[T]['Row']

export type ContentFormData = {
  title_uk: string;
  title_en: string;
  content_uk: string | null;
  content_en: string | null;
  description_uk: string | null;
  description_en: string | null;
  meeting_link?: string | null;
};

export type ContentType = 'post' | 'news' | 'lesson';

export type DatabaseContentTypes = {
  posts: TableRow<'posts'>
  news: TableRow<'news'>
  lessons: TableRow<'lessons'>
};

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
