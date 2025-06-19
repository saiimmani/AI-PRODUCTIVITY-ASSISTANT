import React from 'react';
import { Brain, Zap } from 'lucide-react';
import { TaskProvider } from './contexts/TaskContext';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { DailySummary } from './components/DailySummary';
import { NotificationSystem } from './components/NotificationSystem';
import { ThemeToggle } from './components/ThemeToggle';

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Productivity Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart task management with voice input & AI insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <NotificationSystem />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Task Input */}
          <section>
            <TaskInput />
          </section>

          {/* Daily Summary */}
          <section>
            <DailySummary />
          </section>

          {/* Task List */}
          <section>
            <TaskList />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Zap className="w-4 h-4" />
            <span>Powered by AI • Built for productivity</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;