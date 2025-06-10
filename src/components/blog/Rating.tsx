import React, { useState } from 'react';

interface RatingProps {
  initialRating?: number;
  onRatingChange: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);

  const handleRatingClick = (value: number) => {
    setRating(value);
    onRatingChange(value);
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            value <= rating ? 'bg-yellow-500' : 'bg-gray-300'
          }`}
          onClick={() => handleRatingClick(value)}
          aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

export default Rating;