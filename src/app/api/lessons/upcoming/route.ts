// API route for lessons/upcoming
import { NextRequest, NextResponse } from 'next/server';

// Mock data for static export compatibility
const mockLessons = [
  {
    id: 'lesson-1',
    title_uk: 'Механіка: основи',
    title_en: 'Mechanics: Basics',
    description_uk: 'Вивчення основних принципів механіки',
    description_en: 'Study of basic principles of mechanics',
    created_at: '2025-06-15T10:00:00Z',
    status: 'scheduled',
    meeting_link: 'https://meet.example.com/lesson-1'
  },
  {
    id: 'lesson-2',
    title_uk: 'Термодинаміка',
    title_en: 'Thermodynamics',
    description_uk: 'Закони термодинаміки та їх застосування',
    description_en: 'Laws of thermodynamics and their applications',
    created_at: '2025-06-18T14:00:00Z',
    status: 'scheduled',
    meeting_link: 'https://meet.example.com/lesson-2'
  }
];

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // During static export, return mock data
  return NextResponse.json({ data: mockLessons });
}
