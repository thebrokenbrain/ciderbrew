import { useState, useCallback, useEffect } from 'react';
import type { SearchableApp, Toast } from '../types/api';
import StorageService from '../services/StorageService';
import URLStateService from '../services/URLStateService';

export interface AppSelectionState {
  selectedApps: Map<string, SearchableApp>;
  selectedIds: Set<string>;
  count: number;
  toasts: Toast[];
  isLoading: boolean;
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
  loadFromProfile: (profileId: string) => void;
  saveAsProfile: (name: string, description: string) => void;
  loadFromURL: () => void;
  generateShareURL: () => string;
}

export function useAppSelection(): AppSelectionState & AppSelectionActions {
  const [selectedApps, setSelectedApps] = useState<Map<string, SearchableApp>>(new Map());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Definir addToast primero para poder usarlo en otros lugares
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

  // Cargar estado inicial al montar el componente
  useEffect(() => {
    const initializeSelection = async () => {
      try {
        setIsLoading(true);
        
        // 1. Intentar cargar desde URL primero (prioridad alta)
        const urlState = URLStateService.loadStateFromURL();
        if (urlState?.apps?.length) {
          // TODO: Resolver IDs de apps a objetos completos
          // Por ahora, cargamos desde localStorage como fallback
        }
        
        // 2. Cargar desde localStorage
        const savedApps = StorageService.loadCurrentSelection();
        if (savedApps.length > 0) {
          const appMap = new Map(savedApps.map(app => [app.id, { ...app, isSelected: true }]));
          setSelectedApps(appMap);
        }
      } catch (error) {
        console.warn('Error inicializando selección:', error);
        addToast({
          title: 'Error de carga',
          message: 'No se pudo cargar la selección guardada',
          type: 'warning',
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSelection();
  }, [addToast]);

  // Auto-guardar en localStorage cuando cambie la selección
  useEffect(() => {
    if (!isLoading && selectedApps.size >= 0) {
      const appsArray = Array.from(selectedApps.values());
      StorageService.saveCurrentSelection(appsArray);
      URLStateService.updateURL(appsArray);
    }
  }, [selectedApps, isLoading]);

  const selectApp = useCallback((app: SearchableApp) => {
    setSelectedApps(prev => {
      const newMap = new Map(prev);
      newMap.set(app.id, { ...app, isSelected: true });
      return newMap;
    });

    addToast({
      title: 'Aplicación añadida',
      message: `${app.name} se ha añadido a tu selección`,
      type: 'success',
      duration: 3000
    });
  }, [addToast]);

  const deselectApp = useCallback((appId: string) => {
    setSelectedApps(prev => {
      const app = prev.get(appId);
      const newMap = new Map(prev);
      newMap.delete(appId);
      
      if (app) {
        addToast({
          title: 'Aplicación eliminada',
          message: `${app.name} se ha eliminado de tu selección`,
          type: 'info',
          duration: 3000
        });
      }
      
      return newMap;
    });
  }, [addToast]);

  const toggleApp = useCallback((app: SearchableApp, isSelected: boolean) => {
    if (isSelected) {
      selectApp(app);
    } else {
      deselectApp(app.id);
    }
  }, [selectApp, deselectApp]);

  const clearSelection = useCallback(() => {
    const count = selectedApps.size;
    setSelectedApps(new Map());
    URLStateService.clearURLState();
    
    if (count > 0) {
      addToast({
        title: 'Selección limpiada',
        message: `Se han eliminado ${count} aplicaciones`,
        type: 'info',
        duration: 3000
      });
    }
  }, [selectedApps.size, addToast]);

  const isSelected = useCallback((appId: string) => {
    return selectedApps.has(appId);
  }, [selectedApps]);

  const getSelectedApps = useCallback(() => {
    return Array.from(selectedApps.values());
  }, [selectedApps]);

  const getSelectionArray = useCallback(() => {
    return Array.from(selectedApps.values());
  }, [selectedApps]);

  const loadFromProfile = useCallback((profileId: string) => {
    try {
      const profiles = StorageService.loadProfiles();
      const profile = profiles.find(p => p.id === profileId);
      
      if (!profile) {
        throw new Error('Perfil no encontrado');
      }

      const appMap = new Map(profile.apps.map(app => [app.id, { ...app, isSelected: true }]));
      setSelectedApps(appMap);

      addToast({
        title: 'Perfil cargado',
        message: `Se han cargado ${profile.apps.length} aplicaciones de "${profile.name}"`,
        type: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
      addToast({
        title: 'Error',
        message: 'No se pudo cargar el perfil seleccionado',
        type: 'error',
        duration: 5000
      });
    }
  }, [addToast]);

  const saveAsProfile = useCallback((name: string, description: string) => {
    try {
      const apps = Array.from(selectedApps.values());
      
      if (apps.length === 0) {
        throw new Error('No hay aplicaciones seleccionadas');
      }

      const profile = StorageService.saveProfile(name, description, apps);
      
      addToast({
        title: 'Perfil guardado',
        message: `"${profile.name}" se ha guardado con ${apps.length} aplicaciones`,
        type: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error guardando perfil:', error);
      addToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'No se pudo guardar el perfil',
        type: 'error',
        duration: 5000
      });
    }
  }, [selectedApps, addToast]);

  const loadFromURL = useCallback(() => {
    try {
      const urlState = URLStateService.loadStateFromURL();
      if (!urlState?.apps?.length) {
        throw new Error('No hay configuración en la URL');
      }

      // TODO: Resolver IDs a objetos completos usando servicios de búsqueda
      addToast({
        title: 'Configuración cargada',
        message: `Se han cargado ${urlState.apps.length} aplicaciones desde la URL`,
        type: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error cargando desde URL:', error);
      addToast({
        title: 'Error',
        message: 'No se pudo cargar la configuración desde la URL',
        type: 'warning',
        duration: 5000
      });
    }
  }, [addToast]);

  const generateShareURL = useCallback(() => {
    try {
      const apps = Array.from(selectedApps.values());
      const shareURL = URLStateService.generateShareableURL(apps);
      
      // Copiar al portapapeles
      navigator.clipboard.writeText(shareURL).then(() => {
        addToast({
          title: 'URL copiada',
          message: 'El enlace de tu configuración se ha copiado al portapapeles',
          type: 'success',
          duration: 5000
        });
      }).catch(() => {
        addToast({
          title: 'URL generada',
          message: 'Enlace generado, pero no se pudo copiar automáticamente',
          type: 'info',
          duration: 5000
        });
      });
      
      return shareURL;
    } catch (error) {
      console.error('Error generando URL:', error);
      addToast({
        title: 'Error',
        message: 'No se pudo generar el enlace de compartir',
        type: 'error',
        duration: 5000
      });
      return window.location.href;
    }
  }, [selectedApps, addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const selectedIds = new Set(selectedApps.keys());

  return {
    selectedApps,
    selectedIds,
    count: selectedApps.size,
    toasts,
    isLoading,
    selectApp,
    deselectApp,
    toggleApp,
    clearSelection,
    isSelected,
    getSelectedApps,
    getSelectionArray,
    addToast,
    removeToast,
    loadFromProfile,
    saveAsProfile,
    loadFromURL,
    generateShareURL
  };
}
