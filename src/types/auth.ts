// This file defines TypeScript types related to authentication.

export interface UserProfile {
    id: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: UserProfile;
    session: Session;
}

export interface Session {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}