-- Supabase Schema for Teacher Website

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name, age)
  VALUES (
    NEW.id,
    NEW.email,
    'student',
    COALESCE(
      NEW.raw_user_meta_data->>'first_name', 
      NEW.raw_user_meta_data->>'firstName',
      NEW.user_metadata->>'first_name',
      NEW.user_metadata->>'firstName',
      ''
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'last_name', 
      NEW.raw_user_meta_data->>'lastName',
      NEW.user_metadata->>'last_name',
      NEW.user_metadata->>'lastName',
      ''
    ),
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL AND NEW.raw_user_meta_data->>'age' != ''
      THEN (NEW.raw_user_meta_data->>'age')::integer 
      WHEN NEW.user_metadata->>'age' IS NOT NULL AND NEW.user_metadata->>'age' != ''
      THEN (NEW.user_metadata->>'age')::integer
      ELSE NULL 
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles Table (extended from auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    first_name TEXT,
    last_name TEXT,
    age INTEGER CHECK (age >= 5 AND age <= 100),
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

-- Profiles can be created by auth trigger or admins
CREATE POLICY "Profiles can be created by auth trigger or admins" 
    ON profiles FOR INSERT 
    WITH CHECK (
        -- Allow if it's the user's own profile (auth trigger)
        auth.uid() = id 
        OR 
        -- Allow if current user is admin
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

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

-- Storage setup for avatars
-- Create avatars bucket (run this in Supabase Dashboard -> Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars bucket
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
--   FOR SELECT TO public USING (bucket_id = 'avatars');

-- CREATE POLICY "Anyone can upload an avatar" ON storage.objects
--   FOR INSERT TO public WITH CHECK (bucket_id = 'avatars');

-- CREATE POLICY "Anyone can update their own avatar" ON storage.objects
--   FOR UPDATE TO authenticated USING (auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Anyone can delete their own avatar" ON storage.objects
--   FOR DELETE TO authenticated USING (auth.uid()::text = (storage.foldername(name))[1]);
