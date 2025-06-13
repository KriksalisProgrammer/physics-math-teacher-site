'use client';

import { useState, useCallback } from 'react';
import Notification, { NotificationProps } from './Notification';

export interface NotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = useCallback((notificationData: NotificationData) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const notification: NotificationProps = {
      id,
      ...notificationData,
      onClose: removeNotification
    };

    setNotifications(prev => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Expose addNotification globally
  if (typeof window !== 'undefined') {
    (window as any).addNotification = addNotification;
  }

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="flex flex-col space-y-2 p-4">
        {notifications.map((notification, index) => (
          <div 
            key={notification.id}
            style={{ 
              zIndex: 1000 + index,
              transform: `translateY(${index * 10}px)`,
              pointerEvents: 'auto'
            }}
          >
            <Notification {...notification} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
