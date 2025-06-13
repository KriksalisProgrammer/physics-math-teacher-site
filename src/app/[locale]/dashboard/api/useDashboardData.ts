'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/lib/useDictionary';
import { Lesson } from '@/types/lessons';

// Static fallback for dashboard data - ensures page always renders in static export
export function useDashboardData(isAuthenticated: boolean, locale: string) {
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    upcomingLessons: 0,
    activeSessions: 0
  });
  
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingLessons(true);
      try {
        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();
        
        if (statsData.data) {
          setStats(statsData.data);
        }
        
        // Fetch upcoming lessons
        const lessonsResponse = await fetch(`/api/lessons/upcoming?locale=${locale}`);
        const lessonsData = await lessonsResponse.json();
        
        if (lessonsData.data) {
          setUpcomingLessons(lessonsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoadingLessons(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, locale]);

  return {
    stats,
    upcomingLessons,
    loadingLessons
  };
}
