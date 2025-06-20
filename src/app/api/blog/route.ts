import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types/blog';

export async function GET() {
    const { data, error } = await supabase
        .from('posts')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { title_uk, title_en, content_uk, content_en, authorId } = body;

    const { data, error } = await supabase
        .from('posts')
        .insert({ title_uk, title_en, content_uk, content_en, author_id: authorId });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}