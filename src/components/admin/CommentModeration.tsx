import React, { useEffect, useState, useCallback } from 'react';
import { useDictionary } from '../../lib/useDictionary';
import { supabase } from '../../lib/supabase';
import { SupabaseComment } from '../../types/supabase';

interface CommentWithDetails extends SupabaseComment {
  author_name?: string;
  content_title?: string;
  content_type?: string;
  profiles?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string;
  } | null;
}

const CommentModeration: React.FC = () => {
  const { dictionary } = useDictionary();
  const [comments, setComments] = useState<CommentWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  
  // Helper function to translate
  const t = (key: string): string => {
    if (!dictionary.admin || !dictionary.admin[key]) return key;
    const value = dictionary.admin[key];
    return typeof value === 'string' ? value : key;
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    
    try {
      // Create a query that joins comments with profiles to get author information
      let query = supabase
        .from('comments')
        .select(`
          *,
          profiles:author_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
        
      // Apply filter if needed
      if (filter === 'pending') {
        query = query.eq('is_approved', false);
      } else if (filter === 'approved') {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch post/news titles for each comment
      const commentsWithContent = await Promise.all(
        (data || []).map(async (comment: any) => {
          let enhancedComment = {
            ...comment,
            profiles: comment.profiles || null
          };

          // Try to get post title if post_id exists
          if (comment.post_id) {
            const { data: postData } = await supabase
              .from('posts')
              .select('title_uk, title_en')
              .eq('id', comment.post_id)
              .single();
              
            if (postData) {
              enhancedComment.content_title = postData.title_uk || postData.title_en;
              enhancedComment.content_type = 'post';
            }
          }
          
          return enhancedComment;
        })
      );
      
      setComments(commentsWithContent);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('comments')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) {
      console.error('Error approving comment:', error);
    } else {
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, is_approved: true } : comment
      ));
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('comments')
      .update({ is_approved: false })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting comment:', error);
    } else {
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, is_approved: false } : comment
      ));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting comment:', error);
    } else {
      setComments(comments.filter(comment => comment.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{t('commentModeration')}</h2>
        <p className="mt-1 text-sm text-gray-500">{t('commentModerationDescription')}</p>
        
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'pending'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('pending')}
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'approved'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('approved')}
          </button>
        </div>
      </div>
      
      {comments.length === 0 ? (
        <div className="text-center py-10 px-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noComments')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('noCommentsDescription')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <li key={comment.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {comment.profiles?.first_name || comment.profiles?.email || t('anonymous')}
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {comment.content_type || t('post')}
                    </span>
                    {comment.is_approved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('approved')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {t('pending')}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                </div>
                
                {comment.content_title && (
                  <div className="text-sm text-gray-500">
                    {t('commentOn')}: {comment.content_title}
                  </div>
                )}
                
                <div className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                  {comment.content}
                </div>
                
                {comment.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 mr-1">{t('rating')}:</span>
                    <span className="text-yellow-500">
                      {"★".repeat(comment.rating)}
                      {"☆".repeat(5 - comment.rating)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-2">
                  {!comment.is_approved && (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {t('approve')}
                    </button>
                  )}
                  {comment.is_approved && (
                    <button
                      onClick={() => handleReject(comment.id)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      {t('unapprove')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentModeration;