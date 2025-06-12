-- Supabase Schema for Teacher Website

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (extended from auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    bio TEXT,
    age INTEGER,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table (Blog)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_uk TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_uk TEXT NOT NULL,
    content_en TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_uk TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_uk TEXT NOT NULL,
    content_en TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_uk TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_uk TEXT,
    description_en TEXT,
    content_uk TEXT,
    content_en TEXT,
    meeting_link TEXT, -- Ссылка на Google Meet, Zoom или другой сервис
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('individual', 'group', 'consultation', 'preparation')),
    preferred_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    message TEXT NOT NULL,
    contact_method TEXT NOT NULL DEFAULT 'email' CHECK (contact_method IN ('email', 'phone', 'telegram')),
    phone TEXT,
    telegram TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    assigned_teacher_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Policies

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

-- Users can update their own profiles
CREATE POLICY "Users can update their own profiles" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Only admins can create profiles (handled by auth hook)
CREATE POLICY "Only admins can create profiles" 
    ON profiles FOR INSERT 
    WITH CHECK (role = 'admin' OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    ));

-- Blog Posts RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read blog posts
CREATE POLICY "Blog posts are viewable by everyone" 
    ON posts FOR SELECT 
    USING (true);

-- Only teachers and admins can create, update, or delete posts
CREATE POLICY "Teachers and admins can create posts" 
    ON posts FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers and admins can update posts" 
    ON posts FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers and admins can delete posts" 
    ON posts FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

-- Comments RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
CREATE POLICY "Approved comments are viewable by everyone" 
    ON comments FOR SELECT 
    USING (is_approved = true OR auth.uid() = author_id);

-- Logged in users can create comments
CREATE POLICY "Authenticated users can create comments" 
    ON comments FOR INSERT 
    WITH CHECK (auth.uid() = author_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" 
    ON comments FOR UPDATE 
    USING (auth.uid() = author_id);

-- Only admins and teachers can approve comments
CREATE POLICY "Teachers and admins can approve comments" 
    ON comments FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

-- News RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Anyone can read news
CREATE POLICY "News are viewable by everyone" 
    ON news FOR SELECT 
    USING (true);

-- Only teachers and admins can create, update, or delete news
CREATE POLICY "Teachers and admins can create news" 
    ON news FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers and admins can update news" 
    ON news FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers and admins can delete news" 
    ON news FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

-- Lessons RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Anyone can read lessons
CREATE POLICY "Lessons are viewable by everyone" 
    ON lessons FOR SELECT 
    USING (true);

-- Only teachers and admins can create, update, or delete lessons
CREATE POLICY "Teachers and admins can create lessons" 
    ON lessons FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers and admins can update lessons" 
    ON lessons FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

CREATE POLICY "Teachers and admins can delete lessons" 
    ON lessons FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
        )
    );

-- Applications RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Anyone can read their own applications
CREATE POLICY "Users can view their own applications" 
    ON applications FOR SELECT 
    USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" 
    ON applications FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can create applications
CREATE POLICY "Only admins can create applications" 
    ON applications FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can update their own applications
CREATE POLICY "Users can update their own applications" 
    ON applications FOR UPDATE 
    USING (auth.uid() = user_id);

-- Only admins can approve or reject applications
CREATE POLICY "Admins can approve or reject applications" 
    ON applications FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update timestamp triggers
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_posts_timestamp
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
  
CREATE TRIGGER update_comments_timestamp
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
  
CREATE TRIGGER update_news_timestamp
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
  
CREATE TRIGGER update_lessons_timestamp
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_applications_timestamp
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
