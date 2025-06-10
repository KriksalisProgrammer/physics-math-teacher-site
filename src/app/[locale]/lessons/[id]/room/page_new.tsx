'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LessonRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, id } = params;

  useEffect(() => {
    // Перенаправляем обратно на страницу урока
    router.push(`/${locale}/lessons/${id}`);
  }, [locale, id, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {locale === 'uk' ? 'Перенаправлення...' : 'Redirecting...'}
        </h1>
        <p className="text-gray-600">
          {locale === 'uk' 
            ? 'Перенаправляємо вас на сторінку уроку...' 
            : 'Redirecting you to the lesson page...'
          }
        </p>
      </div>
    </div>
  );
}
