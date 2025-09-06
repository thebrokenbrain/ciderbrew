/**
 * Componente Header - Cabecera de la aplicación
 */

import ThemeToggle from './ThemeToggle';
import type { AppProfile } from '../services/StorageService';
import iconPng from '../assets/ciderbrew.png';

interface HeaderProps {
  selectedCount?: number;
  currentProfile?: AppProfile | null;
  onShowSelectedApps?: () => void;
}

export const Header = ({ selectedCount = 0, currentProfile, onShowSelectedApps }: HeaderProps) => {
  const hasSelections = selectedCount > 1; // More than just homebrew
  
  return (
    <header className="bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 flex items-center justify-center">
              <img 
                src={iconPng} 
                alt="macOS Setup Assistant" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                Instala macOS a tu manera...
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Selecciona programas, genera un script .sh y automatiza la instalación con Homebrew
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Made with pure vibe coding ❤️
                </span>
                <a 
                  href="#" 
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <i className="fab fa-github mr-1"></i>
                  Ver en GitHub
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <ThemeToggle showLabel={false} size="md" />
            
            {/* Profile indicator */}
            {currentProfile && (
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <i className="fas fa-user-cog text-blue-600 dark:text-blue-400"></i>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {currentProfile.name}
                </span>
              </div>
            )}
            
            {/* Stats counter when selections are made */}
            {hasSelections && (
              <button
                onClick={onShowSelectedApps}
                className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 px-3 py-1 rounded-full transition-colors cursor-pointer"
                title="Ver aplicaciones seleccionadas"
              >
                <i className="fas fa-check-circle text-primary-600 dark:text-primary-400"></i>
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {selectedCount} app{selectedCount !== 1 ? 's' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
                </span>
                <i className="fas fa-external-link-alt text-xs text-primary-500"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
