import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { createStaticAuthHook } from './staticAuth';
import { UserProfile } from '../types/auth';

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
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Убираем проверку статического режима - используем обычную аутентификацию
    // const [isStaticMode, setIsStaticMode] = useState(false);
    
    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const isStatic = (window as any).__NEXT_DATA__?.buildId === 'static';
    //         setIsStaticMode(isStatic);
    //     }
    // }, []);
    
    // Если статический режим, возвращаем статические данные
    // if (isStaticMode) {
    //     return createStaticAuthHook();
    // }

    useEffect(() => {
        let mounted = true;
        
        // Таймаут для защиты от бесконечной загрузки
        const timeout = setTimeout(() => {
            if (mounted) {
                console.warn('Auth initialization timeout');
                setLoading(false);
            }
        }, 10000); // 10 секунд максимум
          // Get initial session
        const initAuth = () => {
            setLoading(true);
            
            supabase.auth.getSession()
                .then(({ data: { session } }) => {
                    if (!mounted) return;
                      setSession(session);
                    setUser(session?.user || null);
                    
                    // Get user profile if authenticated
                    if (session?.user) {
                        fetchUserProfile(session.user.id);
                    } else {
                        setProfile(null);
                    }
                })
                .catch(error => {
                    console.error('Error initializing auth:', error);
                    if (mounted) {                        setSession(null);
                        setUser(null);
                        setProfile(null);
                    }
                })
                .finally(() => {
                    if (mounted) {
                        setLoading(false);
                        clearTimeout(timeout);
                    }
                });
        };
          // Set up auth subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: string, session: Session | null) => {
                if (!mounted) return;
                
                console.log('Auth state change:', event, session?.user?.id);
                
                // Обработка различных событий авторизации
                if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
                    setSession(null);
                    setUser(null);
                    setProfile(null);
                } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setSession(session);
                    setUser(session?.user || null);
                    
                    if (session?.user) {
                        fetchUserProfile(session.user.id);
                    } else {
                        setProfile(null);
                    }
                } else if (event === 'USER_UPDATED') {
                    setSession(session);
                    setUser(session?.user || null);
                    
                    if (session?.user) {
                        fetchUserProfile(session.user.id);
                    }
                }
                
                // Убеждаемся, что loading всегда сбрасывается
                if (mounted) {
                    setLoading(false);
                }
            }
        );
        
        initAuth();
        
        return () => {
            mounted = false;
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
                
            if (error) {
                if (error.code === 'PGRST116') {
                    // Профиль не найден, создаем новый
                    console.log('Profile not found, creating new one...');
                    try {
                        await createUserProfile(userId);
                        // После создания профиля, попробуем загрузить еще раз
                        setTimeout(() => {
                            fetchUserProfile(userId);
                        }, 500);
                    } catch (err: any) {
                        console.error('Error creating profile:', err);
                        // Если профиль уже существует, попробуем загрузить его еще раз
                        if (err.code === '23505' || err.message?.includes('duplicate key')) {
                            console.log('Profile already exists, trying to fetch again...');
                            setTimeout(() => {
                                fetchUserProfile(userId);
                            }, 300);
                        } else {
                            setProfile(null);
                        }
                    }
                    return;
                } else {
                    console.error('Error fetching user profile:', error);
                    setProfile(null);
                }
            } else {
                setProfile(data);
            }
        } catch (error: any) {
            console.error('Database error:', error);
            setProfile(null);
        }
    };    const createUserProfile = async (userId: string) => {
        try {
            // Сначала проверим, не существует ли уже профиль
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();
                
            if (existingProfile) {
                console.log('Profile already exists');
                return existingProfile;
            }
            
            // Получаем email пользователя из auth
            const { data: { user } } = await supabase.auth.getUser();
            
            const newProfile = {
                id: userId,
                email: user?.email || '',
                first_name: '',
                last_name: '',
                role: 'student' as const,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('profiles')
                .insert(newProfile)
                .select()
                .single();

            if (error) {
                // Если ошибка duplicate key, это не критично
                if (error.code === '23505') {
                    console.log('Profile already exists (duplicate key)');
                    // Попробуем получить существующий профиль
                    const { data: existingData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();
                    
                    if (existingData) {
                        setProfile(existingData);
                        return existingData;
                    }
                }
                throw error;
            }
            
            console.log('Profile created successfully:', data);
            setProfile(data);
            return data;
        } catch (error: any) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    };const signIn = async (email: string, password: string) => {
        setLoading(true);
        setUser(null);
        setSession(null);
        setProfile(null);
        
        try {
            // Очищаем любые предыдущие сессии
            await supabase.auth.signOut();
            
            const { data, error } = await supabase.auth.signInWithPassword({ 
                email, 
                password 
            });
            
            if (error) {
                console.error('SignIn error:', error);
                // Обработка специфичных ошибок Supabase
                if (error.message?.includes('Invalid login credentials')) {
                    throw new Error('Невірний email або пароль');
                } else if (error.message?.includes('Email not confirmed')) {
                    throw new Error('Підтвердіть свою електронну пошту');
                } else if (error.message?.includes('Too many requests')) {
                    throw new Error('Забагато спроб входу. Спробуйте пізніше');
                } else {
                    throw error;
                }
            }
            
            setUser(data.user);
            setSession(data.session);
            
            // Fetch profile after successful login
            if (data.user) {
                await fetchUserProfile(data.user.id);
            }
            
            return { user: data.user, error: null };
        } catch (error: any) {
            console.error('Sign in error:', error);
            setUser(null);
            setSession(null);
            setProfile(null);
            return { user: null, error };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            
            // Немедленно очищаем состояние
            setUser(null);
            setSession(null);
            setProfile(null);
            
            
            // Делаем запрос на выход
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('Sign out error:', error);
            }
            
            // Принудительная очистка через небольшой таймаут
            setTimeout(() => {
                setUser(null);
                setSession(null);
                setProfile(null);
                
                setLoading(false);
            }, 200);
            
            return { error };
        } catch (error) {
            console.error('Error signing out:', error);
            // Все равно очищаем состояние даже при ошибке
            setUser(null);
            setSession(null);
            setProfile(null);
            
            setLoading(false);
            return { error };
        }
    };

    const updateAvatar = async (file: File) => {
        if (!user || !profile) {
            throw new Error('User not authenticated');
        }

        try {
            // Генеруємо унікальне ім'я файлу
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Завантажуємо файл до Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Отримуємо публічний URL
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const avatarUrl = urlData.publicUrl;

            // Оновлюємо профіль в базі даних
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Оновлюємо локальний стан
            setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user || !profile) {
            throw new Error('User not authenticated');
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            // Оновлюємо локальний стан
            setProfile(prev => prev ? { ...prev, ...updates } : null);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return { 
        user, 
        session, 
        profile, 
        loading, 
        signIn, 
        signOut,
        updateAvatar,
        updateProfile,
        // Пользователь считается авторизованным только если есть и user и profile
        isAuthenticated: !!(user && profile),
        role: profile?.role || null
    };
};

export default useAuth;
