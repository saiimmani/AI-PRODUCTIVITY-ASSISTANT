import React from 'react';
import { TrendingUp, Target, Award, Calendar, ArrowRight, Clock } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { formatRelativeTime } from '../utils/taskUtils';

export function DailySummary() {
  const { state } = useTaskContext();
  const { dailySummary } = state;

  if (!dailySummary) return null;

  const productivityLevel = 
    dailySummary.productivity >= 80 ? 'Excellent' :
    dailySummary.productivity >= 60 ? 'Good' :
    dailySummary.productivity >= 40 ? 'Average' : 'Needs Focus';

  const productivityColor = 
    dailySummary.productivity >= 80 ? 'text-green-600 bg-green-100 dark:bg-green-900/30' :
    dailySummary.productivity >= 60 ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' :
    dailySummary.productivity >= 40 ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' : 
    'text-red-600 bg-red-100 dark:bg-red-900/30';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Summary</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Intl.DateTimeFormat('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              }).format(dailySummary.date)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Productivity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dailySummary.tasksCompleted}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    /{dailySummary.totalTasks}
                  </span>
                </p>
              </div>
              <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productivity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dailySummary.productivity}%
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${productivityColor}`}>
                  {productivityLevel}
                </span>
              </div>
              <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Category</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {dailySummary.topCategory}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* AI Insights */}
        {dailySummary.insights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              AI Insights
            </h3>
            <div className="space-y-2">
              {dailySummary.insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-3 border-indigo-600"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        {dailySummary.upcomingTasks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Upcoming Tasks
            </h3>
            <div className="space-y-2">
              {dailySummary.upcomingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.dueDate && formatRelativeTime(new Date(task.dueDate))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${task.priority === 'high' ? 'text-red-600 bg-red-100 dark:bg-red-900/30' :
                        task.priority === 'medium' ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' :
                        'text-green-600 bg-green-100 dark:bg-green-900/30'}`}>
                      {task.priority}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}