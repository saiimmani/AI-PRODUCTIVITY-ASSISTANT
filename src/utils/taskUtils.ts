import { Task, DailySummary } from '../types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function categorizeTask(title: string, description?: string): string {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  if (text.includes('meeting') || text.includes('call') || text.includes('interview')) {
    return 'meetings';
  }
  if (text.includes('email') || text.includes('message') || text.includes('reply')) {
    return 'communication';
  }
  if (text.includes('project') || text.includes('develop') || text.includes('code')) {
    return 'development';
  }
  if (text.includes('design') || text.includes('create') || text.includes('mockup')) {
    return 'design';
  }
  if (text.includes('research') || text.includes('analyze') || text.includes('study')) {
    return 'research';
  }
  if (text.includes('review') || text.includes('feedback') || text.includes('approve')) {
    return 'review';
  }
  
  return 'general';
}

export function determinePriority(title: string, description?: string, dueDate?: Date): 'low' | 'medium' | 'high' {
  const text = `${title} ${description || ''}`.toLowerCase();
  const urgentKeywords = ['urgent', 'asap', 'critical', 'emergency', 'deadline'];
  const highKeywords = ['important', 'priority', 'meeting', 'client'];
  
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  }
  
  if (dueDate) {
    const now = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 1) return 'high';
    if (daysDiff <= 3) return 'medium';
  }
  
  if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
}

export function generateDailySummary(tasks: Task[]): DailySummary {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });
  
  const completedTasks = todayTasks.filter(task => task.completed);
  const totalTasks = todayTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  
  // Find top category
  const categoryCount: { [key: string]: number } = {};
  todayTasks.forEach(task => {
    categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
  });
  
  const topCategory = Object.keys(categoryCount).reduce((a, b) =>
    categoryCount[a] > categoryCount[b] ? a : b
  , 'general');
  
  // Generate insights
  const insights = generateInsights(tasks, completionRate, topCategory);
  
  // Get upcoming tasks (next 3 days)
  const upcoming = new Date();
  upcoming.setDate(upcoming.getDate() + 3);
  const upcomingTasks = tasks
    .filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) <= upcoming
    )
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);
  
  return {
    date: new Date(),
    tasksCompleted: completedTasks.length,
    totalTasks,
    topCategory,
    productivity: Math.round(completionRate),
    insights,
    upcomingTasks,
  };
}

function generateInsights(tasks: Task[], completionRate: number, topCategory: string): string[] {
  const insights: string[] = [];
  
  if (completionRate >= 80) {
    insights.push("Excellent productivity today! You're on fire 🔥");
  } else if (completionRate >= 60) {
    insights.push("Good progress today. Keep up the momentum!");
  } else if (completionRate >= 40) {
    insights.push("Steady progress. Consider breaking down larger tasks.");
  } else if (completionRate > 0) {
    insights.push("Every step counts. Focus on completing one task at a time.");
  } else {
    insights.push("Fresh start! Begin with your highest priority task.");
  }
  
  const overdueTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  );
  
  if (overdueTasks.length > 0) {
    insights.push(`${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} need attention`);
  }
  
  const highPriorityTasks = tasks.filter(task => !task.completed && task.priority === 'high');
  if (highPriorityTasks.length > 0) {
    insights.push(`${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''} pending`);
  }
  
  if (topCategory !== 'general') {
    insights.push(`Most active in ${topCategory} today`);
  }
  
  return insights;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}