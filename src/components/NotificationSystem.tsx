import React, { useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationSystem() {
  const { state, dispatch } = useTaskContext();
  const { 
    isSupported, 
    permission, 
    requestPermission, 
    showTaskReminder,
    showDailySummary 
  } = useNotifications();

  // Check for due reminders every minute
  useEffect(() => {
    if (!state.settings.notifications || permission !== 'granted') return;

    const checkReminders = () => {
      const now = new Date();
      
      state.reminders.forEach(reminder => {
        if (!reminder.notified && new Date(reminder.time) <= now) {
          const task = state.tasks.find(t => t.id === reminder.taskId);
          if (task && !task.completed) {
            showTaskReminder(task.title, reminder.message);
            dispatch({ 
              type: 'UPDATE_REMINDER', 
              payload: { ...reminder, notified: true } 
            });
          }
        }
      });

      // Check for overdue tasks
      state.tasks.forEach(task => {
        if (!task.completed && task.dueDate && new Date(task.dueDate) < now) {
          // Only notify once per day for overdue tasks
          const lastNotified = localStorage.getItem(`overdue-${task.id}`);
          const today = now.toDateString();
          
          if (lastNotified !== today) {
            showTaskReminder(task.title, 'This task is overdue!');
            localStorage.setItem(`overdue-${task.id}`, today);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [state.reminders, state.tasks, state.settings.notifications, permission, showTaskReminder, dispatch]);

  // Show daily summary notification
  useEffect(() => {
    if (!state.settings.notifications || permission !== 'granted' || !state.dailySummary) return;

    const summaryTime = state.settings.summaryTime;
    const [hours, minutes] = summaryTime.split(':').map(Number);
    const now = new Date();
    const summaryDate = new Date();
    summaryDate.setHours(hours, minutes, 0, 0);

    // If it's past the summary time today and we haven't shown it yet
    if (now >= summaryDate) {
      const lastSummary = localStorage.getItem('last-daily-summary');
      const today = now.toDateString();
      
      if (lastSummary !== today) {
        showDailySummary(state.dailySummary.tasksCompleted, state.dailySummary.totalTasks);
        localStorage.setItem('last-daily-summary', today);
      }
    }
  }, [state.dailySummary, state.settings, permission, showDailySummary]);

  const toggleNotifications = async () => {
    if (!isSupported) return;

    if (permission === 'default') {
      const granted = await requestPermission();
      if (granted) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { notifications: true } });
      }
    } else if (permission === 'granted') {
      dispatch({ 
        type: 'UPDATE_SETTINGS', 
        payload: { notifications: !state.settings.notifications } 
      });
    }
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleNotifications}
      className={`p-2 rounded-lg transition-colors ${
        state.settings.notifications && permission === 'granted'
          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      title={
        permission === 'denied' 
          ? 'Notifications blocked. Please enable in browser settings.'
          : state.settings.notifications 
            ? 'Disable notifications' 
            : 'Enable notifications'
      }
    >
      {state.settings.notifications && permission === 'granted' ? (
        <Bell size={20} />
      ) : (
        <BellOff size={20} />
      )}
    </button>
  );
}