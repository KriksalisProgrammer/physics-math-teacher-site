'use client';

import React from 'react';
import CommentForm from '@/components/blog/CommentForm';
import CommentList from '@/components/blog/CommentList';
import { SupabaseComment } from '@/types/supabase';

interface CommentSectionProps {
  postId: string;
  comments: any[];
  dictionary: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, 
  comments, 
  dictionary 
}) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">{dictionary.blog.comments}</h2>
      <CommentForm postId={postId} />
      
      <div className="mt-8">
        <CommentList comments={comments} />
      </div>
    </div>
  );
};

export default CommentSection;
