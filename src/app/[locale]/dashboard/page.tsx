'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/lib/useDictionary';
import { useSupabase } from '@/hooks/useSupabase';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/utils/formatDate';
import { Database } from '@/types/database.types';

type Lesson = Database['public']['Tables']['lessons']['Row'];

export default function DashboardPage() {
  const { dictionary, locale } = useDictionary();
  const { profile, loading } = useSupabase();
  const router = useRouter();
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  useEffect(() => {
    const fetchUpcomingLessons = async () => {
      setLoadingLessons(true);
      try {
        const { data } = await fetch(`/api/lessons/upcoming?locale=${locale}`)
          .then(res => res.json());
        
        if (data) {
          setUpcomingLessons(data);
        }
      } catch (error) {
        console.error("Failed to fetch upcoming lessons:", error);
      } finally {
        setLoadingLessons(false);
      }
    };

    if (!loading) {
      fetchUpcomingLessons();
    }
  }, [locale, loading]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">{dictionary.common.loading}</p>
      </div>
    );
  }
  
  if (!profile) {
    router.push(`/${locale}/login`);
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {dictionary.dashboard?.welcome || dictionary.common.dashboard}
        </h1>
        {isTeacher && (
          <Link href={`/${locale}/admin`}>
            <Button variant="secondary">
              {dictionary.common.admin}
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card
          title={dictionary.dashboard?.profile || "Profile"}
          className="col-span-1"
        >
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">{dictionary.auth.email}</p>
              <p>{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{dictionary.dashboard?.role || "Role"}</p>
              <p className="capitalize">{profile.role}</p>
            </div>
            {profile.first_name && (
              <div>
                <p className="text-sm text-gray-500">{dictionary.dashboard?.name || "Name"}</p>
                <p>{profile.first_name} {profile.last_name}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link href={`/${locale}/profile`}>
              <Button variant="secondary" className="w-full">
                {dictionary.dashboard?.editProfile || "Edit Profile"}
              </Button>
            </Link>
          </div>
        </Card>
        
        <Card
          title={dictionary.dashboard?.upcomingLessons || "Upcoming Lessons"}
          className="col-span-2"
        >
          {loadingLessons ? (
            <p>{dictionary.common.loading}</p>
          ) : upcomingLessons.length > 0 ? (
            <div className="space-y-4">
              {upcomingLessons.map(lesson => (
                <div key={lesson.id} className="border rounded-md p-3 hover:bg-gray-50">
                  <h3 className="font-medium">
                    {locale === 'uk' ? lesson.title_uk : lesson.title_en}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {locale === 'uk' ? lesson.description_uk : lesson.description_en}
                  </p>
                  {lesson.meeting_link && (
                    <div className="mt-2">
                      <Link href={`/${locale}/lessons/${lesson.id}`}>
                        <Button size="small" className="w-full">
                          {dictionary.lessons?.joinLesson || "Join Lesson"}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>{dictionary.dashboard?.noUpcomingLessons || "No upcoming lessons"}</p>
          )}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={dictionary.common.blog}>
          <Link href={`/${locale}/blog`} className="text-blue-600 hover:underline">
            {dictionary.common.view_all}
          </Link>
        </Card>
        
        <Card title={dictionary.common.news}>
          <Link href={`/${locale}/news`} className="text-blue-600 hover:underline">
            {dictionary.common.view_all}
          </Link>
        </Card>
      </div>
    </div>
  );
}