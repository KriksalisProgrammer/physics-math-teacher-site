import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client for user management
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // You need to add this to your .env.local
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: Request) {
    try {
        const { action, email } = await request.json();

        if (action === 'check_user') {
            // Check if user exists in auth.users
            const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            if (authError) {
                return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 500 });
            }

            const user = authUsers.users.find(u => u.email === email);
            if (!user) {
                return NextResponse.json({ 
                    status: 'USER_NOT_FOUND',
                    message: 'User does not exist in auth.users'
                });
            }

            // Check if profile exists
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
                    createdAt: user.created_at
                },
                profile: profile,
                profileError: profileError?.message
            });
        }

        if (action === 'create_profile') {
            // Get user from auth
            const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            if (authError) {
                return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 500 });
            }

            const user = authUsers.users.find(u => u.email === email);
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Create profile manually
            const { data: profile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    role: 'student',
                    first_name: user.user_metadata?.first_name || '',
                    last_name: user.user_metadata?.last_name || ''
                })
                .select()
                .single();

            if (profileError) {
                return NextResponse.json({ 
                    error: `Profile creation failed: ${profileError.message}` 
                }, { status: 500 });
            }

            return NextResponse.json({
                status: 'PROFILE_CREATED',
                profile: profile
            });
        }

        if (action === 'fix_all_users') {
            // Get all users without profiles and create them
            const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            if (authError) {
                return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 500 });
            }

            const { data: existingProfiles, error: profilesError } = await supabaseAdmin
                .from('profiles')
                .select('id');

            if (profilesError) {
                return NextResponse.json({ error: `Profiles error: ${profilesError.message}` }, { status: 500 });
            }

            const existingProfileIds = new Set(existingProfiles?.map(p => p.id) || []);
            const usersNeedingProfiles = authUsers.users.filter(user => !existingProfileIds.has(user.id));

            if (usersNeedingProfiles.length === 0) {
                return NextResponse.json({
                    status: 'NO_ACTION_NEEDED',
                    message: 'All users already have profiles'
                });
            }

            // Create profiles for users who don't have them
            const profilesToCreate = usersNeedingProfiles.map(user => ({
                id: user.id,
                email: user.email,
                role: 'student' as const,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || ''
            }));

            const { data: createdProfiles, error: createError } = await supabaseAdmin
                .from('profiles')
                .insert(profilesToCreate)
                .select();

            if (createError) {
                return NextResponse.json({ 
                    error: `Bulk profile creation failed: ${createError.message}` 
                }, { status: 500 });
            }

            return NextResponse.json({
                status: 'PROFILES_CREATED',
                created: createdProfiles?.length || 0,
                profiles: createdProfiles
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ 
            error: `Server error: ${error.message}` 
        }, { status: 500 });
    }
}
