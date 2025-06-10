export interface BlogPost {
    id: string;
    title_uk: string;
    title_en: string;
    content_uk: string;
    content_en: string;
    author_id: string;
    created_at: string;
    updated_at: string;
    profiles?: {
        first_name: string | null;
        last_name: string | null;
    }
}

export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlogPostResponse {
    post: BlogPost;
    comments: Comment[];
}