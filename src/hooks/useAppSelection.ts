import { useState, useCallback } from 'react';
import type { SearchableApp } from '../types/api';
import type { Toast } from '../types';

export interface AppSelectionState {
  selectedApps: Map<string, SearchableApp>;
  selectedIds: Set<string>;
  count: number;
  toasts: Toast[];
}

export interface AppSelectionActions {
  selectApp: (app: SearchableApp) => void;
  deselectApp: (appId: string) => void;
  toggleApp: (app: SearchableApp, isSelected: boolean) => void;
  clearSelection: () => void;
  isSelected: (appId: string) => boolean;
  getSelectedApps: () => SearchableApp[];
  getSelectionArray: () => SearchableApp[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export function useAppSelection(): AppSelectionState & AppSelectionActions {
  const [selectedApps, setSelectedApps] = useState<Map<string, SearchableApp>>(new Map());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const selectApp = useCallback((app: SearchableApp) => {
    setSelectedApps(prev => {
      const newMap = new Map(prev);
      newMap.set(app.id, { ...app, isSelected: true });
      return newMap;
    });
  }, []);

  const deselectApp = useCallback((appId: string) => {
    setSelectedApps(prev => {
      const newMap = new Map(prev);
      newMap.delete(appId);
      return newMap;
    });
  }, []);

  const toggleApp = useCallback((app: SearchableApp, isSelected: boolean) => {
    if (isSelected) {
      selectApp(app);
    } else {
      deselectApp(app.id);
    }
  }, [selectApp, deselectApp]);

  const clearSelection = useCallback(() => {
    setSelectedApps(new Map());
  }, []);

  const isSelected = useCallback((appId: string) => {
    return selectedApps.has(appId);
  }, [selectedApps]);

  const getSelectedApps = useCallback(() => {
    return Array.from(selectedApps.values());
  }, [selectedApps]);

  const getSelectionArray = useCallback(() => {
    return Array.from(selectedApps.values());
  }, [selectedApps]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        setToasts(prevToasts => prevToasts.filter(t => t.id !== id));
      }, toast.duration);
    }
  }, []);

  const selectedIds = new Set(selectedApps.keys());

  return {
    selectedApps,
    selectedIds,
    count: selectedApps.size,
    toasts,
    selectApp,
    deselectApp,
    toggleApp,
    clearSelection,
    isSelected,
    getSelectedApps,
    getSelectionArray,
    addToast,
    removeToast
  };
}
