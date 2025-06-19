export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  reminders: Reminder[];
}

export interface Reminder {
  id: string;
  taskId: string;
  time: Date;
  message: string;
  notified: boolean;
}

export interface DailySummary {
  date: Date;
  tasksCompleted: number;
  totalTasks: number;
  topCategory: string;
  productivity: number;
  insights: string[];
  upcomingTasks: Task[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  voiceInput: boolean;
  summaryTime: string;
}