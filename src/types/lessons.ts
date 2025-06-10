export interface Lesson {
    id: string;
    title_uk: string;
    title_en: string;
    description_uk: string | null;
    description_en: string | null;
    content_uk: string | null;
    content_en: string | null;
    meeting_link: string | null;
    author_id: string;
    created_at: string;
    updated_at: string;
    profiles?: {
        first_name: string | null;
        last_name: string | null;
    }
}

export interface LessonCreateInput {
    title: string;
    description: string;
    content: string;
    teacherId: string;
    language: 'uk' | 'en';
}

export interface LessonUpdateInput {
    title?: string;
    description?: string;
    content?: string;
    language?: 'uk' | 'en';
}