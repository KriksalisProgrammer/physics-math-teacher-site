'use client';

import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onRemove: (id: string) => void;
}

const ToastItem = ({ id, type, title, message, duration = 3000, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Показать toast
    setTimeout(() => setIsVisible(true), 100);

    // Автоматически скрыть через duration
    const timer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-pink-600',
    info: 'from-blue-500 to-cyan-600',
    warning: 'from-yellow-500 to-orange-600'
  };

  return (
    <div className={`transform transition-all duration-300 ${
      isVisible && !isRemoving 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-white/50 backdrop-blur-lg overflow-hidden`}>
        <div className={`h-1 bg-gradient-to-r ${colors[type]}`}></div>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 bg-gradient-to-r ${colors[type]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                {icons[type]}
              </div>
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-lg inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors p-1"
                onClick={handleRemove}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          {...toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
export type { Toast };
