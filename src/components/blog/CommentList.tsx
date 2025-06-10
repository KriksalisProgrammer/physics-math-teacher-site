import React from 'react';
import { formatDate } from '../../utils/formatDate';
import { useDictionary } from '../../lib/useDictionary';
import { SupabaseComment } from '../../types/supabase';

interface CommentWithAuthor extends SupabaseComment {
  author_name?: string;
  author_email?: string;
}

interface CommentListProps {
  comments: CommentWithAuthor[];
  showAverage?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  showAverage = true 
}) => {
  const { dictionary, locale } = useDictionary();
  
  // Calculate average rating if comments have ratings
  const ratingsCount = comments.filter(comment => comment.rating).length;
  const averageRating = ratingsCount > 0 
    ? comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / ratingsCount 
    : 0;
  
  if (comments.length === 0) {
    return (
      <div className="mt-8 bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">{dictionary.blog.no_comments}</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {dictionary.blog.comments} ({comments.length})
        </h3>
        
        {showAverage && ratingsCount > 0 && (
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">
              {dictionary.blog.average_rating}:
            </span>
            <span className="text-yellow-500 font-medium">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </span>
            <span className="ml-1 text-sm text-gray-600">
              ({averageRating.toFixed(1)})
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {comment.author_name || comment.author_email || dictionary.blog.anonymous}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(comment.created_at, locale)}
                </p>
              </div>
              
              {comment.rating && (
                <div className="text-yellow-500">
                  {"★".repeat(comment.rating)}
                  {"☆".repeat(5 - comment.rating)}
                </div>
              )}
            </div>
            
            <div className="mt-2 text-gray-700 whitespace-pre-line">
              {comment.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;