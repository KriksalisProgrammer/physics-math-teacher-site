import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Lesson } from '@/types/lessons';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Lesson deleted successfully' });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    try {
        const body = await request.json();
        const { 
            title_uk, 
            title_en, 
            description_uk, 
            description_en, 
            meeting_link, 
            teacher_id,
            scheduled_at,
            duration_minutes 
        } = body;

        // Validate required fields
        if (!title_uk || !title_en || !teacher_id) {
            return NextResponse.json(
                { error: 'Missing required fields: title_uk, title_en, teacher_id' }, 
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('lessons')
            .update({
                title_uk,
                title_en,
                description_uk,
                description_en,
                meeting_link,
                teacher_id,
                scheduled_at,
                duration_minutes,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
            message: 'Lesson updated successfully', 
            data 
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON body' }, 
            { status: 400 }
        );
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const lessonUpdates: Partial<Lesson> = await request.json();

    const { data, error } = await supabase
        .from('lessons')
        .update(lessonUpdates)
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
}