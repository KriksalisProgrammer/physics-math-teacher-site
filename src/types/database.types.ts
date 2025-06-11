// This file contains TypeScript types for the Supabase database schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {      profiles: {
        Row: {
          id: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          first_name: string | null
          last_name: string | null
          age: number | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'student' | 'teacher' | 'admin'
          first_name?: string | null
          last_name?: string | null
          age?: number | null          age?: number | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'student' | 'teacher' | 'admin'
          first_name?: string | null
          last_name?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          id: string
          title_uk: string
          title_en: string
          content_uk: string
          content_en: string
          author_id: string
          created_at: string
          updated_at: string
          profiles?: {
            first_name: string | null
            last_name: string | null
          }
        }
        Insert: {
          id?: string
          title_uk: string
          title_en: string
          content_uk: string
          content_en: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_uk?: string
          title_en?: string
          content_uk?: string
          content_en?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          rating: number | null
          is_approved: boolean
          created_at: string
          updated_at: string
          profiles?: {
            first_name: string | null
            last_name: string | null
          }
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          rating?: number | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          rating?: number | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      news: {
        Row: {
          id: string
          title_uk: string
          title_en: string
          content_uk: string
          content_en: string
          author_id: string
          created_at: string
          updated_at: string
          profiles?: {
            first_name: string | null
            last_name: string | null
          }
        }
        Insert: {
          id?: string
          title_uk: string
          title_en: string
          content_uk: string
          content_en: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_uk?: string
          title_en?: string
          content_uk?: string
          content_en?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          id: string
          title_uk: string
          title_en: string
          description_uk: string | null
          description_en: string | null
          content_uk: string | null
          content_en: string | null
          meeting_link: string | null
          author_id: string
          created_at: string
          updated_at: string
          profiles?: {
            first_name: string | null
            last_name: string | null
          }
        }
        Insert: {
          id?: string
          title_uk: string
          title_en: string
          description_uk?: string | null
          description_en?: string | null
          content_uk?: string | null
          content_en?: string | null
          meeting_link?: string | null
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_uk?: string
          title_en?: string
          description_uk?: string | null
          description_en?: string | null
          content_uk?: string | null
          content_en?: string | null
          meeting_link?: string | null
          author_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_timestamp: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type DatabaseTables = Database['public']['Tables']
export type TableRow<T extends keyof DatabaseTables> = DatabaseTables[T]['Row']
export type DatabaseContentTypes = {
  posts: TableRow<'posts'>
  news: TableRow<'news'>
  lessons: TableRow<'lessons'>
}
