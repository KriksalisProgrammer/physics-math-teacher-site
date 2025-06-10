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