/**
 * Servicio para manejo de LocalStorage y persistencia
 */

import type { SearchableApp } from '../types/api';

export interface AppProfile {
  id: string;
  name: string;
  description: string;
  apps: SearchableApp[];
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface AppSelection {
  selectedApps: SearchableApp[];
  lastUpdated: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  viewMode: 'grid' | 'list';
  autoSave: boolean;
  showArchitectureBadges: boolean;
}

class StorageService {
  private static readonly STORAGE_KEYS = {
    CURRENT_SELECTION: 'macos-setup-current-selection',
    PROFILES: 'macos-setup-profiles',
    PREFERENCES: 'macos-setup-preferences',
    LAST_SEARCH: 'macos-setup-last-search'
  } as const;

  // ===== SELECCIÓN ACTUAL =====
  
  /**
   * Guardar selección actual de apps
   */
  static saveCurrentSelection(apps: SearchableApp[]): void {
    try {
      const selection: AppSelection = {
        selectedApps: apps,
        lastUpdated: new Date()
      };
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_SELECTION, JSON.stringify(selection));
    } catch (error) {
      console.warn('Error guardando selección actual:', error);
    }
  }

  /**
   * Cargar selección actual de apps
   */
  static loadCurrentSelection(): SearchableApp[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.CURRENT_SELECTION);
      if (!stored) return [];

      const selection: AppSelection = JSON.parse(stored);
      return selection.selectedApps || [];
    } catch (error) {
      console.warn('Error cargando selección actual:', error);
      return [];
    }
  }

  // ===== PERFILES =====

  /**
   * Guardar nuevo perfil
   */
  static saveProfile(name: string, description: string, apps: SearchableApp[]): AppProfile {
    try {
      const profiles = this.loadProfiles();
      const newProfile: AppProfile = {
        id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        apps,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      profiles.push(newProfile);
      localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      return newProfile;
    } catch (error) {
      console.error('Error guardando perfil:', error);
      throw new Error('No se pudo guardar el perfil');
    }
  }

  /**
   * Cargar todos los perfiles
   */
  static loadProfiles(): AppProfile[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PROFILES);
      if (!stored) return this.getDefaultProfiles();

      const profiles: AppProfile[] = JSON.parse(stored);
      
      // Convertir strings de fecha a objetos Date
      return profiles.map(profile => ({
        ...profile,
        createdAt: new Date(profile.createdAt),
        updatedAt: new Date(profile.updatedAt)
      }));
    } catch (error) {
      console.warn('Error cargando perfiles:', error);
      return this.getDefaultProfiles();
    }
  }

  /**
   * Actualizar perfil existente
   */
  static updateProfile(profileId: string, updates: Partial<Omit<AppProfile, 'id' | 'createdAt'>>): void {
    try {
      const profiles = this.loadProfiles();
      const index = profiles.findIndex(p => p.id === profileId);
      
      if (index === -1) {
        throw new Error('Perfil no encontrado');
      }

      profiles[index] = {
        ...profiles[index],
        ...updates,
        updatedAt: new Date()
      };

      localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }

  /**
   * Eliminar perfil
   */
  static deleteProfile(profileId: string): void {
    try {
      const profiles = this.loadProfiles();
      const filtered = profiles.filter(p => p.id !== profileId);
      localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error eliminando perfil:', error);
      throw error;
    }
  }

  /**
   * Obtener perfiles por defecto
   */
  private static getDefaultProfiles(): AppProfile[] {
    return [
      {
        id: 'default-dev',
        name: 'Desarrollo Completo',
        description: 'Herramientas esenciales para desarrollo web y móvil',
        apps: [], // Se llenarán dinámicamente
        createdAt: new Date(),
        updatedAt: new Date(),
        isDefault: true
      },
      {
        id: 'default-basic',
        name: 'Setup Básico',
        description: 'Aplicaciones básicas para uso diario',
        apps: [], // Se llenarán dinámicamente
        createdAt: new Date(),
        updatedAt: new Date(),
        isDefault: true
      }
    ];
  }

  // ===== PREFERENCIAS =====

  /**
   * Guardar preferencias de usuario
   */
  static savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.warn('Error guardando preferencias:', error);
    }
  }

  /**
   * Cargar preferencias de usuario
   */
  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
      if (!stored) return this.getDefaultPreferences();

      return { ...this.getDefaultPreferences(), ...JSON.parse(stored) };
    } catch (error) {
      console.warn('Error cargando preferencias:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Obtener preferencias por defecto
   */
  private static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      viewMode: 'grid',
      autoSave: true,
      showArchitectureBadges: true
    };
  }

  // ===== IMPORTAR/EXPORTAR =====

  /**
   * Exportar configuración completa
   */
  static exportConfiguration(): string {
    try {
      const config = {
        profiles: this.loadProfiles(),
        preferences: this.loadPreferences(),
        currentSelection: this.loadCurrentSelection(),
        exportedAt: new Date(),
        version: '1.0.0'
      };

      return JSON.stringify(config, null, 2);
    } catch (error) {
      console.error('Error exportando configuración:', error);
      throw new Error('No se pudo exportar la configuración');
    }
  }

  /**
   * Importar configuración desde JSON
   */
  static importConfiguration(jsonConfig: string): void {
    try {
      const config = JSON.parse(jsonConfig);
      
      // Validar estructura básica
      if (!config.version || !config.profiles) {
        throw new Error('Formato de configuración inválido');
      }

      // Importar perfiles (sin sobrescribir, agregar)
      if (config.profiles && Array.isArray(config.profiles)) {
        const existingProfiles = this.loadProfiles();
        const newProfiles = config.profiles.map((profile: any) => ({
          ...profile,
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(profile.createdAt || new Date()),
          updatedAt: new Date()
        }));

        const allProfiles = [...existingProfiles, ...newProfiles];
        localStorage.setItem(this.STORAGE_KEYS.PROFILES, JSON.stringify(allProfiles));
      }

      // Importar preferencias (fusionar)
      if (config.preferences) {
        this.savePreferences(config.preferences);
      }

      // Importar selección actual (opcional)
      if (config.currentSelection && Array.isArray(config.currentSelection)) {
        this.saveCurrentSelection(config.currentSelection);
      }

    } catch (error) {
      console.error('Error importando configuración:', error);
      throw new Error('No se pudo importar la configuración. Verifica el formato del archivo.');
    }
  }

  // ===== UTILIDADES =====

  /**
   * Limpiar todo el almacenamiento
   */
  static clearAll(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Obtener estadísticas de uso
   */
  static getUsageStats() {
    return {
      profilesCount: this.loadProfiles().length,
      hasCurrentSelection: this.loadCurrentSelection().length > 0,
      storageUsed: this.getStorageSize(),
      lastActivity: this.getLastActivity()
    };
  }

  private static getStorageSize(): string {
    let total = 0;
    Object.values(this.STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) total += item.length;
    });
    return `${(total / 1024).toFixed(2)} KB`;
  }

  private static getLastActivity(): Date | null {
    try {
      const selection = localStorage.getItem(this.STORAGE_KEYS.CURRENT_SELECTION);
      if (selection) {
        const parsed = JSON.parse(selection);
        return new Date(parsed.lastUpdated);
      }
      return null;
    } catch {
      return null;
    }
  }
}

export default StorageService;
