import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    
    // Handle locale redirects
    if (
        pathname === '/' ||
        (pathname !== '/uk' &&
            pathname !== '/en' &&
            !pathname.startsWith('/uk/') &&
            !pathname.startsWith('/en/'))
    ) {
        // Get preferred locale from cookie or default to Ukrainian
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'uk';
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }
    
    // Authentication handling
    if ((pathname.includes('/admin') || pathname.includes('/dashboard'))) {
        // Get auth token from cookie
        const sessionCookie = request.cookies.get('sb-auth-token')?.value;
        
        if (!sessionCookie) {
            // Get the locale from the path
            const locale = pathname.split('/')[1] || 'uk';
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
        
        // Check if it's an admin page and user has teacher role
        if (pathname.includes('/admin')) {
            const response = NextResponse.next();
            const supabaseClient = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || '',
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                {
                    cookies: {
                        get(name) {
                            return request.cookies.get(name)?.value;
                        },
                        set(name, value, options) {
                            response.cookies.set(name, value);
                        },
                        remove(name, options) {
                            response.cookies.delete(name);
                        },
                    },
                }
            );

            try {
                const { data: { user } } = await supabaseClient.auth.getUser(sessionCookie);
                
                if (!user) {
                    // No valid user, redirect to login
                    const locale = pathname.split('/')[1] || 'uk';
                    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
                }
                
                // Get user role from profiles table
                const { data: profile } = await supabaseClient
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                    
                if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
                    // User does not have permission, redirect to dashboard
                    const locale = pathname.split('/')[1] || 'uk';
                    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
                }
            } catch (error) {
                // Error checking role, redirect to login
                const locale = pathname.split('/')[1] || 'uk';
                return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
            }
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