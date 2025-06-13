'use client';

import { useCallback } from 'react';
import { NotificationData } from '@/components/ui/NotificationContainer';

export const useNotifications = () => {
  const addNotification = useCallback((notification: NotificationData) => {
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification(notification);
    }
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

// Глобальные функции для простого использования
export const notify = {
  success: (title: string, message: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({ type: 'success', title, message, duration });
    }
  },
  error: (title: string, message: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({ type: 'error', title, message, duration });
    }
  },
  warning: (title: string, message: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({ type: 'warning', title, message, duration });
    }
  },
  info: (title: string, message: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({ type: 'info', title, message, duration });
    }
  }
};
