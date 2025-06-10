import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Comment } from '@/types/blog';

export async function GET() {
    const { data, error } = await supabase
        .from('comments')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const { content, postId, userId } = await request.json();

    const { data, error } = await supabase
        .from('comments')
        .insert({ content, post_id: postId, author_id: userId });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}