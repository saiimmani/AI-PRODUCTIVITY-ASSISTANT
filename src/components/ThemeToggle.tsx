import React, { useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';

export function ThemeToggle() {
  const { state, dispatch } = useTaskContext();

  useEffect(() => {
    const applyTheme = (theme: string) => {
      const root = document.documentElement;
      
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(state.settings.theme);

    if (state.settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.settings.theme]);

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(state.settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: themes[nextIndex] } });
  };

  const getIcon = () => {
    switch (state.settings.theme) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      case 'system': return <Monitor size={20} />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      title={`Current theme: ${state.settings.theme}`}
    >
      {getIcon()}
    </button>
  );
}