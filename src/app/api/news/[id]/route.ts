import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        const body = await request.json();
        const { title_uk, title_en, content_uk, content_en, author_id } = body;

        // Validate required fields
        if (!title_uk || !title_en || !content_uk || !content_en) {
            return NextResponse.json(
                { error: 'Missing required fields: title_uk, title_en, content_uk, content_en' }, 
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('news')
            .update({
                title_uk,
                title_en,
                content_uk,
                content_en,
                author_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
            message: 'News updated successfully', 
            data 
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON body' }, 
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'News deleted successfully' });
}