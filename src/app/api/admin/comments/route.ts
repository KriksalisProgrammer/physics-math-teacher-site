import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all comments for moderation (including unapproved)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
        .from('comments')
        .select(`
            *,
            profiles:author_id (
                first_name,
                last_name,
                email
            ),
            posts:post_id (
                title_uk,
                title_en
            )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    // Filter by approval status
    if (status === 'pending') {
        query = query.is('is_approved', null);
    } else if (status === 'approved') {
        query = query.eq('is_approved', true);
    } else if (status === 'rejected') {
        query = query.eq('is_approved', false);
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

// PATCH for bulk moderation actions
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { commentIds, action, moderatorId } = body;

        // Validate input
        if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
            return NextResponse.json(
                { error: 'commentIds array is required' }, 
                { status: 400 }
            );
        }

        if (!['approve', 'reject', 'delete'].includes(action)) {
            return NextResponse.json(
                { error: 'action must be approve, reject, or delete' }, 
                { status: 400 }
            );
        }

        let updateData: any = {
            moderated_at: new Date().toISOString(),
            moderated_by: moderatorId
        };

        if (action === 'approve') {
            updateData.is_approved = true;
        } else if (action === 'reject') {
            updateData.is_approved = false;
        }

        if (action === 'delete') {
            // Delete comments
            const { error } = await supabase
                .from('comments')
                .delete()
                .in('id', commentIds);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            return NextResponse.json({ 
                message: `${commentIds.length} comments deleted successfully` 
            });
        } else {
            // Update approval status
            const { data, error } = await supabase
                .from('comments')
                .update(updateData)
                .in('id', commentIds)
                .select();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            return NextResponse.json({ 
                message: `${commentIds.length} comments ${action}d successfully`,
                data 
            });
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON body' }, 
            { status: 400 }
        );
    }
}
