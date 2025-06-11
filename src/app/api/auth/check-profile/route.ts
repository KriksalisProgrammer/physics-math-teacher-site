import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client for testing
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        // Check auth.users
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        if (authError) {
            return NextResponse.json({ 
                error: `Auth error: ${authError.message}`,
                authUsers: null,
                profile: null
            });
        }

        const user = authUsers.users.find(u => u.email === email);
        if (!user) {
            return NextResponse.json({
                status: 'USER_NOT_FOUND',
                message: 'User not found in auth.users',
                authUsers: null,
                profile: null
            });
        }

        // Check profiles table
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return NextResponse.json({
            status: 'SUCCESS',
            user: {
                id: user.id,
                email: user.email,
                emailConfirmed: !!user.email_confirmed_at,
                createdAt: user.created_at,
                userMetadata: user.user_metadata,
                rawUserMetadata: user.raw_user_meta_data
            },
            profile: profile,
            profileError: profileError?.message || null
        });

    } catch (error: any) {
        return NextResponse.json({
            error: `Server error: ${error.message}`,
            authUsers: null,
            profile: null
        }, { status: 500 });
    }
}
