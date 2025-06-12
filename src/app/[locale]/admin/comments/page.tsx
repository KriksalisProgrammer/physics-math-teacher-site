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
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {typeof dictionary.admin?.commentsDetails === 'object' 
                            ? dictionary.admin.commentsDetails.commentModeration || dictionary.admin.commentsDetails.total
                            : 'Comments Moderation'}
                    </h1>
                    <p className="text-gray-600">
                        {typeof dictionary.admin?.commentsDetails === 'object' 
                            ? dictionary.admin.commentsDetails.commentModerationDescription
                            : 'Manage and moderate user comments'}
                    </p>
                </div>
                <CommentModeration />
            </div>
        </AdminLayout>
    );
};

export default CommentsPage;