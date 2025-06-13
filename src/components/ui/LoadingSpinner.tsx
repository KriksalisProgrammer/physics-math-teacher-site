'use client';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'white' | 'gray';
  message?: string;
}

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'blue', 
  message 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-transparent border-t-current rounded-full animate-spin opacity-30`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      {message && (
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
