import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create service role client 
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: Request) {
    try {
        const { action, email, firstName, lastName, age } = await request.json();

        if (action === 'create_missing_profiles') {
            // Get all users from auth
            const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            
            if (authError) {
                return NextResponse.json({ 
                    error: `Failed to get users: ${authError.message}` 
                }, { status: 500 });
            }

            // Get existing profiles
            const { data: existingProfiles, error: profilesError } = await supabaseAdmin
                .from('profiles')
                .select('id');

            if (profilesError) {
                return NextResponse.json({ 
                    error: `Failed to get profiles: ${profilesError.message}` 
                }, { status: 500 });
            }

            const existingIds = new Set(existingProfiles?.map(p => p.id) || []);
            const usersWithoutProfiles = authUsers.users.filter(user => !existingIds.has(user.id));

            if (usersWithoutProfiles.length === 0) {
                return NextResponse.json({ 
                    message: 'All users already have profiles',
                    created: 0 
                });
            }

            // Create profiles for users without them
            const profilesData = usersWithoutProfiles.map(user => ({
                id: user.id,
                email: user.email,
                role: 'student' as const,
                first_name: user.user_metadata?.first_name || user.raw_user_meta_data?.first_name || '',
                last_name: user.user_metadata?.last_name || user.raw_user_meta_data?.last_name || '',
                age: user.user_metadata?.age || user.raw_user_meta_data?.age || null
            }));

            const { data: createdProfiles, error: createError } = await supabaseAdmin
                .from('profiles')
                .insert(profilesData)
                .select();

            if (createError) {
                return NextResponse.json({ 
                    error: `Failed to create profiles: ${createError.message}`,
                    details: createError
                }, { status: 500 });
            }

            return NextResponse.json({ 
                message: `Created ${createdProfiles?.length || 0} profiles`,
                created: createdProfiles?.length || 0,
                profiles: createdProfiles
            });
        }

        if (action === 'create_single_profile') {
            if (!email) {
                return NextResponse.json({ error: 'Email required' }, { status: 400 });
            }

            // Find user by email
            const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            
            if (authError) {
                return NextResponse.json({ 
                    error: `Failed to get users: ${authError.message}` 
                }, { status: 500 });
            }

            const user = authUsers.users.find(u => u.email === email);
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Create profile
            const profileData = {
                id: user.id,
                email: user.email,
                role: 'student' as const,
                first_name: firstName || user.user_metadata?.first_name || user.raw_user_meta_data?.first_name || '',
                last_name: lastName || user.user_metadata?.last_name || user.raw_user_meta_data?.last_name || '',
                age: age ? parseInt(age) : (user.user_metadata?.age || user.raw_user_meta_data?.age || null)
            };

            const { data: profile, error: createError } = await supabaseAdmin
                .from('profiles')
                .insert(profileData)
                .select()
                .single();

            if (createError) {
                return NextResponse.json({ 
                    error: `Failed to create profile: ${createError.message}`,
                    details: createError
                }, { status: 500 });
            }

            return NextResponse.json({ 
                message: 'Profile created successfully',
                profile: profile
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ 
            error: `Server error: ${error.message}` 
        }, { status: 500 });
    }
}
