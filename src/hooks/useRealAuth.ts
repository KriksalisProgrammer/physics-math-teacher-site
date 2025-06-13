import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Define types locally
type User = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
};

type Session = {
  user: User;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
};

type UserProfile = {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
};

// Implementation of real authentication with Supabase
export const useRealAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
        
      // Get user profile if authenticated
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
        
      // Set up auth subscription
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event: string, session: Session | null) => {
          setSession(session);
          setUser(session?.user || null);
            
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      );
      setLoading(false);
        
      return () => {
        subscription.unsubscribe();
      };
    };
      
    initAuth();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setUser(data.user);
    setSession(data.session);
    setLoading(false);
    return { user: data.user, error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
    return { error };
  };

  return { 
    user, 
    session, 
    profile, 
    loading, 
    signIn, 
    signOut,
    isAuthenticated: !!user,
    role: profile?.role || null
  };
};
