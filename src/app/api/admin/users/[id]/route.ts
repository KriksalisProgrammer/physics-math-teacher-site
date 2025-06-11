import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET specific user profile
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            posts:posts!author_id(count),
            lessons:lessons!teacher_id(count),
            comments:comments!author_id(count)
        `)
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
}

// PUT to update user profile
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        const body = await request.json();        const { 
            first_name, 
            last_name, 
            role, 
            phone, 
            bio, 
            avatar_url
        } = body;

        // Validate role if provided
        if (role && !['student', 'teacher', 'admin'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be student, teacher, or admin' }, 
                { status: 400 }
            );
        }

        const updateData: any = {
            updated_at: new Date().toISOString()
        };        // Only update provided fields
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (role !== undefined) updateData.role = role;
        if (phone !== undefined) updateData.phone = phone;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
            message: 'User profile updated successfully', 
            data 
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON body' }, 
            { status: 400 }
        );
    }
}

// DELETE user profile
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
        message: 'User profile deleted successfully'
    });
}
