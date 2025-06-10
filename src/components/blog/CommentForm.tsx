'use client';

import React, { useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { useDictionary } from '../../lib/useDictionary';
import Rating from './Rating';
import { supabase } from '../../lib/supabase';

interface CommentFormProps {
    postId: string;
    onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
    const { profile, session } = useSupabase();
    const { dictionary } = useDictionary();
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRatingChange = (value: number) => {
        setRating(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Basic validation
        if (!comment.trim()) {
            setError(dictionary.blog.commentRequired || 'Comment is required');
            setLoading(false);
            return;
        }

        try {
            if (!session?.user?.id) {
                throw new Error(dictionary.auth?.login_required || 'Login required to comment');
            }
            
            const { error } = await supabase
                .from('comments')
                .insert([{ 
                    post_id: postId, 
                    content: comment,
                    rating: rating > 0 ? rating : null,
                    author_id: session.user.id
                }]);

            if (error) throw error;

            setComment('');
            setRating(0);
            setSuccess(true);
            
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
            <h3 className="font-medium text-lg mb-4">
                {dictionary.blog.leave_comment}
            </h3>
            
            {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                {dictionary.blog.comment_submitted}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        {dictionary.blog.comments}
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={dictionary.blog.comment_placeholder}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {dictionary.blog.your_rating}
                    </label>
                    <Rating initialRating={rating} onRatingChange={handleRatingChange} />
                </div>
                
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full md:w-auto px-4 py-2 text-white rounded-md ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                    >
                        {loading ? dictionary.common.loading : dictionary.blog.submit_comment}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;