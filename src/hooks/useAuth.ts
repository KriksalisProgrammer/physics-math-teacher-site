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

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user || null);
            
            // Set up auth subscription
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                (_event: string, session: Session | null) => {
                    setSession(session);
                    setUser(session?.user || null);
                }
            );
            setLoading(false);
            
            return () => {
                subscription.unsubscribe();
            };
        };
        
        initAuth();
    }, []);

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
        setLoading(false);
        return { error };
    };

    return { user, loading, signIn, signOut };
};

export default useAuth;