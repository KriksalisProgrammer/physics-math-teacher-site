'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose?: (id: string) => void;
}

const Notification = ({ id, type, title, message, duration = 5000, onClose }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconBg: 'bg-green-100'
        };
      case 'error':
        return {
          icon: '❌',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconBg: 'bg-yellow-100'
        };
      case 'info':
      default:
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const styles = getTypeStyles();

  return createPortal(
    <div 
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`rounded-2xl shadow-2xl backdrop-blur-lg ${styles.bgColor} ${styles.borderColor} border-2 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              <span className="text-sm">{styles.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold ${styles.textColor} mb-1`}>
                {title}
              </h3>
              <p className={`text-sm ${styles.textColor} opacity-90`}>
                {message}
              </p>
            </div>
            <button
              onClick={handleClose}
              className={`flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/50 transition-colors ${styles.textColor}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div 
            className={`h-full ${type === 'success' ? 'bg-green-400' : 
                                type === 'error' ? 'bg-red-400' : 
                                type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'} 
                       transition-all duration-100 animate-pulse`}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default Notification;
