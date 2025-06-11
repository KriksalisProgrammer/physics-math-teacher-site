import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET specific comment with full details
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles:author_id (
                first_name,
                last_name,
                email,
                avatar_url
            ),
            posts:post_id (
                title_uk,
                title_en,
                id
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
}

// PATCH to moderate specific comment
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        const body = await request.json();
        const { action, moderatorId, content } = body;

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'action must be approve or reject' }, 
                { status: 400 }
            );
        }

        const updateData: any = {
            is_approved: action === 'approve',
            moderated_at: new Date().toISOString(),
            moderated_by: moderatorId
        };

        // If editing content while moderating
        if (content) {
            updateData.content = content;
        }

        const { data, error } = await supabase
            .from('comments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
            message: `Comment ${action}d successfully`,
            data 
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON body' }, 
            { status: 400 }
        );
    }
}

// DELETE specific comment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
}
