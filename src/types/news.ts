export interface NewsArticle {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    locale: 'uk' | 'en';
}

export interface NewsResponse {
    articles: NewsArticle[];
    total: number;
    page: number;
    pageSize: number;
}