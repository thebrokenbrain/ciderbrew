import React from 'react';
import type { SearchableApp } from '../types/api';

interface AppCardProps {
  app: SearchableApp;
  onSelect: (isSelected: boolean) => void;
  className?: string;
}

const AppCard: React.FC<AppCardProps> = ({ app, onSelect, className = "" }) => {
  const handleClick = () => {
    onSelect(!app.isSelected);
  };

  const getIconForApp = (appName: string, category: string): string => {
    const name = appName.toLowerCase();
    
    // Specific app icons
    if (name.includes('chrome') || name.includes('google-chrome')) return 'fab fa-chrome';
    if (name.includes('firefox')) return 'fab fa-firefox';
    if (name.includes('safari')) return 'fas fa-compass';
    if (name.includes('code') || name.includes('vscode')) return 'fas fa-code';
    if (name.includes('git')) return 'fab fa-git-alt';
    if (name.includes('node') || name.includes('nodejs')) return 'fab fa-node-js';
    if (name.includes('python')) return 'fab fa-python';
    if (name.includes('docker')) return 'fab fa-docker';
    if (name.includes('slack')) return 'fab fa-slack';
    if (name.includes('discord')) return 'fab fa-discord';
    if (name.includes('spotify')) return 'fab fa-spotify';
    if (name.includes('figma')) return 'fab fa-figma';
    if (name.includes('telegram')) return 'fab fa-telegram';
    if (name.includes('whatsapp')) return 'fab fa-whatsapp';
    if (name.includes('steam')) return 'fab fa-steam';
    if (name.includes('twitter')) return 'fab fa-twitter';
    if (name.includes('skype')) return 'fab fa-skype';
    if (name.includes('zoom')) return 'fas fa-video';
    if (name.includes('vlc')) return 'fas fa-play-circle';
    
    // Category-based icons
    switch (category.toLowerCase()) {
      case 'browsers': return 'fas fa-globe';
      case 'development': return 'fas fa-code';
      case 'media': return 'fas fa-music';
      case 'communication': return 'fas fa-comments';
      case 'design': return 'fas fa-palette';
      case 'security': return 'fas fa-shield-alt';
      case 'utilities': return 'fas fa-tools';
      case 'games': return 'fas fa-gamepad';
      case 'database': return 'fas fa-database';
      case 'terminal': return 'fas fa-terminal';
      default: return 'fas fa-cube';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'browsers': return 'text-blue-500';
      case 'development': return 'text-green-500';
      case 'media': return 'text-purple-500';
      case 'communication': return 'text-indigo-500';
      case 'design': return 'text-pink-500';
      case 'security': return 'text-red-500';
      case 'utilities': return 'text-gray-500';
      case 'games': return 'text-orange-500';
      case 'database': return 'text-yellow-500';
      case 'terminal': return 'text-gray-700';
      default: return 'text-blue-400';
    }
  };

  const getInstallTypeInfo = (installType: string) => {
    switch (installType) {
      case 'brew':
        return { label: 'CLI', color: 'bg-green-100 text-green-700' };
      case 'brew-cask':
        return { label: 'APP', color: 'bg-blue-100 text-blue-700' };
      default:
        return { label: 'PKG', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const icon = getIconForApp(app.name, app.category);
  const categoryColor = getCategoryColor(app.category);
  const installInfo = getInstallTypeInfo(app.installType);

  return (
    <div
      className={`
        relative bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 
        transition-all duration-200 cursor-pointer group hover:shadow-lg
        ${app.isSelected 
          ? 'border-blue-500 bg-blue-50/80 shadow-md' 
          : 'border-blue-100 hover:border-blue-300'
        }
        ${className}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Selection indicator */}
      <div className={`
        absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-all duration-200
        ${app.isSelected
          ? 'bg-blue-500 border-blue-500'
          : 'border-gray-300 group-hover:border-blue-400'
        }
      `}>
        {app.isSelected && (
          <i className="fas fa-check text-white text-xs"></i>
        )}
      </div>

      {/* App icon */}
      <div className="flex justify-center mb-2">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${app.isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'}
          transition-colors duration-200
        `}>
          <i className={`${icon} ${categoryColor} text-lg`}></i>
        </div>
      </div>

      {/* App name */}
      <h4 className="font-medium text-gray-900 text-sm text-center mb-1 line-clamp-1">
        {app.name}
      </h4>

      {/* Install type badge */}
      <div className="flex justify-center mb-2">
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium ${installInfo.color}
        `}>
          {installInfo.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 text-center line-clamp-2 leading-tight">
        {app.description}
      </p>

      {/* Version */}
      {app.version && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">v{app.version}</span>
        </div>
      )}

      {/* Special badge for featured apps */}
      {app.isSpecial && (
        <div className="absolute top-2 left-2">
          <i className="fas fa-star text-yellow-500 text-xs"></i>
        </div>
      )}

      {/* Homebrew source indicator */}
      {app.source === 'homebrew' && (
        <div className="absolute bottom-2 left-2">
          <i className="fas fa-cube text-orange-500 text-xs" title="Homebrew Package"></i>
        </div>
      )}
    </div>
  );
};

export default AppCard;
