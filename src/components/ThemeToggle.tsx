/**
 * Componente toggle para cambio de tema (dark/light mode)
 */

import { useTheme } from '../hooks/useTheme';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ 
  className = '', 
  showLabel = false,
  size = 'md' 
}: ThemeToggleProps) {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  };

  const dotSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-6'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showLabel && (
        <div className="flex items-center space-x-2">
          <i className="fas fa-sun text-yellow-500 text-sm"></i>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tema
          </span>
          <i className="fas fa-moon text-blue-400 text-sm"></i>
        </div>
      )}
      
      <div className="relative">
        {/* Toggle Switch */}
        <button
          onClick={toggleTheme}
          className={`
            relative inline-flex items-center ${sizeClasses[size]} rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
            ${isDark 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-yellow-400 hover:bg-yellow-500'
            }
          `}
          aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
          title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
        >
          {/* Toggle Dot */}
          <span
            className={`
              inline-block ${dotSizeClasses[size]} transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out flex items-center justify-center
              ${isDark ? translateClasses[size] : 'translate-x-1'}
            `}
          >
            {/* Icon inside dot */}
            <i className={`
              ${isDark ? 'fas fa-moon text-blue-600' : 'fas fa-sun text-yellow-500'}
              ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}
            `}></i>
          </span>
        </button>

        {/* Theme indicator */}
        {theme === 'system' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
            <i className="fas fa-cog text-white text-xs"></i>
          </div>
        )}
      </div>

      {/* Advanced theme selector */}
      <div className="relative group">
        <button
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Opciones de tema"
        >
          <i className="fas fa-chevron-down text-xs"></i>
        </button>
        
        {/* Dropdown menu */}
        <div className="absolute right-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 min-w-max">
            <button
              onClick={() => setTheme('light')}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors
                ${theme === 'light' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-700 dark:text-gray-300'}
              `}
            >
              <i className="fas fa-sun text-yellow-500"></i>
              <span>Modo claro</span>
              {theme === 'light' && <i className="fas fa-check text-amber-600 ml-auto"></i>}
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors
                ${theme === 'dark' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-700 dark:text-gray-300'}
              `}
            >
              <i className="fas fa-moon text-blue-400"></i>
              <span>Modo oscuro</span>
              {theme === 'dark' && <i className="fas fa-check text-amber-600 ml-auto"></i>}
            </button>
            
            <button
              onClick={() => setTheme('system')}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors
                ${theme === 'system' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-700 dark:text-gray-300'}
              `}
            >
              <i className="fas fa-desktop text-gray-500"></i>
              <span>Sistema</span>
              {theme === 'system' && <i className="fas fa-check text-amber-600 ml-auto"></i>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeToggle;
