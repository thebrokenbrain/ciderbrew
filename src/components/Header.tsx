/**
 * Componente Header - Cabecera de la aplicación
 */

import ThemeToggle from './ThemeToggle';
import type { AppProfile } from '../services/StorageService';
import iconPng from '../assets/icon.png';

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
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src={iconPng} 
                alt="macOS Setup Assistant" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                macOS Setup Brew Assistant
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tu asistente inteligente para configurar macOS con Homebrew
              </p>
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
