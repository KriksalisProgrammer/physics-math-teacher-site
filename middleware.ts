import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    
    // Handle locale redirects
    const supportedLocales = ['uk', 'en'];
    const pathnameWithoutLocale = pathname.split('/').slice(2).join('/');
    const currentLocale = pathname.split('/')[1];
    
    // If no locale or unsupported locale, redirect to supported locale
    if (pathname === '/' || !supportedLocales.includes(currentLocale)) {
        // Get preferred locale from cookie or default to Ukrainian
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'uk';
        const redirectPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    // Authentication handling
    if ((pathname.includes('/admin') || pathname.includes('/dashboard'))) {
        let response = NextResponse.next();
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: any) {
                        response.cookies.set({ name, value, ...options })
                    },
                    remove(name: string, options: any) {
                        response.cookies.set({ name, value: '', ...options })
                    },
                },
            }
        )

        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            
            if (error || !user) {
                // No valid user, redirect to login
                const locale = pathname.split('/')[1] || 'uk';
                return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
            }
            
            // Check if it's an admin page and user has appropriate role
            if (pathname.includes('/admin')) {
                // Get user role from profiles table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                    
                if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
                    // User does not have permission, redirect to dashboard
                    const locale = pathname.split('/')[1] || 'uk';
                    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
                }
            }
            
            return response;
        } catch (error) {
            // Error checking authentication, redirect to login
            const locale = pathname.split('/')[1] || 'uk';
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        // Match all paths except api, _next/static, _next/image, favicon.ico, etc.
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};