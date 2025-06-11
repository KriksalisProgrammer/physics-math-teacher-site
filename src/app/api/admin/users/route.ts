import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// GET all user profiles for admin management
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    // Filter by role
    if (userRole && ['student', 'teacher', 'admin'].includes(userRole)) {
        query = query.eq('role', userRole as 'student' | 'teacher' | 'admin');
    }

    // Search by name or email
    if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        data,
        pagination: {
            total: count,
            limit,
            offset,
            hasMore: count ? offset + limit < count : false
        }
    });
}

// POST to create new user profile (admin only)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            email, 
            first_name, 
            last_name, 
            role = 'student',
            avatar_url 
        } = body;

        // Validate required fields
        if (!email || !first_name || !last_name) {
            return NextResponse.json(
                { error: 'Missing required fields: email, first_name, last_name' }, 
                { status: 400 }
            );
        }

        // Validate role
        if (!['student', 'teacher', 'admin'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be student, teacher, or admin' }, 
                { status: 400 }
            );
        }

        const insertData = {
            email,
            first_name,
            last_name,
            role: role as 'student' | 'teacher' | 'admin',
            avatar_url
        };

        // Use any type to bypass strict typing for insert
        const { data, error } = await supabase
            .from('profiles')
            .insert(insertData as any)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
            message: 'User profile created successfully', 
            data 
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON body' }, 
            { status: 400 }
        );
    }
}
