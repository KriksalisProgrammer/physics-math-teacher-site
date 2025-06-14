import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../types/database.types';

export const createSupabaseServerClient = () => {
  // Убираем проверку статического экспорта
  // if (process.env.NEXT_PHASE === 'phase-export') {
  //   return {
  //     auth: {
  //       getSession: () => ({ data: { session: null } }),
  //       getUser: () => ({ data: { user: null } })
  //     }
  //   } as any;
  // }

  const cookieStore = cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  );
};
