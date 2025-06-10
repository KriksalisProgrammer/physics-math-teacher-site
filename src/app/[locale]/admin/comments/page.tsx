'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/hooks/useSupabase';
import { useDictionary } from '@/lib/useDictionary';
import CommentModeration from '@/components/admin/CommentModeration';
import AdminLayout from '@/components/layouts/AdminLayout';

const CommentsPage = () => {
    const router = useRouter();
    const { dictionary } = useDictionary();
    const { supabase } = useSupabase();

    return (
        <AdminLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">
                    {dictionary.admin?.comments || 'Comments Moderation'}
                </h1>
                <CommentModeration />
            </div>
        </AdminLayout>
    );
};

export default CommentsPage;