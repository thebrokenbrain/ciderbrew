import React, { useState, useEffect, useCallback, useMemo } from 'react';
import StorageService, { type AppProfile } from '../services/StorageService';
import type { SearchableApp, Toast } from '../types/api';
import type { App } from '../types';

// Función helper para convertir App a SearchableApp
const convertAppToSearchableApp = (app: App): SearchableApp => ({
  id: app.id,
  name: app.name,
  description: app.description,
  homepage: '', // No disponible en el formato App
  version: 'latest',
  installType: app.installType as 'brew' | 'brew-cask' | 'custom',
  command: app.command,
  category: app.category,
  source: 'predefined' as const,
  isSelected: false,
  isSpecial: app.isSpecial || false,
  icon: app.icon,
  postInstallNotes: app.postInstallNotes
});

const useAppSelection = () => {
  const [selectedApps, setSelectedApps] = useState<Map<string, SearchableApp>>(new Map());
  const [profiles, setProfiles] = useState<AppProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<AppProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: Date.now().toString(),
      timeout: toast.timeout || toast.duration || 5000
    };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after timeout
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, newToast.timeout);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Cargar perfiles existentes
        const savedProfiles = StorageService.loadProfiles();
        setProfiles(savedProfiles);
        
        // 2. Cargar todas las aplicaciones disponibles desde la base de datos
        const { appConfig } = await import('../data/apps');
        const allApps = appConfig.apps;
        
        // 3. Inicializar el Map con todas las aplicaciones disponibles
        const appMap = new Map<string, SearchableApp>();
        allApps.forEach((app: App) => {
          const searchableApp = convertAppToSearchableApp(app);
          appMap.set(app.id, searchableApp);
        });
        console.log('🗺️ Map inicializado con', appMap.size, 'aplicaciones');
        
        // 4. Cargar selección guardada desde localStorage y marcar como seleccionadas
        const savedApps = StorageService.loadCurrentSelection();
        if (savedApps.length > 0) {
          savedApps.forEach((savedApp: SearchableApp) => {
            if (appMap.has(savedApp.id)) {
              const existingApp = appMap.get(savedApp.id);
              if (existingApp) {
                appMap.set(savedApp.id, { ...existingApp, isSelected: true });
              }
            }
          });
        }
        
        setSelectedApps(appMap);
      } catch (error) {
        console.error('Error loading initial data:', error);
        addToast({
          title: 'Error cargando datos',
          message: 'Hubo un problema cargando la información inicial',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [addToast]);

  const selectApp = useCallback((appId: string) => {
    console.log('🔍 Intentando seleccionar app:', appId);
    setSelectedApps(prev => {
      const app = prev.get(appId);
      
      if (app) {
        const updated = new Map(prev);
        const updatedApp = { ...app, isSelected: !app.isSelected };
        updated.set(appId, updatedApp);
        console.log('✅ App actualizada:', `${updatedApp.name} -> ${updatedApp.isSelected ? 'SELECCIONADA' : 'DESELECCIONADA'}`);
        
        // Guardar en localStorage
        const selectedList = Array.from(updated.values()).filter((app: SearchableApp) => app.isSelected);
        StorageService.saveCurrentSelection(selectedList);
        
        return updated;
      } else {
        console.log('❌ App NO ENCONTRADA en el Map para ID:', appId);
        console.log('⚠️ Esta app probablemente viene de la búsqueda de Homebrew y no está en el Map inicial');
        console.log('💡 Para solucionarlo, la app debería añadirse al Map cuando se selecciona por primera vez');
      }
      return prev;
    });
  }, []);

  const saveProfile = useCallback((name: string, description: string = '') => {
    const selectedAppsList = Array.from(selectedApps.values()).filter((app: SearchableApp) => app.isSelected);
    
    if (selectedAppsList.length === 0) {
      addToast({
        title: 'Error',
        message: 'No hay aplicaciones seleccionadas para guardar',
        type: 'error'
      });
      return false;
    }

    try {
      StorageService.saveProfile(name, description, selectedAppsList);
      setProfiles(StorageService.loadProfiles()); // Recargar perfiles
      
      addToast({
        title: 'Perfil guardado',
        message: `El perfil "${name}" se ha guardado correctamente`,
        type: 'success'
      });
      
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      addToast({
        title: 'Error',
        message: 'No se pudo guardar el perfil',
        type: 'error'
      });
      return false;
    }
  }, [selectedApps, addToast]);

  const deleteProfile = useCallback((profileId: string) => {
    try {
      StorageService.deleteProfile(profileId);
      setProfiles(StorageService.loadProfiles()); // Recargar perfiles
      
      addToast({
        title: 'Perfil eliminado',
        message: 'El perfil se ha eliminado correctamente',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      addToast({
        title: 'Error',
        message: 'No se pudo eliminar el perfil',
        type: 'error'
      });
    }
  }, [addToast]);

  const clearSelection = useCallback(() => {
    setSelectedApps(prev => {
      const updated = new Map();
      for (const [id, app] of prev) {
        updated.set(id, { ...app, isSelected: false });
      }
      
      // Limpiar localStorage
      StorageService.saveCurrentSelection([]);
      
      return updated;
    });
    
    addToast({
      title: 'Selección limpiada',
      message: 'Se ha limpiado la selección de aplicaciones',
      type: 'success'
    });
  }, [addToast]);

  // Propiedades de compatibilidad derivadas
  const selectedIds = useMemo(() => {
    const ids = new Set<string>();
    selectedApps.forEach((app, id) => {
      if (app.isSelected) {
        ids.add(id);
      }
    });
    console.log('🎯 selectedIds calculado:', ids.size, 'apps seleccionadas');
    return ids;
  }, [selectedApps]);
  
  const count = selectedIds.size;
  
  const getSelectedApps = useCallback(() => {
    return Array.from(selectedApps.values()).filter((app: SearchableApp) => app.isSelected);
  }, [selectedApps]);

  const toggleApp = useCallback((app: SearchableApp, _selected: boolean) => {
    console.log('🎯 toggleApp llamado para:', app.name, '- ID:', app.id);
    
    setSelectedApps(prev => {
      const existingApp = prev.get(app.id);
      const updated = new Map(prev);
      
      if (existingApp) {
        // La app ya existe en el Map, solo cambiar su estado
        const updatedApp = { ...existingApp, isSelected: !existingApp.isSelected };
        updated.set(app.id, updatedApp);
        console.log('✅ App existente actualizada:', `${updatedApp.name} -> ${updatedApp.isSelected ? 'SELECCIONADA' : 'DESELECCIONADA'}`);
      } else {
        // La app no existe en el Map, añadirla como seleccionada
        const newApp = { ...app, isSelected: true };
        updated.set(app.id, newApp);
        console.log('🆕 App nueva añadida al Map:', `${newApp.name} -> SELECCIONADA`);
      }
      
      // Guardar en localStorage
      const selectedList = Array.from(updated.values()).filter((app: SearchableApp) => app.isSelected);
      StorageService.saveCurrentSelection(selectedList);
      
      return updated;
    });
  }, []);

  const isSelected = useCallback((appId: string) => {
    return selectedApps.get(appId)?.isSelected || false;
  }, [selectedApps]);

  const createProfile = saveProfile;
  
  const updateCurrentProfile = useCallback(() => {
    if (currentProfile) {
      const selectedAppsList = getSelectedApps();
      
      // Actualizar el perfil usando StorageService
      StorageService.updateProfile(currentProfile.id, {
        apps: selectedAppsList,
        updatedAt: new Date()
      });
      
      // Recargar perfiles para reflejar cambios
      const updatedProfiles = StorageService.loadProfiles();
      setProfiles(updatedProfiles);
      
      // Actualizar currentProfile con la versión actualizada
      const updatedCurrentProfile = updatedProfiles.find(p => p.id === currentProfile.id);
      if (updatedCurrentProfile) {
        setCurrentProfile(updatedCurrentProfile);
      }
      
      addToast({
        title: 'Perfil actualizado',
        message: `El perfil "${currentProfile.name}" ha sido actualizado con ${selectedAppsList.length} aplicaciones`,
        type: 'success'
      });
    }
  }, [currentProfile, getSelectedApps, addToast]);
  
  const exportConfiguration = useCallback(() => {
    const selectedAppsList = getSelectedApps();
    if (selectedAppsList.length === 0) {
      addToast({
        title: 'Error',
        message: 'No hay aplicaciones seleccionadas para exportar',
        type: 'error'
      });
      return;
    }

    const profile = {
      name: `Configuración ${new Date().toLocaleDateString()}`,
      description: 'Configuración exportada',
      apps: selectedAppsList,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `macos-setup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      title: 'Configuración exportada',
      message: 'El archivo se ha descargado correctamente',
      type: 'success'
    });
  }, [getSelectedApps, addToast]);

  const importConfiguration = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedProfile = JSON.parse(content);
        
        if (!importedProfile.apps || !Array.isArray(importedProfile.apps)) {
          throw new Error('Formato de archivo inválido');
        }

        // Cargar las apps importadas
        setSelectedApps(prevMap => {
          const newMap = new Map(prevMap);
          
          // Primero desmarcar todas las aplicaciones
          newMap.forEach((app, id) => {
            newMap.set(id, { ...app, isSelected: false });
          });
          
          // Luego marcar como seleccionadas las aplicaciones importadas
          importedProfile.apps.forEach((importedApp: SearchableApp) => {
            if (newMap.has(importedApp.id)) {
              const existingApp = newMap.get(importedApp.id);
              if (existingApp) {
                newMap.set(importedApp.id, { ...existingApp, isSelected: true });
              }
            } else {
              // Si la app no existe en el Map, agregarla
              newMap.set(importedApp.id, { ...importedApp, isSelected: true });
            }
          });
          
          return newMap;
        });
        
        // Guardar en localStorage
        StorageService.saveCurrentSelection(importedProfile.apps);

        addToast({
          title: 'Configuración importada',
          message: `Se han importado ${importedProfile.apps.length} aplicaciones`,
          type: 'success'
        });
      } catch (error) {
        console.error('Error importing configuration:', error);
        addToast({
          title: 'Error',
          message: 'No se pudo importar la configuración',
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
  }, [addToast]);

  return {
    selectedApps,
    profiles,
    isLoading,
    toasts,
    count,
    selectedIds,
    selectApp,
    toggleApp,
    isSelected,
    getSelectedApps,
    saveProfile,
    createProfile,
    loadProfile: (profileId: string) => {
      const profile = profiles.find(p => p.id === profileId);
      if (profile) {
        try {
          setSelectedApps(prevMap => {
            const newMap = new Map(prevMap);
            
            // Primero desmarcar todas las aplicaciones
            newMap.forEach((app, id) => {
              newMap.set(id, { ...app, isSelected: false });
            });
            
            // Luego marcar como seleccionadas las del perfil
            profile.apps.forEach((profileApp: SearchableApp) => {
              if (newMap.has(profileApp.id)) {
                const existingApp = newMap.get(profileApp.id);
                if (existingApp) {
                  newMap.set(profileApp.id, { ...existingApp, isSelected: true });
                }
              } else {
                // Si la app no existe en el Map, agregarla
                newMap.set(profileApp.id, { ...profileApp, isSelected: true });
              }
            });
            
            return newMap;
          });
          
          // Establecer como perfil actual
          setCurrentProfile(profile);
          
          // Guardar en localStorage
          StorageService.saveCurrentSelection(profile.apps);
          
          addToast({
            title: 'Perfil cargado',
            message: `Se ha cargado el perfil "${profile.name}" con ${profile.apps.length} aplicaciones`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error loading profile:', error);
          addToast({
            title: 'Error',
            message: 'No se pudo cargar el perfil',
            type: 'error'
          });
        }
      }
    },
    deleteProfile,
    clearSelection,
    addToast,
    removeToast,
    currentProfile,
    updateCurrentProfile,
    exportConfiguration,
    importConfiguration
  };
};

export default useAppSelection;
