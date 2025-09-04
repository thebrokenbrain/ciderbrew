import { useState, useCallback, useMemo } from 'react';
import type { App, AppCategory, Toast } from '../types';
import { appConfig } from '../data/apps';

export const useAppSelection = () => {
  const [selectedApps, setSelectedApps] = useState<Set<string>>(
    new Set(['homebrew']) // Homebrew is always selected
  );
  
  const [activeCategory, setActiveCategory] = useState<AppCategory>('desarrollo');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toggleApp = useCallback((appId: string, isSelected: boolean) => {
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(appId);
      } else {
        // Don't allow deselecting required apps
        const app = appConfig.apps.find(a => a.id === appId);
        if (!app?.isRequired) {
          newSet.delete(appId);
        }
      }
      // Always keep homebrew selected
      newSet.add('homebrew');
      return newSet;
    });
  }, []);

  const selectAllInCategory = useCallback((category: AppCategory) => {
    const categoryApps = appConfig.apps
      .filter(app => app.category === category)
      .map(app => app.id);
    
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      categoryApps.forEach(appId => newSet.add(appId));
      return newSet;
    });
  }, []);

  const deselectAllInCategory = useCallback((category: AppCategory) => {
    const categoryApps = appConfig.apps
      .filter(app => app.category === category && !app.isRequired)
      .map(app => app.id);
    
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      categoryApps.forEach(appId => newSet.delete(appId));
      newSet.add('homebrew'); // Always keep homebrew
      return newSet;
    });
  }, []);

  const clearAllSelections = useCallback(() => {
    setSelectedApps(new Set(['homebrew']));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success', duration = 3000) => {
    const toast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      duration
    };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const selectedAppsList = useMemo(() => {
    return Array.from(selectedApps)
      .map(id => appConfig.apps.find(app => app.id === id))
      .filter((app): app is App => app !== undefined);
  }, [selectedApps]);

  const appsByCategory = useMemo(() => {
    return appConfig.apps.filter(app => app.category === activeCategory);
  }, [activeCategory]);

  const selectedCount = selectedApps.size;
  const hasSelections = selectedCount > 1; // More than just homebrew

  return {
    selectedApps,
    selectedAppsList,
    selectedCount,
    hasSelections,
    activeCategory,
    setActiveCategory,
    appsByCategory,
    toggleApp,
    selectAllInCategory,
    deselectAllInCategory,
    clearAllSelections,
    toasts,
    addToast,
    removeToast
  };
};
