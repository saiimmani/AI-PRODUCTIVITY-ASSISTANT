import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') return null;

    try {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options,
      });

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }, [isSupported, permission]);

  const showTaskReminder = useCallback((taskTitle: string, message?: string) => {
    return showNotification('Task Reminder', {
      body: message || `Don't forget: ${taskTitle}`,
      tag: 'task-reminder',
      requireInteraction: true,
    });
  }, [showNotification]);

  const showDailySummary = useCallback((completedTasks: number, totalTasks: number) => {
    return showNotification('Daily Summary', {
      body: `Completed ${completedTasks} of ${totalTasks} tasks today`,
      tag: 'daily-summary',
    });
  }, [showNotification]);

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    showTaskReminder,
    showDailySummary,
  };
}