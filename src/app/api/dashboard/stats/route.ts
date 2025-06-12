import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get lesson statistics
    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .or(profile.role === 'teacher' ? 'teacher_id.eq.' + user.id : 'id.gte.0');

    const now = new Date();
    const upcomingLessons = lessons?.filter(lesson => 
      new Date(lesson.scheduled_at || lesson.created_at) > now
    ) || [];
    
    const completedLessons = lessons?.filter(lesson => 
      lesson.status === 'completed'
    ) || [];

    // Mock active sessions (in real app, you'd track this properly)
    const activeSessions = Math.floor(Math.random() * 3); // 0-2 active sessions

    const stats = {
      totalLessons: lessons?.length || 0,
      completedLessons: completedLessons.length,
      upcomingLessons: upcomingLessons.length,
      activeSessions: activeSessions
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
